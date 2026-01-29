import { NextResponse } from "next/server";

import { getServerSupabase } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(new URL("/auth/login?error=auth_failed", requestUrl.origin));
  }

  const supabase = await getServerSupabase();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/auth/login?error=auth_failed", requestUrl.origin));
  }

  const nextPath = next.startsWith("/") ? next : `/${next}`;
  const destination = new URL(nextPath, requestUrl.origin);
  return NextResponse.redirect(destination);
}
