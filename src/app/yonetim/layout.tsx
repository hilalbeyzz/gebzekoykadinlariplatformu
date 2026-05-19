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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <div className="md:w-64 w-full bg-primary-dark text-white p-6 shadow-xl flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4 md:mb-8 tracking-wider">YÖNETİM PANELI</h2>
          <nav className="space-y-2 md:space-y-4 grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-0">
            <a href="/yonetim" className="block py-2 px-3 md:px-4 rounded bg-primary/20 md:bg-transparent text-sm md:text-base hover:bg-primary/40 transition-colors">
              Yeni Paylaşım
            </a>
            <a href="/yonetim/yonet" className="block py-2 px-3 md:px-4 rounded bg-primary/20 md:bg-transparent text-sm md:text-base hover:bg-primary/40 transition-colors">
              Paylaşımları Yönet
            </a>
            <a href="/yonetim/products" className="block py-2 px-3 md:px-4 rounded bg-primary/20 md:bg-transparent text-sm md:text-base hover:bg-primary/40 transition-colors">
              Ürünleri Yönet
            </a>
            <a href="/yonetim/forum" className="block py-2 px-3 md:px-4 rounded bg-primary/20 md:bg-transparent text-sm md:text-base hover:bg-primary/40 transition-colors">
              Forum Onayı
            </a>
            <a href="/yonetim/content" className="block py-2 px-3 md:px-4 rounded bg-primary/20 md:bg-transparent text-sm md:text-base hover:bg-primary/40 transition-colors col-span-2 md:col-span-1">
              Site İçeriğini Düzenle
            </a>
            <a href="/" className="block py-2 px-3 md:px-4 rounded hover:bg-primary/40 transition-colors md:mt-8 border border-white/20 col-span-2 md:col-span-1 text-center md:text-left">
              Siteye Dön
            </a>
          </nav>
        </div>
        <div className="mt-6 md:mt-0">
          <LogoutButton />
        </div>
      </div>
      <div className="flex-1 p-4 md:p-12 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
