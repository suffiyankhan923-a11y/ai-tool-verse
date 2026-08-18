import React, { useState } from 'react';
import {
  Search,
  Globe,
  Share2,
  FileCode,
  Check,
  Copy,
  Download,
  Sparkles,
  ExternalLink,
  Code2,
  ListOrdered,
  FileCheck,
  Smartphone,
  Monitor,
} from 'lucide-react';

export const SeoToolsHub: React.FC<{
  toolType: 'meta' | 'robots' | 'sitemap' | 'og' | 'schema' | 'serp' | 'keyword';
}> = ({ toolType }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Meta / Canonical / SERP State
  const [pageTitle, setPageTitle] = useState('ToolVerse — Fast & Free Everyday Online Tools');
  const [metaDesc, setMetaDesc] = useState(
    'Access 70+ free online calculators, unit converters, text tools, and developer utilities with zero sign-up required. Fast, private, and mobile-friendly.'
  );
  const [siteUrl, setSiteUrl] = useState('https://toolverse.app');
  const [author, setAuthor] = useState('ToolVerse Engineering Team');
  const [keywords, setKeywords] = useState('free online tools, age calculator, json formatter, bmi calculator');
  const [ogImageUrl, setOgImageUrl] = useState('https://toolverse.app/og-image.png');
  const [twitterHandle, setTwitterHandle] = useState('@toolverse');
  const [serpViewMode, setSerpViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // 2. Robots.txt State
  const [botAccess, setBotAccess] = useState<'allow-all' | 'block-all' | 'custom'>('allow-all');
  const [sitemapUrl, setSitemapUrl] = useState('https://toolverse.app/sitemap.xml');
  const [disallowedPaths, setDisallowedPaths] = useState('/admin/\n/api/\n/private/\n/tmp/');
  const [crawlDelay, setCrawlDelay] = useState(10);

  // 3. Sitemap State
  const [sitemapUrls, setSitemapUrls] = useState(
    'https://toolverse.app/\nhttps://toolverse.app/tools\nhttps://toolverse.app/categories\nhttps://toolverse.app/about'
  );
  const [changeFreq, setChangeFreq] = useState('weekly');
  const [priority, setPriority] = useState('0.8');

  // 4. Schema State
  const [schemaType, setSchemaType] = useState<
    'WebSite' | 'Organization' | 'Article' | 'FAQPage' | 'Product' | 'LocalBusiness'
  >('WebSite');
  const [orgName, setOrgName] = useState('ToolVerse Inc');
  const [productPrice, setProductPrice] = useState('0.00');

  // 5. Keyword Density State
  const [keywordText, setKeywordText] = useState(
    'ToolVerse provides fast, free online tools. With ToolVerse you can calculate percentages, format JSON, compress images, and convert units. All tools on ToolVerse run in your browser for privacy and speed.'
  );

  // Code Generators
  const generateMetaHtml = () => {
    return `<!-- Primary Meta Tags -->
<title>${pageTitle}</title>
<meta name="title" content="${pageTitle}" />
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

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${siteUrl}" />
<meta property="twitter:title" content="${pageTitle}" />
<meta property="twitter:description" content="${metaDesc}" />
<meta property="twitter:image" content="${ogImageUrl}" />
<meta name="twitter:site" content="${twitterHandle}" />`;
  };

  const generateRobotsTxt = () => {
    if (botAccess === 'allow-all') {
      return `User-agent: *\nAllow: /\nCrawl-delay: ${crawlDelay}\n\nSitemap: ${sitemapUrl}`;
    }
    if (botAccess === 'block-all') {
      return `User-agent: *\nDisallow: /\n\nSitemap: ${sitemapUrl}`;
    }
    const paths = disallowedPaths
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);
    const disallowRules = paths.map((p) => `Disallow: ${p}`).join('\n');
    return `User-agent: *\nAllow: /\n${disallowRules}\nCrawl-delay: ${crawlDelay}\n\nSitemap: ${sitemapUrl}`;
  };

  const generateSitemapXml = () => {
    const urls = sitemapUrls.split('\n').map((u) => u.trim()).filter(Boolean);
    const today = new Date().toISOString().split('T')[0];
    const entries = urls
      .map(
        (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changeFreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
  };

  const generateSchemaJson = () => {
    if (schemaType === 'WebSite') {
      return JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: orgName,
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
          name: orgName,
          url: siteUrl,
          logo: `${siteUrl}/icon.png`,
          sameAs: ['https://twitter.com/toolverse', 'https://github.com/toolverse'],
        },
        null,
        2
      );
    }
    if (schemaType === 'Product') {
      return JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: pageTitle,
          description: metaDesc,
          offers: {
            '@type': 'Offer',
            price: productPrice,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
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
                text: 'Yes, every tool on ToolVerse is completely free with no registration required.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is my data secure?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'All calculations and text processing occur locally in your browser sandbox.',
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
          name: orgName,
        },
        datePublished: new Date().toISOString(),
      },
      null,
      2
    );
  };

  // Keyword Density Analysis
  const analyzeKeywords = () => {
    const words = keywordText
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const totalWords = words.length;
    const freq: Record<string, number> = {};

    words.forEach((w) => {
      freq[w] = (freq[w] || 0) + 1;
    });

    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return { totalWords, sorted };
  };

  const titleLength = pageTitle.length;
  const descLength = metaDesc.length;

  return (
    <div className="space-y-6">
      {/* 1. SERP PREVIEW / META */}
      {(toolType === 'meta' || toolType === 'serp') && (
        <div className="space-y-6">
          <div className="p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                <Search className="w-4 h-4 text-[#D4AF37]" />
                <span>Google SERP Search Preview</span>
              </span>
              <div className="flex gap-1 p-1 bg-[#161E31] rounded-xl border border-[#D4AF37]/20">
                <button
                  type="button"
                  onClick={() => setSerpViewMode('desktop')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    serpViewMode === 'desktop' ? 'bg-[#D4AF37] text-[#050810]' : 'text-[#94A3B8]'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSerpViewMode('mobile')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    serpViewMode === 'mobile' ? 'bg-[#D4AF37] text-[#050810]' : 'text-[#94A3B8]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Google Snippet Card */}
            <div
              className={`p-4 rounded-xl bg-white text-slate-900 border font-sans ${
                serpViewMode === 'mobile' ? 'max-w-sm mx-auto' : 'max-w-2xl'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-bold text-slate-950">
                  T
                </div>
                <div className="text-xs text-slate-700">
                  <span className="font-semibold">ToolVerse</span>
                  <span className="text-slate-400 text-[11px] block">{siteUrl}</span>
                </div>
              </div>
              <h3 className="text-base md:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer line-clamp-1">
                {pageTitle || 'Untitled Page Title'}
              </h3>
              <p className="text-xs md:text-sm text-[#4d5156] mt-1 line-clamp-2 leading-relaxed">
                {metaDesc || 'Meta description preview text goes here...'}
              </p>
            </div>

            {/* Length Meters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <div className="flex justify-between text-xs text-[#94A3B8] mb-1">
                  <span>Title Length ({titleLength}/60 chars)</span>
                  <span
                    className={`font-semibold ${
                      titleLength >= 40 && titleLength <= 60
                        ? 'text-emerald-400'
                        : titleLength > 60
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {titleLength >= 40 && titleLength <= 60
                      ? 'Optimal'
                      : titleLength > 60
                      ? 'Too Long'
                      : 'Short'}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#161E31] overflow-hidden">
                  <div
                    className={`h-full ${titleLength <= 60 ? 'bg-emerald-400' : 'bg-rose-500'}`}
                    style={{ width: `${Math.min(100, (titleLength / 60) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#94A3B8] mb-1">
                  <span>Description Length ({descLength}/160 chars)</span>
                  <span
                    className={`font-semibold ${
                      descLength >= 120 && descLength <= 160
                        ? 'text-emerald-400'
                        : descLength > 160
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {descLength >= 120 && descLength <= 160
                      ? 'Optimal'
                      : descLength > 160
                      ? 'Too Long'
                      : 'Short'}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#161E31] overflow-hidden">
                  <div
                    className={`h-full ${descLength <= 160 ? 'bg-emerald-400' : 'bg-rose-500'}`}
                    style={{ width: `${Math.min(100, (descLength / 160) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form & HTML Code */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Page Title</label>
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Canonical URL</label>
                  <input
                    type="text"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                    Generated HTML Meta Tags
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(generateMetaHtml())}
                    className="text-xs text-[#D4AF37] font-semibold flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy HTML'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={10}
                  value={generateMetaHtml()}
                  className="w-full p-3 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 font-mono text-xs text-white leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ROBOTS.TXT */}
      {toolType === 'robots' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Default Bot Access</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'allow-all', label: 'Allow All' },
                  { id: 'custom', label: 'Custom Paths' },
                  { id: 'block-all', label: 'Block All' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBotAccess(b.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold ${
                      botAccess === b.id ? 'bg-[#D4AF37] text-[#050810]' : 'bg-[#161E31] text-[#94A3B8]'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Sitemap URL</label>
              <input
                type="text"
                value={sitemapUrl}
                onChange={(e) => setSitemapUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs font-mono"
              />
            </div>

            {botAccess === 'custom' && (
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">
                  Disallowed Directories (one per line)
                </label>
                <textarea
                  rows={4}
                  value={disallowedPaths}
                  onChange={(e) => setDisallowedPaths(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-mono text-xs"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Crawl Delay (Seconds)</label>
              <input
                type="number"
                value={crawlDelay}
                onChange={(e) => setCrawlDelay(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs"
              />
            </div>
          </div>

          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Generated robots.txt File
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(generateRobotsTxt())}
                  className="text-xs text-[#D4AF37] font-semibold flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={12}
                value={generateRobotsTxt()}
                className="w-full p-3 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 font-mono text-xs text-white leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. SITEMAP GENERATOR */}
      {toolType === 'sitemap' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">
                List of Website URLs (one per line)
              </label>
              <textarea
                rows={6}
                value={sitemapUrls}
                onChange={(e) => setSitemapUrls(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Change Frequency</label>
                <select
                  value={changeFreq}
                  onChange={(e) => setChangeFreq(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs"
                >
                  <option value="always">Always</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Default Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs"
                >
                  <option value="1.0">1.0 (Highest)</option>
                  <option value="0.8">0.8 (High)</option>
                  <option value="0.5">0.5 (Normal)</option>
                  <option value="0.3">0.3 (Low)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  XML Sitemap Output
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(generateSitemapXml())}
                  className="text-xs text-[#D4AF37] font-semibold flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy XML'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={12}
                value={generateSitemapXml()}
                className="w-full p-3 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 font-mono text-xs text-white leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. OPEN GRAPH GENERATOR */}
      {toolType === 'og' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">OG Title</label>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">OG Description</label>
              <textarea
                rows={3}
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Image URL (1200x630px)</label>
              <input
                type="text"
                value={ogImageUrl}
                onChange={(e) => setOgImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs font-mono"
              />
            </div>
          </div>

          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">
              Social Card Preview
            </span>
            <div className="rounded-xl overflow-hidden border border-[#D4AF37]/20 bg-[#161E31]">
              <div className="h-40 bg-[#0F172A] flex items-center justify-center text-xs text-[#64748B] border-b border-[#D4AF37]/15">
                🖼️ Image: {ogImageUrl}
              </div>
              <div className="p-3">
                <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-mono">
                  toolverse.app
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-1 mt-0.5">{pageTitle}</h4>
                <p className="text-xs text-[#94A3B8] line-clamp-2 mt-1">{metaDesc}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SCHEMA GENERATOR */}
      {toolType === 'schema' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Schema Type</label>
              <select
                value={schemaType}
                onChange={(e) => setSchemaType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs font-semibold"
              >
                <option value="WebSite">WebSite</option>
                <option value="Organization">Organization</option>
                <option value="Article">Article / Blog Post</option>
                <option value="Product">Product & Offers</option>
                <option value="FAQPage">FAQ Page</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Entity / Brand Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Target URL</label>
              <input
                type="text"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs font-mono"
              />
            </div>
          </div>

          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  JSON-LD Schema Markup
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(generateSchemaJson())}
                  className="text-xs text-[#D4AF37] font-semibold flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON-LD'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={12}
                value={generateSchemaJson()}
                className="w-full p-3 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 font-mono text-xs text-white leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. KEYWORD DENSITY CHECKER */}
      {toolType === 'keyword' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] block">
              Paste Content to Check Keyword Density
            </label>
            <textarea
              rows={12}
              value={keywordText}
              onChange={(e) => setKeywordText(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-sm leading-relaxed"
            />
          </div>

          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Top Keywords & Frequency
              </span>
              <span className="text-xs text-[#94A3B8]">
                Total Analyzed Words: <strong className="text-white">{analyzeKeywords().totalWords}</strong>
              </span>
            </div>

            <div className="space-y-2">
              {analyzeKeywords().sorted.map(([word, count]) => {
                const total = analyzeKeywords().totalWords || 1;
                const density = ((count / total) * 100).toFixed(1);
                return (
                  <div
                    key={word}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/15 text-xs"
                  >
                    <span className="font-semibold text-white capitalize">{word}</span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-[#94A3B8]">{count}x</span>
                      <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
                        {density}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
