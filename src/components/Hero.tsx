import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-b from-brand-primary/20 to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-secondary px-3 py-1 text-xs font-medium text-brand-dark ring-1 ring-black/5">New • Honey Glow</div>
            <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-brand-dark">Skincare modern untuk glow lembut</h1>
            <p className="mt-4 text-base sm:text-lg text-brand-light">Formula minimalis, tekstur plush, dan packaging pastel terinspirasi ritual luxury.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button>Shop Now</Button>
              <Button variant="ghost">Explore New Arrivals</Button>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="row-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <div className="aspect-[2/3] rounded-2xl bg-white shadow-inner" />
                <div className="mt-4 h-2 w-24 rounded-full bg-brand-primary/60" />
                <div className="mt-2 h-2 w-16 rounded-full bg-brand-primary/30" />
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <div className="aspect-square rounded-2xl bg-white shadow-inner" />
                <div className="mt-4 h-2 w-20 rounded-full bg-brand-primary/60" />
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <div className="aspect-square rounded-2xl bg-white shadow-inner" />
                <div className="mt-4 h-2 w-16 rounded-full bg-brand-primary/40" />
              </div>
            </div>
            <div className="absolute -left-4 -top-4 hidden h-28 w-28 rounded-full bg-brand-primary/40 blur-xl sm:block" />
            <div className="absolute -right-8 -bottom-8 hidden h-24 w-24 rounded-full bg-brand-primary/30 blur-xl sm:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
