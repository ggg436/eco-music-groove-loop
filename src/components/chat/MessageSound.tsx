
import { useEffect, useRef } from 'react';

interface MessageSoundProps {
  play: boolean;
  onPlayed: () => void;
}

const MessageSound = ({ play, onPlayed }: MessageSoundProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio('/message-notification.mp3');
      audioRef.current.volume = 0.5;
    }

    // Play sound when prop changes to true
    if (play && audioRef.current) {
      audioRef.current.play()
        .then(() => {
          onPlayed();
        })
        .catch(error => {
          console.error('Error playing notification sound:', error);
          onPlayed(); // Still call callback even if sound fails
        });
    }
  }, [play, onPlayed]);

  return null; // This component doesn't render anything
};

export default MessageSound;
