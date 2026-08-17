import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Tool, Blog, Category, FAQ, SearchResult } from '../types/index.js';

interface DataContextType {
  tools: Tool[];
  categories: Category[];
  blogs: Blog[];
  faqs: FAQ[];
  loading: boolean;
  error: string | null;
  refreshAll: () => Promise<void>;
  getToolBySlug: (slug: string) => Tool | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
  getBlogBySlug: (slug: string) => Blog | undefined;
  recordToolUsage: (slug: string) => Promise<void>;
  searchEntities: (q: string) => Promise<SearchResult[]>;
  
  // Admin Operations
  createTool: (tool: Partial<Tool>) => Promise<Tool>;
  updateTool: (id: number, tool: Partial<Tool>) => Promise<Tool>;
  deleteTool: (id: number) => Promise<void>;
  
  createBlog: (blog: Partial<Blog>) => Promise<Blog>;
  updateBlog: (id: number, blog: Partial<Blog>) => Promise<Blog>;
  deleteBlog: (id: number) => Promise<void>;

  createCategory: (category: Partial<Category>) => Promise<Category>;
  updateCategory: (id: number, category: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: number) => Promise<void>;

  createFaq: (faq: Partial<FAQ>) => Promise<FAQ>;
  updateFaq: (id: number, faq: Partial<FAQ>) => Promise<FAQ>;
  deleteFaq: (id: number) => Promise<void>;

  resetToDefaultSeeds: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [toolsRes, catRes, blogsRes, faqsRes] = await Promise.all([
        fetch('/api/tools'),
        fetch('/api/categories'),
        fetch('/api/blogs'),
        fetch('/api/faqs')
      ]);

      if (toolsRes.ok) setTools(await toolsRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (blogsRes.ok) setBlogs(await blogsRes.json());
      if (faqsRes.ok) setFaqs(await faqsRes.json());
    } catch (err: any) {
      console.error('Failed to load ToolVerse data:', err);
      setError('Failed to connect to ToolVerse database');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const getToolBySlug = (slug: string) => tools.find(t => t.slug === slug);
  const getCategoryBySlug = (slug: string) => categories.find(c => c.slug === slug);
  const getBlogBySlug = (slug: string) => blogs.find(b => b.slug === slug);

  const recordToolUsage = async (slug: string) => {
    try {
      await fetch(`/api/tools/${slug}/use`, { method: 'POST' });
      setTools(prev => prev.map(t => t.slug === slug ? { ...t, usage_count: (t.usage_count || 0) + 1 } : t));
    } catch (err) {
      console.error('Failed to increment tool usage:', err);
    }
  };

  const searchEntities = async (q: string): Promise<SearchResult[]> => {
    if (!q.trim()) return [];
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        return await res.json();
      }
      return [];
    } catch {
      return [];
    }
  };

  // Admin Tools
  const createTool = async (toolData: Partial<Tool>): Promise<Tool> => {
    const res = await fetch('/api/tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toolData),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to create tool');
    const created: Tool = await res.json();
    setTools(prev => [created, ...prev]);
    return created;
  };

  const updateTool = async (id: number, toolData: Partial<Tool>): Promise<Tool> => {
    const res = await fetch(`/api/tools/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toolData),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to update tool');
    const updated: Tool = await res.json();
    setTools(prev => prev.map(t => t.id === id ? updated : t));
    return updated;
  };

  const deleteTool = async (id: number): Promise<void> => {
    const res = await fetch(`/api/tools/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete tool');
    setTools(prev => prev.filter(t => t.id !== id));
  };

  // Admin Blogs
  const createBlog = async (blogData: Partial<Blog>): Promise<Blog> => {
    const res = await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blogData),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to create blog');
    const created: Blog = await res.json();
    setBlogs(prev => [created, ...prev]);
    return created;
  };

  const updateBlog = async (id: number, blogData: Partial<Blog>): Promise<Blog> => {
    const res = await fetch(`/api/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blogData),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to update blog');
    const updated: Blog = await res.json();
    setBlogs(prev => prev.map(b => b.id === id ? updated : b));
    return updated;
  };

  const deleteBlog = async (id: number): Promise<void> => {
    const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete blog');
    setBlogs(prev => prev.filter(b => b.id !== id));
  };

  // Admin Categories
  const createCategory = async (catData: Partial<Category>): Promise<Category> => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catData),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to create category');
    const created: Category = await res.json();
    setCategories(prev => [...prev, created]);
    return created;
  };

  const updateCategory = async (id: number, catData: Partial<Category>): Promise<Category> => {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catData),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to update category');
    const updated: Category = await res.json();
    setCategories(prev => prev.map(c => c.id === id ? updated : c));
    return updated;
  };

  const deleteCategory = async (id: number): Promise<void> => {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete category');
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Admin FAQs
  const createFaq = async (faqData: Partial<FAQ>): Promise<FAQ> => {
    const res = await fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faqData),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to create FAQ');
    const created: FAQ = await res.json();
    setFaqs(prev => [...prev, created]);
    return created;
  };

  const updateFaq = async (id: number, faqData: Partial<FAQ>): Promise<FAQ> => {
    const res = await fetch(`/api/faqs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faqData),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to update FAQ');
    const updated: FAQ = await res.json();
    setFaqs(prev => prev.map(f => f.id === id ? updated : f));
    return updated;
  };

  const deleteFaq = async (id: number): Promise<void> => {
    const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete FAQ');
    setFaqs(prev => prev.filter(f => f.id !== id));
  };

  const resetToDefaultSeeds = async () => {
    const res = await fetch('/api/admin/reset-db', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset database');
    await fetchAll();
  };

  return (
    <DataContext.Provider value={{
      tools,
      categories,
      blogs,
      faqs,
      loading,
      error,
      refreshAll: fetchAll,
      getToolBySlug,
      getCategoryBySlug,
      getBlogBySlug,
      recordToolUsage,
      searchEntities,
      createTool,
      updateTool,
      deleteTool,
      createBlog,
      updateBlog,
      deleteBlog,
      createCategory,
      updateCategory,
      deleteCategory,
      createFaq,
      updateFaq,
      deleteFaq,
      resetToDefaultSeeds
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
