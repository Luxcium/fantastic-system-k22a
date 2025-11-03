/**
 * Utility feature queries.
 * Provides Prisma-backed data fetchers for the utilities catalogue.
 */

import { prisma } from "@/lib/db/prisma";

/** Structured representation of a utility record returned to API consumers. */
export type UtilitySummary = {
  id: string;
  name: string;
  title: string;
  description: string | null;
  category: string;
  icon: string | null;
  path: string;
  isActive: boolean;
  updatedAt: string;
  favoriteCount: number;
  totalUsage: number;
  features: string[];
  keywords: string[];
  metadata: Record<string, unknown> | null;
};

/**
 * Normalize an arbitrary metadata field into a list of strings.
 */
function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

/**
 * Fetch the full utilities catalogue with aggregate insights.
 *
 * @returns A sorted list of utilities enriched with favorite and usage counts.
 */
export async function listUtilities(): Promise<UtilitySummary[]> {
  const utilities = await prisma.utility.findMany({
    include: {
      userUtilities: {
        select: {
          isFavorite: true,
          usageCount: true,
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  });

  return utilities.map((utility) => {
    const metadata = (utility.metadata ?? null) as Record<string, unknown> | null;
    const features = metadata ? normalizeStringArray(metadata.features) : [];
    const keywords = metadata ? normalizeStringArray(metadata.keywords) : [];

    const favoriteCount = utility.userUtilities.reduce(
      (count, association) => count + (association.isFavorite ? 1 : 0),
      0,
    );

    const totalUsage = utility.userUtilities.reduce(
      (sum, association) => sum + (association.usageCount ?? 0),
      0,
    );

    return {
      id: utility.id,
      name: utility.name,
      title: utility.title,
      description: utility.description,
      category: utility.category,
      icon: utility.icon,
      path: utility.path,
      isActive: utility.isActive,
      updatedAt: utility.updatedAt.toISOString(),
      favoriteCount,
      totalUsage,
      features,
      keywords,
      metadata,
    } satisfies UtilitySummary;
  });
}
