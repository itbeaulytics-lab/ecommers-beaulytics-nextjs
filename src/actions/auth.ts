"use server";

import { redirect } from "next/navigation";
import { getServerSupabaseRSC } from "@/lib/supabaseServerRSC";
import { LoginSchema, RegisterSchema } from "@/lib/schemas";

export async function loginAction(formData: FormData) {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });
  if (!parsed.success) {
    return { error: "Invalid data format" };
  }
  const { email, password, next } = parsed.data;
  const safeNext = next || "/dashboard";
  const supabase = await getServerSupabaseRSC();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message };
  }
  redirect(safeNext);
}

export async function registerAction(formData: FormData) {
  const parsed = RegisterSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    full_name: formData.get("full_name"),
    next: formData.get("next"),
  });
  if (!parsed.success) {
    return { error: "Invalid data format" };
  }
  const { email, password, full_name, next } = parsed.data;
  const safeNext = next || "/questionnaire";
  const supabase = await getServerSupabaseRSC();
  const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name } } });
  if (error) {
    return { error: error.message };
  }
  redirect(safeNext);
}
