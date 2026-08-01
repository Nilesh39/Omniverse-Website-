import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

interface ToolStateContextType {
  favorites: string[]; // toolIds
  pinnedToolIds: string[];
  toggleFavorite: (toolId: string) => Promise<void>;
  togglePin: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  isPinned: (toolId: string) => boolean;
}

const ToolStateContext = createContext<ToolStateContextType | undefined>(undefined);

export const ToolStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dbFavorites = useLiveQuery(() => db.favorites.toArray(), []);

  const [pinnedToolIds, setPinnedToolIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('omni_pinned_tools');
      return saved ? JSON.parse(saved) : ['json-formatter', 'scientific-calculator', 'pomodoro-timer', 'qr-generator'];
    } catch {
      return ['json-formatter', 'scientific-calculator', 'pomodoro-timer', 'qr-generator'];
    }
  });

  const favorites = useMemo(() => (dbFavorites ? dbFavorites.map(f => f.toolId) : []), [dbFavorites]);

  const isFavorite = useCallback((toolId: string) => favorites.includes(toolId), [favorites]);
  const isPinned = useCallback((toolId: string) => pinnedToolIds.includes(toolId), [pinnedToolIds]);

  const toggleFavorite = useCallback(async (toolId: string) => {
    const existing = await db.favorites.where('toolId').equals(toolId).first();
    if (existing && existing.id) {
      await db.favorites.delete(existing.id);
    } else {
      await db.favorites.add({ toolId, addedAt: new Date().toISOString() });
    }
  }, []);

  const togglePin = useCallback((toolId: string) => {
    setPinnedToolIds(prev => {
      const next = prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId];
      localStorage.setItem('omni_pinned_tools', JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(() => ({
    favorites,
    pinnedToolIds,
    toggleFavorite,
    togglePin,
    isFavorite,
    isPinned
  }), [favorites, pinnedToolIds, toggleFavorite, togglePin, isFavorite, isPinned]);

  return (
    <ToolStateContext.Provider value={value}>
      {children}
    </ToolStateContext.Provider>
  );
};

export const useToolState = () => {
  const context = useContext(ToolStateContext);
  if (!context) throw new Error('useToolState must be used within ToolStateProvider');
  return context;
};
