"use client";

import { motion } from "framer-motion";
import { PITCH_AGENTS } from "@/lib/pitch-data";
import { getAgent } from "@/lib/agents";
import AgentStatCard from "./AgentStatCard";

interface TeamSectionProps {
  agentStatuses: Array<{ agentName: string; lastStatus: string; lastTimestamp: string | null }> | undefined;
  weeklySummaries: Record<string, { total: number; byAction: Record<string, number> } | undefined>;
}

export default function TeamSection({ agentStatuses, weeklySummaries }: TeamSectionProps) {
  const activeAgents = PITCH_AGENTS.filter((pa) => !pa.comingSoon);
  const comingSoonAgents = PITCH_AGENTS.filter((pa) => pa.comingSoon);

  return (
    <section>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="font-display tracking-[-0.02em] text-2xl md:text-3xl text-text-primary"
      >
        Meet Your Team
      </motion.h2>

      {/* All agents in a single 6-col grid for uniform heights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-6 gap-6">
        {activeAgents.map((pa, i) => {
          const agent = getAgent(pa.agentId);
          if (!agent) return null;

          const status = agentStatuses?.find(
            (s) => s.agentName.toLowerCase() === agent.name.toLowerCase()
          );
          const summary = weeklySummaries[agent.name];

          return (
            <motion.div
              key={pa.agentId}
              className="md:col-span-2 h-full"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <AgentStatCard
                pitchAgent={pa}
                agent={agent}
                agentStatus={status}
                weeklySummary={summary}
              />
            </motion.div>
          );
        })}

        {/* Coming soon agents — centered in second row via col offsets */}
        {comingSoonAgents.map((pa, i) => {
          const agent = getAgent(pa.agentId);
          if (!agent) return null;

          return (
            <motion.div
              key={pa.agentId}
              className={`md:col-span-2 h-full ${i === 0 ? "md:col-start-2" : ""}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (activeAgents.length + i) * 0.12 }}
            >
              <AgentStatCard
                pitchAgent={pa}
                agent={agent}
                agentStatus={undefined}
                weeklySummary={undefined}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
