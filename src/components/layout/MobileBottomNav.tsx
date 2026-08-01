import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Grid, Wrench, AppWindow, Heart, Settings } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const items = [
    { path: '/', label: 'Home', icon: LayoutDashboard },
    { path: '/categories', label: 'Categories', icon: Grid },
    { path: '/categories/all', label: 'All Tools', icon: Wrench },
    { path: '/widgets', label: 'Widgets', icon: AppWindow },
    { path: '/favorites', label: 'Favorites', icon: Heart },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-lg bg-black/60 backdrop-blur-2xl rounded-full px-3 py-2 shadow-2xl border border-white/20 flex items-center justify-between">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/categories' || item.path === '/'}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 ${
                isActive
                  ? 'text-accent scale-110 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-bold tracking-tight mt-0.5">{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-accent shadow-sm shadow-accent" />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </div>
  );
};
