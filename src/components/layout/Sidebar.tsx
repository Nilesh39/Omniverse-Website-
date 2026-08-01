import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Grid,
  AppWindow,
  Heart,
  BarChart3,
  Settings,
  Info,
  Sparkles,
  Palette,
  Keyboard,
  Wrench
} from 'lucide-react';
import { useTheme, type AccentColor } from '../../context/ThemeContext';
import { KeyboardShortcutsModal } from '../common/KeyboardShortcutsModal';

export const Sidebar: React.FC = () => {
  const { accent, setAccent } = useTheme();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAccentPicker, setShowAccentPicker] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/categories', label: 'Categories', icon: Grid },
    { path: '/categories/all', label: 'All 150+ Tools', icon: Wrench },
    { path: '/widgets', label: 'Widgets', icon: AppWindow },
    { path: '/favorites', label: 'Favorites', icon: Heart },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/about', label: 'About', icon: Info },
  ];

  const accents: { id: AccentColor; label: string; colorClass: string }[] = [
    { id: 'cyan', label: 'Cyan', colorClass: 'bg-cyan-500' },
    { id: 'purple', label: 'Purple', colorClass: 'bg-purple-500' },
    { id: 'emerald', label: 'Emerald', colorClass: 'bg-emerald-500' },
    { id: 'orange', label: 'Orange', colorClass: 'bg-orange-500' },
    { id: 'ruby', label: 'Ruby', colorClass: 'bg-rose-500' },
    { id: 'gold', label: 'Gold', colorClass: 'bg-yellow-500' },
  ];

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 z-30 glass-panel border-r border-white/10 p-4 justify-between">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-3 py-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-accent/25">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-100 tracking-tight leading-none">
                OmniVerse<span className="text-accent">.</span>
              </h1>
              <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">
                Offline PWA Suite
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/categories' || item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-accent/15 text-accent border border-accent/30 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions & Theme Customizer */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          {/* Accent Color Selection Button */}
          <div className="relative">
            <button
              onClick={() => setShowAccentPicker(!showAccentPicker)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 glass-panel hover:bg-white/10 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-accent" /> Accent Theme
              </span>
              <span className={`w-3.5 h-3.5 rounded-full bg-accent border border-white/20`} />
            </button>

            {showAccentPicker && (
              <div className="absolute bottom-12 left-0 w-full glass-panel rounded-2xl p-3 shadow-xl border border-white/15 space-y-2 z-40">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Material You Accents</p>
                <div className="grid grid-cols-3 gap-2">
                  {accents.map((ac) => (
                    <button
                      key={ac.id}
                      onClick={() => {
                        setAccent(ac.id);
                        setShowAccentPicker(false);
                      }}
                      className={`flex items-center gap-1.5 p-1.5 rounded-lg text-[11px] font-medium transition-all ${accent === ac.id ? 'bg-white/15 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${ac.colorClass}`} />
                      {ac.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Shortcuts Button */}
          <button
            onClick={() => setShowShortcuts(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold glass-panel text-slate-300 hover:bg-white/10 transition-colors"
          >
            <Keyboard className="w-4 h-4 text-accent" /> Keyboard Shortcuts
          </button>
        </div>
      </aside>

      <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </>
  );
};
