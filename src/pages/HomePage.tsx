import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext.js';
import { ToolCard } from '../components/common/ToolCard.js';
import { DynamicIcon } from '../components/common/DynamicIcon.js';
import { SEOHead } from '../components/common/SEOHead.js';
import { AdPlaceholder } from '../components/common/AdPlaceholder.js';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Lock,
  ChevronDown,
  BookOpen,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { tools, categories, blogs, faqs, loading } = useData();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const featuredTools = tools.filter((t) => t.is_featured === 1);
  const filteredTools =
    filterCategory === 'all'
      ? tools
      : tools.filter((t) => t.category_slug === filterCategory);

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ToolVerse',
    url: window.location.origin,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${window.location.origin}/tools?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    description: '30+ Free online AI, developer, writing, image, and PDF utilities.'
  };

  return (
    <div className="space-y-16">
      <SEOHead
        title="ToolVerse - 30+ Free Online AI, Developer, Image & PDF Tools"
        description="Instant, secure, client-side and AI-powered web tools for developers, creators, and writers. No registration required."
        schema={websiteSchema}
      />

      {/* Hero Section */}
      <section className="text-center pt-8 pb-4 max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B5824C]/10 dark:bg-[#DFB267]/15 border border-[#B5824C]/25 dark:border-[#DFB267]/30 text-[#B5824C] dark:text-[#DFB267] text-xs font-semibold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Premium Tool Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] tracking-tight leading-tight font-['Outfit',sans-serif]">
          Every tool you need.{' '}
          <span className="bg-gradient-to-r from-[#B5824C] via-[#C87D65] to-[#B5824C] bg-clip-text text-transparent dark:from-[#DFB267] dark:via-[#E89D86] dark:to-[#DFB267]">
            Instant. Free. Fast.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#756E65] dark:text-[#9E9B96] max-w-2xl mx-auto leading-relaxed">
          Access 30+ professional utilities for AI generation, code formatting, image optimization, PDF manipulation, and content analysis. No accounts, no paywalls.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#756E65] dark:text-[#9E9B96] pt-2">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-[#B5824C] dark:text-[#DFB267]" />
            Zero Latency Client Execution
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-[#C87D65] dark:text-[#E89D86]" />
            100% Private & In-Browser
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] shadow-2xs">
            <Cpu className="w-3.5 h-3.5 text-[#B5824C] dark:text-[#DFB267]" />
            Gemini 2.5 AI Powered
          </div>
        </div>
      </section>

      {/* Top Advertisement Placement */}
      <AdPlaceholder location="header" />

      {/* Featured Tools Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[#C87D65]/15 text-[#C87D65] dark:text-[#E89D86] border border-[#C87D65]/20">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">
                Featured Tools
              </h2>
            </div>
            <p className="text-xs text-[#756E65] dark:text-[#9E9B96] mt-0.5">
              Most popular utilities used by developers & creators daily
            </p>
          </div>
          <Link
            to="/tools"
            className="text-xs font-semibold text-[#B5824C] dark:text-[#DFB267] hover:underline flex items-center gap-1"
          >
            View all ({tools.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-40 rounded-2xl bg-[#F4ECE1] dark:bg-[#22252E] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTools.slice(0, 4).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </section>

      {/* Category Pills & Tool Directory */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EAE2D5] dark:border-[#2C303B]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">
              Explore All Utilities
            </h2>
            <p className="text-xs text-[#756E65] dark:text-[#9E9B96]">
              Filtered database results ({filteredTools.length} tools available)
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-[#B5824C] text-white shadow-xs'
                  : 'bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] text-[#756E65] dark:text-[#9E9B96] hover:border-[#B5824C] dark:hover:border-[#DFB267]'
              }`}
            >
              All ({tools.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filterCategory === cat.slug
                    ? 'bg-[#B5824C] text-white shadow-xs'
                    : 'bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] text-[#756E65] dark:text-[#9E9B96] hover:border-[#B5824C] dark:hover:border-[#DFB267]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* In-Content Ad Placement */}
      <AdPlaceholder location="in-content" />

      {/* Categories Overview Bento */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">
            Curated Suites
          </h2>
          <p className="text-xs text-[#756E65] dark:text-[#9E9B96] mt-1">
            Explore dedicated tool suites organized for your specialized workflow
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const count = tools.filter((t) => t.category_id === cat.id).length;
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group p-5 rounded-2xl bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] hover:border-[#B5824C] dark:hover:border-[#DFB267] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#B5824C]/10 dark:bg-[#DFB267]/15 text-[#B5824C] dark:text-[#DFB267] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-[#B5824C]/15 dark:border-[#DFB267]/20">
                    <DynamicIcon name={cat.icon} className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1F1B18] dark:text-[#F7F5F0] group-hover:text-[#B5824C] dark:group-hover:text-[#DFB267] transition-colors font-['Outfit',sans-serif]">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#756E65] dark:text-[#9E9B96] mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EAE2D5]/80 dark:border-[#2C303B]/80 flex items-center justify-between text-xs text-[#B5824C] dark:text-[#DFB267] font-semibold">
                  <span>{count} Tools</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Editorial Blog Articles */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F1B18] dark:text-[#F7F5F0] flex items-center gap-2 font-['Outfit',sans-serif]">
              <BookOpen className="w-5 h-5 text-[#B5824C] dark:text-[#DFB267]" />
              Engineering Guides & Insights
            </h2>
            <p className="text-xs text-[#756E65] dark:text-[#9E9B96] mt-0.5">
              In-depth tutorials, developer workflows, and tool optimization guides
            </p>
          </div>
          <Link
            to="/blog"
            className="text-xs font-semibold text-[#B5824C] dark:text-[#DFB267] hover:underline flex items-center gap-1"
          >
            All Articles ({blogs.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.slice(0, 3).map((blog) => (
            <Link
              key={blog.id}
              to={`/blog/${blog.slug}`}
              className="group bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:border-[#B5824C] dark:hover:border-[#DFB267] transition-all flex flex-col"
            >
              {blog.cover_image && (
                <div className="h-44 overflow-hidden bg-[#F4ECE1] dark:bg-[#22252E]">
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B5824C] dark:text-[#DFB267] px-2 py-0.5 rounded-full bg-[#B5824C]/10 dark:bg-[#DFB267]/15 border border-[#B5824C]/20">
                    Editorial Guide
                  </span>
                  <h3 className="text-base font-bold text-[#1F1B18] dark:text-[#F7F5F0] group-hover:text-[#B5824C] dark:group-hover:text-[#DFB267] transition-colors mt-2 line-clamp-2 font-['Outfit',sans-serif]">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-[#756E65] dark:text-[#9E9B96] line-clamp-2 mt-1">
                    {blog.excerpt}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#EAE2D5]/80 dark:border-[#2C303B]/80 flex items-center justify-between text-xs text-[#756E65] dark:text-[#9E9B96]">
                  <span>{blog.author}</span>
                  <span>{blog.reading_time}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="max-w-3xl mx-auto space-y-6 pt-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[#756E65] dark:text-[#9E9B96]">
            Everything you need to know about ToolVerse, privacy, and security
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-[#1F1B18] dark:text-[#F7F5F0] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#756E65] dark:text-[#9E9B96] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#B5824C] dark:text-[#DFB267]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#756E65] dark:text-[#9E9B96] leading-relaxed border-t border-[#EAE2D5]/80 dark:border-[#2C303B]/80 pt-3 font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
