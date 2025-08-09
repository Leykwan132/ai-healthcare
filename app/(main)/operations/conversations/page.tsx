import { CrudTable } from "@/components/custom-ui/crud-table";

const columns = [
  { name: "id", type: "uuid", isPrimary: true },
  { name: "patient_id", type: "uuid", required: true, isForeign: true, foreignTable: "patients" },
  { name: "doctor_id", type: "uuid", required: true, isForeign: true, foreignTable: "doctors" },
  { name: "status", type: "text", required: true },
  { name: "context", type: "jsonb" },
  { name: "created_by", type: "text", required: true },
  { name: "created_at", type: "timestamp" },
  { name: "updated_at", type: "timestamp" }
];

export default function ConversationsPage() {
  return (
    <CrudTable
      tableName="conversations"
      columns={columns}
      title="Conversations Management"
      description="Manage doctor-patient conversations and chat history"
    />
  );
}
