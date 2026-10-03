import React, { useState, useRef, useEffect } from "react";
import {
  Music,
  Play,
  Pause,
  RotateCcw,
  Download,
  Sparkles,
  Sliders,
  Volume2,
  VolumeX,
  Radio,
  Clock,
  AlertCircle,
  RefreshCw,
  ListMusic,
  Disc
} from "lucide-react";

interface MusicGeneratorProps {
  isKeyReady: boolean;
  onOpenKeyGuide: () => void;
}

interface GeneratedTrack {
  id: string;
  title: string;
  prompt: string;
  audioUrl: string;
  audioBase64: string;
  mimeType: string;
  modelUsed: string;
  lyrics?: string;
  createdAt: string;
}

const BUSINESS_PRESETS = [
  {
    title: "☕ Artisanal Cafe & Bakery",
    description: "Warm fingerpicked acoustic guitar, soft upright bass, and mellow morning vibes.",
    genre: "Acoustic Folk / Indie Coffeehouse",
    tempo: "Relaxed (85 BPM)",
    mood: "Warm & Cozy",
    prompt: "A warm, sunlit morning acoustic guitar and light acoustic percussion instrumental track, evoking the smell of fresh coffee and pastries in a neighborhood bakery."
  },
  {
    title: "🛍️ Chic Boutique Storefront",
    description: "Sophisticated deep lounge house with smooth electric piano and gentle groove.",
    genre: "Chill Lounge / Deep House",
    tempo: "Moderate (115 BPM)",
    mood: "Chic & Modern",
    prompt: "An upbeat yet refined modern lounge track with subtle rhythmic house beats, warm Rhodes chords, and sophisticated synth pads suitable for high-end boutique retail shopping."
  },
  {
    title: "🍝 Italian Trattoria Dining",
    description: "Gentle classical guitar and melodic accordion evoking romantic Mediterranean dinner.",
    genre: "Mediterranean Instrumental",
    tempo: "Moderate (95 BPM)",
    mood: "Rustic & Romantic",
    prompt: "A charming traditional Mediterranean instrumental with gentle acoustic guitar, light accordion melody, and subtle mandolin accents for an authentic Italian dinner atmosphere."
  },
  {
    title: "⚡ Gym & Fitness Studio Promo",
    description: "Dynamic driving synthwave beat with high-energy rhythm for workouts and commercial reels.",
    genre: "Electronic / Synthwave",
    tempo: "Energetic (128 BPM)",
    mood: "Motivational & Powerful",
    prompt: "A high-energy, motivational electronic soundtrack with driving synth bass, punchy rhythm, and an uplifting commercial crescendo for a local gym social media ad."
  },
  {
    title: "📞 Friendly On-Hold Audio",
    description: "Reassuring, polite marimba and soft orchestral chords for telephone systems.",
    genre: "Corporate Ambient",
    tempo: "Steady (100 BPM)",
    mood: "Reassuring & Professional",
    prompt: "A friendly, polite and clear corporate instrumental with gentle wooden marimba, smooth strings, and reassuring acoustic rhythm designed for telephone hold music."
  },
  {
    title: "💆 Luxury Spa & Wellness Salon",
    description: "Ethereal ambient soundscape with singing bowls, bamboo flute, and soft chimes.",
    genre: "Ambient Meditation",
    tempo: "Slow & Freeform",
    mood: "Tranquil & Serene",
    prompt: "An ultra-peaceful ambient meditation soundscape with soft bamboo flute tones, distant crystal chimes, and calming warm drone harmony for massage and spa relaxation."
  }
];

export default function MusicGenerator({ isKeyReady, onOpenKeyGuide }: MusicGeneratorProps) {
  const [prompt, setPrompt] = useState(
    "A warm, sunlit morning acoustic guitar and light acoustic percussion instrumental track, evoking the smell of fresh coffee and pastries in a neighborhood bakery."
  );
  const [selectedModel, setSelectedModel] = useState<"lyria-3-clip-preview" | "lyria-3-pro-preview">("lyria-3-clip-preview");
  const [genre, setGenre] = useState("Acoustic Folk / Indie Coffeehouse");
  const [tempo, setTempo] = useState("Relaxed (85 BPM)");
  const [mood, setMood] = useState("Warm & Cozy");
  const [trackTitle, setTrackTitle] = useState("Bakery Morning Vibe");

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // History of generated tracks
  const [tracks, setTracks] = useState<GeneratedTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<GeneratedTrack | null>(null);

  // Audio Player state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Canvas visualizer
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 10);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrack]);

  // Handle Play / Pause
  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  // Canvas waveform visualizer animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let angle = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const bars = 36;
      const barWidth = width / bars;

      for (let i = 0; i < bars; i++) {
        let barHeight = 8;
        if (isPlaying) {
          const wave = Math.sin(angle + i * 0.35) * 0.5 + 0.5;
          barHeight = Math.max(6, wave * (height * 0.75));
        } else {
          barHeight = 6 + Math.sin(i * 0.4) * 4;
        }

        const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
        gradient.addColorStop(0, "#a855f7");
        gradient.addColorStop(1, "#6366f1");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(i * barWidth + 2, height - barHeight, barWidth - 4, barHeight, 2);
        ctx.fill();
      }

      if (isPlaying) {
        angle += 0.08;
      }
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  // Apply a preset
  const handleSelectPreset = (preset: typeof BUSINESS_PRESETS[0]) => {
    setPrompt(preset.prompt);
    setGenre(preset.genre);
    setTempo(preset.tempo);
    setMood(preset.mood);
    setTrackTitle(preset.title.replace(/^[^\w\s]+/, "").trim());
  };

  // Trigger Music Generation
  const handleGenerateMusic = async () => {
    if (!prompt.trim()) {
      setErrorMsg("Please enter a description for the music.");
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/music/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
          genre,
          tempo,
          mood,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "API_KEY_NOT_CONFIGURED") {
          setErrorMsg("Your Gemini API Key is not configured yet. Configure GEMINI_API_KEY in Secrets.");
          onOpenKeyGuide();
        } else {
          setErrorMsg(data.message || "Failed to generate music track.");
        }
      } else {
        // Convert base64 audio to Blob URL
        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: data.mimeType || "audio/wav" });
        const url = URL.createObjectURL(blob);

        const newTrack: GeneratedTrack = {
          id: `track-${Date.now()}`,
          title: trackTitle || "Local Business Track",
          prompt: data.prompt || prompt,
          audioUrl: url,
          audioBase64: data.audioBase64,
          mimeType: data.mimeType || "audio/wav",
          modelUsed: data.modelUsed || selectedModel,
          lyrics: data.lyrics,
          createdAt: new Date().toLocaleTimeString(),
        };

        setTracks((prev) => [newTrack, ...prev]);
        setCurrentTrack(newTrack);
        setIsPlaying(true);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(console.error);
          }
        }, 100);
      }
    } catch (err: any) {
      console.error("Music generation request failed:", err);
      setErrorMsg(err.message || "Network request failed while generating music.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadTrack = (track: GeneratedTrack) => {
    const a = document.createElement("a");
    a.href = track.audioUrl;
    a.download = `${track.title.toLowerCase().replace(/\s+/g, "-")}.wav`;
    a.click();
  };

  const formatSec = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">AI Business Music Studio</h2>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
                  Lyria Music Models
                </span>
              </div>
              <p className="text-xs text-slate-450 mt-0.5">
                Generate original custom soundtracks for local shop atmosphere, video advertisements, social media reels, or telephone hold lines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isKeyReady && (
              <button
                onClick={onOpenKeyGuide}
                className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Configure Key
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Controls vs Audio Player / Library */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Preset Selector & Prompt Config */}
        <div className="lg:col-span-6 space-y-4">
          {/* Quick Business Presets */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-400" />
                Local Business Music Presets
              </h3>
              <span className="text-[11px] text-slate-500">Pick a vibe</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BUSINESS_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectPreset(preset)}
                  className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-purple-500/40 text-left text-xs transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-200 group-hover:text-purple-300">
                      {preset.title}
                    </div>
                    <div className="text-[11px] text-slate-450 line-clamp-2 mt-1 leading-snug">
                      {preset.description}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{preset.genre.split("/")[0]}</span>
                    <span>{preset.tempo.split(" ")[0]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt & Fine-Tuning */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              Custom Sound Specification
            </h3>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Track Name / Purpose
              </label>
              <input
                type="text"
                value={trackTitle}
                onChange={(e) => setTrackTitle(e.target.value)}
                placeholder="e.g. Morning Coffeehouse Atmosphere"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Music Prompt & Instruments
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
                placeholder="Describe instruments, rhythm, atmosphere..."
              />
            </div>

            {/* Model & Duration Selector */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Model & Duration
                </label>
                <select
                  value={selectedModel}
                  onChange={(e: any) => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="lyria-3-clip-preview">Lyria Clip (30s Short Clip)</option>
                  <option value="lyria-3-pro-preview">Lyria Pro (Full Length Track)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Tempo / Rhythm
                </label>
                <select
                  value={tempo}
                  onChange={(e) => setTempo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="Relaxed (80-90 BPM)">Relaxed / Chill (85 BPM)</option>
                  <option value="Moderate (100-115 BPM)">Moderate Groovy (110 BPM)</option>
                  <option value="Energetic (125-135 BPM)">Energetic Upbeat (128 BPM)</option>
                  <option value="Slow & Meditative">Slow & Meditative</option>
                </select>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-rose-950/30 border border-rose-900/50 rounded-xl p-3 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMsg}</div>
              </div>
            )}

            <button
              onClick={handleGenerateMusic}
              disabled={isGenerating}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                isGenerating
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-950/40 hover:scale-[1.01]"
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Audio via Lyria...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Business Music Track</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Active Player & Library */}
        <div className="lg:col-span-6 space-y-4">
          {/* Active Audio Player Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Disc className={`w-4 h-4 text-purple-400 ${isPlaying ? "animate-spin" : ""}`} />
                <h3 className="text-sm font-semibold text-slate-200">
                  {currentTrack ? currentTrack.title : "Studio Audio Player"}
                </h3>
              </div>

              {currentTrack && (
                <button
                  onClick={() => handleDownloadTrack(currentTrack)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .wav</span>
                </button>
              )}
            </div>

            {/* Hidden native audio element */}
            {currentTrack && (
              <audio ref={audioRef} src={currentTrack.audioUrl} />
            )}

            {/* Canvas Waveform Visualizer */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[120px] relative">
              <canvas
                ref={canvasRef}
                width={360}
                height={80}
                className="w-full h-20 max-w-sm"
              />
              {!currentTrack && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
                  No track loaded. Generate music or select one from history below.
                </div>
              )}
            </div>

            {/* Track metadata badge */}
            {currentTrack && (
              <div className="text-xs text-slate-450 line-clamp-2 italic">
                "{currentTrack.prompt}"
              </div>
            )}

            {/* Scrubber & Duration */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={duration || 10}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                disabled={!currentTrack}
                className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>{formatSec(currentTime)}</span>
                <span>{formatSec(duration || 10)}</span>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  disabled={!currentTrack}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    !currentTrack
                      ? "bg-slate-900 text-slate-600 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950/40"
                  }`}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <button
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = 0;
                      setCurrentTime(0);
                    }
                  }}
                  disabled={!currentTrack}
                  className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Restart Track"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 max-w-[140px]">
                <button
                  onClick={toggleMute}
                  className="text-slate-450 hover:text-slate-200 transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-purple-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Generated Tracks Library */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <ListMusic className="w-4 h-4 text-purple-400" />
                Track Library ({tracks.length})
              </h3>
              <span className="text-[11px] text-slate-500">Session saved</span>
            </div>

            {tracks.length > 0 ? (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    onClick={() => {
                      setCurrentTrack(track);
                      setIsPlaying(true);
                      setTimeout(() => {
                        if (audioRef.current) audioRef.current.play().catch(console.error);
                      }, 50);
                    }}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      currentTrack?.id === track.id
                        ? "bg-purple-950/20 border-purple-500/40 text-purple-200"
                        : "bg-slate-900/50 hover:bg-slate-900 border-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                        {currentTrack?.id === track.id && isPlaying ? (
                          <Pause className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Play className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="font-medium truncate">{track.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {track.modelUsed} • {track.createdAt}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadTrack(track);
                      }}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
                      title="Download audio"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500 space-y-1">
                <Music className="w-6 h-6 mx-auto text-slate-600 mb-1" />
                <p>No tracks generated in this session yet.</p>
                <p className="text-[11px] text-slate-600">
                  Select a business preset on the left to start generating.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
