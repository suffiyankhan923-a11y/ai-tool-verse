import React, { useState, useMemo } from 'react';
import { Type, Copy, Check, Trash2, ArrowUpDown, AlignLeft, Sparkles, FileText } from 'lucide-react';

// ================= WORD COUNTER =================
export const WordCounter: React.FC = () => {
  const [text, setText] = useState(
    'ToolVerse provides fast, browser-based everyday utility tools designed for high performance, accessibility, and complete user privacy. Every calculation is performed locally.'
  );
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const raw = text.trim();
    if (!raw) {
      return {
        words: 0,
        chars: 0,
        charsNoSpace: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
        topKeywords: [],
      };
    }

    const words = raw.split(/\s+/).filter(Boolean);
    const chars = text.length;
    const charsNoSpace = text.replace(/\s+/g, '').length;
    const sentences = raw.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const paragraphs = raw.split(/\n+/).filter((p) => p.trim().length > 0).length;

    // Reading speed: ~200 wpm; Speaking speed: ~130 wpm
    const readingTimeMinutes = (words.length / 200).toFixed(1);
    const speakingTimeMinutes = (words.length / 130).toFixed(1);

    // Keyword density
    const freqMap: Record<string, number> = {};
    const stopwords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'is', 'for', 'that', 'this', 'with', 'on', 'as', 'are', 'it', 'at', 'be', 'by', 'an']);
    words.forEach((w) => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean.length > 2 && !stopwords.has(clean)) {
        freqMap[clean] = (freqMap[clean] || 0) + 1;
      }
    });

    const topKeywords = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k, count]) => ({
        keyword: k,
        count,
        density: ((count / words.length) * 100).toFixed(1),
      }));

    return {
      words: words.length,
      chars,
      charsNoSpace,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
      topKeywords,
    };
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="word-counter-tool" className="space-y-6">
      {/* Live Stats Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-2xl md:text-3xl font-extrabold text-amber-500 font-display">
            {stats.words.toLocaleString()}
          </span>
          <p className="text-[11px] font-semibold text-slate-500 uppercase mt-0.5">Words</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
            {stats.chars.toLocaleString()}
          </span>
          <p className="text-[11px] font-semibold text-slate-500 uppercase mt-0.5">Characters</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
            {stats.charsNoSpace.toLocaleString()}
          </span>
          <p className="text-[11px] font-semibold text-slate-500 uppercase mt-0.5">No Spaces</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
            {stats.sentences}
          </span>
          <p className="text-[11px] font-semibold text-slate-500 uppercase mt-0.5">Sentences</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
            {stats.readingTimeMinutes}m
          </span>
          <p className="text-[11px] font-semibold text-slate-500 uppercase mt-0.5">Reading Time</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
            {stats.speakingTimeMinutes}m
          </span>
          <p className="text-[11px] font-semibold text-slate-500 uppercase mt-0.5">Speaking Time</p>
        </div>
      </div>

      {/* Text Area */}
      <div className="p-4 md:p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Live Text Editor
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setText('')}
              className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 px-2 py-1 rounded"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
        </div>

        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or start typing your content here..."
          className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm md:text-base text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-y leading-relaxed"
        />

        {/* Top Keywords */}
        {stats.topKeywords.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-xs font-semibold text-slate-500 block mb-2">
              Top Keywords & Frequency:
            </span>
            <div className="flex flex-wrap gap-2">
              {stats.topKeywords.map((kw) => (
                <span
                  key={kw.keyword}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <strong className="text-amber-600 dark:text-amber-400">{kw.keyword}</strong>
                  <span className="text-[10px] text-slate-400">({kw.count}x / {kw.density}%)</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ================= CASE CONVERTER =================
export const CaseConverter: React.FC = () => {
  const [input, setInput] = useState('Transform any text into multiple cases instantly');
  const [copiedCase, setCopiedCase] = useState<string | null>(null);

  const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  const toCamelCase = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[A-Z]/, (c) => c.toLowerCase());

  const toPascalCase = (str: string) =>
    str
      .toLowerCase()
      .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, chr) => chr.toUpperCase());

  const toSnakeCase = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, '_');

  const toKebabCase = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, '-');

  const toConstantCase = (str: string) =>
    str
      .toUpperCase()
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, '_');

  const toSentenceCase = (str: string) =>
    str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

  const cases = [
    { name: 'UPPERCASE', val: input.toUpperCase() },
    { name: 'lowercase', val: input.toLowerCase() },
    { name: 'Title Case', val: toTitleCase(input) },
    { name: 'Sentence case', val: toSentenceCase(input) },
    { name: 'camelCase', val: toCamelCase(input) },
    { name: 'PascalCase', val: toPascalCase(input) },
    { name: 'kebab-case', val: toKebabCase(input) },
    { name: 'snake_case', val: toSnakeCase(input) },
    { name: 'CONSTANT_CASE', val: toConstantCase(input) },
  ];

  const handleCopy = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCase(name);
    setTimeout(() => setCopiedCase(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
          Input Text
        </label>
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100"
          placeholder="Type or paste text..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {cases.map((c) => (
          <div
            key={c.name}
            className="p-4 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {c.name}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(c.val, c.name)}
                className="p-1 rounded text-slate-400 hover:text-amber-500"
              >
                {copiedCase === c.name ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-sm font-mono break-all text-slate-800 dark:text-slate-200 line-clamp-3">
              {c.val}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ================= TEXT UTILITIES SUITE =================
export const TextModifier: React.FC<{ toolType: 'duplicates' | 'spaces' | 'reverse' | 'sort' | 'slug' | 'lorem' }> = ({
  toolType,
}) => {
  const [text, setText] = useState(
    'Alpha item\nBeta item\nAlpha item\nDelta item\nCharlie item'
  );
  const [copied, setCopied] = useState(false);

  // Slug options
  const [delimiter, setDelimiter] = useState('-');

  // Lorem options
  const [paragraphsCount, setParagraphsCount] = useState(3);

  const getProcessedText = () => {
    switch (toolType) {
      case 'duplicates': {
        const lines = text.split('\n');
        const unique = Array.from(new Set(lines));
        return unique.join('\n');
      }
      case 'spaces': {
        return text
          .replace(/[ \t]+/g, ' ')
          .replace(/^\s+|\s+$/gm, '')
          .replace(/\n{3,}/g, '\n\n');
      }
      case 'reverse': {
        return text.split('').reverse().join('');
      }
      case 'sort': {
        return text
          .split('\n')
          .sort((a, b) => a.localeCompare(b))
          .join('\n');
      }
      case 'slug': {
        return text
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, delimiter)
          .replace(/^-+|-+$/g, '');
      }
      case 'lorem': {
        const sampleParas = [
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.',
          'Suspendisse potenti. In hac habitasse platea dictumst. Morbi vestibulum volutpat enim. Pellentesque dapibus hendrerit tortor. Praesent egestas tristique nibh. Sed a libero.',
        ];
        return sampleParas.slice(0, paragraphsCount).join('\n\n');
      }
      default:
        return text;
    }
  };

  const output = getProcessedText();

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {toolType === 'slug' && (
        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <label className="text-xs font-semibold text-slate-500">Slug Separator:</label>
          <div className="flex gap-2">
            {['-', '_', '.'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDelimiter(d)}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  delimiter === d ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                &ldquo;{d}&rdquo;
              </button>
            ))}
          </div>
        </div>
      )}

      {toolType === 'lorem' && (
        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <label className="text-xs font-semibold text-slate-500">Paragraphs:</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setParagraphsCount(num)}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  paragraphsCount === num ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {num} {num === 1 ? 'Para' : 'Paras'}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        {toolType !== 'lorem' && (
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Input Text
            </span>
            <textarea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-slate-100"
            />
          </div>
        )}

        {/* Output */}
        <div
          className={`p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-2 ${
            toolType === 'lorem' ? 'lg:col-span-2' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Processed Result
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Output'}</span>
            </button>
          </div>
          <textarea
            readOnly
            rows={8}
            value={output}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>
    </div>
  );
};
