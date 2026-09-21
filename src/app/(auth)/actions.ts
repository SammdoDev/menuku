"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createSupabaseServerClient } from "../../lib/supabase/server";

const credentials = z.object({
  email: z.string().trim().email("Masukkan alamat email yang valid."),
  password: z.string().min(8, "Password minimal 8 karakter."),
});
const emailOnly = z.string().trim().email("Masukkan alamat email yang valid.");

const back = (path: string, key: "error" | "message", value: string): never => redirect(`${path}?${key}=${encodeURIComponent(value)}`);
const applicationOrigin = async () => (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function loginAction(formData: FormData) {
  const parsed = credentials.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) { back("/login", "error", parsed.error.issues[0].message); }
  const data = parsed.data!;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("email not confirmed")) back("/login", "error", "Email belum dikonfirmasi. Buka link yang dikirim Supabase ke inbox atau spam.");
    back("/login", "error", "Email atau password belum benar.");
  }
  redirect("/dashboard");
}

export async function requestOtpAction(formData: FormData) {
  const email = emailOnly.safeParse(formData.get("email"));
  const mode = formData.get("mode") === "register" ? "register" : "login";
  const plan = formData.get("plan") === "premium" || formData.get("plan") === "business" ? formData.get("plan") : "free";
  const name = z.string().trim().min(2, "Nama minimal 2 karakter.").max(120).safeParse(formData.get("name"));
  const path = mode === "register" ? "/register" : "/login";
  if (!email.success) back(path, "error", email.error.issues[0].message);
  if (mode === "register" && !name.success) back(path, "error", name.error.issues[0].message);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({ email: email.data!, options: { shouldCreateUser: mode === "register", data: mode === "register" ? { name: name.data, selected_plan: plan } : undefined } });
  if (error) {
    console.error("[auth] OTP request failed", { mode, code: error.code, message: error.message });
    const message = error.message.toLowerCase();
    if (message.includes("rate limit") || message.includes("security purposes")) back(path, "error", "Terlalu banyak permintaan kode. Tunggu sekitar satu menit lalu coba lagi.");
    if (message.includes("user not found") || message.includes("not found")) back(path, "error", "Akun belum terdaftar. Buat akun terlebih dahulu.");
    if (message.includes("not allowed") || message.includes("signup")) back(path, "error", "Akun belum terdaftar. Buat akun terlebih dahulu.");
    back(path, "error", "Kode OTP belum dapat dikirim. Coba lagi dalam satu menit.");
  }
  redirect(`/verify-otp?email=${encodeURIComponent(email.data!)}&mode=${mode}`);
}

export async function verifyEmailOtpAction(formData: FormData) {
  const email = emailOnly.safeParse(formData.get("email"));
  const token = z.string().trim().regex(/^\d{6}$/, "Masukkan 6 digit kode OTP.").safeParse(formData.get("token"));
  if (!email.success || !token.success) back(`/verify-otp?email=${encodeURIComponent(String(formData.get("email") ?? ""))}`, "error", token.success ? "Email tidak valid." : token.error.issues[0].message);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({ email: email.data!, token: token.data!, type: "email" });
  if (error) {
    console.error("[auth] OTP verification failed", { code: error.code, message: error.message });
    back(`/verify-otp?email=${encodeURIComponent(email.data!)}`, "error", "Kode OTP salah atau sudah kedaluwarsa. Minta kode baru.");
  }
  redirect("/dashboard");
}

export async function registerAction(formData: FormData) {
  const parsed = credentials.extend({ name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(120), plan: z.enum(["free", "premium", "business"]).default("free") }).safeParse({ email: formData.get("email"), password: formData.get("password"), name: formData.get("name"), plan: formData.get("plan") || "free" });
  if (!parsed.success) { back("/register", "error", parsed.error.issues[0].message); }
  const data = parsed.data!;
  const supabase = await createSupabaseServerClient();
  const origin = await applicationOrigin();
  const { error } = await supabase.auth.signUp({ email: data.email, password: data.password, options: { data: { name: data.name, selected_plan: data.plan }, emailRedirectTo: `${origin}/auth/callback` } });
  if (error) back("/register", "error", error.message);
  back("/login", "message", "Akun berhasil dibuat. Cek email untuk mengonfirmasi akunmu.");
}

export async function resetPasswordAction(formData: FormData) {
  const email = z.string().trim().email("Masukkan alamat email yang valid.").safeParse(formData.get("email"));
  if (!email.success) { back("/forgot-password", "error", email.error.issues[0].message); }
  const value = email.data!;
  const supabase = await createSupabaseServerClient();
  const origin = await applicationOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(value, { redirectTo: `${origin}/auth/callback?type=recovery` });
  if (error) back("/forgot-password", "error", error.message);
  back("/forgot-password", "message", "Jika email terdaftar, link reset password telah dikirim.");
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function updatePasswordAction(formData: FormData) {
  const password = z.string().min(8, "Password minimal 8 karakter.").safeParse(formData.get("password"));
  const confirmation = formData.get("confirmation");
  if (!password.success) back("/update-password", "error", password.error.issues[0].message);
  if (password.data !== confirmation) back("/update-password", "error", "Konfirmasi password belum sama.");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: password.data });
  if (error) back("/update-password", "error", error.message);
  back("/login", "message", "Password berhasil diperbarui. Silakan masuk.");
}
