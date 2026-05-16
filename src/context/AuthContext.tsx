'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'user';
  isApproved: boolean;
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
    const { onAuthStateChanged } = require('firebase/auth');
    const { auth, db } = require('@/lib/firebase');
    const { doc, getDoc, onSnapshot } = require('firebase/firestore');

    const unsubscribe = onAuthStateChanged(auth, async (currentUser: any) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch user data from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        
        // Use onSnapshot for real-time updates (e.g. if an admin approves while user is online)
        const unsubDoc = onSnapshot(userDocRef, (docSnap: any) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          } else {
            setUserData(null);
          }
          setLoading(false);
        });

        return () => unsubDoc();
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
