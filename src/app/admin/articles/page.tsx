import AdminCRUDPage from "@/components/AdminCRUDPage";

const fields = [
  { key: "title", label: "Article Title", type: "text" as const, required: true, placeholder: "e.g. Building Multi-Agent Loops" },
  { key: "slug", label: "URL Slug", type: "text" as const, required: true, placeholder: "e.g. multi-agent-loops" },
  { key: "summary", label: "Summary", type: "textarea" as const, placeholder: "Brief summary for preview cards..." },
  { key: "content", label: "Full Content (Markdown supported)", type: "textarea" as const, placeholder: "Write your full article in Markdown..." },
  { key: "imageUrl", label: "Cover Image URL", type: "url" as const, placeholder: "https://..." },
  { key: "tags", label: "Tags (comma-separated)", type: "text" as const, placeholder: "AI, RAG, LangChain" },
  { key: "date", label: "Publication Date", type: "text" as const, placeholder: "YYYY-MM-DD" },
  { key: "readingTime", label: "Reading Time", type: "text" as const, placeholder: "5 min read" },
  { key: "order", label: "Display Order", type: "number" as const, placeholder: "1" },
];

export default function AdminArticlesPage() {
  return (
    <AdminCRUDPage
      title="Articles"
      apiPath="/api/admin/articles"
      fields={fields}
      displayKey="title"
      displaySubKey="date"
      emptyMessage="No articles published. Write your first engineering log."
    />
  );
}
