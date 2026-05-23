"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/yonetim", label: "Yeni Paylaşım" },
    { href: "/yonetim/yonet", label: "Paylaşımları Yönet" },
    { href: "/yonetim/products", label: "Ürünleri Yönet" },
    { href: "/yonetim/forum", label: "Forum Onayı" },
    { href: "/yonetim/content", label: "Site İçeriğini Düzenle" },
  ];

  const activeItem = navItems.find((item) => item.href === pathname) || navItems[0];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden w-full bg-primary-dark text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <div>
          <span className="text-xs text-secondary font-bold tracking-wider uppercase block">Yönetim Paneli</span>
          <span className="text-lg font-bold truncate block max-w-[200px] sm:max-w-[300px]">
            {activeItem.label}
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="py-2 px-3 text-white hover:text-secondary focus:outline-none transition-colors border border-white/20 rounded-lg flex items-center justify-center gap-2"
        >
          <span className="text-sm font-semibold">Menü</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-primary-dark border-b border-white/10 text-white w-full absolute top-[68px] left-0 z-45 shadow-xl transition-all">
          <nav className="p-4 space-y-2 flex flex-col">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`block py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-secondary text-primary-dark font-bold shadow-inner"
                      : "hover:bg-primary/40 text-white/90"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/"
                onClick={handleLinkClick}
                className="block py-3 px-4 rounded-xl text-sm font-semibold text-center border border-white/20 text-white hover:bg-white/10 transition-all"
              >
                Siteye Dön
              </Link>
              <LogoutButton />
            </div>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 w-full bg-primary-dark text-white p-6 shadow-xl flex-col justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-black mb-8 tracking-wider text-secondary">YÖNETİM PANELI</h2>
          <nav className="space-y-3 flex flex-col">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-secondary text-primary-dark font-bold shadow-lg scale-102"
                      : "hover:bg-primary/45 hover:translate-x-1 text-white/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/"
              className="block py-3 px-4 rounded-xl text-sm font-semibold text-center border border-white/20 text-white hover:bg-white/10 transition-all mt-8"
            >
              Siteye Dön
            </Link>
          </nav>
        </div>
        <div>
          <LogoutButton />
        </div>
      </div>
    </>
  );
}
