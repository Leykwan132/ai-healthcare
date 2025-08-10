"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DoctorEventModalProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  patientLogs?: Record<number, { isLogged: boolean; photo?: string; timestamp?: string }>;
}

interface Task {
  id: number;
  patientid: string;
  title: string;
  description: string;
  isCompleted: boolean;
  created_at: string;
  [key: string]: any;
}

export function DoctorEventModal({ event, isOpen, onClose, patientLogs }: DoctorEventModalProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patientId = "770e8400-e29b-41d4-a716-446655440001";

  useEffect(() => {
    if (isOpen && event) {
      fetchPatientTasks();
    }
  }, [isOpen, event]);

  const fetchPatientTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/tasks?patientId=${patientId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(data.data || []);
    } catch (err) {
      console.error('Error fetching patient tasks:', err);
      setError('Failed to load patient tasks');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !event) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "missed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Always show a single log: completed if photo, pending if not
  const currentEventLog = patientLogs?.[event.id];
  
  // Find matching task from API data
  const matchingTask = tasks.find(task => 
    task.title === event.title || task.id === event.id
  );
  
  const displayLogs = [
    {
      id: event.id,
      timestamp: currentEventLog?.timestamp ? new Date(currentEventLog.timestamp).toLocaleString() : 
                 matchingTask?.created_at ? new Date(matchingTask.created_at).toLocaleString() : "",
      photo: currentEventLog?.photo,
      status: matchingTask?.isCompleted ? "completed" : "pending",
      notes: matchingTask?.isCompleted ? "Task completed by patient" : "Task not yet completed"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[600px] max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Patient Medication Log - {event.title}
            <Button variant="ghost" onClick={onClose}>×</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Description:</strong> {event.description}</p>
              {event.prescription && (
                <p><strong>Prescription:</strong> {event.prescription}</p>
              )}
              {event.medication && (
                <p><strong>Medication:</strong> {event.medication}</p>
              )}
            </div>
            <div>
              {event.dosage && (
                <p><strong>Dosage:</strong> {event.dosage}</p>
              )}
              {event.timesPerDay && (
                <p><strong>Times per day:</strong> {event.timesPerDay}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Patient Logs:</h3>
            
            {loading && (
              <div className="p-4 bg-blue-50 rounded-md text-center">
                <p className="text-blue-600">Loading patient tasks...</p>
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-red-50 rounded-md text-center">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            
            {!loading && !error && displayLogs.length === 0 ? (
              <div className="p-4 bg-gray-100 rounded-md text-center">
                <p className="text-gray-600">No logs available for this medication</p>
              </div>
            ) : (
              !loading && !error && displayLogs.map((log) => (
                <Card 
                  key={log.id} 
                  className={`p-4 ${matchingTask?.isCompleted ? 'bg-green-50 border-green-200' : ''}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-600">{log.timestamp}</p>
                      <Badge className={getStatusColor(log.status)}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Photo Verification:</span>
                      <Badge className={getStatusColor(log.status)}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Notes:</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        {log.notes}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
