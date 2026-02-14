import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vyasa — SEO Blog Writer | thelaunch.space",
  description:
    "Vyasa turns market intelligence into content that ranks and attracts. 6 blogs published in week 1, optimized for search and AI citation, published daily on autopilot.",
  openGraph: {
    title: "Vyasa — SEO Blog Writer | thelaunch.space",
    description:
      "Your site becomes the go-to resource in your niche. Inbound leads from people who found your blog. 1 published article per day, on autopilot.",
    url: "https://thelaunch.space/build-your-ai-team/vyasa",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vyasa — SEO Blog Writer | thelaunch.space",
    description:
      "Your site becomes the go-to resource in your niche. Inbound leads from people who found your blog. 1 published article per day, on autopilot.",
  },
};

export default function VyasaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
