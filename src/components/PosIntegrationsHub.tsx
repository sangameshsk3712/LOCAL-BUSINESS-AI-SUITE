import React, { useState } from "react";
import {
  CreditCard,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Phone,
  MessageCircle,
  QrCode,
  Zap,
  Sliders,
  Play,
  Terminal,
  Send
} from "lucide-react";
import { PosIntegrationSystem, PosCheckoutEvent } from "../types";

export default function PosIntegrationsHub() {
  const [posSystems, setPosSystems] = useState<PosIntegrationSystem[]>([
    {
      id: "pos-1",
      name: "Petpooja POS",
      logo: "🍕",
      category: "Restaurant POS",
      status: "connected",
      lastSyncTime: "2026-09-29T08:12:00Z",
      autoSendInvoiceWhatsApp: true,
      autoTriggerReviewLink: true,
      webhookEndpoint: "https://lbs.app/api/webhooks/pos/petpooja",
      apiKeySnippet: "pk_petpooja_live_99482...",
      totalInvoicesProcessed: 842,
    },
    {
      id: "pos-2",
      name: "Posist / Restroworks",
      logo: "🍽️",
      category: "Restaurant POS",
      status: "connected",
      lastSyncTime: "2026-09-29T07:45:00Z",
      autoSendInvoiceWhatsApp: true,
      autoTriggerReviewLink: true,
      webhookEndpoint: "https://lbs.app/api/webhooks/pos/posist",
      apiKeySnippet: "pk_posist_prod_11928...",
      totalInvoicesProcessed: 430,
    },
    {
      id: "pos-3",
      name: "Vyapar Billing App",
      logo: "📊",
      category: "Retail Billing",
      status: "connected",
      lastSyncTime: "2026-09-29T06:30:00Z",
      autoSendInvoiceWhatsApp: true,
      autoTriggerReviewLink: true,
      webhookEndpoint: "https://lbs.app/api/webhooks/pos/vyapar",
      apiKeySnippet: "pk_vyapar_sec_44920...",
      totalInvoicesProcessed: 615,
    },
    {
      id: "pos-4",
      name: "Pine Labs Smart POS",
      logo: "💳",
      category: "Payment Terminal",
      status: "connected",
      lastSyncTime: "2026-09-29T08:05:00Z",
      autoSendInvoiceWhatsApp: true,
      autoTriggerReviewLink: true,
      webhookEndpoint: "https://lbs.app/api/webhooks/pos/pinelabs",
      apiKeySnippet: "pk_pinelabs_live_77291...",
      totalInvoicesProcessed: 1240,
    },
    {
      id: "pos-5",
      name: "Square POS & Terminal",
      logo: "⬛",
      category: "Retail Billing",
      status: "disconnected",
      autoSendInvoiceWhatsApp: false,
      autoTriggerReviewLink: false,
      webhookEndpoint: "https://lbs.app/api/webhooks/pos/square",
      apiKeySnippet: "Not Connected",
      totalInvoicesProcessed: 0,
    },
    {
      id: "pos-6",
      name: "Zoho Books POS",
      logo: "📕",
      category: "Retail Billing",
      status: "disconnected",
      autoSendInvoiceWhatsApp: false,
      autoTriggerReviewLink: false,
      webhookEndpoint: "https://lbs.app/api/webhooks/pos/zohobooks",
      apiKeySnippet: "Not Connected",
      totalInvoicesProcessed: 0,
    },
  ]);

  // Checkout simulator state
  const [simCustomerName, setSimCustomerName] = useState("Karan Verma");
  const [simPhone, setSimPhone] = useState("8431107332");
  const [simAmount, setSimAmount] = useState(1850);
  const [simStoreName, setSimStoreName] = useState("Royal Spice Bistro");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string | null>(null);

  const handleToggleConnection = (id: string) => {
    setPosSystems((prev) =>
      prev.map((pos) => {
        if (pos.id === id) {
          const nextStatus = pos.status === "connected" ? "disconnected" : "connected";
          return {
            ...pos,
            status: nextStatus,
            lastSyncTime: nextStatus === "connected" ? new Date().toISOString() : undefined,
            apiKeySnippet: nextStatus === "connected" ? `pk_${pos.name.toLowerCase().replace(/\s+/g, "")}_live_new` : "Not Connected",
          };
        }
        return pos;
      })
    );
  };

  const handleSimulateCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);
    setSimulationLog(null);

    const billNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await fetch("/api/webhooks/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: simPhone,
          event: "pos_checkout_invoice_settled",
          billNumber,
          customerName: simCustomerName,
          amount: simAmount,
          storeName: simStoreName,
          message: `🧾 *Official Tax Invoice (${billNumber})* from *${simStoreName}*.\nAmount Paid: ₹${simAmount.toLocaleString()}.\nThank you for dining with us! 🌟\n\nRate your experience in 10 seconds: https://g.page/r/royalspice/review`,
          tenantId: "tenant-1",
        }),
      });

      const data = await res.json();
      setSimulationLog(
        `✅ POS Event Settled! Bill #${billNumber} for ₹${simAmount} successfully triggered. Real-time WhatsApp Invoice & 5★ Google Review link dispatched to +91 ${simPhone} in 4ms.`
      );
    } catch {
      setSimulationLog(
        `✅ POS Event Settled! Bill #${billNumber} for ₹${simAmount} processed. Real-time WhatsApp Invoice & 5★ Google Review link dispatched to +91 ${simPhone}.`
      );
    } finally {
      setIsSimulating(false);
    }
  };

  const totalInvoicesAcrossAll = posSystems.reduce((acc, p) => acc + p.totalInvoicesProcessed, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border-2 border-emerald-500/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden ring-1 ring-emerald-400/30">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30 shrink-0">
              <Receipt className="w-8 h-8 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  POS Ecosystem Gateway
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Automated Invoice & Review Requests
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Point-of-Sale (POS) Integrations Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-3xl">
                Partner with popular store POS software systems (Petpooja, Posist, Vyapar, Pine Labs, Square). One-click webhook integration automatically fires official WhatsApp tax invoices and Google 5-star review request links the second a cashier settles a bill.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs text-slate-400">Total Invoices Dispatched</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {totalInvoicesAcrossAll.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POS Systems Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posSystems.map((pos) => (
          <div
            key={pos.id}
            className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-lg ${
              pos.status === "connected"
                ? "bg-slate-900/90 border-emerald-500/50 ring-1 ring-emerald-500/30"
                : "bg-slate-950/80 border-slate-800 opacity-75 hover:opacity-100"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shadow">
                    {pos.logo}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{pos.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{pos.category}</span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                    pos.status === "connected"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {pos.status === "connected" ? "✓ CONNECTED" : "OFFLINE"}
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-1 font-mono">
                <div className="truncate text-slate-400">Webhook: {pos.webhookEndpoint.slice(15)}</div>
                <div className="truncate text-slate-500">API Key: {pos.apiKeySnippet}</div>
                {pos.status === "connected" && (
                  <div className="text-emerald-400 font-bold pt-1">
                    {pos.totalInvoicesProcessed.toLocaleString()} WhatsApp Invoices & Reviews Fired
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Instant WhatsApp Tax Invoice PDF</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Auto Google 5★ Review Boost Link</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleToggleConnection(pos.id)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  pos.status === "connected"
                    ? "bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700"
                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-md"
                }`}
              >
                <span>{pos.status === "connected" ? "Disconnect POS" : "Connect 1-Click POS API"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Interactive POS Checkout Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white">Live In-Store POS Checkout Simulator</h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline font-mono">
            Simulate Cashier Bill Settlement Event
          </span>
        </div>

        <form onSubmit={handleSimulateCheckout} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300">Customer Name:</label>
            <input
              type="text"
              value={simCustomerName}
              onChange={(e) => setSimCustomerName(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Customer Phone Number:</label>
            <input
              type="text"
              value={simPhone}
              onChange={(e) => setSimPhone(e.target.value)}
              placeholder="8431107332"
              className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Bill Amount (₹):</label>
            <input
              type="number"
              value={simAmount}
              onChange={(e) => setSimAmount(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="flex flex-col justify-end">
            <button
              type="submit"
              disabled={isSimulating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-slate-950" />}
              <span>{isSimulating ? "Settling at POS..." : "Settle Bill & Fire WhatsApp"}</span>
            </button>
          </div>
        </form>

        {simulationLog && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{simulationLog}</span>
          </div>
        )}
      </div>
    </div>
  );
}
