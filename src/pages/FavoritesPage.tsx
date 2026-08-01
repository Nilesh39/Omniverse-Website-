import React from 'react';
import { useToolState } from '../context/ToolStateContext';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';
import { ToolCard } from '../components/common/ToolCard';
import { Heart } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useToolState();
  const favoriteTools = TOOLS_REGISTRY.filter(t => favorites.includes(t.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-100 flex items-center gap-2">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" /> Favorite Utilities
        </h1>
        <p className="text-xs text-slate-400 mt-1">Your starred tools for quick workflow access</p>
      </div>

      {favoriteTools.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl border border-white/10">
          <Heart className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No favorite tools added yet</h3>
          <p className="text-xs text-slate-400 mt-1">Click the heart icon on any tool card to bookmark it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {favoriteTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
};
