import { GlobalInput, SubmitButton } from "../../../components/ui/form-controls";
import { updatePasswordAction } from "../actions";
import AuthShell from "../auth-shell";
import AuthToast from "../auth-toast";

type Props = { searchParams: Promise<{ error?: string }> };
export default async function UpdatePasswordPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return (
    <>
      <AuthToast error={error} />
      <AuthShell
        eyebrow="Password baru"
        title="Atur password baru"
        intro="Buat password baru minimal 8 karakter untuk akunmu."
      >
        <form className="grid gap-4" action={updatePasswordAction}>
          <label className="grid gap-2 text-sm font-bold">
            Password baru
            <GlobalInput
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Konfirmasi password
            <GlobalInput
              name="confirmation"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </label>
          <SubmitButton pendingLabel="Menyimpan password...">Simpan password</SubmitButton>
        </form>
      </AuthShell>
    </>
  );
}
