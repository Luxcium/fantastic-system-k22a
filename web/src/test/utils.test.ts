/**
 * Unit tests for utility functions
 * Testing common helper functions used throughout the application
 */

import { describe, expect, it } from "vitest";
import {
	capitalize,
	chunk,
	cn,
	debounce,
	deepClone,
	formatBytes,
	formatDate,
	formatRelativeTime,
	groupBy,
	isEmpty,
	randomString,
	sleep,
	throttle,
	truncate,
	unique,
} from "../lib/utils";

describe("cn (className merger)", () => {
	it("should merge class names correctly", () => {
		expect(cn("foo", "bar")).toBe("foo bar");
	});

	it("should handle conditional classes", () => {
		expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
	});

	it("should merge Tailwind classes with proper precedence", () => {
		expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
	});
});

describe("formatDate", () => {
	it("should format Date object correctly", () => {
		const date = new Date("2025-10-15T00:00:00Z");
		const formatted = formatDate(date);
		expect(formatted).toMatch(/Oct/);
		expect(formatted).toMatch(/15/);
		expect(formatted).toMatch(/2025/);
	});

	it("should format date string correctly", () => {
		const formatted = formatDate("2025-10-15");
		expect(formatted).toBeDefined();
		expect(typeof formatted).toBe("string");
	});

	it("should format timestamp correctly", () => {
		const timestamp = Date.parse("2025-10-15");
		const formatted = formatDate(timestamp);
		expect(formatted).toBeDefined();
		expect(typeof formatted).toBe("string");
	});
});

describe("formatRelativeTime", () => {
	it('should return "just now" for recent dates', () => {
		const now = new Date();
		expect(formatRelativeTime(now)).toBe("just now");
	});

	it("should format minutes ago correctly", () => {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
		expect(formatRelativeTime(fiveMinutesAgo)).toBe("5 minutes ago");
	});

	it("should format hours ago correctly", () => {
		const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
		expect(formatRelativeTime(twoHoursAgo)).toBe("2 hours ago");
	});

	it("should format days ago correctly", () => {
		const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
		expect(formatRelativeTime(threeDaysAgo)).toBe("3 days ago");
	});

	it("should use formatDate for dates older than 4 weeks", () => {
		const oldDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
		const result = formatRelativeTime(oldDate);
		expect(result).not.toContain("ago");
	});
});

describe("debounce", () => {
	it("should delay function execution", async () => {
		let counter = 0;
		const fn = debounce(() => counter++, 100);

		fn();
		expect(counter).toBe(0);

		await sleep(150);
		expect(counter).toBe(1);
	});

	it("should cancel previous calls", async () => {
		let counter = 0;
		const fn = debounce(() => counter++, 100);

		fn();
		fn();
		fn();

		await sleep(150);
		expect(counter).toBe(1);
	});
});

describe("throttle", () => {
	it("should limit function calls", async () => {
		let counter = 0;
		const fn = throttle(() => counter++, 100);

		fn();
		fn();
		fn();

		expect(counter).toBe(1);

		await sleep(150);
		fn();
		expect(counter).toBe(2);
	});
});

describe("sleep", () => {
	it("should wait for specified milliseconds", async () => {
		const start = Date.now();
		await sleep(100);
		const elapsed = Date.now() - start;
		expect(elapsed).toBeGreaterThanOrEqual(100);
	});
});

describe("randomString", () => {
	it("should generate string of specified length", () => {
		const str = randomString(10);
		expect(str).toHaveLength(10);
	});

	it("should generate different strings", () => {
		const str1 = randomString(20);
		const str2 = randomString(20);
		expect(str1).not.toBe(str2);
	});

	it("should use default length of 10", () => {
		const str = randomString();
		expect(str).toHaveLength(10);
	});
});

describe("truncate", () => {
	it("should truncate long strings", () => {
		expect(truncate("Hello World", 5)).toBe("He...");
	});

	it("should not truncate short strings", () => {
		expect(truncate("Hi", 10)).toBe("Hi");
	});

	it("should use custom suffix", () => {
		expect(truncate("Hello World", 5, "…")).toBe("Hell…");
	});
});

describe("capitalize", () => {
	it("should capitalize first letter", () => {
		expect(capitalize("hello")).toBe("Hello");
	});

	it("should handle empty string", () => {
		expect(capitalize("")).toBe("");
	});

	it("should not affect already capitalized strings", () => {
		expect(capitalize("Hello")).toBe("Hello");
	});
});

describe("formatBytes", () => {
	it("should format zero bytes", () => {
		expect(formatBytes(0)).toBe("0 Bytes");
	});

	it("should format bytes correctly", () => {
		expect(formatBytes(1024)).toBe("1 KB");
		expect(formatBytes(1024 * 1024)).toBe("1 MB");
		expect(formatBytes(1024 * 1024 * 1024)).toBe("1 GB");
	});

	it("should respect decimal places", () => {
		expect(formatBytes(1536, 0)).toBe("2 KB");
		expect(formatBytes(1536, 2)).toBe("1.5 KB");
	});
});

describe("isEmpty", () => {
	it("should detect null and undefined", () => {
		expect(isEmpty(null)).toBe(true);
		expect(isEmpty(undefined)).toBe(true);
	});

	it("should detect empty strings", () => {
		expect(isEmpty("")).toBe(true);
		expect(isEmpty("   ")).toBe(true);
	});

	it("should detect empty arrays", () => {
		expect(isEmpty([])).toBe(true);
	});

	it("should detect empty objects", () => {
		expect(isEmpty({})).toBe(true);
	});

	it("should detect non-empty values", () => {
		expect(isEmpty("hello")).toBe(false);
		expect(isEmpty([1])).toBe(false);
		expect(isEmpty({ a: 1 })).toBe(false);
	});
});

describe("deepClone", () => {
	it("should clone objects deeply", () => {
		const obj = { a: 1, b: { c: 2 } };
		const cloned = deepClone(obj);

		expect(cloned).toEqual(obj);
		expect(cloned).not.toBe(obj);
		expect(cloned.b).not.toBe(obj.b);
	});

	it("should clone arrays deeply", () => {
		const arr = [1, [2, 3]];
		const cloned = deepClone(arr);

		expect(cloned).toEqual(arr);
		expect(cloned).not.toBe(arr);
		expect(cloned[1]).not.toBe(arr[1]);
	});
});

describe("groupBy", () => {
	it("should group array items by key", () => {
		const items = [
			{ type: "A", value: 1 },
			{ type: "B", value: 2 },
			{ type: "A", value: 3 },
		];

		const grouped = groupBy(items, "type");

		expect(grouped.A).toHaveLength(2);
		expect(grouped.B).toHaveLength(1);
	});

	it("should handle empty arrays", () => {
		expect(groupBy([], "key")).toEqual({});
	});
});

describe("unique", () => {
	it("should remove duplicates", () => {
		expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
	});

	it("should handle strings", () => {
		expect(unique(["a", "b", "a", "c"])).toEqual(["a", "b", "c"]);
	});

	it("should handle empty arrays", () => {
		expect(unique([])).toEqual([]);
	});
});

describe("chunk", () => {
	it("should split array into chunks", () => {
		const result = chunk([1, 2, 3, 4, 5], 2);
		expect(result).toEqual([[1, 2], [3, 4], [5]]);
	});

	it("should handle exact divisions", () => {
		const result = chunk([1, 2, 3, 4], 2);
		expect(result).toEqual([
			[1, 2],
			[3, 4],
		]);
	});

	it("should handle empty arrays", () => {
		expect(chunk([], 2)).toEqual([]);
	});
});
