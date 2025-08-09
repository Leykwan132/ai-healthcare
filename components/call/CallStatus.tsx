import React from 'react';
import { MicOff, VideoOff } from "lucide-react";
import './styles/CallInterface.css';

interface CallStatusProps {
  patientName: string;
  callType: "incoming" | "ongoing" | "ended";
  callDuration: number;
  isMuted: boolean;
  isVideoOff: boolean;
  callerType?: string;
}

export function CallStatus({ 
  patientName, 
  callType, 
  callDuration, 
  isMuted, 
  isVideoOff,
  callerType = "Patient"
}: CallStatusProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallStatusText = () => {
    switch (callType) {
      case "incoming":
        return `Incoming call from ${callerType}...`;
      case "ongoing":
        return formatDuration(callDuration);
      case "ended":
        return "Call ended";
      default:
        return "";
    }
  };

  return (
    <div>
      <h1 className="patient-name">{patientName}</h1>
      <p className="call-status">{getCallStatusText()}</p>
      
      {callType === "ongoing" && (isMuted || isVideoOff) && (
        <div className="status-indicators">
          {isMuted && (
            <span className="status-item">
              <MicOff className="status-icon" />
              Muted
            </span>
          )}
          {isVideoOff && (
            <span className="status-item">
              <VideoOff className="status-icon" />
              Video Off
            </span>
          )}
        </div>
      )}
    </div>
  );
}
