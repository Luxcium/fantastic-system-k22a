/**
 * Screenshot Utility Module
 *
 * Provides robust screenshot capture capabilities for the web application.
 * Supports both headless and headed modes, multiple viewports, themes,
 * and resilient error handling for use in agentic workflows.
 *
 * @module utils/screenshot
 */

import { existsSync, mkdirSync } from "node:fs";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import type { Browser, BrowserContext, Page } from "@playwright/test";
import { chromium } from "@playwright/test";

/**
 * Viewport configuration for responsive screenshots
 */
export interface ViewportConfig {
  /** Human-readable name for the viewport */
  name: string;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Optional device pixel ratio */
  deviceScaleFactor?: number;
}

/**
 * Screenshot capture options
 */
export interface ScreenshotOptions {
  /** URL to capture (defaults to localhost:3022) */
  url?: string;
  /** Output directory path (defaults to screenshots/) */
  outputDir?: string;
  /** Custom filename (defaults to timestamp-based) */
  filename?: string;
  /** Whether to capture full page (defaults to false) */
  fullPage?: boolean;
  /** Viewport configuration (defaults to desktop) */
  viewport?: ViewportConfig;
  /** Theme mode: 'light' | 'dark' | 'both' (defaults to 'both') */
  theme?: "light" | "dark" | "both";
  /** Whether to run in headless mode (defaults to true) */
  headless?: boolean;
  /** Timeout in milliseconds (defaults to 30000) */
  timeout?: number;
  /** Custom path to browser executable */
  executablePath?: string;
  /** Wait for selector before screenshot */
  waitForSelector?: string;
  /** Additional delay in ms after page load */
  delay?: number;
}

/**
 * Screenshot result metadata
 */
export interface ScreenshotResult {
  /** Path to the saved screenshot */
  path: string;
  /** Viewport used for the screenshot */
  viewport: ViewportConfig;
  /** Theme used ('light' | 'dark') */
  theme: string;
  /** Timestamp when screenshot was taken */
  timestamp: Date;
  /** URL that was captured */
  url: string;
  /** File size in bytes */
  size: number;
}

/**
 * Predefined viewport configurations
 */
export const VIEWPORTS: Record<string, ViewportConfig> = {
  mobile: {
    name: "Mobile",
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
  },
  tablet: {
    name: "Tablet",
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
  },
  desktop: {
    name: "Desktop",
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  },
  "desktop-hd": {
    name: "Desktop HD",
    width: 2560,
    height: 1440,
    deviceScaleFactor: 1,
  },
};

/**
 * Get system browser path with fallback options
 */
function getSystemBrowserPath(): string | undefined {
  const possiblePaths = [
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chrome",
    "/snap/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ];

  return possiblePaths.find((path) => {
    try {
      return existsSync(path);
    } catch {
      return false;
    }
  });
}

/**
 * Set theme on the page
 */
async function setTheme(page: Page, theme: "light" | "dark"): Promise<void> {
  await page.evaluate((themeMode) => {
    const html = document.documentElement;
    if (themeMode === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, theme);
}

/**
 * Generate filename based on options and theme
 */
function generateFilename(
  options: ScreenshotOptions,
  theme: "light" | "dark",
): string {
  if (options.filename) {
    // If custom filename includes extension, use it as-is
    if (options.filename.endsWith(".png")) {
      return options.filename.replace(".png", `-${theme}.png`);
    }
    return `${options.filename}-${theme}.png`;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const viewportName =
    options.viewport?.name.toLowerCase().replace(/\s+/g, "-") || "desktop";
  return `screenshot-${viewportName}-${theme}-${timestamp}.png`;
}

/**
 * Capture a screenshot with the specified options
 *
 * @param options - Screenshot capture options
 * @returns Promise resolving to screenshot result(s)
 *
 * @example
 * ```typescript
 * // Capture desktop screenshot in both themes
 * const results = await captureScreenshot({
 *   url: 'http://localhost:3022',
 *   theme: 'both'
 * });
 *
 * // Capture mobile screenshot with custom filename
 * const results = await captureScreenshot({
 *   viewport: VIEWPORTS.mobile,
 *   filename: 'home-mobile',
 *   theme: 'dark'
 * });
 * ```
 */
export async function captureScreenshot(
  options: ScreenshotOptions = {},
): Promise<ScreenshotResult[]> {
  const {
    url = "http://localhost:3022",
    outputDir = "screenshots",
    fullPage = false,
    viewport = VIEWPORTS.desktop,
    theme = "both",
    headless = true,
    timeout = 30000,
    executablePath,
    waitForSelector,
    delay = 1000,
  } = options;

  // Ensure output directory exists
  const absoluteOutputDir = join(process.cwd(), outputDir);
  if (!existsSync(absoluteOutputDir)) {
    mkdirSync(absoluteOutputDir, { recursive: true });
  }

  // Determine browser executable path
  const browserPath = executablePath || getSystemBrowserPath();

  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let page: Page | null = null;
  const results: ScreenshotResult[] = [];

  try {
    // Launch browser with disabled external connections
    browser = await chromium.launch({
      headless,
      executablePath: browserPath,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled",
        "--disable-sync",
        "--disable-features=TranslateUI,OptimizationHints",
        "--disable-component-update",
        "--disable-background-networking",
        "--disable-default-apps",
        "--disable-extensions",
      ],
    });

    // Create browser context with viewport
    context = await browser.newContext({
      viewport: {
        width: viewport.width,
        height: viewport.height,
      },
      deviceScaleFactor: viewport.deviceScaleFactor,
    });

    page = await context.newPage();
    page.setDefaultTimeout(timeout);

    // Navigate to URL
    await page.goto(url, { waitUntil: "networkidle" });

    // Wait for specific selector if provided
    if (waitForSelector) {
      await page.waitForSelector(waitForSelector, { state: "visible" });
    }

    // Additional delay for animations/rendering
    if (delay > 0) {
      await page.waitForTimeout(delay);
    }

    // Capture screenshots based on theme option
    const themes: Array<"light" | "dark"> =
      theme === "both" ? ["light", "dark"] : [theme];

    for (const currentTheme of themes) {
      // Set theme
      await setTheme(page, currentTheme);

      // Allow theme transition to complete
      await page.waitForTimeout(300);

      // Generate filename
      const filename = generateFilename(options, currentTheme);
      const filepath = join(absoluteOutputDir, filename);

      // Capture screenshot
      await page.screenshot({
        path: filepath,
        fullPage,
      });

      // Get file stats
      const stats = await stat(filepath);

      results.push({
        path: filepath,
        viewport,
        theme: currentTheme,
        timestamp: new Date(),
        url,
        size: stats.size,
      });

      console.log(
        `✓ Screenshot captured: ${filename} (${(stats.size / 1024).toFixed(2)} KB)`,
      );
    }

    return results;
  } catch (error) {
    console.error("Screenshot capture failed:", error);
    throw error;
  } finally {
    // Cleanup
    if (page) await page.close().catch(() => {});
    if (context) await context.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  }
}

/**
 * Capture screenshots across multiple viewports
 *
 * @param viewports - Array of viewport configurations
 * @param baseOptions - Base screenshot options
 * @returns Promise resolving to all screenshot results
 *
 * @example
 * ```typescript
 * // Capture across all standard viewports
 * const results = await captureMultipleViewports(
 *   [VIEWPORTS.mobile, VIEWPORTS.tablet, VIEWPORTS.desktop],
 *   { url: 'http://localhost:3022', theme: 'both' }
 * );
 * ```
 */
export async function captureMultipleViewports(
  viewports: ViewportConfig[],
  baseOptions: ScreenshotOptions = {},
): Promise<ScreenshotResult[]> {
  const allResults: ScreenshotResult[] = [];

  for (const viewport of viewports) {
    console.log(`\nCapturing ${viewport.name} viewport...`);
    const results = await captureScreenshot({
      ...baseOptions,
      viewport,
    });
    allResults.push(...results);
  }

  return allResults;
}

/**
 * Capture a complete screenshot suite (all viewports and themes)
 *
 * @param options - Base screenshot options
 * @returns Promise resolving to all screenshot results
 *
 * @example
 * ```typescript
 * // Capture complete screenshot suite
 * const results = await captureSuite({
 *   url: 'http://localhost:3022',
 *   outputDir: 'screenshots/suite'
 * });
 * ```
 */
export async function captureSuite(
  options: ScreenshotOptions = {},
): Promise<ScreenshotResult[]> {
  console.log("📸 Starting screenshot suite capture...\n");

  const viewports = [VIEWPORTS.mobile, VIEWPORTS.tablet, VIEWPORTS.desktop];

  const results = await captureMultipleViewports(viewports, {
    ...options,
    theme: "both",
  });

  console.log(
    `\n✅ Screenshot suite complete! Captured ${results.length} screenshots.`,
  );

  return results;
}
