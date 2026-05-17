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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { collection, getDocs, query, orderBy, where } = await import("firebase/firestore");
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("type", "==", "featured"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const fetched: Post[] = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Post);
        });
        setProjects(fetched);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      } finally {
        setLoading(false);
      }
    }

    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'your_project_id') {
      fetchProjects();
    } else {
      setLoading(false);
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
        },
        {
          id: "demo4",
          title: "Gezici Kütüphane",
          description: "Köylerimizi tek tek gezerek çocuklarımıza ve kadınlarımıza kitap ulaştırdığımız sosyal sorumluluk projemiz.",
          createdAt: new Date()
        }
      ]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background-light">
      <section className="bg-primary-dark py-20 text-center">
        <h1 className="text-4xl font-bold text-background-light mb-4">Projelerimiz ve Çalışmalarımız</h1>
        <p className="text-foreground-dark/80 max-w-2xl mx-auto px-4">
          Kadın emeğini desteklemek ve köy yaşamını zenginleştirmek için yürüttüğümüz tüm faaliyetleri buradan takip edebilirsiniz.
        </p>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full">
                {project.imageUrl ? (
                  <div className="relative h-56 w-full">
                    <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="h-56 bg-secondary/30 flex items-center justify-center">
                    <svg className="w-16 h-16 text-primary-dark/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                      {project.type === "featured" ? "Öne Çıkan" : "Proje"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground-light mb-4">{project.title}</h3>
                  <p className="text-foreground-light/70 mb-8 flex-1 leading-relaxed">
                    {project.description}
                  </p>
                  <Link 
                    href={`/projeler/${project.id}`}
                    className="inline-flex items-center justify-center w-full bg-primary/5 text-primary font-bold py-3 rounded-xl hover:bg-primary hover:text-white transition-all"
                  >
                    Detayları İncele
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
