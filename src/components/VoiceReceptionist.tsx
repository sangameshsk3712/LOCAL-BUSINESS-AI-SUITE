import React, { useState, useEffect, useRef } from "react";
import {
  PhoneCall,
  PhoneForwarded,
  PhoneOff,
  Mic,
  Volume2,
  VolumeX,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Bot,
  User,
  Settings,
  Send,
  Play,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Headphones,
  Sliders
} from "lucide-react";
import { VoiceReceptionistConfig, VoiceCallRecord } from "../types";

interface VoiceReceptionistProps {
  isKeyReady: boolean;
  onOpenKeyGuide: () => void;
  onSaveToWorkspace?: (title: string, type: any, data: any) => void;
}

const DEFAULT_CONFIG: VoiceReceptionistConfig = {
  businessName: "Artisan Roast Cafe & Franchise Group",
  greetingMessage:
    "Thank you for calling Artisan Roast Cafe. Please note this call may be recorded for quality, reservation confirmation, and service training. How may I assist your visit today?",
  consentDisclaimer:
    "This call may be recorded for quality and reservation confirmation.",
  voiceGender: "female",
  voiceSpeed: 1.0,
  transferPhoneNumber: "8431107332",
  enableConsentRecording: true,
  telephonyProvider: "Twilio TwiML",
  webhookUrl: "https://your-domain.run.app/api/voice-receptionist/respond",
};

const DEFAULT_CALL_LOGS: VoiceCallRecord[] = [
  {
    id: "call-1",
    callerNumber: "+91 98451 99881",
    callerName: "Pooja Hegde",
    durationSec: 48,
    timestamp: "Today, 11:20 AM",
    consentAcknowledged: true,
    intent: "Booking / Reservation",
    leadCaptured: true,
    transferredToHuman: false,
    transcript: [
      { speaker: "AI Receptionist", text: "Thank you for calling Artisan Roast Cafe. Please note this call may be recorded for quality and reservation management. How may I assist your visit today?", time: "0:02" },
      { speaker: "Caller", text: "Hi, I want to book a table for 4 people tonight around 8 PM. Do you have outdoor seating?", time: "0:12" },
      { speaker: "AI Receptionist", text: "Yes! We have cozy outdoor terrace seating. I have noted a table for 4 at 8:00 PM under your number (+91 98451 99881). Our team will confirm via WhatsApp.", time: "0:24" },
    ],
    summary: "Reserved outdoor table for 4 at 8 PM. Phone lead captured.",
  },
  {
    id: "call-2",
    callerNumber: "+91 98200 11223",
    callerName: "Karthik Nair",
    durationSec: 32,
    timestamp: "Today, 09:45 AM",
    consentAcknowledged: true,
    intent: "Human Escalation",
    leadCaptured: true,
    transferredToHuman: true,
    transcript: [
      { speaker: "AI Receptionist", text: "Thank you for calling Artisan Roast Cafe. How may I assist you today?", time: "0:02" },
      { speaker: "Caller", text: "I need to speak directly with the store owner or manager regarding a corporate order.", time: "0:09" },
      { speaker: "AI Receptionist", text: "I will transfer you immediately to Founder Sangamesh Khatge at 8431107332. Connecting now!", time: "0:18" },
    ],
    summary: "Corporate client transferred to Founder Sangamesh (+91 8431107332).",
  },
];

export default function VoiceReceptionist({
  isKeyReady,
  onOpenKeyGuide,
  onSaveToWorkspace,
}: VoiceReceptionistProps) {
  const [config, setConfig] = useState<VoiceReceptionistConfig>(() => {
    try {
      const saved = localStorage.getItem("lbs_voice_config");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CONFIG;
  });

  const [callLogs, setCallLogs] = useState<VoiceCallRecord[]>(() => {
    try {
      const saved = localStorage.getItem("lbs_voice_call_logs");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CALL_LOGS;
  });

  // Active call simulator states
  const [isCallActive, setIsCallActive] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [callerInput, setCallerInput] = useState("");
  const [currentCallTranscript, setCurrentCallTranscript] = useState<
    { speaker: "Caller" | "AI Receptionist"; text: string; time: string }[]
  >([]);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [lastCallIntent, setLastCallIntent] = useState<string>("Ready");
  const [transferredStatus, setTransferredStatus] = useState<boolean>(false);
  const [voiceAudioMuted, setVoiceAudioMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<"simulator" | "telephony" | "history">("simulator");
  const [copiedTwiml, setCopiedTwiml] = useState(false);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    localStorage.setItem("lbs_voice_config", JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem("lbs_voice_call_logs", JSON.stringify(callLogs));
  }, [callLogs]);

  // Handle call timer
  useEffect(() => {
    if (isCallActive) {
      timerRef.current = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallTimer(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCallActive]);

  // Web Speech Synthesis speak function
  const speakText = (text: string) => {
    if (voiceAudioMuted || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = config.voiceSpeed || 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error", e);
    }
  };

  // Start Incoming Simulated Call
  const handleStartCall = async () => {
    setIsCallActive(true);
    setTransferredStatus(false);
    setLastCallIntent("Greeting & Consent");
    const initialTranscript: { speaker: "Caller" | "AI Receptionist"; text: string; time: string }[] = [
      {
        speaker: "AI Receptionist",
        text: config.greetingMessage,
        time: "0:01",
      },
    ];
    setCurrentCallTranscript(initialTranscript);
    speakText(config.greetingMessage);
  };

  // Hang Up Simulated Call
  const handleEndCall = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (currentCallTranscript.length > 1) {
      const newRecord: VoiceCallRecord = {
        id: `call-${Date.now()}`,
        callerNumber: "+91 98451 " + Math.floor(10000 + Math.random() * 90000),
        callerName: "Live Simulated Caller",
        durationSec: callTimer,
        timestamp: "Just now",
        consentAcknowledged: true,
        intent: lastCallIntent as any,
        leadCaptured: currentCallTranscript.some((t) => /\d{10}/.test(t.text)),
        transferredToHuman: transferredStatus,
        transcript: currentCallTranscript,
        summary: `Call lasted ${callTimer}s. Intent: ${lastCallIntent}. ${
          transferredStatus ? "Transferred to Founder." : "Handled autonomously."
        }`,
      };
      setCallLogs((prev) => [newRecord, ...prev]);
    }
    setIsCallActive(false);
    setCurrentCallTranscript([]);
  };

  // Caller sends a message/spoken utterance
  const handleSendCallerMessage = async (textToSend?: string) => {
    const text = textToSend || callerInput;
    if (!text.trim() || !isCallActive) return;

    const formattedTime = `0:${callTimer < 10 ? "0" : ""}${callTimer}`;
    const updatedTranscript = [
      ...currentCallTranscript,
      { speaker: "Caller" as const, text: text.trim(), time: formattedTime },
    ];
    setCurrentCallTranscript(updatedTranscript);
    setCallerInput("");
    setIsProcessingVoice(true);

    try {
      const res = await fetch("/api/voice-receptionist/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callerMessage: text.trim(),
          callHistory: updatedTranscript,
          config,
          isFirstTurn: false,
        }),
      });

      const data = await res.json();
      if (res.ok && data.aiVoiceReply) {
        const replyTime = `0:${callTimer + 2 < 10 ? "0" : ""}${callTimer + 2}`;
        setCurrentCallTranscript((prev) => [
          ...prev,
          { speaker: "AI Receptionist", text: data.aiVoiceReply, time: replyTime },
        ]);
        setLastCallIntent(data.intent || "General");
        if (data.transferToHuman) {
          setTransferredStatus(true);
        }
        speakText(data.aiVoiceReply);
      }
    } catch (err) {
      console.error("Voice receptionist error", err);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const sampleCallerUtterances = [
    "What are your opening hours today?",
    "I would like to book a table for 6 people tonight.",
    "Can you tell me the price of your artisan sourdough bread?",
    "I need to speak directly with the store owner Sangamesh right now.",
    "My phone number is 9845112345, please confirm my booking.",
  ];

  const twimlSnippet = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Twilio / Exotel Voice Webhook TwiML -->
<Response>
  <Say voice="Polly.Aditi" language="en-IN">
    ${config.greetingMessage}
  </Say>
  <Gather input="speech" action="${config.webhookUrl}" method="POST" timeout="3">
    <Say>Please speak your inquiry or state if you need to speak with Founder Sangamesh.</Say>
  </Gather>
  <!-- Fallback call transfer to Founder Sangamesh Khatge -->
  <Dial>+91${config.transferPhoneNumber}</Dial>
</Response>`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 shrink-0">
              <PhoneCall className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Consent-Aware Voice Telephony
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  Transfers to Founder: +91 {config.transferPhoneNumber}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                AI Voice Receptionist & Call Routing
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Answers incoming customer phone calls, announces recording consent, resolves FAQs, books reservations, and transfers to a human when needed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVoiceAudioMuted(!voiceAudioMuted)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                voiceAudioMuted
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750"
              }`}
              title="Toggle browser audio voice"
            >
              {voiceAudioMuted ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{voiceAudioMuted ? "Voice Audio Muted" : "Voice Audio ON"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("simulator")}
          className={`text-xs px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
            activeTab === "simulator"
              ? "bg-cyan-600 text-white shadow-sm"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Interactive Call Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab("telephony")}
          className={`text-xs px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
            activeTab === "telephony"
              ? "bg-cyan-600 text-white shadow-sm"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Telephony & Webhook Setup</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`text-xs px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
            activeTab === "history"
              ? "bg-cyan-600 text-white shadow-sm"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Call History Logs ({callLogs.length})</span>
        </button>
      </div>

      {/* VIEW 1: LIVE CALL SIMULATOR */}
      {activeTab === "simulator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Phone Handset Simulator */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCallActive ? "bg-emerald-500/20 text-emerald-400 animate-pulse" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {isCallActive ? "Call in Progress..." : "Virtual Business Phone"}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {isCallActive ? `Duration: 0:${callTimer < 10 ? "0" : ""}${callTimer}` : "Line Idle • Ready for calls"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isCallActive ? (
                    <button
                      onClick={handleStartCall}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Start Test Call</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleEndCall}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-all"
                    >
                      <PhoneOff className="w-3.5 h-3.5" />
                      <span>End Call</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Mandatory Consent Recording Alert */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] leading-snug">
                  <strong>Consent-Aware Audio Policy:</strong> The receptionist explicitly states: <em>"{config.consentDisclaimer}"</em> upon pickup.
                </span>
              </div>

              {/* Live Call Dialogue Box */}
              <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 min-h-[280px] max-h-[340px] overflow-y-auto space-y-3">
                {currentCallTranscript.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-2">
                    <PhoneCall className="w-8 h-8 text-slate-600" />
                    <p className="text-xs">Click "Start Test Call" to simulate an incoming customer phone call.</p>
                  </div>
                ) : (
                  currentCallTranscript.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${
                        msg.speaker === "Caller" ? "items-end" : "items-start"
                      } space-y-1`}
                    >
                      <span className="text-[10px] font-mono text-slate-500 px-1">
                        {msg.speaker} • {msg.time}
                      </span>
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.speaker === "Caller"
                            ? "bg-blue-600 text-white rounded-tr-none font-medium"
                            : "bg-slate-850 text-slate-100 rounded-tl-none border border-slate-750"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
                {isProcessingVoice && (
                  <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono italic">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Receptionist speaking...</span>
                  </div>
                )}
              </div>

              {/* Caller Input Box */}
              {isCallActive && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={callerInput}
                      onChange={(e) => setCallerInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendCallerMessage()}
                      placeholder="Type what the caller says into the phone..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={() => handleSendCallerMessage()}
                      disabled={isProcessingVoice || !callerInput.trim()}
                      className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Speak</span>
                    </button>
                  </div>

                  {/* Sample Caller Phrases */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Quick Scenarios:</span>
                    {sampleCallerUtterances.map((utt) => (
                      <button
                        key={utt}
                        onClick={() => handleSendCallerMessage(utt)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
                      >
                        "{utt.slice(0, 34)}..."
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Live Telephony Insights & Routing Status */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Call Routing & Intent Engine</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Detected Intent Category:
                  </span>
                  <p className="text-sm font-black text-cyan-300 font-mono">{lastCallIntent}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Human Escalation Status:
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                        transferredStatus
                          ? "bg-red-500/20 text-red-300 border border-red-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      }`}
                    >
                      {transferredStatus ? "TRANSFERRED TO OWNER" : "Autonomous Handling"}
                    </span>
                  </div>
                  {transferredStatus && (
                    <p className="text-[11px] text-red-300 pt-1">
                      Direct line connected to Founder Sangamesh: +91 {config.transferPhoneNumber}
                    </p>
                  )}
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Telephony Webhook Endpoint:
                  </span>
                  <p className="font-mono text-[11px] text-slate-400 truncate">{config.webhookUrl}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: TELEPHONY PROVIDER CONFIGURATION */}
      {activeTab === "telephony" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="space-y-1 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-cyan-400" />
              <span>Real Telephony Provider Integration (Twilio / Exotel / SIP)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Attach a real local virtual phone number to receive incoming calls with consent recording and AI processing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Store Business Display Name
              </label>
              <input
                type="text"
                value={config.businessName}
                onChange={(e) => setConfig({ ...config, businessName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Owner Direct Escalation Phone Number
              </label>
              <input
                type="text"
                value={config.transferPhoneNumber}
                onChange={(e) => setConfig({ ...config, transferPhoneNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Consent Announcement & Greeting Message
            </label>
            <textarea
              rows={3}
              value={config.greetingMessage}
              onChange={(e) => setConfig({ ...config, greetingMessage: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 resize-none font-medium leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                Generated TwiML / Telephony XML Webhook Snippet:
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(twimlSnippet);
                  setCopiedTwiml(true);
                  setTimeout(() => setCopiedTwiml(false), 2000);
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                {copiedTwiml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTwiml ? "Copied TwiML" : "Copy XML"}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-cyan-300 font-mono overflow-x-auto leading-relaxed">
              {twimlSnippet}
            </pre>
          </div>
        </div>
      )}

      {/* VIEW 3: CALL HISTORY ARCHIVE */}
      {activeTab === "history" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            Inbound Call Audio & Transcript Records
          </h3>

          <div className="space-y-3">
            {callLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{log.callerName}</span>
                    <span className="font-mono text-cyan-300">{log.callerNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                      Duration: {log.durationSec}s
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                  </div>
                </div>

                <p className="text-slate-300 font-medium">{log.summary}</p>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850 space-y-1.5 text-[11px] text-slate-400">
                  {log.transcript.map((line, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <strong className="text-slate-300 shrink-0">{line.speaker}:</strong>
                      <span>{line.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
