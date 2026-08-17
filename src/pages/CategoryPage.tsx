import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext.js';
import { ToolCard } from '../components/common/ToolCard.js';
import { DynamicIcon } from '../components/common/DynamicIcon.js';
import { SEOHead } from '../components/common/SEOHead.js';
import { AdPlaceholder } from '../components/common/AdPlaceholder.js';
import { ArrowLeft } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getCategoryBySlug, tools, loading } = useData();

  const category = slug ? getCategoryBySlug(slug) : undefined;
  const categoryTools = category
    ? tools.filter((t) => t.category_id === category.id || t.category_slug === category.slug)
    : [];

  if (loading) {
    return (
      <div className="py-20 text-center text-[#756E65] dark:text-[#9E9B96]">
        <div className="w-8 h-8 border-2 border-[#B5824C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading category collection...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">Category Not Found</h2>
        <p className="text-xs text-[#756E65] dark:text-[#9E9B96]">
          The category "{slug}" does not exist in the database.
        </p>
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] text-white text-xs font-semibold shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          View All Tools
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <SEOHead
        title={`${category.name} - Free Online Tools`}
        description={category.description}
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#756E65] dark:text-[#9E9B96]">
        <Link to="/" className="hover:text-[#B5824C] dark:hover:text-[#DFB267]">Home</Link>
        <span>/</span>
        <Link to="/tools" className="hover:text-[#B5824C] dark:hover:text-[#DFB267]">Categories</Link>
        <span>/</span>
        <span className="font-semibold text-[#1F1B18] dark:text-[#F7F5F0]">{category.name}</span>
      </div>

      {/* Category Hero Header */}
      <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#B5824C]/10 dark:bg-[#DFB267]/15 text-[#B5824C] dark:text-[#DFB267] flex items-center justify-center shrink-0 shadow-2xs border border-[#B5824C]/15 dark:border-[#DFB267]/20">
            <DynamicIcon name={category.icon || 'Folder'} className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B5824C] dark:text-[#DFB267] px-2 py-0.5 rounded-full bg-[#B5824C]/10 dark:bg-[#DFB267]/15 border border-[#B5824C]/20">
              Tool Suite
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] tracking-tight mt-1.5 font-['Outfit',sans-serif]">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#756E65] dark:text-[#9E9B96] mt-1 max-w-xl">
              {category.description}
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#22252E] border border-[#EAE2D5] dark:border-[#2C303B] text-xs font-semibold text-[#1F1B18] dark:text-[#F7F5F0] shrink-0">
          {categoryTools.length} Utilities Available
        </div>
      </div>

      {/* Tools in Category */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">
          All {category.name} Utilities
        </h2>

        {categoryTools.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#181A20] rounded-2xl border border-[#EAE2D5] dark:border-[#2C303B] text-xs text-[#756E65] dark:text-[#9E9B96]">
            No tools have been added to this category yet. You can add one via the Admin Dashboard!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoryTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Ad */}
      <AdPlaceholder location="in-content" />
    </div>
  );
};
