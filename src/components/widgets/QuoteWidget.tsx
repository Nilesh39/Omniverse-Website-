import React, { useState } from 'react';
import { Quote, RefreshCw } from 'lucide-react';
import { DAILY_QUOTES } from '../../data/quotes';

export const QuoteWidget: React.FC = () => {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * DAILY_QUOTES.length));
  const current = DAILY_QUOTES[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % DAILY_QUOTES.length);
  };

  return (
    <div className="glass-panel rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between h-full min-h-[180px] border border-white/10 group hover:border-accent/40 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-accent">
          <Quote className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Daily Inspiration</span>
        </div>
        <button
          onClick={handleNext}
          className="p-1.5 rounded-lg text-slate-400 hover:text-accent hover:bg-white/10 transition-colors"
          title="New Quote"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="my-3">
        <p className="text-sm font-medium italic text-slate-200 leading-relaxed">
          "{current.quote}"
        </p>
        <p className="text-xs font-bold text-accent mt-2 text-right">
          — {current.author}
        </p>
      </div>

      <div className="text-[10px] text-slate-500">
        Curated Offline Wisdom
      </div>
    </div>
  );
};
