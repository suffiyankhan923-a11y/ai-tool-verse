import React from 'react';
import { Sparkles, ShieldCheck, Zap, Heart, Lock } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-[#D4AF37]/10 bg-[#0A0F1E] transition-colors">
      {/* Top Value Strip */}
      <div className="border-b border-[#D4AF37]/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mb-2 shadow-inner">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#E2E8F0] tracking-wide">100% Free Forever</span>
            <span className="text-[11px] text-[#64748B] mt-0.5">No account or credit card needed</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mb-2 shadow-inner">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#E2E8F0] tracking-wide">Local-First Privacy</span>
            <span className="text-[11px] text-[#64748B] mt-0.5">Calculations stay on your device</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mb-2 shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#E2E8F0] tracking-wide">AdSense & SSL Ready</span>
            <span className="text-[11px] text-[#64748B] mt-0.5">High standard ethical utilities</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mb-2 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#E2E8F0] tracking-wide">70+ Precision Tools</span>
            <span className="text-[11px] text-[#64748B] mt-0.5">Continuously updated & calibrated</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('/')}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C6E12] flex items-center justify-center text-[#050810] font-bold shadow-md shadow-black/50">
                <span className="text-[#050810] font-bold text-lg font-serif">T</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-serif">
                Tool<span className="text-[#D4AF37]">Verse</span>
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#94A3B8] max-w-sm leading-relaxed">
              Precision-engineered browser utilities for mathematics, date calculations, conversions, image processing, developer formatting, and everyday productivity.
            </p>
            <div className="flex items-center gap-3 text-xs text-[#64748B]">
              <span>Zero Account Required</span>
              <span>•</span>
              <span className="text-[#D4AF37] font-semibold">100% Client-Side</span>
            </div>
          </div>

          {/* Categories 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-3">
              Popular Tools
            </h4>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li>
                <button type="button" onClick={() => onNavigate('/tools/age-calculator')} className="hover:text-[#D4AF37] transition-colors">
                  Age Calculator
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/tools/percentage-calculator')} className="hover:text-[#D4AF37] transition-colors">
                  Percentage Calculator
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/tools/bmi-calculator')} className="hover:text-[#D4AF37] transition-colors">
                  BMI Calculator
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/tools/loan-calculator')} className="hover:text-[#D4AF37] transition-colors">
                  Loan Calculator
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/tools/word-counter')} className="hover:text-[#D4AF37] transition-colors">
                  Word Counter
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/tools/image-compressor')} className="hover:text-[#D4AF37] transition-colors">
                  Image Compressor
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/tools/qr-code-generator')} className="hover:text-[#D4AF37] transition-colors">
                  QR Code Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Categories 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              {CATEGORIES.slice(0, 7).map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(`/categories/${cat.slug}`)}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/categories')}
                  className="text-[#D4AF37] font-semibold hover:underline"
                >
                  All 12 Categories →
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-3">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li>
                <button type="button" onClick={() => onNavigate('/about')} className="hover:text-[#D4AF37] transition-colors">
                  About ToolVerse
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/blog')} className="hover:text-[#D4AF37] transition-colors">
                  Guides & Blog
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/contact')} className="hover:text-[#D4AF37] transition-colors">
                  Contact & Support
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/privacy-policy')} className="hover:text-[#D4AF37] transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/terms')} className="hover:text-[#D4AF37] transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/disclaimer')} className="hover:text-[#D4AF37] transition-colors">
                  Disclaimer
                </button>
              </li>
              <li className="pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('/admin')}
                  className="text-[#D4AF37] font-bold hover:underline flex items-center gap-1 text-[11px]"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Panel & SQL Hub</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer note */}
        <div className="mt-10 pt-6 border-t border-[#D4AF37]/10 text-[11px] text-[#64748B] leading-relaxed">
          <p>
            <strong>General Disclaimer:</strong> All tools, calculators, and converters on ToolVerse are provided free of charge &ldquo;as is&rdquo; without warranties of any kind. Financial and health calculations are estimates and do not constitute professional advisory or medical diagnosis. Please consult certified professionals for legal, financial, or medical decisions.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© 2026 ToolVerse. Free tools that make everyday tasks easier.</p>
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 rounded-full border border-[#64748B] flex items-center justify-center opacity-60 italic font-serif text-[11px]">
              f
            </div>
            <div className="w-6 h-6 rounded-full border border-[#64748B] flex items-center justify-center opacity-60 font-sans text-[11px]">
              𝕏
            </div>
            <div className="w-6 h-6 rounded-full border border-[#64748B] flex items-center justify-center opacity-60 font-sans font-bold text-[10px]">
              in
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
