# Oravieo v2 — Next.js + Tailwind CSS + GSAP + Supabase

The Next.js port of the standalone `oravieo-html` page. The layout, copy, 3D molar and
animations match the original. The booking form now saves requests to Supabase.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack), React 19
- **Tailwind CSS v4**: theme and custom styles in `src/app/globals.css`
- **GSAP 3** + ScrollTrigger through `@gsap/react` (`useGSAP`, `gsap.matchMedia`)
- **three.js**: procedural molar, loaded on demand on the client (`src/lib/molar.ts`)
- **Supabase**: `appointment_requests` table, written from a server action

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in the two Supabase values
npm run dev                  # http://localhost:3000
```

Without Supabase settings the site still runs. The form then shows
"Online booking is temporarily unavailable" and logs the reason on the server.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/20261115000000_appointment_requests.sql`, either in the
   SQL editor or with `supabase db push`.
3. In `.env.local`, set:
   - `SUPABASE_URL`: the project URL
   - `SUPABASE_SECRET_KEY`: a secret key (`sb_secret_…`) or the legacy `service_role` key

How the data is kept private:

- Row Level Security is on and the table has **no policies**. The browser-facing
  `anon`/`authenticated` roles can't read or write it.
- Only the server action (`src/app/actions/appointments.ts`) inserts rows, using the secret key.
  That key lives in `src/lib/supabase/server.ts` behind `server-only`, and has no
  `NEXT_PUBLIC_` prefix, so it never ships to the browser.
- The server checks every field again with zod: name, email, treatment, an offered weekday,
  and a time window. A hidden honeypot field filters out simple bots.
- Requests come in with `status = 'new'`. View them under **Table Editor → appointment_requests**.

There is no rate limiting yet. For production, put one in front of the action (for example
Vercel Firewall or Upstash Ratelimit) and add CAPTCHA if spam shows up.

## Project layout

```
src/app/            layout (font, metadata), page, globals.css, actions/appointments.ts
src/components/     hero, about, services, results, journey, footer, dialogs, motion, scroll telemetry
src/lib/            site-data.ts (copy & figures), molar.ts (three.js scene), supabase/server.ts
supabase/migrations SQL for the appointment_requests table
```

## Notes

- Treatment copy and figures come from the original design and are illustrative.
- `prefers-reduced-motion` turns off the GSAP animations and the molar's idle motion.
- The molar was written for three r128. `molar.ts` turns off colour management, scales the
  light units and recreates r128's additive blending so the current three.js looks the same.
