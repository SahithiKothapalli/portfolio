"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fields = [
  { key: "name", label: "Full Name", placeholder: "e.g. Sahithi" },
  { key: "title", label: "Professional Title", placeholder: "e.g. Staff AI Engineer" },
  { key: "subtitle", label: "Hero Subtitle", placeholder: "Building intelligent systems..." },
  { key: "bio", label: "Bio / About", placeholder: "Your professional biography...", textarea: true },
  { key: "email", label: "Email Address", placeholder: "sahithi@example.com" },
  { key: "phone", label: "Phone", placeholder: "+1 (555) 000-0000" },
  { key: "location", label: "Location", placeholder: "San Francisco, CA" },
  { key: "githubUrl", label: "GitHub URL", placeholder: "https://github.com/..." },
  { key: "linkedinUrl", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/..." },
  { key: "twitterUrl", label: "Twitter / X URL", placeholder: "https://x.com/..." },
  { key: "mediumUrl", label: "Medium URL", placeholder: "https://medium.com/..." },
  { key: "resumeUrl", label: "Resume URL", placeholder: "/resume.pdf" },
];

type ToastState = { type: "success" | "error"; message: string } | null;

export default function AdminProfilePage() {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((data) => { if (data) setFormData(data); })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("success", "Profile updated! Public site and AI index refreshed.");
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
    <div className="space-y-6 max-w-2xl relative">
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
        <h1 className="text-2xl font-serif font-bold text-white">Profile Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Update your public-facing hero section and contact info.</p>
      </div>

      <div className="rounded-2xl bg-[#0F0F15] border border-white/[0.05] p-6 space-y-5">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
              {field.label}
            </label>
            {(field as any).textarea ? (
              <textarea
                rows={4}
                value={formData[field.key] || ""}
                onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full bg-muted/20 border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-violet text-white placeholder:text-muted-foreground/40 transition-colors resize-none"
              />
            ) : (
              <input
                type="text"
                value={formData[field.key] || ""}
                onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full bg-muted/20 border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-violet text-white placeholder:text-muted-foreground/40 transition-colors"
              />
            )}
          </div>
        ))}

        <div className="pt-4 border-t border-white/[0.06]">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm disabled:opacity-50 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{isSaving ? "Saving..." : "Save Profile"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
