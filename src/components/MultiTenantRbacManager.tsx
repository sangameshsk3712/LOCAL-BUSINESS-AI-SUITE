import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  Building2,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Eye,
  Plus,
  ArrowRight,
  Database,
  Globe2,
  Sparkles,
  Key,
  BadgeCheck,
  UserCheck,
  Briefcase,
  AlertTriangle,
  QrCode,
  MessageCircle,
  BarChart3,
  CreditCard
} from "lucide-react";
import { TenantWorkspace, StaffRole, StaffMember } from "../types";

export default function MultiTenantRbacManager() {
  const [tenants, setTenants] = useState<TenantWorkspace[]>([]);
  const [activeTenantId, setActiveTenantId] = useState<string>("tenant-1");
  const [currentSimulatedRole, setCurrentSimulatedRole] = useState<StaffRole>("owner");

  // New staff form
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>("manager");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchTenants = async () => {
    try {
      const res = await fetch("/api/tenants");
      const data = await res.json();
      if (data.success && data.tenants) {
        setTenants(data.tenants);
      }
    } catch (e) {
      console.error("Failed to load tenants:", e);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/tenants/${activeTenantId}/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newStaffName,
          email: newStaffEmail,
          phone: newStaffPhone,
          role: newStaffRole,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice(data.message);
        setNewStaffName("");
        setNewStaffEmail("");
        setNewStaffPhone("");
        fetchTenants();
        setTimeout(() => setActionNotice(null), 5000);
      }
    } catch (err: any) {
      alert("Error adding staff: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Permission Matrix checker
  const permissionsList = [
    {
      key: "canViewRevenue",
      label: "Full Revenue & Financial BI",
      description: "View gross revenue, profit margins, and daily sales numbers",
      allowedRoles: ["owner"],
      icon: BarChart3,
    },
    {
      key: "canManageBilling",
      label: "Gateway Billing & Subscription Plans",
      description: "Upgrade/downgrade Razorpay/Stripe subscriptions and update UPI mandate",
      allowedRoles: ["owner"],
      icon: CreditCard,
    },
    {
      key: "canManageStaff",
      label: "Staff Provisioning & RBAC Control",
      description: "Invite, suspend, and configure granular permissions for employees",
      allowedRoles: ["owner"],
      icon: Users,
    },
    {
      key: "canReplyWhatsAppLeads",
      label: "Respond to Incoming WhatsApp Leads",
      description: "Access CRM chat and close incoming inquiries directly",
      allowedRoles: ["owner", "manager"],
      icon: MessageCircle,
    },
    {
      key: "canDraftSocialPosts",
      label: "Trigger Daily Social Media Drafts",
      description: "Generate and publish AI promotional offers and daily specials",
      allowedRoles: ["owner", "manager"],
      icon: Sparkles,
    },
    {
      key: "canTriggerReviewQr",
      label: "Trigger Review Requests via QR Codes & SMS",
      description: "Hand customer review QR codes or send instant 5-star Google review SMS",
      allowedRoles: ["owner", "manager", "cashier"],
      icon: QrCode,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Pillar 2 Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                Pillar 2: Architecture & Security
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center gap-1">
                <Database className="w-3 h-3 text-blue-400" />
                Isolated DB Namespaces
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              True Multi-Tenant Database & Role-Based Access Control (RBAC)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Complete multi-tenant isolation guaranteeing zero cross-business data leaks. Enforces granular roles: <strong>Store Owner</strong>, <strong>Store Manager</strong>, and <strong>Cashier / Front Desk</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Active Workspaces</div>
              <div className="text-lg font-black text-emerald-400 font-mono">
                {tenants.length} Isolated DBs
              </div>
            </div>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-400/60 text-emerald-200 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{actionNotice}</span>
        </div>
      )}

      {/* Tenant Workspace Selector Strip */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              Select Isolated Multi-Tenant Workspace
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Each tenant has segregated CRM tables, reviews & API credentials
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {tenants.map((t) => {
            const isSelected = t.id === activeTenantId;
            return (
              <div
                key={t.id}
                onClick={() => setActiveTenantId(t.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-indigo-950/80 border-indigo-400 ring-2 ring-indigo-400/40 shadow-lg text-white"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black truncate">{t.businessName}</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                    {t.tier}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{t.category}</div>
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>DB: <code className="text-emerald-400">{t.isolatedDbNamespace}</code></span>
                  <span>{t.locationsCount} Loc</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role-Based Permissions (RBAC) Interactive Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Role Simulator Switcher & Active Tenant Stats */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Simulate Staff Role Experience
            </h3>
          </div>

          <p className="text-xs text-slate-300">
            Click below to switch the active session role and test permission enforcement in real-time:
          </p>

          <div className="space-y-2">
            {[
              {
                role: "owner" as StaffRole,
                title: "1. Store Owner",
                badge: "Full Admin",
                desc: "Full administrative access to revenue analytics, key settings, and billing.",
                color: "border-amber-400/60 bg-amber-950/30 text-amber-200",
              },
              {
                role: "manager" as StaffRole,
                title: "2. Store Manager",
                badge: "CRM & Marketing",
                desc: "Access restricted to responding to incoming WhatsApp leads and triggering daily social media drafts.",
                color: "border-blue-400/60 bg-blue-950/30 text-blue-200",
              },
              {
                role: "cashier" as StaffRole,
                title: "3. Cashier / Front Desk",
                badge: "QR Review Booster Only",
                desc: "Access restricted to triggering review requests via QR codes or SMS.",
                color: "border-emerald-400/60 bg-emerald-950/30 text-emerald-200",
              },
            ].map((r) => {
              const isActive = currentSimulatedRole === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => setCurrentSimulatedRole(r.role)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                    isActive
                      ? `${r.color} ring-2 ring-indigo-400/50 shadow-lg`
                      : "bg-slate-950/80 border-slate-800 hover:bg-slate-850 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">{r.title}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                      {r.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{r.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Active Workspace Metadata */}
          {activeTenant && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Isolated Database Context:</span>
              </div>
              <div className="font-mono text-[11px] text-emerald-400">{activeTenant.isolatedDbNamespace}</div>
              <div className="text-[11px] text-slate-400">Total Leads: <strong className="text-white">{activeTenant.totalCrmLeads}</strong> | Total Reviews: <strong className="text-white">{activeTenant.totalReviewsGenerated}</strong></div>
              {activeTenant.customDomain && (
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Globe2 className="w-3 h-3 text-cyan-400" />
                  <span>White-Label Domain: <strong className="text-cyan-300">{activeTenant.customDomain}</strong></span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center & Right: Live Permission Enforcement Matrix & Restricted Sandbox */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Live RBAC Permission Gate (Acting as: <span className="text-amber-300 uppercase">{currentSimulatedRole}</span>)
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Enforced by API Middleware
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {permissionsList.map((perm) => {
                const Icon = perm.icon;
                const isPermitted = perm.allowedRoles.includes(currentSimulatedRole);
                return (
                  <div
                    key={perm.key}
                    className={`p-3 rounded-xl border transition-all ${
                      isPermitted
                        ? "bg-slate-950/80 border-emerald-500/40"
                        : "bg-slate-950/40 border-red-500/30 opacity-70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${isPermitted ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-white">{perm.label}</span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isPermitted ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-red-500/20 text-red-300 border border-red-500/40"
                      }`}>
                        {isPermitted ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{isPermitted ? "ALLOWED" : "DENIED"}</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">{perm.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Staff Roster & Provisioning in Current Tenant */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Store Staff Roster ({activeTenant?.businessName})
                </h3>
              </div>
            </div>

            {/* Staff list */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(activeTenant as any)?.staff?.map((s: StaffMember) => (
                <div key={s.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow">
                    {s.avatarInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">{s.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{s.phone}</div>
                    <span className="inline-block mt-1 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 uppercase">
                      {s.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Staff Form */}
            <form onSubmit={handleAddStaff} className="pt-3 border-t border-slate-800/80 space-y-3">
              <div className="text-xs font-bold text-slate-300">Invite New Staff Member:</div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-400"
                />
                <input
                  type="email"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="Email"
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-400"
                />
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as StaffRole)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-400"
                >
                  <option value="manager">Store Manager</option>
                  <option value="cashier">Cashier / Front Desk</option>
                  <option value="owner">Store Owner</option>
                </select>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Assign Role</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
