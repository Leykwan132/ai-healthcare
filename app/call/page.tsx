"use client";

import { CallInterface } from "@/components/call/CallInterface";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CallPage() {
  const [callDirection, setCallDirection] = useState<"patient-to-doctor" | "doctor-to-patient">("patient-to-doctor");

  return (
    <div>
      {/* Demo controls to switch between scenarios */}
      <div className="fixed top-4 left-4 z-50 space-y-2">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <p className="text-sm font-medium mb-2">Demo Scenarios:</p>
          <div className="space-y-2">
            <Button
              onClick={() => setCallDirection("patient-to-doctor")}
              variant={callDirection === "patient-to-doctor" ? "default" : "outline"}
              size="sm"
            >
              Patient calls Doctor
            </Button>
            <Button
              onClick={() => setCallDirection("doctor-to-patient")}
              variant={callDirection === "doctor-to-patient" ? "default" : "outline"}
              size="sm"
            >
              Doctor calls Patient
            </Button>
          </div>
        </div>
      </div>

      <CallInterface 
        patientName="Jane Smith"
        doctorName="Dr. Johnson"
        patientImage=""
        doctorImage=""
        callDirection={callDirection}
        callType="incoming"
        onAnswerCall={() => console.log("Call answered")}
        onEndCall={() => console.log("Call ended")}
        onToggleMute={() => console.log("Mute toggled")}
        onToggleVideo={() => console.log("Video toggled")}
      />
    </div>
  );
}
