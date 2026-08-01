import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-white/10 py-8 px-6 text-slate-400 text-xs flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-accent" />
        <span className="font-semibold text-slate-300">✨ OmniVerse Tools Suite v1.0</span>
        <span className="text-slate-500">| 100% Offline Progressive Web App</span>
      </div>

      <div className="flex items-center gap-1 text-slate-400">
        <span>Crafted with</span>
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
        <span>for extreme offline productivity</span>
      </div>
    </footer>
  );
};
