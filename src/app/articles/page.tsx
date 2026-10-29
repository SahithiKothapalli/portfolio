import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Sparkles, Calendar, BookOpen, ArrowRight } from "lucide-react";

export const revalidate = 0; // Disable cache to reflect Admin changes instantly

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { date: "desc" },
  });

  const featured = articles[0];
  const list = articles.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-6">
      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-accent-violet dark:text-accent-mauve text-xs font-semibold uppercase tracking-wider">
          <BookOpen size={12} />
          <span>Research & Insights</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
          Engineering Logs
        </h1>
        <p className="text-base text-muted-foreground font-sans">
          Technical deep-dives, architectural notes, and thoughts on AI alignment, RAG pipelines, and n8n workflows.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-3xl">
          <p className="text-muted-foreground">No articles published. Log in to the Admin Panel to write your first post!</p>
        </div>
      ) : (
        <div className="space-y-16 pt-6">
          {/* Featured Article Card */}
          {featured && (
            <div className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-border rounded-3xl overflow-hidden bg-[#0F0F15]/10 backdrop-blur-sm p-6 shadow-luxury-light dark:shadow-luxury-dark hover:border-accent-violet transition-all duration-300">
              <div className="lg:col-span-7 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-muted">
                {featured.imageUrl ? (
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-950/20 to-indigo-950/20 text-accent-mauve font-semibold font-serif">
                    Featured Publication
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{featured.date}</span>
                  </span>
                  <span>•</span>
                  <span>{featured.readingTime || "5 min read"}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground group-hover:text-accent-violet transition-colors">
                  <Link href={`/articles/${featured.slug}`}>{featured.title}</Link>
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {featured.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {featured.tags.split(",").map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] px-2 py-0.5 rounded-full border border-border/80 bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    href={`/articles/${featured.slug}`}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/10 hover:scale-105 transition-all duration-300"
                  >
                    <span>Read Deep Dive</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Rest of Articles Grid */}
          {list.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {list.map((art) => (
                <div
                  key={art.id}
                  className="luxury-card overflow-hidden group flex flex-col justify-between hover:border-accent-violet hover:-translate-y-0.5 transition-all duration-300 shadow-luxury-light dark:shadow-luxury-dark bg-[#0F0F15]/10"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden relative border-b border-border bg-muted">
                    {art.imageUrl ? (
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-950/20 to-indigo-950/20 text-accent-mauve font-semibold font-serif text-sm">
                        Technical Log
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-[10px] text-muted-foreground">
                        <span>{art.date}</span>
                        <span>•</span>
                        <span>{art.readingTime || "5 min read"}</span>
                      </div>
                      
                      <h3 className="text-base font-bold text-foreground group-hover:text-accent-violet transition-colors line-clamp-2">
                        <Link href={`/articles/${art.slug}`}>{art.title}</Link>
                      </h3>
                      
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {art.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                      <div className="flex gap-1">
                        {art.tags.split(",").slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground font-semibold border border-border/80 uppercase tracking-wider"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/articles/${art.slug}`}
                        className="text-xs font-semibold text-accent-violet hover:text-accent-mauve transition-colors flex items-center space-x-1 group/link"
                      >
                        <span>Read</span>
                        <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform duration-200" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
