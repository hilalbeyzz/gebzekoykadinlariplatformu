import { Metadata } from "next";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Yönetim Paneli | Gebze Köy Kadınları Kültür Platformu",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-primary-dark text-white p-6 shadow-xl hidden md:block">
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
          <a href="/admin/users" className="block py-2 px-4 rounded hover:bg-primary/40 transition-colors">
            Üyeleri Yönet (Onayla/Engelle)
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
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        {children}
      </div>
    </ProtectedRoute>
  );
}
