import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext.js';
import { useFavorites } from '../context/FavoritesContext.js';
import { ToolCard } from '../components/common/ToolCard.js';
import { SEOHead } from '../components/common/SEOHead.js';
import { Bookmark, Trash2, Sparkles } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { tools } = useData();
  const { favorites, clearFavorites } = useFavorites();

  const favoriteTools = tools.filter((t) => favorites.includes(t.slug));

  return (
    <div className="space-y-8">
      <SEOHead
        title="Saved Favorites - ToolVerse"
        description="Quickly access your pinned and saved favorite tools in ToolVerse."
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE2D5] dark:border-[#2C303B]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] flex items-center gap-2 font-['Outfit',sans-serif]">
            <Bookmark className="w-6 h-6 text-[#C87D65] dark:text-[#E89D86] fill-[#C87D65] dark:fill-[#E89D86]" />
            Saved Favorite Tools
          </h1>
          <p className="text-xs text-[#756E65] dark:text-[#9E9B96] mt-1">
            Pinned utilities stored locally in your browser for instant one-click access
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={clearFavorites}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All Favorites
          </button>
        )}
      </div>

      {favoriteTools.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-8 max-w-md mx-auto space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#F4ECE1] dark:bg-[#22252E] text-[#756E65] dark:text-[#9E9B96] flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">No Favorites Saved Yet</h3>
          <p className="text-xs text-[#756E65] dark:text-[#9E9B96] leading-relaxed">
            Click the bookmark icon on any tool card across the directory to pin your most frequently used tools here.
          </p>
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] text-white text-xs font-semibold shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            Browse Tools Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoriteTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
};
