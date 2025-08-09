import { CalendarView } from "@/components/custom-ui/patient-calendar";

export default function PatientDashboard() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Patient Dashboard</h1>
      <p className="text-gray-600 mb-6">Click on any event to log your medication and upload verification photos.</p>
      <CalendarView />
    </main>
  );
}
