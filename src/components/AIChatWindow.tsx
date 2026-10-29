"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, Trash2, Sparkles, Copy, RefreshCw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "./Markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

export default function AIChatWindow({ 
  isOpen, 
  onClose,
  initialQuery = "",
  onClearInitialQuery
}: AIChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const suggestionChips = [
    "👋 Get to know Sahithi",
    "📄 Summarize her profile",
    "🚀 Explore her projects",
    "💼 Walk me through her experience",
    "🧠 What technologies does she work with?",
    "🎯 Why is Sahithi a strong candidate?"
  ];

  const defaultGreeting = `This conversation begins with you.

Your curiosity shapes the journey. Explore the experiences, projects, and ideas that define Sahithi's story.

I know everything about Sahithi's experience, projects, skills, certifications, education, and portfolio. Ask me anything.`;

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sahithi_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        setMessages([]);
      }
    }
  }, []);

  // Save chat history to localStorage
  const saveHistory = (newMsgs: Message[]) => {
    setMessages(newMsgs);
    localStorage.setItem("sahithi_chat_history", JSON.stringify(newMsgs));
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle incoming initial queries (e.g. from case studies links)
  useEffect(() => {
    if (isOpen && initialQuery && initialQuery.trim() !== "") {
      handleSendMessage(initialQuery);
      if (onClearInitialQuery) {
        onClearInitialQuery();
      }
    }
  }, [isOpen, initialQuery]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setError(null);
    const userMsg: Message = {
      id: Math.random().toString(),
      role: "user",
      content: textToSend,
    };

    // Grab current fresh messages from local storage to prevent racing multiple queries
    let currentSaved: Message[] = [];
    const saved = localStorage.getItem("sahithi_chat_history");
    if (saved) {
      try {
        currentSaved = JSON.parse(saved);
      } catch {
        currentSaved = [];
      }
    }

    const updatedMsgs = [...currentSaved, userMsg];
    saveHistory(updatedMsgs);
    setInput("");
    setIsLoading(true);

    // Initial assistant message placeholder for streaming
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
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No readable stream response");

      let currentReply = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        currentReply += chunk;

        // Stream update state directly
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId ? { ...msg, content: currentReply } : msg
          )
        );
      }

      // Save final message state to local storage
      const finalMsgs = [...updatedMsgs, { id: assistantMsgId, role: "assistant" as const, content: currentReply }];
      localStorage.setItem("sahithi_chat_history", JSON.stringify(finalMsgs));

    } catch (err: any) {
      console.error(err);
      setError("AI Service is temporarily unavailable. Let's try again.");
      setMessages(updatedMsgs);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear this chat conversation history?")) {
      setMessages([]);
      localStorage.removeItem("sahithi_chat_history");
      setError(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Response copied to clipboard!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 250 }}
          className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[440px] h-[600px] rounded-2xl glass-panel shadow-luxury-dark flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-white/20 dark:bg-[#030303]/20">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-accent-violet animate-pulse" />
              <span className="font-serif font-semibold text-foreground text-sm tracking-wide">
                Sahithi Assistant
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {messages.length > 0 && (
                <button
                  onClick={handleClearChat}
                  className="p-2 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors"
                  title="Clear chat"
                >
                  <Trash2 size={15} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.length === 0 ? (
              <div className="space-y-6 my-4">
                {/* Greeting Card */}
                <div className="p-4 rounded-xl border border-border bg-muted/30">
                  <div className="flex items-center space-x-2 text-accent-violet mb-2">
                    <Sparkles size={16} className="animate-bounce" />
                    <span className="text-xs font-semibold tracking-wider uppercase font-sans">
                      Start Exploring
                    </span>
                  </div>
                  <Markdown content={defaultGreeting} />
                </div>

                {/* Suggestions list */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block ml-1">
                    Suggested Questions
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestionChips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleSendMessage(chip.slice(2))}
                        className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-accent-violet hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all duration-300 font-medium text-left"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id || index}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 border ${
                        isUser
                          ? "bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border-violet-500/20 text-foreground"
                          : "bg-muted/40 border-border text-foreground"
                      }`}
                    >
                      <div className="relative group/msg">
                        <Markdown content={msg.content || "Thinking..."} />
                        
                        {!isUser && msg.content && (
                          <div className="absolute right-0 top-0 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200 flex items-center space-x-1 mt-[-6px]">
                            <button
                              onClick={() => copyToClipboard(msg.content)}
                              className="p-1 rounded bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors"
                              title="Copy response"
                            >
                              <Copy size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-500 text-xs bg-red-500/5 border border-red-500/20 p-3 rounded-xl animate-shake">
                <AlertCircle size={14} />
                <span>{error}</span>
                <button
                  onClick={() => handleSendMessage(messages[messages.length - 1]?.content || "")}
                  className="underline hover:text-red-700 ml-auto flex items-center space-x-1"
                >
                  <RefreshCw size={11} />
                  <span>Retry</span>
                </button>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="p-3 border-t border-border bg-white/20 dark:bg-[#030303]/20 flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Sahithi..."
              disabled={isLoading}
              className="flex-1 bg-muted border border-border/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-violet transition-colors text-foreground placeholder:text-muted-foreground/60"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white disabled:opacity-40 disabled:scale-100 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Send size={15} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
