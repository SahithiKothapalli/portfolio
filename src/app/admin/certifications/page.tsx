import AdminCRUDPage from "@/components/AdminCRUDPage";

const fields = [
  { key: "name", label: "Certification Name", type: "text" as const, required: true, placeholder: "e.g. AWS Certified Machine Learning Specialty" },
  { key: "issuer", label: "Issuing Organization", type: "text" as const, required: true, placeholder: "e.g. Amazon Web Services, DeepLearning.AI" },
  { key: "date", label: "Date Issued", type: "text" as const, required: true, placeholder: "e.g. Nov 2024" },
  { key: "credentialUrl", label: "Credential Link (URL)", type: "url" as const, placeholder: "https://credential-url.com" },
  { key: "order", label: "Display Order", type: "number" as const, placeholder: "1" },
];

export default function AdminCertificationsPage() {
  return (
    <AdminCRUDPage
      title="Certifications & Badges"
      apiPath="/api/admin/certifications"
      fields={fields}
      displayKey="name"
      displaySubKey="issuer"
      emptyMessage="No certificates added yet."
    />
  );
}
