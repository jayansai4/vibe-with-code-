import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "Synthwave Algorithmic 1",
    artist: "AI SoundHelix",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12"
  },
  {
    id: 2,
    title: "Cyberpunk Generator 2",
    artist: "AI SoundHelix",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05"
  },
  {
    id: 3,
    title: "Neon Pulse Algorithm 3",
    artist: "AI SoundHelix",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.warn("Autoplay blocked:", e);
          setIsPlaying(false);
        });
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
      setProgress(duration > 0 ? (current / duration) * 100 : 0);
    }
  };

  const onEnded = () => {
    handleNext();
  };

  return (
    <div className="w-full max-w-sm bg-slate-900/80 backdrop-blur-md border border-fuchsia-500/50 rounded-xl p-6 shadow-[0_0_20px_rgba(217,70,239,0.15)] flex flex-col gap-4">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnded}
      />
      
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg bg-zinc-800 border border-cyan-500/50 flex items-center justify-center box-glow-cyan overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-fuchsia-500/20 mix-blend-overlay"></div>
          <Music className="text-cyan-400 w-8 h-8" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-fuchsia-400 font-bold truncate text-glow-fuchsia text-lg">{currentTrack.title}</h3>
          <p className="text-cyan-600 text-sm truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between text-slate-300 mt-2">
        <Volume2 className="w-5 h-5 text-cyan-700" />
        <div className="flex items-center gap-4">
          <button onClick={handlePrev} className="hover:text-cyan-400 transition-colors focus:outline-none">
            <SkipBack className="w-6 h-6" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-slate-800 border border-fuchsia-500/50 flex items-center justify-center text-fuchsia-400 hover:bg-slate-700 hover:text-fuchsia-300 hover:border-fuchsia-400 transition-all focus:outline-none shadow-[0_0_15px_rgba(217,70,239,0.3)]"
          >
            {isPlaying ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6 ml-1" fill="currentColor" />}
          </button>
          <button onClick={handleNext} className="hover:text-cyan-400 transition-colors focus:outline-none">
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
        <div className="text-xs text-slate-500 font-mono tracking-widest">
          {currentTrack.duration}
        </div>
      </div>
    </div>
  );
}
