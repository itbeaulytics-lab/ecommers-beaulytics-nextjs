import Hero from "@/components/Hero";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProductCard from "@/components/ProductCard";
import { getServerSupabaseRSC } from "@/lib/supabaseServerRSC";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const supabase = await getServerSupabaseRSC();
  const { data: featured } = await supabase
    .from("products")
    .select("id,name,price,image")
    .eq("featured", true)
    .limit(4);
  let rows = featured ?? [];
  if (!rows || rows.length === 0) {
    const { data: top } = await supabase
      .from("products")
      .select("id,name,price,image")
      .limit(4);
    rows = top ?? [];
  }
  const items = rows.map((r: any) => ({ id: String(r.id), name: r.name, price: Number(r.price) || 0, image: r.image || "/vercel.svg", rating: 0 }));
  return (
    <main>
      <Hero />
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <Badge>Best Sellers</Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-brand-dark">Produk unggulan</h2>
            <p className="mt-2 text-sm text-brand-light">Pilihan populer dengan rating tinggi.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={{ id: p.id, name: p.name, price: p.price, image: p.image, rating: p.rating }} />
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-brand-dark">Bahan premium</h3>
              <p className="mt-2 text-sm text-brand-light">Niacinamide, Vitamin C, Hyaluronic Acid dengan standar kualitas tinggi.</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-brand-dark">Aman untuk kulit</h3>
              <p className="mt-2 text-sm text-brand-light">Dermatologically tested, cocok untuk semua jenis kulit.</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-brand-dark">Ritual minimalis</h3>
              <p className="mt-2 text-sm text-brand-light">Rutinitas sederhana, hasil maksimal.</p>
            </Card>
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <Badge variant="outline">Testimonials</Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-brand-dark">Apa kata mereka</h2>
            <p className="mt-2 text-sm text-brand-light">Kulit lembut, glowing, dan sehat.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <p className="text-sm text-brand-dark">&quot;Produk ini bikin kulitku halus dan cerah. Teksturnya nyaman.&quot;</p>
                <div className="mt-3 text-xs text-brand-light">— Beaulytics Customer</div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
