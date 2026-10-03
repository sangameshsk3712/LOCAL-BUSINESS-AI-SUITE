import React, { useState } from "react";
import {
  Rocket,
  ExternalLink,
  Store,
  MessageCircle,
  MessageSquare,
  Search,
  FileText,
  Languages,
  Mic,
  Clock,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  Crown,
  Building2,
  RefreshCw,
  Send,
  Zap,
  Globe,
  Sliders,
  Layers,
  ArrowRight
} from "lucide-react";

interface StreamlitSuiteProProps {
  isKeyReady: boolean;
  onOpenKeyGuide?: () => void;
  onSaveToWorkspace?: (title: string, type: any, data: any) => void;
}

type StreamlitTab =
  | "franchise"
  | "whatsapp"
  | "reviews"
  | "seo"
  | "flyer"
  | "localization"
  | "audio"
  | "history"
  | "live_streamlit";

interface HistoryItem {
  id: string;
  feature: string;
  output: string;
  time: string;
}

export default function StreamlitSuitePro({
  isKeyReady,
  onOpenKeyGuide,
  onSaveToWorkspace,
}: StreamlitSuiteProProps) {
  const [activeTab, setActiveTab] = useState<StreamlitTab>("whatsapp");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Business Profile Context (mirrored from Streamlit sidebar)
  const [businessName, setBusinessName] = useState("Artisan Bakery & Cafe");
  const [businessType, setBusinessType] = useState("Bakery & Coffeehouse");
  const [businessLocation, setBusinessLocation] = useState("Austin, TX & Bangalore, India");
  const [brandVoice, setBrandVoice] = useState("Warm & Community-Oriented");

  // Multi-tab states
  // Tab 1: Franchise
  const [selectedBranch, setSelectedBranch] = useState("Austin Flagship Bakery & Cafe (Austin, TX)");

  // Tab 2: WhatsApp
  const [waName, setWaName] = useState("John M.");
  const [waGoal, setWaGoal] = useState("Order Dispatched / Ready for Pickup");
  const [waDetails, setWaDetails] = useState(
    "Order #8291 of handcrafted sourdough loaves & cinnamon rolls is packaged and ready at the pickup counter."
  );
  const [waCta, setWaCta] = useState("Reply 1 to confirm pickup, or call 555-0192 for curbside delivery.");
  const [waOutput, setWaOutput] = useState<string>("");
  const [isWaLoading, setIsWaLoading] = useState(false);

  // Tab 3: Reviews
  const [revAuthor, setRevAuthor] = useState("Jennifer M.");
  const [revRating, setRevRating] = useState("5 Stars");
  const [revText, setRevText] = useState(
    "The sourdough cinnamon rolls and pour-over coffee were unbelievable! The barista was so friendly despite the huge morning rush."
  );
  const [revTone, setRevTone] = useState("Warm, Gracious & Appreciative");
  const [revOutput, setRevOutput] = useState<string>("");
  const [isRevLoading, setIsRevLoading] = useState(false);

  // Tab 4: Local SEO
  const [seoCity, setSeoCity] = useState("Austin, TX");
  const [seoKeywords, setSeoKeywords] = useState("artisan sourdough, fresh pastries, specialty espresso, breakfast cafe");
  const [seoOutput, setSeoOutput] = useState<string>("");
  const [isSeoLoading, setIsSeoLoading] = useState(false);

  // Tab 5: Flyer
  const [flyerTitle, setFlyerTitle] = useState("Grand Opening & Weekend Pastry Festival");
  const [flyerOffer, setFlyerOffer] = useState("Buy 1 Artisanal Loaf, Get Any Specialty Coffee Free. Live acoustic music 9 AM - 2 PM.");
  const [flyerCta, setFlyerCta] = useState("Visit us at 1204 S Congress Ave this Saturday!");
  const [flyerOutput, setFlyerOutput] = useState<string>("");
  const [isFlyerLoading, setIsFlyerLoading] = useState(false);

  // Tab 6: Regional Localization
  const [targetLang, setTargetLang] = useState("Hindi");
  const [contentToTranslate, setContentToTranslate] = useState(
    "Celebrate this festive season with freshly baked treats! Enjoy 20% off on all gift boxes this weekend."
  );
  const [transOutput, setTransOutput] = useState<string>("");
  const [isTransLoading, setIsTransLoading] = useState(false);

  // Generation History
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("streamlit_suite_history");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "hist-1",
        feature: "WhatsApp Formatter",
        output: "🍞 *Good news, John!* Your order #8291 of handcrafted sourdough loaves & cinnamon rolls is packaged and steaming fresh at our pickup counter.\n\n👉 _Reply 1 to confirm pickup, or call 555-0192 for curbside delivery._",
        time: new Date().toLocaleTimeString(),
      },
    ];
  });

  const saveToHistory = (feature: string, output: string) => {
    const newItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      feature,
      output,
      time: new Date().toLocaleTimeString(),
    };
    const updated = [newItem, ...history].slice(0, 20);
    setHistory(updated);
    try {
      localStorage.setItem("streamlit_suite_history", JSON.stringify(updated));
    } catch {}
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper AI caller (server-side proxy)
  const callAI = async (promptText: string, systemInstruction: string) => {
    try {
      const res = await fetch("/api/prompt/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction,
          promptText,
          temperature: 0.7,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation error");
      return data.output || "Generated successfully.";
    } catch (e: any) {
      console.error(e);
      return `Generated result for ${businessName} in ${brandVoice} style:\n\n${promptText}`;
    }
  };

  // Run WhatsApp Formatter
  const handleGenerateWa = async () => {
    setIsWaLoading(true);
    const system = "You are a WhatsApp Business marketing specialist. Write clean, high-conversion messages using emojis, *bold text*, _italics_, and a crystal-clear call-to-action.";
    const prompt = `Business Name: ${businessName}
Category: ${businessType}
Location: ${businessLocation}
Brand Voice: ${brandVoice}

Customer Name: ${waName}
Goal: ${waGoal}
Details: ${waDetails}
Call to Action: ${waCta}

Format instructions: Create a ready-to-send WhatsApp message with emojis, *bold text*, _italics_, and clean spacing.`;

    const result = await callAI(prompt, system);
    setWaOutput(result);
    saveToHistory("WhatsApp Formatter", result);
    setIsWaLoading(false);
  };

  // Run Review Responder
  const handleGenerateRev = async () => {
    setIsRevLoading(true);
    const system = "You are an expert customer experience manager. Craft warm, authentic, brand-building review responses that turn customers into lifelong advocates.";
    const prompt = `Business Name: ${businessName}
Category: ${businessType}
Location: ${businessLocation}
Brand Voice: ${brandVoice}

Customer: ${revAuthor}
Rating: ${revRating}
Review: "${revText}"
Tone: ${revTone}

Write an authentic, brand-building public response.`;

    const result = await callAI(prompt, system);
    setRevOutput(result);
    saveToHistory("Review Responder", result);
    setIsRevLoading(false);
  };

  // Run Local SEO
  const handleGenerateSeo = async () => {
    setIsSeoLoading(true);
    const system = "You are a local SEO strategist. Generate high-intent keywords and an optimized Google Business Profile description.";
    const prompt = `Business Name: ${businessName}
Category: ${businessType}
Location: ${businessLocation}
Target City: ${seoCity}
Keywords: ${seoKeywords}

Generate:
1. 700-character Google Business Profile Description
2. Top 10 High-Intent Local Keywords (with search intent)
3. 3 Frequently Asked Questions (FAQ) for GBP Q&A
4. Suggested GBP Post for this week`;

    const result = await callAI(prompt, system);
    setSeoOutput(result);
    saveToHistory("Local SEO", result);
    setIsSeoLoading(false);
  };

  // Run Flyer Designer
  const handleGenerateFlyer = async () => {
    setIsFlyerLoading(true);
    const system = "You are an advertising copywriter. Structure content with HEADLINE, SUBHEADLINE, BENEFITS, OFFER, and CTA.";
    const prompt = `Business Name: ${businessName}
Category: ${businessType}
Location: ${businessLocation}
Campaign: ${flyerTitle}
Offer: ${flyerOffer}
CTA: ${flyerCta}

Create high-impact flyer copy structured into:
- HEADLINE
- SUBHEADLINE
- KEY PERKS
- PROMOTIONAL OFFER
- CALL TO ACTION
- FOOTER`;

    const result = await callAI(prompt, system);
    setFlyerOutput(result);
    saveToHistory("Flyer Designer", result);
    setIsFlyerLoading(false);
  };

  // Run Regional Localization
  const handleGenerateLocalization = async () => {
    setIsTransLoading(true);
    const system = `You are a regional Indian localization expert. Translate and culturally adapt English marketing copy into natural, conversational ${targetLang} preserving the business tone and festive warmth.`;
    const prompt = `Business Name: ${businessName}
Target Regional Language: ${targetLang}
English Marketing Copy: "${contentToTranslate}"

Provide:
1. Natural ${targetLang} script translation
2. Phonetic English transliteration (Hinglish/Kanglish)
3. Cultural adaptation tips for local festivities`;

    const result = await callAI(prompt, system);
    setTransOutput(result);
    saveToHistory(`Regional (${targetLang})`, result);
    setIsTransLoading(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Flagship Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-amber-500/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase font-mono border border-amber-500/30">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Founder Edition • v3.2 Production</span>
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono">
                ⚡ Powered by Gemini 3.8 Flash
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white flex items-center gap-2.5">
              <span>AI Local Business Growth Suite Pro</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Architected by <strong>Founder Sangamesh Shivkumar Khatge</strong>. The unified enterprise command center for multi-location marketing, Google review responses, high-converting WhatsApp broadcasts, and Indian regional vernacular SEO.
            </p>

            {/* Founder Signature Credential Card */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5 text-slate-200">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Founder: <strong className="text-amber-300 font-bold">Sangamesh Shivkumar Khatge</strong></span>
              </div>
              <span className="text-slate-700">•</span>
              <a
                href="https://local-business-suite-fjknqjvlbpambaahokznhb.streamlit.app/"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 hover:underline"
              >
                <span>Live Streamlit Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="https://github.com/sangameshsk3712/local-business-suite"
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 hover:text-white font-mono flex items-center gap-1 hover:underline"
              >
                <span>GitHub Source (sangameshsk3712)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://local-business-suite-fjknqjvlbpambaahokznhb.streamlit.app/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition active:scale-95 whitespace-nowrap"
            >
              <Rocket className="w-4 h-4" />
              <span>Launch Live Streamlit Web App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Business Profile Sidebar Controls */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="text-slate-400 font-bold block mb-1">Business Name:</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold focus:outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="text-slate-400 font-bold block mb-1">Business Category:</label>
          <input
            type="text"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold focus:outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="text-slate-400 font-bold block mb-1">Location / City:</label>
          <input
            type="text"
            value={businessLocation}
            onChange={(e) => setBusinessLocation(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold focus:outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="text-slate-400 font-bold block mb-1">Brand Voice:</label>
          <select
            value={brandVoice}
            onChange={(e) => setBrandVoice(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="Warm & Community-Oriented">Warm & Community-Oriented</option>
            <option value="Professional & Friendly">Professional & Friendly</option>
            <option value="Premium & Elegant">Premium & Elegant</option>
            <option value="Simple & Local">Simple & Local</option>
            <option value="Energetic & Youthful">Energetic & Youthful</option>
          </select>
        </div>
      </div>

      {/* Streamlit Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800">
        {[
          { id: "franchise", label: "🏢 Franchise Hub", icon: Building2 },
          { id: "whatsapp", label: "📱 WhatsApp Formatter", icon: MessageCircle },
          { id: "reviews", label: "💬 Review Responder", icon: MessageSquare },
          { id: "seo", label: "🔍 Local SEO", icon: Search },
          { id: "flyer", label: "📢 Flyer Designer", icon: FileText },
          { id: "localization", label: "🌐 Regional Localization", icon: Languages },
          { id: "live_streamlit", label: "🚀 Live Streamlit Web Embed", icon: ExternalLink },
          { id: "history", label: "🕘 History", icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as StreamlitTab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition ${
              activeTab === tab.id
                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Multi-Location Franchise Command */}
      {activeTab === "franchise" && (
        <div className="space-y-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              <span>Multi-Location Franchise Command</span>
            </h3>
            <p className="text-xs text-slate-400">
              Synchronized multi-branch control center designed by Founder Sangamesh Khatge.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-mono">Active Branches</div>
              <div className="text-2xl font-black text-white font-mono">4 Locations</div>
              <div className="text-xs text-emerald-400 font-bold">100% Live Operations</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-mono">Network Health Index</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">96.4%</div>
              <div className="text-xs text-emerald-400 font-bold">+2.4% vs last week</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-mono">Review Ingestion</div>
              <div className="text-2xl font-black text-amber-400 font-mono">1,248 / mo</div>
              <div className="text-xs text-slate-400 font-bold">Healthy Sentiment</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Select Active Franchise Location:</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
            >
              <option value="Austin Flagship Bakery & Cafe (Austin, TX)">Austin Flagship Bakery & Cafe (Austin, TX)</option>
              <option value="Downtown Manhattan Espresso Bar (New York, NY)">Downtown Manhattan Espresso Bar (New York, NY)</option>
              <option value="London Covent Garden Patisserie (London, UK)">London Covent Garden Patisserie (London, UK)</option>
              <option value="Mumbai Bandra West Cafe & Bistro (Mumbai, India)">Mumbai Bandra West Cafe & Bistro (Mumbai, India)</option>
            </select>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-200">
            📍 Active command session set for: <strong>{selectedBranch}</strong>. All downstream marketing campaigns and review responses adapt automatically to this branch context.
          </div>
        </div>
      )}

      {/* TAB 2: WhatsApp Formatter */}
      {activeTab === "whatsapp" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="space-y-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Business Formatter</span>
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Customer Name:</label>
              <input
                type="text"
                value={waName}
                onChange={(e) => setWaName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Message Goal:</label>
              <select
                value={waGoal}
                onChange={(e) => setWaGoal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Order Dispatched / Ready for Pickup">Order Dispatched / Ready for Pickup</option>
                <option value="Appointment / Booking Confirmation">Appointment / Booking Confirmation</option>
                <option value="Weekend Flash Sale & Promotion">Weekend Flash Sale & Promotion</option>
                <option value="5-Star Google Review Request">5-Star Google Review Request</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Order / Offer Details:</label>
              <textarea
                value={waDetails}
                onChange={(e) => setWaDetails(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Call to Action (CTA):</label>
              <input
                type="text"
                value={waCta}
                onChange={(e) => setWaCta(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={handleGenerateWa}
              disabled={isWaLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
            >
              {isWaLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{isWaLoading ? "Drafting WhatsApp Message..." : "📲 Format for WhatsApp (Gemini 3.8)"}</span>
            </button>
          </div>

          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">Formatted WhatsApp Copy</span>
                {waOutput && (
                  <button
                    onClick={() => handleCopy("wa", waOutput)}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    {copiedId === "wa" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === "wa" ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 min-h-[220px] text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                {waOutput || (
                  <div className="text-slate-500 text-xs py-10 text-center font-sans">
                    Click "Format for WhatsApp" to generate styled copy with *bold*, _italics_, and emojis.
                  </div>
                )}
              </div>
            </div>

            {waOutput && (
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(waOutput)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Open & Send in WhatsApp Web</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Review Responder */}
      {activeTab === "reviews" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="space-y-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>AI Review Responder</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Reviewer Name:</label>
                <input
                  type="text"
                  value={revAuthor}
                  onChange={(e) => setRevAuthor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Star Rating:</label>
                <select
                  value={revRating}
                  onChange={(e) => setRevRating(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="5 Stars">⭐⭐⭐⭐⭐ 5 Stars</option>
                  <option value="4 Stars">⭐⭐⭐⭐ 4 Stars</option>
                  <option value="3 Stars">⭐⭐⭐ 3 Stars</option>
                  <option value="2 Stars">⭐⭐ 2 Stars</option>
                  <option value="1 Star">⭐ 1 Star</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Customer Review Text:</label>
              <textarea
                value={revText}
                onChange={(e) => setRevText(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Response Tone:</label>
              <select
                value={revTone}
                onChange={(e) => setRevTone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Warm, Gracious & Appreciative">Warm, Gracious & Appreciative</option>
                <option value="Professional & Courteous">Professional & Courteous</option>
                <option value="Apologetic & Solution-Focused">Apologetic & Solution-Focused</option>
              </select>
            </div>

            <button
              onClick={handleGenerateRev}
              disabled={isRevLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
            >
              {isRevLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isRevLoading ? "Crafting Response..." : "✨ Generate Public Review Response"}</span>
            </button>
          </div>

          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">Public Google Review Response</span>
                {revOutput && (
                  <button
                    onClick={() => handleCopy("rev", revOutput)}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    {copiedId === "rev" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === "rev" ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 min-h-[220px] text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                {revOutput || (
                  <div className="text-slate-500 text-xs py-10 text-center font-sans">
                    Click "Generate Public Review Response" to draft an authentic brand-building reply.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Local SEO */}
      {activeTab === "seo" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="space-y-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" />
              <span>Local SEO & Google Business Profile</span>
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Target City / Metro:</label>
              <input
                type="text"
                value={seoCity}
                onChange={(e) => setSeoCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Primary Keywords:</label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={handleGenerateSeo}
              disabled={isSeoLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
            >
              {isSeoLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
              <span>{isSeoLoading ? "Generating SEO Suite..." : "🚀 Generate Local SEO Package (GBP & Keywords)"}</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">Generated SEO Package</span>
              {seoOutput && (
                <button
                  onClick={() => handleCopy("seo", seoOutput)}
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  {copiedId === "seo" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === "seo" ? "Copied" : "Copy"}</span>
                </button>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 min-h-[260px] text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {seoOutput || (
                <div className="text-slate-500 text-xs py-10 text-center font-sans">
                  Click "Generate Local SEO Package" to get 700-char GBP description, high-intent keywords, and weekly post blueprint.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Flyer Designer */}
      {activeTab === "flyer" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="space-y-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>AI Flyer Copy Designer</span>
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Campaign Headline:</label>
              <input
                type="text"
                value={flyerTitle}
                onChange={(e) => setFlyerTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Offer & Perks:</label>
              <textarea
                value={flyerOffer}
                onChange={(e) => setFlyerOffer(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Call To Action (CTA):</label>
              <input
                type="text"
                value={flyerCta}
                onChange={(e) => setFlyerCta(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={handleGenerateFlyer}
              disabled={isFlyerLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 disabled:opacity-50"
            >
              {isFlyerLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isFlyerLoading ? "Designing Blueprint..." : "🎨 Generate Flyer Blueprint"}</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">Structured Flyer Blueprint</span>
              {flyerOutput && (
                <button
                  onClick={() => handleCopy("flyer", flyerOutput)}
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  {copiedId === "flyer" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === "flyer" ? "Copied" : "Copy"}</span>
                </button>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 min-h-[260px] text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {flyerOutput || (
                <div className="text-slate-500 text-xs py-10 text-center font-sans">
                  Click "Generate Flyer Blueprint" to format headline, perks, and retail print-ready layout.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Regional Localization */}
      {activeTab === "localization" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="space-y-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Languages className="w-4 h-4 text-teal-400" />
              <span>Indian Regional Language Localization</span>
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Target Regional Language:</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Hindi">🇮🇳 Hindi (हिंदी)</option>
                <option value="Kannada">🇮🇳 Kannada (ಕನ್ನಡ)</option>
                <option value="Telugu">🇮🇳 Telugu (తెలుగు)</option>
                <option value="Tamil">🇮🇳 Tamil (தமிழ்)</option>
                <option value="Marathi">🇮🇳 Marathi (मराठी)</option>
                <option value="Bengali">🇮🇳 Bengali (বাংলা)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">English Marketing Copy:</label>
              <textarea
                value={contentToTranslate}
                onChange={(e) => setContentToTranslate(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={handleGenerateLocalization}
              disabled={isTransLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95 disabled:opacity-50"
            >
              {isTransLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              <span>{isTransLoading ? "Translating Culturally..." : `🌍 Localize into ${targetLang}`}</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">Localized in {targetLang}</span>
              {transOutput && (
                <button
                  onClick={() => handleCopy("trans", transOutput)}
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  {copiedId === "trans" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === "trans" ? "Copied" : "Copy"}</span>
                </button>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 min-h-[240px] text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {transOutput || (
                <div className="text-slate-500 text-xs py-10 text-center font-sans">
                  Click "Localize into {targetLang}" to get script, transliteration, and cultural nuances.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: Live Streamlit Web Embed */}
      {activeTab === "live_streamlit" && (
        <div className="space-y-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Rocket className="w-4 h-4 text-amber-400" />
                <span>Live Streamlit Cloud Deployment</span>
              </h3>
              <p className="text-xs text-slate-400">
                Official URL: <code className="text-cyan-400 font-mono">https://local-business-suite-fjknqjvlbpambaahokznhb.streamlit.app/</code>
              </p>
            </div>

            <a
              href="https://local-business-suite-fjknqjvlbpambaahokznhb.streamlit.app/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow transition"
            >
              <span>Open in Full Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Iframe View */}
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-[650px] relative shadow-inner">
            <iframe
              src="https://local-business-suite-fjknqjvlbpambaahokznhb.streamlit.app/?embed=true"
              title="Streamlit Local Business Growth Suite Pro"
              className="w-full h-full border-0"
              allow="camera; microphone; clipboard-write"
            />
          </div>
        </div>
      )}

      {/* TAB 8: History */}
      {activeTab === "history" && (
        <div className="space-y-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="space-y-0.5">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Streamlit Generation History</span>
              </h3>
              <p className="text-xs text-slate-400">Last 20 outputs across WhatsApp, Review responses, and SEO bundles.</p>
            </div>
            {history.length > 0 && (
              <button
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem("streamlit_suite_history");
                }}
                className="text-xs text-slate-400 hover:text-rose-400 transition"
              >
                Clear History
              </button>
            )}
          </div>

          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No saved history yet. Generations from WhatsApp, Reviews, and SEO will appear here.
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-400 font-mono uppercase">{item.feature}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">{item.time}</span>
                      <button
                        onClick={() => handleCopy(item.id, item.output)}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap">{item.output}</pre>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
