"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_SHARES,
  SHARES_STORAGE_KEY,
  Share,
  sortSharesByDate,
} from "@/lib/shares";

export default function SharesPage() {
  const [shares, setShares] = useState<Share[]>(DEFAULT_SHARES);

  useEffect(() => {
    const storedShares = window.localStorage.getItem(SHARES_STORAGE_KEY);

    if (!storedShares) {
      return;
    }

    try {
      setShares(JSON.parse(storedShares) as Share[]);
    } catch {
      setShares(DEFAULT_SHARES);
    }
  }, []);

  const publishedShares = sortSharesByDate(shares).filter(
    (share) => share.status === "published"
  );

  return (
    <div className="min-h-screen bg-background-light">
      <section className="bg-primary-dark text-foreground-dark py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-secondary font-bold uppercase tracking-wider text-sm">
            Platform gündemi
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold">
            Paylaşımlar
          </h1>
          <p className="mt-5 text-lg text-foreground-dark/85 max-w-3xl">
            Duyurular, etkinlikler, üretici hikayeleri ve platformdan güncel
            haberler burada yayınlanır.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {publishedShares.map((share) => (
            <article
              key={share.id}
              className="bg-card border border-border-warm rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="rounded-full bg-secondary/45 px-3 py-1 text-xs font-bold text-primary-dark">
                  {share.category}
                </span>
                <time className="text-sm text-foreground-light/60">
                  {new Date(share.createdAt).toLocaleDateString("tr-TR")}
                </time>
              </div>
              <h2 className="text-2xl font-bold text-foreground-light">
                {share.title}
              </h2>
              <p className="mt-3 text-foreground-light/75 font-medium">
                {share.summary}
              </p>
              <p className="mt-5 text-foreground-light/80 leading-relaxed whitespace-pre-wrap">
                {share.content}
              </p>
            </article>
          ))}

          {publishedShares.length === 0 && (
            <div className="bg-card border border-border-warm rounded-2xl p-12 text-center text-foreground-light/70">
              Henüz yayınlanmış paylaşım bulunmuyor.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
