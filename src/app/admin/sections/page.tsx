"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Eye, EyeOff, LayoutDashboard, ArrowUp, ArrowDown, GripVertical, Save, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SectionConfig {
  id?: string;
  key: string;
  label: string;
  isVisible: boolean;
  order: number;
}

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/admin/sections");
      const data = await res.json();
      if (Array.isArray(data)) {
        setSections(data);
      }
    } catch {
      showToast("error", "Failed to load sections");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const saveSections = async (updatedList: SectionConfig[]) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList),
      });
      if (!res.ok) throw new Error("Failed to persist section configuration");
      const saved = await res.json();
      if (Array.isArray(saved)) {
        setSections(saved);
      }
      showToast("success", "Section order & visibility saved successfully!");
    } catch (err: any) {
      showToast("error", err.message || "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (key: string) => {
    const updated = sections.map((s) => (s.key === key ? { ...s, isVisible: !s.isVisible } : s));
    setSections(updated);
    saveSections(updated);
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= sections.length) return;

    const listCopy = [...sections];
    const [moved] = listCopy.splice(index, 1);
    listCopy.splice(newIdx, 0, moved);

    // re-assign order indices
    const reordered = listCopy.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSections(reordered);
    saveSections(reordered);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl relative">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={`fixed top-6 right-6 z-50 flex items-center space-x-3 px-5 py-3 rounded-xl text-sm font-semibold shadow-xl border ${
              toast.type === "success"
                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/20 border-red-500/30 text-red-300"
            }`}
          >
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LayoutDashboard size={18} className="text-violet-400" />
            <h1 className="text-2xl font-serif font-bold text-foreground">Section Visibility &amp; Order</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Toggle sections VISIBLE / HIDDEN and reorder them. The exact order configured here is rendered on the live portfolio.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((section, idx) => (
          <div
            key={section.key}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
              section.isVisible
                ? "border-white/10 dark:border-white/[0.08] bg-white/5 dark:bg-white/[0.02]"
                : "border-white/5 dark:border-white/[0.03] bg-black/10 dark:bg-white/[0.01] opacity-60"
            }`}
          >
            <div className="flex items-center gap-3">
              <GripVertical size={16} className="text-muted-foreground/40 cursor-grab" />

              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveSection(idx, "up")}
                  disabled={idx === 0 || isSaving}
                  className="p-1 rounded hover:bg-white/10 text-muted-foreground disabled:opacity-20 transition-colors"
                  title="Move Up"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={() => moveSection(idx, "down")}
                  disabled={idx === sections.length - 1 || isSaving}
                  className="p-1 rounded hover:bg-white/10 text-muted-foreground disabled:opacity-20 transition-colors"
                  title="Move Down"
                >
                  <ArrowDown size={12} />
                </button>
              </div>

              {section.isVisible ? (
                <Eye size={18} className="text-violet-400" />
              ) : (
                <EyeOff size={18} className="text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-semibold text-foreground">{section.label}</p>
                <p className="text-xs text-muted-foreground font-mono">#{idx + 1} • key: {section.key}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                section.isVisible ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-muted-foreground border border-white/10"
              }`}>
                {section.isVisible ? "VISIBLE" : "HIDDEN"}
              </span>

              <button
                onClick={() => toggleSection(section.key)}
                disabled={isSaving}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none flex-shrink-0 ${
                  section.isVisible ? "bg-violet-600" : "bg-white/10 dark:bg-white/15"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                    section.isVisible ? "translate-x-6" : "translate-x-0"
                  } flex items-center justify-center`}
                >
                  {isSaving && (
                    <Loader2 size={10} className="animate-spin text-violet-600" />
                  )}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 text-xs text-violet-300 space-y-1">
        <p className="font-semibold">✓ Single Source of Truth</p>
        <p className="text-muted-foreground">
          Changes persist directly to database. Section visibility and reordering survive page refreshes, CMS reloads, and portfolio visits.
        </p>
      </div>
    </div>
  );
}

