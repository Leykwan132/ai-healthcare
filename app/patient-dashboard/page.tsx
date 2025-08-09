"use client";

import { CalendarView } from "@/components/custom-ui/patient-calendar";

// Create events with some happening soon for demo purposes
const demoEvents = [
  {
    id: 1,
    title: "Morning Medication",
    description: "Take blood pressure medication",
    start: new Date(Date.now() + 30000), // 30 seconds from now
    end: new Date(Date.now() + 90000),
    medication: "Lisinopril",
    dosage: "10mg",
  },
  {
    id: 2,
    title: "Doctor Appointment Reminder",
    description: "Prepare for appointment with Dr. Smith",
    start: new Date(Date.now() + 120000), // 2 minutes from now
    end: new Date(Date.now() + 180000),
    prescription: "Follow-up consultation",
  },
  {
    id: 3,
    title: "Evening Medication",
    description: "Take vitamins and supplements",
    start: new Date(Date.now() + 300000), // 5 minutes from now
    end: new Date(Date.now() + 360000),
    medication: "Vitamin D",
    dosage: "1000 IU",
  }
];

export default function PatientDashboard() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Patient Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Click on any event to log your medication and upload verification photos.
        <br />
        <span className="text-sm text-blue-600">
          Demo: Events will trigger reminders at their scheduled times (30s, 2min, 5min from now)
        </span>
      </p>
      <CalendarView events={demoEvents} />
    </main>
  );
}
