/**
 * Badge Component
 * Small label for statuses, categories, or tags
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Badge component for displaying small labels
 *
 * @param children - Badge content
 * @param variant - Visual style variant
 * @param className - Additional CSS classes
 * @returns Badge element
 */
export function Badge({
  children,
  variant = "outline",
  className,
}: {
  children: ReactNode;
  variant?: "outline" | "solid";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
        variant === "solid"
          ? "bg-indigo-600/90 text-white"
          : "border border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300",
        className,
      )}
    >
      {children}
    </span>
  );
}
