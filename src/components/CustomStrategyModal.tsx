import React, { useState } from 'react';
import { PlusCircle, Sparkles, Sliders, DollarSign, Bot, X } from 'lucide-react';
import { AgentCategory } from '../types/agent';

interface CustomStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveStrategy: (customTask: { category: AgentCategory; goal: string; targetRevenue: number }) => void;
}

export const CustomStrategyModal: React.FC<CustomStrategyModalProps> = ({
  isOpen,
  onClose,
  onSaveStrategy,
}) => {
  const [category, setCategory] = useState<AgentCategory>('freelance');
  const [goal, setGoal] = useState('');
  const [targetRevenue, setTargetRevenue] = useState(500);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;
    onSaveStrategy({ category, goal, targetRevenue });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Configure Custom Profit Strategy</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Agent Archetype
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'freelance', label: 'Freelance & Code Build' },
                { id: 'leadgen', label: 'B2B Lead Outreach' },
                { id: 'content', label: 'SEO & Social Content' },
                { id: 'arbitrage', label: 'Micro-SaaS Arbitrage' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id as AgentCategory)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition ${
                    category === item.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Custom Execution Objective / Prompt
            </label>
            <textarea
              rows={3}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Scrape healthcare software providers in Chicago, extract VP level contacts, and draft a 3-step cold email offer..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target Value Valuation ($)
            </label>
            <input
              type="number"
              min={50}
              max={5000}
              value={targetRevenue}
              onChange={(e) => setTargetRevenue(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!goal.trim()}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              Launch Custom Strategy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
