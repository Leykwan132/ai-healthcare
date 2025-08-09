import { CrudTable } from "@/components/custom-ui/crud-table";

const columns = [
  { name: "id", type: "uuid", isPrimary: true },
  { name: "created_at", type: "timestamp" },
  { name: "content", type: "json" },
  { name: "doctorid", type: "uuid", isForeign: true, foreignTable: "doctors" },
  { name: "isreviewed", type: "boolean" }
];

export default function ReviewDocumentsPage() {
  return (
    <CrudTable
      tableName="reviewdocuments"
      columns={columns}
      title="Review Documents Management"
      description="Manage medical documents for review"
    />
  );
}
