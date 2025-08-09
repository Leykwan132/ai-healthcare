import { CalendarView } from "@/components/custom-ui/doctor-calendar";
import PatientFilterSearch from "@/components/custom-ui/patient-filter-search";
import PrescriptionSelector from "@/components/custom-ui/prescription-selector";
import { PromptChatBox } from "@/components/custom-ui/prompt-chat-box";

export default function DoctorDashboard() {
  return (
    <main className="p-8 pt-24">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Click on any appointment to view patient medication logs and verification photos.
      </p>

      <div className="mb-8">
        <PatientFilterSearch />
      </div>

      <div className="mb-8">
        <PrescriptionSelector />
      </div>

      <div className="mb-8">
        <PromptChatBox />
      </div>

      <CalendarView />
    </main>
  );
}