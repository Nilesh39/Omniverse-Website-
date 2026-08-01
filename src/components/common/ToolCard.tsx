import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { type ToolDefinition } from '../../data/toolsRegistry';
import { useToolState } from '../../context/ToolStateContext';
import { CATEGORIES } from '../../data/categories';

interface ToolCardProps {
  tool: ToolDefinition;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, isPinned, togglePin } = useToolState();
  const favorite = isFavorite(tool.id);
  const pinned = isPinned(tool.id);

  // Dynamic Lucide Icon
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[tool.icon] || Icons.Wrench;
  const categoryInfo = CATEGORIES.find(c => c.id === tool.category);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      onClick={() => navigate(`/tool/${tool.id}`)}
      className="glass-panel group relative rounded-2xl p-5 cursor-pointer overflow-hidden transition-all duration-300 hover:border-accent/50 hover:shadow-glass-glow flex flex-col justify-between"
    >
      {/* Background Subtle Gradient Glow */}
      <div className={`absolute -right-12 -top-12 w-28 h-28 rounded-full bg-gradient-to-br ${categoryInfo?.color || 'from-cyan-500 to-blue-500'} opacity-15 blur-xl group-hover:opacity-30 transition-opacity duration-300`} />

      <div>
        {/* Header Badges & Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl glass-panel flex items-center justify-center text-accent group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300 shadow-sm`}>
              <IconComponent className="w-6 h-6 text-accent" />
            </div>
            {tool.popular && (
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/30">
                Popular
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 z-10" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => togglePin(tool.id)}
              className={`p-1.5 rounded-lg transition-colors ${pinned ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
              title={pinned ? 'Unpin from dashboard' : 'Pin to dashboard'}
            >
              <Icons.Pin className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(tool.id)}
              className={`p-1.5 rounded-lg transition-colors ${favorite ? 'text-rose-500 bg-rose-500/10' : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800/50'}`}
              title={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Icons.Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-slate-100 group-hover:text-accent transition-colors duration-200 line-clamp-1">
          {tool.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Footer Category Badge */}
      <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-300">
          {categoryInfo?.name || tool.category}
        </span>
        <span className="text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 flex items-center gap-1">
          Open <Icons.ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.div>
  );
};
