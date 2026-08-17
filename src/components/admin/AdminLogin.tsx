import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { SEOHead } from '../common/SEOHead.js';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Database,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Home
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const {
    login,
    isSupabaseConfigured,
    supabaseConfig,
    updateSupabaseSettings,
    disconnectSupabase
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Supabase Configuration Drawer / Modal state
  const [showConfig, setShowConfig] = useState(false);
  const [sbUrl, setSbUrl] = useState(supabaseConfig.url || '');
  const [sbKey, setSbKey] = useState(supabaseConfig.anonKey || '');
  const [configTesting, setConfigTesting] = useState(false);
  const [configFeedback, setConfigFeedback] = useState<{ success: boolean; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password, remember);
      if (!res.success) {
        setErrorMsg(res.error || 'Authentication failed. Check your credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@toolverse.com');
    setPassword('admin123');
    setErrorMsg(null);
  };

  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigTesting(true);
    setConfigFeedback(null);

    const res = await updateSupabaseSettings(sbUrl, sbKey);
    setConfigTesting(false);
    setConfigFeedback({
      success: res.success,
      msg: res.message
    });
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <SEOHead
        title="Admin Portal Login - ToolVerse"
        description="Secure management access for ToolVerse administrators."
      />

      <div className="w-full max-w-md space-y-6">
        {/* Top Branding Card */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B5824C] to-[#9E6F3B] text-white shadow-lg shadow-[#B5824C]/20 border border-[#DFB267]/30 mx-auto">
            <ShieldCheck className="w-7 h-7 text-amber-100" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] tracking-tight font-['Outfit',sans-serif]">
            ToolVerse Admin Portal
          </h1>
          <p className="text-xs text-[#756E65] dark:text-[#9E9B96]">
            Secure credentials authentication required for CMS database access.
          </p>
        </div>

        {/* Auth Method Status Badge */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] shadow-xs text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-[#B5824C]'
              }`}
            />
            <span className="font-semibold text-[#1F1B18] dark:text-[#F7F5F0]">
              {isSupabaseConfigured ? 'Supabase Auth' : 'Built-in Super Admin'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="text-[11px] font-semibold text-[#B5824C] dark:text-[#DFB267] hover:underline flex items-center gap-1 cursor-pointer"
          >
            {showConfig ? 'Hide Supabase Config' : 'Supabase Settings'}
            {showConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Supabase Connection Setup Box (Accordion) */}
        {showConfig && (
          <div className="p-5 rounded-3xl bg-[#FAF7F2] dark:bg-[#22252E] border border-[#B5824C]/30 shadow-xs space-y-4 text-xs transition-all">
            <div className="flex items-center gap-2 text-[#B5824C] dark:text-[#DFB267] font-bold">
              <Database className="w-4 h-4" />
              <span>Connect Your Supabase Project (Auth &gt; Users)</span>
            </div>

            <p className="text-[#756E65] dark:text-[#9E9B96] text-[11px] leading-relaxed">
              Connect your Supabase project to authenticate users directly from your Supabase <strong>Authentication &gt; Users</strong> table.
            </p>

            <form onSubmit={handleSaveSupabaseConfig} className="space-y-3">
              <div>
                <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  placeholder="https://xyzproject.supabase.co"
                  value={sbUrl}
                  onChange={(e) => setSbUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-white dark:bg-[#181A20] text-xs text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">
                  Supabase Anon Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={sbKey}
                  onChange={(e) => setSbKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-white dark:bg-[#181A20] text-xs text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                  required
                />
              </div>

              {configFeedback && (
                <div
                  className={`p-3 rounded-xl flex items-start gap-2 text-xs ${
                    configFeedback.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                  }`}
                >
                  {configFeedback.success ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                  <span>{configFeedback.msg}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={configTesting}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {configTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Test &amp; Connect Supabase
                </button>
                {isSupabaseConfigured && (
                  <button
                    type="button"
                    onClick={() => {
                      disconnectSupabase();
                      setSbUrl('');
                      setSbKey('');
                      setConfigFeedback({ success: true, msg: 'Switched back to Built-in Super Admin auth.' });
                    }}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] text-red-600 text-xs font-semibold hover:bg-red-50 cursor-pointer"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </form>

            <div className="pt-2 border-t border-[#EAE2D5]/80 dark:border-[#2C303B]/80 text-[11px] text-[#756E65] dark:text-[#9E9B96] space-y-1">
              <div className="font-semibold text-[#1F1B18] dark:text-[#F7F5F0] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#B5824C] dark:text-[#DFB267]" />
                How to add an Admin in Supabase:
              </div>
              <ol className="list-decimal list-inside space-y-0.5 pl-1">
                <li>Go to Supabase Dashboard &gt; <strong>Authentication</strong> &gt; <strong>Users</strong></li>
                <li>Click <strong>Add user</strong> &gt; <strong>Create user</strong></li>
                <li>Enter user email &amp; password, check <em>Auto Confirm</em></li>
                <li>Log in below with those credentials!</li>
              </ol>
            </div>
          </div>
        )}

        {/* Main Login Form */}
        <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#B5824C] dark:text-[#DFB267] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isSupabaseConfigured ? 'admin@your-supabase-user.com' : 'admin@toolverse.com'}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-xs text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#B5824C] dark:text-[#DFB267] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-xs text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-[#EAE2D5] text-[#B5824C] focus:ring-[#B5824C]"
                />
                <span className="text-[#756E65] dark:text-[#9E9B96] text-xs">Remember session</span>
              </label>

              {!isSupabaseConfigured && (
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-[11px] font-semibold text-[#B5824C] dark:text-[#DFB267] hover:underline cursor-pointer"
                >
                  Fill Default Admin (admin123)
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#B5824C]/15 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin CMS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Default Credentials Note */}
          {!isSupabaseConfigured && (
            <div className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#22252E] border border-[#EAE2D5]/80 dark:border-[#2C303B]/80 text-[11px] text-[#756E65] dark:text-[#9E9B96] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#B5824C] dark:text-[#DFB267]" />
                <span>Default: <code className="font-mono text-[#1F1B18] dark:text-[#F7F5F0]">admin@toolverse.com</code> / <code className="font-mono text-[#1F1B18] dark:text-[#F7F5F0]">admin123</code></span>
              </div>
            </div>
          )}
        </div>

        {/* Back to Public Site */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Back to Public ToolVerse Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
