import { Suspense } from "react";
import LandingPage from "@/components/LandingPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build My MVP | thelaunch.space",
  description:
    "Idea to revenue in 21 days. We ship your MVP, landing page, or AI tool in 3-4 weeks. Focus on your business, not the build.",
  openGraph: {
    title: "Build My MVP | thelaunch.space",
    description:
      "Idea to revenue in 21 days. We ship your MVP, landing page, or AI tool in 3-4 weeks.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Build My MVP with thelaunch.space",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Build My MVP | thelaunch.space",
    description:
      "Idea to revenue in 21 days. We ship your MVP, landing page, or AI tool in 3-4 weeks.",
    images: ["/og-image.png"],
  },
};

export default function BuildMyMvpPage() {
  return (
    <Suspense>
      <LandingPage />
    </Suspense>
  );
}
