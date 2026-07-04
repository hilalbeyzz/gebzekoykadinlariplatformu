"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SetupAdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSetup = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Create the admin account
      await createUserWithEmailAndPassword(auth, "umran.yavas41@gmail.com", "GebzeAdmin2026!");
      setMessage("Yönetici hesabı başarıyla oluşturuldu! Artık giriş yapabilirsiniz.");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setMessage("Hesap zaten oluşturulmuş durumda. Giriş sayfasına gidebilirsiniz.");
      } else {
        setError("Hata: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-primary-dark">Yönetici Kurulumu</h1>
        <p className="text-gray-600 mb-6">
          Bu sayfa tek seferlik kullanım içindir. Firebase üzerinde "umran.yavas41@gmail.com" hesabı oluşturmak için aşağıdaki butona basın.
        </p>

        {message && <div className="p-4 bg-green-50 text-green-700 rounded-lg mb-4">{message}</div>}
        {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-4">{error}</div>}

        <button
          onClick={handleSetup}
          disabled={loading}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-colors"
        >
          {loading ? "Oluşturuluyor..." : "Yönetici Hesabını Kur"}
        </button>
      </div>
    </div>
  );
}
