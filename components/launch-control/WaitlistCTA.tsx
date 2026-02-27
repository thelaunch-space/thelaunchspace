"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function WaitlistCTA() {
  const { isSignedIn } = useAuth();

  // Hide entirely when signed in
  if (isSignedIn) return null;

  return (
    <div className="rounded-xl border border-border-color/40 bg-surface px-4 py-4 shrink-0">
      <p className="text-xs text-text-secondary mb-2 text-center">
        Want an AI team like this?
      </p>
      <Link
        href="/your-ai-team#contact"
        className="block text-center text-xs font-semibold px-3 py-2 sm:py-1.5 rounded-lg bg-accent-blue text-white hover:bg-accent-blue/90 transition-colors"
      >
        Get Your AI Team
      </Link>
    </div>
  );
}
