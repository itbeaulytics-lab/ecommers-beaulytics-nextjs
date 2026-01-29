import React from "react";

type Props = React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className, children, ...rest }: Props) {
  const base = "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-brand-dark focus:ring-2 focus:ring-brand-primary focus:border-brand-primary";
  const cls = base + (className ? " " + className : "");
  return (
    <select className={cls} {...rest}>
      {children}
    </select>
  );
}

