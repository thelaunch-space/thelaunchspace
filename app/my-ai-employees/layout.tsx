import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My AI Employees | thelaunch.space",
  description:
    "Meet the AI team running thelaunch.space — 5 digital employees handling research, content, operations, and growth. See their real work.",
  openGraph: {
    title: "My AI Employees | thelaunch.space",
    description:
      "Meet the AI team running thelaunch.space — 5 digital employees handling research, content, operations, and growth.",
    url: "https://thelaunch.space/my-ai-employees",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "My AI Employees | thelaunch.space",
    description:
      "Meet the AI team running thelaunch.space — 5 digital employees handling research, content, operations, and growth.",
  },
};

export default function AIEmployeesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
