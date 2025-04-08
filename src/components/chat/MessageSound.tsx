
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
      
      // Add event listener to handle when sound finishes playing
      audioRef.current.addEventListener('ended', onPlayed);
    }

    // Play sound when prop changes to true
    if (play && audioRef.current) {
      // Reset the audio to the beginning before playing
      audioRef.current.currentTime = 0;
      
      // Try playing the sound with better error handling
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .catch(error => {
            console.error('Error playing notification sound:', error);
            // Still call the callback even if sound fails to play
            // This prevents the sound from getting stuck in a "playing" state
            onPlayed();
          });
      }
    }
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', onPlayed);
        audioRef.current.pause();
      }
    };
  }, [play, onPlayed]);

  return null; // This component doesn't render anything
};

export default MessageSound;
