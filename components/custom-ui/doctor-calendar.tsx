"use client";

import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

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


export function CalendarView({ onSelectEvent }: { onSelectEvent: (event: any) => void }) {
  const [events] = useState(sampleEvents);  // hard-code

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

  return (
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
            onSelectEvent={onSelectEvent}
            style={{ height: "100%" }}
          />
        </div>
      </CardContent>
    </Card>
  );
}