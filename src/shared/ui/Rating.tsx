import React from "react";

type Props = {
  value: number;
  size?: number;
  className?: string;
};

export default function Rating({ value, size = 16, className }: Props) {
  const count = Math.max(0, Math.min(5, Math.round(value)));
  const stars = Array.from({ length: 5 }).map((_, i) => (
    <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < count ? "#F7C948" : "none"} stroke={i < count ? "#E0B12F" : "currentColor"} strokeWidth="1.5">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ));
  const cls = "inline-flex items-center gap-1" + (className ? " " + className : "");
  return <div className={cls}>{stars}</div>;
}

