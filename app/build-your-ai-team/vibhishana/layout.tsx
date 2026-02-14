import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vibhishana — Research Intelligence Analyst | thelaunch.space",
  description:
    "Vibhishana knows what your market wants before your competitors do. 12 communities monitored daily, 410+ questions analyzed in week 1, strategic research briefs 3x/day.",
  openGraph: {
    title: "Vibhishana — Research Intelligence Analyst | thelaunch.space",
    description:
      "Know what your market struggles with this week. Content always aligned with real demand. Competitive gaps spotted first.",
    url: "https://thelaunch.space/build-your-ai-team/vibhishana",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibhishana — Research Intelligence Analyst | thelaunch.space",
    description:
      "Know what your market struggles with this week. Content always aligned with real demand. Competitive gaps spotted first.",
  },
};

export default function VibhishanaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
