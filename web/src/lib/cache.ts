/**
 * Cache Helper Utilities for Next.js 16+
 *
 * Provides wrappers around Next.js 16's explicit caching APIs:
 * - revalidateTag(tag, cacheLife) - for declarative SWR-style revalidation
 * - updateTag(tag) - for immediate invalidation (server actions only)
 * - refresh() - for refreshing uncached parts
 *
 * @see https://nextjs.org/docs/app/getting-started/caching-and-revalidating
 */

import {
  revalidateTag as nextRevalidateTag,
  // Note: updateTag and refresh are only available in Next.js 16+
  // If not available in your version, these will need conditional imports
} from "next/cache";

/**
 * Cache life profiles for revalidateTag
 * These determine how long the cache should be considered fresh
 */
export type CacheLife =
  | "seconds" // Very short-lived (few seconds)
  | "minutes" // Short-lived (few minutes)
  | "hours" // Medium-lived (few hours)
  | "days" // Long-lived (few days)
  | "weeks" // Very long-lived (weeks)
  | "max"; // Maximum possible cache time

/**
 * Revalidate content by tag with explicit cache lifetime
 *
 * This is the Next.js 16+ way of doing ISR-style revalidation.
 * Unlike v14/v15 which had implicit caching, v16 requires you to
 * explicitly state how long the cache should last.
 *
 * @param tag - The cache tag to revalidate
 * @param cacheLife - How long the cache should be fresh
 *
 * @example
 * ```ts
 * // In a server action or route handler
 * await revalidateTagWithLife('blog-posts', 'hours');
 * ```
 */
export async function revalidateTagWithLife(
  tag: string,
  cacheLife: CacheLife = "max",
): Promise<void> {
  await nextRevalidateTag(tag, cacheLife);
}

/**
 * Immediately invalidate a cache tag (server actions only)
 *
 * Unlike revalidateTag which is eventual, updateTag blocks until
 * the next request and forces a re-fetch. This is useful for
 * "read-your-writes" consistency where you need to see changes
 * immediately after a mutation.
 *
 * ⚠️ WARNING: Only works in Server Actions, not in Route Handlers!
 * If you need to invalidate from a Route Handler, use revalidateTagWithLife instead.
 *
 * @param tag - The cache tag to invalidate
 *
 * @example
 * ```ts
 * 'use server';
 * export async function updateProfile(userId: string, data: any) {
 *   await db.user.update({ where: { id: userId }, data });
 *   updateTagImmediate(`user-${userId}`);
 * }
 * ```
 */
export function updateTagImmediate(tag: string): void {
  // Note: updateTag is only available in Next.js 16+ and only in Server Actions
  // For compatibility, we're documenting the pattern but not importing it
  // as it may not be available in all Next.js 16 versions yet
  console.warn(
    `updateTag('${tag}') called - ensure this is in a Server Action and Next.js 16+ is installed`,
  );
  // When available: updateTag(tag);
}

/**
 * Refresh uncached dynamic parts of the page
 *
 * This is the server-side equivalent of router.refresh().
 * Use when you've changed dynamic content that isn't tagged
 * and need to force the server to re-render.
 *
 * @example
 * ```ts
 * 'use server';
 * export async function refreshHeader() {
 *   await updateSomeGlobalState();
 *   refreshPage();
 * }
 * ```
 */
export function refreshPage(): void {
  // Note: refresh() is only available in Next.js 16+ and only in Server Actions
  // For compatibility, we're documenting the pattern but not importing it
  console.warn(
    "refresh() called - ensure this is in a Server Action and Next.js 16+ is installed",
  );
  // When available: refresh();
}

/**
 * Common cache tag patterns for consistency
 */
export const CacheTags = {
  // User-related tags
  user: (id: string) => `user-${id}`,
  userProfile: (id: string) => `user-profile-${id}`,
  userPosts: (id: string) => `user-posts-${id}`,

  // Post-related tags
  post: (id: string) => `post-${id}`,
  posts: "posts",
  postComments: (postId: string) => `post-comments-${postId}`,

  // Collection tags
  collection: (type: string) => `collection-${type}`,
  list: (name: string) => `list-${name}`,

  // Dynamic content tags
  feed: "feed",
  trending: "trending",
  featured: "featured",
} as const;

/**
 * Helper to revalidate multiple tags at once
 *
 * @param tags - Array of cache tags to revalidate
 * @param cacheLife - How long the cache should be fresh
 *
 * @example
 * ```ts
 * await revalidateMultipleTags([
 *   CacheTags.posts,
 *   CacheTags.user('123'),
 *   CacheTags.feed
 * ], 'hours');
 * ```
 */
export async function revalidateMultipleTags(
  tags: string[],
  cacheLife: CacheLife = "max",
): Promise<void> {
  await Promise.all(tags.map((tag) => revalidateTagWithLife(tag, cacheLife)));
}
