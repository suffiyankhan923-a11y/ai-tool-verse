import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.js';
import { useFavorites } from '../../context/FavoritesContext.js';
import { useData } from '../../context/DataContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { DynamicIcon } from '../common/DynamicIcon.js';
import {
  Search,
  Sun,
  Moon,
  Bookmark,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
  ArrowRight,
  Zap,
  BookOpen
} from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const { categories, searchEntities } = useData();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search trigger
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      const results = await searchEntities(query);
      setSearchResults(results);
      setSearching(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [query, searchEntities]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSearchResults([]);
    }
  }, [searchOpen]);

  const handleSelectResult = (result: any) => {
    setSearchOpen(false);
    if (result.type === 'tool') {
      navigate(`/tools/${result.slug}`);
    } else if (result.type === 'blog') {
      navigate(`/blog/${result.slug}`);
    } else if (result.type === 'category') {
      navigate(`/category/${result.slug}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 dark:bg-[#111215]/90 backdrop-blur-md border-b border-[#EAE2D5]/80 dark:border-[#2C303B]/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#B5824C] to-[#9E6F3B] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-100" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-[#1F1B18] dark:text-[#F7F5F0] tracking-tight leading-tight flex items-center gap-1.5 font-['Outfit',sans-serif]">
                ToolVerse
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#B5824C]/15 dark:bg-[#DFB267]/20 text-[#B5824C] dark:text-[#DFB267] font-semibold border border-[#B5824C]/25 dark:border-[#DFB267]/30">
                  PRO
                </span>
              </span>
              <span className="text-[11px] text-[#756E65] dark:text-[#9E9B96] font-medium -mt-0.5">
                Premium Utility Suite
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/tools"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#756E65] dark:text-[#9E9B96] hover:text-[#1F1B18] dark:hover:text-[#F7F5F0] hover:bg-[#F4ECE1]/60 dark:hover:bg-[#22252E]/60 transition-colors"
            >
              All Tools
            </Link>

            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#756E65] dark:text-[#9E9B96] hover:text-[#1F1B18] dark:hover:text-[#F7F5F0] hover:bg-[#F4ECE1]/60 dark:hover:bg-[#22252E]/60 transition-colors"
              >
                {cat.name}
              </Link>
            ))}

            <Link
              to="/blog"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#756E65] dark:text-[#9E9B96] hover:text-[#1F1B18] dark:hover:text-[#F7F5F0] hover:bg-[#F4ECE1]/60 dark:hover:bg-[#22252E]/60 transition-colors"
            >
              Guides & Blog
            </Link>
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2">
            {/* Search Button / Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-white dark:bg-[#181A20] text-xs text-[#756E65] dark:text-[#9E9B96] hover:border-[#B5824C] dark:hover:border-[#DFB267] transition-all shadow-2xs cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#B5824C] dark:text-[#DFB267]" />
              <span className="hidden sm:inline">Search 30+ tools...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-[#F4ECE1] dark:bg-[#22252E] rounded text-[#756E65] dark:text-[#9E9B96]">
                ⌘K
              </kbd>
            </button>

            {/* Favorites Icon */}
            <Link
              to="/favorites"
              className="relative p-2 rounded-xl text-[#756E65] dark:text-[#9E9B96] hover:bg-[#F4ECE1]/70 dark:hover:bg-[#22252E] transition-colors"
              title="Saved Favorites"
            >
              <Bookmark className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C87D65] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[#756E65] dark:text-[#9E9B96] hover:bg-[#F4ECE1]/70 dark:hover:bg-[#22252E] transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#756E65]" />}
            </button>

            {/* Admin Portal Button */}
            <Link
              to="/admin"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                isAuthenticated
                  ? 'bg-emerald-700 text-white border border-emerald-500 hover:bg-emerald-800'
                  : 'bg-[#1F1B18] dark:bg-[#F7F5F0] text-white dark:text-[#1F1B18] hover:opacity-90'
              }`}
              title={isAuthenticated ? `Signed in as ${user?.email}` : 'Admin CMS Portal'}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isAuthenticated ? 'text-emerald-200' : 'text-[#DFB267] dark:text-[#B5824C]'}`} />
              <span>{isAuthenticated ? 'Admin CMS' : 'Admin'}</span>
              {isAuthenticated && <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#756E65] dark:text-[#9E9B96] hover:bg-[#F4ECE1] dark:hover:bg-[#22252E]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#111215] px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] text-xs font-semibold text-[#1F1B18] dark:text-[#F7F5F0] flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-[#B5824C] dark:text-[#DFB267]" />
              All Tools
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] text-xs font-semibold text-[#1F1B18] dark:text-[#F7F5F0] flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#C87D65] dark:text-[#E89D86]" />
              Guides & Blog
            </Link>
          </div>

          <div className="space-y-1 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#756E65] dark:text-[#9E9B96]">Categories</span>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#1F1B18] dark:text-[#F7F5F0] hover:bg-[#F4ECE1] dark:hover:bg-[#22252E]"
              >
                <DynamicIcon name={cat.icon} className="w-4 h-4 text-[#B5824C] dark:text-[#DFB267]" />
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#EAE2D5] dark:border-[#2C303B] flex items-center justify-between">
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-[#1F1B18] dark:text-[#F7F5F0] flex items-center gap-1.5"
            >
              <Bookmark className="w-4 h-4 text-[#C87D65] dark:text-[#E89D86]" />
              Saved Favorites ({favorites.length})
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-[#B5824C] hover:bg-[#9E6F3B] text-white text-xs font-semibold"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Global Command Palette / Search Dialog */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div
            className="w-full max-w-xl bg-white dark:bg-[#181A20] rounded-2xl shadow-2xl border border-[#EAE2D5] dark:border-[#2C303B] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 border-b border-[#EAE2D5] dark:border-[#2C303B]">
              <Search className="w-5 h-5 text-[#B5824C] dark:text-[#DFB267]" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools, guides, categories, FAQs..."
                className="w-full py-4 px-3 bg-transparent text-[#1F1B18] dark:text-[#F7F5F0] placeholder-[#756E65] dark:placeholder-[#9E9B96] text-sm focus:outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-lg text-[#756E65] hover:text-[#1F1B18] dark:hover:text-[#F7F5F0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results Box */}
            <div className="max-h-96 overflow-y-auto p-2">
              {searching && (
                <div className="py-8 text-center text-xs text-[#756E65] dark:text-[#9E9B96]">
                  Searching database records...
                </div>
              )}

              {!searching && query && searchResults.length === 0 && (
                <div className="py-8 text-center text-xs text-[#756E65] dark:text-[#9E9B96]">
                  No matching tools or articles found for "{query}".
                </div>
              )}

              {!searching && searchResults.length > 0 && (
                <div className="space-y-1">
                  {searchResults.map((res, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectResult(res)}
                      className="w-full text-left p-3 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-[#22252E] flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#B5824C]/10 dark:bg-[#DFB267]/20 text-[#B5824C] dark:text-[#DFB267] flex items-center justify-center">
                          {res.type === 'tool' && <DynamicIcon name={res.icon || 'Wrench'} className="w-4 h-4" />}
                          {res.type === 'blog' && <BookOpen className="w-4 h-4" />}
                          {res.type === 'category' && <DynamicIcon name={res.icon || 'Folder'} className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#1F1B18] dark:text-[#F7F5F0] group-hover:text-[#B5824C] dark:group-hover:text-[#DFB267] transition-colors">
                              {res.title}
                            </span>
                            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#F4ECE1] dark:bg-[#22252E] text-[#756E65] dark:text-[#9E9B96]">
                              {res.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#756E65] dark:text-[#9E9B96] line-clamp-1">
                            {res.snippet}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#756E65] group-hover:text-[#1F1B18] dark:group-hover:text-white transition-colors" />
                    </button>
                  ))}
                </div>
              )}

              {!query && (
                <div className="p-4 text-center">
                  <p className="text-xs text-[#756E65] dark:text-[#9E9B96] mb-3">Popular Quick Picks</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['word-counter', 'json-formatter', 'ai-prompt-generator', 'qr-code-generator', 'pdf-merger'].map((slug) => (
                      <button
                        key={slug}
                        onClick={() => {
                          setSearchOpen(false);
                          navigate(`/tools/${slug}`);
                        }}
                        className="px-3 py-1 rounded-lg text-xs bg-[#F4ECE1] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] hover:bg-[#B5824C] hover:text-white dark:hover:bg-[#DFB267] dark:hover:text-[#1F1B18] transition-colors cursor-pointer"
                      >
                        {slug.replace(/-/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Hint */}
            <div className="p-3 bg-[#FAF7F2] dark:bg-[#111215] border-t border-[#EAE2D5] dark:border-[#2C303B] text-[11px] text-[#756E65] dark:text-[#9E9B96] flex items-center justify-between">
              <span>Navigate with arrow keys</span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#22252E] border border-[#EAE2D5] dark:border-[#2C303B] rounded text-[10px]">ESC to close</kbd>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
