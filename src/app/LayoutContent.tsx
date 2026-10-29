"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatWindow from "@/components/AIChatWindow";
import LiveBackground from "@/components/LiveBackground";
import PageIntro from "@/components/PageIntro";
import { Sparkles } from "lucide-react";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");
  const [aiEnabled, setAiEnabled] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.aiEnabled === "boolean") {
          setAiEnabled(data.aiEnabled);
        }
      })
      .catch(() => setAiEnabled(true));
  }, []);

  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent<{ query: string }>;
      setIsChatOpen(true);
      if (customEvent.detail?.query) {
        setInitialQuery(customEvent.detail.query);
      }
    };
    window.addEventListener("open-ai-chat", handleOpenChat);
    return () => window.removeEventListener("open-ai-chat", handleOpenChat);
  }, []);

  const handleClearInitialQuery = () => setInitialQuery("");

  // Admin pages: render children only (admin has its own layout)
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Page load intro — renders above everything, only once per session */}
      <PageIntro />

      <div className="flex-1 flex flex-col relative min-h-screen bg-white dark:bg-[#030303] bg-grid select-none">
        <LiveBackground />
        <Navbar onOpenChat={() => setIsChatOpen(true)} aiEnabled={aiEnabled} />
        <main className="flex-1 pt-20 pb-12 z-10">{children}</main>
        <Footer />

        {/* Floating Chat FAB - only if AI enabled */}
        {aiEnabled && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
            aria-label="Talk with Sahithi AI"
          >
            <Sparkles size={20} className="group-hover:rotate-12 transition-transform duration-300 animate-pulse" />
          </button>
        )}

        {aiEnabled && (
          <AIChatWindow
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            initialQuery={initialQuery}
            onClearInitialQuery={handleClearInitialQuery}
          />
        )}
      </div>
    </>
  );
}
