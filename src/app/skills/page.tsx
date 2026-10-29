import React from "react";
import { prisma } from "@/lib/db";
import { BrainCircuit } from "lucide-react";
import SkillCard from "./SkillCard";

export const revalidate = 0;

const CATEGORY_ORDER = ["AI", "Automation", "Languages", "Frontend", "DevOps", "Databases"];

export default async function SkillsPage() {
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });

  const categories: Record<string, typeof skills> = {};
  skills.forEach((skill) => {
    const cat = skill.category || "General";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(skill);
  });

  // Sort categories in preferred order
  const sortedCategories = [
    ...CATEGORY_ORDER.filter((c) => categories[c]),
    ...Object.keys(categories).filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-6">
      {/* Header */}
      <div className="space-y-3 text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-accent-violet text-xs font-semibold uppercase tracking-wider">
          <BrainCircuit size={12} />
          <span>Competency Matrix</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-sans font-black text-foreground">Core Technologies</h1>
        <p className="text-sm text-muted-foreground">
          No progress bars. Click any skill to ask the AI about Sahithi&apos;s real-world experience with it.
        </p>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-3xl">
          <p className="text-muted-foreground">No skills defined yet. Add them from the Admin panel.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {sortedCategories.map((category) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground font-mono">{category}</h2>
                <div className="flex-1 h-px bg-white/[0.05]" />
                <span className="text-[10px] text-muted-foreground/50 font-mono">{categories[category].length} skills</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories[category].map((skill) => (
                  <SkillCard
                    key={skill.id}
                    name={skill.name}
                    category={skill.category}
                    description={skill.description || ""}
                    years={skill.yearsOfExperience || 0}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
