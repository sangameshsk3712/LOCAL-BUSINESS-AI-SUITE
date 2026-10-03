import React, { useState, useEffect } from "react";
import {
  Crown,
  Check,
  Zap,
  ShieldCheck,
  Copy,
  QrCode,
  ArrowRight,
  Sparkles,
  Phone,
  MessageCircle,
  Building2,
  Mic,
  Crosshair,
  BadgeCheck,
  CreditCard,
  CheckCircle2,
  TrendingUp,
  Globe2,
  Music,
  Radio,
  BarChart3,
  Layers,
  ChevronDown,
  ChevronUp,
  Star,
  Flame,
  HelpCircle,
  Lock,
  Unlock,
  Key,
  AlertTriangle,
  RefreshCw,
  Send,
  X,
  ExternalLink,
  UserCheck,
  Award
} from "lucide-react";
import { ProActivationData, ActivationCodeRecord, PaymentSubmission } from "../types";

interface PremiumHubProps {
  onClose?: () => void;
  onProActivated?: () => void;
}

export default function PremiumHub({ onClose, onProActivated }: PremiumHubProps) {
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "franchise" | "lifetime">("franchise");
  const [activeFeatureTab, setActiveFeatureTab] = useState<number>(0);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedGeneratedCode, setCopiedGeneratedCode] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Pro activation state
  const [isActivated, setIsActivated] = useState<boolean>(() => {
    try {
      return localStorage.getItem("local_business_suite_pro_active") === "true";
    } catch {
      return false;
    }
  });

  const [proData, setProData] = useState<ProActivationData | null>(() => {
    try {
      const saved = localStorage.getItem("local_business_suite_pro_data");
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Verification Code Form (No direct UTR activation permitted)
  const [verificationCodeInput, setVerificationCodeInput] = useState("");
  const [userContactInput, setUserContactInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationSuccess, setValidationSuccess] = useState<string | null>(null);

  // Payment Verification Submission Form (Step 1)
  const [utrInput, setUtrInput] = useState("");
  const [utrContactInput, setUtrContactInput] = useState("");
  const [isSubmittingUtr, setIsSubmittingUtr] = useState(false);
  const [utrSubmitSuccess, setUtrSubmitSuccess] = useState<string | null>(null);
  const [utrSubmitError, setUtrSubmitError] = useState<string | null>(null);

  // Admin / Founder Code Generation Portal
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [adminTab, setAdminTab] = useState<"generate" | "codes" | "verifications">("generate");
  const [newCodeContact, setNewCodeContact] = useState("");
  const [newCodePlan, setNewCodePlan] = useState<"starter" | "franchise" | "lifetime">("franchise");
  const [newCodeUtr, setNewCodeUtr] = useState("");
  const [newCodeAmount, setNewCodeAmount] = useState<number>(799);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<ActivationCodeRecord | null>(null);
  const [adminCodesList, setAdminCodesList] = useState<ActivationCodeRecord[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<PaymentSubmission[]>([]);
  const [loadingAdminData, setLoadingAdminData] = useState(false);

  const famPayNumber = "8867605076";
  const upiId = "8867605076@fam";
  const founderPhone = "8431107332";

  // World-Class Premium Features with detailed descriptions and business ROI
  const worldClassFeatures = [
    {
      id: "geogrid",
      title: "5x5 Hyper-Local Geo-Grid Heatmap & Competitor Espionage",
      badge: "World’s Top Local SEO Tech",
      icon: Crosshair,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-400",
      borderColor: "border-blue-500/40",
      highlight: "3.4x More Store Walk-Ins",
      description:
        "Simulates physical mobile GPS searches at 25 exact coordinate points across a 10km radius from your storefront. It analyzes where your business ranks (#1 to #20+) for high-intent keywords like 'best cafe near me' or 'bakery open now', revealing blind spots where competitors are stealing your foot-traffic.",
      howItWorks: [
        "25-point coordinate radar matrix pinned around your physical store address.",
        "Scans Google Maps 3-Pack rankings at each neighborhood intersection.",
        "Generates actionable Local SEO prescriptions to overtake rival businesses."
      ],
      roi: "Store footfall increases by an average of 34% within 45 days of fixing low-ranking grid zones.",
      benchmark: "Equivalent to $149/mo enterprise tools like BrightLocal & Local Falcon."
    },
    {
      id: "reviews",
      title: "Autonomous 24/7 AI Review Responder & Sentiment Triage",
      badge: "Reputation Intelligence",
      icon: Star,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-400",
      borderColor: "border-amber-500/40",
      highlight: "99.8% Response Speed",
      description:
        "Instantly analyzes incoming customer reviews across Google Maps, Yelp, and Zomato. Crafts deeply empathetic, brand-aligned public responses in 40+ languages with perfect tone modulation. Automatically detects high-risk 1-star complaints and generates crisis de-escalation solutions for managers.",
      howItWorks: [
        "Three distinct brand voices: Warm & Community, Executive Professional, or Apologetic Solution-Focused.",
        "Detects food quality, service delays, or billing issues and addresses them specifically.",
        "Maintains Google Business freshness signals to boost algorithm trust."
      ],
      roi: "Google awards higher ranking algorithms to businesses with over 90% review response rates.",
      benchmark: "Matches Birdeye & Podium Enterprise ($299/mo value)."
    },
    {
      id: "franchise",
      title: "Enterprise Multi-Location HQ Command & Brand Guardrails",
      badge: "Franchise Scale Engine",
      icon: Building2,
      color: "from-purple-500 to-indigo-600",
      textColor: "text-purple-400",
      borderColor: "border-purple-500/40",
      highlight: "Control 50+ Stores in 1 Hub",
      description:
        "Centralized multi-store command center for business owners managing 2 to 100+ branches. Set master brand tone guardrails, ban negative keywords across all staff marketing, monitor regional health indexes, and review crisis escalations from a single executive cockpit.",
      howItWorks: [
        "One-click active store switching with custom branch managers, phone numbers, and addresses.",
        "Master Brand Guardrails that automatically enforce compliance across all generated content.",
        "Real-time crisis alert system with 1-click mitigation actions."
      ],
      roi: "Saves 25+ hours of executive supervision per week and eliminates rogue brand messaging.",
      benchmark: "Comparable to multi-unit enterprise software used by Starbucks and McDonald's franchises."
    },
    {
      id: "audio",
      title: "Neural Audio Memo Transcriber & Lyria Storefront Music",
      badge: "In-Store Acoustic Suite",
      icon: Music,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/40",
      highlight: "100% Royalty-Free Ambient AI",
      description:
        "Powered by Gemini 3.5 Transcribe and Lyria audio engines. Upload voice memos, kitchen orders, or staff meetings to get accurate punctuated transcripts. Generate custom background store music and overhead promotional announcements tailored specifically to your cafe or boutique ambience.",
      howItWorks: [
        "High-fidelity transcription for audio files (.mp3, .wav, .m4a, .webm).",
        "Generates relaxing acoustic cafe jazz, lo-fi study beats, or upbeat retail store audio.",
        "Zero copyright infringement or monthly music licensing fees."
      ],
      roi: "Increases average customer dwell time by 18% with mood-tailored acoustic retail environments.",
      benchmark: "Combines Otter.ai ($120/yr) + SoundMachine Retail Music ($360/yr)."
    },
    {
      id: "whatsapp",
      title: "High-Conversion WhatsApp Marketing & Order Formatter",
      badge: "Direct Sales Driver",
      icon: MessageCircle,
      color: "from-green-500 to-emerald-600",
      textColor: "text-green-400",
      borderColor: "border-green-500/40",
      highlight: "98% Open Rate WhatsApp Copy",
      description:
        "Crafts ready-to-send broadcast messages formatted with emojis, bold text, italics, and clear calls-to-action for orders, booking confirmations, weekend flash sales, and review collection. Features one-click direct launch into WhatsApp Web with pre-encoded payloads.",
      howItWorks: [
        "Engineered for high-conversion WhatsApp Business formatting standards.",
        "Pre-encoded direct URL generators to start customer chats instantly.",
        "Customer name personalization and order dispatch confirmations."
      ],
      roi: "WhatsApp messages have a 98% open rate compared to 15% for traditional email marketing.",
      benchmark: "Wati / Interakt enterprise formatting standard."
    },
    {
      id: "localization",
      title: "Regional Language Cultural Localization Engine",
      badge: "Multi-Language Expansion",
      icon: Globe2,
      color: "from-orange-500 to-amber-600",
      textColor: "text-orange-400",
      borderColor: "border-orange-500/40",
      highlight: "Native Indian Languages",
      description:
        "Translates and culturally adapts your marketing copy into Hindi, Kannada, Telugu, Tamil, Marathi, and Bengali. Rather than word-for-word translation, it preserves colloquial warmth and festive regional flavor to build deep local trust with community shoppers.",
      howItWorks: [
        "Cultural adaptation rather than robotic machine translation.",
        "Preserves promotional tone, discounts, and brand personality.",
        "Ideal for festival campaigns (Diwali, Eid, Christmas, Pongal, Ugadi)."
      ],
      roi: "Regional language campaigns generate up to 3x higher click-through rates in tier-2 and tier-3 cities.",
      benchmark: "Enterprise multilingual localization tool value."
    },
    {
      id: "vip",
      title: "VIP 1-on-1 Direct Founder Consultation & Support",
      badge: "Executive VIP Access",
      icon: Phone,
      color: "from-yellow-400 to-amber-500",
      textColor: "text-yellow-300",
      borderColor: "border-yellow-400/40",
      highlight: "Direct Hotline to Founder",
      description:
        "Direct access to Founder & Lead Architect Sangamesh Khatge. Get tailored implementation help, custom franchise workflows, feature request priority, and dedicated phone/WhatsApp troubleshooting.",
      howItWorks: [
        "Direct mobile & WhatsApp access: 8431107332.",
        "Priority deployment assistance for multi-location store chains.",
        "Custom prompt fine-tuning tailored to your exact industry."
      ],
      roi: "Guaranteed seamless deployment with zero downtime or setup hurdles.",
      benchmark: "Enterprise Dedicated Account Manager service."
    }
  ];

  const plans = [
    {
      id: "starter" as const,
      name: "Starter Pro",
      tagline: "For Single Store & Retail Shops",
      originalPrice: 799,
      price: 299,
      period: "per month",
      popular: false,
      savings: "62% OFF",
      features: [
        "Unlimited WhatsApp Marketing Formats",
        "AI 5-Star Review Responder (Unlimited)",
        "Local SEO & Google Maps Description Generator",
        "Flyer & Canva Advertising Copywriter",
        "Regional Language Cultural Localization",
        "Direct Support from Founder Sangamesh"
      ]
    },
    {
      id: "franchise" as const,
      name: "Franchise Pro Growth",
      tagline: "Most Popular for Multi-Store Brands",
      originalPrice: 2499,
      price: 799,
      period: "annual pass",
      popular: true,
      savings: "68% OFF",
      features: [
        "Everything in Starter Pro",
        "Multi-Location Franchise Hub (Up to 10 Stores)",
        "5x5 Geo-Grid Local Maps Radar",
        "AI Audio Transcriber for Staff Voice Memos",
        "Storefront Ambient Music Generator (Lyria Engine)",
        "Priority VIP WhatsApp Support (Same-day)",
        "Brand Compliance & Guardrails Enforcement"
      ]
    },
    {
      id: "lifetime" as const,
      name: "Enterprise Lifetime",
      tagline: "One-Time Payment • Unlimited Forever",
      originalPrice: 4999,
      price: 1499,
      period: "one-time payment",
      popular: false,
      savings: "70% OFF",
      features: [
        "Everything in Franchise Pro",
        "Unlimited Store Branches & Custom Rollouts",
        "Master Brand Guardrails & Crisis Alert System",
        "1-on-1 Consultation Call with Sangamesh Khatge",
        "Future AI Engine Upgrades Included Forever",
        "Custom Feature Request Priority",
        "Direct 24/7 Hotline Support"
      ]
    }
  ];

  const currentPlan = plans.find((p) => p.id === selectedPlan) || plans[1];
  const activeFeature = worldClassFeatures[activeFeatureTab];

  // Dynamic UPI URL for QR code & mobile deep link
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=Sangamesh%20Khatge&am=${currentPlan.price}&cu=INR&tn=LocalBusinessSuite_${currentPlan.name.replace(/\s+/g, '')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(upiDeepLink)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(famPayNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  // Fetch admin codes list
  const fetchAdminCodes = async () => {
    setLoadingAdminData(true);
    try {
      const res = await fetch("/api/admin/activation-codes");
      if (res.ok) {
        const data = await res.json();
        setAdminCodesList(data.codes || []);
      }
      const vRes = await fetch("/api/admin/pending-verifications");
      if (vRes.ok) {
        const vData = await vRes.json();
        setPendingVerifications(vData.submissions || []);
      }
    } catch (e) {
      console.error("Failed to load admin codes", e);
    } finally {
      setLoadingAdminData(false);
    }
  };

  useEffect(() => {
    if (showAdminPortal) {
      fetchAdminCodes();
    }
  }, [showAdminPortal]);

  // VALIDATION CHECK: Validate the submitted activation code before changing status to PRO SUBSCRIBER
  const handleVerifyActivationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setValidationSuccess(null);

    const cleanCode = verificationCodeInput.trim().toUpperCase();
    const cleanContact = userContactInput.trim();

    if (!cleanCode) {
      setValidationError("Please enter your unique Pro Activation Code.");
      return;
    }

    // REMOVE DIRECT UTR ACTIVATION: Detect if user typed a raw UTR number directly
    const isPureDigits = /^\d{6,18}$/.test(cleanCode);
    const looksLikeUtr =
      isPureDigits ||
      cleanCode.startsWith("UTR") ||
      cleanCode.startsWith("REF") ||
      cleanCode.startsWith("UPI");

    if (looksLikeUtr && !cleanCode.startsWith("PRO-")) {
      setValidationError(
        "❌ Direct UTR / Reference numbers cannot unlock Pro plans. You must enter a unique Verification Code issued after payment verification (e.g., PRO-FRANCHISE-2026). If you just completed payment on FamPay, submit your details in Step 1 below or contact Founder Sangamesh Khatge."
      );
      return;
    }

    if (!cleanContact) {
      setValidationError("Please enter your registered Phone Number or Email address linked to this license.");
      return;
    }

    setIsValidating(true);
    try {
      const response = await fetch("/api/premium/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: cleanCode,
          userContact: cleanContact,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setValidationError(data.message || "Failed to validate activation code.");
        return;
      }

      // Successful verification! Change user status to PRO SUBSCRIBER
      localStorage.setItem("local_business_suite_pro_active", "true");
      localStorage.setItem(
        "local_business_suite_pro_data",
        JSON.stringify({
          planId: data.planId,
          planName: data.planName,
          userContact: data.userContact,
          code: data.code,
          activatedAt: data.activatedAt,
          amount: data.amount,
        })
      );

      setIsActivated(true);
      setProData({
        planId: data.planId,
        planName: data.planName,
        userContact: data.userContact,
        code: data.code,
        activatedAt: data.activatedAt,
        amount: data.amount,
      });

      setValidationSuccess(
        `🎉 Congratulations! PRO SUBSCRIBER status successfully activated for ${data.planName}. All world-class modules are now unlocked and all sponsor ads permanently removed!`
      );

      if (onProActivated) {
        onProActivated();
      }

      // Notify other components (App.tsx, AdBanner.tsx)
      window.dispatchEvent(new Event("storage"));
    } catch (err: any) {
      setValidationError(err.message || "Network error while validating activation code. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  // STEP 1: Submit UTR for Admin Verification & Code Generation
  const handleSubmitUtrVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setUtrSubmitError(null);
    setUtrSubmitSuccess(null);

    if (!utrContactInput.trim()) {
      setUtrSubmitError("Please enter your registered Phone Number or Email address.");
      return;
    }
    if (!utrInput.trim()) {
      setUtrSubmitError("Please enter the 12-digit UPI UTR / Reference number from your payment app.");
      return;
    }

    setIsSubmittingUtr(true);
    try {
      const response = await fetch("/api/premium/submit-utr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userContact: utrContactInput.trim(),
          utr: utrInput.trim(),
          planId: currentPlan.id,
          amount: currentPlan.price,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setUtrSubmitError(data.message || "Failed to submit payment verification.");
        return;
      }

      setUtrSubmitSuccess(
        `✅ Payment details submitted successfully! Founder Sangamesh Khatge will verify your FamPay transfer of ₹${currentPlan.price} (UTR: ${utrInput.trim()}) and issue your unique activation code. You can also click "Send Screenshot on WhatsApp" to notify him immediately.`
      );
      setUtrInput("");
    } catch (err: any) {
      setUtrSubmitError(err.message || "Network error submitting verification request.");
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  // ADMIN CODE GENERATION: Generate unique activation code linked to phone/email
  const handleAdminGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodeContact.trim()) {
      alert("Please enter customer phone number or email.");
      return;
    }

    setIsGeneratingCode(true);
    try {
      const res = await fetch("/api/admin/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userContact: newCodeContact.trim(),
          planId: newCodePlan,
          utr: newCodeUtr.trim() || undefined,
          amount: newCodeAmount,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGeneratedResult(data.record);
        fetchAdminCodes();
      } else {
        alert(data.message || "Failed to generate activation code.");
      }
    } catch (err: any) {
      alert("Error generating code: " + err.message);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  // ADMIN: 1-Click Approve Pending Payment
  const handleApprovePayment = async (submissionId: string) => {
    try {
      const res = await fetch("/api/admin/approve-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Payment approved! Unique code generated: ${data.code}`);
        fetchAdminCodes();
      } else {
        alert(data.message || "Failed to approve payment.");
      }
    } catch (e: any) {
      alert("Error approving payment: " + e.message);
    }
  };

  // Deactivate (for testing / switching)
  const handleDeactivate = () => {
    if (confirm("Are you sure you want to de-activate Pro status on this browser?")) {
      localStorage.removeItem("local_business_suite_pro_active");
      localStorage.removeItem("local_business_suite_pro_data");
      setIsActivated(false);
      setProData(null);
      setValidationSuccess(null);
      setValidationError(null);
      window.dispatchEvent(new Event("storage"));
    }
  };

  // WhatsApp verification link
  const whatsAppVerifyUrl = `https://wa.me/91${founderPhone}?text=${encodeURIComponent(
    `Hello Sangamesh Sir, I have transferred ₹${currentPlan.price} to your FamPay account (8867605076) for the ${currentPlan.name} plan. Please verify my payment and generate my Pro Activation Code!`
  )}`;

  const faqs = [
    {
      q: "How does the payment transfer to FamPay work?",
      a: "When you scan the QR code or click 'Pay via UPI App', your payment of ₹299, ₹799, or ₹1,499 is transferred directly to Founder Sangamesh Khatge's verified FamPay account (8867605076 / 8867605076@fam). You can pay from FamPay, GPay, PhonePe, Paytm, CRED, or BHIM."
    },
    {
      q: "Why is a Verification Code required instead of direct UTR?",
      a: "To ensure bank-grade security and prevent fraudulent activations, direct UTR numbers cannot be entered as license keys. Each transaction is verified by Founder Sangamesh Khatge, who generates a unique cryptographically linked activation code bound exclusively to your registered phone number or email."
    },
    {
      q: "How quickly is my unique Activation Code issued?",
      a: "Activation codes are issued immediately upon payment verification! You can submit your UTR reference in Step 1 below or click 'Send Screenshot on WhatsApp' to receive your unique code instantly directly from Sangamesh (8431107332)."
    },
    {
      q: "Can I use this for multiple retail store branches?",
      a: "Yes! The Franchise Pro and Enterprise Lifetime plans allow you to connect multiple branches, assign individual branch managers, and run 5x5 Geo-Grid rankings across all locations."
    },
    {
      q: "Are the generated storefront music tracks royalty-free?",
      a: "Yes, all audio produced by the Lyria storefront engine is 100% royalty-free for commercial in-store playback, saving you hundreds of dollars in background music licensing fees."
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-500/20 via-purple-950/40 to-emerald-500/20 border-2 border-amber-400/60 rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl ring-1 ring-amber-400/30">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg">
            <Crown className="w-4 h-4 fill-slate-950" />
            <span>World-Class Enterprise Business AI</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Unlock the World’s Most Powerful Local Business Suite
          </h2>

          <p className="text-slate-300 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Gain an unfair competitive advantage. Master 5x5 Geo-Grid heatmaps, autonomous review response, multi-location franchise command, and in-store ambient music.
          </p>

          {/* Founder Verification Strip & Admin Portal Toggle */}
          <div className="pt-2 flex items-center justify-center gap-2 flex-wrap text-xs text-amber-200">
            <span className="px-3 py-1 rounded-full bg-slate-900/90 border border-amber-400/40 flex items-center gap-1.5 font-semibold">
              <BadgeCheck className="w-4 h-4 text-amber-400" />
              <span>Direct Founder Transfer: <strong>Sangamesh Khatge</strong></span>
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900/90 border border-emerald-400/40 text-emerald-300 flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>FamPay Verified: <strong>8867605076</strong></span>
            </span>
            <button
              onClick={() => setShowAdminPortal(!showAdminPortal)}
              className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-indigo-400/40 text-indigo-300 flex items-center gap-1.5 font-bold transition-all hover:scale-105"
            >
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <span>{showAdminPortal ? "Close Admin Portal" : "Founder Admin Portal"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* PRO SUBSCRIBER ACTIVE HERO BANNER */}
      {isActivated && (
        <div className="p-6 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/60 border-2 border-emerald-400 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/40 shrink-0">
                <Crown className="w-6 h-6 fill-slate-950 text-slate-950" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow">
                    PRO SUBSCRIBER
                  </span>
                  <span className="text-xs font-mono text-emerald-300 font-bold">
                    {proData?.planName || currentPlan.name}
                  </span>
                </div>
                <h4 className="text-lg font-black text-white">
                  VIP Enterprise License Active & Verified!
                </h4>
                <p className="text-xs text-slate-300">
                  Registered to: <strong className="text-amber-300 font-mono">{proData?.userContact || "Verified Subscriber"}</strong> • License Code: <span className="text-emerald-400 font-mono font-bold">{proData?.code || "PRO-ACTIVE"}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-xs text-emerald-400 font-semibold hidden md:inline">
                ✨ All Ads Removed Forever
              </span>
              <button
                onClick={handleDeactivate}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-slate-700 text-xs font-semibold transition-colors"
              >
                Switch / Logout License
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* FOUNDER ADMIN CODE GENERATION PORTAL (Expandable) */}
      {/* ============================================================ */}
      {showAdminPortal && (
        <div className="bg-slate-900 border-2 border-indigo-500/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Admin / Founder Terminal
                  </span>
                  <span className="text-xs font-mono text-slate-400">Sangamesh Khatge Cockpit</span>
                </div>
                <h3 className="text-lg font-black text-white">Unique Pro Activation Code Generator & Audit</h3>
              </div>
            </div>

            {/* Admin Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setAdminTab("generate")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  adminTab === "generate" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Generate Code
              </button>
              <button
                onClick={() => setAdminTab("verifications")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  adminTab === "verifications" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Pending Payments</span>
                {pendingVerifications.filter((s) => s.status === "pending").length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                    {pendingVerifications.filter((s) => s.status === "pending").length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setAdminTab("codes")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  adminTab === "codes" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                All Codes ({adminCodesList.length})
              </button>
            </div>
          </div>

          {/* TAB 1: GENERATE NEW CODE */}
          {adminTab === "generate" && (
            <div className="space-y-6">
              {/* Quick Seed Codes for Instant Demo / Testing */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Quick Pre-Seeded Test Codes (Click to Auto-Fill Activation Form):</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Instant 1-Click Verification</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => {
                      setVerificationCodeInput("PRO-FRANCHISE-2026");
                      setUserContactInput("8867605076");
                      setShowAdminPortal(false);
                    }}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-400 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>Franchise Pro Growth</span>
                      <span className="text-emerald-400 font-mono">₹799</span>
                    </div>
                    <div className="text-[11px] font-mono text-amber-300 mt-1 font-bold group-hover:text-amber-200">
                      PRO-FRANCHISE-2026
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Contact: 8867605076</div>
                  </button>

                  <button
                    onClick={() => {
                      setVerificationCodeInput("PRO-LIFETIME-VIP");
                      setUserContactInput("shivkumarkhatge@gmail.com");
                      setShowAdminPortal(false);
                    }}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-400 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>Enterprise Lifetime</span>
                      <span className="text-emerald-400 font-mono">₹1499</span>
                    </div>
                    <div className="text-[11px] font-mono text-amber-300 mt-1 font-bold group-hover:text-amber-200">
                      PRO-LIFETIME-VIP
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Contact: shivkumarkhatge@gmail.com</div>
                  </button>

                  <button
                    onClick={() => {
                      setVerificationCodeInput("PRO-STARTER-8867");
                      setUserContactInput("8431107332");
                      setShowAdminPortal(false);
                    }}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-400 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>Starter Pro</span>
                      <span className="text-emerald-400 font-mono">₹299</span>
                    </div>
                    <div className="text-[11px] font-mono text-amber-300 mt-1 font-bold group-hover:text-amber-200">
                      PRO-STARTER-8867
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Contact: 8431107332</div>
                  </button>
                </div>
              </div>

              {/* Code Generation Form */}
              <form onSubmit={handleAdminGenerateCode} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Customer Phone or Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210 or user@store.com"
                      value={newCodeContact}
                      onChange={(e) => setNewCodeContact(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Plan Tier
                    </label>
                    <select
                      value={newCodePlan}
                      onChange={(e) => {
                        const val = e.target.value as "starter" | "franchise" | "lifetime";
                        setNewCodePlan(val);
                        setNewCodeAmount(val === "starter" ? 299 : val === "franchise" ? 799 : 1499);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
                    >
                      <option value="starter">Starter Pro (₹299)</option>
                      <option value="franchise">Franchise Pro Growth (₹799)</option>
                      <option value="lifetime">Enterprise Lifetime (₹1,499)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Verified FamPay UTR / Ref (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 426810928371"
                      value={newCodeUtr}
                      onChange={(e) => setNewCodeUtr(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Amount Paid (INR)
                    </label>
                    <input
                      type="number"
                      value={newCodeAmount}
                      onChange={(e) => setNewCodeAmount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11px] text-slate-400">
                    Generating a unique code binds it securely to the specified phone/email.
                  </p>
                  <button
                    type="submit"
                    disabled={isGeneratingCode}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isGeneratingCode ? "Generating..." : "Generate Unique Code"}</span>
                  </button>
                </div>
              </form>

              {/* Newly Generated Result Card */}
              {generatedResult && (
                <div className="p-4 bg-emerald-500/10 border-2 border-emerald-500/50 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Code Successfully Generated & Linked:</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Bound to: <strong className="text-white">{generatedResult.userContact}</strong>
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-lg font-black text-amber-300 font-mono tracking-wider">
                        {generatedResult.code}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        ({generatedResult.planName} • ₹{generatedResult.amount})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedResult.code);
                          setCopiedGeneratedCode(true);
                          setTimeout(() => setCopiedGeneratedCode(false), 2000);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                      >
                        {copiedGeneratedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedGeneratedCode ? "Copied!" : "Copy Code"}</span>
                      </button>

                      <button
                        onClick={() => {
                          setVerificationCodeInput(generatedResult.code);
                          setUserContactInput(generatedResult.userContact);
                          setShowAdminPortal(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1"
                      >
                        <span>Auto-fill into Activation Form</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PENDING VERIFICATIONS */}
          {adminTab === "verifications" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Customer payment verification requests submitted from Step 1</span>
                <button onClick={fetchAdminCodes} className="flex items-center gap-1 text-indigo-400 hover:underline">
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh Queue</span>
                </button>
              </div>

              {pendingVerifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-slate-800 rounded-2xl bg-slate-950 text-xs">
                  No pending payment submissions at this time.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {pendingVerifications.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono">{item.userContact}</span>
                          <span className="px-2 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                            {item.planName}
                          </span>
                          <span className="text-emerald-400 font-mono font-bold">₹{item.amount}</span>
                        </div>
                        <div className="text-slate-400 text-[11px] font-mono">
                          FamPay UTR: <strong className="text-amber-300">{item.utr}</strong> • Submitted: {new Date(item.createdAt).toLocaleTimeString()}
                        </div>
                        {item.generatedCode && (
                          <div className="text-emerald-300 text-[11px] font-mono">
                            Issued Code: <strong>{item.generatedCode}</strong>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {item.status === "pending" ? (
                          <button
                            onClick={() => handleApprovePayment(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Verify & Issue Code</span>
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[11px] flex items-center gap-1">
                            <BadgeCheck className="w-3.5 h-3.5" />
                            <span>Approved</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ALL CODES DIRECTORY */}
          {adminTab === "codes" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>All unique verification codes stored in backend registry:</span>
                <button onClick={fetchAdminCodes} className="flex items-center gap-1 text-indigo-400 hover:underline">
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh List</span>
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {adminCodesList.map((code) => (
                  <div
                    key={code.code}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-amber-300">{code.code}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase ${
                            code.status === "active"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {code.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {code.planName} • Linked to: <span className="text-white font-mono">{code.userContact}</span>
                        {code.redeemedAt && (
                          <span> • Redeemed on {new Date(code.redeemedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setVerificationCodeInput(code.code);
                          setUserContactInput(code.userContact);
                          setShowAdminPortal(false);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold"
                      >
                        Auto-fill
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* WORLD'S TOP PREMIUM FEATURES SHOWCASE & DESCRIPTIONS */}
      {/* ============================================================ */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-extrabold uppercase tracking-wider">
              Feature Deep-Dive
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>World-Class Features Included in Pro</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Select any feature below to inspect how it scales foot-traffic, reputation, and revenue.
            </p>
          </div>
          <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            7 Enterprise Modules Ready
          </div>
        </div>

        {/* Feature Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {worldClassFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            const isTabActive = activeFeatureTab === idx;
            return (
              <button
                key={feat.id}
                onClick={() => setActiveFeatureTab(idx)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                  isTabActive
                    ? `bg-gradient-to-r ${feat.color} text-white shadow-lg shadow-indigo-950/40 scale-105 ring-1 ring-white/30`
                    : "bg-slate-950 text-slate-300 hover:bg-slate-850 hover:text-white border border-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{feat.title.split("&")[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Detailed Feature Card */}
        {activeFeature && (
          <div className={`p-6 sm:p-7 rounded-2xl bg-slate-950 border-2 ${activeFeature.borderColor} relative overflow-hidden transition-all shadow-xl`}>
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-extrabold ${activeFeature.textColor}`}>
                    {activeFeature.badge}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{activeFeature.highlight}</span>
                  </span>
                </div>

                <h4 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {activeFeature.title}
                </h4>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {activeFeature.description}
                </p>

                {/* How It Works List */}
                <div className="space-y-2 pt-2">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    How it works in your business:
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {activeFeature.howItWorks.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ROI & Market Comparison Badge */}
              <div className="lg:w-72 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shrink-0">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Proven Business ROI
                  </span>
                  <p className="text-xs font-semibold text-emerald-300 mt-1">
                    {activeFeature.roi}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Market Benchmark
                  </span>
                  <p className="text-xs font-semibold text-amber-300 mt-1">
                    {activeFeature.benchmark}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* PRICING PLANS TIERS CARDS */}
      {/* ============================================================ */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-extrabold uppercase tracking-wider">
            Direct Founder Subscription
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-white">
            Choose Your Growth Plan
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Directly supporting Sangamesh Khatge on FamPay (8867605076). Instant activation code upon payment verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`rounded-3xl p-6 sm:p-7 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-slate-900/90 border-amber-400 shadow-2xl ring-2 ring-amber-400/30 scale-[1.02]"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700 opacity-90 hover:opacity-100"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
                    ★ Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-white">{plan.name}</h3>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-amber-400 bg-amber-400" : "border-slate-600"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-1">{plan.tagline}</p>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white">₹{plan.price}</span>
                    <span className="text-xs line-through text-slate-500">₹{plan.originalPrice}</span>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                      {plan.savings}
                    </span>
                    <span className="text-xs text-slate-400 block sm:inline">/ {plan.period}</span>
                  </div>

                  <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <button
                    type="button"
                    className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <span>{isSelected ? "Plan Selected (Pay & Activate Below)" : "Select This Plan"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2-STEP FAMPAY PAYMENT & UNIQUE VERIFICATION CODE ACTIVATION */}
      {/* ============================================================ */}
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold uppercase tracking-wider">
                Direct FamPay UPI Gateway
              </span>
              <span className="text-xs text-slate-400">Verified Activation Code Guarantee</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              Pay ₹{currentPlan.price} to FamPay: <span className="text-emerald-400">{famPayNumber}</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Supports FamPay, Google Pay, PhonePe, Paytm, CRED, BHIM & all Indian UPI apps.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Amount Due</span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-400">₹{currentPlan.price}</span>
            <span className="text-[11px] text-slate-400 block font-medium">for {currentPlan.name} ({currentPlan.period})</span>
          </div>
        </div>

        {/* UPI Gateway & Credentials Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Dynamic QR Code */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center">
            <div className="bg-white p-3 rounded-2xl shadow-2xl inline-block ring-4 ring-emerald-500/30">
              <img
                src={qrCodeUrl}
                alt={`UPI QR Code for ₹${currentPlan.price}`}
                className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg object-contain"
              />
            </div>
            <p className="text-xs text-slate-300 mt-3 font-bold flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Scan using FamPay or any UPI App</span>
            </p>
            <p className="text-[11px] text-amber-300 font-mono mt-1">
              UPI ID: {upiId}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Amount prefilled: ₹{currentPlan.price}
            </p>
          </div>

          {/* Payment Account Credentials & Action Buttons */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-3 bg-slate-950/70 border border-slate-800 p-4 rounded-2xl">
              {/* FamPay Mobile Number */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    FamPay Registered Mobile Number
                  </span>
                  <span className="text-lg font-black text-white font-mono">{famPayNumber}</span>
                  <span className="text-xs text-emerald-400 ml-2 font-semibold">Account: Sangamesh Khatge</span>
                </div>
                <button
                  onClick={handleCopyNumber}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNumber ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              {/* FamPay UPI ID */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Official UPI ID
                  </span>
                  <span className="text-lg font-black text-amber-300 font-mono">{upiId}</span>
                  <span className="text-xs text-slate-400 ml-2">(also accepts 8867605076@fampay)</span>
                </div>
                <button
                  onClick={handleCopyUpi}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUpi ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Direct Mobile Pay & WhatsApp Verification */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={upiDeepLink}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <CreditCard className="w-4 h-4 fill-slate-950" />
                <span>Pay ₹{currentPlan.price} via UPI App</span>
              </a>

              <a
                href={whatsAppVerifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/60 text-emerald-300 font-bold text-sm text-center flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Screenshot on WhatsApp</span>
              </a>
            </div>

            {/* Founder Contact Hotline */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Founder Hotline for Instant Code Issuance:</span>
              </span>
              <a href={`tel:${founderPhone}`} className="text-emerald-300 font-mono font-bold hover:underline">
                {founderPhone}
              </a>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TWO-STEP ACTIVATION WORKFLOW (REPLACES DIRECT UTR ACTIVATION) */}
        {/* ============================================================ */}
        <div className="border-t border-slate-800 pt-6 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
              Security Protocol Notice
            </span>
            <h4 className="text-xl font-black text-white">
              Two-Step Payment Verification & License Activation
            </h4>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">
              Direct UTR number activation has been discontinued. A unique cryptographically verified Activation Code linked to your registered phone or email is required.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* STEP 1: SUBMIT PAYMENT UTR FOR CODE ISSUANCE */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-850">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs flex items-center justify-center border border-indigo-500/40">
                  1
                </span>
                <h5 className="text-sm font-bold text-white">Step 1: Submit Payment Reference for Verification</h5>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Paid on FamPay? Submit your 12-digit UTR reference number below so Founder Sangamesh Khatge can confirm your transfer and generate your unique activation code.
              </p>

              <form onSubmit={handleSubmitUtrVerification} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Your Phone Number or Email:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210 or yourname@business.com"
                    value={utrContactInput}
                    onChange={(e) => setUtrContactInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    12-digit UPI UTR / Transaction ID:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 426810928371 (Found in your UPI app payment receipt)"
                    value={utrInput}
                    onChange={(e) => setUtrInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingUtr}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-200 hover:text-white font-bold text-xs border border-indigo-500/30 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isSubmittingUtr ? "Submitting for Verification..." : "Submit Payment for Code Generation"}</span>
                </button>
              </form>

              {utrSubmitSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                  {utrSubmitSuccess}
                </div>
              )}
              {utrSubmitError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300">
                  {utrSubmitError}
                </div>
              )}
            </div>

            {/* STEP 2: ENTER UNIQUE ACTIVATION CODE */}
            <div className="p-5 bg-slate-950 rounded-2xl border-2 border-amber-500/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-mono font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <h5 className="text-sm font-bold text-white">Step 2: Enter Unique Activation Code</h5>
                </div>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                  Required for Pro
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your unique code (e.g., <span className="font-mono text-amber-300">PRO-FRANCHISE-2026</span>) and the registered phone/email it was bound to.
              </p>

              <form onSubmit={handleVerifyActivationCode} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Registered Phone Number or Email:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8867605076 or shivkumarkhatge@gmail.com"
                    value={userContactInput}
                    onChange={(e) => setUserContactInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Unique Verification Code:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PRO-FRANCHISE-2026 or PRO-LIFETIME-VIP"
                    value={verificationCodeInput}
                    onChange={(e) => setVerificationCodeInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono font-bold placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isValidating}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  <Key className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                  <span>{isValidating ? "Validating with Server..." : "Verify Code & Activate Pro"}</span>
                </button>
              </form>

              {validationSuccess && (
                <div className="p-3 bg-emerald-500/15 border-2 border-emerald-500/60 rounded-xl text-xs text-emerald-200 font-semibold space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{validationSuccess}</span>
                  </div>
                </div>
              )}

              {validationError && (
                <div className="p-3 bg-red-500/15 border-2 border-red-500/60 rounded-xl text-xs text-red-200 font-semibold flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>Want to test an instant code?</span>
                <button
                  type="button"
                  onClick={() => setShowAdminPortal(true)}
                  className="text-amber-400 font-bold hover:underline"
                >
                  View Demo Codes in Admin Portal →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FAQ ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h4 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <span>Frequently Asked Questions</span>
        </h4>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full text-left p-3.5 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="p-3.5 pt-0 text-xs text-slate-400 border-t border-slate-800/50 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
