import React, { useState } from "react";
import { Search, Plus, Terminal, Trash2, Layers, RefreshCcw } from "lucide-react";
import { PromptTemplate, CATEGORIES } from "../types";

interface PromptListProps {
  prompts: PromptTemplate[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
  onDelete: (id: string) => void;
  onResetToDefault: () => void;
}

export default function PromptList({
  prompts,
  selectedId,
  onSelect,
  onCreateNew,
  onDelete,
  onResetToDefault
}: PromptListProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(search.toLowerCase()) ||
      prompt.description.toLowerCase().includes(search.toLowerCase()) ||
      prompt.template.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || prompt.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Category badge color generator
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Code Generation":
        return "bg-indigo-950/40 text-indigo-300 border-indigo-900/50";
      case "Summarization":
        return "bg-emerald-950/40 text-emerald-300 border-emerald-900/50";
      case "Translation":
        return "bg-amber-950/40 text-amber-300 border-amber-900/50";
      case "Data Extraction":
        return "bg-sky-950/40 text-sky-300 border-sky-900/50";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden" id="prompt-list-container">
      {/* Search and Header */}
      <div className="p-4 border-b border-slate-850 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <h2 className="font-bold text-sm text-slate-100">Saved System Prompts</h2>
          </div>
          <span className="text-xs bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
            {prompts.length} total
          </span>
        </div>

        {/* Plus / Create Prompts Trigger */}
        <button
          onClick={onCreateNew}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs py-2 px-3 rounded-lg shadow-sm transition-all hover:shadow-indigo-900/20 active:scale-[0.98]"
          id="btn-create-prompt-sidebar"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Prompt</span>
        </button>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search prompts language or concepts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 text-slate-100 text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 placeholder-slate-500 transition-colors"
            id="prompt-search-input"
          />
        </div>
      </div>

      {/* Category Fast Filters */}
      <div className="p-2 bg-slate-900/40 border-b border-slate-850 overflow-x-auto flex gap-1.5 scrollbar-thin scrollbar-thumb-slate-850">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
            selectedCategory === "All"
              ? "bg-slate-850 text-white border border-slate-750"
              : "text-slate-450 hover:text-slate-200"
          }`}
          id="category-all-filter"
        >
          All Categories
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-slate-850 text-white border border-slate-750"
                : "text-slate-450 hover:text-slate-200"
            }`}
            id={`category-filter-${cat.replace(/\s+/g, "-").toLowerCase()}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Prompts list */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-900">
        {filteredPrompts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <Layers className="w-8 h-8 mx-auto stroke-[1.5]" />
            <p className="text-xs">No matching prompts found.</p>
            {search || selectedCategory !== "All" ? (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="text-[11px] text-sky-400 hover:underline"
              >
                Clear all filters
              </button>
            ) : null}
          </div>
        ) : (
          filteredPrompts.map((prompt) => {
            const isSelected = prompt.id === selectedId;
            return (
              <div
                key={prompt.id}
                onClick={() => onSelect(prompt.id)}
                className={`group p-3.5 text-left cursor-pointer transition-all flex items-start gap-3 relative ${
                  isSelected
                    ? "bg-indigo-950/25 border-l-2 border-indigo-500"
                    : "hover:bg-slate-900/50 border-l-2 border-transparent"
                }`}
                id={`prompt-item-${prompt.id}`}
              >
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs text-slate-200 group-hover:text-white truncate">
                      {prompt.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete prompt "${prompt.title}"?`)) {
                          onDelete(prompt.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-850 text-slate-450 hover:text-red-400 transition-all shrink-0"
                      title="Delete Prompt"
                      id={`delete-prompt-${prompt.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-450 line-clamp-2 leading-relaxed">
                    {prompt.description || "No description provided."}
                  </p>

                  <div className="flex items-center gap-2 pt-0.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${getCategoryColor(prompt.category)}`}>
                      {prompt.category}
                    </span>
                    {prompt.variables.length > 0 && (
                      <span className="text-[9px] text-slate-500 font-mono">
                        {prompt.variables.length} vars
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Utilities */}
      <div className="p-3 bg-slate-900/50 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-500">
        <span className="font-medium">Total Prompt Registry</span>
        <button
          onClick={onResetToDefault}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
          title="Reset to default factory prompt templates"
          id="btn-reset-default-prompts"
        >
          <RefreshCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
      </div>
    </div>
  );
}
