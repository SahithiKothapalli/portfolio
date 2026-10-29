"use client";

import React from "react";

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  // Simple regex-based Markdown to HTML converter
  const parseMarkdown = (text: string) => {
    if (!text) return "";
    
    let html = text
      // Escape HTML entities to prevent XSS
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Code Blocks
    html = html.replace(
      /```([\s\S]*?)```/g,
      (_, code) => `<pre class="bg-muted p-4 rounded-xl font-mono text-xs overflow-x-auto my-3 border border-border text-foreground"><code class="block whitespace-pre">${code.trim()}</code></pre>`
    );

    // Inline Code
    html = html.replace(
      /`([^`]+)`/g,
      (_, code) => `<code class="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-accent-violet border border-border/50">${code}</code>`
    );

    // Headers
    html = html.replace(
      /^####\s+(.+)$/gm,
      '<h4 class="text-sm font-bold mt-4 mb-1 text-foreground font-sans">$1</h4>'
    );
    html = html.replace(
      /^###\s+(.+)$/gm,
      '<h3 class="text-base font-bold mt-5 mb-2 text-foreground font-sans">$1</h3>'
    );
    html = html.replace(
      /^##\s+(.+)$/gm,
      '<h2 class="text-lg font-bold mt-6 mb-3 text-foreground font-serif border-b border-border/40 pb-1">$1</h2>'
    );
    html = html.replace(
      /^#\s+(.+)$/gm,
      '<h1 class="text-xl font-bold mt-8 mb-4 text-foreground font-serif">$1</h1>'
    );

    // Bold text
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

    // Bullet Lists
    html = html.replace(/^\s*[-*]\s+(.+)$/gm, '<li class="ml-4 list-disc text-muted-foreground my-1.5">$1</li>');

    // Numbered Lists
    html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li class="ml-4 list-decimal text-muted-foreground my-1.5">$1</li>');

    // Handle paragraphs / links
    // Convert [text](url) to anchor links
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-accent-violet dark:text-accent-mauve hover:underline font-medium">$1</a>'
    );

    // Replace multiple newlines with breaks
    html = html.split("\n").map(line => {
      if (line.trim().startsWith("<h") || line.trim().startsWith("<li") || line.trim().startsWith("<pre") || line.trim().startsWith("</pre>")) {
        return line;
      }
      return line.trim() ? `<p class="mb-3 leading-relaxed text-sm text-muted-foreground">${line}</p>` : "";
    }).join("\n");

    return html;
  };

  return (
    <div 
      className="markdown-content space-y-1"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}
