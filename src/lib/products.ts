export interface Product {
  id: string;
  name: string;
  producer: string;
  price: string;
  description: string;
  tone: "olive" | "earth" | "wheat" | "cream";
}

export const PRODUCTS_STORAGE_KEY = "gebze-koy-kadinlari-products";

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "eriste",
    name: "Ev Yapımı Erişte",
    producer: "Gebze köylerinden el emeği",
    price: "250 TL / kg",
    description:
      "Geleneksel usulle hazırlanan, kurutulmuş ve paketlenmiş ev eriştesi.",
    tone: "olive",
  },
  {
    id: "receller",
    name: "Mevsimlik Reçeller",
    producer: "Kadın üretici kolektifi",
    price: "180 TL / kavanoz",
    description:
      "Ayva, çilek ve incir gibi mevsim meyveleriyle küçük partiler halinde üretilir.",
    tone: "earth",
  },
  {
    id: "tarhana",
    name: "Tarhana",
    producer: "Köy mutfağı üretimi",
    price: "220 TL / kg",
    description: "Güneşte kurutulan, katkısız, geleneksel köy tarhanası.",
    tone: "wheat",
  },
  {
    id: "dokumalar",
    name: "El İşi Dokumalar",
    producer: "Yerel kadın atölyesi",
    price: "Fiyat sorunuz",
    description:
      "Mutfak örtüsü, kese ve küçük ev tekstili ürünleri siparişe göre hazırlanır.",
    tone: "cream",
  },
];

export function getProductToneClass(tone: Product["tone"]) {
  const toneClasses = {
    olive: "from-secondary/70 via-background-light to-primary/35",
    earth: "from-accent/30 via-secondary/60 to-background-light",
    wheat: "from-primary/30 via-secondary/70 to-card",
    cream: "from-accent/25 via-card to-primary/25",
  };

  return toneClasses[tone];
}
