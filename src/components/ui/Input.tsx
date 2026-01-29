import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...rest }: Props) {
  const base = "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-brand-dark placeholder-neutral-400 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary";
  const cls = base + (className ? " " + className : "");
  return <input className={cls} {...rest} />;
}

