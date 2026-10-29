"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Mail,
  MapPin,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  RotateCw,
} from "lucide-react";

interface HeroSectionProps {
  name: string;
  title: string;
  resumeUrl?: string;
  email?: string;
  location?: string;
}

interface IDCardData {
  cardName: string;
  cardRole: string;
  cardCompany: string;
  cardPhotoUrl: string;
  cardBackHeadline: string;
  cardFact1: string;
  cardFact2: string;
  cardFact3: string;
  cardFact4: string;
}

const DEFAULT_CARD_DATA: IDCardData = {
  cardName: "Sai Sahithi",
  cardRole: "Staff AI Engineer",
  cardCompany: "Sify Technologies",
  cardPhotoUrl: "/portrait.jpg",
  cardBackHeadline: "SYSTEM ARCHITECT",
  cardFact1: "Building enterprise-grade agentic AI systems & autonomous workflows",
  cardFact2: "Production RAG architect with hybrid dense/sparse search & dynamic reranking",
  cardFact3: "Designing resilient LangGraph & n8n orchestration execution loops",
  cardFact4: "Bridging foundational models with high-throughput backend APIs",
};

// ─────────────────────────────────────────────
// Rotating Subtitle (Clean & Restrained)
// ─────────────────────────────────────────────
const ROTATING_PHRASES = [
  { text: "building production AI systems", highlight: "production AI" },
  { text: "thinking in self-healing loops", highlight: "self-healing loops" },
  { text: "architecting autonomous agents", highlight: "autonomous agents" },
  { text: "engineering hybrid RAG pipelines", highlight: "hybrid RAG" },
  { text: "observing, learning, adapting", highlight: "adapting" },
];

function RotatingSubtitle() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ROTATING_PHRASES.length);
        setVisible(true);
      }, 250);
    }, 2800);
    return () => clearInterval(interval);
  }, [paused]);

  const phrase = ROTATING_PHRASES[index];

  return (
    <div
      className="h-7 sm:h-8 flex items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        {visible && (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-sm sm:text-base text-muted-foreground font-sans tracking-wide select-none"
          >
            {phrase.highlight ? (
              phrase.text.split(phrase.highlight).map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="text-violet-600 dark:text-violet-400 font-semibold">
                      {phrase.highlight}
                    </span>
                  )}
                </React.Fragment>
              ))
            ) : (
              phrase.text
            )}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// Architectural Portrait Card (Restrained & Interactive)
// ─────────────────────────────────────────────
function ArchitecturalPortraitCard({ data }: { data: IDCardData }) {
  const [flipped, setFlipped] = useState(false);
  const [angle, setAngle] = useState(0);
  const lastXRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const velocityRef = useRef(0);

  // Subtle interactive swing on cursor movement
  const handlePointerMove = (e: React.PointerEvent) => {
    if (lastXRef.current !== null) {
      const deltaX = e.clientX - lastXRef.current;
      velocityRef.current = deltaX * 0.22;
    }
    lastXRef.current = e.clientX;
  };

  const handlePointerLeave = () => {
    lastXRef.current = null;
  };

  useEffect(() => {
    let t = 0;
    const tick = () => {
      t += 0.035;
      velocityRef.current *= 0.94;
      const idleSway = Math.sin(t) * 1.2;
      const targetAngle = idleSway + Math.max(-10, Math.min(10, velocityRef.current));
      setAngle((prev) => prev + (targetAngle - prev) * 0.1);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex flex-col items-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* ─── Minimal Lanyard Clip ─── */}
      <div className="relative z-20 flex flex-col items-center">
        <div
          className="w-[30px] h-[52px] overflow-hidden rounded-t-sm border-x border-violet-500/20 flex flex-col items-center"
          style={{
            background: "linear-gradient(180deg, #12131C 0%, #1E1A34 60%, #10111A 100%)",
          }}
        >
          <div className="animate-marquee-vertical text-[8px] font-mono tracking-widest text-violet-300/80 font-bold uppercase whitespace-nowrap py-1">
            {data.cardName} · {data.cardRole} · {data.cardName} · {data.cardRole} ·
          </div>
        </div>

        {/* Metal clip fixture */}
        <div className="flex flex-col items-center -mt-0.5">
          <div className="w-4 h-1.5 bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-500 rounded-sm shadow-sm" />
          <div className="w-2 h-2.5 bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-600 rounded-b-sm" />
        </div>
      </div>

      {/* ─── Pendulum Swing Wrapper ─── */}
      <div
        className="relative transition-transform duration-75"
        style={{
          transformOrigin: "top center",
          transform: `rotate(${angle}deg)`,
        }}
      >
        {/* ─── 3D Flippable Card (300px × 404px) ─── */}
        <div
          className="group w-[290px] sm:w-[304px] h-[400px] cursor-pointer"
          style={{ perspective: 1200 }}
          onClick={() => setFlipped((f) => !f)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFlipped((f) => !f);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Interactive Developer Card. Hover or tap to flip."
        >
          <div
            className="w-full h-full relative transition-transform duration-700 ease-out preserve-3d"
            style={{
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* ═══════════ FRONT FACE ═══════════ */}
            <div
              className="absolute inset-0 rounded-[26px] p-5 flex flex-col justify-between overflow-hidden shadow-2xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#0E0F16] backface-hidden"
              style={{
                boxShadow:
                  "0 24px 60px -15px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.08)",
              }}
            >
              {/* Subtle accent halo */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(139,92,246,0.12)_0%,transparent_65%)] pointer-events-none" />

              {/* Card Header */}
              <div className="relative z-10 flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    AI // VERIFIED
                  </span>
                </div>
                <span className="font-mono text-[9px] text-zinc-400 dark:text-zinc-500 tracking-wider">
                  #2026-SYS
                </span>
              </div>

              {/* Centered Portrait */}
              <div className="relative z-10 flex flex-col items-center my-auto w-full">
                <div className="relative p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.12] shadow-xl group-hover:border-violet-500/40 transition-all duration-500 w-[210px]">
                  <div className="w-full h-[210px] rounded-xl overflow-hidden relative bg-zinc-950">
                    <Image
                      src={data.cardPhotoUrl || "/portrait.jpg"}
                      alt={data.cardName}
                      fill
                      sizes="210px"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Identity Information */}
                <div className="text-center mt-3 space-y-0.5">
                  <h3 className="text-base font-sans font-bold text-foreground tracking-tight leading-tight">
                    {data.cardName}
                  </h3>
                  <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 tracking-wide">
                    {data.cardRole}
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground">
                    {data.cardCompany}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="relative z-10 pt-2 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center space-x-1 text-[10px] font-mono text-muted-foreground">
                  <RotateCw size={11} className="text-violet-500" />
                  <span>TAP TO FLIP</span>
                </div>

                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[9px] font-mono font-semibold text-violet-600 dark:text-violet-300">
                  <ShieldCheck size={11} />
                  <span>ONLINE</span>
                </div>
              </div>
            </div>

            {/* ═══════════ BACK FACE ═══════════ */}
            <div
              className="absolute inset-0 rounded-[26px] p-6 flex flex-col justify-between overflow-hidden shadow-2xl border border-violet-500/30 dark:border-violet-500/40 bg-gradient-to-b from-white via-zinc-50 to-zinc-100 dark:from-[#111319] dark:via-[#0F1016] dark:to-[#0A0B0E] backface-hidden"
              style={{
                transform: "rotateY(180deg)",
                boxShadow: "0 24px 60px -15px rgba(139, 92, 246, 0.18)",
              }}
            >
              <div className="relative z-10 flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
                <span className="font-mono text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
                  {data.cardBackHeadline || "WHAT I AM"}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">SPECIFICATION</span>
              </div>

              {/* 4 Architectural Fact Bullets */}
              <ul className="relative z-10 space-y-3 my-auto text-left">
                {[data.cardFact1, data.cardFact2, data.cardFact3, data.cardFact4]
                  .filter(Boolean)
                  .map((fact, i) => (
                    <li key={i} className="flex items-start text-xs text-foreground/80 dark:text-zinc-300 leading-snug">
                      <span className="text-violet-500 font-bold mr-2 select-none">▸</span>
                      <span>{fact}</span>
                    </li>
                  ))}
              </ul>

              {/* Signature Line */}
              <div className="relative z-10 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-col space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] text-muted-foreground font-instrument italic">
                    Spot me? Say hello
                  </span>
                  <span className="font-instrument italic text-base text-violet-600 dark:text-violet-300 font-semibold tracking-wide">
                    {data.cardName}
                  </span>
                </div>
                <div className="h-0.5 w-full bg-gradient-to-r from-violet-500/40 via-purple-500/20 to-transparent rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Hero Section (Editorial Restraint)
// ─────────────────────────────────────────────
export default function HeroSection({
  name,
  title,
  resumeUrl = "/resume.pdf",
  email = "saisahithikothapalli@gmail.com",
  location = "Hyderabad, India",
}: HeroSectionProps) {
  const [cardData, setCardData] = useState<IDCardData>(DEFAULT_CARD_DATA);

  // Fetch updated ID card data from admin / public endpoint
  useEffect(() => {
    fetch("/api/idcard")
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d === "object") {
          setCardData((prev) => ({ ...prev, ...d }));
        }
      })
      .catch(() => {});
  }, []);

  const handleDownloadResume = () => {
    window.open(resumeUrl || "/resume.pdf", "_blank");
  };

  const handleHireMe = () => {
    window.location.href = `mailto:${email}?subject=Collaboration & Opportunity`;
  };

  return (
    <div className="relative w-full py-4 sm:py-8 overflow-hidden">
      {/* ─── Engineering Blueprint Grid Background ─── */}
      <div className="absolute inset-0 -z-10 pointer-events-none select-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.055]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, transparent 20%, var(--background) 82%)",
          }}
        />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-violet-600/8 dark:bg-violet-500/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-600/8 dark:bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* ─── LEFT COLUMN: Editorial Narrative + Name + Title + CTAs ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-6 text-left order-2 lg:order-1"
        >
          {/* Subtle Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={12} className="animate-pulse" />
            <span>Where Ideas Meet Intelligence</span>
          </div>

          {/* Headline with Sophisticated Typographic Contrast */}
          <div className="space-y-1.5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans tracking-tight text-foreground leading-[1.12]">
              <span className="block text-muted-foreground text-xl sm:text-2xl lg:text-3xl font-normal tracking-normal mb-1">
                Hello. I&apos;m
              </span>
              <span className="block tracking-tight">
                <span className="font-sans font-bold text-foreground">
                  Sai Sahithi{" "}
                </span>
                <span className="font-instrument italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-300 dark:via-purple-200 dark:to-indigo-300 drop-shadow-[0_0_35px_rgba(139,92,246,0.3)]">
                  Kothapalli
                </span>
              </span>
            </h1>

            <h2 className="text-xl sm:text-2xl font-semibold font-sans text-foreground/85 tracking-tight pt-1">
              {title || cardData.cardRole}
            </h2>

            <RotatingSubtitle />
          </div>

          {/* Quick Fact: Location */}
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
            <MapPin size={14} className="text-violet-500 dark:text-violet-400 flex-shrink-0" />
            <span className="font-medium text-foreground/80">{location || "Hyderabad, India"}</span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleDownloadResume}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25 hover:opacity-95 active:scale-95 transition-all duration-200"
            >
              <Download size={14} />
              <span>Download Resume</span>
            </button>

            <button
              onClick={handleHireMe}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.04] text-foreground hover:border-violet-500/50 hover:bg-violet-500/5 active:scale-95 transition-all duration-200"
            >
              <Mail size={14} />
              <span>Get in Touch</span>
              <ArrowUpRight size={13} className="text-violet-500" />
            </button>
          </div>
        </motion.div>

        {/* ─── RIGHT COLUMN: Architectural Portrait Card ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex items-center justify-center relative order-1 lg:order-2"
        >
          <ArchitecturalPortraitCard data={cardData} />
        </motion.div>
      </section>
    </div>
  );
}
