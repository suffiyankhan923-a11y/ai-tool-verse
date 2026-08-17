import React, { useState } from 'react';
import { Search, Globe, Share2, FileCode, Check, Copy, Download, Sparkles, ExternalLink } from 'lucide-react';

export const SeoToolsHub: React.FC<{ toolType: 'meta' | 'robots' | 'sitemap' | 'og' | 'schema' | 'serp' }> = ({
  toolType,
}) => {
  // Meta / SERP state
  const [pageTitle, setPageTitle] = useState('ToolVerse — Fast & Free Everyday Online Tools');
  const [metaDesc, setMetaDesc] = useState(
    'Access 70+ free online calculators, unit converters, text tools, and developer utilities with zero sign-up required. Fast, private, and mobile-friendly.'
  );
  const [siteUrl, setSiteUrl] = useState('https://toolverse.app');
  const [author, setAuthor] = useState('ToolVerse Engineering Team');
  const [keywords, setKeywords] = useState('free online tools, age calculator, json formatter, bmi calculator');

  // Robots.txt state
  const [botAccess, setBotAccess] = useState<'allow-all' | 'block-all' | 'custom'>('allow-all');
  const [sitemapUrl, setSitemapUrl] = useState('https://toolverse.app/sitemap.xml');
  const [disallowedPaths, setDisallowedPaths] = useState('/admin/\n/api/\n/private/');

  // Open Graph state
  const [ogImageUrl, setOgImageUrl] = useState('https://toolverse.app/og-image.png');
  const [twitterHandle, setTwitterHandle] = useState('@toolverse');

  // Schema state
  const [schemaType, setSchemaType] = useState<'Organization' | 'Article' | 'FAQPage' | 'WebSite'>('WebSite');

  const [copied, setCopied] = useState(false);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate Meta Tags HTML
  const generateMetaHtml = () => {
    return `<!-- Standard SEO Meta Tags -->
<title>${pageTitle}</title>
<meta name="description" content="${metaDesc}" />
<meta name="keywords" content="${keywords}" />
<meta name="author" content="${author}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${siteUrl}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${siteUrl}" />
<meta property="og:title" content="${pageTitle}" />
<meta property="og:description" content="${metaDesc}" />
<meta property="og:image" content="${ogImageUrl}" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="${twitterHandle}" />
<meta name="twitter:title" content="${pageTitle}" />
<meta name="twitter:description" content="${metaDesc}" />
<meta name="twitter:image" content="${ogImageUrl}" />`;
  };

  // Generate Robots.txt
  const generateRobotsTxt = () => {
    if (botAccess === 'allow-all') {
      return `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}`;
    }
    if (botAccess === 'block-all') {
      return `User-agent: *\nDisallow: /\n\nSitemap: ${sitemapUrl}`;
    }
    const paths = disallowedPaths
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);
    const disallowRules = paths.map((p) => `Disallow: ${p}`).join('\n');
    return `User-agent: *\nAllow: /\n${disallowRules}\n\nSitemap: ${sitemapUrl}`;
  };

  // Generate Schema JSON-LD
  const generateSchemaJson = () => {
    if (schemaType === 'WebSite') {
      return JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'ToolVerse',
          url: siteUrl,
          description: metaDesc,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        null,
        2
      );
    }
    if (schemaType === 'Organization') {
      return JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'ToolVerse',
          url: siteUrl,
          logo: `${siteUrl}/icon.png`,
          sameAs: ['https://twitter.com/toolverse', 'https://github.com/toolverse'],
        },
        null,
        2
      );
    }
    if (schemaType === 'FAQPage') {
      return JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Are all tools on ToolVerse 100% free?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, every tool on ToolVerse is completely free with no account or sign-up required.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is my data secure when using ToolVerse?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'All calculations and conversions run entirely inside your browser sandbox. No user data is saved or sent to any remote server.',
              },
            },
          ],
        },
        null,
        2
      );
    }
    return JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: pageTitle,
        description: metaDesc,
        author: {
          '@type': 'Person',
          name: author,
        },
        publisher: {
          '@type': 'Organization',
          name: 'ToolVerse',
        },
        datePublished: new Date().toISOString(),
      },
      null,
      2
    );
  };

  const titleLength = pageTitle.length;
  const descLength = metaDesc.length;

  return (
    <div className="space-y-6">
      {/* Visual Google SERP Previewer */}
      <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Search className="w-4 h-4 text-amber-500" />
          <span>Live Google Desktop & Mobile Search Snippet Preview</span>
        </span>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 max-w-2xl font-sans">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-bold text-slate-950">
              T
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300">
              <span className="font-semibold">ToolVerse</span>
              <span className="text-slate-400 dark:text-slate-500 text-[11px] block">{siteUrl}</span>
            </div>
          </div>
          <h3 className="text-base md:text-lg font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1">
            {pageTitle || 'Untitled Page'}
          </h3>
          <p className="text-xs md:text-sm text-[#4d5156] dark:text-[#bdc1c6] mt-1 line-clamp-2 leading-relaxed">
            {metaDesc || 'Please provide a meta description to see the search snippet snippet summary...'}
          </p>
        </div>

        {/* Character Counters with Health Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Title Length ({titleLength}/60 chars)</span>
              <span
                className={`font-semibold ${
                  titleLength >= 40 && titleLength <= 60
                    ? 'text-emerald-500'
                    : titleLength > 60
                    ? 'text-rose-500'
                    : 'text-amber-500'
                }`}
              >
                {titleLength >= 40 && titleLength <= 60 ? 'Optimal' : titleLength > 60 ? 'Too Long' : 'Short'}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full ${
                  titleLength <= 60 ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, (titleLength / 60) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Description Length ({descLength}/160 chars)</span>
              <span
                className={`font-semibold ${
                  descLength >= 120 && descLength <= 160
                    ? 'text-emerald-500'
                    : descLength > 160
                    ? 'text-rose-500'
                    : 'text-amber-500'
                }`}
              >
                {descLength >= 120 && descLength <= 160 ? 'Optimal' : descLength > 160 ? 'Too Long' : 'Short'}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full ${
                  descLength <= 160 ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, (descLength / 160) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Editor Controls & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Settings */}
        <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Configure SEO Attributes
          </h4>

          <div>
            <label className="text-xs font-semibold block mb-1">Page Title</label>
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Meta Description</label>
            <textarea
              rows={3}
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold block mb-1">Canonical URL</label>
              <input
                type="text"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Author Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Open Graph Image URL</label>
            <input
              type="text"
              value={ogImageUrl}
              onChange={(e) => setOgImageUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
            />
          </div>
        </div>

        {/* Code Output */}
        <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Ready-to-Paste HTML Meta Tags
              </span>
              <button
                type="button"
                onClick={() => handleCopy(generateMetaHtml())}
                className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy HTML'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={12}
              value={generateMetaHtml()}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed"
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            Paste these tags inside the <code>&lt;head&gt;</code> element of your HTML or template.
          </p>
        </div>
      </div>
    </div>
  );
};
