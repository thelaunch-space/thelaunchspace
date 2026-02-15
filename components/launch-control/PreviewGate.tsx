"use client";

import { useState } from "react";

type State = "idle" | "submitting" | "done";

/**
 * Wraps tab content with a blur overlay + waitlist CTA for non-authenticated visitors.
 * Shows the first few rows of real data, then fades into a blur.
 */
export default function PreviewGate({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    setState("submitting");
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          source: "launch-control-preview-gate",
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // Silent fail
    }
    setState("done");
  }

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
      {/* Waitlist CTA at bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-5 pt-10">
        <div className="bg-surface/90 backdrop-blur-sm px-5 py-3 rounded-xl border border-border-color/40 text-center max-w-sm">
          {state === "done" ? (
            <>
              <p className="text-sm font-medium text-accent-emerald">You&apos;re on the list!</p>
              <p className="text-xs text-text-secondary mt-1">We&apos;ll reach out when spots open up.</p>
            </>
          ) : (
            <>
              <p className="text-xs font-medium text-text-primary mb-2">
                Want your own AI team?
              </p>
              <form onSubmit={handleSubmit} className="flex gap-1.5">
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 min-w-0 text-xs px-2.5 py-1.5 rounded-lg border border-border-color/40 bg-white text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-blue/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-accent-blue text-white hover:bg-accent-blue/90 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {state === "submitting" ? "..." : "Join Waitlist"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
