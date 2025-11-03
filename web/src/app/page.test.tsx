/**
 * UsersRoute Add User Tests
 * Ensures role inputs are normalized and validated before saving
 */

import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { UsersRoute } from "./page";

const roleTestCases: Array<{
  expectedRole: "admin" | "editor" | "viewer";
  input: string;
}> = [
  { expectedRole: "admin", input: "AdMiN" },
  { expectedRole: "editor", input: "EdItOr" },
  { expectedRole: "viewer", input: "ViEwEr" },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe("UsersRoute handleAddUser", () => {
  it.each(roleTestCases)(
    "registers $expectedRole when provided as mixed-case $input",
    ({ expectedRole, input }) => {
      const promptSpy = vi
        .spyOn(window, "prompt")
        .mockReturnValueOnce("Test User")
        .mockReturnValueOnce(`${expectedRole}@example.com`)
        .mockReturnValueOnce(input);

      const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

      render(<UsersRoute />);

      fireEvent.click(screen.getByRole("button", { name: /add user/i }));

      expect(promptSpy).toHaveBeenCalledTimes(3);
      expect(alertSpy).not.toHaveBeenCalled();

      const emailCell = screen.getByText(`${expectedRole}@example.com`);
      const row = emailCell.closest("div");
      expect(row).not.toBeNull();
      if (!row) {
        throw new Error("Row not found for new user");
      }

      expect(within(row).getByText(expectedRole)).toBeInTheDocument();
    },
  );
});
