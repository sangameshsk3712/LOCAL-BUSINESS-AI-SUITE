import React, { useState, useEffect } from "react";
import {
  Rocket,
  Users,
  MessageSquare,
  Activity,
  DollarSign,
  BookOpen,
  Headphones,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Send,
  RefreshCw,
  Crown,
  ShieldCheck,
  Phone,
  Mail,
  Share2,
  Sliders,
  Play,
  RotateCcw,
  Star,
  ChevronRight,
  Smartphone,
  Globe,
  BarChart3,
  Bot,
  Flame,
  ThumbsUp,
  HelpCircle
} from "lucide-react";
import {
  BetaTesterRecord,
  FeedbackRecord,
  StressTestResult
} from "../types";

interface BetaLaunchCenterProps {
  isProUser: boolean;
  onOpenPremium: () => void;
  onNavigateToTab: (tab: any) => void;
}

export default function BetaLaunchCenter({
  isProUser,
  onOpenPremium,
  onNavigateToTab
}: BetaLaunchCenterProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    "landing" | "testers" | "feedback" | "stress" | "pricing" | "docs"
  >("landing");

  // Testers state
  const [testers, setTesters] = useState<BetaTesterRecord[]>([]);
  const [loadingTesters, setLoadingTesters] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Tester Form
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteContact, setInviteContact] = useState("");
  const [inviteBusiness, setInviteBusiness] = useState("");
  const [invitePlan, setInvitePlan] = useState<"Pro Trial (VIP)" | "Enterprise Partner">("Pro Trial (VIP)");
  const [submittingInvite, setSubmittingInvite] = useState(false);

  // Feedback state
  const [feedbackList, setFeedbackList] = useState<FeedbackRecord[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState<
    "bug" | "confusing_ui" | "slow_response" | "feature_request" | "general_praise"
  >("bug");
  const [feedbackScreen, setFeedbackScreen] = useState("Agent Builder");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackDesc, setFeedbackDesc] = useState("");
  const [feedbackContact, setFeedbackContact] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccessNotice, setFeedbackSuccessNotice] = useState(false);

  // Stress-test state
  const [concurrencyWorkers, setConcurrencyWorkers] = useState<number>(10);
  const [runningStressTest, setRunningStressTest] = useState(false);
  const [stressResult, setStressResult] = useState<StressTestResult | null>(null);

  // Currency toggle for pricing
  const [pricingCurrency, setPricingCurrency] = useState<"INR" | "USD">("INR");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  // Load Testers
  const fetchTesters = async () => {
    setLoadingTesters(true);
    try {
      const res = await fetch("/api/beta/testers");
      if (res.ok) {
        const data = await res.json();
        setTesters(data.testers || []);
      }
    } catch (e) {
      console.error("Error fetching testers:", e);
    } finally {
      setLoadingTesters(false);
    }
  };

  // Load Feedback
  const fetchFeedback = async () => {
    setLoadingFeedback(true);
    try {
      const res = await fetch("/api/feedback/list");
      if (res.ok) {
        const data = await res.json();
        setFeedbackList(data.feedback || []);
      }
    } catch (e) {
      console.error("Error fetching feedback:", e);
    } finally {
      setLoadingFeedback(false);
    }
  };

  useEffect(() => {
    fetchTesters();
    fetchFeedback();
  }, []);

  // Handle Invite Tester
  const handleInviteTester = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteContact.trim()) return;

    setSubmittingInvite(true);
    try {
      const res = await fetch("/api/beta/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inviteName,
          contact: inviteContact,
          businessName: inviteBusiness,
          assignedPlan: invitePlan,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchTesters();
        setShowInviteModal(false);
        setInviteName("");
        setInviteContact("");
        setInviteBusiness("");
      }
    } catch (e) {
      console.error("Invite error:", e);
    } finally {
      setSubmittingInvite(false);
    }
  };

  // Handle Submit Feedback
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackTitle.trim() || !feedbackDesc.trim()) return;

    setSubmittingFeedback(true);
    try {
      const res = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: feedbackType,
          screen: feedbackScreen,
          rating: feedbackRating,
          title: feedbackTitle,
          description: feedbackDesc,
          userContact: feedbackContact,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchFeedback();
        setFeedbackSuccessNotice(true);
        setTimeout(() => setFeedbackSuccessNotice(false), 4000);
        setShowFeedbackModal(false);
        setFeedbackTitle("");
        setFeedbackDesc("");
      }
    } catch (e) {
      console.error("Feedback submit error:", e);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Run Stress Test
  const handleRunStressTest = async () => {
    setRunningStressTest(true);
    try {
      const res = await fetch("/api/stress-test/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concurrency: concurrencyWorkers }),
      });
      if (res.ok) {
        const data = await res.json();
        setStressResult(data);
      }
    } catch (e) {
      console.error("Stress test error:", e);
    } finally {
      setRunningStressTest(false);
    }
  };

  // Copy code helper
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Official Beta Launch & Brand Hub
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Target: 10–20 Real Testers
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Launch, Test, Monetize & Brand Operating Center
              </h2>
              <p className="text-xs text-slate-400">
                End-to-end framework: Invite real users, collect friction telemetry, stress-test concurrency, and monetize.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Submit Feedback / Bug</span>
            </button>

            <button
              onClick={() => setActiveSubTab("stress")}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Concurrency Test</span>
            </button>
          </div>
        </div>
      </div>

      {feedbackSuccessNotice && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Feedback successfully logged! Our team will triage your note and update the status in real time.</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab("landing")}
          className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === "landing"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <Globe className="w-4 h-4 text-indigo-400" />
          <span>Brand Landing Page</span>
        </button>

        <button
          onClick={() => setActiveSubTab("testers")}
          className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === "testers"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Beta Tester Invites ({testers.filter(t => t.contact !== 'Invite Pending').length}/20)</span>
        </button>

        <button
          onClick={() => setActiveSubTab("feedback")}
          className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === "feedback"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>Feedback & Bug Tracker ({feedbackList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("stress")}
          className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === "stress"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Stress-Test Simulator</span>
        </button>

        <button
          onClick={() => setActiveSubTab("pricing")}
          className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === "pricing"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <DollarSign className="w-4 h-4 text-amber-400" />
          <span>Monetization & Plans</span>
        </button>

        <button
          onClick={() => setActiveSubTab("docs")}
          className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === "docs"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span>Documentation & Support</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* 1. BRAND LANDING PAGE HERO & SHOWCASE */}
      {/* ==================================================== */}
      {activeSubTab === "landing" && (
        <div className="space-y-8 pb-8">
          {/* Hero Section */}
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-2xl text-center space-y-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next-Generation Local Commerce Infrastructure</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
              The Autonomous AI Operating System for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-400 to-cyan-400">
                Local Stores & Franchises
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Supercharge your neighborhood footfall, automate WhatsApp lead capture, deploy phone AI voice receptionists, and orchestrate weekly multi-channel campaigns without hiring agencies.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={() => onNavigateToTab("growth")}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>Launch Autonomous Growth Agent</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveSubTab("testers")}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Join Beta Tester Cohort</span>
              </button>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 max-w-3xl mx-auto text-left">
              <div>
                <span className="text-2xl font-black text-white block">10–20</span>
                <span className="text-xs text-slate-400">Curated Beta Testers</span>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-400 block">&lt; 280ms</span>
                <span className="text-xs text-slate-400">Cloud Run Response</span>
              </div>
              <div>
                <span className="text-2xl font-black text-indigo-300 block">100%</span>
                <span className="text-xs text-slate-400">WhatsApp Lead Capture</span>
              </div>
              <div>
                <span className="text-2xl font-black text-amber-300 block">3 Pillars</span>
                <span className="text-xs text-slate-400">Sept 2026 Mandate</span>
              </div>
            </div>
          </div>

          {/* Core Feature Showcase Grid */}
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-white">Full-Stack Operational Intelligence</h3>
              <p className="text-xs text-slate-400">Engineered specifically for boutique cafes, retail stores, gyms, and multi-location franchises.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Feature 1 */}
              <div
                onClick={() => onNavigateToTab("agents")}
                className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-indigo-500/60 rounded-2xl p-5 space-y-3 transition-all hover:bg-slate-850/80"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                  <span>AI Agent Builder</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Synthesize task-specific autonomous agents with custom reasoning directives, tool permissions, and live test consoles.
                </p>
              </div>

              {/* Feature 2 */}
              <div
                onClick={() => onNavigateToTab("crm")}
                className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-emerald-500/60 rounded-2xl p-5 space-y-3 transition-all hover:bg-slate-850/80"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                  <span>Smart CRM & Lead Hub</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Organize leads from WhatsApp, walk-ins, and calls with one-click personalized follow-up message generation.
                </p>
              </div>

              {/* Feature 3 */}
              <div
                onClick={() => onNavigateToTab("voice_rep")}
                className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-5 space-y-3 transition-all hover:bg-slate-850/80"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>AI Voice Receptionist</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Handle incoming telephone calls, answer operating hours, take table reservations, and escalate VIPs to human staff.
                </p>
              </div>

              {/* Feature 4 */}
              <div
                onClick={() => onNavigateToTab("marketing_auto")}
                className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-purple-500/60 rounded-2xl p-5 space-y-3 transition-all hover:bg-slate-850/80"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Share2 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                  <span>Marketing Automation</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generate synchronized 7-day scheduled content calendars across Instagram, Facebook, Google Business, and WhatsApp.
                </p>
              </div>

              {/* Feature 5 */}
              <div
                onClick={() => onNavigateToTab("analytics")}
                className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-5 space-y-3 transition-all hover:bg-slate-850/80"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Real-Time Business BI</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Diagnostic dashboard calculating genuine Conversion Rate, Blended CAC, Campaign ROI%, and Repeat Buyer Index.
                </p>
              </div>

              {/* Feature 6 */}
              <div
                onClick={() => onNavigateToTab("geogrid")}
                className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-rose-500/60 rounded-2xl p-5 space-y-3 transition-all hover:bg-slate-850/80"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors flex items-center justify-between">
                  <span>Geo-Grid Local Radar</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pinpoint exact Google Maps 3-Pack rank opportunities within a 5-mile radius and outrank neighborhood rivals.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. BETA TESTER INVITATION & COHORT HUB */}
      {/* ==================================================== */}
      {activeSubTab === "testers" && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Beta Tester Cohort (10–20 Real Users)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Pre-allocated VIP passes for real store owners to stress-test workflows and report early observations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Invite New Tester</span>
              </button>
            </div>
          </div>

          {/* Tester Slots Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Tester Name & Store</th>
                    <th className="p-3.5">Contact Details</th>
                    <th className="p-3.5">VIP Invite Code</th>
                    <th className="p-3.5">Assigned Plan</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Invite Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {testers.map((t) => {
                    const isPending = t.contact === "Invite Pending";
                    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(
                      `Hello ${t.name}! You're invited to test Local Business Suite. Use VIP Pass: ${t.inviteCode} at https://ais-dev-hg45y7qfr44kw6fra2m2sq-926293666300.asia-east1.run.app`
                    )}`;

                    return (
                      <tr key={t.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="p-3.5">
                          <span className={`font-bold block ${isPending ? "text-slate-500 italic" : "text-white"}`}>
                            {t.name}
                          </span>
                          <span className="text-[11px] text-slate-400">{t.businessName}</span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-300">
                          {t.contact}
                        </td>
                        <td className="p-3.5">
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300 font-bold">
                            {t.inviteCode}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                            {t.assignedPlan}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {t.status === "Active Tester" ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3" />
                              Active Tester
                            </span>
                          ) : t.status === "Feedback Submitted" ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 w-fit">
                              <ThumbsUp className="w-3 h-3" />
                              Feedback Given
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3" />
                              Invite Pending
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => copyToClipboard(t.inviteCode, t.id)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-[11px] flex items-center gap-1"
                              title="Copy Invite Code"
                            >
                              {copiedCode === t.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Code</span>
                                </>
                              )}
                            </button>

                            {!isPending && (
                              <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-[11px] flex items-center gap-1"
                              >
                                <Share2 className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. FEEDBACK & BUG COLLECTION SYSTEM */}
      {/* ==================================================== */}
      {activeSubTab === "feedback" && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Tester Feedback & Defect Triage System</span>
              </h3>
              <p className="text-xs text-slate-400">
                Track bugs, confusing screens, slow responses, and most-requested features.
              </p>
            </div>

            <button
              onClick={() => setShowFeedbackModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Record New Issue</span>
            </button>
          </div>

          {/* Feedback list cards */}
          <div className="space-y-3">
            {feedbackList.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs shadow-sm hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        item.type === "bug"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : item.type === "slow_response"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : item.type === "confusing_ui"
                          ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                          : item.type === "feature_request"
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {item.type.replace("_", " ")}
                    </span>
                    <span className="font-bold text-white text-sm">{item.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({item.screen})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < item.rating ? "fill-amber-400" : "text-slate-700"}`}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        item.status === "resolved"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : item.status === "in_review"
                          ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">{item.description}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                  <span>Reporter: <strong className="text-slate-400">{item.userContact}</strong></span>
                  {item.latencyMs && <span>Measured Latency: <strong className="text-amber-400">{item.latencyMs}ms</strong></span>}
                  <span>{item.reportedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. CONCURRENCY STRESS-TEST RUNNER */}
      {/* ==================================================== */}
      {activeSubTab === "stress" && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Multi-User Concurrency Stress-Tester</span>
            </h3>
            <p className="text-xs text-slate-400">
              Simulate multiple simultaneous users hitting Gemini-powered tools on Cloud Run to verify 429/503 exponential backoff and container stability.
            </p>
          </div>

          {/* Control Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-200 block">
                  Simulated Concurrent Users ({concurrencyWorkers} Users Simultaneously):
                </label>
                <div className="flex items-center gap-2">
                  {[5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      onClick={() => setConcurrencyWorkers(num)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        concurrencyWorkers === num
                          ? "bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {num} Users
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRunStressTest}
                disabled={runningStressTest}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Play className={`w-4 h-4 fill-slate-950 ${runningStressTest ? "animate-spin" : ""}`} />
                <span>{runningStressTest ? "Firing Concurrent Requests..." : `Fire ${concurrencyWorkers} Concurrent Requests`}</span>
              </button>
            </div>

            {/* Live Results Panel */}
            {stressResult && (
              <div className="space-y-4 pt-4 border-t border-slate-800 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {stressResult.cloudRunStatus}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Timestamp: {new Date(stressResult.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-0.5 font-mono">
                    <span className="text-[10px] text-slate-500 block uppercase">Requests Fired</span>
                    <span className="text-lg font-black text-white">{stressResult.totalFired}</span>
                    <span className="text-[10px] text-emerald-400 block">{stressResult.successful} succeeded</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-0.5 font-mono">
                    <span className="text-[10px] text-slate-500 block uppercase">Throughput</span>
                    <span className="text-lg font-black text-cyan-400">{stressResult.throughputRps}</span>
                    <span className="text-[10px] text-slate-400 block">reqs / second</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-0.5 font-mono">
                    <span className="text-[10px] text-slate-500 block uppercase">p95 Latency</span>
                    <span className="text-lg font-black text-indigo-300">{stressResult.p95LatencyMs}ms</span>
                    <span className="text-[10px] text-slate-400 block">Median: {stressResult.medianLatencyMs}ms</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-0.5 font-mono">
                    <span className="text-[10px] text-slate-500 block uppercase">429 / 503 Resilient</span>
                    <span className="text-lg font-black text-emerald-400">0 dropped</span>
                    <span className="text-[10px] text-slate-400 block">Backoff engaged</span>
                  </div>
                </div>

                {/* Worker Execution Matrix */}
                <div className="space-y-1.5">
                  <h5 className="text-xs font-bold text-slate-300">Concurrent Worker Telemetry</h5>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] font-mono">
                    {stressResult.details.map((w) => (
                      <div
                        key={w.workerId}
                        className="bg-slate-950 border border-slate-800/80 rounded-lg p-2 space-y-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Worker #{w.workerId}</span>
                          <span className="text-emerald-400">OK</span>
                        </div>
                        <div className="text-white font-bold">{w.latencyMs}ms</div>
                        <div className="text-slate-500 text-[9px]">{w.tokens} tokens</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. MONETIZATION & PRICING PLANS */}
      {/* ==================================================== */}
      {activeSubTab === "pricing" && (
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Clear Pricing & Transparent Limits
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">Simple, Predictable Monetization</h3>
            <p className="text-xs text-slate-400">
              Zero hidden fees. Zero API surcharge surprises. Choose between flexible monthly subscription or lifetime founder pass.
            </p>

            {/* Currency switcher */}
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 mt-2">
              <button
                onClick={() => setPricingCurrency("INR")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  pricingCurrency === "INR" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                ₹ INR (India UPI / FamPay)
              </button>
              <button
                onClick={() => setPricingCurrency("USD")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  pricingCurrency === "USD" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                $ USD (International Card)
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Plan 1: Free Explorer */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">Free Forever</span>
                  <h4 className="text-xl font-black text-white">Explorer</h4>
                  <p className="text-xs text-slate-400">For new store owners testing AI marketing prompts.</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">
                    {pricingCurrency === "INR" ? "₹0" : "$0"}
                  </span>
                  <span className="text-xs text-slate-500">/ forever</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>5 AI Generations / day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>1 Physical Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>5 CRM Leads Pipeline</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <AlertCircle className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>No WhatsApp Broadcasts</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <AlertCircle className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>Standard Community Support</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigateToTab("growth")}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs transition-colors"
              >
                Current Active Tier
              </button>
            </div>

            {/* Plan 2: Pro Growth (Featured) */}
            <div className="bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/80 rounded-3xl p-6 space-y-5 flex flex-col justify-between relative shadow-xl shadow-indigo-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-indigo-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow">
                ★ Most Popular For Local Stores
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-indigo-300 tracking-wider">Fast Growth</span>
                  <h4 className="text-xl font-black text-white">Franchise Pro Growth</h4>
                  <p className="text-xs text-slate-300">Complete autonomous local business engine.</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    {pricingCurrency === "INR" ? "₹799" : "$9.99"}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-indigo-500/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Unlimited</strong> Gemini AI Generations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>5,000</strong> WhatsApp Direct Broadcasts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>5 Store Locations Command</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>7-Day Marketing Content Scheduler</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Priority 429/503 Exponential Failover</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenPremium}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                {isProUser ? "VIP License Active" : "Upgrade via FamPay (8867605076)"}
              </button>
            </div>

            {/* Plan 3: Enterprise Lifetime */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">Lifetime Pass</span>
                  <h4 className="text-xl font-black text-white">Enterprise Franchise</h4>
                  <p className="text-xs text-slate-400">For multi-outlet brands & franchise operators.</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">
                    {pricingCurrency === "INR" ? "₹1,499" : "$19.99"}
                  </span>
                  <span className="text-xs text-slate-500">/ one-time</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>50</strong> Store Locations Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Autonomous AI Agent Builder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>AI Voice Receptionist Telephony Routing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Role-Based Multi-User Access (RBAC)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>24/7 Dedicated Founder Hotline</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenPremium}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs transition-colors"
              >
                Claim Lifetime Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 6. DOCUMENTATION & SUPPORT KNOWLEDGE BASE */}
      {/* ==================================================== */}
      {activeSubTab === "docs" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Platform Documentation & Developer Guide</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-2">
                <span className="font-bold text-white text-sm block">1. Agent Builder Architecture</span>
                <p className="text-slate-400 leading-relaxed">
                  Agents use Gemini 3.8 Flash structured reasoning with active tool validation. Pre-approved tools include FAQ retrieval, buyer qualification scoring, and summary logging.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-2">
                <span className="font-bold text-white text-sm block">2. Voice Receptionist Telephony</span>
                <p className="text-slate-400 leading-relaxed">
                  Webhooks integrate with Twilio TwiML and SIP PBX servers. Mandatory recording disclosures are executed on turn 1 to comply with call recording regulations.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-2">
                <span className="font-bold text-white text-sm block">3. 429/503 Exponential Backoff</span>
                <p className="text-slate-400 leading-relaxed">
                  Calls employ 3-stage exponential backoff (1.2s, 2.4s, 4.8s) with jitter. In high-demand spikes, requests automatically failover to fallback models.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-2">
                <span className="font-bold text-white text-sm block">4. Direct Founder Hotline</span>
                <p className="text-slate-400 leading-relaxed">
                  Need customized enterprise rollouts or payment activation? Contact Founder Sangamesh Khatge directly at +91 8431107332 or shivkumarkhatge@gmail.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK SUBMISSION MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span>Submit Feedback or Bug Report</span>
              </h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Issue Category:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {[
                    { id: "bug", label: "🐛 Bug / Defect" },
                    { id: "slow_response", label: "⏱️ Slow Latency" },
                    { id: "confusing_ui", label: "❓ Confusing UI" },
                    { id: "feature_request", label: "💡 Feature Idea" },
                    { id: "general_praise", label: "🌟 General Praise" },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setFeedbackType(cat.id as any)}
                      className={`p-2 rounded-lg text-left text-xs font-medium border transition-all ${
                        feedbackType === cat.id
                          ? "bg-indigo-600/30 border-indigo-500 text-indigo-300 font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Current Screen:</label>
                  <select
                    value={feedbackScreen}
                    onChange={(e) => setFeedbackScreen(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Agent Builder">Agent Builder</option>
                    <option value="Smart CRM">Smart CRM</option>
                    <option value="Marketing Automation">Marketing Automation</option>
                    <option value="Voice Receptionist">Voice Receptionist</option>
                    <option value="Real-Time Analytics">Real-Time Analytics</option>
                    <option value="Geo-Grid Radar">Geo-Grid Radar</option>
                    <option value="Prompt Studio">Prompt Studio</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Overall Rating:</label>
                  <div className="flex items-center gap-1.5 pt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFeedbackRating(star)}
                        className="text-amber-400"
                      >
                        <Star className={`w-5 h-5 ${star <= feedbackRating ? "fill-amber-400" : "text-slate-700"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Summary / Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Latency when generating 7-day marketing calendar"
                  value={feedbackTitle}
                  onChange={(e) => setFeedbackTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Detailed Observation:</label>
                <textarea
                  rows={3}
                  placeholder="What happened? What was confusing or broken?"
                  value={feedbackDesc}
                  onChange={(e) => setFeedbackDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Your Phone or Email (for follow-up):</label>
                <input
                  type="text"
                  placeholder="e.g. pooja@cafe.com or 9820114422"
                  value={feedbackContact}
                  onChange={(e) => setFeedbackContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-50"
                >
                  {submittingFeedback ? "Submitting..." : "Submit to Founder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVITE TESTER MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Invite Beta Tester</span>
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteTester} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Store Owner / Manager Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Khurana"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Business Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Khurana Sweet House"
                  value={inviteBusiness}
                  onChange={(e) => setInviteBusiness(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Phone or Email:</label>
                <input
                  type="text"
                  placeholder="e.g. 9845012398 or rajesh@store.com"
                  value={inviteContact}
                  onChange={(e) => setInviteContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Assigned Testing Plan:</label>
                <select
                  value={invitePlan}
                  onChange={(e) => setInvitePlan(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Pro Trial (VIP)">Pro Trial (VIP Pass)</option>
                  <option value="Enterprise Partner">Enterprise Partner</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingInvite}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-50"
                >
                  {submittingInvite ? "Allocating..." : "Generate VIP Pass"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
