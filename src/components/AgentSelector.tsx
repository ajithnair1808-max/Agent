import React, { useState } from 'react';
import {
  Briefcase,
  Target,
  Sparkles,
  TrendingUp,
  Play,
  Clock,
  DollarSign,
  Wrench,
  ChevronRight,
  Send
} from 'lucide-react';
import { AgentPreset } from '../types/agent';
import { AGENT_PRESETS } from '../services/agentPresets';

interface AgentSelectorProps {
  selectedAgentId: string;
  onSelectAgent: (agentId: string) => void;
  onRunTask: (agentId: string, customGoal: string) => void;
  isExecuting: boolean;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  selectedAgentId,
  onSelectAgent,
  onRunTask,
  isExecuting,
}) => {
  const selectedAgent = AGENT_PRESETS.find((a) => a.id === selectedAgentId) || AGENT_PRESETS[0];
  const [customGoal, setCustomGoal] = useState(selectedAgent.suggestedTasks[0]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase className="w-5 h-5" />;
      case 'Target':
        return <Target className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Briefcase className="w-5 h-5" />;
    }
  };

  const handleAgentClick = (agent: AgentPreset) => {
    onSelectAgent(agent.id);
    setCustomGoal(agent.suggestedTasks[0]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoal.trim() || isExecuting) return;
    onRunTask(selectedAgent.id, customGoal.trim());
  };

  return (
    <section className="space-y-6">
      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {AGENT_PRESETS.map((agent) => {
          const isSelected = agent.id === selectedAgentId;
          return (
            <div
              key={agent.id}
              onClick={() => handleAgentClick(agent)}
              className={`group relative cursor-pointer p-5 rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-emerald-500/60 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-3 rounded-xl border ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {getIcon(agent.iconName)}
                </div>

                <span className="text-[11px] font-semibold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {agent.estimatedRoi}
                </span>
              </div>

              <h3 className="font-bold text-slate-100 text-sm mb-1 group-hover:text-emerald-400 transition-colors">
                {agent.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {agent.tagline}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800/60">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> {agent.avgDeliveryTime}
                </span>
                <span className="flex items-center gap-0.5 font-medium text-slate-300 group-hover:text-emerald-400">
                  Select <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Agent Control Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full uppercase font-mono">
                Active Strategy
              </span>
              <span className="text-xs text-slate-400">| Monetization: {selectedAgent.monetizationStrategy}</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">{selectedAgent.name}</h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {selectedAgent.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
              <Wrench className="w-4 h-4 text-emerald-400" />
              <span>Tools: {selectedAgent.tools.length} Executable Engines</span>
            </div>
          </div>
        </div>

        {/* Task Trigger Input */}
        <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="Enter custom business goal or select preset task..."
                disabled={isExecuting}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isExecuting || !customGoal.trim()}
              className="flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Agent Executing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch Agent Task</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Task Suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-400">Preset High-Value Tasks:</span>
            {selectedAgent.suggestedTasks.map((task, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCustomGoal(task)}
                className="text-xs bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 px-3 py-1.5 rounded-lg border border-slate-800 transition text-left truncate max-w-xs"
              >
                {task}
              </button>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
};
