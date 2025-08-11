import { CalendarView } from "@/components/custom-ui/doctor-calendar";
import { UnifiedPatientWorkflow } from "@/components/custom-ui/unified-patient-workflow";

export default function DoctorDashboard() {
  return (
    <main className="p-4 pt-24 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Doctor Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage patient care with our streamlined workflow for prescriptions and scheduling.
          </p>
        </div>

        {/* Unified Patient Care Workflow */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6">
              <UnifiedPatientWorkflow />
            </div>
          </div>
        </div>

        {/* Appointments Calendar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Appointments & Schedule
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              View and manage patient appointments. Click on any appointment to view medication logs and verification photos.
            </p>
          </div>
          <div className="p-4 sm:p-6">
            <CalendarView />
          </div>
        </div>
      </div>
    </main>
  );
}