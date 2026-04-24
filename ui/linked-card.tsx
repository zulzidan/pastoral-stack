import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/ui/cn";

type LinkedCardProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function LinkedCard({ href, children, className }: LinkedCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-2xl border border-zinc-200/80 bg-white p-5 no-underline shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500",
        className,
      )}
    >
      {children}
    </Link>
  );
}