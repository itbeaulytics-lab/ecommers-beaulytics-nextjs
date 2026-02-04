'use client';

import Link from "next/link";
import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useCartStore } from "@/store/cartStore";

type NavbarProps = {
  user: User | null;
};

export default function Navbar({ user }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const count = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0));
  const userInitial = user?.email?.[0]?.toUpperCase() ?? "";
  return (
    <nav className="sticky top-0 z-50 border-b border-brand-primary/20 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="inline-flex items-center rounded-full bg-brand-secondary px-3 py-1 text-sm font-semibold text-brand-dark ring-1 ring-black/5">Beaulytics</Link>
          </div>
          <div className="hidden md:flex items-center justify-center gap-6">
            <Link href="/" className="text-sm font-medium text-brand-light hover:text-brand-dark">Home</Link>
            <Link href="/products" className="text-sm font-medium text-brand-light hover:text-brand-dark">Products</Link>
            <Link href="/compare" className="text-sm font-medium text-brand-light hover:text-brand-dark">Compare</Link>
            <Link href="/Ai" className="text-sm font-medium text-brand-light hover:text-brand-dark">AI Chat</Link>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Search" className="hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-brand-secondary text-brand-dark ring-1 ring-black/5">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            {user ? (
              <Link
                aria-label="Account"
                href="/dashboard"
                className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-secondary text-brand-dark ring-1 ring-black/5"
                title={user.email || "Dashboard"}
              >
                <span className="text-sm font-semibold">{userInitial || "•"}</span>
              </Link>
            ) : (
              <Link
                aria-label="Login"
                href="/auth/login"
                className="hidden md:inline-flex items-center rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white ring-1 ring-brand-primary/50 hover:bg-brand-primary-hover"
              >
                Login
              </Link>
            )}
            <Link aria-label="Cart" href="/cart" className="hidden md:flex relative h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-white ring-1 ring-brand-primary/50 hover:bg-brand-primary-hover">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
                <path d="M2 3h3l3.6 12.5a2 2 0 0 0 2 1.5h7.4a2 2 0 0 0 2-1.6l1.3-7.9H6" />
              </svg>
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold text-brand-dark">{count}</span>
            </Link>
            <button aria-label="Menu" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-white ring-1 ring-brand-primary/50 hover:bg-brand-primary-hover">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
        <div className={(open ? "grid" : "hidden") + " md:hidden grid-cols-1 gap-2 border-t border-brand-primary/20 py-3"}>
          <Link href="/" className="rounded-full px-4 py-2 text-sm font-medium text-brand-light hover:bg-brand-secondary">Home</Link>
          <Link href="/products" className="rounded-full px-4 py-2 text-sm font-medium text-brand-light hover:bg-brand-secondary">Products</Link>
          <Link href="/compare" className="rounded-full px-4 py-2 text-sm font-medium text-brand-light hover:bg-brand-secondary">Compare</Link>
          <Link href="/Ai" className="rounded-full px-4 py-2 text-sm font-medium text-brand-light hover:bg-brand-secondary">AI Chat</Link>
          <div className="mt-2 flex items-center gap-2">
            <button aria-label="Search" className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-secondary text-brand-dark ring-1 ring-black/5">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            {user ? (
              <Link
                aria-label="Account"
                href="/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-secondary text-brand-dark ring-1 ring-black/5"
                title={user.email || "Dashboard"}
              >
                <span className="text-sm font-semibold">{userInitial || "•"}</span>
              </Link>
            ) : (
              <Link
                aria-label="Login"
                href="/auth/login"
                className="flex items-center rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white ring-1 ring-brand-primary/50 hover:bg-brand-primary-hover"
              >
                Login
              </Link>
            )}
            <Link aria-label="Cart" href="/cart" className="flex relative h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-white ring-1 ring-brand-primary/50 hover:bg-brand-primary-hover">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
                <path d="M2 3h3l3.6 12.5a2 2 0 0 0 2 1.5h7.4a2 2 0 0 0 2-1.6l1.3-7.9H6" />
              </svg>
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold text-brand-dark">{count}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
