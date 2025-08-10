"use client";

import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import { createClient } from "@/lib/supabase/client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DoctorEventModal } from "./doctor-event-modal";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);



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
  const [events, setEvents] = useState<any[]>(eventsProp || []);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const effectivePatientLogs = patientLogsProp !== undefined ? patientLogsProp : {};
  const supabase = createClient();

  // Load real schedule data from database
  const fetchScheduleData = async () => {
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

      // Fetch schedules from the database
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
        .order('startdate', { ascending: true });

      if (schedulesError) {
        console.error('Error fetching schedules:', schedulesError);
        setEvents([]);
        return;
      }

      // Transform schedule data into calendar events
      const calendarEvents = schedulesData?.map((schedule) => {
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
  };

  useEffect(() => {
    fetchScheduleData();
  }, [eventsProp, supabase]);

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
  }, []);

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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Calendar</CardTitle>
          <CardDescription>Manage patients' schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-muted-foreground">Loading appointments...</span>
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-lg font-medium mb-2">No appointments or schedules found</p>
                <p className="text-sm text-center max-w-md">
                  Create prescription schedules using the Patient Care Workflow above to see them appear here.
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
                  const isLogged = effectivePatientLogs[event.id]?.isLogged && effectivePatientLogs[event.id]?.photo;
                  let backgroundColor = '#3b82f6'; // Default blue
                  
                  // Color code by event type
                  if (event.type === 'medication') {
                    backgroundColor = isLogged ? '#22c55e' : '#3b82f6'; // Green if logged, blue otherwise
                  } else if (event.type === 'activity') {
                    backgroundColor = isLogged ? '#22c55e' : '#10b981'; // Green if logged, emerald otherwise
                  } else if (event.type === 'followup') {
                    backgroundColor = isLogged ? '#22c55e' : '#8b5cf6'; // Green if logged, purple otherwise
                  }
                  
                  return {
                    style: {
                      backgroundColor,
                      color: 'white',
                      borderRadius: 6,
                      border: isLogged ? '2px solid #22c55e' : 'none'
                    }
                  };
                }}
              />
            )}
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