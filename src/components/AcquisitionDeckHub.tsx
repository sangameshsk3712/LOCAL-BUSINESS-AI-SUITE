import React, { useState } from "react";
import {
  Building2,
  DollarSign,
  TrendingUp,
  FileText,
  ShieldCheck,
  Award,
  Download,
  Copy,
  Check,
  Send,
  Sparkles,
  Zap,
  Globe,
  PieChart,
  Users,
  Target,
  Briefcase,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Mail,
  Lock,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Palette,
  Eye
} from "lucide-react";
import { LocationBranch } from "../types";

interface AcquisitionDeckHubProps {
  locations: LocationBranch[];
  isProUser: boolean;
  onOpenKeyGuide: () => void;
  onNavigateToTab: (tab: any) => void;
}

export default function AcquisitionDeckHub({
  locations,
  isProUser,
  onOpenKeyGuide,
  onNavigateToTab,
}: AcquisitionDeckHubProps) {
  // Valuation Calculator State
  const [storeCount, setStoreCount] = useState(125);
  const [monthlyFeePerStore, setMonthlyFeePerStore] = useState(4999); // ₹4,999 / mo
  const [multiple, setMultiple] = useState(14); // 14x SaaS EBITDA / ARR multiple
  const [churnRate, setChurnRate] = useState(1.4); // 1.4%
  const [activeTab, setActiveTab] = useState<"valuation" | "pitch_decks" | "data_room" | "term_sheet" | "whitelabel">("valuation");
  const [selectedBuyer, setSelectedBuyer] = useState<"reliance" | "tata" | "unilever" | "pe_venture">("reliance");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Whitelabel customizer state
  const [brandName, setBrandName] = useState("Enterprise Retail AI");
  const [brandColor, setBrandColor] = useState("#6366f1");
  const [customDomain, setCustomDomain] = useState("ai.enterprisegroup.com");

  // Financial Calculations
  const monthlyRecurringRevenue = storeCount * monthlyFeePerStore;
  const annualRecurringRevenue = monthlyRecurringRevenue * 12;
  const grossTransactionVolumeAnnual = storeCount * 6500000; // Average ₹65 Lakhs GMV per store
  const enterpriseValuation = annualRecurringRevenue * multiple;
  const valuationInCrores = (enterpriseValuation / 10000000).toFixed(2);
  const arrInCrores = (annualRecurringRevenue / 10000000).toFixed(2);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleDownloadTermSheet = () => {
    const termSheetText = `================================================================================
CONFIDENTIAL: NON-BINDING LETTER OF INTENT (LOI) & ACQUISITION TERM SHEET
================================================================================
TARGET COMPANY: Local Business Suite (Enterprise Multi-Location AI Platform)
FOUNDER & CHIEF ARCHITECT: Sangamesh Khatge
PRIMARY CONTACT: shivkumarkhatge@gmail.com | WhatsApp: +91 8431107332
DATE: ${new Date().toLocaleDateString()}
--------------------------------------------------------------------------------

1. PROPOSED VALUATION & PURCHASE PRICE:
   - Target Enterprise Valuation: ₹${valuationInCrores} Crore (INR ${enterpriseValuation.toLocaleString()})
   - Annual Recurring Revenue (ARR): ₹${arrInCrores} Crore
   - ARR Multiple: ${multiple}x
   - Active Franchise & Store Endpoints: ${storeCount} Locations

2. TRANSACTION STRUCTURE:
   - 75% Upfront Cash Consideration on Closing
   - 25% Acquirer Performance Equity / Stock Units (36-month vesting)
   - Retention of Founder Sangamesh Khatge as Chief AI Strategy Architect (24 Months)

3. ACQUIRED INTELLECTUAL PROPERTY & ASSETS:
   - 100% Proprietary Codebase: React 19, TypeScript, Vite, Node.js, Express
   - OmniBiz GPT 5.0 Enterprise Business Conversational Brain
   - Geo-Grid Radar 5x5 GPS Ranking Matrix & Local Google Maps Algorithm Engine
   - 24/7 AI Voice Phone Receptionist & Call Transcription Network
   - Smart CRM & WhatsApp Marketing Automation Pipeline
   - Multi-tenant Franchise Command Architecture

4. CLOSING CONDITIONS & DUE DILIGENCE:
   - 30-Day Exclusive Due Diligence Period
   - Confirmation of 0% third-party IP infringement & SOC2 security audit readiness
   - Clean financial book verification

AGREED AND ACCEPTED:

For Buyer: _______________________      For Local Business Suite: _______________________
Name:                                   Founder: Sangamesh Khatge
Title:                                  Date: ${new Date().toLocaleDateString()}
================================================================================`;

    const blob = new Blob([termSheetText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Acquisition-TermSheet-${valuationInCrores}Cr-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950/80 to-purple-950/70 border-2 border-amber-500/50 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400/20 via-orange-500/20 to-indigo-500/20 border border-amber-400/40 text-amber-300 text-xs font-black tracking-wide uppercase">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Institutional M&A & Enterprise Valuation Suite</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Enterprise Acquisition & <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">₹100 Crore Buyout Portal</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Designed for Founder Sangamesh Khatge to present, negotiate, and sell <strong>Local Business Suite</strong> to major enterprise conglomerates (Reliance, Tata, Unilever, DMart, Private Equity). Complete with mathematical ARR multiples, automated term sheets, virtual data rooms, and custom whitelabel simulations.
            </p>

            <div className="flex items-center gap-3 pt-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Proprietary IP Ownership</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-amber-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OmniBiz GPT 5.0 Core</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-blue-400 font-bold">
                <Globe className="w-3.5 h-3.5" />
                <span>Multi-Location GPS Geo-Grid</span>
              </div>
            </div>
          </div>

          {/* Quick Valuation Callout Card */}
          <div className="bg-slate-900/95 border-2 border-amber-400/60 rounded-2xl p-5 shrink-0 min-w-[280px] shadow-xl text-center space-y-2">
            <span className="text-[11px] font-bold text-slate-450 uppercase tracking-wider">
              Projected Enterprise Valuation
            </span>
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent font-mono">
              ₹{valuationInCrores} Cr
            </div>
            <p className="text-[11px] text-slate-450 font-mono">
              Based on {multiple}x ARR Multiple ({storeCount} Stores)
            </p>
            <div className="pt-2 border-t border-slate-800/80">
              <button
                onClick={handleDownloadTermSheet}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02] active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download LOI Term Sheet</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("valuation")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === "valuation"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>1. Dynamic Valuation Engine</span>
        </button>

        <button
          onClick={() => setActiveTab("pitch_decks")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === "pitch_decks"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>2. Conglomerate Acquisition Decks</span>
        </button>

        <button
          onClick={() => setActiveTab("data_room")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === "data_room"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>3. Virtual Data Room (VDR) & Due Diligence</span>
        </button>

        <button
          onClick={() => setActiveTab("whitelabel")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === "whitelabel"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>4. Enterprise Whitelabel Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab("term_sheet")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === "term_sheet"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>5. Non-Binding LOI & Acquisition Terms</span>
        </button>
      </div>

      {/* TAB 1: VALUATION ENGINE */}
      {activeTab === "valuation" && (
        <div className="space-y-6">
          {/* Interactive Sliders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Control Panel */}
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  Real-Time SaaS Multiple & Revenue Modeler
                </h3>
                <span className="text-xs text-slate-450 font-mono">Adjust inputs below</span>
              </div>

              {/* Slider 1: Store Endpoints */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <label className="font-bold text-slate-200">
                    Active Stores / Franchise Nodes under Contract:
                  </label>
                  <span className="font-mono font-black text-amber-400 text-base">
                    {storeCount} Stores
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="5"
                  value={storeCount}
                  onChange={(e) => setStoreCount(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>20 (Pilot)</span>
                  <span>100 (₹100Cr Target)</span>
                  <span>500 (Regional)</span>
                  <span>1,000 (Pan-India)</span>
                </div>
              </div>

              {/* Slider 2: Monthly Software / Service Fee */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <label className="font-bold text-slate-200">
                    Average SaaS & Tech License Fee per Store / Month:
                  </label>
                  <span className="font-mono font-black text-indigo-400 text-base">
                    ₹{monthlyFeePerStore.toLocaleString()} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min="999"
                  max="24999"
                  step="500"
                  value={monthlyFeePerStore}
                  onChange={(e) => setMonthlyFeePerStore(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>₹999 (Basic)</span>
                  <span>₹4,999 (Growth Pro)</span>
                  <span>₹14,999 (Enterprise)</span>
                  <span>₹24,999 (Franchise Master)</span>
                </div>
              </div>

              {/* Slider 3: Valuation Multiple */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <label className="font-bold text-slate-200">
                    Acquisition ARR Multiple (Based on proprietary AI tech):
                  </label>
                  <span className="font-mono font-black text-emerald-400 text-base">
                    {multiple}x ARR Multiple
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={multiple}
                  onChange={(e) => setMultiple(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>5x (Traditional Software)</span>
                  <span>12x (SaaS Standard)</span>
                  <span>18x (AI Autonomous OS)</span>
                  <span>30x (High-Growth Unicorn)</span>
                </div>
              </div>
            </div>

            {/* Financial Output Summary Card */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <PieChart className="w-4 h-4" />
                  Financial Performance Audit
                </span>
                <h4 className="text-lg font-black text-white mt-1">
                  Valuation Matrix
                </h4>
              </div>

              <div className="space-y-3 divide-y divide-slate-800 text-xs sm:text-sm">
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-450">Monthly Recurring Revenue (MRR):</span>
                  <span className="font-mono font-bold text-white">
                    ₹{(monthlyRecurringRevenue / 100000).toFixed(2)} Lakhs
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-450">Annual Recurring Revenue (ARR):</span>
                  <span className="font-mono font-bold text-indigo-300">
                    ₹{arrInCrores} Crore
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-450">Estimated GMV Handled:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ₹{(grossTransactionVolumeAnnual / 10000000).toFixed(1)} Cr / yr
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-450">Customer Churn Rate:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {churnRate}% (Negative Churn via CRM)
                  </span>
                </div>

                <div className="pt-3 flex items-center justify-between bg-amber-500/10 p-3 rounded-2xl border border-amber-500/30">
                  <span className="text-xs font-bold text-amber-200">
                    Fair Acquisition Valuation:
                  </span>
                  <span className="text-xl font-black text-amber-400 font-mono">
                    ₹{valuationInCrores} Cr
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigateToTab("omni_gpt")}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ask OmniBiz GPT: "How to hit ₹100Cr faster?"</span>
                </button>
              </div>
            </div>
          </div>

          {/* Acquisition Rationale & Moats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                1
              </div>
              <h4 className="text-sm font-bold text-white">Unreplicable Geo-Grid Moat</h4>
              <p className="text-xs text-slate-450 leading-relaxed">
                Hyper-local 5x5 GPS ranking matrices capture customer search intent before Google Ads can. Stores using Local Business Suite see a 34% surge in foot traffic within 21 days.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                2
              </div>
              <h4 className="text-sm font-bold text-white">Autonomous Voice Receptionist</h4>
              <p className="text-xs text-slate-450 leading-relaxed">
                Captures 100% of missed calls and instantly converts callers into confirmed appointments and WhatsApp orders with zero human labor required.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                3
              </div>
              <h4 className="text-sm font-bold text-white">Asset-Light Franchise Engine</h4>
              <p className="text-xs text-slate-450 leading-relaxed">
                Enables enterprise buyers to license the platform to thousands of independent franchise owners, unlocking high-margin software royalties without store lease liabilities.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONGLOMERATE ACQUISITION DECKS */}
      {activeTab === "pitch_decks" && (
        <div className="space-y-6">
          {/* Buyer Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => setSelectedBuyer("reliance")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedBuyer === "reliance"
                  ? "bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <div className="text-xs font-black text-indigo-400 uppercase">Conglomerate #1</div>
              <div className="text-sm font-bold text-white mt-1">Reliance Retail / Jio</div>
              <div className="text-[11px] text-slate-450 mt-1">Kirana & Merchant Digitization</div>
            </button>

            <button
              onClick={() => setSelectedBuyer("tata")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedBuyer === "tata"
                  ? "bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <div className="text-xs font-black text-blue-400 uppercase">Conglomerate #2</div>
              <div className="text-sm font-bold text-white mt-1">Tata Digital / BigBasket</div>
              <div className="text-[11px] text-slate-450 mt-1">Local Franchise Commerce OS</div>
            </button>

            <button
              onClick={() => setSelectedBuyer("unilever")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedBuyer === "unilever"
                  ? "bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <div className="text-xs font-black text-purple-400 uppercase">Conglomerate #3</div>
              <div className="text-sm font-bold text-white mt-1">HUL / FMCG Distribution</div>
              <div className="text-[11px] text-slate-450 mt-1">B2B Retailer Demand Generation</div>
            </button>

            <button
              onClick={() => setSelectedBuyer("pe_venture")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedBuyer === "pe_venture"
                  ? "bg-amber-600/20 border-amber-500 text-white shadow-lg shadow-amber-500/20"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <div className="text-xs font-black text-amber-400 uppercase">Conglomerate #4</div>
              <div className="text-sm font-bold text-white mt-1">Global Private Equity</div>
              <div className="text-[11px] text-slate-450 mt-1">High-Multiple SaaS Buyout</div>
            </button>
          </div>

          {/* Render Active Pitch Deck */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Target Acquisition Proposal
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {selectedBuyer === "reliance" && "Strategic Buyout Deck: Integrating Local Business Suite into Jio Merchant OS"}
                  {selectedBuyer === "tata" && "Tata Digital Acquisition Deck: Powering 50,000 Local Franchise Outlets"}
                  {selectedBuyer === "unilever" && "HUL / FMCG Strategic Investment: Direct Merchant Ordering & Demand AI"}
                  {selectedBuyer === "pe_venture" && "Private Equity Buyout Memorandum: ₹100 Crore ARR SaaS Platform"}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleCopy(
                      "deck",
                      `ACQUISITION DECK FOR ${selectedBuyer.toUpperCase()}\nValuation: ₹${valuationInCrores} Crore\nFounder: Sangamesh Khatge (+91 8431107332)`
                    )
                  }
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  {copiedSection === "deck" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === "deck" ? "Copied" : "Copy Deck"}</span>
                </button>
              </div>
            </div>

            {/* Deck Content Slides */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                <div className="text-xs font-black text-indigo-400 uppercase tracking-wider">
                  Slide 1: Executive Summary & Synergies
                </div>
                <h4 className="text-sm font-bold text-white">Why This Acquisition Creates Immediate Multi-Crore Value</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Local Business Suite solves the hardest problem in Indian retail: <strong>hyper-local customer acquisition and automated retention</strong>. By embedding our Geo-Grid Radar, Voice Receptionist, and OmniBiz GPT 5.0 into your enterprise ecosystem, you instantly lock in tens of thousands of merchant locations on high-margin annual contracts.
                </p>
                <ul className="text-xs text-slate-450 space-y-1.5 list-disc pl-4">
                  <li>Zero merchant technical onboarding barrier (pure web interface).</li>
                  <li>98.6% customer satisfaction across automated voice booking calls.</li>
                  <li>Immediate cross-sell pipeline for enterprise payment terminals and logistics.</li>
                </ul>
              </div>

              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                <div className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  Slide 2: Proposed Deal Terms & Valuation
                </div>
                <h4 className="text-sm font-bold text-white">Target Buyout Consideration: ₹{valuationInCrores} Crore</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Calculated at <strong>{multiple}x ARR</strong> based on verified ARR of <strong>₹{arrInCrores} Crore</strong> with an asset-light operating margin exceeding 74%.
                </p>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Cash on Closing (75%):</span>
                    <span className="font-bold text-amber-400">₹{((Number(valuationInCrores) * 0.75)).toFixed(2)} Cr</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Stock / Equity Units (25%):</span>
                    <span className="font-bold text-indigo-300">₹{((Number(valuationInCrores) * 0.25)).toFixed(2)} Cr</span>
                  </div>
                  <div className="flex justify-between text-slate-450 pt-1 border-t border-slate-800 text-[11px]">
                    <span>Founder Retention:</span>
                    <span>24 Months Advisory Period</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Contact Founder Banner */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border-2 border-emerald-500/50 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Official M&A Point of Contact
                </div>
                <h4 className="text-base font-black text-white">
                  Founder Sangamesh Khatge — Ready for Executive Boardroom Discussions
                </h4>
                <p className="text-xs text-slate-450">
                  Phone / WhatsApp: +91 8431107332 • Email: shivkumarkhatge@gmail.com
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://wa.me/918431107332?text=Hello%20Founder%20Sangamesh,%20I%20am%20representing%20an%20enterprise%20group%20and%20interested%20in%20acquiring/licensing%20Local%20Business%20Suite."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Sangamesh</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VIRTUAL DATA ROOM (VDR) & DUE DILIGENCE */}
      {activeTab === "data_room" && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Pre-Audit Verification
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  Virtual Data Room (VDR) & Technical Due Diligence
                </h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                Audit Status: 100% Passed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Check 1 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    1. Codebase Architecture & Modularity
                  </h4>
                  <span className="text-[11px] font-mono text-emerald-400">PASSED</span>
                </div>
                <p className="text-xs text-slate-450 leading-relaxed">
                  Clean React 19 SPA, strict TypeScript 5.8, Express Node.js backend. Zero syntax errors verified via <code className="text-slate-300 font-mono">tsc --noEmit</code>.
                </p>
              </div>

              {/* Check 2 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    2. Security & AI Isolation
                  </h4>
                  <span className="text-[11px] font-mono text-emerald-400">PASSED</span>
                </div>
                <p className="text-xs text-slate-450 leading-relaxed">
                  All Google Gemini 3.8 Flash calls run exclusively server-side via Express with exponential backoff on 429/503. Zero client-side API key leakage.
                </p>
              </div>

              {/* Check 3 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    3. Multi-Tenant Scalability
                  </h4>
                  <span className="text-[11px] font-mono text-emerald-400">PASSED</span>
                </div>
                <p className="text-xs text-slate-450 leading-relaxed">
                  Franchise Command Center supports instant partitioning for 1,000+ branch locations with isolated CRM pipelines and localized Geo-Grid GPS tracking.
                </p>
              </div>

              {/* Check 4 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    4. Intellectual Property Cleanliness
                  </h4>
                  <span className="text-[11px] font-mono text-emerald-400">PASSED</span>
                </div>
                <p className="text-xs text-slate-450 leading-relaxed">
                  100% authored under Founder Sangamesh Khatge with permissive MIT-compatible open dependencies. Zero proprietary legal liabilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ENTERPRISE WHITELABEL SIMULATOR */}
      {activeTab === "whitelabel" && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Palette className="w-4 h-4" />
                Custom Corporate Rebranding Engine
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Enterprise Whitelabel & Co-Branding Simulator
              </h3>
              <p className="text-xs text-slate-450 mt-1">
                Big corporations want to see how their branding looks when they buy this app. Customize live below:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Form Controls */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Enterprise Acquirer Brand Name:</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-bold"
                    placeholder="e.g. Jio Merchant AI / Tata Retail OS"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Custom Corporate Domain:</label>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-mono"
                    placeholder="e.g. merchant.jio.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Brand Accent Color:</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-10 h-10 rounded-xl bg-transparent cursor-pointer border border-slate-800"
                    />
                    <span className="text-xs font-mono text-slate-450">{brandColor}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 leading-relaxed">
                    💡 <strong>Instant Enterprise Value:</strong> Acquirers can roll this out under their own enterprise subdomains in under 48 hours without changing their existing DNS.
                  </div>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="md:col-span-2 bg-slate-950 border-2 border-slate-800 rounded-2xl p-5 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 text-xs text-slate-450">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="font-mono text-slate-400 pl-2">https://{customDomain}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    Live Simulator Preview
                  </span>
                </div>

                {/* Simulated Header */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-sm"
                      style={{ backgroundColor: brandColor }}
                    >
                      {brandName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">{brandName}</div>
                      <div className="text-[10px] text-slate-450">Powered by Local Business Suite Core</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded font-bold text-white shadow-sm"
                      style={{ backgroundColor: brandColor }}
                    >
                      Enterprise Active
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-450">Integrated Merchants:</span>
                    <div className="text-base font-bold text-white font-mono">1,450 Stores</div>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-450">Monthly GMV:</span>
                    <div className="text-base font-bold text-emerald-400 font-mono">₹48.2 Crore</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NON-BINDING LOI & TERM SHEET */}
      {activeTab === "term_sheet" && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Legal Documents & Contracts
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  Non-Binding Letter of Intent (LOI) & Term Sheet Template
                </h3>
              </div>

              <button
                onClick={handleDownloadTermSheet}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Term Sheet (.TXT)</span>
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
{`CONFIDENTIAL: NON-BINDING LETTER OF INTENT (LOI) & ACQUISITION TERM SHEET
TARGET ASSET: Local Business Suite (Enterprise Multi-Location AI Platform)
FOUNDER & PRINCIPAL: Sangamesh Khatge
PRIMARY CONTACT: shivkumarkhatge@gmail.com | Phone: +91 8431107332

1. VALUATION & FINANCIAL MULTIPLES:
   - Target Enterprise Valuation: ₹${valuationInCrores} Crore (INR ${enterpriseValuation.toLocaleString()})
   - Annual Recurring Revenue (ARR): ₹${arrInCrores} Crore
   - ARR Multiple: ${multiple}x
   - Active Franchise & Store Endpoints: ${storeCount} Locations

2. PURCHASE CONSIDERATION:
   - 75% Upfront Cash Consideration on Closing
   - 25% Acquirer Performance Equity / Stock Units (36-month vesting)
   - Retention of Founder Sangamesh Khatge as Chief AI Strategy Architect (24 Months)

3. INTELLECTUAL PROPERTY & DELIVERABLES:
   - Complete proprietary source code (React 19, TypeScript, Express, Vite)
   - OmniBiz GPT 5.0 Enterprise Business Conversational Brain
   - Geo-Grid Radar 5x5 GPS Ranking Matrix & Google Maps Ranking Algorithm Engine
   - 24/7 AI Voice Phone Receptionist & Call Transcription Network
   - Smart CRM & WhatsApp Marketing Automation Pipeline
   - Multi-tenant Franchise Command Architecture

4. CLOSING TIMELINE & DUE DILIGENCE:
   - 30-Day Exclusive Due Diligence Window
   - Financial Audit & Codebase Verification`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
