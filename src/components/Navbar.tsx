import React, { useState } from 'react';
import {
  Zap,
  Key,
  Download,
  DollarSign,
  Activity,
  PlusCircle,
  ShieldCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { UserStrategyConfig } from '../types/agent';

interface NavbarProps {
  totalRevenue: number;
  config: UserStrategyConfig;
  onUpdateConfig: (newConfig: UserStrategyConfig) => void;
  onOpenDaemonModal: () => void;
  onOpenCustomStrategyModal: () => void;
  activeTasksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalRevenue,
  config,
  onUpdateConfig,
  onOpenDaemonModal,
  onOpenCustomStrategyModal,
  activeTasksCount,
}) => {
  const [showApiModal, setShowApiModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(config.geminiApiKey);

  const handleSaveApiKey = () => {
    onUpdateConfig({
      ...config,
      geminiApiKey: tempApiKey,
      useLiveApi: tempApiKey.trim().length > 0,
    });
    setShowApiModal(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090e17]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Status */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between">
          <div className="flex items-center gap-3">
            <div className="relative p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-xl border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10">
              <Zap className="w-6 h-6 animate-pulse-slow" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Agentic Wealth Engine
                </h1>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold rounded-full uppercase tracking-wider">
                  v2.5 Autonomous
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                High-Value Autonomous Profit & Execution Platform
              </p>
            </div>
          </div>
        </div>

        {/* Center Stats Bar */}
        <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-1.5 rounded-xl border border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Value Generated:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              ${totalRevenue.toLocaleString()}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <span className="text-slate-400">Active Tasks:</span>
            <span className="font-mono font-semibold text-white">
              {activeTasksCount} Running
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Custom Strategy */}
          <button
            onClick={onOpenCustomStrategyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
            title="Create custom strategy prompt"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">New Strategy</span>
          </button>

          {/* Export Daemon */}
          <button
            onClick={onOpenDaemonModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
            title="Export 24/7 Node.js CLI daemon script"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Export Daemon</span>
          </button>

          {/* Gemini API key button */}
          <button
            onClick={() => setShowApiModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
              config.useLiveApi
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>{config.useLiveApi ? 'Gemini Connected' : 'API Config'}</span>
          </button>
        </div>
      </div>

      {/* API Key Modal */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Gemini API Key Configuration</h3>
              </div>
              <button
                onClick={() => setShowApiModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Connect your Gemini API Key for live custom LLM task execution. If left blank, the platform will run in <strong className="text-emerald-400">High-Fidelity Autonomous Engine Mode</strong>.
            </p>

            <div className="space-y-3 mb-6">
              <label className="block text-xs font-semibold text-slate-300">
                Gemini API Key (Optional)
              </label>
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-emerald-500/50"
              />
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Keys are stored safely in local memory only.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowApiModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-emerald-500/20"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
