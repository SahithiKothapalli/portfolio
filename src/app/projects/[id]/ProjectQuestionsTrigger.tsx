"use client";

import React from "react";
import { MessageSquare } from "lucide-react";

interface ProjectQuestionsTriggerProps {
  questions: string[];
}

export default function ProjectQuestionsTrigger({ questions }: ProjectQuestionsTriggerProps) {
  const handleQueryAI = (question: string) => {
    window.dispatchEvent(
      new CustomEvent("open-ai-chat", {
        detail: { query: question },
      })
    );
  };

  return (
    <div className="space-y-2 pt-2">
      {questions.map((q, idx) => (
        <button
          key={idx}
          onClick={() => handleQueryAI(q)}
          className="w-full text-left text-xs px-3.5 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-accent-violet hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all duration-200 flex items-center justify-between font-medium group"
        >
          <span className="line-clamp-2">{q}</span>
          <MessageSquare size={13} className="text-muted-foreground/45 group-hover:text-accent-violet transition-colors shrink-0 ml-2" />
        </button>
      ))}
    </div>
  );
}
