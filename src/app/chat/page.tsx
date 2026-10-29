"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Trash2, Sparkles, Copy, RefreshCw, AlertCircle, Cpu, ShieldAlert, BadgeInfo } from "lucide-react";
import { motion } from "framer-motion";
import Markdown from "@/components/Markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const suggestionChips = [
    "Tell me about Sahithi's background",
    "What projects did she build with n8n and LangGraph?",
    "Summarize her professional work experience",
    "What are her strongest technical skills?",
    "Generate 5 mock interview questions for Sahithi",
    "Why should recruiters hire Sahithi?"
  ];

  const defaultGreeting = `Welcome to the Dedicated AI Chat Workspace.

I have ingested Sahithi's entire professional history: Projects, Experience, Skills, Certifications, and PDF Resume. 

Feel free to ask complex technical or behavioral questions. I will retrieve context from the vector index and generate precise, factual answers.`;

  useEffect(() => {
    const saved = localStorage.getItem("sahithi_chat_history_full");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        setMessages([]);
      }
    }
  }, []);

  const saveHistory = (newMsgs: Message[]) => {
    setMessages(newMsgs);
    localStorage.setItem("sahithi_chat_history_full", JSON.stringify(newMsgs));
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setError(null);
    const userMsg: Message = {
      id: Math.random().toString(),
      role: "user",
      content: textToSend,
    };

    const updatedMsgs = [...messages, userMsg];
    saveHistory(updatedMsgs);
    setInput("");
    setIsLoading(true);

    const assistantMsgId = Math.random().toString();
    const assistantPlaceholder: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
    };

    setMessages([...updatedMsgs, assistantPlaceholder]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMsgs.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to stream answer from AI service");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No readable stream");

      let currentReply = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        currentReply += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId ? { ...msg, content: currentReply } : msg
          )
        );
      }

      const finalMsgs = [...updatedMsgs, { id: assistantMsgId, role: "assistant" as const, content: currentReply }];
      localStorage.setItem("sahithi_chat_history_full", JSON.stringify(finalMsgs));

    } catch (err: any) {
      console.error(err);
      setError("AI Service is temporarily unavailable. Let's try again.");
      setMessages(updatedMsgs);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm("Clear all active chat logs?")) {
      setMessages([]);
      localStorage.removeItem("sahithi_chat_history_full");
      setError(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-8">
      {/* Left Chat Area */}
      <div className="flex-1 flex flex-col rounded-3xl border border-border bg-[#0F0F15]/15 backdrop-blur-sm overflow-hidden h-full shadow-luxury-light dark:shadow-luxury-dark">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-accent-violet">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-serif font-bold text-foreground tracking-wide">
                Chat Workspace
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-sans font-semibold">
                gpt-4o-mini active
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-red-500 rounded-xl hover:bg-red-500/5 hover:border-red-500/25 border border-transparent transition-all duration-200"
            >
              <Trash2 size={13} />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Scrollable Message History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto space-y-8 py-8">
              <div className="p-6 rounded-2xl border border-border bg-muted/20 space-y-3">
                <div className="flex items-center space-x-2 text-accent-violet">
                  <Cpu size={16} className="animate-bounce" />
                  <span className="text-xs font-semibold uppercase tracking-wider font-sans">Semantic RAG Context Enabled</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {defaultGreeting}
                </p>
              </div>

              {/* Suggestions Grid */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block ml-1 font-sans">
                  Suggested Queries
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {suggestionChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSendMessage(chip)}
                      className="text-xs text-left px-4 py-3 rounded-2xl border border-border text-muted-foreground hover:text-foreground hover:border-accent-violet hover:bg-[#0F0F15]/10 dark:hover:bg-white/[0.01] transition-all duration-200 font-medium"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id || index}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-3xl px-5 py-4 border ${
                        isUser
                          ? "bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border-violet-500/20 text-foreground"
                          : "bg-muted/40 border-border text-foreground"
                      }`}
                    >
                      <div className="relative group/msg">
                        <Markdown content={msg.content || "Generating stream answer..."} />
                        {!isUser && msg.content && (
                          <div className="absolute right-0 top-0 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200 mt-[-8px]">
                            <button
                              onClick={() => copyToClipboard(msg.content)}
                              className="p-1.5 rounded-lg bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors"
                              title="Copy response"
                            >
                              <Copy size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {error && (
            <div className="max-w-3xl mx-auto flex items-center space-x-2 text-red-500 text-xs bg-red-500/5 border border-red-500/20 p-4 rounded-2xl animate-shake">
              <AlertCircle size={15} />
              <span>{error}</span>
              <button
                onClick={() => handleSendMessage(messages[messages.length - 1]?.content || "")}
                className="underline hover:text-red-700 ml-auto flex items-center space-x-1.5"
              >
                <RefreshCw size={12} />
                <span>Retry</span>
              </button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Text Form */}
        <div className="p-4 border-t border-border bg-muted/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="max-w-3xl mx-auto flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query Sahithi's background (e.g., Explain n8n workflow integration)..."
              disabled={isLoading}
              className="flex-1 bg-muted border border-border rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-accent-violet transition-colors text-foreground placeholder:text-muted-foreground/60"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white disabled:opacity-40 disabled:scale-100 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Right Sidebar Status (SaaS-like Workspace Info) */}
      <div className="w-full lg:w-80 space-y-6 shrink-0 h-fit lg:h-full overflow-y-auto no-scrollbar">
        {/* Vector Status */}
        <div className="luxury-card p-6 space-y-4 shadow-luxury-light dark:shadow-luxury-dark bg-[#0F0F15]/10">
          <h2 className="text-sm font-serif font-bold text-foreground flex items-center space-x-2">
            <Cpu size={16} className="text-accent-violet" />
            <span>RAG Vector Indices</span>
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Index Mode:</span>
              <span className="font-semibold text-foreground">SQLite Semantic</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vector Dimension:</span>
              <span className="font-semibold text-foreground">1536 (Ada-002/Large)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Similarity Metric:</span>
              <span className="font-semibold text-foreground">Cosine Product</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Index Refresh:</span>
              <span className="font-semibold text-accent-violet">Auto-On-Save</span>
            </div>
          </div>
        </div>

        {/* Security / System Rules */}
        <div className="luxury-card p-6 space-y-4 shadow-luxury-light dark:shadow-luxury-dark bg-[#0F0F15]/10">
          <h2 className="text-sm font-serif font-bold text-foreground flex items-center space-x-2">
            <ShieldAlert size={16} className="text-amber-500" />
            <span>Safety Parameters</span>
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The assistant utilizes strict system boundary templates preventing replies to queries outside Sahithi's direct credentials list. Guardrails filter prompts attempting jailbreaks.
          </p>
        </div>
      </div>
    </div>
  );
}
