import { CheckCircle2, CircleAlert } from "lucide-react";
import DashboardShell from "../../../components/dashboard-shell";
import { getCurrentMerchant } from "../../../lib/merchant";
import { PUBLIC_SITE_URL } from "../../../lib/site";
import SettingsForm from "./settings-form";

type Props = { searchParams: Promise<{ error?: string; success?: string }> };

export default async function SettingsPage({ searchParams }: Props) {
  const [{ tenant }, notice] = await Promise.all([getCurrentMerchant(), searchParams]);
  if (!tenant) return null;
  const siteOrigin = PUBLIC_SITE_URL;
  return (
    <DashboardShell tenant={tenant} active="settings" title="Settings">
      <header className="mb-7">
        <h1 className="display-font text-3xl font-black">Settings halaman</h1>
        <p className="text-muted mt-2 text-sm">
          Kelola profil, URL, informasi bisnis, dan tampilan halaman publik.
        </p>
      </header>
      {notice.error && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <CircleAlert size={18} className="mt-0.5 shrink-0" />
          {notice.error}
        </div>
      )}
      {notice.success && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          {notice.success}
        </div>
      )}
      <SettingsForm tenant={tenant} siteOrigin={siteOrigin} />
    </DashboardShell>
  );
}
