import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext.js';
import { ToolCard } from '../components/common/ToolCard.js';
import { SEOHead } from '../components/common/SEOHead.js';
import { AdPlaceholder } from '../components/common/AdPlaceholder.js';
import { Search, ArrowUpDown } from 'lucide-react';

export const AllToolsPage: React.FC = () => {
  const { tools, categories } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'name' | 'newest'>('popular');

  const filteredTools = useMemo(() => {
    return tools
      .filter((t) => {
        const matchesSearch =
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat =
          selectedCategory === 'all' || t.category_slug === selectedCategory;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.usage_count || 0) - (a.usage_count || 0);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return b.id - a.id;
      });
  }, [tools, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="space-y-8">
      <SEOHead
        title="All Tools - Free Developer, AI, Writing, Image & PDF Utilities"
        description="Browse the complete catalog of 30+ free, instant online tools."
      />

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] tracking-tight font-['Outfit',sans-serif]">
          Utility Directory
        </h1>
        <p className="text-sm text-[#756E65] dark:text-[#9E9B96]">
          Discover high-performance utilities built for creators, engineers, and digital nomads.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#B5824C] dark:text-[#DFB267] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchParams(e.target.value ? { q: e.target.value } : {});
              }}
              placeholder="Search by tool name or function..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-[#756E65] dark:text-[#9E9B96] font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#B5824C] dark:text-[#DFB267]" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] font-medium focus:outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="name">Alphabetical (A-Z)</option>
              <option value="newest">Recently Added</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#EAE2D5]/80 dark:border-[#2C303B]/80">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#B5824C] text-white shadow-xs'
                : 'bg-[#FAF7F2] dark:bg-[#22252E] text-[#756E65] dark:text-[#9E9B96] hover:border-[#B5824C]'
            }`}
          >
            All Categories ({tools.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-[#B5824C] text-white shadow-xs'
                  : 'bg-[#FAF7F2] dark:bg-[#22252E] text-[#756E65] dark:text-[#9E9B96] hover:border-[#B5824C]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#181A20] rounded-2xl border border-[#EAE2D5] dark:border-[#2C303B] space-y-3">
          <p className="text-sm font-semibold text-[#1F1B18] dark:text-[#F7F5F0]">No tools found matching your criteria</p>
          <p className="text-xs text-[#756E65] dark:text-[#9E9B96]">Try searching for a different keyword or reset the category filter.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}

      {/* Ad Placement */}
      <AdPlaceholder location="in-content" />
    </div>
  );
};
