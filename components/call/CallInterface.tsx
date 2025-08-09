import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CallStatus } from "./CallStatus";
import { CallControls } from "./CallControls";
import './styles/CallInterface.css';

interface CallInterfaceProps {
  patientName?: string;
  doctorName?: string;
  patientImage?: string;
  doctorImage?: string;
  callDirection?: "patient-to-doctor" | "doctor-to-patient";
  callType?: "incoming" | "ongoing" | "ended";
  onAnswerCall?: () => void;
  onEndCall?: () => void;
  onToggleMute?: () => void;
  onToggleVideo?: () => void;
}

export function CallInterface({
  patientName = "Patient",
  doctorName = "MediBuddy",
  patientImage = "",
  doctorImage = "",
  callDirection = "patient-to-doctor",
  callType: initialCallType = "incoming",
  onAnswerCall,
  onEndCall,
  onToggleMute,
  onToggleVideo
}: CallInterfaceProps) {
  const [callType, setCallType] = useState(initialCallType);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Timer for ongoing call
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callType === "ongoing") {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callType]);

  const handleAnswerCall = () => {
    setCallType("ongoing");
    setCallDuration(0);
    onAnswerCall?.();
  };

  const handleEndCall = () => {
    setCallType("ended");
    onEndCall?.();
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    onToggleMute?.();
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    onToggleVideo?.();
  };

  const handleStartNewCall = () => {
    setCallType("incoming");
    setCallDuration(0);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  // Determine which name and image to display based on call direction
  const displayName = callDirection === "patient-to-doctor" ? doctorName : patientName;
  const displayImage = callDirection === "patient-to-doctor" ? doctorImage : patientImage;
  const callerType = callDirection === "patient-to-doctor" ? "Doctor" : "Patient";

  return (
    <div className={`call-container ${callType}`}>
      <Card className="call-card">
        <div className="call-content">
          <div className="avatar-container">
            <img 
              src="/follow_up_agent.gif" 
              alt="Robot Avatar" 
              className="w-390 h-24 rounded-full"
            />
          </div>

          <CallStatus
            patientName={displayName}
            callType={callType}
            callDuration={callDuration}
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            callerType={callerType}
          />

          <CallControls
            callType={callType}
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            onAnswerCall={handleAnswerCall}
            onEndCall={handleEndCall}
            onToggleMute={handleToggleMute}
            onToggleVideo={handleToggleVideo}
            onStartNewCall={handleStartNewCall}
          />
        </div>
      </Card>
    </div>
  );
}
