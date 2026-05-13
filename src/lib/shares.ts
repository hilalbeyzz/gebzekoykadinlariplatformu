export interface Share {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: "Duyuru" | "Etkinlik" | "Hikaye" | "Proje";
  status: "published" | "draft";
  createdAt: string;
}

export const SHARES_STORAGE_KEY = "gebze-koy-kadinlari-shares";

export const DEFAULT_SHARES: Share[] = [
  {
    id: "kermes-hazirligi",
    title: "Köy Kermesi Hazırlıkları Başladı",
    summary:
      "Kadın üreticilerimizin el emeği ürünleri için bahar kermesi hazırlıkları devam ediyor.",
    content:
      "Platform gönüllülerimiz ve köy kadınlarımız bahar kermesi için üretim planını oluşturdu. Erişte, reçel, tarhana ve el işi ürünler kermes standında yer alacak.",
    category: "Duyuru",
    status: "published",
    createdAt: new Date().toISOString(),
  },
  {
    id: "uretim-atolyesi",
    title: "Üretim Atölyesinde Yeni Dönem",
    summary:
      "Geleneksel üretim bilgisini genç kuşaklarla buluşturacak atölye programı açılıyor.",
    content:
      "Yeni dönem atölyelerinde gıda hijyeni, paketleme, dijital satış ve ürün fotoğrafı konularında uygulamalı çalışmalar yapılacak.",
    category: "Etkinlik",
    status: "published",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function createShareId(title: string) {
  const normalized = title
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${normalized || "paylasim"}-${Date.now()}`;
}

export function sortSharesByDate(shares: Share[]) {
  return [...shares].sort(
    (first, second) =>
      new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
  );
}
