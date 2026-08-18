import React, { useState } from 'react';
import {
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  Layers,
  BookOpen,
  Info,
  Shield,
  Grid,
} from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
  darkMode,
  onToggleDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0F1E]/95 backdrop-blur-md border-b border-[#D4AF37]/20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          id="header-brand-logo"
          onClick={() => handleNav('/')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#8C6E12] rounded-lg flex items-center justify-center shadow-md shadow-black/40 group-hover:scale-105 transition-transform">
            <span className="text-[#050810] font-bold text-lg font-serif">T</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-serif font-bold tracking-tight text-white">
                Tool<span className="text-[#D4AF37]">Verse</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-widest bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-4 text-xs font-semibold uppercase tracking-widest text-[#94A3B8]">
          <button
            type="button"
            id="nav-home-btn"
            onClick={() => handleNav('/')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentPath === '/'
                ? 'text-[#D4AF37] bg-[#161E31] border border-[#D4AF37]/30'
                : 'hover:text-[#D4AF37] hover:bg-[#161E31]/60'
            }`}
          >
            Home
          </button>

          <button
            type="button"
            id="nav-tools-btn"
            onClick={() => handleNav('/tools')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentPath === '/tools'
                ? 'text-[#D4AF37] bg-[#161E31] border border-[#D4AF37]/30'
                : 'hover:text-[#D4AF37] hover:bg-[#161E31]/60'
            }`}
          >
            All Tools
          </button>

          {/* Categories Button */}
          <button
            type="button"
            id="nav-categories-btn"
            onClick={() => handleNav('/categories')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              currentPath.startsWith('/categories') || currentPath.startsWith('/tools/')
                ? 'text-[#D4AF37] bg-[#161E31] border border-[#D4AF37]/30'
                : 'hover:text-[#D4AF37] hover:bg-[#161E31]/60'
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Categories</span>
          </button>

          <button
            type="button"
            id="nav-blog-btn"
            onClick={() => handleNav('/blog')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentPath.startsWith('/blog')
                ? 'text-[#D4AF37] bg-[#161E31] border border-[#D4AF37]/30'
                : 'hover:text-[#D4AF37] hover:bg-[#161E31]/60'
            }`}
          >
            Blog
          </button>

          <button
            type="button"
            id="nav-about-btn"
            onClick={() => handleNav('/about')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentPath === '/about'
                ? 'text-[#D4AF37] bg-[#161E31] border border-[#D4AF37]/30'
                : 'hover:text-[#D4AF37] hover:bg-[#161E31]/60'
            }`}
          >
            About
          </button>

          <button
            type="button"
            id="nav-admin-btn"
            onClick={() => handleNav('/admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              currentPath === '/admin'
                ? 'text-[#050810] bg-[#D4AF37] font-bold shadow-md shadow-[#D4AF37]/30'
                : 'text-[#D4AF37] hover:bg-[#161E31] border border-[#D4AF37]/30'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </nav>

        {/* Right Actions: Search + Sponsor Tag */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="header-search-trigger-btn"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs text-[#94A3B8] bg-[#161E31] border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 hover:text-white transition-all shadow-sm shadow-black/50"
          >
            <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Search tools...</span>
            <kbd className="hidden lg:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0A0F1E] border border-[#D4AF37]/20 text-[#64748B]">
              ⌘K
            </kbd>
          </button>

          <div className="hidden lg:flex w-24 h-8 bg-[#161E31] border border-[#D4AF37]/20 rounded items-center justify-center text-[10px] text-[#D4AF37]/60 tracking-wider font-mono">
            AD SPACE
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            id="mobile-menu-toggle-btn"
            aria-label="Toggle mobile menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#D4AF37] md:hidden hover:bg-[#161E31]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden border-b border-[#D4AF37]/20 bg-[#0A0F1E] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150"
        >
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleNav('/')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#E2E8F0] hover:bg-[#161E31] hover:text-[#D4AF37]"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNav('/tools')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#E2E8F0] hover:bg-[#161E31] hover:text-[#D4AF37]"
            >
              All Tools Directory
            </button>
            <button
              type="button"
              onClick={() => handleNav('/categories')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#E2E8F0] hover:bg-[#161E31] hover:text-[#D4AF37]"
            >
              Tool Categories (12)
            </button>
            <button
              type="button"
              onClick={() => handleNav('/blog')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#E2E8F0] hover:bg-[#161E31] hover:text-[#D4AF37]"
            >
              Guides & Blog
            </button>
            <button
              type="button"
              onClick={() => handleNav('/about')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#E2E8F0] hover:bg-[#161E31] hover:text-[#D4AF37]"
            >
              About ToolVerse
            </button>
            <button
              type="button"
              onClick={() => handleNav('/contact')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#E2E8F0] hover:bg-[#161E31] hover:text-[#D4AF37]"
            >
              Contact Support
            </button>
            <button
              type="button"
              onClick={() => handleNav('/admin')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-[#D4AF37] bg-[#161E31] border border-[#D4AF37]/30 flex items-center justify-between"
            >
              <span>Admin Portal & Supabase Importer</span>
              <Shield className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-3 border-t border-[#D4AF37]/15">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-[#D4AF37] mb-2">
              Popular Categories
            </p>
            <div className="grid grid-cols-2 gap-1">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleNav(`/categories/${cat.slug}`)}
                  className="text-left px-2.5 py-1.5 rounded text-xs text-[#94A3B8] hover:text-[#D4AF37] hover:bg-[#161E31]"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
