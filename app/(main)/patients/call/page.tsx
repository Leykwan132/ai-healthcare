"use client";

import { CallInterface } from "@/components/call/CallInterface";

export default function PatientCallPage() {
  return (
    <div>
      <CallInterface 
        patientName="Jane Smith"
        doctorName="Dr. Johnson"
        patientImage=""
        doctorImage=""
        callDirection="patient-to-doctor"
        callType="incoming"
        onAnswerCall={() => console.log("Call answered")}
        onEndCall={() => console.log("Call ended")}
        onToggleMute={() => console.log("Mute toggled")}
        onToggleVideo={() => console.log("Video toggled")}
      />
    </div>
  );
}
