"use client";

import type { ReactNode } from "react";
import { useSite } from "./site-provider";

interface ButtonProps {
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  title?: string;
}

export function BookButton({ className, children }: ButtonProps) {
  const { openDialog } = useSite();
  return (
    <button aria-haspopup="dialog" type="button" className={className} onClick={() => openDialog({ kind: "booking" })}>
      {children}
    </button>
  );
}

export function CodeButton({ className, children }: ButtonProps) {
  const { openDialog } = useSite();
  return (
    <button aria-haspopup="dialog" type="button" className={className} onClick={() => openDialog({ kind: "code" })}>
      {children}
    </button>
  );
}

export function ReplayButton({ className, children, ...rest }: ButtonProps) {
  const { replay } = useSite();
  return (
    <button type="button" className={className} onClick={replay} {...rest}>
      {children}
    </button>
  );
}
