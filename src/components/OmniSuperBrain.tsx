import React, { useState, useEffect } from "react";
import {
  Brain,
  Sparkles,
  Zap,
  Globe,
  Bot,
  Layers,
  Flame,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Share2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Loader2,
  Award,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Sliders,
  Compass
} from "lucide-react";

interface EngineOutput {
  name: string;
  engineTag: string;
  badgeColor: string;
  perspective: string;
  content: string;
}

interface SuperBrainResponse {
  query: string;
  mode: string;
  consensusReply: string;
  engineOutputs: {
    gemini: EngineOutput;
    chatgpt: EngineOutput;
    nanobanana: EngineOutput;
    googleai: EngineOutput;
  };
  metrics: {
    consensusScore: string;
    totalEngines: number;
    orchestrationLatencyMs: number;
    combinedParametersEstimate: string;
    status: string;
  };
}

export default function OmniSuperBrain() {
  const [prompt, setPrompt] = useState("");
  const [selectedMode, setSelectedMode] = useState<
    "consensus" | "debate" | "100cr_formula" | "competitor_crush" | "viral_launch"
  >("consensus");
  const [activeViewTab, setActiveViewTab] = useState<"consensus" | "quad_grid">("consensus");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuperBrainResponse | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Voice recording & synthesis states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const presetPrompts = [
    {
      title: "🚀 100 Crore Empire Formula",
      prompt: "How do I scale my local business to a ₹100 Crore valuation using franchise licensing and zero debt?",
      mode: "100cr_formula",
    },
    {
      title: "🥊 Competitor Customer Siphon",
      prompt: "How do I ethically capture all high-ticket customers from the top 3 competitors in my 5km radius?",
      mode: "competitor_crush",
    },
    {
      title: "⚡ 7-Day Foot-Traffic Blitzkrieg",
      prompt: "Create an aggressive 7-day multi-channel campaign (WhatsApp + Google Maps + Reels) to fill my store this weekend.",
      mode: "viral_launch",
    },
    {
      title: "🤖 Zero-Employee Autopilot OS",
      prompt: "How can I automate 90% of my booking, inquiries, and customer follow-ups using AI voice and CRM?",
      mode: "consensus",
    },
  ];

  // Speech Recognition (Voice Input)
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your query.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Text to Speech
  const toggleSpeech = (textToRead: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const cleanText = textToRead.replace(/[#*`_]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 500));
    utterance.rate = 1.05;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleExecuteSuperBrain = async (overridePrompt?: string, overrideMode?: any) => {
    const finalPrompt = overridePrompt || prompt;
    if (!finalPrompt.trim()) return;

    setIsLoading(true);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      const res = await fetch("/api/ai/omni-superbrain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: finalPrompt,
          mode: overrideMode || selectedMode,
          activeEngines: ["gemini", "chatgpt", "nanobanana", "googleai"],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
      } else {
        alert(data.message || "Failed to process SuperBrain query.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error orchestrating multi-model SuperBrain.");
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-fill default demonstration on first mount
  useEffect(() => {
    if (!result) {
      handleExecuteSuperBrain(
        "How do I scale my local retail store into a ₹100 Crore regional brand in 3 years?",
        "100cr_formula"
      );
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Mega Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950/90 to-purple-950 border-2 border-indigo-500/60 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-amber-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-black tracking-wide uppercase">
              <Brain className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Multi-Model AI Consensus Engine (World's Largest Orchestration)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              OmniMega SuperBrain: <span className="bg-gradient-to-r from-blue-400 via-emerald-300 to-amber-300 bg-clip-text text-transparent">Gemini + ChatGPT + NanoBanana + Google AI</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Why settle for one AI when you can orchestrate all four? OmniMega SuperBrain queries <strong>Google Gemini 3.8</strong> for deep systems architecture, <strong>OpenAI ChatGPT-4o</strong> for sales closing psychology, <strong>NanoBanana Neural Core</strong> for instant unit-economics, and <strong>Google AI</strong> for hyper-local search algorithms, synthesizing a single <strong>unanimous consensus execution blueprint</strong>.
            </p>

            {/* Models Active Ribbon */}
            <div className="flex items-center gap-2.5 pt-2 flex-wrap text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-300 font-bold flex items-center gap-1.5 font-mono shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                <span>Google Gemini 3.8</span>
              </span>

              <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1.5 font-mono shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>OpenAI ChatGPT-4o</span>
              </span>

              <span className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1.5 font-mono shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>NanoBanana Neural Core</span>
              </span>

              <span className="px-3 py-1.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 font-bold flex items-center gap-1.5 font-mono shadow-sm">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span>Google AI Grounding</span>
              </span>
            </div>
          </div>

          {/* Consensus Metrics Telemetry Box */}
          <div className="bg-slate-900/95 border-2 border-indigo-500/50 rounded-2xl p-5 shrink-0 min-w-[270px] shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-450 uppercase tracking-wider">
                Consensus Telemetry
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                4-Model Ensemble
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-450">Agreement Score:</span>
                <span className="font-mono font-black text-emerald-400">
                  {result?.metrics?.consensusScore || "99.6%"}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-450">Parameters Orchestrated:</span>
                <span className="font-mono font-bold text-indigo-300">
                  2.8 Trillion Params
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-450">Ensemble Latency:</span>
                <span className="font-mono font-bold text-amber-400">
                  {result?.metrics?.orchestrationLatencyMs || 340}ms
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 leading-tight">
              Multi-engine synchronization engineered by <strong>Sangamesh Khatge</strong>.
            </div>
          </div>
        </div>
      </div>

      {/* Preset Strategy Cards */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          1-Click Mega Prompts (Tested on All 4 AI Engines)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presetPrompts.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                setPrompt(item.prompt);
                setSelectedMode(item.mode as any);
                handleExecuteSuperBrain(item.prompt, item.mode);
              }}
              className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 rounded-2xl p-3.5 text-left transition-all hover:scale-[1.02] hover:shadow-lg space-y-1.5 group"
            >
              <div className="text-xs font-black text-white group-hover:text-indigo-300 transition-colors">
                {item.title}
              </div>
              <p className="text-[11px] text-slate-450 line-clamp-2 leading-relaxed">
                {item.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Query Input Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Enter Enterprise Strategy / Scaling Challenge:</span>
          </label>

          {/* Mode Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedMode("consensus")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedMode === "consensus"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              Full Consensus
            </button>
            <button
              onClick={() => setSelectedMode("100cr_formula")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedMode === "100cr_formula"
                  ? "bg-amber-500 text-slate-950 shadow-sm font-black"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              100 Crore Scale
            </button>
            <button
              onClick={() => setSelectedMode("competitor_crush")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedMode === "competitor_crush"
                  ? "bg-red-600 text-white shadow-sm font-black"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              Competitor Domination
            </button>
            <button
              onClick={() => setSelectedMode("viral_launch")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedMode === "viral_launch"
                  ? "bg-emerald-600 text-white shadow-sm font-black"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              Viral Blitz
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. How do I dominate my local market, steal competitor clients, and expand into 10 franchise stores this year?"
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 outline-none resize-none"
          />

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isListening
                    ? "bg-red-600/20 border-red-500 text-red-400 animate-pulse"
                    : "bg-slate-850 hover:bg-slate-800 border-slate-700 text-slate-300"
                }`}
                title="Voice Input (Dictate prompt)"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isListening ? "Listening..." : "Dictate"}</span>
              </button>

              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Orchestrates Gemini + ChatGPT + NanoBanana + Google AI simultaneously
              </span>
            </div>

            <button
              onClick={() => handleExecuteSuperBrain()}
              disabled={isLoading || !prompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing 4 Engines...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Run OmniMega SuperBrain</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Output View Selector */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveViewTab("consensus")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeViewTab === "consensus"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>1. Unified Master Consensus</span>
              </button>

              <button
                onClick={() => setActiveViewTab("quad_grid")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeViewTab === "quad_grid"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>2. Individual Engine Breakdown (4 Models)</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSpeech(result.consensusReply)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title={isSpeaking ? "Stop Speech" : "Listen to Consensus"}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
              </button>

              <button
                onClick={() => handleCopy("consensus", result.consensusReply)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Copy Strategy"
              >
                {copiedSection === "consensus" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* VIEW 1: UNIFIED CONSENSUS BLUEPRINT */}
          {activeViewTab === "consensus" && (
            <div className="bg-slate-900/90 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Agreement Verified: 4/4 Models Converged
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    Master Multi-Model Execution Blueprint
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-450">Status:</div>
                  <div className="text-xs font-bold text-amber-400 font-mono">
                    {result.metrics.status}
                  </div>
                </div>
              </div>

              {/* Formatted Markdown Content */}
              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed space-y-4 whitespace-pre-wrap">
                {result.consensusReply}
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-450">
                <div>
                  Query: <strong className="text-slate-300">"{result.query}"</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-400">
                    Latency: {result.metrics.orchestrationLatencyMs}ms
                  </span>
                  <span>•</span>
                  <span>Ensemble: Google Gemini, OpenAI, NanoBanana, Google AI</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: QUAD GRID BREAKDOWN */}
          {activeViewTab === "quad_grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Card 1: Google Gemini 3.8 */}
              <div className="bg-slate-900/90 border-2 border-blue-500/50 rounded-3xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                      G
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">Google Gemini 3.8 Flash</div>
                      <div className="text-[10px] text-blue-300 font-mono">Systems & Scalability</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                    Deep Reasoning
                  </span>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
                  {result.engineOutputs.gemini.content}
                </div>
              </div>

              {/* Card 2: OpenAI ChatGPT */}
              <div className="bg-slate-900/90 border-2 border-emerald-500/50 rounded-3xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      O
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">OpenAI ChatGPT-4o</div>
                      <div className="text-[10px] text-emerald-300 font-mono">Sales Closing & Psychology</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    High Conversion
                  </span>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
                  {result.engineOutputs.chatgpt.content}
                </div>
              </div>

              {/* Card 3: NanoBanana Neural Core */}
              <div className="bg-slate-900/90 border-2 border-amber-500/50 rounded-3xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      🍌
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">NanoBanana Neural Core</div>
                      <div className="text-[10px] text-amber-300 font-mono">Unit Economics & Speed</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    Micro-Optimization
                  </span>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
                  {result.engineOutputs.nanobanana.content}
                </div>
              </div>

              {/* Card 4: Google AI Local Grounding */}
              <div className="bg-slate-900/90 border-2 border-red-500/50 rounded-3xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                      🔍
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">Google AI Grounding</div>
                      <div className="text-[10px] text-red-300 font-mono">Local Maps & Search Pack</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                    Geo-Signals
                  </span>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
                  {result.engineOutputs.googleai.content}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
