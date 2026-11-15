"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { requestAppointment, type AppointmentInput } from "@/app/actions/appointments";
import {
  DEFAULT_TIME_WINDOW,
  SERVICE_KEYS,
  TIME_WINDOWS,
  TREATMENT_NAMES,
  upcomingWeekdays,
  type ServiceKey,
  type TimeWindow,
} from "@/lib/site-data";
import { Modal } from "./modal";
import { useSite } from "./site-provider";

type FieldErrors = Partial<Record<keyof AppointmentInput, string>>;

interface Submitted {
  name: string;
  email: string;
  treatment: ServiceKey;
  dateLabel: string;
  time: TimeWindow;
  reference: string;
}

const labelClass = "block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5";
const fieldClass = "w-full rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-hidden focus:border-[#0d2e4c]";

export function BookingDialog() {
  const { dialog, closeDialog, service, announce } = useSite();
  const open = dialog?.kind === "booking";

  const [days, setDays] = useState<{ value: string; label: string }[]>([]);
  const [treatment, setTreatment] = useState<ServiceKey>(service);
  const [date, setDate] = useState("");
  const [time, setTime] = useState<TimeWindow>(DEFAULT_TIME_WINDOW);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState<Submitted | null>(null);
  const [pending, startTransition] = useTransition();
  const nameRef = useRef<HTMLInputElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  // Opening starts a fresh form with the selected treatment and upcoming weekdays;
  // closing clears everything, so details stay in memory only while the dialog is open.
  const [wasOpen, setWasOpen] = useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    {
      const nextDays = open ? upcomingWeekdays() : [];
      setDays(nextDays);
      setDate(nextDays[0]?.value ?? "");
      setTreatment(service);
      setTime(DEFAULT_TIME_WINDOW);
      setName("");
      setEmail("");
      setCompany("");
      setErrors({});
      setFormError("");
      setSubmitted(null);
    }
  }

  useEffect(() => {
    if (submitted) successHeadingRef.current?.focus();
  }, [submitted]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nameInput = nameRef.current!;
    if (name.trim().length < 2) {
      nameInput.setCustomValidity("Enter your full name (at least two characters).");
      nameInput.reportValidity();
      return;
    }
    if (!event.currentTarget.reportValidity()) return;

    setErrors({});
    setFormError("");
    const input: AppointmentInput = { name, email, treatment, date, time, company };
    startTransition(async () => {
      try {
        const result = await requestAppointment(input);
        if (result.ok) {
          setSubmitted({
            name: name.trim(),
            email: email.trim(),
            treatment,
            dateLabel: days.find((d) => d.value === date)?.label ?? date,
            time,
            reference: result.reference,
          });
          setName("");
          setEmail("");
          announce("Appointment request sent");
        } else {
          setErrors(result.fieldErrors ?? {});
          setFormError(result.message);
        }
      } catch {
        setFormError("We couldn’t reach the server. Check your connection and try again.");
      }
    });
  };

  const errorId = (field: keyof AppointmentInput) => (errors[field] ? `booking-${field}-error` : undefined);
  const fieldError = (field: keyof AppointmentInput) =>
    errors[field] ? (
      <p id={`booking-${field}-error`} className="mt-1 text-xs text-red-700">
        {errors[field]}
      </p>
    ) : null;

  return (
    <Modal
      id="booking-dialog"
      open={open}
      onClose={() => closeDialog("booking")}
      labelledBy={submitted ? "booking-success-title" : "booking-title"}
      describedBy={submitted ? "booking-summary" : "booking-note"}
    >
      <div className="modal-card booking-card bg-white rounded-3xl p-7 sm:p-9 shadow-2xl border border-slate-100">
        <button
          aria-label="Close booking form"
          type="button"
          onClick={() => closeDialog()}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <form id="booking-form" hidden={!!submitted} onSubmit={onSubmit}>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#285b85]">ORAVIEO PRIVATE CONCIERGE</span>
          <h3 id="booking-title" className="text-2xl font-semibold text-[#0d2e4c] mt-1 mb-6 modal-title">
            Book Your 3D Smile Consultation
          </h3>
          <p className="form-notice" id="booking-note">
            Send a request and our concierge team will contact you to confirm a time. Your details are stored securely
            and used only to arrange your visit.
          </p>
          <div className="space-y-4">
            <div>
              <span id="treatment-label" className={labelClass}>
                Treatment Focus
              </span>
              <div role="group" aria-labelledby="treatment-label" className="grid grid-cols-3 gap-2">
                {SERVICE_KEYS.map((key) => (
                  <button
                    key={key}
                    aria-pressed={treatment === key}
                    type="button"
                    className="treatment-button"
                    onClick={() => setTreatment(key)}
                  >
                    {TREATMENT_NAMES[key]}
                  </button>
                ))}
              </div>
              {fieldError("treatment")}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="booking-date" className={labelClass}>
                  Preferred Day
                </label>
                <select
                  id="booking-date"
                  name="date"
                  required
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  aria-invalid={!!errors.date}
                  aria-describedby={errorId("date")}
                  className={`${fieldClass} px-3.5 py-2.5`}
                >
                  {days.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
                {fieldError("date")}
              </div>
              <div>
                <label htmlFor="booking-time" className={labelClass}>
                  Time Window
                </label>
                <select
                  id="booking-time"
                  name="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value as TimeWindow)}
                  aria-invalid={!!errors.time}
                  aria-describedby={errorId("time")}
                  className={`${fieldClass} px-3.5 py-2.5`}
                >
                  {TIME_WINDOWS.map((window) => (
                    <option key={window}>{window}</option>
                  ))}
                </select>
                {fieldError("time")}
              </div>
            </div>
            <div>
              <label htmlFor="patient-name" className={labelClass}>
                Full Name
              </label>
              <input
                ref={nameRef}
                id="patient-name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={100}
                required
                placeholder="Your full name"
                value={name}
                onChange={(event) => {
                  event.target.setCustomValidity("");
                  setName(event.target.value);
                }}
                aria-invalid={!!errors.name}
                aria-describedby={errorId("name")}
                className={`${fieldClass} px-4 py-2.5`}
              />
              {fieldError("name")}
            </div>
            <div>
              <label htmlFor="patient-email" className={labelClass}>
                Email address
              </label>
              <input
                id="patient-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errorId("email")}
                className={`${fieldClass} px-4 py-2.5`}
              />
              {fieldError("email")}
            </div>
            {/* Honeypot for bots: hidden from sighted users and assistive technology. */}
            <div aria-hidden="true" className="absolute -left-[10000px] w-px h-px overflow-hidden">
              <label htmlFor="booking-company">Company</label>
              <input
                id="booking-company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
              />
            </div>
          </div>
          {formError && (
            <p className="form-error" role="alert">
              {formError}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="mt-6 w-full py-3.5 rounded-full bg-[#0d2e4c] hover:bg-[#16446b] text-white font-medium text-sm shadow-lg transition-all"
          >
            {pending ? "Sending request…" : "Request Appointment"}
          </button>
        </form>

        {submitted && (
          <section className="text-center py-8" aria-live="polite">
            <div className="success-symbol" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m5 12 4 4L19 6" />
              </svg>
            </div>
            <h3 ref={successHeadingRef} id="booking-success-title" tabIndex={-1} className="text-2xl font-semibold text-[#0d2e4c] mb-3">
              Your request has been sent
            </h3>
            <p id="booking-summary" className="text-sm text-slate-600 leading-relaxed mb-4">
              {submitted.name}, you asked for {submitted.dateLabel} at {submitted.time} for{" "}
              {TREATMENT_NAMES[submitted.treatment]}. We’ll reply to {submitted.email}.
            </p>
            <p className="form-notice">
              This is a request, not a confirmed appointment. Our team will contact you to confirm. Reference:{" "}
              <strong>{submitted.reference}</strong>
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <button type="button" onClick={() => closeDialog()} className="primary-button">
                Done
              </button>
            </div>
          </section>
        )}
      </div>
    </Modal>
  );
}
