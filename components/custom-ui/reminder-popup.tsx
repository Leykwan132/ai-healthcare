"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Clock } from "lucide-react";
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
  const [soundInterval, setSoundInterval] = useState<NodeJS.Timeout | null>(null);
  const [activeOscillators, setActiveOscillators] = useState<OscillatorNode[]>([]);

  useEffect(() => {
    if (isOpen && event) {
      // Start playing notification sound in a loop
      startNotificationLoop();
      
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

    // Cleanup when component unmounts or popup closes
    return () => {
      stopNotificationLoop();
    };
  }, [isOpen, event]);

  const startNotificationLoop = () => {
    setIsPlaying(true);
    
    // Play sound immediately
    playNotificationSound();
    
    // Set up interval to repeat the sound every 3 seconds
    const interval = setInterval(() => {
      playNotificationSound();
    }, 3000);
    
    setSoundInterval(interval);
  };

  const stopNotificationLoop = () => {
    setIsPlaying(false);
    
    // Clear the interval
    if (soundInterval) {
      clearInterval(soundInterval);
      setSoundInterval(null);
    }
    
    // Stop all active oscillators immediately
    activeOscillators.forEach(oscillator => {
      try {
        oscillator.stop();
        oscillator.disconnect();
      } catch (error) {
        // Oscillator might already be stopped
      }
    });
    setActiveOscillators([]);
    
    // Close audio context
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close();
      setAudioContext(null);
    }
  };

  const playNotificationSound = async () => {
    try {
      console.log('Playing notification sound...');
      
      // Use existing audio context or create new one
      let context = audioContext;
      if (!context || context.state === 'closed') {
        context = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(context);
      }
      
      // Resume audio context if it's suspended (browser requirement)
      if (context.state === 'suspended') {
        await context.resume();
      }
      
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      // Create a more attention-grabbing sound pattern
      oscillator.frequency.setValueAtTime(800, context.currentTime);
      oscillator.frequency.setValueAtTime(1000, context.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, context.currentTime + 0.2);
      oscillator.frequency.setValueAtTime(1000, context.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.6);
      
      // Track this oscillator so we can stop it later
      setActiveOscillators(prev => [...prev, oscillator]);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.6);
      
      // Remove oscillator from tracking after it ends
      oscillator.onended = () => {
        setActiveOscillators(prev => prev.filter(osc => osc !== oscillator));
      };
      
      console.log('Sound playing...');
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  };


  const handleSnooze = (minutes: number) => {
    // Stop the notification loop
    stopNotificationLoop();
    onSnooze?.(minutes);
    onClose();
  };

  const handleProceed = () => {
    // Stop the notification loop
    stopNotificationLoop();
    onProceed?.();
    onClose();
  };

  const handleDismiss = () => {
    // Stop the notification loop
    stopNotificationLoop();
    onClose();
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <Card className="w-96 bg-white shadow-2xl animate-slideUp">
        <CardHeader className="bg-blue-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Bell className={`w-6 h-6 ${isPlaying ? 'animate-bounce' : ''}`} />
            Medication Reminder
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
