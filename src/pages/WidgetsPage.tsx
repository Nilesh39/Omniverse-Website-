import React from 'react';
import { WidgetGrid } from '../components/dashboard/WidgetGrid';
import { AppWindow } from 'lucide-react';

export const WidgetsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-100 flex items-center gap-2">
          <AppWindow className="w-8 h-8 text-accent" /> Custom Widgets Canvas
        </h1>
        <p className="text-xs text-slate-400 mt-1">Interactive offline dashboard widgets running in real time</p>
      </div>

      <WidgetGrid />
    </div>
  );
};
