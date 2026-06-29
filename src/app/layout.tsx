import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://unzipafrica.com"),
  title: "Unzip Africa Safaris — Bespoke Safaris That Transform Your Soul",
  description:
    "Unzip Africa Safaris crafts private, $50,000+ bespoke safaris across East and Southern Africa. Gorilla trekking, Serengeti migrations, Okavango Delta — designed in silence, delivered in wonder.",
  keywords: [
    "luxury safari",
    "bespoke safari Africa",
    "gorilla trekking",
    "Serengeti migration",
    "Okavango Delta",
    "private safari",
    "Unzip Africa",
  ],
  authors: [{ name: "Unzip Africa Safaris" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Unzip Africa Safaris — Bespoke Safaris That Transform Your Soul",
    description:
      "Private, $50,000+ bespoke safaris. Designed in silence, delivered in wonder.",
    siteName: "Unzip Africa Safaris",
    type: "website",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unzip Africa Safaris",
    description: "Bespoke safaris that transform your soul.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${inter.variable} font-sans antialiased bg-canvas text-charcoal overflow-x-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
