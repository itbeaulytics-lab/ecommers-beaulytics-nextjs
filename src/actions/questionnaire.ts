"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerSupabaseRSC } from "@/lib/supabaseServerRSC";
import { toStr } from "@/lib/utils";
import { QuestionnaireSchema } from "@/lib/schemas";

export async function saveSkinProfile(_prevState: { error?: string } | null, formData: FormData) {
  const supabase = await getServerSupabaseRSC();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/auth/login");
  }

  let parsedAnswers: Record<string, string> = {};
  try {
    const raw = toStr(formData.get("answers") as any);
    parsedAnswers = raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    parsedAnswers = {};
  }

  const parsed = QuestionnaireSchema.safeParse({
    answers: parsedAnswers,
    aiSummary: formData.get("aiSummary"),
  });
  if (!parsed.success) {
    return { error: "Invalid data format" };
  }

  const { answers, aiSummary } = parsed.data;

  // Clean up potential noise from AI response
  const cleanSummary = aiSummary
    .replace(/^(Medical Report|Analysis|Result|Detected Conditions):/i, "")
    .replace(/\r\n/g, ",")
    .replace(/\n/g, ",");

  const tags = cleanSummary
    .split(",")
    .map((tag) => tag.trim().replace(/^[-*•]\s*/, "")) // Remove bullet points if any
    .filter((tag) => tag.length > 2); // Filter out very short/empty tags

  const payload = {
    skin_profile: {
      answers,
      summary: cleanSummary,
      updated_at: new Date().toISOString(),
    },
    skin_tags: tags,
    skinshort: cleanSummary,
  };

  const { data: updatedUser, error: updateError } = await supabase.auth.updateUser({ data: payload });

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
