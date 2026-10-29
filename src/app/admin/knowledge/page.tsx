"use client";

import React, { useState, useEffect } from "react";
import { Brain, RefreshCw, Loader2, Check, AlertCircle, Database, Cpu, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ToastState = { type: "success" | "error"; message: string } | null;

interface KBStats {
  totalChunks: number;
  byType: { documentType: string; _count: { id: number } }[];
  lastIndexed: string | null;
}

export default function AdminKnowledgePage() {
  const [stats, setStats] = useState<KBStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRebuilding, setIsRebuilding] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/knowledge");
      if (res.ok) setStats(await res.json());
    } catch {
      showToast("error", "Failed to load knowledge base stats");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleRebuild = async () => {
    setIsRebuilding(true);
    try {
      const res = await fetch("/api/admin/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rebuild_all" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast("success", `Rebuild complete! ${data.totalChunks} total chunks indexed.`);
      await fetchStats();
    } catch (err: any) {
      showToast("error", err.message || "Rebuild failed");
    } finally {
      setIsRebuilding(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl relative">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center space-x-3 px-5 py-3.5 rounded-2xl text-sm font-semibold shadow-xl ${
              toast.type === "success"
                ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                : "bg-red-500/20 border border-red-500/30 text-red-300"
            }`}
          >
            {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-2xl font-serif font-bold text-white">Knowledge Base</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Vector store powering the AI chatbot. All content changes auto-update embeddings on save.
        </p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0F0F15] border border-white/[0.05] space-y-3">
            <Database size={18} className="text-violet-400" />
            <div>
              <span className="text-3xl font-bold text-white font-sans block">{stats.totalChunks}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Vector Chunks</span>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F0F15] border border-white/[0.05] space-y-3">
            <Cpu size={18} className="text-indigo-400" />
            <div>
              <span className="text-sm font-bold text-white font-sans block">text-embedding-3-large</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Embedding Model</span>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F0F15] border border-white/[0.05] space-y-3">
            <BarChart3 size={18} className="text-purple-400" />
            <div>
              <span className="text-sm font-bold text-white font-sans block">
                {stats.lastIndexed
                  ? new Date(stats.lastIndexed).toLocaleDateString()
                  : "Never"}
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Last Indexed</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* By Document Type */}
      {stats && stats.byType.length > 0 && (
        <div className="rounded-2xl bg-[#0F0F15] border border-white/[0.05] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.04]">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Chunks by Type</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {stats.byType.map((entry) => (
              <div key={entry.documentType} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-white font-medium">{entry.documentType}</span>
                <span className="text-sm font-bold text-accent-violet">{entry._count.id}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rebuild Button */}
      <div className="rounded-2xl bg-amber-500/5 border border-amber-500/20 p-6 space-y-4">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <Brain size={18} />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-white">Full Knowledge Rebuild</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Re-crawl and re-embed all portfolio content (profile, experiences, projects, skills, articles).
              This is expensive — only run if embeddings seem stale or broken.
            </p>
          </div>
        </div>
        <button
          onClick={handleRebuild}
          disabled={isRebuilding}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-semibold hover:bg-amber-500/30 transition-all duration-200 disabled:opacity-50"
        >
          {isRebuilding ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          <span>{isRebuilding ? "Rebuilding... (this may take a moment)" : "Rebuild All Embeddings"}</span>
        </button>
      </div>
    </div>
  );
}
