import { afterEach, describe, expect, it, vi } from "vitest";

import type { UtilitySummary } from "./queries";
import { listUtilities } from "./queries";

const findManyMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    utility: {
      findMany: findManyMock,
    },
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("listUtilities", () => {
  it("returns utilities enriched with aggregate metadata", async () => {
    const metadata = {
      features: ["format", "validate", 42],
      keywords: ["json", "tools"],
      unsupported: "ignored",
    };

    findManyMock.mockResolvedValueOnce([
      {
        id: "util_1",
        name: "json-formatter",
        title: "JSON Formatter",
        description: "Format JSON payloads",
        category: "text",
        icon: "code",
        path: "/utilities/json-formatter",
        isActive: true,
        metadata,
        updatedAt: new Date("2025-10-20T15:00:00.000Z"),
        userUtilities: [
          { isFavorite: true, usageCount: 5 },
          { isFavorite: false, usageCount: 2 },
        ],
      },
      {
        id: "util_2",
        name: "hash-generator",
        title: "Hash Generator",
        description: null,
        category: "security",
        icon: null,
        path: "/utilities/hash-generator",
        isActive: false,
        metadata: null,
        updatedAt: new Date("2025-10-19T11:30:00.000Z"),
        userUtilities: [
          { isFavorite: false, usageCount: 0 },
        ],
      },
    ]);

    const result = await listUtilities();

    expect(findManyMock).toHaveBeenCalledWith({
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

    const expected: UtilitySummary[] = [
      {
        id: "util_1",
        name: "json-formatter",
        title: "JSON Formatter",
        description: "Format JSON payloads",
        category: "text",
        icon: "code",
        path: "/utilities/json-formatter",
        isActive: true,
        updatedAt: "2025-10-20T15:00:00.000Z",
        favoriteCount: 1,
        totalUsage: 7,
        features: ["format", "validate"],
        keywords: ["json", "tools"],
        metadata,
      },
      {
        id: "util_2",
        name: "hash-generator",
        title: "Hash Generator",
        description: null,
        category: "security",
        icon: null,
        path: "/utilities/hash-generator",
        isActive: false,
        updatedAt: "2025-10-19T11:30:00.000Z",
        favoriteCount: 0,
        totalUsage: 0,
        features: [],
        keywords: [],
        metadata: null,
      },
    ];

    expect(result).toEqual(expected);
  });
});
