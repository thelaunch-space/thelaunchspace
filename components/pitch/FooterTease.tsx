"use client";

import { motion } from "framer-motion";

export default function FooterTease() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="text-center pb-16"
    >
      <span className="text-[10px] font-mono tracking-[0.12em] uppercase text-text-secondary">
        COMING SOON
      </span>
      <p className="text-text-secondary text-sm mt-2">
        More workstreams coming soon: Operations, Research, Tools.
      </p>
    </motion.section>
  );
}
