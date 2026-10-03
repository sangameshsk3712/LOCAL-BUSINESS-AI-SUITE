import React, { useState } from "react";
import {
  BookOpen,
  Sparkles,
  Key,
  MapPin,
  PhoneCall,
  Bot,
  Users,
  Palette,
  Music,
  Building2,
  TrendingUp,
  Share2,
  Mic,
  BarChart3,
  Crosshair,
  FolderKanban,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Phone,
  MessageCircle,
  Mail,
  BadgeCheck,
  Zap,
  Store,
  Compass,
  AlertTriangle,
  Lightbulb,
  ExternalLink
} from "lucide-react";
import { MainNavTab } from "../App";

interface HowToUseGuideProps {
  onNavigateToTab: (tab: MainNavTab) => void;
  isKeyReady: boolean;
  onOpenKeyGuide: () => void;
}

export default function HowToUseGuide({
  onNavigateToTab,
  isKeyReady,
  onOpenKeyGuide,
}: HowToUseGuideProps) {
  const [activeSection, setActiveSection] = useState<"quickstart" | "features" | "workflows" | "faq">("quickstart");

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden ring-1 ring-indigo-400/20">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5 shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              Official User Manual & Getting Started Guide
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Clear & Easy to Follow
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              How to Use Local Business Suite
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-4xl leading-relaxed">
              Welcome to the complete operating guide for <strong>Local Business Suite</strong>. Follow this step-by-step tutorial to configure your store, automate customer calls and WhatsApp inquiries, dominate neighborhood Google Maps searches, and run viral marketing campaigns with AI.
            </p>
          </div>

          {/* Quick Nav Anchor Pills */}
          <div className="flex items-center gap-2 flex-wrap pt-2">
            <button
              onClick={() => setActiveSection("quickstart")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                activeSection === "quickstart"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>1. 5-Minute Quick Start</span>
            </button>

            <button
              onClick={() => setActiveSection("features")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                activeSection === "features"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>2. All Features Explained</span>
            </button>

            <button
              onClick={() => setActiveSection("workflows")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                activeSection === "workflows"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>3. Real Business Workflows</span>
            </button>

            <button
              onClick={() => setActiveSection("faq")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                activeSection === "faq"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>4. Frequently Asked Questions</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: 5-MINUTE QUICK START ROADMAP */}
      {activeSection === "quickstart" && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>5-Minute Quick Start Guide</span>
              </h2>
              <p className="text-xs text-slate-450 mt-0.5">
                Complete these 6 simple steps in order to get full value from the platform right away.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
              Steps 1 of 6
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1 */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-sm flex items-center justify-center">
                  01
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  isKeyReady
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                }`}>
                  {isKeyReady ? "✓ Key Configured" : "Action Needed"}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  Step 1: Connect your Gemini API Key
                </h3>
                <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                  The suite uses Google Gemini 2.5 and Lyria AI models to analyze marketing data, generate audio, transcribe phone calls, and create store music. Click below to verify or set up your key.
                </p>
              </div>
              <button
                onClick={onOpenKeyGuide}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <span>Check API Key Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-black text-sm flex items-center justify-center">
                  02
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Store Setup
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  Step 2: Configure Your Store Profile
                </h3>
                <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                  Go to <strong>Franchise Command Center</strong> to select or add your store branch, address, contact phone number, and brand voice guidelines (e.g. maximum discount allowed, banned phrases).
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab("franchise")}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <span>Open Franchise Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 font-black text-sm flex items-center justify-center">
                  03
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  Local SEO
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-blue-400" />
                  Step 3: Scan Local Google Maps Rankings
                </h3>
                <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                  Launch the <strong>Geo-Grid Radar (5x5)</strong> to scan your shop's Google Maps visibility in a 5km radius around your location. Discover where competitors are outranking you and get instant ranking tips.
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab("geogrid")}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <span>Launch 5x5 Geo-Grid</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-black text-sm flex items-center justify-center">
                  04
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  24/7 Calls & Chats
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-cyan-400" />
                  Step 4: Enable AI Voice Receptionist & Concierge
                </h3>
                <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                  Configure the <strong>AI Voice Receptionist</strong> and <strong>24/7 Concierge</strong> to answer customer calls after-hours, handle inquiries, take table reservations, and log warm customer leads.
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab("voice_rep")}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <span>Configure Voice Receptionist</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Step 5 */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-black text-sm flex items-center justify-center">
                  05
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Content & Music
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-400" />
                  Step 5: Create Social Posts & Ambient Music
                </h3>
                <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                  Open <strong>Content Studio</strong> to generate viral Instagram Reel scripts, WhatsApp broadcast offers, and ad copies. Then head to <strong>Store Music</strong> to generate royalty-free background audio for your venue.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onNavigateToTab("content")}
                  className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02]"
                >
                  <span>Content Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigateToTab("music")}
                  className="py-2.5 px-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02]"
                >
                  <span>Store Music</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-sm flex items-center justify-center">
                  06
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Deals & Revenue
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Step 6: Track and Close Deals in Smart CRM
                </h3>
                <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                  Inquiries from WhatsApp, calls, and walk-ins appear in your <strong>Smart CRM</strong> pipeline. Click any lead to send a personalized follow-up message and track your monthly sales conversion.
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab("crm")}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <span>Open Smart CRM</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: FEATURE BREAKDOWN */}
      {activeSection === "features" && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>Complete Tool Directory & Descriptions</span>
            </h2>
            <p className="text-xs text-slate-450 mt-0.5">
              Click any tool below to launch it directly from this guide.
            </p>
          </div>

          <div className="space-y-4">
            {/* Category: Marketing & Growth */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Growth & Customer Acquisition
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        AI Growth Agent
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Strategy</span>
                    </div>
                    <p className="text-xs text-slate-450">
                      Generates high-level 30-day marketing roadmaps, channel-by-channel budget allocations, and weekly checklists tailored to your industry and city.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateToTab("growth")}
                    className="self-start text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Open Growth Agent →
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Crosshair className="w-4 h-4 text-blue-400" />
                        Geo-Grid Radar (5x5)
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Local SEO</span>
                    </div>
                    <p className="text-xs text-slate-450">
                      Scans your Google Maps search rank across 25 GPS coordinates in your city to pinpoint ranking blindspots and optimize your Google Business Profile.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateToTab("geogrid")}
                    className="self-start text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Open Geo-Grid Radar →
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-purple-400" />
                        Content Studio
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Social Media</span>
                    </div>
                    <p className="text-xs text-slate-450">
                      Writes viral Instagram Reels scripts, WhatsApp blast messages, high-converting Google ad copies, and product descriptions in 9+ languages.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateToTab("content")}
                    className="self-start text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    Open Content Studio →
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Music className="w-4 h-4 text-fuchsia-400" />
                        Store Music (Lyria AI)
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300">In-Store</span>
                    </div>
                    <p className="text-xs text-slate-450">
                      Generates royalty-free, pleasant ambient background music suited for coffee shops, dining rooms, retail stores, gyms, and wellness spas.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateToTab("music")}
                    className="self-start text-xs font-bold text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1"
                  >
                    Open Store Music →
                  </button>
                </div>
              </div>
            </div>

            {/* Category: Customer Operations & Telephony */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5" />
                Customer Inquiries & Operations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <PhoneCall className="w-4 h-4 text-cyan-400" />
                        AI Voice Receptionist
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Telephony</span>
                    </div>
                    <p className="text-xs text-slate-450">
                      Answers incoming phone calls with a natural voice, clarifies business hours, assists with bookings, and transfers urgent VIP callers to your phone.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateToTab("voice_rep")}
                    className="self-start text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    Open Voice Receptionist →
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-emerald-400" />
                        Smart CRM & Pipeline
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Sales</span>
                    </div>
                    <p className="text-xs text-slate-450">
                      Manages all incoming leads from WhatsApp, phone, and walk-ins with kanban stages, deal values, and 1-click WhatsApp follow-ups.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateToTab("crm")}
                    className="self-start text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    Open Smart CRM →
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-indigo-400" />
                        Franchise Command Center
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Multi-Location</span>
                    </div>
                    <p className="text-xs text-slate-450">
                      Coordinates multiple branch locations. Sets master guardrails (discount caps, tone, disclaimers) and monitors crisis alerts across outlets.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateToTab("franchise")}
                    className="self-start text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    Open Franchise Hub →
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Mic className="w-4 h-4 text-cyan-400" />
                        Audio Transcriber
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Speech-to-Text</span>
                    </div>
                    <p className="text-xs text-slate-450">
                      Uploads audio recordings of customer feedback, meetings, or voice memos and creates clean transcriptions with structured action items.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateToTab("transcribe")}
                    className="self-start text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    Open Audio Transcriber →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: REAL BUSINESS WORKFLOWS */}
      {activeSection === "workflows" && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-400" />
              <span>Real-World Business Workflows</span>
            </h2>
            <p className="text-xs text-slate-450 mt-0.5">
              How business owners solve everyday problems in 2 minutes using Local Business Suite.
            </p>
          </div>

          <div className="space-y-4">
            {/* Scenario 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Scenario 1: Weekend Rush & Promotion
                </span>
                <span className="text-xs text-slate-450">Goal: Drive 50+ walk-ins this Saturday</span>
              </div>
              <h3 className="text-base font-bold text-white">
                How to launch a high-impact weekend campaign in 3 clicks
              </h3>
              <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                <li>Go to <strong>Content Studio</strong> and select your business category (e.g. Cafe, Retail, Clinic).</li>
                <li>Enter your special weekend offer (e.g. "Buy 1 Get 1 on all artisan pastries before 12 PM").</li>
                <li>Click <strong>Generate Complete Marketing Suite</strong>. You will receive an Instagram Reels script, ad copy, and a WhatsApp broadcast message.</li>
                <li>Copy the WhatsApp text and send it to your VIP customers from <strong>Smart CRM</strong>.</li>
              </ol>
              <button
                onClick={() => onNavigateToTab("content")}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                Try creating a promotion now →
              </button>
            </div>

            {/* Scenario 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  Scenario 2: Low Foot Traffic from Nearby Streets
                </span>
                <span className="text-xs text-slate-450">Goal: Rank in the top 3 on Google Maps</span>
              </div>
              <h3 className="text-base font-bold text-white">
                How to audit and fix your local Google ranking
              </h3>
              <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                <li>Navigate to <strong>Geo-Grid Radar</strong> in the menu.</li>
                <li>Select your store location and target keyword (e.g., "bakery near me" or "plumber downtown").</li>
                <li>Click <strong>Scan 5x5 Radar Grid</strong>. Look for yellow and red pins indicating drop in rankings.</li>
                <li>Follow the AI suggestions to update your Google Business Profile categories, reply to reviews using <strong>Business AI Hub</strong>, and boost local citations.</li>
              </ol>
              <button
                onClick={() => onNavigateToTab("geogrid")}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                Scan your local ranking now →
              </button>
            </div>

            {/* Scenario 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Scenario 3: After-Hours Customer Inquiries
                </span>
                <span className="text-xs text-slate-450">Goal: Never let an interested buyer slip away</span>
              </div>
              <h3 className="text-base font-bold text-white">
                How to turn night inquiries into paid morning bookings
              </h3>
              <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                <li>Activate <strong>AI Voice Receptionist</strong> and <strong>24/7 AI Concierge</strong>.</li>
                <li>When customers call or message after closing hours, the AI answers politely, confirms pricing, and takes down their name and contact info.</li>
                <li>Open <strong>Smart CRM</strong> in the morning to see all captured leads neatly listed with requested services.</li>
                <li>Click "WhatsApp Follow-Up" to send a warm booking confirmation.</li>
              </ol>
              <button
                onClick={() => onNavigateToTab("voice_rep")}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                Explore Voice Receptionist →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: FREQUENTLY ASKED QUESTIONS */}
      {activeSection === "faq" && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              <span>Frequently Asked Questions (FAQ)</span>
            </h2>
            <p className="text-xs text-slate-450 mt-0.5">
              Clear answers to the most common questions about the Local Business Suite.
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-indigo-400 font-black">Q:</span>
                Do I need any coding or technical skills to use this app?
              </h3>
              <p className="text-xs text-slate-300 pl-5 leading-relaxed">
                <strong>No, absolutely not.</strong> Local Business Suite is designed for everyday store owners, managers, and marketers. Every tool operates with simple buttons, forms, and plain-English prompts.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-indigo-400 font-black">Q:</span>
                How does the Gemini API Key work? Is it free?
              </h3>
              <p className="text-xs text-slate-300 pl-5 leading-relaxed">
                Google provides generous free-tier API quotas through Google AI Studio for developers and businesses. Once you connect your key in <strong>Production Check & Keys</strong>, all AI generation, transcription, and music features run directly without third-party markups.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-indigo-400 font-black">Q:</span>
                Can I manage multiple shops or franchise branches?
              </h3>
              <p className="text-xs text-slate-300 pl-5 leading-relaxed">
                <strong>Yes!</strong> The <strong>Franchise Hub</strong> is built specifically to support multi-location businesses. You can switch between active stores in the top bar, set global brand guardrails, and audit rankings across multiple cities.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-indigo-400 font-black">Q:</span>
                How does the Lyria Store Music feature work?
              </h3>
              <p className="text-xs text-slate-450 pl-5 leading-relaxed">
                Google's Lyria AI generates relaxing, copyright-free instrumental tracks tailored to different physical retail environments (such as Coffee Shop Lo-Fi, Spa Relaxation, or Gym Upbeat). You can stream it directly through your store's sound system.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-indigo-400 font-black">Q:</span>
                Where is my customer data saved?
              </h3>
              <p className="text-xs text-slate-300 pl-5 leading-relaxed">
                All leads, locations, guardrails, and settings are saved securely in your browser's private local database and server session. You can export or clear your data at any time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Founder Direct Assistance & Contact Section */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-500/10 border-2 border-amber-500/40 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Need Personal Assistance?
            </span>
            <span className="text-xs text-slate-450">•</span>
            <span className="text-xs text-slate-300">1-on-1 Founder Onboarding</span>
          </div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Sangamesh Khatge (Founder & Lead Architect)
            <BadgeCheck className="w-4 h-4 text-amber-400" />
          </h3>
          <p className="text-xs text-slate-450">
            Have questions about rolling out Local Business Suite for your shop or franchise? Call or WhatsApp directly:
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <a
            href="tel:8431107332"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call: 8431107332</span>
          </a>

          <a
            href="https://wa.me/918431107332?text=Hello%20Sangamesh,%20I%20need%20help%20using%20the%20Local%20Business%20AI%20Suite."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Support</span>
          </a>

          <button
            onClick={() => onNavigateToTab("growth")}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Start Using Suite Now →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
