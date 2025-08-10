"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

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

interface PrescriptionData {
  id: string;
  patientId: string;
  doctorId: string;
  originalInstructions: string;
  language: string;
  status: string;
  createdAt: string;
  parsedInstructions: {
    medications: Medication[];
    activities: Activity[];
    followUpDate?: string;
    notes?: string;
  };
  schedules: Array<{
    id: string;
    type: 'medication' | 'activity' | 'followup';
    title: string;
    description: string;
    dosage?: string;
    frequency: string;
    startDate: string;
    endDate: string;
    times: string[];
    status: string;
  }>;
}

export default function AppointmentsPage() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        await loadPrescriptions();
      } else {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch prescriptions with parsed instructions
      const { data: prescriptionsData, error: prescriptionsError } = await supabase
        .from('prescriptions')
        .select(`
          *,
          parsedInstructions (
            medications,
            activities,
            followUpDate,
            notes
          )
        `)
        .order('createdAt', { ascending: false })
        .limit(20);

      if (prescriptionsError) {
        throw new Error(prescriptionsError.message);
      }

      // Fetch schedules for each prescription
      const prescriptionIds = prescriptionsData?.map(p => p.id) || [];
      const { data: schedulesData, error: schedulesError } = await supabase
        .from('schedules')
        .select('*')
        .in('prescriptionId', prescriptionIds)
        .order('startDate', { ascending: true });

      if (schedulesError) {
        throw new Error(schedulesError.message);
      }

      // Combine prescriptions with their schedules and parsed instructions
      const combinedData = prescriptionsData?.map(prescription => ({
        ...prescription,
        parsedInstructions: prescription.parsedInstructions?.[0] || {
          medications: [],
          activities: [],
          followUpDate: null,
          notes: null
        },
        schedules: schedulesData?.filter(schedule => schedule.prescriptionId === prescription.id) || []
      })) || [];

      setPrescriptions(combinedData);
    } catch (err) {
      console.error('Error loading prescriptions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medication': return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'activity': return 'bg-green-50 border-green-200 text-green-900';
      case 'followup': return 'bg-purple-50 border-purple-200 text-purple-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Appointments & Schedule</h1>
            <p className="text-muted-foreground mt-2">View stored prescription and schedule data</p>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800">Please sign in to access appointments and schedule data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments & Schedule</h1>
          <p className="text-muted-foreground mt-2">
            View stored prescription and schedule data from AI parsing results
          </p>
        </div>
        <Button onClick={loadPrescriptions} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-red-800 text-sm font-medium">Error:</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-muted-foreground">Loading appointments and schedules...</span>
            </div>
          </CardContent>
        </Card>
      ) : prescriptions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-lg font-medium mb-2">No appointments or schedules found</p>
              <p className="text-sm">
                Use the AI Prompt Testing tool to parse prescription instructions and generate schedules.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Prescription - {new Date(prescription.createdAt).toLocaleDateString()}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(prescription.status)}>
                      {prescription.status}
                    </Badge>
                    <Badge variant="outline">
                      {prescription.language.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  ID: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{prescription.id}</code>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Original Instructions */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Original Instructions</h4>
                  <div className="bg-gray-50 p-3 rounded border text-sm font-mono">
                    {prescription.originalInstructions}
                  </div>
                </div>

                {/* Parsed Instructions */}
                {prescription.parsedInstructions && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Medications */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Medications ({prescription.parsedInstructions.medications?.length || 0})
                      </h4>
                      {prescription.parsedInstructions.medications?.length > 0 ? (
                        <div className="space-y-3">
                          {prescription.parsedInstructions.medications.map((med, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3 bg-blue-50">
                              <h5 className="font-medium text-blue-900 mb-2">{med.name}</h5>
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

                    {/* Activities */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Activities ({prescription.parsedInstructions.activities?.length || 0})
                      </h4>
                      {prescription.parsedInstructions.activities?.length > 0 ? (
                        <div className="space-y-3">
                          {prescription.parsedInstructions.activities.map((activity, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3 bg-green-50">
                              <h5 className="font-medium text-green-900 mb-2">{activity.name}</h5>
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
                  </div>
                )}

                {/* Follow-up and Notes */}
                {(prescription.parsedInstructions?.followUpDate || prescription.parsedInstructions?.notes) && (
                  <div className="border-t pt-4">
                    {prescription.parsedInstructions.followUpDate && (
                      <div className="mb-2">
                        <span className="font-medium text-gray-600 text-sm">Follow-up Date:</span>
                        <div className="font-mono bg-gray-50 p-1 rounded text-sm mt-1">
                          {prescription.parsedInstructions.followUpDate}
                        </div>
                      </div>
                    )}
                    {prescription.parsedInstructions.notes && (
                      <div>
                        <span className="font-medium text-gray-600 text-sm">Notes:</span>
                        <div className="font-mono bg-gray-50 p-2 rounded text-sm mt-1">
                          {prescription.parsedInstructions.notes}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Schedule Events */}
                {prescription.schedules.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Schedule Events ({prescription.schedules.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {prescription.schedules.map((schedule) => (
                        <div key={schedule.id} className={`p-3 rounded-lg border ${getTypeColor(schedule.type)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-sm">{schedule.title}</h5>
                            <Badge className={getStatusColor(schedule.status)} variant="secondary">
                              {schedule.status}
                            </Badge>
                          </div>
                          <p className="text-xs mb-2">{schedule.description}</p>
                          <div className="text-xs space-y-1">
                            <div><strong>Type:</strong> {schedule.type}</div>
                            <div><strong>Frequency:</strong> {schedule.frequency}</div>
                            <div><strong>Start:</strong> {new Date(schedule.startDate).toLocaleDateString()}</div>
                            <div><strong>End:</strong> {new Date(schedule.endDate).toLocaleDateString()}</div>
                            {schedule.times.length > 0 && (
                              <div><strong>Times:</strong> {schedule.times.join(', ')}</div>
                            )}
                            {schedule.dosage && (
                              <div><strong>Dosage:</strong> {schedule.dosage}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {prescriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Summary Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Total Prescriptions:</div>
                <div className="font-mono font-semibold text-lg">{prescriptions.length}</div>
              </div>
              <div>
                <div className="text-gray-600">Total Medications:</div>
                <div className="font-mono font-semibold text-lg text-blue-700">
                  {prescriptions.reduce((acc, p) => acc + (p.parsedInstructions?.medications?.length || 0), 0)}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Total Activities:</div>
                <div className="font-mono font-semibold text-lg text-green-700">
                  {prescriptions.reduce((acc, p) => acc + (p.parsedInstructions?.activities?.length || 0), 0)}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Total Schedule Events:</div>
                <div className="font-mono font-semibold text-lg text-purple-700">
                  {prescriptions.reduce((acc, p) => acc + p.schedules.length, 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
