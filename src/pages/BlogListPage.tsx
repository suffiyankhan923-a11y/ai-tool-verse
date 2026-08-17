import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext.js';
import { SEOHead } from '../components/common/SEOHead.js';
import { AdPlaceholder } from '../components/common/AdPlaceholder.js';
import { Search, User, Clock } from 'lucide-react';

export const BlogListPage: React.FC = () => {
  const { blogs, loading } = useData();
  const [search, setSearch] = useState('');

  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.excerpt.toLowerCase().includes(search.toLowerCase()) ||
    b.tags.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <SEOHead
        title="Engineering Blog & Guides - ToolVerse"
        description="Deep dives into modern developer tooling, client-side encryption, image algorithms, and AI prompt engineering."
      />

      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B5824C] dark:text-[#DFB267] px-3 py-1 rounded-full bg-[#B5824C]/10 dark:bg-[#DFB267]/15 border border-[#B5824C]/20">
          Knowledge Base
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] tracking-tight font-['Outfit',sans-serif]">
          Guides & Editorial Articles
        </h1>
        <p className="text-sm text-[#756E65] dark:text-[#9E9B96]">
          Explore architectural insights, utility guides, and best practices from our engineering team.
        </p>

        {/* Search */}
        <div className="pt-2 max-w-md mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-[#B5824C] dark:text-[#DFB267] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles and guides..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-white dark:bg-[#181A20] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
            />
          </div>
        </div>
      </div>

      {/* Blog Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-[#F4ECE1] dark:bg-[#22252E] animate-pulse" />
          ))}
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#181A20] rounded-2xl border border-[#EAE2D5] dark:border-[#2C303B] text-xs text-[#756E65] dark:text-[#9E9B96]">
          No articles match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <Link
              key={blog.id}
              to={`/blog/${blog.slug}`}
              className="group bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl overflow-hidden shadow-xs hover:shadow-lg hover:border-[#B5824C] dark:hover:border-[#DFB267] transition-all flex flex-col justify-between"
            >
              <div>
                {blog.cover_image && (
                  <div className="h-48 overflow-hidden bg-[#F4ECE1] dark:bg-[#22252E]">
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {blog.tags.split(',').map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#B5824C]/10 dark:bg-[#DFB267]/15 text-[#B5824C] dark:text-[#DFB267] border border-[#B5824C]/15"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-lg font-bold text-[#1F1B18] dark:text-[#F7F5F0] group-hover:text-[#B5824C] dark:group-hover:text-[#DFB267] transition-colors leading-snug line-clamp-2 font-['Outfit',sans-serif]">
                    {blog.title}
                  </h2>

                  <p className="text-xs text-[#756E65] dark:text-[#9E9B96] line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-[#EAE2D5]/80 dark:border-[#2C303B]/80 flex items-center justify-between text-xs text-[#756E65] dark:text-[#9E9B96]">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#B5824C] dark:text-[#DFB267]" />
                  {blog.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#C87D65] dark:text-[#E89D86]" />
                  {blog.reading_time}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Ad Placement */}
      <AdPlaceholder location="in-content" />
    </div>
  );
};
