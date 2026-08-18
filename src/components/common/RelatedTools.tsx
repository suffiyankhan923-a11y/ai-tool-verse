import React from 'react';
import { ToolItem } from '../../types';
import { ToolCard } from './ToolCard';
import { Sparkles } from 'lucide-react';

interface RelatedToolsProps {
  currentTool: ToolItem;
  allTools: ToolItem[];
  onSelectTool: (slug: string) => void;
  favorites?: string[];
  onToggleFavorite?: (toolId: string, e: React.MouseEvent) => void;
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({
  currentTool,
  allTools,
  onSelectTool,
  favorites = [],
  onToggleFavorite,
}) => {
  // Find tools by explicit relatedToolIds or matching category
  let related = allTools.filter(
    (t) => t.id !== currentTool.id && currentTool.relatedToolIds?.includes(t.id)
  );

  if (related.length < 3) {
    const sameCategory = allTools.filter(
      (t) =>
        t.id !== currentTool.id &&
        t.category === currentTool.category &&
        !related.some((r) => r.id === t.id)
    );
    related = [...related, ...sameCategory];
  }

  const finalTools = related.slice(0, 3);

  if (finalTools.length === 0) return null;

  return (
    <section id="related-tools-section" aria-label="Related Tools" className="my-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold font-serif text-white">
          Related <span className="text-[#D4AF37] italic">Everyday Tools</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {finalTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onSelect={onSelectTool}
            isFavorite={favorites.includes(tool.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </section>
  );
};
