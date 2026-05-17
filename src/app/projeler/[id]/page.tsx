"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      const id = params.id as string;
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Post);
        } else {
          setProject(null);
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    }

    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'your_project_id') {
      fetchProject();
    } else {
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-secondary/20 text-center max-w-md w-full">
          <svg className="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-foreground-light mb-4">Proje Bulunamadı</h2>
          <p className="text-foreground-light/80 mb-8">
            Aradığınız proje silinmiş veya taşınmış olabilir.
          </p>
          <Link href="/projeler" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors inline-block">
            Projelere Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/projeler" className="text-primary font-medium hover:underline flex items-center gap-2 mb-8 w-fit">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Projelere Dön
        </Link>

        <article className="bg-white rounded-3xl shadow-sm border border-border-warm overflow-hidden">
          {project.imageUrl && (
            <div className="relative h-64 sm:h-96 w-full">
              <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
            </div>
          )}
          <div className="p-8 sm:p-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-accent/10 text-accent text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                {project.type === "featured" ? "Öne Çıkan" : "Proje"}
              </span>
              <div className="text-sm text-foreground-light/60 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {project.createdAt?.toDate ? project.createdAt.toDate().toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR')}
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-bold text-foreground-light mb-8 leading-tight">
              {project.title}
            </h1>
            
            <div className="prose prose-lg max-w-none text-foreground-light/90 whitespace-pre-wrap leading-relaxed">
              {project.description}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
