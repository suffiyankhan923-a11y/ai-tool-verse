import React, { useState, useEffect } from 'react';
import { Copy, Check, Download, RefreshCw, ShieldCheck, ShieldAlert, KeyRound } from 'lucide-react';

interface DeveloperToolProps {
  slug: string;
  onUse?: () => void;
}

export const DeveloperTool: React.FC<DeveloperToolProps> = ({ slug, onUse }) => {
  const [copied, setCopied] = useState(false);

  // JSON Formatter state
  const [jsonInput, setJsonInput] = useState('{\n  "name": "ToolVerse",\n  "version": "1.0.0",\n  "features": ["AI Tools", "Developer Utilities", "SEO Automation"],\n  "status": "ready"\n}');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [indent, setIndent] = useState<number | string>(2);

  // Base64 & URL states
  const [textInput, setTextInput] = useState('Welcome to ToolVerse - Modern Developer Toolkit');
  const [textOutput, setTextOutput] = useState('');
  const [isUrlSafe, setIsUrlSafe] = useState(false);
  const [decodedImagePreview, setDecodedImagePreview] = useState<string | null>(null);

  // Password Generator state
  const [passLength, setPassLength] = useState(18);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [bulkList, setBulkList] = useState<string[]>([]);

  // Initial Password Generator Run
  useEffect(() => {
    if (slug === 'password-generator') {
      generatePasswords();
    }
  }, [slug]);

  // JSON formatting logic
  useEffect(() => {
    if (slug === 'json-formatter') {
      try {
        if (!jsonInput.trim()) {
          setJsonOutput('');
          setJsonError(null);
          return;
        }
        const parsed = JSON.parse(jsonInput);
        const indentVal = indent === 'tab' ? '\t' : Number(indent);
        setJsonOutput(JSON.stringify(parsed, null, indentVal));
        setJsonError(null);
      } catch (err: any) {
        setJsonError(err.message);
      }
    }
  }, [jsonInput, indent, slug]);

  // Base64 and URL encoding/decoding logic
  useEffect(() => {
    if (slug === 'base64-encoder') {
      try {
        let b64 = btoa(unescape(encodeURIComponent(textInput)));
        if (isUrlSafe) {
          b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
        setTextOutput(b64);
      } catch {
        setTextOutput('Encoding Error');
      }
    } else if (slug === 'base64-decoder') {
      try {
        setDecodedImagePreview(null);
        let normalized = textInput.trim().replace(/-/g, '+').replace(/_/g, '/');
        while (normalized.length % 4) {
          normalized += '=';
        }
        
        if (normalized.startsWith('data:image/') || normalized.startsWith('iVBORw0KGgo') || normalized.startsWith('/9j/')) {
          setDecodedImagePreview(normalized.startsWith('data:') ? normalized : `data:image/png;base64,${normalized}`);
        }

        const decoded = decodeURIComponent(escape(atob(normalized.replace(/^data:[^;]+;base64,/, ''))));
        setTextOutput(decoded);
      } catch {
        setTextOutput('Invalid Base64 string');
      }
    } else if (slug === 'url-encoder') {
      try {
        setTextOutput(encodeURIComponent(textInput));
      } catch {
        setTextOutput('Encoding Error');
      }
    } else if (slug === 'url-decoder') {
      try {
        setTextOutput(decodeURIComponent(textInput));
      } catch {
        setTextOutput('Malformed URL component');
      }
    }
  }, [textInput, isUrlSafe, slug]);

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMinifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed));
      setJsonError(null);
      if (onUse) onUse();
    } catch (err: any) {
      setJsonError(err.message);
    }
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generatePasswords = () => {
    let chars = '';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (includeUpper) chars += upper;
    if (includeLower) chars += lower;
    if (includeNumbers) chars += nums;
    if (includeSymbols) chars += symbols;

    if (excludeAmbiguous) {
      chars = chars.replace(/[il1Lo0O]/g, '');
    }

    if (!chars) chars = lower + nums;

    const generateSingle = () => {
      const array = new Uint32Array(passLength);
      window.crypto.getRandomValues(array);
      let pass = '';
      for (let i = 0; i < passLength; i++) {
        pass += chars[array[i] % chars.length];
      }
      return pass;
    };

    const primary = generateSingle();
    setGeneratedPassword(primary);
    setBulkList([primary, generateSingle(), generateSingle(), generateSingle(), generateSingle()]);
    if (onUse) onUse();
  };

  // Password Entropy Calculator
  const getPasswordStrength = (pass: string) => {
    let poolSize = 0;
    if (/[a-z]/.test(pass)) poolSize += 26;
    if (/[A-Z]/.test(pass)) poolSize += 26;
    if (/[0-9]/.test(pass)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(pass)) poolSize += 32;

    const entropy = Math.round(pass.length * Math.log2(poolSize || 1));
    if (entropy < 40) return { label: 'Weak', score: 'bg-red-500', percent: 25 };
    if (entropy < 65) return { label: 'Medium', score: 'bg-amber-500', percent: 50 };
    if (entropy < 90) return { label: 'Strong', score: 'bg-[#89906F]', percent: 80 };
    return { label: 'Unbreakable', score: 'bg-emerald-500', percent: 100 };
  };

  const strength = getPasswordStrength(generatedPassword);

  return (
    <div className="space-y-6">
      {/* 1. JSON Formatter */}
      {slug === 'json-formatter' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#1E211D] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Indentation:</span>
              <select
                value={indent}
                onChange={(e) => setIndent(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-xs text-gray-900 dark:text-gray-100"
              >
                <option value="2">2 Spaces</option>
                <option value="4">4 Spaces</option>
                <option value="tab">Tab</option>
              </select>
              <button
                onClick={handleMinifyJson}
                className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                Minify JSON
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(jsonOutput)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#89906F] text-white text-xs font-medium hover:bg-[#767D5E] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Output'}
              </button>
              <button
                onClick={() => handleDownload(jsonOutput, 'formatted.json')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Input Raw JSON</span>
                <button
                  onClick={() => setJsonInput('')}
                  className="text-xs text-gray-400 hover:text-red-500"
                >
                  Clear
                </button>
              </div>
              <textarea
                rows={14}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste JSON here..."
                className="w-full font-mono text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-gray-900 dark:text-gray-100 focus:outline-none"
              />
            </div>

            <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Formatted Output</span>
                {jsonError ? (
                  <span className="text-xs text-red-500 font-medium">Invalid JSON</span>
                ) : (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Valid JSON</span>
                )}
              </div>
              <textarea
                readOnly
                rows={14}
                value={jsonError ? `Error: ${jsonError}` : jsonOutput}
                className={`w-full font-mono text-xs p-3 rounded-lg border ${
                  jsonError ? 'border-red-300 text-red-600 dark:text-red-400' : 'border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
                } bg-[#FAF8F5] dark:bg-[#252824] focus:outline-none`}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Base64 & URL Encoder/Decoder */}
      {(slug === 'base64-encoder' || slug === 'base64-decoder' || slug === 'url-encoder' || slug === 'url-decoder') && (
        <div className="space-y-4">
          {slug === 'base64-encoder' && (
            <div className="flex items-center gap-2 bg-white dark:bg-[#1E211D] p-3 rounded-xl border border-gray-200 dark:border-gray-800">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUrlSafe}
                  onChange={(e) => setIsUrlSafe(e.target.checked)}
                  className="rounded text-[#89906F] focus:ring-[#89906F]"
                />
                Enable URL-Safe Base64 (RFC 4648 §5)
              </label>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {slug.includes('decoder') ? 'Encoded Input' : 'Raw Text Input'}
                </span>
                <button onClick={() => setTextInput('')} className="text-xs text-gray-400 hover:text-red-500">
                  Clear
                </button>
              </div>
              <textarea
                rows={10}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter string..."
                className="w-full font-mono text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-gray-900 dark:text-gray-100 focus:outline-none"
              />
            </div>

            <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {slug.includes('decoder') ? 'Decoded Result' : 'Encoded Output'}
                </span>
                <button
                  onClick={() => handleCopy(textOutput)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#89906F] hover:underline"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <textarea
                readOnly
                rows={10}
                value={textOutput}
                className="w-full font-mono text-xs p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-gray-900 dark:text-gray-100 focus:outline-none"
              />
            </div>
          </div>

          {decodedImagePreview && (
            <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">Decoded Image Preview</span>
              <img src={decodedImagePreview} alt="Decoded Preview" className="max-h-48 mx-auto rounded border border-gray-200 dark:border-gray-700" />
            </div>
          )}
        </div>
      )}

      {/* 3. Password Generator */}
      {slug === 'password-generator' && (
        <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-6">
          {/* Main Display */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#252824] border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
            <span className="font-mono text-lg sm:text-xl font-bold tracking-wider text-gray-900 dark:text-white break-all">
              {generatedPassword}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={generatePasswords}
                className="p-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                title="Regenerate"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleCopy(generatedPassword)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#89906F] hover:bg-[#767D5E] text-white text-xs font-semibold transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Strength Meter */}
          <div>
            <div className="flex justify-between items-center text-xs font-medium mb-1">
              <span className="text-gray-600 dark:text-gray-400">Password Entropy Strength:</span>
              <span className="font-bold text-gray-900 dark:text-white">{strength.label}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div className={`h-full ${strength.score} transition-all duration-300`} style={{ width: `${strength.percent}%` }} />
            </div>
          </div>

          {/* Length Slider & Options */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <span>Length: {passLength} characters</span>
                <span className="text-gray-400">4 – 64</span>
              </div>
              <input
                type="range"
                min="6"
                max="48"
                value={passLength}
                onChange={(e) => setPassLength(Number(e.target.value))}
                className="w-full accent-[#89906F]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUpper}
                  onChange={(e) => setIncludeUpper(e.target.checked)}
                  className="rounded text-[#89906F] focus:ring-[#89906F]"
                />
                Uppercase (A-Z)
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLower}
                  onChange={(e) => setIncludeLower(e.target.checked)}
                  className="rounded text-[#89906F] focus:ring-[#89906F]"
                />
                Lowercase (a-z)
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="rounded text-[#89906F] focus:ring-[#89906F]"
                />
                Numbers (0-9)
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="rounded text-[#89906F] focus:ring-[#89906F]"
                />
                Symbols (!@#$%^&*)
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer sm:col-span-2">
                <input
                  type="checkbox"
                  checked={excludeAmbiguous}
                  onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                  className="rounded text-[#89906F] focus:ring-[#89906F]"
                />
                Exclude Ambiguous Characters (e.g. 1, l, I, 0, O)
              </label>
            </div>
          </div>

          {/* Bulk Passwords */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Bulk Password Variations</h4>
            <div className="space-y-2">
              {bulkList.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F5] dark:bg-[#252824] text-xs font-mono text-gray-800 dark:text-gray-200">
                  <span className="truncate mr-2">{p}</span>
                  <button
                    onClick={() => handleCopy(p)}
                    className="p-1 text-gray-400 hover:text-[#89906F] shrink-0"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
