"use client";

import React from "react";
import { motion } from "framer-motion";

interface SkillCardProps {
  name: string;
  category: string | null;
  description: string;
  years: number;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  AI: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/25", dot: "bg-violet-500" },
  Automation: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/25", dot: "bg-pink-500" },
  Languages: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/25", dot: "bg-cyan-500" },
  Frontend: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/25", dot: "bg-blue-500" },
  DevOps: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/25", dot: "bg-amber-500" },
  Databases: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/25", dot: "bg-emerald-500" },
  General: { bg: "bg-neutral-500/10", text: "text-neutral-400", border: "border-neutral-500/25", dot: "bg-neutral-500" },
};

export default function SkillCard({ name, category, description, years }: SkillCardProps) {
  const cat = category || "General";
  const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS["General"];

  const handleClick = () => {
    const query = `Tell me about Sahithi's experience with ${name}`;
    window.dispatchEvent(new CustomEvent("open-ai-chat", { detail: { query } }));
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className={`w-full text-left p-4 rounded-xl border ${colors.border} ${colors.bg} cursor-pointer transition-all duration-200 group`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          <span className={`text-sm font-bold ${colors.text}`}>{name}</span>
        </div>
        {years > 0 && (
          <span className="text-[10px] font-mono text-muted-foreground/70 bg-white/[0.03] px-1.5 py-0.5 rounded">
            {years}y
          </span>
        )}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 group-hover:text-muted-foreground/90 transition-colors">
          {description}
        </p>
      )}
      <div className="mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[9px] font-semibold text-accent-violet uppercase tracking-wider">Ask AI about this →</span>
      </div>
    </motion.button>
  );
}
