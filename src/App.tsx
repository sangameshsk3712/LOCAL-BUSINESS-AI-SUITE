import React, { useState, useEffect } from "react";
import {
  Mic,
  Music,
  Building2,
  Terminal,
  Key,
  Sparkles,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Crosshair,
  Users,
  Phone,
  Mail,
  MessageCircle,
  BadgeCheck,
  Crown,
  TrendingUp,
  BarChart2,
  Rocket,
  Palette,
  BarChart3,
  Bot,
  FolderKanban,
  Zap,
  Wand2,
  Share2,
  PhoneCall,
  BookOpen,
  Award,
  Brain,
  Menu,
  X,
  LayoutDashboard,
  CreditCard,
  Server,
  Video,
  Gift,
  Receipt,
  Target,
  Sliders,
  Layers,
  Webhook,
  QrCode,
  Search,
  Heart,
  Clock,
  Star,
  Play,
  LogIn,
  FileCode
} from "lucide-react";
import premiumWallpaper from "./assets/images/premium_3d_wallpaper_1790616634137.jpg";
import {
  PromptTemplate,
  ApiKeyStatus,
  INITIAL_PROMPTS,
  LocationBranch,
  BrandGuardrails,
  CrisisAlert,
  INITIAL_LOCATIONS,
  DEFAULT_GUARDRAILS,
  INITIAL_CRISIS_ALERTS
} from "./types";
import PromptList from "./components/PromptList";
import PromptEditor from "./components/PromptEditor";
import OutputConsole from "./components/OutputConsole";
import ApiKeyGuide from "./components/ApiKeyGuide";
import AudioTranscriber from "./components/AudioTranscriber";
import MusicGenerator from "./components/MusicGenerator";
import BusinessSuite from "./components/BusinessSuite";
import FranchiseCommandCenter from "./components/FranchiseCommandCenter";
import GeoGridRadar from "./components/GeoGridRadar";
import PremiumHub from "./components/PremiumHub";
import AdBanner from "./components/AdBanner";
import TradingOracle from "./components/TradingOracle";
import GrowthAgent from "./components/GrowthAgent";
import ContentStudio from "./components/ContentStudio";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import SupportAgent from "./components/SupportAgent";
import CompetitorIntel from "./components/CompetitorIntel";
import WorkspaceHub from "./components/WorkspaceHub";
import AgentBuilder from "./components/AgentBuilder";
import SmartCrm from "./components/SmartCrm";
import MarketingAutomationCenter from "./components/MarketingAutomationCenter";
import VoiceReceptionist from "./components/VoiceReceptionist";
import DashboardWelcome from "./components/DashboardWelcome";
import HowToUseGuide from "./components/HowToUseGuide";
import OmniBizGpt from "./components/OmniBizGpt";
import AcquisitionDeckHub from "./components/AcquisitionDeckHub";
import OmniSuperBrain from "./components/OmniSuperBrain";
import AutomatedBillingEngine from "./components/AutomatedBillingEngine";
import MultiTenantRbacManager from "./components/MultiTenantRbacManager";
import BackgroundJobQueueMonitor from "./components/BackgroundJobQueueMonitor";
import WhatsAppOnboardingPortal from "./components/WhatsAppOnboardingPortal";
import EnterpriseRoiDashboard from "./components/EnterpriseRoiDashboard";
import DueDiligencePackageHub from "./components/DueDiligencePackageHub";
import FreeSeoAuditLeadMagnet from "./components/FreeSeoAuditLeadMagnet";
import TargetedAdsStudio from "./components/TargetedAdsStudio";
import InAppReferralEngine from "./components/InAppReferralEngine";
import AgencyWhiteLabelPortal from "./components/AgencyWhiteLabelPortal";
import PosIntegrationsHub from "./components/PosIntegrationsHub";
import RegionalFranchiseExpansion from "./components/RegionalFranchiseExpansion";
import DeveloperWebhooksHub from "./components/DeveloperWebhooksHub";
import QrFlyerMarketingGenerator from "./components/QrFlyerMarketingGenerator";
import TechnicalAssessmentHub from "./components/TechnicalAssessmentHub";
import GooglePlayPublisher from "./components/GooglePlayPublisher";
import OmniStarStudio from "./components/OmniStarStudio";
import EvaluatorFeatureAuditHub from "./components/EvaluatorFeatureAuditHub";
import ApkCodeInspector from "./components/ApkCodeInspector";
import AuthModal from "./components/AuthModal";
import UserHistoryHub from "./components/UserHistoryHub";
import { auth, testFirestoreConnection, saveUserGeneratedWork, loadUserHistory } from "./services/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { PWAInstallButton } from "./components/PWAInstallButton";
import { OfflineIndicator } from "./components/OfflineIndicator";

export type MainNavTab =
  | "evaluator_audit"
  | "apk_inspector"
  | "user_history"
  | "omnistar_10x"
  | "playstore"
  | "technical_assessment"
  | "superbrain"
  | "acquisition"
  | "omni_gpt"
  | "growth"
  | "content"
  | "crm"
  | "agents"
  | "marketing_auto"
  | "voice_rep"
  | "analytics"
  | "support"
  | "competitor"
  | "workspace"
  | "franchise"
  | "geogrid"
  | "trading"
  | "business"
  | "transcribe"
  | "music"
  | "prompts"
  | "credentials"
  | "premium"
  | "how_to_use"
  | "billing_engine"
  | "rbac_tenants"
  | "job_queue"
  | "whatsapp_onboarding"
  | "enterprise_roi"
  | "due_diligence"
  | "free_seo_audit"
  | "targeted_ads"
  | "referrals"
  | "agency_portal"
  | "pos_integrations"
  | "regional_franchise"
  | "developer_webhooks"
  | "qr_flyer";

export default function App() {
  // Navigation active tab - defaults to "growth" for the AI Business Growth platform
  const [activeNav, setActiveNav] = useState<MainNavTab>("growth");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global search & Category filter for tools directory
  const [navSearchQuery, setNavSearchQuery] = useState("");
  const [activeNavCategory, setActiveNavCategory] = useState<string>("all");

  // User Favourites (stored in localStorage)
  const [favoriteTools, setFavoriteTools] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("lbs_favorite_tools");
      if (saved) return JSON.parse(saved);
    } catch {}
    return ["growth", "crm", "voice_rep", "geogrid", "targeted_ads", "workspace"];
  });

  // Personalized Dashboard: Recently Used Tools (stored in localStorage)
  const [recentTools, setRecentTools] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("lbs_recently_used_tools");
      if (saved) return JSON.parse(saved);
    } catch {}
    return ["growth", "workspace", "crm", "free_seo_audit"];
  });

  const handleSelectNav = (tabId: MainNavTab) => {
    setActiveNav(tabId);
    setIsMobileMenuOpen(false);
    setRecentTools((prev) => {
      const updated = [tabId, ...prev.filter((id) => id !== tabId)].slice(0, 5);
      try {
        localStorage.setItem("lbs_recently_used_tools", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleToggleFavorite = (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteTools((prev) => {
      const next = prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId];
      try {
        localStorage.setItem("lbs_favorite_tools", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Pro status for Ad-Free VIP experience
  const [isProUser, setIsProUser] = useState<boolean>(() => {
    try {
      return localStorage.getItem("local_business_suite_pro_active") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      setIsProUser(localStorage.getItem("local_business_suite_pro_active") === "true");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Keyboard navigation & global shortcuts ('/' to search, 'Esc' to dismiss)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        const searchInput = document.getElementById("global-tool-search-input");
        if (searchInput) {
          searchInput.focus();
        }
      }
      if (e.key === "Escape") {
        if (navSearchQuery) setNavSearchQuery("");
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navSearchQuery]);

  // Multi-location franchise state
  const [locations, setLocations] = useState<LocationBranch[]>(() => {
    try {
      const saved = localStorage.getItem("enterprise_franchise_locations");
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_LOCATIONS;
  });

  const [activeLocationId, setActiveLocationId] = useState<string>(() => {
    return locations[0]?.id || "loc-1";
  });

  const [guardrails, setGuardrails] = useState<BrandGuardrails>(() => {
    try {
      const saved = localStorage.getItem("enterprise_master_guardrails");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_GUARDRAILS;
  });

  const [alerts, setAlerts] = useState<CrisisAlert[]>(() => {
    try {
      const saved = localStorage.getItem("enterprise_crisis_alerts");
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CRISIS_ALERTS;
  });

  useEffect(() => {
    localStorage.setItem("enterprise_franchise_locations", JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem("enterprise_master_guardrails", JSON.stringify(guardrails));
  }, [guardrails]);

  useEffect(() => {
    localStorage.setItem("enterprise_crisis_alerts", JSON.stringify(alerts));
  }, [alerts]);

  const activeLocation = locations.find((l) => l.id === activeLocationId) || locations[0];

  // Firebase Authentication & User History Session
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userHistoryCount, setUserHistoryCount] = useState<number>(0);

  useEffect(() => {
    testFirestoreConnection();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const history = await loadUserHistory(user.uid);
        setUserHistoryCount(history.length);
      } else {
        try {
          const guestHistory = JSON.parse(localStorage.getItem("lbs_guest_history") || "[]");
          setUserHistoryCount(guestHistory.length);
        } catch {
          setUserHistoryCount(0);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSaveToWorkspace = async (title: string, type: any, data: any) => {
    const rawContent = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    try {
      const existing = localStorage.getItem("lbs_workspace_projects");
      const list = existing ? JSON.parse(existing) : [];
      const newProj = {
        id: `proj-${Date.now()}`,
        title,
        type,
        data,
        createdAt: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
        author: currentUser?.displayName || "Sangamesh Khatge",
        tags: [String(type).split(" ")[0] || "Asset", "Elite AI"],
      };
      const updated = [newProj, ...list];
      localStorage.setItem("lbs_workspace_projects", JSON.stringify(updated));
    } catch (e) {
      console.error("Save to workspace error", e);
    }

    // Persist into user's personal cloud history
    try {
      if (currentUser) {
        await saveUserGeneratedWork(currentUser.uid, {
          title,
          moduleType: (type as any) || "omnistar_10x",
          promptOrInput: "",
          generatedOutput: rawContent,
        });
        setUserHistoryCount((c) => c + 1);
      } else {
        const guestHistory = JSON.parse(localStorage.getItem("lbs_guest_history") || "[]");
        const newRecord = {
          id: `guest-${Date.now()}`,
          userId: "guest",
          title,
          moduleType: type || "omnistar_10x",
          promptOrInput: "",
          generatedOutput: rawContent,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("lbs_guest_history", JSON.stringify([newRecord, ...guestHistory].slice(0, 50)));
        setUserHistoryCount((c) => c + 1);
      }
    } catch (err) {
      console.warn("Could not save to history:", err);
    }
  };

  // State for prompts registry loads from LocalStorage
  const [prompts, setPrompts] = useState<PromptTemplate[]>(() => {
    const saved = localStorage.getItem("prompt_studio_templates");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved prompts", e);
      }
    }
    return INITIAL_PROMPTS;
  });

  const [selectedId, setSelectedId] = useState<string>(() => {
    return prompts[0]?.id || "prompt-1";
  });

  // State for dynamic variable configurations
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  // API Key state from server check
  const [apiKeyStatus, setApiKeyStatus] = useState<ApiKeyStatus | null>(null);
  const [checkingKey, setCheckingKey] = useState(false);

  // Active testing compilation states for Prompt Studio
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [testError, setTestError] = useState<{ type?: string; message: string } | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [promptLength, setPromptLength] = useState<number>(0);
  const [rightActiveTab, setRightActiveTab] = useState<"logs" | "guide">("logs");

  // Save prompts list on every change update
  useEffect(() => {
    localStorage.setItem("prompt_studio_templates", JSON.stringify(prompts));
  }, [prompts]);

  // Check API key configuration on mount
  useEffect(() => {
    checkApiKeyOnServer();
  }, []);

  // Live user & visitor analytics
  const [userStats, setUserStats] = useState<{
    activeNow: number;
    totalActiveToday: number;
    totalPageViews: number;
  } | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await fetch("/api/analytics/users");
        if (res.ok) {
          const data = await res.json();
          setUserStats(data);
        }
      } catch {
        // ignore
      }
    };

    fetchUserStats();
    const interval = setInterval(fetchUserStats, 10000); // refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const activePrompt = prompts.find((p) => p.id === selectedId) || prompts[0];

  useEffect(() => {
    if (activePrompt) {
      const initialVals: Record<string, string> = {};
      activePrompt.variables.forEach((variable) => {
        initialVals[variable] = variableValues[variable] || "";
      });
      setVariableValues(initialVals);
    }
  }, [selectedId]);

  const checkApiKeyOnServer = async () => {
    setCheckingKey(true);
    try {
      const res = await fetch("/api/api-key-status");
      const data = await res.json();
      setApiKeyStatus(data);
    } catch (e) {
      console.error("Failed to verify server key state", e);
      setApiKeyStatus({ configured: false, keySnippet: null });
    } finally {
      setCheckingKey(false);
    }
  };

  const handleUpdatePrompt = (updated: PromptTemplate) => {
    setPrompts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleVariableValueChange = (variableName: string, value: string) => {
    setVariableValues((prev) => ({
      ...prev,
      [variableName]: value,
    }));
  };

  const handleCreateNewPrompt = () => {
    const newId = `prompt-${Date.now()}`;
    const newPrompt: PromptTemplate = {
      id: newId,
      title: "My Custom Local Business Prompt",
      description: "Applies specialized constraints for business operations.",
      category: "Creative Content",
      systemInstruction: "You are an AI assistant specialized in local business growth.",
      template: "Draft a high-impact promotion for the following service:\n\n{{businessService}}",
      temperature: 0.7,
      variables: ["businessService"],
      createdAt: new Date().toISOString(),
    };

    setPrompts((prev) => [newPrompt, ...prev]);
    setSelectedId(newId);
  };

  const handleDeletePrompt = (id: string) => {
    const updated = prompts.filter((p) => p.id !== id);
    setPrompts(updated);
    if (selectedId === id && updated.length > 0) {
      setSelectedId(updated[0].id);
    }
  };

  const handleResetToDefault = () => {
    if (confirm("Are you sure you want to reset all prompts to defaults? Custom edits will be cleared.")) {
      setPrompts(INITIAL_PROMPTS);
      setSelectedId(INITIAL_PROMPTS[0].id);
    }
  };

  const handleRunPromptTest = async () => {
    if (!activePrompt) return;

    setRightActiveTab("logs");
    setIsLoading(true);
    setTestError(null);
    setOutput("");
    setElapsedTime(0);

    let promptText = activePrompt.template;
    activePrompt.variables.forEach((variable) => {
      const val = variableValues[variable] || "";
      promptText = promptText.replaceAll(`{{${variable}}}`, val);
    });

    setPromptLength(promptText.length);
    const startTime = performance.now();

    try {
      const response = await fetch("/api/prompt/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: activePrompt.systemInstruction,
          promptText,
          temperature: activePrompt.temperature,
        }),
      });

      const data = await response.json();
      const endTime = performance.now();
      setElapsedTime(Math.round(endTime - startTime));

      if (!response.ok) {
        if (data.error === "API_KEY_NOT_CONFIGURED") {
          setTestError({ type: "API_KEY_NOT_CONFIGURED", message: data.message });
          setRightActiveTab("guide");
        } else {
          setTestError({ message: data.message || "An error occurred calling the server." });
        }
      } else {
        setOutput(data.text || "Empty output received.");
      }
    } catch (err: any) {
      const endTime = performance.now();
      setElapsedTime(Math.round(endTime - startTime));
      setTestError({ message: err.message || "Network request failed to start." });
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation sections for the left-side vertical rail
  const navSections = [
    {
      title: "⭐ Mega AI SuperBrains & Store",
      items: [
        { id: "evaluator_audit" as MainNavTab, label: "⭐ Evaluator 10/10 Hub", tag: "42-PT AUDIT", icon: Award, isSuper: true, accentColor: "text-emerald-400" },
        { id: "apk_inspector" as MainNavTab, label: "APK Source Inspector", tag: "KOTLIN BRIDGE", icon: FileCode, isSuper: true, accentColor: "text-cyan-400" },
        { id: "omnistar_10x" as MainNavTab, label: "OmniStar 10X Super-AI", tag: "13/13 STARS", icon: Sparkles, isSuper: true, accentColor: "text-amber-400" },
        { id: "user_history" as MainNavTab, label: "My Saved Work History", tag: userHistoryCount > 0 ? `${userHistoryCount} SAVED` : "CLOUD SYNC", icon: Clock, isSuper: true, accentColor: "text-cyan-300" },
        { id: "playstore" as MainNavTab, label: "Google Play Store Hub", tag: "TWA BUILD", icon: Play, isSuper: true, accentColor: "text-emerald-400" },
        { id: "technical_assessment" as MainNavTab, label: "10/10 Technical Audit", tag: "SCORECARD", icon: Award, isSuper: true, accentColor: "text-amber-400" },
        { id: "superbrain" as MainNavTab, label: "OmniMega SuperBrain", tag: "4-in-1 AI", icon: Brain, isSuper: true, accentColor: "text-amber-300" },
        { id: "acquisition" as MainNavTab, label: "₹100Cr Buyout Portal", tag: "SELL APP", icon: Award, isSuper: true, accentColor: "text-amber-400" },
        { id: "omni_gpt" as MainNavTab, label: "OmniBiz GPT", tag: "100Cr AI", icon: Bot, isSuper: true, accentColor: "text-purple-300" },
      ],
    },
    {
      title: "🏢 Operations & Expansion",
      items: [
        { id: "whatsapp_onboarding" as MainNavTab, label: "WhatsApp Onboarding", tag: "2-Min Meta", icon: MessageCircle, accentColor: "text-emerald-400" },
        { id: "qr_flyer" as MainNavTab, label: "QR Review Flyer Studio", tag: "Table Tents", icon: QrCode, accentColor: "text-amber-400" },
        { id: "pos_integrations" as MainNavTab, label: "POS Integrations Hub", tag: "Petpooja/Vyapar", icon: Receipt, accentColor: "text-emerald-400" },
        { id: "regional_franchise" as MainNavTab, label: "Regional Franchise Scale", tag: "5-20 Stores", icon: Building2, accentColor: "text-indigo-400" },
        { id: "franchise" as MainNavTab, label: "Franchise Hub", tag: `${locations.length} Stores`, icon: Building2, accentColor: "text-indigo-400" },
        { id: "rbac_tenants" as MainNavTab, label: "Multi-Tenant & RBAC", tag: "Staff Roles", icon: ShieldCheck, accentColor: "text-emerald-400" },
        { id: "geogrid" as MainNavTab, label: "Geo-Grid Radar", tag: "5x5 SEO", icon: Crosshair, accentColor: "text-blue-400" },
        { id: "trading" as MainNavTab, label: "Trading Oracle", tag: "Global SMC", icon: TrendingUp, accentColor: "text-emerald-400" },
        { id: "business" as MainNavTab, label: "Business AI Hub", tag: "WhatsApp/Reviews", icon: Sparkles, accentColor: "text-emerald-400" },
      ],
    },
    {
      title: "🎙️ Audio & Creative Studio",
      items: [
        { id: "transcribe" as MainNavTab, label: "Transcribe Audio", tag: "Gemini Voice", icon: Mic, accentColor: "text-indigo-400" },
        { id: "music" as MainNavTab, label: "Store Music", tag: "Lyria Vibe", icon: Music, accentColor: "text-fuchsia-400" },
        { id: "prompts" as MainNavTab, label: "Prompt Studio", tag: "Templates", icon: Terminal, accentColor: "text-amber-400" },
        { id: "content" as MainNavTab, label: "Content Studio", tag: "Social AI", icon: Palette, accentColor: "text-purple-400" },
      ],
    },
    {
      title: "🤖 Growth & AI Agents",
      items: [
        { id: "targeted_ads" as MainNavTab, label: "Targeted Ads Studio", tag: "Meta/Google", icon: Video, accentColor: "text-purple-400" },
        { id: "referrals" as MainNavTab, label: "Neighbor Referral Engine", tag: "₹500 Off", icon: Gift, accentColor: "text-emerald-400" },
        { id: "agency_portal" as MainNavTab, label: "Agency Reseller Portal", tag: "30% Rev-Share", icon: Layers, accentColor: "text-blue-400" },
        { id: "free_seo_audit" as MainNavTab, label: "Free SEO Audit Tool", tag: "Lead Magnet", icon: Crosshair, accentColor: "text-blue-400" },
        { id: "enterprise_roi" as MainNavTab, label: "Proof of ROI BI", tag: "205x Sales", icon: TrendingUp, accentColor: "text-purple-400" },
        { id: "job_queue" as MainNavTab, label: "Async Job Queue", tag: "Workers 4x", icon: Server, accentColor: "text-blue-400" },
        { id: "growth" as MainNavTab, label: "AI Growth Agent", tag: "Active", icon: Rocket, accentColor: "text-blue-400" },
        { id: "crm" as MainNavTab, label: "Smart CRM", tag: "Pipeline", icon: Users, accentColor: "text-emerald-400" },
        { id: "agents" as MainNavTab, label: "Agent Builder", tag: "Custom Bots", icon: Wand2, accentColor: "text-cyan-400" },
        { id: "voice_rep" as MainNavTab, label: "Voice Receptionist", tag: "24/7 AI Calls", icon: PhoneCall, accentColor: "text-cyan-400" },
        { id: "support" as MainNavTab, label: "24/7 AI Concierge", tag: "Support", icon: Bot, accentColor: "text-cyan-400" },
        { id: "competitor" as MainNavTab, label: "Competitor & SEO", tag: "Spy Radar", icon: Crosshair, accentColor: "text-orange-400" },
        { id: "marketing_auto" as MainNavTab, label: "Marketing Auto", tag: "Campaigns", icon: Share2, accentColor: "text-purple-400" },
        { id: "analytics" as MainNavTab, label: "Real-Time BI", tag: "Footfall", icon: BarChart3, accentColor: "text-emerald-400" },
        { id: "workspace" as MainNavTab, label: "Unified AI Workspace", tag: "1-Profile 4-Tools", icon: FolderKanban, accentColor: "text-indigo-400" },
      ],
    },
    {
      title: "👑 Membership & System",
      items: [
        { id: "developer_webhooks" as MainNavTab, label: "Developer Webhooks & API", tag: "Zapier/Make", icon: Webhook, accentColor: "text-blue-400" },
        { id: "due_diligence" as MainNavTab, label: "M&A Due-Diligence", tag: "Clean IP", icon: ShieldCheck, accentColor: "text-amber-400" },
        { id: "billing_engine" as MainNavTab, label: "Automated Billing & PG", tag: "Razorpay/Stripe", icon: CreditCard, accentColor: "text-emerald-400" },
        { id: "premium" as MainNavTab, label: isProUser ? "👑 PRO SUBSCRIBER" : "💎 Go Premium", tag: isProUser ? "ACTIVE" : "FamPay", icon: Crown, accentColor: "text-amber-400" },
        { id: "credentials" as MainNavTab, label: "Production Check & Keys", tag: apiKeyStatus?.configured ? "Ready" : "Setup", icon: Key, accentColor: "text-amber-400" },
        { id: "how_to_use" as MainNavTab, label: "How to Use Guide", tag: "Docs", icon: BookOpen, accentColor: "text-indigo-300" },
      ],
    },
  ];

  const allToolsFlat = navSections.flatMap((s) => s.items);

  // Recently used tools with full metadata
  const recentToolsDetails = recentTools
    .map((id) => allToolsFlat.find((t) => t.id === id))
    .filter(Boolean) as typeof allToolsFlat;

  // Filtered navigation list based on search and category
  const filteredSections = navSections
    .map((section) => {
      // Category filter check
      if (activeNavCategory === "superbrains" && !section.title.includes("SuperBrains")) return null;
      if (activeNavCategory === "ops" && !section.title.includes("Operations")) return null;
      if (activeNavCategory === "creative" && !section.title.includes("Creative")) return null;
      if (activeNavCategory === "growth" && !section.title.includes("Growth")) return null;
      if (activeNavCategory === "system" && !section.title.includes("Membership")) return null;

      let items = section.items;
      if (activeNavCategory === "favorites") {
        items = items.filter((item) => favoriteTools.includes(item.id));
      }

      if (navSearchQuery.trim()) {
        const q = navSearchQuery.toLowerCase().trim();
        items = items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.tag?.toLowerCase().includes(q) ||
            section.title.toLowerCase().includes(q)
        );
      }

      if (items.length === 0) return null;
      return { ...section, items };
    })
    .filter(Boolean) as typeof navSections;

  const totalFilteredCount = filteredSections.reduce((sum, s) => sum + s.items.length, 0);

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between space-y-3.5">
      <div className="space-y-3.5">
        {/* Brand Header inside sidebar */}
        <div className="flex items-center justify-between px-1 py-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-indigo-500/30 shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs font-black text-white tracking-wide">
                Local Business Suite
              </div>
              <div className="text-[10px] text-amber-300 font-mono font-bold">
                100Cr AI Enterprise OS
              </div>
            </div>
          </div>
          {isProUser && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-black uppercase font-mono">
              VIP PRO
            </span>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="global-tool-search-input"
            type="text"
            value={navSearchQuery}
            onChange={(e) => setNavSearchQuery(e.target.value)}
            placeholder="Search 35+ tools, SEO, ads, CRM... [/]"
            className="w-full bg-slate-900/90 border border-slate-750 hover:border-slate-600 focus:border-amber-400 text-slate-100 placeholder:text-slate-500 text-xs rounded-xl pl-8 pr-12 py-2 transition-all focus:outline-none focus:ring-1 focus:ring-amber-400/40"
          />
          {!navSearchQuery && (
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono pointer-events-none">
              /
            </kbd>
          )}
          {navSearchQuery && (
            <button
              onClick={() => setNavSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Category Filters (Horizontal Scrollable Chips) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          {[
            { id: "all", label: `All (${allToolsFlat.length})` },
            { id: "favorites", label: `❤️ Saved (${favoriteTools.length})` },
            { id: "superbrains", label: "⭐ SuperBrains" },
            { id: "ops", label: "🏢 Operations" },
            { id: "growth", label: "🤖 Growth" },
            { id: "creative", label: "🎙️ Creative" },
            { id: "system", label: "👑 System" },
          ].map((cat) => {
            const isCatActive = activeNavCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveNavCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all shrink-0 ${
                  isCatActive
                    ? "bg-amber-400 text-slate-950 shadow-md font-black shadow-amber-400/20"
                    : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Personalized Dashboard: Recently Used Tools Quick Access */}
        {recentToolsDetails.length > 0 && !navSearchQuery && activeNavCategory === "all" && (
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-indigo-950/20 to-slate-900/90 border border-indigo-500/20 space-y-1.5 shadow-inner">
            <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
              <span className="flex items-center gap-1 text-indigo-300">
                <Clock className="w-3 h-3 text-indigo-400" />
                Recently Used
              </span>
              <span className="text-[9px] font-mono text-slate-500 font-medium">Quick Jump</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {recentToolsDetails.map((tool) => {
                const Icon = tool.icon;
                const isSelected = activeNav === tool.id;
                return (
                  <button
                    key={`recent-${tool.id}`}
                    onClick={() => handleSelectNav(tool.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0 ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400"
                        : "bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : tool.accentColor || "text-slate-400"}`} />
                    <span className="truncate max-w-[110px]">{tool.label.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter / Search Match Status */}
        {(navSearchQuery || activeNavCategory !== "all") && (
          <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
            <span>
              Found <strong className="text-amber-300 font-mono font-bold">{totalFilteredCount}</strong> tools
            </span>
            {(navSearchQuery || activeNavCategory !== "all") && (
              <button
                onClick={() => {
                  setNavSearchQuery("");
                  setActiveNavCategory("all");
                }}
                className="text-[10px] text-amber-400 hover:underline font-bold"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}

        {/* Nav List grouped by category */}
        <div className="space-y-3.5">
          {filteredSections.length === 0 ? (
            <div className="p-6 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <p className="text-xs text-slate-400">
                No tools match "{navSearchQuery || activeNavCategory}".
              </p>
              <button
                onClick={() => {
                  setNavSearchQuery("");
                  setActiveNavCategory("all");
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold"
              >
                Show All 35+ Tools
              </button>
            </div>
          ) : (
            filteredSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                <div className="px-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>{section.title}</span>
                  <span className="text-[9px] font-mono text-slate-500 font-semibold">{section.items.length}</span>
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeNav === item.id;
                    const isFav = favoriteTools.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectNav(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all text-left cursor-pointer group min-h-[44px] ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400"
                            : item.isSuper
                            ? "bg-slate-900/70 hover:bg-slate-800 text-slate-200 hover:text-white border border-indigo-500/20"
                            : "text-slate-350 hover:text-slate-100 hover:bg-slate-900/90"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-white" : item.accentColor || "text-slate-400"}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.tag && (
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                              isActive
                                ? "bg-white/20 text-white"
                                : item.isSuper
                                ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                                : "bg-slate-850 text-slate-400 border border-slate-750"
                            }`}>
                              {item.tag}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => handleToggleFavorite(item.id, e)}
                            title={isFav ? "Remove from favourites" : "Add to favourites"}
                            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 transition-colors ${
                                isFav
                                  ? "fill-rose-500 text-rose-500"
                                  : "text-slate-600 group-hover:text-slate-400 hover:text-rose-400"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Founder & System Stats */}
      <div className="pt-3 border-t border-slate-800/80 space-y-2 shrink-0">
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/30 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-amber-200 font-bold flex items-center gap-1">
              Sangamesh Khatge
              <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="tel:8431107332"
              className="flex-1 py-1 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold text-center flex items-center justify-center gap-1"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>Call 8431107332</span>
            </a>
            <a
              href="https://wa.me/918431107332"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center justify-center gap-1"
              title="WhatsApp"
            >
              <MessageCircle className="w-3 h-3 text-emerald-400" />
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {userStats?.activeNow || 1} online
          </span>
          <span>{userStats?.totalPageViews || 1} visits</span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen text-slate-100 font-sans flex flex-col relative selection:bg-indigo-500/30 selection:text-indigo-200"
      style={{
        backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(15, 23, 42, 0.90) 0%, rgba(2, 6, 23, 0.97) 100%), url(${premiumWallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Top Header & Global App Branding */}
      <header className="border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl sticky top-0 z-40 px-4 md:px-6 py-3 shadow-md">
        <div className="max-w-[1680px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 flex items-center justify-center shadow-lg shadow-indigo-950/40 relative shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white">
                  Local Business Suite
                </h1>
                <button
                  onClick={() => setActiveNav("technical_assessment")}
                  className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-indigo-500/20 border border-amber-400/50 text-amber-300 hover:scale-105 transition-all hidden sm:inline-flex items-center gap-1.5 shadow-sm"
                  title="View 10/10 Enterprise Architecture Audit & Scorecard"
                >
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>10/10 Technical Audit ⭐</span>
                </button>
              </div>
              <p className="text-xs text-slate-450 hidden md:block">
                All-in-one AI audio transcription, storefront music generation, and local business marketing tools.
              </p>
            </div>
          </div>

          {/* Right Header Badges */}
          <div className="flex items-center gap-2.5">
            {/* Active Store Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-450">
              <span>Store:</span>
              <strong className="text-indigo-300 font-bold">{activeLocation.name}</strong>
            </div>

            {/* Founder Quick Contact Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-emerald-500/20 border border-amber-400/50 shadow-sm ring-1 ring-amber-400/30">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-[10px] shadow">
                SK
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-amber-200 font-bold flex items-center gap-1">
                  Sangamesh
                  <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
                </span>
                <span className="text-slate-600">•</span>
                <a
                  href="tel:+918431107332"
                  className="font-mono font-bold text-emerald-300 hover:text-emerald-200 flex items-center gap-1 transition-colors"
                  title="Call Founder"
                >
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span>8431107332</span>
                </a>
              </div>
            </div>

            {/* Play Store & PWA Launch Badge */}
            <button
              onClick={() => setActiveNav("playstore")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:text-white text-xs font-bold transition-all hover:scale-105 shadow-sm"
              title="Google Play Store Publishing Center & Android TWA Builder"
            >
              <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              <span>Google Play</span>
            </button>

            {/* In-App PWA Install prompt */}
            <PWAInstallButton />

            {/* Offline status indicator */}
            <OfflineIndicator />

            {/* Live Traffic Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-300 font-medium">
                {userStats ? userStats.activeNow : 1} live
              </span>
            </div>

            {/* User History Quick Access Button */}
            <button
              onClick={() => setActiveNav("user_history")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                activeNav === "user_history"
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
              }`}
              title="View all your saved work and AI generations across sessions"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">History</span>
              {userHistoryCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] font-mono font-black">
                  {userHistoryCount}
                </span>
              )}
            </button>

            {/* Login / User Profile Indicator */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-slate-950 font-black text-[10px]">
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : "U"}
                </div>
                <div className="hidden lg:block text-left text-[11px] leading-tight max-w-[100px] truncate">
                  <div className="font-bold text-white truncate">{currentUser.displayName || "Merchant"}</div>
                  <div className="text-[9px] text-emerald-400 font-mono">Cloud Synced</div>
                </div>
                <button
                  onClick={() => signOut(auth)}
                  className="text-[10px] text-slate-400 hover:text-rose-400 font-bold ml-1 transition"
                  title="Sign Out"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/30 via-indigo-600/30 to-cyan-600/30 border border-cyan-400/50 hover:border-cyan-300 text-cyan-200 hover:text-white text-xs font-bold transition-all shadow-sm hover:scale-105"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Log In</span>
              </button>
            )}

            {/* Pro Button */}
            <button
              onClick={() => setActiveNav("premium")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md ${
                isProUser
                  ? "bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-300 text-slate-950 ring-1 ring-emerald-400"
                  : "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 hover:scale-105"
              }`}
            >
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>{isProUser ? "👑 PRO ACTIVE" : "💎 GO PREMIUM"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 1. FIRST AT VERY TOP: Full-Width Grand Founder Spotlight Banner */}
      <div className="max-w-[1680px] w-full mx-auto px-4 md:px-6 pt-4 pb-2 z-20">
        <div className="bg-gradient-to-r from-slate-900/98 via-amber-950/50 to-slate-900/98 border-2 border-amber-500/70 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-amber-500/15 relative overflow-hidden ring-2 ring-amber-400/40 backdrop-blur-2xl">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 relative z-10">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black text-2xl sm:text-3xl shadow-xl shadow-amber-500/50 shrink-0 ring-4 ring-amber-300/60 transform hover:scale-105 transition-transform">
                SK
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full bg-amber-500/30 border border-amber-400/60 text-amber-300 shadow-sm flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                    ★ App Founder & Lead Architect
                  </span>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-500/50 text-emerald-300 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Verified Creator
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hidden sm:inline">
                    FamPay UPI: 8867605076
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-2 drop-shadow-sm">
                    <span className="bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent">
                      Sangamesh Khatge
                    </span>
                    <BadgeCheck className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 inline drop-shadow-md shrink-0" />
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-250 max-w-3xl leading-relaxed">
                  Creator & Architect of <strong className="text-white font-bold">Local Business Suite & Enterprise Franchise Hub</strong>. Get VIP support, request custom enterprise multi-branch deployments, or connect directly with me:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap shrink-0">
              <button
                onClick={() => setActiveNav("playstore")}
                className="px-4 py-2.5 sm:px-4.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 ring-2 ring-emerald-400/50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Google Play Store Hub</span>
              </button>

              <button
                onClick={() => setActiveNav("premium")}
                className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 ring-2 ring-amber-300/40"
              >
                <Crown className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>Go Premium (FamPay: 8867605076)</span>
              </button>

              <a
                href="tel:8431107332"
                className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
              >
                <Phone className="w-4 h-4 fill-slate-950" />
                <span>Call: 8431107332</span>
              </a>

              <a
                href="https://wa.me/918431107332?text=Hello%20Sangamesh,%20I%20am%20using%20your%20Local%20Business%20AI%20Suite%20and%20wanted%20to%20connect!"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border-2 border-emerald-400/70 text-emerald-300 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md shadow-emerald-950/40"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp (8431107332)</span>
              </a>

              <a
                href="mailto:shivkumarkhatge@gmail.com?subject=Contacting%20Founder%20Sangamesh%20Khatge%20-%20Local%20Business%20Suite"
                className="px-4 py-2.5 sm:px-4.5 sm:py-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Email Sangamesh</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Workspace Frame with Left Vertical Rail & Content Below Founder Banner */}
      <div className="flex-1 flex max-w-[1680px] w-full mx-auto relative">
        {/* Mobile Sidebar Overlay Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-80 max-w-[85vw] bg-slate-950/95 border-r border-slate-800/90 h-full p-4 overflow-y-auto shadow-2xl flex flex-col justify-between">
              {renderSidebarContent()}
            </div>
          </div>
        )}

        {/* Desktop Vertical Sidebar (Vertical Line in Left Side) */}
        <aside className="hidden lg:flex w-72 shrink-0 border-r border-slate-800/70 bg-slate-950/70 backdrop-blur-2xl p-4 flex-col justify-between sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 shadow-xl">
          {renderSidebarContent()}
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7 space-y-6 overflow-x-hidden">
          {/* 1. Welcome to Local Business Suite, Uses of This App, and Quick Access Cards */}
          <DashboardWelcome
            onNavigateToTab={(tab) => {
              setActiveNav(tab);
              setIsMobileMenuOpen(false);
            }}
            activeNav={activeNav}
            isKeyReady={!!apiKeyStatus?.configured}
            activeLocationName={activeLocation.name}
            onOpenKeyGuide={() => setActiveNav("credentials")}
          />

          {/* Online Monetization Sponsor Ad (Free for Pro Users) */}
          {activeNav !== "premium" && (
            <AdBanner
              isProUser={isProUser}
              onUpgradeClick={() => setActiveNav("premium")}
            />
          )}

          {/* VIEW: Official Evaluator 10/10 Star Feature Audit Console */}
          {activeNav === "evaluator_audit" && (
            <EvaluatorFeatureAuditHub onNavigateToTab={(tab) => setActiveNav(tab as MainNavTab)} />
          )}

          {/* VIEW: Native APK Kotlin Source & Hardware Bridge Inspector */}
          {activeNav === "apk_inspector" && <ApkCodeInspector />}

          {/* VIEW: User Generated Work & Campaign History across sessions */}
          {activeNav === "user_history" && (
            <UserHistoryHub
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onNavigateToTab={(tab) => setActiveNav(tab as MainNavTab)}
            />
          )}

          {/* VIEW: OmniStar 10X Super-Intelligence Studio (13/13 Benchmark Leader) */}
          {activeNav === "omnistar_10x" && (
            <OmniStarStudio
              isKeyReady={!!apiKeyStatus?.configured}
              onOpenKeyGuide={() => setActiveNav("credentials")}
              onSaveToWorkspace={handleSaveToWorkspace}
            />
          )}

          {/* VIEW: Google Play Store Publishing Center & Android TWA Studio */}
          {activeNav === "playstore" && (
            <GooglePlayPublisher onNavigateToTab={(tab: string) => setActiveNav(tab as MainNavTab)} />
          )}

          {/* VIEW: 10/10 Enterprise Technical Assessment & Architecture Audit Hub */}
          {activeNav === "technical_assessment" && (
            <TechnicalAssessmentHub onNavigateToTab={setActiveNav} />
          )}

          {/* 0. VIEW: OmniMega SuperBrain - Gemini + ChatGPT + NanoBanana + Google AI */}
          {activeNav === "superbrain" && <OmniSuperBrain />}

        {/* 0. VIEW: Acquisition & 100 Crore Buyout Portal */}
        {activeNav === "acquisition" && (
          <AcquisitionDeckHub
            locations={locations}
            isProUser={isProUser}
            onOpenKeyGuide={() => setActiveNav("credentials")}
            onNavigateToTab={setActiveNav}
          />
        )}

        {/* 0. VIEW: OmniBiz GPT - Enterprise Business ChatGPT */}
        {activeNav === "omni_gpt" && (
          <OmniBizGpt
            isKeyReady={!!apiKeyStatus?.configured}
            onOpenKeyGuide={() => setActiveNav("credentials")}
            activeLocation={activeLocation}
            onSaveToWorkspace={handleSaveToWorkspace}
          />
        )}

        {/* 1. VIEW: AI Business Growth Agent */}
        {activeNav === "growth" && (
          <GrowthAgent
            isKeyReady={!!apiKeyStatus?.configured}
            onOpenKeyGuide={() => setActiveNav("credentials")}
            onSaveToWorkspace={handleSaveToWorkspace}
          />
        )}

        {/* 2. VIEW: All-in-One Content Studio */}
        {activeNav === "content" && (
          <ContentStudio
            isKeyReady={!!apiKeyStatus?.configured}
            onOpenKeyGuide={() => setActiveNav("credentials")}
            onSaveToWorkspace={handleSaveToWorkspace}
          />
        )}

        {/* 3. VIEW: Business Analytics Dashboard */}
        {activeNav === "analytics" && (
          <AnalyticsDashboard
            isKeyReady={!!apiKeyStatus?.configured}
            onOpenKeyGuide={() => setActiveNav("credentials")}
            onSaveToWorkspace={handleSaveToWorkspace}
          />
        )}

        {/* 4. VIEW: AI Customer Support Agent */}
        {activeNav === "support" && (
          <SupportAgent
            isKeyReady={!!apiKeyStatus?.configured}
            onOpenKeyGuide={() => setActiveNav("credentials")}
            onLeadCaptured={(name, contact, notes) => {
              try {
                const saved = localStorage.getItem("lbs_real_leads");
                const currentLeads = saved ? JSON.parse(saved) : [];
                const newLead = {
                  id: `lead-${Date.now()}`,
                  customerName: name || "Chat Inquirer",
                  contact: contact || "WhatsApp",
                  source: "WhatsApp",
                  estimatedValue: 1800,
                  stage: "New",
                  notes: notes || "Captured by 24/7 AI Support Concierge",
                  createdAt: new Date().toISOString().split("T")[0],
                };
                localStorage.setItem("lbs_real_leads", JSON.stringify([newLead, ...currentLeads]));
              } catch (e) {}
            }}
          />
        )}

        {/* 5. VIEW: Competitor and SEO Intelligence */}
        {activeNav === "competitor" && (
          <CompetitorIntel
            isKeyReady={!!apiKeyStatus?.configured}
            onOpenKeyGuide={() => setActiveNav("credentials")}
            onSaveToWorkspace={handleSaveToWorkspace}
          />
        )}

        {/* 6. VIEW: Pro and Enterprise Workspace */}
        {activeNav === "workspace" && (
          <WorkspaceHub
            isProUser={isProUser}
            onOpenPremium={() => setActiveNav("premium")}
            onNavigateToTab={(tab) => setActiveNav(tab as MainNavTab)}
          />
        )}

        {/* 7. VIEW: AI Agent Builder */}
        {activeNav === "agents" && (
          <AgentBuilder
            isKeyReady={!!apiKeyStatus?.configured}
            onOpenKeyGuide={() => setActiveNav("credentials")}
            onSaveToWorkspace={handleSaveToWorkspace}
          />
        )}

        {/* 8. VIEW: Smart CRM and Lead Manager */}
        {activeNav === "crm" && (
          <SmartCrm
            isKeyReady={!!apiKeyStatus?.configured}
            onOpenKeyGuide={() => setActiveNav("credentials")}
            onSaveToWorkspace={handleSaveToWorkspace}
          />
        )}

        {/* 9. VIEW: Marketing Automation Center */}
        {activeNav === "marketing_auto" && (
          <MarketingAutomationCenter
            isKeyReady={!!apiKeyStatus?.configured}
            onOpenKeyGuide={() => setActiveNav("credentials")}
            onSaveToWorkspace={handleSaveToWorkspace}
          />
        )}

        {/* 10. VIEW: AI Voice Receptionist */}
        {activeNav === "voice_rep" && (
          <VoiceReceptionist
            isKeyReady={!!apiKeyStatus?.configured}
            onOpenKeyGuide={() => setActiveNav("credentials")}
            onSaveToWorkspace={handleSaveToWorkspace}
          />
        )}

        {/* VIEW: Premium & FamPay Upgrade Hub */}
        {activeNav === "premium" && (
          <PremiumHub
            onClose={() => setActiveNav("franchise")}
            onProActivated={() => setIsProUser(true)}
          />
        )}

        {/* VIEW: World Trading Knowledge & Intelligence Oracle */}
        {activeNav === "trading" && (
          <TradingOracle
            isKeyReady={!!apiKeyStatus?.configured}
            onOpenKeyGuide={() => setActiveNav("credentials")}
            onUpgradeToPro={() => setActiveNav("premium")}
          />
        )}

        {/* VIEW 0: Enterprise Franchise Command Center */}
        {activeNav === "franchise" && (
          <FranchiseCommandCenter
            locations={locations}
            activeLocationId={activeLocationId}
            onSelectLocation={(id) => {
              setActiveLocationId(id);
              setActiveNav("business");
            }}
            onAddLocation={(newLoc) => {
              setLocations((prev) => [newLoc, ...prev]);
              setActiveLocationId(newLoc.id);
            }}
            guardrails={guardrails}
            onUpdateGuardrails={setGuardrails}
            alerts={alerts}
            onResolveAlert={(alertId) => {
              setAlerts((prev) =>
                prev.map((a) => (a.id === alertId ? { ...a, status: "resolved" } : a))
              );
            }}
            isKeyReady={!!apiKeyStatus?.configured}
            onOpenKeyGuide={() => setActiveNav("credentials")}
          />
        )}

        {/* VIEW 0.5: Geo-Grid Local SEO & Google Maps Rank Radar */}
        {activeNav === "geogrid" && (
          <GeoGridRadar
            activeLocation={activeLocation}
            allLocations={locations}
            onSelectLocation={setActiveLocationId}
            onOpenFranchise={() => setActiveNav("franchise")}
            isKeyReady={!!apiKeyStatus?.configured}
            onOpenKeyGuide={() => setActiveNav("credentials")}
            guardrails={guardrails}
          />
        )}

        {/* VIEW 1: Audio Transcription */}
        {activeNav === "transcribe" && (
          <AudioTranscriber
            isKeyReady={!!apiKeyStatus?.configured}
            onOpenKeyGuide={() => setActiveNav("credentials")}
          />
        )}

        {/* VIEW 2: Music Generation */}
        {activeNav === "music" && (
          <MusicGenerator
            isKeyReady={!!apiKeyStatus?.configured}
            onOpenKeyGuide={() => setActiveNav("credentials")}
          />
        )}

        {/* VIEW 3: Business AI Marketing Suite */}
        {activeNav === "business" && (
          <BusinessSuite
            isKeyReady={!!apiKeyStatus?.configured}
            onOpenKeyGuide={() => setActiveNav("credentials")}
            activeLocation={activeLocation}
            guardrails={guardrails}
            allLocations={locations}
            onSelectLocation={setActiveLocationId}
            onOpenFranchise={() => setActiveNav("franchise")}
            onOpenGeoGrid={() => setActiveNav("geogrid")}
          />
        )}

        {/* VIEW 4: Prompt Studio Workspace */}
        {activeNav === "prompts" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left column: Saved prompts catalog */}
            <section className="lg:col-span-3 h-full flex flex-col min-h-[300px] lg:min-h-0">
              <PromptList
                prompts={prompts}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onCreateNew={handleCreateNewPrompt}
                onDelete={handleDeletePrompt}
                onResetToDefault={handleResetToDefault}
              />
            </section>

            {/* Middle column: Prompt Settings Workspace */}
            <section className="lg:col-span-5 space-y-4">
              {activePrompt ? (
                <PromptEditor
                  prompt={activePrompt}
                  onUpdate={handleUpdatePrompt}
                  variableValues={variableValues}
                  onVariableValueChange={handleVariableValueChange}
                  onRunTest={handleRunPromptTest}
                  isLoading={isLoading}
                  isKeyReady={!!apiKeyStatus?.configured}
                />
              ) : (
                <div className="p-10 border border-slate-800 border-dashed rounded-xl text-center text-slate-500">
                  No prompt template selected. Configure one or click create.
                </div>
              )}
            </section>

            {/* Right column: Results logs AND API Setup helper */}
            <section className="lg:col-span-4 flex flex-col space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-1 flex gap-1">
                <button
                  onClick={() => setRightActiveTab("logs")}
                  className={`flex-1 py-2 px-3 text-center text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    rightActiveTab === "logs"
                      ? "bg-slate-900 text-indigo-300 shadow-sm border border-slate-800"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>Prompt Results</span>
                </button>
                <button
                  onClick={() => setRightActiveTab("guide")}
                  className={`flex-1 py-2 px-3 text-center text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 relative ${
                    rightActiveTab === "guide"
                      ? "bg-slate-900 text-indigo-300 shadow-sm border border-slate-800"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                  }`}
                >
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Key Info</span>
                </button>
              </div>

              <div className="flex-1 min-h-[350px]">
                {rightActiveTab === "logs" ? (
                  <OutputConsole
                    output={output}
                    isLoading={isLoading}
                    error={testError}
                    elapsedTime={elapsedTime}
                    promptLength={promptLength}
                  />
                ) : (
                  <ApiKeyGuide
                    status={apiKeyStatus}
                    loading={checkingKey}
                    onRefresh={checkApiKeyOnServer}
                  />
                )}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 5: API Key Credentials & Setup Guide */}
        {activeNav === "credentials" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-100">API Key & Connection Setup</h2>
                  <p className="text-xs text-slate-450 mt-0.5">
                    Connect your Gemini API Key to enable Audio Transcription, Lyria Music Generation, and Marketing features.
                  </p>
                </div>
              </div>
            </div>

            <ApiKeyGuide
              status={apiKeyStatus}
              loading={checkingKey}
              onRefresh={checkApiKeyOnServer}
            />
          </div>
        )}

        {/* VIEW: How to Use This App - Complete Operating Manual & FAQs */}
        {activeNav === "how_to_use" && (
          <HowToUseGuide
            onNavigateToTab={(tab) => setActiveNav(tab)}
            isKeyReady={!!apiKeyStatus?.configured}
            onOpenKeyGuide={() => setActiveNav("credentials")}
          />
        )}

        {/* PILLAR 1: Real-Time Payment Gateway & Automated Billing Engine */}
        {activeNav === "billing_engine" && <AutomatedBillingEngine />}

        {/* PILLAR 2: True Multi-Tenant Database & Role-Based Access Control (RBAC) */}
        {activeNav === "rbac_tenants" && <MultiTenantRbacManager />}

        {/* PILLAR 3: Background Job Queue & High-Throughput Asynchronous Workers */}
        {activeNav === "job_queue" && <BackgroundJobQueueMonitor />}

        {/* FEATURE 4: Self-Serve WhatsApp Business API Onboarding & Template Portal */}
        {activeNav === "whatsapp_onboarding" && <WhatsAppOnboardingPortal />}

        {/* FEATURE 5: Enterprise Analytics & Proof of ROI Dashboard */}
        {activeNav === "enterprise_roi" && <EnterpriseRoiDashboard />}

        {/* FEATURE 6: Institutional Due-Diligence Package (M&A Ready) */}
        {activeNav === "due_diligence" && <DueDiligencePackageHub />}

        {/* FEATURE 7: Free Local SEO Audit Tool (Lead Magnet Engine) */}
        {activeNav === "free_seo_audit" && <FreeSeoAuditLeadMagnet />}

        {/* FEATURE 8: Targeted Meta & Google Ads (Side-by-Side Visual Comparison) */}
        {activeNav === "targeted_ads" && <TargetedAdsStudio />}

        {/* FEATURE 9: In-App Neighbor Referral Program (₹500 Discount Engine) */}
        {activeNav === "referrals" && <InAppReferralEngine />}

        {/* FEATURE 10: Agency & Reseller White-Label Portal (30% Rev-Share) */}
        {activeNav === "agency_portal" && <AgencyWhiteLabelPortal />}

        {/* FEATURE 11: Point-of-Sale (POS) Integrations (Petpooja, Posist, Vyapar) */}
        {activeNav === "pos_integrations" && <PosIntegrationsHub />}

        {/* FEATURE 12: Regional Franchise Chains Expansion (5–20 Store Operators) */}
        {activeNav === "regional_franchise" && <RegionalFranchiseExpansion />}

        {/* FEATURE 13: Developer Webhooks & Public API Gateway (Zapier, Make, REST API) */}
        {activeNav === "developer_webhooks" && <DeveloperWebhooksHub />}

        {/* FEATURE 14: Dynamic QR Review Flyer & Table-Tent Generator */}
        {activeNav === "qr_flyer" && <QrFlyerMarketingGenerator />}
      </main>
      </div>

      {/* Floating Mobile Quick-Action Dock (Ultra-Responsive Mobile Viewport 10/10 ⭐) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/90 px-3 py-2 flex items-center justify-around shadow-2xl safe-area-pb">
        <a
          href="tel:8431107332"
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <Phone className="w-4 h-4 text-emerald-400" />
          <span className="text-[9px] font-bold">Call Founder</span>
        </a>

        <a
          href="https://wa.me/918431107332"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-[9px] font-bold">WhatsApp</span>
        </a>

        <button
          onClick={() => setActiveNav("voice_rep")}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <PhoneCall className="w-4 h-4 text-cyan-400" />
          <span className="text-[9px] font-bold">24/7 AI Voice</span>
        </button>

        <button
          onClick={() => setActiveNav("qr_flyer")}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-amber-400 transition-colors"
        >
          <QrCode className="w-4 h-4 text-amber-400" />
          <span className="text-[9px] font-bold">QR Booster</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-white transition-colors"
        >
          <Menu className="w-4 h-4 text-indigo-400" />
          <span className="text-[9px] font-bold">All Tools</span>
        </button>
      </div>

      {/* User Login & Cloud Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={async () => {
          if (auth.currentUser) {
            const h = await loadUserHistory(auth.currentUser.uid);
            setUserHistoryCount(h.length);
          }
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 pb-16 lg:pb-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Local Business Suite</span>
            <span className="text-slate-700">•</span>
            <span className="font-mono text-slate-450">Gemini 3.5 Transcribe & Lyria Music</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => setActiveNav("playstore")}
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1"
            >
              <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
              <span>Google Play Console Hub</span>
            </button>
            <span className="text-slate-700">•</span>
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-200 transition-colors underline decoration-slate-700 underline-offset-2"
            >
              Privacy Policy
            </a>
            <span className="text-slate-700">•</span>
            <span>Production Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
