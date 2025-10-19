/**
 * Testing Utilities
 * Helpers and custom render functions for component testing
 */

import { type RenderOptions, render } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import type { ReactElement, ReactNode } from "react";

// Custom providers wrapper for testing
interface ProvidersProps {
  children: ReactNode;
  session?: any;
}

function Providers({ children, session = null }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </ThemeProvider>
  );
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  session?: any;
}

export function renderWithProviders(
  ui: ReactElement,
  { session, ...options }: CustomRenderOptions = {},
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <Providers session={session}>{children}</Providers>
    ),
    ...options,
  });
}

// Mock data generators
export const mockUser = (overrides = {}) => ({
  id: "1",
  email: "test@example.com",
  name: "Test User",
  role: "USER",
  image: null,
  ...overrides,
});

export const mockSession = (overrides = {}) => ({
  user: mockUser(),
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  ...overrides,
});

export const mockUtility = (overrides = {}) => ({
  id: "1",
  name: "test-utility",
  title: "Test Utility",
  description: "A test utility",
  category: "test",
  path: "/utilities/test",
  isActive: true,
  icon: "test",
  metadata: {},
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// API mock helpers
export function mockApiResponse<T>(data: T, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: new Headers(),
    statusText: status === 200 ? "OK" : "Error",
  } as Response);
}

export function mockApiError(message: string, status = 500) {
  return Promise.resolve({
    ok: false,
    status,
    json: async () => ({ error: message }),
    text: async () => message,
    headers: new Headers(),
    statusText: "Error",
  } as Response);
}

// Wait utilities
export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Local storage mock
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
  };
};

// Re-export testing library utilities
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
