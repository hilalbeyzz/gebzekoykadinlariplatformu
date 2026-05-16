"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  isApproved: boolean;
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const fetched: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ ...doc.data() } as UserProfile);
      });
      setUsers(fetched);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleApproval = async (uid: string, currentStatus: boolean) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        isApproved: !currentStatus
      });
      
      // Update local state
      setUsers(users.map(u => u.uid === uid ? { ...u, isApproved: !currentStatus } : u));
    } catch (err) {
      console.error("Error updating user approval:", err);
      alert("Durum güncellenirken bir hata oluştu.");
    }
  };

  if (loading) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-100">
        <h1 className="text-3xl font-bold text-foreground-light">Üye Yönetimi</h1>
        <p className="text-gray-500 mt-2">Forumda paylaşım yapabilmesi için üyeleri onaylayabilir veya engelleyebilirsiniz.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-bold">
            <tr>
              <th className="px-8 py-4">Üye Bilgisi</th>
              <th className="px-8 py-4">Rol</th>
              <th className="px-8 py-4">Kayıt Tarihi</th>
              <th className="px-8 py-4">Durum</th>
              <th className="px-8 py-4 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-gray-500 italic">Henüz kayıtlı üye bulunmuyor.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-bold text-gray-900">{user.displayName || 'İsimsiz Üye'}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role === 'admin' ? 'YÖNETİCİ' : 'ÜYE'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td className="px-8 py-6">
                    {user.isApproved ? (
                      <span className="flex items-center gap-1.5 text-green-600 font-bold text-sm">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        Onaylı
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                        Onay Bekliyor
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => toggleApproval(user.uid, user.isApproved)}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                          user.isApproved 
                            ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' 
                            : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                        }`}
                      >
                        {user.isApproved ? 'Onayı Kaldır' : 'Onayla'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
