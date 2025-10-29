/**
 * Screenshot Examples
 *
 * Demonstrates various ways to use the screenshot utility programmatically.
 * This file can be used as a reference for integrating screenshots into
 * agentic workflows or custom automation scripts.
 */

import {
  captureMultipleViewports,
  captureScreenshot,
  captureSuite,
  VIEWPORTS,
} from "../src/utils/screenshot";

/**
 * Example 1: Simple screenshot capture
 * Captures desktop screenshot in both light and dark themes
 */
async function example1() {
  console.log("\n=== Example 1: Simple Screenshot ===");

  const results = await captureScreenshot({
    url: "http://localhost:3022",
    theme: "both",
  });

  console.log(`Captured ${results.length} screenshots:`);
  for (const result of results) {
    console.log(`  - ${result.path} (${result.theme} theme)`);
  }
}

/**
 * Example 2: Mobile viewport with custom filename
 */
async function example2() {
  console.log("\n=== Example 2: Mobile Screenshot ===");

  const results = await captureScreenshot({
    viewport: VIEWPORTS.mobile,
    filename: "home-mobile",
    theme: "dark",
    outputDir: "screenshots/examples",
  });

  console.log(`Mobile screenshot saved to: ${results[0].path}`);
}

/**
 * Example 3: Full page screenshot
 * Captures entire scrollable page
 */
async function example3() {
  console.log("\n=== Example 3: Full Page Screenshot ===");

  const results = await captureScreenshot({
    fullPage: true,
    filename: "full-page",
    theme: "light",
    outputDir: "screenshots/examples",
  });

  console.log(`Full page screenshot: ${results[0].path}`);
  console.log(`Size: ${(results[0].size / 1024 / 1024).toFixed(2)} MB`);
}

/**
 * Example 4: Multiple viewports
 * Capture same URL in different viewports
 */
async function example4() {
  console.log("\n=== Example 4: Multiple Viewports ===");

  const viewports = [VIEWPORTS.mobile, VIEWPORTS.tablet, VIEWPORTS.desktop];

  const results = await captureMultipleViewports(viewports, {
    url: "http://localhost:3022",
    theme: "both",
    outputDir: "screenshots/examples",
  });

  console.log(
    `\nCaptured ${results.length} screenshots across ${viewports.length} viewports`,
  );
}

/**
 * Example 5: Complete suite
 * Capture all standard viewports in both themes
 */
async function example5() {
  console.log("\n=== Example 5: Complete Suite ===");

  const results = await captureSuite({
    url: "http://localhost:3022",
    outputDir: "screenshots/suite",
  });

  // Group by viewport
  const byViewport = results.reduce(
    (acc, result) => {
      const name = result.viewport.name;
      if (!acc[name]) acc[name] = [];
      acc[name].push(result);
      return acc;
    },
    {} as Record<string, typeof results>,
  );

  console.log("\nSuite summary:");
  for (const [viewport, screenshots] of Object.entries(byViewport)) {
    console.log(`  ${viewport}: ${screenshots.length} screenshots`);
  }
}

/**
 * Example 6: Wait for specific element before screenshot
 * Useful for dynamic content or SPAs
 */
async function example6() {
  console.log("\n=== Example 6: Wait for Element ===");

  const results = await captureScreenshot({
    url: "http://localhost:3022",
    waitForSelector: "header", // Wait for header to be visible
    delay: 2000, // Additional 2s delay for animations
    theme: "light",
    outputDir: "screenshots/examples",
  });

  console.log(`Screenshot after element load: ${results[0].path}`);
}

/**
 * Example 7: Headed mode for debugging
 * Shows browser window during capture (useful for development)
 */
async function example7() {
  console.log("\n=== Example 7: Headed Mode (Browser Visible) ===");

  const results = await captureScreenshot({
    headless: false,
    theme: "dark",
    delay: 3000, // Longer delay to see the browser
    outputDir: "screenshots/examples",
  });

  console.log(`Screenshot captured in headed mode: ${results[0].path}`);
}

/**
 * Example 8: Custom viewport configuration
 */
async function example8() {
  console.log("\n=== Example 8: Custom Viewport ===");

  const customViewport = {
    name: "Custom",
    width: 1366,
    height: 768,
    deviceScaleFactor: 1,
  };

  const results = await captureScreenshot({
    viewport: customViewport,
    theme: "both",
    outputDir: "screenshots/examples",
  });

  console.log(`Custom viewport screenshots:`);
  for (const result of results) {
    console.log(
      `  - ${result.viewport.width}×${result.viewport.height}: ${result.path}`,
    );
  }
}

/**
 * Run all examples
 */
async function runAllExamples() {
  try {
    console.log("🎬 Running Screenshot Examples");
    console.log("================================\n");

    await example1();
    await example2();
    await example3();
    await example4();
    await example5();
    await example6();
    // await example7(); // Commented out by default (opens browser)
    await example8();

    console.log("\n\n✅ All examples completed successfully!");
  } catch (error) {
    console.error("\n❌ Example failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runAllExamples();
}

export {
  example1,
  example2,
  example3,
  example4,
  example5,
  example6,
  example7,
  example8,
};
