import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  Crown,
  Sparkles,
  Megaphone,
  X,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Store,
  CreditCard,
  Truck,
  Phone,
  QrCode,
  Copy,
  Check,
  MessageCircle,
  BadgeCheck,
  Send,
  Eye
} from "lucide-react";

interface AdBannerProps {
  isProUser: boolean;
  onUpgradeClick: () => void;
  variant?: "banner" | "card" | "sidebar";
}

interface SponsoredAd {
  id: string;
  sponsorName: string;
  tagline: string;
  ctaText: string;
  badge: string;
  icon: typeof Store;
  link: string;
  description: string;
}

const SPONSORED_ADS: SponsoredAd[] = [
  {
    id: "ad-1",
    sponsorName: "Razorpay POS & Smart Soundbox",
    tagline: "Accept All UPI & Cards at 0% Setup Cost for Local Stores",
    description: "Accept instant payments with audio alert confirmation in Hindi, English, Kannada & 8 languages.",
    ctaText: "Get Soundbox Free",
    badge: "Official Payment Partner",
    icon: CreditCard,
    link: "https://razorpay.com/pos/"
  },
  {
    id: "ad-2",
    sponsorName: "Zoho Books for Retail & Bakeries",
    tagline: "GST-Ready Invoicing, Billing & Inventory Management",
    description: "Automate your daily store accounting and GST returns in under 5 minutes.",
    ctaText: "Start Free Trial",
    badge: "Featured Business Tool",
    icon: Store,
    link: "https://www.zoho.com/books/"
  },
  {
    id: "ad-3",
    sponsorName: "Shiprocket Quick Hyperlocal Delivery",
    tagline: "Same-Day City Delivery for Bakeries, Cafes & Retail Brands",
    description: "Deliver orders to local customers within 60 minutes across India.",
    ctaText: "Deliver in 60 Mins",
    badge: "Logistics Partner",
    icon: Truck,
    link: "https://www.shiprocket.in/hyperlocal/"
  }
];

export default function AdBanner({ isProUser, onUpgradeClick, variant = "banner" }: AdBannerProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showAdvertiseModal, setShowAdvertiseModal] = useState(false);
  const [adPlan, setAdPlan] = useState<"weekly" | "monthly" | "quarterly">("monthly");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  
  // Advertiser Input Form
  const [adBrandName, setAdBrandName] = useState("");
  const [adTagline, setAdTagline] = useState("");
  const [adWebsite, setAdWebsite] = useState("");
  const [adUpiRef, setAdUpiRef] = useState("");
  const [adSubmitted, setAdSubmitted] = useState(false);

  const famPayNumber = "8867605076";
  const upiId = "8867605076@fam";
  const founderPhone = "8431107332";

  const adPackages = {
    weekly: { name: "Weekly Spotlight", price: 199, period: "7 Days" },
    monthly: { name: "Monthly Featured Banner", price: 499, period: "30 Days" },
    quarterly: { name: "Quarterly Growth Partner", price: 999, period: "90 Days" }
  };

  const currentPkg = adPackages[adPlan];
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=Sangamesh%20Khatge&am=${currentPkg.price}&cu=INR&tn=AppSponsorAd_${adPlan}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=8&data=${encodeURIComponent(upiDeepLink)}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % SPONSORED_ADS.length);
    }, 12000); // Rotate ad every 12 seconds
    return () => clearInterval(timer);
  }, []);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(famPayNumber);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdSubmitted(true);
    const message = `Hello Sangamesh Sir, I am an Advertiser and I have transferred ₹${currentPkg.price} to your FamPay account (8867605076) for ${currentPkg.name}!\n\nBrand: ${adBrandName || "N/A"}\nTagline: ${adTagline || "N/A"}\nLink: ${adWebsite || "N/A"}\nUPI Ref / UTR: ${adUpiRef || "Pending Verification"}\n\nPlease review and publish my ad!`;
    const waUrl = `https://wa.me/91${founderPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  // If user is a verified Pro / Premium subscriber, do not show ads!
  if (isProUser) {
    return (
      <div className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="font-extrabold">✨ Ads-Free VIP Experience Active</span>
          <span className="text-slate-400 hidden sm:inline">• Thank you for supporting Founder Sangamesh Khatge!</span>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
          PRO SUBSCRIBER
        </span>
      </div>
    );
  }

  const ad = SPONSORED_ADS[currentAdIndex];
  const Icon = ad.icon;

  if (variant === "card") {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-indigo-400">
            <Megaphone className="w-3 h-3" />
            <span>Sponsored Ad</span>
          </div>
          <button
            onClick={onUpgradeClick}
            className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <Crown className="w-3 h-3" />
            <span>Remove Ads (₹299)</span>
          </button>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white leading-tight">{ad.sponsorName}</h4>
            <p className="text-[11px] text-slate-300">{ad.tagline}</p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <a
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>{ad.ctaText}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => setShowAdvertiseModal(true)}
            className="text-[10px] text-emerald-400 font-bold hover:underline"
          >
            Put Your Ad (Pay FamPay: ₹199)
          </button>
        </div>
      </div>
    );
  }

  // Full-width Banner variant with prominent "Put Your Ad" Callout
  return (
    <>
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/40 rounded-2xl p-3 sm:p-4 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 shadow-sm">
              <Icon className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {ad.badge}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {ad.sponsorName}
                </h4>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                {ad.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {/* Click Sponsor link */}
            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
            >
              <span>{ad.ctaText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Put Your Ad Button for Advertisers */}
            <button
              onClick={() => setShowAdvertiseModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
              title="Want to show your ad here? Transfer money to FamPay!"
            >
              <Megaphone className="w-3.5 h-3.5 fill-slate-950" />
              <span>Put Your Ad Here (Transfer to FamPay)</span>
            </button>

            {/* Remove Ads button for users */}
            <button
              onClick={onUpgradeClick}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Upgrade to Pro to remove all advertisements"
            >
              <Crown className="w-3.5 h-3.5 fill-amber-300" />
              <span>Remove Ads (₹299)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ADVERTISER FAMPAY DIRECT TRANSFER & BOOKING PORTAL MODAL */}
      {/* ============================================================ */}
      {showAdvertiseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl relative space-y-5 my-6">
            <button
              onClick={() => setShowAdvertiseModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider">
                  Direct Advertiser Revenue Gateway
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-indigo-400" />
                  <span>10,000+ Business Impressions</span>
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Put Your Ad on This App • Transfer to FamPay
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Every advertiser transfers payment directly to Founder <strong>Sangamesh Khatge</strong> via FamPay ({famPayNumber}).
              </p>
            </div>

            {/* Ad Package Selection */}
            <div>
              <span className="text-xs font-bold text-slate-300 block mb-2">
                Step 1: Select Your Advertising Package
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(Object.keys(adPackages) as Array<keyof typeof adPackages>).map((key) => {
                  const pkg = adPackages[key];
                  const isSelected = adPlan === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setAdPlan(key)}
                      className={`p-3.5 rounded-2xl cursor-pointer border-2 transition-all ${
                        isSelected
                          ? "bg-slate-800/90 border-emerald-400 shadow-lg shadow-emerald-500/10 scale-[1.02]"
                          : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">{pkg.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-xl font-black text-emerald-400">₹{pkg.price}</span>
                        <span className="text-[11px] text-slate-400">/ {pkg.period}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FamPay Payment Gateway Details */}
            <div className="p-4 sm:p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Step 2: Transfer ₹{currentPkg.price} to FamPay</span>
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Amount: ₹{currentPkg.price}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* QR Code */}
                <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                  <div className="bg-white p-2 rounded-xl shadow-md">
                    <img
                      src={qrCodeUrl}
                      alt={`FamPay QR for ₹${currentPkg.price}`}
                      className="w-32 h-32 sm:w-36 sm:h-36 rounded-md object-contain"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 font-medium">
                    Scan with FamPay, GPay or PhonePe
                  </span>
                </div>

                {/* Account Details & Direct Pay */}
                <div className="sm:col-span-7 space-y-2.5">
                  {/* FamPay Number Box */}
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">FamPay Number</span>
                      <span className="text-sm font-black text-white font-mono">{famPayNumber}</span>
                      <span className="text-[11px] text-emerald-400 ml-2 font-semibold">Sangamesh Khatge</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                    >
                      {copiedPhone ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPhone ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  {/* FamPay UPI ID Box */}
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">FamPay UPI ID</span>
                      <span className="text-sm font-black text-amber-300 font-mono">{upiId}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                    >
                      {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedUpi ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  {/* Direct Mobile UPI Pay */}
                  <a
                    href={upiDeepLink}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all text-center block"
                  >
                    <span>Pay ₹{currentPkg.price} via FamPay / UPI App ↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Step 3: Enter Ad Creative & Transfer Verification */}
            <form onSubmit={handleAdSubmit} className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">
                Step 3: Enter Your Ad Details & Submit to Sangamesh
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Your Business / Brand Name *"
                  value={adBrandName}
                  onChange={(e) => setAdBrandName(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />

                <input
                  type="text"
                  required
                  placeholder="Ad Headline / Offer Tagline *"
                  value={adTagline}
                  onChange={(e) => setAdTagline(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="url"
                  placeholder="Website or WhatsApp Link (e.g. https://...)"
                  value={adWebsite}
                  onChange={(e) => setAdWebsite(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />

                <input
                  type="text"
                  required
                  placeholder="FamPay / UPI UTR / Reference No. *"
                  value={adUpiRef}
                  onChange={(e) => setAdUpiRef(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4 fill-slate-950" />
                  <span>Submit Ad & Send Receipt to Sangamesh (WhatsApp)</span>
                </button>

                <a
                  href={`tel:${founderPhone}`}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call: {founderPhone}</span>
                </a>
              </div>
            </form>

            {adSubmitted && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-200">
                🎉 Ad details submitted! WhatsApp chat opened to verify your FamPay transfer with Founder Sangamesh Khatge.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
