import type { Metadata, Viewport } from "next";
import { Sora, Syne } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://thelaunch.space"),
  title: "thelaunch.space | Idea to Revenue in 21 Days for Founders",
  description:
    "Focus on your business, not the build. We ship your MVP, landing page, or AI tool in 3-4 weeks. Get your 24h roadmap. No BS.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "thelaunch.space | Idea to Revenue in 21 Days for Founders",
    description:
      "Focus on your business, not the build. We ship your MVP, landing page, or AI tool in 3-4 weeks. Get your 24h roadmap. No BS.",
    url: "https://thelaunch.space",
    siteName: "thelaunch.space",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "21 days. idea to revenue. We think like your cofounder, and build like your CTO",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "thelaunch.space | Idea to Revenue in 21 Days for Founders",
    description:
      "Focus on your business, not the build. We ship your MVP, landing page, or AI tool in 3-4 weeks. Get your 24h roadmap. No BS.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${syne.variable}`}>
      <body>{children}</body>
    </html>
  );
}
