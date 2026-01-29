import { NextResponse } from "next/server";

import { getServerSupabase } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const full_name = String(formData.get("full_name") || "").trim();
  const next = String(formData.get("next") || "/questionnaire");
  const requestUrl = new URL(request.url);
  const nextPath = next.startsWith("/") ? next : `/${next}`;

  const supabase = await getServerSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
      emailRedirectTo: `${requestUrl.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/register?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(nextPath)}`, requestUrl.origin)
    );
  }

  if (data?.user && data.session) {
    const { error: profileError } = await supabase.from("users").upsert({ id: data.user.id, email, full_name });
    if (profileError) {
      return NextResponse.redirect(
        new URL(`/auth/register?error=${encodeURIComponent(profileError.message)}&next=${encodeURIComponent(nextPath)}`, requestUrl.origin)
      );
    }
    return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
  }

  const infoMsg = "Registration successful. Check your email to verify, then login.";
  return NextResponse.redirect(
    new URL(`/auth/login?info=${encodeURIComponent(infoMsg)}&next=${encodeURIComponent(nextPath)}`, requestUrl.origin)
  );
}
