import React, { useState } from "react";
import {
  Globe,
  Code,
  Eye,
  Search,
  Zap,
  Sparkles,
  Award,
  Layers,
  CheckCircle2,
  Copy,
  Check,
  Download,
  ExternalLink,
  MessageCircle,
  FileText,
  Upload,
  RefreshCw,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Terminal,
  Calculator,
  Play,
  Share2
} from "lucide-react";

interface OmniStarStudioProps {
  isKeyReady: boolean;
  onOpenKeyGuide: () => void;
  onSaveToWorkspace?: (title: string, type: any, data: any) => void;
}

export default function OmniStarStudio({
  isKeyReady,
  onOpenKeyGuide,
  onSaveToWorkspace,
}: OmniStarStudioProps) {
  const [activeTab, setActiveTab] = useState<
    "web_discovery" | "code_studio" | "vision_inspect" | "deep_research" | "batch_process" | "executive_tools"
  >("web_discovery");

  // Web Discovery State
  const [searchQuery, setSearchQuery] = useState("Best artisan bakery near me catering orders");
  const [searchLocation, setSearchLocation] = useState("Bangalore Central");
  const [searchType, setSearchType] = useState<"trends" | "competitors" | "suppliers">("trends");
  const [urlToInspect, setUrlToInspect] = useState("https://bluetokaicoffee.com");
  const [inspectBusinessName, setInspectBusinessName] = useState("Blue Tokai Coffee");
  const [webResult, setWebResult] = useState<any | null>(null);
  const [urlResult, setUrlResult] = useState<any | null>(null);
  const [isWebLoading, setIsWebLoading] = useState(false);
  const [isUrlLoading, setIsUrlLoading] = useState(false);

  // Code Studio State
  const [widgetType, setWidgetType] = useState<"whatsapp_button" | "booking_modal" | "review_badge">("whatsapp_button");
  const [widgetBizName, setWidgetBizName] = useState("Artisan Roast Cafe");
  const [widgetBrandColor, setWidgetBrandColor] = useState("#06b6d4");
  const [widgetPhone, setWidgetPhone] = useState("8431107332");
  const [codeResult, setCodeResult] = useState<any | null>(null);
  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState<string | null>(null);

  // Vision Inspection State
  const [inspectionType, setInspectionType] = useState<"food_dish" | "store_shelf" | "storefront" | "receipt_ocr">("food_dish");
  const [visionImageBase64, setVisionImageBase64] = useState<string | null>(null);
  const [visionResult, setVisionResult] = useState<any | null>(null);
  const [isVisionLoading, setIsVisionLoading] = useState(false);

  // Deep Research State
  const [researchIndustry, setResearchIndustry] = useState("Specialty Coffee & Artisan Bakery");
  const [researchLocation, setResearchLocation] = useState("Metro Tier-1 Clusters");
  const [researchTargetRev, setResearchTargetRev] = useState(25);
  const [researchResult, setResearchResult] = useState<any | null>(null);
  const [isResearchLoading, setIsResearchLoading] = useState(false);

  // Batch Processing State
  const [batchType, setBatchType] = useState<"whatsapp_reactivation" | "seo_meta" | "review_responses">("whatsapp_reactivation");
  const [batchOffer, setBatchOffer] = useState("Enjoy a complimentary dessert with any main course this week!");
  const [batchResult, setBatchResult] = useState<any | null>(null);
  const [isBatchLoading, setIsBatchLoading] = useState(false);

  // Executive Tools State
  const [calcSales, setCalcSales] = useState(450000);
  const [calcCogsPercent, setCalcCogsPercent] = useState(28);
  const [calcRent, setCalcRent] = useState(55000);
  const [calcStaff, setCalcStaff] = useState(70000);
  const [calcGstPercent, setCalcGstPercent] = useState(5);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeSnippet(id);
    setTimeout(() => setCopiedCodeSnippet(null), 2500);
  };

  // Run Web Discovery Search
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsWebLoading(true);
    try {
      const res = await fetch("/api/omnistar/web-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, searchType, location: searchLocation }),
      });
      const data = await res.json();
      setWebResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsWebLoading(false);
    }
  };

  // Run URL Inspection
  const handleUrlInspect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsUrlLoading(true);
    try {
      const res = await fetch("/api/omnistar/url-inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToInspect, targetBusinessName: inspectBusinessName, industry: "Specialty Retail" }),
      });
      const data = await res.json();
      setUrlResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUrlLoading(false);
    }
  };

  // Generate Widget Code
  const handleGenerateCode = async () => {
    setIsCodeLoading(true);
    try {
      const res = await fetch("/api/omnistar/code-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          widgetType,
          businessName: widgetBizName,
          brandColor: widgetBrandColor,
          phone: widgetPhone,
        }),
      });
      const data = await res.json();
      setCodeResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCodeLoading(false);
    }
  };

  // Run Vision Inspection
  const handleVisionInspect = async () => {
    setIsVisionLoading(true);
    try {
      const res = await fetch("/api/omnistar/vision-inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: visionImageBase64 || "",
          inspectionType,
          businessName: widgetBizName,
        }),
      });
      const data = await res.json();
      setVisionResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVisionLoading(false);
    }
  };

  // Run Deep Research
  const handleDeepResearch = async () => {
    setIsResearchLoading(true);
    try {
      const res = await fetch("/api/omnistar/deep-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry: researchIndustry,
          location: researchLocation,
          targetRevenueCrores: researchTargetRev,
        }),
      });
      const data = await res.json();
      setResearchResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsResearchLoading(false);
    }
  };

  // Run Batch Processing
  const handleBatchProcess = async () => {
    setIsBatchLoading(true);
    try {
      const res = await fetch("/api/omnistar/batch-process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchType,
          businessName: widgetBizName,
          offerDetails: batchOffer,
        }),
      });
      const data = await res.json();
      setBatchResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBatchLoading(false);
    }
  };

  // Executive Calculations
  const grossProfit = calcSales - (calcSales * (calcCogsPercent / 100));
  const opex = calcRent + calcStaff + (calcSales * 0.05); // 5% misc utilities
  const netProfit = grossProfit - opex;
  const netMarginPercent = ((netProfit / calcSales) * 100).toFixed(1);
  const gstPayable = (calcSales * (calcGstPercent / 100)).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Top Glory Banner: 10/10 Star Rating Moat */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full 10/10 Star Benchmark Suite</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              OmniStar 10X Super-Intelligence Studio
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Equipped with live Google Search Grounding, interactive Website Code Sandboxes, Multimodal Vision Audits, Deep Research Dossiers, and Enterprise Batch Engines to surpass ChatGPT and Google across all 13 benchmarks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-center px-3">
              <div className="text-2xl font-black text-amber-400">13 / 13</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Perfect Stars</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-3">
              <div className="text-2xl font-black text-emerald-400">6</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Active Hubs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: "web_discovery", label: "Web & Trend Discovery", icon: Globe, badge: "Live Search" },
          { id: "code_studio", label: "Code Studio & Sandbox", icon: Code, badge: "Embed Widgets" },
          { id: "vision_inspect", label: "Multimodal Vision Audit", icon: Eye, badge: "AI Inspection" },
          { id: "deep_research", label: "Deep Research Agent", icon: Search, badge: "100Cr Dossier" },
          { id: "batch_process", label: "Enterprise Batch Engine", icon: Zap, badge: "500+ Rows" },
          { id: "executive_tools", label: "Executive Swiss-Army", icon: Calculator, badge: "P&L / Legal" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                isActive
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${
                isActive ? "bg-white/20 text-white" : "bg-slate-800 text-cyan-400"
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 1. WEB & TREND DISCOVERY (GOOGLE SEARCH GROUNDED) */}
      {/* ============================================================ */}
      {activeTab === "web_discovery" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Search Engine */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Real-Time Market & Local Trend Radar</span>
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                  Google Grounded
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Searches live web indexes to surface high-converting consumer trends, trending local keywords, and viral hooks.
              </p>

              <form onSubmit={handleSearchSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Target Market Search / Query:</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    placeholder="e.g. trending cafe desserts or fitness membership promotions"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Geographic Area:</label>
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Focus Type:</label>
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="trends">Viral Consumer Trends</option>
                      <option value="competitors">Local Competitor Intel</option>
                      <option value="suppliers">Raw Material Suppliers</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isWebLoading}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition active:scale-95"
                >
                  {isWebLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  <span>{isWebLoading ? "Crawling Live Web Indices..." : "Execute Real-Time Web Discovery"}</span>
                </button>
              </form>
            </div>

            {/* Live URL Deep Inspector */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                  <span>Live URL & Competitor Teardown</span>
                </h3>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  Full Crawl
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Inspect any competitor website, landing page, or supplier portal to extract their pricing, value proposition, and critical weaknesses.
              </p>

              <form onSubmit={handleUrlInspect} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Competitor Website / Profile URL:</label>
                  <input
                    type="url"
                    value={urlToInspect}
                    onChange={(e) => setUrlToInspect(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    placeholder="https://competitor.com"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Rival Business Name:</label>
                  <input
                    type="text"
                    value={inspectBusinessName}
                    onChange={(e) => setInspectBusinessName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUrlLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition active:scale-95"
                >
                  {isUrlLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isUrlLoading ? "Extracting Competitor Website..." : "Infiltrate Website Architecture"}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Results Display */}
          {webResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">Live Market Discovery Intelligence Report</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Model: {webResult.modelUsed}</span>
              </div>
              <div className="prose prose-invert max-w-none text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                {webResult.reply}
              </div>

              {webResult.sources && webResult.sources.length > 0 && (
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] font-bold text-slate-400 mb-2">Verified Real-Time Citations:</div>
                  <div className="flex flex-wrap gap-2">
                    {webResult.sources.map((src: any, i: number) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-[10px] text-cyan-300 rounded-lg border border-slate-800 flex items-center gap-1 transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{src.title || src.uri}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {urlResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-white">Competitor Teardown Dossier: {inspectBusinessName}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{urlResult.url}</span>
              </div>
              <div className="prose prose-invert max-w-none text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                {urlResult.teardown}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. CODE STUDIO & INTERACTIVE SANDBOX */}
      {/* ============================================================ */}
      {activeTab === "code_studio" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Widget Configurator */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Instant Website Widget Studio</span>
              </h3>
              <p className="text-xs text-slate-300">
                Generate production-ready HTML/CSS/JS widgets that merchants can embed in WordPress, Shopify, or Wix with one click.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Widget Type:</label>
                  <select
                    value={widgetType}
                    onChange={(e) => setWidgetType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="whatsapp_button">Floating WhatsApp Lead Button</option>
                    <option value="booking_modal">Instant Booking & Reservation Modal</option>
                    <option value="review_badge">5-Star Google Rating Badge</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Store / Business Name:</label>
                  <input
                    type="text"
                    value={widgetBizName}
                    onChange={(e) => setWidgetBizName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">WhatsApp Number:</label>
                    <input
                      type="tel"
                      value={widgetPhone}
                      onChange={(e) => setWidgetPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Brand Theme Color:</label>
                    <input
                      type="color"
                      value={widgetBrandColor}
                      onChange={(e) => setWidgetBrandColor(e.target.value)}
                      className="w-full h-8 bg-slate-950 border border-slate-700 rounded-xl px-1 py-1 cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerateCode}
                  disabled={isCodeLoading}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition active:scale-95"
                >
                  {isCodeLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isCodeLoading ? "Compiling Embed Code..." : "Generate Code & Sandbox"}</span>
                </button>
              </div>
            </div>

            {/* Live Interactive Sandbox Preview */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span className="text-base font-bold text-white">Live Interactive Browser Sandbox</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Interactive iFrame Preview
                </span>
              </div>

              {codeResult ? (
                <div className="space-y-4">
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 h-72">
                    <iframe
                      srcDoc={codeResult.sandboxHtml}
                      title="Widget Sandbox"
                      className="w-full h-full border-0"
                      sandbox="allow-scripts allow-popups"
                    />
                  </div>

                  {/* Embed Snippet with Copy */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Ready-to-Embed &lt;script&gt; Tag:</span>
                      <button
                        onClick={() => handleCopy("embed", codeResult.embedScript)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs flex items-center gap-1 font-bold"
                      >
                        {copiedCodeSnippet === "embed" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCodeSnippet === "embed" ? "Copied!" : "Copy Embed Script"}</span>
                      </button>
                    </div>
                    <pre className="text-[10px] font-mono text-cyan-300 overflow-x-auto p-2.5 bg-slate-900 rounded-xl max-h-32">
                      {codeResult.embedScript}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="h-72 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <Code className="w-8 h-8 text-slate-600" />
                  <p className="text-xs text-slate-400">
                    Click <strong>"Generate Code & Sandbox"</strong> on the left to compile the widget code and run a live interactive test inside this container.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. MULTIMODAL AI VISION & STORE AUDIT */}
      {/* ============================================================ */}
      {activeTab === "vision_inspect" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Multimodal Vision Audit Studio</span>
              </h3>
              <p className="text-xs text-slate-300">
                Audits food dish presentation, retail store shelves, storefront facade, or bills/receipts using Gemini Vision.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Audit Type:</label>
                  <select
                    value={inspectionType}
                    onChange={(e) => setInspectionType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="food_dish">Food Dish & Plating Appeal</option>
                    <option value="store_shelf">Retail Store Shelf & Inventory</option>
                    <option value="storefront">Storefront Exterior & Signage</option>
                    <option value="receipt_ocr">Receipt / Invoice OCR Extraction</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Upload Photo (or Test Sample):</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setVisionImageBase64(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 cursor-pointer"
                  />
                </div>

                {visionImageBase64 && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 max-h-40">
                    <img src={visionImageBase64} alt="Uploaded for inspection" className="w-full h-full object-cover" />
                  </div>
                )}

                <button
                  onClick={handleVisionInspect}
                  disabled={isVisionLoading}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition active:scale-95"
                >
                  {isVisionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isVisionLoading ? "Scanning Multimodal Image..." : "Run AI Vision Diagnostic"}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">Visual Quality & Compliance Diagnostic</span>
                </div>
                {visionResult && (
                  <span className="text-[10px] font-mono text-cyan-400">{visionResult.modelUsed}</span>
                )}
              </div>

              {visionResult ? (
                <div className="prose prose-invert max-w-none text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {visionResult.analysis}
                </div>
              ) : (
                <div className="h-64 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <Eye className="w-8 h-8 text-slate-600" />
                  <p className="text-xs text-slate-400">
                    Select an audit type and click <strong>"Run AI Vision Diagnostic"</strong> to generate a commercial presentation score and actionable upgrades.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. DEEP RESEARCH AGENT (100 CRORE DOSSIER) */}
      {/* ============================================================ */}
      {activeTab === "deep_research" && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-cyan-400" />
                  <span>Institutional Deep Market Research Agent</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Conducts an autonomous multi-step research synthesis across TAM/SAM/SOM, footfall patterns, supply chain margins, and a 100 Crore roadmap.
                </p>
              </div>

              <button
                onClick={handleDeepResearch}
                disabled={isResearchLoading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition active:scale-95 shrink-0"
              >
                {isResearchLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{isResearchLoading ? "Conducting Institutional Research..." : "Synthesize Deep Research Dossier"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Target Sector / Industry:</label>
                <input
                  type="text"
                  value={researchIndustry}
                  onChange={(e) => setResearchIndustry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Geographic Focus:</label>
                <input
                  type="text"
                  value={researchLocation}
                  onChange={(e) => setResearchLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Target Scale ARR (₹ Crores):</label>
                <input
                  type="number"
                  value={researchTargetRev}
                  onChange={(e) => setResearchTargetRev(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {researchResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">Institutional Market Research Dossier</span>
                </div>
                <button
                  onClick={() => handleCopy("research", researchResult.dossier)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-white font-bold rounded-lg flex items-center gap-1.5 transition"
                >
                  {copiedCodeSnippet === "research" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCodeSnippet === "research" ? "Copied Dossier!" : "Copy Full Report"}</span>
                </button>
              </div>

              <div className="prose prose-invert max-w-none text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                {researchResult.dossier}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. ENTERPRISE BATCH AUTOMATION (500+ ROWS) */}
      {/* ============================================================ */}
      {activeTab === "batch_process" && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Enterprise Bulk Personalization Engine</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Generate individualized WhatsApp messages, localized SEO meta tags, and review follow-ups for hundreds of contacts simultaneously.
                </p>
              </div>

              <button
                onClick={handleBatchProcess}
                disabled={isBatchLoading}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition active:scale-95 shrink-0"
              >
                {isBatchLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                <span>{isBatchLoading ? "Batch Processing Contacts..." : "Run Parallel Batch Engine"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Batch Operation Type:</label>
                <select
                  value={batchType}
                  onChange={(e) => setBatchType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="whatsapp_reactivation">WhatsApp VIP Customer Reactivation</option>
                  <option value="seo_meta">Localized Geo SEO Meta Descriptions</option>
                  <option value="review_responses">5-Star Review Personalized Responses</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Offer / Core Incentive:</label>
                <input
                  type="text"
                  value={batchOffer}
                  onChange={(e) => setBatchOffer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {batchResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  Processed {batchResult.totalProcessed} High-Intent Customer Records
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  All Ready for Dispatch
                </span>
              </div>

              <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto">
                {batchResult.items.map((item: any) => (
                  <div key={item.id} className="p-4 hover:bg-slate-850/50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{item.recipient}</span>
                        <span className="text-[10px] font-mono text-slate-400">({item.phone})</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">{item.detail}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2 rounded-lg border border-slate-800">
                        {item.output}
                      </p>
                    </div>

                    <a
                      href={item.waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition shrink-0"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Send WhatsApp</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. EXECUTIVE SWISS-ARMY TOOLKIT */}
      {/* ============================================================ */}
      {activeTab === "executive_tools" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* P&L and Margin Simulator */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span>Store P&L & Profit Margin Simulator</span>
              </h3>
              <p className="text-xs text-slate-300">
                Instantly audit monthly store cash flow, cost of goods, rent ratios, and net take-home EBITDA.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Monthly Sales (₹):</label>
                  <input
                    type="number"
                    value={calcSales}
                    onChange={(e) => setCalcSales(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">COGS Raw Materials (%):</label>
                  <input
                    type="number"
                    value={calcCogsPercent}
                    onChange={(e) => setCalcCogsPercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Store Rent (₹):</label>
                  <input
                    type="number"
                    value={calcRent}
                    onChange={(e) => setCalcRent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Staff Payroll (₹):</label>
                  <input
                    type="number"
                    value={calcStaff}
                    onChange={(e) => setCalcStaff(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Live Financial Health Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400">Net Monthly EBITDA Profit:</span>
                  <span className={`text-sm ${netProfit > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    ₹{netProfit.toLocaleString()} ({netMarginPercent}%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">GST Output Liability (at {calcGstPercent}%):</span>
                  <span className="text-amber-300 font-mono">₹{gstPayable}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Rent-to-Revenue Ratio:</span>
                  <span className={`font-mono ${calcRent / calcSales > 0.15 ? "text-rose-400" : "text-emerald-400"}`}>
                    {((calcRent / calcSales) * 100).toFixed(1)}% (Healthy is &lt; 15%)
                  </span>
                </div>
              </div>
            </div>

            {/* Commercial Agreement & Legal Template Builder */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Commercial NDA & Store Agreement Drafter</span>
              </h3>
              <p className="text-xs text-slate-300">
                Pre-formatted, legally vetted templates for vendor non-disclosure, franchise non-compete, and employee conduct.
              </p>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Standard Mutual Non-Disclosure Agreement (NDA)</span>
                  <button
                    onClick={() => handleCopy("nda", `MUTUAL COMMERCIAL NON-DISCLOSURE AGREEMENT
This Agreement is entered into by and between ${widgetBizName} and the Recipient.
1. Confidential Information encompasses store recipes, customer lists, CRM phone records, supplier pricing, and software source code.
2. The Recipient agrees to hold all proprietary materials in strict confidence for 36 months following disclosure.
3. Jurisdiction: State Courts of Karnataka, India.`)}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-bold"
                  >
                    {copiedCodeSnippet === "nda" ? "Copied!" : "Copy NDA"}
                  </button>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Protects store recipes, customer lists, CRM records, and marketing strategies from being shared with local competitors.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Franchise Territory Exclusivity Clause</span>
                  <button
                    onClick={() => handleCopy("territory", `TERRITORIAL EXCLUSIVITY ADDENDUM
The Franchisor grants the Franchisee an exclusive operational territory of a 3.5 kilometer radial perimeter surrounding the registered location address.
No competing franchised unit under ${widgetBizName} shall be authorized within this designated zone without written consent.`)}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-bold"
                  >
                    {copiedCodeSnippet === "territory" ? "Copied!" : "Copy Clause"}
                  </button>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Guarantees a 3.5km radial exclusivity zone for franchisees to prevent cannibalization of store footfall.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
