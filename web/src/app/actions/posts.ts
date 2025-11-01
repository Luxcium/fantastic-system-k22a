/**
 * Server Actions for Posts
 * Demonstrates Next.js 16+ immediate cache invalidation with updateTag
 *
 * These functions can ONLY be called from Server Components or Client Components
 * when marked with 'use server'. They provide immediate cache invalidation
 * using updateTag, which is more powerful than revalidateTag for mutations.
 */

"use server";

import { CacheTags, revalidateTagWithLife } from "@/lib/cache";

/**
 * Update a post with immediate cache invalidation
 *
 * In Next.js 16+, updateTag provides "read-your-writes" consistency
 * by blocking the next request until the cache is invalidated and refetched.
 *
 * ⚠️ Note: updateTag is only available in Server Actions, not Route Handlers!
 *
 * @param postId - The ID of the post to update
 * @param data - The data to update
 */
export async function updatePostAction(
	postId: string,
	_data: { title?: string; content?: string },
) {
	try {
		// In production, update the database
		// await db.post.update({ where: { id: postId }, data });

		// Use updateTag for immediate invalidation (Next.js 16+)
		// This blocks the next request and forces a re-fetch
		const { updateTagImmediate } = await import("@/lib/cache");
		updateTagImmediate(CacheTags.post(postId));
		updateTagImmediate(CacheTags.posts);

		return {
			success: true,
			message: "Post updated successfully",
			postId,
		};
	} catch (error) {
		console.error("Error updating post:", error);
		return {
			success: false,
			error: "Failed to update post",
		};
	}
}

/**
 * Create a new post with cache revalidation
 *
 * @param data - The post data to create
 */
export async function createPostAction(data: {
	title: string;
	content: string;
	slug: string;
}) {
	try {
		// Validate input
		if (!data.title || !data.slug) {
			return {
				success: false,
				error: "Title and slug are required",
			};
		}

		// In production, create in database
		// const post = await db.post.create({ data });

		// Revalidate posts list with explicit cache life
		await revalidateTagWithLife(CacheTags.posts, "short");

		return {
			success: true,
			message: "Post created successfully",
			// post,
		};
	} catch (error) {
		console.error("Error creating post:", error);
		return {
			success: false,
			error: "Failed to create post",
		};
	}
}

/**
 * Delete a post with immediate cache invalidation
 *
 * @param postId - The ID of the post to delete
 */
export async function deletePostAction(postId: string) {
	try {
		// In production, delete from database
		// await db.post.delete({ where: { id: postId } });

		// Immediately invalidate caches
		const { updateTagImmediate } = await import("@/lib/cache");
		updateTagImmediate(CacheTags.post(postId));
		updateTagImmediate(CacheTags.posts);

		return {
			success: true,
			message: "Post deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting post:", error);
		return {
			success: false,
			error: "Failed to delete post",
		};
	}
}

/**
 * Refresh the entire page (uncached parts)
 *
 * This is useful when you need to force a complete re-render
 * without targeting specific cache tags.
 */
export async function refreshPageAction() {
	try {
		const { refreshPage } = await import("@/lib/cache");
		refreshPage();

		return {
			success: true,
			message: "Page refresh triggered",
		};
	} catch (error) {
		console.error("Error refreshing page:", error);
		return {
			success: false,
			error: "Failed to refresh page",
		};
	}
}
