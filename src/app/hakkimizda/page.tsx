"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const DEFAULT_ABOUT = {
  aboutText: "Gebze Köy Kadınları Kültür Platformu olarak, köylerimizde yaşayan kadınların sosyal ve ekonomik hayatta daha aktif rol almalarını sağlamak amacıyla kurulmuş bir dayanışma topluluğudur. Geleneksel bilgiyi modern yöntemlerle birleştirerek, ev yapımı gıdalardan el emeği sanatlara kadar her alanda kadınlarımızı destekliyoruz.",
  aboutImageUrl: ""
};

export default function AboutPage() {
  const [content, setContent] = useState(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        const docRef = doc(db, "settings", "siteContent");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContent({
            aboutText: data.aboutText || DEFAULT_ABOUT.aboutText,
            aboutImageUrl: data.aboutImageUrl || DEFAULT_ABOUT.aboutImageUrl
          });
        }
      } catch (err) {
        console.error("Error fetching about content:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground-light mb-12 text-center">Hakkımızda</h1>
          
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            {/* Single Large Photo */}
            <div className="relative h-[400px] md:h-[500px] w-full bg-secondary/20">
              {content.aboutImageUrl ? (
                <Image 
                  src={content.aboutImageUrl} 
                  alt="Hakkımızda" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-primary-dark/30 font-bold italic p-12 text-center text-xl">
                   "Kadın elinin değdiği her yer güzelleşir, kadın emeğinin olduğu her iş bereketlenir."
                </div>
              )}
            </div>

            {/* Text Content Below Photo */}
            <div className="p-10 md:p-16">
              <div className="prose prose-lg max-w-none text-foreground-light/80 leading-relaxed whitespace-pre-line">
                {content.aboutText}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
