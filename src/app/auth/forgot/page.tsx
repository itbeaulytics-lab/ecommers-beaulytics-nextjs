"use server";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthCard from "@/components/auth/AuthCard";
import { safeDecode } from "@/lib/utils";

type ForgotPageProps = { searchParams: { error?: string; info?: string } };

export default function ForgotPage({ searchParams }: ForgotPageProps) {
  const errorMsg = safeDecode(searchParams?.error);
  const infoMsg = safeDecode(searchParams?.info);

  return (
    <AuthCard title="Forgot Password">
      <form action="/auth/forgot/submit" method="post" className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-light">Email</label>
          <Input name="email" type="email" placeholder="you@example.com" required />
        </div>
        {errorMsg ? <div className="rounded-2xl bg-brand-secondary px-4 py-2 text-sm text-brand-dark ring-1 ring-black/5">{errorMsg}</div> : null}
        {infoMsg ? <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100">{infoMsg}</div> : null}
        <Button className="w-full" type="submit">Send reset link</Button>
      </form>
    </AuthCard>
  );
}

