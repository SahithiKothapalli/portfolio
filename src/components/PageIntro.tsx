"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TARGET_NAME = "SAI SAHITHI";
const GLYPHS = "01#$_<>[]/{}=*+~XYZΔΩΨ";

export default function PageIntro() {
  const [displayText, setDisplayText] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if played this session
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("introPlayed_v2")) {
      setIsDone(true);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem("introPlayed_v2", "1");
      setIsDone(true);
      return;
    }

    setIsLoaded(true);

    // Futuristic quantum decryption animation within ~700ms
    let iteration = 0;
    const maxIterations = 14;
    const intervalTime = 38; // ~530ms total decryption

    const interval = setInterval(() => {
      setDisplayText(
        TARGET_NAME.split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < (iteration / maxIterations) * TARGET_NAME.length) {
              return TARGET_NAME[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      iteration += 1;

      if (iteration > maxIterations) {
        clearInterval(interval);
        setDisplayText(TARGET_NAME);

        // Conclude within 1s
        setTimeout(() => {
          setIsDone(true);
          try {
            sessionStorage.setItem("introPlayed_v2", "1");
          } catch {}
        }, 320); // 530ms + 320ms = ~850ms total
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  if (isDone || !isLoaded) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="page-intro"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[9999] bg-[#030306] flex flex-col items-center justify-center pointer-events-none overflow-hidden select-none"
      >
        {/* Futuristic Cyber Grid & Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-grid opacity-30" />

        {/* Central HUD Box */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          {/* Top Status */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-950/40"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-violet-300 font-semibold uppercase">
              AGENTIC PROTOCOL INITIALIZED
            </span>
          </motion.div>

          {/* Main Futuristic Name */}
          <div className="relative py-2">
            <h1 className="font-sans font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.12em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-indigo-300 drop-shadow-[0_0_35px_rgba(139,92,246,0.6)]">
              {displayText || TARGET_NAME}
            </h1>

            {/* Glowing Laser Scanline across name */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 0.75, ease: "easeInOut" }}
              className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-violet-400/50 to-transparent skew-x-12 blur-sm pointer-events-none"
            />
          </div>

          {/* Subtitle Telemetry */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className="font-mono text-xs text-zinc-400 tracking-[0.3em] uppercase mt-3"
          >
            STAFF AI ENGINEER · RAG &amp; AGENTIC SYSTEMS
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
