'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreatePostPage() {
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !title.trim() || !content.trim()) return;

    setLoading(true);
    
    try {
      const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      
      await addDoc(collection(db, "forum_posts"), {
        authorName,
        title,
        content,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setAuthorName('');
      setTitle('');
      setContent('');
      
      setTimeout(() => {
        router.push('/forum');
      }, 3000);
    } catch (error) {
      console.error("Error adding post: ", error);
      alert("Gönderi kaydedilirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/forum" className="text-primary font-medium hover:underline flex items-center gap-2 mb-4 w-fit">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Foruma Dön
          </Link>
          <h1 className="text-3xl font-bold text-foreground-dark">Yeni Konu Aç</h1>
          <p className="text-foreground-dark/80 mt-2">
            Gönderiniz yöneticiler tarafından onaylandıktan sonra forumda yayınlanacaktır.
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 p-8 rounded-2xl text-center">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">Başarıyla Gönderildi!</h3>
            <p className="text-green-700 mb-6">
              Konunuz başarıyla oluşturuldu ve onay için yöneticilere iletildi. Foruma yönlendiriliyorsunuz...
            </p>
            <Link href="/forum" className="inline-block bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition-colors">
              Hemen Foruma Dön
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/5 p-8 rounded-2xl shadow-sm border border-secondary/20 relative backdrop-blur-sm">
            <div className="space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground-dark mb-2">
                    İsim Soyisim
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    className="w-full px-4 py-3 rounded-lg bg-background-dark/50 border border-secondary/20 text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-foreground-dark/30"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Adınız Soyadınız"
                  />
                </div>

              <div>
                <label className="block text-sm font-medium text-foreground-dark mb-2">
                  Konu Başlığı
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-lg bg-background-dark/50 border border-secondary/20 text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-foreground-dark/30"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Kısaca ne hakkında yazacaksınız?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-dark mb-2">
                  İçerik
                </label>
                <textarea
                  required
                  rows={8}
                  className="w-full px-4 py-3 rounded-lg bg-background-dark/50 border border-secondary/20 text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none placeholder:text-foreground-dark/30"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Düşüncelerinizi buraya yazın..."
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Link
                  href="/forum"
                  className="px-6 py-3 rounded-full font-semibold text-foreground-dark/80 hover:bg-secondary/20 hover:text-foreground-dark transition-colors"
                >
                  İptal
                </Link>
                <button
                  type="submit"
                  disabled={loading || !authorName.trim() || !title.trim() || !content.trim()}
                  className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-primary-dark transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  Gönder
                </button>
              </div>
            </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
