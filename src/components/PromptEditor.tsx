import React, { useEffect, useState } from "react";
import { Sliders, HelpCircle, FileJson, Info, Variable, CheckCircle2 } from "lucide-react";
import { PromptTemplate, CATEGORIES } from "../types";

interface PromptEditorProps {
  prompt: PromptTemplate;
  onUpdate: (updated: PromptTemplate) => void;
  variableValues: Record<string, string>;
  onVariableValueChange: (variableName: string, value: string) => void;
  onRunTest: () => void;
  isLoading: boolean;
  isKeyReady: boolean;
}

export default function PromptEditor({
  prompt,
  onUpdate,
  variableValues,
  onVariableValueChange,
  onRunTest,
  isLoading,
  isKeyReady
}: PromptEditorProps) {
  const [templateText, setTemplateText] = useState(prompt.template);

  // Parse variables from template whenever it changes
  useEffect(() => {
    setTemplateText(prompt.template);
  }, [prompt.template]);

  const handleTemplateChange = (val: string) => {
    setTemplateText(val);

    // Extract variables using regex matches for {{variable_name}}
    const matches = val.match(/\{\{([a-zA-Z0-9_-]+)\}\}/g) || [];
    const uniqueVars = Array.from(
      new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "")))
    );

    onUpdate({
      ...prompt,
      template: val,
      variables: uniqueVars,
    });
  };

  // Generate real-time preview of the prompt fully compiled
  const getCompiledPrompt = () => {
    let compiled = templateText;
    prompt.variables.forEach((variable) => {
      const val = variableValues[variable] || `[${variable}]`;
      compiled = compiled.replaceAll(`{{${variable}}}`, val);
    });
    return compiled;
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-5" id="prompt-editor-panel">
      {/* Title & Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Prompt Title
          </label>
          <input
            type="text"
            value={prompt.title}
            onChange={(e) => onUpdate({ ...prompt, title: e.target.value })}
            className="w-full bg-slate-900 text-slate-100 text-sm py-2 px-3 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors font-medium"
            placeholder="Give this prompt a descriptive name..."
            id="prompt-title-input"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Target Category
          </label>
          <select
            value={prompt.category}
            onChange={(e) => onUpdate({ ...prompt, category: e.target.value })}
            className="w-full bg-slate-900 text-slate-100 text-sm py-2 px-3 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors font-medium cursor-pointer"
            id="prompt-category-select"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Workspace Objective / Description
        </label>
        <input
          type="text"
          value={prompt.description}
          onChange={(e) => onUpdate({ ...prompt, description: e.target.value })}
          className="w-full bg-slate-900 text-slate-100 text-xs py-2 px-3 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
          placeholder="Brief description of what this prompt achieves..."
          id="prompt-description-input"
        />
      </div>

      {/* System Instructions */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            System Instructions (Persona / Rules)
          </label>
          <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
            Set role-play guide or guidelines
          </span>
        </div>
        <textarea
          rows={3}
          value={prompt.systemInstruction}
          onChange={(e) => onUpdate({ ...prompt, systemInstruction: e.target.value })}
          className="w-full bg-slate-900 text-slate-100 text-xs font-mono p-3 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-650 resize-y"
          placeholder="e.g. You are an expert code analyst. Highlight code smells in high-contrast format..."
          id="prompt-system-instruction-textarea"
        />
      </div>

      {/* Prompt Template */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Prompt Template Structure
          </label>
          <div className="text-[10px] text-indigo-400 flex items-center gap-1 font-medium bg-indigo-950/30 px-2 py-0.5 rounded border border-indigo-900/40">
            <Variable className="w-3.5 h-3.5 text-indigo-300" />
            <span>Wrap dynamic fields with <code className="font-mono text-white text-[11px] font-bold">{"{{variableName}}"}</code></span>
          </div>
        </div>
        <textarea
          rows={6}
          value={templateText}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className="w-full bg-slate-900 text-slate-100 text-xs font-mono p-3 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-650 resize-y leading-relaxed"
          placeholder="Enter prompt structure. Example: Parse the text following:\n{{inputText}}\n\nOutput only valid {{formatType}}"
          id="prompt-template-textarea"
        />
      </div>

      {/* Parameters (Temperature) */}
      <div className="bg-slate-900/50 border border-slate-900 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300">Run Configuration Settings</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Gemini-3.5-Flash</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Temperature (Randomness vs. Determinism)</span>
            <span className="text-indigo-400 font-bold">{prompt.temperature}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.5"
            step="0.1"
            value={prompt.temperature}
            onChange={(e) => onUpdate({ ...prompt, temperature: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            id="prompt-temperature-range"
          />
          <div className="flex justify-between text-[10px] text-slate-550">
            <span>Deterministic / Logical</span>
            <span>Highly Creative / Divergent</span>
          </div>
        </div>
      </div>

      {/* Dynamic Input Variables Block */}
      <div className="border-t border-slate-900 pt-5 space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-slate-200">
            {prompt.variables.length > 0 ? "Detected Template Variables" : "Prompt Input Parameters"}
          </h3>
          <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
            {prompt.variables.length > 0
              ? "Provide mock parameters to test variable replacement compilation live."
              : "No custom double curly braces found. A general prompt input is active."}
          </p>
        </div>

        {prompt.variables.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prompt.variables.map((variable) => (
              <div key={variable} className="space-y-1.5">
                <label className="block text-[11.5px] font-medium text-indigo-300 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>{variable}</span>
                </label>
                <textarea
                  rows={2}
                  value={variableValues[variable] || ""}
                  onChange={(e) => onVariableValueChange(variable, e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 text-xs p-2 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors resize-y font-mono"
                  placeholder={`Set test value for ${variable}...`}
                  id={`variable-input-${variable}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-slate-900/40 rounded-lg text-slate-450 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-500" />
            <span>The prompt template will be processed literally. No variable mappings needed.</span>
          </div>
        )}
      </div>

      {/* Fully Compiled Prompt Preview */}
      <div className="bg-slate-900/30 rounded-xl border border-slate-900 p-4 space-y-2">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Live Hydrated Prompt Preview
        </span>
        <div className="max-h-36 overflow-y-auto bg-slate-950 border border-slate-900 rounded-lg p-3 font-mono text-[11px] text-slate-350 whitespace-pre-wrap leading-relaxed">
          {getCompiledPrompt()}
        </div>
      </div>

      {/* Submit Trigger Action */}
      <div className="pt-3 border-t border-slate-900 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Info className="w-4 h-4 text-slate-400" />
          <span>Calls custom deployment of Gemini-3.5-Flash</span>
        </div>
        <button
          onClick={onRunTest}
          disabled={isLoading}
          className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide shadow-md transition-all flex items-center gap-2 ${
            isLoading
              ? "bg-indigo-950 text-indigo-400 cursor-not-allowed"
              : isKeyReady
              ? "bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-900/30 text-white active:scale-95"
              : "bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white"
          }`}
          id="btn-run-prompt-test"
        >
          {isLoading ? "Generating Response..." : isKeyReady ? "Run & Compile Prompt" : "Test Prompt (Ignore Key Status)"}
        </button>
      </div>
    </div>
  );
}
