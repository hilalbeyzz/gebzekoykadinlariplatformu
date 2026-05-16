import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";

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
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-primary-dark text-white p-6 shadow-xl hidden md:flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-8 tracking-wider">YÖNETİM PANELI</h2>
          <nav className="space-y-4">
            <a href="/admin" className="block py-2 px-4 rounded hover:bg-primary/40 transition-colors">
              Yeni Paylaşım Ekle
            </a>
            <a href="/admin/yonet" className="block py-2 px-4 rounded hover:bg-primary/40 transition-colors">
              Paylaşımları Yönet (Sil/Düzenle)
            </a>
            <a href="/admin/products" className="block py-2 px-4 rounded hover:bg-primary/40 transition-colors">
              Ürünleri Yönet
            </a>
            <a href="/admin/forum" className="block py-2 px-4 rounded hover:bg-primary/40 transition-colors">
              Forum Gönderileri Onayı
            </a>
            <a href="/admin/content" className="block py-2 px-4 rounded hover:bg-primary/40 transition-colors">
              Site İçeriğini Düzenle
            </a>
            <a href="/" className="block py-2 px-4 rounded hover:bg-primary/40 transition-colors mt-8 border border-white/20">
              Siteye Dön
            </a>
          </nav>
        </div>
        <LogoutButton />
      </div>
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
