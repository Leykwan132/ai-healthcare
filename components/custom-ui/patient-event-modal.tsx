"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PatientEventModalProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  onLogMedication: (eventId: number, photo: File) => void;
  isEventLogged: boolean;
  eventPhoto?: string;
}

export function PatientEventModal({ 
  event, 
  isOpen, 
  onClose, 
  onLogMedication, 
  isEventLogged,
  eventPhoto 
}: PatientEventModalProps) {

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(eventPhoto || null);

  // Reset photo and preview when event or modal open state changes
  useEffect(() => {
    if (isOpen) {
      setPhoto(null);
      setPhotoPreview(eventPhoto || null);
    } else {
      setPhoto(null);
      setPhotoPreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, isOpen, eventPhoto]);

  if (!isOpen || !event) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogMedication = async () => {
    if (!photo) {
      alert("Please upload a photo to verify medication intake");
      return;
    }

    try {
      onLogMedication(event.id, photo);
      alert("Medication logged successfully!");
    } catch (error) {
      console.error("Error logging medication:", error);
      alert("Error logging medication. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96 max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {event.title}
            <Button variant="ghost" onClick={onClose}>×</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p><strong>Description:</strong> {event.description}</p>
            {event.prescription && (
              <p><strong>Prescription:</strong> {event.prescription}</p>
            )}
            {event.medication && (
              <p><strong>Medication:</strong> {event.medication}</p>
            )}
            {event.dosage && (
              <p><strong>Dosage:</strong> {event.dosage}</p>
            )}
            {event.timesPerDay && (
              <p><strong>Times per day:</strong> {event.timesPerDay}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo-upload">Upload photo to verify medication intake:</Label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={isEventLogged}
            />
          </div>

          {photoPreview && (
            <div className="space-y-2">
              <Label>Photo Preview:</Label>
              <img
                src={photoPreview}
                alt="Medication verification"
                className="w-full h-48 object-cover rounded-md border"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={handleLogMedication}
              disabled={!photo || isEventLogged}
              className="flex-1"
            >
              {isEventLogged ? "✓ Logged" : "Log Medication"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>

          {isEventLogged && (
            <div className="p-3 bg-green-100 text-green-800 rounded-md">
              Medication successfully logged at {new Date().toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
