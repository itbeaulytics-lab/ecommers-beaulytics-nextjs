import React from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};

export default function Card({ className, children, ...rest }: Props) {
  const base = "rounded-2xl bg-white shadow-sm ring-1 ring-black/5";
  const cls = base + (className ? " " + className : "");
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}

