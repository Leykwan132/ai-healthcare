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
  const [dismissedEvents, setDismissedEvents] = useState<Set<number>>(new Set());
  const [hasShownReminder, setHasShownReminder] = useState(false);

    const checkForDueEvents = useCallback(() => {
    // For demo: only show one reminder per session
    if (hasShownReminder) {
      return;
    }

    const now = new Date();
    
    // Find the first available event that hasn't been dismissed or completed
    const dueEvent = events.find(event => {
      if (dismissedEvents.has(event.id) || completedEvents.has(event.id)) {
        return false;
      }
      
      // Check if event is snoozed
      const snoozeUntil = snoozedEvents[event.id];
      if (snoozeUntil && now < snoozeUntil) {
        return false;
      }
      
      return true; // For demo: any event can trigger
    });

    if (dueEvent && !activeReminder) {
      setActiveReminder(dueEvent);
      setHasShownReminder(true); // Mark that we've shown a reminder
      onReminderTriggered?.(dueEvent);
    }
  }, [events, snoozedEvents, completedEvents, dismissedEvents, activeReminder, onReminderTriggered, hasShownReminder]);

  // Check for due events every 5 seconds for demo responsiveness
  useEffect(() => {
    const interval = setInterval(checkForDueEvents, 5000);
    
    // Also check immediately when events change
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
    if (activeReminder) {
      setDismissedEvents(prev => new Set(prev).add(activeReminder.id));
    }
    setActiveReminder(null);
  }, [activeReminder]);

  return {
    activeReminder,
    snoozeReminder,
    markEventComplete,
    dismissReminder,
    snoozedEvents,
    completedEvents
  };
}
