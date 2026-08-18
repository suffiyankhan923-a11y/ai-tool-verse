import React, { useState } from 'react';
import { Braces, CheckCircle2, AlertCircle, Copy, Check, Download, Key, ShieldCheck, Link2, FileCode, RefreshCw } from 'lucide-react';

// ================= JSON FORMATTER & VALIDATOR =================
export const JsonFormatter: React.FC = () => {
  const [jsonInput, setJsonInput] = useState(
    '{"site":"ToolVerse","version":2.0,"features":["calculators","converters","formatters"],"secure":true,"stats":{"tools":70,"free":true}}'
  );
  const [formattedOutput, setFormattedOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = (indent = 2) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedOutput(JSON.stringify(parsed, null, indent));
      setErrorMsg(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Invalid JSON format.');
      }
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedOutput(JSON.stringify(parsed));
      setErrorMsg(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Invalid JSON format.');
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedOutput || jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([formattedOutput || jsonInput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'toolverse-formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleFormat(2)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-sm"
          >
            Prettify (2 Spaces)
          </button>
          <button
            type="button"
            onClick={() => handleFormat(4)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            4 Spaces
          </button>
          <button
            type="button"
            onClick={handleMinify}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            Minify JSON
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .json</span>
          </button>
        </div>
      </div>

      {/* Error banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Raw Input JSON
          </span>
          <textarea
            rows={14}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Formatted Output
          </span>
          <textarea
            readOnly
            rows={14}
            value={formattedOutput || jsonInput}
            className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>
    </div>
  );
};

// ================= BASE64 TOOL =================
export const Base64Tool: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('ToolVerse — Fast Everyday Utilities');
  const [copied, setCopied] = useState(false);

  const getResult = () => {
    try {
      if (mode === 'encode') {
        return btoa(unescape(encodeURIComponent(input)));
      } else {
        return decodeURIComponent(escape(atob(input)));
      }
    } catch {
      return 'Error: Invalid Base64 input string.';
    }
  };

  const output = getResult();

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => setMode('encode')}
          className={`px-5 py-2 rounded-xl text-xs font-bold ${
            mode === 'encode' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-100 dark:bg-slate-800'
          }`}
        >
          Text → Base64 Encode
        </button>
        <button
          type="button"
          onClick={() => setMode('decode')}
          className={`px-5 py-2 rounded-xl text-xs font-bold ${
            mode === 'decode' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-100 dark:bg-slate-800'
          }`}
        >
          Base64 → Plain Text Decode
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {mode === 'encode' ? 'Plain Text Input' : 'Base64 Input String'}
          </span>
          <textarea
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {mode === 'encode' ? 'Base64 Encoded Result' : 'Decoded Plain Text'}
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(output);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs text-amber-600 dark:text-amber-400 font-semibold"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            readOnly
            rows={10}
            value={output}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>
    </div>
  );
};

// ================= DEV UTILITIES: UUID & HASH & URL & HTML =================
export const DevUtilities: React.FC<{ toolType: 'uuid' | 'hash' | 'url' | 'html' }> = ({
  toolType,
}) => {
  // UUID State
  const [uuidCount, setUuidCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [uppercaseUuid, setUppercaseUuid] = useState(false);

  // Hash State
  const [hashInput, setHashInput] = useState('ToolVerse 2026');
  const [sha256, setSha256] = useState('');
  const [sha512, setSha512] = useState('');
  const [sha1, setSha1] = useState('');

  // URL / HTML state
  const [urlInput, setUrlInput] = useState('https://toolverse.app/search?category=calculators&query=age calculator');
  const [urlMode, setUrlMode] = useState<'encode' | 'decode'>('encode');

  const [htmlInput, setHtmlInput] = useState('<div class="toolverse">"Fast" & \'Free\'</div>');
  const [htmlMode, setHtmlMode] = useState<'encode' | 'decode'>('encode');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (t: string, key: string) => {
    navigator.clipboard.writeText(t);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate UUIDs
  const generateUuids = () => {
    const list: string[] = [];
    for (let i = 0; i < uuidCount; i++) {
      const rawUuid: string = crypto.randomUUID();
      const finalUuid = uppercaseUuid ? rawUuid.toUpperCase() : rawUuid;
      list.push(finalUuid);
    }
    setUuids(list);
  };

  // Compute Hashes using Web Crypto API
  const computeHashes = async (text: string) => {
    const enc = new TextEncoder();
    const data = enc.encode(text);

    const bufferToHex = (buf: ArrayBuffer) =>
      Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

    try {
      const h256 = await crypto.subtle.digest('SHA-256', data);
      setSha256(bufferToHex(h256));

      const h512 = await crypto.subtle.digest('SHA-512', data);
      setSha512(bufferToHex(h512));

      const h1 = await crypto.subtle.digest('SHA-1', data);
      setSha1(bufferToHex(h1));
    } catch {
      // Fallback
    }
  };

  React.useEffect(() => {
    if (toolType === 'uuid' && uuids.length === 0) {
      generateUuids();
    }
    if (toolType === 'hash') {
      computeHashes(hashInput);
    }
  }, [toolType, hashInput, uuidCount, uppercaseUuid]);

  // URL Encode/Decode
  const urlOutput = urlMode === 'encode' ? encodeURIComponent(urlInput) : decodeURIComponent(urlInput);

  // HTML Entity Encode/Decode
  const htmlOutput =
    htmlMode === 'encode'
      ? htmlInput
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')
      : htmlInput
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'");

  if (toolType === 'uuid') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="text-xs font-semibold text-slate-500">Count:</label>
            <div className="flex gap-1.5">
              {[1, 5, 10, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setUuidCount(num)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    uuidCount === num ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 ml-2 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercaseUuid}
                onChange={(e) => setUppercaseUuid(e.target.checked)}
                className="rounded accent-amber-500"
              />
              <span>UPPERCASE</span>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={generateUuids}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
            <button
              type="button"
              onClick={() => copyText(uuids.join('\n'), 'all')}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400"
            >
              {copiedKey === 'all' ? 'Copied All!' : 'Copy All'}
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-2">
          {uuids.map((u, i) => (
            <div
              key={u + i}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 font-mono text-xs md:text-sm text-slate-900 dark:text-slate-100"
            >
              <span>{u}</span>
              <button
                type="button"
                onClick={() => copyText(u, `u-${i}`)}
                className="p-1 rounded text-slate-400 hover:text-amber-500"
              >
                {copiedKey === `u-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (toolType === 'hash') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            Text / String to Hash
          </label>
          <input
            type="text"
            value={hashInput}
            onChange={(e) => setHashInput(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
          />
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex justify-between items-center text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>SHA-256 (256-bit)</span>
              <button
                type="button"
                onClick={() => copyText(sha256, 'sha256')}
                className="p-1 text-slate-400 hover:text-amber-500"
              >
                {copiedKey === 'sha256' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="font-mono text-xs break-all text-slate-800 dark:text-slate-200">{sha256}</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex justify-between items-center text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>SHA-512 (512-bit)</span>
              <button
                type="button"
                onClick={() => copyText(sha512, 'sha512')}
                className="p-1 text-slate-400 hover:text-amber-500"
              >
                {copiedKey === 'sha512' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="font-mono text-xs break-all text-slate-800 dark:text-slate-200">{sha512}</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex justify-between items-center text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>SHA-1 (Legacy 160-bit)</span>
              <button
                type="button"
                onClick={() => copyText(sha1, 'sha1')}
                className="p-1 text-slate-400 hover:text-amber-500"
              >
                {copiedKey === 'sha1' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="font-mono text-xs break-all text-slate-800 dark:text-slate-200">{sha1}</p>
          </div>
        </div>
      </div>
    );
  }

  // URL / HTML
  const isUrl = toolType === 'url';
  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => (isUrl ? setUrlMode('encode') : setHtmlMode('encode'))}
          className={`px-4 py-2 rounded-xl text-xs font-bold ${
            (isUrl ? urlMode : htmlMode) === 'encode' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800'
          }`}
        >
          Encode
        </button>
        <button
          type="button"
          onClick={() => (isUrl ? setUrlMode('decode') : setHtmlMode('decode'))}
          className={`px-4 py-2 rounded-xl text-xs font-bold ${
            (isUrl ? urlMode : htmlMode) === 'decode' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800'
          }`}
        >
          Decode
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Input String
          </span>
          <textarea
            rows={8}
            value={isUrl ? urlInput : htmlInput}
            onChange={(e) => (isUrl ? setUrlInput(e.target.value) : setHtmlInput(e.target.value))}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Result
            </span>
            <button
              type="button"
              onClick={() => copyText(isUrl ? urlOutput : htmlOutput, 'result')}
              className="text-xs text-amber-600 dark:text-amber-400 font-semibold"
            >
              {copiedKey === 'result' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            readOnly
            rows={8}
            value={isUrl ? urlOutput : htmlOutput}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>
    </div>
  );
};
