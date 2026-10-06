import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminShell from "@/features/admin/components/admin-shell";
import { getAdminContext } from "@/features/admin/queries/admin-context";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminContext();
  if (!admin) redirect("/login");
  return <AdminShell>{children}</AdminShell>;
}
