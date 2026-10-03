import React, { useState } from "react";
import { Terminal, Copy, Check, AlertTriangle, Cpu, Clock, HelpCircle, Code } from "lucide-react";

interface OutputConsoleProps {
  output: string;
  isLoading: boolean;
  error: { type?: string; message: string } | null;
  elapsedTime: number; // in milliseconds
  promptLength: number;
}

export default function OutputConsole({
  output,
  isLoading,
  error,
  elapsedTime,
  promptLength
}: OutputConsoleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden h-full flex flex-col" id="output-console-panel">
      {/* Console Header */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-850 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4.5 h-4.5 text-indigo-400" />
          <span className="font-semibold text-xs text-slate-200 uppercase tracking-wider font-mono">
            Prompt Output Logs
          </span>
        </div>

        {output && !isLoading && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 px-2.5 py-1.5 rounded-md transition-all active:scale-[0.97]"
            id="copy-output-btn"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Logs</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Metrics Row */}
      {(output || isLoading || error) && (
        <div className="bg-slate-900/40 border-b border-slate-850 px-4 py-2 flex items-center gap-4 text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Time: {elapsedTime > 0 ? `${(elapsedTime / 1000).toFixed(2)}s` : "--"}</span>
          </div>
          <span className="text-slate-750">|</span>
          <div className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
            <span>Payload Size: {promptLength} chars</span>
          </div>
          <span className="text-slate-750">|</span>
          <div className="flex items-center gap-1">
            <Code className="w-3.5 h-3.5 text-slate-500" />
            <span>Response size: {output ? `${output.length} characters` : "0"}</span>
          </div>
        </div>
      )}

      {/* Console logs output segment */}
      <div className="flex-1 p-5 overflow-y-auto min-h-[250px] flex flex-col justify-center">
        {isLoading ? (
          <div className="text-center space-y-3 py-10">
            <div className="relative inline-flex">
              <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <div className="absolute top-2.5 left-2.5 w-5 h-5 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-full animate-pulse opacity-85" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Invoking server-side Gemini 3.5 API...</p>
            <p className="text-[10px] text-slate-600 animate-pulse">Assembling token parameters & instructions</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-950/20 border border-red-900/55 rounded-xl space-y-3 max-w-lg mx-auto" id="console-error-display">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-red-300">
                  {error.type === "API_KEY_NOT_CONFIGURED"
                    ? "Credentials Required"
                    : "Gemini Model Execution Aborted"}
                </h4>
                <p className="text-[11px] text-red-200/80 leading-relaxed font-mono">
                  {error.message}
                </p>
              </div>
            </div>

            {error.type === "API_KEY_NOT_CONFIGURED" && (
              <div className="bg-slate-900/85 p-3 rounded-lg border border-slate-800 text-[11px] space-y-1.5">
                <span className="font-semibold text-slate-300 block">How to configure Gemini credentials:</span>
                <p className="text-slate-400 leading-relaxed">
                  Go to the top sidebar, click the **Settings Cog / Secrets Setup** panel, insert a secret variable named <code className="font-sans font-bold text-white bg-slate-800 px-1 py-0.5 rounded">GEMINI_API_KEY</code>, paste your AI Studio API key, and save!
                </p>
              </div>
            )}
          </div>
        ) : output ? (
          <div className="h-full flex flex-col">
            <pre className="flex-1 font-mono text-[11.5px] text-slate-300 whitespace-pre-wrap leading-relaxed select-text" id="raw-prompt-output">
              {output}
            </pre>
          </div>
        ) : (
          <div className="text-center py-10 space-y-2 text-slate-600">
            <Terminal className="w-10 h-10 mx-auto opacity-20" />
            <p className="text-xs font-medium">Console Idle</p>
            <p className="text-[11px]">Compile and test a prompt configuration to observe Gemini logs.</p>
          </div>
        )}
      </div>
    </div>
  );
}
