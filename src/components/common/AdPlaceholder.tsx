import React from 'react';
import { AdPosition } from '../../types';

interface AdPlaceholderProps {
  position: AdPosition;
  className?: string;
  slotId?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  position,
  className = '',
  slotId = '0000000000',
}) => {
  // Determine height and layout based on standard IAB ad dimensions
  const getDimensionStyles = () => {
    switch (position) {
      case 'leaderboard':
        return 'min-h-[90px] max-w-4xl';
      case 'sidebar':
        return 'min-h-[250px] max-w-[300px]';
      case 'in-content':
      case 'blog-inline':
        return 'min-h-[120px] max-w-3xl';
      case 'bottom-banner':
        return 'min-h-[90px] max-w-4xl';
      default:
        return 'min-h-[90px]';
    }
  };

  return (
    <aside
      id={`ad-slot-${position}`}
      aria-label="Advertisement Area"
      className={`my-6 mx-auto w-full flex flex-col items-center justify-center p-3.5 rounded-xl border border-dashed border-[#D4AF37]/25 bg-[#0F172A]/80 text-center text-xs text-[#64748B] shadow-inner transition-all ${getDimensionStyles()} ${className}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="uppercase tracking-widest text-[10px] font-semibold text-[#D4AF37]">
          Advertisement
        </span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#161E31] text-[#D4AF37]/80 border border-[#D4AF37]/30 font-mono">
          AdSense Ready
        </span>
      </div>
      <div className="w-full flex items-center justify-center py-1">
        <p className="text-[11px] text-[#64748B] italic">
          Google AdSense responsive placement zone ({position} • slot #{slotId})
        </p>
      </div>
    </aside>
  );
};
