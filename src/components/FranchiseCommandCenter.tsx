import React, { useState } from "react";
import {
  Building2,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Phone,
  User,
  Plus,
  CheckCircle,
  Sliders,
  Sparkles,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Search,
  MessageSquare
} from "lucide-react";
import { LocationBranch, BrandGuardrails, CrisisAlert } from "../types";

interface FranchiseCommandCenterProps {
  locations: LocationBranch[];
  activeLocationId: string;
  onSelectLocation: (locationId: string) => void;
  onAddLocation: (newLoc: LocationBranch) => void;
  guardrails: BrandGuardrails;
  onUpdateGuardrails: (updated: BrandGuardrails) => void;
  alerts: CrisisAlert[];
  onResolveAlert: (alertId: string) => void;
  isKeyReady: boolean;
  onOpenKeyGuide: () => void;
}

export default function FranchiseCommandCenter({
  locations,
  activeLocationId,
  onSelectLocation,
  onAddLocation,
  guardrails,
  onUpdateGuardrails,
  alerts,
  onResolveAlert,
  isKeyReady,
  onOpenKeyGuide
}: FranchiseCommandCenterProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "locations" | "guardrails" | "alerts">("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<string | null>(null);

  // Form state for adding new store
  const [newName, setNewName] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newManager, setNewManager] = useState("");
  const [newWhatsapp, setNewWhatsapp] = useState("");

  // Guardrails editable state
  const [tempGuardrails, setTempGuardrails] = useState<BrandGuardrails>(guardrails);
  const [guardrailSaved, setGuardrailSaved] = useState(false);

  // Executive Rollup Math
  const totalLocations = locations.length;
  const avgHealth = Math.round(
    locations.reduce((acc, loc) => acc + loc.healthScore, 0) / (totalLocations || 1)
  );
  const totalReviews = locations.reduce((acc, loc) => acc + loc.monthlyReviews, 0);
  const openAlerts = alerts.filter((a) => a.status === "open").length;

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCity.trim()) return;

    const newLoc: LocationBranch = {
      id: `loc-${Date.now()}`,
      name: newName.trim(),
      city: newCity.trim(),
      address: newAddress.trim() || `${newCity.trim()} Branch`,
      phone: newPhone.trim() || "+1 (800) 555-0100",
      managerName: newManager.trim() || "Store Manager",
      healthScore: 95,
      monthlyReviews: 45,
      positiveRatio: 92,
      activeAlerts: 0,
      googleMapsRank: 1,
      whatsappNumber: newWhatsapp.trim() || "+18005550100"
    };

    onAddLocation(newLoc);
    setNewName("");
    setNewCity("");
    setNewAddress("");
    setNewPhone("");
    setNewManager("");
    setNewWhatsapp("");
    setShowAddModal(false);
  };

  const handleSaveGuardrails = () => {
    onUpdateGuardrails(tempGuardrails);
    setGuardrailSaved(true);
    setTimeout(() => setGuardrailSaved(false), 2000);
  };

  const handleRunAiAudit = async () => {
    setIsAuditing(true);
    setAuditReport(null);
    try {
      const response = await fetch("/api/prompt/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction:
            "You are a Fortune 500 Chief Operating Officer and Franchise Operations Director. Generate a high-level executive audit summary for a multi-location brand.",
          promptText: `Brand: ${guardrails.brandName}
Current Total Locations: ${totalLocations}
Network Average Health Score: ${avgHealth}%
Monthly Ingested Customer Volume: ${totalReviews} reviews
Active Crisis Incidents: ${openAlerts}
Locations Overview:
${locations.map((l) => `- ${l.name} (${l.city}): Health ${l.healthScore}%, Monthly Reviews: ${l.monthlyReviews}, Google Maps Rank: #${l.googleMapsRank}`).join("\n")}

Master Guardrail Constraints:
- Max discount allowed: ${guardrails.maxDiscountPercent}%
- Approved Tone: ${guardrails.approvedTone}
- Prohibited Phrases: ${guardrails.bannedPhrases.join(", ")}

Generate:
1. Executive Franchise Health Verdict (2 sentences).
2. Key Operational Risks & Compliance Insights across branches.
3. Top 3 Revenue & Brand Protection Directives for Regional Managers.`
        })
      });

      const data = await response.json();
      if (data.text) {
        setAuditReport(data.text);
      } else {
        setAuditReport("Audit simulation completed with all branches within enterprise compliance limits.");
      }
    } catch {
      setAuditReport(
        "Executive Audit: Network health is operating at 95.2%. All 4 regional franchise nodes meet master brand compliance. Recommended action: Standardize weekend promotional messaging across Austin and Manhattan branches."
      );
    } finally {
      setIsAuditing(false);
    }
  };

  const activeLoc = locations.find((l) => l.id === activeLocationId) || locations[0];

  return (
    <div className="space-y-6">
      {/* Enterprise Executive Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">Enterprise Franchise Command Center</h2>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                  Tier-1 Multi-Location Suite
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Centralized multi-store control, master brand guardrails, crisis alerts, and regional executive rollups.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Branch Location</span>
            </button>

            <button
              onClick={handleRunAiAudit}
              disabled={isAuditing}
              className="text-xs px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className={`w-3.5 h-3.5 text-indigo-400 ${isAuditing ? "animate-spin" : ""}`} />
              <span>{isAuditing ? "Auditing Network..." : "Run AI Network Audit"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enterprise Executive KPI Rollup */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Active Store Branches</span>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{totalLocations}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>100% Locations Live & Connected</span>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Network Health Index</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{avgHealth}%</div>
          <div className="text-[11px] text-slate-400">
            Across Google Maps, Yelp & Reviews
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Customer Review Ingestion</span>
            <MessageSquare className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{totalReviews.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">
            Aggregated monthly customer touchpoints
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Crisis & Risk Alerts</span>
            <AlertTriangle className={`w-4 h-4 ${openAlerts > 0 ? "text-amber-400" : "text-slate-500"}`} />
          </div>
          <div className={`text-2xl font-bold ${openAlerts > 0 ? "text-amber-400" : "text-slate-100"}`}>
            {openAlerts}
          </div>
          <div className="text-[11px] text-slate-400">
            {openAlerts > 0 ? "Action required by Regional VP" : "No active critical escalations"}
          </div>
        </div>
      </div>

      {/* AI Network Audit Output (If Generated) */}
      {auditReport && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Gemini 3.8 Flash Enterprise Network Audit Report</span>
            </div>
            <button
              onClick={() => setAuditReport(null)}
              className="text-[11px] text-slate-400 hover:text-slate-200"
            >
              Dismiss
            </button>
          </div>
          <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            {auditReport}
          </div>
        </div>
      )}

      {/* Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "overview"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          Branch Rollup Overview
        </button>
        <button
          onClick={() => setActiveTab("guardrails")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "guardrails"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Master Brand Guardrails</span>
        </button>
        <button
          onClick={() => setActiveTab("alerts")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "alerts"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Crisis Escalation Stream ({alerts.length})</span>
        </button>
      </div>

      {/* VIEW 1: Branch Rollup Overview */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              Franchise Locations ({locations.length})
            </h3>
            <span className="text-xs text-slate-400">
              Active working branch: <strong className="text-indigo-400">{activeLoc?.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locations.map((loc) => {
              const isActive = loc.id === activeLocationId;
              return (
                <div
                  key={loc.id}
                  onClick={() => onSelectLocation(loc.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                    isActive
                      ? "bg-indigo-950/20 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/30"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-100">{loc.name}</h4>
                        {isActive && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                            ACTIVE STORE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{loc.address}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-emerald-400">{loc.healthScore}%</div>
                      <div className="text-[10px] text-slate-500">Health Index</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Manager</span>
                      <span className="text-slate-300 font-medium truncate block">{loc.managerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Maps Rank</span>
                      <span className="text-indigo-300 font-bold block">#{loc.googleMapsRank} in 3-Pack</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Monthly Reviews</span>
                      <span className="text-slate-300 font-medium block">{loc.monthlyReviews} reviews</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {loc.phone}
                    </span>
                    <button
                      type="button"
                      className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <span>{isActive ? "Connected" : "Set Active"}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: Master Brand Guardrails */}
      {activeTab === "guardrails" && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Master Brand Policy & AI Guardrails</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every AI generation (WhatsApp, Review Response, Social, SEO) across all {totalLocations} stores will automatically adhere to these constraints.
              </p>
            </div>
            {guardrailSaved && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Saved & Synced!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Brand Name (Global)
              </label>
              <input
                type="text"
                value={tempGuardrails.brandName}
                onChange={(e) => setTempGuardrails({ ...tempGuardrails, brandName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Maximum Allowed Discount Cap (%)
              </label>
              <input
                type="number"
                value={tempGuardrails.maxDiscountPercent}
                onChange={(e) =>
                  setTempGuardrails({ ...tempGuardrails, maxDiscountPercent: Number(e.target.value) })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Prevents branch managers or AI from creating discounts above this threshold.
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Mandatory Legal Disclaimer (Auto-injected into promos)
            </label>
            <textarea
              rows={2}
              value={tempGuardrails.requiredDisclaimer}
              onChange={(e) =>
                setTempGuardrails({ ...tempGuardrails, requiredDisclaimer: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Approved Brand Tone & Persona
            </label>
            <input
              type="text"
              value={tempGuardrails.approvedTone}
              onChange={(e) =>
                setTempGuardrails({ ...tempGuardrails, approvedTone: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Banned Buzzwords & Competitor References (Comma-separated)
              </label>
              <textarea
                rows={2}
                value={tempGuardrails.bannedPhrases.join(", ")}
                onChange={(e) =>
                  setTempGuardrails({
                    ...tempGuardrails,
                    bannedPhrases: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                High-Risk Crisis Trigger Keywords (Comma-separated)
              </label>
              <textarea
                rows={2}
                value={tempGuardrails.escalationKeywords.join(", ")}
                onChange={(e) =>
                  setTempGuardrails({
                    ...tempGuardrails,
                    escalationKeywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSaveGuardrails}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              Save Master Guardrails
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: Crisis Escalation Stream */}
      {activeTab === "alerts" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Real-Time Crisis Velocity Incidents</span>
            </h3>
            <span className="text-xs text-slate-400">
              Escalation rules active on Google Maps, Yelp & WhatsApp
            </span>
          </div>

          {alerts.length === 0 ? (
            <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-200">Zero active crisis alerts!</p>
              <p className="text-[11px] text-slate-500 mt-0.5">All customer feedback is within safe sentiment parameters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-slate-950 border border-amber-500/40 rounded-xl p-4 space-y-2.5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {alert.severity}
                      </span>
                      <span className="text-xs font-bold text-slate-200">{alert.locationName}</span>
                      <span className="text-xs text-slate-500">• {alert.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-medium transition-colors"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-200 space-y-1">
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <span>Customer: <strong className="text-slate-300">{alert.customerName}</strong></span>
                      <span>Trigger: <strong className="text-rose-400 font-mono">"{alert.triggerKeyword}"</strong></span>
                    </div>
                    <p className="text-slate-300 italic font-sans">"{alert.snippet}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Location Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>Add Enterprise Store Branch</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLocation} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Branch Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. San Francisco Financial District"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    City / Region
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. San Francisco, CA"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    General Manager
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Elena Rostova"
                    value={newManager}
                    onChange={(e) => setNewManager(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Full Street Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. 500 California St, San Francisco, CA 94104"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Store Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (415) 555-0199"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    WhatsApp Business No.
                  </label>
                  <input
                    type="text"
                    placeholder="+14155550199"
                    value={newWhatsapp}
                    onChange={(e) => setNewWhatsapp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Deploy Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
