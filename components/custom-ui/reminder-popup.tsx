"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, X, Clock } from "lucide-react";
import './styles/reminder-popup.css';

interface ReminderPopupProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  onSnooze?: (minutes: number) => void;
  onProceed?: () => void;
}

export function ReminderPopup({ 
  event, 
  isOpen, 
  onClose, 
  onSnooze, 
  onProceed 
}: ReminderPopupProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    if (isOpen && event) {
      // Play notification sound
      playNotificationSound();
      
      // Request notification permission if not granted
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
      
      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification(`Medication Reminder: ${event.title}`, {
          body: event.description || 'Time to take your medication',
          icon: '/favicon.ico',
          tag: `reminder-${event.id}`
        });
      }
    }
  }, [isOpen, event]);

  const playNotificationSound = async () => {
    try {
      setIsPlaying(true);
      console.log('Attempting to play notification sound...');
      
      // Create a simple beep sound using Web Audio API
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume audio context if it's suspended (browser requirement)
      if (context.state === 'suspended') {
        await context.resume();
      }
      
      setAudioContext(context);
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.frequency.setValueAtTime(800, context.currentTime);
      oscillator.frequency.setValueAtTime(600, context.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, context.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
      
      console.log('Sound should be playing now...');
      
      setTimeout(() => {
        setIsPlaying(false);
        if (context.state !== 'closed') {
          context.close();
        }
        setAudioContext(null);
        console.log('Sound playback completed');
      }, 500);
    } catch (error) {
      console.log('Could not play notification sound:', error);
      setIsPlaying(false);
    }
  };


  const handleSnooze = (minutes: number) => {
    // Stop any ongoing sounds
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close();
    }
    setIsPlaying(false);
    setAudioContext(null);
    onSnooze?.(minutes);
    onClose();
  };

  const handleProceed = () => {
    // Stop any ongoing sounds
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close();
    }
    setIsPlaying(false);
    setAudioContext(null);
    onProceed?.();
    onClose();
  };

  const handleDismiss = () => {
    // Stop any ongoing sounds
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close();
    }
    setIsPlaying(false);
    setAudioContext(null);
    onClose();
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <Card className="w-96 bg-white shadow-2xl animate-slideUp">
        <CardHeader className="bg-blue-500 text-white">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className={`w-6 h-6 ${isPlaying ? 'animate-bounce' : ''}`} />
              Medication Reminder
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-blue-600">
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
              <p className="text-gray-600">{event.description}</p>
              <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {(event.prescription || event.medication) && (
              <div className="bg-blue-50 p-3 rounded-lg">
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
            )}

            <div className="space-y-3">
              <Button 
                onClick={handleProceed}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                Proceed
              </Button>
              
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  onClick={() => handleSnooze(5)}
                  variant="outline"
                  size="sm"
                >
                  5 min
                </Button>
                <Button 
                  onClick={() => handleSnooze(10)}
                  variant="outline"
                  size="sm"
                >
                  10 min
                </Button>
                <Button 
                  onClick={() => handleSnooze(15)}
                  variant="outline"
                  size="sm"
                >
                  15 min
                </Button>
              </div>
              
              <Button 
                onClick={handleDismiss}
                variant="outline"
                className="w-full"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
