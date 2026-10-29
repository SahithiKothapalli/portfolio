import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ArrowLeft, Sparkles, Shield, Cpu, Zap, Lightbulb, GitBranch, ExternalLink, MessageSquare } from "lucide-react";
import ProjectQuestionsTrigger from "./ProjectQuestionsTrigger"; // Client helper to launch chat queries

export const revalidate = 0; // Disable cache to reflect Admin changes instantly

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  let tags: string[] = [];
  try {
    tags = JSON.parse(project.techStack);
  } catch {
    tags = project.techStack.split(",").map(t => t.trim());
  }

  // Pre-compiled list of suggested questions that recruiters can ask the AI about this project
  const suggestedQuestions = [
    `Tell me about the ${project.title} project.`,
    `What were the major challenges Sahithi solved in ${project.title}?`,
    `Explain the architecture and tech stack of ${project.title}.`,
    `What lessons did Sahithi learn from ${project.title}?`
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-6">
      {/* Back Button */}
      <Link
        href="/projects"
        className="inline-flex items-center space-x-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Back to launches</span>
      </Link>

      {/* Hero Header */}
      <div className="space-y-6">
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground leading-tight">
          {project.title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed font-sans font-light">
          {project.summary}
        </p>

        {/* Action buttons & tech stack */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-y border-border py-4">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2.5 py-0.5 rounded-full border border-border bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:border-accent-violet text-foreground hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all duration-300"
              >
                <GitBranch size={15} />
                <span>Repository</span>
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-violet-500/10 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <ExternalLink size={15} />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Case Study Image */}
      {project.imageUrl && (
        <div className="aspect-[16/8] rounded-3xl border border-border overflow-hidden bg-muted shadow-lg">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Detailed Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
        {/* Left Side: Case Study Details */}
        <div className="md:col-span-8 space-y-8 font-sans">
          {/* Problem */}
          {project.problem && (
            <div className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-foreground flex items-center space-x-2">
                <Shield size={18} className="text-red-500/80" />
                <span>The Problem</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.problem}
              </p>
            </div>
          )}

          {/* Solution */}
          {project.solution && (
            <div className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-foreground flex items-center space-x-2">
                <Zap size={18} className="text-amber-500" />
                <span>The Solution</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.solution}
              </p>
            </div>
          )}

          {/* Architecture */}
          {project.architecture && (
            <div className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-foreground flex items-center space-x-2">
                <Cpu size={18} className="text-accent-violet" />
                <span>System Architecture</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line bg-muted/20 p-4 rounded-2xl border border-border/60 font-mono text-xs">
                {project.architecture}
              </p>
            </div>
          )}

          {/* Challenges & Lessons */}
          {(project.challenges || project.lessonsLearned) && (
            <div className="border-t border-border/80 pt-6 grid grid-cols-1 gap-6">
              {project.challenges && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-sans">
                    Challenges Overcome
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.challenges}
                  </p>
                </div>
              )}
              {project.lessonsLearned && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-sans">
                    Lessons Learned
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.lessonsLearned}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Future Improvements */}
          {project.futureImprovements && (
            <div className="space-y-3 border-t border-border/80 pt-6">
              <h2 className="text-xl font-serif font-bold text-foreground flex items-center space-x-2">
                <Lightbulb size={18} className="text-yellow-500" />
                <span>Future Iterations</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.futureImprovements}
              </p>
            </div>
          )}
        </div>

        {/* Right Side: RAG Interaction */}
        <div className="md:col-span-4 space-y-6">
          {/* Ask AI Trigger Card */}
          <div className="p-6 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/[0.03] to-indigo-600/[0.03] space-y-4">
            <div className="flex items-center space-x-2 text-accent-violet">
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider font-sans">Ask AI Assistant</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our centerpiece AI assistant has ingested the full documentation of this project. Recruiters can click below to query details.
            </p>

            {/* Clickable suggested questions trigger */}
            <ProjectQuestionsTrigger questions={suggestedQuestions} />
          </div>
        </div>
      </div>
    </div>
  );
}
