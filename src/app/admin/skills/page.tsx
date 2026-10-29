import AdminCRUDPage from "@/components/AdminCRUDPage";

const fields = [
  { key: "name", label: "Skill Name", type: "text" as const, required: true, placeholder: "e.g. RAG Systems" },
  { key: "category", label: "Category", type: "text" as const, placeholder: "e.g. AI, Languages, DevOps" },
  { key: "description", label: "Description", type: "textarea" as const, placeholder: "Brief skill description..." },
  { key: "yearsOfExperience", label: "Years of Experience", type: "number" as const, placeholder: "3.5" },
  { key: "order", label: "Display Order", type: "number" as const, placeholder: "1" },
];

export default function AdminSkillsPage() {
  return (
    <AdminCRUDPage
      title="Skills"
      apiPath="/api/admin/skills"
      fields={fields}
      displayKey="name"
      displaySubKey="category"
      emptyMessage="No skills defined. Add your tech competencies."
    />
  );
}
