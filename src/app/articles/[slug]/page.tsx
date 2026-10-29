import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ArrowLeft, Calendar, BookOpen, Sparkles } from "lucide-react";
import Markdown from "@/components/Markdown";

export const revalidate = 0; // Disable cache to reflect Admin changes instantly

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-6">
      {/* Back Button */}
      <Link
        href="/articles"
        className="inline-flex items-center space-x-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Back to logs</span>
      </Link>

      {/* Meta Headers */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-xs text-muted-foreground font-sans">
          <span className="flex items-center space-x-1">
            <Calendar size={12} />
            <span>{article.date}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <BookOpen size={12} />
            <span>{article.readingTime || "5 min read"}</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground leading-tight">
          {article.title}
        </h1>

        <p className="text-base text-muted-foreground leading-relaxed italic border-l-2 border-accent-violet/60 pl-4 py-1">
          {article.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-b border-border pb-6">
          {article.tags.split(",").map((tag) => (
            <span
              key={tag}
              className="text-[9px] px-2.5 py-0.5 rounded-full border border-border/80 bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
      </div>

      {/* Cover Image */}
      {article.imageUrl && (
        <div className="aspect-[16/8] rounded-3xl border border-border overflow-hidden bg-muted shadow-md">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Markdown Content */}
      <div className="prose prose-violet max-w-none pt-4">
        <Markdown content={article.content} />
      </div>

      {/* Footer Sparkle */}
      <div className="border-t border-border/60 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-muted-foreground text-xs">
          <span className="font-semibold text-foreground">Author:</span>
          <span>Sahithi AI log</span>
        </div>
        
        {/* Trigger chat context */}
        <button
          data-ai-query={`Ask AI about Sahithi's article: '${article.title}'`}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
          style={{ cursor: "pointer" }}
        >
          <Sparkles size={12} />
          <span>Ask AI about this article</span>
        </button>
      </div>

      {/* Client Trigger Binding */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('click', function(e) {
            var btn = e.target.closest('[data-ai-query]');
            if (btn) {
              e.preventDefault();
              var queryVal = btn.getAttribute('data-ai-query');
              window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: { query: queryVal } }));
            }
          });
        `
      }} />
    </div>
  );
}
