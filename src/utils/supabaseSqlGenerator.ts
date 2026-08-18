import { CategoryInfo, ToolItem, BlogPost } from '../types';
import { CATEGORIES } from '../data/categories';
import { TOOLS } from '../data/tools';
import { BLOG_POSTS } from '../data/blogPosts';

/**
 * Helper to safely escape strings for PostgreSQL single-quoted string literals.
 */
function sqlEscape(str: string | undefined | null): string {
  if (str === undefined || str === null) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

/**
 * Helper to format JavaScript string array to PostgreSQL TEXT[] literal.
 */
function sqlArray(arr: string[] | undefined | null): string {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return "'{}'::text[]";
  const escaped = arr.map((item) => sqlEscape(item));
  return `ARRAY[${escaped.join(', ')}]::text[]`;
}

/**
 * Helper to format JavaScript objects to PostgreSQL JSONB literal.
 */
function sqlJsonb(obj: any): string {
  if (obj === undefined || obj === null) return "'{}'::jsonb";
  const jsonStr = JSON.stringify(obj);
  return `${sqlEscape(jsonStr)}::jsonb`;
}

export interface SqlGeneratorOptions {
  includeDropTables?: boolean;
  includeSchema?: boolean;
  includeRlsPolicies?: boolean;
  includeIndexes?: boolean;
  includeCategoriesData?: boolean;
  includeToolsData?: boolean;
  includeBlogsData?: boolean;
  includeSettingsData?: boolean;
}

/**
 * Generates the complete, production-ready PostgreSQL SQL script for Supabase.
 */
export function generateSupabaseSql(options: SqlGeneratorOptions = {}): string {
  const {
    includeDropTables = true,
    includeSchema = true,
    includeRlsPolicies = true,
    includeIndexes = true,
    includeCategoriesData = true,
    includeToolsData = true,
    includeBlogsData = true,
    includeSettingsData = true,
  } = options;

  const sections: string[] = [];

  // HEADER BANNER
  sections.push(`-- ====================================================================
-- TOOLVERSE — SUPABASE DATABASE SCHEMA & COMPLETE DATA IMPORTER
-- Platform: Supabase (PostgreSQL 15+)
-- Generated: ${new Date().toISOString()}
-- Total Categories: ${CATEGORIES.length}
-- Total Precision Tools: ${TOOLS.length}
-- Total Blog Guides: ${BLOG_POSTS.length}
-- Instructions:
--   1. Open your Supabase Project (https://supabase.com/dashboard)
--   2. Navigate to "SQL Editor" in the left sidebar
--   3. Paste this complete SQL script into a new query and click "Run" (⌘ + Enter)
--   4. Open "Table Editor" to see all populated tables!
-- ====================================================================

-- 1. Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
`);

  // DROP TABLES IF REQUESTED
  if (includeDropTables) {
    sections.push(`-- ====================================================================
-- 2. RESET & CLEANUP EXISTING TABLES (OPTIONAL / SAFE TO RUN)
-- ====================================================================
DROP TABLE IF EXISTS tool_analytics CASCADE;
DROP TABLE IF EXISTS user_feedback CASCADE;
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS tools CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
`);
  }

  // SCHEMA DEFINITIONS
  if (includeSchema) {
    sections.push(`-- ====================================================================
-- 3. SCHEMA DEFINITION: CATEGORIES TABLE
-- ====================================================================
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_name TEXT NOT NULL DEFAULT 'Wrench',
  color TEXT NOT NULL DEFAULT 'from-amber-500/20 to-yellow-600/20 text-amber-500',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 4. SCHEMA DEFINITION: TOOLS TABLE
-- ====================================================================
CREATE TABLE tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE,
  description TEXT NOT NULL,
  long_description TEXT,
  icon_name TEXT NOT NULL DEFAULT 'Calculator',
  keywords TEXT[] NOT NULL DEFAULT '{}'::text[],
  featured BOOLEAN NOT NULL DEFAULT false,
  popular BOOLEAN NOT NULL DEFAULT false,
  is_new BOOLEAN NOT NULL DEFAULT false,
  how_to_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  how_it_works TEXT,
  example_scenario JSONB NOT NULL DEFAULT '{}'::jsonb,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  related_tool_ids TEXT[] NOT NULL DEFAULT '{}'::text[],
  disclaimer_type TEXT NOT NULL DEFAULT 'general' CHECK (disclaimer_type IN ('financial', 'health', 'general')),
  views_count BIGINT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 5. SCHEMA DEFINITION: BLOGS / GUIDES TABLE
-- ====================================================================
CREATE TABLE blogs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  author_avatar TEXT,
  published_date TEXT NOT NULL,
  read_time TEXT NOT NULL,
  cover_image TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  related_tool_slugs TEXT[] NOT NULL DEFAULT '{}'::text[],
  content TEXT NOT NULL,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT true,
  views_count BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 6. SCHEMA DEFINITION: SITE SETTINGS TABLE
-- ====================================================================
CREATE TABLE site_settings (
  id TEXT PRIMARY KEY,
  site_name TEXT NOT NULL DEFAULT 'ToolVerse',
  site_tagline TEXT NOT NULL DEFAULT 'Precision Online Tools for Everyday Life',
  site_url TEXT NOT NULL DEFAULT 'https://toolverse.app',
  contact_email TEXT NOT NULL DEFAULT 'support@toolverse.app',
  primary_color TEXT NOT NULL DEFAULT '#D4AF37',
  enable_ads BOOLEAN NOT NULL DEFAULT false,
  adsense_client_id TEXT,
  ga_tracking_id TEXT,
  meta_title TEXT NOT NULL DEFAULT 'ToolVerse — Free Online Calculators, Converters & Developer Utilities',
  meta_description TEXT NOT NULL DEFAULT 'Access 70+ free online tools with zero sign-up required. 100% private, instant, and mobile-friendly.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 7. SCHEMA DEFINITION: TOOL ANALYTICS & USAGE LOGS
-- ====================================================================
CREATE TABLE tool_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id TEXT REFERENCES tools(id) ON DELETE SET NULL,
  tool_slug TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'tool_view',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  user_agent TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 8. SCHEMA DEFINITION: USER FEEDBACK & TOOL REQUESTS
-- ====================================================================
CREATE TABLE user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  message TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  tool_slug TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'implemented', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`);
  }

  // INDEXES
  if (includeIndexes) {
    sections.push(`-- ====================================================================
-- 9. PERFORMANCE OPTIMIZATION INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category_id);
CREATE INDEX IF NOT EXISTS idx_tools_featured ON tools(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_tools_popular ON tools(popular) WHERE popular = true;
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(is_published);
CREATE INDEX IF NOT EXISTS idx_analytics_tool_slug ON tool_analytics(tool_slug);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON tool_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON user_feedback(created_at DESC);
`);
  }

  // ROW LEVEL SECURITY (RLS) POLICIES
  if (includeRlsPolicies) {
    sections.push(`-- ====================================================================
-- 10. ROW LEVEL SECURITY (RLS) & ACCESS CONTROL POLICIES
-- ====================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Categories: Public read, Authenticated write
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin All Categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Tools: Public read active tools, Authenticated write
CREATE POLICY "Public Read Tools" ON tools FOR SELECT USING (is_active = true);
CREATE POLICY "Admin All Tools" ON tools FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Blogs: Public read published blogs, Authenticated write
CREATE POLICY "Public Read Blogs" ON blogs FOR SELECT USING (is_published = true);
CREATE POLICY "Admin All Blogs" ON blogs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Site Settings: Public read, Authenticated write
CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin All Settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Analytics & Feedback: Public insert, Authenticated read/manage
CREATE POLICY "Public Insert Analytics" ON tool_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Read Analytics" ON tool_analytics FOR SELECT TO authenticated USING (true);

CREATE POLICY "Public Insert Feedback" ON user_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin All Feedback" ON user_feedback FOR ALL TO authenticated USING (true) WITH CHECK (true);
`);
  }

  // POPULATE CATEGORIES DATA
  if (includeCategoriesData) {
    const categoryRows = CATEGORIES.map((cat) => {
      return `(${sqlEscape(cat.id)}, ${sqlEscape(cat.name)}, ${sqlEscape(cat.slug)}, ${sqlEscape(
        cat.description
      )}, ${sqlEscape(cat.iconName)}, ${sqlEscape(cat.color)})`;
    }).join(',\n');

    sections.push(`-- ====================================================================
-- 11. SEED DATA: CATEGORIES (${CATEGORIES.length} RECORDS)
-- ====================================================================
INSERT INTO categories (id, name, slug, description, icon_name, color)
VALUES
${categoryRows}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  color = EXCLUDED.color,
  updated_at = NOW();
`);
  }

  // POPULATE TOOLS DATA
  if (includeToolsData) {
    const toolRows = TOOLS.map((tool) => {
      return `(${sqlEscape(tool.id)}, ${sqlEscape(tool.name)}, ${sqlEscape(tool.slug)}, ${sqlEscape(
        tool.category
      )}, ${sqlEscape(tool.description)}, ${sqlEscape(tool.longDescription || tool.description)}, ${sqlEscape(
        tool.iconName
      )}, ${sqlArray(tool.keywords)}, ${tool.featured ? 'true' : 'false'}, ${
        tool.popular ? 'true' : 'false'
      }, ${tool.isNew ? 'true' : 'false'}, ${sqlJsonb(tool.howToSteps || [])}, ${sqlEscape(
        tool.howItWorks || ''
      )}, ${sqlJsonb(tool.exampleScenario || {})}, ${sqlJsonb(tool.faqs || [])}, ${sqlArray(
        tool.relatedToolIds || []
      )}, ${sqlEscape(tool.disclaimerType || 'general')})`;
    }).join(',\n');

    sections.push(`-- ====================================================================
-- 12. SEED DATA: TOOLS (${TOOLS.length} RECORDS)
-- ====================================================================
INSERT INTO tools (
  id, name, slug, category_id, description, long_description, icon_name,
  keywords, featured, popular, is_new, how_to_steps, how_it_works,
  example_scenario, faqs, related_tool_ids, disclaimer_type
)
VALUES
${toolRows}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category_id = EXCLUDED.category_id,
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  icon_name = EXCLUDED.icon_name,
  keywords = EXCLUDED.keywords,
  featured = EXCLUDED.featured,
  popular = EXCLUDED.popular,
  is_new = EXCLUDED.is_new,
  how_to_steps = EXCLUDED.how_to_steps,
  how_it_works = EXCLUDED.how_it_works,
  example_scenario = EXCLUDED.example_scenario,
  faqs = EXCLUDED.faqs,
  related_tool_ids = EXCLUDED.related_tool_ids,
  disclaimer_type = EXCLUDED.disclaimer_type,
  updated_at = NOW();
`);
  }

  // POPULATE BLOGS DATA
  if (includeBlogsData) {
    const blogRows = BLOG_POSTS.map((post) => {
      return `(${sqlEscape(post.id)}, ${sqlEscape(post.slug)}, ${sqlEscape(post.title)}, ${sqlEscape(
        post.excerpt
      )}, ${sqlEscape(post.category)}, ${sqlEscape(post.author?.name || 'ToolVerse Editorial')}, ${sqlEscape(
        post.author?.role || 'Staff Writer'
      )}, ${sqlEscape(post.author?.avatar || '')}, ${sqlEscape(post.publishedDate)}, ${sqlEscape(
        post.readTime
      )}, ${sqlEscape(post.coverImage || '')}, ${sqlArray(post.tags || [])}, ${sqlArray(
        post.relatedToolSlugs || []
      )}, ${sqlEscape(post.content)}, ${sqlJsonb(post.faqs || [])}, true)`;
    }).join(',\n');

    sections.push(`-- ====================================================================
-- 13. SEED DATA: BLOGS & GUIDES (${BLOG_POSTS.length} ARTICLES)
-- ====================================================================
INSERT INTO blogs (
  id, slug, title, excerpt, category, author_name, author_role, author_avatar,
  published_date, read_time, cover_image, tags, related_tool_slugs, content,
  faqs, is_published
)
VALUES
${blogRows}
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  category = EXCLUDED.category,
  author_name = EXCLUDED.author_name,
  author_role = EXCLUDED.author_role,
  author_avatar = EXCLUDED.author_avatar,
  published_date = EXCLUDED.published_date,
  read_time = EXCLUDED.read_time,
  cover_image = EXCLUDED.cover_image,
  tags = EXCLUDED.tags,
  related_tool_slugs = EXCLUDED.related_tool_slugs,
  content = EXCLUDED.content,
  faqs = EXCLUDED.faqs,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();
`);
  }

  // POPULATE SITE SETTINGS
  if (includeSettingsData) {
    sections.push(`-- ====================================================================
-- 14. SEED DATA: DEFAULT SITE SETTINGS
-- ====================================================================
INSERT INTO site_settings (
  id, site_name, site_tagline, site_url, contact_email, primary_color,
  enable_ads, meta_title, meta_description
)
VALUES (
  'main_config',
  'ToolVerse',
  'Precision Online Tools for Everyday Life',
  'https://toolverse.app',
  'support@toolverse.app',
  '#D4AF37',
  false,
  'ToolVerse — 70+ Free Online Calculators, Converters & Developer Tools',
  'Access 70+ free, instant web tools with zero sign-up required. 100% client-side privacy, accurate math, and lightning-fast performance.'
)
ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  site_tagline = EXCLUDED.site_tagline,
  site_url = EXCLUDED.site_url,
  contact_email = EXCLUDED.contact_email,
  updated_at = NOW();

-- ====================================================================
-- VERIFICATION QUERY
-- ====================================================================
SELECT 'Import Complete!' AS status,
       (SELECT COUNT(*) FROM categories) AS categories_count,
       (SELECT COUNT(*) FROM tools) AS tools_count,
       (SELECT COUNT(*) FROM blogs) AS blogs_count;
`);
  }

  return sections.join('\n');
}

/**
 * Downloads a text content as a file to user's computer.
 */
export function downloadSqlFile(content: string, filename = 'toolverse_supabase_import.sql') {
  const blob = new Blob([content], { type: 'text/sql;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Export full dataset as JSON.
 */
export function exportFullJsonData() {
  const bundle = {
    metadata: {
      platform: 'ToolVerse',
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    },
    categories: CATEGORIES,
    tools: TOOLS,
    blogs: BLOG_POSTS,
  };
  const jsonStr = JSON.stringify(bundle, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `toolverse_export_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
