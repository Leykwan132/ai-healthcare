'use client';

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
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Page() {
    const searchParams = useSearchParams();
    const room = searchParams.get('room') || 'default-room';
    const name = searchParams.get('name') || 'anonymous-user';
    const [token, setToken] = useState<string | null>(null);
    const [roomInstance] = useState(() => new Room({
        // Optimize video quality for each participant's screen
        adaptiveStream: true,
        // Enable automatic audio/video quality optimization
        dynacast: true,
    }));

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const resp = await fetch(`/api/token?room=${room}&username=${name}`);
                const data = await resp.json();
                console.log('data', data);

                if (!mounted) return;
                setToken(data.token);
                if (data.token) {
                    await roomInstance.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, data.token);
                    const micTrack = await createLocalAudioTrack();
                    await roomInstance.localParticipant.publishTrack(micTrack);
                    console.log('Connected to livekit');
                }
            } catch (e) {
                console.error(e);
            }
        })();

        return () => {
            mounted = false;
            roomInstance.disconnect();
        };
    }, [roomInstance]);

    if (!token) {
        return <div>Getting token...</div>;
    }

    return (
        <RoomContext.Provider value={roomInstance}>
            <div data-lk-theme="default" style={{ height: '100dvh' }}>
                {/* Your custom component with basic video conferencing functionality. */}
                <MyVideoConference />
                {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
                <RoomAudioRenderer />
                {/* Controls for the user to start/stop audio, video, and screen share tracks */}
                <ControlBar />
            </div>
        </RoomContext.Provider>
    );
}

function MyVideoConference() {
    // `useTracks` returns all camera and screen share tracks. If a user
    // joins without a published camera track, a placeholder track is returned.
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );
    return (
        <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
            {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
            <ParticipantTile />
        </GridLayout>
    );
}