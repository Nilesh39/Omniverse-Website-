import React, { useState } from 'react';
import { Settings, Palette, Download, Upload, Trash2, Check } from 'lucide-react';
import { useTheme, type AccentColor } from '../context/ThemeContext';
import { db } from '../lib/db';
import { downloadFile } from '../lib/utils';

export const SettingsPage: React.FC = () => {
  const { accent, setAccent } = useTheme();
  const [restored, setRestored] = useState(false);

  const accents: { id: AccentColor; label: string; bg: string }[] = [
    { id: 'cyan', label: 'Neon Cyan', bg: 'bg-cyan-500' },
    { id: 'purple', label: 'Vision Purple', bg: 'bg-purple-500' },
    { id: 'emerald', label: 'Emerald Green', bg: 'bg-emerald-500' },
    { id: 'orange', label: 'Sunset Orange', bg: 'bg-orange-500' },
    { id: 'ruby', label: 'Ruby Red', bg: 'bg-rose-500' },
    { id: 'gold', label: 'Cyber Gold', bg: 'bg-yellow-500' },
  ];

  const exportBackup = async () => {
    const notes = await db.notes.toArray();
    const expenses = await db.expenses.toArray();
    const habits = await db.habits.toArray();
    const favorites = await db.favorites.toArray();
    const history = await db.history.toArray();

    const data = { notes, expenses, habits, favorites, history, exportedAt: new Date().toISOString() };
    downloadFile(JSON.stringify(data, null, 2), 'omniverse-backup.json');
  };

  const importBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.notes) await db.notes.bulkAdd(parsed.notes);
          if (parsed.expenses) await db.expenses.bulkAdd(parsed.expenses);
          if (parsed.habits) await db.habits.bulkAdd(parsed.habits);
          if (parsed.history) await db.history.bulkAdd(parsed.history);
          setRestored(true);
          setTimeout(() => setRestored(false), 3000);
        } catch {
          alert('Invalid backup file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const resetAllData = async () => {
    if (confirm('Are you sure you want to clear all offline IndexedDB notes, habits, expenses, history, and settings?')) {
      await db.delete();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-100 flex items-center gap-2">
          <Settings className="w-8 h-8 text-accent" /> Preferences & Data Management
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure accent palettes, backup and restore data offline</p>
      </div>

      {/* Accent Color Selection */}
      <section className="p-6 glass-panel rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
          <Palette className="w-4 h-4 text-accent" /> Dynamic Accent Palette
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {accents.map(ac => (
            <button
              key={ac.id}
              onClick={() => setAccent(ac.id)}
              className={`p-3 rounded-2xl glass-panel text-xs font-semibold flex items-center gap-2 transition-all ${
                accent === ac.id ? 'border border-accent text-accent bg-accent/15' : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full ${ac.bg}`} />
              {ac.label}
            </button>
          ))}
        </div>
      </section>

      {/* Data Backup & Restore */}
      <section className="p-6 glass-panel rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-slate-200">Data Backup & Sync</h3>
        <p className="text-xs text-slate-400">Export all your offline notes, expenses, and habits as JSON.</p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportBackup}
            className="px-4 py-2.5 rounded-xl bg-accent text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md"
          >
            <Download className="w-4 h-4" /> Export Data Backup (JSON)
          </button>

          <label className="px-4 py-2.5 rounded-xl glass-panel text-slate-200 font-bold text-xs flex items-center gap-2 cursor-pointer hover:bg-white/10">
            <Upload className="w-4 h-4 text-accent" /> {restored ? 'Restored Successfully!' : 'Import Backup JSON'}
            <input type="file" accept=".json" onChange={importBackup} className="hidden" />
          </label>
        </div>
      </section>

      {/* Storage Reset */}
      <section className="p-6 glass-panel rounded-3xl border border-rose-500/30 space-y-3">
        <h3 className="text-base font-bold text-rose-400">Reset Local Storage</h3>
        <p className="text-xs text-slate-400">Completely reset IndexedDB database and clear stored local state.</p>

        <button
          onClick={resetAllData}
          className="px-4 py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold text-xs hover:bg-rose-500/30 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" /> Reset All Application Data
        </button>
      </section>
    </div>
  );
};
