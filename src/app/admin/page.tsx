import React from "react";
import { prisma } from "@/lib/db";
import { FolderOpen, Briefcase, Zap, BookOpen, Brain, Activity, Sparkles } from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboard() {
  const [projects, experiences, skills, articles, chunks, logs] = await Promise.all([
    prisma.project.count(),
    prisma.experience.count(),
    prisma.skill.count(),
    prisma.article.count(),
    prisma.knowledgeChunk.count(),
    prisma.activityLog.findMany({ orderBy: { timestamp: "desc" }, take: 10 }),
  ]);

  const stats = [
    { label: "Projects", value: projects, icon: <FolderOpen size={18} />, color: "text-violet-400" },
    { label: "Experiences", value: experiences, icon: <Briefcase size={18} />, color: "text-indigo-400" },
    { label: "Skills", value: skills, icon: <Zap size={18} />, color: "text-purple-400" },
    { label: "Articles", value: articles, icon: <BookOpen size={18} />, color: "text-mauve" },
    { label: "Vector Chunks", value: chunks, icon: <Brain size={18} />, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-bold text-white">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">
          Manage your portfolio content. Changes update the public site and AI knowledge base automatically.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-2xl bg-[#0F0F15] border border-white/[0.05] space-y-3"
          >
            <div className={`${stat.color}`}>{stat.icon}</div>
            <div>
              <span className="text-2xl font-bold text-white font-sans block">{stat.value}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Edit Profile", href: "/admin/profile" },
            { label: "Add Project", href: "/admin/projects" },
            { label: "Add Experience", href: "/admin/experience" },
            { label: "Manage Skills", href: "/admin/skills" },
            { label: "Write Article", href: "/admin/articles" },
            { label: "Knowledge Base", href: "/admin/knowledge" },
          ].map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="px-4 py-3 rounded-xl bg-[#0F0F15] border border-white/[0.05] text-sm font-medium text-white hover:border-violet-500/30 hover:bg-violet-600/5 transition-all duration-200"
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>

      {/* Activity Log */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center space-x-2">
          <Activity size={14} />
          <span>Recent Activity</span>
        </h2>
        <div className="rounded-2xl bg-[#0F0F15] border border-white/[0.05] divide-y divide-white/[0.04] overflow-hidden">
          {logs.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No activity yet.</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  <span className="text-sm text-white font-medium">{log.action}</span>
                  {log.details && (
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">— {log.details}</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
