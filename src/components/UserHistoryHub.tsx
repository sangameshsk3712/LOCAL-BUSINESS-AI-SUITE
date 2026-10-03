import React, { useState, useEffect } from "react";
import {
  History,
  Search,
  Star,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
  Download,
  Calendar,
  Cloud,
  CheckCircle2,
  Lock,
  User,
  Clock
} from "lucide-react";
import { UserGeneratedWork, loadUserHistory, deleteUserWork } from "../services/firebase";
import { User as FirebaseUser } from "firebase/auth";

interface UserHistoryHubProps {
  currentUser: FirebaseUser | null;
  onOpenAuth: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export default function UserHistoryHub({
  currentUser,
  onOpenAuth,
  onNavigateToTab,
}: UserHistoryHubProps) {
  const [historyList, setHistoryList] = useState<UserGeneratedWork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<UserGeneratedWork | null>(null);

  // Load history whenever user changes
  useEffect(() => {
    let isMounted = true;
    async function fetchHistory() {
      setIsLoading(true);
      if (currentUser) {
        const records = await loadUserHistory(currentUser.uid);
        if (isMounted) {
          setHistoryList(records);
          if (records.length > 0 && !selectedItem) {
            setSelectedItem(records[0]);
          }
        }
      } else {
        // Fallback local storage for unauthenticated sessions
        try {
          const guestHistory = JSON.parse(localStorage.getItem("lbs_guest_history") || "[]");
          if (isMounted) {
            setHistoryList(guestHistory);
            if (guestHistory.length > 0 && !selectedItem) {
              setSelectedItem(guestHistory[0]);
            }
          }
        } catch {
          if (isMounted) setHistoryList([]);
        }
      }
      if (isMounted) setIsLoading(false);
    }

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (workId: string) => {
    if (!confirm("Are you sure you want to delete this generated work?")) return;
    if (currentUser) {
      await deleteUserWork(currentUser.uid, workId);
    } else {
      try {
        const local = JSON.parse(localStorage.getItem("lbs_guest_history") || "[]");
        const filtered = local.filter((x: any) => x.id !== workId);
        localStorage.setItem("lbs_guest_history", JSON.stringify(filtered));
      } catch {}
    }
    setHistoryList((prev) => prev.filter((item) => item.id !== workId));
    if (selectedItem?.id === workId) {
      setSelectedItem(null);
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(historyList, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lbs_generated_work_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredHistory = historyList.filter((item) => {
    const matchesModule = selectedModule === "all" || item.moduleType === selectedModule;
    const matchesQuery =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.promptOrInput?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.generatedOutput.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                <History className="w-3.5 h-3.5 text-indigo-400" />
                Persistent Work Memory
              </span>
              {currentUser ? (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5 font-mono">
                  <Cloud className="w-3 h-3 text-emerald-400" />
                  Cloud Synced: {currentUser.email || "Guest Session"}
                </span>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 flex items-center gap-1.5 transition"
                >
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Sign In to Sync Cross-Device</span>
                </button>
              )}
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white">
              My Generated AI Work & Campaign History
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Every marketing campaign, website widget, SEO audit, voice lead, and financial model generated is automatically preserved here so you can retrieve, re-copy, or continue working anytime.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              disabled={historyList.length === 0}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition border border-slate-700 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export History (JSON)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 shadow">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search generated work, titles, keywords, campaigns..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {[
            { id: "all", label: "All Works" },
            { id: "omnistar_10x", label: "OmniStar 10X" },
            { id: "growth", label: "Growth Plans" },
            { id: "omni_gpt", label: "OmniBiz GPT" },
            { id: "content", label: "Content" },
            { id: "crm", label: "CRM Leads" },
            { id: "code_widget", label: "Code Widgets" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedModule(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedModule === tab.id
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout: History List (Left) + Detail Reader (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: History Items List */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-900 rounded-3xl border border-slate-800 animate-pulse">
              Retrieving your saved work history from Firebase...
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <History className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Generated History Found</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Generate a business plan, website widget, or marketing copy in any hub, and it will be permanently saved here.
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2 relative ${
                    isSelected
                      ? "bg-indigo-950/40 border-indigo-400/80 shadow-lg shadow-indigo-500/10"
                      : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 font-mono">
                      {item.moduleType.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>

                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {item.generatedOutput.replace(/#{1,6}\s?/g, "")}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <span>Click to view full work</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1 transition"
                      title="Delete this record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Work Reader & Actions */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-left">
          {selectedItem ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                      {selectedItem.moduleType.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Created: {new Date(selectedItem.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{selectedItem.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(selectedItem.id, selectedItem.generatedOutput)}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
                  >
                    {copiedId === selectedItem.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === selectedItem.id ? "Copied!" : "Copy Work"}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(selectedItem.id)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {selectedItem.promptOrInput && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Original Prompt / Request:</span>
                  <p className="text-xs text-slate-300 font-mono">{selectedItem.promptOrInput}</p>
                </div>
              )}

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 max-h-[500px] overflow-y-auto">
                <div className="prose prose-invert max-w-none text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedItem.generatedOutput}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-2">
              <History className="w-8 h-8 text-slate-600" />
              <p className="text-xs text-slate-400">
                Select any saved work item from the list on the left to read, copy, or export it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
