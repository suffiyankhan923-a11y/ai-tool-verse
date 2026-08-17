import React from 'react';
import { SEOHead } from '../components/common/SEOHead.js';
import { Zap, Lock, Code2, Cpu } from 'lucide-react';
import { AdPlaceholder } from '../components/common/AdPlaceholder.js';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SEOHead
        title="About ToolVerse - The Modern Developer & Utility Platform"
        description="Learn how ToolVerse is built with client-side privacy, SQLite persistence, and modern AI architectures."
      />

      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B5824C] dark:text-[#DFB267] px-3 py-1 rounded-full bg-[#B5824C]/10 dark:bg-[#DFB267]/15 border border-[#B5824C]/20">
          Our Philosophy
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] tracking-tight font-['Outfit',sans-serif]">
          Empowering Builders with Frictionless Utilities
        </h1>
        <p className="text-sm sm:text-base text-[#756E65] dark:text-[#9E9B96] max-w-2xl mx-auto leading-relaxed">
          ToolVerse was founded on a simple principle: software tools should be instant, reliable, respectful of user privacy, and crafted with uncompromising elegance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#B5824C]/15 text-[#B5824C] dark:text-[#DFB267] flex items-center justify-center border border-[#B5824C]/20">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">100% Client-Side Privacy</h3>
          <p className="text-xs text-[#756E65] dark:text-[#9E9B96] leading-relaxed">
            Your PDFs, JSON payloads, images, and texts are processed directly inside your browser sandbox. We never harvest or sell user data.
          </p>
        </div>

        <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#C87D65]/15 text-[#C87D65] dark:text-[#E89D86] flex items-center justify-center border border-[#C87D65]/20">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">Zero Account Friction</h3>
          <p className="text-xs text-[#756E65] dark:text-[#9E9B96] leading-relaxed">
            No signup forms, credit card prompts, or hidden tier limits. Simply load the tool and get your job done in seconds.
          </p>
        </div>

        <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#B5824C]/15 text-[#B5824C] dark:text-[#DFB267] flex items-center justify-center border border-[#B5824C]/20">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">AI-Powered Intelligence</h3>
          <p className="text-xs text-[#756E65] dark:text-[#9E9B96] leading-relaxed">
            Integrated server-side Gemini 2.5 engines to assist creators with copywriting, summarization, prompt crafting, and metadata.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-8 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-[#1F1B18] dark:text-[#F7F5F0] flex items-center gap-2 font-['Outfit',sans-serif]">
          <Code2 className="w-5 h-5 text-[#B5824C] dark:text-[#DFB267]" />
          Engineered for Extreme Speed & Reliability
        </h2>
        <p className="text-xs sm:text-sm text-[#756E65] dark:text-[#9E9B96] leading-relaxed">
          The ToolVerse architecture combines a persistent file-backed SQLite database engine running on Node.js Express with an ultra-lightweight React 19 single-page interface styled with soft luxury aesthetics.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#EAE2D5]/80 dark:border-[#2C303B]/80 text-center">
          <div>
            <span className="block text-2xl font-extrabold text-[#B5824C] dark:text-[#DFB267]">30+</span>
            <span className="text-[11px] text-[#756E65] dark:text-[#9E9B96]">Live Utilities</span>
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-[#C87D65] dark:text-[#E89D86]">100%</span>
            <span className="text-[11px] text-[#756E65] dark:text-[#9E9B96]">Free Access</span>
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-[#B5824C] dark:text-[#DFB267]">0ms</span>
            <span className="text-[11px] text-[#756E65] dark:text-[#9E9B96]">Server Latency (Client)</span>
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-[#C87D65] dark:text-[#E89D86]">24/7</span>
            <span className="text-[11px] text-[#756E65] dark:text-[#9E9B96]">Uptime</span>
          </div>
        </div>
      </div>

      <AdPlaceholder location="in-content" />
    </div>
  );
};
