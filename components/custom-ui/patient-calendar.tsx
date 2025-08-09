"use client";

import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PatientEventModal } from "./patient-event-modal";
import { ReminderPopup } from "./reminder-popup";
import { useEventReminders } from "../../hooks/useEventReminders";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

// mock sample
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



interface CalendarViewProps {
  events?: any[];
  loggedEvents?: Record<number, { isLogged: boolean; photo?: string; timestamp?: string }>;
  onLogMedication?: (eventId: number, photo: File) => void;
  onEventClick?: (event: any) => void;
}

export function CalendarView({
  events: eventsProp,
  loggedEvents: loggedEventsProp,
  onLogMedication: onLogMedicationProp,
  onEventClick
}: CalendarViewProps = {}) {
  const [events] = useState(eventsProp || sampleEvents);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loggedEvents, setLoggedEvents] = useState<Record<number, { isLogged: boolean; photo?: string; timestamp?: string }>>(loggedEventsProp || {});

  // Event reminder system
  const {
    activeReminder,
    snoozeReminder,
    markEventComplete,
    dismissReminder,
    completedEvents
  } = useEventReminders({
    events,
    onReminderTriggered: (event) => {
      console.log('Reminder triggered for:', event.title);
    }
  });

  // If using shared state, use the provided props, otherwise use local state
  const effectiveLoggedEvents = loggedEventsProp !== undefined ? loggedEventsProp : loggedEvents;
  const effectiveLogMedication = onLogMedicationProp !== undefined ? onLogMedicationProp : (eventId: number, photo: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const photoUrl = e.target?.result as string;
      setLoggedEvents(prev => ({
        ...prev,
        [eventId]: {
          isLogged: true,
          photo: photoUrl,
          timestamp: new Date().toISOString()
        }
      }));
    };
    reader.readAsDataURL(photo);
  };

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
  //       const res = await axios.get("/api/events");

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

  const handleReminderProceed = () => {
    if (activeReminder) {
      // Snooze for 5 minutes to prevent retriggering while user logs medication
      snoozeReminder(activeReminder.id, 5);
      // Open the patient event modal for proper medication logging
      setSelectedEvent(activeReminder);
      setIsModalOpen(true);
    }
  };

  const handleReminderDismiss = () => {
    if (activeReminder) {
      // Snooze for 5 minutes to prevent immediate retriggering
      snoozeReminder(activeReminder.id, 5);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Calendar</CardTitle>
          <CardDescription>Not missing any meds!</CardDescription>
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
                const isLogged = effectiveLoggedEvents[event.id]?.isLogged && effectiveLoggedEvents[event.id]?.photo;
                const isCompleted = completedEvents.has(event.id);
                if (isLogged || isCompleted) {
                  return { style: { backgroundColor: '#bbf7d0', color: '#166534', borderRadius: 6, border: '1px solid #22c55e' } };
                }
                return {};
              }}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Reminder Popup */}
      <ReminderPopup
        event={activeReminder}
        isOpen={!!activeReminder}
        onClose={handleReminderDismiss}
        onSnooze={(minutes) => snoozeReminder(activeReminder?.id, minutes)}
        onProceed={handleReminderProceed}
      />
      
      {/* Only show modal if not using external event click handler */}
      {!onEventClick && (
        <PatientEventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onLogMedication={effectiveLogMedication}
          isEventLogged={selectedEvent ? effectiveLoggedEvents[selectedEvent.id]?.isLogged || false : false}
          eventPhoto={selectedEvent ? effectiveLoggedEvents[selectedEvent.id]?.photo : undefined}
        />
      )}
    </>
  );
}