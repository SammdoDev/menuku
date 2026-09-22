import Link from "next/link";
import { GlobalInput, SubmitButton } from "../../../components/ui/form-controls";
import { requestOtpAction, verifyEmailOtpAction } from "../actions";
import AuthShell from "../auth-shell";
import AuthToast from "../auth-toast";

type Props = { searchParams: Promise<{ email?: string; mode?: string; error?: string }> };
export default async function VerifyOtpPage({ searchParams }: Props) {
  const { email = "", mode, error } = await searchParams;
  const isRegister = mode === "register";
  return (
    <>
      <AuthToast error={error} />
      <AuthShell
        eyebrow="Verifikasi email"
        title="Masukkan kode OTP"
        intro={
          <>
            Kode 8 digit dikirim ke <b>{email || "email kamu"}</b>. Kode berlaku selama satu jam.
          </>
        }
      >
        <form className="grid gap-4" action={verifyEmailOtpAction}>
          <GlobalInput type="hidden" name="email" value={email} />
          <label className="grid gap-2 text-sm font-bold">
            Kode OTP
            <GlobalInput
              className="text-center text-lg font-black tracking-[.35em]"
              name="token"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{8}"
              maxLength={8}
              placeholder="00000000"
              required
              autoFocus
            />
          </label>
          <SubmitButton pendingLabel="Memverifikasi...">Verifikasi & masuk</SubmitButton>
        </form>
        <form className="mt-4 text-center" action={requestOtpAction}>
          <GlobalInput type="hidden" name="email" value={email} />
          <GlobalInput type="hidden" name="mode" value={isRegister ? "register" : "login"} />
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
