import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { AdminProductForm } from "../../../../../../shared/components/ProfileComponents/AdminProductForm";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");
  if (session.user.role !== "ADMIN") redirect("/profile");

  return <AdminProductForm />;
}
