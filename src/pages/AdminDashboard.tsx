import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext.js';
import { useAuth } from '../context/AuthContext.js';
import { AdminLogin } from '../components/admin/AdminLogin.js';
import { Tool, Blog, Category, FAQ } from '../types/index.js';
import { RichTextEditor } from '../components/blog/RichTextEditor.js';
import { DynamicIcon } from '../components/common/DynamicIcon.js';
import { SEOHead } from '../components/common/SEOHead.js';
import {
  ShieldCheck,
  Wrench,
  BookOpen,
  Folder,
  HelpCircle,
  Mail,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Save,
  X,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Search,
  Database,
  LogOut,
  Key,
  KeyRound,
  UserCheck,
  Lock,
  Sparkles,
  Loader2,
  Globe,
  Shield,
  Layers,
  Settings,
  Copy,
  Check,
  UploadCloud,
  Code,
  Download
} from 'lucide-react';
import { SUPABASE_SQL_SCHEMA, pushDataToSupabase } from '../lib/supabase.js';

export const AdminDashboard: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
    isSupabaseConfigured,
    supabaseConfig
  } = useAuth();

  const {
    tools,
    categories,
    blogs,
    faqs,
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
    resetToDefaultSeeds,
    refreshAll
  } = useData();

  const [activeTab, setActiveTab] = useState<'tools' | 'blogs' | 'categories' | 'faqs' | 'messages' | 'settings'>('tools');
  const [search, setSearch] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Supabase Database & Sync States
  const [copiedSql, setCopiedSql] = useState(false);
  const [pushingToSupabase, setPushingToSupabase] = useState(false);
  const [pushFeedback, setPushFeedback] = useState<{ success: boolean; msg: string } | null>(null);
  const [showSqlViewer, setShowSqlViewer] = useState(false);

  // Modal / Form States
  const [toolModalOpen, setToolModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [toolForm, setToolForm] = useState({
    name: '',
    slug: '',
    category_id: 1,
    description: '',
    icon: 'Wrench',
    is_featured: 0,
    features: '["100% Free & Client-Side", "Zero Configuration Required"]',
    how_to_use: '["Enter your input.", "Click execute.", "Copy output."]'
  });

  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '# New Article\n\nWrite your content here...',
    author: 'ToolVerse Engineering',
    reading_time: '4 min read',
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tags: 'Engineering, Tools'
  });

  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Folder'
  });

  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    tool_id: undefined as number | undefined
  });

  // Fetch contact messages
  useEffect(() => {
    fetch('/api/contact')
      .then(res => res.ok ? res.json() : [])
      .then(data => setMessages(data))
      .catch(() => {});
  }, [activeTab]);

  const showNotification = (type: 'success' | 'error', msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4000);
  };

  // 1. TOOL ACTIONS
  const handleOpenToolModal = (tool?: Tool) => {
    if (tool) {
      setEditingTool(tool);
      setToolForm({
        name: tool.name,
        slug: tool.slug,
        category_id: tool.category_id,
        description: tool.description,
        icon: tool.icon || 'Wrench',
        is_featured: tool.is_featured,
        features: tool.features,
        how_to_use: tool.how_to_use
      });
    } else {
      setEditingTool(null);
      setToolForm({
        name: '',
        slug: '',
        category_id: categories[0]?.id || 1,
        description: '',
        icon: 'Sparkles',
        is_featured: 0,
        features: '["100% Client-Side Privacy", "Instant Results", "Free Unlimited Usages"]',
        how_to_use: '["Enter or paste your text", "Configure options", "Copy output"]'
      });
    }
    setToolModalOpen(true);
  };

  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const generatedSlug = toolForm.slug || toolForm.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      const payload = { ...toolForm, slug: generatedSlug };

      if (editingTool) {
        await updateTool(editingTool.id, payload);
        showNotification('success', `Tool "${payload.name}" updated successfully.`);
      } else {
        await createTool(payload);
        showNotification('success', `New utility "${payload.name}" created at /tools/${generatedSlug}!`);
      }
      setToolModalOpen(false);
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleDeleteTool = async (id: number, name: string) => {
    if (window.confirm(`Delete tool "${name}" from SQLite database?`)) {
      try {
        await deleteTool(id);
        showNotification('success', `Tool "${name}" removed.`);
      } catch (err: any) {
        showNotification('error', err.message);
      }
    }
  };

  // 2. BLOG ACTIONS
  const handleOpenBlogModal = (blog?: Blog) => {
    if (blog) {
      setEditingBlog(blog);
      setBlogForm({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        author: blog.author,
        reading_time: blog.reading_time,
        cover_image: blog.cover_image,
        tags: blog.tags
      });
    } else {
      setEditingBlog(null);
      setBlogForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '## Guide Overview\n\nIntroduce the utility or concept here...\n\n### Step-by-Step Tutorial\n\n1. First step\n2. Second step\n\n> Pro Tip: Test with sample parameters first.',
        author: 'ToolVerse Engineering',
        reading_time: '5 min read',
        cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        tags: 'Engineering, Tutorial'
      });
    }
    setBlogModalOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const generatedSlug = blogForm.slug || blogForm.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      const payload = { ...blogForm, slug: generatedSlug };

      if (editingBlog) {
        await updateBlog(editingBlog.id, payload);
        showNotification('success', `Article "${payload.title}" updated.`);
      } else {
        await createBlog(payload);
        showNotification('success', `New article "${payload.title}" published at /blog/${generatedSlug}!`);
      }
      setBlogModalOpen(false);
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleDeleteBlog = async (id: number, title: string) => {
    if (window.confirm(`Delete article "${title}"?`)) {
      try {
        await deleteBlog(id);
        showNotification('success', `Article "${title}" deleted.`);
      } catch (err: any) {
        showNotification('error', err.message);
      }
    }
  };

  // 3. CATEGORY ACTIONS
  const handleOpenCatModal = (cat?: Category) => {
    if (cat) {
      setEditingCat(cat);
      setCatForm({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon || 'Folder'
      });
    } else {
      setEditingCat(null);
      setCatForm({
        name: '',
        slug: '',
        description: '',
        icon: 'Folder'
      });
    }
    setCatModalOpen(true);
  };

  const handleSaveCat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const generatedSlug = catForm.slug || catForm.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      const payload = { ...catForm, slug: generatedSlug };

      if (editingCat) {
        await updateCategory(editingCat.id, payload);
        showNotification('success', `Category "${payload.name}" updated.`);
      } else {
        await createCategory(payload);
        showNotification('success', `New category "${payload.name}" created at /category/${generatedSlug}!`);
      }
      setCatModalOpen(false);
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleDeleteCat = async (id: number, name: string) => {
    if (window.confirm(`Delete category "${name}"?`)) {
      try {
        await deleteCategory(id);
        showNotification('success', `Category "${name}" deleted.`);
      } catch (err: any) {
        showNotification('error', err.message);
      }
    }
  };

  // 4. FAQ ACTIONS
  const handleOpenFaqModal = (faq?: FAQ) => {
    if (faq) {
      setEditingFaq(faq);
      setFaqForm({
        question: faq.question,
        answer: faq.answer,
        tool_id: faq.tool_id
      });
    } else {
      setEditingFaq(null);
      setFaqForm({
        question: '',
        answer: '',
        tool_id: undefined
      });
    }
    setFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await updateFaq(editingFaq.id, faqForm);
        showNotification('success', `FAQ item updated.`);
      } else {
        await createFaq(faqForm);
        showNotification('success', `New FAQ item created.`);
      }
      setFaqModalOpen(false);
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleDeleteFaq = async (id: number) => {
    if (window.confirm('Delete this FAQ item?')) {
      try {
        await deleteFaq(id);
        showNotification('success', 'FAQ deleted.');
      } catch (err: any) {
        showNotification('error', err.message);
      }
    }
  };

  const handleResetDb = async () => {
    if (window.confirm('WARNING: This will re-initialize the SQLite database with all initial tools and seed articles. Proceed?')) {
      try {
        await resetToDefaultSeeds();
        showNotification('success', 'SQLite database successfully re-seeded with tools and blogs!');
      } catch (err: any) {
        showNotification('error', err.message);
      }
    }
  };

  const totalToolUses = tools.reduce((acc, t) => acc + (t.usage_count || 0), 0);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handlePushDataToSupabase = async () => {
    setPushingToSupabase(true);
    setPushFeedback(null);
    const result = await pushDataToSupabase({
      categories,
      tools,
      blogs,
      faqs
    });
    setPushingToSupabase(false);
    setPushFeedback({
      success: result.success,
      msg: result.message
    });
  };

  const handleDownloadDataset = () => {
    try {
      const exportPayload = {
        exported_at: new Date().toISOString(),
        project: "ToolVerse",
        version: "1.0.0",
        summary: {
          total_categories: categories.length,
          total_tools: tools.length,
          total_blogs: blogs.length,
          total_faqs: faqs.length
        },
        categories,
        tools: tools.map(t => ({
          ...t,
          faq: typeof t.faq === 'string' ? JSON.parse(t.faq || '[]') : t.faq
        })),
        blogs,
        faqs
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "toolverse-dataset.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showNotification('success', 'ToolVerse dataset downloaded successfully!');
    } catch {
      window.open('/api/admin/export', '_blank');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#B5824C] dark:text-[#DFB267] animate-spin" />
        <p className="text-xs font-semibold text-[#756E65] dark:text-[#9E9B96]">
          Verifying administrator credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="space-y-8">
      <SEOHead title="Admin Dashboard CMS - ToolVerse" description="Database management portal for ToolVerse." />

      {/* Admin Top Header */}
      <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-br from-[#B5824C] to-[#9E6F3B] text-white shadow-xs">
              <ShieldCheck className="w-5 h-5 text-amber-100" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] tracking-tight font-['Outfit',sans-serif]">
              ToolVerse Admin CMS
            </h1>
          </div>
          <p className="text-xs text-[#756E65] dark:text-[#9E9B96] mt-1">
            SQLite Database Management System • Instant Page & Utility Provisioning
          </p>
        </div>

        {/* User Status & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Active Admin Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#22252E] border border-[#EAE2D5] dark:border-[#2C303B] text-xs">
            <div
              className={`w-2 h-2 rounded-full ${
                user?.provider === 'supabase' ? 'bg-emerald-500 animate-pulse' : 'bg-[#B5824C]'
              }`}
            />
            <div className="flex flex-col">
              <span className="font-bold text-[#1F1B18] dark:text-[#F7F5F0] leading-none">
                {user?.email}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Supabase Admin
              </span>
            </div>
          </div>

          <button
            onClick={handleDownloadDataset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#B5824C]/40 bg-[#FAF7F2] dark:bg-[#22252E] text-xs font-bold text-[#B5824C] dark:text-[#DFB267] hover:border-[#B5824C] hover:bg-[#FAF7F2]/80 transition-colors cursor-pointer shadow-2xs"
            title="Download complete dataset as JSON (30 Tools, 5 Categories, 3 Blogs, 5 FAQs)"
          >
            <Download className="w-3.5 h-3.5 text-[#B5824C] dark:text-[#DFB267]" />
            <span>Export JSON ({tools.length} Tools)</span>
          </button>

          <button
            onClick={refreshAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-xs font-semibold text-[#1F1B18] dark:text-[#F7F5F0] hover:border-[#B5824C] transition-colors cursor-pointer"
            title="Sync SQLite Database"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#B5824C] dark:text-[#DFB267]" />
            <span className="hidden sm:inline">Sync</span>
          </button>

          <button
            onClick={handleResetDb}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer"
            title="Reset database to seeds"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Seeds</span>
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer shadow-xs"
            title="Sign out of Admin CMS"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs font-medium flex items-center justify-between shadow-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {notification.msg}
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] p-4 rounded-2xl text-center shadow-xs">
          <span className="block text-2xl font-extrabold text-[#B5824C] dark:text-[#DFB267] font-['Outfit',sans-serif]">{tools.length}</span>
          <span className="text-[11px] text-[#756E65] dark:text-[#9E9B96] font-medium">Active Tools</span>
        </div>
        <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] p-4 rounded-2xl text-center shadow-xs">
          <span className="block text-2xl font-extrabold text-[#C87D65] dark:text-[#E89D86] font-['Outfit',sans-serif]">{categories.length}</span>
          <span className="text-[11px] text-[#756E65] dark:text-[#9E9B96] font-medium">Categories</span>
        </div>
        <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] p-4 rounded-2xl text-center shadow-xs">
          <span className="block text-2xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">{blogs.length}</span>
          <span className="text-[11px] text-[#756E65] dark:text-[#9E9B96] font-medium">Blog Articles</span>
        </div>
        <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] p-4 rounded-2xl text-center shadow-xs">
          <span className="block text-2xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">{faqs.length}</span>
          <span className="text-[11px] text-[#756E65] dark:text-[#9E9B96] font-medium">FAQ Records</span>
        </div>
        <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] p-4 rounded-2xl text-center shadow-xs">
          <span className="block text-2xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">{messages.length}</span>
          <span className="text-[11px] text-[#756E65] dark:text-[#9E9B96] font-medium">Inquiries</span>
        </div>
        <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] p-4 rounded-2xl text-center shadow-xs">
          <span className="block text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-['Outfit',sans-serif]">{totalToolUses}</span>
          <span className="text-[11px] text-[#756E65] dark:text-[#9E9B96] font-medium">Total Executions</span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#EAE2D5] dark:border-[#2C303B] pb-3">
        {[
          { id: 'tools', label: `Tools (${tools.length})`, icon: Wrench },
          { id: 'blogs', label: `Blog Articles (${blogs.length})`, icon: BookOpen },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Folder },
          { id: 'faqs', label: `FAQs (${faqs.length})`, icon: HelpCircle },
          { id: 'messages', label: `Inquiries (${messages.length})`, icon: Mail },
          {
            id: 'settings',
            label: 'Supabase Database & Sync',
            icon: ShieldCheck
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSearch('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#B5824C] text-white shadow-xs'
                  : 'bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] text-[#756E65] dark:text-[#9E9B96] hover:border-[#B5824C]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: TOOLS MANAGER */}
      {activeTab === 'tools' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#B5824C] dark:text-[#DFB267] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-white dark:bg-[#181A20] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
              />
            </div>

            <button
              onClick={() => handleOpenToolModal()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add New Tool
            </button>
          </div>

          <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] dark:bg-[#22252E] border-b border-[#EAE2D5] dark:border-[#2C303B] text-[#756E65] dark:text-[#9E9B96] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Tool</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">URL Slug</th>
                    <th className="p-4">Executions</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D5]/80 dark:divide-[#2C303B]/80">
                  {tools
                    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.slug.includes(search.toLowerCase()))
                    .map((tool) => (
                      <tr key={tool.id} className="hover:bg-[#FAF7F2]/60 dark:hover:bg-[#22252E]/60">
                        <td className="p-4 font-semibold text-[#1F1B18] dark:text-[#F7F5F0] flex items-center gap-2">
                          <DynamicIcon name={tool.icon || 'Wrench'} className="w-4 h-4 text-[#B5824C] dark:text-[#DFB267]" />
                          <span>{tool.name}</span>
                        </td>
                        <td className="p-4 text-[#756E65] dark:text-[#9E9B96]">
                          <span className="px-2 py-0.5 rounded bg-[#FAF7F2] dark:bg-[#22252E] font-medium border border-[#EAE2D5]/60 dark:border-[#2C303B]/60">
                            {tool.category_name || 'Category'}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[#756E65] dark:text-[#9E9B96]">/tools/{tool.slug}</td>
                        <td className="p-4 font-semibold text-[#1F1B18] dark:text-[#F7F5F0]">{tool.usage_count}</td>
                        <td className="p-4">
                          {tool.is_featured === 1 ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#C87D65]/15 text-[#C87D65] dark:text-[#E89D86] font-bold text-[10px] border border-[#C87D65]/20">
                              Featured
                            </span>
                          ) : (
                            <span className="text-[#756E65] dark:text-[#9E9B96] text-[10px]">Standard</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <Link
                            to={`/tools/${tool.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#756E65] hover:text-[#B5824C] dark:hover:text-[#DFB267] inline-block"
                            title="View Live Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenToolModal(tool)}
                            className="p-1.5 text-[#756E65] hover:text-[#B5824C] dark:hover:text-[#DFB267] inline-block cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTool(tool.id, tool.name)}
                            className="p-1.5 text-[#756E65] hover:text-red-500 inline-block cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BLOG CMS MANAGER */}
      {activeTab === 'blogs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#B5824C] dark:text-[#DFB267] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-white dark:bg-[#181A20] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
              />
            </div>

            <button
              onClick={() => handleOpenBlogModal()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Publish New Article
            </button>
          </div>

          <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] dark:bg-[#22252E] border-b border-[#EAE2D5] dark:border-[#2C303B] text-[#756E65] dark:text-[#9E9B96] font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Article Title</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Reading Time</th>
                  <th className="p-4">Published Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D5]/80 dark:divide-[#2C303B]/80">
                {blogs
                  .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
                  .map((blog) => (
                    <tr key={blog.id} className="hover:bg-[#FAF7F2]/60 dark:hover:bg-[#22252E]/60">
                      <td className="p-4 font-semibold text-[#1F1B18] dark:text-[#F7F5F0]">
                        {blog.title}
                        <span className="block font-mono text-[10px] text-[#756E65] dark:text-[#9E9B96]">/blog/{blog.slug}</span>
                      </td>
                      <td className="p-4 text-[#756E65] dark:text-[#9E9B96]">{blog.author}</td>
                      <td className="p-4 text-[#756E65] dark:text-[#9E9B96]">{blog.reading_time}</td>
                      <td className="p-4 text-[#756E65] dark:text-[#9E9B96]">{new Date(blog.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-right space-x-2">
                        <Link
                          to={`/blog/${blog.slug}`}
                          target="_blank"
                          className="p-1.5 text-[#756E65] hover:text-[#B5824C] dark:hover:text-[#DFB267] inline-block"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleOpenBlogModal(blog)}
                          className="p-1.5 text-[#756E65] hover:text-[#B5824C] dark:hover:text-[#DFB267] inline-block cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.id, blog.title)}
                          className="p-1.5 text-[#756E65] hover:text-red-500 inline-block cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES MANAGER */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => handleOpenCatModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add New Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-5 bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-2xl flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl bg-[#B5824C]/10 text-[#B5824C] dark:text-[#DFB267] flex items-center justify-center border border-[#B5824C]/20">
                      <DynamicIcon name={cat.icon || 'Folder'} className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] text-[#756E65] dark:text-[#9E9B96]">/category/{cat.slug}</span>
                  </div>
                  <h3 className="font-bold text-sm text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">{cat.name}</h3>
                  <p className="text-xs text-[#756E65] dark:text-[#9E9B96] mt-1 line-clamp-2">{cat.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EAE2D5]/80 dark:border-[#2C303B]/80 flex items-center justify-between">
                  <Link
                    to={`/category/${cat.slug}`}
                    target="_blank"
                    className="text-xs text-[#B5824C] dark:text-[#DFB267] hover:underline flex items-center gap-1 font-semibold"
                  >
                    View Page <ExternalLink className="w-3 h-3" />
                  </Link>
                  <div className="space-x-1">
                    <button
                      onClick={() => handleOpenCatModal(cat)}
                      className="p-1.5 text-[#756E65] hover:text-[#B5824C] dark:hover:text-[#DFB267] cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCat(cat.id, cat.name)}
                      className="p-1.5 text-[#756E65] hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FAQS MANAGER */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => handleOpenFaqModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add FAQ Record
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="p-5 bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-2xl flex items-start justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#1F1B18] dark:text-[#F7F5F0]">{faq.question}</h4>
                  <p className="text-xs text-[#756E65] dark:text-[#9E9B96] leading-relaxed">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenFaqModal(faq)}
                    className="p-1.5 text-[#756E65] hover:text-[#B5824C] dark:hover:text-[#DFB267] cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-1.5 text-[#756E65] hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INQUIRIES */}
      {activeTab === 'messages' && (
        <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">Contact Submissions ({messages.length})</h3>
          {messages.length === 0 ? (
            <p className="text-xs text-[#756E65] dark:text-[#9E9B96]">No contact submissions received yet.</p>
          ) : (
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#22252E] border border-[#EAE2D5]/80 dark:border-[#2C303B]/80 space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-[#1F1B18] dark:text-[#F7F5F0]">
                    <span>{m.name} ({m.email})</span>
                    <span className="text-[#756E65] dark:text-[#9E9B96] font-normal">{new Date(m.created_at).toLocaleString()}</span>
                  </div>
                  <div className="font-medium text-[#B5824C] dark:text-[#DFB267]">{m.subject}</div>
                  <p className="text-[#756E65] dark:text-[#9E9B96] pt-1">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: SUPABASE DATABASE & SYNC */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Supabase Database Sync & SQL Setup */}
          <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D5]/80 dark:border-[#2C303B]/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">
                    Supabase Database &amp; Tables
                  </h3>
                  <p className="text-[11px] text-[#756E65] dark:text-[#9E9B96]">
                    Synchronize tools, categories, and blogs with your Supabase database
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                Supabase Auth Active
              </span>
            </div>

            {/* Supabase Database Schema & Sync */}
            <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#22252E] border border-[#EAE2D5]/80 dark:border-[#2C303B]/80 text-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-bold text-[#1F1B18] dark:text-[#F7F5F0] flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[#B5824C] dark:text-[#DFB267]" />
                  <span>Turnkey SQL Schema</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] hover:border-[#B5824C] text-[11px] font-semibold text-[#1F1B18] dark:text-[#F7F5F0] transition-colors cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied SQL!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#B5824C]" />
                      <span>Copy SQL Schema</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-[#756E65] dark:text-[#9E9B96] leading-relaxed">
                Run our turnkey SQL schema in your <strong>Supabase SQL Editor</strong> to create all tables (<code>categories</code>, <code>tools</code>, <code>blogs</code>, <code>faqs</code>, <code>contact_messages</code>) with Row Level Security (RLS) policies.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowSqlViewer(!showSqlViewer)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] text-[11px] font-semibold text-[#1F1B18] dark:text-[#F7F5F0] hover:border-[#B5824C] transition-colors cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5 text-[#B5824C]" />
                  <span>{showSqlViewer ? 'Hide SQL Script' : 'Preview SQL Script'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePushDataToSupabase}
                  disabled={pushingToSupabase}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] disabled:opacity-50 text-white font-semibold text-[11px] transition-colors shadow-xs cursor-pointer"
                >
                  {pushingToSupabase ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5" />
                  )}
                  <span>Push All Content to Supabase</span>
                </button>
              </div>

              {showSqlViewer && (
                <div className="mt-3 relative rounded-xl bg-[#111216] border border-[#2C303B] p-3 text-[10px] font-mono text-neutral-300 max-h-48 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{SUPABASE_SQL_SCHEMA}</pre>
                </div>
              )}

              {pushFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                    pushFeedback.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                  }`}
                >
                  {pushFeedback.success ? (
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  )}
                  <span>{pushFeedback.msg}</span>
                </div>
              )}
            </div>

            {/* Step-by-Step Guide */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#22252E] border border-[#EAE2D5]/80 dark:border-[#2C303B]/80 text-xs text-[#756E65] dark:text-[#9E9B96] space-y-2">
              <div className="font-bold text-[#1F1B18] dark:text-[#F7F5F0] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B5824C] dark:text-[#DFB267]" />
                Supabase Sync Guide:
              </div>
              <ol className="list-decimal list-inside space-y-1.5 pl-1 text-[11px] leading-relaxed">
                <li>
                  <strong>Step 1 (Tables):</strong> Click <strong>Copy SQL Schema</strong>, go to your <em>Supabase Dashboard &gt; SQL Editor</em>, paste the script, and click <strong>Run</strong>.
                </li>
                <li>
                  <strong>Step 2 (Content):</strong> Click <strong>Push All Content to Supabase</strong> above to synchronize your tools and articles.
                </li>
                <li>
                  <strong>Step 3 (Admins):</strong> Manage authenticated admins directly in your <em>Supabase Dashboard &gt; Authentication &gt; Users</em>.
                </li>
              </ol>
            </div>
          </div>

          {/* Card 2: Supabase Admin Session Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#EAE2D5]/80 dark:border-[#2C303B]/80">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#B5824C] dark:text-[#DFB267] border border-[#B5824C]/30">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">
                    Current Administrator Session
                  </h3>
                  <p className="text-[11px] text-[#756E65] dark:text-[#9E9B96]">
                    Active Supabase Auth session &amp; privilege verification
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#22252E] border border-[#EAE2D5]/80 dark:border-[#2C303B]/80">
                  <span className="text-[10px] text-[#756E65] dark:text-[#9E9B96] block uppercase tracking-wider font-semibold">Admin Email</span>
                  <span className="font-bold text-[#1F1B18] dark:text-[#F7F5F0] truncate block">{user?.email}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#22252E] border border-[#EAE2D5]/80 dark:border-[#2C303B]/80">
                  <span className="text-[10px] text-[#756E65] dark:text-[#9E9B96] block uppercase tracking-wider font-semibold">Auth Provider</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                    Supabase Auth
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#22252E] border border-[#EAE2D5]/80 dark:border-[#2C303B]/80">
                  <span className="text-[10px] text-[#756E65] dark:text-[#9E9B96] block uppercase tracking-wider font-semibold">Role Level</span>
                  <span className="font-bold text-[#1F1B18] dark:text-[#F7F5F0] block">{user?.role || 'Supabase Administrator'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#22252E] border border-[#EAE2D5]/80 dark:border-[#2C303B]/80">
                  <span className="text-[10px] text-[#756E65] dark:text-[#9E9B96] block uppercase tracking-wider font-semibold">Session Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Authenticated
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#22252E] border border-[#EAE2D5]/80 dark:border-[#2C303B]/80 text-[11px] text-[#756E65] dark:text-[#9E9B96]">
                <span className="text-[10px] block uppercase tracking-wider font-semibold mb-1">User Identifier (UID)</span>
                <code className="font-mono text-[#1F1B18] dark:text-[#F7F5F0] break-all">{user?.id || 'supabase-session-active'}</code>
              </div>
            </div>

            {/* Quick Export / Backup */}
            <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#EAE2D5]/80 dark:border-[#2C303B]/80">
                <div className="p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#22252E] text-[#B5824C] dark:text-[#DFB267] border border-[#EAE2D5] dark:border-[#2C303B]">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">
                    Data Export &amp; Backup
                  </h3>
                  <p className="text-[11px] text-[#756E65] dark:text-[#9E9B96]">
                    Download full application snapshot
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#756E65] dark:text-[#9E9B96] leading-relaxed">
                Export all 30 tools, 5 categories, 3 blog articles, and 5 FAQs in standard JSON format anytime.
              </p>

              <button
                type="button"
                onClick={handleDownloadDataset}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#22252E] border border-[#B5824C]/40 hover:border-[#B5824C] text-[#1F1B18] dark:text-[#F7F5F0] font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#B5824C] dark:text-[#DFB267]" />
                <span>Download Dataset (toolverse-dataset.json)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOOL MODAL */}
      {toolModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#EAE2D5]/80 dark:border-[#2C303B]/80">
              <h3 className="text-lg font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">
                {editingTool ? `Edit Tool: ${editingTool.name}` : 'Create New Utility Record'}
              </h3>
              <button onClick={() => setToolModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTool} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Tool Name</label>
                  <input
                    type="text"
                    required
                    value={toolForm.name}
                    onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })}
                    placeholder="e.g. Markdown Table Generator"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">URL Slug (Auto if empty)</label>
                  <input
                    type="text"
                    value={toolForm.slug}
                    onChange={(e) => setToolForm({ ...toolForm, slug: e.target.value })}
                    placeholder="e.g. markdown-table-generator"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Category</label>
                  <select
                    value={toolForm.category_id}
                    onChange={(e) => setToolForm({ ...toolForm, category_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Lucide Icon Name</label>
                  <input
                    type="text"
                    value={toolForm.icon}
                    onChange={(e) => setToolForm({ ...toolForm, icon: e.target.value })}
                    placeholder="e.g. Code2, Sparkles, FileText"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Featured</label>
                  <select
                    value={toolForm.is_featured}
                    onChange={(e) => setToolForm({ ...toolForm, is_featured: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none"
                  >
                    <option value={0}>Standard (0)</option>
                    <option value={1}>Featured on Home (1)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={toolForm.description}
                  onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })}
                  placeholder="Concise summary for SEO and card view..."
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Features (JSON Array of strings)</label>
                <input
                  type="text"
                  value={toolForm.features}
                  onChange={(e) => setToolForm({ ...toolForm, features: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] font-mono text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">How to Use Steps (JSON Array)</label>
                <input
                  type="text"
                  value={toolForm.how_to_use}
                  onChange={(e) => setToolForm({ ...toolForm, how_to_use: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] font-mono text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EAE2D5]/80 dark:border-[#2C303B]/80">
                <button
                  type="button"
                  onClick={() => setToolModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#22252E] text-[#756E65] dark:text-[#9E9B96] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] text-white font-semibold shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Tool Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOG MODAL WITH RICH TEXT EDITOR */}
      {blogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[92vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#EAE2D5]/80 dark:border-[#2C303B]/80">
              <h3 className="text-lg font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">
                {editingBlog ? `Edit Article: ${editingBlog.title}` : 'Publish New Engineering Article'}
              </h3>
              <button onClick={() => setBlogModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                    placeholder="auto-generated-from-title"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Author</label>
                  <input
                    type="text"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Reading Time</label>
                  <input
                    type="text"
                    value={blogForm.reading_time}
                    onChange={(e) => setBlogForm({ ...blogForm, reading_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={blogForm.tags}
                    onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={blogForm.cover_image}
                  onChange={(e) => setBlogForm({ ...blogForm, cover_image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Excerpt Summary</label>
                <textarea
                  rows={2}
                  required
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                />
              </div>

              {/* Rich-Text Editor */}
              <div>
                <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Article Content (Markdown Supported)</label>
                <RichTextEditor
                  value={blogForm.content}
                  onChange={(val) => setBlogForm({ ...blogForm, content: val })}
                  minHeight="min-h-[260px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EAE2D5]/80 dark:border-[#2C303B]/80">
                <button
                  type="button"
                  onClick={() => setBlogModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#22252E] text-[#756E65] dark:text-[#9E9B96] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] text-white font-semibold shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#EAE2D5]/80 dark:border-[#2C303B]/80">
              <h3 className="text-lg font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">
                {editingCat ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setCatModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCat} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="e.g. Audio Tools"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">URL Slug</label>
                <input
                  type="text"
                  value={catForm.slug}
                  onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                  placeholder="auto-generated-from-name"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Icon Name</label>
                <input
                  type="text"
                  value={catForm.icon}
                  onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}
                  placeholder="e.g. Folder, Volume2, Image"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EAE2D5]/80 dark:border-[#2C303B]/80">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#22252E] text-[#756E65] dark:text-[#9E9B96] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] text-white font-semibold shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ MODAL */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#EAE2D5]/80 dark:border-[#2C303B]/80">
              <h3 className="text-lg font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">
                {editingFaq ? 'Edit FAQ Item' : 'Create New FAQ Item'}
              </h3>
              <button onClick={() => setFaqModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="e.g. Is data stored on the server?"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Answer</label>
                <textarea
                  rows={4}
                  required
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Provide clear, concise explanation..."
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EAE2D5]/80 dark:border-[#2C303B]/80">
                <button
                  type="button"
                  onClick={() => setFaqModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#22252E] text-[#756E65] dark:text-[#9E9B96] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] text-white font-semibold shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
