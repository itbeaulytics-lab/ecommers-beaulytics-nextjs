"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabaseRSC } from "@/lib/supabaseServerRSC";
import { ReviewSchema } from "@/lib/schemas";

export async function submitReview(_prevState: any, formData: FormData) {
  const supabase = await getServerSupabaseRSC();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const parsed = ReviewSchema.safeParse({
    productId: formData.get("productId"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { error: "Invalid data format" };
  }

  const { productId, rating, comment } = parsed.data;

  const { error } = await supabase.from("reviews").upsert(
    {
      user_id: user.id,
      product_id: productId,
      rating: Number(rating),
      comment,
    },
    { onConflict: "user_id, product_id" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/products/[id]");
  return { success: true };
}
