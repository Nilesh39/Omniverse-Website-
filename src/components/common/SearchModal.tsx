import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { TOOLS_REGISTRY } from '../../data/toolsRegistry';
import { CATEGORIES } from '../../data/categories';
import { fuzzySearch } from '../../lib/utils';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();

  const { isListening, transcript, supported, startListening, setTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
      setTranscript('');
    }
  }, [transcript, setTranscript]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open search modal
          // standard handler trigger
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredTools = TOOLS_REGISTRY.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesQuery = fuzzySearch(query, tool.title) ||
      fuzzySearch(query, tool.description) ||
      tool.keywords.some(kw => fuzzySearch(query, kw));
    return matchesCategory && matchesQuery;
  });

  const handleSelectTool = (toolId: string) => {
    navigate(`/tool/${toolId}`);
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/70 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/15"
          >
            {/* Input Bar */}
            <div className="flex items-center px-5 py-4 border-b border-white/10 gap-3">
              <Icons.Search className="w-5 h-5 text-accent" />
              <input
                type="text"
                autoFocus
                placeholder="Search 150+ tools, categories or tags... (Ctrl + K)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-none text-slate-100 placeholder-slate-400 focus:outline-none text-base font-medium"
              />
              {supported && (
                <button
                  onClick={startListening}
                  className={`p-2 rounded-xl text-slate-300 hover:text-accent hover:bg-white/5 transition-all ${isListening ? 'animate-pulse text-rose-500 bg-rose-500/10' : ''}`}
                  title="Voice Search"
                >
                  <Icons.Mic className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Pills */}
            <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === 'all' ? 'bg-accent text-slate-950 shadow-md' : 'glass-panel text-slate-300 hover:bg-white/10'}`}
              >
                All Tools ({TOOLS_REGISTRY.length})
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-accent text-slate-950 shadow-md' : 'glass-panel text-slate-300 hover:bg-white/10'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Tool Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
              {filteredTools.length === 0 ? (
                <div className="text-center py-12">
                  <Icons.SearchX className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-300 font-semibold">No matching utilities found</p>
                  <p className="text-xs text-slate-400 mt-1">Try searching for keywords like "json", "bmi", "qr", "calc"</p>
                </div>
              ) : (
                filteredTools.map(tool => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const IconComp = (Icons as any)[tool.icon] || Icons.Wrench;
                  return (
                    <div
                      key={tool.id}
                      onClick={() => handleSelectTool(tool.id)}
                      className="p-3.5 rounded-2xl glass-panel glass-panel-hover cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-slate-950 transition-all">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-100 group-hover:text-accent transition-colors">
                            {tool.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                      <Icons.ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Cheatsheet */}
            <div className="px-5 py-3 bg-white/5 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 text-slate-200">ESC</kbd> to exit</span>
              <span className="flex items-center gap-1"><Icons.Sparkles className="w-3.5 h-3.5 text-accent" /> 100% Offline Utilities</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
