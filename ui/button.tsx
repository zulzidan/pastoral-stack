import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/ui/cn";

type ButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  size?: "sm" | "md";
};

export function Button({
  href,
  children,
  className,
  target,
  rel,
  size = "md",
}: ButtonProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-brand-rust text-white transition hover:bg-brand-charcoal dark:bg-brand-white dark:text-brand-charcoal dark:hover:bg-brand-white/80",
        size === "sm" ? "h-9 px-4 text-sm font-medium" : "h-10 px-5",
        className,
      )}
    >
      {children}
    </Link>
  );
}