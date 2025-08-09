import { CrudTable } from "@/components/custom-ui/crud-table";

const columns = [
  { name: "id", type: "uuid", isPrimary: true },
  { name: "patientid", type: "uuid", required: true, isForeign: true, foreignTable: "patients" },
  { name: "doctorid", type: "uuid", required: true, isForeign: true, foreignTable: "doctors" },
  { name: "conversationid", type: "uuid", isForeign: true, foreignTable: "conversations" },
  { name: "originalinstructions", type: "text", required: true },
  { name: "language", type: "text", required: true },
  { name: "status", type: "text", required: true },
  { name: "createdat", type: "timestamp" },
  { name: "updatedat", type: "timestamp" }
];

export default function PrescriptionsPage() {
  return (
    <CrudTable
      tableName="prescriptions"
      columns={columns}
      title="Prescriptions Management"
      description="Manage medical prescriptions and instructions"
    />
  );
}
