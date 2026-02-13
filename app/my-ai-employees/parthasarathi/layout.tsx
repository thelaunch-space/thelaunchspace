import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parthasarathi — Operations Orchestrator | thelaunch.space",
  description:
    "Parthasarathi keeps the entire AI team running on schedule. 4 health checks daily, cross-team coordination, and due diligence reporting — so nothing falls through the cracks.",
  openGraph: {
    title: "Parthasarathi — Operations Orchestrator | thelaunch.space",
    description:
      "The conductor. Coordinates 4 AI agents, catches problems before they cascade, and delivers one daily report instead of checking 5 tools.",
    url: "https://thelaunch.space/my-ai-employees/parthasarathi",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parthasarathi — Operations Orchestrator | thelaunch.space",
    description:
      "The conductor. Coordinates 4 AI agents, catches problems before they cascade, and delivers one daily report instead of checking 5 tools.",
  },
};

export default function ParthasarathiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
