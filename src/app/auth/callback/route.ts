import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasSupabaseEnv } from "../../../lib/supabase/env";

export async function GET(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const requestUrl = new URL(request.url);
  const destination = requestUrl.searchParams.get("type") === "recovery" ? "/update-password" : "/dashboard";
  const response = NextResponse.redirect(new URL(destination, requestUrl.origin));
  const code = requestUrl.searchParams.get("code");

  if (!hasSupabaseEnv() || !url || !key || !code) return NextResponse.redirect(new URL("/login?error=Link+konfirmasi+tidak+valid.", requestUrl.origin));

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookies) => cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
    },
  });
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/login?error=Link+konfirmasi+sudah+tidak+berlaku.", requestUrl.origin));
  return response;
}
