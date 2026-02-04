"use client";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

import { generateRoutine } from "@/lib/routineGenerator";
import RoutineSuggestion from "@/components/RoutineSuggestion";
import { useMemo } from "react";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const update = useCartStore((s) => s.update);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const routine = useMemo(() => generateRoutine(items), [items]);

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-dark">Your Cart</h1>
          <p className="mt-2 text-sm text-brand-light">Beaulytics items waiting to pamper your skin.</p>
        </div>
        {items.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto h-16 w-16 rounded-full bg-brand-secondary" />
            <p className="mt-4 text-sm text-brand-light">Your cart is empty.</p>
            <Link href="/products" className="mt-6 inline-flex rounded-2xl bg-brand-primary px-5 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover">Browse products</Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                    <div>
                      <div className="text-sm font-medium text-brand-dark">{item.name}</div>
                      <div className="text-xs text-brand-light">Qty {item.qty}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(e) => update(item.id, Number(e.target.value))}
                        className="w-16 rounded-2xl border border-neutral-200 px-2 py-1 text-sm"
                        aria-label={`Update quantity for ${item.name}`}
                      />
                      <Button variant="ghost" type="button" onClick={() => remove(item.id)}>Remove</Button>
                      <div className="text-sm font-semibold text-brand-dark">{formatRp(item.price * item.qty)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <RoutineSuggestion routine={routine} />
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5 h-fit">
              <div className="flex items-center justify-between">
                <div className="text-sm text-brand-light">Subtotal</div>
                <div className="text-sm font-semibold text-brand-dark">{formatRp(subtotal)}</div>
              </div>
              <Button className="mt-6 w-full" type="button" onClick={clear}>Clear Cart</Button>
              <Button className="mt-3 w-full" type="button" disabled>Checkout (demo)</Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
