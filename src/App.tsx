import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToolStateProvider } from './context/ToolStateContext';
import { Layout } from './components/layout/Layout';
import { initDatabaseDefaults } from './lib/db';

import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { WidgetsPage } from './pages/WidgetsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  useEffect(() => {
    initDatabaseDefaults();
  }, []);

  return (
    <ThemeProvider>
      <ToolStateProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:id" element={<CategoryDetailPage />} />
              <Route path="/tool/:id" element={<ToolDetailPage />} />
              <Route path="/widgets" element={<WidgetsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/history" element={<Navigate to="/" replace />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Layout>
        </Router>
      </ToolStateProvider>
    </ThemeProvider>
  );
};
