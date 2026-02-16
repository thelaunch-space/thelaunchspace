"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

import HookSection from "./HookSection";
import HowItWorksSection from "./HowItWorksSection";
import TeamSection from "./TeamSection";
import TrustNudge from "./TrustNudge";
import RecentWorkSection from "./RecentWorkSection";
import TimelineSection from "./TimelineSection";
import PricingSection from "./PricingSection";
import LeadCaptureSection from "./LeadCaptureSection";
import SecondaryCtaSection from "./SecondaryCtaSection";
import FooterTease from "./FooterTease";

export default function PitchPage() {
  // ── Convex data ──────────────────────────────────────────────────────
  const weeklyStats = useQuery(api.agentActivity.weeklyStats);
  const allTimeStats = useQuery(api.agentActivity.allTimeStats);
  const agentStatuses = useQuery(api.agentActivity.agentStatuses);

  const parthaSummary = useQuery(api.agentActivity.agentWeeklySummary, {
    agentName: "Parthasarathi",
  });
  const vibhishanaSummary = useQuery(api.agentActivity.agentWeeklySummary, {
    agentName: "Vibhishana",
  });
  const vyasaSummary = useQuery(api.agentActivity.agentWeeklySummary, {
    agentName: "Vyasa",
  });

  const questions = useQuery(api.questions.listRecent, { limit: 10 });
  const briefs = useQuery(api.briefs.listMetadata, { limit: 10 });
  const blogs = useQuery(api.blogs.listRecent, { limit: 10 });

  // Bundle weekly summaries for TeamSection
  const weeklySummaries: Record<
    string,
    { total: number; byAction: Record<string, number> } | undefined
  > = {
    Parthasarathi: parthaSummary,
    Vibhishana: vibhishanaSummary,
    Vyasa: vyasaSummary,
  };

  // ── Floating CTA visibility ──────────────────────────────────────────
  const { scrollY } = useScroll();
  const [ctaVisible, setCtaVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    setCtaVisible(latest > 600);
  });

  // Suppress unused-var lint for allTimeStats (fetched for potential future use)
  void allTimeStats;

  return (
    <div className="min-h-[calc(100dvh-96px)] bg-background text-text-primary">
      <main className="py-6 md:py-8 space-y-16 md:space-y-24">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <HookSection weeklyStats={weeklyStats} />
        </div>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <HowItWorksSection />
        </div>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <TeamSection agentStatuses={agentStatuses} weeklySummaries={weeklySummaries} />
        </div>

        {/* Trust nudge: after meeting the team */}
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <TrustNudge
            message={`"I\u2019m my own first customer \u2014 these agents run thelaunch.space every day."`}
            linkText="Watch them work live"
            linkHref="/launch-control"
            arrow="swoop"
          />
        </div>

        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <RecentWorkSection questions={questions} briefs={briefs} blogs={blogs} />
        </div>

        {/* Trust nudge: after seeing real work */}
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <TrustNudge
            message="Not a demo. That\u2019s real output from this week."
            linkText="Check their progress"
            linkHref="/launch-control"
            arrow="bounce"
          />
        </div>

        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <TimelineSection />
        </div>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <PricingSection />
        </div>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <LeadCaptureSection />
        </div>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <SecondaryCtaSection />
        </div>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <FooterTease />
        </div>
      </main>

      {/* Floating CTA */}
      <motion.a
        href="#lead-capture"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-cta hover:shadow-cta-hover"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={
          ctaVisible
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 20, scale: 0.9, pointerEvents: "none" as const }
        }
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        Get your AI team
      </motion.a>
    </div>
  );
}
