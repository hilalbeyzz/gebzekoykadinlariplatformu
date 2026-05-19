'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  status: string;
}

const MOCK_ADMIN_POSTS: Post[] = [
  {
    id: 'mock-post-3',
    title: 'Yeni Bir Fikrim Var',
    content: 'Platformumuzun daha çok kişiye ulaşması için sosyal medyada haftalık canlı yayınlar yapalım.',
    authorName: 'Mehmet Yılmaz',
    createdAt: new Date().toISOString(),
    status: 'pending',
  },
  {
    id: 'mock-post-1',
    title: 'Platform Kermesimiz Hakkında',
    content: 'Önümüzdeki hafta sonu düzenleyeceğimiz kermes için hazırlıklarımız devam ediyor. Katkıda bulunmak isteyen üyelerimiz benimle iletişime geçebilir.',
    authorName: 'Ayşe Yılmaz',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'approved',
  },
  {
    id: 'mock-post-2',
    title: 'Yeni Doğal Sabun Atölyesi',
    content: 'Köyümüzdeki kadınlarla birlikte yeni bir doğal sabun atölyesi planlıyoruz. Katılım durumunuzu ve fikirlerinizi bu başlık altında paylaşabilirsiniz.',
    authorName: 'Fatma Şahin',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'approved',
  }
];

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    setLoading(true);
    setTimeout(() => {
      setPosts(MOCK_ADMIN_POSTS);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleApprove = (id: string) => {
    if (!window.confirm('Bu gönderiyi onaylamak ve forumda yayınlamak istediğinize emin misiniz?')) return;
    setPosts(posts.map(post => post.id === id ? { ...post, status: 'approved' } : post));
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Bu gönderiyi kalıcı olarak silmek istediğinize emin misiniz?')) return;
    setPosts(posts.filter(post => post.id !== id));
  };

  return (
    <>
      <div className="min-h-screen bg-background-light py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <Link href="/yonetim" className="text-primary font-medium hover:underline flex items-center gap-2 mb-4 w-fit">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Panele Dön
              </Link>
              <h1 className="text-3xl font-bold text-foreground-dark">Forum Gönderileri Yönetimi</h1>
              <p className="text-foreground-light/80 mt-2">Kullanıcıların paylaştığı içerikleri onaylayın veya silin.</p>
            </div>
            <button 
              onClick={fetchPosts}
              className="bg-card border border-border-warm text-foreground-dark px-4 py-2 rounded-lg hover:bg-background-light transition-colors flex items-center gap-2 self-start"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Yenile
            </button>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-border-warm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background-light border-b border-border-warm text-sm uppercase tracking-wider text-foreground-light font-semibold">
                    <th className="p-4 sm:p-6">Durum</th>
                    <th className="p-4 sm:p-6">Başlık & İçerik</th>
                    <th className="p-4 sm:p-6">Yazar</th>
                    <th className="p-4 sm:p-6">Tarih</th>
                    <th className="p-4 sm:p-6 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </td>
                    </tr>
                  ) : posts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-foreground-light/70">
                        Henüz hiç gönderi bulunmuyor.
                      </td>
                    </tr>
                  ) : (
                    posts.map((post) => (
                      <tr key={post.id} className="hover:bg-background-light/50 transition-colors">
                        <td className="p-4 sm:p-6">
                          {post.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              Onaylı
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              Bekliyor
                            </span>
                          )}
                        </td>
                        <td className="p-4 sm:p-6 max-w-xs">
                          <h3 className="font-bold text-foreground-dark truncate">{post.title}</h3>
                          <p className="text-sm text-foreground-light/70 truncate mt-1">{post.content}</p>
                        </td>
                        <td className="p-4 sm:p-6 text-sm font-medium text-foreground-dark">
                          {post.authorName}
                        </td>
                        <td className="p-4 sm:p-6 text-sm text-foreground-light whitespace-nowrap">
                          {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="p-4 sm:p-6 text-right space-x-2 whitespace-nowrap">
                          {post.status === 'pending' && (
                            <button
                              onClick={() => handleApprove(post.id)}
                              className="text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                            >
                              Onayla
                            </button>
                          )}
                          <Link
                            href={`/forum/${post.id}`}
                            className="text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors inline-block"
                          >
                            İncele
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
