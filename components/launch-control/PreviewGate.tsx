"use client";

import Link from "next/link";

/**
 * Wraps tab content with a blur overlay + CTA for non-authenticated visitors.
 * Shows the first few rows of real data, then fades into a blur.
 */
export default function PreviewGate({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden" style={{ maxHeight: 320 }}>
      {children}
      {/* Gradient blur overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ top: 100 }}>
        <div
          className="w-full h-full"
          style={{
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 35%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 35%)",
          }}
        />
      </div>
      {/* CTA at bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-5 pt-10">
        <div className="bg-surface/90 backdrop-blur-sm px-5 py-3 rounded-xl border border-border-color/40 text-center max-w-sm">
          <p className="text-xs font-medium text-text-primary mb-2">
            Want your own AI team?
          </p>
          <Link
            href="/hire-your-24x7-team#lead-capture"
            className="inline-block text-xs font-semibold px-4 py-1.5 rounded-lg bg-accent-blue text-white hover:bg-accent-blue/90 transition-colors"
          >
            Get Your AI Team
          </Link>
        </div>
      </div>
    </div>
  );
}
