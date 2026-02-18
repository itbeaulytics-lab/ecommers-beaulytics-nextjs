'use client';

import type { User } from '@supabase/supabase-js';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

type SkinProfilePanelProps = {
  user: User;
};

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
      return (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-dark">Skin Profile</h2>
            <span className="text-[10px] font-medium uppercase tracking-wider text-brand-primary">AI Analysis</span>
          </div>
          <p className="mt-4 text-sm text-brand-dark">{summaryText}</p>
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
          <Badge key={`${item}-${idx}`} variant="outline" className="rounded-2xl bg-white px-4 py-2 text-sm">
            {item}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
