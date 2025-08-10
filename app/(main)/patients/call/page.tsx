"use client";

import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
} from '@livekit/components-react';
import { Room, Track, createLocalAudioTrack } from 'livekit-client';
import '@livekit/components-styles';
import { useEffect, useState, useMemo } from 'react';

const LoadingScreen = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    zIndex: 1000,
    fontSize: '1.5rem',
    fontFamily: 'sans-serif',
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '5px solid #f3f3f3',
      borderTop: '5px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '1rem',
    }}></div>
    <p>Connecting to follow-up agent...</p>
    <style jsx global>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      <ParticipantTile />
    </GridLayout>
  );
}

export default function PatientCallPage() {
  // Generate a unique room ID using timestamp and random string
  const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
  };

  // Memoize room and name to prevent regeneration on re-renders
  const room = useMemo(() => `room-${generateUniqueId()}`, []);
  const name = useMemo(() => `Ali-${generateUniqueId()}`, []);
  const [token, setToken] = useState<string | null>(null);
  const [showLoading, setShowLoading] = useState(true);
  const [roomInstance] = useState(() => new Room({
    // Optimize video quality for each participant's screen
    adaptiveStream: true,
    // Enable automatic audio/video quality optimization
    dynacast: true,
  }));

  // Hide loading screen after 3 seconds
  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [token]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await fetch(`/api/token?room=${room}&username=${name}`);
        const data = await resp.json();
        console.log('token data:', data);

        if (!mounted) return;
        setToken(data.token);

        if (data.token) {
          await roomInstance.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, data.token);
          const micTrack = await createLocalAudioTrack();
          await roomInstance.localParticipant.publishTrack(micTrack);
          console.log('Connected to LiveKit');
        }
      } catch (e) {
        console.error('Failed to connect to LiveKit:', e);
      }
    })();

    return () => {
      mounted = false;
      if (roomInstance.state === 'connected') {
        roomInstance.disconnect();
        console.log('Disconnected from LiveKit');
      }
    };
  }, [roomInstance, room, name]);

  if (!token) {
    return <div>Getting token...</div>;
  }

  return (
    <RoomContext.Provider value={roomInstance}>
      <div data-lk-theme="default" style={{ height: '100dvh', position: 'relative' }}>
        {showLoading && <LoadingScreen />}
        <div style={{
          opacity: showLoading ? 0.5 : 1,
          filter: showLoading ? 'blur(2px)' : 'none',
          transition: 'opacity 0.3s, filter 0.3s',
          height: '100%'
        }}>
          <MyVideoConference />
          <RoomAudioRenderer />
          <ControlBar />
        </div>
      </div>
    </RoomContext.Provider>
  );
}
