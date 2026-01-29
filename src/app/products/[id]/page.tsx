import { getServerSupabase } from "@/lib/supabaseServer";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Rating from "@/components/ui/Rating";
import { addToCart } from "@/actions/cart";
import { addReview } from "@/actions/reviews";

type Params = { params: Promise<{ id: string }> };

export default async function ProductDetailPage({ params }: Params) {
  const { id } = await params;
  const supabase = await getServerSupabase();
  const { data } = await supabase
    .from("products")
    .select("id,name,price,description,brand,ingredients,skin_type,how_to_use,size,image,concerns,category,tokopedia_url,shopee_url")
    .eq("id", id)
    .maybeSingle();

  const product = data ?? {
    id,
    name: "Product",
    price: 0,
    description: "",
    rating: 0,
    brand: "",
    ingredients: [] as string[],
    skin_type: [] as string[],
    how_to_use: "",
    size: "",
    image: undefined as string | undefined,
    concerns: [] as string[],
    category: "",
    tokopedia_url: null as string | null,
    shopee_url: null as string | null,
  };

  const ingredients: string[] = Array.isArray(product.ingredients) ? product.ingredients : [];
  const skinTypeText = Array.isArray(product.skin_type) ? product.skin_type.join(", ") : String(product.skin_type ?? "All");

  function formatRp(n: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
  }
  const ratingVal = Number((product as any)?.rating);
  const hasRating = Number.isFinite(ratingVal);

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="relative aspect-square bg-brand-secondary">
              {product.image ? (
                <Image src={product.image as string} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="h-full w-full" />
              )}
            </div>
          </Card>
          <div>
            <div className="text-3xl font-semibold text-brand-dark">{product.name}</div>
            <div className="mt-2 text-brand-dark">{formatRp(Number(product.price) || 0)}</div>
            {hasRating ? <Rating className="mt-3" value={ratingVal} /> : null}
            <div className="mt-4 text-sm text-brand-light">{product.description}</div>
            <div className="mt-6">
              <div className="text-sm font-semibold text-brand-dark">Ingredients</div>
              <div className="mt-2 text-sm text-brand-light">{ingredients.join(", ") || "N/A"}</div>
            </div>
            <div className="mt-6">
              <div className="text-sm font-semibold text-brand-dark">Skin Type</div>
              <div className="mt-2 text-sm text-brand-light">{skinTypeText || "All"}</div>
            </div>
            {product.how_to_use ? (
              <div className="mt-6">
                <div className="text-sm font-semibold text-brand-dark">How to use</div>
                <div className="mt-2 text-sm text-brand-light">{product.how_to_use}</div>
              </div>
            ) : null}
            {product.size ? (
              <div className="mt-6">
                <div className="text-sm font-semibold text-brand-dark">Size</div>
                <div className="mt-2 text-sm text-brand-light">{product.size}</div>
              </div>
            ) : null}
            <div className="mt-8 flex items-center gap-3">
              <form action={addToCart}>
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="qty" value={1} />
                <Button type="submit">Add to Cart</Button>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <div className="text-lg font-semibold text-brand-dark">Write a review</div>
            <form action={addReview} className="mt-4 space-y-3">
              <input type="hidden" name="productId" value={product.id} />
              <div>
                <label className="block text-sm text-brand-light">Rating</label>
                <input type="number" name="rating" min={1} max={5} defaultValue={5} className="mt-1 w-24 rounded-2xl border border-neutral-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-brand-light">Comment</label>
                <textarea name="comment" className="mt-1 w-full rounded-2xl border border-neutral-200 px-3 py-2 text-sm" rows={3} />
              </div>
              <Button type="submit">Submit review</Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
