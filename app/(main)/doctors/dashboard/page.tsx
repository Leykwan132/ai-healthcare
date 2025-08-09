import { CalendarView } from "@/components/custom-ui/doctor-calendar";

export default function DoctorDashboard() {
  return (
    <main className="p-8 pt-24">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Click on any appointment to view patient medication logs and verification photos.
      </p>
      <CalendarView />
    </main>
  );
}