import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size }) => {
  // Try direct match or fallback to generic Wrench / Sparkles
  const IconComponent = (LucideIcons as Record<string, React.ElementType>)[name] ||
    (LucideIcons as Record<string, React.ElementType>)[name.charAt(0).toUpperCase() + name.slice(1)] ||
    LucideIcons.Wrench;

  return <IconComponent className={className} size={size} />;
};
