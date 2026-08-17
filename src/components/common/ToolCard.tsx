import React from 'react';
import { Link } from 'react-router-dom';
import { Tool } from '../../types/index.js';
import { DynamicIcon } from './DynamicIcon.js';
import { useFavorites } from '../../context/FavoritesContext.js';
import { Bookmark, Sparkles, ArrowRight, Activity } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(tool.slug);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.slug);
  };

  return (
    <div className="group relative bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-2xl p-5 hover:border-[#B5824C] dark:hover:border-[#DFB267] shadow-xs hover:shadow-lg hover:shadow-[#B5824C]/5 dark:hover:shadow-[#DFB267]/5 transition-all duration-250 flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#B5824C]/10 dark:bg-[#DFB267]/15 text-[#B5824C] dark:text-[#DFB267] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 border border-[#B5824C]/15 dark:border-[#DFB267]/20">
            <DynamicIcon name={tool.icon || 'Wrench'} className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.is_featured === 1 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C87D65]/15 dark:bg-[#E89D86]/20 text-[#C87D65] dark:text-[#E89D86] text-[10px] font-bold uppercase tracking-wider border border-[#C87D65]/20">
                <Sparkles className="w-2.5 h-2.5" />
                Featured
              </span>
            )}
            <button
              onClick={handleFavoriteClick}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                favorite
                  ? 'text-[#C87D65] dark:text-[#E89D86] bg-[#C87D65]/10'
                  : 'text-[#756E65] dark:text-[#9E9B96] hover:text-[#1F1B18] dark:hover:text-[#F7F5F0] hover:bg-[#F4ECE1] dark:hover:bg-[#22252E]'
              }`}
              title={favorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Bookmark className={`w-4 h-4 ${favorite ? 'fill-[#C87D65] dark:fill-[#E89D86]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <Link to={`/tools/${tool.slug}`} className="block">
          <h3 className="text-base font-bold text-[#1F1B18] dark:text-[#F7F5F0] group-hover:text-[#B5824C] dark:group-hover:text-[#DFB267] transition-colors mb-1.5 line-clamp-1 font-['Outfit',sans-serif]">
            {tool.name}
          </h3>
          <p className="text-xs text-[#756E65] dark:text-[#9E9B96] leading-relaxed line-clamp-2 mb-4">
            {tool.description}
          </p>
        </Link>
      </div>

      {/* Footer Details */}
      <div className="pt-3 border-t border-[#EAE2D5]/80 dark:border-[#2C303B]/80 flex items-center justify-between text-xs text-[#756E65] dark:text-[#9E9B96]">
        <span className="flex items-center gap-1 text-[11px]">
          <Activity className="w-3.5 h-3.5 text-[#B5824C]/70 dark:text-[#DFB267]/70" />
          {tool.usage_count.toLocaleString()} uses
        </span>

        <Link
          to={`/tools/${tool.slug}`}
          className="inline-flex items-center gap-1 font-semibold text-[#B5824C] dark:text-[#DFB267] group-hover:translate-x-0.5 transition-transform"
        >
          Use Tool
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
