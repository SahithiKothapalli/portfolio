import AdminCRUDPage from "@/components/AdminCRUDPage";

const fields = [
  { key: "company", label: "Company Name", type: "text" as const, required: true, placeholder: "e.g. OmniAI Solutions" },
  { key: "role", label: "Role / Title", type: "text" as const, required: true, placeholder: "e.g. Staff AI Engineer" },
  { key: "duration", label: "Duration", type: "text" as const, placeholder: "e.g. 2024 - Present" },
  { key: "achievements", label: "Achievements (JSON array or multi-line)", type: "textarea" as const, placeholder: '["Built RAG system...", "Reduced latency by 60%..."]' },
  { key: "technologies", label: "Technologies Used (JSON array or comma-separated)", type: "text" as const, placeholder: '["Python", "LangGraph", "FastAPI"]' },
  { key: "order", label: "Display Order", type: "number" as const, placeholder: "1" },
];

export default function AdminExperiencePage() {
  return (
    <AdminCRUDPage
      title="Experiences"
      apiPath="/api/admin/experience"
      fields={fields}
      displayKey="role"
      displaySubKey="company"
      emptyMessage="No experience records yet. Add your professional history."
    />
  );
}
