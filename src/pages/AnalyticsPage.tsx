import React from 'react';
import { BarChart3, PieChart, TrendingUp, Sparkles } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Pie, Cell } from 'recharts';
import { CATEGORIES } from '../data/categories';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';

export const AnalyticsPage: React.FC = () => {
  const categoryData = CATEGORIES.map(cat => ({
    name: cat.name.split(' ')[0],
    count: TOOLS_REGISTRY.filter(t => t.category === cat.id).length
  }));

  const COLORS = ['#06b6d4', '#a855f7', '#10b981', '#f97316', '#f43f5e', '#eab308', '#3b82f6'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-accent" /> Suite Analytics & Distribution
        </h1>
        <p className="text-xs text-slate-400 mt-1">Metrics & distribution breakdown of 150+ offline utilities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 glass-panel rounded-3xl border border-white/10">
          <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-accent" /> Tools Count per Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="var(--accent-color)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 glass-panel rounded-3xl border border-white/10 flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-200 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" /> Productivity Breakdown
          </h3>
          <div className="space-y-4 my-auto">
            <div className="p-4 glass-panel rounded-2xl flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-300">Total Registered Utilities</span>
              <span className="text-2xl font-black text-accent font-mono">{TOOLS_REGISTRY.length}</span>
            </div>
            <div className="p-4 glass-panel rounded-2xl flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-300">Offline Service Worker Status</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                100% Precached
              </span>
            </div>
            <div className="p-4 glass-panel rounded-2xl flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-300">Data Storage Engine</span>
              <span className="text-xs font-bold text-slate-100 font-mono">IndexedDB (Dexie)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
