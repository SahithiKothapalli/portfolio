"use client";

import React, { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError("Failed to deliver message. Please try again or email directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!isSuccess ? (
        <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Your Name</label>
              <input
                type="text" id="name" name="name" required value={formData.name} onChange={handleInputChange}
                className="w-full bg-white/10 dark:bg-[#12121B] border border-black/15 dark:border-white/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 transition-colors"
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Email Address</label>
              <input
                type="email" id="email" name="email" required value={formData.email} onChange={handleInputChange}
                className="w-full bg-white/10 dark:bg-[#12121B] border border-black/15 dark:border-white/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 transition-colors"
                placeholder="recruiter@company.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="subject" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Subject</label>
            <input
              type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange}
              className="w-full bg-white/10 dark:bg-[#12121B] border border-black/15 dark:border-white/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 transition-colors"
              placeholder="e.g. Hiring Opportunity"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Message</label>
            <textarea
              id="message" name="message" required rows={5} value={formData.message} onChange={handleInputChange}
              className="w-full bg-white/10 dark:bg-[#12121B] border border-black/15 dark:border-white/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 transition-colors resize-none"
              placeholder="Share the details of your inquiry..."
            />
          </div>
          {error && (
            <div className="flex items-center space-x-2 text-red-500 text-xs bg-red-500/5 border border-red-500/20 p-3.5 rounded-xl">
              <AlertCircle size={14} /><span>{error}</span>
            </div>
          )}
          <button
            type="submit" disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-violet-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            <Send size={15} />
            <span>{isSubmitting ? "Delivering message..." : "Send Message"}</span>
          </button>
        </motion.form>
      ) : (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center py-12 space-y-4"
        >
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500">
            <CheckCircle size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold text-foreground">Message Transmitted</h3>
            <p className="text-sm text-muted-foreground max-w-sm">Sahithi has been notified and will respond shortly.</p>
          </div>
          <button onClick={() => setIsSuccess(false)} className="text-xs font-semibold text-accent-violet hover:underline pt-4">Send another message</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
