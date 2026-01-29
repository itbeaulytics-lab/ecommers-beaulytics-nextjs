import React from "react";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "brand" | "outline";
};

export default function Badge({ variant = "brand", className, children, ...rest }: Props) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";
  const styles = variant === "outline"
    ? "border border-brand-primary text-brand-dark"
    : "bg-brand-secondary text-brand-dark ring-1 ring-black/5";
  const cls = base + " " + styles + (className ? " " + className : "");
  return (
    <span className={cls} {...rest}>
      {children}
    </span>
  );
}

