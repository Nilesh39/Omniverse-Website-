import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Sparkles, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const InstallPWAPrompt: React.FC = () => {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = React.useState(false);

  if (!isInstallable || isInstalled || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-20 md:bottom-6 right-6 z-40 max-w-md liquid-glass rounded-2xl p-4 shadow-glass border border-accent/40 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-slate-950 font-black shadow-lg shadow-accent/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">Install OmniVerse PWA</h4>
            <p className="text-xs text-slate-300">Fast offline access & native app feel</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={promptInstall}
            className="px-3.5 py-1.5 rounded-xl bg-accent text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-3.5 h-3.5" /> Install
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
