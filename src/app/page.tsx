import React from "react";
import { prisma } from "@/lib/db";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import WorkflowExecution from "@/components/WorkflowExecution";
import SkillsPeriodicTable from "@/components/SkillsPeriodicTable";
import ProjectsAccordion from "@/components/ProjectsAccordion";
import ContactForm from "./contact/ContactForm";
import EducationSection from "@/components/EducationSection";
import CertificationsSection from "@/components/CertificationsSection";
import {
  Rocket, ArrowRight, ExternalLink, GitBranch,
  BrainCircuit, Briefcase, Calendar, BookOpen,
  Mail, Phone, MapPin, MessageCircle, Sparkles, Award, GraduationCap
} from "lucide-react";


export const revalidate = 0;

const CATEGORY_ORDER = ["AI", "Automation", "Languages", "Frontend", "DevOps", "Databases"];

export default async function HomePage() {
  // ─── fetch all data in parallel ────────────────────────────────────────────
  let name = "Sahithi";
  let title = "Staff AI Engineer";
  let resumeUrl = "/resume.pdf";
  let email = "saisahithikothapalli@gmail.com";
  let phone = "";
  let location = "";
  let githubUrl = "";
  let linkedinUrl = "";
  let twitterUrl = "";

  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  let experiences: Awaited<ReturnType<typeof prisma.experience.findMany>> = [];
  let skills: Awaited<ReturnType<typeof prisma.skill.findMany>> = [];
  let articles: Awaited<ReturnType<typeof prisma.article.findMany>> = [];
  let education: Awaited<ReturnType<typeof prisma.education.findMany>> = [];
  let certifications: Awaited<ReturnType<typeof prisma.certificate.findMany>> = [];
  let sectionConfigs: Awaited<ReturnType<typeof prisma.sectionConfig.findMany>> = [];

  try {
    const [profile, proj, exp, sk, art, edu, cert, sec] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.project.findMany({ orderBy: { order: "asc" } }),
      prisma.experience.findMany({ orderBy: { order: "asc" } }),
      prisma.skill.findMany({ orderBy: { order: "asc" } }),
      prisma.article.findMany({ orderBy: { date: "desc" } }),
      prisma.education.findMany({ orderBy: { order: "asc" } }),
      prisma.certificate.findMany({ orderBy: { order: "asc" } }),
      prisma.sectionConfig.findMany({ orderBy: { order: "asc" } }),
    ]);
    if (profile) {
      name = profile.name || name;
      title = profile.title || title;
      resumeUrl = profile.resumeUrl || resumeUrl;
      email = profile.email || email;
      phone = profile.phone || "";
      location = profile.location || "";
      githubUrl = profile.githubUrl || "";
      linkedinUrl = profile.linkedinUrl || "";
      twitterUrl = profile.twitterUrl || "";
    }
    projects = proj;
    experiences = exp;
    skills = sk;
    articles = art;
    education = edu;
    certifications = cert;
    sectionConfigs = sec;
  } catch {}

  const DEFAULT_SECTIONS = [
    "hero", "whoami", "skills", "experience", "projects",
    "certifications", "education", "articles", "contact"
  ];

  let activeOrder: string[] = [];
  if (sectionConfigs.length > 0) {
    // Single source of truth: sorted by order, strictly where s.isVisible === true
    const sorted = [...sectionConfigs].sort((a, b) => a.order - b.order);
    activeOrder = sorted.filter((s) => s.isVisible).map((s) => s.key);
  } else {
    activeOrder = DEFAULT_SECTIONS;
  }

  // ─── Skills by category ────────────────────────────────────────────────────
  const categories: Record<string, typeof skills> = {};
  skills.forEach((sk) => {
    const cat = sk.category || "General";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(sk);
  });
  const sortedCategories = [
    ...CATEGORY_ORDER.filter((c) => categories[c]),
    ...Object.keys(categories).filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  const featuredArticle = articles[0];
  const articleList = articles.slice(1);

  // Render individual sections
  const renderSectionByKey = (key: string) => {
    switch (key) {
      case "hero":
        return (
          <section key="hero" id="home" className="scroll-mt-20 py-2 sm:py-4">
            <HeroSection name={name} title={title} resumeUrl={resumeUrl} email={email} />
          </section>
        );

      case "whoami":
        return (
          <section key="whoami" id="whoami" className="scroll-mt-20 py-10 sm:py-14 border-t border-black/[0.06] dark:border-white/[0.06]">
            <WorkflowExecution />
          </section>
        );

      case "skills":
        return (
          <section key="skills" id="skills" className="scroll-mt-20 py-10 sm:py-14 border-t border-black/[0.06] dark:border-white/[0.06]">
            <SkillsPeriodicTable skills={skills} />
          </section>
        );

      case "projects":
        return (
          <section key="projects" id="projects" className="scroll-mt-20 py-10 sm:py-14 border-t border-black/[0.06] dark:border-white/[0.06]">
            <ProjectsAccordion projects={projects} />
          </section>
        );

      case "experience":
        return (
          <section key="experience" id="experience" className="scroll-mt-20 py-10 sm:py-14 border-t border-black/[0.06] dark:border-white/[0.06] space-y-8">
            <div className="space-y-3 max-w-xl mx-auto text-center flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-500 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider">
                <Briefcase size={12} />
                <span>Professional Timeline</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground">
                Career{" "}
                <span className="font-instrument italic font-normal text-muted-foreground/90">
                  Milestones
                </span>
              </h2>
              <p className="text-sm text-muted-foreground">A track record of engineering leadership, RAG system construction, and scaling automation architectures.</p>
            </div>

            {experiences.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-3xl">
                <p className="text-muted-foreground text-sm">No experience records found.</p>
              </div>
            ) : (
              <div className="relative border-l border-black/[0.08] dark:border-white/[0.08] ml-4 md:ml-6 space-y-8 pt-4">
                {experiences.map((exp) => {
                  let bulletPoints: string[] = [];
                  try { bulletPoints = JSON.parse(exp.achievements); }
                  catch { bulletPoints = exp.achievements.split("\n").filter((p) => p.trim()); }
                  let techBadges: string[] = [];
                  try { techBadges = JSON.parse(exp.technologies); }
                  catch { techBadges = exp.technologies.split(",").map((t) => t.trim()); }
                  return (
                    <div key={exp.id} className="relative pl-8 md:pl-10 group">
                      <div className="absolute left-[-6px] top-1.5 w-3 h-3 rounded-full bg-violet-500/20 group-hover:bg-violet-500 group-hover:scale-125 border-2 border-background transition-all duration-300" />
                      <div className="luxury-card p-6 space-y-5 hover:border-violet-500/30 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-bold text-foreground group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">{exp.role}</h3>
                            <span className="text-sm font-semibold text-violet-600 dark:text-violet-400 tracking-wide">{exp.company}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground bg-black/[0.03] dark:bg-white/[0.03] px-3 py-1.5 rounded-full border border-black/[0.06] dark:border-white/[0.06] w-fit">
                            <Calendar size={12} />
                            <span>{exp.duration}</span>
                          </div>
                        </div>
                        <ul className="space-y-2.5">
                          {bulletPoints.map((point, i) => (
                            <li key={i} className="flex items-start text-sm text-muted-foreground leading-relaxed">
                              <span className="text-violet-500 dark:text-violet-400 font-bold mr-2 select-none">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2">
                          <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest block">Stack</span>
                          <div className="flex flex-wrap gap-1.5">
                            {techBadges.map((tech) => (
                              <span key={tech} className="text-[10px] px-2.5 py-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.03] dark:bg-white/[0.03] text-muted-foreground font-mono uppercase tracking-wider">{tech}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );

      case "education":
        return (
          <section key="education" id="education" className="scroll-mt-20 py-10 sm:py-14 border-t border-black/[0.06] dark:border-white/[0.06]">
            <EducationSection items={education} />
          </section>
        );

      case "certifications":
        return (
          <section key="certifications" id="certifications" className="scroll-mt-20 py-10 sm:py-14 border-t border-black/[0.06] dark:border-white/[0.06]">
            <CertificationsSection
              items={certifications.map((c) => ({
                id: c.id,
                title: c.name,
                issuer: c.issuer,
                date: c.date,
                credentialId: (c as any).credentialId ?? null,
                credentialUrl: c.credentialUrl,
                skills: (c as any).skills ?? null,
                order: c.order,
              }))}
            />
          </section>
        );

      case "articles":
        return (
          <section key="articles" id="articles" className="scroll-mt-20 py-10 sm:py-14 border-t border-black/[0.06] dark:border-white/[0.06] space-y-8">
            <div className="space-y-3 max-w-xl mx-auto text-center flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-500 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider">
                <BookOpen size={12} />
                <span>Research &amp; Insights</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground">
                Engineering{" "}
                <span className="font-instrument italic font-normal text-muted-foreground/90">
                  Logs
                </span>
              </h2>
              <p className="text-sm text-muted-foreground">Technical deep-dives, architectural notes, and thoughts on AI alignment, RAG pipelines, and n8n workflows.</p>
            </div>

            {articles.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-3xl">
                <p className="text-muted-foreground text-sm">No articles published yet.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {featuredArticle && (
                  <div className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-black/[0.08] dark:border-white/[0.06] rounded-3xl overflow-hidden bg-white dark:bg-[#0E0F15] p-6 hover:border-violet-500/30 transition-all duration-300 shadow-sm">
                    <div className="lg:col-span-7 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.03]">
                      {featuredArticle.imageUrl ? (
                        <img src={featuredArticle.imageUrl} alt={featuredArticle.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-950/20 to-indigo-950/20 text-violet-400 font-semibold">Featured Publication</div>
                      )}
                    </div>
                    <div className="lg:col-span-5 space-y-4">
                      <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1"><Calendar size={12} /><span>{featuredArticle.date}</span></span>
                        <span>•</span>
                        <span>{featuredArticle.readingTime || "5 min read"}</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                        <Link href={`/articles/${featuredArticle.slug}`}>{featuredArticle.title}</Link>
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{featuredArticle.summary}</p>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {featuredArticle.tags.split(",").map((tag) => (
                          <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full border border-black/[0.08] dark:border-white/[0.07] bg-black/[0.02] dark:bg-white/[0.03] text-muted-foreground font-semibold uppercase tracking-wider">{tag.trim()}</span>
                        ))}
                      </div>
                      <Link href={`/articles/${featuredArticle.slug}`} className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:scale-105 transition-all duration-300 shadow-md shadow-violet-600/20">
                        <span>Read Deep Dive</span><ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                )}
                {articleList.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articleList.map((art) => (
                      <div key={art.id} className="luxury-card overflow-hidden group flex flex-col justify-between hover:border-violet-500/30 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="aspect-[16/10] w-full overflow-hidden relative border-b border-black/[0.06] dark:border-white/[0.05] bg-black/[0.02] dark:bg-white/[0.02]">
                          {art.imageUrl ? (
                            <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-950/20 to-indigo-950/20 text-violet-400/60 font-semibold text-sm">Technical Log</div>
                          )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-[10px] text-muted-foreground">
                              <span>{art.date}</span><span>•</span><span>{art.readingTime || "5 min read"}</span>
                            </div>
                            <h3 className="text-base font-bold text-foreground group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                              <Link href={`/articles/${art.slug}`}>{art.title}</Link>
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{art.summary}</p>
                          </div>
                          <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.04] flex items-center justify-between">
                            <div className="flex gap-1">
                              {art.tags.split(",").slice(0, 2).map((tag) => (
                                <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-black/[0.03] dark:bg-white/[0.03] text-muted-foreground font-semibold border border-black/[0.06] dark:border-white/[0.07] uppercase tracking-wider">{tag.trim()}</span>
                              ))}
                            </div>
                            <Link href={`/articles/${art.slug}`} className="text-xs font-semibold text-violet-500 dark:text-violet-400 hover:text-violet-600 dark:hover:text-violet-300 transition-colors flex items-center space-x-1 group/link">
                              <span>Read</span><ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        );

      case "contact":
        return (
          <section key="contact" id="contact" className="scroll-mt-20 py-16 sm:py-20 border-t border-black/[0.06] dark:border-white/[0.06] space-y-12">
            {/* Editorial heading with letter-hop */}
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider">
                <Mail size={12} />
                <span>Open to Work</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                {"Let's build".split("").map((ch, i) => (
                  <span
                    key={i}
                    className="inline-block letter-hop"
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </span>
                ))}{" "}
                <span
                  className="font-instrument italic"
                  style={{ fontFamily: "var(--font-instrument, Georgia, serif)", fontStyle: "italic", color: "var(--muted-foreground)" }}
                >
                  something
                </span>{" together."}
              </h2>
              <p className="text-muted-foreground text-base max-w-xl mx-auto">
                Have an opportunity, a wild idea, or an architectural challenge? Let&apos;s make it real.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left contact info */}
              <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0E0F15] space-y-8 shadow-sm">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-foreground">Direct Line</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {location ? `Based out of ${location}. ` : ""}Open to remote collaborations, hybrid roles, and specialized AI consultation.
                  </p>

                  {/* Copy-to-clipboard email chip */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest block">Email</span>
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/25 w-fit group cursor-copy select-all">
                      <Mail size={14} className="text-violet-500 dark:text-violet-400 flex-shrink-0" />
                      <span className="text-sm font-mono text-foreground font-semibold">{email}</span>
                      <span className="text-[10px] text-muted-foreground/60 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors ml-1 font-mono">copy</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {phone && (
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20"><Phone size={15} /></div>
                        <span>{phone}</span>
                      </div>
                    )}
                    {location && (
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20"><MapPin size={15} /></div>
                        <span>{location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-black/[0.06] dark:border-white/[0.06]">
                  <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest block">Find me at</span>
                  <div className="flex gap-2 flex-wrap">
                    {linkedinUrl && <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] text-muted-foreground hover:text-foreground hover:border-violet-500/40 text-xs font-semibold transition-all" aria-label="LinkedIn"><Briefcase size={14} /> LinkedIn</a>}
                  </div>

                  {/* Spinning availability badge */}
                  <div className="relative w-20 h-20 flex items-center justify-center mt-2">
                    <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full spin-badge" aria-hidden>
                      <defs>
                        <path id="circle-path" d="M 40,40 m -28,0 a 28,28 0 1,1 56,0 a 28,28 0 1,1 -56,0" />
                      </defs>
                      <text fontSize="6.5" fill="currentColor" className="text-violet-400/60 uppercase tracking-widest font-semibold">
                        <textPath href="#circle-path">available · open to work · say hello · </textPath>
                      </text>
                    </svg>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
                      <Sparkles size={12} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — contact form */}
              <div className="lg:col-span-7 luxury-card p-8">
                <ContactForm />
              </div>
            </div>
          </section>
        );


      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {activeOrder.map((key) => renderSectionByKey(key))}

      {/* Bottom padding */}
      <div className="h-12" />
    </div>
  );
}
