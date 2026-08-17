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
  AlertCircle,
  Loader2,
  Home
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Invalid credentials or user does not exist in Supabase Auth.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <SEOHead
        title="Admin Login - ToolVerse"
        description="Secure admin access for ToolVerse administrators."
      />

      <div className="w-full max-w-md space-y-6">
        {/* Top Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B5824C] to-[#9E6F3B] text-white shadow-lg shadow-[#B5824C]/20 border border-[#DFB267]/30 mx-auto">
            <ShieldCheck className="w-7 h-7 text-amber-100" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] tracking-tight font-['Outfit',sans-serif]">
            Admin Portal Login
          </h1>
          <p className="text-xs text-[#756E65] dark:text-[#9E9B96]">
            Enter your admin email and password to access the CMS.
          </p>
        </div>

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
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#B5824C] dark:text-[#DFB267] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yourdomain.com"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#B5824C]/15 transition-all cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Public Site */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Back to ToolVerse Home
          </Link>
        </div>
      </div>
    </div>
  );
};

