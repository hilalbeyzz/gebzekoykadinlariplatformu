'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Navbar() {
  const { user, userData, loading } = useAuth();
  const [siteContent, setSiteContent] = useState({
    logoUrl: "/logo.png",
    siteName: "Gebze Köy Kadınları Kültür Platformu"
  });

  useEffect(() => {
    async function fetchSiteContent() {
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        const docRef = doc(db, "settings", "siteContent");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setSiteContent({
            logoUrl: data.logoUrl || "/logo.png",
            siteName: data.siteName || "Gebze Köy Kadınları Kültür Platformu"
          });
        }
      } catch (err) {
        console.error("Error fetching site content for navbar:", err);
      }
    }
    fetchSiteContent();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Split site name for styling (roughly in half or by first few words)
  const siteNameParts = siteContent.siteName.split(' ');
  const mainPart = siteNameParts.slice(0, 3).join(' ');
  const subPart = siteNameParts.slice(3).join(' ');

  return (
    <nav className="bg-primary-dark text-foreground-dark sticky top-0 z-50 shadow-sm border-b border-secondary/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-full bg-background-light ring-2 ring-secondary/70 shadow-[0_8px_20px_rgba(0,0,0,0.28)] overflow-hidden flex items-center justify-center">
                <img
                  src={siteContent.logoUrl}
                  alt={siteContent.siteName}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <span className="font-brand-script leading-none text-2xl sm:text-3xl text-background-light drop-shadow-[0_2px_3px_rgba(0,0,0,0.45)]">
                <span className="block">{mainPart}</span>
                {subPart && (
                  <span className="block text-lg sm:text-xl text-secondary drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
                    {subPart}
                  </span>
                )}
              </span>
            </Link>
          </div>
          <div className="hidden md:flex gap-5 lg:gap-7 items-center text-sm lg:text-base">
            <Link href="/" className="hover:text-secondary transition-colors">Ana Sayfa</Link>
            <Link href="/hakkimizda" className="hover:text-secondary transition-colors">Hakkımızda</Link>
            <Link href="/paylasimlar" className="hover:text-secondary transition-colors">Paylaşımlar</Link>
            <Link href="/projeler" className="hover:text-secondary transition-colors">Projeler</Link>
            <Link href="/urunler" className="hover:text-secondary transition-colors">Ürünler</Link>

            {/* Forum Link - Visible to everyone, but writing requires login */}
            <Link href="/forum" className="hover:text-secondary transition-colors font-medium">Forum</Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-6">
                    {userData?.role === 'admin' && (
                      <Link 
                        href="/admin" 
                        className="text-secondary font-bold hover:text-accent transition-colors flex items-center gap-2 border-r border-secondary/30 pr-4"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Yönetim Paneli
                      </Link>
                    )}
                    <span className="text-sm font-medium">Merhaba, {userData?.displayName || 'Kullanıcı'}</span>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500/10 text-white border border-red-400/30 px-4 py-2 rounded-full font-semibold hover:bg-red-500 hover:text-white transition-all text-sm"
                    >
                      Çıkış
                    </button>
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="text-white hover:text-secondary font-medium transition-colors">
                      Giriş Yap
                    </Link>
                    <Link href="/register" className="bg-accent text-background-light px-6 py-2 rounded-full font-semibold hover:bg-accent-dark transition-colors">
                      Kayıt Ol
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
          <div className="md:hidden flex items-center">
            {/* Mobile menu button placeholder */}
            <button className="text-foreground-dark hover:text-secondary focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
