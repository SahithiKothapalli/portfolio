import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_SECTIONS = [
  { key: "hero", label: "Hero", isVisible: true, order: 1 },
  { key: "whoami", label: "AI × whoami", isVisible: true, order: 2 },
  { key: "skills", label: "Skills", isVisible: true, order: 3 },
  { key: "projects", label: "Projects", isVisible: true, order: 4 },
  { key: "experience", label: "Experience", isVisible: true, order: 5 },
  { key: "education", label: "Education", isVisible: true, order: 6 },
  { key: "certifications", label: "Certifications", isVisible: true, order: 7 },
  { key: "articles", label: "Articles", isVisible: true, order: 8 },
  { key: "contact", label: "Contact", isVisible: true, order: 9 },
];

export async function GET() {
  try {
    const sections = await prisma.sectionConfig.findMany({ orderBy: { order: "asc" } });
    if (!sections || !sections.length) {
      return NextResponse.json(DEFAULT_SECTIONS);
    }
    return NextResponse.json(sections);
  } catch {
    return NextResponse.json(DEFAULT_SECTIONS);
  }
}
