"use client";
import Link from "next/link";

export default function AuthIndex() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-dark">Account</h1>
          <p className="mt-2 text-sm text-brand-light">Sign in or create your Beaulytics account.</p>
        </div>
        <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between">
            <Link href="/auth/login" className="rounded-full bg-brand-primary px-5 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover">Login</Link>
            <Link href="/auth/register" className="rounded-full border border-brand-primary/40 px-5 py-2 text-sm font-medium text-brand-dark hover:bg-brand-secondary">Register</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
