"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: string;
  instructions: string;
}

interface Activity {
  name: string;
  duration: string;
  frequency: string;
  timing: string;
  instructions: string;
}

interface ParsedInstruction {
  medications: Medication[];
  activities: Activity[];
  followUpDate?: string;
  notes?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  type: 'medication' | 'activity' | 'followup';
  description: string;
  metadata: {
    dosage?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
  };
}

interface ScheduleResponse {
  success: boolean;
  events: CalendarEvent[];
  eventsByDate: Record<string, CalendarEvent[]>;
  summary: {
    totalEvents: number;
    medicationEvents: number;
    activityEvents: number;
    followUpEvents: number;
    dateRange: {
      start: string;
      end: string;
    };
  };
}

interface ParseResponse {
  success: boolean;
  data?: ParsedInstruction;
  error?: string;
  provider?: string;
  processingTime?: number;
}

export default function PromptTestPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParseResponse | null>(null);
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [provider, setProvider] = useState<'openai' | 'groq'>('openai');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const samplePrescriptions = [
    "Take 1 tablet of Amlodipine 5mg once daily in the morning. Light exercise 30 minutes daily.",
    "Ventolin inhaler 2 puffs as needed for asthma. Flixotide 250mcg inhaler twice daily morning and evening. Avoid dust and smoke.",
    "Simvastatin 20mg once daily in the evening with food. Walking exercise 45 minutes daily. Follow up in 2 weeks.",
    "Novorapid insulin 10 units before breakfast and dinner. Metformin 1000mg twice daily with meals. Check blood sugar daily.",
    "Take Paracetamol 500mg three times daily for 5 days. Rest and drink plenty of fluids."
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);

    const startTime = Date.now();

    try {
      const response = await fetch('/api/ai/prescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instruction: input,
          provider: provider
        }),
      });

      const data = await response.json();
      const processingTime = Date.now() - startTime;

      if (response.ok) {
        setResult({
          success: true,
          data: data.parsedInstruction,
          provider: provider,
          processingTime
        });
      } else {
        setResult({
          success: false,
          error: data.error || 'Failed to parse instruction',
          provider: provider,
          processingTime
        });
      }
    } catch (error) {
      const processingTime = Date.now() - startTime;
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        provider: provider,
        processingTime
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sample: string) => {
    setInput(sample);
    setResult(null);
  };

  const generateSchedule = async () => {
    if (!result?.data) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parsedInstruction: result.data,
          startDate: startDate
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSchedule(data);
      } else {
        console.error('Failed to generate schedule:', data.error);
      }
    } catch (error) {
      console.error('Schedule generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setInput("");
    setResult(null);
    setSchedule(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Prompt Testing</h1>
          <p className="text-muted-foreground mt-2">
            Test the AI prompt for parsing prescription instructions into structured data
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Provider: {provider.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Prescription Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider">AI Provider</Label>
                  <select
                    id="provider"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as 'openai' | 'groq')}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="openai">OpenAI (GPT-4o-mini)</option>
                    <option value="groq">Groq (Llama-3.1-8B-Instant)</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="instruction">Prescription Instruction</Label>
                <textarea
                  id="instruction"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter prescription instructions here..."
                  rows={4}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={!input.trim() || loading}
                  className="flex-1"
                >
                  {loading ? "Parsing..." : "Parse Instruction"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={clearAll}
                  disabled={loading}
                >
                  Clear
                </Button>
              </div>
            </form>

            {/* Sample Prescriptions */}
            <div className="mt-6">
              <Label className="text-sm font-medium">Sample Prescriptions</Label>
              <div className="space-y-2 mt-2">
                {samplePrescriptions.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => loadSample(sample)}
                    className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
                    disabled={loading}
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>Parsed Results</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-muted-foreground">Processing with {provider.toUpperCase()}...</span>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                {result.success ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        ✓ Success
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {result.processingTime}ms via {result.provider?.toUpperCase()}
                      </span>
                    </div>
                    
                    {result.data && (
                      <div className="space-y-6">
                        {/* Medications Section */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Medications ({result.data.medications.length})</h3>
                          {result.data.medications.length > 0 ? (
                            <div className="space-y-3">
                              {result.data.medications.map((med, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-blue-50">
                                  <h4 className="font-medium text-blue-900 mb-2">{med.name}</h4>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="text-gray-600">Dosage:</div>
                                    <div className="font-mono">{med.dosage}</div>
                                    <div className="text-gray-600">Frequency:</div>
                                    <div className="font-mono">{med.frequency}</div>
                                    <div className="text-gray-600">Duration:</div>
                                    <div className="font-mono">{med.duration}</div>
                                    <div className="text-gray-600">Timing:</div>
                                    <div className="font-mono">{med.timing}</div>
                                  </div>
                                  {med.instructions && (
                                    <div className="mt-2">
                                      <div className="text-xs text-gray-600">Instructions:</div>
                                      <div className="text-xs font-mono bg-white p-1 rounded border">{med.instructions}</div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-sm italic">No medications found</div>
                          )}
                        </div>

                        {/* Activities Section */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Activities ({result.data.activities.length})</h3>
                          {result.data.activities.length > 0 ? (
                            <div className="space-y-3">
                              {result.data.activities.map((activity, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-green-50">
                                  <h4 className="font-medium text-green-900 mb-2">{activity.name}</h4>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="text-gray-600">Duration:</div>
                                    <div className="font-mono">{activity.duration}</div>
                                    <div className="text-gray-600">Frequency:</div>
                                    <div className="font-mono">{activity.frequency}</div>
                                    <div className="text-gray-600">Timing:</div>
                                    <div className="font-mono">{activity.timing}</div>
                                  </div>
                                  {activity.instructions && (
                                    <div className="mt-2">
                                      <div className="text-xs text-gray-600">Instructions:</div>
                                      <div className="text-xs font-mono bg-white p-1 rounded border">{activity.instructions}</div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-sm italic">No activities found</div>
                          )}
                        </div>

                        {/* Follow-up and Notes */}
                        {(result.data.followUpDate || result.data.notes) && (
                          <div className="border-t pt-4">
                            {result.data.followUpDate && (
                              <div className="mb-2">
                                <span className="font-medium text-gray-600 text-sm">Follow-up Date:</span>
                                <div className="font-mono bg-gray-50 p-1 rounded text-sm mt-1">{result.data.followUpDate}</div>
                              </div>
                            )}
                            {result.data.notes && (
                              <div>
                                <span className="font-medium text-gray-600 text-sm">Notes:</span>
                                <div className="font-mono bg-gray-50 p-2 rounded text-sm mt-1">{result.data.notes}</div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Generate Schedule Button */}
                        <div className="border-t pt-4">
                          <Button 
                            onClick={generateSchedule}
                            disabled={loading}
                            className="w-full"
                          >
                            {loading ? "Generating Schedule..." : "Generate Calendar Schedule"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <Badge variant="destructive">
                        ✗ Error
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {result.processingTime}ms via {result.provider?.toUpperCase()}
                      </span>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-red-800 text-sm font-medium">Error:</p>
                      <p className="text-red-700 text-sm mt-1">{result.error}</p>
                    </div>
                  </>
                )}
              </div>
            )}

            {!result && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Enter a prescription instruction and click "Parse Instruction" to see the AI parsing results.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Calendar Schedule Section */}
      {schedule && (
        <Card>
          <CardHeader>
            <CardTitle>Calendar Schedule</CardTitle>
            <div className="text-sm text-muted-foreground">
              Generated from start date: {startDate}
            </div>
          </CardHeader>
          <CardContent>
            {schedule.success ? (
              <div className="space-y-6">
                {/* Schedule Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Schedule Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Total Events:</div>
                      <div className="font-mono font-semibold">{schedule.summary.totalEvents}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Medications:</div>
                      <div className="font-mono font-semibold text-blue-700">{schedule.summary.medicationEvents}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Activities:</div>
                      <div className="font-mono font-semibold text-green-700">{schedule.summary.activityEvents}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Follow-ups:</div>
                      <div className="font-mono font-semibold text-purple-700">{schedule.summary.followUpEvents}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-600">
                    Date Range: {schedule.summary.dateRange.start} to {schedule.summary.dateRange.end}
                  </div>
                </div>

                {/* Events by Date */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Daily Schedule</h4>
                  <div className="space-y-4">
                    {Object.entries(schedule.eventsByDate).map(([date, events]) => (
                      <div key={date} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3">
                          {new Date(date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h5>
                        <div className="space-y-2">
                          {events.map((event) => (
                            <div 
                              key={event.id} 
                              className={`p-3 rounded-lg border ${
                                event.type === 'medication' ? 'bg-blue-50 border-blue-200' :
                                event.type === 'activity' ? 'bg-green-50 border-green-200' :
                                'bg-purple-50 border-purple-200'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h6 className={`font-medium ${
                                  event.type === 'medication' ? 'text-blue-900' :
                                  event.type === 'activity' ? 'text-green-900' :
                                  'text-purple-900'
                                }`}>
                                  {event.title}
                                </h6>
                                <span className="text-xs font-mono bg-white px-2 py-1 rounded border">
                                  {event.time}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{event.description}</p>
                              {event.metadata.dosage && (
                                <div className="mt-2 text-xs text-gray-600">
                                  <span className="font-medium">Dosage:</span> {event.metadata.dosage}
                                </div>
                              )}
                              {event.metadata.instructions && (
                                <div className="mt-1 text-xs text-gray-600">
                                  <span className="font-medium">Instructions:</span> {event.metadata.instructions}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-red-800 text-sm font-medium">Failed to generate schedule</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use This Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Testing Steps:</h4>
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                <li>Select an AI provider (OpenAI or Groq)</li>
                <li>Set a start date for the schedule</li>
                <li>Enter or select a prescription instruction</li>
                <li>Click "Parse Instruction" to test</li>
                <li>Review the structured output</li>
                <li>Click "Generate Calendar Schedule" to see timeline</li>
                <li>Try different instruction formats</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Database Schema Output:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li><strong>Medications Array:</strong> Name, dosage, frequency, duration, timing, instructions</li>
                <li><strong>Activities Array:</strong> Name, duration, frequency, timing, instructions</li>
                <li><strong>Follow-up Date:</strong> Next appointment/check-up</li>
                <li><strong>Notes:</strong> Additional instructions or warnings</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2 italic">
                Output matches parsedInstructions table schema in database
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
