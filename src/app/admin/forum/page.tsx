"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";

interface ForumPost {
  id: string;
  authorName: string;
  location?: string;
  title: string;
  content: string;
  status: string;
  createdAt: any;
}

export default function AdminForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postsRef = collection(db, "forum_posts");
      const q = query(postsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const fetched: ForumPost[] = [];
      querySnapshot.forEach((document) => {
        fetched.push({ id: document.id, ...document.data() } as ForumPost);
      });
      setPosts(fetched);
    } catch (err) {
      console.error("Error fetching forum posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "forum_posts", id), { status: "approved" });
      setPosts(posts.map(p => p.id === id ? { ...p, status: "approved" } : p));
    } catch (err) {
      console.error("Error approving post:", err);
      alert("Gönderi onaylanırken hata oluştu.");
    }
  };

  const handleReject = async (id: string) => {
    if (confirm("Bu gönderiyi reddetmek (silmek) istediğinize emin misiniz?")) {
      try {
        await deleteDoc(doc(db, "forum_posts", id));
        setPosts(posts.filter(p => p.id !== id));
      } catch (err) {
        console.error("Error rejecting post:", err);
        alert("Gönderi silinirken hata oluştu.");
      }
    }
  };

  if (loading) return <div className="p-8">Yükleniyor...</div>;

  const pendingPosts = posts.filter(p => p.status === "pending");
  const approvedPosts = posts.filter(p => p.status === "approved");

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-foreground-light border-b pb-4 mb-6">Forum Gönderileri Onayı</h1>
        
        <h2 className="text-xl font-bold text-amber-600 mb-4">Onay Bekleyen Gönderiler ({pendingPosts.length})</h2>
        {pendingPosts.length === 0 ? (
          <p className="text-gray-500 italic mb-8">Şu an onay bekleyen gönderi bulunmuyor.</p>
        ) : (
          <div className="space-y-4 mb-12">
            {pendingPosts.map(post => (
              <div key={post.id} className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{post.title}</h3>
                    <p className="text-sm text-gray-500">
                      Yazar: {post.authorName} {post.location && <span className="text-gray-400">({post.location})</span>}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleApprove(post.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition-colors"
                    >
                      Onayla (Foruma Ekle)
                    </button>
                    <button 
                      onClick={() => handleReject(post.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 transition-colors"
                    >
                      Reddet (Sil)
                    </button>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg text-gray-700 whitespace-pre-wrap">
                  {post.content}
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-xl font-bold text-green-700 mb-4">Onaylanmış Gönderiler ({approvedPosts.length})</h2>
        {approvedPosts.length === 0 ? (
          <p className="text-gray-500 italic">Henüz onaylanmış gönderi bulunmuyor.</p>
        ) : (
          <div className="space-y-4">
            {approvedPosts.map(post => (
              <div key={post.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{post.title}</h3>
                    <p className="text-sm text-gray-500">
                      Yazar: {post.authorName} {post.location && <span className="text-gray-400">({post.location})</span>}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleReject(post.id)}
                    className="text-red-500 text-sm font-bold hover:underline"
                  >
                    Gönderiyi Sil
                  </button>
                </div>
                <div className="bg-white p-4 rounded-lg text-gray-700 whitespace-pre-wrap">
                  {post.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
