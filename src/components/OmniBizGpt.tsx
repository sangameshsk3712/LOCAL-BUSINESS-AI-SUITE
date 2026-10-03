import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  TrendingUp,
  Building2,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  Mic,
  MicOff,
  FolderKanban,
  Download,
  Trash2,
  ExternalLink,
  ChevronDown,
  Layers,
  Crown,
  ShieldCheck,
  Scale,
  DollarSign
} from "lucide-react";
import { LocationBranch } from "../types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  latencyMs?: number;
  modelUsed?: string;
}

interface OmniBizGptProps {
  isKeyReady: boolean;
  onOpenKeyGuide: () => void;
  activeLocation?: LocationBranch;
  onSaveToWorkspace?: (title: string, type: any, data: any) => void;
}

type GptMode = "general" | "scale_100cr" | "viral_cmo" | "sales_closer" | "legal_franchise";

export default function OmniBizGpt({
  isKeyReady,
  onOpenKeyGuide,
  activeLocation,
  onSaveToWorkspace,
}: OmniBizGptProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      content: `### 👋 Welcome to OmniBiz GPT 5.0 — The Enterprise Business ChatGPT

I am your **AI Chief Strategy Officer & Multi-Million Dollar Growth Architect**. 

Whether you want to build a **₹100 Crore enterprise empire**, launch viral customer acquisition campaigns, negotiate high-ticket supplier deals, or draft bulletproof franchise expansion contracts — I am here to execute.

#### 💡 Suggested Strategic Inquiries:
* **"Design a master 3-year roadmap to scale my store into a ₹100 Crore franchise empire."**
* **"Create a viral 7-day WhatsApp and Instagram campaign for this weekend to drive 200 walk-ins."**
* **"How do I outrank the #1 local competitor on Google Maps in the next 14 days?"**
* **"Draft an enterprise franchise agreement outline with royalty and territory protection terms."**`,
      timestamp: "Just now",
      modelUsed: "OmniBiz Intelligence Engine 5.0",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<GptMode>("scale_100cr");
  const [temperature, setTemperature] = useState(0.7);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Speech Recognition (Voice Input)
  const toggleListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Text to Speech
  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 500));
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveMessage = (msg: Message) => {
    if (onSaveToWorkspace) {
      onSaveToWorkspace(`OmniBiz GPT: ${msg.content.slice(0, 45)}...`, "Growth Plan", {
        content: msg.content,
        timestamp: msg.timestamp,
        mode,
      });
      setSavedId(msg.id);
      setTimeout(() => setSavedId(null), 2000);
    }
  };

  const handleSendMessage = async (promptOverride?: string) => {
    const textToSend = promptOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!promptOverride) setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat/business-gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          mode,
          temperature,
          contextStore: activeLocation
            ? {
                name: activeLocation.name,
                city: activeLocation.city,
                phone: activeLocation.phone,
              }
            : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate business strategy.");
      }

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: data.reply || "Strategy analyzed successfully.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        latencyMs: data.latencyMs,
        modelUsed: data.modelUsed,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: `⚠️ **Notice:** ${err.message || "An issue occurred connecting to the intelligence engine."}

*Tip: You can configure your Google Gemini API Key in "Production Check & Keys" for uncapped real-time generative speed.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm("Reset conversation history with OmniBiz GPT?")) {
      setMessages([
        {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: "Conversation history cleared. Ready for your next strategic corporate inquiry or 100 Crore scaling blueprint!",
          timestamp: "Just now",
        },
      ]);
    }
  };

  const handleExportChat = () => {
    const text = messages
      .map((m) => `[${m.timestamp}] ${m.role.toUpperCase()}:\n${m.content}\n\n`)
      .join("----------------------------------------\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `OmniBiz-Enterprise-Chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const promptSuggestions = [
    {
      title: "🚀 100 Crore Scale Blueprint",
      subtitle: "3-year roadmap to expand to ₹100 Crore",
      prompt: "Create a detailed financial and operational master blueprint to scale my local business to 100 Crore (₹100,00,00,000) valuation in 36 months, with franchise fee structures, unit economics, and payback periods.",
      mode: "scale_100cr" as GptMode,
    },
    {
      title: "🎯 Viral Hyper-Local Campaign",
      subtitle: "Generate ₹5,00,000 in weekend walk-ins",
      prompt: "Draft a viral 7-day marketing sprint with 5 Instagram Reels scripts, 2 WhatsApp VIP broadcast announcements, and high-urgency promotional hooks to generate ₹5 Lakhs in weekend sales.",
      mode: "viral_cmo" as GptMode,
    },
    {
      title: "📍 Outrank Local Competitors #1",
      subtitle: "Dominate Google Maps 5x5 grid in 14 days",
      prompt: "Give me an exact, step-by-step strategy to outrank our top local competitor on Google Maps search in a 5km radius within 14 days without spending money on ads.",
      mode: "general" as GptMode,
    },
    {
      title: "⚖️ Franchise Legal Agreement Matrix",
      subtitle: "Royalty, territory & dispute terms",
      prompt: "Draft an executive franchise agreement outline with royalty fee clauses (8% gross), territorial exclusivity definitions (3km buffer), brand quality guardrails, and termination safeguards.",
      mode: "legal_franchise" as GptMode,
    },
    {
      title: "💰 Recover 20% Profit Margins",
      subtitle: "SOPs, waste elimination & AOV boost",
      prompt: "Identify the top 5 operational leaks where a local retail/cafe business bleeds money, and give me a concrete plan to raise our net profit margins by 20% in 60 days.",
      mode: "general" as GptMode,
    },
  ];

  return (
    <div className="flex flex-col h-[750px] bg-slate-950 border-2 border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden relative ring-1 ring-indigo-400/20">
      {/* Top Header Bar */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                OmniBiz GPT 5.0
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black">
                  ENTERPRISE
                </span>
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-xs text-slate-400">
              The ChatGPT for Local Business, 100 Crore Scale & Franchise Dominance
            </p>
          </div>
        </div>

        {/* Mode Selector & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setMode("scale_100cr")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                mode === "scale_100cr"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="100 Crore Scale & Valuation"
            >
              🚀 100Cr Architect
            </button>
            <button
              onClick={() => setMode("viral_cmo")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                mode === "viral_cmo"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Viral Chief Marketing Officer"
            >
              🎯 Viral CMO
            </button>
            <button
              onClick={() => setMode("sales_closer")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                mode === "sales_closer"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="High-Ticket Closer & Negotiation"
            >
              💼 Sales Closer
            </button>
            <button
              onClick={() => setMode("legal_franchise")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                mode === "legal_franchise"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Franchise Contracts & Legal Guardrails"
            >
              ⚖️ Franchise Legal
            </button>
          </div>

          <button
            onClick={handleExportChat}
            className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors text-xs"
            title="Export Transcript"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-red-400 transition-colors text-xs"
            title="Reset Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Quick Suggestion Pills */}
        {messages.length <= 1 && (
          <div className="space-y-3 pb-2">
            <p className="text-xs font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Instant 1-Click Executive Prompts:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {promptSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMode(sug.mode);
                    handleSendMessage(sug.prompt);
                  }}
                  className="text-left bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 p-3 rounded-2xl transition-all hover:scale-[1.01] space-y-1 shadow-sm group"
                >
                  <div className="text-xs font-extrabold text-white group-hover:text-indigo-300 flex items-center justify-between">
                    <span>{sug.title}</span>
                    <Zap className="w-3 h-3 text-amber-400 opacity-60 group-hover:opacity-100" />
                  </div>
                  <p className="text-[11px] text-slate-450 line-clamp-1">{sug.subtitle}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Render Chat Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 sm:gap-4 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-xs font-black shadow-md ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 text-slate-950"
              }`}
            >
              {msg.role === "user" ? "YOU" : "AI"}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 space-y-2 text-xs sm:text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20"
                  : "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-md space-y-3"
              }`}
            >
              {/* Message Header info for AI */}
              {msg.role === "assistant" && (
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-[11px] text-slate-450">
                  <span className="font-mono text-indigo-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {msg.modelUsed || "OmniBiz Engine"}
                  </span>
                  {msg.latencyMs && (
                    <span className="font-mono text-slate-500">
                      ⚡ {(msg.latencyMs / 1000).toFixed(2)}s
                    </span>
                  )}
                </div>
              )}

              {/* Message Content (Pre-wrap markdown styling) */}
              <div className="whitespace-pre-wrap font-sans text-slate-100 selection:bg-indigo-500/30">
                {msg.content}
              </div>

              {/* Action buttons on AI messages */}
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 text-xs text-slate-450">
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded bg-slate-950/60 border border-slate-800"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => speakText(msg.content)}
                    className="hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded bg-slate-950/60 border border-slate-800"
                    title="Read Aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </button>

                  {onSaveToWorkspace && (
                    <button
                      onClick={() => handleSaveMessage(msg)}
                      className="hover:text-indigo-300 flex items-center gap-1 transition-colors px-2 py-1 rounded bg-slate-950/60 border border-slate-800"
                      title="Save to Pro Workspace"
                    >
                      {savedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Saved!</span>
                        </>
                      ) : (
                        <>
                          <FolderKanban className="w-3.5 h-3.5" />
                          <span>Save to Workspace</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-md shrink-0 animate-pulse">
              AI
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-4 text-xs text-slate-300 flex items-center gap-2.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>OmniBiz GPT is crunching enterprise models, metrics & scaling strategies...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Control Box */}
      <div className="p-3 sm:p-4 bg-slate-900/95 border-t border-slate-800 shrink-0 space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Ask OmniBiz GPT anything (e.g. 100 Crore blueprint, viral WhatsApp hooks, competitor counter-attack)...`}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 resize-none h-14 sm:h-16 outline-none transition-all pr-12"
            />

            <button
              onClick={toggleListening}
              className={`absolute right-3 top-3.5 p-1.5 rounded-xl transition-colors ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "text-slate-450 hover:text-white hover:bg-slate-800"
              }`}
              title={isListening ? "Listening... click to stop" : "Voice Dictation"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="h-14 sm:h-16 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0 hover:scale-[1.02] active:scale-95"
          >
            <span>Execute</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Footer info note */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <div className="flex items-center gap-2">
            <span>Mode: <strong className="text-indigo-400 capitalize">{mode.replace("_", " ")}</strong></span>
            <span>•</span>
            <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-850 font-mono text-[10px]">Enter</kbd> to send</span>
          </div>

          {!isKeyReady && (
            <button
              onClick={onOpenKeyGuide}
              className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Connect Gemini Key for Ultra-Speed</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
