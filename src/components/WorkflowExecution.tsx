"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  BrainCircuit,
  Database,
  Terminal,
  FileText,
  Wrench,
  CheckCircle2,
  Users,
  Repeat,
  Send,
  ArrowRight,
  Activity,
  Layers,
} from "lucide-react";

interface WorkflowStage {
  id: string;
  num: string;
  title: string;
  shortDesc: string;
  functionName: string;
  icon: React.ElementType;
  outputPreview: string;
  category: "ingest" | "reason" | "act" | "eval" | "loop";
}

const STAGES: WorkflowStage[] = [
  {
    id: "input",
    num: "01",
    title: "INPUT",
    shortDesc: "Problem formulation & intent recognition",
    functionName: "agent.receive_query(prompt)",
    icon: FileText,
    outputPreview: "Intent: Analytical system design inquiry detected.",
    category: "ingest",
  },
  {
    id: "context",
    num: "02",
    title: "CONTEXT",
    shortDesc: "Session memory & runtime state binding",
    functionName: "session.hydrate_context()",
    icon: Database,
    outputPreview: "Hydrated active thread tokens & prior turns.",
    category: "ingest",
  },
  {
    id: "retrieval",
    num: "03",
    title: "RETRIEVAL",
    shortDesc: "Hybrid dense/sparse vector search with reranking",
    functionName: "vector.hybrid_query(top_k=5)",
    icon: Database,
    outputPreview: "Retrieved 4 relevant knowledge chunks (score > 0.89).",
    category: "ingest",
  },
  {
    id: "reasoning",
    num: "04",
    title: "REASONING",
    shortDesc: "Decomposition, tool planning & hypothesis testing",
    functionName: "planner.generate_dag()",
    icon: BrainCircuit,
    outputPreview: "Generated 3-step directed execution plan.",
    category: "reason",
  },
  {
    id: "guardrails",
    num: "05",
    title: "GUARDRAILS",
    shortDesc: "Safety constraints & pre-execution alignment",
    functionName: "policy.verify_constraints()",
    icon: ShieldCheck,
    outputPreview: "Passed zero-trust policy checks & schema contract.",
    category: "reason",
  },
  {
    id: "tool_execution",
    num: "06",
    title: "TOOL EXECUTION",
    shortDesc: "Deterministic MCP tools & external API calls",
    functionName: "mcp.dispatch_tool_call()",
    icon: Wrench,
    outputPreview: "Dispatched payload to API sandbox. Status: 200 OK.",
    category: "act",
  },
  {
    id: "evaluation",
    num: "07",
    title: "EVALUATION",
    shortDesc: "Self-critique & hallucination verification",
    functionName: "evaluator.score_output()",
    icon: CheckCircle2,
    outputPreview: "Hallucination score: 0.02. Grounding confidence: 98.4%.",
    category: "eval",
  },
  {
    id: "human_feedback",
    num: "08",
    title: "HUMAN FEEDBACK",
    shortDesc: "Explicit guidance & observational alignment",
    functionName: "observer.collect_signals()",
    icon: Users,
    outputPreview: "Telemetry recorded. User accepted proposed route.",
    category: "eval",
  },
  {
    id: "adaptation",
    num: "09",
    title: "ADAPTATION",
    shortDesc: "Dynamic few-shot memory update & route tuning",
    functionName: "memory.commit_reflection()",
    icon: Repeat,
    outputPreview: "Route optimized for subsequent domain queries.",
    category: "loop",
  },
  {
    id: "output",
    num: "10",
    title: "OUTPUT",
    shortDesc: "Synthesized response & verifiable citation stream",
    functionName: "stream.synthesize_response()",
    icon: Send,
    outputPreview: "Emitted structured response with audit trail.",
    category: "act",
  },
];

export default function WorkflowExecution() {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger auto-start only when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
            setIsPlaying(true);
          }
        });
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  // Stage progression timer (5 seconds per stage)
  useEffect(() => {
    if (!isPlaying || !hasStarted) return;

    const timer = setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % STAGES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPlaying, hasStarted]);

  const activeStage = STAGES[activeStageIndex];

  const handleRestart = () => {
    setActiveStageIndex(0);
    setIsPlaying(true);
  };

  return (
    <div
      ref={containerRef}
      className="space-y-8 select-none max-w-7xl mx-auto px-4 sm:px-6"
    >
      {/* ─── Top Telemetry Ribbon ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-black/[0.06] dark:border-white/[0.08] text-xs font-mono text-muted-foreground">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-foreground">02</span>
          <span className="w-10 h-[1px] bg-black/10 dark:bg-white/10 inline-block" />
          <span className="uppercase tracking-widest text-foreground/80 font-semibold">
            AI × WHOAMI
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-2 text-[11px] font-mono tracking-wider text-muted-foreground/80">
          <span>PIPELINE SIMULATION</span>
          <span className="text-violet-500">•</span>
          <span>10-STAGE AUTONOMOUS LOOP</span>
          <span className="text-violet-500">•</span>
          <span>SELF-HEALING</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] tracking-wide text-foreground/80 font-semibold">
            STATUS: {isPlaying ? "ACTIVE EXECUTION" : "PAUSED"}
          </span>
        </div>
      </div>

      {/* ─── Main Two-Column Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start pt-2">
        {/* ─── LEFT COLUMN: Narrative Philosophy ─── */}
        <div className="lg:col-span-5 space-y-6 text-left">
          {/* Subtle Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-mono">
            <Activity size={13} className="text-violet-500 animate-pulse" />
            <span>A Continuous Feedback Loop</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black text-foreground tracking-tight leading-[1.12]">
            AI changed <br />
            how I{" "}
            <span className="font-instrument italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-300 dark:to-indigo-300">
              think.
            </span>
          </h2>

          {/* Narrative Paragraphs */}
          <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            <p>
              Getting an answer from a model is only half the problem. The real challenge is
              knowing what context to inject, when to invoke a tool, and how to verify the
              result before taking action.
            </p>
            <p>
              Building resilient agentic workflows taught me to separate signal from noise,
              test assumptions with strict guardrails, and adapt dynamically when conditions drift.
            </p>
          </div>

          {/* The Core Mindset Phrasing */}
          <div className="pt-1">
            <p className="text-xl sm:text-2xl font-sans font-bold text-foreground tracking-tight leading-snug">
              AI,{" "}
              <span className="font-instrument italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-300 dark:to-indigo-300">
                but as a mindset.
              </span>
            </p>
          </div>

          {/* Iteration Principle */}
          <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] space-y-3">
            <div className="text-[11px] font-mono text-muted-foreground tracking-widest uppercase">
              Core Feedback Axiom
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-foreground/90 bg-black/[0.02] dark:bg-white/[0.03] p-3 rounded-xl border border-black/[0.06] dark:border-white/[0.06]">
              <Repeat size={14} className="text-violet-500 flex-shrink-0 animate-spin-slow" />
              <span className="truncate">TRY → OBSERVE → LEARN → ADAPT → TRY AGAIN</span>
            </div>
          </div>

          {/* Manual Control Actions */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-violet-600 text-white shadow-md shadow-violet-600/25 hover:opacity-95 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? "Pause Stream" : "Resume Execution"}</span>
            </button>

            <button
              onClick={handleRestart}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full text-xs font-semibold border border-black/10 dark:border-white/10 hover:border-violet-500/40 text-foreground text-muted-foreground hover:text-foreground transition-all"
              title="Restart execution from Step 01"
            >
              <RotateCcw size={13} />
              <span>Restart</span>
            </button>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: System Execution Console & Node Pipeline ─── */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Stage Terminal Monitor */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0D0E14] border border-black/[0.08] dark:border-white/[0.08] shadow-xl relative overflow-hidden text-left">
            {/* Top Chrome */}
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="font-mono text-[11px] text-muted-foreground pl-2">
                  runtime://observer.agent.v2
                </span>
              </div>

              <div className="flex items-center space-x-2 font-mono text-[11px] text-violet-600 dark:text-violet-400">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ping" />
                <span>STAGE {activeStage.num} / 10</span>
              </div>
            </div>

            {/* Terminal Body */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="pt-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-violet-600 dark:text-violet-400 font-bold">
                      ACTIVE CONTRACT
                    </span>
                    <h4 className="text-xl font-sans font-bold text-foreground">
                      {activeStage.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {activeStage.shortDesc}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                    <activeStage.icon size={22} />
                  </div>
                </div>

                {/* Simulated Function & Result Output */}
                <div className="p-3.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] font-mono text-xs space-y-2">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <span className="text-violet-500 font-bold">λ</span>
                    <span className="text-foreground/90 font-semibold">{activeStage.functionName}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground pl-3 border-l-2 border-violet-500/50">
                    {activeStage.outputPreview}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive Pipeline Node Grid (10 Nodes) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
            {STAGES.map((st, idx) => {
              const isActive = activeStageIndex === idx;
              const isPast = activeStageIndex > idx;
              const Icon = st.icon;

              return (
                <button
                  key={st.id}
                  onClick={() => {
                    setActiveStageIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`relative p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between h-[84px] overflow-hidden group ${
                    isActive
                      ? "bg-violet-500/10 dark:bg-violet-500/15 border-violet-500 shadow-md shadow-violet-500/20 scale-[1.02]"
                      : isPast
                      ? "bg-white dark:bg-[#0E0F15] border-black/[0.08] dark:border-white/[0.08] hover:border-violet-500/40 opacity-85"
                      : "bg-white dark:bg-[#0E0F15] border-black/[0.08] dark:border-white/[0.08] hover:border-violet-500/40 opacity-55"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`font-mono text-[10px] font-bold ${
                        isActive
                          ? "text-violet-600 dark:text-violet-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {st.num}
                    </span>
                    <Icon
                      size={13}
                      className={
                        isActive
                          ? "text-violet-600 dark:text-violet-400"
                          : "text-muted-foreground group-hover:text-foreground"
                      }
                    />
                  </div>

                  <div>
                    <span
                      className={`block font-sans font-bold text-[11px] truncate tracking-tight ${
                        isActive ? "text-foreground" : "text-foreground/80"
                      }`}
                    >
                      {st.title}
                    </span>
                    <span className="block text-[9px] font-mono text-muted-foreground truncate">
                      {st.category}
                    </span>
                  </div>

                  {/* Active highlight indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-violet-600 dark:bg-violet-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback Loop Indicator */}
          <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground/80">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              <span>FEEDBACK LOOP: STAGE 09 (ADAPTATION) ➔ STAGES 03 &amp; 04</span>
            </span>
            <span className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold">
              DYNAMIC TUNING
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
