/**
 * Vitest Type Declarations
 * Extend Vitest's expect with jest-dom matchers
 */

/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import type { Assertion, AsymmetricMatchersContaining } from "vitest";

declare module "vitest" {
  interface Assertion<T = any>
    extends TestingLibraryMatchers<
      ReturnType<typeof expect.stringContaining>,
      T
    > {}

  interface AsymmetricMatchersContaining
    extends TestingLibraryMatchers<
      ReturnType<typeof expect.stringContaining>,
      any
    > {}
}
