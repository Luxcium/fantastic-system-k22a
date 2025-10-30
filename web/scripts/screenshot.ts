#!/usr/bin/env tsx
/**
 * Screenshot CLI Tool
 *
 * Command-line interface for capturing screenshots of the web application.
 * Supports multiple viewports, themes, and configurations.
 *
 * Usage:
 *   pnpm screenshot                    # Capture desktop screenshot in both themes
 *   pnpm screenshot --suite            # Capture complete suite (all viewports)
 *   pnpm screenshot --viewport mobile  # Capture mobile viewport
 *   pnpm screenshot --theme dark       # Capture dark theme only
 *   pnpm screenshot --url <url>        # Capture custom URL
 *   pnpm screenshot --help             # Show help
 */

import {
  captureScreenshot,
  captureSuite,
  VIEWPORTS,
} from "../src/utils/screenshot";

interface CLIOptions {
  url?: string;
  viewport?: string;
  theme?: "light" | "dark" | "both";
  fullPage?: boolean;
  outputDir?: string;
  filename?: string;
  suite?: boolean;
  headless?: boolean;
  help?: boolean;
}

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "--url":
      case "-u":
        options.url = args[++i];
        break;
      case "--viewport":
      case "-v":
        options.viewport = args[++i];
        break;
      case "--theme":
      case "-t":
        options.theme = args[++i] as "light" | "dark" | "both";
        break;
      case "--full-page":
      case "-f":
        options.fullPage = true;
        break;
      case "--output":
      case "-o":
        options.outputDir = args[++i];
        break;
      case "--filename":
      case "-n":
        options.filename = args[++i];
        break;
      case "--suite":
      case "-s":
        options.suite = true;
        break;
      case "--headless":
        options.headless = true;
        break;
      case "--headed":
        options.headless = false;
        break;
      case "--help":
      case "-h":
        options.help = true;
        break;
    }
  }

  return options;
}

function printHelp(): void {
  console.log(`
Screenshot CLI Tool

Usage:
  pnpm screenshot [options]

Options:
  -u, --url <url>           URL to capture (default: http://localhost:3022)
  -v, --viewport <name>     Viewport: mobile | tablet | desktop | desktop-hd
  -t, --theme <theme>       Theme: light | dark | both (default: both)
  -f, --full-page           Capture full scrollable page
  -o, --output <dir>        Output directory (default: screenshots/)
  -n, --filename <name>     Custom filename (without extension)
  -s, --suite               Capture complete suite (all viewports + themes)
  --headless                Run in headless mode (default: true)
  --headed                  Run in headed mode (show browser)
  -h, --help                Show this help message

Examples:
  pnpm screenshot
    Capture desktop screenshot in both themes

  pnpm screenshot --suite
    Capture complete suite (mobile, tablet, desktop × light & dark)

  pnpm screenshot --viewport mobile --theme dark
    Capture mobile viewport in dark theme

  pnpm screenshot --url http://localhost:3000 --filename home
    Capture custom URL with custom filename

  pnpm screenshot --full-page --headed
    Capture full page with visible browser

Available Viewports:
  mobile       375 × 667   (2x DPR)
  tablet       768 × 1024  (2x DPR)
  desktop      1920 × 1080 (1x DPR)
  desktop-hd   2560 × 1440 (1x DPR)
`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  try {
    if (options.suite) {
      // Capture complete suite
      await captureSuite({
        url: options.url,
        outputDir: options.outputDir,
        fullPage: options.fullPage,
        headless: options.headless,
      });
    } else {
      // Single viewport capture
      const viewport = options.viewport
        ? VIEWPORTS[options.viewport]
        : VIEWPORTS.desktop;

      if (!viewport) {
        console.error(
          `❌ Invalid viewport: ${options.viewport}. Use one of: mobile, tablet, desktop, desktop-hd`,
        );
        process.exit(1);
      }

      await captureScreenshot({
        url: options.url,
        viewport,
        theme: options.theme,
        fullPage: options.fullPage,
        outputDir: options.outputDir,
        filename: options.filename,
        headless: options.headless,
      });
    }

    console.log("\n🎉 Screenshot capture completed successfully!");
  } catch (error) {
    console.error("\n❌ Screenshot capture failed:");
    console.error(error);
    process.exit(1);
  }
}

main();
