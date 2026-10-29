"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Check, AlertCircle, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastState = { type: "success" | "error"; message: string } | null;

interface IDCardForm {
  /** Pre-filled from profile.name */
  cardName: string;
  /** Job title shown on the card front */
  cardRole: string;
  /** Photo URL for the card front */
  cardPhotoUrl: string;
  /** Headline on card back, e.g. "WHO I AM" */
  cardBackHeadline: string;
  /** Four bullet-point facts shown on card back */
  cardFact1: string;
  cardFact2: string;
  cardFact3: string;
  cardFact4: string;
}

const DEFAULTS: IDCardForm = {
  cardName: "",
  cardRole: "",
  cardPhotoUrl: "/portrait.jpg",
  cardBackHeadline: "WHO I AM",
  cardFact1: "",
  cardFact2: "",
  cardFact3: "",
  cardFact4: "",
};

// ─── Input class (matches spec) ───────────────────────────────────────────────

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-[#1A1A2E] border border-white/[0.12] text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:bg-[#1A1A2E]/80 transition-all text-sm";

// ─── Field row ────────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminIDCardPage() {
  const [form, setForm] = useState<IDCardForm>(DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const set = (key: keyof IDCardForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ── Load from profile API ─────────────────────────────────────────────────

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((data) => {
        if (!data) return;
        setForm({
          cardName: data.cardName ?? data.name ?? "",
          cardRole: data.cardRole ?? data.title ?? "",
          cardPhotoUrl: data.cardPhotoUrl ?? data.photoUrl ?? "/portrait.jpg",
          cardBackHeadline: data.cardBackHeadline ?? "WHO I AM",
          cardFact1: data.cardFact1 ?? "",
          cardFact2: data.cardFact2 ?? "",
          cardFact3: data.cardFact3 ?? "",
          cardFact4: data.cardFact4 ?? "",
        });
      })
      .catch(() => showToast("error", "Failed to load profile data."))
      .finally(() => setIsLoading(false));
  }, []);

  // ── Save ──────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("success", "ID Card settings saved successfully.");
    } catch (err: any) {
      showToast("error", err.message ?? "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-2xl relative">
      {/* Toast */}
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
            {toast.type === "success" ? (
              <Check size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-violet-600/15 border border-violet-500/20">
          <CreditCard size={18} className="text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">
            ID Card Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Customize the flip ID card shown in the Hero section.
          </p>
        </div>
      </div>

      {/* Card Front Fields */}
      <div className="rounded-2xl bg-[#0F0F15] border border-white/[0.05] p-6 space-y-5">
        <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">
          Card Front
        </p>

        <Field
          label="Card Name"
          value={form.cardName}
          placeholder="e.g. Sahithi Reddy"
          onChange={set("cardName")}
        />

        <Field
          label="Card Role / Title"
          value={form.cardRole}
          placeholder="e.g. Staff AI Engineer"
          onChange={set("cardRole")}
        />

        <Field
          label="Card Photo URL"
          value={form.cardPhotoUrl}
          placeholder="/portrait.jpg"
          onChange={set("cardPhotoUrl")}
        />
      </div>

      {/* Card Back Fields */}
      <div className="rounded-2xl bg-[#0F0F15] border border-white/[0.05] p-6 space-y-5">
        <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">
          Card Back
        </p>

        <Field
          label="Back Headline"
          value={form.cardBackHeadline}
          placeholder="WHO I AM"
          onChange={set("cardBackHeadline")}
        />

        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1 block">
            Facts / Bullet Points
          </label>
          {(
            [
              { key: "cardFact1", placeholder: "e.g. 8+ years in AI/ML research" },
              { key: "cardFact2", placeholder: "e.g. Published author · 3K+ readers" },
              { key: "cardFact3", placeholder: "e.g. Open-source contributor" },
              { key: "cardFact4", placeholder: "e.g. Based in San Francisco, CA" },
            ] as { key: keyof IDCardForm; placeholder: string }[]
          ).map(({ key, placeholder }, i) => (
            <div key={key} className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-600/20 border border-violet-500/20 flex items-center justify-center text-[10px] font-bold text-violet-400">
                {i + 1}
              </span>
              <input
                type="text"
                value={form[key]}
                onChange={(e) => set(key)(e.target.value)}
                placeholder={placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm disabled:opacity-50 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-violet-900/30"
        >
          {isSaving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          <span>{isSaving ? "Saving..." : "Save ID Card"}</span>
        </button>
      </div>
    </div>
  );
}
