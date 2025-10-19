import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nova Control Dashboard | Genesis 22",
  description: "Interactive dashboard for project and user management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
