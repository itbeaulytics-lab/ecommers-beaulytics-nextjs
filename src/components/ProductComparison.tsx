"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/shared/ui/Button";
import Badge from "@/shared/ui/Badge";
import Rating from "@/shared/ui/Rating";
import type { Product } from "@/features/products/types";
import { useCartStore } from "@/features/cart/store";
import { useCompareStore } from "@/features/compare/store";
import { getSupabaseClient } from "@/shared/lib/supabaseClient";
import { analyzeIngredients, type UserSkinProfile } from "@/features/products/lib/ingredientAnalyzer";
type Props = {
  products?: Product[];
  userProfile?: UserSkinProfile | null;
};

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

export default function ProductComparison({ products: propProducts, userProfile }: Props) {
  const compareItems = useCompareStore((s) => s.items);
  const ids = useMemo(() => compareItems.map((i) => i.id), [compareItems]);
  const removeFromCompare = useCompareStore((s) => s.remove);
  const addToCart = useCartStore((s) => s.add);

  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const items = propProducts ?? fetchedProducts;

  useEffect(() => {
    if (propProducts) return;
    let active = true;
    async function run() {
      if (ids.length === 0) {
        if (active) setFetchedProducts([]);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("products")
          .select("id,name,price,ingredients,concerns,skin_type,size,image,rating")
          .in("id", ids);
        if (error) throw error;
        const rows = (data || []).map((r: any) => ({
          id: String(r.id),
          name: r.name,
          price: Number(r.price) || 0,
          image: r.image || "/vercel.svg",
          rating: Number(r.rating) || 0,
          skinType: Array.isArray(r.skin_type) ? r.skin_type.join(", ") : String(r.skin_type ?? ""),
          keyIngredients: Array.isArray(r.ingredients) ? r.ingredients : [],
          ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
          benefits: Array.isArray(r.concerns) ? r.concerns : [],
          size: String(r.size ?? ""),
          category: "",
        })) as Product[];
        if (active) setFetchedProducts(rows);
      } catch (e: any) {
        if (active) setError(e.message || "Failed to load compared products");
      } finally {
        if (active) setLoading(false);
      }
    }
    run();
    return () => {
      active = false;
    };
  }, [ids, propProducts]);

  const bestPrice = items.length ? Math.min(...items.map((p) => p.price)) : undefined;
  const bestRating = items.length ? Math.max(...items.map((p) => p.rating)) : undefined;

  if (!propProducts && error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="my-4 rounded-2xl bg-brand-secondary px-4 py-2 text-sm text-brand-dark ring-1 ring-black/5">{error}</div>
      </div>
    );
  }

  if (!propProducts && loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="my-4 text-sm text-brand-light text-center">Loading…</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-brand-dark">Compare Products</h1>
            <p className="mt-2 text-sm text-brand-light">Highlight shows better value per metric.</p>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-brand-light">No products selected for comparison.</p>
            <div className="mt-4">
              <Link href="/products" className="inline-flex rounded-2xl bg-brand-primary px-5 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover">Browse products</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-dark">Compare Products</h1>
          <p className="mt-2 text-sm text-brand-light">Highlight shows better value per metric.</p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] ring-1 ring-neutral-200/50">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm table-fixed">
              <thead>
                <tr>
                  <th className="w-56 bg-white p-6 border-b border-neutral-100 font-semibold text-brand-dark align-bottom pb-6">
                    <span className="text-lg tracking-tight">Features</span>
                  </th>
                  {items.map((p) => (
                    <th key={p.id} className="w-80 p-6 text-center border-b border-l border-neutral-100 align-top relative bg-white">
                      <button
                        onClick={() => removeFromCompare(p.id)}
                        className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-50 text-neutral-400 hover:bg-neutral-100 hover:text-brand-dark transition-colors"
                        title="Remove from comparison"
                      >
                        <span className="sr-only">Remove</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="relative mx-auto mt-2 h-40 w-40 overflow-hidden rounded-2xl bg-neutral-50 ring-1 ring-neutral-100/50">
                        {p.image ? (
                          <Image src={p.image} alt={p.name} fill className="object-cover p-2" />
                        ) : (
                          <div className="h-full w-full bg-neutral-100 flex items-center justify-center text-neutral-400">No Image</div>
                        )}
                      </div>
                      <div className="mt-4 font-semibold text-brand-dark leading-snug line-clamp-2 min-h-[3rem] text-base px-2">{p.name}</div>
                      <div className="mt-4 px-2">
                        <Button
                          className="w-full text-sm font-medium py-2.5 h-auto rounded-xl shadow-sm hover:shadow transition-all"
                          onClick={() => addToCart({
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            image: p.image,
                            category: p.category,
                            ingredients: p.ingredients
                          })}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {/* Price */}
                <tr className="group">
                  <th className="bg-neutral-50/50 p-6 font-medium text-brand-dark transition-colors group-hover:bg-neutral-50/80">Price</th>
                  {items.map((p) => (
                    <td key={p.id} className={`p-6 text-center border-l border-neutral-100 transition-colors ${p.price === bestPrice ? "bg-emerald-50/30" : "group-hover:bg-neutral-50/30"}`}>
                      <span className={`font-semibold text-base ${p.price === bestPrice ? "text-emerald-600" : "text-brand-dark"}`}>
                        {formatRp(p.price)}
                      </span>
                      {p.price === bestPrice && <div className="text-[10px] uppercase font-bold text-emerald-500 mt-1.5 tracking-wider">Best Value</div>}
                    </td>
                  ))}
                </tr>

                {/* Rating & Ulasan */}
                <tr className="group">
                  <th className="bg-neutral-50/50 p-6 font-medium text-brand-dark transition-colors group-hover:bg-neutral-50/80">Rating & Ulasan</th>
                  {items.map((p) => (
                    <td key={p.id} className={`p-6 text-center border-l border-neutral-100 transition-colors ${p.rating === bestRating ? "bg-amber-50/30" : "group-hover:bg-neutral-50/30"}`}>
                      <div className="flex flex-col items-center gap-1.5">
                        <Rating value={p.rating || 0} />
                        <span className="text-brand-light text-xs font-medium">
                          {p.rating || 0} / 5
                        </span>
                      </div>
                      {p.rating === bestRating && <div className="text-[10px] uppercase font-bold text-amber-500 mt-1.5 tracking-wider">Highest Rated</div>}
                    </td>
                  ))}
                </tr>

                {/* Analisa Kandungan (AI) */}
                <tr className="group">
                  <th className="bg-neutral-50/50 p-6 font-medium text-brand-dark align-top transition-colors group-hover:bg-neutral-50/80 pt-6">
                    <div>Analisa Kandungan</div>
                    <div className="text-xs text-brand-light font-normal mt-1.5 leading-relaxed">AI-powered ingredient analysis based on your skin profile</div>
                  </th>
                  {items.map((p) => {
                    const analysis = analyzeIngredients(p.ingredients || [], userProfile);
                    return (
                      <td key={p.id} className="p-6 align-top text-left border-l border-neutral-100 transition-colors group-hover:bg-neutral-50/30">
                        {analysis.length > 0 ? (
                          <div className="flex flex-wrap gap-2 justify-start">
                            {analysis.map((badge, idx) => {
                              let colors = "bg-neutral-50 text-neutral-600 border-neutral-200";
                              if (badge.status === "negative") colors = "bg-rose-50 text-rose-600 border-rose-200/60";
                              if (badge.status === "positive") colors = "bg-emerald-50 text-emerald-600 border-emerald-200/60";
                              if (badge.status === "highlight") colors = "bg-brand-primary/10 text-brand-primary border-brand-primary/20";

                              return (
                                <Badge key={idx} variant="outline" className={`${colors} border shadow-sm font-medium px-2.5 py-1 text-xs`} title={badge.label}>
                                  {badge.status === "negative" && <span className="mr-1.5">⚠️</span>}
                                  {badge.status === "positive" && <span className="mr-1.5 pt-0.5">✨</span>}
                                  {badge.status === "highlight" && <span className="mr-1.5 pt-0.5">⭐</span>}
                                  {badge.label}
                                </Badge>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex justify-center items-center h-full min-h-[4rem] text-sm text-neutral-400 italic">
                            Belum ada profil kulit
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Skin Type */}
                <tr className="group">
                  <th className="bg-neutral-50/50 p-6 font-medium text-brand-dark transition-colors group-hover:bg-neutral-50/80">Skin Type</th>
                  {items.map((p) => (
                    <td key={p.id} className="p-6 text-center border-l border-neutral-100 text-brand-dark font-medium transition-colors group-hover:bg-neutral-50/30">
                      {p.skinType || "-"}
                    </td>
                  ))}
                </tr>

                {/* Size */}
                <tr className="group">
                  <th className="bg-neutral-50/50 p-6 font-medium text-brand-dark transition-colors group-hover:bg-neutral-50/80">Size</th>
                  {items.map((p) => (
                    <td key={p.id} className="p-6 text-center border-l border-neutral-100 text-brand-light transition-colors group-hover:bg-neutral-50/30">
                      {p.size || "-"}
                    </td>
                  ))}
                </tr>

                {/* Benefits */}
                <tr className="group">
                  <th className="bg-neutral-50/50 p-6 font-medium text-brand-dark align-top transition-colors group-hover:bg-neutral-50/80">Benefits</th>
                  {items.map((p) => (
                    <td key={p.id} className="p-6 align-top text-left border-l border-neutral-100 transition-colors group-hover:bg-neutral-50/30">
                      {p.benefits && p.benefits.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {p.benefits.map((b, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-emerald-500 mt-0.5">✓</span>
                              <span className="text-sm text-brand-dark">{b}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-sm text-brand-light">-</div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Key Ingredients */}
                <tr className="group">
                  <th className="bg-neutral-50/50 p-6 font-medium text-brand-dark align-top transition-colors group-hover:bg-neutral-50/80">Key Ingredients</th>
                  {items.map((p) => (
                    <td key={p.id} className="p-6 align-top text-left border-l border-neutral-100 transition-colors group-hover:bg-neutral-50/30 pb-8">
                      <div className="flex flex-wrap gap-2 justify-start">
                        {p.keyIngredients && p.keyIngredients.length > 0 ? (
                          p.keyIngredients.map((ing, idx) => {
                            const allBadges = userProfile ? analyzeIngredients([ing], userProfile) : [];
                            const negativeBadges = allBadges.filter(b => b.status === "negative");
                            const hasWarning = negativeBadges.length > 0;
                            return (
                              <Badge
                                key={idx}
                                variant={hasWarning ? "outline" : "brand"}
                                className={hasWarning ? "bg-rose-50 text-rose-600 border-rose-200/60 border shadow-sm font-medium px-2.5 py-1 text-xs" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-medium px-2.5 py-1 text-xs border-transparent"}
                                title={hasWarning ? negativeBadges.map(w => w.label).join("\n") : undefined}
                              >
                                {hasWarning && <span className="mr-1.5">⚠️</span>}
                                {ing}
                              </Badge>
                            )
                          })
                        ) : (
                          <div className="w-full text-center text-sm text-brand-light">-</div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
