"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  type?: string;
  createdAt: any;
}

export default function ManagePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const fetchPosts = async () => {
    try {
      const { collection, query, orderBy, getDocs } = await import("firebase/firestore");
      const postsRef = collection(db, "posts");
      const q = query(postsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const fetched: Post[] = [];
      querySnapshot.forEach((document) => {
        fetched.push({ id: document.id, ...document.data() } as Post);
      });
      setPosts(fetched);
    } catch (err: any) {
      console.error(err);
      setError("Gönderiler yüklenirken bir hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'your_project_id') {
      fetchPosts();
    } else {
      setLoading(false);
      setError("Firebase henüz bağlanmamış. Lütfen .env.local ayarlarınızı yapın.");
    }
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu paylaşımı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
      return;
    }

    try {
      const { deleteDoc, doc } = await import("firebase/firestore");
      await deleteDoc(doc(db, "posts", id));
      // Refresh the list
      setPosts(posts.filter(p => p.id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Silinirken hata oluştu: " + err.message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    setEditLoading(true);
    try {
      let imageUrl = editingPost.imageUrl || "";

      if (editImageFile) {
        const { ref: storageRef, uploadBytes, getDownloadURL } = await import("firebase/storage");
        const { storage } = await import("@/lib/firebase");
        const imageRef = storageRef(storage, `posts/${Date.now()}_${editImageFile.name}`);
        const snapshot = await uploadBytes(imageRef, editImageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const { updateDoc, doc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      
      await updateDoc(doc(db, "posts", editingPost.id), {
        title: editingPost.title,
        description: editingPost.description,
        type: editingPost.type,
        imageUrl: imageUrl
      });

      setEditingPost(null);
      setEditImageFile(null);
      fetchPosts();
      alert("Paylaşım başarıyla güncellendi.");
    } catch (err: any) {
      console.error(err);
      alert("Güncelleme sırasında hata oluştu: " + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-foreground-light">Paylaşımları Yönet</h1>
        {editingPost && (
          <button 
            onClick={() => setEditingPost(null)}
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            Düzenlemeyi İptal Et
          </button>
        )}
      </div>
      
      {editingPost ? (
        <form onSubmit={handleUpdate} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 space-y-4">
          <h2 className="text-xl font-bold mb-4 text-primary-dark">Geri Bildirimi Düzenle</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
            <input 
              type="text" 
              value={editingPost.title}
              onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
              className="w-full p-2 border rounded text-gray-900 bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
            <textarea 
              value={editingPost.description}
              onChange={(e) => setEditingPost({...editingPost, description: e.target.value})}
              className="w-full p-2 border rounded text-gray-900 bg-white"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tür</label>
            <select 
              value={editingPost.type}
              onChange={(e) => setEditingPost({...editingPost, type: e.target.value})}
              className="w-full p-2 border rounded text-gray-900 bg-white"
            >
              <option value="normal">Normal</option>
              <option value="featured">Öne Çıkan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Görsel Değiştir (İsteğe bağlı)</label>
            <input 
              type="file" 
              onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
              className="w-full text-sm"
              accept="image/*"
            />
          </div>
          <button 
            type="submit" 
            disabled={editLoading}
            className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:bg-gray-400"
          >
            {editLoading ? "Güncelleniyor..." : "Güncelle"}
          </button>
        </form>
      ) : null}

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {posts.length === 0 && !error ? (
        <p className="text-gray-500">Henüz eklenmiş bir paylaşım bulunmuyor.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="flex flex-col sm:flex-row gap-6 p-4 border rounded-xl hover:shadow-sm transition-shadow bg-gray-50/50">
              {post.imageUrl ? (
                <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-full sm:w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 text-sm text-gray-500">
                  Görsel Yok
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
                    <span className={`inline-block px-2 py-1 mt-1 text-xs font-semibold rounded-md ${post.type === 'featured' ? 'bg-primary/20 text-primary-dark' : 'bg-gray-200 text-gray-700'}`}>
                      {post.type === 'featured' ? 'Öne Çıkan Çalışma' : 'Genel Paylaşım'}
                    </span>
                  </div>
                  <div className="flex gap-2 self-end sm:self-start">
                    <button 
                      onClick={() => setEditingPost(post)}
                      className="text-primary-dark hover:text-primary font-medium text-sm px-3 py-1 bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                    >
                      Düzenle
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1 bg-red-50 hover:bg-red-100 rounded transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-gray-600 text-sm line-clamp-2">{post.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
