"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Layout Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#030303] text-white font-sans min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6 p-8 rounded-3xl border border-white/[0.08] bg-[#0A0A10] text-center shadow-2xl">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 w-fit mx-auto text-amber-400">
            <AlertTriangle size={36} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold">Application Exception</h1>
            <p className="text-sm text-zinc-400">
              A critical layout error occurred. You can retry rendering or reload the page.
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all shadow-lg shadow-violet-600/20"
          >
            <RotateCcw size={16} />
            <span>Reset Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
