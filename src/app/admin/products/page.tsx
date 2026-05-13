"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { Product } from "@/lib/products";

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // New product form state
  const [newName, setNewName] = useState("");
  const [newProducer, setNewProducer] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newTone, setNewTone] = useState<Product["tone"]>("olive");

  const fetchProducts = async () => {
    try {
      const { collection, getDocs } = await import("firebase/firestore");
      const productsRef = collection(db, "products");
      const querySnapshot = await getDocs(productsRef);
      
      const fetched: Product[] = [];
      querySnapshot.forEach((document) => {
        fetched.push({ id: document.id, ...document.data() } as Product);
      });
      
      setProducts(fetched);
    } catch (err: any) {
      console.error(err);
      setError("Ürünler yüklenirken bir hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const { updateDoc, addDoc, doc, collection } = await import("firebase/firestore");
      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), {
          name: editingProduct.name,
          producer: editingProduct.producer,
          price: editingProduct.price,
          description: editingProduct.description,
          tone: editingProduct.tone
        });
        setEditingProduct(null);
        alert("Ürün başarıyla güncellendi.");
      } else {
        await addDoc(collection(db, "products"), {
          name: newName,
          producer: newProducer,
          price: newPrice,
          description: newDescription,
          tone: newTone
        });
        setNewName("");
        setNewProducer("");
        setNewPrice("");
        setNewDescription("");
        alert("Ürün başarıyla eklendi.");
      }
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      alert("İşlem sırasında hata oluştu: " + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    try {
      const { deleteDoc, doc } = await import("firebase/firestore");
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter(p => p.id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Silinirken hata oluştu.");
    }
  };

  if (loading) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold text-foreground-light mb-8 border-b pb-4">Ürünleri Yönet</h1>

      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-10 space-y-4">
        <h2 className="text-xl font-bold mb-4 text-primary-dark">
          {editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
            <input 
              type="text" 
              value={editingProduct ? editingProduct.name : newName}
              onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, name: e.target.value}) : setNewName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Üretici</label>
            <input 
              type="text" 
              value={editingProduct ? editingProduct.producer : newProducer}
              onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, producer: e.target.value}) : setNewProducer(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (Örn: 100 TL / kg)</label>
            <input 
              type="text" 
              value={editingProduct ? editingProduct.price : newPrice}
              onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, price: e.target.value}) : setNewPrice(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Renk Tonu</label>
            <select 
              value={editingProduct ? editingProduct.tone : newTone}
              onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, tone: e.target.value as any}) : setNewTone(e.target.value as any)}
              className="w-full p-2 border rounded"
            >
              <option value="olive">Zeytin Yeşili</option>
              <option value="earth">Toprak</option>
              <option value="wheat">Buğday</option>
              <option value="cream">Krem</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
          <textarea 
            value={editingProduct ? editingProduct.description : newDescription}
            onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, description: e.target.value}) : setNewDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>
        <div className="flex gap-2">
          <button 
            type="submit" 
            disabled={formLoading}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:bg-gray-400"
          >
            {formLoading ? "İşleniyor..." : (editingProduct ? "Güncelle" : "Ürünü Ekle")}
          </button>
          {editingProduct && (
            <button 
              type="button"
              onClick={() => setEditingProduct(null)}
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
            >
              Vazgeç
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">Mevcut Ürünler</h2>
        {products.length === 0 ? (
          <p className="text-gray-500 italic">Henüz ürün eklenmemiş.</p>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <div key={product.id} className="p-4 border rounded-xl flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.producer} - {product.price}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingProduct(product)}
                    className="bg-primary/10 text-primary-dark px-3 py-1 rounded hover:bg-primary/20 transition-colors text-sm"
                  >
                    Düzenle
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 transition-colors text-sm"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
