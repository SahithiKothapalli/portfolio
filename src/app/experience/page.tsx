import React from "react";
import { prisma } from "@/lib/db";
import { Sparkles, Calendar, Briefcase, Award } from "lucide-react";

export const revalidate = 0; // Disable cache to reflect Admin changes instantly

export default async function ExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-6">
      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-accent-violet dark:text-accent-mauve text-xs font-semibold uppercase tracking-wider">
          <Briefcase size={12} />
          <span>Professional Timeline</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
          Career Milestones
        </h1>
        <p className="text-base text-muted-foreground font-sans">
          A track record of engineering leadership, RAG system construction, and scaling automation architectures.
        </p>
      </div>

      {/* Timeline Section */}
      {experiences.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-3xl">
          <p className="text-muted-foreground">No experience records found. Log in to the Admin Panel to write your history!</p>
        </div>
      ) : (
        <div className="relative border-l border-border dark:border-white/5 ml-4 md:ml-6 space-y-12 pt-6">
          {experiences.map((exp) => {
            let bulletPoints: string[] = [];
            try {
              bulletPoints = JSON.parse(exp.achievements);
            } catch {
              bulletPoints = exp.achievements.split("\n").filter((p) => p.trim() !== "");
            }

            let techBadges: string[] = [];
            try {
              techBadges = JSON.parse(exp.technologies);
            } catch {
              techBadges = exp.technologies.split(",").map((t) => t.trim());
            }

            return (
              <div key={exp.id} className="relative pl-8 md:pl-10 group">
                {/* Timeline Dot Indicator */}
                <div className="absolute left-[-6px] top-1.5 w-3 h-3 rounded-full bg-border group-hover:bg-accent-violet group-hover:scale-125 border-2 border-background transition-all duration-300" />

                {/* Experience Card */}
                <div className="luxury-card p-6 space-y-6 hover:border-accent-violet hover:-translate-y-0.5 transition-all duration-300 shadow-luxury-light dark:shadow-luxury-dark">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-serif font-bold text-foreground group-hover:text-accent-violet transition-colors">
                        {exp.role}
                      </h2>
                      <span className="text-sm font-semibold text-accent-violet font-sans tracking-wide">
                        {exp.company}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border border-border/80 w-fit">
                      <Calendar size={12} />
                      <span>{exp.duration}</span>
                    </div>
                  </div>

                  {/* Achievements */}
                  <ul className="space-y-2.5">
                    {bulletPoints.map((point, index) => (
                      <li key={index} className="flex items-start text-sm text-muted-foreground leading-relaxed">
                        <span className="text-accent-violet font-bold mr-2 select-none">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack used in this role */}
                  <div className="pt-4 border-t border-border/40 space-y-2">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block font-sans">
                      Core Stack Deployment
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {techBadges.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] px-2.5 py-0.5 rounded-full border border-border/80 bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
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
