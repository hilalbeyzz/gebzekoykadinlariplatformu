'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update auth profile
      await updateProfile(user, {
        displayName: name
      });

      // Create user document in Firestore with 'user' role
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: 'user',
        createdAt: new Date().toISOString()
      });

      router.push('/forum'); // Redirect to forum after successful registration
    } catch (err: any) {
      setError(err.message || 'Kayıt olurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-sm border border-border-warm mt-8 mb-8">
        <h1 className="text-3xl font-bold text-center text-foreground-light mb-8">Kayıt Ol</h1>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground-light mb-2">
              Ad Soyad
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg border border-border-warm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Ayşe Yılmaz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-light mb-2">
              E-posta Adresi
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-border-warm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-light mb-2">
              Şifre
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg border border-border-warm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="En az 6 karakter"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-70"
          >
            {loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground-light/80">
          Zaten hesabınız var mı?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
