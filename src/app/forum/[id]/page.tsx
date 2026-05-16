'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  status: string;
}

const MOCK_POSTS: Record<string, Post> = {
  'mock-post-1': {
    id: 'mock-post-1',
    title: 'Platform Kermesimiz Hakkında',
    content: 'Önümüzdeki hafta sonu düzenleyeceğimiz kermes için hazırlıklarımız devam ediyor. Katkıda bulunmak isteyen üyelerimiz benimle iletişime geçebilir.',
    authorName: 'Ayşe Yılmaz',
    createdAt: new Date().toISOString(),
    status: 'approved',
  },
  'mock-post-2': {
    id: 'mock-post-2',
    title: 'Yeni Doğal Sabun Atölyesi',
    content: 'Köyümüzdeki kadınlarla birlikte yeni bir doğal sabun atölyesi planlıyoruz. Katılım durumunuzu ve fikirlerinizi bu başlık altında paylaşabilirsiniz.',
    authorName: 'Fatma Şahin',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'approved',
  }
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    
    setTimeout(() => {
      if (id && MOCK_POSTS[id]) {
        setPost(MOCK_POSTS[id]);
      } else {
        setPost(null);
      }
      setLoading(false);
    }, 500);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bg-card p-12 rounded-2xl shadow-sm border border-border-warm text-center max-w-md w-full">
          <svg className="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-foreground-dark mb-4">Gönderi Bulunamadı</h2>
          <p className="text-foreground-light/80 mb-8">
            Aradığınız gönderi silinmiş veya henüz yönetici onayından geçmemiş olabilir.
          </p>
          <Link href="/forum" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors inline-block">
            Foruma Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/forum" className="text-primary font-medium hover:underline flex items-center gap-2 mb-8 w-fit">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Foruma Dön
        </Link>

        <article className="bg-card rounded-3xl shadow-sm border border-border-warm overflow-hidden">
          <div className="p-8 sm:p-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground-dark mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-10 pb-10 border-b border-border-warm">
              <div className="w-12 h-12 bg-secondary/30 text-primary rounded-full flex items-center justify-center font-bold text-xl uppercase">
                {post.authorName.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-foreground-dark">
                  {post.authorName}
                </div>
                <div className="text-sm text-foreground-light/70 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(post.createdAt).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-foreground-light/90 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
