"use client";

import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DoctorEventModal } from "./doctor-event-modal";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

// mock sample
const sampleEvents = [
  {
    id: 1,
    title: "Appointment with Mr Yap",
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



interface CalendarViewProps {
  events?: any[];
  patientLogs?: Record<number, { isLogged: boolean; photo?: string; timestamp?: string }>;
  onEventClick?: (event: any) => void;
}

export function CalendarView({
  events: eventsProp,
  patientLogs: patientLogsProp,
  onEventClick
}: CalendarViewProps = {}) {
  const [events] = useState(eventsProp || sampleEvents);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const effectivePatientLogs = patientLogsProp !== undefined ? patientLogsProp : {};

  const handleSelectEvent = (event: any) => {
    if (onEventClick) {
      onEventClick(event);
    } else {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // const [events, setEvents] = useState<any[]>([]);
  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     try {
  //       const res = await axios.get("/api/fetchCalendarData");

  //       const parsed = res.data.map((event: any) => ({
  //         ...event,
  //         start: new Date(event.start),
  //         end: new Date(event.end),
  //       }));

  //       setEvents(parsed);
  //     } catch (err) {
  //       console.error("Failed to fetch events", err);
  //     }
  //   };

  //   fetchEvents();
  // }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Calendar</CardTitle>
          <CardDescription>Manage patients' schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleSelectEvent}
              style={{ height: "100%" }}
              eventPropGetter={(event) => {
                const isLogged = effectivePatientLogs[event.id]?.isLogged && effectivePatientLogs[event.id]?.photo;
                return isLogged
                  ? { style: { backgroundColor: '#bbf7d0', color: '#166534', borderRadius: 6, border: '1px solid #22c55e' } }
                  : {};
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Only show modal if not using external event click handler */}
      {!onEventClick && (
        <DoctorEventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          patientLogs={effectivePatientLogs}
        />
      )}
    </>
  );
}