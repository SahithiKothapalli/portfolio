import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Sparkles, Download, Printer, FileText, Share2 } from "lucide-react";
import ResumeActionsTrigger from "./ResumeActionsTrigger"; // Client actions handler

export const revalidate = 0; // Disable cache to reflect Admin changes instantly

export default async function ResumePage() {
  const profile = await prisma.profile.findFirst();
  const resumeUrl = profile?.resumeUrl || "/resume.pdf";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-accent-violet dark:text-accent-mauve text-xs font-semibold uppercase tracking-wider">
            <FileText size={12} />
            <span>Interactive CV</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Curriculum Vitae
          </h1>
        </div>

        {/* Action Buttons */}
        <ResumeActionsTrigger resumeUrl={resumeUrl} />
      </div>

      {/* PDF View Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* PDF Embedded View */}
        <div className="lg:col-span-8 luxury-card overflow-hidden h-[700px] border border-border shadow-luxury-light dark:shadow-luxury-dark bg-[#0F0F15]/10 flex flex-col justify-between">
          <div className="bg-muted/40 border-b border-border px-4 py-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Embedded Preview: {resumeUrl.split("/").pop()}</span>
            <span className="flex items-center space-x-1 font-semibold text-accent-violet">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-pulse" />
              <span>Interactive Viewer</span>
            </span>
          </div>
          
          {/* iframe preview */}
          <iframe
            src={resumeUrl}
            className="flex-1 w-full border-none bg-white"
            title="Sahithi PDF Resume Preview"
          />
        </div>

        {/* Side Panel: Summary and suggested RAG triggers */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/[0.03] to-indigo-600/[0.03] space-y-4">
            <div className="flex items-center space-x-2 text-accent-violet">
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider font-sans">AI Credentials Audit</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Verify Sahithi's credentials dynamically. Click below to prompt the AI assistant to index, summarize, and cross-reference details instantly.
            </p>

            <ResumeActionsTrigger queryButtonOnly={true} />
          </div>

          {/* Quick Details Card */}
          <div className="luxury-card p-6 space-y-4 shadow-luxury-light dark:shadow-luxury-dark bg-[#0F0F15]/10">
            <h3 className="text-sm font-serif font-bold text-foreground">
              Document Attributes
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Owner:</span>
                <span className="font-medium text-foreground">{profile?.name || "Sahithi"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Focus:</span>
                <span className="font-medium text-foreground">{profile?.title || "AI Engineering"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Vector Format:</span>
                <span className="font-medium text-foreground">text-embedding-3-large</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Index Partition:</span>
                <span className="font-medium text-foreground">sqlite-similarity</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
