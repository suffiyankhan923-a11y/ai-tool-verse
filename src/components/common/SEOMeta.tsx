import React, { useEffect } from 'react';
import { SEOMetadata } from '../../types';

export const SEOMeta: React.FC<SEOMetadata> = ({
  title,
  description,
  canonicalUrl = 'https://toolverse.app/',
  ogType = 'website',
  keywords = [],
  publishedTime,
  jsonLd,
}) => {
  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title.includes('ToolVerse') ? title : `${title} — ToolVerse`;
    document.title = formattedTitle;

    // 2. Helper to set or update meta tag
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      let element = isProperty
        ? document.querySelector(`meta[property="${name}"]`)
        : document.querySelector(`meta[name="${name}"]`);

      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('description', description);
    setMetaTag('og:title', formattedTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('twitter:title', formattedTitle);
    setMetaTag('twitter:description', description);

    if (keywords.length > 0) {
      setMetaTag('keywords', keywords.join(', '));
    }

    if (publishedTime) {
      setMetaTag('article:published_time', publishedTime, true);
    }

    // 3. Update Canonical Tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // 4. Inject JSON-LD Structured Data
    if (jsonLd) {
      const scriptId = 'seo-structured-data';
      let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    }
  }, [title, description, canonicalUrl, ogType, keywords, publishedTime, jsonLd]);

  return null;
};
