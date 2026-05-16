"use client";

import { useState } from "react";
import Link from "next/link";

export default function SupportPage() {
  const [copied, setCopied] = useState(false);

  const copyIBAN = () => {
    navigator.clipboard.writeText("TR00 0000 0000 0000 0000 0000 00");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background-light">
      <section className="bg-accent py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-background-light mb-6">Bize Destek Olun</h1>
        <p className="text-white/90 max-w-2xl mx-auto px-4 text-lg">
          Köy kadınlarının emeğini büyütmek ve projelerimizi sürdürmek için vereceğiniz her destek çok kıymetli.
        </p>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Donation Part */}
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-accent/10">
            <h2 className="text-3xl font-bold text-foreground-light mb-6 flex items-center gap-3">
              <span className="text-4xl">💰</span> Maddi Destek
            </h2>
            <p className="text-foreground-light/80 mb-8 leading-relaxed">
              Bağışlarınız, kadınlarımıza yönelik eğitimler, atölye ekipmanları ve sosyal yardım projelerimizde kullanılmaktadır.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 mb-8">
              <p className="text-sm font-bold text-gray-500 uppercase mb-2">IBAN Bilgileri</p>
              <div className="flex items-center justify-between gap-4">
                <code className="text-lg font-mono font-bold text-primary-dark">TR00 0000 0000 0000 0000 0000 00</code>
                <button 
                  onClick={copyIBAN}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${copied ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary-dark'}`}
                >
                  {copied ? "Kopyalandı!" : "Kopyala"}
                </button>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                <span className="font-bold">Alıcı:</span> Gebze Köy Kadınları Kültür ve Dayanışma Derneği
              </p>
            </div>

            <p className="text-xs text-gray-400 italic">
              * Bağışlarınız için açıklama kısmına "Bağış" yazmayı unutmayınız.
            </p>
          </div>

          {/* Volunteer Part */}
          <div className="bg-primary-dark p-10 rounded-3xl shadow-xl text-white">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-secondary">
              <span className="text-4xl">🤝</span> Gönüllü Olun
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              Sadece maddi değil, bilgi ve zamanınızla da bize destek olabilirsiniz. Eğitimlerde eğitmen olabilir, etkinliklerimizde görev alabilirsiniz.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                "Atölye çalışmalarında yardımcı olmak",
                "Sosyal medya ve tanıtım desteği",
                "Hukuki veya mali danışmanlık",
                "Lojistik ve organizasyon desteği"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link 
              href="/gonullu-ol"
              className="inline-block w-full text-center bg-secondary text-primary-dark font-bold py-4 rounded-xl hover:bg-white transition-all shadow-lg"
            >
              Gönüllü Başvuru Formu
            </Link>
          </div>
        </div>

        {/* Product Support */}
        <div className="mt-16 bg-card p-10 rounded-3xl border border-primary/20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground-light mb-4">Ürün Alarak Destek Olun</h2>
          <p className="text-foreground-light/70 max-w-2xl mx-auto mb-8">
            Kadınlarımızın el emeği göz nuru ürünlerini satın alarak onlara doğrudan ekonomik katkı sağlayabilirsiniz.
          </p>
          <Link 
            href="/urunler"
            className="inline-flex items-center gap-2 bg-primary text-white px-10 py-4 rounded-full font-bold hover:bg-primary-dark transition-all"
          >
            Mağazayı İncele
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
