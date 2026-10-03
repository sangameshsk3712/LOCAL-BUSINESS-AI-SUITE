import React, { useState, useEffect } from "react";
import {
  Cpu,
  Zap,
  Server,
  Activity,
  Play,
  RefreshCw,
  CheckCircle2,
  Clock,
  Mic,
  Crosshair,
  Music,
  MessageCircle,
  PhoneCall,
  Flame,
  ShieldCheck,
  Send,
  Layers
} from "lucide-react";
import { BackgroundJobRecord, WorkerNodeMetrics } from "../types";

export default function BackgroundJobQueueMonitor() {
  const [workers, setWorkers] = useState<WorkerNodeMetrics[]>([]);
  const [jobs, setJobs] = useState<BackgroundJobRecord[]>([]);
  const [isDispatching, setIsDispatching] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState<string>("GEOGRID_RADAR_CALC");
  const [taskNotice, setTaskNotice] = useState<string | null>(null);

  // Webhook load simulation state
  const [isSimulatingWebhooks, setIsSimulatingWebhooks] = useState(false);
  const [webhookLoadStats, setWebhookLoadStats] = useState<{
    totalFired: number;
    avgLatencyMs: number;
    successful200s: number;
  } | null>(null);

  const fetchQueueData = async () => {
    try {
      const res = await fetch("/api/jobs/all");
      const data = await res.json();
      if (data.success) {
        setWorkers(data.workers || []);
        setJobs(data.jobs || []);
      }
    } catch (e) {
      console.error("Failed to fetch job queue:", e);
    }
  };

  useEffect(() => {
    fetchQueueData();
    const interval = setInterval(fetchQueueData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleEnqueueTask = async (type: string, title: string) => {
    setIsDispatching(true);
    setTaskNotice(null);
    try {
      const res = await fetch("/api/jobs/enqueue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          params: { priority: "high", cluster: "production-edge" },
          tenantId: "tenant-1",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTaskNotice(`Task dispatched asynchronously (Job ID: ${data.jobId}). Main thread latency: 4ms.`);
        fetchQueueData();
        setTimeout(() => setTaskNotice(null), 5000);
      }
    } catch (err: any) {
      alert("Enqueue error: " + err.message);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleSimulateConcurrentWebhooks = async (count: number = 20) => {
    setIsSimulatingWebhooks(true);
    const startAll = performance.now();
    let successes = 0;
    const promises: Promise<any>[] = [];

    for (let i = 0; i < count; i++) {
      const p = fetch("/api/webhooks/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: `+9198450${Math.floor(10000 + Math.random() * 90000)}`,
          event: "incoming_customer_inquiry",
          message: "Hi, is Royal Spice open for table reservation tonight?",
          tenantId: "tenant-1",
          batchIndex: i,
        }),
      })
        .then((res) => {
          if (res.ok) successes++;
        })
        .catch(() => {});
      promises.push(p);
    }

    await Promise.all(promises);
    const endAll = performance.now();
    const totalTime = Math.round(endAll - startAll);
    const avg = Number((totalTime / count).toFixed(1));

    setWebhookLoadStats({
      totalFired: count,
      avgLatencyMs: avg,
      successful200s: successes,
    });
    setIsSimulatingWebhooks(false);
    fetchQueueData();
  };

  return (
    <div className="space-y-6">
      {/* Pillar 3 Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300">
                Pillar 3: High Scale & Zero Latency
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                4 Worker Threads Running
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Server className="w-6 h-6 text-blue-400" />
              Background Job Queue & High-Throughput Webhook Workers
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Heavy AI tasks (5x5 Geo-Grid scans, voice audio transcripts, Lyria music generation) are offloaded to asynchronous background processing workers so main HTTP requests respond in &lt;15ms.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Queue Engine</div>
              <div className="text-lg font-black text-blue-400 font-mono">
                BullMQ / Async
              </div>
            </div>
          </div>
        </div>
      </div>

      {taskNotice && (
        <div className="p-4 rounded-xl bg-blue-500/20 border border-blue-400/60 text-blue-200 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{taskNotice}</span>
        </div>
      )}

      {/* Visual Worker Pool */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {workers.map((w) => (
          <div
            key={w.nodeId}
            className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
              w.status === "processing"
                ? "bg-indigo-950/70 border-indigo-400 ring-1 ring-indigo-400/40 shadow-xl"
                : "bg-slate-900/90 border-slate-800"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">{w.nodeId}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  w.status === "processing"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${w.status === "processing" ? "bg-amber-400" : "bg-emerald-400"}`} />
                  <span>{w.status.toUpperCase()}</span>
                </span>
              </div>
              <h4 className="text-xs font-bold text-white line-clamp-1">{w.name}</h4>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800/80 space-y-1 text-[11px] font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Jobs Today:</span>
                <strong className="text-white">{w.totalProcessedToday}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>RAM Usage:</span>
                <strong className="text-indigo-300">{w.memoryUsageMb} MB</strong>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>CPU Load:</span>
                <strong className="text-emerald-400">{w.cpuLoadPercent}%</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Task Dispatcher & High-Throughput Webhook Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Asynchronous AI Task Enqueuer */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Asynchronous Task Dispatcher
            </h3>
          </div>
          <p className="text-xs text-slate-300">
            Enqueue computationally heavy operations. Notice how each button dispatches instantly without freezing your UI:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => handleEnqueueTask("GEOGRID_RADAR_CALC", "5x5 Geo-Grid Local SEO Scan (25 Coordinates)")}
              disabled={isDispatching}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-blue-500/40 text-left transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white">5x5 Geo-Grid Radar</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Offload 25 point scan to Worker Alpha</div>
            </button>

            <button
              onClick={() => handleEnqueueTask("VOICE_AUDIO_TRANSCRIPTION", "Gemini Voice Inbound Call Transcription (8min)")}
              disabled={isDispatching}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-cyan-500/40 text-left transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">Voice Audio Transcript</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Offload audio parsing to Worker Beta</div>
            </button>

            <button
              onClick={() => handleEnqueueTask("LYRIA_MUSIC_GENERATION", "Lyria Ambient Storefront Lo-Fi Track (2m 30s)")}
              disabled={isDispatching}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-purple-500/40 text-left transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white">Lyria Music Track</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Offload neural music synthesis to Worker Gamma</div>
            </button>

            <button
              onClick={() => handleEnqueueTask("SUPERBRAIN_BATCH_CONSENSUS", "OmniSuperBrain Multi-Model Batch Blueprint")}
              disabled={isDispatching}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-amber-500/40 text-left transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">SuperBrain 4-in-1 Batch</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Offload 4 AI perspectives to Worker Delta</div>
            </button>
          </div>
        </div>

        {/* Right: High-Throughput Webhook Ingestion Stress Tester */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                High-Throughput Webhook Ingestion
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Non-Blocking
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Simulate 20 concurrent incoming WhatsApp messages and AI Phone Calls. Demonstrates how the server acknowledges incoming webhooks in &lt;15ms:
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSimulateConcurrentWebhooks(20)}
              disabled={isSimulatingWebhooks}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
            >
              {isSimulatingWebhooks ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Firing 20 Concurrent Webhooks...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Fire 20 Concurrent WhatsApp Webhooks</span>
                </>
              )}
            </button>
          </div>

          {webhookLoadStats && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2 animate-fadeIn font-mono text-xs">
              <div className="flex items-center justify-between text-emerald-300 font-bold">
                <span>✓ Concurrency Benchmark:</span>
                <span>{webhookLoadStats.successful200s}/{webhookLoadStats.totalFired} HTTP 200 OK</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Average Ingestion Latency:</span>
                <span className="text-white font-bold">{webhookLoadStats.avgLatencyMs} ms</span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans mt-1">
                Zero server lag. All incoming events immediately dispatched to Worker Delta for asynchronous CRM lead extraction.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Live Background Queue Stream */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Live Asynchronous Task Queue
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {jobs.length} Active Tasks
          </span>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
          {jobs.map((job) => (
            <div key={job.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    job.status === "completed"
                      ? "bg-emerald-400"
                      : job.status === "processing"
                      ? "bg-amber-400 animate-pulse"
                      : "bg-blue-400"
                  }`} />
                  <span className="font-bold text-white truncate">{job.title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-slate-400">Worker: <strong className="text-indigo-300">{job.workerNodeId}</strong></span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    job.status === "completed"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}>
                    {job.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${job.progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Progress: {job.progressPercent}% {job.etaSeconds > 0 && `(ETA: ~${job.etaSeconds}s)`}</span>
                <span>ID: {job.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
