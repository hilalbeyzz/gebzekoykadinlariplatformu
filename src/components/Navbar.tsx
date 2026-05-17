'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
export default function Navbar() {
  const [siteContent, setSiteContent] = useState({
    logoUrl: "/logo.png",
    siteName: "Gebze Köy Kadınları Kültür Platformu"
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            {/* Boş bırakıldı, admin girişi gizli URL'den yapılıyor */}
          </div>
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground-dark hover:text-secondary focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary-dark border-t border-secondary/25 shadow-lg absolute w-full pb-4 z-40">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            <Link 
              href="/" 
              className="block px-3 py-2 text-base font-medium text-foreground-dark hover:text-secondary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/hakkimizda" 
              className="block px-3 py-2 text-base font-medium text-foreground-dark hover:text-secondary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Hakkımızda
            </Link>
            <Link 
              href="/paylasimlar" 
              className="block px-3 py-2 text-base font-medium text-foreground-dark hover:text-secondary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Paylaşımlar
            </Link>
            <Link 
              href="/projeler" 
              className="block px-3 py-2 text-base font-medium text-foreground-dark hover:text-secondary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projeler
            </Link>
            <Link 
              href="/urunler" 
              className="block px-3 py-2 text-base font-medium text-foreground-dark hover:text-secondary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ürünler
            </Link>
            <Link 
              href="/forum" 
              className="block px-3 py-2 text-base font-medium text-foreground-dark hover:text-secondary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Forum
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
