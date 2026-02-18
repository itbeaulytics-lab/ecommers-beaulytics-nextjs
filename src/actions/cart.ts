"use server";
import { getServerSupabase } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

import { cookies } from "next/headers";

// Helper: Get existing Cart ID OR Create new Cart
async function getOrCreateCartId(supabase: any, userId?: string | null): Promise<string> {
  const cookieStore = await cookies();
  const cartIdCookie = cookieStore.get("cartId")?.value;

  // 1. If user is logged in, try to find existing cart for this user
  if (userId) {
    const { data: cart } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (cart) return cart.id;
  }

  // 2. If guest (no userId) and has a cart cookie, verify it exists
  if (!userId && cartIdCookie) {
    const { data: cart } = await supabase
      .from("carts")
      .select("id")
      .eq("id", cartIdCookie)
      .maybeSingle();

    if (cart) return cart.id;
  }

  // 3. Create new cart
  const payload = userId ? { user_id: userId } : { user_id: null };

  const { data: created, error } = await supabase
    .from("carts")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    console.error("Cart creation failed. Full Error Object:", JSON.stringify(error, null, 2));
    throw new Error(`Failed to create cart. Error: ${JSON.stringify(error)}`);
  }

  if (!created) {
    throw new Error("Cart creation failed: No data returned.");
  }

  // 4. Save cookie for guest users
  if (!userId) {
    cookieStore.set("cartId", created.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  return created.id;
}

export async function addToCart(formData: FormData) {
  const productId = String(formData.get("productId"));
  const qty = Math.max(1, Number(formData.get("qty") ?? 1)); // Validate qty >= 1

  console.log("addToCart Action Called", { productId, qty });

  const supabase = await getServerSupabase();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes?.user;

  console.log("Current User:", user?.id || "Guest");

  const cartId = await getOrCreateCartId(supabase, user?.id);

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id,qty")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .maybeSingle();

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

  if (qty <= 0) {
    return removeCartItem(formData);
  }

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
