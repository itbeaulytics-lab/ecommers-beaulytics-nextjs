import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSupabaseRSC } from '@/lib/supabaseServerRSC';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type LoginPageProps = { searchParams: Promise<{ error?: string | string[]; next?: string | string[] }> };

function toStr(value?: string | string[] | null) {
  if (Array.isArray(value)) return value[0];
  return value ?? '';
}

function safeDecode(value?: string | string[] | null) {
  if (!value) return '';
  try {
    return decodeURIComponent(toStr(value));
  } catch {
    return String(toStr(value));
  }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await getServerSupabaseRSC();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect('/dashboard');
  }

  const params = await searchParams;
  const errorMsg = safeDecode(params?.error);
  const next = toStr(params?.next) || '/dashboard';

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h1 className="text-2xl font-semibold tracking-tight text-brand-dark">Login</h1>
          <form action="/auth/login/submit" method="post" className="mt-6 space-y-4">
            <input type="hidden" name="next" value={next} />
            <div>
              <label className="block text-sm font-medium text-brand-light">Email</label>
              <Input name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-light">Password</label>
              <Input name="password" type="password" placeholder="••••••••" required />
            </div>
            {errorMsg ? <div className="rounded-2xl bg-brand-secondary px-4 py-2 text-sm text-brand-dark ring-1 ring-black/5">{errorMsg}</div> : null}
            <Button className="w-full" type="submit">Login</Button>
          </form>
          <div className="mt-4 flex items-center justify-between text-xs text-brand-light">
            <Link href="/auth/forgot">Forgot password?</Link>
            <Link href="/auth/register">Create account</Link>
          </div>
          <div className="mt-6">
            <GoogleButton next={next} />
          </div>
        </div>
      </div>
    </section>
  );
}

function GoogleButton({ next }: { next: string }) {
  const nextParam = encodeURIComponent(next || '/dashboard');
  return (
    <Link
      href={`/auth/oauth/google?next=${nextParam}`}
      className="inline-flex w-full items-center justify-center rounded-2xl border border-brand-primary px-6 py-3 text-sm font-medium text-brand-dark transition hover:bg-brand-secondary"
    >
      Sign in with Google
    </Link>
  );
}
