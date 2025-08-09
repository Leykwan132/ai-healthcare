"use client";

import { useState, useEffect, useCallback } from 'react';

interface UseEventRemindersProps {
  events: any[];
  onReminderTriggered?: (event: any) => void;
}

export function useEventReminders({ events, onReminderTriggered }: UseEventRemindersProps) {
  const [activeReminder, setActiveReminder] = useState<any>(null);
  const [snoozedEvents, setSnoozedEvents] = useState<Record<number, Date>>({});
  const [completedEvents, setCompletedEvents] = useState<Set<number>>(new Set());

  const checkForDueEvents = useCallback(() => {
    const now = new Date();
    const currentTime = now.getTime();
    
    // Check each event
    for (const event of events) {
      const eventTime = new Date(event.start).getTime();
      const eventId = event.id;
      
      // Skip if already completed
      if (completedEvents.has(eventId)) continue;
      
      // Check if event is snoozed
      const snoozeUntil = snoozedEvents[eventId];
      if (snoozeUntil && now < snoozeUntil) continue;
      
      // Check if event time has arrived (within 1 minute tolerance)
      const timeDiff = currentTime - eventTime;
      if (timeDiff >= 0 && timeDiff <= 60000) { // 1 minute tolerance
        setActiveReminder(event);
        onReminderTriggered?.(event);
        break; // Only show one reminder at a time
      }
    }
  }, [events, snoozedEvents, completedEvents, onReminderTriggered]);

  // Check for due events every 30 seconds
  useEffect(() => {
    const interval = setInterval(checkForDueEvents, 30000);
    
    // Also check immediately
    checkForDueEvents();
    
    return () => clearInterval(interval);
  }, [checkForDueEvents]);

  const snoozeReminder = useCallback((eventId: number, minutes: number) => {
    const snoozeUntil = new Date(Date.now() + minutes * 60000);
    setSnoozedEvents(prev => ({
      ...prev,
      [eventId]: snoozeUntil
    }));
    setActiveReminder(null);
  }, []);

  const markEventComplete = useCallback((eventId: number) => {
    setCompletedEvents(prev => new Set(prev).add(eventId));
    setActiveReminder(null);
  }, []);

  const dismissReminder = useCallback(() => {
    setActiveReminder(null);
  }, []);

  return {
    activeReminder,
    snoozeReminder,
    markEventComplete,
    dismissReminder,
    snoozedEvents,
    completedEvents
  };
}
