"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  GitBranch,
  ArrowRight,
  Plus,
  Terminal,
  Activity,
  Layers,
  Cpu,
  Sparkles,
  CheckCircle2,
  ImageIcon,
} from "lucide-react";
import { TechLogo } from "./SkillsPeriodicTable";

export interface ProjectItem {
  id: string;
  title: string;
  summary: string;
  description: string | null;
  problem?: string | null;
  solution?: string | null;
  architecture?: string | null;
  techStack: string;
  imageUrl: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  order: number | null;
}

interface ProjectsAccordionProps {
  projects: ProjectItem[];
}

// Helper to clean tech stack parsing (fixes JSON bracket bug)
function parseTechList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((s) => String(s).replace(/[\[\]"]/g, "").trim())
        .filter(Boolean);
    }
  } catch {}
  return raw
    .replace(/[\[\]"]/g, "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

// ─────────────────────────────────────────────
// Project Card Preview Box (3-dot header + Image fill)
// ─────────────────────────────────────────────
function ProjectCardPreview({ project, index }: { project: ProjectItem; index: number }) {
  const hasImage = Boolean(project.imageUrl && project.imageUrl.trim() !== "");

  return (
    <div className="relative w-full h-full min-h-[280px] lg:min-h-[380px] rounded-2xl bg-zinc-950 border border-black/10 dark:border-white/10 flex flex-col justify-between overflow-hidden shadow-2xl group/preview">
      {/* Mock Window Chrome with 3 dots */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.08] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.02] flex-shrink-0 z-20">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="font-mono text-[10px] text-zinc-400 pl-2 truncate max-w-[170px] sm:max-w-xs">
            system://{project.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.live
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10 backdrop-blur-md">
          {hasImage ? "SNAPSHOT" : "MOCKUP"}
        </span>
      </div>

      {/* Image Filled Box */}
      <div className="relative flex-1 w-full h-full min-h-[220px] lg:min-h-[300px] overflow-hidden bg-[#0A0B10] flex items-center justify-center">
        {hasImage ? (
          <>
            <Image
              src={project.imageUrl!}
              alt={project.title}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 550px"
              className="object-cover object-center group-hover/preview:scale-105 transition-transform duration-700 ease-out"
              priority={index === 0}
            />
            {/* Subtle gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          /* Futuristic generative fallback if no image uploaded yet */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-violet-950/30 via-zinc-950 to-indigo-950/30">
            <div className="p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 mb-3 shadow-lg group-hover/preview:scale-110 transition-transform">
              <ImageIcon size={26} />
            </div>
            <h4 className="text-sm font-bold text-white max-w-[220px] leading-snug">
              {project.title}
            </h4>
            <p className="text-[10px] font-mono text-zinc-400 mt-1">
              Upload project preview in Admin Panel
            </p>
          </div>
        )}
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="px-4 py-2.5 border-t border-black/[0.08] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.02] flex items-center justify-between font-mono text-[10px] text-zinc-400 flex-shrink-0 z-20">
        <span>STATUS: VERIFIED</span>
        <span className="text-violet-400">NODE #{String(index + 1).padStart(2, "0")} ONLINE</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Projects Accordion Component
// ─────────────────────────────────────────────
export default function ProjectsAccordion({ projects }: ProjectsAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Fallback demo projects if empty
  const displayProjects = projects && projects.length > 0 ? projects : [
    {
      id: "p1",
      title: "Agentic n8n Autonomous Router",
      summary: "Multi-agent intent classification and self-healing execution pipeline.",
      description: "Architected a distributed agent router using n8n and LangGraph. Automatically classifies complex user intent, queries internal vector databases, and executes dynamic API tool chains with deterministic error recovery.",
      problem: "Traditional rule-based orchestrators break when user intent drifts or APIs return non-standard payloads.",
      solution: "Implemented an autonomous self-correcting loop with fallback tool routing and semantic caching.",
      architecture: "Python · LangGraph · n8n · FastAPI · PostgreSQL",
      techStack: "Python, LangGraph, n8n, FastAPI, PostgreSQL",
      imageUrl: null,
      demoUrl: null,
      githubUrl: "https://github.com/sahithiai",
      order: 1,
    },
    {
      id: "p2",
      title: "Autonomous RAG Chatbot Suite",
      summary: "Production RAG engine with hybrid dense/sparse search & dynamic reranking.",
      description: "Engineered an enterprise RAG knowledge engine supporting PDF parsing, semantic chunking, and dual-layer reranking (BM25 + BGE-Reranker-Large) achieving 94.2% retrieval precision on technical documents.",
      problem: "Standard dense vector retrieval suffers from hallucination and misses exact keyword matches.",
      solution: "Engineered hybrid vector search paired with cross-encoder rerankers and contextual compression.",
      architecture: "Next.js · TypeScript · Qdrant · OpenAI · Cohere",
      techStack: "Next.js, TypeScript, Qdrant, OpenAI, Cohere",
      imageUrl: null,
      demoUrl: null,
      githubUrl: "https://github.com/sahithiai",
      order: 2,
    },
    {
      id: "p3",
      title: "MCP Autonomous Tool Server",
      summary: "Model Context Protocol gateway for secure local code execution.",
      description: "Designed a secure Model Context Protocol (MCP) server enabling LLMs to safely query database tables, execute sandbox Python scripts, and trace execution logs with strict policy guardrails.",
      problem: "LLM agent required deterministic sandbox execution with zero privilege escalation.",
      solution: "Standardized tool definitions via MCP schema with strict JSON validation.",
      architecture: "TypeScript · Node.js · Docker · SQLite",
      techStack: "TypeScript, Node.js, MCP, Docker, SQLite",
      imageUrl: null,
      demoUrl: null,
      githubUrl: "https://github.com/sahithiai",
      order: 3,
    },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Section Heading */}
      <div className="space-y-3 max-w-2xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-500 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider">
          <Layers size={12} />
          <span>Featured Systems</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground">
          A Catalogue of{" "}
          <span className="font-instrument italic font-normal text-muted-foreground/90">
            Experiments
          </span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Autonomous agents, production-grade RAG systems, and resilient workflow architectures.
        </p>
      </div>

      {/* ─── Expanding Accordion Gallery (Desktop) ─── */}
      <div className="hidden lg:flex flex-row items-stretch gap-3.5 w-full min-h-[580px] max-h-[640px]">
        {displayProjects.map((proj, idx) => {
          const isOpen = activeIndex === idx;
          const techList = parseTechList(proj.techStack);
          const formattedNum = String(proj.order || idx + 1).padStart(2, "0");

          return (
            <motion.div
              key={proj.id}
              layout
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActiveIndex(idx)}
              className={`relative rounded-[28px] border overflow-hidden cursor-pointer transition-all duration-300 ${
                isOpen
                  ? "flex-[8] bg-white dark:bg-[#0E0F15] border-violet-500/40 shadow-2xl shadow-violet-500/10"
                  : "flex-[1] bg-black/[0.02] dark:bg-white/[0.015] border-black/[0.08] dark:border-white/[0.08] hover:border-violet-500/40 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] group"
              }`}
              style={{
                boxShadow: isOpen
                  ? "0 20px 60px -15px rgba(139, 92, 246, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                  : "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
              }}
            >
              {/* ─── SLIM COLLAPSED SPINE ─── */}
              {!isOpen && (
                <div className="w-full h-full flex flex-col justify-between items-center py-8 px-2 select-none">
                  {/* Big Numerals in Collapsed View */}
                  <span className="font-mono text-2xl lg:text-3xl font-black text-foreground/30 dark:text-white/30 group-hover:text-violet-500 transition-colors">
                    {formattedNum}
                  </span>

                  <div className="rotate-180 [writing-mode:vertical-rl] text-center my-auto">
                    <p className="font-sans font-bold text-sm tracking-wide text-foreground/80 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors whitespace-nowrap">
                      {proj.title}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-zinc-400 group-hover:rotate-90 group-hover:text-foreground transition-transform">
                    <Plus size={14} />
                  </div>
                </div>
              )}

              {/* ─── EXPANDED FULL VIEW ─── */}
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="w-full h-full p-8 flex flex-col justify-between overflow-y-auto cursor-default relative"
                >
                  {/* Big Dramatic Overlay Watermark Numeral */}
                  <div className="absolute top-2 right-8 font-mono font-black text-7xl sm:text-8xl lg:text-9xl text-black/[0.04] dark:text-white/[0.035] select-none pointer-events-none tracking-tighter leading-none z-0">
                    {formattedNum}
                  </div>

                  <div className="grid grid-cols-12 gap-8 items-center h-full relative z-10">
                    {/* Left Column (60%): Info, Features, Tech chips, CTAs */}
                    <div className="col-span-7 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-xs font-bold text-violet-500 dark:text-violet-400 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                            {formattedNum} · ARCHITECTURE
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            PRODUCTION READY
                          </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-black text-foreground leading-tight">
                          {proj.title}
                        </h3>

                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {proj.description || proj.summary}
                        </p>
                      </div>

                      {/* 2-Column Feature List */}
                      <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06]">
                        <div className="space-y-1">
                          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                            Core Challenge
                          </p>
                          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-snug">
                            {proj.problem || "Non-deterministic workflows and hallucination reduction."}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                            Engineered Fix
                          </p>
                          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-snug">
                            {proj.solution || "Self-correcting evaluation loops & hybrid rerankers."}
                          </p>
                        </div>
                      </div>

                      {/* Clean Tech Chips */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block">
                          Stack &amp; Frameworks
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {techList.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] text-xs font-mono text-foreground/80 dark:text-zinc-300 shadow-sm"
                            >
                              <TechLogo name={t} size={14} />
                              <span>{t}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-3 pt-2">
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-violet-600 text-white shadow-md shadow-violet-600/30 hover:scale-105 active:scale-95 transition-all"
                          >
                            <GitBranch size={13} />
                            <span>View on GitHub ↗</span>
                          </a>
                        )}

                        {proj.demoUrl && (
                          <a
                            href={proj.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold border border-black/10 dark:border-white/10 hover:border-violet-500/50 text-foreground dark:text-zinc-300 hover:text-foreground transition-all"
                          >
                            <ExternalLink size={13} />
                            <span>Live System</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Right Column (40%): Project Card Preview filled with image */}
                    <div className="col-span-5 h-full flex items-center justify-center">
                      <ProjectCardPreview project={proj} index={idx} />
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ─── Mobile Vertical Accordion (Phones & Tablets) ─── */}
      <div className="lg:hidden space-y-4">
        {displayProjects.map((proj, idx) => {
          const isOpen = activeIndex === idx;
          const techList = parseTechList(proj.techStack);
          const formattedNum = String(proj.order || idx + 1).padStart(2, "0");

          return (
            <div
              key={proj.id}
              className={`rounded-3xl border overflow-hidden transition-all duration-300 ${
                isOpen
                  ? "bg-white dark:bg-[#0E0F15] border-violet-500/40 shadow-xl"
                  : "bg-black/[0.02] dark:bg-white/[0.02] border-black/[0.08] dark:border-white/[0.08]"
              }`}
            >
              <button
                onClick={() => setActiveIndex(isOpen ? -1 : idx)}
                className="w-full p-5 flex items-center justify-between text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-base font-black text-violet-500 dark:text-violet-400">
                    {formattedNum}
                  </span>
                  <h3 className="font-bold text-base text-foreground">
                    {proj.title}
                  </h3>
                </div>
                <div
                  className={`w-7 h-7 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-400 transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  <Plus size={14} />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-5 pt-0 space-y-5"
                  >
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {proj.description || proj.summary}
                    </p>

                    <ProjectCardPreview project={proj} index={idx} />

                    <div className="flex flex-wrap gap-1.5">
                      {techList.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] text-[10px] font-mono text-foreground/80 dark:text-zinc-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold bg-violet-600 text-white"
                      >
                        <GitBranch size={13} />
                        <span>View on GitHub ↗</span>
                      </a>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
