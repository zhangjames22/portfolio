// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "James Zhang — Student Portfolio",
  description:
    "I'm a student sharing selected projects and interests across quantitative research, finance, consulting, and software.",
  keywords: [
    "James Zhang",
    "Student Portfolio",
    "Projects",
    "Quant",
    "Finance",
    "Consulting",
    "Software",
    "Vanderbilt",
  ],
  authors: [{ name: "James Zhang", url: "mailto:jameszhang136@gmail.com" }],
  creator: "James Zhang",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "James Zhang — Student Portfolio",
    description:
      "Selected projects and interests across quant, finance, consulting, and software.",
    siteName: "James Zhang Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "James Zhang — Student Portfolio",
    description:
      "Selected projects and interests across quant, finance, consulting, and software.",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* Uses system font stack from globals.css (no external fonts) */}
      <body className="antialiased">{children}</body>
    </html>
  );
}
