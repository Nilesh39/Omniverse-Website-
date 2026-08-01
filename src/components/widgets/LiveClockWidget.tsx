import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const LiveClockWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-full min-h-[180px] border border-white/10 group hover:border-accent/40 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-accent">
          <Clock className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">Live Vision Clock</span>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
          UTC {time.getTimezoneOffset() <= 0 ? '+' : ''}{-time.getTimezoneOffset() / 60}
        </span>
      </div>

      <div className="my-3">
        <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-100 drop-shadow-md">
          {hours}
        </h2>
        <p className="text-xs font-medium text-slate-400 mt-1">{dateStr}</p>
      </div>

      <div className="flex items-center gap-1">
        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-1000 ease-linear"
            style={{ width: `${(time.getSeconds() / 60) * 100}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-accent">{time.getSeconds()}s</span>
      </div>
    </div>
  );
};
