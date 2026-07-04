import type { Metadata } from "next";
import { Caveat, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "latin-ext"],
  weight: "700",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gebzekoykadinlari.com"), // Use appropriate domain
  title: "Gebze Köy Kadınları Platformu",
  description: "Gebze Köy Kadınları Platformu resmi web sitesi. Doğal ürünler, atölyeler ve dayanışma.",
  openGraph: {
    title: "Gebze Köy Kadınları Platformu",
    description: "Gebze Köy Kadınları Platformu resmi web sitesi. Doğal ürünler, atölyeler ve dayanışma.",
    url: "https://gebzekoykadinlari.com",
    siteName: "Gebze Köy Kadınları Platformu",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'Gebze Köy Kadınları Platformu Logosu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gebze Köy Kadınları Platformu',
    description: 'Gebze Köy Kadınları Platformu resmi web sitesi. Doğal ürünler, atölyeler ve dayanışma.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable}`}>
      <body className="flex flex-col min-h-screen antialiased bg-background text-foreground">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
      </body>
    </html>
  );
}
