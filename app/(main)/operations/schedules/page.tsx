import { CrudTable } from "@/components/custom-ui/crud-table";

const columns = [
  { name: "id", type: "uuid", isPrimary: true },
  { name: "prescriptionid", type: "uuid", required: true, isForeign: true, foreignTable: "prescriptions" },
  { name: "type", type: "text", required: true },
  { name: "title", type: "text", required: true },
  { name: "description", type: "text" },
  { name: "dosage", type: "text" },
  { name: "frequency", type: "text", required: true },
  { name: "startdate", type: "timestamp", required: true },
  { name: "enddate", type: "timestamp", required: true },
  { name: "times", type: "text[]" },
  { name: "followupdate", type: "timestamp" },
  { name: "status", type: "text", required: true },
  { name: "createdat", type: "timestamp" },
  { name: "updatedat", type: "timestamp" }
];

export default function SchedulesPage() {
  return (
    <CrudTable
      tableName="schedules"
      columns={columns}
      title="Schedules Management"
      description="Manage medication and activity schedules"
    />
  );
}
