'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import { getSupabaseClient } from '@/lib/supabaseClient';

type SkinProfile = { summary?: string; answers?: Record<string, string>; updated_at?: string };

export default function SkinProfilePanel() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<string[]>([]);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    async function load() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;
        if (!session) {
          setItems([]);
          return;
        }
        const user = session.user;

        if (user) {
          const userMeta = user.user_metadata as any;
          const userSkin = userMeta?.skin_profile as SkinProfile | undefined;
          const summaryText = userSkin?.summary || (userMeta?.skinshort as string | undefined) || "";
          const manualTags = (userMeta?.skin_tags as string[]) || (userSkin as any)?.tags || [];
          const MAX_CHIP_LENGTH = 60;

          if (summaryText) {
            const aiKeywords = summaryText
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s.length > 0 && s.length <= MAX_CHIP_LENGTH);
            if (aiKeywords.length) {
              setItems(aiKeywords);
              setIsAiGenerated(true);
            } else if (manualTags.length) {
              const cleanedTags = manualTags.filter((s) => typeof s === "string" && s.trim().length > 0 && s.length <= MAX_CHIP_LENGTH);
              if (cleanedTags.length) {
                setItems(cleanedTags);
                setIsAiGenerated(false);
              }
            }
          } else if (manualTags.length) {
            const cleanedTags = manualTags.filter((s) => typeof s === "string" && s.trim().length > 0 && s.length <= MAX_CHIP_LENGTH);
            if (cleanedTags.length) {
              setItems(cleanedTags);
              setIsAiGenerated(false);
            }
          }
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-brand-dark">Skin Profile</h2>
        <div className="mt-4 text-sm text-brand-light">Memuat…</div>
      </Card>
    );
  }

  if (!items.length) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-brand-dark">Skin Profile</h2>
        <div className="mt-4 text-sm text-brand-light">
          Belum ada hasil. <a className="text-brand-primary hover:underline" href="/questionnaire">Isi questioner kulit</a>.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-brand-dark">Skin Profile</h2>
        {isAiGenerated ? (
          <span className="text-[10px] font-medium uppercase tracking-wider text-brand-primary">AI Analysis</span>
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className="inline-flex items-center rounded-full bg-brand-secondary/70 px-4 py-2 text-sm font-semibold text-brand-dark ring-1 ring-inset ring-brand-primary/30"
          >
            {item}
          </span>
        ))}
      </div>
    </Card>
  );
}
