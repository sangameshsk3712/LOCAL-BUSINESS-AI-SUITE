import React, { useState } from "react";
import {
  QrCode,
  Printer,
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
  Sliders,
  Palette,
  Wifi,
  Star,
  Building2,
  BadgeCheck,
  Eye
} from "lucide-react";
import { QrFlyerConfig } from "../types";

export default function QrFlyerMarketingGenerator() {
  const [config, setConfig] = useState<QrFlyerConfig>({
    storeName: "Royal Spice Bistro & Stores",
    tagline: "Craft Culinary Dining & Artisan Experiences",
    discountIncentive: "Scan & Leave a 5★ Review to Unlock 10% Off Your Entire Bill Today!",
    googleMapsReviewUrl: "https://g.page/r/royalspice/review",
    phoneContact: "+91 84311 07332",
    themeStyle: "Warm Artisan Gold",
    showWifiPassword: true,
    wifiName: "RoyalSpice_Guest_5G",
    wifiPassword: "EatGreatFood2026",
  });

  const [printNotice, setPrintNotice] = useState<string | null>(null);

  const handlePrintFlyer = () => {
    window.print();
    setPrintNotice("Print dialog opened. Ready for table tent, acrylic counter stand, and front-door flyers!");
    setTimeout(() => setPrintNotice(null), 5000);
  };

  const getThemeClasses = () => {
    switch (config.themeStyle) {
      case "Modern Obsidian":
        return "bg-slate-950 border-slate-700 text-white";
      case "Fresh Emerald":
        return "bg-gradient-to-b from-emerald-950 via-slate-950 to-emerald-950 border-emerald-500/50 text-white";
      case "Royal Purple":
        return "bg-gradient-to-b from-purple-950 via-slate-950 to-indigo-950 border-purple-500/50 text-white";
      case "Warm Artisan Gold":
      default:
        return "bg-gradient-to-b from-amber-950/90 via-slate-950 to-stone-950 border-amber-500/60 text-white";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden ring-1 ring-amber-400/30">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 shrink-0">
              <QrCode className="w-8 h-8 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Customer Conversion (10/10 ⭐)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Zero-Friction In-Store Booster
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Print-Ready QR Review Flyer & Table-Tent Generator
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-3xl">
                Convert 80%+ of in-store customers into 5-star Google Maps reviews. Generate beautiful, print-ready table tents and counter acrylic flyers that reward customers instantly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handlePrintFlyer}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 hover:from-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Printer className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>Print / Download Table Flyer (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {printNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{printNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Customizer Controls (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-5 h-5 text-amber-400" />
            <span>Customize Table Flyer Details</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300">Store / Brand Name:</label>
              <input
                type="text"
                value={config.storeName}
                onChange={(e) => setConfig({ ...config, storeName: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Store Tagline / Subtitle:</label>
              <input
                type="text"
                value={config.tagline}
                onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Review Reward / Incentive:</label>
              <textarea
                value={config.discountIncentive}
                onChange={(e) => setConfig({ ...config, discountIncentive: e.target.value })}
                rows={2}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Visual Theme Style:</label>
              <select
                value={config.themeStyle}
                onChange={(e) => setConfig({ ...config, themeStyle: e.target.value as any })}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
              >
                <option value="Warm Artisan Gold">Warm Artisan Gold (High-End Dining & Salons)</option>
                <option value="Fresh Emerald">Fresh Emerald (Healthy Food, Spas & Retail)</option>
                <option value="Royal Purple">Royal Purple (Nightlife & Boutique Stores)</option>
                <option value="Modern Obsidian">Modern Obsidian (Minimalist Contemporary)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showWifiPassword}
                  onChange={(e) => setConfig({ ...config, showWifiPassword: e.target.checked })}
                  className="rounded border-slate-700 text-amber-500 focus:ring-0"
                />
                <span className="text-xs text-slate-300 font-bold">Include Free In-Store Wi-Fi on Flyer</span>
              </label>

              {config.showWifiPassword && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Wi-Fi Name"
                    value={config.wifiName}
                    onChange={(e) => setConfig({ ...config, wifiName: e.target.value })}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300"
                  />
                  <input
                    type="text"
                    placeholder="Wi-Fi Password"
                    value={config.wifiPassword}
                    onChange={(e) => setConfig({ ...config, wifiPassword: e.target.value })}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Live Print Flyer Preview (7 cols) */}
        <div className="lg:col-span-7 flex justify-center items-center">
          <div
            className={`w-full max-w-sm rounded-3xl p-7 border-4 shadow-2xl text-center space-y-5 transition-all ${getThemeClasses()}`}
          >
            {/* Header */}
            <div className="space-y-1">
              <div className="flex justify-center items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <h3 className="text-xl font-black tracking-tight">{config.storeName}</h3>
              <p className="text-[11px] text-slate-300 italic">{config.tagline}</p>
            </div>

            {/* Simulated High-Res QR Code Card */}
            <div className="p-4 bg-white rounded-2xl mx-auto w-48 h-48 flex flex-col items-center justify-center shadow-lg relative border-4 border-slate-900">
              <div className="w-36 h-36 bg-slate-950 rounded-xl p-2 flex flex-col items-center justify-center">
                <QrCode className="w-28 h-28 text-white" />
              </div>
              <span className="text-[9px] font-black text-slate-950 uppercase tracking-widest mt-1">
                SCAN WITH CAMERA
              </span>
            </div>

            {/* Incentive Box */}
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-bold leading-relaxed shadow-sm">
              {config.discountIncentive}
            </div>

            {/* Optional Wi-Fi footer */}
            {config.showWifiPassword && (
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-300 flex items-center justify-center gap-2">
                <Wifi className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  <strong>Wi-Fi:</strong> {config.wifiName} | <strong>Pass:</strong> {config.wifiPassword}
                </span>
              </div>
            )}

            <div className="text-[10px] text-slate-400 font-mono">
              Powered by Local Business Suite • Verified Google Maps Partner
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
