import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Nerdy Arts | Handcrafted Art Pieces",
    template: "%s | The Nerdy Arts",
  },
  description:
    "Discover handcrafted art pieces that blend creativity with passion. Purchase original artworks or request custom commissions from The Nerdy Arts.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "The Nerdy Arts | Handcrafted Art Pieces",
    description:
      "Discover handcrafted art pieces that blend creativity with passion.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "The Nerdy Arts",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
