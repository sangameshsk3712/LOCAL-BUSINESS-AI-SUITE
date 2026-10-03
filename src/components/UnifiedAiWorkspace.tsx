import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Building2,
  MapPin,
  Target,
  Phone,
  Rocket,
  Search,
  MessageCircle,
  FileText,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Layers,
  Award,
  Star,
  Download,
  Share2,
  CheckCircle2,
  FolderPlus,
  ArrowRight
} from "lucide-react";

export interface UnifiedBusinessProfile {
  businessName: string;
  category: string;
  city: string;
  locality: string;
  targetAudience: string;
  uniqueSellingPoint: string;
  phone: string;
  googleRating: number;
  monthlyGoal: string;
  highIntentKeywords: string;
  offerOrDiscount: string;
  lastUpdated?: string;
}

const DEFAULT_PROFILE: UnifiedBusinessProfile = {
  businessName: "Artisan Sourdough & Specialty Coffee",
  category: "Bakery & Specialty Cafe",
  city: "Bangalore",
  locality: "Indiranagar",
  targetAudience: "Urban professionals, foodies, remote workers & weekend families",
  uniqueSellingPoint: "100% wild-fermented organic sourdough & freshly roasted high-altitude Arabica",
  phone: "8431107332",
  googleRating: 4.8,
  monthlyGoal: "1,500 footfall visits & ₹4,50,000 monthly revenue",
  highIntentKeywords: "best sourdough bread near me, artisan bakery cafe, fresh coffee, breakfast brunch",
  offerOrDiscount: "Flat 20% off on first breakfast combo with free sourdough toast tasting",
};

interface Props {
  onNavigateToTab?: (tab: string) => void;
  onSaveToWorkspace?: (title: string, type: any, data: any) => void;
}

export default function UnifiedAiWorkspace({ onNavigateToTab, onSaveToWorkspace }: Props) {
  const [profile, setProfile] = useState<UnifiedBusinessProfile>(() => {
    try {
      const saved = localStorage.getItem("lbs_unified_business_profile");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PROFILE;
  });

  const [activeOutputTab, setActiveOutputTab] = useState<"seo" | "ad_copy" | "leads" | "growth">("seo");
  const [isRunningPipeline, setIsRunningPipeline] = useState<boolean>(false);
  const [pipelineOutput, setPipelineOutput] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [profileSavedNotice, setProfileSavedNotice] = useState<boolean>(false);
  const [savedToWorkspaceNotice, setSavedToWorkspaceNotice] = useState<string | null>(null);

  // Auto-save profile changes
  const handleProfileChange = (key: keyof UnifiedBusinessProfile, value: any) => {
    setProfile((prev) => {
      const updated = { ...prev, [key]: value, lastUpdated: new Date().toISOString() };
      try {
        localStorage.setItem("lbs_unified_business_profile", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setProfileSavedNotice(true);
    setTimeout(() => setProfileSavedNotice(false), 2000);
  };

  // Run the multi-tool pipeline
  const handleRunPipeline = async () => {
    setIsRunningPipeline(true);
    try {
      const res = await fetch("/api/workspace/unified-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success && data.toolsGenerated) {
        setPipelineOutput(data.toolsGenerated);
      }
    } catch (err) {
      console.error("Pipeline run failed:", err);
    } finally {
      setIsRunningPipeline(false);
    }
  };

  // Initial auto-run if no outputs exist
  useEffect(() => {
    if (!pipelineOutput) {
      handleRunPipeline();
    }
  }, []);

  const handleCopyText = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveOutputToWorkspace = (moduleName: string, content: any) => {
    try {
      const existing = JSON.parse(localStorage.getItem("lbs_workspace_projects") || "[]");
      const newProj = {
        id: `proj-${Date.now()}`,
        title: `${profile.businessName} - Unified ${moduleName}`,
        type: moduleName,
        data: content,
        createdAt: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
        author: "Unified AI Workspace",
        tags: [profile.category, profile.locality, "Unified AI"],
      };
      existing.unshift(newProj);
      localStorage.setItem("lbs_workspace_projects", JSON.stringify(existing));
      if (onSaveToWorkspace) {
        onSaveToWorkspace(newProj.title, moduleName, content);
      }
      setSavedToWorkspaceNotice(`Saved to Pro Workspace Projects!`);
      setTimeout(() => setSavedToWorkspaceNotice(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Hero Card */}
      <div className="bg-gradient-to-r from-slate-900/98 via-indigo-950/60 to-slate-900/98 border-2 border-indigo-500/60 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden ring-2 ring-indigo-400/30 backdrop-blur-2xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-xl shadow-indigo-950/50 shrink-0 ring-4 ring-indigo-400/40">
              <Layers className="w-9 h-9 sm:w-11 sm:h-11 text-white" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/50 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Unified AI Workspace
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Single Profile Multi-Tool Engine
                </span>
                {profileSavedNotice && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    Profile Auto-Saved
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Enter Once. Feed All AI Tools Simultaneously.
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Save hours of repetitive typing. Input your master business details once, and watch our AI automatically generate your Local SEO radar, multi-channel ad copy, WhatsApp customer lead sequences, and 90-day growth plans in parallel.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0">
            <button
              onClick={handleRunPipeline}
              disabled={isRunningPipeline}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600 hover:from-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 ring-2 ring-amber-300/40"
            >
              <RefreshCw className={`w-4 h-4 ${isRunningPipeline ? "animate-spin" : ""}`} />
              <span>{isRunningPipeline ? "Synthesizing All 4 Tools..." : "⚡ Run All 4 Tools with 1-Click"}</span>
            </button>

            {savedToWorkspaceNotice && (
              <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{savedToWorkspaceNotice}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout: Master Business Profile on Left, Multi-Tool Output Cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 Cols): Master Business Profile Form */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Master Business Profile
                </h3>
                <span className="text-[10px] text-slate-400">
                  Feeds SEO, Ads, CRM, and Growth simultaneously
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Synced
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Business Name */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Business Name:</label>
              <input
                type="text"
                value={profile.businessName}
                onChange={(e) => handleProfileChange("businessName", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold focus:outline-none focus:border-indigo-400"
                placeholder="e.g. Artisan Sourdough Bakery"
              />
            </div>

            {/* Category / Industry */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Category / Industry:</label>
              <input
                type="text"
                value={profile.category}
                onChange={(e) => handleProfileChange("category", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold focus:outline-none focus:border-indigo-400"
                placeholder="e.g. Bakery & Specialty Cafe, Dental Clinic, Salon"
              />
            </div>

            {/* Location (City & Locality) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 block mb-1">City / Region:</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => handleProfileChange("city", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold focus:outline-none focus:border-indigo-400"
                  placeholder="e.g. Bangalore"
                />
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Locality / Area:</label>
                <input
                  type="text"
                  value={profile.locality}
                  onChange={(e) => handleProfileChange("locality", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold focus:outline-none focus:border-indigo-400"
                  placeholder="e.g. Indiranagar"
                />
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Target Customer Audience:</label>
              <input
                type="text"
                value={profile.targetAudience}
                onChange={(e) => handleProfileChange("targetAudience", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-400"
                placeholder="e.g. Urban foodies, office workers, weekend brunch lovers"
              />
            </div>

            {/* Core USP / What makes you special */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Unique Selling Proposition (USP):</label>
              <textarea
                rows={2}
                value={profile.uniqueSellingPoint}
                onChange={(e) => handleProfileChange("uniqueSellingPoint", e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-400"
                placeholder="e.g. 100% wild-fermented organic sourdough with no preservatives"
              />
            </div>

            {/* Offer or Special Discount */}
            <div>
              <label className="font-bold text-amber-300 block mb-1">Hook / First-Visit Offer:</label>
              <input
                type="text"
                value={profile.offerOrDiscount}
                onChange={(e) => handleProfileChange("offerOrDiscount", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-300 font-semibold focus:outline-none focus:border-amber-400"
                placeholder="e.g. Flat 20% off on your first breakfast combo"
              />
            </div>

            {/* Store Contact & High-Intent Keywords */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Store Phone / WhatsApp:</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono focus:outline-none focus:border-indigo-400"
                  placeholder="8431107332"
                />
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Target Monthly Goal:</label>
                <input
                  type="text"
                  value={profile.monthlyGoal}
                  onChange={(e) => handleProfileChange("monthlyGoal", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-400"
                  placeholder="1,500 footfall visits"
                />
              </div>
            </div>

            {/* High Intent Keywords */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Core Keywords (Comma-separated):</label>
              <input
                type="text"
                value={profile.highIntentKeywords}
                onChange={(e) => handleProfileChange("highIntentKeywords", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-indigo-300 font-mono text-[11px] focus:outline-none focus:border-indigo-400"
                placeholder="sourdough bread, bakery cafe, specialty coffee"
              />
            </div>

            {/* Refresh Action */}
            <div className="pt-2">
              <button
                onClick={handleRunPipeline}
                disabled={isRunningPipeline}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01]"
              >
                <RefreshCw className={`w-4 h-4 ${isRunningPipeline ? "animate-spin" : ""}`} />
                <span>{isRunningPipeline ? "Updating All 4 Tools..." : "Update & Sync All 4 Tools"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Multi-Tool Output Cards */}
        <div className="lg:col-span-7 space-y-4">
          {/* Output Tool Navigation Tabs */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto scrollbar-none">
            {[
              { id: "seo", label: "1. Local SEO & Geo-Grid", icon: Search, badge: "Google Maps" },
              { id: "ad_copy", label: "2. Ad Copy Suite", icon: Rocket, badge: "Meta & Google" },
              { id: "leads", label: "3. WhatsApp Closer Leads", icon: MessageCircle, badge: "Inbound CRM" },
              { id: "growth", label: "4. 90-Day Growth Plan", icon: TrendingUp, badge: "Step-by-Step" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeOutputTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveOutputTab(tab.id as any)}
                  className={`flex-1 min-w-[140px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-1.5 whitespace-nowrap ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Loading Skeleton */}
          {isRunningPipeline && !pipelineOutput && (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <div className="text-sm font-bold text-white">Synthesizing Unified Multi-Tool Pipeline...</div>
              <div className="text-xs text-slate-400">
                Feeding "{profile.businessName}" into Local SEO, Ad Copy, WhatsApp Closer, and Growth engines.
              </div>
            </div>
          )}

          {/* TAB 1: LOCAL SEO & 5x5 GEO-GRID */}
          {activeOutputTab === "seo" && pipelineOutput?.seo && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-400" />
                  <h4 className="text-sm font-black text-white">
                    Local SEO & 5x5 Geo-Grid Rankings
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleCopyText(
                        JSON.stringify(pipelineOutput.seo, null, 2),
                        "seo_all"
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1"
                  >
                    {copiedKey === "seo_all" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === "seo_all" ? "Copied" : "Copy"}</span>
                  </button>
                  <button
                    onClick={() => handleSaveOutputToWorkspace("Local SEO", pipelineOutput.seo)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold flex items-center gap-1"
                  >
                    <FolderPlus className="w-3 h-3" />
                    <span>Save Project</span>
                  </button>
                  {onNavigateToTab && (
                    <button
                      onClick={() => onNavigateToTab("geogrid")}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-bold flex items-center gap-1"
                      title="Open 5x5 Radar"
                    >
                      <span>Open in Radar</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Google Maps Title */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Optimized Google Business Profile Title:
                </span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-emerald-300 font-bold">
                  <span>{pipelineOutput.seo.googleMapsTitle}</span>
                  <button
                    onClick={() => handleCopyText(pipelineOutput.seo.googleMapsTitle, "g_title")}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedKey === "g_title" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Geo-Grid High-Intent Keywords */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  5x5 Geo-Grid Coordinate Keywords:
                </span>
                <div className="space-y-1.5">
                  {pipelineOutput.seo.geoGridKeywords.map((k: any, i: number) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[10px]">
                          #{i + 1}
                        </span>
                        <strong className="text-white">{k.keyword}</strong>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-amber-300 font-bold">{k.radiusKm}</span>
                        <span className="text-slate-400">~{k.estimatedMonthlySearches}/mo</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable SEO Prescriptions */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Immediate Ranking Action Steps:
                </span>
                <div className="space-y-1.5">
                  {pipelineOutput.seo.actionableSeoPrescriptions.map((step: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AD COPY SUITE */}
          {activeOutputTab === "ad_copy" && pipelineOutput?.adCopy && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-purple-400" />
                  <h4 className="text-sm font-black text-white">
                    High-Converting Ad Copy Suite
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveOutputToWorkspace("Ad Copy Suite", pipelineOutput.adCopy)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold flex items-center gap-1"
                  >
                    <FolderPlus className="w-3 h-3" />
                    <span>Save Project</span>
                  </button>
                  {onNavigateToTab && (
                    <button
                      onClick={() => onNavigateToTab("targeted_ads")}
                      className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-slate-950 text-xs font-bold flex items-center gap-1"
                    >
                      <span>Open in Ads Studio</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Meta Carousel 3-Slides */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Instagram / Facebook Carousel (3 Slides):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {pipelineOutput.adCopy.metaCarousel.map((slide: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black uppercase text-purple-400">
                          Slide #{slide.slideNumber}
                        </span>
                        <h5 className="text-xs font-bold text-white">{slide.headline}</h5>
                        <p className="text-[11px] text-slate-300 leading-snug">{slide.body}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px]">
                        <span className="font-bold text-amber-300">{slide.callToAction}</span>
                        <button
                          onClick={() => handleCopyText(`${slide.headline}\n${slide.body}`, `slide_${idx}`)}
                          className="text-slate-400 hover:text-white"
                        >
                          {copiedKey === `slide_${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Flash Deal Broadcast */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Ready-to-Send WhatsApp Broadcast Copy:</span>
                </span>
                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 relative">
                  <pre className="text-xs font-sans text-emerald-200 whitespace-pre-wrap leading-relaxed">
                    {pipelineOutput.adCopy.whatsappFlashDeal}
                  </pre>
                  <button
                    onClick={() => handleCopyText(pipelineOutput.adCopy.whatsappFlashDeal, "wa_deal")}
                    className="absolute top-3 right-3 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1"
                  >
                    {copiedKey === "wa_deal" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === "wa_deal" ? "Copied" : "Copy Message"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER LEAD GENERATION & WHATSAPP CLOSER */}
          {activeOutputTab === "leads" && pipelineOutput?.customerLead && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-black text-white">
                    Customer Lead Generation & Closer Scripts
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveOutputToWorkspace("Leads Closer", pipelineOutput.customerLead)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold flex items-center gap-1"
                  >
                    <FolderPlus className="w-3 h-3" />
                    <span>Save Project</span>
                  </button>
                  {onNavigateToTab && (
                    <button
                      onClick={() => onNavigateToTab("crm")}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-bold flex items-center gap-1"
                    >
                      <span>Open in CRM</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Outreach Script */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Personalized 1-on-1 Outreach Pitch:
                </span>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed relative">
                  <p>{pipelineOutput.customerLead.outreachScript}</p>
                  <button
                    onClick={() => handleCopyText(pipelineOutput.customerLead.outreachScript, "outreach")}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white"
                  >
                    {copiedKey === "outreach" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Lead Qualification Filter */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  3 High-Ticket Qualification Questions:
                </span>
                <div className="space-y-1.5">
                  {pipelineOutput.customerLead.leadQualificationQuestions.map((q: string, i: number) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
                      <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                        {i + 1}
                      </span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Objection Rebuttals */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Storefront Objection Rebuttals:
                </span>
                <div className="space-y-2">
                  {pipelineOutput.customerLead.objectionRebuttals.map((r: any, i: number) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                      <div className="font-bold text-amber-300">Customer: "{r.objection}"</div>
                      <div className="text-slate-300 pl-2 border-l-2 border-emerald-500">
                        <strong>Closer Script:</strong> {r.rebuttal}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 90-DAY GROWTH PLAN */}
          {activeOutputTab === "growth" && pipelineOutput?.growthPlan && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <h4 className="text-sm font-black text-white">
                    90-Day Hyperlocal Growth & Revenue Plan
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveOutputToWorkspace("90-Day Growth Plan", pipelineOutput.growthPlan)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold flex items-center gap-1"
                  >
                    <FolderPlus className="w-3 h-3" />
                    <span>Save Project</span>
                  </button>
                  {onNavigateToTab && (
                    <button
                      onClick={() => onNavigateToTab("growth")}
                      className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-slate-950 text-xs font-bold flex items-center gap-1"
                    >
                      <span>Open Growth Agent</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* 3-Month Sprint Roadmaps */}
              <div className="space-y-3">
                {pipelineOutput.growthPlan.timeline.map((phase: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h5 className="text-xs font-black text-white">{phase.phase}</h5>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {phase.expectedOutcome}
                      </span>
                    </div>
                    <p className="text-xs text-amber-300 font-semibold">{phase.focus}</p>
                    <div className="space-y-1">
                      {phase.keyMilestones.map((m: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Budget & ROI Projection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Optimal Budget Allocation</span>
                  <div className="text-slate-300 space-y-1 text-[11px]">
                    <div>Meta Ads: <strong className="text-white">{pipelineOutput.growthPlan.budgetDistribution.metaLocalAds}</strong></div>
                    <div>Google Search: <strong className="text-white">{pipelineOutput.growthPlan.budgetDistribution.googleLocalSearch}</strong></div>
                    <div>QR Flyering & Referrals: <strong className="text-white">{pipelineOutput.growthPlan.budgetDistribution.printTableTentsAndReferrals}</strong></div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-950 border border-emerald-500/30 space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Projected 90-Day Output</span>
                  <div className="text-xs font-bold text-white">
                    {pipelineOutput.growthPlan.projectedRoi.projectedMonthlyRevenue}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Footfall: {pipelineOutput.growthPlan.projectedRoi.estimatedMonthlyFootfall}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono font-bold">
                    Target CAC: {pipelineOutput.growthPlan.projectedRoi.blendedCac}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
