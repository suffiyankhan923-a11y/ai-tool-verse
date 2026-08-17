import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'softwareApplication';
  canonicalUrl?: string;
  schema?: Record<string, any>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = "ToolVerse - 30+ Free Online AI, Developer, Writing, Image & PDF Tools",
  description = "Access 30+ instant, free, client-side and AI-powered utilities for developers, writers, designers, and creators without sign-up.",
  keywords = "online tools, free developer tools, ai tools, pdf merger, json formatter, qr code generator, word counter",
  image = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  type = "website",
  canonicalUrl,
  schema
}) => {
  useEffect(() => {
    const fullTitle = title.includes("ToolVerse") ? title : `${title} | ToolVerse`;
    document.title = fullTitle;

    // Helper to set or create meta tag
    const setMeta = (nameAttr: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:type', type);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    // Canonical link
    const currUrl = canonicalUrl || window.location.href;
    setMeta('property', 'og:url', currUrl);

    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', currUrl);

    // JSON-LD Schema
    let scriptEl = document.getElementById('json-ld-schema');
    if (schema) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = 'json-ld-schema';
        scriptEl.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schema);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [title, description, keywords, image, type, canonicalUrl, schema]);

  return null;
};
