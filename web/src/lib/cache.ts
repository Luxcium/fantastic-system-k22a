/**
 * Cache Helper Utilities for Next.js 15+
 *
 * Provides wrappers around Next.js caching and revalidation APIs:
 * - revalidateTag(tag) - for on-demand cache revalidation
 * - revalidatePath(path) - for path-based cache revalidation
 * - unstable_expireTag(tag) - experimental immediate invalidation
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/revalidateTag
 * @see https://nextjs.org/docs/app/api-reference/functions/revalidatePath
 */

import {
  revalidateTag as nextRevalidateTag,
  revalidatePath,
  unstable_expireTag,
} from "next/cache";

/**
 * Revalidate content by cache tag
 *
 * This is the standard way to revalidate cached data in Next.js.
 * When called, Next.js will purge the cache for all data tagged
 * with the specified tag on the next request.
 *
 * @param tag - The cache tag to revalidate
 *
 * @example
 * ```ts
 * // In a server action or route handler
 * revalidateByTag('blog-posts');
 * ```
 */
export function revalidateByTag(tag: string): void {
  nextRevalidateTag(tag);
}

/**
 * Immediately expire a cache tag (experimental)
 *
 * Unlike revalidateTag which is eventual, unstable_expireTag
 * attempts immediate invalidation. This is useful for "read-your-writes"
 * consistency where you need to see changes immediately after a mutation.
 *
 * ⚠️ WARNING: This is an unstable/experimental API and may change!
 *
 * @param tag - The cache tag to expire
 *
 * @example
 * ```ts
 * 'use server';
 * export async function updateProfile(userId: string, data: any) {
 *   await db.user.update({ where: { id: userId }, data });
 *   expireTagImmediate(`user-${userId}`);
 * }
 * ```
 */
export function expireTagImmediate(tag: string): void {
  unstable_expireTag(tag);
}

/**
 * Revalidate content by path
 *
 * Purges cached data for a specific path. Useful when you need
 * to revalidate an entire page or route segment.
 *
 * @param path - The path to revalidate (e.g., "/blog", "/blog/[slug]")
 * @param type - Optional: "page" (default) or "layout"
 *
 * @example
 * ```ts
 * 'use server';
 * export async function revalidateBlogPost(slug: string) {
 *   revalidateByPath(`/blog/${slug}`);
 * }
 * ```
 */
export function revalidateByPath(path: string, type?: "page" | "layout"): void {
  revalidatePath(path, type);
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
 *
 * @example
 * ```ts
 * revalidateMultipleTags([
 *   CacheTags.posts,
 *   CacheTags.user('123'),
 *   CacheTags.feed
 * ]);
 * ```
 */
export function revalidateMultipleTags(tags: string[]): void {
  tags.map((tag) => revalidateByTag(tag));
  return;
}

/**
 * Cache life profiles for different content types
 */
export type CacheLife = "short" | "medium" | "long" | "indefinite";

/**
 * Revalidate a tag with an explicit cache lifetime hint
 *
 * This is a convenience wrapper around revalidateByTag that documents
 * the intended cache lifetime. The actual revalidation behavior is the same.
 *
 * @param tag - The cache tag to revalidate
 * @param _life - Cache lifetime hint (documentation only)
 *
 * @example
 * ```ts
 * revalidateTagWithLife('blog-posts', 'short');
 * ```
 */
export function revalidateTagWithLife(tag: string, _life?: CacheLife): void {
  // Life parameter is for documentation purposes
  // Next.js handles actual cache timing
  revalidateByTag(tag);
}

/**
 * Update a tag with immediate invalidation (alias for expireTagImmediate)
 *
 * Provides clearer naming for server actions that need immediate cache updates.
 *
 * @param tag - The cache tag to immediately invalidate
 *
 * @example
 * ```ts
 * 'use server';
 * export async function updateData(id: string) {
 *   await db.update({ id });
 *   updateTagImmediate(`data-${id}`);
 * }
 * ```
 */
export function updateTagImmediate(tag: string): void {
  expireTagImmediate(tag);
}

/**
 * Refresh the current page by revalidating its path
 *
 * Useful for ensuring the user sees fresh data after a mutation.
 *
 * @param path - The path to refresh (defaults to current page)
 *
 * @example
 * ```ts
 * 'use server';
 * export async function refreshPageAction(path?: string) {
 *   refreshPage(path);
 * }
 * ```
 */
export function refreshPage(path = "/"): void {
  revalidateByPath(path);
}
