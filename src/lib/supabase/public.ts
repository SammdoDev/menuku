import "server-only";

import { createClient } from "@supabase/supabase-js";
import { hasSupabaseEnv } from "./env";

export function createSupabasePublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!hasSupabaseEnv() || !url || !key) {
    throw new Error("Supabase public client is not configured.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
