import Link from "next/link";
import { Input } from "@/components/ui/text-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { requestOtpAction, verifyEmailOtpAction } from "@/features/auth/actions/auth-actions";
import AuthShell from "@/features/auth/components/auth-shell";
import AuthToast from "@/features/auth/components/auth-toast";

type Props = {
  searchParams: Promise<{ email?: string; mode?: string; type?: string; error?: string }>;
};
export default async function VerifyOtpPage({ searchParams }: Props) {
  const { email = "", mode, type, error } = await searchParams;
  const isRegister = mode === "register";
  const otpType = type === "signup" ? "signup" : "email";
  return (
    <>
      <AuthToast error={error} />
      <AuthShell
        eyebrow="Verifikasi email"
        title="Masukkan kode OTP"
        intro={
          <>
            Kode OTP dikirim ke <b>{email || "email kamu"}</b>. Kode berlaku selama satu jam.
          </>
        }
      >
        <form className="grid gap-4" action={verifyEmailOtpAction}>
          <Input type="hidden" name="email" value={email} />
          <Input type="hidden" name="mode" value={isRegister ? "register" : "login"} />
          <Input type="hidden" name="otpType" value={otpType} />
          <label className="grid gap-2 text-sm font-bold">
            Kode OTP
            <Input
              className="text-center text-lg font-black tracking-[.35em]"
              name="token"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6,8}"
              minLength={6}
              maxLength={8}
              placeholder="000000"
              required
              autoFocus
            />
          </label>
          <SubmitButton pendingLabel="Memverifikasi...">Verifikasi & masuk</SubmitButton>
        </form>
        <form className="mt-4 text-center" action={requestOtpAction}>
          <Input type="hidden" name="email" value={email} />
          <Input type="hidden" name="mode" value={isRegister ? "register" : "login"} />
          <button className="text-brand text-xs font-extrabold">Kirim ulang kode</button>
        </form>
        <Link
          className="text-muted mt-4 block text-center text-xs font-bold"
          href={isRegister ? "/register" : "/login"}
        >
          Gunakan email lain
        </Link>
      </AuthShell>
    </>
  );
}
