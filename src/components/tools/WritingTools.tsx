import React, { useState, useMemo } from 'react';
import { Copy, Check, Trash2, ArrowRightLeft, Sparkles, Loader2 } from 'lucide-react';

interface WritingToolProps {
  slug: string;
  onUse?: () => void;
}

export const WritingTool: React.FC<WritingToolProps> = ({ slug, onUse }) => {
  const [text, setText] = useState<string>(
    "ToolVerse gives creators, software developers, and professionals instant access to over 30 free utilities designed for high performance, maximum security, and rapid productivity."
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [readingWpm, setReadingWpm] = useState<number>(225);
  const [speakingWpm, setSpeakingWpm] = useState<number>(135);

  // Summarizer & Grammar state
  const [summaryDetail, setSummaryDetail] = useState<string>('Bullet Points');
  const [aiResult, setAiResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Computed metrics
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const charsTotal = text.length;
    const charsNoSpaces = text.replace(/\s+/g, '').length;
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || [trimmed]).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
    const avgWordLength = wordCount > 0 ? (charsNoSpaces / wordCount).toFixed(1) : "0";

    const readingMinutes = wordCount / readingWpm;
    const readingSecs = Math.round(readingMinutes * 60);
    const speakingMinutes = wordCount / speakingWpm;
    const speakingSecs = Math.round(speakingMinutes * 60);

    return {
      charsTotal,
      charsNoSpaces,
      wordCount,
      sentences,
      paragraphs,
      avgWordLength,
      readingTime: readingSecs < 60 ? `${readingSecs} sec` : `${Math.floor(readingSecs / 60)}m ${readingSecs % 60}s`,
      speakingTime: speakingSecs < 60 ? `${speakingSecs} sec` : `${Math.floor(speakingSecs / 60)}m ${speakingSecs % 60}s`,
    };
  }, [text, readingWpm, speakingWpm]);

  const handleCopy = (contentToCopy = text) => {
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCaseChange = (type: string) => {
    if (onUse) onUse();
    let converted = text;
    switch (type) {
      case 'uppercase':
        converted = text.toUpperCase();
        break;
      case 'lowercase':
        converted = text.toLowerCase();
        break;
      case 'titlecase':
        converted = text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase());
        break;
      case 'sentencecase':
        converted = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case 'camelcase':
        converted = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
        break;
      case 'pascalcase':
        const camel = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
        converted = camel.charAt(0).toUpperCase() + camel.slice(1);
        break;
      case 'snakecase':
        converted = text.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        break;
      case 'kebabcase':
        converted = text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
        break;
      case 'constantcase':
        converted = text.trim().toUpperCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        break;
      case 'alternating':
        converted = text.split('').map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join('');
        break;
    }
    setText(converted);
  };

  const handleAIWritingAction = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setAiResult('');
    if (onUse) onUse();

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: slug,
          payload: { text, lengthStyle: summaryDetail }
        })
      });
      const data = await res.json();
      setAiResult(data.result || 'Analysis complete');
    } catch (err: any) {
      setAiResult('Error processing text: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Statistics Ribbon for Word Counter / Character Counter */}
      {(slug === 'word-counter' || slug === 'character-counter' || slug === 'reading-time-calculator') && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 p-3.5 rounded-xl text-center">
            <span className="block text-2xl font-extrabold text-[#89906F] dark:text-[#9DA681]">{stats.wordCount}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Words</span>
          </div>
          <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 p-3.5 rounded-xl text-center">
            <span className="block text-2xl font-extrabold text-[#D4A373]">{stats.charsTotal}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Characters</span>
          </div>
          <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 p-3.5 rounded-xl text-center">
            <span className="block text-2xl font-extrabold text-gray-800 dark:text-gray-200">{stats.charsNoSpaces}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">No Spaces</span>
          </div>
          <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 p-3.5 rounded-xl text-center">
            <span className="block text-2xl font-extrabold text-gray-800 dark:text-gray-200">{stats.sentences}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Sentences</span>
          </div>
          <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 p-3.5 rounded-xl text-center">
            <span className="block text-2xl font-extrabold text-gray-800 dark:text-gray-200">{stats.paragraphs}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Paragraphs</span>
          </div>
          <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 p-3.5 rounded-xl text-center">
            <span className="block text-2xl font-extrabold text-gray-800 dark:text-gray-200">{stats.readingTime}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Reading Time</span>
          </div>
        </div>
      )}

      {/* Main Text Input Area */}
      <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-800">
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Input Text
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setText('')}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Clear text"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleCopy(text)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <textarea
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#89906F]"
        />

        {/* Character Limit Meters for Character Counter */}
        {slug === 'character-counter' && (
          <div className="mt-6 space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Platform Limits</h4>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span>Twitter / X (280 max)</span>
                  <span className={stats.charsTotal > 280 ? 'text-red-500 font-bold' : ''}>{stats.charsTotal} / 280</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stats.charsTotal > 280 ? 'bg-red-500' : 'bg-[#89906F]'}`}
                    style={{ width: `${Math.min(100, (stats.charsTotal / 280) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span>Google Meta Description (160 max)</span>
                  <span className={stats.charsTotal > 160 ? 'text-amber-500 font-bold' : ''}>{stats.charsTotal} / 160</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stats.charsTotal > 160 ? 'bg-amber-500' : 'bg-[#D4A373]'}`}
                    style={{ width: `${Math.min(100, (stats.charsTotal / 160) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span>Instagram Bio (150 max)</span>
                  <span className={stats.charsTotal > 150 ? 'text-red-500 font-bold' : ''}>{stats.charsTotal} / 150</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stats.charsTotal > 150 ? 'bg-red-500' : 'bg-[#89906F]'}`}
                    style={{ width: `${Math.min(100, (stats.charsTotal / 150) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Speed Controls for Reading Time Calculator */}
        {slug === 'reading-time-calculator' && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Silent Reading Speed: {readingWpm} WPM
              </label>
              <input
                type="range"
                min="100"
                max="450"
                step="5"
                value={readingWpm}
                onChange={(e) => setReadingWpm(Number(e.target.value))}
                className="w-full accent-[#89906F]"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Slow (150)</span>
                <span>Average (225)</span>
                <span>Fast (350+)</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Speaking Pace: {speakingWpm} WPM
              </label>
              <input
                type="range"
                min="80"
                max="220"
                step="5"
                value={speakingWpm}
                onChange={(e) => setSpeakingWpm(Number(e.target.value))}
                className="w-full accent-[#D4A373]"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Slow Speech (100)</span>
                <span>Keynote (135)</span>
                <span>Fast (180)</span>
              </div>
            </div>
          </div>
        )}

        {/* Case Converter Controls */}
        {slug === 'case-converter' && (
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              Transform Text Case
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'UPPERCASE', type: 'uppercase' },
                { label: 'lowercase', type: 'lowercase' },
                { label: 'Title Case', type: 'titlecase' },
                { label: 'Sentence case', type: 'sentencecase' },
                { label: 'camelCase', type: 'camelcase' },
                { label: 'PascalCase', type: 'pascalcase' },
                { label: 'snake_case', type: 'snakecase' },
                { label: 'kebab-case', type: 'kebabcase' },
                { label: 'CONSTANT_CASE', type: 'constantcase' },
                { label: 'aLtErNaTiNg', type: 'alternating' },
              ].map((btn) => (
                <button
                  key={btn.type}
                  onClick={() => handleCaseChange(btn.type)}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] hover:bg-[#89906F] hover:text-white dark:hover:bg-[#89906F] text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* AI Action Trigger for Summarizer and Grammar Checker */}
        {(slug === 'text-summarizer' || slug === 'grammar-checker') && (
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
            {slug === 'text-summarizer' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Format:</span>
                <select
                  value={summaryDetail}
                  onChange={(e) => setSummaryDetail(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-xs text-gray-900 dark:text-gray-100"
                >
                  <option>Bullet Points</option>
                  <option>Executive Paragraph</option>
                  <option>1-Sentence TL;DR</option>
                </select>
              </div>
            )}
            <button
              onClick={handleAIWritingAction}
              disabled={loading || !text.trim()}
              className="ml-auto inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#89906F] hover:bg-[#767D5E] disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  {slug === 'text-summarizer' ? 'Summarize Text' : 'Check Grammar & Style'}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* AI Result Card */}
      {aiResult && (
        <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4A373]" />
              Analysis Result
            </h4>
            <button
              onClick={() => handleCopy(aiResult)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              <Copy className="w-3 h-3" />
              Copy Output
            </button>
          </div>
          <div className="prose dark:prose-invert max-w-none text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap bg-[#FAF8F5] dark:bg-[#252824] p-4 rounded-xl border border-gray-200 dark:border-gray-700 font-sans">
            {aiResult}
          </div>
        </div>
      )}
    </div>
  );
};
