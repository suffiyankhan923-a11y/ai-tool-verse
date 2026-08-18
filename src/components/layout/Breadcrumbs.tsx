import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '../../types';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (url: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav
      id="breadcrumb-nav"
      aria-label="Breadcrumb"
      className="flex items-center space-x-2 text-xs md:text-sm text-[#94A3B8] py-3 overflow-x-auto whitespace-nowrap font-mono"
    >
      <button
        type="button"
        id="breadcrumb-home-btn"
        onClick={() => onNavigate('/')}
        className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors focus:outline-none focus:underline"
      >
        <Home className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Home</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={item.url + index}>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
            {isLast ? (
              <span
                id={`breadcrumb-current-${index}`}
                className="font-medium text-[#D4AF37] truncate max-w-[200px] md:max-w-none"
                aria-current="page"
              >
                {item.name}
              </span>
            ) : (
              <button
                type="button"
                id={`breadcrumb-link-${index}`}
                onClick={() => onNavigate(item.url)}
                className="hover:text-[#D4AF37] transition-colors focus:outline-none focus:underline truncate"
              >
                {item.name}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
