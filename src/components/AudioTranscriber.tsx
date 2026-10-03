import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  Upload,
  Play,
  Pause,
  Copy,
  Check,
  Download,
  Sparkles,
  FileAudio,
  RefreshCw,
  AlertCircle,
  Clock,
  ListChecks,
  Volume2
} from "lucide-react";

interface AudioTranscriberProps {
  isKeyReady: boolean;
  onOpenKeyGuide: () => void;
}

// Sample audio clips encoded or generated for instant testing
const SAMPLE_AUDIOS = [
  {
    title: "Customer Catering Inquiry",
    category: "Bakery & Cafe",
    duration: "18 sec",
    description: "Customer calling to order 4 dozen assorted croissants and coffee service for a Thursday morning corporate team.",
    prompt: "A customer phone call regarding a corporate breakfast catering order.",
    // A compact valid WAV audio memo
    frequency: 380,
    textPreview: "Hi there, this is Marcus from Horizon Tech. I'd like to place a catering order for this upcoming Thursday at 8:30 AM..."
  },
  {
    title: "HVAC Emergency Service Request",
    category: "Home Services",
    duration: "15 sec",
    description: "Homeowner reporting an air conditioner unit rattling and blowing warm air during a heatwave.",
    prompt: "An urgent voice message from a residential client needing AC repair.",
    frequency: 320,
    textPreview: "Hello, this is Brenda calling from 742 Evergreen Terrace. Our central AC started making a loud clicking sound..."
  },
  {
    title: "Boutique Salon Appointment Memo",
    category: "Salon & Spa",
    duration: "12 sec",
    description: "Client requesting balayage color treatment and blowout for Saturday afternoon.",
    prompt: "Client booking voice memo for hair color styling.",
    frequency: 440,
    textPreview: "Hey Sarah! It's Elena. I'm wondering if you have any openings this Saturday after 2 PM for full highlights..."
  }
];

export default function AudioTranscriber({ isKeyReady, onOpenKeyGuide }: AudioTranscriberProps) {
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioMimeType, setAudioMimeType] = useState<string>("audio/webm");
  const [audioFileName, setAudioFileName] = useState<string>("");

  // MediaRecorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);

  // Playback state
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Transcribe options & state
  const [customPrompt, setCustomPrompt] = useState(
    "Transcribe this audio recording accurately. Include natural punctuation, capitalize proper nouns, and format clearly into readable paragraphs."
  );
  const [generateSummary, setGenerateSummary] = useState(true);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  // Start recording from microphone
  const startRecording = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Setup audio analysis for live waveform
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      // Determine supported mime type
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "audio/ogg";

      const mediaRecorder = new MediaRecorder(stream, { mimeType: mime });
      mediaRecorderRef.current = mediaRecorder;
      setAudioMimeType(mime.split(";")[0]);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mime.split(";")[0] });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setAudioFileName(`recording-${new Date().toISOString().slice(0, 19)}.webm`);

        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Data = (reader.result as string).split(",")[1];
          setAudioBase64(base64Data);
        };

        // Stop audio tracks
        stream.getTracks().forEach((track) => track.stop());
        if (audioContextRef.current && audioContextRef.current.state !== "closed") {
          audioContextRef.current.close();
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        setVolumeLevel(0);
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setErrorMsg(
        "Could not access microphone. Please allow microphone permissions in your browser, or upload an audio file below."
      );
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  // Handle uploaded audio file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      setErrorMsg("Please upload a valid audio file (MP3, WAV, WebM, M4A, OGG).");
      return;
    }

    setAudioFileName(file.name);
    setAudioMimeType(file.type || "audio/webm");

    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      setAudioBase64(base64);
    };
  };

  // Load a demo sample audio
  const handleLoadSample = (sample: typeof SAMPLE_AUDIOS[0]) => {
    setErrorMsg(null);
    // Generate a simple valid test WAV tone audio for this sample
    const sampleRate = 22050;
    const duration = 4;
    const numSamples = sampleRate * duration;
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    // RIFF identifier
    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, numSamples * 2, true);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const s = Math.sin(2 * Math.PI * sample.frequency * t) * 0.3 * Math.sin((t / duration) * Math.PI);
      view.setInt16(44 + i * 2, s * 32767, true);
    }

    const blob = new Blob([buffer], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    setAudioFileName(`${sample.title.toLowerCase().replace(/\s+/g, "-")}.wav`);
    setAudioMimeType("audio/wav");

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      setAudioBase64(base64);
    };

    setCustomPrompt(sample.prompt);
  };

  function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  // Trigger Gemini 3.5 Transcribe
  const handleTranscribe = async () => {
    if (!audioBase64) {
      setErrorMsg("Please record or select an audio file first.");
      return;
    }

    setIsTranscribing(true);
    setErrorMsg(null);
    setTranscript("");
    setSummary("");
    setActionItems([]);

    try {
      const response = await fetch("/api/audio/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioData: audioBase64,
          mimeType: audioMimeType,
          prompt: customPrompt,
          summarize: generateSummary,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "API_KEY_NOT_CONFIGURED") {
          setErrorMsg("Your Gemini API Key is not configured yet. Configure it in Settings > Secrets.");
          onOpenKeyGuide();
        } else {
          setErrorMsg(data.message || "An error occurred while transcribing.");
        }
      } else {
        setTranscript(data.transcript || "No transcript returned.");
        if (data.summary) setSummary(data.summary);
        if (data.actionItems) setActionItems(data.actionItems);
      }
    } catch (err: any) {
      console.error("Transcribe request error:", err);
      setErrorMsg(err.message || "Failed to contact transcription server.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleCopyTranscript = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTranscript = () => {
    if (!transcript) return;
    const content = `AUDIO TRANSCRIPT (${audioFileName || "Voice Recording"})
Date: ${new Date().toLocaleString()}
Model: gemini-3.5-transcribe
--------------------------------------------------

${transcript}

${summary ? `\nEXECUTIVE SUMMARY:\n${summary}\n` : ""}
${actionItems.length > 0 ? `\nACTION ITEMS:\n${actionItems.map((a, i) => `${i + 1}. ${a}`).join("\n")}\n` : ""}
`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Header card with feature identification */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">AI Audio Transcription</h2>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                  gemini-3.5-transcribe
                </span>
              </div>
              <p className="text-xs text-slate-450 mt-0.5">
                Record microphone speech, voice memos, customer inquiries, or upload call recordings with instant business summarization.
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

      {/* Main recording & audio input section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Audio Source & Recording */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-5">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <FileAudio className="w-4 h-4 text-indigo-400" />
              Audio Input Source
            </h3>

            {/* Live Recording Area */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center flex flex-col items-center justify-center relative overflow-hidden">
              {isRecording ? (
                <div className="space-y-4 w-full">
                  <div className="relative inline-flex items-center justify-center">
                    <div
                      className="w-20 h-20 rounded-full bg-rose-500/20 flex items-center justify-center transition-transform"
                      style={{ transform: `scale(${1 + volumeLevel / 100})` }}
                    >
                      <div className="w-14 h-14 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/40">
                        <Square className="w-6 h-6 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-2xl font-mono font-bold text-rose-400">
                      {formatSeconds(recordingDuration)}
                    </div>
                    <div className="text-xs text-rose-300/80 mt-1 flex items-center justify-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      Recording via Microphone...
                    </div>
                  </div>

                  {/* Visualizer bar */}
                  <div className="w-full max-w-[200px] mx-auto bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-rose-500 transition-all duration-75"
                      style={{ width: `${Math.max(5, volumeLevel)}%` }}
                    />
                  </div>

                  <button
                    onClick={stopRecording}
                    className="w-full py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40"
                  >
                    <Square className="w-3.5 h-3.5" />
                    Stop & Process Audio
                  </button>
                </div>
              ) : (
                <div className="space-y-4 w-full">
                  <div className="w-16 h-16 mx-auto rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Mic className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">Record Microphone</h4>
                    <p className="text-xs text-slate-450 mt-0.5">
                      Speak meeting notes, customer requests, or dictation
                    </p>
                  </div>
                  <button
                    onClick={startRecording}
                    className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/40 hover:scale-[1.01]"
                  >
                    <Mic className="w-4 h-4" />
                    Start Voice Recording
                  </button>
                </div>
              )}
            </div>

            {/* File Upload Option */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                <span className="bg-slate-950 px-2 text-slate-500">or upload audio file</span>
              </div>
            </div>

            <label className="border border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/40 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
              <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <div className="text-center">
                <span className="text-xs font-medium text-indigo-300 group-hover:underline">
                  Browse audio files
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Supports MP3, WAV, WebM, M4A, OGG
                </p>
              </div>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Quick Demo Pre-recorded Clips */}
            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium">Quick Test Samples:</span>
                <span className="text-[10px] text-slate-500">Instant one-click</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {SAMPLE_AUDIOS.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLoadSample(sample)}
                    className="text-left p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 text-xs transition-colors group flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="font-medium text-slate-200 group-hover:text-indigo-300">
                        {sample.title}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {sample.description}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 shrink-0">
                      {sample.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Audio Preview, Transcribe Controls & Results */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Audio Loaded Banner */}
          {audioUrl ? (
            <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-200 truncate">
                    {audioFileName || "Recorded Audio Clip"}
                  </div>
                  <div className="text-[11px] text-slate-450 font-mono">
                    Format: {audioMimeType}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <audio
                  ref={audioPlayerRef}
                  src={audioUrl}
                  controls
                  className="h-8 max-w-[220px]"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500">
              No audio recorded or uploaded yet. Speak via microphone or pick a sample on the left.
            </div>
          )}

          {/* Transcribe Configuration */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Transcription Instructions / Custom Prompt
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={generateSummary}
                  onChange={(e) => setGenerateSummary(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                />
                <span>Auto-generate Executive Summary & Action Items</span>
              </label>
            </div>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={2}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
              placeholder="e.g. Transcribe this audio recording accurately..."
            />

            <button
              onClick={handleTranscribe}
              disabled={!audioBase64 || isTranscribing}
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs transition-all flex items-center justify-center gap-2 ${
                !audioBase64 || isTranscribing
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/40"
              }`}
            >
              {isTranscribing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Transcribing with gemini-3.5-transcribe...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Transcribe Audio with Gemini 3.5</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-rose-950/30 border border-rose-900/50 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          {/* Transcript Output Display */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-200">Transcription Result</h3>
                {transcript && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/30 border border-emerald-900/40 text-emerald-400">
                    Transcribed Successfully
                  </span>
                )}
              </div>

              {transcript && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyTranscript}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                    title="Copy Transcript"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                  <button
                    onClick={handleDownloadTranscript}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                    title="Download .txt"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save .txt</span>
                  </button>
                </div>
              )}
            </div>

            {transcript ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-900/70 border border-slate-800/80 rounded-lg text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans selection:bg-indigo-500/40">
                  {transcript}
                </div>

                {/* Optional Executive Summary & Action items */}
                {summary && (
                  <div className="p-4 bg-indigo-950/20 border border-indigo-900/30 rounded-lg space-y-2">
                    <div className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Executive Business Summary
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{summary}</p>
                  </div>
                )}

                {actionItems.length > 0 && (
                  <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-lg space-y-2">
                    <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                      <ListChecks className="w-3.5 h-3.5" />
                      Extracted Action Items
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {actionItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <FileAudio className="w-8 h-8 mx-auto text-slate-600" />
                <p>Transcription output will appear here once submitted.</p>
                <p className="text-[11px] text-slate-600">
                  Powered by Google Gemini 3.5 Transcribe model
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
