import React from 'react';
import { Cpu, Battery, BatteryCharging, Zap } from 'lucide-react';
import { useBattery } from '../../hooks/useBattery';

export const BatteryWidget: React.FC = () => {
  const battery = useBattery();
  const memoryInfo = (performance as unknown as { memory?: { jsHeapSizeLimit: number; totalJSHeapSize: number } }).memory;

  return (
    <div className="glass-panel rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between h-full min-h-[180px] border border-white/10 group hover:border-accent/40 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-accent">
          <Cpu className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">System Diagnostics</span>
        </div>
        <span className="text-[10px] font-semibold text-slate-400">Browser Environment</span>
      </div>

      <div className="my-2 space-y-3">
        {battery.supported ? (
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-slate-300">
                {battery.charging ? <BatteryCharging className="w-4 h-4 text-accent" /> : <Battery className="w-4 h-4 text-slate-400" />}
                Battery Level
              </span>
              <span className="text-accent font-bold">{Math.round(battery.level * 100)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${battery.level > 0.2 ? 'bg-accent' : 'bg-rose-500'}`}
                style={{ width: `${battery.level * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Standard Power Source Connected
          </div>
        )}

        {memoryInfo && (
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-white/5">
            <span>JS Heap Allocated</span>
            <span className="font-mono text-slate-200">
              {Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024)} MB
            </span>
          </div>
        )}
      </div>

      <div className="text-[10px] text-slate-500">
        Hardware concurrency: {navigator.hardwareConcurrency || 4} threads
      </div>
    </div>
  );
};
