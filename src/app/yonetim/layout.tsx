import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export const metadata: Metadata = {
  title: "Yönetim Paneli | Gebze Köy Kadınları Kültür Platformu",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session");

  if (!isAdmin) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-12 overflow-y-auto w-full">
        {children}
      </div>
    </div>
  );
}
