import { redirect } from "next/navigation";
import { getServerSupabaseRSC } from "@/lib/supabaseServerRSC";
import QuestionnaireForm from "@/components/QuestionnaireForm";

export default async function QuestionnairePage() {
  const supabase = await getServerSupabaseRSC();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return <QuestionnaireForm user={user} />;
}
