import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export const QuickCalcWidget: React.FC = () => {
  const [display, setDisplay] = useState('0');

  const handleInput = (val: string) => {
    if (val === 'C') {
      setDisplay('0');
    } else if (val === '=') {
      try {
        // Safe math evaluation
        const sanitized = display.replace(/×/g, '*').replace(/÷/g, '/');
        // eslint-disable-next-line no-eval
        const res = Function(`"use strict"; return (${sanitized})`)();
        setDisplay(String(res));
      } catch {
        setDisplay('Error');
      }
    } else {
      if (display === '0' || display === 'Error') setDisplay(val);
      else setDisplay(prev => prev + val);
    }
  };

  const btnLayout = [
    '7', '8', '9', '÷',
    '4', '5', '6', '×',
    '1', '2', '3', '-',
    'C', '0', '=', '+'
  ];

  return (
    <div className="glass-panel rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between h-full min-h-[220px] border border-white/10 group hover:border-accent/40 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-accent">
          <Calculator className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Express Calculator</span>
        </div>
      </div>

      <div className="bg-black/30 rounded-xl p-2.5 mb-3 text-right font-mono text-xl font-bold text-slate-100 truncate border border-white/5">
        {display}
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {btnLayout.map((b) => (
          <button
            key={b}
            onClick={() => handleInput(b)}
            className={`p-2 rounded-xl text-xs font-bold transition-all ${
              b === '='
                ? 'bg-accent text-slate-950 col-span-1'
                : b === 'C'
                ? 'bg-rose-500/20 text-rose-400'
                : ['÷', '×', '-', '+'].includes(b)
                ? 'bg-accent/20 text-accent'
                : 'glass-panel text-slate-200 hover:bg-white/15'
            }`}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
};
