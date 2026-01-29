"use server";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type ForgotPageProps = { searchParams: { error?: string; info?: string } };

export default function ForgotPage({ searchParams }: ForgotPageProps) {
  const errorMsg = searchParams?.error ? decodeURIComponent(searchParams.error) : "";
  const infoMsg = searchParams?.info ? decodeURIComponent(searchParams.info) : "";

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h1 className="text-2xl font-semibold tracking-tight text-brand-dark">Forgot Password</h1>
          <form action="/auth/forgot/submit" method="post" className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-light">Email</label>
              <Input name="email" type="email" placeholder="you@example.com" required />
            </div>
            {errorMsg ? <div className="rounded-2xl bg-brand-secondary px-4 py-2 text-sm text-brand-dark ring-1 ring-black/5">{errorMsg}</div> : null}
            {infoMsg ? <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100">{infoMsg}</div> : null}
            <Button className="w-full" type="submit">Send reset link</Button>
          </form>
        </div>
      </div>
    </section>
  );
}

