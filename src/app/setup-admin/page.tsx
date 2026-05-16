'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

export default function SetupAdmin() {
  const [status, setStatus] = useState('Hazır');
  
  const handleSetup = async () => {
    setStatus('İşleniyor...');
    try {
      // Şifreyi burada tanımlıyoruz
      const email = 'yonetim@gebzekadinlari.com';
      const password = 'GebzeAdmin2026!';
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: 'Platform Yöneticisi'
      });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: 'Platform Yöneticisi',
        role: 'admin',
        isApproved: true,
        createdAt: new Date().toISOString()
      });

      setStatus('Başarılı! Admin hesabı oluşturuldu.');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setStatus('Hesap zaten mevcut.');
      } else {
        setStatus('Hata: ' + error.message);
      }
    }
  };

  return (
    <div className="p-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Admin Kurulumu</h1>
      <button 
        id="setup-btn"
        onClick={handleSetup} 
        className="bg-blue-500 text-white px-6 py-2 rounded"
      >
        Admin Oluştur
      </button>
      <p id="status-text" className="mt-4">{status}</p>
    </div>
  );
}
