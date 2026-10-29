"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Calendar, Sparkles, BookOpen, Coffee, Lightbulb, Trophy, Smile } from "lucide-react";

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  achievements?: string | null;
  caption?: string | null;
}

const FUN_FACTS = [
  "☕ Fueled by 99% coffee & 1% sleep",
  "🎓 Degree unlocked with high honors",
  "🧠 Neural nets built during lectures",
  "⚡ Survived 8 semesters of compiler debugging",
];

const DEFAULT_EDUCATION: EducationItem[] = [
  {
    id: "1",
    institution: "Major Institute of Technology & Science",
    degree: "B.Tech in Computer Science & Artificial Intelligence",
    duration: "2021 — 2025",
    achievements: "Specialized in Agentic AI Systems, RAG Pipelines, Vector Databases & Deep Learning. Graduated with Honors.",
  },
  {
    id: "2",
    institution: "Sri Chaitanya Junior College",
    degree: "Higher Secondary (PCM — Physics, Chemistry, Math)",
    duration: "2019 — 2021",
    achievements: "Top 1% percentile in State Board Exams. Lead Coordinator for National Science & Robotics Club.",
  },
];

export default function EducationSection({ items = [] }: { items?: EducationItem[] }) {
  const list = items.length > 0 ? items : DEFAULT_EDUCATION;
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [wobble, setWobble] = useState<number | null>(null);

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-4 select-none">
      {/* Centered Section Header */}
      <div className="space-y-3 max-w-xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider">
          <GraduationCap size={13} className="animate-bounce" />
          <span>Academic Odyssey</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground">
          Education &amp; Foundations{" "}
          <em
            style={{
              fontFamily: "var(--font-instrument, Georgia, serif)",
              fontStyle: "italic",
              fontWeight: 400,
              color: "var(--muted-foreground)",
            }}
          >
            the playground.
          </em>
        </h2>
        <p className="text-sm text-muted-foreground">
          Where algorithms met late-night espresso. Click any milestone to trigger funny reactions!
        </p>
      </div>

      {/* Interactive Curvy Pathway */}
      <div className="relative py-8">
        {/* Curvy Sine Wave Connector (SVG) */}
        <div className="hidden md:block absolute inset-0 pointer-events-none flex justify-center">
          <svg className="w-full h-full max-w-3xl" viewBox="0 0 800 500" fill="none" preserveAspectRatio="none">
            <path
              d="M 400,20 C 680,120 120,280 400,420"
              stroke="url(#curvyGradient)"
              strokeWidth="4"
              strokeDasharray="10 8"
              className="animate-pulse opacity-60"
            />
            <defs>
              <linearGradient id="curvyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating Funny Doodles */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:flex absolute top-4 left-6 items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-mono shadow-lg"
        >
          <Coffee size={14} className="text-amber-400" />
          <span>404: Sleep Not Found</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="hidden lg:flex absolute bottom-8 right-6 items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-mono shadow-lg"
        >
          <Lightbulb size={14} className="text-yellow-400" />
          <span>Eureka! It Compiled!</span>
        </motion.div>

        {/* Education Nodes along curvy layout */}
        <div className="space-y-12 md:space-y-20 relative z-10">
          {list.map((edu, idx) => {
            const isLeft = idx % 2 === 0;
            const isActive = activeIdx === idx;
            const isWobbling = wobble === idx;
            const funFact = FUN_FACTS[idx % FUN_FACTS.length];

            return (
              <motion.div
                key={edu.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className={`flex flex-col md:flex-row items-center gap-6 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                onClick={() => {
                  setActiveIdx(idx);
                  setWobble(idx);
                  setTimeout(() => setWobble(null), 600);
                }}
              >
                {/* Milestone Card */}
                <div className="w-full md:w-[46%]">
                  <motion.div
                    animate={
                      isWobbling
                        ? { rotate: [0, -4, 4, -2, 2, 0], scale: [1, 1.04, 1] }
                        : { rotate: 0, scale: 1 }
                    }
                    whileHover={{ scale: 1.02 }}
                    className={`relative p-6 sm:p-8 rounded-[28px] border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-br from-[#16142A] to-[#0D0B18] border-violet-500 shadow-2xl shadow-violet-500/20"
                        : "bg-[#0E0E18] border-white/[0.08] hover:border-violet-500/40"
                    }`}
                  >
                    {/* Bouncing Graduation Cap */}
                    <div className="absolute -top-3.5 -right-3.5 p-2.5 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xl border border-violet-400/40">
                      <GraduationCap size={18} />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono text-violet-300">
                          <Calendar size={12} />
                          <span>{edu.duration}</span>
                        </div>
                        <span className="font-mono text-xs text-zinc-500 font-bold">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-violet-400 transition-colors">
                          {edu.degree}
                        </h3>
                        <p className="text-sm font-semibold text-violet-400 mt-1">
                          {edu.institution}
                        </p>
                      </div>

                      {edu.achievements && (
                        <div className="pt-2.5 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2 text-left">
                          {edu.achievements
                            .split(/\r?\n/)
                            .map((line) => line.trim())
                            .filter(Boolean)
                            .map((bullet, bIdx) => {
                              const cleanText = bullet.replace(/^[-*•]\s*/, "");
                              return (
                                <div key={bIdx} className="flex items-start space-x-2 text-xs text-muted-foreground leading-relaxed">
                                  <span className="text-violet-500 dark:text-violet-400 font-bold select-none mt-0.5">•</span>
                                  <span>{cleanText}</span>
                                </div>
                              );
                            })}
                        </div>
                      )}

                      {/* Caption / Reaction badge */}
                      <div className="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-foreground/80">
                        <span className="font-medium">{edu.caption || funFact}</span>
                        <Smile size={13} className="text-amber-400 flex-shrink-0" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Central Wavy Orb Node */}
                <div className="relative flex items-center justify-center flex-shrink-0 z-20">
                  <motion.div
                    animate={{
                      scale: isActive ? [1, 1.25, 1] : 1,
                      rotate: isActive ? 360 : 0,
                    }}
                    transition={{ duration: 4, repeat: isActive ? Infinity : 0, ease: "linear" }}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer shadow-xl transition-all ${
                      isActive
                        ? "bg-violet-600 border-violet-300 text-white shadow-violet-500/50"
                        : "bg-[#0C0C14] border-white/20 text-muted-foreground hover:border-violet-500"
                    }`}
                  >
                    <BookOpen size={18} />
                  </motion.div>
                </div>

                {/* Symmetry Spacer */}
                <div className="hidden md:block w-[46%]" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
