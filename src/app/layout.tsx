import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import MouseGlow from "@/components/MouseGlow";
import LayoutContent from "./LayoutContent"; // Client wrapper for interactivity

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: ["400"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Meet Sahithi | Staff AI Engineer & RAG Architect",
  description: "An AI-powered interactive resume and database-driven CMS portfolio showcasing production-grade AI systems, multi-agent workflows, and advanced vector pipelines.",
  keywords: ["Sahithi", "AI Engineer", "RAG Systems", "LangChain", "LangGraph", "n8n Automation", "FastAPI", "Next.js"],
  authors: [{ name: "Sahithi" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${outfit.variable} ${instrumentSerif.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <MouseGlow />
          <LayoutContent>{children}</LayoutContent>
        </ThemeProvider>
      </body>
    </html>
  );
}
