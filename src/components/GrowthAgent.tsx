import React, { useState, useEffect } from "react";
import {
  Rocket,
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Target,
  Users,
  MapPin,
  Sparkles,
  Download,
  Copy,
  Check,
  ChevronRight,
  Filter,
  Layers,
  Clock,
  ArrowUpRight,
  HelpCircle,
  FolderPlus
} from "lucide-react";
import { GrowthPlan, MarketingCalendarDay, WeeklyActionItem } from "../types";

interface GrowthAgentProps {
  isKeyReady: boolean;
  onOpenKeyGuide: () => void;
  onSaveToWorkspace?: (title: string, type: any, data: any) => void;
}

export default function GrowthAgent({
  isKeyReady,
  onOpenKeyGuide,
  onSaveToWorkspace,
}: GrowthAgentProps) {
  const [businessName, setBusinessName] = useState(() => {
    try {
      const p = localStorage.getItem("lbs_unified_business_profile");
      if (p) return JSON.parse(p).businessName || "Artisan Roast Cafe";
    } catch {}
    return "Artisan Roast Cafe";
  });
  const [industry, setIndustry] = useState(() => {
    try {
      const p = localStorage.getItem("lbs_unified_business_profile");
      if (p) return JSON.parse(p).category || "Specialty Cafe & Bakery";
    } catch {}
    return "Specialty Cafe & Bakery";
  });
  const [location, setLocation] = useState(() => {
    try {
      const p = localStorage.getItem("lbs_unified_business_profile");
      if (p) {
        const parsed = JSON.parse(p);
        return `${parsed.locality || "Indiranagar"}, ${parsed.city || "Bengaluru"}`;
      }
    } catch {}
    return "Indiranagar, Bangalore";
  });
  const [targetCustomers, setTargetCustomers] = useState(() => {
    try {
      const p = localStorage.getItem("lbs_unified_business_profile");
      if (p) return JSON.parse(p).targetAudience || "Tech professionals, remote workers & neighborhood foodies";
    } catch {}
    return "Tech professionals, remote workers & neighborhood foodies";
  });
  const [budget, setBudget] = useState(15000);
  const [currency, setCurrency] = useState("INR");

  const [isLoading, setIsLoading] = useState(false);
  const [growthPlan, setGrowthPlan] = useState<GrowthPlan | null>(() => {
    try {
      const saved = localStorage.getItem("lbs_saved_growth_plan");
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const [activeTab, setActiveTab] = useState<"calendar" | "checklist" | "budget" | "acquisition">("calendar");
  const [calendarChannelFilter, setCalendarChannelFilter] = useState<string>("All");
  const [checklistItems, setChecklistItems] = useState<WeeklyActionItem[]>([]);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (growthPlan?.weeklyActionChecklist) {
      setChecklistItems(growthPlan.weeklyActionChecklist);
    }
  }, [growthPlan]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/growth-agent/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          industry,
          location,
          targetCustomers,
          budget: Number(budget) || 15000,
          currency,
        }),
      });

      const data = await res.json();
      if (res.ok && data.growthPlan) {
        const fullPlan: GrowthPlan = {
          ...data.growthPlan,
          id: `plan-${Date.now()}`,
          businessName,
          industry,
          location,
          targetCustomers,
          budget: Number(budget) || 15000,
          currency,
          createdAt: new Date().toISOString(),
        };

        setGrowthPlan(fullPlan);
        setChecklistItems(fullPlan.weeklyActionChecklist);
        localStorage.setItem("lbs_saved_growth_plan", JSON.stringify(fullPlan));
      }
    } catch (err) {
      console.error("Failed to generate plan:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChecklist = (id: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleApplyPreset = (preset: {
    name: string;
    ind: string;
    loc: string;
    target: string;
    budg: number;
  }) => {
    setBusinessName(preset.name);
    setIndustry(preset.ind);
    setLocation(preset.loc);
    setTargetCustomers(preset.target);
    setBudget(preset.budg);
  };

  const handleSaveProject = () => {
    if (!growthPlan) return;
    if (onSaveToWorkspace) {
      onSaveToWorkspace(
        `${growthPlan.businessName} - 30-Day Growth Strategy`,
        "Growth Plan",
        growthPlan
      );
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleExportMarkdown = () => {
    if (!growthPlan) return;
    const text = `# 30-DAY BUSINESS GROWTH PLAN: ${growthPlan.businessName}
Industry: ${growthPlan.industry} | Location: ${growthPlan.location}
Budget: ₹${growthPlan.budget} ${growthPlan.currency}
Generated: ${new Date(growthPlan.createdAt).toLocaleDateString()}

## EXECUTIVE STRATEGY
${growthPlan.executiveSummary}

## GROWTH PHASES
- Phase 1: ${growthPlan.growthPhases.phase1.title}
  Objective: ${growthPlan.growthPhases.phase1.objective}
- Phase 2: ${growthPlan.growthPhases.phase2.title}
  Objective: ${growthPlan.growthPhases.phase2.objective}
- Phase 3: ${growthPlan.growthPhases.phase3.title}
  Objective: ${growthPlan.growthPhases.phase3.objective}

## 30-DAY MARKETING CALENDAR
${growthPlan.marketingCalendar.map((d) => `Day ${d.day} [${d.channel}]: ${d.theme} - ${d.action}`).join("\n")}

## WEEKLY ACTIONS
${checklistItems.map((c) => `- [${c.completed ? "X" : " "}] Week ${c.week} (${c.priority}): ${c.task}`).join("\n")}
`;

    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${growthPlan.businessName.replace(/\s+/g, "_")}_Growth_Plan.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedCount = checklistItems.filter((i) => i.completed).length;
  const progressPercent = checklistItems.length > 0 ? Math.round((completedCount / checklistItems.length) * 100) : 0;

  const filteredCalendar = (growthPlan?.marketingCalendar || []).filter((d) => {
    if (calendarChannelFilter === "All") return true;
    return d.channel.toLowerCase().includes(calendarChannelFilter.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border-2 border-blue-500/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-black uppercase tracking-wider">
              <Rocket className="w-3.5 h-3.5 text-blue-400" />
              <span>Autonomous Growth Engine</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              AI Business Growth Agent
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Enter your business parameters. The Growth Agent architects an end-to-end 30-day expansion blueprint, channel budget allocation, marketing calendar, and interactive execution checklist.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {growthPlan && (
              <>
                <button
                  onClick={handleSaveProject}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{savedSuccess ? "Saved to Workspace!" : "Save Plan"}</span>
                </button>
                <button
                  onClick={handleExportMarkdown}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Plan (.md)</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Input Configuration Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span>Target Business Profile</span>
          </h3>

          {/* Quick Presets */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="text-slate-400">Sample Presets:</span>
            <button
              onClick={() =>
                handleApplyPreset({
                  name: "Saffron Spices Cloud Kitchen",
                  ind: "Food Delivery & Catering",
                  loc: "Koramangala, Bangalore",
                  target: "Office professionals & late night diners",
                  budg: 20000,
                })
              }
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px]"
            >
              Cloud Kitchen
            </button>
            <button
              onClick={() =>
                handleApplyPreset({
                  name: "Velvet Thread Boutique",
                  ind: "Ethnic Designer Fashion",
                  loc: "Bandra West, Mumbai",
                  target: "Wedding shoppers & bridal parties",
                  budg: 35000,
                })
              }
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px]"
            >
              Fashion Boutique
            </button>
            <button
              onClick={() =>
                handleApplyPreset({
                  name: "Apex Iron Fitness Studio",
                  ind: "Boutique Gym & Personal Training",
                  loc: "Jubilee Hills, Hyderabad",
                  target: "Corporate executives & fitness enthusiasts",
                  budg: 25000,
                })
              }
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px]"
            >
              Fitness Gym
            </button>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Business Brand Name:
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Artisan Roast Cafe"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Industry & Category:
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Cafe, Bakery, Dental Clinic"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Physical Store Location / City:</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Indiranagar, Bangalore"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Target Customer Persona:</span>
              </label>
              <input
                type="text"
                value={targetCustomers}
                onChange={(e) => setTargetCustomers(e.target.value)}
                placeholder="e.g. Local professionals, weekend families, students"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>Monthly Growth Budget (₹ / INR):</span>
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                min={2000}
                step={1000}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-blue-400"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Engineered for local storefronts, franchise chains & service retailers.
            </span>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? "Generating 30-Day Growth Plan..." : "Generate 30-Day Growth Plan"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Growth Plan Results View */}
      {growthPlan && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="bg-slate-900 border-2 border-blue-500/30 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                <h3 className="text-base font-bold text-white">Executive Strategy Thesis</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Target: 3.4x Footfall Acceleration
              </span>
            </div>

            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              {growthPlan.executiveSummary}
            </p>

            {/* 3 Phases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">Phase 1</span>
                  <span className="text-[10px] font-mono text-slate-400">Days 1 - 10</span>
                </div>
                <h4 className="text-xs font-bold text-white">{growthPlan.growthPhases.phase1.title}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{growthPlan.growthPhases.phase1.objective}</p>
                <ul className="text-[11px] text-slate-300 space-y-1 pt-1">
                  {growthPlan.growthPhases.phase1.tactics.map((t, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-400">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Phase 2</span>
                  <span className="text-[10px] font-mono text-slate-400">Days 11 - 20</span>
                </div>
                <h4 className="text-xs font-bold text-white">{growthPlan.growthPhases.phase2.title}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{growthPlan.growthPhases.phase2.objective}</p>
                <ul className="text-[11px] text-slate-300 space-y-1 pt-1">
                  {growthPlan.growthPhases.phase2.tactics.map((t, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-indigo-400">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Phase 3</span>
                  <span className="text-[10px] font-mono text-slate-400">Days 21 - 30</span>
                </div>
                <h4 className="text-xs font-bold text-white">{growthPlan.growthPhases.phase3.title}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{growthPlan.growthPhases.phase3.objective}</p>
                <ul className="text-[11px] text-slate-300 space-y-1 pt-1">
                  {growthPlan.growthPhases.phase3.tactics.map((t, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Deep-Dive Interactive Tabs */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  onClick={() => setActiveTab("calendar")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    activeTab === "calendar"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>30-Day Marketing Calendar</span>
                </button>

                <button
                  onClick={() => setActiveTab("checklist")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    activeTab === "checklist"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Weekly Action Checklist ({completedCount}/{checklistItems.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("budget")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    activeTab === "budget"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Budget Allocation</span>
                </button>

                <button
                  onClick={() => setActiveTab("acquisition")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    activeTab === "acquisition"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Acquisition Channels</span>
                </button>
              </div>

              {activeTab === "checklist" && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Progress:</span>
                  <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-emerald-400 font-bold font-mono">{progressPercent}%</span>
                </div>
              )}
            </div>

            {/* TAB 1: 30-DAY MARKETING CALENDAR */}
            {activeTab === "calendar" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <span className="text-slate-400">Filter Calendar by Channel:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {["All", "Instagram", "WhatsApp", "Google Maps", "In-Store"].map((ch) => (
                      <button
                        key={ch}
                        onClick={() => setCalendarChannelFilter(ch)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                          calendarChannelFilter === ch
                            ? "bg-blue-600 text-white"
                            : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredCalendar.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                            Day {item.day}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 font-semibold">
                            {item.channel}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-white">{item.theme}</h5>
                        <p className="text-[11px] text-slate-300 leading-snug">{item.action}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-850 space-y-1">
                        <div className="text-[10px] text-slate-400">
                          <strong className="text-slate-300">Visual Idea:</strong> {item.visualIdea}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono font-semibold">
                          CTA: "{item.callToAction}"
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: WEEKLY ACTION CHECKLIST */}
            {activeTab === "checklist" && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  Click any checkbox below as your team executes the actions. Progress is automatically saved to your browser session.
                </p>

                <div className="space-y-2.5">
                  {checklistItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleChecklist(item.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        item.completed
                          ? "bg-emerald-950/20 border-emerald-500/40 opacity-75"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          item.completed
                            ? "bg-emerald-500 border-emerald-500 text-slate-950"
                            : "border-slate-600 bg-slate-900"
                        }`}
                      >
                        {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-300 font-bold">
                            Week {item.week}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.2 rounded ${
                              item.priority === "High"
                                ? "bg-red-500/20 text-red-300"
                                : item.priority === "Medium"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-blue-500/20 text-blue-300"
                            }`}
                          >
                            {item.priority} Priority
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{item.targetChannel}</span>
                        </div>

                        <p
                          className={`text-xs font-semibold ${
                            item.completed ? "line-through text-slate-400" : "text-white"
                          }`}
                        >
                          {item.task}
                        </p>

                        <div className="text-[11px] text-emerald-400/90 font-mono">
                          Expected Outcome: {item.expectedOutcome}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: BUDGET ALLOCATION */}
            {activeTab === "budget" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {growthPlan.budgetAllocation.map((channel, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{channel.channel}</h4>
                        <span className="text-xs font-mono font-black text-amber-300">
                          {channel.percentage}% (₹{channel.recommendedAmount.toLocaleString()})
                        </span>
                      </div>

                      {/* Percentage Bar */}
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                          style={{ width: `${channel.percentage}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-850">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Target CAC:</span>
                          <span className="text-emerald-300 font-mono font-bold">{channel.targetCAC}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Projected Outcome:</span>
                          <span className="text-slate-300 font-semibold">{channel.expectedReturn}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: ACQUISITION CHANNELS */}
            {activeTab === "acquisition" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Organic Footfall & Content</span>
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    {growthPlan.customerAcquisitionStrategy.organic.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Local Neighborhood Partnerships</span>
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    {growthPlan.customerAcquisitionStrategy.localPartnerships.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-blue-400">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Paid Hyper-Local Advertising</span>
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    {growthPlan.customerAcquisitionStrategy.paidAdvertising.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Retention & Referral Loops</span>
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    {growthPlan.customerAcquisitionStrategy.retentionAndReferrals.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-purple-400">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
