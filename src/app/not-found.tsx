import React from "react";
import Link from "next/link";
import { HelpCircle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6 p-8 rounded-3xl border border-white/[0.08] bg-[#0A0A10] shadow-2xl">
        <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 w-fit mx-auto text-violet-400">
          <HelpCircle size={36} />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black font-mono text-violet-400 block">404</span>
          <h1 className="text-2xl font-serif font-bold text-foreground">Page Not Found</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The requested page or portfolio endpoint could not be found or has been re-indexed.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all shadow-lg shadow-violet-600/20"
          >
            <Home size={16} />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
