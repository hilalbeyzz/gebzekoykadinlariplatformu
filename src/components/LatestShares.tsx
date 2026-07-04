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

export default function LatestShares() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { collection, getDocs, query, orderBy, limit } = await import("firebase/firestore");
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("createdAt", "desc"), limit(3));
        const querySnapshot = await getDocs(q);
        
        const fetchedPosts: Post[] = [];
        querySnapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() } as Post);
        });
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      } finally {
        setLoading(false);
      }
    }

    // Only attempt fetch if Firebase project is likely configured
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'your_project_id') {
      fetchPosts();
    } else {
      setLoading(false);
      // Fallback dummy data if Firebase is not connected yet
      setPosts([
        {
          id: "1",
          title: "Örnek Paylaşım",
          description: "Firebase bağlantınızı yaptıktan sonra Admin panelinden girdiğiniz gönderiler burada görünecektir.",
          createdAt: new Date()
        }
      ]);
    }
  }, []);

  if (loading) return <div className="py-20 text-center">Yükleniyor...</div>;

  if (posts.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground-light mb-4">Son Paylaşımlarımız</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-gray-100">
              {post.imageUrl ? (
                <div 
                  className="relative h-56 w-full bg-black/5 cursor-pointer group"
                  onClick={() => setActiveImageUrl(post.imageUrl || null)}
                >
                  <Image src={post.imageUrl} alt={post.title} fill className="object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/95 text-primary-dark font-bold text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                      🔍 Büyüt
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-secondary/30 relative overflow-hidden flex items-center justify-center">
                  <span className="text-primary text-xl font-medium">Görsel Yok</span>
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-bold text-foreground-light mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-foreground-light/70 mb-6 text-sm leading-relaxed">{post.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImageUrl && (
        <div 
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
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
    </section>
  );
}
