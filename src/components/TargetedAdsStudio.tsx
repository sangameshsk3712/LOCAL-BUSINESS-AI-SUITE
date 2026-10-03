import React, { useState } from "react";
import {
  Share2,
  Video,
  PhoneCall,
  PhoneOff,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  Copy,
  Check,
  Download,
  Eye,
  Layers,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { AdCampaignCreative } from "../types";

export default function TargetedAdsStudio() {
  const [selectedCreativeId, setSelectedCreativeId] = useState<string>("ad-unified");
  const [copiedText, setCopiedText] = useState(false);
  const [campaignNotice, setCampaignNotice] = useState<string | null>(null);

  const unifiedProfile = (() => {
    try {
      const p = localStorage.getItem("lbs_unified_business_profile");
      if (p) return JSON.parse(p);
    } catch {}
    return {
      businessName: "Artisan Roast Cafe",
      category: "Specialty Cafe & Bakery",
      city: "Bengaluru",
      locality: "Indiranagar",
      phone: "+91 8431107332",
      offerOrDiscount: "Flat 20% off breakfast combo",
      uniqueSellingPoint: "100% wild-fermented organic sourdough & freshly roasted Arabica",
    };
  })();

  const creatives: AdCampaignCreative[] = [
    {
      id: "ad-unified",
      platform: "Meta (Instagram/FB)",
      title: `${unifiedProfile.businessName} - Master Geo-Ad (From Unified Profile)`,
      targetAudience: `Shoppers & residents in ${unifiedProfile.locality || "local area"}, ${unifiedProfile.city || "city"} within 3km`,
      comparisonHook: {
        leftLabel: "Old Generic Advertising",
        leftCost: "₹18,000 / month wasted on broad non-local clicks",
        leftTone: "Zero footfall conversion, people outside your neighborhood clicking.",
        rightLabel: `With ${unifiedProfile.businessName} Unified Geo-Ad`,
        rightGain: "+4.8x Walk-in Footfall & High Intent",
        rightTone: `Hyper-targeted 3km geo-fence delivering ${unifiedProfile.offerOrDiscount} directly to local WhatsApp phones.`,
      },
      headlineText: `Craving authentic ${unifiedProfile.category} in ${unifiedProfile.locality || "your neighborhood"}? ${unifiedProfile.offerOrDiscount}!`,
      primaryBody: `${unifiedProfile.uniqueSellingPoint}. Drop by ${unifiedProfile.businessName} today at ${unifiedProfile.locality}, ${unifiedProfile.city}. Tap below to claim your VIP WhatsApp coupon or call ${unifiedProfile.phone}.`,
      callToAction: "Claim 20% WhatsApp Voucher",
      estimatedRoas: "6.8x Target ROAS",
      budgetPerDayInr: 650,
    },
    {
      id: "ad-1",
      platform: "Meta (Instagram/FB)",
      title: "Lost Phone Calls vs. 24/7 AI Voice Receptionist",
      targetAudience: "Small Business Owners, Restaurant Owners, Retail Managers (Radius: 10km)",
      comparisonHook: {
        leftLabel: "Traditional Store (Unanswered Calls)",
        leftCost: "-₹45,000 / month Lost Revenue",
        leftTone: "Staff busy at counter, phone rings 7 times, customer hangs up and calls your competitor.",
        rightLabel: "With Local Business Suite AI Receptionist",
        rightGain: "+100% Calls Picked Up on 1st Ring",
        rightTone: "24/7 polite conversational AI reserves tables, takes orders, and captures caller WhatsApp leads automatically.",
      },
      headlineText: "Stop Losing ₹45,000/mo to Missed Calls. Switch to 24/7 AI Reception in 5 Minutes.",
      primaryBody: "Your staff is busy serving customers at the counter. Meanwhile, 3 customers called to book tables or check prices — and walked into your competitor's store instead.\n\nLocal Business Suite gives your storefront a 24/7 conversational AI Voice Receptionist that answers instantly on your store phone number, speaks natural fluent Hindi/English, and logs bookings straight into your WhatsApp.\n\nTry it free today or call Founder Sangamesh at 8431107332 for an instant 2-minute live demo.",
      callToAction: "Book Free Store Demo",
      estimatedRoas: "5.4x Target ROAS",
      budgetPerDayInr: 800,
    },
    {
      id: "ad-2",
      platform: "Google Local Ads",
      title: "Rank #14 vs. Rank #1 on Google Maps Geo-Grid",
      targetAudience: "Local store owners searching 'how to get more footfall', 'local SEO agency', 'GMB rank boost'",
      comparisonHook: {
        leftLabel: "Before: Stuck on Google Maps Rank #14",
        leftCost: "Hidden past page 1 — Zero footfall from nearby tourists or residents.",
        leftTone: "Zero automated reviews, outdated hours, no local search dominance.",
        rightLabel: "After: Rank #1-3 across entire 5km Neighborhood GPS Grid",
        rightGain: "+42% Physical In-Store Footfall",
        rightTone: "Automated daily WhatsApp review triggers with QR codes, instant SEO keyword injection.",
      },
      headlineText: "Watch Your Store Jump From #14 to #2 on Google Maps in 30 Days.",
      primaryBody: "When people nearby search for your cuisine or services on Google Maps, do you show up in the top 3? If you're ranked #7 or lower, 85% of nearby shoppers never see your store.\n\nLocal Business Suite gives you a 5x5 Geo-Grid Radar and automated QR review boosters that shoot your store to the top of Google Maps within 30 days.\n\nScan your store free today!",
      callToAction: "Run Free 5x5 Scan",
      estimatedRoas: "6.2x Target ROAS",
      budgetPerDayInr: 1200,
    },
    {
      id: "ad-3",
      platform: "YouTube Shorts",
      title: "Manual Typing vs. 10-Second Store Music & Social AI",
      targetAudience: "Salons, Boutiques, Artisan Cafes, Franchise Stores",
      comparisonHook: {
        leftLabel: "Without AI",
        leftCost: "2 Hours wasted daily making social graphics and paying music licensing fines.",
        leftTone: "Copyright strikes for store music, erratic social posting.",
        rightLabel: "With Local Business Suite",
        rightGain: "1-Click Daily Content & Royalty-Free Ambient Music",
        rightTone: "Gemini AI crafts daily promotional posts; Lyria AI generates custom storefront ambient audio.",
      },
      headlineText: "Run Your Entire Store Marketing in 60 Seconds Every Morning.",
      primaryBody: "Automate your daily WhatsApp broadcasts, promotional social posts, and royalty-free store music with zero effort. Built specifically for local entrepreneurs.\n\nPlans start at just ₹1,499/mo.",
      callToAction: "Start 14-Day Trial",
      estimatedRoas: "4.1x Target ROAS",
      budgetPerDayInr: 600,
    },
  ];

  const activeCreative = creatives.find((c) => c.id === selectedCreativeId) || creatives[0];

  const handleCopyAdCopy = () => {
    navigator.clipboard.writeText(
      `HEADLINE: ${activeCreative.headlineText}\n\nPRIMARY TEXT:\n${activeCreative.primaryBody}\n\nCTA: ${activeCreative.callToAction}`
    );
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  const handleExportCampaign = () => {
    setCampaignNotice(`Ad Campaign "${activeCreative.title}" prepared for Meta Ads Manager / Google Ads export. Budget: ₹${activeCreative.budgetPerDayInr}/day.`);
    setTimeout(() => setCampaignNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border-2 border-purple-500/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden ring-1 ring-purple-400/30">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 shrink-0">
              <Video className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Targeted Ad Campaign Engine
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeCreative.estimatedRoas}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Targeted Meta & Google Ads: Side-by-Side Visual Comparison
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-3xl">
                Localized video and carousel ad creatives tailored for small business owners within 5–15km. Showcases visual side-by-side comparisons: <em>"Unanswered Customer Phone Calls vs. 24/7 AI Voice Reception"</em> to drive high-intent store conversions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleExportCampaign}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Target className="w-4 h-4" />
              <span>Launch Campaign on Meta Ads</span>
            </button>
          </div>
        </div>
      </div>

      {campaignNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{campaignNotice}</span>
        </div>
      )}

      {/* Select Campaign Creative Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {creatives.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCreativeId(c.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
              selectedCreativeId === c.id
                ? "bg-purple-600 text-white border-purple-400 shadow-md ring-1 ring-purple-300"
                : "bg-slate-900/90 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-850"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{c.title}</span>
            <span className="text-[10px] opacity-75 font-mono">({c.platform})</span>
          </button>
        ))}
      </div>

      {/* Side-by-Side Visual Comparison Creative Mockup */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
              {activeCreative.platform} • Local Geo-Fenced Audience (5-15km)
            </span>
            <h3 className="text-lg font-black text-white mt-0.5">{activeCreative.title}</h3>
            <p className="text-xs text-slate-400">Targeting: {activeCreative.targetAudience}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Budget: ₹{activeCreative.budgetPerDayInr}/day</span>
            <button
              onClick={handleCopyAdCopy}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
              <span>{copiedText ? "Copied Ad Script" : "Copy Ad Copy"}</span>
            </button>
          </div>
        </div>

        {/* The Core Side-by-Side Comparison Creative Canvas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Side: Problem / Lost Revenue */}
          <div className="rounded-2xl p-5 bg-gradient-to-b from-rose-950/60 to-slate-950 border-2 border-rose-500/40 relative overflow-hidden space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <PhoneOff className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                  {activeCreative.comparisonHook.leftLabel}
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                BEFORE
              </span>
            </div>

            <div className="text-2xl font-black text-rose-400 font-mono">
              {activeCreative.comparisonHook.leftCost}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              "{activeCreative.comparisonHook.leftTone}"
            </p>

            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/20 text-[11px] text-rose-200/90 space-y-1">
              <div className="font-bold flex items-center gap-1 text-rose-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>The Store Problem:</span>
              </div>
              <div>Staff cannot attend calls during peak rush hours. 65% of potential customers never call back.</div>
            </div>
          </div>

          {/* Right Side: Solution / 24/7 AI Voice Reception */}
          <div className="rounded-2xl p-5 bg-gradient-to-b from-emerald-950/60 to-slate-950 border-2 border-emerald-500/60 relative overflow-hidden space-y-3 shadow-xl ring-2 ring-emerald-400/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  {activeCreative.comparisonHook.rightLabel}
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                WITH YOUR APP
              </span>
            </div>

            <div className="text-2xl font-black text-emerald-400 font-mono">
              {activeCreative.comparisonHook.rightGain}
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              "{activeCreative.comparisonHook.rightTone}"
            </p>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-200/90 space-y-1">
              <div className="font-bold flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>The AI Superpower:</span>
              </div>
              <div>Answers immediately in human-like voice, speaks multiple languages, answers pricing & syncs to WhatsApp CRM.</div>
            </div>
          </div>
        </div>

        {/* Ad Copy Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Ready-to-Run Primary Ad Text (Meta / Instagram Format):
          </div>
          <div className="text-sm font-bold text-white">{activeCreative.headlineText}</div>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
            {activeCreative.primaryBody}
          </p>
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] font-mono text-purple-300 font-bold">
              CTA Button: [{activeCreative.callToAction}]
            </span>
            <span className="text-[11px] text-slate-500">
              Founder Direct Line: 8431107332
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
