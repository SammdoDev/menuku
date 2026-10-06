import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/i18n/config";

export async function middleware(request: NextRequest) {
  const requestedLocale = request.nextUrl.searchParams.get("setLocale");
  const selectedLocale = SUPPORTED_LOCALES.find((locale) => locale === requestedLocale);

  if (selectedLocale) {
    const localizedUrl = request.nextUrl.clone();
    localizedUrl.searchParams.delete("setLocale");
    localizedUrl.pathname = selectedLocale === DEFAULT_LOCALE ? "/" : `/${selectedLocale}`;

    const response = NextResponse.redirect(localizedUrl);
    response.cookies.set("menuku-language-v2", selectedLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
    });
    return response;
  }

  const savedLocale = request.cookies.get("menuku-language-v2")?.value;
  const locale = SUPPORTED_LOCALES.find((supportedLocale) => supportedLocale === savedLocale);

  if (request.nextUrl.pathname === "/" && locale && locale !== DEFAULT_LOCALE) {
    const localizedUrl = request.nextUrl.clone();
    localizedUrl.pathname = `/${locale}`;
    return NextResponse.redirect(localizedUrl);
  }

  const isMarketingPage =
    request.nextUrl.pathname === "/" ||
    SUPPORTED_LOCALES.some(
      (supportedLocale) =>
        supportedLocale !== DEFAULT_LOCALE &&
        request.nextUrl.pathname === `/${supportedLocale}`,
    );
  if (isMarketingPage) return NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!hasSupabaseEnv() || !url || !key) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
