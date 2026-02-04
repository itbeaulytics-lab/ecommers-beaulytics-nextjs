import { Suspense } from "react";
import FilterBar from "@/components/FilterBar";
import ProductGrid from "@/components/ProductGrid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductsPage() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-dark">Products</h1>
          <p className="mt-2 text-sm text-brand-light">Beaulytics skincare catalog.</p>
        </div>
        <Suspense fallback={<div className="text-sm text-brand-light">Loading filters…</div>}>
          <FilterBar />
        </Suspense>
        <div className="mt-6">
          <Suspense fallback={<div className="text-sm text-brand-light">Loading products…</div>}>
            <ProductGrid />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
