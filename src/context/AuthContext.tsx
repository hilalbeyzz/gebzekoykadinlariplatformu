'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: any | null;
  userData: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MOCK USER: Arayüzü inceleyebilmeniz için sizi otomatik olarak Admin yapıyoruz.
    setTimeout(() => {
      setUser({ uid: 'mock-uid-123', email: 'admin@gebzedernegi.com' });
      setUserData({
        uid: 'mock-uid-123',
        email: 'admin@gebzedernegi.com',
        displayName: 'Test Yöneticisi',
        role: 'admin',
      });
      setLoading(false);
    }, 500);
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
