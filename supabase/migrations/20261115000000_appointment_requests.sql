-- Appointment requests submitted from the Oravieo booking form.
-- Run this in the Supabase SQL editor, or with `supabase db push` if you use the Supabase CLI.

create table if not exists public.appointment_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254),
  treatment text not null check (treatment in ('restorative', 'cosmetic', 'implants')),
  preferred_date date not null,
  time_window text not null check (time_window in ('09:00 AM', '10:30 AM', '02:00 PM', '04:15 PM')),
  status text not null default 'new' check (status in ('new', 'contacted', 'scheduled', 'cancelled'))
);

comment on table public.appointment_requests is
  'Requests from the website booking form. Inserted server-side by the Next.js app with the secret key.';

create index if not exists appointment_requests_created_at_idx
  on public.appointment_requests (created_at desc);

-- Row Level Security on, with no policies: the public (anon) and signed-in (authenticated)
-- API roles can neither read nor write this table. The Next.js server action inserts rows
-- using the secret / service_role key, which bypasses RLS and never reaches the browser.
alter table public.appointment_requests enable row level security;
revoke all on table public.appointment_requests from anon, authenticated;
