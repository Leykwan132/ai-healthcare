import { CrudTable } from "@/components/custom-ui/crud-table";

const columns = [
  { name: "id", type: "uuid", isPrimary: true },
  { name: "user_id", type: "uuid", required: true, isForeign: true, foreignTable: "users" },
  { name: "date_of_birth", type: "date" },
  { name: "gender", type: "text" },
  { name: "phone_number", type: "text" },
  { name: "emergency_contact", type: "text" },
  { name: "medical_history", type: "jsonb" },
  { name: "allergies", type: "jsonb" },
  { name: "is_active", type: "boolean" },
  { name: "created_at", type: "timestamp" },
  { name: "updated_at", type: "timestamp" }
];

export default function PatientsPage() {
  return (
    <CrudTable
      tableName="patients"
      columns={columns}
      title="Patients Management"
      description="Manage patient profiles and medical information"
    />
  );
}
