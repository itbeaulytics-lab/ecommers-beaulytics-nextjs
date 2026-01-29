"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getSupabaseClient } from "@/lib/supabaseClient";

const QUESTIONS = [
  { key: "skin_type", label: "Jenis kulitmu?", options: ["Kering", "Berminyak", "Kombinasi", "Sensitif"] },
  { key: "concern", label: "Masalah utama yang ingin diatasi?", options: ["Jerawat", "Bekas jerawat / PIH", "Kusam / tekstur", "Pori besar / komedo"] },
  { key: "routine", label: "Rutinitas yang dipakai saat ini?", options: ["Basic (cleanser + moisturizer + sunscreen)", "Tambah exfoliant (AHA/BHA)", "Retinol/retinoid", "Vitamin C / brightening"] },
  { key: "trigger", label: "Pemicu yang bikin kondisi memburuk?", options: ["Makanan berminyak / dairy", "Stres / kurang tidur", "Produk tertentu / iritasi", "Cuaca / polusi"] },
  { key: "goal", label: "Tujuan yang ingin dicapai?", options: ["Kulit lebih kalem & bebas jerawat", "Tone lebih merata & cerah", "Pori tampak lebih rapat", "Barrier lebih kuat / tidak mudah iritasi"] },
] as const;

type Question = (typeof QUESTIONS)[number];

type Props = {
  user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, any>;
  };
};

export default function QuestionnaireForm({ user }: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const meta = user?.user_metadata as any;
    const skin = meta?.skin_profile as { answers?: Record<string, string> } | undefined;
    return skin?.answers || {};
  });
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLast = current === QUESTIONS.length - 1;
  const currentQuestion: Question = QUESTIONS[current];
  const currentAnswer = answers[currentQuestion.key] ?? "";
  const canProceed = useMemo(() => !!currentAnswer, [currentAnswer]);
  const allAnswered = useMemo(() => QUESTIONS.every((q) => (answers[q.key] || "").trim().length > 0), [answers]);

  function updateAnswer(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    if (!canProceed) return;
    setCurrent((c) => Math.min(c + 1, QUESTIONS.length - 1));
  }
  function prev() {
    setCurrent((c) => Math.max(c - 1, 0));
  }

  async function submitAll() {
    if (!allAnswered || loading) return;
    setLoading(true);
    setError("");
    try {
      const supabase = getSupabaseClient();
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.replace("/auth/login");
        return;
      }

      const tags: string[] = [];
      const tagOrder = ["skin_type", "concern", "goal", "routine", "trigger"];
      tagOrder.forEach((k) => {
        const v = answers[k];
        if (v && !tags.includes(v)) tags.push(v);
      });

      const messages = [
        {
          role: "user",
          content: QUESTIONS.map((q) => `${q.label}: ${answers[q.key] ?? ""}`).join("\n"),
        },
      ];
      const res = await fetch("/api/skin-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "analysis", messages }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal meminta ringkasan");
      const aiSummary = String(json?.content ?? "").trim();

      const payload = {
        skin_profile: {
          answers,
          summary: aiSummary,
          updated_at: new Date().toISOString(),
          tags,
        },
        skinshort: aiSummary,
        skin_tags: tags,
      };
      const { error: updateError } = await supabase.auth.updateUser({ data: payload });
      if (updateError) throw updateError;

      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-light">Question {current + 1} / {QUESTIONS.length}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-dark">Questioner Kulit</h1>
          <p className="mt-2 text-sm text-brand-light">Jawab beberapa pertanyaan supaya kami bisa memberi ringkasan dan saran.</p>
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-lg font-semibold text-brand-dark">{currentQuestion.label}</div>
              <div className="grid gap-3">
                {currentQuestion.options.map((opt) => {
                  const checked = currentAnswer === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateAnswer(currentQuestion.key, opt)}
                      className={
                        "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition " +
                        (checked
                          ? "border-brand-primary bg-brand-secondary/70 text-brand-dark ring-2 ring-brand-primary/60"
                          : "border-neutral-200 bg-white text-brand-dark hover:border-brand-primary/50")
                      }
                    >
                      <span>{opt}</span>
                      <span className={"h-4 w-4 rounded-full border " + (checked ? "border-brand-primary bg-brand-primary" : "border-neutral-300")} />
                    </button>
                  );
                })}
              </div>
            </div>

            {error ? <div className="rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div> : null}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Button type="button" variant="ghost" disabled={current === 0 || loading} onClick={prev}>
                Sebelumnya
              </Button>
              {!isLast ? (
                <Button type="button" disabled={!canProceed || loading} onClick={next}>
                  {loading ? "Memproses…" : "Berikutnya"}
                </Button>
              ) : (
                <Button type="button" disabled={!allAnswered || loading} onClick={submitAll} className="min-w-[160px]">
                  {loading ? "Menyimpan…" : "Simpan & ringkas"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
