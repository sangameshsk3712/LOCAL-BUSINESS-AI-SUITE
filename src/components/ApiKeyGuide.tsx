import React, { useState, useEffect } from "react";
import {
  Key,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  Zap,
  DollarSign,
  Activity,
  Layers,
  Sparkles,
  Server,
  Lock,
  ArrowUpRight,
  Sliders,
  RotateCcw
} from "lucide-react";
import { ApiKeyStatus, ProductionCheckReport } from "../types";

interface ApiKeyGuideProps {
  status: ApiKeyStatus | null;
  loading: boolean;
  onRefresh: () => void;
}

export default function ApiKeyGuide({ status, loading, onRefresh }: ApiKeyGuideProps) {
  const [productionReport, setProductionReport] = useState<ProductionCheckReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"readiness" | "costs" | "setup">("readiness");
  const [budgetCeilingInput, setBudgetCeilingInput] = useState<number>(10.0);
  const [savingBudget, setSavingBudget] = useState(false);

  const fetchProductionCheck = async () => {
    setLoadingReport(true);
    try {
      const res = await fetch("/api/production-check");
      if (res.ok) {
        const data = await res.json();
        setProductionReport(data);
        if (data.check3_apiCosts?.budgetCeilingUsd) {
          setBudgetCeilingInput(data.check3_apiCosts.budgetCeilingUsd);
        }
      }
    } catch (e) {
      console.error("Error fetching production check:", e);
    } finally {
      setLoadingReport(false);
    }
  };

  useEffect(() => {
    fetchProductionCheck();
  }, []);

  const handleUpdateBudget = async () => {
    setSavingBudget(true);
    try {
      const res = await fetch("/api/monitoring/update-budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budgetCeilingUsd: Number(budgetCeilingInput) }),
      });
      if (res.ok) {
        fetchProductionCheck();
      }
    } catch (e) {
      console.error("Error updating budget:", e);
    } finally {
      setSavingBudget(false);
    }
  };

  const handleResetMetrics = async () => {
    if (confirm("Reset real-time request and token consumption counters for testing?")) {
      try {
        await fetch("/api/monitoring/update-budget", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resetCounters: true }),
        });
        fetchProductionCheck();
      } catch (e) {
        console.error("Error resetting counters:", e);
      }
    }
  };

  const handleFullRefresh = () => {
    onRefresh();
    fetchProductionCheck();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 flex flex-col h-full shadow-lg" id="api-key-guide-card">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Key className="w-4 h-4" id="api-key-icon" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
              Gemini & Cloud Run Production Check
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                Post-Sept 2026 Mandate
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Credentials migration, 429/503 exponential backoff & cost safeguards.
            </p>
          </div>
        </div>

        <button
          onClick={handleFullRefresh}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:text-white hover:bg-slate-750 transition-colors flex items-center gap-1.5 border border-slate-700 shadow-sm"
          title="Refresh Server Configuration & Live Metrics"
          disabled={loading || loadingReport}
          id="refresh-api-key-status"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading || loadingReport ? "animate-spin text-indigo-400" : ""}`} />
          <span>Audit Now</span>
        </button>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-1.5 mb-4 border-b border-slate-800/80 pb-2">
        <button
          onClick={() => setActiveSubTab("readiness")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeSubTab === "readiness"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Production Check (3 Pillars)</span>
        </button>

        <button
          onClick={() => setActiveSubTab("costs")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeSubTab === "costs"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Live Tokens & Cost Monitor</span>
        </button>

        <button
          onClick={() => setActiveSubTab("setup")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeSubTab === "setup"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Setup Guide</span>
        </button>
      </div>

      {/* VIEW 1: PRODUCTION READINESS 3-PILLAR AUDIT */}
      {activeSubTab === "readiness" && (
        <div className="space-y-3.5 flex-1">
          {/* Pillar 1: API Credentials Check */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    API Credentials Migration
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/80 font-mono">
                      September 2026 Compliant
                    </span>
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Official authorization key verification & server-side isolation
                  </p>
                </div>
              </div>

              {status?.configured ? (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  VERIFIED
                </span>
              ) : (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  KEY MISSING
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2 space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Auth Key Status</span>
                <span className="font-semibold text-slate-200">
                  {status?.configured ? `Active (${status.keySnippet})` : "Unconfigured"}
                </span>
              </div>
              <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2 space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Legacy OAuth (ya29)</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Strictly Rejected
                </span>
              </div>
              <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2 space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Cloud Run Isolation</span>
                <span className="font-semibold text-cyan-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Zero Browser Leak
                </span>
              </div>
            </div>
            {status?.rejectionNotice && (
              <p className="text-[10px] text-amber-300 bg-amber-950/40 p-1.5 rounded border border-amber-800/50">
                Notice: {status.rejectionNotice}
              </p>
            )}
          </div>

          {/* Pillar 2: Error Handling & Retry Logic Check */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    Error Handling & Exponential Backoff
                    <span className="text-[10px] text-indigo-400 bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-800/80 font-mono">
                      429 / 503 Resilient
                    </span>
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Automatic recovery from quota limits and upstream demand spikes
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
              <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2 space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Retry Limit</span>
                <span className="font-semibold text-slate-200">3 attempts max</span>
              </div>
              <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2 space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Backoff Rate</span>
                <span className="font-semibold text-slate-200">1.2s → 2.4s → 4.8s</span>
              </div>
              <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2 space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Jitter Guard</span>
                <span className="font-semibold text-emerald-400">Thundering-Herd Safe</span>
              </div>
              <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2 space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Model Failover</span>
                <span className="font-semibold text-cyan-300 font-mono text-[10px]">3.8-flash → latest</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-slate-800/50 font-mono">
              <span>Telemetry: 429 Caught: <strong>{productionReport?.check2_errorHandling.total429Caught || 0}</strong></span>
              <span>•</span>
              <span>503 Caught: <strong>{productionReport?.check2_errorHandling.total503Caught || 0}</strong></span>
              <span>•</span>
              <span className="text-emerald-300">Recovered: <strong>{productionReport?.check2_errorHandling.successfulRetries || 0}</strong></span>
            </div>
          </div>

          {/* Pillar 3: API Costs & Monitoring Check */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    API Cost & Token Telemetry
                    <span className="text-[10px] text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800/80 font-mono">
                      Surprise Bill Protection
                    </span>
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Live requests, tokens, and daily spending cap on Cloud Run
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                MONITORED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
              <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2 space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Total Requests</span>
                <span className="font-bold text-white text-sm">
                  {productionReport?.check3_apiCosts.totalRequests || 0}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  ({productionReport?.check3_apiCosts.requestsToday || 0} today)
                </span>
              </div>
              <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2 space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Total Tokens</span>
                <span className="font-bold text-indigo-300 text-sm">
                  {(productionReport?.check3_apiCosts.totalTokens || 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block">Input + Output</span>
              </div>
              <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2 space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Estimated Spend</span>
                <span className="font-bold text-emerald-400 text-sm">
                  ${productionReport?.check3_apiCosts.estimatedSpendUsd || "0.00000"}
                </span>
                <span className="text-[10px] text-emerald-500/80 block font-mono">
                  ≈ ₹{productionReport?.check3_apiCosts.estimatedSpendInr || "0.00"}
                </span>
              </div>
              <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2 space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Daily Budget Cap</span>
                <span className="font-bold text-amber-300 text-sm">
                  ${productionReport?.check3_apiCosts.budgetCeilingUsd || 10.0}
                </span>
                <span className="text-[10px] text-slate-500 block">Safety cutoff limit</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DETAILED LIVE COST & BUDGET CONTROLLER */}
      {activeSubTab === "costs" && (
        <div className="space-y-4 flex-1">
          {/* Spending Gauges */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Cloud Run & Gemini Budget Guardrail
                </h4>
                <p className="text-[11px] text-slate-400">
                  Prevents unexpected usage spikes from generating surprise bills.
                </p>
              </div>
              <button
                onClick={handleResetMetrics}
                className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 flex items-center gap-1"
                title="Reset local telemetry counter"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Test Counters</span>
              </button>
            </div>

            {/* Spending progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Current Spend: <strong className="text-emerald-400">${productionReport?.check3_apiCosts.estimatedSpendUsd || "0.00000"}</strong></span>
                <span className="text-slate-400">Daily Cap: <strong className="text-amber-300">${productionReport?.check3_apiCosts.budgetCeilingUsd || 10.0}</strong></span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (((productionReport?.check3_apiCosts.estimatedSpendUsd || 0) /
                        (productionReport?.check3_apiCosts.budgetCeilingUsd || 10)) *
                        100)
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Budget Adjustment Form */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
              <label className="text-xs text-slate-300 font-medium">Daily Safety Ceiling (USD $):</label>
              <input
                type="number"
                step="1"
                min="1"
                max="500"
                value={budgetCeilingInput}
                onChange={(e) => setBudgetCeilingInput(Number(e.target.value))}
                className="w-24 px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
              />
              <button
                onClick={handleUpdateBudget}
                disabled={savingBudget}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {savingBudget ? "Saving..." : "Set Budget Cap"}
              </button>
            </div>
          </div>

          {/* Pricing Matrix */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-[11px] space-y-1 font-mono">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Gemini 3.8 Flash Pricing Matrix
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-slate-300">
              <div>• Input: <strong>$0.075</strong> / 1M tokens</div>
              <div>• Output: <strong>$0.30</strong> / 1M tokens</div>
              <div>• Rate: <strong>1 USD ≈ ₹84.50 INR</strong></div>
            </div>
          </div>

          {/* Recent Gemini API Requests Ledger */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-Time Request & Token Audit Ledger</span>
            </h5>

            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 font-mono text-[10px]">
              {productionReport?.check3_apiCosts.recentRequests?.length ? (
                productionReport.check3_apiCosts.recentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{req.feature}</span>
                        <span className="text-indigo-400 font-normal">({req.model})</span>
                        {req.retries > 0 && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px]">
                            {req.retries} retries recovered
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500 text-[9px]">
                        {new Date(req.timestamp).toLocaleTimeString()} • {req.latencyMs}ms latency
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-slate-300 block">{req.totalTokens.toLocaleString()} tokens</span>
                      <span className="text-emerald-400 text-[9px] block">${req.costUsd.toFixed(6)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-500 bg-slate-950/40 rounded-lg border border-slate-800/60">
                  No requests recorded in current server lifecycle. Run prompt studio, voice receptionist, or marketing tools to view live token telemetry!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SETUP PLAYBOOK */}
      {activeSubTab === "setup" && (
        <div className="space-y-4 flex-1">
          <div className="mb-2">
            {status?.configured ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-xl flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-emerald-300 block">Active & Configured</span>
                    <span className="font-mono text-[10px] text-emerald-400/80 tracking-widest uppercase">
                      Key snippet: {status.keySnippet}
                    </span>
                  </div>
                </div>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
            ) : (
              <div className="p-3 bg-amber-950/40 border border-amber-900/60 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-amber-300 block">Workspace Secret Key Missing</span>
                    <span className="text-[11px] text-amber-400/80 leading-relaxed block mt-1">
                      Please map your <strong>GEMINI_API_KEY</strong> environment secret in Google AI Studio to run test responses.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Quick Setup Steps
            </h4>

            {/* Step 1 */}
            <div className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center shrink-0">
                1
              </span>
              <div className="flex-1 space-y-1">
                <span className="text-xs font-medium text-slate-200 block">Get keys from Google AI Studio</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Log in and create a developer API authorization key. Keep your key confidential.
                </p>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors mt-0.5 hover:underline"
                >
                  Go to Google AI Studio API Keys <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center shrink-0">
                2
              </span>
              <div className="flex-1">
                <span className="text-xs font-medium text-slate-200 block">Click Settings &gt; Secrets</span>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  Open the Settings wheel in the top right corner inside Google AI Studio, and open the Secrets manager panel.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center shrink-0">
                3
              </span>
              <div className="flex-1">
                <span className="text-xs font-medium text-slate-200 block">Register GEMINI_API_KEY</span>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  Add an environment variable secret named <code className="font-mono text-[10px] bg-slate-800 px-1 py-0.5 rounded text-indigo-300 border border-slate-700">GEMINI_API_KEY</code>, paste your authorization key, and save.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status Footer */}
      <div className="mt-4 pt-3 border-t border-slate-850 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5 text-indigo-400" />
          <span>Cloud Run Server-Side Proxy Active</span>
        </div>
        <span className="font-mono text-[10px] text-emerald-400">
          User-Agent: aistudio-build
        </span>
      </div>
    </div>
  );
}
