"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Check, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MODELS = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"];

type ToastState = { type: "success" | "error"; message: string } | null;

export default function AdminAISettingsPage() {
  const [formData, setFormData] = useState<Record<string, any>>({
    model: "gpt-4o",
    temperature: 0.7,
    systemPrompt: "",
    openaiApiKey: "",
    topK: 5,
    chunkOverlap: 50,
    aiEnabled: true,
    footerQuote: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => { if (data) setFormData((p) => ({ ...p, ...data })); })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("success", "AI settings saved successfully.");
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl relative">
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
        <h1 className="text-2xl font-serif font-bold text-white">AI Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure the RAG chatbot model, temperature, and system prompt.</p>
      </div>

      <div className="rounded-2xl bg-[#0F0F15] border border-white/[0.05] p-6 space-y-6">
        {/* AI Enabled Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div>
            <p className="text-sm font-semibold text-foreground">Chatbot Active</p>
            <p className="text-xs text-muted-foreground mt-0.5">When disabled, the chat FAB and &ldquo;Talk with AI&rdquo; button are hidden from visitors.</p>
          </div>
          <button
            onClick={() => setFormData((p) => ({ ...p, aiEnabled: !p.aiEnabled }))}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${formData.aiEnabled ? "bg-violet-600" : "bg-white/10"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${formData.aiEnabled ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>

        {/* OpenAI Key */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">OpenAI API Key</label>
          <div className="flex items-center space-x-2 text-xs text-amber-400/80 bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-2.5">
            <Info size={13} />
            <span>
              Current key: <code className="font-mono">{formData.openaiApiKey || "Not set"}</code>. Enter new key to update.
            </span>
          </div>
          <input
            type="password"
            value={formData._newKey || ""}
            onChange={(e) => setFormData((p) => ({ ...p, _newKey: e.target.value, openaiApiKey: e.target.value }))}
            placeholder="sk-... (leave blank to keep current)"
            className="w-full bg-muted/20 border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-violet text-white placeholder:text-muted-foreground/40 transition-colors font-mono"
          />
        </div>

        {/* Model Select */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Chat Model</label>
          <select
            value={formData.model || "gpt-4o"}
            onChange={(e) => setFormData((p) => ({ ...p, model: e.target.value }))}
            className="w-full bg-muted/20 border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-violet text-white transition-colors appearance-none cursor-pointer"
          >
            {MODELS.map((m) => (
              <option key={m} value={m} className="bg-[#0F0F15] text-white">{m}</option>
            ))}
          </select>
        </div>

        {/* Temperature */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
              Temperature
            </label>
            <span className="text-sm font-bold text-accent-violet">{formData.temperature ?? 0.7}</span>
          </div>
          <input
            type="range" min="0" max="1" step="0.05"
            value={formData.temperature ?? 0.7}
            onChange={(e) => setFormData((p) => ({ ...p, temperature: parseFloat(e.target.value) }))}
            className="w-full accent-violet-500"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Precise (0)</span>
            <span>Creative (1)</span>
          </div>
        </div>

        {/* Top-K */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
            Top-K Context Chunks
          </label>
          <input
            type="number" min="1" max="20"
            value={formData.topK || 5}
            onChange={(e) => setFormData((p) => ({ ...p, topK: parseInt(e.target.value) }))}
            className="w-full bg-muted/20 border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-violet text-white transition-colors"
          />
          <p className="text-xs text-muted-foreground ml-1">Number of vector chunks retrieved per query</p>
        </div>

        {/* System Prompt */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">System Prompt</label>
          <textarea
            rows={5}
            value={formData.systemPrompt || ""}
            onChange={(e) => setFormData((p) => ({ ...p, systemPrompt: e.target.value }))}
            placeholder="You are Sahithi's AI assistant. Be concise, professional, and highlight her engineering strengths..."
            className="w-full bg-muted/20 border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-violet text-white placeholder:text-muted-foreground/40 transition-colors resize-none"
          />
        </div>

        {/* Footer Quote */}
        <div className="space-y-2 pt-2 border-t border-white/[0.05]">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Footer Quote</label>
          <textarea
            rows={2}
            value={formData.footerQuote || ""}
            onChange={(e) => setFormData((p) => ({ ...p, footerQuote: e.target.value }))}
            placeholder="I don't need every iteration to be perfect. I just want the next one to be better."
            className="w-full bg-muted/20 border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-violet text-white placeholder:text-muted-foreground/40 transition-colors resize-none font-serif italic"
          />
          <p className="text-xs text-muted-foreground ml-1">This quote appears in the footer of your public site.</p>
        </div>

        <div className="pt-4 border-t border-white/[0.06]">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm disabled:opacity-50 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{isSaving ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
