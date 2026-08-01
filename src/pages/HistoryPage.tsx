import React, { useState, useEffect } from 'react';
import { db, type HistoryItem } from '../lib/db';
import { History, Trash2, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const items = await db.history.toArray();
      const sorted = [...items].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setHistoryItems(sorted);
    } catch (err) {
      console.warn('Dexie history fetch error, using local fallback:', err);
      try {
        const saved = localStorage.getItem('omni_history_fallback');
        if (saved) setHistoryItems(JSON.parse(saved));
      } catch {
        setHistoryItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const clearHistory = async () => {
    if (confirm('Are you sure you want to clear your tool usage history?')) {
      try {
        await db.history.clear();
      } catch (err) {
        console.warn('Failed to clear Dexie history:', err);
      }
      localStorage.removeItem('omni_history_fallback');
      setHistoryItems([]);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100 flex items-center gap-2">
            <History className="w-8 h-8 text-accent" /> Tool Usage History
          </h1>
          <p className="text-xs text-slate-400 mt-1">Timeline of recently launched utilities in your local IndexedDB</p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-4 py-2 rounded-xl glass-panel text-rose-400 font-bold text-xs hover:bg-rose-500/10 flex items-center gap-1.5 self-start sm:self-auto border border-rose-500/30"
          >
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span className="text-xs font-semibold text-slate-400">Loading history timeline...</span>
        </div>
      ) : historyItems.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl border border-white/10 space-y-3">
          <Clock className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No recent activity logged</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Tools you open or launch will automatically log their usage timeline here for quick 1-click access.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {historyItems.map((item) => (
            <div
              key={item.id || `${item.toolId}-${item.timestamp}`}
              onClick={() => navigate(`/tool/${item.toolId}`)}
              className="p-4 rounded-2xl glass-panel glass-panel-hover cursor-pointer flex items-center justify-between border border-white/10 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-accent transition-colors">
                    {item.toolTitle}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Category: <strong className="text-slate-300">{item.category}</strong> • {new Date(item.timestamp).toLocaleTimeString()} ({new Date(item.timestamp).toLocaleDateString()})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/5 text-[11px] font-bold text-accent group-hover:bg-accent group-hover:text-slate-950 transition-all">
                  Open Tool ➜
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
