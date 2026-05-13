"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  DEFAULT_SHARES,
  SHARES_STORAGE_KEY,
  Share,
  createShareId,
  sortSharesByDate,
} from "@/lib/shares";

type ShareForm = Omit<Share, "id" | "createdAt">;

const emptyForm: ShareForm = {
  title: "",
  summary: "",
  content: "",
  category: "Duyuru",
  status: "published",
};

export default function AdminSharesPage() {
  const [shares, setShares] = useState<Share[]>(DEFAULT_SHARES);
  const [form, setForm] = useState<ShareForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const storedShares = window.localStorage.getItem(SHARES_STORAGE_KEY);

    if (!storedShares) {
      window.localStorage.setItem(SHARES_STORAGE_KEY, JSON.stringify(DEFAULT_SHARES));
      return;
    }

    try {
      setShares(JSON.parse(storedShares) as Share[]);
    } catch {
      setShares(DEFAULT_SHARES);
    }
  }, []);

  const saveShares = (nextShares: Share[]) => {
    setShares(nextShares);
    window.localStorage.setItem(SHARES_STORAGE_KEY, JSON.stringify(nextShares));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingId) {
      saveShares(
        shares.map((share) =>
          share.id === editingId
            ? {
                ...share,
                ...form,
              }
            : share
        )
      );
      resetForm();
      return;
    }

    const nextShare: Share = {
      id: createShareId(form.title),
      createdAt: new Date().toISOString(),
      ...form,
    };

    saveShares([nextShare, ...shares]);
    resetForm();
  };

  const startEditing = (share: Share) => {
    setEditingId(share.id);
    setForm({
      title: share.title,
      summary: share.summary,
      content: share.content,
      category: share.category,
      status: share.status,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Bu paylaşımı silmek istediğinize emin misiniz?")) return;
    saveShares(shares.filter((share) => share.id !== id));
    if (editingId === id) resetForm();
  };

  const handleReset = () => {
    if (!window.confirm("Paylaşımları varsayılan listeye döndürmek istediğinize emin misiniz?")) return;
    saveShares(DEFAULT_SHARES);
    resetForm();
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-background-light py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/admin"
            className="text-primary font-medium hover:underline flex items-center gap-2 mb-4 w-fit"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Panele Dön
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground-dark">
              Paylaşım Yönetimi
            </h1>
            <p className="text-foreground-light/80 mt-2">
              Duyuru, etkinlik, hikaye ve proje paylaşımlarını buradan ekleyip
              düzenleyebilirsiniz.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.35fr]">
            <form
              onSubmit={handleSubmit}
              className="bg-card border border-border-warm rounded-2xl p-6 shadow-sm h-fit"
            >
              <h2 className="text-xl font-bold text-foreground-dark mb-6">
                {editingId ? "Paylaşımı Düzenle" : "Yeni Paylaşım Ekle"}
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground-dark mb-2">
                    Başlık
                  </label>
                  <input
                    required
                    value={form.title}
                    onChange={(event) => setForm({ ...form, title: event.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border-warm bg-background-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Örn. Yeni atölye duyurusu"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground-dark mb-2">
                      Kategori
                    </label>
                    <select
                      value={form.category}
                      onChange={(event) =>
                        setForm({ ...form, category: event.target.value as Share["category"] })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border-warm bg-background-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="Duyuru">Duyuru</option>
                      <option value="Etkinlik">Etkinlik</option>
                      <option value="Hikaye">Hikaye</option>
                      <option value="Proje">Proje</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground-dark mb-2">
                      Durum
                    </label>
                    <select
                      value={form.status}
                      onChange={(event) =>
                        setForm({ ...form, status: event.target.value as Share["status"] })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border-warm bg-background-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="published">Yayında</option>
                      <option value="draft">Taslak</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground-dark mb-2">
                    Kısa Özet
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.summary}
                    onChange={(event) => setForm({ ...form, summary: event.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border-warm bg-background-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    placeholder="Kartlarda görünecek kısa açıklama"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground-dark mb-2">
                    Paylaşım Metni
                  </label>
                  <textarea
                    required
                    rows={7}
                    value={form.content}
                    onChange={(event) => setForm({ ...form, content: event.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border-warm bg-background-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    placeholder="Paylaşımın tam metni"
                  />
                </div>
              </div>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-background-light py-3 rounded-full font-bold shadow-md hover:bg-primary-dark transition-colors"
                >
                  {editingId ? "Değişiklikleri Kaydet" : "Paylaşımı Yayınla"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-full border border-border-warm px-5 py-3 font-bold text-foreground-light hover:bg-background-light transition-colors"
                  >
                    Vazgeç
                  </button>
                )}
              </div>
            </form>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <h2 className="text-xl font-bold text-foreground-dark">
                  Mevcut Paylaşımlar
                </h2>
                <button
                  onClick={handleReset}
                  className="self-start rounded-full border border-border-warm bg-card px-4 py-2 text-sm font-semibold text-foreground-dark hover:bg-background-light transition-colors"
                >
                  Varsayılana Döndür
                </button>
              </div>

              <div className="space-y-5">
                {sortSharesByDate(shares).map((share) => (
                  <article
                    key={share.id}
                    className="bg-card border border-border-warm rounded-2xl p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="rounded-full bg-secondary/45 px-3 py-1 text-xs font-bold text-primary-dark">
                        {share.category}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          share.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {share.status === "published" ? "Yayında" : "Taslak"}
                      </span>
                      <time className="text-xs text-foreground-light/60">
                        {new Date(share.createdAt).toLocaleDateString("tr-TR")}
                      </time>
                    </div>
                    <h3 className="text-xl font-bold text-foreground-light">
                      {share.title}
                    </h3>
                    <p className="mt-2 text-sm text-foreground-light/75 leading-relaxed">
                      {share.summary}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        onClick={() => startEditing(share)}
                        className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(share.id)}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
