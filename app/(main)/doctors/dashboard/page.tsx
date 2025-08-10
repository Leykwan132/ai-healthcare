import { CalendarView } from "@/components/custom-ui/doctor-calendar";
import { UnifiedPatientWorkflow } from "@/components/custom-ui/unified-patient-workflow";

export default function DoctorDashboard() {
  return (
    <main className="p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
          <p className="text-gray-600">
            Manage patient care with our streamlined workflow for prescriptions and scheduling.
          </p>
        </div>

        {/* Unified Patient Care Workflow */}
        <div className="mb-8">
          <UnifiedPatientWorkflow />
        </div>

        {/* Appointments Calendar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Appointments & Schedule</h2>
            <p className="text-sm text-gray-600 mt-1">
              View and manage patient appointments. Click on any appointment to view medication logs and verification photos.
            </p>
          </div>
          <div className="p-6">
            <CalendarView />
          </div>
        </div>
      </div>
    </main>
  );
}
