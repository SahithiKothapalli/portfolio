"use client";

import React from "react";
import { GitBranch, Briefcase, BookOpen, Mail } from "lucide-react";

interface FooterProps {
  quote?: string;
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  mediumUrl?: string;
}

export default function Footer({
  quote = "I don't need every iteration to be perfect. I just want the next one to be better.",
  email = "saisahithikothapalli@gmail.com",
  githubUrl = "https://github.com",
  linkedinUrl = "https://linkedin.com",
  mediumUrl = "https://medium.com",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Briefcase size={17} />, href: linkedinUrl, label: "LinkedIn" },
  ];

  return (
    <footer className="border-t border-border bg-white dark:bg-[#030303] py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Quote */}
          <div className="text-center md:text-left max-w-md">
            <blockquote className="font-serif text-base italic text-muted-foreground leading-relaxed">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <span className="text-xs text-muted-foreground/60 mt-2 block font-sans tracking-wider">
              — Sahithi
            </span>
          </div>

          {/* Social icons only */}
          <div className="flex items-center space-x-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-accent-violet hover:bg-violet-500/5 transition-all duration-300"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>&copy; {currentYear} Sai Sahithi. All rights reserved.</span>
          <div className="flex items-center space-x-1.5 text-accent-violet font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-pulse" />
            <span>Production-Grade AI Systems</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
