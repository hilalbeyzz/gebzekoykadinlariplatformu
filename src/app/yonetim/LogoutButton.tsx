'use client';

import { useRouter } from 'next/navigation';
import { logoutAdmin } from '@/app/actions/auth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Firebase logout error:", err);
    }
    await logoutAdmin();
    router.push('/');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-8 w-full bg-red-500/20 text-red-100 hover:bg-red-500 hover:text-white py-3 rounded font-bold transition-colors"
    >
      Güvenli Çıkış Yap
    </button>
  );
}
