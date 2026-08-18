import fs from 'fs';
import path from 'path';
import { CATEGORIES } from '../src/data/categories';
import { TOOLS } from '../src/data/tools';
import { BLOG_POSTS } from '../src/data/blogPosts';
import { generateSupabaseSql } from '../src/utils/supabaseSqlGenerator';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const DATA_DIR = path.join(PUBLIC_DIR, 'data');

// Ensure directories exist
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 1. Write categories.json
fs.writeFileSync(
  path.join(DATA_DIR, 'categories.json'),
  JSON.stringify(CATEGORIES, null, 2),
  'utf-8'
);
console.log(`✓ Wrote public/data/categories.json (${CATEGORIES.length} categories)`);

// 2. Write tools.json
fs.writeFileSync(
  path.join(DATA_DIR, 'tools.json'),
  JSON.stringify(TOOLS, null, 2),
  'utf-8'
);
console.log(`✓ Wrote public/data/tools.json (${TOOLS.length} tools)`);

// 3. Write blogs.json
fs.writeFileSync(
  path.join(DATA_DIR, 'blogs.json'),
  JSON.stringify(BLOG_POSTS, null, 2),
  'utf-8'
);
console.log(`✓ Wrote public/data/blogs.json (${BLOG_POSTS.length} blog posts)`);

// 4. Write all_data.json
const allData = {
  meta: {
    name: 'ToolVerse',
    version: '1.0.0',
    description: 'Precision Online Tools for Everyday Life',
    generatedAt: new Date().toISOString(),
    totalCategories: CATEGORIES.length,
    totalTools: TOOLS.length,
    totalBlogs: BLOG_POSTS.length,
  },
  categories: CATEGORIES,
  tools: TOOLS,
  blogs: BLOG_POSTS,
};
fs.writeFileSync(
  path.join(DATA_DIR, 'all_data.json'),
  JSON.stringify(allData, null, 2),
  'utf-8'
);
console.log(`✓ Wrote public/data/all_data.json`);

// 5. Write supabase_schema.sql
const fullSql = generateSupabaseSql({
  includeDropTables: true,
  includeSchema: true,
  includeRlsPolicies: true,
  includeIndexes: true,
  includeCategoriesData: true,
  includeToolsData: true,
  includeBlogsData: true,
  includeSettingsData: true,
});
fs.writeFileSync(path.join(DATA_DIR, 'supabase_schema.sql'), fullSql, 'utf-8');
console.log(`✓ Wrote public/data/supabase_schema.sql`);

// 6. Write manifest.json
const manifest = {
  name: 'ToolVerse — Precision Online Tools for Everyday Life',
  short_name: 'ToolVerse',
  description: '70+ free instant online tools: Calculators, Converters, Text, Image, Developer, SEO, Finance, Health, and Date utilities.',
  start_url: '/',
  display: 'standalone',
  background_color: '#050810',
  theme_color: '#D4AF37',
  icons: [
    {
      src: '/icon.svg',
      sizes: 'any',
      type: 'image/svg+xml',
    },
  ],
  categories: ['utilities', 'productivity', 'education', 'finance'],
};
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'manifest.json'),
  JSON.stringify(manifest, null, 2),
  'utf-8'
);
console.log(`✓ Wrote public/manifest.json`);

// 7. Write robots.txt
const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://toolverse.app/sitemap.xml
`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsTxt, 'utf-8');
console.log(`✓ Wrote public/robots.txt`);

// 8. Write sitemap.xml
const siteDomain = 'https://toolverse.app';
const today = new Date().toISOString().split('T')[0];

const staticUrls = [
  '/',
  '/tools',
  '/categories',
  '/blog',
  '/favorites',
  '/about',
  '/privacy',
  '/terms',
  '/contact',
];

const categoryUrls = CATEGORIES.map((c) => `/categories/${c.slug}`);
const toolUrls = TOOLS.map((t) => `/tools/${t.slug}`);
const blogUrls = BLOG_POSTS.map((b) => `/blog/${b.slug}`);

const allUrls = [...staticUrls, ...categoryUrls, ...toolUrls, ...blogUrls];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${siteDomain}${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u === '/' ? 'daily' : u.startsWith('/tools/') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${u === '/' ? '1.0' : u.startsWith('/tools/') ? '0.8' : '0.6'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
console.log(`✓ Wrote public/sitemap.xml (${allUrls.length} URLs)`);

// 9. Write favicon / icon.svg
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#0A0F1E"/>
  <circle cx="50" cy="50" r="42" fill="none" stroke="#D4AF37" stroke-width="2" stroke-dasharray="4 4"/>
  <path d="M30 50 L50 30 L70 50 L50 70 Z" fill="none" stroke="#D4AF37" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="50" cy="50" r="8" fill="#D4AF37"/>
</svg>`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'icon.svg'), iconSvg, 'utf-8');
fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), iconSvg, 'utf-8');
console.log(`✓ Wrote public/icon.svg & public/favicon.svg`);

console.log('All public assets successfully created!');
