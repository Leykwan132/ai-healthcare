import { CrudTable } from "@/components/custom-ui/crud-table";

const columns = [
  { name: "id", type: "uuid", isPrimary: true },
  { name: "email", type: "text", required: true },
  { name: "full_name", type: "text" },
  { name: "avatar_url", type: "text" },
  { name: "created_at", type: "timestamp" },
  { name: "updated_at", type: "timestamp" }
];

export default function UsersPage() {
  return (
    <CrudTable
      tableName="users"
      columns={columns}
      title="Users Management"
      description="Manage user accounts and authentication information"
    />
  );
}
