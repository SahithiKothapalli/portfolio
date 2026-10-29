"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  Database,
  Layers,
  Sparkles,
  Workflow,
  ShieldCheck,
  Code2,
  Server,
  Cloud,
  Boxes,
  Network,
  RotateCw,
} from "lucide-react";

export interface SkillItem {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  yearsOfExperience: number | null;
  order: number | null;
}

interface SkillsPeriodicTableProps {
  skills: SkillItem[];
}

// ─────────────────────────────────────────────
// Real Brand SVGs (Official Colors & Inline SVGs)
// ─────────────────────────────────────────────
export const BRAND_SVGS: Record<string, { color: string; svg: React.ReactNode }> = {
  python: {
    color: "#3776AB",
    svg: (
      <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
        <path d="M63.5 13C40.6 13 42 22.9 42 22.9L42.1 33.2H64v3.1H32.4S18 34.7 18 57.6c0 22.9 12.6 22.1 12.6 22.1h7.5V69.3s-.4-12.6 12.4-12.6h21.4s11.8.2 11.8-11.4V24.5S85.7 13 63.5 13zm-11.7 6.9c2.3 0 4.1 1.9 4.1 4.1 0 2.3-1.9 4.1-4.1 4.1s-4.1-1.9-4.1-4.1c0-2.3 1.8-4.1 4.1-4.1z" fill="#3776AB"/>
        <path d="M64.5 115c22.9 0 21.5-9.9 21.5-9.9l-.1-10.3H64v-3.1h31.6s14.4 1.6 14.4-21.3c0-22.9-12.6-22.1-12.6-22.1h-7.5v10.4s.4 12.6-12.4 12.6H54s-11.8-.2-11.8 11.4v20.8S42.3 115 64.5 115zm11.7-6.9c-2.3 0-4.1-1.9-4.1-4.1 0-2.3 1.9-4.1 4.1-4.1 2.3 0 4.1 1.9 4.1 4.1 0 2.2-1.8 4.1-4.1 4.1z" fill="#FFD43B"/>
      </svg>
    ),
  },
  typescript: {
    color: "#3178C6",
    svg: (
      <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
        <rect width="128" height="128" rx="20" fill="#3178C6"/>
        <path d="M38 98V50h14v48H38zm-14-38V50h42v10H24zm58 20.5c2.3 3.5 6.2 5.5 11.2 5.5 5.5 0 9.2-2.8 9.2-7.2 0-11.6-22-6.5-22-22.4 0-8.8 7-15.4 18.2-15.4 6.8 0 12.3 2.5 16.4 7.2l-7.2 7c-2.5-3-5.5-4.5-9.2-4.5-4.8 0-7.8 2.5-7.8 6 0 10.5 22 5.8 22 22.2 0 9.2-7.5 16.2-19.5 16.2-8.5 0-15.2-3.2-19.8-9.4l8.5-5.2z" fill="#FFFFFF"/>
      </svg>
    ),
  },
  javascript: {
    color: "#F7DF1E",
    svg: (
      <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
        <rect width="128" height="128" rx="20" fill="#F7DF1E"/>
        <path d="M38 100c3 5 7.5 7.5 13.5 7.5 8 0 13.5-4.5 13.5-14V50H51v43.5c0 3-1.5 4.5-4 4.5-2.5 0-4-1.5-5.5-4.5L38 100zm45 0c4.5 5 10 7.5 17 7.5 10 0 16.5-5.5 16.5-13.5 0-9-6.5-12.5-15-16.5l-4-2c-4-2-6-3.5-6-6.5 0-3 2.5-5 6.5-5 3.5 0 6.5 1.5 9 4.5l8-7.5c-4-5-9.5-7.5-17-7.5-9.5 0-16 5.5-16 13.5 0 8.5 6 12 14 16l4 2c4.5 2 7 4 7 7.5 0 3.5-3 5.5-7.5 5.5-5 0-8.5-2.5-11-6.5l-11.5 7z" fill="#000000"/>
      </svg>
    ),
  },
  react: {
    color: "#61DAFB",
    svg: (
      <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
        <ellipse cx="64" cy="64" rx="14" ry="14" fill="#61DAFB"/>
        <ellipse cx="64" cy="64" rx="54" ry="20" stroke="#61DAFB" strokeWidth="6" transform="rotate(0 64 64)"/>
        <ellipse cx="64" cy="64" rx="54" ry="20" stroke="#61DAFB" strokeWidth="6" transform="rotate(60 64 64)"/>
        <ellipse cx="64" cy="64" rx="54" ry="20" stroke="#61DAFB" strokeWidth="6" transform="rotate(120 64 64)"/>
      </svg>
    ),
  },
  nextjs: {
    color: "#FFFFFF",
    svg: (
      <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
        <circle cx="64" cy="64" r="60" fill="#000000" stroke="#FFFFFF" strokeWidth="4"/>
        <path d="M44 42v44h11V60.5l29 25.5h11V42h-11v25.5L55 42H44z" fill="#FFFFFF"/>
      </svg>
    ),
  },
  fastapi: {
    color: "#05998B",
    svg: (
      <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
        <circle cx="64" cy="64" r="58" fill="#05998B"/>
        <path d="M68 22L36 72h26l-6 34 36-54H64l6-30z" fill="#FFFFFF"/>
      </svg>
    ),
  },
  docker: {
    color: "#2496ED",
    svg: (
      <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
        <path d="M120 54c-2-1-8-2-12 1-1-6-6-11-12-11-1 0-2 0-3 .5C91 32 79 32 73 34v10H16c-3 0-5 2-5 5v14c0 18 13 32 32 34 14 1 27-4 37-13 14-3 26-14 29-27 4-1 9-1 11-3z" fill="#2496ED"/>
        <rect x="26" y="48" width="10" height="9" rx="1" fill="#FFFFFF"/>
        <rect x="40" y="48" width="10" height="9" rx="1" fill="#FFFFFF"/>
        <rect x="54" y="48" width="10" height="9" rx="1" fill="#FFFFFF"/>
        <rect x="40" y="36" width="10" height="9" rx="1" fill="#FFFFFF"/>
        <rect x="54" y="36" width="10" height="9" rx="1" fill="#FFFFFF"/>
        <rect x="68" y="36" width="10" height="9" rx="1" fill="#FFFFFF"/>
      </svg>
    ),
  },
  postgresql: {
    color: "#4169E1",
    svg: (
      <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
        <path d="M64 16c-24 0-38 18-38 38 0 16 10 30 22 36-2 5-6 11-12 14 10 0 20-5 26-13 4 1 8 1 12 1 24 0 38-18 38-38 0-20-14-38-38-38zm-12 28c4 0 7 3 7 7s-3 7-7 7-7-3-7-7 3-7 7-7zm24 0c4 0 7 3 7 7s-3 7-7 7-7-3-7-7 3-7 7-7z" fill="#4169E1"/>
      </svg>
    ),
  },
  redis: {
    color: "#DC382D",
    svg: (
      <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
        <path d="M64 18L18 42l46 24 46-24-46-24z" fill="#DC382D"/>
        <path d="M18 56l46 24 46-24v16L64 96 18 72V56z" fill="#A82820"/>
        <path d="M18 80l46 24 46-24v16L64 120 18 96V80z" fill="#751A15"/>
      </svg>
    ),
  },
  mongodb: {
    color: "#47A248",
    svg: (
      <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
        <path d="M64 14c0 30-28 42-28 66 0 20 14 34 28 34s28-14 28-34c0-24-28-36-28-66z" fill="#47A248"/>
        <path d="M64 14v100c14 0 28-14 28-34 0-24-28-36-28-66z" fill="#3FA037"/>
        <path d="M64 114v6s-2 0-3-2c-1-2-1-4 3-4z" fill="#A6A495"/>
      </svg>
    ),
  },
  pytorch: {
    color: "#EE4C2C",
    svg: (
      <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
        <path d="M64 20L44 40c-11 11-11 30 0 41s30 11 41 0l7-7-9-9-7 7c-6 6-17 6-23 0s-6-17 0-23l18-18 18 18c6 6 6 17 0 23l-3 3 9 9 3-3c11-11 11-30 0-41L64 20z" fill="#EE4C2C"/>
        <circle cx="82" cy="34" r="5" fill="#EE4C2C"/>
      </svg>
    ),
  },
  git: {
    color: "#F05032",
    svg: (
      <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
        <path d="M117 56L72 11c-4-4-10-4-14 0L47 22l14 14c4-1 9 0 12 3 4 4 4 10 1 14l14 14c4-2 9-1 12 2 5 5 5 12 0 17s-12 5-17 0c-4-3-4-8-2-12L67 60v32c2 1 3 3 3 6 0 6-4 10-10 10s-10-4-10-10c0-4 3-8 7-9V56c-4-1-7-5-7-9 0-3 1-6 3-8L40 25 11 54c-4 4-4 10 0 14l45 45c4 4 10 4 14 0l47-47c4-4 4-10 0-14z" fill="#F05032"/>
      </svg>
    ),
  },
  langchain: {
    color: "#1C3C3C",
    svg: (
      <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
        <circle cx="64" cy="64" r="56" fill="#1C3C3C" stroke="#2DD4BF" strokeWidth="4"/>
        <path d="M42 64h44M64 42v44M50 50l28 28M78 50L50 78" stroke="#2DD4BF" strokeWidth="8" strokeLinecap="round"/>
      </svg>
    ),
  },
  tailwind: {
    color: "#06B6D4",
    svg: (
      <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
        <path d="M34 58c5-16 16-24 33-24 23 0 29 16 39 18 7 1 12-4 16-12-5 16-16 24-33 24-23 0-29-16-39-18-7-1-12 4-16 12zm-28 32c5-16 16-24 33-24 23 0 29 16 39 18 7 1 12-4 16-12-5 16-16 24-33 24-23 0-29-16-39-18-7-1-12 4-16 12z" fill="#06B6D4"/>
      </svg>
    ),
  },
  n8n: {
    color: "#EA4B71",
    svg: (
      <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
        <rect width="128" height="128" rx="28" fill="#EA4B71"/>
        <circle cx="44" cy="64" r="14" fill="#FFFFFF"/>
        <circle cx="84" cy="64" r="14" fill="#FFFFFF"/>
        <path d="M44 64h40" stroke="#FFFFFF" strokeWidth="8"/>
      </svg>
    ),
  },
};

// ─────────────────────────────────────────────
// Concept Icons & Colors
// ─────────────────────────────────────────────
export const CONCEPT_MAP: Record<string, { icon: React.ReactNode; color: string }> = {
  rag: { icon: <BrainCircuit className="w-full h-full" />, color: "#8B5CF6" },
  mcp: { icon: <Workflow className="w-full h-full" />, color: "#A855F7" },
  agents: { icon: <Sparkles className="w-full h-full" />, color: "#EC4899" },
  "system design": { icon: <Boxes className="w-full h-full" />, color: "#3B82F6" },
  dsa: { icon: <Code2 className="w-full h-full" />, color: "#F59E0B" },
  oop: { icon: <Boxes className="w-full h-full" />, color: "#10B981" },
  "rest api": { icon: <Network className="w-full h-full" />, color: "#06B6D4" },
  microservices: { icon: <Server className="w-full h-full" />, color: "#6366F1" },
  cloud: { icon: <Cloud className="w-full h-full" />, color: "#38BDF8" },
  security: { icon: <ShieldCheck className="w-full h-full" />, color: "#10B981" },
};

export function isBrand(name: string): boolean {
  const norm = name.toLowerCase().replace(/[\s\.-]/g, "");
  return Object.keys(BRAND_SVGS).some((k) => norm.includes(k) || k.includes(norm));
}

export function TechLogo({ name, size = 26 }: { name: string; size?: number }) {
  const norm = name.toLowerCase().replace(/[\s\.-]/g, "");
  const matchedKey = Object.keys(BRAND_SVGS).find((k) => norm.includes(k) || k.includes(norm));

  if (matchedKey) {
    return (
      <div style={{ width: size, height: size }} className="flex items-center justify-center flex-shrink-0">
        {BRAND_SVGS[matchedKey].svg}
      </div>
    );
  }

  const conceptKey = Object.keys(CONCEPT_MAP).find((k) => norm.includes(k) || k.includes(norm));
  if (conceptKey) {
    return (
      <div
        style={{ width: size, height: size, color: CONCEPT_MAP[conceptKey].color }}
        className="flex items-center justify-center p-0.5 flex-shrink-0"
      >
        {CONCEPT_MAP[conceptKey].icon}
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center font-mono font-bold text-violet-500 text-xs rounded-lg bg-violet-500/10 border border-violet-500/20 flex-shrink-0"
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

// ─────────────────────────────────────────────
// Capability Domains
// ─────────────────────────────────────────────
const DOMAINS = [
  { id: "all", label: "All Capabilities" },
  { id: "ai", label: "AI & Agents", color: "#8B5CF6" },
  { id: "languages", label: "Languages", color: "#F59E0B" },
  { id: "frontend", label: "Frontend", color: "#06B6D4" },
  { id: "backend", label: "Backend", color: "#10B981" },
  { id: "databases", label: "Databases", color: "#F97316" },
  { id: "devops", label: "DevOps & Cloud", color: "#3B82F6" },
  { id: "architecture", label: "Architecture", color: "#EC4899" },
];

function getDomain(skill: SkillItem): { domain: string; color: string } {
  const cat = (skill.category || "").toLowerCase();
  const name = skill.name.toLowerCase();

  if (cat.includes("ai") || cat.includes("ml") || cat.includes("agent") || name.includes("rag") || name.includes("langchain")) {
    return { domain: "AI & Agents", color: "#8B5CF6" };
  }
  if (cat.includes("lang") || name.includes("python") || name.includes("typescript") || name.includes("javascript")) {
    return { domain: "Languages", color: "#F59E0B" };
  }
  if (cat.includes("front") || name.includes("react") || name.includes("next") || name.includes("tailwind")) {
    return { domain: "Frontend", color: "#06B6D4" };
  }
  if (cat.includes("back") || name.includes("fastapi") || name.includes("node") || name.includes("express")) {
    return { domain: "Backend", color: "#10B981" };
  }
  if (cat.includes("data") || name.includes("sql") || name.includes("mongo") || name.includes("redis") || name.includes("vector")) {
    return { domain: "Databases", color: "#F97316" };
  }
  if (cat.includes("devops") || cat.includes("cloud") || name.includes("docker") || name.includes("git")) {
    return { domain: "DevOps & Cloud", color: "#3B82F6" };
  }
  return { domain: "Architecture", color: "#EC4899" };
}

function getSymbol(name: string): string {
  const clean = name.replace(/[^a-zA-Z]/g, "");
  if (clean.length <= 2) return clean.toUpperCase();
  const words = name.split(/[\s\.-]/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

// ─────────────────────────────────────────────
// Main Skills Capability Matrix Component
// ─────────────────────────────────────────────
export default function SkillsPeriodicTable({ skills }: SkillsPeriodicTableProps) {
  const [activeDomain, setActiveDomain] = useState<string>("all");
  const [flippedId, setFlippedId] = useState<string | null>(null);

  // Fallback skills if empty
  const displaySkills = useMemo(() => {
    if (skills && skills.length > 0) return skills;
    return [
      { id: "1", name: "Python", category: "Languages", description: "Primary programming language for deep learning, RAG pipelines, and agent reasoning loops.", yearsOfExperience: 3.5, order: 1 },
      { id: "2", name: "TypeScript", category: "Languages", description: "Type-safe engineering across full-stack applications and high-speed API endpoints.", yearsOfExperience: 3, order: 2 },
      { id: "3", name: "RAG Systems", category: "AI", description: "Hybrid retrieval, vector search with BM25, and semantic reranking pipelines.", yearsOfExperience: 3, order: 3 },
      { id: "4", name: "LangChain", category: "AI", description: "Agent orchestration, LCEL primitives, memory management, and tool integration.", yearsOfExperience: 2.5, order: 4 },
      { id: "5", name: "FastAPI", category: "Backend", description: "High-throughput asynchronous Python microservices with OpenAPI documentation.", yearsOfExperience: 3, order: 5 },
      { id: "6", name: "Next.js", category: "Frontend", description: "App router, React Server Components, server actions, and streaming interfaces.", yearsOfExperience: 3, order: 6 },
      { id: "7", name: "React", category: "Frontend", description: "Interactive client state machines, custom UI hooks, and Framer Motion visuals.", yearsOfExperience: 3, order: 7 },
      { id: "8", name: "Docker", category: "DevOps", description: "Containerized deployment pipelines, multi-stage builds, and isolated agent runtimes.", yearsOfExperience: 2.5, order: 8 },
      { id: "9", name: "PostgreSQL", category: "Databases", description: "Relational persistence, pgvector embeddings, and optimized schema indexing.", yearsOfExperience: 3, order: 9 },
      { id: "10", name: "Redis", category: "Databases", description: "In-memory caching, pub/sub queues, rate limiting, and session state.", yearsOfExperience: 2.5, order: 10 },
      { id: "11", name: "PyTorch", category: "AI", description: "Deep learning workflows, tensor calculations, and fine-tuning embeddings.", yearsOfExperience: 2, order: 11 },
      { id: "12", name: "MongoDB", category: "Databases", description: "NoSQL document persistence for chat sessions, logs, and dynamic JSON payloads.", yearsOfExperience: 2.5, order: 12 },
      { id: "13", name: "n8n", category: "AI", description: "Visual node automation, autonomous tool routing, and webhook triggers.", yearsOfExperience: 2.5, order: 13 },
      { id: "14", name: "Git", category: "DevOps", description: "Version control, branching strategies, GitOps CI/CD workflows.", yearsOfExperience: 3.5, order: 14 },
      { id: "15", name: "Tailwind", category: "Frontend", description: "Utility-first CSS styling, responsive layout designs, and luxury themes.", yearsOfExperience: 3, order: 15 },
      { id: "16", name: "System Design", category: "Architecture", description: "Distributed consensus, fault tolerance, caching layers, and decoupled event architectures.", yearsOfExperience: 3, order: 16 },
    ];
  }, [skills]);

  const activeDomainItem = DOMAINS.find((d) => d.id === activeDomain);

  return (
    <div className="space-y-8 select-none max-w-7xl mx-auto px-4 sm:px-6">
      {/* ─── Editorial Section Heading ─── */}
      <div className="space-y-3 max-w-2xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider">
          <BrainCircuit size={12} />
          <span>Capability Matrix</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground">
          Core Capabilities{" "}
          <span className="font-instrument italic font-normal text-muted-foreground/90">
            I&apos;ve engineered.
          </span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Technical proficiencies organized by system capability — hover or tap any element to reveal technical depth.
        </p>
      </div>

      {/* ─── Domain Filter Chips ─── */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        {DOMAINS.map((dom) => {
          const isSelected = activeDomain === dom.id;
          return (
            <button
              key={dom.id}
              onClick={() => setActiveDomain(dom.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                isSelected
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30 scale-105"
                  : "bg-white/[0.04] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-muted-foreground hover:text-foreground hover:border-violet-500/40"
              }`}
            >
              {dom.color && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: dom.color }}
                />
              )}
              <span>{dom.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Strictly 5 Columns on Desktop per Requirement ─── */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3.5">
        {displaySkills.map((sk, idx) => {
          const { domain, color } = getDomain(sk);
          const symbol = getSymbol(sk.name);
          const isMatch =
            activeDomain === "all" ||
            domain.toLowerCase().includes(activeDomainItem?.label.toLowerCase() || "") ||
            activeDomainItem?.label.toLowerCase().includes(domain.toLowerCase());
          const isFlipped = flippedId === sk.id;

          return (
            <motion.div
              key={sk.id}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{
                opacity: isMatch ? 1 : 0.22,
                scale: isMatch ? 1 : 0.95,
                filter: isMatch ? "grayscale(0%)" : "grayscale(80%)",
              }}
              transition={{
                duration: 0.35,
                delay: Math.min(0.35, ((idx % 5) + Math.floor(idx / 5)) * 0.03),
              }}
              className="group/card perspective-1000 [perspective:1000px] h-[126px] sm:h-[132px] w-full"
              onClick={() => setFlippedId(isFlipped ? null : sk.id)}
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 preserve-3d [transform-style:preserve-3d] cursor-pointer rounded-2xl ${
                  isFlipped
                    ? "[transform:rotateY(180deg)]"
                    : "group-hover/card:[transform:rotateY(180deg)]"
                }`}
              >
                {/* ─── FRONT FACE ─── */}
                <div
                  className={`absolute inset-0 w-full h-full backface-hidden [backface-visibility:hidden] p-3 rounded-2xl border flex flex-col justify-between overflow-hidden transition-all duration-200 ${
                    isFlipped
                      ? "bg-violet-500/10 dark:bg-violet-500/15 border-violet-500 shadow-md shadow-violet-500/20"
                      : "bg-white dark:bg-[#0E0F15] border-black/[0.08] dark:border-white/[0.08] group-hover/card:border-violet-500/40 shadow-sm"
                  }`}
                >
                  {/* Top Bar: Order & Symbol */}
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[9px] text-muted-foreground font-semibold">
                      {String(sk.order || idx + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="font-mono font-black text-sm tracking-tight"
                      style={{ color }}
                    >
                      {symbol}
                    </span>
                  </div>

                  {/* Center: Brand SVG Logo or Concept Vector */}
                  <div className="flex items-center justify-center my-0.5 relative">
                    <div
                      className="absolute inset-0 rounded-full blur-md opacity-20 pointer-events-none"
                      style={{ backgroundColor: color }}
                    />
                    <TechLogo name={sk.name} size={28} />
                  </div>

                  {/* Bottom: Name & Domain Tag */}
                  <div className="flex items-end justify-between truncate text-left">
                    <div className="truncate pr-1">
                      <p className="text-[11px] font-bold text-foreground truncate group-hover/card:text-violet-500 dark:group-hover/card:text-violet-400 transition-colors">
                        {sk.name}
                      </p>
                      <p className="text-[9px] text-muted-foreground truncate uppercase tracking-widest font-mono">
                        {domain.split(" ")[0]}
                      </p>
                    </div>
                    <span
                      className="text-[10px] text-muted-foreground/60 group-hover/card:text-violet-400 font-mono flex-shrink-0"
                      title="Click or hover to flip"
                    >
                      ↻
                    </span>
                  </div>
                </div>

                {/* ─── BACK FACE ─── */}
                <div
                  className="absolute inset-0 w-full h-full backface-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] p-3 rounded-2xl border border-violet-500/40 dark:border-violet-500/50 bg-gradient-to-b from-white via-zinc-50 to-zinc-100 dark:from-[#12131A] dark:via-[#0F1016] dark:to-[#0A0B0E] flex flex-col justify-between shadow-xl text-left overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-1">
                    <div className="flex items-center space-x-1.5 truncate pr-1">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="font-mono font-bold text-[10px] text-foreground truncate">
                        {sk.name}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] font-bold text-violet-600 dark:text-violet-300 px-1.5 py-0.5 rounded-full bg-violet-500/10 flex-shrink-0">
                      {sk.yearsOfExperience ? `${sk.yearsOfExperience}y exp` : "3+ yrs"}
                    </span>
                  </div>

                  <p className="text-[10px] text-muted-foreground line-clamp-3 leading-snug my-0.5">
                    {sk.description ||
                      "Core engineering capability applied across autonomous workflows, scalable services, and intelligent platforms."}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-black/[0.04] dark:border-white/[0.06] text-[9px] font-mono">
                    <span className="text-muted-foreground uppercase tracking-wider truncate max-w-[85px]">
                      {domain.split(" ")[0]}
                    </span>
                    <span className="text-violet-500 dark:text-violet-400 font-semibold flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-violet-500 animate-pulse" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
