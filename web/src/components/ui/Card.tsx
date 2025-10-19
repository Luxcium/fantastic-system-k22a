/**
 * Card Components
 * Reusable card containers and headers
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Card container component
 *
 * @param className - Additional CSS classes
 * @param children - Card content
 * @returns Card element
 */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-200/70 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-900/80",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Card header with title, hint, and optional action
 *
 * @param title - Header title
 * @param hint - Optional subtitle/hint text
 * @param action - Optional action element
 * @param className - Additional CSS classes
 * @returns CardHeader element
 */
export function CardHeader({
  title,
  hint,
  action,
  className,
}: {
  title: ReactNode;
  hint?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("mb-3 flex items-center justify-between gap-4", className)}
    >
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {title}
        </h3>
        {hint ? (
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {hint}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
