import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext.js';
import { SEOHead } from '../components/common/SEOHead.js';
import { AdPlaceholder } from '../components/common/AdPlaceholder.js';
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Check,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getBlogBySlug, blogs, loading } = useData();
  const [copiedLink, setCopiedLink] = useState(false);

  const blog = slug ? getBlogBySlug(slug) : undefined;
  const relatedBlogs = blogs.filter((b) => b.id !== blog?.id).slice(0, 2);

  if (loading) {
    return (
      <div className="py-20 text-center text-[#756E65] dark:text-[#9E9B96]">
        <div className="w-8 h-8 border-2 border-[#B5824C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading article...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">Article Not Found</h2>
        <p className="text-xs text-[#756E65] dark:text-[#9E9B96]">
          The article you requested could not be located in the database.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] text-white text-xs font-semibold shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Blog Directory
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    image: blog.cover_image,
    author: {
      '@type': 'Person',
      name: blog.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'ToolVerse'
    },
    datePublished: blog.created_at,
    description: blog.excerpt
  };

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      <SEOHead
        title={`${blog.title} - ToolVerse Blog`}
        description={blog.excerpt}
        image={blog.cover_image}
        type="article"
        schema={blogSchema}
      />

      {/* Navigation & Actions */}
      <div className="flex items-center justify-between text-xs text-[#756E65] dark:text-[#9E9B96]">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 hover:text-[#B5824C] dark:hover:text-[#DFB267] font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all guides
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-white dark:bg-[#181A20] font-semibold text-[#756E65] dark:text-[#9E9B96] hover:bg-[#F4ECE1] dark:hover:bg-[#22252E] transition-colors cursor-pointer"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
          {copiedLink ? 'Link Copied!' : 'Share Article'}
        </button>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {blog.tags.split(',').map((tag, i) => (
            <span
              key={i}
              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#B5824C]/10 dark:bg-[#DFB267]/15 text-[#B5824C] dark:text-[#DFB267] border border-[#B5824C]/20"
            >
              {tag.trim()}
            </span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] tracking-tight leading-tight font-['Outfit',sans-serif]">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[#756E65] dark:text-[#9E9B96] pt-2 pb-4 border-b border-[#EAE2D5] dark:border-[#2C303B]">
          <span className="flex items-center gap-1.5 font-medium text-[#1F1B18] dark:text-[#F7F5F0]">
            <User className="w-4 h-4 text-[#B5824C] dark:text-[#DFB267]" />
            {blog.author}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#C87D65] dark:text-[#E89D86]" />
            {blog.reading_time}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#756E65]" />
            {new Date(blog.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Cover Image */}
      {blog.cover_image && (
        <div className="rounded-3xl overflow-hidden shadow-sm border border-[#EAE2D5] dark:border-[#2C303B] max-h-[420px]">
          <img
            src={blog.cover_image}
            alt={blog.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Markdown Content Area */}
      <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="prose max-w-none text-sm sm:text-base text-[#1F1B18] dark:text-[#F7F5F0] leading-relaxed font-sans">
          {blog.content.split('\n\n').map((block, idx) => {
            if (block.startsWith('# ')) {
              return (
                <h1 key={idx} className="text-2xl sm:text-3xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] mt-8 mb-4 font-['Outfit',sans-serif]">
                  {block.replace('# ', '')}
                </h1>
              );
            }
            if (block.startsWith('## ')) {
              return (
                <h2 key={idx} className="text-xl sm:text-2xl font-bold text-[#1F1B18] dark:text-[#F7F5F0] mt-6 mb-3 font-['Outfit',sans-serif]">
                  {block.replace('## ', '')}
                </h2>
              );
            }
            if (block.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-lg sm:text-xl font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mt-4 mb-2 font-['Outfit',sans-serif]">
                  {block.replace('### ', '')}
                </h3>
              );
            }
            if (block.startsWith('> ')) {
              return (
                <blockquote
                  key={idx}
                  className="border-l-4 border-[#B5824C] dark:border-[#DFB267] pl-4 py-1 italic bg-[#FAF7F2] dark:bg-[#22252E] rounded-r-xl my-4 text-[#756E65] dark:text-[#9E9B96]"
                >
                  {block.replace('> ', '')}
                </blockquote>
              );
            }
            if (block.startsWith('```')) {
              return (
                <pre key={idx} className="p-4 bg-[#111215] text-[#FAF7F2] rounded-xl text-xs sm:text-sm overflow-x-auto my-4 font-mono border border-[#2C303B]">
                  <code>{block.replace(/```[a-z]*\n?/g, '')}</code>
                </pre>
              );
            }
            if (block.startsWith('- ')) {
              const items = block.split('\n- ').map(i => i.replace(/^- /, ''));
              return (
                <ul key={idx} className="list-disc pl-5 space-y-1.5 my-3 text-[#756E65] dark:text-[#9E9B96]">
                  {items.map((item, itemIdx) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={idx} className="leading-relaxed my-3 text-[#1F1B18] dark:text-[#F7F5F0]">
                {block}
              </p>
            );
          })}
        </div>
      </div>

      {/* In-Content Native Ad Placement */}
      <AdPlaceholder location="in-content" />

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <div className="space-y-4 pt-6">
          <h3 className="text-xl font-bold text-[#1F1B18] dark:text-[#F7F5F0] flex items-center gap-2 font-['Outfit',sans-serif]">
            <BookOpen className="w-5 h-5 text-[#B5824C] dark:text-[#DFB267]" />
            Continue Reading
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedBlogs.map((rel) => (
              <Link
                key={rel.id}
                to={`/blog/${rel.slug}`}
                className="p-5 rounded-2xl bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] hover:border-[#B5824C] dark:hover:border-[#DFB267] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#B5824C] dark:text-[#DFB267]">{rel.tags.split(',')[0]}</span>
                  <h4 className="text-sm font-bold text-[#1F1B18] dark:text-[#F7F5F0] mt-1 line-clamp-2 font-['Outfit',sans-serif]">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-[#756E65] dark:text-[#9E9B96] mt-1 line-clamp-2">{rel.excerpt}</p>
                </div>
                <span className="text-xs font-semibold text-[#B5824C] dark:text-[#DFB267] mt-3 flex items-center gap-1">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
