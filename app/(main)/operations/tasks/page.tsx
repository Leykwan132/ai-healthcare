import { CrudTable } from "@/components/custom-ui/crud-table";

const columns = [
  { name: "id", type: "bigint", isPrimary: true },
  { name: "created_at", type: "timestamp" },
  { name: "frequency", type: "smallint" },
  { name: "patientid", type: "uuid", isForeign: true, foreignTable: "patients" },
  { name: "medication", type: "text" },
  { name: "iscompleted", type: "boolean" }
];

export default function TasksPage() {
  return (
    <CrudTable
      tableName="tasks"
      columns={columns}
      title="Tasks Management"
      description="Manage patient tasks and medication reminders"
    />
  );
}
