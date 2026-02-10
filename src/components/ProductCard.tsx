"use client";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Rating from "@/components/ui/Rating";
import { useCompareStore } from "@/store/compareStore";
import { useCartStore } from "@/store/cartStore";

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    rating?: number;
    category?: string;
    ingredients?: string[];
  };
};

export default function ProductCard({ product }: Props) {
  const items = useCompareStore((s) => s.items);
  const addCompare = useCompareStore((s) => s.add);
  const removeCompare = useCompareStore((s) => s.remove);
  const selected = items.some((i) => i.id === product.id);
  const addToCart = useCartStore((s) => s.add);

  function formatRp(n: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
  }
  return (
    <Card className="group relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border-0">
      <Link href={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-neutral-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-neutral-300">No Image</div>
        )}
      </Link>
      <div className="p-5">
        {product.category && (
          <div className="mb-1 text-xs font-medium text-brand-primary uppercase tracking-wider">
            {product.category}
          </div>
        )}
        <Link href={`/products/${product.id}`} className="block text-base font-semibold text-brand-dark leading-tight hover:text-brand-primary transition-colors truncate" title={product.name}>
          {product.name}
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm font-medium text-brand-dark/80">{formatRp(product.price)}</div>
          {product.rating !== undefined && (
            <Rating value={product.rating} />
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button
            className="flex-1 py-2 text-xs"
            onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category, ingredients: product.ingredients })}
            aria-label={`Add ${product.name} to cart`}
          >
            Add
          </Button>
          <button
            type="button"
            onClick={() => (selected ? removeCompare(product.id) : addCompare({ id: product.id, name: product.name, image: product.image ?? "/vercel.svg" }))}
            className={`h-9 w-9 inline-flex items-center justify-center rounded-full transition-colors ${selected ? "bg-brand-secondary text-brand-primary ring-1 ring-brand-primary" : "bg-neutral-100 text-brand-light hover:bg-neutral-200"}`}
            title={selected ? "Remove from Compare" : "Add to Compare"}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
          </button>
        </div>
      </div>
    </Card>
  );
}
