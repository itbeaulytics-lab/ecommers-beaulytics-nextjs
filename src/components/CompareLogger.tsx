"use client";
import { useEffect } from "react";

type Props = { ids: string[] };

export default function CompareLogger({ ids }: Props) {
  useEffect(() => {
    if (!ids.length) return;
    fetch("/api/compare-log", { method: "POST", body: JSON.stringify({ productIds: ids }), headers: { "Content-Type": "application/json" } });
  }, [ids]);
  return null;
}
