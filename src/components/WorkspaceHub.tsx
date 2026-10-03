import React, { useState, useEffect } from "react";
import {
  FolderKanban,
  Users,
  ShieldCheck,
  CreditCard,
  Download,
  BarChart3,
  Crown,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  FileText,
  BadgeCheck,
  Copy,
  Check,
  Search,
  Settings,
  Lock,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  DollarSign,
  Zap,
  Activity,
  Rocket,
  Target,
  Crosshair,
  MessageCircle,
  Layers,
  ArrowRight,
  MapPin,
  Building2
} from "lucide-react";
import {
  SavedWorkspaceProject,
  TeamMember,
  WorkspaceUsageQuota,
  WorkspaceAccount,
  ActivationCodeRecord,
  PaymentSubmission,
  ProductionCheckReport
} from "../types";

export interface UnifiedBusinessProfile {
  businessName: string;
  category: string;
  city: string;
  locality: string;
  phone: string;
  targetAudience: string;
  uniqueSellingPoint: string;
  monthlyGoal: string;
  highIntentKeywords: string;
  offerOrDiscount: string;
}

const DEFAULT_UNIFIED_PROFILE: UnifiedBusinessProfile = {
  businessName: "Artisan Roast Cafe & Bakehouse",
  category: "Bakery & Specialty Cafe",
  city: "Bengaluru",
  locality: "Indiranagar",
  phone: "+91 8431107332",
  targetAudience: "Urban professionals, remote workers & weekend foodies",
  uniqueSellingPoint: "100% wild-fermented organic sourdough & freshly roasted Arabica",
  monthlyGoal: "1,500 footfall visits & ₹4,50,000 monthly revenue",
  highIntentKeywords: "best sourdough bread near me, artisan bakery cafe, fresh coffee",
  offerOrDiscount: "Flat 20% off on your first breakfast combo with free dessert tasting",
};

interface WorkspaceHubProps {
  isProUser: boolean;
  onOpenPremium: () => void;
  onNavigateToTab?: (tab: string) => void;
}

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "tm-1",
    name: "Sangamesh Khatge",
    emailOrPhone: "+91 8431107332",
    role: "Owner",
    active: true,
    joinedAt: "Founder",
  },
  {
    id: "tm-2",
    name: "Sarah Jenkins",
    emailOrPhone: "sarah.j@artisanbakery.com",
    role: "Store Manager",
    active: true,
    joinedAt: "2026-08-10",
  },
  {
    id: "tm-3",
    name: "Arjun Verma",
    emailOrPhone: "+91 98451 22334",
    role: "Marketing Lead",
    active: true,
    joinedAt: "2026-09-01",
  },
];

const DEFAULT_PROJECTS: SavedWorkspaceProject[] = [
  {
    id: "proj-1",
    title: "Q4 30-Day Hyperlocal Growth Acceleration Plan",
    type: "Growth Plan",
    data: {
      budget: "₹15,000",
      targetCAC: "₹220",
      keyChannel: "WhatsApp & Meta Geo-Ads",
    },
    createdAt: "2026-09-24",
    lastModified: "2026-09-26",
    author: "Sangamesh Khatge",
    tags: ["High ROI", "Q4 Sprint", "Indiranagar"],
  },
  {
    id: "proj-2",
    title: "Weekend Festive Tasting & VIP Offer Suite",
    type: "Content Suite",
    data: {
      theme: "Buy 2 Get 1 Sourdough",
      languages: ["English", "Kannada", "Hindi"],
      platforms: ["Instagram Reels", "WhatsApp Broadcast", "YouTube Shorts"],
    },
    createdAt: "2026-09-25",
    lastModified: "2026-09-25",
    author: "Arjun Verma",
    tags: ["Festive", "Viral Reels", "Promotions"],
  },
  {
    id: "proj-3",
    title: "Competitor Benchmark vs Blue Pine Gourmet",
    type: "Competitor Audit",
    data: {
      competitor: "Blue Pine Gourmet Cafe",
      seoGap: "Google Maps 3-Pack Rank #4",
      action: "Inject 12 4K geo-tagged photos and WhatsApp ordering",
    },
    createdAt: "2026-09-26",
    lastModified: "2026-09-26",
    author: "Sarah Jenkins",
    tags: ["SEO", "Google Maps", "Local Teardown"],
  },
  {
    id: "proj-4",
    title: "September Unit Economics & Lead Conversion Audit",
    type: "Analytics Snapshot",
    data: {
      totalRevenue: "₹7,750",
      totalSpend: "₹3,650",
      netProfit: "₹4,100",
      conversionRate: "60.0%",
    },
    createdAt: "2026-09-26",
    lastModified: "2026-09-27",
    author: "Sangamesh Khatge",
    tags: ["Financials", "Real Data", "CFO Review"],
  },
];

export default function WorkspaceHub({
  isProUser,
  onOpenPremium,
  onNavigateToTab,
}: WorkspaceHubProps) {
  const [activeTab, setActiveTab] = useState<
    "unified" | "projects" | "team" | "permissions" | "audit" | "usage" | "subscription" | "admin"
  >("unified");

  // Unified Business Profile (Single profile feeding SEO, Ads, Leads & Growth tools)
  const [unifiedProfile, setUnifiedProfile] = useState<UnifiedBusinessProfile>(() => {
    try {
      const saved = localStorage.getItem("lbs_unified_business_profile");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_UNIFIED_PROFILE;
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [pipelineResult, setPipelineResult] = useState<any | null>(() => {
    try {
      const saved = localStorage.getItem("lbs_last_pipeline_result");
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [pipelineTab, setPipelineTab] = useState<"seo" | "ads" | "lead" | "growth">("seo");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [saveProjectNotice, setSaveProjectNotice] = useState(false);

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    localStorage.setItem("lbs_unified_business_profile", JSON.stringify(unifiedProfile));
    setIsEditingProfile(false);
    // Broadcast to synchronize with other tools (SEO Audit, Targeted Ads, Growth Agent)
    window.dispatchEvent(new Event("storage"));
  };

  const handleRunUnifiedPipeline = async () => {
    setIsRunningPipeline(true);
    try {
      const res = await fetch("/api/workspace/unified-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(unifiedProfile),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPipelineResult(data);
        localStorage.setItem("lbs_last_pipeline_result", JSON.stringify(data));
      } else {
        alert(data.message || "Failed to execute pipeline.");
      }
    } catch (e: any) {
      alert("Pipeline run failed: " + e.message);
    } finally {
      setIsRunningPipeline(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  const handleSavePipelineAsProject = () => {
    if (!pipelineResult) return;
    const newProj: SavedWorkspaceProject = {
      id: `proj-pipe-${Date.now()}`,
      title: `${unifiedProfile.businessName} - Unified 4-in-1 Multi-Tool Pipeline`,
      type: "Growth Plan",
      data: {
        budget: "₹25,000",
        targetCAC: "₹180",
        keyChannel: "WhatsApp & Meta Geo-Ads",
        seoTitle: pipelineResult.seoOutput?.googleMapsTitle,
        metaHook: pipelineResult.adCopyOutput?.metaCarousel?.[0]?.headline,
        growthGoal: pipelineResult.growthPlanOutput?.targetGoal,
      },
      createdAt: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
      author: account.fullName,
      tags: ["Unified Pipeline", unifiedProfile.city, "Multi-Tool"],
    };
    const updated = [newProj, ...projects];
    setProjects(updated);
    localStorage.setItem("lbs_workspace_projects", JSON.stringify(updated));
    setSaveProjectNotice(true);
    setTimeout(() => setSaveProjectNotice(false), 3000);
  };

  // Multi-business workspace isolation
  const [activeBusinessWorkspace, setActiveBusinessWorkspace] = useState("Austin Flagship Cafe");

  const [auditLogs, setAuditLogs] = useState<any[]>([
    {
      id: "aud-1",
      action: "Pro Subscription Verified",
      user: "Sangamesh Khatge",
      role: "Owner",
      ipOrOrigin: "127.0.0.1 (Local Verified)",
      timestamp: "Today, 10:14 AM",
      details: "Activation code redeemed via FamPay payment gateway.",
    },
    {
      id: "aud-2",
      action: "Project Exported to CSV",
      user: "Sarah Jenkins",
      role: "Store Manager",
      ipOrOrigin: "192.168.1.42 (Austin Branch)",
      timestamp: "Today, 09:30 AM",
      details: "Exported 4 active strategy and financial snapshot documents.",
    },
    {
      id: "aud-3",
      action: "AI Agent Synthesized",
      user: "Sangamesh Khatge",
      role: "Owner",
      ipOrOrigin: "127.0.0.1 (Local Verified)",
      timestamp: "Yesterday, 04:12 PM",
      details: "Generated 'Concierge, Lead Qualifier & Daily Reporter' agent.",
    },
    {
      id: "aud-4",
      action: "Telephony Webhook Route Configured",
      user: "Arjun Verma",
      role: "Marketing Lead",
      ipOrOrigin: "192.168.1.18",
      timestamp: "Sep 25, 2026",
      details: "Attached incoming call TwiML endpoint for voice receptionist.",
    },
  ]);

  // Account profile
  const [account, setAccount] = useState<WorkspaceAccount>(() => {
    try {
      const saved = localStorage.getItem("lbs_workspace_account");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: "acc-sangamesh",
      fullName: "Sangamesh Khatge",
      businessName: "Artisan Roast Cafe & Franchise Group",
      email: "shivkumarkhatge@gmail.com",
      phone: "+91 8431107332",
      role: "Founder & Lead Architect",
      plan: isProUser ? "Franchise Pro Growth" : "Free Explorer",
      isPro: isProUser,
      memberSince: "Founder / 2026",
    };
  });

  // Saved projects
  const [projects, setProjects] = useState<SavedWorkspaceProject[]>(() => {
    try {
      const saved = localStorage.getItem("lbs_workspace_projects");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PROJECTS;
  });

  // Team members
  const [team, setTeam] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem("lbs_workspace_team");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_TEAM;
  });

  // Modals & UI states
  const [projectSearch, setProjectSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<SavedWorkspaceProject | null>(null);

  // New team member state
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberContact, setNewMemberContact] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<
    "Store Manager" | "Marketing Lead" | "Staff / Cashier"
  >("Store Manager");

  // Admin telemetry state
  const [adminCodes, setAdminCodes] = useState<ActivationCodeRecord[]>([]);
  const [adminPending, setAdminPending] = useState<PaymentSubmission[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Gemini & Cloud Run Production Check state
  const [prodCheck, setProdCheck] = useState<ProductionCheckReport | null>(null);
  const [loadingProdCheck, setLoadingProdCheck] = useState(false);

  const fetchProdCheck = async () => {
    setLoadingProdCheck(true);
    try {
      const res = await fetch("/api/production-check");
      if (res.ok) {
        const data = await res.json();
        setProdCheck(data);
      }
    } catch (e) {
      console.error("Error fetching prod check:", e);
    } finally {
      setLoadingProdCheck(false);
    }
  };

  // Sync to storage
  useEffect(() => {
    localStorage.setItem("lbs_workspace_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("lbs_workspace_team", JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    if (activeTab === "admin") {
      fetchAdminData();
    }
    if (activeTab === "usage") {
      fetchProdCheck();
    }
  }, [activeTab]);

  const fetchAdminData = async () => {
    setLoadingAdmin(true);
    try {
      const [codesRes, pendingRes, statsRes] = await Promise.all([
        fetch("/api/admin/activation-codes"),
        fetch("/api/admin/pending-verifications"),
        fetch("/api/analytics/realtime-users"),
      ]);
      if (codesRes.ok) {
        const cData = await codesRes.json();
        setAdminCodes(cData.codes || []);
      }
      if (pendingRes.ok) {
        const pData = await pendingRes.json();
        setAdminPending(pData.submissions || []);
      }
      if (statsRes.ok) {
        const sData = await statsRes.json();
        setAdminStats(sData);
      }
    } catch (e) {
      console.error("Admin fetch error", e);
    } finally {
      setLoadingAdmin(false);
    }
  };

  const handleApprovePayment = async (submissionId: string) => {
    try {
      const res = await fetch("/api/admin/approve-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Payment approved! Generated Code: ${data.code}`);
        fetchAdminData();
      }
    } catch (e) {
      alert("Error approving payment");
    }
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: newMemberName.trim(),
      emailOrPhone: newMemberContact.trim() || "Pending contact",
      role: newMemberRole,
      active: true,
      joinedAt: new Date().toISOString().split("T")[0],
    };

    setTeam((prev) => [...prev, newMember]);
    setNewMemberName("");
    setNewMemberContact("");
    setShowAddMember(false);
  };

  const handleDeleteMember = (id: string) => {
    if (id === "tm-1") {
      alert("Founder account cannot be removed.");
      return;
    }
    setTeam((prev) => prev.filter((m) => m.id !== id));
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Are you sure you want to delete this saved project?")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (selectedProject?.id === id) setSelectedProject(null);
    }
  };

  // Quota calculation
  const quota: WorkspaceUsageQuota = {
    aiMonthlyGenerationsUsed: isProUser ? 48 : 82,
    aiMonthlyGenerationsLimit: isProUser ? 9999 : 100,
    whatsAppCreditsUsed: isProUser ? 142 : 18,
    whatsAppCreditsLimit: isProUser ? 5000 : 25,
    savedProjectsCount: projects.length,
    savedProjectsLimit: isProUser ? 250 : 5,
    locationsCount: 4,
    locationsLimit: isProUser ? 50 : 2,
    teamMembersCount: team.length,
    teamMembersLimit: isProUser ? 20 : 3,
  };

  // Export projects to CSV
  const handleExportCSV = () => {
    const headers = ["Project Title", "Type", "Author", "Created At", "Last Modified", "Tags"];
    const rows = projects.map((p) => [
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.type}"`,
      `"${p.author}"`,
      p.createdAt,
      p.lastModified,
      `"${p.tags.join("; ")}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `workspace_projects_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export to Printable PDF
  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to generate print summary");
      return;
    }
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Workspace Report - Local Business Suite</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }
          h1 { color: #0f172a; margin-bottom: 4px; }
          .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px; }
          .meta { font-size: 13px; color: #64748b; }
          .section { margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 13px; }
          th { background-color: #f8fafc; font-weight: 600; }
          .tag { display: inline-block; background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-right: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${account.businessName}</h1>
          <div class="meta">
            Workspace Executive Report • Generated on ${new Date().toLocaleDateString()} by ${account.fullName} (${account.role})
          </div>
          <div class="meta" style="margin-top: 4px;">
            Plan Tier: <strong>${isProUser ? "PRO SUBSCRIBER (FamPay VIP)" : "Free Explorer"}</strong> • Contact: ${account.phone}
          </div>
        </div>

        <div class="section">
          <h2>Saved Projects & Strategic Assets (${projects.length})</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Author</th>
                <th>Created</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              ${projects
                .map(
                  (p) => `
                <tr>
                  <td><strong>${p.title}</strong></td>
                  <td>${p.type}</td>
                  <td>${p.author}</td>
                  <td>${p.createdAt}</td>
                  <td>${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Active Team Members (${team.length})</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${team
                .map(
                  (t) => `
                <tr>
                  <td>${t.name}</td>
                  <td>${t.emailOrPhone}</td>
                  <td>${t.role}</td>
                  <td>${t.active ? "Active" : "Inactive"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(projectSearch.toLowerCase()));
    const matchesType = typeFilter === "All" || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Account Profile Snapshot */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30 shrink-0 ring-2 ring-indigo-400/40">
              SK
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  Enterprise Workspace
                </span>
                {isProUser ? (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border border-amber-400/50 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    PRO SUBSCRIBER (VIP)
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    Free Explorer Tier
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                {account.businessName}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                <span>Account: <strong className="text-slate-200">{account.fullName}</strong></span>
                <span>•</span>
                <span>Role: <strong className="text-indigo-300">{account.role}</strong></span>
                <span>•</span>
                <span>Founder Hotline: <strong className="text-emerald-400">{account.phone}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Export saved projects to CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Print executive PDF summary"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print PDF</span>
            </button>

            {!isProUser && (
              <button
                onClick={onOpenPremium}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Crown className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>Upgrade to Pro</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("unified")}
          className={`text-xs px-3.5 py-2 rounded-xl font-black flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "unified"
              ? "bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600 text-slate-950 shadow-md ring-1 ring-amber-300"
              : "bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>✨ Unified AI Workspace</span>
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "projects"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Saved Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("team")}
          className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "team"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Team Collaboration ({team.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("permissions")}
          className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "permissions"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Roles & Permissions</span>
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "audit"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("usage")}
          className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "usage"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Usage Limits & Quotas</span>
        </button>

        <button
          onClick={() => setActiveTab("subscription")}
          className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "subscription"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Subscription & Billing</span>
        </button>

        <button
          onClick={() => setActiveTab("admin")}
          className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "admin"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-slate-900 text-amber-400 hover:bg-amber-950/30 border border-amber-500/30"
          }`}
        >
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Founder Admin Dashboard</span>
        </button>
      </div>

      {/* VIEW 0: UNIFIED AI WORKSPACE & PROFILE DISPATCHER */}
      {activeTab === "unified" && (
        <div className="space-y-6">
          {/* Executive Overview Banner */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30 shrink-0">
                  <Sparkles className="w-8 h-8 text-slate-950" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      ★ Master Business Profile
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      4 AI Engines Synchronized
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Unified AI Workspace: 1 Profile → 4 Enterprise Engines
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                    Configure your business profile once. This single master dataset feeds your <strong>Local SEO 5x5 Geo-Grid</strong>, <strong>Targeted Ads Studio</strong>, <strong>Customer Lead Magnet & WhatsApp Sequences</strong>, and <strong>30-Day Growth Plan</strong> without repeating inputs.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-start lg:self-center">
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-sm"
                >
                  {isEditingProfile ? "Cancel Editing" : "✎ Edit Business Profile"}
                </button>
                <button
                  onClick={handleRunUnifiedPipeline}
                  disabled={isRunningPipeline}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600 hover:from-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <Zap className={`w-4 h-4 text-slate-950 ${isRunningPipeline ? "animate-spin" : ""}`} />
                  <span>{isRunningPipeline ? "Running 4 AI Engines..." : "⚡ Execute Multi-Tool Pipeline"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Editor Modal / Inline Card */}
          {isEditingProfile && (
            <form onSubmit={handleSaveProfile} className="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span>Edit Master Business Profile</span>
                </h4>
                <span className="text-[10px] text-amber-300 font-mono">Auto-saves to browser memory</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Store / Business Name:</label>
                  <input
                    type="text"
                    value={unifiedProfile.businessName}
                    onChange={(e) => setUnifiedProfile({ ...unifiedProfile, businessName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Industry / Category:</label>
                  <input
                    type="text"
                    value={unifiedProfile.category}
                    onChange={(e) => setUnifiedProfile({ ...unifiedProfile, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Specialty Cafe, Salon, Dental Clinic"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Locality / Street Address:</label>
                  <input
                    type="text"
                    value={unifiedProfile.locality}
                    onChange={(e) => setUnifiedProfile({ ...unifiedProfile, locality: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Indiranagar 100ft Road"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">City:</label>
                  <input
                    type="text"
                    value={unifiedProfile.city}
                    onChange={(e) => setUnifiedProfile({ ...unifiedProfile, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Bengaluru, Mumbai, Delhi"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Store WhatsApp / Phone:</label>
                  <input
                    type="text"
                    value={unifiedProfile.phone}
                    onChange={(e) => setUnifiedProfile({ ...unifiedProfile, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. +91 8431107332"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Monthly Footfall / Revenue Goal:</label>
                  <input
                    type="text"
                    value={unifiedProfile.monthlyGoal}
                    onChange={(e) => setUnifiedProfile({ ...unifiedProfile, monthlyGoal: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. 1,500 visits & ₹4,50,000 revenue"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Unique Hook / Differentiator (USP):</label>
                  <input
                    type="text"
                    value={unifiedProfile.uniqueSellingPoint}
                    onChange={(e) => setUnifiedProfile({ ...unifiedProfile, uniqueSellingPoint: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. 100% wild-fermented sourdough & freshly roasted direct-trade Arabica"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Special Offer / Promotion:</label>
                  <input
                    type="text"
                    value={unifiedProfile.offerOrDiscount}
                    onChange={(e) => setUnifiedProfile({ ...unifiedProfile, offerOrDiscount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Flat 20% off breakfast combo"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Save Profile & Sync Across App</span>
                </button>
              </div>
            </form>
          )}

          {/* Master Profile Summary Strip */}
          {!isEditingProfile && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Business</span>
                <div className="text-sm font-black text-white truncate">{unifiedProfile.businessName}</div>
                <div className="text-[11px] text-amber-300 truncate">{unifiedProfile.category}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Location</span>
                <div className="text-sm font-black text-white truncate">{unifiedProfile.locality}</div>
                <div className="text-[11px] text-slate-400 truncate">{unifiedProfile.city}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Contact</span>
                <div className="text-sm font-black text-emerald-400 font-mono truncate">{unifiedProfile.phone}</div>
                <div className="text-[11px] text-slate-400">WhatsApp Enabled</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Target Goal</span>
                <div className="text-sm font-black text-indigo-300 truncate">{unifiedProfile.monthlyGoal}</div>
                <div className="text-[11px] text-emerald-400 truncate">{unifiedProfile.offerOrDiscount}</div>
              </div>
            </div>
          )}

          {/* Animated Pipeline Running State */}
          {isRunningPipeline && (
            <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-indigo-500/50 space-y-4 text-center animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500 mx-auto flex items-center justify-center text-indigo-300">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-white">Running Multi-Tool Consensus Pipeline...</h4>
                <p className="text-xs text-slate-400">Synthesizing SEO radar, high-converting ad copy, lead magnet sequences, and growth milestones.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 max-w-xl mx-auto text-[11px] font-mono font-bold">
                <span className="text-amber-300">✓ 1. Geo-Grid SEO</span>
                <span className="text-purple-300">✓ 2. Meta/Google Ads</span>
                <span className="text-emerald-300">✓ 3. WhatsApp CRM</span>
                <span className="text-cyan-300">✓ 4. 30-Day Growth</span>
              </div>
            </div>
          )}

          {/* Pipeline Results View */}
          {pipelineResult && !isRunningPipeline && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setPipelineTab("seo")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      pipelineTab === "seo" ? "bg-blue-600 text-white shadow" : "bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Crosshair className="w-3.5 h-3.5 text-blue-300" />
                    <span>1. Local SEO & Geo-Grid</span>
                  </button>

                  <button
                    onClick={() => setPipelineTab("ads")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      pipelineTab === "ads" ? "bg-purple-600 text-white shadow" : "bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Target className="w-3.5 h-3.5 text-purple-300" />
                    <span>2. Meta & Google Ad Copy</span>
                  </button>

                  <button
                    onClick={() => setPipelineTab("lead")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      pipelineTab === "lead" ? "bg-emerald-600 text-white shadow" : "bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                    <span>3. WhatsApp Lead Magnet</span>
                  </button>

                  <button
                    onClick={() => setPipelineTab("growth")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      pipelineTab === "growth" ? "bg-amber-500 text-slate-950 font-black shadow" : "bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    <span>4. 30-Day Growth Roadmap</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSavePipelineAsProject}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow"
                  >
                    <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{saveProjectNotice ? "Saved to Projects!" : "Save Pipeline"}</span>
                  </button>
                </div>
              </div>

              {/* ENGINE 1: LOCAL SEO & GEO-GRID */}
              {pipelineTab === "seo" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <div className="text-[10px] text-slate-400 font-mono uppercase">Optimized Google Maps Listing Title</div>
                      <div className="text-sm font-black text-amber-300 font-mono mt-0.5">
                        {pipelineResult.seoOutput?.googleMapsTitle}
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigateToTab?.("free_seo_audit")}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow"
                    >
                      <span>Open in Free SEO Audit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">Top 5 Geo-Grid High-Intent Keywords</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {pipelineResult.seoOutput?.geoGridKeywords?.map((k: any, idx: number) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-mono text-emerald-400 font-bold">{k.radiusKm}</span>
                            <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[9px]">{k.intent}</span>
                          </div>
                          <div className="text-xs font-bold text-white font-mono">{k.keyword}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{k.estimatedMonthlySearches} monthly searches</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">Top Actionable SEO Prescriptions</h5>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {pipelineResult.seoOutput?.actionableSeoPrescriptions?.map((p: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* ENGINE 2: TARGETED META & GOOGLE ADS */}
              {pipelineTab === "ads" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">3-Slide Meta Carousel (Instagram & Facebook Stories / Feeds)</span>
                    <button
                      onClick={() => onNavigateToTab?.("targeted_ads")}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      <span>Open in Targeted Ads Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {pipelineResult.adCopyOutput?.metaCarousel?.map((slide: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold uppercase">Slide {slide.slideNumber}</span>
                            <button
                              onClick={() => handleCopyText(`${slide.headline}\n\n${slide.body}\n\nCTA: ${slide.callToAction}`, `slide-${idx}`)}
                              className="text-slate-400 hover:text-white"
                            >
                              {copiedSnippet === `slide-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <h6 className="text-xs font-bold text-white">{slide.headline}</h6>
                          <p className="text-[11px] text-slate-300 leading-relaxed">{slide.body}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-850 text-[10px] text-amber-300 font-bold">
                          Button CTA: {slide.callToAction}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">Ready WhatsApp Flash Deal Broadcast</span>
                      <button
                        onClick={() => handleCopyText(pipelineResult.adCopyOutput?.whatsappFlashDeal || "", "wa-deal")}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1"
                      >
                        {copiedSnippet === "wa-deal" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSnippet === "wa-deal" ? "Copied!" : "Copy Broadcast"}</span>
                      </button>
                    </div>
                    <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                      {pipelineResult.adCopyOutput?.whatsappFlashDeal}
                    </pre>
                  </div>
                </div>
              )}

              {/* ENGINE 3: CUSTOMER LEAD MAGNET & WHATSAPP CRM */}
              {pipelineTab === "lead" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">High-Conversion WhatsApp Lead Closer Scripts</span>
                    <button
                      onClick={() => onNavigateToTab?.("crm")}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      <span>Open in Smart CRM</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Inbound Outreach Opener</div>
                    <p className="text-xs text-emerald-300 font-medium">"{pipelineResult.customerLeadOutput?.outreachScript}"</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <h6 className="text-xs font-bold text-white uppercase tracking-wider">3 Lead Qualification Questions</h6>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {pipelineResult.customerLeadOutput?.leadQualificationQuestions?.map((q: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-mono text-amber-400 font-bold">{idx + 1}.</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <h6 className="text-xs font-bold text-white uppercase tracking-wider">Common Objection Handling</h6>
                      <div className="space-y-2 text-xs">
                        {pipelineResult.customerLeadOutput?.objectionRebuttals?.map((obj: any, idx: number) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                            <div className="text-amber-300 font-bold">Q: {obj.objection}</div>
                            <div className="text-slate-300 text-[11px]">A: {obj.rebuttal}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ENGINE 4: 30-DAY GROWTH ROADMAP */}
              {pipelineTab === "growth" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-300">Goal-Aligned 90-Day Hyperlocal Growth Acceleration</span>
                      <span className="text-[10px] text-amber-300 font-mono block">Target: {pipelineResult.growthPlanOutput?.targetGoal}</span>
                    </div>
                    <button
                      onClick={() => onNavigateToTab?.("growth")}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow"
                    >
                      <span>Open in AI Growth Agent</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {pipelineResult.growthPlanOutput?.timeline?.map((phase: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
                            Phase {idx + 1}
                          </span>
                          <h6 className="text-xs font-bold text-white">{phase.phase}</h6>
                          <p className="text-[11px] text-slate-400 leading-snug">{phase.focus}</p>
                          <ul className="space-y-1 text-[11px] text-slate-300 pt-1">
                            {phase.keyMilestones?.map((m: string, mIdx: number) => (
                              <li key={mIdx} className="flex items-start gap-1.5">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span>{m}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-2 border-t border-slate-850 text-[10px] font-mono text-emerald-400 font-bold">
                          Outcome: {phase.expectedOutcome}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW 1: SAVED PROJECTS */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search projects or tags..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              {["All", "Growth Plan", "Content Suite", "Competitor Audit", "Analytics Snapshot"].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      typeFilter === type
                        ? "bg-indigo-600 text-white font-semibold"
                        : "bg-slate-950 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        p.type === "Growth Plan"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : p.type === "Content Suite"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : p.type === "Competitor Audit"
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {p.type}
                    </span>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1 transition-opacity"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{p.title}</h3>

                  <div className="text-xs text-slate-400 font-mono bg-slate-950/70 p-2.5 rounded-lg border border-slate-850 space-y-1">
                    {Object.entries(p.data).map(([k, v]: any) => (
                      <div key={k} className="flex items-center justify-between text-[11px]">
                        <span className="capitalize text-slate-500">{k}:</span>
                        <span className="text-slate-300 font-medium truncate max-w-[170px]">
                          {Array.isArray(v) ? v.join(", ") : String(v)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span>By {p.author}</span>
                  <div className="flex items-center gap-2">
                    <span>{p.createdAt}</span>
                    <button
                      onClick={() => setSelectedProject(p)}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="p-12 border border-slate-800 border-dashed rounded-2xl text-center text-slate-500 space-y-2">
              <FolderKanban className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm">No saved projects match your search or filter.</p>
              <p className="text-xs text-slate-600">
                Generate a Growth Plan or Content Suite and click "Save to Workspace" to populate this library.
              </p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: TEAM COLLABORATION */}
      {activeTab === "team" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div>
              <h3 className="text-sm font-bold text-white">Team & Multi-Role Access Control</h3>
              <p className="text-xs text-slate-400">
                Assign roles to your store managers, cashiers, and marketing leads for synchronized execution.
              </p>
            </div>
            <button
              onClick={() => setShowAddMember(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Invite Member</span>
            </button>
          </div>

          {showAddMember && (
            <form
              onSubmit={handleAddTeamMember}
              className="bg-slate-900 border border-indigo-500/40 rounded-xl p-4 space-y-3"
            >
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Invite New Team Member
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Gupta"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Email or Phone</label>
                  <input
                    type="text"
                    placeholder="rahul@store.com or 98451xxxxx"
                    value={newMemberContact}
                    onChange={(e) => setNewMemberContact(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Assigned Role</label>
                  <select
                    value={newMemberRole}
                    onChange={(e: any) => setNewMemberRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Store Manager">Store Manager (Full Store Operations)</option>
                    <option value="Marketing Lead">Marketing Lead (Content & Growth)</option>
                    <option value="Staff / Cashier">Staff / Cashier (Lead Logging & Support)</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm"
                >
                  Add Member
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {team.map((m) => (
              <div
                key={m.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow">
                    {m.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{m.name}</span>
                      {m.role === "Owner" && (
                        <BadgeCheck className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <span>{m.role}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px]">{m.emailOrPhone}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      m.active
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {m.active ? "Active" : "Paused"}
                  </span>
                  {m.role !== "Owner" && (
                    <button
                      onClick={() => handleDeleteMember(m.id)}
                      className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: ROLE PERMISSIONS MATRIX */}
      {activeTab === "permissions" && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Multi-Role Access Control & Security Matrix</span>
            </h3>
            <p className="text-xs text-slate-400">
              Role permissions strictly isolate commercial finances, AI execution budgets, and store data.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="p-3.5">Permission / Privilege</th>
                  <th className="p-3.5 text-center text-amber-400 font-bold">Owner (Founder)</th>
                  <th className="p-3.5 text-center text-indigo-300 font-bold">Store Manager</th>
                  <th className="p-3.5 text-center text-purple-300 font-bold">Marketing Lead</th>
                  <th className="p-3.5 text-center text-emerald-300 font-bold">Staff / Cashier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="p-3.5 font-medium text-white">View Financial Revenue, Margins & CAC</td>
                  <td className="p-3.5 text-center text-emerald-400">Full Access</td>
                  <td className="p-3.5 text-center text-emerald-400">Branch Only</td>
                  <td className="p-3.5 text-center text-slate-500">Restricted</td>
                  <td className="p-3.5 text-center text-slate-500">Restricted</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-white">Generate AI Business Growth & Content</td>
                  <td className="p-3.5 text-center text-emerald-400">Unlimited</td>
                  <td className="p-3.5 text-center text-emerald-400">Unlimited</td>
                  <td className="p-3.5 text-center text-emerald-400">Unlimited</td>
                  <td className="p-3.5 text-center text-amber-400">Draft Only</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-white">Inbound Lead Logging & CRM Follow-ups</td>
                  <td className="p-3.5 text-center text-emerald-400">Full Access</td>
                  <td className="p-3.5 text-center text-emerald-400">Full Access</td>
                  <td className="p-3.5 text-center text-emerald-400">Full Access</td>
                  <td className="p-3.5 text-center text-emerald-400">Log & Ping</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-white">Telephony Webhooks & Call Transfer Routing</td>
                  <td className="p-3.5 text-center text-emerald-400">Full Access</td>
                  <td className="p-3.5 text-center text-slate-500">View Only</td>
                  <td className="p-3.5 text-center text-slate-500">View Only</td>
                  <td className="p-3.5 text-center text-slate-500">No Access</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-white">Export Sensitive Data (CSV/PDF)</td>
                  <td className="p-3.5 text-center text-emerald-400">Full Access</td>
                  <td className="p-3.5 text-center text-emerald-400">Full Access</td>
                  <td className="p-3.5 text-center text-amber-400">Content Only</td>
                  <td className="p-3.5 text-center text-slate-500">Disabled</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-white">Billing, Plan Upgrades & Activation Codes</td>
                  <td className="p-3.5 text-center text-emerald-400">Full Access</td>
                  <td className="p-3.5 text-center text-slate-500">No Access</td>
                  <td className="p-3.5 text-center text-slate-500">No Access</td>
                  <td className="p-3.5 text-center text-slate-500">No Access</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: AUDIT LOGS & DATA SECURITY */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Enterprise Security & Audit Trail</span>
              </h3>
              <p className="text-xs text-slate-400">
                Immutable activity records tracking logins, data exports, plan activations, and configuration edits.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-emerald-300">
              Audit Logger: Active
            </span>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{log.action}</span>
                    <span className="px-2 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                      {log.role}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{log.details}</p>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 shrink-0 font-mono">
                  <span>By {log.user}</span>
                  <span>•</span>
                  <span>{log.ipOrOrigin}</span>
                  <span>•</span>
                  <span className="text-slate-400">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: USAGE LIMITS & QUOTAS */}
      {activeTab === "usage" && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white">Platform Usage & Resource Telemetry</h3>
            <p className="text-xs text-slate-400">
              Track your AI intelligence queries, WhatsApp credits, and database capacity across your organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* AI Generations */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Monthly AI Generations
                </span>
                <span className="font-mono font-bold text-indigo-300">
                  {quota.aiMonthlyGenerationsUsed} / {isProUser ? "∞" : quota.aiMonthlyGenerationsLimit}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  style={{
                    width: isProUser
                      ? "10%"
                      : `${(quota.aiMonthlyGenerationsUsed / quota.aiMonthlyGenerationsLimit) * 100}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {isProUser ? "Unlimited generation for Pro VIP subscribers." : "18 generations remaining this month."}
              </p>
            </div>

            {/* WhatsApp Credits */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  WhatsApp Direct Credits
                </span>
                <span className="font-mono font-bold text-emerald-300">
                  {quota.whatsAppCreditsUsed} / {isProUser ? "5,000" : quota.whatsAppCreditsLimit}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  style={{
                    width: `${
                      (quota.whatsAppCreditsUsed /
                        (isProUser ? 5000 : quota.whatsAppCreditsLimit)) *
                      100
                    }%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Direct zero-commission WhatsApp leads and broadcast alerts.
              </p>
            </div>

            {/* Saved Projects Storage */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
                  Saved Projects Library
                </span>
                <span className="font-mono font-bold text-cyan-300">
                  {quota.savedProjectsCount} / {isProUser ? "250" : quota.savedProjectsLimit}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  style={{
                    width: `${
                      (quota.savedProjectsCount /
                        (isProUser ? 250 : quota.savedProjectsLimit)) *
                      100
                    }%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Growth plans, content calendars, and competitive audits.
              </p>
            </div>
          </div>

          {/* Cloud Run & Gemini Production Safeguards (3-Pillar Verification) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Gemini API & Cloud Run Production Safeguards</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    September 2026 Compliant
                  </span>
                </h4>
                <p className="text-xs text-slate-400">
                  Pre-launch verification of credentials, 429/503 exponential backoff, and surprise bill prevention.
                </p>
              </div>

              <button
                onClick={fetchProdCheck}
                disabled={loadingProdCheck}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingProdCheck ? "animate-spin text-indigo-400" : ""}`} />
                <span>Verify Production State</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Check 1 */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    1. API Credentials
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    MIGRATED
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Adheres strictly to the post-September 2026 mandate requiring official authorization keys.
                </p>
                <div className="text-[10px] font-mono text-slate-400 bg-slate-900 p-2 rounded border border-slate-800/80 space-y-0.5">
                  <div>• Legacy OAuth (ya29): <strong className="text-emerald-400">Rejected</strong></div>
                  <div>• Key Exposure: <strong className="text-cyan-400">Zero (Cloud Run env)</strong></div>
                  <div>• Telemetry: <strong className="text-indigo-400">aistudio-build</strong></div>
                </div>
              </div>

              {/* Check 2 */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    2. Error Handling
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    EXPONENTIAL
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Automatic retry of temporary 429/503 errors with exponential backoff & 3-attempt limit.
                </p>
                <div className="text-[10px] font-mono text-slate-400 bg-slate-900 p-2 rounded border border-slate-800/80 space-y-0.5">
                  <div>• Retry Limit: <strong className="text-slate-200">3 attempts max</strong></div>
                  <div>• Backoff Delays: <strong className="text-slate-200">1.2s → 2.4s → 4.8s</strong></div>
                  <div>• Failover: <strong className="text-cyan-300">3.8-flash → latest</strong></div>
                </div>
              </div>

              {/* Check 3 */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    3. API Costs & Spending
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    GUARDED
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Continuous tracking of requests, tokens, and daily spend prevents surprise bills.
                </p>
                <div className="text-[10px] font-mono text-slate-400 bg-slate-900 p-2 rounded border border-slate-800/80 space-y-0.5">
                  <div>• Requests Logged: <strong className="text-white">{prodCheck?.check3_apiCosts.totalRequests || 0}</strong></div>
                  <div>• Tokens Consumed: <strong className="text-indigo-300">{(prodCheck?.check3_apiCosts.totalTokens || 0).toLocaleString()}</strong></div>
                  <div>• Est. Spend: <strong className="text-emerald-400">${prodCheck?.check3_apiCosts.estimatedSpendUsd || "0.00000"} (≈ ₹{prodCheck?.check3_apiCosts.estimatedSpendInr || "0.00"})</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: SUBSCRIPTION MANAGEMENT */}
      {activeTab === "subscription" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/40 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-black text-white">
                    {isProUser ? "Franchise Pro Growth (Active VIP)" : "Free Explorer Plan"}
                  </h3>
                </div>
                <p className="text-xs text-slate-300">
                  {isProUser
                    ? "Your Pro License is active with ad-free VIP privileges, unlimited AI, and multi-location command."
                    : "Upgrade to Franchise Pro for unlimited AI generations, 50 branches, and 5,000 WhatsApp credits."}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onOpenPremium}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:scale-105 transition-all"
                >
                  <CreditCard className="w-3.5 h-3.5 text-slate-950" />
                  <span>{isProUser ? "Manage / Renew VIP Plan" : "Activate Pro on FamPay"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Official Payment Gateway
              </span>
              <p className="text-xs text-slate-200 font-bold">FamPay UPI (Zero Commission)</p>
              <p className="text-xs font-mono text-emerald-400">8867605076@fam</p>
              <p className="text-[11px] text-slate-400">
                Direct verification by Founder Sangamesh Khatge.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Founder WhatsApp Verification
              </span>
              <p className="text-xs text-slate-200 font-bold">Sangamesh Khatge</p>
              <p className="text-xs font-mono text-amber-300">+91 8431107332</p>
              <p className="text-[11px] text-slate-400">
                Immediate code delivery upon screenshot submission.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Tax Invoice & Records
              </span>
              <p className="text-xs text-slate-200 font-bold">Commercial GST Compliant</p>
              <button
                onClick={handleExportPDF}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Latest Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: FOUNDER ADMIN DASHBOARD */}
      {activeTab === "admin" && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black text-white">Founder & Admin Control Center</h3>
              </div>
              <p className="text-xs text-slate-400">
                Manage issued activation codes, pending FamPay payments, and live server telemetry.
              </p>
            </div>
            <button
              onClick={fetchAdminData}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingAdmin ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Pending Payments Queue */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
              <span>Pending Payment Verifications ({adminPending.filter((p) => p.status === "pending").length})</span>
              <span className="text-[11px] text-slate-500 lowercase">FamPay UPI Submissions</span>
            </h4>

            {adminPending.filter((p) => p.status === "pending").length === 0 ? (
              <p className="text-xs text-slate-500 italic">No pending payment verifications right now.</p>
            ) : (
              <div className="space-y-2">
                {adminPending
                  .filter((p) => p.status === "pending")
                  .map((sub) => (
                    <div
                      key={sub.id}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{sub.userContact}</span>
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                            {sub.planName} (₹{sub.amount})
                          </span>
                        </div>
                        <p className="font-mono text-emerald-400 text-[11px]">UTR: {sub.utr}</p>
                      </div>
                      <button
                        onClick={() => handleApprovePayment(sub.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Issue Code</span>
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* All Issued Codes */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Registered Activation Codes ({adminCodes.length})
            </h4>

            <div className="max-h-72 overflow-y-auto space-y-1.5">
              {adminCodes.map((code) => (
                <div
                  key={code.code}
                  className="bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-amber-300">{code.code}</span>
                    <span className="text-slate-400 font-medium">{code.planName}</span>
                    <span className="text-slate-500 text-[11px]">{code.userContact}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        code.status === "active"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {code.status}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(code.code);
                        setCopiedCode(code.code);
                        setTimeout(() => setCopiedCode(null), 2000);
                      }}
                      className="text-slate-400 hover:text-white p-1"
                      title="Copy code"
                    >
                      {copiedCode === code.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                {selectedProject.type}
              </span>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-500 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            <h3 className="text-base font-bold text-white">{selectedProject.title}</h3>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-2 text-slate-300 max-h-60 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{JSON.stringify(selectedProject.data, null, 2)}</pre>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
              <span>Author: {selectedProject.author}</span>
              <span>Saved on {selectedProject.createdAt}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
