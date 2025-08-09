import { CrudTable } from "@/components/custom-ui/crud-table";

const columns = [
  { name: "id", type: "uuid", isPrimary: true },
  { name: "user_id", type: "uuid", required: true, isForeign: true, foreignTable: "users" },
  { name: "license_number", type: "text", required: true },
  { name: "specialization", type: "text" },
  { name: "hospital_affiliation", type: "text" },
  { name: "phone_number", type: "text" },
  { name: "is_active", type: "boolean" },
  { name: "created_at", type: "timestamp" },
  { name: "updated_at", type: "timestamp" }
];

export default function DoctorsPage() {
  return (
    <CrudTable
      tableName="doctors"
      columns={columns}
      title="Doctors Management"
      description="Manage doctor profiles and credentials"
    />
  );
}
