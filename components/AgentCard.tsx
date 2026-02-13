"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Agent } from "@/lib/agents";

type CardSize = "highlight" | "standard" | "compact";

export default function AgentCard({
  agent,
  size = "standard",
}: {
  agent: Agent;
  size?: CardSize;
}) {
  const [imgError, setImgError] = useState(false);

  const isHighlight = size === "highlight";
  const isCompact = size === "compact";

  const imageHeightClass = isHighlight
    ? "h-48 md:h-64"
    : isCompact
      ? "h-28 md:h-36"
      : "h-40 md:h-48";

  return (
    <motion.div
      className="agent-card-scan relative group rounded-2xl md:rounded-3xl border border-border-color overflow-hidden flex flex-col h-full"
      style={
        {
          "--agent-color": `${agent.accentHex}08`,
          background: `linear-gradient(145deg, ${agent.accentHex}06 0%, transparent 50%)`,
        } as React.CSSProperties
      }
      whileHover={{
        boxShadow: `0 8px 60px ${agent.accentHex}15, 0 0 100px ${agent.accentHex}06`,
        borderColor: `${agent.accentHex}30`,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      {/* ─── Avatar image area ─── */}
      <div
        className={`relative overflow-hidden ${imageHeightClass}`}
        style={{
          background: `linear-gradient(160deg, ${agent.accentHex}12 0%, ${agent.accentHex}04 100%)`,
        }}
      >
        {!imgError ? (
          <img
            src={agent.avatarPath}
            alt={agent.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="font-display font-bold opacity-[0.15] select-none"
              style={{
                fontSize: isHighlight
                  ? "clamp(6rem, 15vw, 10rem)"
                  : isCompact
                    ? "clamp(3rem, 8vw, 5rem)"
                    : "clamp(4rem, 12vw, 7rem)",
                color: agent.accentHex,
                lineHeight: 1,
              }}
            >
              {agent.name[0]}
            </span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 right-3 md:top-4 md:right-4">
          <span className="text-[10px] md:text-[11px] px-2 md:px-2.5 py-0.5 md:py-1 rounded-full font-semibold backdrop-blur-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">
            Active
          </span>
        </div>

        {/* Bottom gradient fade into card body */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{
            background: "linear-gradient(to top, #101018, transparent)",
          }}
        />
      </div>

      {/* ─── Content ─── */}
      <div
        className={`flex-1 flex flex-col ${
          isHighlight
            ? "p-5 md:p-7"
            : isCompact
              ? "p-4 md:p-5"
              : "p-5 md:p-6"
        }`}
      >
        {/* Role pill */}
        <div className="flex items-center gap-2 mb-2.5">
          <div
            className="w-1.5 h-1.5 rounded-full animate-glow-pulse"
            style={{ background: agent.accentHex }}
          />
          <span
            className={`font-semibold uppercase tracking-widest text-text-secondary ${
              isCompact ? "text-[9px] md:text-[10px]" : "text-[10px] md:text-xs"
            }`}
          >
            {agent.role}
          </span>
        </div>

        {/* Name */}
        <h3
          className={`font-bold leading-tight ${
            isHighlight
              ? "text-2xl md:text-3xl mb-3"
              : isCompact
                ? "text-base md:text-lg mb-1.5"
                : "text-xl md:text-2xl mb-2"
          }`}
        >
          {agent.name}
        </h3>

        {/* Compact: single-line description. Highlight/Standard: outcome bullets */}
        {isCompact ? (
          <p className="text-xs md:text-sm mb-3 line-clamp-2 text-text-secondary leading-relaxed flex-1">
            {agent.description}
          </p>
        ) : (
          <ul
            className={`flex-1 space-y-1.5 ${
              isHighlight ? "mb-5" : "mb-4"
            }`}
          >
            {agent.outcomes.map((outcome) => (
              <li key={outcome} className="flex items-start gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ background: agent.accentHex }}
                />
                <span
                  className={`text-text-secondary leading-relaxed ${
                    isHighlight ? "text-sm md:text-base" : "text-xs md:text-sm"
                  }`}
                >
                  {outcome}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <Link
          href={`/my-ai-employees/${agent.workPageSlug}`}
          className={`group/btn inline-flex items-center gap-2 font-semibold rounded-lg transition-all w-fit ${
            isHighlight
              ? "text-sm py-2.5 px-4"
              : "text-xs md:text-sm py-2 px-3 md:py-2.5 md:px-4"
          }`}
          style={{
            background: `${agent.accentHex}12`,
            color: agent.accentHex,
          }}
        >
          See How I Work
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover/btn:translate-x-1"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}
