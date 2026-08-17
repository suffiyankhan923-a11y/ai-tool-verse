export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface Tool {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  full_description?: string;
  description?: string; // fallback alias
  category: string;
  category_id?: number;
  category_slug?: string;
  category_name?: string;
  keywords?: string;
  faq?: string; // JSON string of ToolFAQ[]
  features?: string;
  how_to_use?: string;
  icon: string;
  featured?: number; // 0 or 1
  is_featured?: number; // alias
  trending?: number; // 0 or 1
  usage_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category?: string;
  tags: string;
  featured_image?: string;
  cover_image?: string; // alias
  reading_time?: string;
  seo_title?: string;
  seo_description?: string;
  published?: number; // 0 or 1
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
  tool_id?: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface SearchResult {
  type: 'tool' | 'blog' | 'category';
  id: number;
  title: string;
  description: string;
  slug: string;
  category?: string;
  icon?: string;
}
