import React, { useState } from 'react';
import { Copy, Check, Sparkles, Loader2, RefreshCw, Send } from 'lucide-react';

interface ToolComponentProps {
  slug: string;
  onUse?: () => void;
}

export const AITool: React.FC<ToolComponentProps> = ({ slug, onUse }) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Form states for various AI tools
  const [role, setRole] = useState('Senior Full-Stack Software Engineer');
  const [task, setTask] = useState('Build a clean, high-performance web app with automated SEO');
  const [context, setContext] = useState('Targeting modern web developers and SaaS builders');
  const [tone, setTone] = useState('Professional & Concise');
  const [format, setFormat] = useState('Markdown with step-by-step instructions');

  // Email state
  const [emailPurpose, setEmailPurpose] = useState('Project Milestone Update & Next Steps');
  const [recipient, setRecipient] = useState('Product Lead & Stakeholders');
  const [points, setPoints] = useState('Completed sprint tasks ahead of schedule, deployed to staging, requesting feedback on dashboard');

  // Caption state
  const [captionPlatform, setCaptionPlatform] = useState('Instagram');
  const [captionTopic, setCaptionTopic] = useState('Launching our new developer productivity toolkit today');
  const [mood, setMood] = useState('Inspiring & High Energy');

  // Headline state
  const [headlineTopic, setHeadlineTopic] = useState('Modern Web Development & AI Tools');
  const [headlineAudience, setHeadlineAudience] = useState('Software Engineers & Product Creators');

  // Hashtag state
  const [niche, setNiche] = useState('Web Development & AI Productivity');

  // Product description state
  const [productName, setProductName] = useState('UltraLight Ergonomic Wireless Keyboard');
  const [features, setFeatures] = useState('Machined aluminum body, custom hot-swap switches, 200h battery life, multi-device Bluetooth');
  const [targetCustomer, setTargetCustomer] = useState('Engineers, writers, and digital nomads');

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    if (onUse) onUse();

    let payload: any = {};
    if (slug === 'ai-prompt-generator') {
      payload = { role, task, context, tone, format };
    } else if (slug === 'ai-email-generator') {
      payload = { purpose: emailPurpose, recipient, points, tone };
    } else if (slug === 'ai-caption-generator') {
      payload = { platform: captionPlatform, context: captionTopic, mood };
    } else if (slug === 'ai-headline-generator') {
      payload = { topic: headlineTopic, audience: headlineAudience };
    } else if (slug === 'ai-hashtag-generator') {
      payload = { niche };
    } else if (slug === 'ai-product-description-generator') {
      payload = { productName, features, targetCustomer };
    } else {
      payload = { prompt: task };
    }

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolType: slug, payload })
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.result);
      } else {
        setError(data.error || 'Generation failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Input Form based on tool */}
      <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#89906F]" />
          Configure Input Parameters
        </h3>

        {slug === 'ai-prompt-generator' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Persona / Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-sm text-gray-900 dark:text-gray-100"
                placeholder="e.g. Senior Copywriter, SEO Architect"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Desired Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-sm text-gray-900 dark:text-gray-100"
              >
                <option>Professional & Concise</option>
                <option>Authoritative & Deep</option>
                <option>Engaging & Casual</option>
                <option>Technical & Rigorous</option>
                <option>Persuasive & High Energy</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Primary Objective / Task</label>
              <textarea
                rows={2}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-sm text-gray-900 dark:text-gray-100"
                placeholder="Describe what you want the AI to achieve..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Context & Constraints</label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-sm text-gray-900 dark:text-gray-100"
                placeholder="Key facts, requirements, what to avoid..."
              />
            </div>
          </div>
        )}

        {slug === 'ai-email-generator' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Subject / Purpose</label>
              <input
                type="text"
                value={emailPurpose}
                onChange={(e) => setEmailPurpose(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Recipient & Relationship</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Key Points to Cover</label>
              <textarea
                rows={3}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-sm text-gray-900 dark:text-gray-100"
                placeholder="Bullet points of what needs to be communicated..."
              />
            </div>
          </div>
        )}

        {slug === 'ai-caption-generator' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Social Platform</label>
              <select
                value={captionPlatform}
                onChange={(e) => setCaptionPlatform(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-sm text-gray-900 dark:text-gray-100"
              >
                <option>Instagram</option>
                <option>TikTok</option>
                <option>LinkedIn</option>
                <option>Twitter / X</option>
                <option>YouTube Shorts</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Vibe & Mood</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-sm text-gray-900 dark:text-gray-100"
              >
                <option>Inspiring & High Energy</option>
                <option>Storytelling & Relatable</option>
                <option>Educational & Direct</option>
                <option>Witty & Playful</option>
                <option>Thought Leadership</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Post Context & Topic</label>
              <textarea
                rows={2}
                value={captionTopic}
                onChange={(e) => setCaptionTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        )}

        {slug === 'ai-headline-generator' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Topic / Core Concept</label>
              <input
                type="text"
                value={headlineTopic}
                onChange={(e) => setHeadlineTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Audience</label>
              <input
                type="text"
                value={headlineAudience}
                onChange={(e) => setHeadlineAudience(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        )}

        {slug === 'ai-hashtag-generator' && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Topic / Niche / Industry</label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-sm text-gray-900 dark:text-gray-100"
              placeholder="e.g. Sustainable Fashion, SaaS Marketing, UX Design"
            />
          </div>
        )}

        {slug === 'ai-product-description-generator' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Customer</label>
              <input
                type="text"
                value={targetCustomer}
                onChange={(e) => setTargetCustomer(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Key Specifications & Features</label>
              <textarea
                rows={2}
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-sm text-gray-900 dark:text-gray-100"
                placeholder="List top materials, battery life, benefits..."
              />
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#89906F] hover:bg-[#767D5E] disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-sm active:scale-98 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating with Gemini...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Output
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Panel */}
      {(result || error) && (
        <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
            <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4A373]" />
              Generated Results
            </span>
            {result && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Result
                  </>
                )}
              </button>
            )}
          </div>

          {error ? (
            <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-xl text-sm">
              {error}
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans leading-relaxed bg-[#FAF8F5] dark:bg-[#252824] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              {result}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
