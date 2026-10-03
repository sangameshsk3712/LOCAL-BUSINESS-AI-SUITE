import React, { useState, useEffect } from "react";
import {
  Search,
  Star,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  X,
  Phone,
  MessageCircle,
  Crown,
  BadgeCheck,
  Grid,
  List,
  SlidersHorizontal,
  Flame,
  Zap,
  Check
} from "lucide-react";
import { MainNavTab } from "../App";

export interface NavItemConfig {
  id: MainNavTab;
  label: string;
  tag?: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor?: string;
  isSuper?: boolean;
  category: "superbrain" | "operations" | "creative" | "growth" | "system";
  description?: string;
}

interface Props {
  activeNav: MainNavTab;
  onSelectNav: (tab: MainNavTab) => void;
  isProUser: boolean;
  navItems: NavItemConfig[];
  userStats?: { activeNow: number; totalPageViews: number };
  isMobileDrawer?: boolean;
}

const DEFAULT_FAVORITES: MainNavTab[] = [
  "omnistar_10x",
  "unified_workspace" as MainNavTab,
  "superbrain",
  "voice_rep",
  "geogrid",
  "whatsapp_onboarding",
];

export default function NavigationDirectory({
  activeNav,
  onSelectNav,
  isProUser,
  navItems,
  userStats,
  isMobileDrawer = false,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");

  // Favourites state persisted in localStorage
  const [favorites, setFavorites] = useState<MainNavTab[]>(() => {
    try {
      const saved = localStorage.getItem("lbs_favorite_tools");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_FAVORITES;
  });

  // Recently used tools persisted in localStorage
  const [recentTools, setRecentTools] = useState<MainNavTab[]>(() => {
    try {
      const saved = localStorage.getItem("lbs_recent_tools");
      if (saved) return JSON.parse(saved);
    } catch {}
    return ["unified_workspace" as MainNavTab, "superbrain", "analytics", "growth"];
  });

  const toggleFavorite = (e: React.MouseEvent, id: MainNavTab) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("lbs_favorite_tools", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleToolClick = (id: MainNavTab) => {
    onSelectNav(id);
    // Update recent tools
    setRecentTools((prev) => {
      const filtered = prev.filter((item) => item !== id);
      const updated = [id, ...filtered].slice(0, 5);
      try {
        localStorage.setItem("lbs_recent_tools", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const categories = [
    { id: "all", label: "All Tools", count: navItems.length },
    { id: "superbrain", label: "⭐ SuperBrains", count: navItems.filter((i) => i.category === "superbrain").length },
    { id: "operations", label: "🏢 Operations", count: navItems.filter((i) => i.category === "operations").length },
    { id: "creative", label: "🎙️ Creative", count: navItems.filter((i) => i.category === "creative").length },
    { id: "growth", label: "🤖 Growth & AI", count: navItems.filter((i) => i.category === "growth").length },
    { id: "system", label: "👑 Pro & System", count: navItems.filter((i) => i.category === "system").length },
  ];

  // Filtering tools based on search and category
  const filteredTools = navItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const cleanSearch = searchQuery.toLowerCase().trim();
    if (!cleanSearch) return matchesCategory;

    const matchesSearch =
      item.label.toLowerCase().includes(cleanSearch) ||
      (item.tag && item.tag.toLowerCase().includes(cleanSearch)) ||
      (item.description && item.description.toLowerCase().includes(cleanSearch));

    return matchesCategory && matchesSearch;
  });

  const favoriteToolObjects = navItems.filter((item) => favorites.includes(item.id));
  const recentToolObjects = navItems.filter((item) => recentTools.includes(item.id));

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* 1. Brand Logo Header */}
      <div className="flex items-center justify-between px-2 pt-1 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-indigo-500/30 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-black text-white tracking-wide flex items-center gap-1.5">
              <span>Local Business Suite</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-amber-300 font-mono font-bold">
              100Cr AI Enterprise OS
            </div>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
          <button
            onClick={() => setViewMode("cards")}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === "cards" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
            title="Personalized Card Grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
            title="Compact List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Global Search Bar */}
      <div className="relative shrink-0 px-1">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 28+ tools (e.g. SEO, Voice, Ads)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 px-1 shrink-0 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              selectedCategory === cat.id
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400"
                : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800"
            }`}
          >
            <span>{cat.label}</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${selectedCategory === cat.id ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Scrollable Tool Body */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {/* 4. Recently Used Tools (if no active search) */}
        {!searchQuery && selectedCategory === "all" && recentToolObjects.length > 0 && (
          <div className="space-y-1.5 px-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Recently Used
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Quick Launch</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {recentToolObjects.slice(0, 4).map((tool) => {
                const Icon = tool.icon;
                const isActive = activeNav === tool.id;
                return (
                  <button
                    key={`rec-${tool.id}`}
                    onClick={() => handleToolClick(tool.id)}
                    className={`p-2.5 rounded-2xl border text-left transition-all group flex items-center gap-2.5 min-h-[52px] ${
                      isActive
                        ? "bg-indigo-600/90 border-indigo-400 text-white shadow-md ring-1 ring-indigo-400"
                        : "bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center shrink-0">
                      <Icon className={`w-4 h-4 ${tool.accentColor || "text-amber-400"}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate group-hover:text-amber-300 transition-colors">
                        {tool.label}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate font-mono">
                        {tool.tag || "Tool"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Starred / Favorite Tools (if no active search) */}
        {!searchQuery && selectedCategory === "all" && favoriteToolObjects.length > 0 && (
          <div className="space-y-1.5 px-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1 text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                My Favourites ({favoriteToolObjects.length})
              </span>
            </div>

            <div className="space-y-1">
              {favoriteToolObjects.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeNav === tool.id;
                return (
                  <div
                    key={`fav-${tool.id}`}
                    onClick={() => handleToolClick(tool.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer group min-h-[50px] ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-md ring-1 ring-indigo-400"
                        : "bg-slate-900/90 hover:bg-slate-850 border-slate-800 text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-slate-950/80 flex items-center justify-center shrink-0">
                        <Icon className={`w-4 h-4 ${isActive ? "text-white" : tool.accentColor || "text-amber-400"}`} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-bold truncate block group-hover:text-amber-300 transition-colors">
                          {tool.label}
                        </span>
                        {tool.tag && (
                          <span className="text-[10px] font-mono text-slate-400">
                            {tool.tag}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => toggleFavorite(e, tool.id)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform shrink-0"
                      title="Remove from favorites"
                    >
                      <Star className="w-4 h-4 fill-amber-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. Primary Tools Directory */}
        <div className="space-y-1.5 px-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>
              {searchQuery ? `Search Results (${filteredTools.length})` : "All Suite Tools"}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {filteredTools.length} Available
            </span>
          </div>

          {filteredTools.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
              <Search className="w-6 h-6 text-slate-500 mx-auto" />
              <div className="text-xs font-bold text-slate-300">No tools match "{searchQuery}"</div>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-indigo-400 underline"
              >
                Clear Search
              </button>
            </div>
          ) : viewMode === "cards" ? (
            /* Card Grid Layout - Large Readable Touch Targets (min 56px height) */
            <div className="space-y-1.5">
              {filteredTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeNav === tool.id;
                const isFav = favorites.includes(tool.id);

                return (
                  <div
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    className={`w-full p-3 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between min-h-[56px] relative overflow-hidden ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600/95 via-purple-600/90 to-indigo-600/95 text-white border-indigo-400 shadow-xl shadow-indigo-950/40 ring-2 ring-indigo-400/50"
                        : tool.isSuper
                        ? "bg-slate-900/95 hover:bg-slate-850 border-amber-500/30 text-white"
                        : "bg-slate-900/80 hover:bg-slate-850/90 border-slate-800 text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-950 border border-slate-800 text-slate-300"
                      }`}>
                        <Icon className={`w-5 h-5 ${isActive ? "text-white" : tool.accentColor || "text-amber-400"}`} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs sm:text-sm font-extrabold truncate block group-hover:text-amber-300 transition-colors">
                            {tool.label}
                          </span>
                          {tool.tag && (
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                              isActive
                                ? "bg-white/20 text-white"
                                : tool.isSuper
                                ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                                : "bg-slate-800 text-slate-400 border border-slate-700"
                            }`}>
                              {tool.tag}
                            </span>
                          )}
                        </div>
                        {tool.description && (
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            {tool.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => toggleFavorite(e, tool.id)}
                        className="p-1.5 text-slate-500 hover:text-amber-400 transition-colors"
                        title={isFav ? "Remove Favorite" : "Add to Favorites"}
                      >
                        <Star className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                      </button>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "text-white translate-x-1" : "text-slate-600"}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Compact List View */
            <div className="space-y-0.5">
              {filteredTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeNav === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? "bg-indigo-600 text-white shadow"
                        : "text-slate-300 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${tool.accentColor || "text-slate-400"}`} />
                      <span className="truncate">{tool.label}</span>
                    </div>
                    {tool.tag && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {tool.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 7. Bottom Founder & Hotline Footer */}
      <div className="pt-2 border-t border-slate-800/80 space-y-2 shrink-0">
        <div className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/30 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-200 font-extrabold flex items-center gap-1">
              Sangamesh Khatge
              <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              FamPay: 8867605076
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:8431107332"
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold text-center flex items-center justify-center gap-1 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call 8431107332</span>
            </a>
            <a
              href="https://wa.me/918431107332"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
              title="WhatsApp Founder"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {userStats?.activeNow || 1} online
          </span>
          <button
            onClick={() => onSelectNav("premium")}
            className="text-amber-300 font-bold hover:underline flex items-center gap-1"
          >
            <Crown className="w-3 h-3" />
            <span>{isProUser ? "👑 PRO ACTIVE" : "💎 GO PREMIUM"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
