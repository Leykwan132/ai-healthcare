import { CrudTable } from "@/components/custom-ui/crud-table";

const columns = [
  { name: "id", type: "uuid", isPrimary: true },
  { name: "conversation_id", type: "uuid", required: true, isForeign: true, foreignTable: "conversations" },
  { name: "sender_id", type: "uuid", required: true },
  { name: "sender_type", type: "text", required: true },
  { name: "content", type: "text", required: true },
  { name: "metadata", type: "jsonb" },
  { name: "created_at", type: "timestamp" }
];

export default function ConversationMessagesPage() {
  return (
    <CrudTable
      tableName="conversation_messages"
      columns={columns}
      title="Conversation Messages Management"
      description="Manage individual messages within conversations"
    />
  );
}
