import React from 'react';
import { Search, Mic, Battery, BatteryCharging, Wifi, WifiOff, Sparkles, Download } from 'lucide-react';
import { useBattery } from '../../hooks/useBattery';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const battery = useBattery();
  const { isInstallable, promptInstall } = usePWAInstall();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 w-full glass-panel border-b border-white/10 px-4 md:px-8 py-3 flex items-center justify-between gap-4">
      {/* Mobile Brand Title */}
      <div className="flex md:hidden items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-slate-950 font-bold">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="font-bold text-sm text-slate-100">OmniVerse</span>
      </div>

      {/* Center Search Bar Trigger */}
      <div
        onClick={onOpenSearch}
        className="flex-1 max-w-xl glass-panel rounded-2xl px-4 py-2 flex items-center justify-between cursor-pointer hover:border-accent/40 transition-all text-slate-400 group"
      >
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 group-hover:text-accent transition-colors" />
          <span className="text-xs md:text-sm font-medium text-slate-400 group-hover:text-slate-200">
            Search 150+ offline tools...
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenSearch();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-accent hover:bg-white/10"
            title="Voice Search"
          >
            <Mic className="w-4 h-4" />
          </button>
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">
            Ctrl + K
          </kbd>
        </div>
      </div>

      {/* Right System Diagnostics & Status */}
      <div className="flex items-center gap-3">
        {/* Offline / Online Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold glass-panel ${
            isOnline ? 'text-emerald-400 border-emerald-500/30' : 'text-amber-400 border-amber-500/30'
          }`}
          title={isOnline ? 'Online Sync Available' : 'Working 100% Offline'}
        >
          {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline Mode'}</span>
        </div>

        {/* Battery Diagnostics */}
        {battery.supported && (
          <div
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold glass-panel text-slate-300"
            title={`Battery: ${Math.round(battery.level * 100)}% (${battery.charging ? 'Charging' : 'Discharging'})`}
          >
            {battery.charging ? (
              <BatteryCharging className="w-3.5 h-3.5 text-accent animate-pulse" />
            ) : (
              <Battery className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{Math.round(battery.level * 100)}%</span>
          </div>
        )}

        {/* Quick PWA Install Button */}
        {isInstallable && (
          <button
            onClick={promptInstall}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity shadow-md"
          >
            <Download className="w-3.5 h-3.5" /> App
          </button>
        )}
      </div>
    </header>
  );
};
