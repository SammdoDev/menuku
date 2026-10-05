import { Input } from "@/components/ui/text-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { updatePasswordAction } from "@/features/auth/actions/auth-actions";
import AuthShell from "@/features/auth/components/auth-shell";
import AuthToast from "@/features/auth/components/auth-toast";

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
            <Input
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Konfirmasi password
            <Input
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
