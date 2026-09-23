import { redirect } from "next/navigation";
import AdminShell from "../../components/admin-shell";
import { getAdminContext } from "../../lib/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminContext();
  if (!admin) redirect("/login");
  return <AdminShell>{children}</AdminShell>;
}
