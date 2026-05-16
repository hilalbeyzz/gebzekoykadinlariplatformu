"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  type?: string;
  createdAt: any;
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { collection, getDocs, query, orderBy, limit, where } = await import("firebase/firestore");
        const postsRef = collection(db, "posts");
        // Fetch posts where type is 'featured'
        const q = query(postsRef, where("type", "==", "featured"), orderBy("createdAt", "desc"), limit(3));
        const querySnapshot = await getDocs(q);
        
        const fetched: Post[] = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Post);
        });
        setProjects(fetched);
      } catch (error) {
        console.error("Error fetching featured projects: ", error);
      } finally {
        setLoading(false);
      }
    }

    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'your_project_id') {
      fetchProjects();
    } else {
      setLoading(false);
      // Dummy data if Firebase isn't set
      setProjects([
        {
          id: "demo1",
          title: "Dijital Yetkinlik Atölyesi",
          description: "Köy kadınlarının ürettikleri ürünleri dijital pazarlarda sunabilmeleri için verdiğimiz temel e-ticaret eğitimi.",
          type: "featured",
          createdAt: new Date()
        },
        {
          id: "demo2",
          title: "Doğal Şifa Bahçesi",
          description: "Kimyasal kullanmadan, geleneksel tarım yöntemleriyle yetiştirilen şifalı otlar ve aromatik bitkiler projesi.",
          type: "featured",
          createdAt: new Date()
        },
        {
          id: "demo3",
          title: "Geleceğin Kızları Bursu",
          description: "Köyde okuyan başarılı kız öğrencilerin eğitim masraflarına katkı sağladığımız eğitim fonumuz.",
          type: "featured",
          createdAt: new Date()
        }
      ]);
    }
  }, []);

  if (loading) return <div className="py-24 text-center">Yükleniyor...</div>;

  return (
    <section className="py-24 bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground-light mb-4">Öne Çıkan Çalışmalarımız</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-foreground-light/80 max-w-2xl mx-auto">Platformumuz çatısı altında yürüttüğümüz eğitim, üretim ve dayanışma projeleri ile köylerimiz kalkınıyor.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={project.id} className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-border-warm">
              {project.imageUrl ? (
                <div className="relative h-48 w-full">
                  <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="h-48 bg-[linear-gradient(135deg,rgba(100,113,42,0.2),rgba(201,185,135,0.48))] relative overflow-hidden flex items-center justify-center">
                   <span className="text-primary-dark text-xl font-medium">Fotoğraf Yok</span>
                </div>
              )}
              <div className="p-8">
                <span className="text-accent text-sm font-bold uppercase tracking-wider mb-2 block">
                  {index === 0 ? "Eğitim" : index === 1 ? "Üretim" : "Dayanışma"}
                </span>
                <h3 className="text-xl font-bold text-foreground-light mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-foreground-light/70 mb-6 text-sm leading-relaxed">{project.description}</p>
                <Link href={`/projeler/${project.id}`} className="text-primary font-semibold hover:text-primary-dark transition-colors inline-flex items-center">
                  Detayları Gör
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/projeler" className="inline-block bg-primary text-background-light px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors">
            Tüm Projeleri İncele
          </Link>
        </div>
      </div>
    </section>
  );
}
