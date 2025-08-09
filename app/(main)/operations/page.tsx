import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tables = [
  {
    name: "Users",
    description: "User authentication and basic user information",
    href: "/operations/users",
    fields: ["id", "email", "full_name", "avatar_url", "created_at", "updated_at"]
  },
  {
    name: "Doctors",
    description: "Doctor-specific information and credentials",
    href: "/operations/doctors",
    fields: ["id", "user_id", "license_number", "specialization", "hospital_affiliation", "phone_number", "is_active"]
  },
  {
    name: "Patients",
    description: "Patient-specific information and medical history",
    href: "/operations/patients",
    fields: ["id", "user_id", "date_of_birth", "gender", "phone_number", "emergency_contact", "medical_history", "allergies"]
  },
  {
    name: "Conversations",
    description: "Doctor-patient conversations and chat history",
    href: "/operations/conversations",
    fields: ["id", "patient_id", "doctor_id", "status", "context", "created_by"]
  },
  {
    name: "Conversation Messages",
    description: "Individual messages within conversations",
    href: "/operations/conversation-messages",
    fields: ["id", "conversation_id", "sender_id", "sender_type", "content", "metadata"]
  },
  {
    name: "Notifications",
    description: "Patient notifications and alerts",
    href: "/operations/notifications",
    fields: ["id", "user_id", "type", "title", "message", "is_read", "metadata"]
  },
  {
    name: "Prescriptions",
    description: "Medical prescriptions and instructions",
    href: "/operations/prescriptions",
    fields: ["id", "patientId", "doctorId", "conversationId", "originalInstructions", "language", "status"]
  },
  {
    name: "Schedules",
    description: "Medication and activity schedules",
    href: "/operations/schedules",
    fields: ["id", "prescriptionId", "type", "title", "description", "dosage", "frequency", "startDate", "endDate"]
  },
  {
    name: "Parsed Instructions",
    description: "AI-parsed instruction data",
    href: "/operations/parsed-instructions",
    fields: ["id", "prescriptionId", "medications", "activities", "followUpDate", "notes"]
  },
  {
    name: "Review Documents",
    description: "Medical documents for review",
    href: "/operations/review-documents",
    fields: ["id", "content", "doctorId", "isReviewed"]
  },
  {
    name: "Tasks",
    description: "Patient tasks and medication reminders",
    href: "/operations/tasks",
    fields: ["id", "frequency", "patientId", "medication", "isCompleted"]
  }
];

export default function OperationsPage() {
  return (
    <main className="p-8 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Database Operations</h1>
        <p className="text-gray-600">
          Manage all database tables with full CRUD operations. Select a table below to view, create, update, or delete records.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <Card key={table.name} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {table.name}
                <Link 
                  href={table.href}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Manage
                </Link>
              </CardTitle>
              <CardDescription>{table.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                <strong>Key Fields:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {table.fields.slice(0, 4).map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                  {table.fields.length > 4 && (
                    <li className="text-gray-400">... and {table.fields.length - 4} more</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
