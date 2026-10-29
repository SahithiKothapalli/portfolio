"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  name: string;
  href: string;
  sectionId?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "#home", sectionId: "home" },
  { name: "Who Am I", href: "#whoami", sectionId: "whoami" },
  { name: "Skills", href: "#skills", sectionId: "skills" },
  { name: "Experience", href: "#experience", sectionId: "experience" },
  { name: "Projects", href: "#projects", sectionId: "projects" },
  { name: "Education", href: "#education", sectionId: "education" },
  { name: "Certifications", href: "#certifications", sectionId: "certifications" },
  { name: "Contact", href: "#contact", sectionId: "contact" },
];

export default function Navbar({
  onOpenChat,
  aiEnabled = true,
}: {
  onOpenChat: () => void;
  aiEnabled?: boolean;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isHomePage = pathname === "/";

  // ─── Scroll listener for progress & 40px threshold ─────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(1, Math.max(0, currentScroll / totalHeight)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── IntersectionObserver using exact rootMargin: -45% 0px -50% 0px ────────
  useEffect(() => {
    if (!isHomePage) return;

    observerRef.current?.disconnect();
    const sectionIds = NAV_ITEMS.map((i) => i.sectionId).filter(Boolean) as string[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-45% 0px -50% 0px",
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [isHomePage, pathname]);

  // ─── Lock page scroll on mobile overlay open & listen for Esc ──────────────
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsMobileMenuOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  const isScrolled40 = scrollY > 40;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (isHomePage && item.href.startsWith("#")) {
      e.preventDefault();
      const id = item.href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSection(id);
      }
    }
    setIsMobileMenuOpen(false);
  };

  const resolveHref = (item: NavItem): string => {
    if (isHomePage) return item.href;
    if (item.sectionId) return `/${item.href}`;
    return item.href;
  };

  return (
    <>
      {/* 2px ink scroll-progress bar along the very top */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 pt-3 pb-2 transition-all duration-300 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* ─── Left: Round Initials Mark + Full Name ──────────────────────── */}
          <Link
            href="/"
            className="pointer-events-auto flex items-center space-x-3 group cursor-pointer"
            aria-label="Sahithi Home"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs tracking-wider transition-all duration-500 group-hover:rotate-[360deg] shadow-sm ${
                isScrolled40
                  ? "bg-foreground text-background border border-transparent shadow-violet-500/10"
                  : "bg-transparent text-foreground border border-foreground/30 hover:border-violet-500"
              }`}
            >
              SS
            </div>

            <span
              className={`font-sans font-extrabold tracking-tight text-sm uppercase transition-all duration-300 ${
                isScrolled40
                  ? "opacity-0 -translate-x-2 pointer-events-none w-0 overflow-hidden"
                  : "opacity-100 translate-x-0 text-foreground"
              }`}
            >
              Sai Sahithi
            </span>
          </Link>

          {/* ─── Centre / Right: Frosted Glass Pill Navigation ────────────── */}
          <nav
            className={`pointer-events-auto hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-full transition-all duration-300 ${
              isScrolled40
                ? "bg-white/70 dark:bg-[#12121A]/80 border border-white/20 dark:border-white/[0.08] shadow-lg shadow-black/5 dark:shadow-black/40 backdrop-blur-[12px]"
                : "bg-white/40 dark:bg-white/[0.03] border border-white/10 dark:border-white/[0.04] backdrop-blur-[6px]"
            }`}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = isHomePage
                ? activeSection === item.sectionId
                : pathname === item.href;

              return (
                <a
                  key={item.name}
                  href={resolveHref(item)}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`relative px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors duration-200 rounded-full select-none ${
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="solidInkIndicator"
                      className="absolute inset-0 bg-violet-600 dark:bg-violet-600 rounded-full shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* ─── Actions: Theme Toggle + Optional AI Chat ───────────────────── */}
          <div className="pointer-events-auto flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-200 ${
                isScrolled40
                  ? "bg-white/70 dark:bg-[#12121A]/80 border border-white/20 dark:border-white/[0.08] backdrop-blur-[12px]"
                  : "bg-white/40 dark:bg-white/[0.03] border border-white/10 dark:border-white/[0.04]"
              } text-muted-foreground hover:text-foreground`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {aiEnabled && (
              <button
                onClick={onOpenChat}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-600 text-white shadow-md shadow-violet-600/25 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Sparkles size={12} className="animate-pulse" />
                <span>Talk with AI</span>
              </button>
            )}

            {/* Mobile Menu Pill */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/70 dark:bg-[#12121A]/80 border border-white/20 dark:border-white/[0.08] backdrop-blur-[12px] text-foreground"
              aria-label="Open navigation menu"
            >
              Menu
            </button>
          </div>

        </div>
      </header>

      {/* ─── Mobile: Full-Screen Paper Overlay (Clip-Path & Staggered Links) ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 28px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 28px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 28px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#09090F]/98 text-white flex flex-col justify-between p-8 backdrop-blur-2xl"
          >
            {/* Top Bar with Close button */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-zinc-500 tracking-widest uppercase">
                INDEX · NAVIGATION
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Big Numbered Links */}
            <nav className="flex flex-col space-y-4 my-auto">
              {NAV_ITEMS.map((item, idx) => {
                const isActive = isHomePage
                  ? activeSection === item.sectionId
                  : pathname === item.href;

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.04, duration: 0.3 }}
                  >
                    <a
                      href={resolveHref(item)}
                      onClick={(e) => handleNavClick(e, item)}
                      className="group flex items-baseline space-x-4 py-1"
                    >
                      <span className="font-mono text-xs text-violet-400/60 group-hover:text-violet-400 transition-colors">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`text-3xl font-serif tracking-tight transition-all duration-200 group-hover:translate-x-2 ${
                          isActive
                            ? "text-violet-400 font-bold"
                            : "text-zinc-300 hover:text-white"
                        }`}
                      >
                        {item.name}
                      </span>
                    </a>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-zinc-500">
                &copy; {new Date().getFullYear()} Sai Sahithi
              </span>
              {aiEnabled && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenChat();
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                >
                  <Sparkles size={14} />
                  <span>Talk with AI</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
