import React from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import './styles/CallInterface.css';

interface CallControlsProps {
  callType: "incoming" | "ongoing" | "ended";
  isMuted: boolean;
  isVideoOff: boolean;
  onAnswerCall: () => void;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onStartNewCall?: () => void;
}

export function CallControls({
  callType,
  isMuted,
  isVideoOff,
  onAnswerCall,
  onEndCall,
  onToggleMute,
  onToggleVideo,
  onStartNewCall
}: CallControlsProps) {
  if (callType === "incoming") {
    return (
      <div className="call-controls">
        <div className="button-row">
          <button
            onClick={onAnswerCall}
            className="call-button answer"
          >
            <Phone className="call-icon" />
          </button>
          
          <button
            onClick={onEndCall}
            className="call-button decline"
          >
            <PhoneOff className="call-icon" />
          </button>
        </div>
      </div>
    );
  }

  if (callType === "ongoing") {
    return (
      <div className="call-controls">
        <div className="button-row-small">
          <button
            onClick={onToggleMute}
            className={`control-button ${isMuted ? 'muted' : 'active'}`}
          >
            {isMuted ? (
              <MicOff className="control-icon" />
            ) : (
              <Mic className="control-icon" />
            )}
          </button>

          <button
            onClick={onToggleVideo}
            className={`control-button ${isVideoOff ? 'video-off' : 'active'}`}
          >
            {isVideoOff ? (
              <VideoOff className="control-icon" />
            ) : (
              <Video className="control-icon" />
            )}
          </button>
        </div>

        <div className="button-row">
          <button
            onClick={onEndCall}
            className="call-button end"
          >
            <PhoneOff className="call-icon" />
          </button>
        </div>
      </div>
    );
  }

  if (callType === "ended") {
    return (
      <div className="call-controls">
        <div className="call-ended-content">
          <p className="call-ended-message">Thank you for the call</p>
          <button
            onClick={onStartNewCall}
            className="new-call-button"
          >
            Start New Call
          </button>
        </div>
      </div>
    );
  }

  return null;
}
