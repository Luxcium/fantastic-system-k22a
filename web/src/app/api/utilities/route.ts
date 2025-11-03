/**
 * Utilities collection endpoint.
 * Provides a Prisma-backed catalogue response for dashboard hydration.
 */

import { NextResponse } from "next/server";

import { listUtilities } from "@/features/utilities";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/utilities
 *
 * Returns the complete list of utilities with aggregate insights so the
 * dashboard can hydrate table and card views without duplicating logic.
 */
export async function GET() {
  try {
    const utilities = await listUtilities();

    return NextResponse.json(
      { utilities },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, max-age=0, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("Failed to load utilities", error);

    return NextResponse.json(
      {
        error: "Unable to load utilities",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
