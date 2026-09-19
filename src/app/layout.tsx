import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mehroz | E-commerce Strategy & Creative Direction",
  description:
    "A refined portfolio website for a strategic e-commerce and brand consultant.",
  keywords: [
    "portfolio",
    "e-commerce strategy",
    "creative direction",
    "brand strategy",
    "SEO portfolio",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Mehroz | E-commerce Strategy & Creative Direction",
    description:
      "Portfolio website for an e-commerce expert and creative strategist.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehroz | E-commerce Strategy & Creative Direction",
    description:
      "Premium portfolio website for an e-commerce expert and creative strategist.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${cormorant.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
