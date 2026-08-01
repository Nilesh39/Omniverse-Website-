import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Hourglass } from 'lucide-react';

export const PomodoroWidget: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      if (mode === 'work') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
      setIsActive(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-full min-h-[180px] border border-white/10 group hover:border-accent/40 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-accent">
          <Hourglass className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Pomodoro Timer</span>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${mode === 'work' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
          {mode === 'work' ? 'Focus Block' : 'Short Break'}
        </span>
      </div>

      <div className="my-2 flex items-center justify-between">
        <span className="text-3xl sm:text-4xl font-black font-mono text-slate-100">{formatted}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTimer}
            className="w-10 h-10 rounded-full bg-accent text-slate-950 flex items-center justify-center font-bold hover:scale-105 transition-all shadow-md"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <button
            onClick={resetTimer}
            className="w-10 h-10 rounded-full glass-panel text-slate-400 hover:text-slate-200 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 flex items-center justify-between">
        <span>25min Work / 5min Break</span>
        <span className="text-accent font-semibold">{isActive ? 'Running' : 'Paused'}</span>
      </div>
    </div>
  );
};
