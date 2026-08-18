export type CategoryId =
  | 'calculators'
  | 'converters'
  | 'text-tools'
  | 'image-tools'
  | 'developer-tools'
  | 'seo-tools'
  | 'finance-tools'
  | 'date-time'
  | 'productivity'
  | 'health'
  | 'generators'
  | 'file-tools';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  color: string;
  toolCount?: number;
}

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  category: CategoryId;
  description: string;
  longDescription?: string;
  iconName: string;
  keywords: string[];
  featured?: boolean;
  popular?: boolean;
  isNew?: boolean;
  howToSteps?: string[];
  howItWorks?: string;
  exampleScenario?: {
    title: string;
    description: string;
    inputs: Record<string, string>;
    result: string;
  };
  faqs?: ToolFAQ[];
  relatedToolIds?: string[];
  disclaimerType?: 'financial' | 'health' | 'general';
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedDate: string;
  readTime: string;
  coverImage?: string;
  tags: string[];
  relatedToolSlugs: string[];
  content: string; // Markdown or structured sections
  faqs?: ToolFAQ[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  keywords?: string[];
  publishedTime?: string;
  jsonLd?: Record<string, unknown>;
}

export type AdPosition =
  | 'leaderboard'
  | 'in-content'
  | 'sidebar'
  | 'bottom-banner'
  | 'blog-inline';
