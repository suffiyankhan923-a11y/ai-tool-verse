import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext.js';
import { useFavorites } from '../context/FavoritesContext.js';
import { ToolRenderer } from '../components/tools/ToolRenderer.js';
import { ToolCard } from '../components/common/ToolCard.js';
import { DynamicIcon } from '../components/common/DynamicIcon.js';
import { SEOHead } from '../components/common/SEOHead.js';
import { AdPlaceholder } from '../components/common/AdPlaceholder.js';
import {
  Bookmark,
  Sparkles,
  ArrowLeft,
  Activity,
  CheckCircle2,
  ChevronDown,
  Share2,
  Check,
  Zap,
  ShieldCheck,
  HelpCircle,
  Layers
} from 'lucide-react';

export const ToolDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getToolBySlug, tools, recordToolUsage, loading } = useData();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const tool = slug ? getToolBySlug(slug) : undefined;
  const isFav = slug ? isFavorite(slug) : false;

  // Record usage when page opens
  useEffect(() => {
    if (slug) {
      recordToolUsage(slug);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 text-center text-[#756E65] dark:text-[#9E9B96]">
        <div className="w-8 h-8 border-2 border-[#B5824C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading utility workspace...
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">Tool Not Found</h2>
        <p className="text-xs text-[#756E65] dark:text-[#9E9B96]">
          The utility "{slug}" does not exist or may have been updated in the database.
        </p>
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] text-white text-xs font-semibold shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse All Available Tools
        </Link>
      </div>
    );
  }

  // Parse structured data from tool record
  let howToSteps: string[] = [];
  let featuresList: string[] = [];
  try {
    howToSteps = JSON.parse(tool.how_to_use || '[]');
  } catch {
    howToSteps = [
      'Enter or upload your target content into the workspace editor.',
      'Adjust optional configuration sliders and formatting flags to fit your requirements.',
      'Click execute to process your request in real-time.',
      'Copy the output to clipboard or export the sanitized result file.'
    ];
  }

  try {
    featuresList = JSON.parse(tool.features || '[]');
  } catch {
    featuresList = [
      '100% Client-Side Privacy: Your raw data never leaves your browser sandbox.',
      'Zero Latency Processing: Instant computation powered by modern web engines.',
      'Cross-Platform Export: Copy directly or download standardized formats.'
    ];
  }

  // Related tools from same category or random
  const relatedTools = tools
    .filter((t) => t.id !== tool.id && (t.category_id === tool.category_id || t.is_featured === 1))
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    operatingSystem: 'All',
    applicationCategory: 'UtilitiesApplication',
    description: tool.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };

  return (
    <div className="space-y-10">
      <SEOHead
        title={`${tool.name} - Free Online Tool`}
        description={tool.description}
        type="softwareApplication"
        schema={schema}
      />

      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-[#756E65] dark:text-[#9E9B96]">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-[#B5824C] dark:hover:text-[#DFB267]">Home</Link>
          <span>/</span>
          <Link to="/tools" className="hover:text-[#B5824C] dark:hover:text-[#DFB267]">Tools</Link>
          <span>/</span>
          <span className="font-semibold text-[#1F1B18] dark:text-[#F7F5F0]">{tool.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(tool.slug)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              isFav
                ? 'bg-[#C87D65]/15 border-[#C87D65] text-[#C87D65] dark:text-[#E89D86]'
                : 'border-[#EAE2D5] dark:border-[#2C303B] bg-white dark:bg-[#181A20] text-[#756E65] dark:text-[#9E9B96] hover:border-[#B5824C]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-[#C87D65] dark:fill-[#E89D86]' : ''}`} />
            {isFav ? 'Saved in Favorites' : 'Save Tool'}
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-white dark:bg-[#181A20] text-xs font-semibold text-[#756E65] dark:text-[#9E9B96] hover:bg-[#F4ECE1] dark:hover:bg-[#22252E] transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            {copiedLink ? 'Link Copied!' : 'Share'}
          </button>
        </div>
      </div>

      {/* Tool Header */}
      <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE2D5]/80 dark:border-[#2C303B]/80">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#B5824C]/10 dark:bg-[#DFB267]/15 text-[#B5824C] dark:text-[#DFB267] flex items-center justify-center shrink-0 shadow-2xs border border-[#B5824C]/15 dark:border-[#DFB267]/20">
              <DynamicIcon name={tool.icon || 'Wrench'} className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] tracking-tight font-['Outfit',sans-serif]">
                  {tool.name}
                </h1>
                {tool.is_featured === 1 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C87D65]/15 text-[#C87D65] dark:text-[#E89D86] text-[10px] font-bold uppercase tracking-wider border border-[#C87D65]/20">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#756E65] dark:text-[#9E9B96] mt-1 max-w-2xl leading-relaxed">
                {tool.description}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto text-xs text-[#756E65] dark:text-[#9E9B96] gap-1 shrink-0 pt-2 sm:pt-0">
            <span className="flex items-center gap-1 font-semibold text-[#1F1B18] dark:text-[#F7F5F0]">
              <Activity className="w-3.5 h-3.5 text-[#B5824C] dark:text-[#DFB267]" />
              {tool.usage_count.toLocaleString()} executions
            </span>
            <span>100% In-Browser Privacy</span>
          </div>
        </div>

        {/* Interactive Tool Component Area */}
        <div className="pt-6">
          <ToolRenderer tool={tool} onUse={() => recordToolUsage(tool.slug)} />
        </div>
      </div>

      {/* In-Content Native Ad Placement */}
      <AdPlaceholder location="in-content" />

      {/* How to Use & Features Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* How to Use */}
        <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#1F1B18] dark:text-[#F7F5F0] flex items-center gap-2 font-['Outfit',sans-serif]">
            <Zap className="w-5 h-5 text-[#B5824C] dark:text-[#DFB267]" />
            How to Use {tool.name}
          </h2>
          <ol className="space-y-3 text-xs sm:text-sm text-[#756E65] dark:text-[#9E9B96]">
            {howToSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#B5824C]/15 text-[#B5824C] dark:text-[#DFB267] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#B5824C]/20">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Key Features */}
        <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#1F1B18] dark:text-[#F7F5F0] flex items-center gap-2 font-['Outfit',sans-serif]">
            <ShieldCheck className="w-5 h-5 text-[#C87D65] dark:text-[#E89D86]" />
            Key Features & Benefits
          </h2>
          <ul className="space-y-3 text-xs sm:text-sm text-[#756E65] dark:text-[#9E9B96]">
            {featuresList.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tool FAQ Section */}
      <section className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#1F1B18] dark:text-[#F7F5F0] flex items-center gap-2 font-['Outfit',sans-serif]">
            <HelpCircle className="w-5 h-5 text-[#B5824C] dark:text-[#DFB267]" />
            Frequently Asked Questions about {tool.name}
          </h2>
          <p className="text-xs text-[#756E65] dark:text-[#9E9B96] mt-1">
            Common answers regarding security, rate limits, and processing formats
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: `Is ${tool.name} completely free to use?`,
              a: `Yes, ${tool.name} is 100% free with unlimited daily usages. You do not need to register, provide API keys, or create an account.`
            },
            {
              q: `Is my uploaded data or text stored on your servers?`,
              a: `No. All client-side tools execute directly in your browser JavaScript runtime sandbox. For AI tools, queries are processed statelessly with zero logging or persistence.`
            },
            {
              q: `Can I access ${tool.name} on mobile devices?`,
              a: `Yes, ToolVerse is fully responsive and supports touch events, camera file uploads, and mobile clipboard copying across iOS and Android.`
            }
          ].map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-[#EAE2D5] dark:border-[#2C303B] rounded-2xl overflow-hidden bg-[#FAF7F2]/50 dark:bg-[#22252E]/50"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-[#1F1B18] dark:text-[#F7F5F0] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#756E65] dark:text-[#9E9B96] transition-transform ${isOpen ? 'rotate-180 text-[#B5824C] dark:text-[#DFB267]' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-[#756E65] dark:text-[#9E9B96] leading-relaxed border-t border-[#EAE2D5] dark:border-[#2C303B] pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1F1B18] dark:text-[#F7F5F0] flex items-center gap-2 font-['Outfit',sans-serif]">
              <Layers className="w-5 h-5 text-[#B5824C] dark:text-[#DFB267]" />
              Related Utilities
            </h2>
            <Link to="/tools" className="text-xs text-[#B5824C] dark:text-[#DFB267] hover:underline font-semibold">
              See All Tools →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((relTool) => (
              <ToolCard key={relTool.id} tool={relTool} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
