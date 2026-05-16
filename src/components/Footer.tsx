'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Footer() {
  const { userData } = useAuth();

  return (
    <footer className="bg-background-dark text-foreground-dark py-12 border-t border-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-secondary">Gebze Köy Kadınları Platformu</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              Köy kadınlarının emeklerini değerlendirerek, üretimi destekliyor ve dayanışmayı büyütüyoruz.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-accent">Hızlı Bağlantılar</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="/hakkimizda" className="hover:text-secondary transition-colors">Hakkımızda</Link></li>
              <li><Link href="/projeler" className="hover:text-secondary transition-colors">Projelerimiz</Link></li>
              <li><Link href="/urunler" className="hover:text-secondary transition-colors">El Emeği Ürünler</Link></li>
              <li><Link href="/destek-ol" className="hover:text-secondary transition-colors">Gönüllü Ol & Bağış Yap</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-accent">İletişim</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>📍 Gebze, Kocaeli</li>
              <li>✉️ iletisim@gebzekadinlari.org</li>
              <li>📞 +90 (555) 123 45 67</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-secondary/20 flex flex-col md:flex-row justify-between items-center text-sm opacity-60">
          <p>&copy; {new Date().getFullYear()} Gebze Köy Kadınları Platformu. Tüm hakları saklıdır.</p>
          
          {userData?.role === 'admin' && (
            <Link href="/admin" className="mt-4 md:mt-0 hover:text-secondary transition-colors underline underline-offset-4">
              Yönetim Paneli
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
