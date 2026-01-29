"use server";
import { getServerSupabase } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const full_name = String(formData.get("full_name") || "");
  const avatar_url = String(formData.get("avatar_url") || "");
  const supabase = await getServerSupabase();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes?.user;
  if (!user) return;
  await supabase.from("users").upsert({ id: user.id, full_name, avatar_url });
  revalidatePath("/dashboard");
}
