import React, { useState, useEffect } from "react";
import {
  Building2,
  Star,
  Share2,
  Search,
  Mail,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Send,
  History,
  Trash2,
  ExternalLink,
  Wrench,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Crosshair
} from "lucide-react";

import { LocationBranch, BrandGuardrails } from "../types";

interface BusinessSuiteProps {
  isKeyReady: boolean;
  onOpenKeyGuide: () => void;
  activeLocation?: LocationBranch;
  guardrails?: BrandGuardrails;
  allLocations?: LocationBranch[];
  onSelectLocation?: (id: string) => void;
  onOpenFranchise?: () => void;
  onOpenGeoGrid?: () => void;
}

type SubTab = "whatsapp_formatter" | "review_responder" | "social_post" | "seo_optimizer" | "customer_email";

interface HistoryItem {
  id: string;
  tab: SubTab;
  tabLabel: string;
  summary: string;
  result: string;
  timestamp: string;
}

const HISTORY_STORAGE_KEY = "local_business_suite_history";

export default function BusinessSuite({
  isKeyReady,
  onOpenKeyGuide,
  activeLocation,
  guardrails,
  allLocations,
  onSelectLocation,
  onOpenFranchise,
  onOpenGeoGrid
}: BusinessSuiteProps) {
  const [activeTab, setActiveTab] = useState<SubTab>("whatsapp_formatter");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showStreamlitFix, setShowStreamlitFix] = useState(false);
  const [copiedPythonFix, setCopiedPythonFix] = useState(false);

  // Global Business Name state (synced with active franchise location if provided)
  const [businessName, setBusinessName] = useState(activeLocation?.name || "Artisan Bakery & Cafe");

  useEffect(() => {
    if (activeLocation) {
      setBusinessName(activeLocation.name);
      setSeoCity(activeLocation.city);
    }
  }, [activeLocation]);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: "hist-default-1",
        tab: "whatsapp_formatter",
        tabLabel: "WhatsApp Formatter",
        summary: "Order Dispatched #4910 for John",
        result: `*Order Update from Artisan Bakery & Cafe* 🥐📦\n\nHi *John*, your freshly baked sourdough loaf & cinnamon rolls are packed and ready for pickup!\n\n📍 *Pickup Counter:* 1204 S Congress Ave\n⏰ *Available Until:* 6:00 PM today\n\n_Need curbside drop-off? Just reply to this chat when you arrive._\n\nHave a wonderful day! 🌟`,
        timestamp: "Just now"
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // WhatsApp Formatter form state
  const [waCustomerName, setWaCustomerName] = useState("John M.");
  const [waMessageGoal, setWaMessageGoal] = useState("Order Dispatched / Ready for Pickup");
  const [waKeyDetails, setWaKeyDetails] = useState("Order #8291 of handcrafted sourdough loaves & cinnamon rolls is packaged and ready at the front counter.");
  const [waCtaText, setWaCtaText] = useState("Reply YES to confirm pickup time, or call 555-0192 for curbside delivery.");
  const [waTone, setWaTone] = useState("Friendly, warm & professional");

  // Review Responder form state
  const [customerName, setCustomerName] = useState("Jennifer M.");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState(
    "Stopped by on Saturday morning. The sourdough cinnamon rolls and pour-over coffee were unbelievable! The barista was so friendly despite the huge morning line."
  );
  const [reviewTone, setReviewTone] = useState("Warm, Gracious & Community-Oriented");

  // Social Post form state
  const [socialIndustry, setSocialIndustry] = useState("Bakery / Cafe");
  const [socialPlatform, setSocialPlatform] = useState("Instagram & Facebook");
  const [socialObjective, setSocialObjective] = useState("Weekend Morning Brunch Special");
  const [socialOffer, setSocialOffer] = useState("Buy one pastry get one specialty coffee 50% off before 11 AM this Saturday & Sunday!");

  // Local SEO form state
  const [seoCity, setSeoCity] = useState("Austin, TX (South Congress)");
  const [seoCategory, setSeoCategory] = useState("Artisanal Sourdough Bakery & Specialty Espresso Bar");
  const [seoServices, setSeoServices] = useState("Sourdough bread, catering platters, organic espresso, gluten-free pastries, custom celebration cakes");
  const [seoDifferentiators, setSeoDifferentiators] = useState("Naturally leavened 36-hour fermentation, organic local flour, voted Best Bakery 2025");

  // Email & SMS form state
  const [emailType, setEmailType] = useState("Seasonal Promo & Weekend Special");
  const [emailAudience, setEmailAudience] = useState("VIP Loyalty Club members");
  const [emailKeyMessage, setEmailKeyMessage] = useState("Introducing our Autumn Spiced Brioche French Toast & Pumpkin Chai Latte, exclusive early access this weekend.");
  const [discountCode, setDiscountCode] = useState("AUTUMN20");

  const saveHistoryItem = (tab: SubTab, summary: string, resText: string) => {
    const labels: Record<SubTab, string> = {
      whatsapp_formatter: "WhatsApp Formatter",
      review_responder: "Review Responder",
      social_post: "Social Campaigns",
      seo_optimizer: "Local SEO & Google",
      customer_email: "Email & SMS Copy"
    };

    const newItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      tab,
      tabLabel: labels[tab] || tab,
      summary,
      result: resText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setHistory((prev) => [newItem, ...prev.slice(0, 19)]);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setResult("");

    let payload: any = {};
    let itemSummary = "";

    if (activeTab === "whatsapp_formatter") {
      payload = {
        businessName,
        customerName: waCustomerName,
        messageGoal: waMessageGoal,
        keyDetails: waKeyDetails,
        ctaText: waCtaText,
        tone: waTone
      };
      itemSummary = `${waMessageGoal} for ${waCustomerName || "Customer"}`;
    } else if (activeTab === "review_responder") {
      payload = {
        businessName,
        customerName,
        rating: reviewRating,
        reviewText,
        tone: reviewTone,
      };
      itemSummary = `${reviewRating}-star review response for ${customerName || "Customer"}`;
    } else if (activeTab === "social_post") {
      payload = {
        businessName,
        industry: socialIndustry,
        platform: socialPlatform,
        objective: socialObjective,
        offerDetails: socialOffer,
      };
      itemSummary = `${socialObjective} (${socialPlatform})`;
    } else if (activeTab === "seo_optimizer") {
      payload = {
        businessName,
        city: seoCity,
        category: seoCategory,
        services: seoServices,
        differentiators: seoDifferentiators,
      };
      itemSummary = `Local SEO for ${businessName} in ${seoCity}`;
    } else if (activeTab === "customer_email") {
      payload = {
        businessName,
        emailType,
        targetAudience: emailAudience,
        keyMessage: emailKeyMessage,
        discountCode,
      };
      itemSummary = `${emailType} (${discountCode || "No code"})`;
    }

    try {
      const response = await fetch("/api/business/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeTab,
          payload,
          guardrails,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "API_KEY_NOT_CONFIGURED") {
          setErrorMsg("Your Gemini API Key is not configured yet. Configure GEMINI_API_KEY in Secrets.");
          onOpenKeyGuide();
        } else {
          setErrorMsg(data.message || "Failed to generate business content.");
        }
      } else {
        const text = data.result || "No content returned.";
        setResult(text);
        saveHistoryItem(activeTab, itemSummary, text);
      }
    } catch (err: any) {
      console.error("Business generation error:", err);
      setErrorMsg(err.message || "Network request failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsAppWeb = () => {
    if (!result) return;
    // Extract primary message or encode entire result
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(result)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const pythonStreamlitFixCode = `# ==============================================================================
# STEP 1: RECOVER YOUR ORIGINAL app.py IF YOU REPLACED THE WHOLE FILE
# DO NOT replace your entire file! To restore your ~1000 lines:
#   - In VS Code / Editor: Press Ctrl+Z (or Cmd+Z) to undo the full file paste
#   - In Git terminal:     git checkout app.py   (or git restore app.py)
#   - On GitHub.com:       Go to app.py -> History -> Restore previous commit
# ==============================================================================

# STEP 2: ADD THIS RETRY HELPER (Handles 503 UNAVAILABLE & 404 Model Errors):
import time

def call_gemini_safe(client, prompt_text, system_instruction=None, max_retries=3):
    """
    Safely calls Gemini with automatic exponential backoff on 503 UNAVAILABLE
    (high demand spike) and fallback to gemini-flash-latest.
    """
    models_to_try = ["gemini-3.8-flash", "gemini-flash-latest"]
    last_err = None

    for model_name in models_to_try:
        delay = 1.5
        for attempt in range(max_retries):
            try:
                config_args = {}
                if system_instruction:
                    config_args["system_instruction"] = system_instruction
                cfg = types.GenerateContentConfig(**config_args) if 'types' in globals() else None

                resp = client.models.generate_content(
                    model=model_name,
                    contents=prompt_text,
                    config=cfg
                )
                return resp.text
            except Exception as e:
                last_err = e
                err_msg = str(e)
                # If 503 UNAVAILABLE or 429 rate limit: back off and retry
                if "503" in err_msg or "UNAVAILABLE" in err_msg or "high demand" in err_msg or "429" in err_msg:
                    if attempt < max_retries - 1:
                        time.sleep(delay)
                        delay *= 2
                        continue
                # If 404 or other non-retryable error, try next candidate model
                break

    raise last_err

# ==============================================================================
# STEP 3: REPLACE ONLY LINES 880 TO 935 (The WhatsApp Button Section):
# ==============================================================================

# Line 884: Properly closed triple quote f-string
prompt = f"""
Business Name: {business_name if 'business_name' in locals() else 'Local Business'}
Customer Name: {customer_name if 'customer_name' in locals() else 'Customer'}
Objective: WhatsApp formatted message
Details: {details if 'details' in locals() else 'Customer update'}

Format instructions:
Create a professional WhatsApp message with emojis, *bold text*, _italics_, and a clear call to action.
"""

# Initialize output = None BEFORE checking 'if output:' to eliminate NameError
output = None

if st.button("Format for WhatsApp 💬", type="primary"):
    with st.spinner("Generating formatted WhatsApp message (auto-retrying if busy)..."):
        try:
            output = call_gemini_safe(
                client=client,
                prompt_text=prompt,
                system_instruction=WHATSAPP_SYSTEM if 'WHATSAPP_SYSTEM' in locals() else "You are a WhatsApp formatting expert."
            )
        except Exception as e:
            st.error(f"AI Generation Error (High demand / 503): {e}. Please retry in 5 seconds.")

# Safely displays output without NameError
if output:
    st.subheader("Your Formatted WhatsApp Message")
    st.code(output, language="markdown")
    if 'save_history' in locals():
        save_history("WhatsApp Formatter", output)
`;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">Local Business AI Suite</h2>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  gemini-3.8-flash
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                WhatsApp Business formatter, customer review responses, local SEO rankings, social campaigns, and history management.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowStreamlitFix(!showStreamlitFix)}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 transition-colors flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Streamlit App Fix</span>
              {showStreamlitFix ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                showHistory
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History ({history.length})</span>
            </button>

            {!isKeyReady && (
              <button
                onClick={onOpenKeyGuide}
                className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Configure Key
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Franchise Store Bar */}
      {activeLocation && (
        <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div>
              <span className="text-slate-400">Enterprise Franchise Store:</span>{" "}
              <strong className="text-white">{activeLocation.name}</strong>{" "}
              <span className="text-slate-400 font-mono">({activeLocation.city})</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {allLocations && allLocations.length > 1 && onSelectLocation && (
              <select
                value={activeLocation.id}
                onChange={(e) => onSelectLocation(e.target.value)}
                className="bg-slate-900 border border-indigo-500/40 rounded-lg px-2.5 py-1 text-xs text-indigo-200 focus:outline-none focus:border-indigo-400 font-medium"
              >
                {allLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.city})
                  </option>
                ))}
              </select>
            )}

            {onOpenFranchise && (
              <button
                type="button"
                onClick={onOpenFranchise}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 transition-colors"
              >
                Franchise Hub →
              </button>
            )}

            {onOpenGeoGrid && (
              <button
                type="button"
                onClick={onOpenGeoGrid}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 transition-colors flex items-center gap-1"
              >
                <Crosshair className="w-3 h-3" />
                <span>Geo-Grid Radar (5x5) →</span>
              </button>
            )}

            {guardrails && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono">
                🛡️ Max {guardrails.maxDiscountPercent}% off enforced
              </span>
            )}
          </div>
        </div>
      )}

      {/* Streamlit Diagnostic & Fix Banner */}
      {showStreamlitFix && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
              <Wrench className="w-4 h-4 text-indigo-400" />
              <span>Fix Guide: <code>503 UNAVAILABLE (High Demand), Model 404 & File Restoration</code></span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(pythonStreamlitFixCode);
                setCopiedPythonFix(true);
                setTimeout(() => setCopiedPythonFix(false), 2000);
              }}
              className="text-xs px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-colors"
            >
              {copiedPythonFix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPythonFix ? "Copied Python Fix!" : "Copy Python Fix"}</span>
            </button>
          </div>

          {/* Recovery Warning Banner */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <AlertCircle className="w-4 h-4" />
              <span>Fix for SyntaxError on line 736: <code>else: invalid syntax</code></span>
            </div>
            <p className="text-slate-300">
              In Python, an <code>else:</code> statement throws <strong>invalid syntax</strong> when either:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 font-mono text-[11px]">
              <li><strong>Mismatched Indentation:</strong> The <code>else:</code> is indented with 2 spaces while its matching <code>if</code> has 4 spaces (or 0 spaces). Ensure the indentation of <code>else:</code> exactly matches the <code>if</code> above it.</li>
              <li><strong>Interrupted Block:</strong> A line of code was placed between the <code>if</code> block and <code>else:</code> at an outer indentation level, which disconnected the <code>else:</code>.</li>
              <li><strong>Unclosed String/Triple Quotes:</strong> A preceding prompt (e.g. <code>prompt = f"""...</code>) is missing its closing <code>"""</code>.</li>
              <li><strong>Empty <code>if</code> Block:</strong> If the lines inside the <code>if</code> are empty or commented out, put <code>pass</code> under the <code>if</code>.</li>
            </ol>
          </div>

          <div className="text-xs text-slate-300 space-y-2">
            <p className="font-semibold text-slate-200">
              Why <code>503 UNAVAILABLE</code> happened and how the code below fixes it:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li><strong className="text-rose-300 font-mono">ServerError: 503 UNAVAILABLE:</strong> Google AI servers experienced a temporary high-demand spike. The helper function below implements automatic exponential backoff retry (1.5s, 3s) and auto-fallback to <code className="text-emerald-300 font-mono">gemini-flash-latest</code>.</li>
              <li><strong className="text-emerald-300 font-mono">Model 404 NOT_FOUND:</strong> Google deprecated <code className="text-rose-300 font-mono">gemini-2.5-flash</code>. The helper below uses <code className="text-emerald-300 font-mono">gemini-3.8-flash</code>.</li>
              <li><strong className="text-amber-300 font-mono">Targeted Replacement:</strong> Only replace lines 880–935 in your restored <code>app.py</code> with STEP 3 below, so the rest of your app stays intact!</li>
            </ul>
          </div>

          <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
            {pythonStreamlitFixCode}
          </pre>
        </div>
      )}

      {/* Feature Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <button
          onClick={() => {
            setActiveTab("whatsapp_formatter");
            setResult("");
          }}
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
            activeTab === "whatsapp_formatter"
              ? "bg-slate-900 text-emerald-300 border-emerald-500/40 shadow-sm ring-1 ring-emerald-500/20"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900/40"
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span>WhatsApp Formatter</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">HOT</span>
            </div>
            <div className="text-[10px] text-slate-500 font-normal">Bold, emojis & CTA</div>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTab("review_responder");
            setResult("");
          }}
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
            activeTab === "review_responder"
              ? "bg-slate-900 text-emerald-300 border-emerald-500/40 shadow-sm"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900/40"
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Star className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div>Review Responder</div>
            <div className="text-[10px] text-slate-500 font-normal">Google & Yelp</div>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTab("social_post");
            setResult("");
          }}
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
            activeTab === "social_post"
              ? "bg-slate-900 text-emerald-300 border-emerald-500/40 shadow-sm"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900/40"
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Share2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div>Social Campaigns</div>
            <div className="text-[10px] text-slate-500 font-normal">Instagram & Facebook</div>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTab("seo_optimizer");
            setResult("");
          }}
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
            activeTab === "seo_optimizer"
              ? "bg-slate-900 text-emerald-300 border-emerald-500/40 shadow-sm"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900/40"
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Search className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div>Local SEO & Google</div>
            <div className="text-[10px] text-slate-500 font-normal">Rank higher locally</div>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTab("customer_email");
            setResult("");
          }}
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
            activeTab === "customer_email"
              ? "bg-slate-900 text-emerald-300 border-emerald-500/40 shadow-sm"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900/40"
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div>Email & SMS Copy</div>
            <div className="text-[10px] text-slate-500 font-normal">VIP newsletters & promos</div>
          </div>
        </button>
      </div>

      {/* History Drawer */}
      {showHistory && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-semibold text-slate-200">Generated History ({history.length})</h3>
            </div>
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">
              No saved history yet. Generate content to see history here!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setResult(item.result);
                    setActiveTab(item.tab);
                  }}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-emerald-300">{item.tabLabel}</span>
                    <span className="text-slate-500 text-[10px]">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 truncate">{item.summary}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1 italic font-sans">{item.result}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Workspace: Input Form vs Generated Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            {/* Global Business Name input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Your Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* TAB 0: WhatsApp Formatter */}
            {activeTab === "whatsapp_formatter" && (
              <div className="space-y-4 pt-2 border-t border-slate-800/80">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Customer / Recipient Name
                    </label>
                    <input
                      type="text"
                      value={waCustomerName}
                      onChange={(e) => setWaCustomerName(e.target.value)}
                      placeholder="e.g. John or Customer"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Message Objective
                    </label>
                    <select
                      value={waMessageGoal}
                      onChange={(e) => setWaMessageGoal(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Order Dispatched / Ready for Pickup">Order Dispatched / Ready</option>
                      <option value="Appointment / Booking Confirmation">Appointment Confirmation</option>
                      <option value="Weekend Flash Sale & Discount">Flash Sale & Discount Promo</option>
                      <option value="5-Star Google Review Request">Google Review Request</option>
                      <option value="Invoice & Payment Reminder">Payment Reminder</option>
                      <option value="Customer Support Resolution">Customer Support Follow-up</option>
                    </select>
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1.5">
                    Quick Preset Scenarios
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      {
                        label: "🥐 Order Ready",
                        goal: "Order Dispatched / Ready for Pickup",
                        details: "Order #8291 of handcrafted sourdough loaves & cinnamon rolls is packaged and ready at the front counter.",
                        cta: "Reply 1 to confirm pickup, or call 555-0192 for curbside delivery."
                      },
                      {
                        label: "📅 Booking Confirmed",
                        goal: "Appointment / Booking Confirmation",
                        details: "Reserved table for 4 guests this Friday at 7:30 PM under Jennifer.",
                        cta: "Please reply YES to confirm or let us know if you need to adjust guest count."
                      },
                      {
                        label: "🎁 VIP 20% Off",
                        goal: "Weekend Flash Sale & Discount",
                        details: "Flash weekend special: 20% off all artisan cakes and specialty beans with code SWEET20.",
                        cta: "Show this WhatsApp message at checkout or order online at artisanbakery.com"
                      },
                      {
                        label: "⭐ Review Request",
                        goal: "5-Star Google Review Request",
                        details: "Thank you for visiting us this morning! We hope you loved the warm pastries and fresh coffee.",
                        cta: "Could you take 30 seconds to share your review on Google? Link: g.page/artisan-bakery/review"
                      }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setWaMessageGoal(preset.goal);
                          setWaKeyDetails(preset.details);
                          setWaCtaText(preset.cta);
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Key Details / Context
                  </label>
                  <textarea
                    value={waKeyDetails}
                    onChange={(e) => setWaKeyDetails(e.target.value)}
                    rows={3}
                    placeholder="Enter order numbers, items, booking time, or promotion details..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Call to Action (CTA)
                    </label>
                    <input
                      type="text"
                      value={waCtaText}
                      onChange={(e) => setWaCtaText(e.target.value)}
                      placeholder="e.g. Reply YES to confirm"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Communication Tone
                    </label>
                    <select
                      value={waTone}
                      onChange={(e) => setWaTone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Friendly, warm & professional">Friendly & Professional</option>
                      <option value="Casual, energetic & conversational">Casual & Energetic</option>
                      <option value="Direct, urgent & action-oriented">Urgent & Direct</option>
                      <option value="Polite, respectful & luxury">Courteous & Formal</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: Review Responder Form */}
            {activeTab === "review_responder" && (
              <div className="space-y-4 pt-2 border-t border-slate-800/80">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. John D."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Star Rating
                    </label>
                    <div className="flex items-center gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={`p-1 rounded transition-colors ${
                            star <= reviewRating ? "text-amber-400" : "text-slate-600 hover:text-slate-500"
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                      <span className="text-xs text-slate-400 ml-2 font-mono">
                        {reviewRating}/5 stars
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Customer Review Text
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={3}
                    placeholder="Paste the customer's Google, Yelp, or Facebook review..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Desired Response Tone
                  </label>
                  <select
                    value={reviewTone}
                    onChange={(e) => setReviewTone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Warm, Gracious & Community-Oriented">Warm, Gracious & Community-Oriented</option>
                    <option value="Professional & Service-Focused">Professional & Service-Focused</option>
                    <option value="Empathetic, Apologetic & Solution-Driven">Empathetic & Solution-Driven (for negative reviews)</option>
                    <option value="Playful & Fun">Playful & Fun (for trendy cafes/bars)</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB 2: Social Campaigns Form */}
            {activeTab === "social_post" && (
              <div className="space-y-4 pt-2 border-t border-slate-800/80">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Industry / Niche
                    </label>
                    <input
                      type="text"
                      value={socialIndustry}
                      onChange={(e) => setSocialIndustry(e.target.value)}
                      placeholder="e.g. Italian Restaurant, HVAC, Barber Shop"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Target Platform
                    </label>
                    <select
                      value={socialPlatform}
                      onChange={(e) => setSocialPlatform(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Instagram & Facebook">Instagram & Facebook</option>
                      <option value="TikTok & Reels (Short Video Script)">TikTok / Reels Script</option>
                      <option value="LinkedIn (B2B Local Services)">LinkedIn (B2B Services)</option>
                      <option value="Twitter / X Local Buzz">Twitter / X</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Goal or Campaign Objective
                  </label>
                  <input
                    type="text"
                    value={socialObjective}
                    onChange={(e) => setSocialObjective(e.target.value)}
                    placeholder="e.g. Weekend brunch promotion, hiring announcements, new equipment showcase"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Special Offer / Specific Details
                  </label>
                  <textarea
                    value={socialOffer}
                    onChange={(e) => setSocialOffer(e.target.value)}
                    rows={2}
                    placeholder="e.g. 20% off for first 50 customers this Saturday, free diagnosis with repair"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Local SEO Form */}
            {activeTab === "seo_optimizer" && (
              <div className="space-y-4 pt-2 border-t border-slate-800/80">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      City & Neighborhood
                    </label>
                    <input
                      type="text"
                      value={seoCity}
                      onChange={(e) => setSeoCity(e.target.value)}
                      placeholder="e.g. Brooklyn, NY (Williamsburg)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Primary Category
                    </label>
                    <input
                      type="text"
                      value={seoCategory}
                      onChange={(e) => setSeoCategory(e.target.value)}
                      placeholder="e.g. Specialty Coffee Shop, Emergency Plumber"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Core Services / Products Offered
                  </label>
                  <input
                    type="text"
                    value={seoServices}
                    onChange={(e) => setSeoServices(e.target.value)}
                    placeholder="e.g. Espresso catering, custom sourdough loaves, corporate breakfast boxes"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Unique Selling Points / Differentiators
                  </label>
                  <input
                    type="text"
                    value={seoDifferentiators}
                    onChange={(e) => setSeoDifferentiators(e.target.value)}
                    placeholder="e.g. 24/7 emergency dispatch, 500+ 5-star reviews, licensed & insured"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: Customer Email & SMS Form */}
            {activeTab === "customer_email" && (
              <div className="space-y-4 pt-2 border-t border-slate-800/80">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Campaign Type
                    </label>
                    <select
                      value={emailType}
                      onChange={(e) => setEmailType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Seasonal Promo & Weekend Special">Seasonal Promo</option>
                      <option value="VIP Loyalty Club Newsletter">VIP Loyalty Club</option>
                      <option value="Appointment or Service Reminder">Service Reminder</option>
                      <option value="We Miss You (Win-Back Campaign)">Customer Win-Back</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Discount Code
                    </label>
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="e.g. SAVE20"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Key Message / Announcement
                  </label>
                  <textarea
                    value={emailKeyMessage}
                    onChange={(e) => setEmailKeyMessage(e.target.value)}
                    rows={3}
                    placeholder="What is the news, new menu item, or seasonal discount?"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="bg-rose-950/30 border border-rose-900/50 rounded-xl p-3 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMsg}</div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                isGenerating
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/40 hover:scale-[1.01]"
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Drafting with Gemini 3.8 Flash...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {activeTab === "whatsapp_formatter"
                      ? "Format for WhatsApp 💬"
                      : "Generate High-Converting Copy"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Results Display */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 min-h-[460px] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-200">
                    {activeTab === "whatsapp_formatter" ? "Formatted WhatsApp Message" : "Generated Output"}
                  </h3>
                  {result && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/30 border border-emerald-900/40 text-emerald-400">
                      Ready to Use
                    </span>
                  )}
                </div>

                {result && (
                  <div className="flex items-center gap-1.5">
                    {activeTab === "whatsapp_formatter" && (
                      <button
                        onClick={handleOpenWhatsAppWeb}
                        className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-1.5 transition-colors"
                        title="Open in WhatsApp Web with prefilled message"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Open in WhatsApp</span>
                      </button>
                    )}

                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                )}
              </div>

              {result ? (
                <div className="space-y-3">
                  {/* WhatsApp Mobile Chat Bubble Preview if WhatsApp tab */}
                  {activeTab === "whatsapp_formatter" && (
                    <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-emerald-400 font-medium">
                        <span className="flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp Preview (Formatted for Mobile Chat)</span>
                        </span>
                        <span className="text-[10px] text-slate-400">Sent just now</span>
                      </div>
                      <div className="bg-[#128C7E]/10 border border-[#25D366]/20 rounded-lg p-3 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
                        {result}
                      </div>
                    </div>
                  )}

                  {/* Raw Output Block */}
                  {activeTab !== "whatsapp_formatter" && (
                    <div className="p-4 bg-slate-900/80 border border-slate-800/80 rounded-xl text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans selection:bg-emerald-500/40 max-h-[500px] overflow-y-auto">
                      {result}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center text-xs text-slate-500 space-y-2">
                  {activeTab === "whatsapp_formatter" ? (
                    <>
                      <MessageSquare className="w-8 h-8 mx-auto text-emerald-500/50" />
                      <p className="text-slate-300 font-medium">WhatsApp Business Formatter</p>
                      <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                        Generates bold headings (*like this*), italic notes (_like this_), emoji bullets, and clean calls-to-action ready to send directly to your customers.
                      </p>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-8 h-8 mx-auto text-slate-600" />
                      <p>Configure the parameters on the left and click Generate.</p>
                      <p className="text-[11px] text-slate-600">
                        Outputs are customized for Google Maps, Yelp, social feeds, and local search algorithms.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {result && (
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Model: Gemini 3.8 Flash</span>
                <span>Optimized for local business conversions</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
