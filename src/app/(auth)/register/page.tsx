import Link from "next/link";
import { GlobalInput, SubmitButton } from "../../../components/ui/form-controls";
import { requestOtpAction } from "../actions";
import AuthShell from "../auth-shell";
import AuthToast from "../auth-toast";

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
          <GlobalInput type="hidden" name="mode" value="register" />
          <GlobalInput type="hidden" name="plan" value={plan} />
          <label className="grid gap-2 text-sm font-bold">
            Nama
            <GlobalInput
              name="name"
              autoComplete="name"
              placeholder="Nama kamu"
              required
              minLength={2}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Email
            <GlobalInput
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
