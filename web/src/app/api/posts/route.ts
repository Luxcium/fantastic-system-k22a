/**
 * Posts API Route
 * Demonstrates Next.js 16+ explicit caching patterns
 */

import { type NextRequest, NextResponse } from "next/server";
import { CacheTags, revalidateTagWithLife } from "@/lib/cache";

// Example posts data (in production, this would come from a database)
const posts = [
  { id: "1", title: "Getting Started with Next.js 16", slug: "nextjs-16" },
  { id: "2", title: "Understanding Turbopack", slug: "turbopack" },
  { id: "3", title: "Explicit Caching in Next.js", slug: "caching" },
];

/**
 * GET /api/posts
 * Fetch all posts with caching
 *
 * This demonstrates Next.js 16's fetch caching with tags.
 * The data is tagged with 'posts' so it can be revalidated later.
 */
export async function GET(_request: NextRequest) {
  try {
    // In production, you would fetch from database with cache tags
    // Example:
    // const posts = await fetch('https://api.example.com/posts', {
    //   next: { tags: [CacheTags.posts] }
    // });

    return NextResponse.json(
      {
        posts,
        cached: true,
        tag: CacheTags.posts,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/posts
 * Create a new post and revalidate the posts cache
 *
 * This demonstrates using revalidateTag after a mutation.
 * In Next.js 16+, we must provide both the tag AND the cache life.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 },
      );
    }

    // In production, save to database
    // await db.post.create({ data: body });

    // Revalidate the posts cache with explicit cache life
    // Using 'hours' means the cache will be fresh for a few hours
    await revalidateTagWithLife(CacheTags.posts, "hours");

    return NextResponse.json(
      {
        success: true,
        message: "Post created and cache revalidated",
        cacheLife: "hours",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/posts
 * Delete a post and immediately invalidate cache
 *
 * Note: In a real application, you would use a Server Action with updateTag
 * for immediate invalidation. Route handlers should use revalidateTag.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 },
      );
    }

    // In production, delete from database
    // await db.post.delete({ where: { id: postId } });

    // Revalidate both the posts list and the specific post
    await revalidateTagWithLife(CacheTags.posts, "minutes");
    await revalidateTagWithLife(CacheTags.post(postId), "minutes");

    return NextResponse.json({
      success: true,
      message: "Post deleted and cache revalidated",
      note: "For immediate invalidation, use a Server Action with updateTag instead",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
