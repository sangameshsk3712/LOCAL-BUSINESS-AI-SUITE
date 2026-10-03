import React, { useState } from "react";
import {
  Gift,
  Share2,
  Users,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  Building2,
  Award
} from "lucide-react";
import { ReferralProgramState, ReferralRecord } from "../types";

export default function InAppReferralEngine() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [claimNotice, setClaimNotice] = useState<string | null>(null);

  const [referralState, setReferralState] = useState<ReferralProgramState>({
    referralCode: "SK-ROYALSPICE-8431",
    referralLink: "https://lbs.app/invite/SK-ROYALSPICE-8431",
    totalEarningsInr: 1500, // 3 successful neighbors * ₹500
    totalFreeMonthsEarned: 2,
    activeReferralsCount: 3,
    referralHistory: [
      {
        id: "ref-1",
        invitedStoreName: "Green Leaf Organic Grocers",
        ownerContact: "+91 98450 11920",
        dateInvited: "2026-09-20",
        status: "subscribed",
        rewardClaimedInr: 500,
        freeMonthsGranted: 1,
      },
      {
        id: "ref-2",
        invitedStoreName: "Indiranagar Artisan Bakery",
        ownerContact: "+91 99002 44910",
        dateInvited: "2026-09-24",
        status: "subscribed",
        rewardClaimedInr: 500,
        freeMonthsGranted: 1,
      },
      {
        id: "ref-3",
        invitedStoreName: "Urban Glow Unisex Salon",
        ownerContact: "+91 98860 33812",
        dateInvited: "2026-09-28",
        status: "subscribed",
        rewardClaimedInr: 500,
        freeMonthsGranted: 0,
      },
      {
        id: "ref-4",
        invitedStoreName: "Cornerstone Fitness Studio",
        ownerContact: "+91 97410 88291",
        dateInvited: "2026-09-29",
        status: "pending",
        rewardClaimedInr: 0,
        freeMonthsGranted: 0,
      },
    ],
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralState.referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleApplyDiscount = () => {
    setClaimNotice(`₹${referralState.totalEarningsInr} credit applied directly to your next month's subscription bill!`);
    setTimeout(() => setClaimNotice(null), 5000);
  };

  const whatsappShareText = encodeURIComponent(
    `Hey neighbor! 👋 We have been using Local Business Suite to automate our store's 24/7 AI Voice calls, WhatsApp leads, and Google Maps rank #1. It brought us +40% footfall this month. Use my founder invite link to get ₹500 off your subscription or a 14-day free trial: ${referralState.referralLink}`
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border-2 border-emerald-500/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden ring-1 ring-emerald-400/30">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30 shrink-0">
              <Gift className="w-8 h-8 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Viral Referral Engine
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  ₹500 Off or 1 Free Month
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                In-App Neighbor Referral Program
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-3xl">
                Invite neighboring restaurants, retail stores, or salons in your commercial area. You both receive a ₹500 subscription discount or 1 full free month for every active business that subscribes!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={`https://wa.me/?text=${whatsappShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>Share on WhatsApp with Neighbors</span>
            </a>
          </div>
        </div>
      </div>

      {claimNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{claimNotice}</span>
        </div>
      )}

      {/* Rewards Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Referral Credits Earned</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            ₹{referralState.totalEarningsInr.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">Applicable on any subscription tier</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Free Months Unlocked</div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-300 font-mono">
            {referralState.totalFreeMonthsEarned} Months Free
          </div>
          <div className="text-[11px] text-slate-400">Automatically credited to your billing cycle</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Neighbor Stores</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
            {referralState.activeReferralsCount} Subscribed
          </div>
          <div className="text-[11px] text-slate-400">1 neighbor currently pending trial</div>
        </div>
      </div>

      {/* Share Link Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Share2 className="w-5 h-5 text-indigo-400" />
          <span>Your Unique Store Referral Link</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-indigo-300 flex items-center justify-between">
            <span className="truncate">{referralState.referralLink}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 ml-2 shrink-0">
              Code: {referralState.referralCode}
            </span>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0 hover:scale-105 active:scale-95"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? "Link Copied!" : "Copy Referral Link"}</span>
          </button>

          <button
            onClick={handleApplyDiscount}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0 hover:scale-105 active:scale-95"
          >
            <span>Apply ₹1,500 Discount to Next Bill</span>
          </button>
        </div>
      </div>

      {/* Referral History Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Invited Commercial Neighbors & Status</span>
          </h3>
          <span className="text-xs text-slate-400">
            {referralState.referralHistory.length} Total Invites Sent
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold">
                <th className="pb-3 px-3">Neighboring Business</th>
                <th className="pb-3 px-3">Contact</th>
                <th className="pb-3 px-3">Invite Date</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Reward Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {referralState.referralHistory.map((ref) => (
                <tr key={ref.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    <span>{ref.invitedStoreName}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">{ref.ownerContact}</td>
                  <td className="py-3 px-3 text-slate-400 font-mono">{ref.dateInvited}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                      ref.status === "subscribed"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    }`}>
                      {ref.status === "subscribed" ? "✓ SUBSCRIBED" : "PENDING TRIAL"}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                    {ref.status === "subscribed" ? `+₹${ref.rewardClaimedInr}` : "—"}
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
