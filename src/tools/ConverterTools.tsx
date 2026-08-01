import React, { useState } from 'react';
import { ArrowLeftRight, HardDrive } from 'lucide-react';
import { formatBytes } from '../lib/utils';

// 1. Universal Multi-Unit Converter
export const UnitConverterTool: React.FC = () => {
  const [val, setVal] = useState(1);
  const [category, setCategory] = useState<'length' | 'mass' | 'temp'>('length');
  const [from, setFrom] = useState('meters');
  const [to, setTo] = useState('feet');

  const lengthUnits: Record<string, number> = {
    meters: 1,
    kilometers: 1000,
    centimeters: 0.01,
    millimeters: 0.001,
    feet: 0.3048,
    inches: 0.0254,
    miles: 1609.34
  };

  const massUnits: Record<string, number> = {
    kilograms: 1,
    grams: 0.001,
    milligrams: 0.000001,
    pounds: 0.453592,
    ounces: 0.0283495
  };

  let result = 0;
  if (category === 'length') {
    const meters = val * lengthUnits[from];
    result = meters / lengthUnits[to];
  } else if (category === 'mass') {
    const kgs = val * massUnits[from];
    result = kgs / massUnits[to];
  } else if (category === 'temp') {
    if (from === 'celsius' && to === 'fahrenheit') result = (val * 9/5) + 32;
    else if (from === 'fahrenheit' && to === 'celsius') result = (val - 32) * 5/9;
    else if (from === 'celsius' && to === 'kelvin') result = val + 273.15;
    else result = val;
  }

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex gap-2">
        {(['length', 'mass', 'temp'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              if (cat === 'length') { setFrom('meters'); setTo('feet'); }
              else if (cat === 'mass') { setFrom('kilograms'); setTo('pounds'); }
              else { setFrom('celsius'); setTo('fahrenheit'); }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${category === cat ? 'bg-accent text-slate-950' : 'glass-panel text-slate-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Value</label>
          <input type="number" value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full bg-black/40 rounded-xl px-3 py-2.5 text-xs text-slate-100 border border-white/10 capitalize">
            {Object.keys(category === 'length' ? lengthUnits : category === 'mass' ? massUnits : { celsius: 1, fahrenheit: 1, kelvin: 1 }).map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full bg-black/40 rounded-xl px-3 py-2.5 text-xs text-accent font-bold border border-white/10 capitalize">
            {Object.keys(category === 'length' ? lengthUnits : category === 'mass' ? massUnits : { celsius: 1, fahrenheit: 1, kelvin: 1 }).map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 glass-panel rounded-3xl border border-accent/40 text-center">
        <span className="text-xs font-bold uppercase text-slate-400">Converted Value</span>
        <h2 className="text-4xl font-black text-accent my-2 font-mono">{result.toFixed(4)}</h2>
        <span className="text-xs font-semibold text-slate-300 capitalize">{to}</span>
      </div>
    </div>
  );
};

// 2. Digital File Size & Storage Calc
export const FileSizeConverterTool: React.FC = () => {
  const [bytes, setBytes] = useState(10485760);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1 block">Input Size in Bytes</label>
        <input type="number" value={bytes} onChange={(e) => setBytes(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
      </div>

      <div className="p-6 glass-panel rounded-3xl border border-white/10 space-y-3">
        <div className="flex justify-between text-xs font-mono"><span className="text-slate-400">Human Readable:</span><span className="font-bold text-accent">{formatBytes(bytes)}</span></div>
        <div className="flex justify-between text-xs font-mono"><span className="text-slate-400">Kilobytes (KB):</span><span className="text-slate-200">{(bytes / 1024).toFixed(2)} KB</span></div>
        <div className="flex justify-between text-xs font-mono"><span className="text-slate-400">Megabytes (MB):</span><span className="text-slate-200">{(bytes / 1024 / 1024).toFixed(2)} MB</span></div>
        <div className="flex justify-between text-xs font-mono"><span className="text-slate-400">Gigabytes (GB):</span><span className="text-slate-200">{(bytes / 1024 / 1024 / 1024).toFixed(4)} GB</span></div>
      </div>
    </div>
  );
};
