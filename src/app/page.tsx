"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LatestShares from "@/components/LatestShares";
import FeaturedProjects from "@/components/FeaturedProjects";

const DEFAULT_CONTENT = {
  heroTitle: "Emeği Büyüten Dayanışma",
  heroDescription: "Köy kadınlarının geleneksel üretim gücünü modern dünyayla buluşturarak, sürdürülebilir bir gelecek inşa ediyoruz. Toplumun temel taşı olan kadınları destekliyor ve üretiyoruz.",
  heroSupportBtn: "Bize Destek Olun",
  heroProjectsBtn: "Projelerimizi İncele",
  productSectionTitle: "Kadınların ürettiği ürünler WhatsApp üzerinden satışta",
  productSectionDesc: "Ev yapımı gıda ürünleri ve el emeği çalışmalar için ürün sayfasına göz atabilir, siparişinizi doğrudan WhatsApp iletişim hattından iletebilirsiniz.",
  ctaTitle: "Siz de Ailemize Katılın",
  ctaDescription: "Bize gönüllü olarak destek verebilir, çalışmalarımıza sponsor olabilir veya ürünlerimizden satın alarak kadın emeğine doğrudan katkıda bulunabilirsiniz."
};

export default function Home() {
  const [content, setContent] = useState(DEFAULT_CONTENT);

  useEffect(() => {
    async function fetchContent() {
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        const docRef = doc(db, "settings", "siteContent");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setContent({ ...DEFAULT_CONTENT, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching site content:", err);
      }
    }
    fetchContent();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative min-h-[78vh] flex items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#303a18_0%,#64712a_45%,#9f5138_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(244,236,217,0.28),transparent_28%),radial-gradient(circle_at_80%_72%,rgba(201,185,135,0.32),transparent_30%),linear-gradient(180deg,rgba(36,28,20,0.18),rgba(36,28,20,0.58))]"></div>
        <div className="absolute -left-20 top-24 h-64 w-64 rounded-full border-[34px] border-secondary/35"></div>
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full border-[42px] border-primary-dark/35"></div>
        <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,#f4ecd9)]"></div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-background-light mb-6 leading-tight whitespace-pre-line">
            {content.heroTitle}
          </h1>
          <p className="text-lg md:text-2xl text-foreground-dark/90 mb-10 max-w-2xl mx-auto">
            {content.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/destek-ol" className="bg-accent text-background-light px-8 py-4 rounded-full font-bold text-lg hover:bg-accent-dark transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              {content.heroSupportBtn}
            </Link>
            <Link href="/projeler" className="bg-transparent border-2 border-background-light text-background-light px-8 py-4 rounded-full font-bold text-lg hover:bg-background-light hover:text-primary transition-all">
              {content.heroProjectsBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <FeaturedProjects />

      <LatestShares />

      <section className="py-20 bg-primary-dark text-foreground-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <span className="text-secondary font-bold uppercase tracking-wider text-sm">
              Ürün satış hattı
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">
              {content.productSectionTitle}
            </h2>
            <p className="mt-4 text-foreground-dark/80 max-w-3xl">
              {content.productSectionDesc}
            </p>
          </div>
          <Link
            href="/urunler"
            className="inline-flex justify-center rounded-full bg-accent px-8 py-4 font-bold text-background-light shadow-lg transition-colors hover:bg-accent-dark"
          >
            Ürünleri İncele
          </Link>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-secondary/45 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground-light mb-6">{content.ctaTitle}</h2>
          <p className="text-lg text-foreground-light/80 mb-10">{content.ctaDescription}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/gonullu-ol" className="bg-primary text-background-light px-8 py-4 rounded-full font-bold shadow-md hover:bg-primary-dark transition-colors">
              Gönüllü Ol
            </Link>
            <Link href="/iletisim" className="bg-card text-primary border-2 border-primary px-8 py-4 rounded-full font-bold shadow-sm hover:bg-background-light transition-colors">
              Bizimle İletişime Geçin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
