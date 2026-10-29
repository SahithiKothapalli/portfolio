"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Route Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6 p-8 rounded-3xl border border-white/[0.08] bg-[#0A0A10] shadow-2xl">
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 w-fit mx-auto text-red-400">
          <AlertCircle size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-foreground">Something went wrong</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            An unexpected error occurred while loading this page section.
          </p>
          {error?.message && (
            <p className="text-xs font-mono text-red-300/80 bg-red-950/30 p-2 rounded-lg border border-red-500/20 max-h-24 overflow-y-auto">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-600/20"
          >
            <RotateCcw size={15} />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-muted-foreground hover:text-foreground text-sm font-semibold transition-all"
          >
            <Home size={15} />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
