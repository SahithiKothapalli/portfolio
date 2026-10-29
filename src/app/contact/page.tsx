import React from "react";
import { prisma } from "@/lib/db";
import ContactForm from "./ContactForm";
import { Mail, Phone, MapPin, GitBranch, Briefcase, MessageCircle } from "lucide-react";

export const revalidate = 0;

export default async function ContactPage() {
  let profile = null;
  try {
    profile = await prisma.profile.findFirst();
  } catch {}

  const email = profile?.email || "saisahithikothapalli@gmail.com";
  const phone = profile?.phone || "+1 (555) 019-1740";
  const location = profile?.location || "San Francisco, CA";
  const githubUrl = profile?.githubUrl || "https://github.com/sahithiai";
  const linkedinUrl = profile?.linkedinUrl || "https://linkedin.com/in/sahithiai";
  const twitterUrl = profile?.twitterUrl || "https://x.com/sahithiai";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-6">
      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-accent-violet text-xs font-semibold uppercase tracking-wider">
          <Mail size={12} />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
          Initiate Connection
        </h1>
        <p className="text-base text-muted-foreground font-sans">
          Have an opportunity or architectural discussion? Submit the form below or reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl border border-border bg-[#0F0F15]/10 backdrop-blur-sm space-y-8">
          <div className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-foreground">Contact Details</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Based out of {location}. Open to remote collaborations, hybrid roles, and specialized technical consultation.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-3.5 text-sm text-muted-foreground">
                <div className="p-2.5 rounded-xl bg-violet-500/10 text-accent-violet border border-violet-500/20">
                  <Mail size={16} />
                </div>
                <span>{email}</span>
              </div>
              {phone && (
                <div className="flex items-center space-x-3.5 text-sm text-muted-foreground">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-accent-mauve border border-purple-500/20">
                    <Phone size={16} />
                  </div>
                  <span>{phone}</span>
                </div>
              )}
              <div className="flex items-center space-x-3.5 text-sm text-muted-foreground">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-accent-champagne border border-amber-500/20">
                  <MapPin size={16} />
                </div>
                <span>{location}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-border/40">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block font-sans">Digital Channels</span>
            <div className="flex gap-2">
              {[
                { icon: <GitBranch size={18} />, href: githubUrl, label: "GitHub" },
                { icon: <Briefcase size={18} />, href: linkedinUrl, label: "LinkedIn" },
                { icon: <MessageCircle size={18} />, href: twitterUrl, label: "Twitter" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-accent-violet transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-7 luxury-card p-8 shadow-luxury-light dark:shadow-luxury-dark bg-[#0F0F15]/10">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
