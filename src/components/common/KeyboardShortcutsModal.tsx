import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { key: 'Ctrl + K / Cmd + K', action: 'Open Global Search Palette' },
    { key: 'Esc', action: 'Close Modal or Drawer' },
    { key: 'Alt + H', action: 'Navigate to Home Dashboard' },
    { key: 'Alt + C', action: 'Explore Categories' },
    { key: 'Alt + W', action: 'Open Custom Widgets Grid' },
    { key: 'Alt + F', action: 'View Favorites' },
    { key: 'Alt + S', action: 'Open Application Settings' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg glass-panel rounded-3xl p-6 relative border border-white/15"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Command className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-bold text-slate-100">Keyboard Shortcuts</h3>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {shortcuts.map((sc, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl glass-panel">
                  <span className="text-sm font-medium text-slate-300">{sc.action}</span>
                  <kbd className="px-2.5 py-1 text-xs font-mono font-semibold text-accent bg-accent/15 border border-accent/30 rounded-lg">
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>

            <p className="text-xs text-center text-slate-400 mt-6">
              Empower your productivity with instant desktop navigation.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
