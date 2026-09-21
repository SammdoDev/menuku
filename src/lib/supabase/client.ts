import { createBrowserClient } from "@supabase/ssr";
import { hasSupabaseEnv } from "./env";

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!hasSupabaseEnv() || !url || !key) throw new Error("Kredensial Supabase belum diatur dengan benar.");
  return createBrowserClient(url, key);
}
