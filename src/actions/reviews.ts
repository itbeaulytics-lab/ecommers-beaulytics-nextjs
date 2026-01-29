"use server";
import { getServerSupabase } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function addReview(formData: FormData) {
  const productId = String(formData.get("productId"));
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") || "");
  const supabase = await getServerSupabase();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes?.user;
  if (!user) return;
  await supabase.from("reviews").insert({ product_id: productId, user_id: user.id, rating, comment });
  revalidatePath(`/products/${productId}`);
}
