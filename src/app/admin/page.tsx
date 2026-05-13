"use client";

import { useState, FormEvent } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postType, setPostType] = useState("normal"); // "normal" or "featured"
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setError("Lütfen başlık ve açıklama giriniz.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      let imageUrl = "";

      // Upload image if selected
      if (imageFile) {
        const imageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // Add document to Firestore
      await addDoc(collection(db, "posts"), {
        title,
        description,
        type: postType,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setTitle("");
      setDescription("");
      setPostType("normal");
      setImageFile(null);
      // Reset file input visually
      const fileInput = document.getElementById("image") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
    } catch (err: any) {
      console.error(err);
      setError("Paylaşım eklenirken bir hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold text-foreground-light mb-8 border-b pb-4">Yeni Paylaşım Ekle</h1>
      
      {success && (
        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg border border-green-200">
          Paylaşım başarıyla eklendi! Sitenin ana sayfasında hemen görünecektir.
        </div>
      )}
      
      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Başlık
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
            placeholder="Etkinlik veya duyuru başlığı"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Açıklama / Yazı
          </label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
            placeholder="Paylaşım içeriğini buraya yazınız..."
          ></textarea>
        </div>

        <div>
          <label htmlFor="postType" className="block text-sm font-medium text-gray-700 mb-2">
            Paylaşım Türü Nerede Görünsün?
          </label>
          <select
            id="postType"
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow bg-white"
          >
            <option value="normal">Sadece "Son Paylaşımlar" kısmında</option>
            <option value="featured">"Öne Çıkan Çalışmalarımız" kısmında (Ana sayfada üstte)</option>
          </select>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Fotoğraf Yükle (İsteğe Bağlı)
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-primary-dark hover:file:bg-primary hover:file:text-white transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-md transition-colors ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"
          }`}
        >
          {loading ? "Yükleniyor, lütfen bekleyin..." : "Paylaşımı Sitede Yayınla"}
        </button>
      </form>

      <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
        <p className="font-semibold mb-1">Bilgi:</p>
        <p>Bu panel, Firebase veritabanınıza doğrudan bağlıdır. Ancak veritabanı ayarlarınız (.env.local) yapılandırılmadıysa kayıt işlemi hata verebilir.</p>
      </div>
    </div>
  );
}
