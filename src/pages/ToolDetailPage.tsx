import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';
import { ToolRenderer } from '../components/common/ToolRenderer';
import { useToolState } from '../context/ToolStateContext';
import { ArrowLeft, Heart, Pin } from 'lucide-react';
import * as Icons from 'lucide-react';

export const ToolDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, isPinned, togglePin } = useToolState();

  const tool = TOOLS_REGISTRY.find(t => t.id === id);

  if (!tool) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-100">Tool Not Found</h2>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-accent text-slate-950 font-bold text-xs rounded-xl">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const favorite = isFavorite(tool.id);
  const pinned = isPinned(tool.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComp = (Icons as any)[tool.icon] || Icons.Wrench;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Tool Header Card */}
      <div className="glass-panel rounded-3xl p-6 border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent shadow-lg shadow-accent/20">
            <IconComp className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-100">{tool.title}</h1>
              <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-bold uppercase">
                100% Offline
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{tool.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => togglePin(tool.id)}
            className={`p-2.5 rounded-xl transition-all ${pinned ? 'text-amber-400 bg-amber-400/15 border border-amber-400/30' : 'glass-panel text-slate-400 hover:text-slate-200'}`}
            title={pinned ? 'Unpin from dashboard' : 'Pin to dashboard'}
          >
            <Pin className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleFavorite(tool.id)}
            className={`p-2.5 rounded-xl transition-all ${favorite ? 'text-rose-500 bg-rose-500/15 border border-rose-500/30' : 'glass-panel text-slate-400 hover:text-rose-400'}`}
            title={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Functional Interactive Playground */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl">
        <ToolRenderer componentName={tool.componentName} />
      </div>
    </div>
  );
};
