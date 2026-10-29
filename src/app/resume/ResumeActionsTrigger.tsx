"use client";

import React from "react";
import { Download, Printer, Share2, Sparkles, MessageSquare } from "lucide-react";

interface ResumeActionsTriggerProps {
  resumeUrl?: string;
  queryButtonOnly?: boolean;
}

export default function ResumeActionsTrigger({ 
  resumeUrl = "/resume.pdf", 
  queryButtonOnly = false 
}: ResumeActionsTriggerProps) {

  const handleAskAI = (query: string) => {
    window.dispatchEvent(
      new CustomEvent("open-ai-chat", {
        detail: { query },
      })
    );
  };

  const handlePrint = () => {
    // Open PDF in new tab and call print
    const printWindow = window.open(resumeUrl, "_blank");
    if (printWindow) {
      printWindow.focus();
      // Let it load then trigger print
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Resume page link copied to clipboard!");
  };

  if (queryButtonOnly) {
    const suggestedQueries = [
      { text: "📄 Summarize Sahithi's credentials", icon: <Sparkles size={11} /> },
      { text: "🌟 What are her key achievements?", icon: <MessageSquare size={11} /> },
      { text: "🎯 Evaluate Sahithi for an AI Engineer role", icon: <Sparkles size={11} /> }
    ];

    return (
      <div className="space-y-2 pt-2">
        {suggestedQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleAskAI(q.text.slice(2))}
            className="w-full text-left text-xs px-3.5 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-accent-violet hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all duration-200 flex items-center justify-between font-medium group"
          >
            <span>{q.text}</span>
            <span className="text-muted-foreground/45 group-hover:text-accent-violet transition-colors">
              {q.icon}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* AI Summary */}
      <button
        onClick={() => handleAskAI("Summarize Sahithi's resume profile and highlight her strengths.")}
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600/15 to-indigo-600/15 border border-violet-500/30 text-accent-violet dark:text-accent-mauve text-sm font-semibold hover:scale-102 active:scale-95 transition-all duration-200"
      >
        <Sparkles size={14} className="animate-pulse" />
        <span>AI Summary</span>
      </button>

      {/* Download */}
      <a
        href={resumeUrl}
        download
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold text-foreground hover:border-accent-violet hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all duration-300"
      >
        <Download size={14} />
        <span className="hidden sm:inline">Download PDF</span>
      </a>

      {/* Print */}
      <button
        onClick={handlePrint}
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold text-foreground hover:border-accent-violet hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all duration-300"
        title="Print Resume"
      >
        <Printer size={14} />
        <span className="hidden sm:inline">Print</span>
      </button>

      {/* Share */}
      <button
        onClick={handleShare}
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold text-foreground hover:border-accent-violet hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all duration-300"
        title="Share Resume Link"
      >
        <Share2 size={14} />
      </button>
    </div>
  );
}
