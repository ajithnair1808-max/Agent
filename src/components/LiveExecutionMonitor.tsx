import React from 'react';
import {
  Terminal,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  PauseCircle,
  RotateCcw
} from 'lucide-react';
import { ExecutionTask } from '../types/agent';

interface LiveExecutionMonitorProps {
  currentTask: ExecutionTask | null;
  onCancelTask: () => void;
}

export const LiveExecutionMonitor: React.FC<LiveExecutionMonitorProps> = ({
  currentTask,
  onCancelTask,
}) => {
  if (!currentTask) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
        <div className="mx-auto w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
          <Terminal className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-200 text-sm">Autonomous Execution Terminal Idle</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Select an agent strategy above and click <strong className="text-emerald-400">"Launch Agent Task"</strong> to observe step-by-step reasoning, tool invocations, and asset synthesis in real time.
        </p>
      </div>
    );
  }

  const isCompleted = currentTask.status === 'completed';
  const isRunning = currentTask.status === 'running';

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-0">
      {/* Header Bar */}
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm">{currentTask.agentName}</h3>
              <span
                className={`px-2.5 py-0.5 text-[10px] font-bold font-mono rounded-full border ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : isRunning
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {currentTask.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-md">Goal: {currentTask.goal}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] text-slate-400">Est. Revenue Value</div>
            <div className="font-mono font-bold text-emerald-400 text-sm">
              +${currentTask.estimatedRevenue}
            </div>
          </div>

          {isRunning && (
            <button
              onClick={onCancelTask}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-lg border border-red-500/30 transition"
            >
              <PauseCircle className="w-3.5 h-3.5" />
              <span>Stop Agent</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-1.5 relative overflow-hidden">
        <div
          className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full transition-all duration-500"
          style={{ width: `${currentTask.progress}%` }}
        />
      </div>

      {/* Execution Terminal Feed */}
      <div className="p-6 font-mono text-xs space-y-4 max-h-[380px] overflow-y-auto custom-scrollbar">
        {currentTask.steps.map((step, idx) => {
          return (
            <div
              key={step.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : step.status === 'running' ? (
                    <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}

                  <span className="font-bold text-slate-200">{step.title}</span>

                  {step.toolUsed && (
                    <span className="px-2 py-0.5 bg-teal-500/10 text-teal-300 text-[10px] rounded border border-teal-500/20">
                      Tool: {step.toolUsed}
                    </span>
                  )}
                </div>

                <span className="text-[10px] text-slate-500">{step.timestamp}</span>
              </div>

              {step.detail && (
                <p className="text-slate-400 text-[11px] pl-6 leading-relaxed">
                  {step.detail}
                </p>
              )}

              {step.codeSnippet && (
                <div className="ml-6 p-3 bg-slate-950 rounded-lg border border-slate-800 text-emerald-400 text-[11px]">
                  <pre>{step.codeSnippet}</pre>
                </div>
              )}
            </div>
          );
        })}

        {isCompleted && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-xs">
                Asset Synthesized & Saved to Deliverables Vault!
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-white">
              Estimated Value: ${currentTask.estimatedRevenue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
