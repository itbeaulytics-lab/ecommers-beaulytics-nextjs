'use client';

import type { User } from '@supabase/supabase-js';
import Card from '@/shared/ui/Card';
import Badge from '@/shared/ui/Badge';

type SkinProfilePanelProps = {
  user: User;
};

const LABEL_MAP: Record<string, string> = {
  "Hyperpigmentation": "Flek Hitam / Bekas Gelap (Hiperpigmentasi)",
  "Erythema": "Kemerahan / Iritasi (Eritema)",
  "Erythema / Redness": "Kemerahan / Iritasi (Eritema)",
  "Redness": "Kemerahan / Iritasi (Eritema)",
  "Acne Vulgaris": "Jerawat Aktif (Acne)",
  "Excessive Sebum": "Sangat Berminyak (Sebum Berlebih)",
  "Atopic": "Mudah Gatal / Eksim (Atopik)",
  "Atopic / Dermatitis": "Mudah Gatal / Eksim (Atopik)",
  "Dermatitis": "Mudah Gatal / Eksim (Atopik)",
  "Wrinkles": "Garis Halus / Kerutan (Aging)",
  "Wrinkles / Aging": "Garis Halus / Kerutan (Aging)",
  "Aging": "Garis Halus / Kerutan (Aging)",
  "Enlarged Pores": "Pori-pori Besar",
  "Skin Barrier Damage": "Kulit Mengelupas / Sensitif (Skin Barrier Rusak)",
  "Post-Inflammatory Hyperpigmentation": "Flek Hitam / Bekas Gelap (Hiperpigmentasi)",
};

function getFriendlyLabel(tag: string): string {
  const t = tag.trim();
  const lowerT = t.toLowerCase();

  // Exact match first
  for (const [key, val] of Object.entries(LABEL_MAP)) {
    if (key.toLowerCase() === lowerT) return val;
  }

  // Partial match
  for (const [key, val] of Object.entries(LABEL_MAP)) {
    if (lowerT.includes(key.toLowerCase())) return val;
  }

  return t;
}

export default function SkinProfilePanel({ user }: SkinProfilePanelProps) {
  const meta = (user?.user_metadata || {}) as any;
  const summaryText = (meta?.skin_profile?.summary as string) || (meta?.skinshort as string) || "";
  const tagsInput = meta?.skin_tags as unknown;
  const fromTags = Array.isArray(tagsInput) ? tagsInput : [];
  const summaryFallback = summaryText
    .split(',')
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0);
  const tags = (fromTags.length ? fromTags : summaryFallback).filter(
    (s) => typeof s === 'string' && s.trim().length > 0 && s.trim().length <= 60,
  ) as string[];

  if (!tags.length) {
    if (summaryText) {
      const friendlySummary = summaryText
        .split(',')
        .map(s => getFriendlyLabel(s))
        .join(', ');

      return (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-dark">Skin Profile</h2>
            <span className="text-[10px] font-medium uppercase tracking-wider text-brand-primary">AI Analysis</span>
          </div>
          <p className="mt-4 text-sm text-brand-dark">{friendlySummary}</p>
        </Card>
      );
    }

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
        <span className="text-[10px] font-medium uppercase tracking-wider text-brand-primary">AI Analysis</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((item, idx) => (
          <Badge key={`${item}-${idx}`} variant="outline" className="rounded-2xl bg-white px-4 py-2 text-sm text-center">
            {getFriendlyLabel(item)}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
