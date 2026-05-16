'use server';

import { cookies } from 'next/headers';

export async function loginAdmin(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'GebzeAdmin2026!';
  
  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 hafta
      path: '/'
    });
    return { success: true };
  }
  
  return { success: false, error: 'Hatalı şifre' };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  return { success: true };
}
