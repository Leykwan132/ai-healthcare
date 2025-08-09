import { CrudTable } from "@/components/custom-ui/crud-table";

const columns = [
  { name: "id", type: "uuid", isPrimary: true },
  { name: "user_id", type: "uuid", required: true, isForeign: true, foreignTable: "users" },
  { name: "type", type: "text", required: true },
  { name: "title", type: "text", required: true },
  { name: "message", type: "text", required: true },
  { name: "is_read", type: "boolean" },
  { name: "metadata", type: "jsonb" },
  { name: "created_at", type: "timestamp" }
];

export default function NotificationsPage() {
  return (
    <CrudTable
      tableName="notifications"
      columns={columns}
      title="Notifications Management"
      description="Manage patient notifications and alerts"
    />
  );
}
