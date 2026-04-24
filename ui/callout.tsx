import type { ReactNode } from "react";
import { cn } from "@/ui/cn";

type CalloutProps = {
  children: ReactNode;
  className?: string;
};

export function Callout({ children, className }: CalloutProps) {
  return (
    <aside className={cn("rounded-xl border p-4 text-sm", className)}>{children}</aside>
  );
}