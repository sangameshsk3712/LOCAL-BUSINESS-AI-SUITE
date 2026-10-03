import React, { useState, useEffect } from "react";
import {
  Wand2,
  Bot,
  Play,
  CheckCircle2,
  Terminal,
  Clock,
  Sparkles,
  Layers,
  Settings,
  ShieldCheck,
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  FolderPlus,
  RefreshCw,
  Sliders,
  AlertCircle
} from "lucide-react";
import { AgentDefinition, AgentExecutionLog, AgentTool } from "../types";

interface AgentBuilderProps {
  isKeyReady: boolean;
  onOpenKeyGuide: () => void;
  onSaveToWorkspace?: (title: string, type: any, data: any) => void;
}

const AVAILABLE_TOOLS: AgentTool[] = [
  {
    id: "faq_knowledge_retrieval",
    name: "FAQ & Catalog Knowledge Base",
    description: "Retrieves verified store hours, location, prices, and policies.",
    category: "database",
    enabled: true,
  },
  {
    id: "lead_qualification_scanner",
    name: "Lead Qualification & Intent Scorer",
    description: "Extracts contact info, group size, budget tier, and buying urgency.",
    category: "verification",
    enabled: true,
  },
  {
    id: "whatsapp_message_dispatcher",
    name: "WhatsApp Message Dispatcher",
    description: "Sends formatted booking alerts and order confirmations directly to WhatsApp.",
    category: "communication",
    enabled: true,
  },
  {
    id: "daily_summary_reporter",
    name: "Daily Executive Log Compiler",
    description: "Aggregates conversations into a structured morning briefing for the owner.",
    category: "reporting",
    enabled: true,
  },
  {
    id: "human_escalation_router",
    name: "Emergency Human Call Router",
    description: "Immediately escalates severe issues or VIP inquiries to Founder Sangamesh (+91 8431107332).",
    category: "communication",
    enabled: true,
  },
];

const DEFAULT_AGENT: AgentDefinition = {
  id: "agent-default-1",
  name: "Concierge, Lead Qualifier & Daily Reporter",
  description: "Answers customer inquiries, qualifies high-intent orders, and logs daily executive summaries.",
  triggerTask: "Create an agent that answers customer questions, qualifies leads, and prepares a daily report.",
  systemInstructions: `You are the Autonomous Customer Operations AI Agent for Artisan Roast Cafe.
Your operating directives:
1. Greet every customer with a welcoming, community-centric tone.
2. Answer store hours, menu questions, and pricing with exact factual precision.
3. When users inquire about bulk bakes, party catering, or custom orders, inquire about group size and date to qualify buyer intent.
4. Securely capture telephone numbers or email addresses and confirm manager follow-up.
5. Escalate customer complaints or urgent refund queries directly to Founder Sangamesh (+91 8431107332).
6. Conclude execution with a clean log entry for the daily executive report.`,
  approvedTools: [
    "faq_knowledge_retrieval",
    "lead_qualification_scanner",
    "whatsapp_message_dispatcher",
    "daily_summary_reporter",
  ],
  temperature: 0.4,
  status: "active",
  executionCount: 12,
  createdAt: "2026-09-26",
};

const AGENT_PRESETS = [
  {
    title: "Customer Concierge & Lead Qualifier",
    prompt: "Create an agent that answers customer questions, qualifies leads, and prepares a daily report.",
  },
  {
    title: "VIP Party & Catering Booking Agent",
    prompt: "Build an agent to handle private party reservations, calculate estimated per-head catering prices, and notify store manager on WhatsApp.",
  },
  {
    title: "Review Shield & Crisis Defuser",
    prompt: "Create an autonomous agent that monitors negative reviews, drafts empathetic apologies, offers compensation credits, and alerts store founder.",
  },
  {
    title: "Neighborhood WhatsApp Flash Sale Bot",
    prompt: "Build an agent that crafts 48-hour weekend scarcity promotions, generates coupon codes, and tracks redemptions.",
  },
];

export default function AgentBuilder({
  isKeyReady,
  onOpenKeyGuide,
  onSaveToWorkspace,
}: AgentBuilderProps) {
  const [taskPrompt, setTaskPrompt] = useState(
    "Create an agent that answers customer questions, qualifies leads, and prepares a daily report."
  );
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // Active Agent state
  const [currentAgent, setCurrentAgent] = useState<AgentDefinition>(() => {
    try {
      const saved = localStorage.getItem("lbs_built_agent");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_AGENT;
  });

  // Test sandbox input/output
  const [testInput, setTestInput] = useState(
    "Hi, we need artisan coffee and 30 pastries for an office meeting this Friday morning. What are your prices and can we get delivery to Indiranagar?"
  );
  const [testOutput, setTestOutput] = useState<string>("");
  const [toolsUsedInTest, setToolsUsedInTest] = useState<string[]>([]);
  const [lastLatencyMs, setLastLatencyMs] = useState<number | null>(null);

  // Execution logs
  const [logs, setLogs] = useState<AgentExecutionLog[]>(() => {
    try {
      const saved = localStorage.getItem("lbs_agent_logs");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "log-1",
        agentId: "agent-default-1",
        agentName: "Concierge, Lead Qualifier & Daily Reporter",
        input: "Are you open on Sundays and do you take bulk cake orders?",
        output: "Yes! We are open Sunday from 9:00 AM to 9:00 PM. We also take bulk custom cake orders with 24 hours advance notice. May I have your phone number to share our cake catalog?",
        toolsUsed: ["faq_knowledge_retrieval", "lead_qualification_scanner"],
        latencyMs: 420,
        status: "success",
        timestamp: "2026-09-27 10:14 AM",
      },
    ];
  });

  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem("lbs_built_agent", JSON.stringify(currentAgent));
  }, [currentAgent]);

  useEffect(() => {
    localStorage.setItem("lbs_agent_logs", JSON.stringify(logs));
  }, [logs]);

  // Synthesize Agent from Prompt
  const handleSynthesizeAgent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!taskPrompt.trim()) return;

    setIsSynthesizing(true);
    try {
      const res = await fetch("/api/agent-builder/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: taskPrompt,
          businessName: "Artisan Roast Cafe",
          industry: "Specialty Cafe & Bakery",
        }),
      });

      const data = await res.json();
      if (res.ok && data.agent) {
        setCurrentAgent(data.agent);
        if (data.agent.sampleTestInput) {
          setTestInput(data.agent.sampleTestInput);
        }
      }
    } catch (err) {
      console.error("Synthesize agent error", err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Execute Agent in Sandbox
  const handleRunTest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!testInput.trim()) return;

    setIsExecuting(true);
    try {
      const res = await fetch("/api/agent-builder/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: currentAgent,
          input: testInput,
        }),
      });

      const data = await res.json();
      if (res.ok && data.output) {
        setTestOutput(data.output);
        setToolsUsedInTest(data.toolsUsed || []);
        setLastLatencyMs(data.latencyMs || 350);

        const newLog: AgentExecutionLog = {
          id: `log-${Date.now()}`,
          agentId: currentAgent.id,
          agentName: currentAgent.name,
          input: testInput,
          output: data.output,
          toolsUsed: data.toolsUsed || [],
          latencyMs: data.latencyMs || 350,
          status: "success",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
        setCurrentAgent((prev) => ({ ...prev, executionCount: prev.executionCount + 1 }));
      }
    } catch (err) {
      console.error("Agent execution error", err);
    } finally {
      setIsExecuting(false);
    }
  };

  const toggleTool = (toolId: string) => {
    setCurrentAgent((prev) => {
      const exists = prev.approvedTools.includes(toolId);
      return {
        ...prev,
        approvedTools: exists
          ? prev.approvedTools.filter((t) => t !== toolId)
          : [...prev.approvedTools, toolId],
      };
    });
  };

  const handleSaveToWorkspace = () => {
    if (onSaveToWorkspace) {
      onSaveToWorkspace(
        `Agent: ${currentAgent.name}`,
        "Agent Architecture",
        currentAgent
      );
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                  <Wand2 className="w-3.5 h-3.5 text-blue-400" />
                  AI Agent Builder
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  Autonomous Execution Ready
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Custom AI Business Agent Generator
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Describe any task in natural language. The meta-architect synthesizes instructions, approved tools, sandbox testing, and execution logs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToWorkspace}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <FolderPlus className="w-3.5 h-3.5 text-indigo-400" />
              <span>{savedSuccess ? "Saved to Workspace!" : "Save Agent"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Task Description Input Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>1. Describe the Agent's Task & Goals</span>
          </h3>
          <p className="text-xs text-slate-400">
            Tell the AI exactly what business job this agent should handle.
          </p>
        </div>

        <form onSubmit={handleSynthesizeAgent} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={taskPrompt}
              onChange={(e) => setTaskPrompt(e.target.value)}
              placeholder='e.g. "Create an agent that answers customer questions, qualifies leads, and prepares a daily report."'
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-medium leading-relaxed resize-none"
            />
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Presets:</span>
            {AGENT_PRESETS.map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() => setTaskPrompt(preset.prompt)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
              >
                {preset.title}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">
              Uses server-side Gemini 3.8 Flash to synthesize system instructions & tools.
            </span>
            <button
              type="submit"
              disabled={isSynthesizing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Wand2 className={`w-4 h-4 ${isSynthesizing ? "animate-spin" : ""}`} />
              <span>{isSynthesizing ? "Synthesizing Agent..." : "Synthesize AI Agent"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Agent Architecture & Tools Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Agent Specifications & Approved Tools */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">
                  Synthesized Specification
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{currentAgent.name}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Status: {currentAgent.status}
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                System Instructions & Reasoning Directives:
              </label>
              <textarea
                rows={7}
                value={currentAgent.systemInstructions}
                onChange={(e) =>
                  setCurrentAgent((prev) => ({ ...prev, systemInstructions: e.target.value }))
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Approved Tools Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Approved Agent Tools ({currentAgent.approvedTools.length} Active)</span>
                <span className="text-[10px] text-slate-500">Toggle capabilities</span>
              </label>

              <div className="space-y-2">
                {AVAILABLE_TOOLS.map((tool) => {
                  const isActive = currentAgent.approvedTools.includes(tool.id);
                  return (
                    <div
                      key={tool.id}
                      onClick={() => toggleTool(tool.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isActive
                          ? "bg-slate-950 border-blue-500/50 shadow-sm"
                          : "bg-slate-950/40 border-slate-800 hover:border-slate-700 opacity-60"
                      }`}
                    >
                      <div className="space-y-0.5 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{tool.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase">
                            {tool.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{tool.description}</p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                          isActive
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "border-slate-700 text-transparent"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Sandbox Testing & Execution Logs */}
        <div className="lg:col-span-6 space-y-4">
          {/* Sandbox Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Live Agent Testing Sandbox</h3>
              </div>
              {lastLatencyMs && (
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {lastLatencyMs}ms latency
                </span>
              )}
            </div>

            <form onSubmit={handleRunTest} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Simulate User Query / Task Trigger:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="Enter a prompt to test your agent..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isExecuting}
                    className="absolute right-1.5 top-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all disabled:opacity-50"
                  >
                    <Play className={`w-3 h-3 fill-white ${isExecuting ? "animate-pulse" : ""}`} />
                    <span>{isExecuting ? "Executing..." : "Run Test"}</span>
                  </button>
                </div>
              </div>

              {/* Output Preview */}
              {testOutput && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300">Agent Output:</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(testOutput);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                    {testOutput}
                  </div>

                  {toolsUsedInTest.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Tools Triggered:</span>
                      {toolsUsedInTest.map((tool) => (
                        <span
                          key={tool}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        >
                          ⚙️ {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Execution History Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Agent Execution Audit Trail</span>
              <span className="text-[10px] font-mono text-slate-500">
                Total Runs: {currentAgent.executionCount}
              </span>
            </h4>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-blue-300 truncate max-w-[200px]">
                      {log.input}
                    </span>
                    <span className="font-mono text-slate-500 text-[10px]">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                    {log.output}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                    <span>Latency: {log.latencyMs}ms</span>
                    <span>Tools: {log.toolsUsed.join(", ") || "None"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
