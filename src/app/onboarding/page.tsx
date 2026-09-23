import { redirect } from "next/navigation";
import { CheckCircle2, Store } from "lucide-react";
import Brand from "../../components/brand";
import { getCurrentMerchant } from "../../lib/merchant";
import OnboardingForm from "./onboarding-form";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { user, tenant } = await getCurrentMerchant();
  if (!user) redirect("/login");
  if (tenant) redirect("/dashboard");
  return (
    <main className="min-h-dvh bg-[#f7f6f2] bg-[image:radial-gradient(circle_at_8%_10%,#ffe2d7_0,transparent_25%),radial-gradient(circle_at_92%_85%,#e3eee9_0,transparent_25%)] p-0 md:grid md:place-items-center md:p-8">
      <section className="md:border-line grid min-h-dvh w-full max-w-6xl overflow-hidden bg-white shadow-2xl md:min-h-[720px] md:grid-cols-[.85fr_1.15fr] md:rounded-[28px] md:border">
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#2a2722] to-[#191714] p-10 text-white md:flex md:flex-col">
          <Brand inverse />
          <div className="my-auto">
            <p className="mb-3 text-xs font-black tracking-[.12em] text-[#ff9c79]">
              LANGKAH 1 DARI 3
            </p>
            <h1 className="display-font max-w-sm text-4xl leading-tight font-black">
              Wajah pertama bisnismu dimulai di sini.
            </h1>
            <ul className="mt-9 grid gap-5 text-sm text-white/60">
              <li className="flex items-center gap-3 font-extrabold text-white">
                <CheckCircle2 className="text-brand" />
                Identitas visual
              </li>
              <li>Profil dan alamat halaman</li>
              <li>Menu pertama dan publikasi</li>
            </ul>
          </div>
          <p className="flex items-center gap-2 text-xs text-white/60">
            <Store size={17} />
            Siap dibagikan dalam beberapa menit.
          </p>
        </aside>
        <article className="p-5 sm:p-8 lg:p-14">
          <div className="mb-8 md:hidden">
            <Brand />
          </div>
          <p className="text-brand mb-2 text-[11px] font-black tracking-[.12em]">BUAT MERCHANT</p>
          <h2 className="display-font text-3xl font-black">Profil dan tampilan awal</h2>
          <p className="text-muted mt-2 mb-7 max-w-xl text-sm leading-6">
            Tambahkan foto profil serta background dahulu, seperti menyiapkan halaman bisnis
            profesional.
          </p>
          {error && (
            <div
              className="mb-5 rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}
          <OnboardingForm />
        </article>
      </section>
    </main>
  );
}
