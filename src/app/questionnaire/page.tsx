import { getServerSupabaseRSC } from "@/lib/supabaseServerRSC";
import QuestionnaireForm from "@/components/QuestionnaireForm";
import { requireUser } from "@/lib/authHelpers";

export default async function QuestionnairePage() {
  const user = await requireUser();
  const supabase = await getServerSupabaseRSC();
  return <QuestionnaireForm user={user} />;
}
