"use server";
import { getServerSupabase } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function addToCart(formData: FormData) {
  const productId = String(formData.get("productId"));
  const qty = Number(formData.get("qty") ?? 1);
  const supabase = await getServerSupabase();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes?.user;
  if (!user) return;
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .single();
  let cartId = cart?.id as string | undefined;
  if (!cartId) {
    const { data: created } = await supabase.from("carts").insert({ user_id: user.id }).select("id").single();
    cartId = created?.id as string;
  }
  const { data: existing } = await supabase
    .from("cart_items")
    .select("id,qty")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .single();
  if (existing) {
    await supabase.from("cart_items").update({ qty: existing.qty + qty }).eq("id", existing.id);
  } else {
    await supabase.from("cart_items").insert({ cart_id: cartId, product_id: productId, qty });
  }
  revalidatePath("/cart");
}

export async function updateCartItem(formData: FormData) {
  const itemId = String(formData.get("itemId"));
  const qty = Number(formData.get("qty"));
  const supabase = await getServerSupabase();
  await supabase.from("cart_items").update({ qty }).eq("id", itemId);
  revalidatePath("/cart");
}

export async function removeCartItem(formData: FormData) {
  const itemId = String(formData.get("itemId"));
  const supabase = await getServerSupabase();
  await supabase.from("cart_items").delete().eq("id", itemId);
  revalidatePath("/cart");
}
