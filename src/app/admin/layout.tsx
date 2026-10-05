import { redirect } from "next/navigation";
import AdminShell from "@/features/admin/components/admin-shell";
import { getAdminContext } from "@/features/admin/queries/admin-context";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminContext();
  if (!admin) redirect("/login");
  return <AdminShell>{children}</AdminShell>;
}
