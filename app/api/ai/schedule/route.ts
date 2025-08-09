import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addDays, addWeeks, addMonths, format, parseISO } from 'date-fns';

// Schema for schedule generation request
const scheduleRequestSchema = z.object({
  parsedInstruction: z.object({
    medications: z.array(z.object({
      name: z.string(),
      dosage: z.string(),
      frequency: z.string(),
      duration: z.string(),
      timing: z.string(),
      instructions: z.string(),
    })),
    activities: z.array(z.object({
      name: z.string(),
      duration: z.string(),
      frequency: z.string(),
      timing: z.string(),
      instructions: z.string(),
    })),
    followUpDate: z.string().optional(),
    notes: z.string().optional(),
  }),
  startDate: z.string(), // YYYY-MM-DD format
});

// Schema for calendar event
const calendarEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(), // YYYY-MM-DD
  time: z.string(), // HH:MM format
  type: z.enum(['medication', 'activity', 'followup']),
  description: z.string(),
  metadata: z.object({
    dosage: z.string().optional(),
    frequency: z.string().optional(),
    duration: z.string().optional(),
    instructions: z.string().optional(),
  }),
});

type CalendarEvent = z.infer<typeof calendarEventSchema>;

function parseFrequency(frequency: string): { times: number; period: 'day' | 'week' | 'month' } {
  const freq = frequency.toLowerCase();
  
  if (freq.includes('once daily') || freq.includes('daily') || freq === 'once a day') {
    return { times: 1, period: 'day' };
  }
  if (freq.includes('twice daily') || freq.includes('two times daily') || freq.includes('2 times daily')) {
    return { times: 2, period: 'day' };
  }
  if (freq.includes('three times daily') || freq.includes('thrice daily') || freq.includes('3 times daily')) {
    return { times: 3, period: 'day' };
  }
  if (freq.includes('four times daily') || freq.includes('4 times daily')) {
    return { times: 4, period: 'day' };
  }
  if (freq.includes('every 6 hours')) {
    return { times: 4, period: 'day' };
  }
  if (freq.includes('every 8 hours')) {
    return { times: 3, period: 'day' };
  }
  if (freq.includes('every 12 hours')) {
    return { times: 2, period: 'day' };
  }
  if (freq.includes('weekly') || freq.includes('once a week')) {
    return { times: 1, period: 'week' };
  }
  if (freq.includes('monthly') || freq.includes('once a month')) {
    return { times: 1, period: 'month' };
  }
  if (freq.includes('as needed') || freq.includes('when required')) {
    return { times: 0, period: 'day' }; // Special case for PRN medications
  }
  
  // Default to once daily
  return { times: 1, period: 'day' };
}

function parseDuration(duration: string, startDate: string): Date | null {
  const start = parseISO(startDate);
  const dur = duration.toLowerCase();
  
  if (dur.includes('ongoing') || dur.includes('continue') || dur.includes('indefinitely')) {
    return addMonths(start, 6); // Default to 6 months for ongoing
  }
  
  // Extract number of days/weeks/months
  const dayMatch = dur.match(/(\d+)\s*days?/);
  if (dayMatch) {
    return addDays(start, parseInt(dayMatch[1]));
  }
  
  const weekMatch = dur.match(/(\d+)\s*weeks?/);
  if (weekMatch) {
    return addWeeks(start, parseInt(weekMatch[1]));
  }
  
  const monthMatch = dur.match(/(\d+)\s*months?/);
  if (monthMatch) {
    return addMonths(start, parseInt(monthMatch[1]));
  }
  
  // Default to 30 days if unclear
  return addDays(start, 30);
}

function getTimesForTiming(timing: string, frequency: { times: number; period: string }): string[] {
  const timingLower = timing.toLowerCase();
  
  if (frequency.times === 0) return []; // PRN medications
  
  if (frequency.times === 1) {
    if (timingLower.includes('morning')) return ['08:00'];
    if (timingLower.includes('evening') || timingLower.includes('night')) return ['20:00'];
    if (timingLower.includes('noon') || timingLower.includes('lunch')) return ['12:00'];
    if (timingLower.includes('before meals')) return ['07:30'];
    if (timingLower.includes('after meals')) return ['08:30'];
    return ['08:00']; // Default morning
  }
  
  if (frequency.times === 2) {
    if (timingLower.includes('morning and evening')) return ['08:00', '20:00'];
    if (timingLower.includes('before meals')) return ['07:30', '19:30'];
    if (timingLower.includes('after meals')) return ['08:30', '20:30'];
    return ['08:00', '20:00']; // Default morning and evening
  }
  
  if (frequency.times === 3) {
    if (timingLower.includes('before meals')) return ['07:30', '12:30', '19:30'];
    if (timingLower.includes('after meals')) return ['08:30', '13:30', '20:30'];
    return ['08:00', '14:00', '20:00']; // Default 3 times
  }
  
  if (frequency.times === 4) {
    return ['08:00', '14:00', '20:00', '02:00']; // Every 6 hours
  }
  
  return ['08:00']; // Fallback
}

function generateCalendarEvents(
  parsedInstruction: any,
  startDate: string
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const start = parseISO(startDate);
  
  // Generate medication events
  parsedInstruction.medications.forEach((med: any, medIndex: number) => {
    const frequency = parseFrequency(med.frequency);
    const endDate = parseDuration(med.duration, startDate);
    const times = getTimesForTiming(med.timing, frequency);
    
    if (frequency.times === 0) {
      // PRN medication - create single event
      events.push({
        id: `med-${medIndex}-prn`,
        title: `${med.name} ${med.dosage}`,
        date: startDate,
        time: '08:00',
        type: 'medication',
        description: `${med.name} ${med.dosage} - ${med.frequency}`,
        metadata: {
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          instructions: med.instructions,
        },
      });
      return;
    }
    
    // Generate recurring events
    let currentDate = new Date(start);
    let eventId = 0;
    
    while (endDate && currentDate <= endDate) {
      times.forEach(time => {
        events.push({
          id: `med-${medIndex}-${eventId++}`,
          title: `${med.name} ${med.dosage}`,
          date: format(currentDate, 'yyyy-MM-dd'),
          time: time,
          type: 'medication',
          description: `${med.name} ${med.dosage} - ${med.instructions}`,
          metadata: {
            dosage: med.dosage,
            frequency: med.frequency,
            duration: med.duration,
            instructions: med.instructions,
          },
        });
      });
      
      // Move to next occurrence
      if (frequency.period === 'day') {
        currentDate = addDays(currentDate, 1);
      } else if (frequency.period === 'week') {
        currentDate = addWeeks(currentDate, 1);
      } else if (frequency.period === 'month') {
        currentDate = addMonths(currentDate, 1);
      }
    }
  });
  
  // Generate activity events
  parsedInstruction.activities.forEach((activity: any, actIndex: number) => {
    const frequency = parseFrequency(activity.frequency);
    const endDate = parseDuration('30 days', startDate); // Default 30 days for activities
    const times = getTimesForTiming(activity.timing, frequency);
    
    let currentDate = new Date(start);
    let eventId = 0;
    
    while (currentDate <= endDate) {
      times.forEach(time => {
        events.push({
          id: `act-${actIndex}-${eventId++}`,
          title: `${activity.name}`,
          date: format(currentDate, 'yyyy-MM-dd'),
          time: time,
          type: 'activity',
          description: `${activity.name} - ${activity.duration} - ${activity.instructions}`,
          metadata: {
            duration: activity.duration,
            frequency: activity.frequency,
            instructions: activity.instructions,
          },
        });
      });
      
      // Move to next occurrence
      if (frequency.period === 'day') {
        currentDate = addDays(currentDate, 1);
      } else if (frequency.period === 'week') {
        currentDate = addWeeks(currentDate, 1);
      } else if (frequency.period === 'month') {
        currentDate = addMonths(currentDate, 1);
      }
    }
  });
  
  // Add follow-up event if specified
  if (parsedInstruction.followUpDate) {
    try {
      const followUpDate = parseISO(parsedInstruction.followUpDate);
      events.push({
        id: 'followup-1',
        title: 'Follow-up Appointment',
        date: format(followUpDate, 'yyyy-MM-dd'),
        time: '09:00',
        type: 'followup',
        description: 'Scheduled follow-up appointment',
        metadata: {
          instructions: parsedInstruction.notes || 'Regular check-up',
        },
      });
    } catch (error) {
      console.warn('Invalid follow-up date format:', parsedInstruction.followUpDate);
    }
  }
  
  return events.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare === 0) {
      return a.time.localeCompare(b.time);
    }
    return dateCompare;
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = scheduleRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { parsedInstruction, startDate } = validation.data;
    
    // Generate calendar events
    const events = generateCalendarEvents(parsedInstruction, startDate);
    
    // Group events by date for easier calendar display
    const eventsByDate = events.reduce((acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = [];
      }
      acc[event.date].push(event);
      return acc;
    }, {} as Record<string, CalendarEvent[]>);

    return NextResponse.json({
      success: true,
      events,
      eventsByDate,
      summary: {
        totalEvents: events.length,
        medicationEvents: events.filter(e => e.type === 'medication').length,
        activityEvents: events.filter(e => e.type === 'activity').length,
        followUpEvents: events.filter(e => e.type === 'followup').length,
        dateRange: {
          start: startDate,
          end: events.length > 0 ? events[events.length - 1].date : startDate,
        },
      },
    });

  } catch (error) {
    console.error('Schedule generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate schedule' },
      { status: 500 }
    );
  }
}
