import ProductComparison from "@/components/ProductComparison";
import { getServerSupabase } from "@/shared/lib/supabaseServer";
import type { UserSkinProfile } from "@/features/products/lib/ingredientAnalyzer";

export default async function ComparePage() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userProfile: UserSkinProfile | null = null;
  if (user && user.user_metadata?.skin_profile?.answers) {
    const answers = user.user_metadata.skin_profile.answers;
    userProfile = {
      skin_type: String(answers["q1_sebum_after_wash"] || ""),
      skin_concerns: Array.isArray(answers["q12_skin_concerns"])
        ? answers["q12_skin_concerns"]
        : [],
    };
  }

  return (
    <div>
      <ProductComparison userProfile={userProfile} />
    </div>
  );
}
