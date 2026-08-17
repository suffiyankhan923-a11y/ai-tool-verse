import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = "w-5 h-5", size }) => {
  // Normalize icon name
  const LucideIcon = (Icons as any)[name] || Icons.Wrench;
  return <LucideIcon className={className} size={size} />;
};
