import { GlobalInput, SubmitButton } from "../../../components/ui/form-controls";
import { resetPasswordAction } from "../actions";
import AuthShell from "../auth-shell";
import AuthToast from "../auth-toast";

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
            <GlobalInput
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
