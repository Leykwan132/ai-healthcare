"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DoctorEventModalProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  patientLogs?: Record<number, { isLogged: boolean; photo?: string; timestamp?: string }>;
}

// Mock data for demonstration - in a real app, this would come from your backend
const mockPatientLogs = [
  {
    id: 1,
    timestamp: "2025-08-09 09:30",
    photo: "/api/placeholder/300/200", // This would be a real image URL
    status: "completed",
    notes: "Patient confirmed medication taken as prescribed"
  },
  {
    id: 2,
    timestamp: "2025-08-08 14:15",
    photo: "/api/placeholder/300/200",
    status: "completed",
    notes: "Medication taken with food as instructed"
  }
];

export function DoctorEventModal({ event, isOpen, onClose, patientLogs }: DoctorEventModalProps) {
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
  const displayLogs = [
    {
      id: event.id,
      timestamp: currentEventLog?.timestamp ? new Date(currentEventLog.timestamp).toLocaleString() : "",
      photo: currentEventLog?.photo,
      status: currentEventLog?.photo ? "completed" : "pending",
      notes: currentEventLog?.photo ? "Patient uploaded verification photo" : "No photo uploaded yet."
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
            
            {displayLogs.length === 0 ? (
              <div className="p-4 bg-gray-100 rounded-md text-center">
                <p className="text-gray-600">No logs available for this medication</p>
              </div>
            ) : (
              displayLogs.map((log) => (
                <Card key={log.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-600">{log.timestamp}</p>
                      <Badge className={getStatusColor(log.status)}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Verification Photo:</h4>
                      {log.photo ? (
                        <img 
                          src={log.photo} 
                          alt="Medication verification" 
                          className="w-full h-32 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-gray-500">No photo available</span>
                        </div>
                      )}
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
