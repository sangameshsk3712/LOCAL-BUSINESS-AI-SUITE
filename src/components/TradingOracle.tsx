import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart2,
  ShieldAlert,
  Zap,
  Target,
  Sparkles,
  Calculator,
  BookOpen,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  Layers,
  Compass,
  ArrowRight,
  HelpCircle,
  Clock,
  DollarSign,
  PieChart,
  Activity,
  Flame,
  Globe2,
  ChevronRight,
  ShieldCheck,
  Award
} from "lucide-react";

interface TradingOracleProps {
  isKeyReady: boolean;
  onOpenKeyGuide: () => void;
  onUpgradeToPro?: () => void;
}

interface MarketAsset {
  symbol: string;
  name: string;
  category: "india" | "us" | "crypto" | "forex" | "commodity";
  defaultTf: string;
  tag: string;
}

const PRESET_ASSETS: MarketAsset[] = [
  { symbol: "NIFTY 50", name: "NSE Nifty 50 Index", category: "india", defaultTf: "Intraday (15m-1h)", tag: "Indian Benchmark" },
  { symbol: "BANK NIFTY", name: "NSE Bank Nifty F&O", category: "india", defaultTf: "Intraday (15m-1h)", tag: "High Volatility" },
  { symbol: "FINNIFTY", name: "Nifty Financial Services", category: "india", defaultTf: "Intraday (15m-1h)", tag: "Weekly Expiry" },
  { symbol: "RELIANCE", name: "Reliance Industries Ltd", category: "india", defaultTf: "Swing (4h-1D)", tag: "NSE Bluechip" },
  { symbol: "TATA MOTORS", name: "Tata Motors Ltd", category: "india", defaultTf: "Swing (4h-1D)", tag: "Auto Sector" },
  { symbol: "BTC/USDT", name: "Bitcoin / Tether", category: "crypto", defaultTf: "Intraday (15m-1h)", tag: "Crypto King" },
  { symbol: "ETH/USDT", name: "Ethereum / Tether", category: "crypto", defaultTf: "Intraday (15m-1h)", tag: "Smart Contracts" },
  { symbol: "SOL/USDT", name: "Solana / Tether", category: "crypto", defaultTf: "Scalping (1m-5m)", tag: "High Beta" },
  { symbol: "S&P 500 (SPX)", name: "Standard & Poor's 500", category: "us", defaultTf: "Swing (4h-1D)", tag: "US Benchmark" },
  { symbol: "NASDAQ-100", name: "Nasdaq Tech Index", category: "us", defaultTf: "Intraday (15m-1h)", tag: "US Tech Giants" },
  { symbol: "NVDA", name: "NVIDIA Corporation", category: "us", defaultTf: "Intraday (15m-1h)", tag: "AI Hardware Leader" },
  { symbol: "EUR/USD", name: "Euro vs US Dollar", category: "forex", defaultTf: "Intraday (15m-1h)", tag: "Global Forex" },
  { symbol: "GBP/USD", name: "British Pound vs USD", category: "forex", defaultTf: "Intraday (15m-1h)", tag: "Cable" },
  { symbol: "USD/INR", name: "US Dollar vs Indian Rupee", category: "forex", defaultTf: "Swing (4h-1D)", tag: "RBI Macro" },
  { symbol: "GOLD (XAU/USD)", name: "Spot Gold vs US Dollar", category: "commodity", defaultTf: "Intraday (15m-1h)", tag: "Safe Haven Metal" },
  { symbol: "CRUDE OIL (WTI)", name: "West Texas Intermediate", category: "commodity", defaultTf: "Intraday (15m-1h)", tag: "Energy Commodity" },
];

export default function TradingOracle({ isKeyReady, onOpenKeyGuide, onUpgradeToPro }: TradingOracleProps) {
  const [activeMarketTab, setActiveMarketTab] = useState<"india" | "us" | "crypto" | "forex" | "commodity">("india");
  const [selectedAsset, setSelectedAsset] = useState<string>("NIFTY 50");
  const [customQuery, setCustomQuery] = useState<string>("");
  const [timeframe, setTimeframe] = useState<string>("Intraday (15m-1h)");
  const [strategyStyle, setStrategyStyle] = useState<string>("Price Action & Smart Money Concepts (SMC)");
  const [capital, setCapital] = useState<number>(100000);
  const [riskPercent, setRiskPercent] = useState<number>(1.5);
  
  // Interactive Risk Calculator states
  const [calcEntryPrice, setCalcEntryPrice] = useState<string>("24500");
  const [calcStopLoss, setCalcStopLoss] = useState<string>("24420");
  const [calcCapital, setCalcCapital] = useState<string>("100000");
  const [calcRiskPct, setCalcRiskPct] = useState<string>("1.5");

  // Output states
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isFallbackEngine, setIsFallbackEngine] = useState<boolean>(false);

  // Filter assets by market category
  const filteredAssets = PRESET_ASSETS.filter((a) => a.category === activeMarketTab);

  const quickPrompts = [
    { title: "⚡ Instant High-Probability Setup", query: "Give me the exact high-probability trade setup, entry zone, invalidation stop-loss, and 1:3 take profit targets." },
    { title: "🧠 Smart Money & Order Block Scan", query: "Identify the institutional Fair Value Gap (FVG), mitigation Order Block, and retail liquidity pools." },
    { title: "📈 Expiry & Option Chain Breakdown", query: "Analyze Put-Call Ratio (PCR), Max Pain, Open Interest shifts, and best option strike to trade." },
    { title: "🛡️ Liquidity Trap & Fakeout Warning", query: "Where are retail stop-losses clustered? Is this breakout legitimate or an engineered trap?" },
    { title: "📊 Position Sizing & Lot Calculation", query: `Calculate the mathematically optimal lot size for ₹${capital} capital risking maximum ${riskPercent}%.` }
  ];

  const handleRunAnalysis = async (customPromptOverride?: string) => {
    const finalQuery = customPromptOverride || customQuery;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const marketNameMap: Record<string, string> = {
        india: "Indian Equities & Derivatives (NSE/BSE)",
        us: "US & Global Equities (Wall Street)",
        crypto: "Cryptocurrency & Digital Assets (24/7)",
        forex: "Foreign Exchange & Macro Currencies (Forex)",
        commodity: "Commodities & Precious Metals (MCX/NYMEX)"
      };

      const res = await fetch("/api/trading/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: finalQuery,
          assetName: selectedAsset,
          market: marketNameMap[activeMarketTab] || "Global Financial Markets",
          timeframe,
          strategyStyle,
          capital,
          riskPercent
        })
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === "API_KEY_NOT_CONFIGURED") {
          setErrorMsg("Your Gemini API Key is not configured yet. Configure it in the API Key guide to access real-time trading intelligence.");
        } else {
          setErrorMsg(data.message || "Trading analysis request failed.");
        }
        return;
      }

      setAnalysisResult(data.analysis);
      setIsFallbackEngine(Boolean(data.isFallback));
    } catch (err: any) {
      setErrorMsg(err.message || "Network request failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (analysisResult) {
      navigator.clipboard.writeText(analysisResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Calculate mathematical risk metrics
  const cCap = parseFloat(calcCapital) || 0;
  const cRiskPct = parseFloat(calcRiskPct) || 0;
  const cEntry = parseFloat(calcEntryPrice) || 0;
  const cStop = parseFloat(calcStopLoss) || 0;

  const maxRiskAmount = (cCap * cRiskPct) / 100;
  const stopLossDistance = Math.abs(cEntry - cStop);
  const positionSizeShares = stopLossDistance > 0 ? Math.floor(maxRiskAmount / stopLossDistance) : 0;
  const totalInvestmentRequired = positionSizeShares * cEntry;
  const target1to2Price = cEntry > cStop ? cEntry + stopLossDistance * 2 : cEntry - stopLossDistance * 2;
  const target1to3Price = cEntry > cStop ? cEntry + stopLossDistance * 3 : cEntry - stopLossDistance * 3;

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Whole World Trading Knowledge & Market Intelligence Oracle</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono text-indigo-300">
                SMC • Price Action • Quantitative Risk
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Institutional Market Answers & Trade Setups
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Synthesizing all global financial market knowledge: Smart Money Concepts (SMC), Order Blocks, Fair Value Gaps, Liquidity Sweeps, Options Greeks, and mathematical risk management across Indian Equities, Crypto, Forex, US Stocks, and Commodities.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <div className="p-3 bg-slate-900/90 rounded-2xl border border-emerald-500/40 text-right">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Analysis Engine</span>
              <span className="text-xs font-extrabold text-emerald-300">Gemini Neural Intelligence</span>
              <span className="text-[10px] text-amber-300 block font-mono">1:2 to 1:3+ R:R Standard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Control Panel + Output Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Asset Selection & Setup Configurator */}
        <div className="lg:col-span-5 space-y-5">
          {/* Market Tab Switcher */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              1. Choose Market Domain:
            </span>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => { setActiveMarketTab("india"); setSelectedAsset("NIFTY 50"); }}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                  activeMarketTab === "india"
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🇮🇳 India
              </button>
              <button
                type="button"
                onClick={() => { setActiveMarketTab("crypto"); setSelectedAsset("BTC/USDT"); }}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                  activeMarketTab === "crypto"
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🪙 Crypto
              </button>
              <button
                type="button"
                onClick={() => { setActiveMarketTab("forex"); setSelectedAsset("EUR/USD"); }}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                  activeMarketTab === "forex"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                💱 Forex
              </button>
              <button
                type="button"
                onClick={() => { setActiveMarketTab("us"); setSelectedAsset("S&P 500 (SPX)"); }}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                  activeMarketTab === "us"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🇺🇸 US
              </button>
              <button
                type="button"
                onClick={() => { setActiveMarketTab("commodity"); setSelectedAsset("GOLD (XAU/USD)"); }}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                  activeMarketTab === "commodity"
                    ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🟡 Metals
              </button>
            </div>

            {/* Quick Asset Pills */}
            <div className="pt-1">
              <span className="text-[10px] text-slate-400 block mb-1.5 font-semibold">
                Select Benchmark Instrument:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {filteredAssets.map((asset) => {
                  const isChosen = selectedAsset === asset.symbol;
                  return (
                    <button
                      key={asset.symbol}
                      onClick={() => {
                        setSelectedAsset(asset.symbol);
                        setTimeframe(asset.defaultTf);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        isChosen
                          ? "bg-emerald-500 text-slate-950 shadow-sm ring-1 ring-emerald-300"
                          : "bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800"
                      }`}
                    >
                      <span>{asset.symbol}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Asset Input */}
            <div className="pt-1">
              <input
                type="text"
                placeholder="Or type any global asset (e.g. FINNIFTY, SOLANA, USDINR, CRUDE)..."
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono font-bold"
              />
            </div>
          </div>

          {/* Timeframe & Strategy Style Parameters */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              2. Trading Parameters:
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">
                  Timeframe
                </label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="Scalping (1m-5m)">⚡ Scalping (1m - 5m)</option>
                  <option value="Intraday (15m-1h)">🎯 Day Trading (15m - 1h)</option>
                  <option value="Swing (4h-1D)">📈 Swing Trading (4h - Daily)</option>
                  <option value="Positional (Weekly-Monthly)">🏛️ Positional Investing (Weekly)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">
                  Strategy Methodology
                </label>
                <select
                  value={strategyStyle}
                  onChange={(e) => setStrategyStyle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="Price Action & Smart Money Concepts (SMC)">🧠 Smart Money (SMC / FVG / OB)</option>
                  <option value="Classic Technicals & Indicators (EMA/RSI/VWAP)">📊 VWAP + EMA 200 + RSI</option>
                  <option value="Derivatives & Options Greeks (OI/PCR/Delta)">⚡ Options Chain, PCR & OI</option>
                  <option value="Macroeconomics & Fundamental Catalysts">🌐 Global Macro & News Flow</option>
                </select>
              </div>
            </div>

            {/* Capital & Risk Sizing */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">
                  Trading Capital (₹ / $)
                </label>
                <input
                  type="number"
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">
                  Max Risk Per Trade (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Quick Scenario Buttons */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-md">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              3. Quick Institutional Prompt Archetypes:
            </span>

            <div className="space-y-1.5">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCustomQuery(qp.query);
                    handleRunAnalysis(qp.query);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group"
                >
                  <span className="font-semibold">{qp.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Query Box & Submit Button */}
          <div className="space-y-3">
            <textarea
              rows={3}
              placeholder="Or ask ANY specific trading question (e.g. 'Where is the liquidity resting on Bank Nifty?', 'Should I buy calls or puts on expiry?')..."
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleRunAnalysis()}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Synthesizing World Market Knowledge...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Generate Exact Trading Verdict ({selectedAsset})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Trading Intelligence Output Console */}
        <div className="lg:col-span-7 space-y-5">
          {errorMsg && (
            <div className="p-4 bg-amber-500/15 border-2 border-amber-500/50 rounded-2xl flex items-start gap-3 text-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-xs font-semibold">{errorMsg}</p>
                {!isKeyReady && (
                  <button
                    onClick={onOpenKeyGuide}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
                  >
                    Open API Key Configuration Guide
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Intelligence Display Box */}
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative min-h-[500px] flex flex-col justify-between">
            <div>
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-extrabold text-white">
                    Market Intelligence Report: <strong className="text-emerald-300">{selectedAsset}</strong>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                    [{timeframe}]
                  </span>
                  {isFallbackEngine && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold hidden md:inline">
                      ⚡ Institutional Quantitative Engine (SMC)
                    </span>
                  )}
                </div>

                {analysisResult && (
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>

              {/* Output Content */}
              {isLoading ? (
                <div className="py-24 text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center animate-spin">
                      <RefreshCw className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">
                      Analyzing Microstructure & Liquidity Pools...
                    </h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Querying global order book dynamics, Smart Money Concepts (SMC), Fibonacci levels, and calculating strict risk parameters for {selectedAsset}.
                    </p>
                  </div>
                </div>
              ) : analysisResult ? (
                <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3 font-sans overflow-x-auto">
                  <div className="whitespace-pre-wrap font-sans">
                    {analysisResult}
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center space-y-3 text-slate-500">
                  <Compass className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-400">
                    Awaiting Trading Query for {selectedAsset}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Click any quick institutional setup archetype on the left or type your scenario. The Oracle will synthesize global price action and supply exact entry, stop loss, and targets.
                  </p>
                </div>
              )}
            </div>

            {/* Mandatory Disciplinary Notice */}
            <div className="mt-6 pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1 text-slate-400 font-medium">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Analytical & educational intelligence only. Always trade with strict stop losses.</span>
              </span>
              <span className="font-mono text-emerald-400/80">R:R Min 1:2.5</span>
            </div>
          </div>

          {/* Interactive Mathematical Risk & Lot Sizing Calculator */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs sm:text-sm font-black text-white">
                  Mathematical Position Sizing & Risk-Reward Engine
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Capital Protection Formula
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Capital (₹ / $)</label>
                <input
                  type="number"
                  value={calcCapital}
                  onChange={(e) => setCalcCapital(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Risk %</label>
                <input
                  type="number"
                  step="0.1"
                  value={calcRiskPct}
                  onChange={(e) => setCalcRiskPct(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Planned Entry</label>
                <input
                  type="number"
                  value={calcEntryPrice}
                  onChange={(e) => setCalcEntryPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Stop Loss</label>
                <input
                  type="number"
                  value={calcStopLoss}
                  onChange={(e) => setCalcStopLoss(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono"
                />
              </div>
            </div>

            {/* Calculated Risk Output Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Max Risk Allowed</span>
                <span className="text-base font-black text-rose-400 font-mono">
                  ₹{maxRiskAmount.toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Optimal Position Qty</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  {positionSizeShares} units
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">1:2 Target (TP1)</span>
                <span className="text-base font-black text-indigo-300 font-mono">
                  {target1to2Price.toFixed(2)}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">1:3 Target (TP2)</span>
                <span className="text-base font-black text-amber-300 font-mono">
                  {target1to3Price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* World Trading Knowledge & Concept Encyclopedia */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-black text-white">
              World Trading Knowledge Base & Institutional Dictionary
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            ICT • Wyckoff • Dow • Greeks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-extrabold text-amber-300 flex items-center gap-1.5">
              <span>Fair Value Gap (FVG)</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              A 3-candle price imbalance created by aggressive institutional buying or selling where the wick of candle 1 does not overlap with candle 3. Markets gravitate back into FVGs to rebalance efficiency before trend continuation.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-extrabold text-emerald-300 flex items-center gap-1.5">
              <span>Order Block (OB)</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              The final opposing candle before a strong structural impulse break (BOS). It represents the zone where commercial institutions loaded massive orders. High-probability entries occur when price retraces to test the unmitigated OB.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-extrabold text-indigo-300 flex items-center gap-1.5">
              <span>Liquidity Sweeps & Retail Traps</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Smart money drives price just beyond obvious double tops, double bottoms, or trendlines to trigger retail stop losses (liquidity pool). Once liquidity is absorbed, institutions immediately reverse the market.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
