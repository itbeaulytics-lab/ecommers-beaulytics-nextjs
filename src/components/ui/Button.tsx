import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export default function Button({ variant = "primary", className, children, ...rest }: Props) {
  const base = "inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary";
  const styles = variant === "ghost"
    ? "border border-brand-primary text-brand-dark hover:bg-brand-secondary"
    : "bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm";
  const cls = base + " " + styles + (className ? " " + className : "");
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
