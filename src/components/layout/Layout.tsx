import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileBottomNav } from './MobileBottomNav';
import { Footer } from './Footer';
import { SearchModal } from '../common/SearchModal';
import { InstallPWAPrompt } from '../common/InstallPWAPrompt';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row overflow-x-hidden text-slate-100 bg-[#070913] selection:bg-accent selection:text-slate-950">
      {/* Animated Ambient Glowing Orbs Background */}
      <div className="ambient-bg" aria-hidden="true">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
        <div className="ambient-orb orb-3" />
      </div>

      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {children}
        </main>

        <Footer />
      </div>

      {/* Floating Mobile Pill Bottom Nav */}
      <MobileBottomNav />

      {/* Global Command-K Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* PWA Custom Install Prompt Banner */}
      <InstallPWAPrompt />
    </div>
  );
};
