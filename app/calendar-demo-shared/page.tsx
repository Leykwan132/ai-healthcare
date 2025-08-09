"use client";

import { useState } from "react";
import { CalendarView as PatientCalendar } from "../../components/custom-ui/patient-calendar";
import { CalendarView as DoctorCalendar } from "../../components/custom-ui/doctor-calendar";
// import { DoctorEventModal } from "@/components/custom-ui/doctor-event-modal";
import { DoctorEventModal } from "../../components/custom-ui/doctor-event-modal";
import { PatientEventModal } from "../../components/custom-ui/patient-event-modal";

// Sample events (should match those in the calendar components)
const sampleEvents = [
  {
    id: 1,
    title: "Doctor Appointment",
    description: "Discuss prescription and health progress.",
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000),
    prescription: "Amoxicillin",
    timesPerDay: 3,
  },
  {
    id: 2,
    title: "Medication Reminder",
    description: "Take blood pressure pills",
    start: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
    end: new Date(new Date().getTime() + 3 * 60 * 60 * 1000),
    medication: "Lisinopril",
    dosage: "10mg",
  },
];

export default function CalendarDemoShared() {
  // Shared event log state
  const [loggedEvents, setLoggedEvents] = useState<Record<number, { isLogged: boolean; photo?: string; timestamp?: string }>>({});

  // Patient modal state
  const [patientModal, setPatientModal] = useState<{ open: boolean; event: any | null }>({ open: false, event: null });
  // Doctor modal state
  const [doctorModal, setDoctorModal] = useState<{ open: boolean; event: any | null }>({ open: false, event: null });

  // Patient event click
  const handlePatientEventClick = (event: any) => {
    setPatientModal({ open: true, event });
  };
  // Doctor event click
  const handleDoctorEventClick = (event: any) => {
    setDoctorModal({ open: true, event });
  };

  // Log medication for patient
  const handleLogMedication = (eventId: number, photo: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const photoUrl = e.target?.result as string;
      setLoggedEvents((prev) => ({
        ...prev,
        [eventId]: {
          isLogged: true,
          photo: photoUrl,
          timestamp: new Date().toISOString(),
        },
      }));
    };
    reader.readAsDataURL(photo);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8">
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-2">Patient Calendar</h2>
        <PatientCalendar
          events={sampleEvents}
          loggedEvents={loggedEvents}
          onEventClick={handlePatientEventClick}
        />
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-2">Doctor Calendar</h2>
        <DoctorCalendar
          events={sampleEvents}
          patientLogs={loggedEvents}
          onEventClick={handleDoctorEventClick}
        />
      </div>

      {/* Patient Modal */}
      <PatientEventModal
        event={patientModal.event}
        isOpen={patientModal.open}
        onClose={() => setPatientModal({ open: false, event: null })}
        onLogMedication={handleLogMedication}
        isEventLogged={patientModal.event ? loggedEvents[patientModal.event.id]?.isLogged || false : false}
        eventPhoto={patientModal.event ? loggedEvents[patientModal.event.id]?.photo : undefined}
      />
      {/* Doctor Modal */}
      <DoctorEventModal
        event={doctorModal.event}
        isOpen={doctorModal.open}
        onClose={() => setDoctorModal({ open: false, event: null })}
        patientLogs={loggedEvents}
      />
    </div>
  );
}
