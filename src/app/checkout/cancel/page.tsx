export default function CancelPage() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto h-16 w-16 rounded-full bg-brand-secondary" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-brand-dark">Payment Canceled</h1>
          <p className="mt-2 text-sm text-brand-light">You can continue shopping or try again.</p>
        </div>
      </div>
    </section>
  );
}

