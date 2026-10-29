import React from "react";
import { prisma } from "@/lib/db";
import { Award, ExternalLink, Calendar } from "lucide-react";

export const revalidate = 0;

export default async function CertificationsPage() {
  const certifications = await prisma.certificate.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-6">
      <div className="space-y-3 text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Award size={12} />
          <span>Certifications</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-sans font-black text-foreground">Credentials</h1>
        <p className="text-sm text-muted-foreground">Industry certifications and validated expertise.</p>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-3xl">
          <p className="text-muted-foreground">No certifications added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="group flex flex-col justify-between p-5 rounded-2xl border border-white/[0.06] bg-[#0D0D14] hover:border-amber-500/30 transition-all duration-300">
              <div className="space-y-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 w-fit">
                  <Award size={18} className="text-amber-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground group-hover:text-amber-400 transition-colors">{cert.name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{cert.issuer}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.05]">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  <span>{cert.date}</span>
                </div>
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                    <ExternalLink size={12} />
                    <span>Verify</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
