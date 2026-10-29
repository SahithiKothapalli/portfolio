import AdminCRUDPage from "@/components/AdminCRUDPage";

const fields = [
  { key: "title", label: "Project Title", type: "text" as const, placeholder: "e.g. Agentic n8n Router", required: true },
  { key: "summary", label: "One-Line Summary", type: "text" as const, placeholder: "Brief description", required: true },
  { key: "description", label: "Full Description", type: "textarea" as const, placeholder: "Detailed description..." },
  { key: "problem", label: "Problem Statement", type: "textarea" as const, placeholder: "What problem does this solve?" },
  { key: "solution", label: "Solution Approach", type: "textarea" as const, placeholder: "How was it solved?" },
  { key: "architecture", label: "System Architecture", type: "textarea" as const, placeholder: "Technical architecture details..." },
  { key: "techStack", label: "Tech Stack (JSON array or comma-separated)", type: "text" as const, placeholder: '["Next.js", "FastAPI", "Python"]' },
  { key: "challenges", label: "Challenges", type: "textarea" as const, placeholder: "Key challenges faced..." },
  { key: "lessonsLearned", label: "Lessons Learned", type: "textarea" as const, placeholder: "Key takeaways..." },
  { key: "futureImprovements", label: "Future Improvements", type: "textarea" as const, placeholder: "What would you do next?" },
  { key: "imageUrl", label: "Cover Image URL", type: "url" as const, placeholder: "https://..." },
  { key: "demoUrl", label: "Demo URL", type: "url" as const, placeholder: "https://..." },
  { key: "githubUrl", label: "GitHub URL", type: "url" as const, placeholder: "https://github.com/..." },
  { key: "order", label: "Display Order", type: "number" as const, placeholder: "1" },
];

export default function AdminProjectsPage() {
  return (
    <AdminCRUDPage
      title="Projects"
      apiPath="/api/admin/projects"
      fields={fields}
      displayKey="title"
      displaySubKey="summary"
      emptyMessage="No projects yet. Add your first launch case study."
    />
  );
}
