export default function Loading() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="animate-pulse rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="h-5 w-32 rounded-full bg-neutral-200" />
            <div className="mt-4 space-y-3">
              <div className="h-10 rounded-2xl bg-neutral-200" />
              <div className="h-10 rounded-2xl bg-neutral-200" />
              <div className="h-10 rounded-2xl bg-neutral-200" />
              <div className="h-10 w-24 rounded-2xl bg-neutral-200" />
            </div>
          </div>
          <div className="animate-pulse rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="h-5 w-32 rounded-full bg-neutral-200" />
            <div className="mt-4 grid gap-3">
              <div className="h-10 rounded-2xl bg-neutral-200" />
              <div className="h-10 rounded-2xl bg-neutral-200" />
              <div className="h-10 rounded-2xl bg-neutral-200" />
              <div className="h-10 rounded-2xl bg-neutral-200" />
            </div>
          </div>
          <div className="lg:col-span-2 animate-pulse rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="h-5 w-32 rounded-full bg-neutral-200" />
            <div className="mt-4 space-y-3">
              <div className="h-16 rounded-2xl bg-neutral-200" />
              <div className="h-16 rounded-2xl bg-neutral-200" />
              <div className="h-16 rounded-2xl bg-neutral-200" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
