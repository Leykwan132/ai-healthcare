import { CrudTable } from "@/components/custom-ui/crud-table";

const columns = [
  { name: "id", type: "uuid", isPrimary: true },
  { name: "prescriptionid", type: "uuid", required: true, isForeign: true, foreignTable: "prescriptions" },
  { name: "medications", type: "jsonb" },
  { name: "activities", type: "jsonb" },
  { name: "followupdate", type: "timestamp" },
  { name: "notes", type: "text" },
  { name: "createdat", type: "timestamp" },
  { name: "updatedat", type: "timestamp" }
];

export default function ParsedInstructionsPage() {
  return (
    <CrudTable
      tableName="parsedinstructions"
      columns={columns}
      title="Parsed Instructions Management"
      description="Manage AI-parsed instruction data"
    />
  );
}
