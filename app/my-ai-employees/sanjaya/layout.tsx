import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sanjaya — Lead Intelligence Scout | thelaunch.space",
  description:
    "Sanjaya finds your next client before they find you. Daily scans across LinkedIn, X, Reddit, and job boards — qualified leads delivered with confidence scores.",
  openGraph: {
    title: "Sanjaya — Lead Intelligence Scout | thelaunch.space",
    description:
      "Pipeline fills without you scrolling LinkedIn. 3-tier qualification system, structured briefings, and market pattern recognition — all on autopilot.",
    url: "https://thelaunch.space/my-ai-employees/sanjaya",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanjaya — Lead Intelligence Scout | thelaunch.space",
    description:
      "Pipeline fills without you scrolling LinkedIn. 3-tier qualification system, structured briefings, and market pattern recognition — all on autopilot.",
  },
};

export default function SanjayaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
