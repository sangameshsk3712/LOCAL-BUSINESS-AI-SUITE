import React, { useState } from "react";
import {
  MapPin,
  Crosshair,
  TrendingUp,
  BarChart3,
  Layers,
  Search,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Building2,
  ExternalLink,
  Code2,
  Info,
  ChevronRight
} from "lucide-react";
import { LocationBranch, BrandGuardrails } from "../types";

interface GeoGridRadarProps {
  activeLocation?: LocationBranch;
  allLocations?: LocationBranch[];
  onSelectLocation?: (id: string) => void;
  onOpenFranchise?: () => void;
  isKeyReady: boolean;
  onOpenKeyGuide: () => void;
  guardrails?: BrandGuardrails;
}

interface GridNode {
  id: number;
  row: number;
  col: number;
  name: string;
  distanceMiles: number;
  rank: number;
  competitorWinner: string;
  shareOfVoice: number;
}

const PRESET_KEYWORDS = [
  "bakery near me",
  "best sourdough bread",
  "specialty espresso coffee",
  "wedding catering cakes",
  "gluten-free bakery breakfast"
];

// Generator for 5x5 neighborhood coordinates
function generateGridNodes(storeName: string, keyword: string): GridNode[] {
  const seed = (storeName.length * 7 + keyword.length * 13) % 100;
  const nodes: GridNode[] = [];
  const neighborhoods = [
    "North Campus", "Hyde Park", "Mueller East", "Cherrywood", "Windsor Park",
    "Clarksville", "Downtown Metro", "Capitol District", "East 6th District", "Govalle",
    "Zilker Park", "South Congress (HQ)", "Travis Heights", "Riverside", "Pleasant Valley",
    "Barton Hills", "South Lamar", "Galindo Central", "St. Edwards", "Oltorf East",
    "Sunset Valley", "Westgate", "South Manchaca", "Franklin Park", "McKinney North"
  ];

  const competitors = [
    "Texas French Bread Co.",
    "Upper Crust Artisanal",
    "Easy Tiger Bakery",
    "Swedish Hill Bakery",
    "La Mexicana Panaderia"
  ];

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const idx = r * 5 + c;
      // Distance from center (r=2, c=2 is center HQ)
      const distFromCenter = Math.sqrt(Math.pow(r - 2, 2) + Math.pow(c - 2, 2));
      const distanceMiles = parseFloat((distFromCenter * 0.9 + 0.3).toFixed(1));

      // Center is usually rank 1 or 2, outer rings have varying ranks
      let rank = 1;
      if (distFromCenter === 0) {
        rank = 1;
      } else if (distFromCenter <= 1.5) {
        rank = ((seed + idx) % 3) + 1; // 1 to 3 (Local 3-Pack)
      } else if (distFromCenter <= 2.5) {
        rank = ((seed + idx * 2) % 6) + 3; // 3 to 8
      } else {
        rank = ((seed + idx * 3) % 9) + 6; // 6 to 14
      }

      const compIdx = (seed + idx) % competitors.length;
      const competitorWinner = rank <= 2 ? storeName : competitors[compIdx];
      const shareOfVoice = rank <= 3 ? Math.max(88 - rank * 12, 55) : Math.max(45 - rank * 3, 8);

      nodes.push({
        id: idx,
        row: r,
        col: c,
        name: neighborhoods[idx] || `Node ${r + 1}-${c + 1}`,
        distanceMiles,
        rank,
        competitorWinner,
        shareOfVoice
      });
    }
  }

  return nodes;
}

export default function GeoGridRadar({
  activeLocation,
  allLocations,
  onSelectLocation,
  onOpenFranchise,
  isKeyReady,
  onOpenKeyGuide,
  guardrails
}: GeoGridRadarProps) {
  const currentBranchName = activeLocation?.name || "Artisan Sourdough Co.";
  const currentCity = activeLocation?.city || "Austin, TX";
  const [selectedKeyword, setSelectedKeyword] = useState<string>("bakery near me");
  const [customKeyword, setCustomKeyword] = useState<string>("");
  const [activeRadius, setActiveRadius] = useState<string>("5 Miles (Standard Metro)");
  const [selectedNodeId, setSelectedNodeId] = useState<number>(12); // Center node default

  // AI Booster state
  const [isGeneratingBooster, setIsGeneratingBooster] = useState<boolean>(false);
  const [boosterResult, setBoosterResult] = useState<string>("");
  const [boosterError, setBoosterError] = useState<string | null>(null);
  const [copiedBooster, setCopiedBooster] = useState<boolean>(false);
  const [copiedSchema, setCopiedSchema] = useState<boolean>(false);

  const activeQuery = customKeyword.trim() ? customKeyword.trim() : selectedKeyword;
  const gridNodes = React.useMemo(() => {
    return generateGridNodes(currentBranchName, activeQuery);
  }, [currentBranchName, activeQuery]);

  const selectedNode = gridNodes.find((n) => n.id === selectedNodeId) || gridNodes[12];

  // Aggregated KPIs across the 25 nodes
  const avgRank = (gridNodes.reduce((acc, n) => acc + n.rank, 0) / gridNodes.length).toFixed(1);
  const top3Nodes = gridNodes.filter((n) => n.rank <= 3).length;
  const packPresencePercent = Math.round((top3Nodes / gridNodes.length) * 100);
  const avgShareOfVoice = Math.round(
    gridNodes.reduce((acc, n) => acc + n.shareOfVoice, 0) / gridNodes.length
  );

  // Generate Schema.org JSON-LD
  const schemaJsonLd = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "Bakery",
      "@id": `https://example.com/locations/${activeLocation?.id || "austin-hq"}`,
      "name": currentBranchName,
      "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff",
      "telephone": activeLocation?.phone || "+1 (512) 555-0192",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": activeLocation?.address || "1401 S Congress Ave",
        "addressLocality": currentCity.split(",")[0] || "Austin",
        "addressRegion": "TX",
        "postalCode": "78704",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 30.2523,
        "longitude": -97.7497
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "07:00",
          "closes": "19:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Sunday",
          "opens": "08:00",
          "closes": "16:00"
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": String(activeLocation?.monthlyReviews ? activeLocation.monthlyReviews * 12 : "420")
      }
    },
    null,
    2
  );

  const handleGenerateBooster = async () => {
    setIsGeneratingBooster(true);
    setBoosterError(null);
    setBoosterResult("");

    try {
      const response = await fetch("/api/business/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "geo_grid_booster",
          payload: {
            businessName: currentBranchName,
            city: currentCity,
            keyword: activeQuery,
            currentRank: avgRank,
            competitorName: selectedNode.competitorWinner,
            weakZones: `Outer nodes: ${gridNodes.filter((n) => n.rank > 6).map((n) => n.name).slice(0, 3).join(", ")}`
          },
          guardrails
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to generate Local Rank Booster.");
      }
      setBoosterResult(data.result);
    } catch (err: any) {
      setBoosterError(err.message || "An error occurred generating rank booster plan.");
    } finally {
      setIsGeneratingBooster(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/30";
    }
    if (rank <= 7) {
      return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    }
    return "bg-rose-500/20 text-rose-300 border-rose-500/40";
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Crosshair className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">Geo-Grid Local SEO & Google Maps Rank Radar</h2>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300">
                  Step 2 Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                5x5 coordinate neighborhood rank heatmap, Google 3-Pack share of voice, competitor dominance radar, and rich Schema.org generator.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {allLocations && allLocations.length > 1 && onSelectLocation && activeLocation && (
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <select
                  value={activeLocation.id}
                  onChange={(e) => onSelectLocation(e.target.value)}
                  className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
                >
                  {allLocations.map((loc) => (
                    <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                      {loc.name} ({loc.city})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {onOpenFranchise && (
              <button
                type="button"
                onClick={onOpenFranchise}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 transition-colors flex items-center gap-1"
              >
                <span>Franchise Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

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

      {/* KPI Overview Banner for Active Keyword */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>Average Grid Rank</span>
            <Crosshair className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">#{avgRank}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Top 3 in {top3Nodes} of 25 nodes
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>Google 3-Pack Presence</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{packPresencePercent}%</div>
          <div className="text-[11px] text-slate-400 mt-1">High conversion local dominance</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>Share of Local Voice</span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300">{avgShareOfVoice}%</div>
          <div className="text-[11px] text-slate-400 mt-1">Calculated search impression share</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>Active Storefront</span>
            <MapPin className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-white truncate">{currentBranchName}</div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">{currentCity}</div>
        </div>
      </div>

      {/* Search Query Selector & Radar Radius */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-400" />
              <span>Target Local Search Query</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select or type any high-intent search query to simulate the 5x5 Google Maps mobile pack ranking.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Scan Radius:</span>
            {["2 Miles", "5 Miles (Standard Metro)", "10 Miles"].map((rad) => (
              <button
                key={rad}
                type="button"
                onClick={() => setActiveRadius(rad)}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  activeRadius === rad
                    ? "bg-blue-600/30 border-blue-500/50 text-blue-300 font-semibold"
                    : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                {rad.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Query Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {PRESET_KEYWORDS.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => {
                setSelectedKeyword(kw);
                setCustomKeyword("");
              }}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                selectedKeyword === kw && !customKeyword
                  ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                  : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
              }`}
            >
              "{kw}"
            </button>
          ))}
        </div>

        {/* Custom Query Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customKeyword}
            onChange={(e) => setCustomKeyword(e.target.value)}
            placeholder="Or enter custom keyword (e.g. 'catering platters', 'artisan brioche', 'custom wedding cakes')..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
          />
          {customKeyword && (
            <button
              type="button"
              onClick={() => setCustomKeyword("")}
              className="text-xs px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Geo-Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 5x5 Geo-Grid Visualization (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-slate-200">5x5 Neighborhood Geo-Coordinate Heatmap</h3>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Rank 1-3 (3-Pack)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Rank 4-7
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Rank 8+
              </span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 relative overflow-hidden">
            {/* Subtle radar circular rings in the background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-[180px] h-[180px] rounded-full border border-blue-500/40" />
              <div className="absolute w-[280px] h-[280px] rounded-full border border-blue-500/30" />
              <div className="absolute w-[380px] h-[380px] rounded-full border border-blue-500/20" />
            </div>

            <div className="grid grid-cols-5 gap-2 relative z-10">
              {gridNodes.map((node) => {
                const isSelected = node.id === selectedNodeId;
                const isHQ = node.id === 12;

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`aspect-square rounded-xl p-2 flex flex-col items-center justify-between border transition-all text-center relative group ${
                      isSelected
                        ? "ring-2 ring-blue-400 shadow-lg scale-105 z-20 " + getRankBadge(node.rank)
                        : "hover:scale-102 " + getRankBadge(node.rank)
                    }`}
                  >
                    {isHQ && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[9px] font-bold shadow">
                        HQ
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400 line-clamp-1 group-hover:text-slate-200">
                      {node.name.split(" ")[0]}
                    </span>

                    <span className="text-base font-extrabold font-mono tracking-tight">
                      #{node.rank}
                    </span>

                    <span className="text-[9px] text-slate-400 font-mono">
                      {node.distanceMiles} mi
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center">
            💡 Click any grid node to inspect neighborhood competitor dominance, share-of-voice, and distance.
          </p>
        </div>

        {/* Selected Node Details & Competitor Dominance (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Node Inspector</span>
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              Coordinate #{selectedNode.id + 1}
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div>
              <div className="text-xs text-slate-400">Neighborhood / Cross Street</div>
              <div className="text-base font-bold text-white mt-0.5">{selectedNode.name}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
              <div>
                <div className="text-[10px] text-slate-400">Rank Position</div>
                <div className="text-lg font-bold font-mono text-emerald-400">#{selectedNode.rank}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Distance</div>
                <div className="text-lg font-bold font-mono text-slate-200">{selectedNode.distanceMiles} mi</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Voice Share</div>
                <div className="text-lg font-bold font-mono text-purple-400">{selectedNode.shareOfVoice}%</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[11px] text-slate-400">Local Pack Leader at this node:</div>
              <div className="text-xs font-semibold text-amber-300 mt-0.5 flex items-center gap-1.5">
                <span>🏆</span>
                <span>{selectedNode.competitorWinner}</span>
              </div>
            </div>
          </div>

          {/* AI Local Rank Booster Trigger */}
          <div className="bg-gradient-to-br from-indigo-950/60 to-blue-950/60 border border-indigo-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Local Pack Ranking Booster (gemini-3.8-flash)</span>
            </div>
            <p className="text-xs text-slate-300">
              Synthesize an action plan to expand Google 3-Pack rank into the outer weak zones without new lease costs.
            </p>

            <button
              type="button"
              onClick={handleGenerateBooster}
              disabled={isGeneratingBooster}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              {isGeneratingBooster ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing Local Pack Signals...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Rank Booster Action Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Booster Action Plan Output */}
      {boosterError && (
        <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-4 text-rose-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{boosterError}</span>
        </div>
      )}

      {boosterResult && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Local Pack Ranking Booster Plan for "{activeQuery}"</span>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(boosterResult);
                setCopiedBooster(true);
                setTimeout(() => setCopiedBooster(false), 2000);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-colors"
            >
              {copiedBooster ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBooster ? "Copied Plan!" : "Copy Booster Plan"}</span>
            </button>
          </div>

          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
            {boosterResult}
          </div>
        </div>
      )}

      {/* Schema.org (JSON-LD) Generator Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-200">Schema.org (JSON-LD) LocalBusiness Structured Data</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Embed directly into your storefront website header to gain instant Google Knowledge Panel & Local Pack rich snippets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <span>Google Rich Results Test</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              onClick={() => {
                navigator.clipboard.writeText(schemaJsonLd);
                setCopiedSchema(true);
                setTimeout(() => setCopiedSchema(false), 2000);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSchema ? "Copied JSON-LD!" : "Copy JSON-LD"}</span>
            </button>
          </div>
        </div>

        <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
          {schemaJsonLd}
        </pre>
      </div>
    </div>
  );
}
