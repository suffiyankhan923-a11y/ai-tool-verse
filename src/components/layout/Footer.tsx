import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext.js';
import { Sparkles, Mail, ExternalLink } from 'lucide-react';
import { AdPlaceholder } from '../common/AdPlaceholder.js';

export const Footer: React.FC = () => {
  const { categories } = useData();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-[#FAF7F2] dark:bg-[#111215] border-t border-[#EAE2D5] dark:border-[#2C303B] pt-12 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Ad Placement */}
        <AdPlaceholder location="footer" className="mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#B5824C] to-[#9E6F3B] text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-100" />
              </div>
              <span className="font-bold text-lg text-[#1F1B18] dark:text-[#F7F5F0] tracking-tight font-['Outfit',sans-serif]">
                ToolVerse
              </span>
            </Link>
            <p className="text-sm text-[#756E65] dark:text-[#9E9B96] max-w-sm leading-relaxed">
              The premier online utility and intelligence suite. Providing 30+ instant client-side tools and AI utilities designed with uncompromising speed, elegance, and client privacy.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All ToolVerse Cloud & Client Engines Operational (100% In-Browser Privacy)
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1B18] dark:text-[#F7F5F0] mb-4">
              Tool Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/tools"
                  className="text-[#B5824C] dark:text-[#DFB267] hover:underline transition-colors font-semibold flex items-center gap-1"
                >
                  Explore All 30+ Tools →
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1B18] dark:text-[#F7F5F0] mb-4">
              Resources & Guides
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/blog"
                  className="text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors"
                >
                  Editorial & Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors"
                >
                  Saved Favorites
                </Link>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors inline-flex items-center gap-1"
                >
                  Dynamic XML Sitemap
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors"
                >
                  Admin CMS Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1B18] dark:text-[#F7F5F0] mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors"
                >
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-[#756E65] dark:text-[#9E9B96] hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Box */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          <div>
            <h4 className="text-sm font-bold text-[#1F1B18] dark:text-[#F7F5F0] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#B5824C] dark:text-[#DFB267]" />
              Stay Updated with New Tools & Features
            </h4>
            <p className="text-xs text-[#756E65] dark:text-[#9E9B96] mt-0.5">
              Receive curated insights when new AI utilities, developer toolkits, and productivity guides release.
            </p>
          </div>
          <form onSubmit={handleNewsletter} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-3.5 py-2 text-xs rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C] w-full md:w-64"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] text-white text-xs font-semibold shrink-0 transition-colors cursor-pointer shadow-xs"
            >
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#EAE2D5] dark:border-[#2C303B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#756E65] dark:text-[#9E9B96]">
          <p>© {new Date().getFullYear()} ToolVerse. Crafted with luxury refinement for creators and engineers.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-[#B5824C] dark:hover:text-[#DFB267] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
