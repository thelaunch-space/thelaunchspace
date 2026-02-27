import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hire Your 24/7 AI Team | thelaunch.space",
  description:
    "3 AI employees that handle your content marketing 24/7. Research, writing, publishing — all on autopilot. Start for $200.",
  openGraph: {
    title: "Hire Your 24/7 AI Team | thelaunch.space",
    description:
      "3 AI employees that handle your content marketing 24/7. Research, writing, publishing — all on autopilot. Start for $200.",
    url: "https://thelaunch.space/your-ai-team",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hire Your 24/7 AI Team | thelaunch.space",
    description:
      "3 AI employees that handle your content marketing 24/7. Start for $200.",
  },
};

export default function HireTeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
