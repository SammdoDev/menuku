import DashboardShell from "../../../components/dashboard-shell";
import AuthToast from "../../(auth)/auth-toast";
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
      <AuthToast error={notice.error} message={notice.success} />
      <SettingsForm tenant={tenant} siteOrigin={siteOrigin} />
    </DashboardShell>
  );
}
