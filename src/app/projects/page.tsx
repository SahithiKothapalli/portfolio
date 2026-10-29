import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Rocket, ArrowRight, ExternalLink, GitBranch } from "lucide-react";

export const revalidate = 0;

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-6">
      {/* Header */}
      <div className="space-y-3 text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-accent-violet text-xs font-semibold uppercase tracking-wider">
          <Rocket size={11} />
          <span>Case Studies</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-sans font-black text-foreground">
          Projects that defined<br />my Portfolio
        </h1>
        <p className="text-sm text-muted-foreground font-sans">
          Production-grade AI systems, agentic pipelines, and vector search architectures.
        </p>
      </div>

      {/* Projects — Horizontal list cards */}
      {projects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-3xl">
          <p className="text-muted-foreground">No projects yet. Log in to Admin to publish.</p>
        </div>
      ) : (
        <div className="space-y-4 pt-4">
          {projects.map((project, idx) => {
            let tags: string[] = [];
            try { tags = JSON.parse(project.techStack); }
            catch { tags = project.techStack.split(",").map((t) => t.trim()); }

            return (
              <div
                key={project.id}
                className="group relative flex flex-col sm:flex-row gap-0 rounded-2xl border border-white/[0.06] bg-[#0D0D14] hover:border-violet-500/30 hover:bg-[#0F0F18] transition-all duration-300 overflow-hidden"
              >
                {/* Left accent bar */}
                <div className={`w-full sm:w-1 h-1 sm:h-auto flex-shrink-0 bg-gradient-to-r sm:bg-gradient-to-b from-violet-600 to-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity`} />

                {/* Cover image (small, left side on desktop) */}
                {project.imageUrl && (
                  <div className="hidden sm:block w-[160px] flex-shrink-0 overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Main content */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Index number */}
                  <span className="text-3xl font-black font-mono text-white/[0.06] group-hover:text-violet-500/20 transition-colors select-none flex-shrink-0 hidden sm:block">
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  {/* Info */}
                  <div className="flex-1 space-y-2 min-w-0">
                    <h2 className="text-lg font-bold text-foreground group-hover:text-accent-violet transition-colors leading-tight">
                      {project.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {project.summary}
                    </p>
                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tags.slice(0, 5).map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.07] text-muted-foreground font-mono">
                          {tag}
                        </span>
                      ))}
                      {tags.length > 5 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md text-accent-violet">+{tags.length - 5}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 ml-auto sm:ml-0">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-white/[0.07] text-muted-foreground hover:text-foreground hover:border-accent-violet transition-colors"
                        aria-label="GitHub">
                        <GitBranch size={14} />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-white/[0.07] text-muted-foreground hover:text-foreground hover:border-accent-violet transition-colors"
                        aria-label="Live demo">
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold hover:bg-violet-500/20 transition-all group/btn"
                    >
                      <span>Details</span>
                      <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
