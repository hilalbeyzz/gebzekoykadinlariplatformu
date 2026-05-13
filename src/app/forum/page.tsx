'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  status: string;
}

const MOCK_POSTS: Post[] = [
  {
    id: 'mock-post-1',
    title: 'Dernek Kermesimiz Hakkında',
    content: 'Önümüzdeki hafta sonu düzenleyeceğimiz kermes için hazırlıklarımız devam ediyor. Katkıda bulunmak isteyen üyelerimiz benimle iletişime geçebilir.',
    authorName: 'Ayşe Yılmaz',
    createdAt: new Date().toISOString(),
    status: 'approved',
  },
  {
    id: 'mock-post-2',
    title: 'Yeni Doğal Sabun Atölyesi',
    content: 'Köyümüzdeki kadınlarla birlikte yeni bir doğal sabun atölyesi planlıyoruz. Katılım durumunuzu ve fikirlerinizi bu başlık altında paylaşabilirsiniz.',
    authorName: 'Fatma Şahin',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: 'approved',
  }
];

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate network delay
    setTimeout(() => {
      setPosts(MOCK_POSTS);
      setLoadingPosts(false);
    }, 600);
  }, []);

  return (
    <div className="min-h-screen bg-background-light py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground-dark">Forum</h1>
            <p className="text-foreground-light/80 mt-2">
              Dernek üyelerimizle iletişimde kalın, fikirlerinizi ve deneyimlerinizi paylaşın.
            </p>
          </div>
          {user ? (
            <Link
              href="/forum/create"
              className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors shadow-md flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Yeni Konu Aç
            </Link>
          ) : (
            <div className="text-sm bg-card p-4 rounded-xl shadow-sm border border-border-warm">
              Konu açmak için <Link href="/login" className="text-primary font-semibold hover:underline">Giriş Yapın</Link>
            </div>
          )}
        </div>

        {loadingPosts ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link 
                href={`/forum/${post.id}`} 
                key={post.id}
                className="block bg-card p-6 rounded-2xl shadow-sm border border-border-warm hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-foreground-dark group-hover:text-primary transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-foreground-light/70 text-sm line-clamp-2 mb-4">
                      {post.content}
                    </p>
                    <div className="flex items-center text-xs text-foreground-light/60 font-medium space-x-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {post.authorName}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(post.createdAt).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:flex shrink-0 ml-4 items-center justify-center bg-secondary/20 w-12 h-12 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-card p-12 rounded-2xl shadow-sm border border-border-warm text-center">
            <svg className="w-16 h-16 text-secondary/70 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-xl font-bold text-foreground-dark mb-2">Henüz konu açılmamış</h3>
            <p className="text-foreground-light/80 mb-6">Forumda ilk konuyu siz açarak tartışmayı başlatın.</p>
            {user && (
              <Link
                href="/forum/create"
                className="inline-block bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-dark transition-colors"
              >
                Yeni Konu Aç
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
