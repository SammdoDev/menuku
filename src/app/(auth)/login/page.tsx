import Link from "next/link";
import { GlobalInput, SubmitButton } from "../../../components/ui/form-controls";
import { requestOtpAction } from "../actions";
import AuthShell from "../auth-shell";
import AuthToast from "../auth-toast";

type Props = { searchParams: Promise<{ error?: string; message?: string }> };
export default async function LoginPage({ searchParams }: Props) {
  const { error, message } = await searchParams;
  return (
    <>
      <AuthToast error={error} message={message} />
      <AuthShell
        eyebrow="Selamat datang kembali"
        title="Masuk dengan kode OTP"
        intro="Masukkan email bisnis. Kami kirim kode 8 digit untuk masuk dengan aman."
        footer={
          <>
            Belum punya akun?{" "}
            <Link className="text-brand font-extrabold" href="/register">
              Daftar gratis
            </Link>
          </>
        }
      >
        <form className="grid gap-4" action={requestOtpAction}>
          <GlobalInput type="hidden" name="mode" value="login" />
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
          <SubmitButton pendingLabel="Mengirim kode...">Kirim kode OTP</SubmitButton>
        </form>
      </AuthShell>
    </>
  );
}
