import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { ToolItem } from '../../types';
import { DynamicIcon } from './DynamicIcon';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tools: ToolItem[];
  onSelectTool: (slug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  tools,
  onSelectTool,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredTools = useMemo(() => {
    if (!query.trim()) {
      return tools.filter((t) => t.popular || t.featured).slice(0, 8);
    }
    const q = query.toLowerCase().trim();
    return tools.filter((t) => {
      const nameMatch = t.name.toLowerCase().includes(q);
      const descMatch = t.description.toLowerCase().includes(q);
      const catMatch = t.category.toLowerCase().includes(q);
      const keywordMatch = t.keywords.some((k) => k.toLowerCase().includes(q));
      return nameMatch || descMatch || catMatch || keywordMatch;
    }).slice(0, 10);
  }, [query, tools]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredTools.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredTools.length - 1));
    } else if (e.key === 'Enter' && filteredTools[selectedIndex]) {
      e.preventDefault();
      onSelectTool(filteredTools[selectedIndex].slug);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="search-modal-panel"
        className="w-full max-w-2xl bg-[#0A0F1E] rounded-2xl shadow-2xl shadow-black border border-[#D4AF37]/25 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Input */}
        <div className="flex items-center px-5 py-4 border-b border-[#D4AF37]/15 gap-3 bg-[#0F172A]">
          <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            placeholder="Search for a tool (e.g. 'Age Calculator', 'JSON Formatter')..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent border-none text-[#E2E8F0] placeholder-[#475569] focus:outline-none text-sm md:text-base font-normal"
          />
          {query && (
            <button
              type="button"
              id="clear-search-btn"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-[#64748B] hover:text-[#E2E8F0] hover:bg-[#161E31]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[#161E31] text-[#64748B] border border-[#D4AF37]/20">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-1 divide-y-0">
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#D4AF37] flex items-center justify-between">
            <span>{query ? `Search Results (${filteredTools.length})` : 'Popular & Suggested Tools'}</span>
            {!query && <span className="flex items-center gap-1 text-[#D4AF37]"><Sparkles className="w-3 h-3" /> Quick Access</span>}
          </div>

          {filteredTools.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-[#E2E8F0]">
                No tools found matching &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                Try searching for keywords like &ldquo;age&rdquo;, &ldquo;percentage&rdquo;, &ldquo;json&rdquo;, &ldquo;image&rdquo;, or &ldquo;loan&rdquo;.
              </p>
            </div>
          ) : (
            filteredTools.map((tool, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={tool.id}
                  id={`search-result-${tool.slug}`}
                  onClick={() => {
                    onSelectTool(tool.slug);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#161E31] text-white border border-[#D4AF37]/40 shadow-sm'
                      : 'hover:bg-[#161E31]/50 text-[#94A3B8] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                      <DynamicIcon name={tool.iconName} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate text-[#E2E8F0]">
                          {tool.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#161E31] text-[#D4AF37] shrink-0 border border-[#D4AF37]/20 uppercase tracking-wider font-mono">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] truncate mt-0.5">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {isSelected ? (
                      <span className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-[#D4AF37]">
                        <span>Select</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-[#64748B]" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#0F172A] border-t border-[#D4AF37]/15 text-xs text-[#64748B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#161E31] border border-[#D4AF37]/20 text-[10px] text-[#94A3B8]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-[#161E31] border border-[#D4AF37]/20 text-[10px] text-[#94A3B8]">↓</kbd>
              <span className="text-[11px]">Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#161E31] border border-[#D4AF37]/20 text-[10px] text-[#94A3B8]">↵</kbd>
              <span className="text-[11px]">Select</span>
            </span>
          </div>
          <span className="text-[11px] text-[#D4AF37] font-semibold uppercase tracking-wider">
            {tools.length} Free Tools Available
          </span>
        </div>
      </div>
    </div>
  );
};
