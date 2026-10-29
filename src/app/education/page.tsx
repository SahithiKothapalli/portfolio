import React from "react";
import { prisma } from "@/lib/db";
import { GraduationCap, Calendar } from "lucide-react";

export const revalidate = 0;

export default async function EducationPage() {
  const educations = await prisma.education.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-6">
      <div className="space-y-3 text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <GraduationCap size={12} />
          <span>Education</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-sans font-black text-foreground">Academic Background</h1>
        <p className="text-sm text-muted-foreground">Formal education and academic achievements.</p>
      </div>

      {educations.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-3xl">
          <p className="text-muted-foreground">No education records yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((edu) => {
            let achievements: string[] = [];
            if (edu.achievements) {
              try { achievements = JSON.parse(edu.achievements); }
              catch { achievements = edu.achievements.split("\n").filter(Boolean); }
            }

            return (
              <div key={edu.id} className="group p-6 rounded-2xl border border-white/[0.06] bg-[#0D0D14] hover:border-emerald-500/25 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                      <GraduationCap size={20} className="text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground group-hover:text-emerald-400 transition-colors">{edu.degree}</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">{edu.institution}</p>
                      {achievements.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {achievements.map((a, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-emerald-500 mt-0.5">•</span>
                              <span>{a}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                    <Calendar size={12} />
                    <span>{edu.duration}</span>
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
