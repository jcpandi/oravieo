"use server";

import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { SERVICE_KEYS, TIME_WINDOWS } from "@/lib/site-data";

const DAY_MS = 24 * 60 * 60 * 1000;

const appointmentSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name (at least two characters).").max(100, "Name is too long."),
  email: z.string().trim().max(254, "Email is too long.").pipe(z.email("Enter a valid email address.")),
  treatment: z.enum(SERVICE_KEYS, "Choose a treatment."),
  date: z.iso
    .date("Choose a preferred day.")
    .refine((value) => {
      const day = new Date(`${value}T12:00:00Z`);
      const weekday = day.getUTCDay();
      // The form offers the next 10 weekdays; allow a day of slack either side for time zones.
      const offset = (day.getTime() - Date.now()) / DAY_MS;
      return weekday !== 0 && weekday !== 6 && offset > -1.5 && offset < 21;
    }, "Choose one of the offered days."),
  time: z.enum(TIME_WINDOWS, "Choose a time window."),
  /** Honeypot: hidden from people, often filled in by bots. */
  company: z.string().max(200).optional(),
});

export type AppointmentInput = z.input<typeof appointmentSchema>;

export type AppointmentResult =
  | { ok: true; reference: string }
  | { ok: false; message: string; fieldErrors?: Partial<Record<keyof AppointmentInput, string>> };

export async function requestAppointment(input: AppointmentInput): Promise<AppointmentResult> {
  const parsed = appointmentSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof AppointmentInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof AppointmentInput;
      fieldErrors[field] ??= issue.message;
    }
    return { ok: false, message: "Please check the highlighted details.", fieldErrors };
  }

  const { company, ...data } = parsed.data;
  // Quietly accept bot submissions without storing them.
  if (company) return { ok: true, reference: "RECEIVED" };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("[appointments] SUPABASE_URL and SUPABASE_SECRET_KEY are not set.");
    return { ok: false, message: "Online booking is temporarily unavailable. Please try again later." };
  }

  const { data: row, error } = await supabase
    .from("appointment_requests")
    .insert({
      full_name: data.name,
      email: data.email.toLowerCase(),
      treatment: data.treatment,
      preferred_date: data.date,
      time_window: data.time,
    })
    .select("id")
    .single();

  if (error || !row) {
    console.error("[appointments] Insert failed:", error?.message);
    return { ok: false, message: "We couldn’t send your request. Please try again in a moment." };
  }

  return { ok: true, reference: String(row.id).slice(0, 8).toUpperCase() };
}
