import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
} from "lucide-react";

const TRACKS = [
  {
    id: 1,
    title: "Neon Drift (AI Gen)",
    artist: "SynthMind",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12",
  },
  {
    id: 2,
    title: "Cybernetic Pulse (AI Gen)",
    artist: "NeuralBeats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05",
  },
  {
    id: 3,
    title: "Digital Horizon (AI Gen)",
    artist: "AlgoRhythm",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44",
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-black/60 border border-neon-blue/40 rounded-xl p-6 backdrop-blur-md shadow-[0_0_30px_rgba(0,255,255,0.15)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full bg-neon-blue/10 ${isPlaying ? "animate-pulse" : ""}`}
          >
            <Music className="w-5 h-5 text-neon-blue drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm truncate w-48 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
              {currentTrack.title}
            </h3>
            <p className="text-neon-pink text-xs font-mono drop-shadow-[0_0_5px_rgba(255,0,255,0.5)]">
              {currentTrack.artist}
            </p>
          </div>
        </div>
        <button
          onClick={toggleMute}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 w-full bg-gray-800 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-neon-blue to-neon-pink shadow-[0_0_10px_rgba(255,0,255,0.8)] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={handlePrev}
          className="text-gray-400 hover:text-neon-blue hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all"
        >
          <SkipBack className="w-6 h-6" fill="currentColor" />
        </button>

        <button
          onClick={togglePlay}
          className="w-14 h-14 flex items-center justify-center bg-transparent border-2 border-neon-pink rounded-full text-neon-pink hover:bg-neon-pink hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,0,255,0.4)] hover:shadow-[0_0_25px_rgba(255,0,255,0.8)]"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 ml-0.5" fill="currentColor" />
          ) : (
            <Play className="w-6 h-6 ml-1" fill="currentColor" />
          )}
        </button>

        <button
          onClick={handleNext}
          className="text-gray-400 hover:text-neon-blue hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all"
        >
          <SkipForward className="w-6 h-6" fill="currentColor" />
        </button>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
      />
    </div>
  );
}
