"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from "lucide-react";
import { animate } from "animejs";

interface Song {
  title: string;
  artist: string;
  url: string;
}

// Your playlist of favorite songs
const PLAYLIST: Song[] = [
  {
    title: "Passionfruit",
    artist: "Drake",
    url: "/Passionfruit_spotdown.org.mp3",
  },
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasAttemptedAutoplay, setHasAttemptedAutoplay] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSong = PLAYLIST[currentSongIndex];

  useEffect(() => {
    // Entrance animation
    if (containerRef.current) {
      animate(containerRef.current, {
        opacity: [0, 1],
        translateX: [50, 0],
        duration: 800,
        delay: 2000,
        ease: "outExpo",
      });
    }

    // Auto-play on mount
    if (!hasAttemptedAutoplay && audioRef.current && currentSong?.url) {
      setHasAttemptedAutoplay(true);
      audioRef.current.src = currentSong.url;
      audioRef.current.play().catch(() => {
        // Autoplay was blocked by browser, user will need to click play
        setIsPlaying(false);
      });
    }
  }, [hasAttemptedAutoplay, currentSong?.url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      // Auto-play next song
      setCurrentSongIndex((prev) => (prev + 1) % PLAYLIST.length);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && currentSong?.url) {
      audioRef.current.src = currentSong.url;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentSongIndex, currentSong?.url, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current || !currentSong?.url) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    animate(containerRef.current, {
      width: isExpanded ? [280, 56] : [56, 280],
      duration: 400,
      ease: "outExpo",
    });
  };

  // Don't render if no songs with URLs
  if (!PLAYLIST.some(song => song.url)) {
    return null;
  }

  return (
    <>
      <audio ref={audioRef} />
      <div
        ref={containerRef}
        className="fixed bottom-6 right-6 z-50 opacity-0"
      >
        <div
          className="relative overflow-hidden rounded-full border border-primary/30 bg-secondary/80 backdrop-blur-md"
          style={{ width: isExpanded ? 280 : 56, height: 56 }}
        >
          {/* Collapsed: Just music icon */}
          {!isExpanded ? (
            <button
              onClick={toggleExpand}
              className="flex h-14 w-14 items-center justify-center cursor-pointer bg-transparent border-none"
            >
              <Music className="h-5 w-5 text-primary" />
              {isPlaying && (
                <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-30" />
              )}
            </button>
          ) : (
            <div className="flex h-14 items-center gap-2 px-3">
              {/* Song info */}
              <div className="flex-1 min-w-0 mr-1">
                <p className="text-xs font-medium text-foreground truncate">
                  {currentSong?.title || "No song"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {currentSong?.artist || ""}
                </p>
                {/* Progress bar */}
                <div className="mt-1 h-0.5 w-full rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={prevSong}
                  className="p-1.5 cursor-pointer bg-transparent border-none text-muted-foreground hover:text-primary transition-colors"
                >
                  <SkipBack className="h-3.5 w-3.5" />
                </button>
                
                <button
                  onClick={togglePlay}
                  className="p-2 cursor-pointer bg-primary/20 hover:bg-primary/30 rounded-full border-none text-primary transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 ml-0.5" />
                  )}
                </button>
                
                <button
                  onClick={nextSong}
                  className="p-1.5 cursor-pointer bg-transparent border-none text-muted-foreground hover:text-primary transition-colors"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                </button>
                
                <button
                  onClick={toggleMute}
                  className="p-1.5 cursor-pointer bg-transparent border-none text-muted-foreground hover:text-primary transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="h-3.5 w-3.5" />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              {/* Collapse button */}
              <button
                onClick={toggleExpand}
                className="p-1 cursor-pointer bg-transparent border-none text-muted-foreground hover:text-primary transition-colors"
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
