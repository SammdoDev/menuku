import { Input } from "@/components/ui/text-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { resetPasswordAction } from "@/features/auth/actions/auth-actions";
import AuthShell from "@/features/auth/components/auth-shell";
import AuthToast from "@/features/auth/components/auth-toast";

type Props = { searchParams: Promise<{ error?: string; message?: string }> };
export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { error, message } = await searchParams;
  return (
    <>
      <AuthToast error={error} message={message} />
      <AuthShell
        eyebrow="Reset password"
        title="Lupa password?"
        intro="Masukkan email akunmu. Kami akan mengirimkan link untuk membuat password baru."
      >
        <form className="grid gap-4" action={resetPasswordAction}>
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
          <SubmitButton pendingLabel="Mengirim link...">Kirim link reset</SubmitButton>
        </form>
      </AuthShell>
    </>
  );
}
