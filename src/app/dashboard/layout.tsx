import { redirect } from "next/navigation";
import { LoadingProvider } from "@/components/feedback/loading-provider";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getCurrentMerchant } from "@/features/stores/queries/current-merchant";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (hasSupabaseEnv()) {
    const { user, tenant } = await getCurrentMerchant();
    if (!user) redirect("/login");
    if (!tenant) redirect("/onboarding");
  }
  return <LoadingProvider>{children}</LoadingProvider>;
}
