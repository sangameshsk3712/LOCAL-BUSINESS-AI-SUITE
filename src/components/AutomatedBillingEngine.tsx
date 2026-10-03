import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Crown,
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  TrendingUp,
  Building2,
  RefreshCw,
  MessageCircle,
  Phone,
  AlertCircle,
  ExternalLink,
  Receipt,
  Clock,
  Sparkles,
  QrCode,
  DollarSign,
  UserCheck
} from "lucide-react";
import { SubscriptionTier, PaymentGatewayProvider } from "../types";

export default function AutomatedBillingEngine() {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>("pro");
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayProvider>("razorpay");
  const [customerEmail, setCustomerEmail] = useState("shivkumarkhatge@gmail.com");
  const [customerPhone, setCustomerPhone] = useState("8431107332");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any | null>(null);
  const [checkoutPayload, setCheckoutPayload] = useState<any | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  const [orders, setOrders] = useState<any[]>([]);
  const [dunningLogs, setDunningLogs] = useState<any[]>([]);
  const [userUtrInput, setUserUtrInput] = useState<string>("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifyNotice, setVerifyNotice] = useState<any | null>(null);
  const [billingMetrics, setBillingMetrics] = useState<any>({
    churnRatePercent: "1.4%",
    paymentRecoveryRate: "94.8%",
    mrrInr: 29997,
  });

  const [isSendingDunning, setIsSendingDunning] = useState(false);
  const [dunningNotice, setDunningNotice] = useState<string | null>(null);

  const tiers = [
    {
      id: "basic" as SubscriptionTier,
      name: "Basic Store Plan",
      price: 1499,
      period: "per month / location",
      badge: "ESSENTIAL",
      locations: "1 Storefront Location",
      features: [
        "1 Single Storefront Location",
        "Automated WhatsApp CRM & Lead Capture",
        "Dynamic QR Code Review Booster",
        "Basic Daily Social Media Post Generator",
        "Automated UPI Autopay / Card Debit",
      ],
      color: "border-slate-700 bg-slate-900/80 text-slate-150",
      accent: "text-blue-400",
      btnClass: "bg-blue-600 hover:bg-blue-500 text-white",
    },
    {
      id: "pro" as SubscriptionTier,
      name: "Pro Multi-Branch Plan",
      price: 4999,
      period: "per month / up to 5 stores",
      badge: "MOST POPULAR",
      locations: "Up to 5 Store Locations",
      features: [
        "Up to 5 Storefront Locations Included",
        "5x5 Geo-Grid Local SEO Rank Radar",
        "24/7 AI Voice Phone Receptionist",
        "OmniBiz GPT Closer & Sales Automation",
        "Role-Based Access Control (Owner, Manager, Cashier)",
        "Priority Background Worker Queue",
      ],
      color: "border-indigo-500/80 bg-gradient-to-b from-indigo-950/60 to-slate-900/90 text-white shadow-xl shadow-indigo-950/50 ring-2 ring-indigo-400/40",
      accent: "text-amber-300",
      btnClass: "bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 text-slate-950 font-black",
    },
    {
      id: "enterprise" as SubscriptionTier,
      name: "Enterprise Franchise Tier",
      price: 19999,
      period: "per month / unlimited stores",
      badge: "UNLIMITED SCALE",
      locations: "Unlimited Locations + White-Label",
      features: [
        "Unlimited Store Locations & Franchises",
        "White-Label Custom Domain Setup",
        "OmniMega SuperBrain 4-in-1 Dedicated Cluster",
        "Automated Multi-Tenant Database Isolation",
        "Automated Dunning (<2% Churn Engine)",
        "Dedicated Account Engineer & 99.9% SLA",
      ],
      color: "border-amber-500/70 bg-gradient-to-b from-amber-950/40 to-slate-900/90 text-white shadow-xl shadow-amber-950/50 ring-1 ring-amber-400/30",
      accent: "text-amber-400",
      btnClass: "bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black",
    },
  ];

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/billing/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        setDunningLogs(data.dunningLogs || []);
        if (data.metrics) setBillingMetrics(data.metrics);
      }
    } catch (e) {
      console.error("Failed to fetch billing orders:", e);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateOrder = async () => {
    setIsProcessing(true);
    setPaymentSuccess(null);
    try {
      const res = await fetch("/api/billing/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tierId: selectedTier,
          gateway: selectedGateway,
          customerEmail,
          customerPhone,
          tenantId: "tenant-1",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveOrder(data.order);
        setCheckoutPayload(data.checkoutPayload);
      }
    } catch (e: any) {
      alert("Error creating gateway order: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStrictVerifyPayment = async () => {
    if (!activeOrder) return;
    setVerifyError(null);
    setVerifyNotice(null);

    const cleanUtr = userUtrInput.trim();
    if (!cleanUtr) {
      setVerifyError("Please enter your 12-digit UPI UTR number from your payment app. Simply clicking Done does NOT grant premium.");
      return;
    }

    if (!/^\d{12}$/.test(cleanUtr)) {
      setVerifyError(`Invalid UTR (${cleanUtr}). Genuine Indian bank UPI UTR numbers are exactly 12 digits (e.g. 427018932014). Please check your payment app receipt.`);
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/payments/verify-strict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utr: cleanUtr,
          userContact: customerPhone || customerEmail,
          planId: selectedTier === "enterprise" ? "lifetime" : selectedTier === "pro" ? "franchise" : "starter",
          amount: activeOrder.amount,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.verified) {
        setPaymentSuccess(data.message);
        localStorage.setItem("local_business_suite_pro_active", "true");
        window.dispatchEvent(new Event("storage"));
        setActiveOrder(null);
        setCheckoutPayload(null);
        setUserUtrInput("");
        fetchOrders();
      } else {
        // Strict failure or awaiting bank reconciliation
        setVerifyNotice({
          message: data.message || "Payment not yet confirmed on FamPay (8867605076).",
          whatsAppUrl: data.whatsAppVerificationUrl || `https://wa.me/918431107332?text=${encodeURIComponent(
            `Hi Sangamesh! I paid ₹${activeOrder.amount} to FamPay 8867605076 with UTR ${cleanUtr}. Please clear my license.`
          )}`,
        });
      }
    } catch (e: any) {
      setVerifyError("Verification error: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTriggerDunning = async () => {
    setIsSendingDunning(true);
    try {
      const res = await fetch("/api/billing/trigger-dunning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: "tenant-1",
          customerContact: customerPhone,
          channel: "whatsapp",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDunningNotice(data.message);
        fetchOrders();
        setTimeout(() => setDunningNotice(null), 6000);
      }
    } catch (e: any) {
      alert("Dunning dispatch error: " + e.message);
    } finally {
      setIsSendingDunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Engine Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300">
                Pillar 1: Production Monetization
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Billing Active
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-indigo-400" />
              Real-Time Payment Gateway & Automated Billing Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Replaces manual activation codes with automated recurring subscriptions via <strong>Razorpay, PhonePe PG & Stripe India</strong> with automated dunning to maintain &lt;2% churn.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Monthly Recurring Rev (MRR)</div>
              <div className="text-lg font-black text-emerald-400 font-mono">
                ₹{billingMetrics.mrrInr?.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Churn Rate</div>
              <div className="text-lg font-black text-indigo-300 font-mono">
                {billingMetrics.churnRatePercent}
              </div>
            </div>
          </div>
        </div>
      </div>

      {paymentSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-400/60 text-emerald-200 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{paymentSuccess}</span>
        </div>
      )}

      {/* Pricing Tier Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier) => {
          const isSelected = selectedTier === tier.id;
          return (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${tier.color} ${
                isSelected ? "scale-[1.02] shadow-2xl" : "hover:border-slate-600 opacity-90 hover:opacity-100"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950/80 border border-slate-800 text-amber-300">
                    {tier.badge}
                  </span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-indigo-400 bg-indigo-500" : "border-slate-600"}`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-white font-mono">₹{tier.price.toLocaleString("en-IN")}</span>
                    <span className="text-[11px] text-slate-400">{tier.period}</span>
                  </div>
                  <div className="text-[11px] font-bold text-indigo-300 mt-0.5">{tier.locations}</div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4">
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 ${tier.btnClass}`}
                >
                  <span>Select {tier.name.split(" ")[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gateway Checkout & Subscription Setup Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Gateway Selector & Customer Form */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              1-Click Automated Payment Gateway
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Select Payment Gateway:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "razorpay" as PaymentGatewayProvider, name: "Razorpay PG", badge: "UPI / AutoPay", icon: "🇮🇳" },
                  { id: "phonepe" as PaymentGatewayProvider, name: "PhonePe PG", badge: "Instant QR", icon: "⚡" },
                  { id: "stripe" as PaymentGatewayProvider, name: "Stripe India", badge: "Cards / Global", icon: "🌐" },
                ].map((gw) => (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => setSelectedGateway(gw.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedGateway === gw.id
                        ? "bg-indigo-950/80 border-indigo-400 ring-1 ring-indigo-400 text-white"
                        : "bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-400"
                    }`}
                  >
                    <div className="text-base">{gw.icon}</div>
                    <div className="text-xs font-bold mt-1">{gw.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{gw.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Subscriber Email:</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-400 font-mono"
                  placeholder="name@business.com"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">WhatsApp / Phone for Auto-Dunning:</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-400 font-mono"
                  placeholder="8431107332"
                />
              </div>
            </div>

            <button
              onClick={handleCreateOrder}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01]"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting to {selectedGateway.toUpperCase()} API...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>
                    Initiate {selectedGateway.toUpperCase()} Checkout (₹{tiers.find((t) => t.id === selectedTier)?.price.toLocaleString("en-IN")})
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Active Order Box */}
          {activeOrder && (
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/50 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  ● Order Ready: {activeOrder.orderId}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeOrder.gateway.toUpperCase()}
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-2">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                  <div className="font-bold flex items-center justify-between">
                    <span>Pay to FamPay UPI:</span>
                    <span className="font-mono text-amber-300 font-black">8867605076@fam</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Payee: <strong>Sangamesh Khatge</strong> (Founder) | Amount: <strong className="text-white font-mono">₹{activeOrder.amount} INR</strong>
                  </div>
                  <div className="text-[10px] text-amber-400 font-mono font-bold">
                    ⚠️ Strict Rule: Payment is verified on bank network. Simply clicking Done does NOT unlock premium.
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Enter 12-Digit UPI UTR / Ref Number from PhonePe / GooglePay:
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={userUtrInput}
                    onChange={(e) => setUserUtrInput(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="e.g. 427018932014"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {verifyError && (
                  <div className="p-2.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold">
                    {verifyError}
                  </div>
                )}

                {verifyNotice && (
                  <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 space-y-2 text-xs">
                    <div className="text-amber-200 font-bold">{verifyNotice.message}</div>
                    <a
                      href={verifyNotice.whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Send Screenshot on WhatsApp (8431107332)</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleStrictVerifyPayment}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600 hover:from-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>{isProcessing ? "Verifying with Bank Node..." : "Verify Real Payment on FamPay (8867605076)"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Automated Dunning Engine (<2% Churn Control) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Automated Dunning & Churn Protection
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Churn: {billingMetrics.churnRatePercent} (Target &lt;2%)
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Automatically sends automated WhatsApp & SMS recovery reminders for failed card rebills, UPI expired mandates, and renewal notices to retain store owners.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerDunning}
              disabled={isSendingDunning}
              className="py-2 px-3.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2 transition-all"
            >
              {isSendingDunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <MessageCircle className="w-3.5 h-3.5" />}
              <span>Simulate WhatsApp Dunning Reminder</span>
            </button>
          </div>

          {dunningNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
              {dunningNotice}
            </div>
          )}

          {/* Dunning Logs stream */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recent Dunning Dispatches:</div>
            {dunningLogs.map((log) => (
              <div key={log.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{log.businessName}</span>
                  <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30">
                    {log.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2">{log.messageBody}</p>
                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                  <span>To: {log.customerContact}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders & Recurring Subscriptions Ledger */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Automated Subscription Ledger
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Total Invoices: {orders.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-2">Order ID</th>
                <th className="pb-2">Plan</th>
                <th className="pb-2">Gateway</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Subscriber</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {orders.map((ord) => (
                <tr key={ord.orderId} className="hover:bg-slate-850/40">
                  <td className="py-2.5 text-white font-bold">{ord.orderId}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px] uppercase">
                      {ord.tier}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-300 uppercase">{ord.gateway}</td>
                  <td className="py-2.5 text-emerald-400 font-bold">₹{ord.amount}</td>
                  <td className="py-2.5 text-slate-400">{ord.customerPhone}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ord.status === "paid" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300"}`}>
                      {ord.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer underline text-[11px]">
                      {ord.receiptNumber}
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
