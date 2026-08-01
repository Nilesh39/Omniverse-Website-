import React, { useState, useEffect } from 'react';
import { Calendar, Globe, Timer, Hourglass, Play, Pause, RotateCcw } from 'lucide-react';

// 1. Age & Birthday Calculator
export const AgeCalculatorTool: React.FC = () => {
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [age, setAge] = useState<{ years: number; months: number; days: number; totalDays: number } | null>(null);

  useEffect(() => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    setAge({ years, months, days, totalDays });
  }, [birthDate]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1 block">Select Date of Birth</label>
        <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
      </div>

      {age && (
        <div className="p-6 glass-panel rounded-3xl border border-accent/40 text-center space-y-4">
          <span className="text-xs font-bold uppercase text-slate-400">Exact Chronological Age</span>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-accent/15 border border-accent/30"><h2 className="text-3xl font-black text-accent">{age.years}</h2><span className="text-[10px] font-bold uppercase text-slate-400">Years</span></div>
            <div className="p-3 rounded-2xl bg-purple-500/15 border border-purple-500/30"><h2 className="text-3xl font-black text-purple-400">{age.months}</h2><span className="text-[10px] font-bold uppercase text-slate-400">Months</span></div>
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30"><h2 className="text-3xl font-black text-emerald-400">{age.days}</h2><span className="text-[10px] font-bold uppercase text-slate-400">Days</span></div>
          </div>
          <p className="text-xs text-slate-400">Total days lived: <strong className="text-slate-200 font-mono">{age.totalDays.toLocaleString()} days</strong></p>
        </div>
      )}
    </div>
  );
};

// 2. World Clock & Timezone Converter
export const TimezoneConverterTool: React.FC = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cities = [
    { city: 'London (UTC / GMT)', tz: 'Europe/London' },
    { city: 'New York (EDT)', tz: 'America/New_York' },
    { city: 'Tokyo (JST)', tz: 'Asia/Tokyo' },
    { city: 'Sydney (AEST)', tz: 'Australia/Sydney' },
    { city: 'New Delhi (IST)', tz: 'Asia/Kolkata' },
  ];

  return (
    <div className="space-y-3 max-w-lg mx-auto">
      {cities.map((c, idx) => {
        const timeStr = now.toLocaleTimeString('en-US', { timeZone: c.tz, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return (
          <div key={idx} className="p-4 rounded-2xl glass-panel flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">{c.city}</span>
            <span className="font-mono text-base font-bold text-accent">{timeStr}</span>
          </div>
        );
      })}
    </div>
  );
};

// 3. Precision Stopwatch & Lap Counter
export const StopwatchTool: React.FC = () => {
  const [timeMs, setTimeMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (running) timer = setInterval(() => setTimeMs(prev => prev + 10), 10);
    return () => { if (timer) clearInterval(timer); };
  }, [running]);

  const addLap = () => setLaps([timeMs, ...laps]);
  const reset = () => { setTimeMs(0); setRunning(false); setLaps([]); };

  const format = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const cent = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${cent.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto text-center">
      <div className="p-8 glass-panel rounded-3xl border border-white/15">
        <h1 className="text-5xl font-black font-mono text-accent">{format(timeMs)}</h1>
        <div className="flex justify-center items-center gap-3 mt-6">
          <button onClick={() => setRunning(!running)} className="w-12 h-12 rounded-full bg-accent text-slate-950 flex items-center justify-center font-bold hover:scale-105 transition-all shadow-lg">
            {running ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
          {running && <button onClick={addLap} className="px-4 py-2.5 rounded-xl glass-panel text-slate-200 text-xs font-bold">Lap Split</button>}
          <button onClick={reset} className="p-3 rounded-full glass-panel text-slate-400 hover:text-slate-200"><RotateCcw className="w-5 h-5" /></button>
        </div>
      </div>

      {laps.length > 0 && (
        <div className="p-4 glass-panel rounded-2xl max-h-48 overflow-y-auto space-y-1.5 font-mono text-xs">
          {laps.map((lap, idx) => (
            <div key={idx} className="flex justify-between p-2 rounded-xl bg-black/30 text-slate-300">
              <span>Lap #{laps.length - idx}</span><span className="font-bold text-accent">{format(lap)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 4. Pomodoro Focus Timer
export const PomodoroTimerTool: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => { if (timer) clearInterval(timer); };
  }, [isActive, timeLeft]);

  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  const formatted = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6 max-w-lg mx-auto text-center">
      <div className="p-10 glass-panel rounded-3xl border border-accent/40 space-y-4">
        <span className="text-xs font-bold uppercase text-slate-400">Pomodoro Focus Session</span>
        <h1 className="text-6xl font-black font-mono text-accent">{formatted}</h1>

        <div className="flex justify-center gap-3">
          <button onClick={() => setIsActive(!isActive)} className="px-6 py-3 rounded-2xl bg-accent text-slate-950 font-bold text-xs shadow-lg">
            {isActive ? 'Pause' : 'Start Focus'}
          </button>
          <button onClick={() => { setIsActive(false); setTimeLeft(25 * 60); }} className="px-4 py-3 rounded-2xl glass-panel text-slate-300 font-bold text-xs">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
