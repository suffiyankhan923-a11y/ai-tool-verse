import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead.js';
import { Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 text-center max-w-lg mx-auto space-y-6">
      <SEOHead title="404 - Page Not Found" description="The page you requested does not exist." />
      
      <div className="w-20 h-20 rounded-3xl bg-[#B5824C]/10 dark:bg-[#DFB267]/15 text-[#B5824C] dark:text-[#DFB267] flex items-center justify-center mx-auto text-3xl font-extrabold shadow-sm border border-[#B5824C]/20 font-['Outfit',sans-serif]">
        404
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-[#756E65] dark:text-[#9E9B96]">
          The link you followed may be broken, or the tool or article record was moved or updated.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] text-[#756E65] dark:text-[#9E9B96] text-xs font-semibold hover:bg-[#FAF7F2] dark:hover:bg-[#22252E] transition-colors"
        >
          <Search className="w-4 h-4" />
          Explore Tools
        </Link>
      </div>
    </div>
  );
};
