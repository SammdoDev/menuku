import Link from "next/link";
import { Input } from "@/components/ui/text-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { requestOtpAction } from "@/features/auth/actions/auth-actions";
import AuthShell from "@/features/auth/components/auth-shell";
import AuthToast from "@/features/auth/components/auth-toast";

type Props = { searchParams: Promise<{ error?: string; plan?: string }> };
export default async function RegisterPage({ searchParams }: Props) {
  const { error, plan: requestedPlan } = await searchParams;
  const plan = requestedPlan === "premium" || requestedPlan === "business" ? requestedPlan : "free";
  const label = plan === "free" ? "Free" : plan === "premium" ? "Premium" : "Business";
  return (
    <>
      <AuthToast error={error} />
      <AuthShell
        eyebrow={`Paket ${label}`}
        title="Buat halaman bisnismu"
        intro="Daftar dengan email, lalu verifikasi memakai kode OTP 8 digit."
        footer={
          <>
            Sudah punya akun?{" "}
            <Link className="text-brand font-extrabold" href="/login">
              Masuk
            </Link>
          </>
        }
      >
        <form className="grid gap-4" action={requestOtpAction}>
          <Input type="hidden" name="mode" value="register" />
          <Input type="hidden" name="plan" value={plan} />
          <label className="grid gap-2 text-sm font-bold">
            Nama
            <Input name="name" autoComplete="name" placeholder="Nama kamu" required minLength={2} />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Email
            <Input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nama@bisnis.com"
              required
            />
          </label>
          <SubmitButton pendingLabel="Membuat akun...">Kirim kode OTP</SubmitButton>
        </form>
      </AuthShell>
    </>
  );
}
