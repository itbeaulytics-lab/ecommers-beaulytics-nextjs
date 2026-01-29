import { NextResponse } from "next/server";

import { getServerSupabase } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/dashboard");
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const nextPath = next.startsWith("/") ? next : `/${next}`;

  const supabase = await getServerSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(error?.message || "Login gagal")}&next=${encodeURIComponent(nextPath)}`
    );
  }

  return NextResponse.redirect(`${origin}${nextPath}`);
}
