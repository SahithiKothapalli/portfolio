"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, User, Briefcase, FolderOpen, Zap, BookOpen,
  FileText, Settings, Brain, LogOut, Menu, X, Sparkles, Activity,
  ChevronRight, GraduationCap, Award, Eye, Upload, CreditCard
} from "lucide-react";

const navItems = [
  { icon: <LayoutDashboard size={16} />, label: "Overview", href: "/admin" },
  { icon: <User size={16} />, label: "Profile", href: "/admin/profile" },
  { icon: <CreditCard size={16} />, label: "ID Card", href: "/admin/idcard" },
  { icon: <Briefcase size={16} />, label: "Experience", href: "/admin/experience" },
  { icon: <FolderOpen size={16} />, label: "Projects", href: "/admin/projects" },
  { icon: <Zap size={16} />, label: "Skills", href: "/admin/skills" },
  { icon: <BookOpen size={16} />, label: "Articles", href: "/admin/articles" },
  { icon: <GraduationCap size={16} />, label: "Education", href: "/admin/education" },
  { icon: <Award size={16} />, label: "Certifications", href: "/admin/certifications" },
  { icon: <Upload size={16} />, label: "Resume Upload", href: "/admin/resume" },
  { icon: <Eye size={16} />, label: "Section Visibility", href: "/admin/sections" },
  { icon: <Brain size={16} />, label: "Knowledge Base", href: "/admin/knowledge" },
  { icon: <Settings size={16} />, label: "AI Settings", href: "/admin/ai-settings" },
];


function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40 bg-[#0A0A10] border-r border-white/[0.05] flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Branding */}
        <div className="px-6 py-6 border-b border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-violet-600/20 border border-violet-500/20">
              <Sparkles size={16} className="text-accent-violet" />
            </div>
            <div>
              <span className="text-sm font-serif font-bold text-white block">Sahithi CMS</span>
              <span className="text-[10px] text-muted-foreground font-sans uppercase tracking-widest">Admin Panel</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-violet-600/15 text-white border border-violet-500/20"
                    : "text-muted-foreground hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <span className={isActive ? "text-accent-violet" : "text-muted-foreground group-hover:text-white transition-colors"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && <ChevronRight size={13} className="ml-auto text-accent-violet" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer: Logout */}
        <div className="px-3 py-4 border-t border-white/[0.05]">
          <Link
            href="/"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-white hover:bg-white/[0.03] transition-all duration-200 mb-1"
          >
            <Activity size={16} />
            <span>View Public Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/[0.05] transition-all duration-200"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030303] text-white flex font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-[#030303]/90 border-b border-white/[0.05] backdrop-blur-md px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected · SQLite</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
