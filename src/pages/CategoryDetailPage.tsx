import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';
import { ToolCard } from '../components/common/ToolCard';
import { ArrowLeft, Grid, Wrench } from 'lucide-react';

export const CategoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isAll = id === 'all';
  const category = isAll
    ? { name: 'All 150+ Offline Utilities', description: 'Browse and search our entire suite of offline utility tools.' }
    : CATEGORIES.find(c => c.id === id);

  const tools = isAll ? TOOLS_REGISTRY : TOOLS_REGISTRY.filter(t => t.category === id);

  if (!category) {
    return (
      <div className="text-center py-20 glass-panel rounded-3xl border border-white/10">
        <h2 className="text-xl font-bold text-slate-100">Category Not Found</h2>
        <button onClick={() => navigate('/categories')} className="mt-4 px-4 py-2 bg-accent text-slate-950 font-bold text-xs rounded-xl">
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/categories')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Categories
      </button>

      <div>
        <h1 className="text-3xl font-black text-slate-100 flex items-center gap-2">
          {isAll ? <Wrench className="w-8 h-8 text-accent" /> : <Grid className="w-8 h-8 text-accent" />} {category.name}
        </h1>
        <p className="text-xs text-slate-400 mt-1">{category.description} ({tools.length} Tools Available)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tools.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
};
