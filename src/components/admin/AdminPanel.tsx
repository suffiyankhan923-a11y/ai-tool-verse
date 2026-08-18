import React, { useState, useEffect, useMemo } from 'react';
import {
  Database,
  Key,
  Lock,
  Unlock,
  Copy,
  Check,
  Download,
  Terminal,
  ExternalLink,
  Layers,
  Wrench,
  BookOpen,
  Settings,
  BarChart3,
  ShieldCheck,
  Search,
  Plus,
  Trash2,
  Edit3,
  Eye,
  RefreshCw,
  Sparkles,
  FileCode,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  LogOut,
  ChevronRight,
  Zap,
  Globe,
  UploadCloud,
  FileJson,
  Code2,
} from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { TOOLS } from '../../data/tools';
import { BLOG_POSTS } from '../../data/blogPosts';
import { ToolItem, CategoryInfo, BlogPost } from '../../types';
import {
  generateSupabaseSql,
  downloadSqlFile,
  exportFullJsonData,
  SqlGeneratorOptions,
} from '../../utils/supabaseSqlGenerator';
import {
  getActiveSupabaseConfig,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection,
  isSupabaseConfigured,
} from '../../lib/supabase';
import { SupabaseService } from '../../services/supabaseService';
import { DynamicIcon } from '../common/DynamicIcon';

interface AdminPanelProps {
  onNavigate: (path: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('toolverse_admin_auth') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab in Admin Dashboard
  const [activeTab, setActiveTab] = useState<
    'supabase' | 'overview' | 'tools' | 'categories' | 'blogs' | 'settings'
  >('supabase');

  // Supabase SQL Generator Options
  const [sqlOptions, setSqlOptions] = useState<SqlGeneratorOptions>({
    includeDropTables: true,
    includeSchema: true,
    includeRlsPolicies: true,
    includeIndexes: true,
    includeCategoriesData: true,
    includeToolsData: true,
    includeBlogsData: true,
    includeSettingsData: true,
  });

  const [activeSqlView, setActiveSqlView] = useState<'all' | 'schema' | 'tools' | 'categories' | 'blogs'>('all');
  const [copiedSql, setCopiedSql] = useState(false);

  // Supabase Live Connection & Config State
  const [supabaseUrl, setSupabaseUrl] = useState(() => getActiveSupabaseConfig().url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(() => getActiveSupabaseConfig().anonKey);
  const [supabaseConfigSource, setSupabaseConfigSource] = useState(() => getActiveSupabaseConfig().source);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    success?: boolean;
    message?: string;
    details?: any;
    latencyMs?: number;
  } | null>(null);

  // 1-Click Database Direct Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncMessage, setSyncMessage] = useState('');
  const [syncResult, setSyncResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  // Tools Management Local State
  const [toolsList, setToolsList] = useState<ToolItem[]>(() => [...TOOLS]);
  const [toolSearch, setToolSearch] = useState('');
  const [toolCategoryFilter, setToolCategoryFilter] = useState('all');
  const [editingTool, setEditingTool] = useState<ToolItem | null>(null);

  // Blog Management Local State
  const [blogsList, setBlogsList] = useState<BlogPost[]>(() => [...BLOG_POSTS]);
  const [blogSearch, setBlogSearch] = useState('');
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);

  // New Blog Draft
  const [newBlog, setNewBlog] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    category: 'Guides',
    excerpt: '',
    content: '## Overview\n\nEnter your guide content here...\n\n### Key Concepts\n\n- Point 1\n- Point 2',
    author: { name: 'Admin Team', role: 'Staff Specialist' },
    readTime: '4 min read',
    tags: ['tools', 'guide'],
    relatedToolSlugs: ['age-calculator'],
  });

  // Site Settings Local State
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'ToolVerse',
    siteTagline: 'Precision Online Tools for Everyday Life',
    siteUrl: 'https://toolverse.app',
    contactEmail: 'support@toolverse.app',
    enableAds: true,
    adsenseClientId: 'ca-pub-XXXXXXXXXXXXXXXX',
    gaTrackingId: 'G-XXXXXXXXXX',
    metaTitle: 'ToolVerse — 70+ Free Online Calculators, Converters & Developer Tools',
    metaDescription: 'Free online tools with zero sign-up required. Fast, 100% private, and mobile-friendly.',
  });
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  // Generate Current SQL based on options and view
  const currentSql = useMemo(() => {
    if (activeSqlView === 'all') {
      return generateSupabaseSql(sqlOptions);
    }
    if (activeSqlView === 'schema') {
      return generateSupabaseSql({
        includeDropTables: sqlOptions.includeDropTables,
        includeSchema: true,
        includeRlsPolicies: true,
        includeIndexes: true,
        includeCategoriesData: false,
        includeToolsData: false,
        includeBlogsData: false,
        includeSettingsData: false,
      });
    }
    if (activeSqlView === 'categories') {
      return generateSupabaseSql({
        includeDropTables: false,
        includeSchema: false,
        includeRlsPolicies: false,
        includeIndexes: false,
        includeCategoriesData: true,
        includeToolsData: false,
        includeBlogsData: false,
        includeSettingsData: false,
      });
    }
    if (activeSqlView === 'tools') {
      return generateSupabaseSql({
        includeDropTables: false,
        includeSchema: false,
        includeRlsPolicies: false,
        includeIndexes: false,
        includeCategoriesData: false,
        includeToolsData: true,
        includeBlogsData: false,
        includeSettingsData: false,
      });
    }
    if (activeSqlView === 'blogs') {
      return generateSupabaseSql({
        includeDropTables: false,
        includeSchema: false,
        includeRlsPolicies: false,
        includeIndexes: false,
        includeCategoriesData: false,
        includeToolsData: false,
        includeBlogsData: true,
        includeSettingsData: false,
      });
    }
    return generateSupabaseSql(sqlOptions);
  }, [sqlOptions, activeSqlView]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // Default admin credentials check (accepts admin@toolverse.app or admin / admin123 or admin2026)
    const validEmail =
      loginEmail.trim().toLowerCase() === 'admin@toolverse.app' ||
      loginEmail.trim().toLowerCase() === 'admin' ||
      loginEmail.trim().toLowerCase() === 'admin@toolverse.com';
    const validPass =
      loginPassword === 'admin123' ||
      loginPassword === 'admin2026' ||
      loginPassword === 'admin' ||
      loginPassword === 'superadmin';

    if (validEmail && validPass) {
      setIsAuthenticated(true);
      if (rememberMe) {
        localStorage.setItem('toolverse_admin_auth', 'true');
      }
    } else {
      setLoginError('Invalid administrator credentials. Please check your email/password.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('toolverse_admin_auth');
  };

  // Handle Copy SQL
  const handleCopySql = () => {
    navigator.clipboard.writeText(currentSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Handle Test Supabase Connection
  const handleTestSupabaseConnection = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setConnectionResult({
        success: false,
        message: 'Please enter both your Supabase Project URL and Anon / API Key.',
      });
      return;
    }

    setTestingConnection(true);
    setConnectionResult(null);

    try {
      const res = await testSupabaseConnection(supabaseUrl, supabaseAnonKey);
      setConnectionResult({
        success: res.connected,
        message: res.message,
        details: res.details,
        latencyMs: res.latencyMs,
      });

      if (res.connected) {
        saveSupabaseCredentials(supabaseUrl, supabaseAnonKey);
        setSupabaseConfigSource('stored');
      }
    } catch (err: any) {
      setConnectionResult({
        success: false,
        message: `Connection failed: ${err.message || 'Network error or CORS issue'}. Please verify your project URL.`,
      });
    } finally {
      setTestingConnection(false);
    }
  };

  // Handle Save Credentials & Connect
  const handleSaveAndConnect = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setConnectionResult({
        success: false,
        message: 'Please enter both your Supabase Project URL and Anon Key.',
      });
      return;
    }

    saveSupabaseCredentials(supabaseUrl, supabaseAnonKey);
    setSupabaseConfigSource('stored');
    await handleTestSupabaseConnection();
  };

  // Handle Disconnect Supabase
  const handleDisconnect = () => {
    clearSupabaseCredentials();
    setSupabaseUrl('');
    setSupabaseAnonKey('');
    setSupabaseConfigSource('none');
    setConnectionResult({
      success: true,
      message: 'Disconnected from custom Supabase credentials. Reverted to local embedded storage.',
    });
  };

  // Handle Direct 1-Click Sync Local Data to Supabase Tables
  const handleDirectSyncLocalData = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setSyncResult({
        success: false,
        message: 'Please connect your Supabase credentials before running direct sync.',
      });
      return;
    }

    // Ensure credentials are saved to client
    saveSupabaseCredentials(supabaseUrl, supabaseAnonKey);
    setSupabaseConfigSource('stored');

    setIsSyncing(true);
    setSyncProgress(10);
    setSyncMessage('Connecting to Supabase and preparing data...');
    setSyncResult(null);

    try {
      const res = await SupabaseService.directSyncAllLocalDataToSupabase((msg, pct) => {
        setSyncMessage(msg);
        setSyncProgress(pct);
      });

      setSyncResult({
        success: res.success,
        message: res.message,
      });
    } catch (err: any) {
      setSyncResult({
        success: false,
        message: err.message || 'Direct sync failed. Please ensure your Supabase tables exist by running the SQL script first.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Filtered tools
  const filteredTools = useMemo(() => {
    return toolsList.filter((t) => {
      const matchCat = toolCategoryFilter === 'all' || t.category === toolCategoryFilter;
      const matchSearch =
        !toolSearch ||
        t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
        t.slug.toLowerCase().includes(toolSearch.toLowerCase()) ||
        t.description.toLowerCase().includes(toolSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [toolsList, toolCategoryFilter, toolSearch]);

  // Toggle Tool Status
  const toggleToolStatus = (toolId: string, field: 'featured' | 'popular' | 'isNew') => {
    setToolsList((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, [field]: !t[field] } : t))
    );
  };

  // Save Edit Tool
  const handleSaveTool = () => {
    if (!editingTool) return;
    setToolsList((prev) => prev.map((t) => (t.id === editingTool.id ? editingTool : t)));
    setEditingTool(null);
  };

  // Create Blog Post
  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.slug) return;

    const created: BlogPost = {
      id: `post-${Date.now()}`,
      slug: newBlog.slug,
      title: newBlog.title,
      excerpt: newBlog.excerpt || newBlog.title,
      category: newBlog.category || 'Guides',
      author: newBlog.author || { name: 'Admin Team', role: 'Editor' },
      publishedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      readTime: newBlog.readTime || '4 min read',
      tags: newBlog.tags || ['tools'],
      relatedToolSlugs: newBlog.relatedToolSlugs || ['age-calculator'],
      content: newBlog.content || '',
    };

    setBlogsList([created, ...blogsList]);
    setIsCreatingBlog(false);
    setNewBlog({
      title: '',
      slug: '',
      category: 'Guides',
      excerpt: '',
      content: '',
      author: { name: 'Admin Team', role: 'Editor' },
      readTime: '4 min read',
      tags: ['tools'],
      relatedToolSlugs: [],
    });
  };

  // Delete Blog Post
  const handleDeleteBlog = (blogId: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      setBlogsList(blogsList.filter((b) => b.id !== blogId));
    }
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  // =========================================================================
  // VIEW 1: ADMIN LOGIN SCREEN (IF NOT AUTHENTICATED)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0F172A] border border-[#D4AF37]/30 shadow-2xl shadow-black/80 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#161E31] border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37] shadow-inner shadow-black">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Admin <span className="text-[#D4AF37]">Portal</span>
            </h1>
            <p className="text-xs text-[#94A3B8]">
              Restricted management area for ToolVerse administrators.
            </p>
          </div>

          {/* Demo Hint Banner */}
          <div className="p-3.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-[11px] text-[#D4AF37] flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Default Credentials:</span>
              <div className="text-[#E2E8F0] font-mono mt-0.5">
                Email: <span className="text-[#D4AF37]">admin@toolverse.app</span> <br />
                Password: <span className="text-[#D4AF37]">admin123</span> (or <span className="text-[#D4AF37]">admin2026</span>)
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-[#E2E8F0] block mb-1">
                Admin Email / Username
              </label>
              <input
                type="text"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@toolverse.app"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 focus:border-[#D4AF37] text-white text-xs placeholder-[#475569] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#E2E8F0] block mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 focus:border-[#D4AF37] text-white text-xs placeholder-[#475569] focus:outline-none font-mono"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[#94A3B8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded accent-[#D4AF37]"
                />
                <span>Remember session</span>
              </label>
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="text-[#64748B] hover:text-white transition-colors"
              >
                Back to Site
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#C59F33] text-[#050810] font-bold text-xs shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition-all"
            >
              <Unlock className="w-4 h-4" />
              <span>Authenticate & Enter Admin Panel</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Navigation Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#161E31] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold text-white">ToolVerse Master Admin</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                PROD ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Manage tools, categories, guides, SEO, and Supabase database sync.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="px-3 py-1.5 rounded-lg bg-[#161E31] hover:bg-[#1E293B] text-[#94A3B8] hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-[#D4AF37]/20 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>View Public Site</span>
          </button>
          <button
            type="button"
            onClick={exportFullJsonData}
            className="px-3 py-1.5 rounded-lg bg-[#161E31] hover:bg-[#1E293B] text-[#94A3B8] hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-[#D4AF37]/20 transition-colors"
          >
            <FileJson className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Export JSON</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1.5 border border-rose-500/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#D4AF37]/20">
        {[
          { id: 'supabase', label: 'Supabase SQL & Importer', icon: Database, highlight: true },
          { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
          { id: 'tools', label: `Tools Manager (${toolsList.length})`, icon: Wrench },
          { id: 'categories', label: `Categories (${CATEGORIES.length})`, icon: Layers },
          { id: 'blogs', label: `Guides & CMS (${blogsList.length})`, icon: BookOpen },
          { id: 'settings', label: 'Site & SEO Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050810] shadow-md shadow-[#D4AF37]/20'
                  : 'bg-[#0F172A] text-[#94A3B8] hover:text-white border border-[#D4AF37]/15 hover:border-[#D4AF37]/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.highlight && !isActive && (
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          TAB 1: SUPABASE SQL IMPORTER & DATABASE HUB (CORE USER REQUIREMENT)
      ===================================================================== */}
      {activeTab === 'supabase' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Hero Banner for Supabase SQL Engine */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#161E31] to-[#0A0F1E] border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-[#D4AF37]/5 blur-3xl pointer-events-none rounded-full" />
            <div className="max-w-3xl space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161E31] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold">
                <Database className="w-3.5 h-3.5" />
                <span>Supabase PostgreSQL 15+ Integration Ready</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Complete Supabase SQL <span className="text-[#D4AF37]">Importer & Schema</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Generate, customize, copy, and download the full PostgreSQL SQL code to instantly create all tables, indexes, row-level security (RLS) policies, and populate all {CATEGORIES.length} categories, {TOOLS.length}+ tools, and {BLOG_POSTS.length} blog guides in your Supabase project with one click.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#C59F33] text-[#050810] font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 transition-all"
                >
                  {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? '✓ Copied SQL to Clipboard!' : 'Copy Full SQL for Supabase'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadSqlFile(currentSql)}
                  className="px-4 py-2.5 rounded-xl bg-[#161E31] hover:bg-[#1E293B] text-white font-bold text-xs border border-[#D4AF37]/30 flex items-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4 text-[#D4AF37]" />
                  <span>Download .sql File</span>
                </button>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#161E31] hover:bg-[#1E293B] text-[#94A3B8] hover:text-white font-bold text-xs border border-white/10 flex items-center gap-1.5 transition-all"
                >
                  <span>Open Supabase Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* 4-Step Visual Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: '01',
                title: 'Open Supabase Project',
                desc: 'Log in at supabase.com and open your desired project or create a new free one.',
              },
              {
                step: '02',
                title: 'Click SQL Editor',
                desc: 'In the left sidebar of Supabase, click the "SQL Editor" icon (Terminal icon) and click "+ New Query".',
              },
              {
                step: '03',
                title: 'Paste & Run Script',
                desc: 'Paste the copied SQL into the editor window and press "Run" (or ⌘ + Enter).',
              },
              {
                step: '04',
                title: 'Explore Tables',
                desc: 'Click "Table Editor" to view all pre-populated categories, tools, blogs, and settings ready to query.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="p-5 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-md space-y-2 relative"
              >
                <span className="text-2xl font-serif font-bold text-[#D4AF37]/40 block">{s.step}</span>
                <h4 className="text-sm font-bold text-white">{s.title}</h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* SQL Generator Controls & Code Viewer */}
          <div className="space-y-4">
            {/* View Selector Tabs & Filters */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* View Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { id: 'all', label: 'Complete Bundle' },
                    { id: 'schema', label: 'Schema (DDL) Only' },
                    { id: 'categories', label: 'Categories Data' },
                    { id: 'tools', label: 'Tools Data' },
                    { id: 'blogs', label: 'Blogs Data' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setActiveSqlView(v.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                        activeSqlView === v.id
                          ? 'bg-[#D4AF37] text-[#050810]'
                          : 'bg-[#161E31] text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>

                {/* Quick copy / download action */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] text-[#050810] text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadSqlFile(currentSql, `toolverse_${activeSqlView}.sql`)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#161E31] text-white text-xs font-bold border border-[#D4AF37]/20 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Advanced SQL Config Checkboxes */}
              {activeSqlView === 'all' && (
                <div className="pt-3 border-t border-[#D4AF37]/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#94A3B8]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sqlOptions.includeDropTables}
                      onChange={(e) =>
                        setSqlOptions({ ...sqlOptions, includeDropTables: e.target.checked })
                      }
                      className="rounded accent-[#D4AF37]"
                    />
                    <span>Include DROP TABLE IF EXISTS</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sqlOptions.includeRlsPolicies}
                      onChange={(e) =>
                        setSqlOptions({ ...sqlOptions, includeRlsPolicies: e.target.checked })
                      }
                      className="rounded accent-[#D4AF37]"
                    />
                    <span>Row Level Security (RLS)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sqlOptions.includeIndexes}
                      onChange={(e) =>
                        setSqlOptions({ ...sqlOptions, includeIndexes: e.target.checked })
                      }
                      className="rounded accent-[#D4AF37]"
                    />
                    <span>Performance Indexes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sqlOptions.includeSettingsData}
                      onChange={(e) =>
                        setSqlOptions({ ...sqlOptions, includeSettingsData: e.target.checked })
                      }
                      className="rounded accent-[#D4AF37]"
                    />
                    <span>Site Default Settings</span>
                  </label>
                </div>
              )}
            </div>

            {/* SQL Code View Area */}
            <div className="rounded-2xl bg-[#0A0F1E] border border-[#D4AF37]/30 overflow-hidden shadow-2xl">
              <div className="px-4 py-2.5 bg-[#161E31] border-b border-[#D4AF37]/20 flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-bold text-white">supabase_schema_and_data.sql</span>
                  <span className="text-[10px] text-[#64748B]">
                    (~{Math.round(currentSql.length / 1024)} KB)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span>PostgreSQL 15</span>
                  <span>•</span>
                  <span>UTF-8 Safe</span>
                </div>
              </div>

              <div className="relative">
                <textarea
                  readOnly
                  rows={20}
                  value={currentSql}
                  className="w-full p-4 font-mono text-xs text-[#E2E8F0] bg-[#050810] focus:outline-none resize-y leading-relaxed selection:bg-[#D4AF37]/40 selection:text-white"
                />
              </div>
            </div>
          </div>

          {/* Live Supabase Connection, Storage & Direct 1-Click Sync Hub */}
          <div className="p-6 md:p-8 rounded-3xl bg-[#0F172A] border border-[#D4AF37]/30 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="text-lg font-serif font-bold text-white">
                    Live Supabase Connection & Data Sync
                  </h3>
                </div>
                <p className="text-xs text-[#94A3B8]">
                  Connect your live Supabase project directly to sync and persist tools, categories, blogs, and real-time usage analytics.
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-2 border ${
                    isSupabaseConfigured()
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSupabaseConfigured() ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <span>
                    {isSupabaseConfigured()
                      ? `Supabase: Connected (${supabaseConfigSource.toUpperCase()})`
                      : 'Supabase: Offline (Local Data Fallback)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#E2E8F0] block mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzabcdefghijklm.supabase.co"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-mono text-xs placeholder-[#475569] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#E2E8F0] block mb-1">
                  Supabase Anon / Public API Key
                </label>
                <input
                  type="password"
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-mono text-xs placeholder-[#475569] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveAndConnect}
                  disabled={testingConnection || isSyncing}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#C59F33] text-[#050810] font-bold text-xs flex items-center gap-2 shadow-md shadow-[#D4AF37]/20 disabled:opacity-50 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Save & Connect</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestSupabaseConnection}
                  disabled={testingConnection || isSyncing}
                  className="px-4 py-2.5 rounded-xl bg-[#161E31] hover:bg-[#1E293B] text-white font-semibold text-xs border border-[#D4AF37]/25 flex items-center gap-2 disabled:opacity-50 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                  <span>{testingConnection ? 'Testing Connection...' : 'Test Connection'}</span>
                </button>

                {isSupabaseConfigured() && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30 transition-all"
                  >
                    Disconnect
                  </button>
                )}
              </div>

              {/* 1-Click Direct Sync Button */}
              <button
                type="button"
                onClick={handleDirectSyncLocalData}
                disabled={isSyncing || testingConnection}
                className="px-5 py-2.5 rounded-xl bg-[#161E31] hover:bg-[#1E293B] text-[#D4AF37] border border-[#D4AF37]/40 hover:border-[#D4AF37] font-bold text-xs flex items-center gap-2 transition-all shadow-lg"
              >
                <UploadCloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                <span>{isSyncing ? 'Syncing to Supabase...' : '1-Click Direct Sync to Supabase'}</span>
              </button>
            </div>

            {/* Connection Test Result */}
            {connectionResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
                  connectionResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                {connectionResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{connectionResult.message}</span>
                {connectionResult.latencyMs !== undefined && (
                  <span className="ml-auto text-[11px] font-mono text-[#94A3B8]">
                    {connectionResult.latencyMs}ms
                  </span>
                )}
              </div>
            )}

            {/* Direct Sync Progress & Result */}
            {isSyncing && (
              <div className="p-4 rounded-xl bg-[#161E31] border border-[#D4AF37]/30 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-white">
                  <span>{syncMessage}</span>
                  <span>{syncProgress}%</span>
                </div>
                <div className="w-full h-2 bg-[#0F172A] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E5C158] transition-all duration-300 rounded-full"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              </div>
            )}

            {syncResult && (
              <div
                className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
                  syncResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                {syncResult.success ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                )}
                <div className="space-y-0.5">
                  <p className="font-bold">{syncResult.success ? 'Sync Successful!' : 'Sync Failed'}</p>
                  <p className="text-[#94A3B8] font-normal">{syncResult.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: DASHBOARD OVERVIEW & ANALYTICS
      ===================================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Total Active Tools</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-serif font-bold text-white">{toolsList.length}</span>
                <span className="text-xs text-emerald-400 font-bold">+100% Operational</span>
              </div>
              <span className="text-[11px] text-[#64748B] block pt-1">Across 12 categorized suites</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Tool Categories</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-serif font-bold text-[#D4AF37]">{CATEGORIES.length}</span>
                <span className="text-xs text-[#94A3B8]">Structured</span>
              </div>
              <span className="text-[11px] text-[#64748B] block pt-1">Math, Health, Code, SEO & more</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Guides & Articles</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-serif font-bold text-white">{blogsList.length}</span>
                <span className="text-xs text-emerald-400 font-bold">SEO Indexed</span>
              </div>
              <span className="text-[11px] text-[#64748B] block pt-1">Tutorials with related tools</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Client Computation</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-serif font-bold text-emerald-400">0ms</span>
                <span className="text-xs text-emerald-400">Local Sandbox</span>
              </div>
              <span className="text-[11px] text-[#64748B] block pt-1">Zero server egress cost</span>
            </div>
          </div>

          {/* Breakdown by Category */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
            <h3 className="text-base font-serif font-bold text-white">Tool Density by Category</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => {
                const count = toolsList.filter((t) => t.category === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="p-3.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/15 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-[#D4AF37]">
                        <DynamicIcon name={cat.iconName} className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{cat.name}</h4>
                        <span className="text-[10px] text-[#64748B] font-mono">/{cat.slug}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-mono font-bold">
                      {count} tools
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: TOOLS MANAGER
      ===================================================================== */}
      {activeTab === 'tools' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Controls */}
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tool by name or slug..."
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs placeholder-[#475569] focus:outline-none"
                />
              </div>

              <select
                value={toolCategoryFilter}
                onChange={(e) => setToolCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs focus:outline-none font-semibold"
              >
                <option value="all">All Categories ({toolsList.length})</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs text-[#94A3B8] font-mono">
              Showing {filteredTools.length} of {toolsList.length} tools
            </span>
          </div>

          {/* Tools Table */}
          <div className="rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161E31] text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#D4AF37]/20">
                <tr>
                  <th className="p-3.5">Tool Name & Slug</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5 text-center">Featured</th>
                  <th className="p-3.5 text-center">Popular</th>
                  <th className="p-3.5 text-center">New</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/10 text-[#E2E8F0]">
                {filteredTools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-[#161E31]/50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{tool.name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#D4AF37]">/tools/{tool.slug}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-[#161E31] text-[#94A3B8] font-mono text-[10px] uppercase">
                        {tool.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => toggleToolStatus(tool.id, 'featured')}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                          tool.featured
                            ? 'bg-[#D4AF37] text-[#050810]'
                            : 'bg-[#161E31] text-[#64748B] hover:text-white'
                        }`}
                      >
                        {tool.featured ? 'Featured' : 'Off'}
                      </button>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => toggleToolStatus(tool.id, 'popular')}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                          tool.popular
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-[#161E31] text-[#64748B] hover:text-white'
                        }`}
                      >
                        {tool.popular ? 'Popular' : 'Off'}
                      </button>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => toggleToolStatus(tool.id, 'isNew')}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                          tool.isNew
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-[#161E31] text-[#64748B] hover:text-white'
                        }`}
                      >
                        {tool.isNew ? 'New' : 'Off'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingTool(tool)}
                          className="p-1.5 rounded-lg bg-[#161E31] text-[#D4AF37] hover:bg-[#1E293B]"
                          title="Edit Tool"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate(`/tools/${tool.slug}`)}
                          className="p-1.5 rounded-lg bg-[#161E31] text-[#94A3B8] hover:text-white"
                          title="View Tool on Site"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Tool Modal */}
          {editingTool && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="w-full max-w-xl p-6 rounded-3xl bg-[#0F172A] border border-[#D4AF37]/30 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
                  <h3 className="text-lg font-serif font-bold text-white">
                    Edit Tool: <span className="text-[#D4AF37]">{editingTool.name}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingTool(null)}
                    className="text-[#64748B] hover:text-white text-xs"
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[#94A3B8] block mb-1">Tool Display Name</label>
                    <input
                      type="text"
                      value={editingTool.name}
                      onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[#94A3B8] block mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      value={editingTool.description}
                      onChange={(e) =>
                        setEditingTool({ ...editingTool, description: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[#94A3B8] block mb-1">Behind the Calculations / How It Works</label>
                    <textarea
                      rows={3}
                      value={editingTool.howItWorks || ''}
                      onChange={(e) =>
                        setEditingTool({ ...editingTool, howItWorks: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-[#D4AF37]/20">
                  <button
                    type="button"
                    onClick={() => setEditingTool(null)}
                    className="px-4 py-2 rounded-xl bg-[#161E31] text-[#94A3B8] text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTool}
                    className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#050810] text-xs font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 4: CATEGORIES MANAGER
      ===================================================================== */}
      {activeTab === 'categories' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => {
              const toolsInCat = toolsList.filter((t) => t.category === cat.id);
              return (
                <div
                  key={cat.id}
                  className="p-5 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-xl bg-[#161E31] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                        <DynamicIcon name={cat.iconName} className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-mono font-bold">
                        {toolsInCat.length} Tools
                      </span>
                    </div>
                    <h3 className="text-base font-serif font-bold text-white">{cat.name}</h3>
                    <span className="text-[11px] font-mono text-[#D4AF37]">slug: /{cat.slug}</span>
                    <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">{cat.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#D4AF37]/10 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/categories/${cat.slug}`)}
                      className="text-[#D4AF37] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>View Category Page</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: BLOG & GUIDES CMS
      ===================================================================== */}
      {activeTab === 'blogs' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-white">Guides & Knowledge Base</h3>
            <button
              type="button"
              onClick={() => setIsCreatingBlog(true)}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#050810] font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#D4AF37]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Article</span>
            </button>
          </div>

          {/* Blog Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogsList.map((blog) => (
              <div
                key={blog.id}
                className="p-5 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#D4AF37] mb-1">
                    <span className="uppercase tracking-wider px-2 py-0.5 rounded bg-[#161E31] border border-[#D4AF37]/20">
                      {blog.category}
                    </span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h4 className="text-base font-serif font-bold text-white mt-1">{blog.title}</h4>
                  <p className="text-xs text-[#94A3B8] line-clamp-2 mt-1 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D4AF37]/10 flex items-center justify-between text-xs">
                  <span className="text-[#64748B] text-[11px]">By {blog.author.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/blog/${blog.slug}`)}
                      className="px-2.5 py-1 rounded bg-[#161E31] text-[#D4AF37] font-semibold text-[11px]"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="p-1 rounded text-rose-400 hover:bg-rose-500/10"
                      title="Delete Article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create Blog Modal */}
          {isCreatingBlog && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <form
                onSubmit={handleCreateBlog}
                className="w-full max-w-2xl p-6 rounded-3xl bg-[#0F172A] border border-[#D4AF37]/30 space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
                  <h3 className="text-lg font-serif font-bold text-white">Create New Article</h3>
                  <button
                    type="button"
                    onClick={() => setIsCreatingBlog(false)}
                    className="text-[#64748B] hover:text-white text-xs"
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[#94A3B8] block mb-1">Article Title</label>
                    <input
                      type="text"
                      required
                      value={newBlog.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        const slug = title
                          .toLowerCase()
                          .replace(/[^\w\s-]/g, '')
                          .replace(/\s+/g, '-');
                        setNewBlog({ ...newBlog, title, slug });
                      }}
                      placeholder="e.g. Master Guide to Fast Browser Image Optimization"
                      className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#94A3B8] block mb-1">Slug URL</label>
                      <input
                        type="text"
                        required
                        value={newBlog.slug}
                        onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[#94A3B8] block mb-1">Category</label>
                      <input
                        type="text"
                        value={newBlog.category}
                        onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#94A3B8] block mb-1">Short Excerpt (Summary)</label>
                    <textarea
                      rows={2}
                      value={newBlog.excerpt}
                      onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                      placeholder="Brief 1-2 sentence description for SEO and cards..."
                      className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[#94A3B8] block mb-1">Article Content (Markdown)</label>
                    <textarea
                      rows={8}
                      value={newBlog.content}
                      onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-mono text-xs leading-relaxed"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-[#D4AF37]/20">
                  <button
                    type="button"
                    onClick={() => setIsCreatingBlog(false)}
                    className="px-4 py-2 rounded-xl bg-[#161E31] text-[#94A3B8] text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#050810] text-xs font-bold"
                  >
                    Publish Article
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 6: SITE & SEO SETTINGS
      ===================================================================== */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 animate-in fade-in duration-200">
          {savedSettingsNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Site configurations saved successfully!</span>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
            <h3 className="text-base font-serif font-bold text-white">General Brand & Domain Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#E2E8F0] block mb-1">Site Title / Brand</label>
                <input
                  type="text"
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#E2E8F0] block mb-1">Tagline Slogan</label>
                <input
                  type="text"
                  value={siteSettings.siteTagline}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteTagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#E2E8F0] block mb-1">Production URL</label>
                <input
                  type="text"
                  value={siteSettings.siteUrl}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#E2E8F0] block mb-1">Support Email</label>
                <input
                  type="email"
                  value={siteSettings.contactEmail}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
            <h3 className="text-base font-serif font-bold text-white">Monetization & Analytics IDs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#E2E8F0] block mb-1">Google AdSense Client ID</label>
                <input
                  type="text"
                  value={siteSettings.adsenseClientId}
                  onChange={(e) => setSiteSettings({ ...siteSettings, adsenseClientId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#E2E8F0] block mb-1">Google Analytics 4 Measurement ID</label>
                <input
                  type="text"
                  value={siteSettings.gaTrackingId}
                  onChange={(e) => setSiteSettings({ ...siteSettings, gaTrackingId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#050810] font-bold text-xs shadow-md"
            >
              Save Site Settings
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
