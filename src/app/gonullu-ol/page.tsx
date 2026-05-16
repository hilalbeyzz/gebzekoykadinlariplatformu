"use client";

import { useState, FormEvent } from "react";

export default function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background-light px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl text-center border border-green-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            ✓
          </div>
          <h2 className="text-3xl font-bold text-foreground-light mb-4">Başvurunuz Alındı!</h2>
          <p className="text-foreground-light/70 mb-8">
            Gönüllü olma talebiniz tarafımıza ulaştı. En kısa sürede sizinle iletişime geçeceğiz. İlginiz ve desteğiniz için teşekkür ederiz.
          </p>
          <a href="/" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all">
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground-light mb-4">Gönüllü Başvuru Formu</h1>
          <p className="text-foreground-light/70">
            Aramıza katılmak ve kadın emeğine omuz vermek için aşağıdaki formu doldurabilirsiniz.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ad Soyad</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
                  placeholder="Ahmet Yılmaz"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">E-Posta Adresi</label>
                <input 
                  required
                  type="email" 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
                  placeholder="ahmet@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Telefon Numarası</label>
                <input 
                  required
                  type="tel" 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
                  placeholder="05xx xxx xx xx"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Meslek / Uzmanlık</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
                  placeholder="Örn: Eğitmen, Yazılımcı, Çiftçi"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hangi Alanlarda Destek Olabilirsiniz?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Eğitim ve Atölyeler",
                  "Sosyal Medya ve Tanıtım",
                  "Saha Çalışmaları",
                  "Organizasyon ve Etkinlik",
                  "İdari ve Hukuki Destek",
                  "Diğer"
                ].map((item, i) => (
                  <label key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-secondary/20 transition-colors">
                    <input type="checkbox" className="w-5 h-5 accent-primary" />
                    <span className="text-sm font-medium text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kendinizden Kısaca Bahseder Misiniz?</label>
              <textarea 
                rows={4}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
                placeholder="Deneyimleriniz ve bize katabilecekleriniz..."
              ></textarea>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className={`w-full py-5 rounded-2xl text-white font-bold text-lg shadow-lg transform active:scale-95 transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark shadow-primary/20'}`}
            >
              {loading ? "Gönderiliyor..." : "Başvuruyu Tamamla"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
