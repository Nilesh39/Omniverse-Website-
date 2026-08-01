import React from 'react';
import { CATEGORIES } from '../data/categories';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';
import { useNavigate } from 'react-router-dom';
import { Grid, ArrowRight } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-100 flex items-center gap-2">
          <Grid className="w-8 h-8 text-accent" /> Categories Suite
        </h1>
        <p className="text-xs text-slate-400 mt-1">Browse 150+ offline tools organized into specialized domains</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map(cat => {
          const toolCount = TOOLS_REGISTRY.filter(t => t.category === cat.id).length;
          return (
            <div
              key={cat.id}
              onClick={() => navigate(`/categories/${cat.id}`)}
              className="glass-panel glass-panel-hover rounded-3xl p-6 cursor-pointer border border-white/10 flex flex-col justify-between h-48 group relative overflow-hidden"
            >
              <div className={`absolute -right-10 -top-10 w-28 h-28 rounded-full bg-gradient-to-br ${cat.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity`} />

              <div>
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/30">
                  {toolCount} Utilities
                </span>
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-accent transition-colors mt-3">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs font-semibold text-accent">
                <span>Explore Category</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
