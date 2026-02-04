"use client";
import Image from "next/image";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { analyzeIngredients } from "@/lib/ingredientMatcher";
import type { UserProfile } from "@/types/user";

type Props = {
  products?: Product[];
  userProfile?: UserProfile | null;
};

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

export default function ProductComparison({ products, userProfile }: Props) {
  const items = products ?? [];
  const bestPrice = items.length ? Math.min(...items.map((p) => p.price)) : undefined;
  const bestRating = items.length ? Math.max(...items.map((p) => p.rating)) : undefined;
  const cols = Math.max(1, Math.min(3, items.length || 3));
  const gridCols = cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-2" : "grid-cols-3";
  const addToCart = useCartStore((s) => s.add);
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-dark">Compare Products</h1>
          <p className="mt-2 text-sm text-brand-light">Highlight shows better value per metric.</p>
        </div>
        {items.length === 0 ? (
          <Card className="overflow-hidden p-8 text-center">
            <p className="text-sm text-brand-light">No products selected for comparison.</p>
            <div className="mt-4">
              <a href="/products" className="inline-flex rounded-2xl bg-brand-primary px-5 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover">Browse products</a>
            </div>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className={`grid ${gridCols} divide-y sm:divide-y-0 sm:divide-x`}>
              {items.map((p) => (
                <div key={p.id} className="p-6">
                  <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-2xl bg-white">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="mt-4 text-center text-sm font-semibold text-brand-dark">{p.name}</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className={(p.price === bestPrice ? "bg-brand-secondary " : "") + "rounded-xl p-2"}>
                      <div className="text-brand-light">Price</div>
                      <div className="font-semibold text-brand-dark">{formatRp(p.price)}</div>
                    </div>
                    <div className={(p.rating === bestRating ? "bg-brand-secondary " : "") + "rounded-xl p-2"}>
                      <div className="text-brand-light">Rating</div>
                      <div className="font-semibold text-brand-dark">{p.rating}</div>
                    </div>
                    <div className="rounded-xl p-2">
                      <div className="text-brand-light">Key Ingredients</div>
                      <div className="font-semibold text-brand-dark text-xs mt-1 space-y-1">
                        {p.keyIngredients.map((ing, idx) => {
                          const warnings = userProfile ? analyzeIngredients([ing], userProfile) : [];
                          const hasWarning = warnings.length > 0;
                          return (
                            <div key={idx} className={`flex items-start gap-1 ${hasWarning ? "text-red-500" : ""}`}>
                              {hasWarning && (
                                <span title={warnings.join("\n")} className="cursor-help text-red-600 font-bold">⚠️</span>
                              )}
                              <span>{ing}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="rounded-xl p-2">
                      <div className="text-brand-light">Benefits</div>
                      <div className="font-semibold text-brand-dark">{p.benefits.join(", ")}</div>
                    </div>
                    <div className="rounded-xl p-2">
                      <div className="text-brand-light">Skin Type</div>
                      <div className="font-semibold text-brand-dark">{p.skinType}</div>
                    </div>
                    <div className="rounded-xl p-2">
                      <div className="text-brand-light">Size</div>
                      <div className="font-semibold text-brand-dark">{p.size}</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Button type="button" aria-label={`Add ${p.name} to cart`} onClick={() => addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, category: p.category, ingredients: p.ingredients })}>Add to Cart</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}

