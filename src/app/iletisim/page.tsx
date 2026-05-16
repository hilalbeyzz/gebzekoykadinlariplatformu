"use client";

import { useState, FormEvent } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background-light">
      {/* Header */}
      <section className="bg-primary-dark py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-background-light mb-4">İletişime Geçin</h1>
        <p className="text-foreground-dark/80 max-w-2xl mx-auto px-4">
          Sorularınız, önerileriniz veya iş birliği talepleriniz için bize her zaman ulaşabilirsiniz.
        </p>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-foreground-light mb-8">İletişim Bilgileri</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary/30 rounded-2xl flex items-center justify-center text-primary-dark shrink-0 text-xl">
                    📍
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Adres</h3>
                    <p className="text-gray-600">Gebze, Kocaeli, Türkiye</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary/30 rounded-2xl flex items-center justify-center text-primary-dark shrink-0 text-xl">
                    📞
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Telefon</h3>
                    <p className="text-gray-600">+90 (555) 123 45 67</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary/30 rounded-2xl flex items-center justify-center text-primary-dark shrink-0 text-xl">
                    ✉️
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">E-Posta</h3>
                    <p className="text-gray-600">iletisim@gebzekadinlari.org</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="font-bold text-gray-900 mb-4">Sosyal Medya</h3>
                <div className="flex gap-4">
                  {['Facebook', 'Instagram', 'Twitter'].map((social) => (
                    <div key={social} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                      <span className="sr-only">{social}</span>
                      <div className="w-5 h-5 bg-current opacity-20 rounded-sm"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
                  <h2 className="text-3xl font-bold text-foreground-light mb-4">Mesajınız Gönderildi!</h2>
                  <p className="text-foreground-light/70 mb-8">Bize ulaştığınız için teşekkürler. En kısa sürede yanıt vereceğiz.</p>
                  <button onClick={() => setSubmitted(false)} className="text-primary font-bold hover:underline">Yeni Mesaj Gönder</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Ad Soyad</label>
                      <input required type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">E-Posta</label>
                      <input required type="email" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Konu</label>
                    <input required type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mesajınız</label>
                    <textarea required rows={6} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"></textarea>
                  </div>
                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full py-5 bg-primary hover:bg-primary-dark text-white font-bold text-lg rounded-2xl shadow-lg transition-all"
                  >
                    {loading ? "Gönderiliyor..." : "Mesajı Gönder"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
