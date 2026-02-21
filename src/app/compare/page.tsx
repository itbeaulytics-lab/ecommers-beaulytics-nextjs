import ProductComparison from "@/components/ProductComparison";
import { getServerSupabase } from "@/shared/lib/supabaseServer";
import type { UserSkinProfile } from "@/features/products/lib/ingredientAnalyzer";

// BARIS SAKTI 1: Biar halaman nggak di-cache sama Next.js dan AI-nya selalu update!
export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userProfile: UserSkinProfile | null = null;

  if (user && user.user_metadata?.skin_profile?.answers) {
    const answers = user.user_metadata.skin_profile.answers;

    // BARIS SAKTI 2: Ekstraksi data kebal error (bisa baca Array maupun String dari Supabase)
    let rawConcerns = answers["q12_skin_concerns"];
    let concernsArray: string[] = [];

    if (Array.isArray(rawConcerns)) {
      concernsArray = rawConcerns;
    } else if (typeof rawConcerns === "string") {
      concernsArray = rawConcerns.split(","); // Pecah string jadi array
    }

    userProfile = {
      skin_type: String(answers["q1_sebum_after_wash"] || ""),
      skin_concerns: concernsArray,
    };
  }

  return (
    <div>
      <ProductComparison userProfile={userProfile} />
    </div>
  );
}