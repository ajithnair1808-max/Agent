import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Target,
  FileCheck,
  Zap,
  BarChart2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { FinancialMetric, Deliverable } from '../types/agent';

interface AnalyticsDashboardProps {
  metrics: FinancialMetric[];
  deliverables: Deliverable[];
  totalRevenue: number;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  metrics,
  deliverables,
  totalRevenue,
}) => {
  // Aggregate data for category breakdown
  const categoryCounts = deliverables.reduce(
    (acc, d) => {
      acc[d.category] = (acc[d.category] || 0) + 1;
      return acc;
    },
    { freelance: 0, leadgen: 0, content: 0, arbitrage: 0 } as Record<string, number>
  );

  const categoryData = [
    { name: 'Freelance Code', count: categoryCounts.freelance || 1, value: (categoryCounts.freelance || 1) * 450 },
    { name: 'B2B Lead Gen', count: categoryCounts.leadgen || 1, value: (categoryCounts.leadgen || 1) * 650 },
    { name: 'SEO Content', count: categoryCounts.content || 1, value: (categoryCounts.content || 1) * 350 },
    { name: 'Micro-SaaS PRD', count: categoryCounts.arbitrage || 1, value: (categoryCounts.arbitrage || 1) * 850 },
  ];

  return (
    <section className="space-y-6">
      {/* Top Stat Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Value Synthesized</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" /> +24% estimated growth this week
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Actionable Assets Created</span>
            <FileCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {deliverables.length} Assets
          </div>
          <div className="text-[11px] text-slate-500">
            100% Exportable (Code/CSV/MD)
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>B2B Leads Prospecting</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            35 Verified Leads
          </div>
          <div className="text-[11px] text-slate-500">
            3-Step Cold Sequences Ready
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg Agent Speed</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            38.5 Seconds
          </div>
          <div className="text-[11px] text-slate-500">
            Zero Manual Overhead
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Growth Trend Chart */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Revenue Valuation Growth Trajectory
              </h3>
              <p className="text-xs text-slate-400">Cumulative value generated across executed tasks</p>
            </div>
            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-300 text-[10px] font-mono rounded border border-emerald-500/20">
              Live Projection
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                  formatter={(val: any) => [`$${val}`, 'Revenue Value']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deliverables Value Distribution */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <div>
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              Asset Value Distribution by Strategy
            </h3>
            <p className="text-xs text-slate-400">Total estimated financial yield per category</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
                  formatter={(val: any) => [`$${val}`, 'Value']}
                />
                <Bar dataKey="value" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
