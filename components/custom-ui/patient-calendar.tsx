"use client";

import { useEffect, useState, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { createClient } from "@/lib/supabase/client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PatientEventModal } from "./patient-event-modal";
import { ReminderPopup } from "./reminder-popup";
import { useEventReminders } from "../../hooks/useEventReminders";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);



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
  const [events, setEvents] = useState<any[]>(eventsProp || []);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loggedEvents, setLoggedEvents] = useState<Record<number, { isLogged: boolean; photo?: string; timestamp?: string }>>(loggedEventsProp || {});
  const supabase = createClient();

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

  // Load schedule data from database for the logged-in patient
  const fetchScheduleData = useCallback(async () => {
    if (eventsProp && eventsProp.length > 0) {
      // If events are provided as props, use them
      setEvents(eventsProp);
      return;
    }

    setLoading(true);
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch patient's schedules from the database
      const { data: schedulesData, error: schedulesError } = await supabase
        .from('schedules')
        .select(`
          *,
          prescriptions (
            originalinstructions,
            patientid,
            doctorid
          )
        `)
        .eq('status', 'active')
        .eq('prescriptions.patientid', user.id) // Only get schedules for the logged-in patient
        .order('startdate', { ascending: true });

      if (schedulesError) {
        console.error('Error fetching schedules:', schedulesError);
        setEvents([]);
        return;
      }

      // Transform schedule data into calendar events
      const calendarEvents = schedulesData?.map((schedule: any) => {
        const startDate = new Date(schedule.startdate);
        const endDate = new Date(schedule.enddate);

        return {
          id: schedule.id,
          title: schedule.title,
          description: schedule.description,
          start: startDate,
          end: endDate,
          type: schedule.type,
          dosage: schedule.dosage,
          frequency: schedule.frequency,
          times: schedule.times,
          prescription: schedule.prescriptions?.originalinstructions,
          metadata: {
            prescriptionId: schedule.prescriptionid,
            patientId: schedule.prescriptions?.patientid,
            doctorId: schedule.prescriptions?.doctorid,
            scheduleType: schedule.type
          }
        };
      }) || [];

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error loading schedule data:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [eventsProp, supabase]);

  // Initial data fetch
  useEffect(() => {
    fetchScheduleData();
  }, [fetchScheduleData]);

  // Listen for treatment plan saved events to refresh calendar
  useEffect(() => {
    const handleTreatmentPlanSaved = (event: CustomEvent) => {
      console.log('Treatment plan saved, refreshing calendar...', event.detail);
      // Add a slight delay to ensure data is saved in the database
      setTimeout(() => {
        fetchScheduleData();
      }, 1000);
    };

    window.addEventListener('treatmentPlanSaved', handleTreatmentPlanSaved as EventListener);

    return () => {
      window.removeEventListener('treatmentPlanSaved', handleTreatmentPlanSaved as EventListener);
    };
  }, [fetchScheduleData]);

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
          <CardTitle className="text-2xl">My Schedule</CardTitle>
          <CardDescription>Your medication and appointment schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-muted-foreground">Loading schedule...</span>
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-lg font-medium mb-2">No schedules found</p>
                <p className="text-sm text-center max-w-md">
                  You don't have any scheduled medications or appointments yet.
                </p>
              </div>
            ) : (
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
                  let backgroundColor = '#3b82f6'; // Default blue

                  // Color code by event type
                  if (event.type === 'medication') {
                    backgroundColor = isLogged || isCompleted ? '#22c55e' : '#3b82f6'; // Green if logged/completed, blue otherwise
                  } else if (event.type === 'activity') {
                    backgroundColor = isLogged || isCompleted ? '#22c55e' : '#10b981'; // Green if logged/completed, emerald otherwise
                  } else if (event.type === 'followup') {
                    backgroundColor = isLogged || isCompleted ? '#22c55e' : '#8b5cf6'; // Green if logged/completed, purple otherwise
                  } else {
                    // For backward compatibility with any existing events
                    backgroundColor = isLogged || isCompleted ? '#22c55e' : '#3b82f6';
                  }

                  return {
                    style: {
                      backgroundColor,
                      color: 'white',
                      borderRadius: 6,
                      border: isLogged || isCompleted ? '2px solid #22c55e' : 'none'
                    }
                  };
                }}
              />
            )}
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