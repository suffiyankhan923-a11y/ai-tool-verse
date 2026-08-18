import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Search,
  ArrowRight,
  Star,
  Check,
  Copy,
} from 'lucide-react';

// Data & Types
import { TOOLS } from './data/tools';
import { CATEGORIES } from './data/categories';
import { BLOG_POSTS } from './data/blogPosts';

// Layout & Common Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Breadcrumbs } from './components/layout/Breadcrumbs';
import { ToolCard } from './components/common/ToolCard';
import { DynamicIcon } from './components/common/DynamicIcon';
import { SearchModal } from './components/common/SearchModal';
import { AdPlaceholder } from './components/common/AdPlaceholder';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { FAQSection } from './components/common/FAQSection';
import { RelatedTools } from './components/common/RelatedTools';

// Tool Components
import { AgeCalculator } from './components/tools/calculators/AgeCalculator';
import { BmiCalculator } from './components/tools/calculators/BmiCalculator';
import { LoanCalculator } from './components/tools/calculators/LoanCalculator';
import { PercentageCalculator } from './components/tools/calculators/PercentageCalculator';
import {
  TipCalculator,
  DiscountCalculator,
  GstCalculator,
  CompoundInterestCalculator,
  TimeCalculator,
  DateCalculator,
} from './components/tools/calculators/CalculatorsSuite';
import { FinancialCalculatorsSuite } from './components/tools/calculators/FinancialCalculatorsSuite';
import { HealthCalculatorsSuite } from './components/tools/calculators/HealthCalculatorsSuite';
import { ProductivitySuite } from './components/tools/productivity/ProductivitySuite';
import {
  UnitConverter,
  CurrencyConverter,
  TimeZoneConverter,
  CsvJsonConverter,
} from './components/tools/converters/ConvertersSuite';
import {
  JsonFormatter,
  Base64Tool,
  DevUtilities,
} from './components/tools/developer/DevToolsSuite';
import {
  PasswordGenerator,
  QrCodeTool,
  GeneratorsHub,
} from './components/tools/generators/GeneratorsSuite';
import { ImageToolsSuite } from './components/tools/images/ImageToolsSuite';
import { SeoToolsHub } from './components/tools/seo/SeoToolsHub';
import {
  WordCounter,
  CaseConverter,
  TextModifier,
} from './components/tools/text/TextToolsSuite';
import { AdminPanel } from './components/admin/AdminPanel';

export default function App() {
  // Navigation Path State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname && window.location.pathname !== '/'
      ? window.location.pathname
      : '/';
  });

  // Global UI States
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('toolverse_favs');
      return saved ? JSON.parse(saved) : ['age-calculator', 'percentage-calculator', 'bmi-calculator', 'loan-calculator'];
    } catch {
      return ['age-calculator', 'percentage-calculator'];
    }
  });

  // Tools Directory Search & Filter state
  const [toolsSearchQuery, setToolsSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save favorites to local storage
  const handleToggleFavorite = (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const updated = prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId];
      try {
        localStorage.setItem('toolverse_favs', JSON.stringify(updated));
      } catch {
        // local storage error ignore
      }
      return updated;
    });
  };

  // Match Active Tool or Active Category or Active Blog
  const activeToolSlug = currentPath.startsWith('/tools/') ? currentPath.replace('/tools/', '') : null;
  const activeCategorySlug = currentPath.startsWith('/categories/') ? currentPath.replace('/categories/', '') : null;
  const activeBlogSlug = currentPath.startsWith('/blog/') ? currentPath.replace('/blog/', '') : null;

  const currentTool = useMemo(() => {
    if (!activeToolSlug) return null;
    return TOOLS.find((t) => t.slug === activeToolSlug) || null;
  }, [activeToolSlug]);

  const currentCategory = useMemo(() => {
    if (!activeCategorySlug) return null;
    return CATEGORIES.find((c) => c.slug === activeCategorySlug) || null;
  }, [activeCategorySlug]);

  const currentBlogPost = useMemo(() => {
    if (!activeBlogSlug) return null;
    return BLOG_POSTS.find((b) => b.slug === activeBlogSlug) || null;
  }, [activeBlogSlug]);

  // Render Tool Engine
  const renderToolComponent = (slug: string) => {
    switch (slug) {
      // CALCULATORS
      case 'age-calculator':
        return <AgeCalculator />;
      case 'bmi-calculator':
        return <BmiCalculator />;
      case 'loan-calculator':
      case 'mortgage-calculator':
        return <LoanCalculator />;
      case 'percentage-calculator':
        return <PercentageCalculator />;
      case 'tip-calculator':
        return <TipCalculator />;
      case 'discount-calculator':
        return <DiscountCalculator />;
      case 'gst-calculator':
      case 'vat-calculator':
        return <GstCalculator />;
      case 'salary-calculator':
      case 'compound-interest-calculator':
        return <CompoundInterestCalculator />;
      case 'time-calculator':
        return <TimeCalculator />;
      case 'date-calculator':
        return <DateCalculator />;

      // FINANCIAL CALCULATORS
      case 'simple-interest-calculator':
        return <FinancialCalculatorsSuite toolType="simple-interest" />;
      case 'mortgage-calculator':
        return <FinancialCalculatorsSuite toolType="mortgage" />;
      case 'investment-growth-calculator':
        return <FinancialCalculatorsSuite toolType="investment" />;
      case 'profit-margin-calculator':
        return <FinancialCalculatorsSuite toolType="profit-margin" />;
      case 'roi-calculator':
        return <FinancialCalculatorsSuite toolType="roi" />;
      case 'sales-tax-calculator':
        return <FinancialCalculatorsSuite toolType="tax" />;
      case 'salary-paycheck-calculator':
        return <FinancialCalculatorsSuite toolType="salary" />;
      case 'meeting-cost-calculator':
        return <FinancialCalculatorsSuite toolType="meeting" />;

      // HEALTH CALCULATORS
      case 'bmr-calculator':
        return <HealthCalculatorsSuite toolType="bmr" />;
      case 'tdee-calculator':
        return <HealthCalculatorsSuite toolType="tdee" />;
      case 'calorie-deficit-calculator':
        return <HealthCalculatorsSuite toolType="calorie" />;
      case 'ideal-weight-calculator':
        return <HealthCalculatorsSuite toolType="ideal-weight" />;
      case 'body-fat-percentage-calculator':
      case 'body-fat-calculator':
        return <HealthCalculatorsSuite toolType="body-fat" />;
      case 'daily-water-intake-calculator':
      case 'water-intake-calculator':
        return <HealthCalculatorsSuite toolType="water" />;
      case 'running-pace-calculator':
      case 'pace-calculator':
        return <HealthCalculatorsSuite toolType="pace" />;

      // PRODUCTIVITY SUITE
      case 'pomodoro-timer':
        return <ProductivitySuite toolType="pomodoro" />;
      case 'countdown-timer':
        return <ProductivitySuite toolType="countdown" />;
      case 'stopwatch':
        return <ProductivitySuite toolType="stopwatch" />;
      case 'habit-tracker':
        return <ProductivitySuite toolType="habits" />;
      case 'decision-maker':
        return <ProductivitySuite toolType="decision" />;
      case 'todo-list':
        return <ProductivitySuite toolType="todo" />;
      case 'quick-notes':
        return <ProductivitySuite toolType="notes" />;

      // CONVERTERS
      case 'unit-converter':
      case 'length-converter':
        return <UnitConverter initialCategory="length" />;
      case 'weight-converter':
        return <UnitConverter initialCategory="weight" />;
      case 'temperature-converter':
        return <UnitConverter initialCategory="temperature" />;
      case 'area-converter':
        return <UnitConverter initialCategory="area" />;
      case 'volume-converter':
        return <UnitConverter initialCategory="volume" />;
      case 'speed-converter':
        return <UnitConverter initialCategory="speed" />;
      case 'data-converter':
        return <UnitConverter initialCategory="data" />;
      case 'time-converter-tool':
        return <UnitConverter initialCategory="time" />;
      case 'currency-converter':
        return <CurrencyConverter />;
      case 'timezone-converter':
        return <TimeZoneConverter />;
      case 'csv-json-converter':
        return <CsvJsonConverter />;

      // DEVELOPER TOOLS
      case 'json-formatter':
      case 'json-validator':
        return <JsonFormatter />;
      case 'base64-encoder-decoder':
      case 'base64-converter':
        return <Base64Tool />;
      case 'url-encoder-decoder':
        return <DevUtilities toolType="url" />;
      case 'html-minifier':
      case 'html-entities-encoder':
        return <DevUtilities toolType="html" />;
      case 'hash-generator':
        return <DevUtilities toolType="hash" />;
      case 'uuid-generator':
        return <DevUtilities toolType="uuid" />;

      // GENERATORS
      case 'password-generator':
        return <PasswordGenerator />;
      case 'qr-code-generator':
        return <QrCodeTool />;
      case 'random-number-generator':
        return <GeneratorsHub toolType="number" />;
      case 'random-name-generator':
        return <GeneratorsHub toolType="name" />;
      case 'color-palette-generator':
        return <GeneratorsHub toolType="palette" />;
      case 'gradient-generator':
        return <GeneratorsHub toolType="gradient" />;
      case 'lorem-ipsum-generator':
        return <TextModifier toolType="lorem" />;
      case 'slug-generator':
        return <TextModifier toolType="slug" />;

      // IMAGE TOOLS
      case 'image-compressor':
        return <ImageToolsSuite toolType="compress" />;
      case 'image-resizer':
        return <ImageToolsSuite toolType="resize" />;
      case 'image-converter':
        return <ImageToolsSuite toolType="convert" />;
      case 'image-to-base64':
        return <ImageToolsSuite toolType="base64" />;

      // TEXT TOOLS
      case 'word-counter':
        return <WordCounter />;
      case 'case-converter':
        return <CaseConverter />;
      case 'duplicate-line-remover':
      case 'text-cleaner':
        return <TextModifier toolType="duplicates" />;
      case 'list-sorter':
        return <TextModifier toolType="sort" />;
      case 'reverse-text':
        return <TextModifier toolType="reverse" />;
      case 'whitespace-remover':
        return <TextModifier toolType="spaces" />;

      // SEO TOOLS
      case 'meta-tag-generator':
        return <SeoToolsHub toolType="meta" />;
      case 'robots-txt-generator':
        return <SeoToolsHub toolType="robots" />;
      case 'sitemap-generator':
        return <SeoToolsHub toolType="sitemap" />;
      case 'open-graph-generator':
        return <SeoToolsHub toolType="og" />;
      case 'schema-markup-generator':
        return <SeoToolsHub toolType="schema" />;
      case 'serp-preview-tool':
        return <SeoToolsHub toolType="serp" />;

      // Fallback
      default:
        return (
          <div className="p-8 text-center bg-[#0F172A] rounded-2xl border border-[#D4AF37]/20">
            <h3 className="text-lg font-serif text-white mb-2">Live Tool Interactive Engine</h3>
            <p className="text-xs text-[#94A3B8] mb-4">
              Running calibrated calculation suite for &ldquo;{slug}&rdquo;.
            </p>
            <UnitConverter initialCategory="length" />
          </div>
        );
    }
  };

  // Determine Disclaimer Type
  const getDisclaimerType = (category: string) => {
    if (category === 'finance' || category === 'calculators') return 'financial';
    if (category === 'health') return 'health';
    return 'general';
  };

  // Filtered tools list for All Tools page
  const filteredTools = useMemo(() => {
    return TOOLS.filter((t) => {
      const matchCat = selectedCategoryFilter === 'all' || t.category === selectedCategoryFilter;
      const matchQuery =
        !toolsSearchQuery ||
        t.name.toLowerCase().includes(toolsSearchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(toolsSearchQuery.toLowerCase()) ||
        t.keywords.some((k) => k.toLowerCase().includes(toolsSearchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [toolsSearchQuery, selectedCategoryFilter]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#050810] text-[#E2E8F0] selection:bg-[#D4AF37]/30 selection:text-white overflow-x-hidden overflow-y-auto">
      {/* Global Header */}
      <Header
        currentPath={currentPath}
        onNavigate={navigateTo}
        onOpenSearch={() => setSearchModalOpen(true)}
        darkMode={true}
        onToggleDarkMode={() => {}}
      />

      {/* Main App Content View Switcher */}
      <main className="flex-1">
        {/* ================= VIEW 1: HOME PAGE ================= */}
        {currentPath === '/' && (
          <div>
            {/* HERO SECTION */}
            <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#D4AF37]/15 overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />

              <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
                {/* Gold Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#0A0F1E] shadow-lg shadow-black/60">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                    Free Tools for Everyday Life
                  </span>
                </div>

                {/* Hero Title */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]">
                  Precision Online Tools for{' '}
                  <span className="italic text-[#D4AF37]">Everyday Life</span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base md:text-lg text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
                  Access 70+ free, instant calculators, unit converters, developer formatters, and text utilities. 100% private and client-side with zero sign-up required.
                </p>

                {/* Main Hero Search Box */}
                <div className="pt-2 max-w-2xl mx-auto">
                  <div
                    onClick={() => setSearchModalOpen(true)}
                    className="group relative flex items-center w-full bg-[#161E31] border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-xl px-5 py-4 cursor-pointer shadow-2xl shadow-black/80 transition-all duration-200"
                  >
                    <Search className="w-5 h-5 text-[#D4AF37] shrink-0 mr-3.5" />
                    <span className="text-sm md:text-base text-[#64748B] group-hover:text-[#94A3B8] flex-1 text-left">
                      Search any tool (e.g. Age Calculator, JSON Formatter, BMI, Loan)...
                    </span>
                    <kbd className="hidden sm:inline-flex items-center text-xs font-mono px-2 py-1 rounded bg-[#0A0F1E] border border-[#D4AF37]/20 text-[#D4AF37]">
                      ⌘K
                    </kbd>
                  </div>
                </div>

                {/* Quick Category Chips */}
                <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                  <span className="text-[#64748B] text-xs font-semibold mr-1">Popular:</span>
                  {[
                    { label: 'Age Calculator', slug: 'age-calculator' },
                    { label: 'Percentage', slug: 'percentage-calculator' },
                    { label: 'BMI Calculator', slug: 'bmi-calculator' },
                    { label: 'Loan Calculator', slug: 'loan-calculator' },
                    { label: 'JSON Formatter', slug: 'json-formatter' },
                    { label: 'Unit Converter', slug: 'unit-converter' },
                    { label: 'QR Generator', slug: 'qr-code-generator' },
                  ].map((chip) => (
                    <button
                      key={chip.slug}
                      type="button"
                      onClick={() => navigateTo(`/tools/${chip.slug}`)}
                      className="px-3 py-1 rounded-full bg-[#0F172A] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:text-[#D4AF37] text-xs text-[#94A3B8] transition-colors"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* TOP LEADERBOARD AD */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AdPlaceholder slotId="home-leaderboard-top" position="banner" />
            </div>

            {/* FEATURED / MOST POPULAR TOOLS SECTION */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                      Curated Utilities
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
                    Most Popular <span className="text-[#D4AF37] italic">Tools</span>
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => navigateTo('/tools')}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-[#D4AF37] hover:text-white transition-colors"
                >
                  <span>Explore All 70+ Tools</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of featured tools */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {TOOLS.filter((t) => t.featured || t.popular)
                  .slice(0, 8)
                  .map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onSelect={(slug) => navigateTo(`/tools/${slug}`)}
                      isFavorite={favorites.includes(tool.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
              </div>
            </section>

            {/* CATEGORIES BROWSE GRID */}
            <section className="py-12 bg-[#0A0F1E] border-y border-[#D4AF37]/15">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
                    Organized Directory
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
                    Explore by <span className="text-[#D4AF37] italic">Category</span>
                  </h2>
                  <p className="text-xs md:text-sm text-[#94A3B8] mt-2">
                    Easily find the exact calculator, converter, or formatting suite built for your specific workflow.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {CATEGORIES.map((cat) => {
                    const count = TOOLS.filter((t) => t.category === cat.id).length;
                    return (
                      <div
                        key={cat.id}
                        id={`category-card-${cat.slug}`}
                        onClick={() => navigateTo(`/categories/${cat.slug}`)}
                        className="group p-5 rounded-xl bg-[#0F172A] border border-[#D4AF37]/15 hover:border-[#D4AF37] transition-all duration-200 cursor-pointer shadow-lg shadow-black/50 hover:-translate-y-1"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-3 group-hover:bg-[#D4AF37] group-hover:text-[#050810] transition-colors">
                          <DynamicIcon name={cat.iconName} className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-1">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mb-3">
                          {cat.description}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/10 text-[11px] font-mono text-[#D4AF37]">
                          <span>{count} Available Tools</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* MID-PAGE AD */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AdPlaceholder slotId="home-mid-banner" position="banner" />
            </div>

            {/* LATEST BLOG POSTS & GUIDES */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
                    Knowledge Base
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
                    Guides & <span className="text-[#D4AF37] italic">Articles</span>
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => navigateTo('/blog')}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-[#D4AF37] hover:text-white transition-colors"
                >
                  <span>View All Guides</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BLOG_POSTS.slice(0, 3).map((post) => (
                  <article
                    key={post.id}
                    id={`blog-card-${post.slug}`}
                    onClick={() => navigateTo(`/blog/${post.slug}`)}
                    className="p-5 rounded-xl bg-[#0F172A] border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 cursor-pointer shadow-lg shadow-black/50 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#D4AF37] mb-3">
                        <span className="uppercase tracking-widest px-2 py-0.5 rounded bg-[#161E31] border border-[#D4AF37]/20">
                          {post.category}
                        </span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="text-base font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#D4AF37]/10 flex items-center justify-between text-xs text-[#94A3B8]">
                      <span>{post.author.name}</span>
                      <span className="text-[#D4AF37] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ================= VIEW 2: ALL TOOLS DIRECTORY ================= */}
        {currentPath === '/tools' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <Breadcrumbs
              items={[{ name: 'All Tools Directory', url: '/tools' }]}
              onNavigate={navigateTo}
            />

            {/* Header */}
            <div className="my-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
                Complete Index
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
                All Online <span className="text-[#D4AF37] italic">Tools</span>
              </h1>
              <p className="text-xs md:text-sm text-[#94A3B8] mt-1 max-w-2xl">
                Browse our complete suite of {TOOLS.length} free, client-side everyday tools and calculators.
              </p>
            </div>

            {/* Search and Category Filter Bar */}
            <div className="my-6 p-4 rounded-xl bg-[#0F172A] border border-[#D4AF37]/20 flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search input */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by keyword or tool name..."
                  value={toolsSearchQuery}
                  onChange={(e) => setToolsSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#161E31] border border-[#D4AF37]/20 focus:border-[#D4AF37] text-white text-xs placeholder-[#475569] focus:outline-none"
                />
              </div>

              {/* Category Pills Slider */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-[#D4AF37] text-[#050810]'
                      : 'bg-[#161E31] text-[#94A3B8] hover:text-[#D4AF37]'
                  }`}
                >
                  All ({TOOLS.length})
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat.id)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 ${
                      selectedCategoryFilter === cat.id
                        ? 'bg-[#D4AF37] text-[#050810]'
                        : 'bg-[#161E31] text-[#94A3B8] hover:text-[#D4AF37]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 my-8">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onSelect={(slug) => navigateTo(`/tools/${slug}`)}
                  isFavorite={favorites.includes(tool.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="p-12 text-center bg-[#0F172A] rounded-xl border border-[#D4AF37]/20 my-8">
                <p className="text-base text-[#E2E8F0] font-semibold">No tools found matching your criteria</p>
                <p className="text-xs text-[#64748B] mt-1">Try clearing your filters or searching for different keywords.</p>
                <button
                  type="button"
                  onClick={() => {
                    setToolsSearchQuery('');
                    setSelectedCategoryFilter('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-lg bg-[#D4AF37] text-[#050810] text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            )}

            <AdPlaceholder slotId="tools-directory-bottom" position="banner" />
          </div>
        )}

        {/* ================= VIEW 3: SINGLE TOOL PAGE ================= */}
        {currentPath.startsWith('/tools/') && currentTool && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
            {/* Breadcrumbs */}
            <Breadcrumbs
              items={[
                { name: 'Tools', url: '/tools' },
                {
                  name: CATEGORIES.find((c) => c.id === currentTool.category)?.name || currentTool.category,
                  url: `/categories/${CATEGORIES.find((c) => c.id === currentTool.category)?.slug || currentTool.category}`,
                },
                { name: currentTool.name, url: `/tools/${currentTool.slug}` },
              ]}
              onNavigate={navigateTo}
            />

            {/* Tool Header */}
            <div className="my-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#161E31] text-[#D4AF37] border border-[#D4AF37]/20">
                    {CATEGORIES.find((c) => c.id === currentTool.category)?.name || currentTool.category}
                  </span>
                  <span className="text-[10px] font-mono text-[#64748B]">100% Client-Side Privacy</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                  {currentTool.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
                  {currentTool.longDescription || currentTool.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  id="tool-fav-toggle"
                  onClick={(e) => handleToggleFavorite(currentTool.id, e)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    favorites.includes(currentTool.id)
                      ? 'bg-[#161E31] text-[#D4AF37] border-[#D4AF37]/40'
                      : 'bg-[#0F172A] text-[#94A3B8] border-[#D4AF37]/20 hover:text-[#D4AF37]'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${favorites.includes(currentTool.id) ? 'fill-[#D4AF37]' : ''}`} />
                  <span>{favorites.includes(currentTool.id) ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  type="button"
                  id="tool-share-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0F172A] border border-[#D4AF37]/20 text-[#94A3B8] hover:text-white transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* TOP AD */}
            <AdPlaceholder slotId={`tool-top-${currentTool.slug}`} position="banner" />

            {/* INTERACTIVE TOOL COMPONENT CONTAINER */}
            <div
              id="active-tool-workspace"
              className="my-8 p-6 sm:p-8 rounded-2xl bg-[#0A0F1E] border border-[#D4AF37]/25 shadow-2xl shadow-black/80"
            >
              {renderToolComponent(currentTool.slug)}
            </div>

            {/* DISCLAIMER BANNER IF APPLICABLE */}
            <DisclaimerBanner type={getDisclaimerType(currentTool.category)} />

            {/* HOW TO USE GUIDE & HOW IT WORKS */}
            <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* How To Steps */}
              {currentTool.howToSteps && currentTool.howToSteps.length > 0 && (
                <div className="p-6 rounded-xl bg-[#0F172A] border border-[#D4AF37]/15 shadow-md">
                  <h3 className="text-base font-serif font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center text-xs font-mono">1</span>
                    <span>How to Use the {currentTool.name}</span>
                  </h3>
                  <ol className="space-y-3 text-xs md:text-sm text-[#94A3B8]">
                    {currentTool.howToSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-[#D4AF37] font-bold text-xs mt-0.5">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* How It Works Engine */}
              {currentTool.howItWorks && (
                <div className="p-6 rounded-xl bg-[#0F172A] border border-[#D4AF37]/15 shadow-md">
                  <h3 className="text-base font-serif font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center text-xs font-mono">⚙</span>
                    <span>Behind the Calculations</span>
                  </h3>
                  <p className="text-xs md:text-sm text-[#94A3B8] leading-relaxed">
                    {currentTool.howItWorks}
                  </p>
                </div>
              )}
            </div>

            {/* EXAMPLE SCENARIO */}
            {currentTool.exampleScenario && (
              <div className="my-6 p-6 rounded-xl bg-[#0F172A] border border-[#D4AF37]/15 shadow-md">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
                  Real-World Example: {currentTool.exampleScenario.title}
                </h3>
                <p className="text-xs text-[#94A3B8] mb-4">
                  {currentTool.exampleScenario.description}
                </p>
                <div className="p-4 rounded-lg bg-[#050810] border border-[#D4AF37]/20 text-xs font-mono text-[#E2E8F0] space-y-1">
                  <div className="text-[#64748B]">Inputs: {JSON.stringify(currentTool.exampleScenario.inputs)}</div>
                  <div className="text-[#D4AF37] font-bold">Result: {currentTool.exampleScenario.result}</div>
                </div>
              </div>
            )}

            {/* MID TOOL AD */}
            <AdPlaceholder slotId={`tool-mid-${currentTool.slug}`} position="banner" />

            {/* TOOL FAQS */}
            {currentTool.faqs && currentTool.faqs.length > 0 && (
              <FAQSection faqs={currentTool.faqs} title={`${currentTool.name} Frequently Asked Questions`} />
            )}

            {/* RELATED TOOLS */}
            <RelatedTools
              currentTool={currentTool}
              allTools={TOOLS}
              onSelectTool={(slug) => navigateTo(`/tools/${slug}`)}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        )}

        {/* ================= VIEW 4: CATEGORIES DIRECTORY ================= */}
        {currentPath === '/categories' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <Breadcrumbs items={[{ name: 'Categories', url: '/categories' }]} onNavigate={navigateTo} />

            <div className="my-6 text-center max-w-3xl mx-auto">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
                Complete Classification
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
                Tool <span className="text-[#D4AF37] italic">Categories</span>
              </h1>
              <p className="text-xs md:text-sm text-[#94A3B8] mt-2">
                Browse our collection of precision-engineered web tools organized by discipline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
              {CATEGORIES.map((cat) => {
                const toolsInCat = TOOLS.filter((t) => t.category === cat.id);
                return (
                  <div
                    key={cat.id}
                    id={`cat-page-card-${cat.slug}`}
                    onClick={() => navigateTo(`/categories/${cat.slug}`)}
                    className="p-6 rounded-xl bg-[#0F172A] border border-[#D4AF37]/15 hover:border-[#D4AF37] transition-all cursor-pointer shadow-lg shadow-black/50 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-4 group-hover:bg-[#D4AF37] group-hover:text-[#050810] transition-colors">
                      <DynamicIcon name={cat.iconName} className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                      {cat.name}
                    </h2>
                    <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                      {cat.description}
                    </p>
                    <div className="pt-3 border-t border-[#D4AF37]/10 flex items-center justify-between text-xs font-mono text-[#D4AF37]">
                      <span>{toolsInCat.length} Tools Available</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= VIEW 5: SINGLE CATEGORY PAGE ================= */}
        {currentPath.startsWith('/categories/') && currentCategory && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <Breadcrumbs
              items={[
                { name: 'Categories', url: '/categories' },
                { name: currentCategory.name, url: `/categories/${currentCategory.slug}` },
              ]}
              onNavigate={navigateTo}
            />

            <div className="my-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
                Category Archive
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
                {currentCategory.name} <span className="text-[#D4AF37] italic">Tools</span>
              </h1>
              <p className="text-xs md:text-sm text-[#94A3B8] mt-1 max-w-2xl">
                {currentCategory.description}
              </p>
            </div>

            <AdPlaceholder slotId={`cat-top-${currentCategory.slug}`} position="banner" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 my-8">
              {TOOLS.filter((t) => t.category === currentCategory.id).map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onSelect={(slug) => navigateTo(`/tools/${slug}`)}
                  isFavorite={favorites.includes(tool.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </div>
        )}

        {/* ================= VIEW 6: BLOG ARCHIVE ================= */}
        {currentPath === '/blog' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <Breadcrumbs items={[{ name: 'Guides & Blog', url: '/blog' }]} onNavigate={navigateTo} />

            <div className="my-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
                Knowledge & Tutorials
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
                Guides & <span className="text-[#D4AF37] italic">Articles</span>
              </h1>
              <p className="text-xs md:text-sm text-[#94A3B8] mt-1 max-w-2xl">
                Expert insights into computational mathematics, date arithmetic, image optimization, developer tools, and everyday productivity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              {BLOG_POSTS.map((post) => (
                <article
                  key={post.id}
                  id={`blog-page-card-${post.slug}`}
                  onClick={() => navigateTo(`/blog/${post.slug}`)}
                  className="p-6 rounded-xl bg-[#0F172A] border border-[#D4AF37]/15 hover:border-[#D4AF37] transition-all cursor-pointer shadow-lg shadow-black/50 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#D4AF37] mb-3">
                      <span className="uppercase tracking-widest px-2 py-0.5 rounded bg-[#161E31] border border-[#D4AF37]/20">
                        {post.category}
                      </span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="text-lg font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#D4AF37]/10 flex items-center justify-between text-xs text-[#94A3B8]">
                    <span>{post.author.name}</span>
                    <span className="text-[#D4AF37] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Read Guide <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ================= VIEW 7: SINGLE BLOG ARTICLE ================= */}
        {currentPath.startsWith('/blog/') && currentBlogPost && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <Breadcrumbs
              items={[
                { name: 'Blog', url: '/blog' },
                { name: currentBlogPost.title, url: `/blog/${currentBlogPost.slug}` },
              ]}
              onNavigate={navigateTo}
            />

            <article className="my-6 space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#161E31] text-[#D4AF37] border border-[#D4AF37]/20">
                  {currentBlogPost.category}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                  {currentBlogPost.title}
                </h1>
                <div className="flex items-center gap-4 text-xs text-[#64748B] pt-2 border-b border-[#D4AF37]/15 pb-4">
                  <span>By {currentBlogPost.author.name} ({currentBlogPost.author.role})</span>
                  <span>•</span>
                  <span>{currentBlogPost.publishedDate}</span>
                  <span>•</span>
                  <span className="text-[#D4AF37] font-mono">{currentBlogPost.readTime}</span>
                </div>
              </div>

              <AdPlaceholder slotId={`blog-top-${currentBlogPost.slug}`} position="banner" />

              {/* Body Content */}
              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#94A3B8] leading-relaxed space-y-4 font-normal">
                {currentBlogPost.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-xl md:text-2xl font-serif font-bold text-white pt-4 pb-1 border-b border-[#D4AF37]/15">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-base md:text-lg font-serif font-bold text-[#E2E8F0] pt-2">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  return <p key={index}>{paragraph}</p>;
                })}
              </div>

              {/* Related Tools Box */}
              {currentBlogPost.relatedToolSlugs && currentBlogPost.relatedToolSlugs.length > 0 && (
                <div className="my-8 p-6 rounded-xl bg-[#0F172A] border border-[#D4AF37]/20">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] mb-3">
                    Tools Mentioned in This Guide
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentBlogPost.relatedToolSlugs.map((slug) => {
                      const t = TOOLS.find((tool) => tool.slug === slug);
                      if (!t) return null;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => navigateTo(`/tools/${t.slug}`)}
                          className="p-3 rounded-lg bg-[#050810] border border-[#D4AF37]/20 hover:border-[#D4AF37] text-left text-xs text-[#E2E8F0] flex items-center justify-between"
                        >
                          <span className="font-semibold">{t.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          </div>
        )}

        {/* ================= VIEW 8: ABOUT & TRUST PAGES ================= */}
        {currentPath === '/about' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <Breadcrumbs items={[{ name: 'About', url: '/about' }]} onNavigate={navigateTo} />
            <div className="my-6 space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                Brand Mission
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
                About <span className="text-[#D4AF37] italic">ToolVerse</span>
              </h1>
              <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4 text-xs md:text-sm text-[#94A3B8] leading-relaxed">
                <p>
                  <strong>ToolVerse</strong> is a modern, privacy-focused online utility platform founded on a single core principle:{' '}
                  <span className="text-white font-semibold">&ldquo;Free Tools for Everyday Life without accounts, paywalls, or privacy tracking.&rdquo;</span>
                </p>
                <p>
                  Every calculator, image compressor, unit converter, and text formatter on ToolVerse executes 100% locally in your web browser using modern WebAssembly and JavaScript APIs. Zero personal inputs or files are uploaded to third-party servers.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#D4AF37]/15 text-center">
                  <div className="p-3 bg-[#050810] rounded-lg border border-[#D4AF37]/15">
                    <span className="text-xl font-serif font-bold text-[#D4AF37]">70+</span>
                    <span className="block text-[11px] text-[#64748B] mt-0.5">Active Utilities</span>
                  </div>
                  <div className="p-3 bg-[#050810] rounded-lg border border-[#D4AF37]/15">
                    <span className="text-xl font-serif font-bold text-[#D4AF37]">0ms</span>
                    <span className="block text-[11px] text-[#64748B] mt-0.5">Server Latency</span>
                  </div>
                  <div className="p-3 bg-[#050810] rounded-lg border border-[#D4AF37]/15">
                    <span className="text-xl font-serif font-bold text-[#D4AF37]">100%</span>
                    <span className="block text-[11px] text-[#64748B] mt-0.5">Free Forever</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 9: CONTACT PAGE ================= */}
        {currentPath === '/contact' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <Breadcrumbs items={[{ name: 'Contact', url: '/contact' }]} onNavigate={navigateTo} />
            <div className="my-6 space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                Support & Feedback
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
                Contact <span className="text-[#D4AF37] italic">ToolVerse Team</span>
              </h1>
              <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4 text-xs md:text-sm text-[#94A3B8]">
                <p>Have a tool suggestion, formula adjustment, or partnership inquiry? We would love to hear from you.</p>
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-[#E2E8F0] block mb-1">Your Email</label>
                    <input type="email" placeholder="name@example.com" className="w-full p-2.5 rounded-lg bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#E2E8F0] block mb-1">Message or Tool Request</label>
                    <textarea rows={4} placeholder="Describe the feature or question..." className="w-full p-2.5 rounded-lg bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs"></textarea>
                  </div>
                  <button type="button" className="px-5 py-2 rounded-lg bg-[#D4AF37] text-[#050810] font-bold text-xs hover:bg-[#c59b27] transition-colors">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 10: PRIVACY POLICY & TERMS & DISCLAIMER ================= */}
        {(currentPath === '/privacy-policy' || currentPath === '/terms' || currentPath === '/disclaimer') && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <Breadcrumbs
              items={[{ name: currentPath.replace('/', '').replace('-', ' ').toUpperCase(), url: currentPath }]}
              onNavigate={navigateTo}
            />
            <div className="my-6 space-y-6">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white capitalize">
                {currentPath.replace('/', '').replace('-', ' ')}
              </h1>
              <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 text-xs md:text-sm text-[#94A3B8] leading-relaxed space-y-4">
                <p>
                  <strong>Last Updated: August 2026</strong>
                </p>
                <p>
                  ToolVerse operates under a strict privacy-first architecture. We do not require account registration, do not collect personal identities, and all processing is executed in the client browser.
                </p>
                <p>
                  Cookies and web beacons may be used solely for standard web analytics and non-personalized Google AdSense monetization in compliance with applicable laws (GDPR, CCPA).
                </p>
                <p>
                  Calculators and converters are provided for educational and everyday convenience &ldquo;as is&rdquo; without warranties of any kind.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 11: ADMIN PANEL & SUPABASE SQL HUB ================= */}
        {currentPath === '/admin' && (
          <AdminPanel onNavigate={navigateTo} />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Global Search Modal Triggered by ⌘K or Header */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        tools={TOOLS}
        onSelectTool={(slug) => navigateTo(`/tools/${slug}`)}
      />
    </div>
  );
}
