import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const jakarta = localFont({
  src: "./fonts/plus-jakarta-sans-latin-wght-normal.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Oravieo — Precision Dentistry",
  description:
    "Oravieo precision dentistry. Explore restorative, cosmetic and implant care with an interactive 3D smile experience.",
};

export const viewport: Viewport = {
  themeColor: "#0d2e4c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
