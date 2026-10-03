import React, { useState } from "react";
import {
  Sparkles,
  Instagram,
  Video,
  Youtube,
  Megaphone,
  ShoppingBag,
  Gift,
  Hash,
  Copy,
  Check,
  Share2,
  MessageCircle,
  FolderPlus,
  RefreshCw,
  Send,
  Layers,
  Globe2,
  Volume2
} from "lucide-react";
import { GeneratedContentSuite, ContentBrandVoice, ContentLanguage } from "../types";

interface ContentStudioProps {
  isKeyReady: boolean;
  onOpenKeyGuide: () => void;
  onSaveToWorkspace?: (title: string, type: any, data: any) => void;
}

export default function ContentStudio({
  isKeyReady,
  onOpenKeyGuide,
  onSaveToWorkspace,
}: ContentStudioProps) {
  const [topic, setTopic] = useState("Weekend Signature Special & Tasting Night");
  const [brandVoice, setBrandVoice] = useState<ContentBrandVoice>("Warm & Community");
  const [language, setLanguage] = useState<ContentLanguage>("English");
  const [targetAudience, setTargetAudience] = useState("Local foodies, weekend families & professionals");
  const [offerDetails, setOfferDetails] = useState("Buy 2 Signature Items, Get 1 Artisan Dessert Free");
  const [businessName, setBusinessName] = useState("Artisan Roast Cafe");
  const [industry, setIndustry] = useState("Specialty Cafe & Bakery");

  const [isLoading, setIsLoading] = useState(false);
  const [activeFormat, setActiveFormat] = useState<
    "instagram" | "reels" | "shorts" | "ads" | "product" | "promo" | "hashtags"
  >("instagram");

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [contentSuite, setContentSuite] = useState<GeneratedContentSuite | null>(() => {
    try {
      const saved = localStorage.getItem("lbs_saved_content_suite");
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/content-studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          brandVoice,
          language,
          targetAudience,
          offerDetails,
          businessName,
          industry,
        }),
      });

      const data = await res.json();
      if (res.ok && data.contentSuite) {
        setContentSuite(data.contentSuite);
        localStorage.setItem("lbs_saved_content_suite", JSON.stringify(data.contentSuite));
      }
    } catch (err) {
      console.error("Content generation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToWorkspace = () => {
    if (!contentSuite) return;
    if (onSaveToWorkspace) {
      onSaveToWorkspace(
        `${businessName} - ${topic} (${language})`,
        "Content Suite",
        contentSuite
      );
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const openWhatsAppBroadcast = (text: string) => {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-pink-950/60 border-2 border-purple-500/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Multi-Channel Creative Engine</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              All-in-One Content Studio
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Generate Instagram posts, viral Reels scripts, YouTube Shorts, high-converting ad copy, sensory product descriptions, promotional offers, and trending hashtags in any regional language with customizable brand voice.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {contentSuite && (
              <button
                onClick={handleSaveToWorkspace}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>{savedSuccess ? "Saved to Workspace!" : "Save Suite"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Control Configuration Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="lg:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Campaign Focus / Topic:
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Weekend Flash Sale, Festive Special Menu, New Branch Opening"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Promotional Offer / Hook:
              </label>
              <input
                type="text"
                value={offerDetails}
                onChange={(e) => setOfferDetails(e.target.value)}
                placeholder="e.g. Flat 20% off or Free Dessert"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Language:
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as ContentLanguage)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="Bengali">Bengali (বাংলা)</option>
                <option value="Spanish">Spanish</option>
                <option value="Arabic">Arabic</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Brand Voice & Personality:
              </label>
              <select
                value={brandVoice}
                onChange={(e) => setBrandVoice(e.target.value as ContentBrandVoice)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
              >
                <option value="Warm & Community">Warm & Community</option>
                <option value="High-End Luxury">High-End Luxury & Elegant</option>
                <option value="Energetic & Bold">Energetic & Bold</option>
                <option value="Quirky & Humorous">Quirky & Humorous</option>
                <option value="Direct Sales & Urgency">Direct Sales & Urgency</option>
                <option value="Executive Professional">Executive Professional</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Store Name:
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Artisan Roast Cafe"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Target Audience:
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Young professionals, brunch lovers, local families"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              Generates 7 cross-platform assets simultaneously formatted with emojis and callouts.
            </span>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? "Generating Content Suite..." : "Generate 7-Asset Suite"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Content Showcase */}
      {contentSuite && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          {/* Format Tabs Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800 pb-4">
            <button
              onClick={() => setActiveFormat("instagram")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeFormat === "instagram"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md"
                  : "bg-slate-950 text-slate-400 hover:text-white"
              }`}
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram Post</span>
            </button>

            <button
              onClick={() => setActiveFormat("reels")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeFormat === "reels"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "bg-slate-950 text-slate-400 hover:text-white"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Reels Script</span>
            </button>

            <button
              onClick={() => setActiveFormat("shorts")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeFormat === "shorts"
                  ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md"
                  : "bg-slate-950 text-slate-400 hover:text-white"
              }`}
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>YouTube Shorts</span>
            </button>

            <button
              onClick={() => setActiveFormat("ads")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeFormat === "ads"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md"
                  : "bg-slate-950 text-slate-400 hover:text-white"
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Ad Copy (Meta / Google)</span>
            </button>

            <button
              onClick={() => setActiveFormat("product")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeFormat === "product"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                  : "bg-slate-950 text-slate-400 hover:text-white"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Product Description</span>
            </button>

            <button
              onClick={() => setActiveFormat("promo")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeFormat === "promo"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md"
                  : "bg-slate-950 text-slate-400 hover:text-white"
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Promo & WhatsApp Blast</span>
            </button>

            <button
              onClick={() => setActiveFormat("hashtags")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeFormat === "hashtags"
                  ? "bg-slate-800 text-indigo-300 border border-slate-700 shadow-md"
                  : "bg-slate-950 text-slate-400 hover:text-white"
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Categorized Hashtags</span>
            </button>
          </div>

          {/* TAB 1: INSTAGRAM POST */}
          {activeFormat === "instagram" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-400">Post Caption ({language})</span>
                    <button
                      onClick={() => handleCopyText(contentSuite.instagramPost.caption, "ig-caption")}
                      className="px-3 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1"
                    >
                      {copiedKey === "ig-caption" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === "ig-caption" ? "Copied!" : "Copy Caption"}</span>
                    </button>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                    {contentSuite.instagramPost.caption}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Visual & Photography Direction
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {contentSuite.instagramPost.visualDirection}
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    First-Line Hook
                  </span>
                  <p className="text-xs font-bold text-pink-300">
                    {contentSuite.instagramPost.hook}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REELS SCRIPT */}
          {activeFormat === "reels" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-purple-300 font-bold">15-30s High-Retention Reel Breakdown</span>
                  <span className="text-[10px] font-mono text-slate-400">Audio: {contentSuite.reelsScript.audioSuggestion}</span>
                </div>
                <button
                  onClick={() =>
                    handleCopyText(
                      `[HOOK ${contentSuite.reelsScript.hookDuration}]: ${contentSuite.reelsScript.hookScript}\n[VISUAL]: ${contentSuite.reelsScript.visualScene1}\n\n[BODY ${contentSuite.reelsScript.bodyDuration}]: ${contentSuite.reelsScript.bodyScript}\n[VISUAL]: ${contentSuite.reelsScript.visualScene2}\n\n[CTA]: ${contentSuite.reelsScript.callToActionScript}`,
                      "reel-script"
                    )
                  }
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center gap-1"
                >
                  {copiedKey === "reel-script" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === "reel-script" ? "Copied Script!" : "Copy Full Script"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-purple-400">
                    <span>Scene 1: The Hook</span>
                    <span>{contentSuite.reelsScript.hookDuration}</span>
                  </div>
                  <div className="text-xs text-white font-semibold">
                    "{contentSuite.reelsScript.hookScript}"
                  </div>
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-850">
                    <strong>Camera / Visual:</strong> {contentSuite.reelsScript.visualScene1}
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-indigo-400">
                    <span>Scene 2: Core Body</span>
                    <span>{contentSuite.reelsScript.bodyDuration}</span>
                  </div>
                  <div className="text-xs text-white font-semibold">
                    "{contentSuite.reelsScript.bodyScript}"
                  </div>
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-850">
                    <strong>B-Roll Visual:</strong> {contentSuite.reelsScript.visualScene2}
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
                    <span>Scene 3: CTA & Save</span>
                    <span>Closing 3s</span>
                  </div>
                  <div className="text-xs text-white font-semibold">
                    "{contentSuite.reelsScript.callToActionScript}"
                  </div>
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-850">
                    <strong>Recommended Audio:</strong> {contentSuite.reelsScript.audioSuggestion}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: YOUTUBE SHORTS */}
          {activeFormat === "shorts" && (
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Shorts Title</span>
                  <h4 className="text-base font-bold text-white">{contentSuite.youtubeShortsScript.title}</h4>
                </div>
                <button
                  onClick={() => handleCopyText(contentSuite.youtubeShortsScript.script, "shorts-script")}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                >
                  {copiedKey === "shorts-script" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === "shorts-script" ? "Copied!" : "Copy Narration"}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-mono">
                {contentSuite.youtubeShortsScript.script}
              </div>

              <div className="text-xs text-slate-400">
                <strong className="text-slate-300">Editing Direction:</strong> {contentSuite.youtubeShortsScript.editingTips}
              </div>
            </div>
          )}

          {/* TAB 4: AD COPY */}
          {activeFormat === "ads" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <span className="text-xs font-bold text-blue-400">Meta / Google Ads Payload</span>
                  <button
                    onClick={() =>
                      handleCopyText(
                        `HEADLINE: ${contentSuite.adCopy.headline}\nPRIMARY TEXT: ${contentSuite.adCopy.primaryText}\nDESCRIPTION: ${contentSuite.adCopy.description}\nCTA: ${contentSuite.adCopy.buttonCTA}`,
                        "ad-copy"
                      )
                    }
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                  >
                    {copiedKey === "ad-copy" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === "ad-copy" ? "Copied!" : "Copy Ad Copy"}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Ad Headline:</span>
                    <h5 className="text-sm font-bold text-white">{contentSuite.adCopy.headline}</h5>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Primary Text:</span>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-850">
                      {contentSuite.adCopy.primaryText}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400">{contentSuite.adCopy.description}</span>
                    <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs">
                      {contentSuite.adCopy.buttonCTA}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300">Audience Targeting Recommendations</span>
                <ul className="text-xs text-slate-400 space-y-1.5">
                  {contentSuite.adCopy.targetAudienceSuggestions.map((t, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-400">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: PRODUCT DESCRIPTION */}
          {activeFormat === "product" && (
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-white">{contentSuite.productDescription.catchyTitle}</h4>
                <button
                  onClick={() =>
                    handleCopyText(
                      `${contentSuite.productDescription.catchyTitle}\n\n${contentSuite.productDescription.sensoryDescription}\n\nHighlights:\n${contentSuite.productDescription.bulletHighlights.map((b) => "- " + b).join("\n")}`,
                      "prod-desc"
                    )
                  }
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                >
                  {copiedKey === "prod-desc" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === "prod-desc" ? "Copied!" : "Copy Description"}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-4 rounded-xl border border-slate-850">
                "{contentSuite.productDescription.sensoryDescription}"
              </p>

              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400">Key Highlights:</span>
                <ul className="text-xs text-slate-300 space-y-1">
                  {contentSuite.productDescription.bulletHighlights.map((b, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-semibold">
                {contentSuite.productDescription.guaranteeNote}
              </div>
            </div>
          )}

          {/* TAB 6: PROMOTIONAL OFFER & WHATSAPP BLAST */}
          {activeFormat === "promo" && (
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-r from-amber-500/15 via-slate-950 to-orange-500/15 border-2 border-amber-400/50 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">Active Promo Pass</span>
                    <h4 className="text-base font-black text-white">{contentSuite.promotionalOffer.offerName}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-slate-900 border border-amber-400 font-mono font-black text-amber-300 text-xs">
                      {contentSuite.promotionalOffer.promoCode}
                    </span>
                    <span className="text-xs text-slate-400">({contentSuite.promotionalOffer.scarcityTrigger})</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Pre-Formatted WhatsApp Broadcast Message</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyText(contentSuite.promotionalOffer.whatsappReadyBlast, "wa-blast")}
                      className="px-3 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1"
                    >
                      {copiedKey === "wa-blast" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === "wa-blast" ? "Copied!" : "Copy WhatsApp Copy"}</span>
                    </button>
                    <button
                      onClick={() => openWhatsAppBroadcast(contentSuite.promotionalOffer.whatsappReadyBlast)}
                      className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Open in WhatsApp Web</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-850 text-xs text-slate-200 whitespace-pre-line font-sans leading-relaxed">
                  {contentSuite.promotionalOffer.whatsappReadyBlast}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: HASHTAGS */}
          {activeFormat === "hashtags" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Algorithm-Optimized 3-Tier Hashtags</span>
                <button
                  onClick={() =>
                    handleCopyText(
                      [
                        ...contentSuite.hashtags.highReach,
                        ...contentSuite.hashtags.localNiche,
                        ...contentSuite.hashtags.industrySpecific,
                      ].join(" "),
                      "all-tags"
                    )
                  }
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold flex items-center gap-1"
                >
                  {copiedKey === "all-tags" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === "all-tags" ? "Copied All!" : "Copy All Hashtags"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-blue-400 block">High Reach Discovery</span>
                  <div className="flex flex-wrap gap-1.5">
                    {contentSuite.hashtags.highReach.map((tag, i) => (
                      <span key={i} className="text-xs font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 block">Local Neighborhood Niche</span>
                  <div className="flex flex-wrap gap-1.5">
                    {contentSuite.hashtags.localNiche.map((tag, i) => (
                      <span key={i} className="text-xs font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-purple-400 block">Industry Specific Intent</span>
                  <div className="flex flex-wrap gap-1.5">
                    {contentSuite.hashtags.industrySpecific.map((tag, i) => (
                      <span key={i} className="text-xs font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
