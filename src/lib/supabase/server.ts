import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Server-only Supabase client using the project's secret key (or legacy service_role key).
 * The key bypasses Row Level Security, so it must never reach the browser: this module is
 * guarded by `server-only` and the variables have no NEXT_PUBLIC_ prefix.
 * Returns null when the environment is not configured.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}
