import AdminCRUDPage from "@/components/AdminCRUDPage";

const fields = [
  { key: "institution", label: "Institution / University", type: "text" as const, required: true, placeholder: "e.g. Stanford University or IIIT" },
  { key: "degree", label: "Degree / Program", type: "text" as const, required: true, placeholder: "e.g. B.Tech in Computer Science & AI" },
  { key: "duration", label: "Duration", type: "text" as const, required: true, placeholder: "e.g. 2021 - 2025" },
  { key: "achievements", label: "Achievements & Highlights (1 bullet per line)", type: "textarea" as const, placeholder: "Academic Excellence: 8.75 CGPA\nCouncil Member of Computer Science Association\nHosted national hackathon..." },
  { key: "caption", label: "Footer Caption / Fun Reaction Badge", type: "text" as const, placeholder: "e.g. Survived 8 AM compiler lectures / Built 12 side-projects instead of studying" },
  { key: "order", label: "Display Order", type: "number" as const, placeholder: "1" },
];

export default function AdminEducationPage() {
  return (
    <AdminCRUDPage
      title="Education Records"
      apiPath="/api/admin/education"
      fields={fields}
      displayKey="degree"
      displaySubKey="institution"
      emptyMessage="No education records created yet."
    />
  );
}
