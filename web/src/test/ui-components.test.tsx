/**
 * UI Component Tests
 * Testing Button, Badge, Avatar, and Card components
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader } from "../components/ui/Card";

describe("Button", () => {
  it("should render with primary variant by default", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-indigo-600");
  });

  it("should render with secondary variant", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole("button", { name: /secondary/i });
    expect(button).toHaveClass("bg-neutral-100");
  });

  it("should render with ghost variant", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole("button", { name: /ghost/i });
    expect(button).toHaveClass("bg-transparent");
  });

  it("should render with danger variant", () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByRole("button", { name: /danger/i });
    expect(button).toHaveClass("bg-rose-600");
  });

  it("should accept custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole("button", { name: /custom/i });
    expect(button).toHaveClass("custom-class");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
  });
});

describe("Badge", () => {
  it("should render with outline variant by default", () => {
    render(<Badge>Test Badge</Badge>);
    const badge = screen.getByText(/test badge/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("border");
  });

  it("should render with solid variant", () => {
    render(<Badge variant="solid">Solid</Badge>);
    const badge = screen.getByText(/solid/i);
    expect(badge).toHaveClass("bg-indigo-600/90");
  });

  it("should accept custom className", () => {
    render(<Badge className="custom-badge">Custom</Badge>);
    const badge = screen.getByText(/custom/i);
    expect(badge).toHaveClass("custom-badge");
  });
});

describe("Avatar", () => {
  it("should display initials for full name", () => {
    render(<Avatar name="John Doe" />);
    const avatar = screen.getByText("JD");
    expect(avatar).toBeInTheDocument();
  });

  it("should display single initial for single name", () => {
    render(<Avatar name="John" />);
    const avatar = screen.getByText("J");
    expect(avatar).toBeInTheDocument();
  });

  it("should handle names with extra spaces", () => {
    render(<Avatar name="  Alice   Bob  " />);
    const avatar = screen.getByText("AB");
    expect(avatar).toBeInTheDocument();
  });

  it("should display fallback for empty name", () => {
    render(<Avatar name="" />);
    const avatar = screen.getByText("—");
    expect(avatar).toBeInTheDocument();
  });

  it("should limit initials to 2 characters", () => {
    render(<Avatar name="Alice Bob Charlie" />);
    const avatar = screen.getByText("AB");
    expect(avatar).toBeInTheDocument();
  });
});

describe("Card", () => {
  it("should render children", () => {
    render(
      <Card>
        <div>Test Content</div>
      </Card>,
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should accept custom className", () => {
    const { container } = render(<Card className="custom-card">Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass("custom-card");
  });
});

describe("CardHeader", () => {
  it("should render title", () => {
    render(<CardHeader title="Test Title" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("should render hint when provided", () => {
    render(<CardHeader title="Title" hint="This is a hint" />);
    expect(screen.getByText("This is a hint")).toBeInTheDocument();
  });

  it("should render action when provided", () => {
    render(
      <CardHeader title="Title" action={<button type="button">Action</button>} />,
    );
    expect(screen.getByRole("button", { name: /action/i })).toBeInTheDocument();
  });

  it("should not render hint when not provided", () => {
    render(<CardHeader title="Title" />);
    const hint = screen.queryByText(/hint/i);
    expect(hint).not.toBeInTheDocument();
  });
});
