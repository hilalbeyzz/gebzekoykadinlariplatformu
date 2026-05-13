'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in
        router.push('/login');
      } else if (requireAdmin && userData?.role !== 'admin') {
        // Logged in, but not admin when admin is required
        router.push('/'); // Or a 403 Forbidden page
      }
    }
  }, [user, userData, loading, requireAdmin, router]);

  if (loading || (!user && !loading) || (requireAdmin && userData?.role !== 'admin' && !loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
