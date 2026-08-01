import React, { createContext, useContext, useEffect, useState } from 'react';

export type AccentColor = 'cyan' | 'purple' | 'emerald' | 'orange' | 'ruby' | 'gold';
export type ThemeMode = 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mode: ThemeMode = 'dark';

  const [accent, setAccentState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('omni_theme_accent');
    return (saved as AccentColor) || 'cyan';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
    localStorage.setItem('omni_theme_mode', 'dark');
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-accent', accent);
    localStorage.setItem('omni_theme_accent', accent);
  }, [accent]);

  const setAccent = (color: AccentColor) => setAccentState(color);

  return (
    <ThemeContext.Provider value={{ mode, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
