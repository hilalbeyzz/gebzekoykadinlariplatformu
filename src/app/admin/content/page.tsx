"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";

interface SiteContent {
  heroTitle: string;
  heroDescription: string;
  heroSupportBtn: string;
  heroProjectsBtn: string;
  productSectionTitle: string;
  productSectionDesc: string;
  ctaTitle: string;
  ctaDescription: string;
  logoUrl?: string;
  siteName: string;
  aboutText?: string;
  aboutImageUrl?: string;
}

const DEFAULT_CONTENT: SiteContent = {
  heroTitle: "Emeği Büyüten Dayanışma",
  heroDescription: "Köy kadınlarının geleneksel üretim gücünü modern dünyayla buluşturarak, sürdürülebilir bir gelecek inşa ediyoruz.",
  heroSupportBtn: "Bize Destek Olun",
  heroProjectsBtn: "Projelerimizi İncele",
  productSectionTitle: "Kadınların ürettiği ürünler WhatsApp üzerinden satışta",
  productSectionDesc: "Ev yapımı gıda ürünleri ve el emeği çalışmalar için ürün sayfasına göz atabilir, siparişinizi doğrudan WhatsApp iletişim hattından iletebilirsiniz.",
  ctaTitle: "Siz de Ailemize Katılın",
  ctaDescription: "Bize gönüllü olarak destek verebilir, çalışmalarımıza sponsor olabilir veya ürünlerimizden satın alarak kadın emeğine doğrudan katkıda bulunabilirsiniz.",
  siteName: "Gebze Köy Kadınları Kültür Platformu",
  logoUrl: "/logo.png",
  aboutText: "Gebze Köy Kadınları Kültür Platformu olarak, köylerimizde yaşayan kadınların sosyal ve ekonomik hayatta daha aktif rol almalarını sağlıyoruz.",
  aboutImageUrl: ""
};

export default function ContentManagement() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [aboutFile, setAboutFile] = useState<File | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const docRef = doc(db, "settings", "siteContent");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setContent({ ...DEFAULT_CONTENT, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching content:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let currentLogoUrl = content.logoUrl;
      let currentAboutImageUrl = content.aboutImageUrl;

      const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
      const { storage } = await import("@/lib/firebase");

      if (logoFile) {
        const logoRef = ref(storage, `site/logo_${Date.now()}`);
        const snapshot = await uploadBytes(logoRef, logoFile);
        currentLogoUrl = await getDownloadURL(snapshot.ref);
      }

      if (aboutFile) {
        const aboutRef = ref(storage, `site/about_${Date.now()}`);
        const snapshot = await uploadBytes(aboutRef, aboutFile);
        currentAboutImageUrl = await getDownloadURL(snapshot.ref);
      }

      const { doc, setDoc } = await import("firebase/firestore");
      await setDoc(doc(db, "settings", "siteContent"), {
        ...content,
        logoUrl: currentLogoUrl,
        aboutImageUrl: currentAboutImageUrl
      });
      
      setContent(prev => ({ ...prev, logoUrl: currentLogoUrl, aboutImageUrl: currentAboutImageUrl }));
      setLogoFile(null);
      setAboutFile(null);
      alert("Site içeriği başarıyla güncellendi!");
    } catch (err: any) {
      console.error(err);
      alert("Kaydedilirken hata oluştu: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold text-foreground-light mb-8 border-b pb-4">Site İçeriğini Düzenle</h1>
      
      <form onSubmit={handleSave} className="space-y-8">
        <section className="p-6 bg-blue-50/50 rounded-xl border border-blue-100">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Genel Ayarlar (Logo ve Site Adı)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Adı</label>
              <input 
                type="text" 
                value={content.siteName}
                onChange={(e) => setContent({...content, siteName: e.target.value})}
                className="w-full p-2 border rounded bg-white"
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo Yükle</label>
                <input 
                  type="file" 
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="w-full text-sm bg-white p-2 border rounded"
                  accept="image/*"
                />
              </div>
              {content.logoUrl && (
                <div className="text-center">
                   <p className="text-xs text-gray-500 mb-1">Mevcut Logo</p>
                   <div className="h-16 w-16 rounded-full border bg-white flex items-center justify-center overflow-hidden">
                      <img src={content.logoUrl} alt="Logo" className="max-h-full max-w-full" />
                   </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-primary-dark">Ana Sayfa Kahraman (Hero) Bölümü</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
              <input 
                type="text" 
                value={content.heroTitle}
                onChange={(e) => setContent({...content, heroTitle: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
              <textarea 
                value={content.heroDescription}
                onChange={(e) => setContent({...content, heroDescription: e.target.value})}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destek Butonu Metni</label>
                <input 
                  type="text" 
                  value={content.heroSupportBtn}
                  onChange={(e) => setContent({...content, heroSupportBtn: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Projeler Butonu Metni</label>
                <input 
                  type="text" 
                  value={content.heroProjectsBtn}
                  onChange={(e) => setContent({...content, heroProjectsBtn: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-primary-dark">Ürün Tanıtım Bölümü</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bölüm Başlığı</label>
              <input 
                type="text" 
                value={content.productSectionTitle}
                onChange={(e) => setContent({...content, productSectionTitle: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bölüm Açıklaması</label>
              <textarea 
                value={content.productSectionDesc}
                onChange={(e) => setContent({...content, productSectionDesc: e.target.value})}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
          </div>
        </section>

        <section className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-primary-dark">Hakkımızda Sayfası İçeriği</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hakkımızda Yazısı</label>
              <textarea 
                value={content.aboutText}
                onChange={(e) => setContent({...content, aboutText: e.target.value})}
                className="w-full p-2 border rounded"
                rows={10}
                placeholder="Hakkımızda sayfasında fotoğrafın altında görünecek yazı..."
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hakkımızda Fotoğrafı Değiştir</label>
                <input 
                  type="file" 
                  onChange={(e) => setAboutFile(e.target.files?.[0] || null)}
                  className="w-full text-sm bg-white p-2 border rounded"
                  accept="image/*"
                />
              </div>
              {content.aboutImageUrl && (
                <div className="text-center">
                   <p className="text-xs text-gray-500 mb-1">Mevcut Görsel</p>
                   <div className="h-16 w-24 rounded border bg-white flex items-center justify-center overflow-hidden">
                      <img src={content.aboutImageUrl} alt="Hakkımızda" className="max-h-full max-w-full object-cover" />
                   </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-primary-dark">Alt Çağrı (CTA) Bölümü</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
              <input 
                type="text" 
                value={content.ctaTitle}
                onChange={(e) => setContent({...content, ctaTitle: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
              <textarea 
                value={content.ctaDescription}
                onChange={(e) => setContent({...content, ctaDescription: e.target.value})}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-primary text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400 shadow-md"
          >
            {saving ? "Kaydediliyor..." : "Tüm Değişiklikleri Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
