import React from 'react';
import './styles/CallInterface.css';

interface PatientAvatarProps {
  patientName: string;
  patientImage?: string;
}

export function PatientAvatar({ patientName, patientImage }: PatientAvatarProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="avatar-container">
      <div className="avatar">
        {patientImage ? (
          <img 
            src={patientImage} 
            alt={patientName} 
            className="avatar-image"
          />
        ) : (
          <span className="avatar-initials">
            {getInitials(patientName)}
          </span>
        )}
      </div>
    </div>
  );
}
