import React, { useState } from "react";
import {
  Building2,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Users,
  Award,
  BadgeCheck,
  Download,
  Sliders,
  DollarSign,
  Printer
} from "lucide-react";
import { FranchiseChainContract } from "../types";

export default function RegionalFranchiseExpansion() {
  const [selectedStoresCount, setSelectedStoresCount] = useState<number>(10);
  const [operatorName, setOperatorName] = useState("Venkatesh Rao");
  const [brandName, setBrandName] = useState("Royal Spice Regional Franchise Group");
  const [operatorPhone, setOperatorPhone] = useState("8431107332");
  const [slaNotice, setSlaNotice] = useState<string | null>(null);

  // Active contracts pipeline
  const [contracts, setContracts] = useState<FranchiseChainContract[]>([
    {
      id: "fc-1",
      brandName: "Royal Spice Bistro & Stores",
      operatorName: "Venkatesh Rao (Regional Director)",
      operatorPhone: "+91 84311 07332",
      cityClusters: ["Bengaluru (Indiranagar, Koramangala, Whitefield, HSR, Jayanagar)"],
      storesCount: 8,
      basePricePerStoreInr: 4999,
      volumeDiscountPercent: 20,
      totalMonthlyContractInr: 31990,
      annualValueInr: 383880,
      contractStatus: "ACTIVE_SLA",
      brandGuardrailsSynced: true,
    },
    {
      id: "fc-2",
      brandName: "Chai Point Express Franchise Cluster",
      operatorName: "Anand Kulkarni",
      operatorPhone: "+91 98450 99281",
      cityClusters: ["Hyderabad (Hitec City, Gachibowli, Jubilee Hills, Banjara Hills)"],
      storesCount: 14,
      basePricePerStoreInr: 4999,
      volumeDiscountPercent: 25,
      totalMonthlyContractInr: 52490,
      annualValueInr: 629880,
      contractStatus: "ACTIVE_SLA",
      brandGuardrailsSynced: true,
    },
    {
      id: "fc-3",
      brandName: "Bliss Ayurvedic Spa & Salons",
      operatorName: "Sunita Menon",
      operatorPhone: "+91 97410 44920",
      cityClusters: ["Chennai & Kochi (6 Hubs)"],
      storesCount: 6,
      basePricePerStoreInr: 4999,
      volumeDiscountPercent: 15,
      totalMonthlyContractInr: 25490,
      annualValueInr: 305880,
      contractStatus: "PILOT_TRIAL",
      brandGuardrailsSynced: true,
    },
  ]);

  // Dynamic pricing calculation for 5-20 store operators
  const basePrice = 4999;
  const discountPercent = selectedStoresCount >= 15 ? 30 : selectedStoresCount >= 10 ? 25 : 15;
  const rawTotal = selectedStoresCount * basePrice;
  const discountedMonthly = Math.round(rawTotal * (1 - discountPercent / 100));
  const annualTotal = discountedMonthly * 12;

  const handleExportSla = () => {
    window.print();
    setSlaNotice(`Multi-Unit Enterprise Franchise Agreement for ${selectedStoresCount} locations prepared and exported.`);
    setTimeout(() => setSlaNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-amber-950/80 border-2 border-indigo-500/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden ring-1 ring-indigo-400/30">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-lg shadow-indigo-500/30 shrink-0">
              <Building2 className="w-8 h-8 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Regional Multi-Unit Expansion
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  5–20 Store Operators
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Regional Franchise Chains Expansion Portal
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-3xl">
                Close high-ACV enterprise contracts with multi-unit franchise operators running 5–20 retail stores or dining outlets. Scale your active store count rapidly with volume pricing discounts and centralized brand guardrails.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleExportSla}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 hover:from-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Printer className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>Export Multi-Store SLA Contract</span>
            </button>
          </div>
        </div>
      </div>

      {slaNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{slaNotice}</span>
        </div>
      )}

      {/* Dynamic 5-20 Store Contract Calculator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <span>Multi-Unit Operator Pricing Calculator (5–20 Stores)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Volume-tiered licensing structure designed to maximize upfront annual cash flow from regional operators.
            </p>
          </div>

          <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            {discountPercent}% Multi-Store Volume Savings
          </span>
        </div>

        {/* Store Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300">Select Number of Locations:</label>
            <span className="text-lg font-black text-indigo-300 font-mono">
              {selectedStoresCount} Storefronts
            </span>
          </div>

          <input
            type="range"
            min={5}
            max={20}
            step={1}
            value={selectedStoresCount}
            onChange={(e) => setSelectedStoresCount(Number(e.target.value))}
            className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>5 Stores (15% off)</span>
            <span>10 Stores (25% off)</span>
            <span>15 Stores (30% off)</span>
            <span>20 Stores (Enterprise)</span>
          </div>
        </div>

        {/* Financial Contract Output */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 font-bold uppercase">Discounted Monthly Retainer</div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              ₹{discountedMonthly.toLocaleString()} / mo
            </div>
            <div className="text-[10px] text-slate-500">
              Only ₹{(discountedMonthly / selectedStoresCount).toFixed(0)} / location / mo
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 font-bold uppercase">Annual Contract Value (ACV)</div>
            <div className="text-2xl font-black text-amber-300 font-mono">
              ₹{(annualTotal / 100000).toFixed(2)} Lakhs / yr
            </div>
            <div className="text-[10px] text-slate-500">
              Saved ₹{((rawTotal * 12 - annualTotal) / 1000).toFixed(0)}k in volume discount
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 font-bold uppercase">Dedicated SLA Guarantee</div>
            <div className="text-lg font-black text-white font-mono">99.9% Uptime SLA</div>
            <div className="text-[10px] text-emerald-400 font-bold">
              ✓ Direct WhatsApp line to Founder Sangamesh
            </div>
          </div>
        </div>
      </div>

      {/* Active Franchise Pipeline Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Active Regional Multi-Unit Contracts ({contracts.length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {contracts.reduce((a, c) => a + c.storesCount, 0)} Total Active Franchise Locations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold">
                <th className="pb-3 px-3">Franchise Brand</th>
                <th className="pb-3 px-3">Regional Director</th>
                <th className="pb-3 px-3">Locations Count</th>
                <th className="pb-3 px-3">Monthly Retainer</th>
                <th className="pb-3 px-3">Annual Run-Rate</th>
                <th className="pb-3 px-3">SLA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{c.brandName}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <div>{c.operatorName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{c.operatorPhone}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-black text-indigo-300">
                    {c.storesCount} Stores
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-200">
                    ₹{c.totalMonthlyContractInr.toLocaleString()} / mo
                  </td>
                  <td className="py-3 px-3 font-mono font-black text-emerald-400">
                    ₹{(c.annualValueInr / 100000).toFixed(2)}L / yr
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                      c.contractStatus === "ACTIVE_SLA"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    }`}>
                      {c.contractStatus === "ACTIVE_SLA" ? "✓ ACTIVE SLA" : "PILOT TRIAL"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
