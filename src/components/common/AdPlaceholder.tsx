import React from 'react';

interface AdPlaceholderProps {
  location: 'header' | 'sidebar' | 'in-content' | 'footer';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ location, className = "" }) => {
  const configs = {
    header: {
      label: "Top Leaderboard Advertisement (728x90 / Responsive)",
      height: "h-24",
      aspect: "w-full max-w-4xl",
      desc: "Reserved for Google AdSense Responsive Leaderboard"
    },
    sidebar: {
      label: "Sidebar Rectangle Ad (300x250 / 300x600)",
      height: "h-64",
      aspect: "w-full",
      desc: "Reserved for Google AdSense Sticky Sidebar Banner"
    },
    'in-content': {
      label: "In-Article / In-Feed Native Ad (Responsive)",
      height: "h-32",
      aspect: "w-full",
      desc: "Reserved for Google AdSense In-Article Responsive Banner"
    },
    footer: {
      label: "Bottom Anchor Advertisement (Responsive)",
      height: "h-24",
      aspect: "w-full max-w-5xl",
      desc: "Reserved for Google AdSense Bottom Horizontal Banner"
    }
  };

  const config = configs[location];

  return (
    <div
      id={`ad-placeholder-${location}`}
      className={`my-6 mx-auto ${config.aspect} ${config.height} rounded-2xl border border-dashed border-[#B5824C]/30 dark:border-[#DFB267]/25 bg-[#F4ECE1]/40 dark:bg-[#181A20]/60 flex flex-col items-center justify-center p-4 text-center transition-all ${className}`}
    >
      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B5824C]/10 dark:bg-[#DFB267]/15 text-[#B5824C] dark:text-[#DFB267] text-[11px] font-semibold uppercase tracking-wider mb-1 border border-[#B5824C]/15 dark:border-[#DFB267]/20">
        <span>Ad Placement</span>
        <span className="opacity-60">• {location}</span>
      </div>
      <p className="text-xs text-[#756E65] dark:text-[#9E9B96] font-medium">
        {config.label}
      </p>
      <span className="text-[10px] text-[#756E65]/70 dark:text-[#9E9B96]/70 mt-0.5">
        {config.desc}
      </span>
    </div>
  );
};
