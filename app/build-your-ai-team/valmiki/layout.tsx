import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Valmiki — Social Content Strategist | thelaunch.space",
  description:
    "Valmiki writes your LinkedIn and X posts in your voice, not AI slop. Daily drafts, 7-point quality gate, 6 content archetypes — show up on social without the grind.",
  openGraph: {
    title: "Valmiki — Social Content Strategist | thelaunch.space",
    description:
      "Show up on social daily without spending 2 hours writing. Content that attracts clients, not just followers. Your voice, your authority.",
    url: "https://thelaunch.space/build-your-ai-team/valmiki",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Valmiki — Social Content Strategist | thelaunch.space",
    description:
      "Show up on social daily without spending 2 hours writing. Content that attracts clients, not just followers. Your voice, your authority.",
  },
};

export default function ValmikiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
