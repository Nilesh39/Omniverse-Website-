import React from 'react';
import { Sparkles, ShieldCheck, Cpu, WifiOff, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-100 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-accent" /> About ✨ OmniVerse Tools
        </h1>
        <p className="text-xs text-slate-400 mt-1">Architecture & design philosophy of the ultimate offline utility suite</p>
      </div>

      <div className="p-8 glass-panel rounded-3xl border border-white/15 space-y-4">
        <h3 className="text-lg font-bold text-slate-100">Why OmniVerse Tools?</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          OmniVerse Tools was engineered to bridge the gap between heavy cloud-dependent web services and lightning-fast offline desktop apps.
          Built with React 19, Vite, TypeScript, and Dexie IndexedDB, every single tool processes computations 100% on your local CPU without sending any data over the internet.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="p-4 rounded-2xl glass-panel text-center">
            <WifiOff className="w-6 h-6 text-accent mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-100">100% Offline PWA</h4>
            <p className="text-[11px] text-slate-400 mt-1">Works seamlessly without active internet connection.</p>
          </div>
          <div className="p-4 rounded-2xl glass-panel text-center">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-100">Zero Tracker / Ads</h4>
            <p className="text-[11px] text-slate-400 mt-1">Your data never leaves your browser sandbox.</p>
          </div>
          <div className="p-4 rounded-2xl glass-panel text-center">
            <Cpu className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-100">60FPS Glass UI</h4>
            <p className="text-[11px] text-slate-400 mt-1">VisionOS liquid glass design system & micro-animations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
