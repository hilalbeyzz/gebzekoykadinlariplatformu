"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_PRODUCTS,
  PRODUCTS_STORAGE_KEY,
  Product,
  getProductToneClass,
} from "@/lib/products";

const whatsappNumber = "905551234567";

function whatsappLink(productName: string) {
  const message = encodeURIComponent(
    `Merhaba, Gebze Köy Kadınları ürünlerinden "${productName}" için bilgi almak ve sipariş vermek istiyorum.`
  );

  return `https://wa.me/${whatsappNumber}?text=${message}`;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { collection, getDocs } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        
        const productsRef = collection(db, "products");
        const querySnapshot = await getDocs(productsRef);
        
        if (!querySnapshot.empty) {
          const fetched: Product[] = [];
          querySnapshot.forEach((document) => {
            fetched.push({ id: document.id, ...document.data() } as Product);
          });
          setProducts(fetched);
        } else {
          // If Firestore is empty, we can keep defaults or show nothing
          // setProducts(DEFAULT_PRODUCTS); 
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background-light">
      <section className="bg-primary-dark text-foreground-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-center">
          <div>
            <span className="text-secondary font-bold uppercase tracking-wider text-sm">
              Kadın emeği ürünleri
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
              Köy üreticilerinden doğrudan WhatsApp ile sipariş
            </h1>
            <p className="mt-6 text-lg text-foreground-dark/85 max-w-2xl">
              Gebze köylerinde kadınların hazırladığı gıda ve el emeği ürünleri
              için WhatsApp hattından bilgi alabilir, stok ve teslimat detaylarını
              doğrudan üretici ağıyla görüşebilirsiniz.
            </p>
            <a
              href={whatsappLink("genel ürün kataloğu")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 font-bold text-background-light shadow-lg transition-colors hover:bg-accent-dark"
            >
              WhatsApp Hattına Yaz
            </a>
          </div>

          <div className="rounded-2xl border border-secondary/30 bg-background-light/10 p-6">
            <div className="grid grid-cols-2 gap-3">
              {["Erişte", "Reçel", "Tarhana", "Dokuma"].map((item) => (
                <div
                  key={item}
                  className="aspect-square rounded-xl bg-card/95 p-4 text-primary-dark flex items-end font-bold shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground-light">
              Satıştaki Ürünler
            </h2>
            <p className="mt-4 text-foreground-light/75">
              Ürünler mevsime ve üretim durumuna göre değişebilir. Her karttaki
              buton ilgili ürün adıyla hazır mesaj açar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <article
                key={product.id}
                className="bg-card border border-border-warm rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`h-44 bg-gradient-to-br ${getProductToneClass(product.tone)} flex items-center justify-center px-6 text-center`}
                >
                  <span className="text-2xl font-bold text-primary-dark">
                    {product.name}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-sm font-semibold text-accent">
                    {product.producer}
                  </p>
                  <p className="mt-3 text-foreground-light/75 text-sm leading-relaxed min-h-16">
                    {product.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <span className="font-bold text-primary-dark">
                      {product.price}
                    </span>
                    <a
                      href={whatsappLink(product.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-bold text-background-light transition-colors hover:bg-primary-dark"
                    >
                      Sipariş Ver
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/45 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-3">
          {[
            ["1", "Ürünü seçin", "Beğendiğiniz ürünün sipariş butonuna basın."],
            ["2", "WhatsApp'ta görüşün", "Stok, teslimat ve ödeme detaylarını netleştirin."],
            ["3", "Kadın emeğine destek olun", "Siparişiniz doğrudan üretici dayanışmasını büyütür."],
          ].map(([step, title, text]) => (
            <div key={step} className="bg-card border border-border-warm rounded-2xl p-6">
              <div className="h-10 w-10 rounded-full bg-primary text-background-light flex items-center justify-center font-bold">
                {step}
              </div>
              <h3 className="mt-5 font-bold text-xl text-foreground-light">
                {title}
              </h3>
              <p className="mt-2 text-sm text-foreground-light/75 leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
