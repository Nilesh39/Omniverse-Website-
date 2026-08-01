import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, Zap, ShieldCheck, Flame } from 'lucide-react';
import { getSmartRecommendations } from '../../lib/aiEngine';
import { useNavigate } from 'react-router-dom';

interface HeroBannerProps {
  onOpenSearch: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onOpenSearch }) => {
  const navigate = useNavigate();
  const recommendations = getSmartRecommendations([]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative glass-panel rounded-3xl p-6 sm:p-10 overflow-hidden border border-white/15 mb-8 shadow-2xl"
    >
      {/* Background Decorative Lighting */}
      <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 -top-24 w-64 h-64 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-accent/40 text-accent text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{greeting} • OmniVerse PWA Engine v1.0</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
          Your All-In-One <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-accent via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Offline Utility Suite
          </span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">
          Instant access to 150+ high-performance developer, student, financial, health, and media utilities. 100% offline, zero server tracking, zero ads.
        </p>

        {/* Hero Quick Search Trigger */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div
            onClick={onOpenSearch}
            className="flex-1 glass-panel rounded-2xl px-5 py-3.5 flex items-center justify-between cursor-pointer hover:border-accent/50 transition-all text-slate-300 group shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">Search any tool (e.g., "JSON", "BMI", "QR", "GST")...</span>
            </div>
            <kbd className="hidden sm:inline-block text-xs font-mono px-2.5 py-1 rounded-lg bg-white/10 text-accent font-semibold border border-accent/30">
              Ctrl + K
            </kbd>
          </div>

          <button
            onClick={() => navigate('/categories')}
            className="px-6 py-3.5 rounded-2xl bg-accent text-slate-950 font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-accent/25 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" /> Explore All
          </button>
        </div>

        {/* AI Recommendations Bar */}
        {recommendations.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
              <Flame className="w-4 h-4 text-orange-400" /> AI Contextual Suggestions
            </span>
            <div className="flex flex-wrap gap-2">
              {recommendations.map(s => (
                <button
                  key={s.id}
                  onClick={() => navigate(`/tool/${s.toolId}`)}
                  className="px-3 py-1.5 rounded-xl glass-panel text-xs font-medium text-slate-200 hover:border-accent/40 hover:text-accent transition-all flex items-center gap-2 group"
                >
                  <span className="px-1.5 py-0.5 rounded bg-accent/20 text-accent text-[10px] font-bold">
                    {s.tag}
                  </span>
                  <span>{s.reason}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Security & Offline Pills */}
      <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Client-Side Privacy
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-accent" /> Installed Service Worker Ready
        </div>
      </div>
    </motion.div>
  );
};
