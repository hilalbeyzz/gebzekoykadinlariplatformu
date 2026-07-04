"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: any;
}

export default function SharesPage() {
  const [shares, setShares] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShares() {
      try {
        const { collection, getDocs, query, orderBy, where } = await import("firebase/firestore");
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const fetched: Post[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.type === "normal") {
            fetched.push({ id: doc.id, ...data } as Post);
          }
        });
        setShares(fetched);
      } catch (error) {
        console.error("Error fetching shares: ", error);
      } finally {
        setLoading(false);
      }
    }

    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'your_project_id') {
      fetchShares();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background-light">
      <section className="bg-primary-dark text-foreground-dark py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-secondary font-bold uppercase tracking-wider text-sm">
            Platform gündemi
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold">
            Paylaşımlar
          </h1>
          <p className="mt-5 text-lg text-foreground-dark/85 max-w-3xl">
            Duyurular, etkinlikler, üretici hikayeleri ve platformdan güncel
            haberler burada yayınlanır.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : shares.length > 0 ? (
            shares.map((share) => (
              <article
                key={share.id}
                className="bg-card border border-border-warm rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-8"
              >
                {share.imageUrl && (
                  <div 
                    className="w-full md:w-1/3 relative h-64 md:min-h-[250px] bg-black/5 rounded-xl overflow-hidden shrink-0 cursor-pointer group"
                    onClick={() => setActiveImageUrl(share.imageUrl || null)}
                  >
                    <Image 
                      src={share.imageUrl} 
                      alt={share.title} 
                      fill 
                      className="object-contain transition-transform duration-300 group-hover:scale-105 p-2" 
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/95 text-primary-dark font-bold text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                        🔍 Büyüt
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="rounded-full bg-secondary/45 px-3 py-1 text-xs font-bold text-primary-dark">
                      Duyuru
                    </span>
                    <time className="text-sm text-foreground-light/60">
                      {share.createdAt?.toDate ? share.createdAt.toDate().toLocaleDateString("tr-TR") : new Date().toLocaleDateString("tr-TR")}
                    </time>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground-light">
                    {share.title}
                  </h2>
                  <p className="mt-5 text-foreground-light/80 leading-relaxed whitespace-pre-wrap">
                    {share.description}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="bg-card border border-border-warm rounded-2xl p-12 text-center text-foreground-light/70">
              Henüz yayınlanmış paylaşım bulunmuyor.
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeImageUrl && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setActiveImageUrl(null)}
        >
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <button 
              className="absolute -top-12 sm:top-4 right-4 text-white text-4xl font-bold bg-black/40 hover:bg-black/75 rounded-full w-12 h-12 flex items-center justify-center transition-colors z-50 cursor-pointer border border-white/20"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageUrl(null);
              }}
            >
              &times;
            </button>
            <div 
              className="relative max-w-full max-h-[80vh] rounded-2xl overflow-hidden p-2 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={activeImageUrl} 
                alt="Büyük Görsel" 
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border-4 border-white/10" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
