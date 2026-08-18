import React from 'react';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { ToolItem } from '../../types';
import { DynamicIcon } from './DynamicIcon';
import { CATEGORIES } from '../../data/categories';

interface ToolCardProps {
  tool: ToolItem;
  onSelect: (toolSlug: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (toolId: string, e: React.MouseEvent) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const categoryInfo = CATEGORIES.find((c) => c.id === tool.category);

  return (
    <div
      id={`tool-card-${tool.slug}`}
      onClick={() => onSelect(tool.slug)}
      className="group relative flex flex-col justify-between p-5 rounded-xl bg-[#0F172A] border border-[#D4AF37]/10 hover:border-[#D4AF37]/40 transition-all duration-200 cursor-pointer text-left shadow-lg shadow-black/40 hover:shadow-black/70 hover:-translate-y-0.5"
    >
      {/* Top Bar: Icon + Category Badge + Favorite */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-10 h-10 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#050810] transition-colors duration-200 shadow-sm">
            <DynamicIcon name={tool.iconName} className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                <Sparkles className="w-2.5 h-2.5" />
                Featured
              </span>
            )}
            {onToggleFavorite && (
              <button
                type="button"
                id={`fav-btn-${tool.id}`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                onClick={(e) => onToggleFavorite(tool.id, e)}
                className={`p-1.5 rounded-lg hover:bg-[#161E31] transition-colors ${
                  isFavorite ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-[#64748B] hover:text-[#D4AF37]'
                }`}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          id={`tool-title-${tool.slug}`}
          className="text-base md:text-lg font-semibold text-white group-hover:text-[#D4AF37] transition-colors mb-2 line-clamp-1"
        >
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-xs md:text-sm text-[#64748B] line-clamp-2 leading-relaxed mb-4">
          {tool.description}
        </p>
      </div>

      {/* Bottom Category Tag & Link */}
      <div className="pt-3 border-t border-[#D4AF37]/10 flex items-center justify-between">
        <span className="text-[10px] uppercase text-[#D4AF37] font-bold tracking-widest">
          {categoryInfo?.name || tool.category}
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};
