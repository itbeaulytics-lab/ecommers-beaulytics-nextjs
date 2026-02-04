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
    <Card className="overflow-hidden group">
      <Link href={`/products/${product.id}`} className="relative block aspect-square bg-white">
        {product.image ? (
          <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-200 group-hover:scale-105" />
        ) : (
          <div className="h-full w-full" />
        )}
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.id}`} className="text-sm font-semibold text-brand-dark hover:underline">
          {product.name}
        </Link>
        <div className="mt-1 text-sm text-brand-dark">{formatRp(product.price)}</div>
        {product.rating !== undefined && (
          <Rating className="mt-2" value={product.rating} />
        )}
        <div className="mt-4 flex items-center gap-2">
          <Button type="button" onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category, ingredients: product.ingredients })} aria-label={`Add ${product.name} to cart`}>Add to Cart</Button>
          <Button
            variant="ghost"
            onClick={() => (selected ? removeCompare(product.id) : addCompare({ id: product.id, name: product.name, image: product.image ?? "/vercel.svg" }))}
          >
            {selected ? "Remove Compare" : "Add to Compare"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

