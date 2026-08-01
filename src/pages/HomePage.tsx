import React, { useState } from 'react';
import { HeroBanner } from '../components/dashboard/HeroBanner';
import { WidgetGrid } from '../components/dashboard/WidgetGrid';
import { ToolCard } from '../components/common/ToolCard';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';
import { CATEGORIES } from '../data/categories';
import { useToolState } from '../context/ToolStateContext';
import { Sparkles, Pin, Heart, Flame, Grid, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SearchModal } from '../components/common/SearchModal';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { pinnedToolIds, favorites } = useToolState();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const pinnedTools = TOOLS_REGISTRY.filter(t => pinnedToolIds.includes(t.id));
  const favoriteTools = TOOLS_REGISTRY.filter(t => favorites.includes(t.id));
  const popularTools = TOOLS_REGISTRY.filter(t => t.popular);

  return (
    <div className="space-y-10">
      {/* Animated Hero Banner */}
      <HeroBanner onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Dashboard Interactive Widgets */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-slate-100">Live Vision Widgets</h2>
          </div>
          <button
            onClick={() => navigate('/widgets')}
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
          >
            Customize Widgets <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <WidgetGrid />
      </section>

      {/* Pinned Utilities */}
      {pinnedTools.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Pin className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-slate-100">Pinned Dashboard Utilities</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pinnedTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Starred Favorites */}
      {favoriteTools.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-xl font-bold text-slate-100">Your Favorite Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {favoriteTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Trending Popular Utilities */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-bold text-slate-100">Trending Utilities</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularTools.slice(0, 8).map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-slate-100">Explore Utility Categories</h2>
          </div>
          <button
            onClick={() => navigate('/categories')}
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
          >
            View All Categories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map(cat => (
            <div
              key={cat.id}
              onClick={() => navigate(`/categories/${cat.id}`)}
              className="glass-panel glass-panel-hover rounded-3xl p-6 cursor-pointer border border-white/10 flex items-center justify-between group"
            >
              <div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-accent transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{cat.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </section>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};
