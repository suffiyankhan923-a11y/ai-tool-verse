import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { CATEGORIES } from '../data/categories';
import { TOOLS } from '../data/tools';
import { BLOG_POSTS } from '../data/blogPosts';
import { CategoryInfo, ToolItem, BlogPost } from '../types';

export interface SyncProgressCallback {
  (message: string, percent: number): void;
}

export const SupabaseService = {
  /**
   * Fetches categories from Supabase, or falls back to local data if unconfigured/offline.
   */
  async getCategories(): Promise<CategoryInfo[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return CATEGORIES;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        if (error) console.warn('Supabase getCategories fallback:', error.message);
        return CATEGORIES;
      }

      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description || '',
        iconName: row.icon_name || 'Grid',
        color: row.color || 'from-amber-500 to-yellow-600',
        toolCount: row.tool_count,
      }));
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local categories:', err);
      return CATEGORIES;
    }
  },

  /**
   * Fetches tools from Supabase, or falls back to local data if unconfigured/offline.
   */
  async getTools(): Promise<ToolItem[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return TOOLS;
    }

    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('is_active', true);

      if (error || !data || data.length === 0) {
        if (error) console.warn('Supabase getTools fallback:', error.message);
        return TOOLS;
      }

      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        category: row.category_id,
        description: row.description || '',
        longDescription: row.long_description || '',
        iconName: row.icon_name || 'Tool',
        keywords: Array.isArray(row.keywords) ? row.keywords : [],
        featured: Boolean(row.featured),
        popular: Boolean(row.popular),
        isNew: Boolean(row.is_new),
        howToSteps: Array.isArray(row.how_to_steps) ? row.how_to_steps : [],
        howItWorks: row.how_it_works || '',
        exampleScenario: row.example_scenario || undefined,
        faqs: Array.isArray(row.faqs) ? row.faqs : [],
        relatedToolIds: Array.isArray(row.related_tool_ids) ? row.related_tool_ids : [],
        disclaimerType: row.disclaimer_type || undefined,
      }));
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local tools:', err);
      return TOOLS;
    }
  },

  /**
   * Fetches blog articles from Supabase, or falls back to local data.
   */
  async getBlogPosts(): Promise<BlogPost[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return BLOG_POSTS;
    }

    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error || !data || data.length === 0) {
        if (error) console.warn('Supabase getBlogPosts fallback:', error.message);
        return BLOG_POSTS;
      }

      return data.map((row: any) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt || '',
        category: row.category || 'General',
        publishedDate: row.published_at || new Date().toISOString(),
        readTime: row.reading_time || '5 min read',
        author: {
          name: row.author_name || 'ToolVerse Editorial Team',
          role: row.author_role || 'Staff Specialist',
          avatar: row.author_avatar || '',
        },
        content: row.content || '',
        tags: Array.isArray(row.tags) ? row.tags : [],
        relatedToolSlugs: Array.isArray(row.related_tools) ? row.related_tools : [],
      }));
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local blogs:', err);
      return BLOG_POSTS;
    }
  },

  /**
   * Logs an anonymous tool execution metric to Supabase tool_analytics.
   */
  async recordToolUsage(toolSlug: string, categoryId?: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      await supabase.from('tool_analytics').insert({
        tool_slug: toolSlug,
        category_id: categoryId || 'general',
        executed_at: new Date().toISOString(),
      });
    } catch {
      // Non-blocking telemetry
    }
  },

  /**
   * Submits user rating or feedback to Supabase user_feedback table.
   */
  async submitFeedback(feedback: {
    toolSlug?: string;
    rating: number;
    comment?: string;
    email?: string;
  }): Promise<{ success: boolean; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      // Local fallback acknowledgement
      return { success: true };
    }

    try {
      const { error } = await supabase.from('user_feedback').insert({
        tool_slug: feedback.toolSlug || 'general',
        rating: feedback.rating,
        comment: feedback.comment || '',
        user_email: feedback.email || null,
        created_at: new Date().toISOString(),
      });

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Submission error' };
    }
  },

  /**
   * Directly syncs all 12 local categories, 70+ tools, and blog posts into Supabase via REST API.
   */
  async directSyncAllLocalDataToSupabase(
    onProgress?: SyncProgressCallback
  ): Promise<{ success: boolean; message: string; counts?: { categories: number; tools: number; blogs: number } }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return {
        success: false,
        message: 'Supabase client is not connected. Please provide a valid URL and Anon Key.',
      };
    }

    try {
      onProgress?.('Uploading 12 Categories to Supabase...', 20);

      // 1. Sync Categories with fallback for missing display_order column
      const categoryRowsWithOrder = CATEGORIES.map((cat, idx) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon_name: cat.iconName,
        color: cat.color,
        display_order: idx + 1,
      }));

      let { error: catErr } = await supabase.from('categories').upsert(categoryRowsWithOrder, { onConflict: 'id' });

      // If display_order column does not exist in user's schema, retry without it
      if (catErr && (catErr.message.includes('display_order') || catErr.code === 'PGRST204')) {
        const categoryRowsWithoutOrder = CATEGORIES.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon_name: cat.iconName,
          color: cat.color,
        }));
        const retryResult = await supabase.from('categories').upsert(categoryRowsWithoutOrder, { onConflict: 'id' });
        catErr = retryResult.error;
      }

      if (catErr) {
        throw new Error(`Failed to upsert categories: ${catErr.message}`);
      }

      onProgress?.('Uploading 70+ Tools to Supabase...', 60);

      // 2. Sync Tools
      const toolRows = TOOLS.map((tool) => ({
        id: tool.id,
        name: tool.name,
        slug: tool.slug,
        category_id: tool.category,
        description: tool.description,
        long_description: tool.longDescription || tool.description,
        icon_name: tool.iconName || 'Calculator',
        keywords: tool.keywords || [],
        featured: Boolean(tool.featured),
        popular: Boolean(tool.popular),
        is_new: Boolean(tool.isNew),
        how_to_steps: tool.howToSteps || [],
        how_it_works: tool.howItWorks || '',
        example_scenario: tool.exampleScenario || {},
        faqs: tool.faqs || [],
        related_tool_ids: tool.relatedToolIds || [],
        disclaimer_type: tool.disclaimerType || 'general',
        is_active: true,
      }));

      // Upsert in batches of 25 to avoid payload limits
      for (let i = 0; i < toolRows.length; i += 25) {
        const batch = toolRows.slice(i, i + 25);
        const { error: toolErr } = await supabase.from('tools').upsert(batch, { onConflict: 'slug' });
        if (toolErr) {
          throw new Error(`Failed to upsert tools batch: ${toolErr.message}`);
        }
      }

      onProgress?.('Uploading Blog Guides to Supabase...', 85);

      // 3. Sync Blogs
      const blogRows = BLOG_POSTS.map((blog) => ({
        id: blog.id,
        slug: blog.slug,
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        category: blog.category,
        author_name: blog.author.name,
        author_role: blog.author.role,
        author_avatar: blog.author.avatar || null,
        published_date: blog.publishedDate || new Date().toISOString().split('T')[0],
        read_time: blog.readTime || '4 min read',
        tags: blog.tags || [],
        related_tool_slugs: blog.relatedToolSlugs || [],
        is_published: true,
      }));

      let { error: blogErr } = await supabase.from('blogs').upsert(blogRows, { onConflict: 'slug' });

      // Fallback for legacy blog schemas with reading_time / published / related_tools column names
      if (blogErr) {
        const legacyBlogRows = BLOG_POSTS.map((blog) => ({
          id: blog.id,
          slug: blog.slug,
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          category: blog.category,
          author_name: blog.author.name,
          author_role: blog.author.role,
          author_avatar: blog.author.avatar || null,
          reading_time: blog.readTime || '4 min read',
          published: true,
          tags: blog.tags || [],
          related_tools: blog.relatedToolSlugs || [],
        }));
        const retryBlog = await supabase.from('blogs').upsert(legacyBlogRows, { onConflict: 'slug' });
        if (!retryBlog.error) {
          blogErr = null;
        }
      }

      if (blogErr) {
        throw new Error(`Failed to upsert blogs: ${blogErr.message}`);
      }

      onProgress?.('Database sync complete!', 100);

      return {
        success: true,
        message: `Successfully synchronized ${CATEGORIES.length} categories, ${toolRows.length} tools, and ${blogRows.length} blog guides to Supabase!`,
        counts: {
          categories: CATEGORIES.length,
          tools: toolRows.length,
          blogs: blogRows.length,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'An unexpected error occurred during Supabase synchronization.',
      };
    }
  },
};
