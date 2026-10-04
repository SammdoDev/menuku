import { redirect } from "next/navigation";
import { GlobalLoadingProvider } from "../../components/global-loading";
import { hasSupabaseEnv } from "../../lib/supabase/env";
import { getCurrentMerchant } from "../../lib/merchant";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (hasSupabaseEnv()) {
    const { user, tenant } = await getCurrentMerchant();
    if (!user) redirect("/login");
    if (!tenant) redirect("/onboarding");
  }
  return <GlobalLoadingProvider>{children}</GlobalLoadingProvider>;
}
