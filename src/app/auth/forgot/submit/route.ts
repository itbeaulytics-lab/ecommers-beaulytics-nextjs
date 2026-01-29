import { NextResponse } from "next/server";

import { getServerSupabase } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim();
  const requestUrl = new URL(request.url);

  const supabase = await getServerSupabase();
  const redirectTo = `${requestUrl.origin}/auth/reset`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/forgot?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
    );
  }

  return NextResponse.redirect(
    new URL(`/auth/forgot?info=${encodeURIComponent("Reset link sent. Check your email.")}`, requestUrl.origin)
  );
}
