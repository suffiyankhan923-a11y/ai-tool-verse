import React from 'react';
import { Header } from './Header.js';
import { Footer } from './Footer.js';
import { AdPlaceholder } from '../common/AdPlaceholder.js';

interface LayoutProps {
  children: React.ReactNode;
  showTopAd?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showTopAd = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#111215] text-[#1F1B18] dark:text-[#F7F5F0] transition-colors">
      <Header />
      
      {showTopAd && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
          <AdPlaceholder location="header" />
        </div>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
};
