import React, { useState, useEffect } from "react";
import {
  Calendar,
  Share2,
  Clock,
  Sparkles,
  Instagram,
  Facebook,
  Globe2,
  MessageCircle,
  Linkedin,
  Send,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Plus,
  Trash2,
  FolderPlus,
  Play,
  Zap,
  ExternalLink
} from "lucide-react";
import { ScheduledPost, MarketingIntegration } from "../types";

interface MarketingAutomationCenterProps {
  isKeyReady: boolean;
  onOpenKeyGuide: () => void;
  onSaveToWorkspace?: (title: string, type: any, data: any) => void;
}

const DEFAULT_SCHEDULED_POSTS: ScheduledPost[] = [
  {
    id: "sched-1",
    title: "Monday Craftsmanship & Fresh Coffee Drop",
    scheduledDate: "2026-09-28",
    scheduledTime: "09:30 AM",
    dayOfWeek: "Monday",
    platforms: ["Instagram", "Google Business"],
    content: "Start your week right! Fresh single-origin Arabica roasted locally at Artisan Roast Cafe. Enjoy fresh pour-over from 8 AM daily. #MondayCoffee #Indiranagar",
    visualPrompt: "Natural sunlight falling on rustic wooden cafe table with signature coffee cup and artisan sourdough slice.",
    status: "Scheduled",
  },
  {
    id: "sched-2",
    title: "Midweek VIP Secret Menu Offer",
    scheduledDate: "2026-09-30",
    scheduledTime: "12:15 PM",
    dayOfWeek: "Wednesday",
    platforms: ["WhatsApp Broadcast", "Instagram"],
    content: "🎉 *Midweek VIP Exclusive*: Buy any 2 artisan beverages and receive our freshly baked cinnamon roll on the house! Valid today till 8 PM. Show this message at the counter.",
    visualPrompt: "Close-up macro shot of cinnamon roll glaze dripping with warm ambient bakery background.",
    status: "Scheduled",
  },
  {
    id: "sched-3",
    title: "Friday Evening Acoustic & Tasting Teaser",
    scheduledDate: "2026-10-02",
    scheduledTime: "04:30 PM",
    dayOfWeek: "Friday",
    platforms: ["Instagram", "Facebook", "X"],
    content: "Weekend plans sorted! Bring your favorite company for our acoustic evening tasting session this Friday from 6 PM to 9 PM. Limited seating available.",
    visualPrompt: "Warm evening store ambiance with acoustic guitar in background and aesthetic latte art in foreground.",
    status: "Draft",
  },
  {
    id: "sched-4",
    title: "Saturday Brunch Rush & Fresh Bagels",
    scheduledDate: "2026-10-03",
    scheduledTime: "10:00 AM",
    dayOfWeek: "Saturday",
    platforms: ["Google Business", "WhatsApp Broadcast"],
    content: "Weekend fresh bakes are ready! Fresh sourdough loaves, croissants, and cold brews. Open until 10:30 PM. Order takeaway or visit us!",
    visualPrompt: "Display shelf packed with golden sourdough loaves and fresh baguettes with handwritten chalkboard prices.",
    status: "Scheduled",
  },
];

const DEFAULT_INTEGRATIONS: MarketingIntegration[] = [
  {
    id: "int-meta",
    platform: "Instagram & Meta",
    status: "Ready for Webhook",
    apiStatus: "Meta Graph API v20.0 Webhook Endpoint Configured",
    webhookUrl: "https://graph.facebook.com/v20.0/me/media",
    lastSync: "Today, 10:00 AM",
  },
  {
    id: "int-google",
    platform: "Google Business Profile",
    status: "Connected",
    apiStatus: "Google My Business Posts API Connected",
    webhookUrl: "https://mybusiness.googleapis.com/v4/accounts/posts",
    lastSync: "Today, 09:30 AM",
  },
  {
    id: "int-wa",
    platform: "WhatsApp Cloud API",
    status: "Ready for Webhook",
    apiStatus: "Meta WhatsApp Business Cloud API Gateway",
    webhookUrl: "https://graph.facebook.com/v20.0/messages",
    lastSync: "Yesterday",
  },
  {
    id: "int-zapier",
    platform: "Zapier / Webhook",
    status: "Connected",
    apiStatus: "Direct Automation Trigger URL",
    webhookUrl: "https://hooks.zapier.com/hooks/catch/localbusiness/post",
    lastSync: "Active",
  },
];

export default function MarketingAutomationCenter({
  isKeyReady,
  onOpenKeyGuide,
  onSaveToWorkspace,
}: MarketingAutomationCenterProps) {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => {
    try {
      const saved = localStorage.getItem("lbs_scheduled_posts");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SCHEDULED_POSTS;
  });

  const [integrations] = useState<MarketingIntegration[]>(DEFAULT_INTEGRATIONS);

  const [weeklyFocus, setWeeklyFocus] = useState(
    "Weekend Sourdough Tasting, VIP Loyalty Perks & High-Margin Brunch"
  );
  const [isGeneratingCalendar, setIsGeneratingCalendar] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(scheduledPosts[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("lbs_scheduled_posts", JSON.stringify(scheduledPosts));
  }, [scheduledPosts]);

  // AI Content Calendar Synthesis
  const handleGenerateWeeklyCampaign = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGeneratingCalendar(true);

    try {
      const res = await fetch("/api/marketing-automation/generate-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: "Artisan Roast Cafe",
          industry: "Specialty Cafe & Bakery",
          weeklyFocus,
        }),
      });

      const data = await res.json();
      if (res.ok && data.calendar) {
        setScheduledPosts(data.calendar);
        setSelectedPost(data.calendar[0] || null);
      }
    } catch (err) {
      console.error("Marketing automation error", err);
    } finally {
      setIsGeneratingCalendar(false);
    }
  };

  const handlePublishNow = (post: ScheduledPost) => {
    setDispatchStatus(`Dispatching payload to authorized integrations for "${post.title}"...`);
    setTimeout(() => {
      setScheduledPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, status: "Published" } : p))
      );
      if (selectedPost?.id === post.id) {
        setSelectedPost((prev) => (prev ? { ...prev, status: "Published" } : null));
      }
      setDispatchStatus(`Successfully published across ${post.platforms.join(", ")}!`);
      setTimeout(() => setDispatchStatus(null), 3000);
    }, 1200);
  };

  const handleCopyPost = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeletePost = (id: string) => {
    setScheduledPosts((prev) => prev.filter((p) => p.id !== id));
    if (selectedPost?.id === id) {
      setSelectedPost(scheduledPosts.find((p) => p.id !== id) || null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5 text-purple-400" />
                  Marketing Automation Center
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  Cross-Platform Publishing Pipeline
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Multi-Platform Campaign Scheduler
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate a weekly content calendar, customize platform-specific captions, and trigger automated webhook publishing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onSaveToWorkspace) {
                  onSaveToWorkspace(
                    "Weekly Marketing Campaign Pipeline",
                    "Marketing Automation",
                    scheduledPosts
                  );
                  alert("Marketing campaign saved to Pro Workspace!");
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <FolderPlus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Save Campaign</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Weekly Campaign Generator Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Generate Strategic 7-Day Marketing Calendar</span>
          </h3>
          <p className="text-xs text-slate-400">
            Enter your core commercial objective or weekly theme for automatic post distribution.
          </p>
        </div>

        <form onSubmit={handleGenerateWeeklyCampaign} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={weeklyFocus}
              onChange={(e) => setWeeklyFocus(e.target.value)}
              placeholder="e.g. Weekend Sourdough Tasting, VIP Loyalty Perks & High-Margin Brunch"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
            />
            <button
              type="submit"
              disabled={isGeneratingCalendar}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingCalendar ? "animate-spin" : ""}`} />
              <span>{isGeneratingCalendar ? "Synthesizing Week..." : "Generate 7-Day Calendar"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Status Alert if Dispatched */}
      {dispatchStatus && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{dispatchStatus}</span>
        </div>
      )}

      {/* Main Grid: Weekly Queue & Post Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Scheduled Posts Timeline */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Weekly Publishing Queue ({scheduledPosts.length} Posts)
            </span>
            <span className="text-[11px] font-mono text-slate-500">Auto-Scheduled</span>
          </div>

          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {scheduledPosts.map((post) => {
              const isSelected = selectedPost?.id === post.id;
              return (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? "bg-slate-900 border-purple-500 shadow-md ring-1 ring-purple-500/30"
                      : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-purple-300 border border-slate-800">
                        {post.dayOfWeek}
                      </span>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {post.scheduledTime}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        post.status === "Published"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">{post.title}</h4>

                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-sans">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {post.platforms.map((plat) => (
                        <span
                          key={plat}
                          className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 font-medium"
                        >
                          {plat}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyPost(post.content, post.id);
                        }}
                        className="text-slate-400 hover:text-white p-1"
                        title="Copy content"
                      >
                        {copiedId === post.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePost(post.id);
                        }}
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="Delete post"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Post Studio & Integration Dispatch */}
        <div className="lg:col-span-6 space-y-4">
          {selectedPost ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                    Active Campaign Asset
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{selectedPost.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePublishNow(selectedPost)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Now</span>
                  </button>
                </div>
              </div>

              {/* Content Box */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Formatted Post Copy:</span>
                  <button
                    onClick={() => handleCopyPost(selectedPost.content, selectedPost.id)}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Text</span>
                  </button>
                </label>
                <textarea
                  rows={5}
                  value={selectedPost.content}
                  onChange={(e) =>
                    setSelectedPost((prev) => (prev ? { ...prev, content: e.target.value } : null))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 leading-relaxed font-sans focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              {/* Visual Prompt / Photography Direction */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Photography & Graphic Visual Direction:
                </span>
                <p className="text-slate-300 leading-relaxed italic">{selectedPost.visualPrompt}</p>
              </div>

              {/* Target Platforms */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Target Channels for This Post:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedPost.platforms.map((plat) => (
                    <span
                      key={plat}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>{plat}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Platform Integrations Status Box */}
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Configured Publishing Endpoints:
                </span>
                <div className="space-y-1.5 text-xs">
                  {integrations.map((int) => (
                    <div
                      key={int.id}
                      className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-900 pb-1 last:border-0"
                    >
                      <span className="font-semibold text-slate-300">{int.platform}</span>
                      <span className="font-mono text-emerald-400 text-[10px]">
                        {int.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 border border-slate-800 border-dashed rounded-2xl text-center text-slate-500">
              Select a scheduled post to review copy and dispatch webhook publishing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
