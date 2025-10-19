/**
 * Avatar Component
 * User avatar with initials fallback
 */

/**
 * Avatar component displaying user initials
 *
 * @param name - User's full name
 * @returns Avatar element with initials
 */
export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600/90 text-sm font-semibold text-white">
      {initials || "—"}
    </div>
  );
}
