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
  title: "Gebze Köy Kadınları Platformu",
  description: "Gebze Köy Kadınları Platformu resmi web sitesi. Doğal ürünler, atölyeler ve dayanışma.",
  icons: {
    icon: '/logo.png',
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
