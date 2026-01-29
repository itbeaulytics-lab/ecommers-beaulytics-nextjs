"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getSupabaseClient } from "@/lib/supabaseClient";

type Row = { id: string; name: string; price: number; image?: string; rating?: number; category?: string };

export default function ProductGrid() {
  const params = useSearchParams();
  const key = params.toString();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let active = true;
    async function run() {
      setLoading(true);
      setError("");
      try {
        const supabase = getSupabaseClient();
        const category = params.get("category") || undefined;
        const sort = params.get("sort") || "new";
        const priceMin = params.get("min") ? Number(params.get("min")) : undefined;
        const priceMax = params.get("max") ? Number(params.get("max")) : undefined;

        let query = supabase
          .from("products")
          .select("id,name,price,category,image");

        if (category) query = query.eq("category", category);
        if (priceMin !== undefined) query = query.gte("price", priceMin);
        if (priceMax !== undefined) query = query.lte("price", priceMax);

        const { data, error } = await query;
        if (error) throw error;
        let list: Row[] = (data || []).map((r: any) => ({
          id: String(r.id),
          name: r.name,
          price: Number(r.price) || 0,
          image: r.image || undefined,
          rating: r.rating !== undefined && r.rating !== null ? Number(r.rating) : undefined,
          category: r.category || undefined,
        }));
        if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
        if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
        if (sort === "rating") list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        if (active) setItems(list);
      } catch (e: any) {
        if (active) setError(e.message || "Failed to load products");
      } finally {
        if (active) setLoading(false);
      }
    }
    run();
    return () => {
      active = false;
    };
  }, [key, params]);

  return (
    <div key={key}>
      {error ? (
        <div className="mb-4 rounded-2xl bg-brand-secondary px-4 py-2 text-sm text-brand-dark ring-1 ring-black/5">{error}</div>
      ) : null}
      {loading ? (
        <div className="text-sm text-brand-light">Loading products…</div>
      ) : null}
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={{ id: p.id, name: p.name, price: p.price, image: p.image, rating: p.rating }} />
        ))}
      </div>
    </div>
  );
}
