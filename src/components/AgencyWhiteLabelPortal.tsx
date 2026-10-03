import React, { useState } from "react";
import {
  Layers,
  Globe2,
  DollarSign,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Sliders,
  Plus,
  Building2,
  Percent,
  Copy,
  Check
} from "lucide-react";
import { AgencyResellerState, AgencyClientStore } from "../types";

export default function AgencyWhiteLabelPortal() {
  const [agencyState, setAgencyState] = useState<AgencyResellerState>({
    agencyName: "Apex Growth Agency & Studios",
    contactEmail: "partners@apexgrowth.in",
    customDomain: "ai.apexgrowth.in",
    brandPrimaryColor: "#6366f1",
    revenueSharePercent: 30, // 30% recurring monthly rev-share
    totalMonthlyEarningsInr: 14997, // 30% of ₹49,990 client gross spend
    clients: [
      {
        id: "cli-1",
        storeName: "The Bistro Republic (3 Branches)",
        city: "Bengaluru",
        plan: "Pro Multi-Branch Plan",
        monthlySpendInr: 4999,
        agencyCommissionInr: 1500, // 30%
        status: "active",
      },
      {
        id: "cli-2",
        storeName: "Saffron Spices Fine Dining",
        city: "Hyderabad",
        plan: "Enterprise Franchise Tier",
        monthlySpendInr: 19999,
        agencyCommissionInr: 6000,
        status: "active",
      },
      {
        id: "cli-3",
        storeName: "Elegance Salon & Wellness Chain",
        city: "Mumbai",
        plan: "Enterprise Franchise Tier",
        monthlySpendInr: 19999,
        agencyCommissionInr: 6000,
        status: "active",
      },
      {
        id: "cli-4",
        storeName: "Craft Coffee Co.",
        city: "Pune",
        plan: "Basic Store Plan",
        monthlySpendInr: 1499,
        agencyCommissionInr: 450,
        status: "trial",
      },
    ],
  });

  const [isAddingClient, setIsAddingClient] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreCity, setNewStoreCity] = useState("Bengaluru");
  const [newStorePlan, setNewStorePlan] = useState("Pro Multi-Branch Plan");
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) return;

    const spend = newStorePlan.includes("Enterprise") ? 19999 : newStorePlan.includes("Pro") ? 4999 : 1499;
    const commission = Math.round(spend * 0.3);

    const newClient: AgencyClientStore = {
      id: `cli-${Date.now()}`,
      storeName: newStoreName.trim(),
      city: newStoreCity,
      plan: newStorePlan,
      monthlySpendInr: spend,
      agencyCommissionInr: commission,
      status: "active",
    };

    setAgencyState({
      ...agencyState,
      totalMonthlyEarningsInr: agencyState.totalMonthlyEarningsInr + commission,
      clients: [newClient, ...agencyState.clients],
    });

    setIsAddingClient(false);
    setNewStoreName("");
    setSaveNotice(`Client "${newStoreName}" successfully onboarded under your agency white-label domain.`);
    setTimeout(() => setSaveNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border-2 border-blue-500/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden ring-1 ring-blue-400/30">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  White-Label Reseller Portal
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  30% Recurring Rev-Share
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Agency & Freelancer Reseller Program
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-3xl">
                Digital marketing agencies and web design freelancers can white-label the Local Business Suite platform. Manage client stores under your own agency brand and domain on a 30% recurring monthly revenue-share model.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsAddingClient(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Onboard New Client Store</span>
            </button>
          </div>
        </div>
      </div>

      {saveNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* Agency Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Your Monthly Agency Rev-Share (30%)</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            ₹{agencyState.totalMonthlyEarningsInr.toLocaleString()} / mo
          </div>
          <div className="text-[11px] text-slate-400">Direct monthly bank payout to your agency</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Managed Client Stores</div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-300 font-mono">
            {agencyState.clients.length} Stores
          </div>
          <div className="text-[11px] text-slate-400">Across Bengaluru, Mumbai, Hyderabad, Pune</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">White-Label Custom Domain</div>
          <div className="text-lg font-black text-white font-mono truncate">
            {agencyState.customDomain}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SSL Live & Brand Identity Active</span>
          </div>
        </div>
      </div>

      {/* White-Label Customization Settings */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <span>Agency White-Label Branding Settings</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-400">Agency Brand Name:</label>
            <input
              type="text"
              value={agencyState.agencyName}
              onChange={(e) => setAgencyState({ ...agencyState, agencyName: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400">Custom Subdomain (CNAME):</label>
            <input
              type="text"
              value={agencyState.customDomain}
              onChange={(e) => setAgencyState({ ...agencyState, customDomain: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-indigo-300 font-mono text-xs outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400">Agency Support Email:</label>
            <input
              type="text"
              value={agencyState.contactEmail}
              onChange={(e) => setAgencyState({ ...agencyState, contactEmail: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Managed Client Stores Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>Managed Client Stores ({agencyState.clients.length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            30% Monthly Automatic Revenue Share
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold">
                <th className="pb-3 px-3">Client Store Name</th>
                <th className="pb-3 px-3">Location</th>
                <th className="pb-3 px-3">Subscribed Plan</th>
                <th className="pb-3 px-3">Monthly Client Bill</th>
                <th className="pb-3 px-3">Your Commission (30%)</th>
                <th className="pb-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {agencyState.clients.map((cli) => (
                <tr key={cli.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{cli.storeName}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{cli.city}</td>
                  <td className="py-3 px-3 text-indigo-300 font-medium">{cli.plan}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-200">
                    ₹{cli.monthlySpendInr.toLocaleString()} / mo
                  </td>
                  <td className="py-3 px-3 font-mono font-black text-emerald-400">
                    +₹{cli.agencyCommissionInr.toLocaleString()} / mo
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                      cli.status === "active"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    }`}>
                      {cli.status === "active" ? "ACTIVE" : "FREE TRIAL"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Client Modal */}
      {isAddingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form
            onSubmit={handleAddClient}
            className="bg-slate-900 border-2 border-indigo-500/60 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">Onboard Client Under White-Label Agency</h3>
              <button
                type="button"
                onClick={() => setIsAddingClient(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Client Store Name:</label>
              <input
                type="text"
                value={newStoreName}
                onChange={(e) => setNewStoreName(e.target.value)}
                placeholder="e.g. Saffron Bistro & Bar"
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Store City / Area:</label>
              <input
                type="text"
                value={newStoreCity}
                onChange={(e) => setNewStoreCity(e.target.value)}
                placeholder="e.g. Bengaluru"
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Subscription Plan:</label>
              <select
                value={newStorePlan}
                onChange={(e) => setNewStorePlan(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
              >
                <option value="Basic Store Plan">Basic Store Plan (₹1,499/mo - You earn ₹450/mo)</option>
                <option value="Pro Multi-Branch Plan">Pro Multi-Branch Plan (₹4,999/mo - You earn ₹1,500/mo)</option>
                <option value="Enterprise Franchise Tier">Enterprise Franchise Tier (₹19,999/mo - You earn ₹6,000/mo)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingClient(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/30"
              >
                <span>Complete Onboarding & Generate Client Access</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
