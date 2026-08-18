import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { KeyRound, QrCode, RefreshCw, Copy, Check, Download, Shuffle, Palette, ShieldCheck, Sparkles, Layers } from 'lucide-react';

// ================= PASSWORD GENERATOR =================
export const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);

  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let chars = '';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let uSet = upper;
    let lSet = lower;
    let nSet = nums;
    let sSet = syms;

    if (excludeAmbiguous) {
      uSet = uSet.replace(/[IO]/g, '');
      lSet = lSet.replace(/[lo]/g, '');
      nSet = nSet.replace(/[01]/g, '');
      sSet = sSet.replace(/[|;:,.<>]/g, '');
    }

    if (includeUpper) chars += uSet;
    if (includeLower) chars += lSet;
    if (includeNumbers) chars += nSet;
    if (includeSymbols) chars += sSet;

    if (!chars) {
      setPassword('');
      return;
    }

    // Cryptographically strong random generation
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous]);

  // Password strength estimation
  const getStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-300' };
    let score = 0;
    if (pass.length >= 12) score += 1;
    if (pass.length >= 16) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 3) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 4) return { score: 75, label: 'Strong', color: 'bg-emerald-500' };
    return { score: 100, label: 'Very Strong / Military Grade', color: 'bg-emerald-400' };
  };

  const strength = getStrength(password);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="password-generator-tool" className="space-y-6">
      {/* Password display card */}
      <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-[#0c1322] dark:to-[#080d1a] border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-xl md:text-2xl font-bold tracking-wider text-slate-900 dark:text-white break-all select-all">
            {password || 'Select at least one character set'}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={generatePassword}
              aria-label="Regenerate password"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-amber-500 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Password'}</span>
            </button>
          </div>
        </div>

        {/* Strength meter */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-500">Password Strength:</span>
            <span className="text-slate-800 dark:text-slate-200 font-bold">{strength.label}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${strength.color}`}
              style={{ width: `${strength.score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div>
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            <span>Password Length</span>
            <span className="text-amber-500 font-bold text-sm">{length} characters</span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>6 (Short)</span>
            <span>16 (Recommended)</span>
            <span>32 (Strong)</span>
            <span>64 (Ultra)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="rounded accent-amber-500 w-4 h-4"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Uppercase Letters (A-Z)
            </span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="rounded accent-amber-500 w-4 h-4"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Lowercase Letters (a-z)
            </span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded accent-amber-500 w-4 h-4"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Numbers (0-9)
            </span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="rounded accent-amber-500 w-4 h-4"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Special Symbols (!@#$)
            </span>
          </label>

          <label className="sm:col-span-2 flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="rounded accent-amber-500 w-4 h-4"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Exclude Ambiguous Characters (e.g. 0, O, I, l, 1)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

// ================= QR CODE GENERATOR =================
export const QrCodeTool: React.FC = () => {
  const [content, setContent] = useState('https://toolverse.app');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrSize, setQrSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && content) {
      QRCode.toCanvas(canvasRef.current, content, {
        width: qrSize,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
    }
  }, [content, fgColor, bgColor, qrSize]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'toolverse-qr-code.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div id="qr-code-generator-tool" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Settings */}
      <div className="lg:col-span-7 p-5 md:p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
            URL, Text, or Wi-Fi String
          </label>
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold block mb-1">QR Code Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <input
                type="text"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold block mb-1">Resolution (Pixels)</label>
          <div className="grid grid-cols-4 gap-2">
            {[180, 256, 384, 512].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQrSize(s)}
                className={`py-1.5 rounded-lg text-xs font-semibold ${
                  qrSize === s ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {s}px
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas Preview & Download */}
      <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col items-center justify-between">
        <div className="p-4 bg-white rounded-2xl shadow-inner border border-slate-100 flex items-center justify-center">
          <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg" />
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Download High-Res PNG</span>
        </button>
      </div>
    </div>
  );
};

// ================= RANDOM GENERATORS (NUMBERS / NAMES / GRADIENT / PALETTE) =================
export const GeneratorsHub: React.FC<{ toolType: 'number' | 'name' | 'palette' | 'gradient' }> = ({
  toolType,
}) => {
  // Random Number
  const [minNum, setMinNum] = useState(1);
  const [maxNum, setMaxNum] = useState(100);
  const [randomResult, setRandomResult] = useState<number | null>(42);

  // Random Name / Username
  const [nameType, setNameType] = useState<'username' | 'fantasy' | 'business'>('username');
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);

  // Color Palette
  const [palette, setPalette] = useState<string[]>(['#0a0f1d', '#1e293b', '#d97706', '#f59e0b', '#f8fafc']);

  // Gradient
  const [grad1, setGrad1] = useState('#0f172a');
  const [grad2, setGrad2] = useState('#d97706');
  const [gradAngle, setGradAngle] = useState(135);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (t: string, key: string) => {
    navigator.clipboard.writeText(t);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenNumber = () => {
    const min = Number(minNum) || 0;
    const max = Number(maxNum) || 100;
    const res = Math.floor(Math.random() * (max - min + 1)) + min;
    setRandomResult(res);
  };

  const handleGenNames = () => {
    const prefixes = ['Quantum', 'Aura', 'Hyper', 'Nova', 'Cyber', 'Apex', 'Titan', 'Zenith', 'Vortex', 'Pulse', 'Silver', 'Golden', 'Onyx', 'Cosmic'];
    const suffixes = ['Forge', 'Labs', 'Craft', 'Verse', 'Sphere', 'Matrix', 'Flow', 'Nest', 'Base', 'Nexus', 'Stack', 'Wave', 'Pulse'];
    const names: string[] = [];
    for (let i = 0; i < 6; i++) {
      const p = prefixes[Math.floor(Math.random() * prefixes.length)];
      const s = suffixes[Math.floor(Math.random() * suffixes.length)];
      if (nameType === 'username') {
        names.push(`${p.toLowerCase()}_${s.toLowerCase()}${Math.floor(Math.random() * 99)}`);
      } else if (nameType === 'business') {
        names.push(`${p} ${s} Dynamics`);
      } else {
        names.push(`${p} ${s}`);
      }
    }
    setGeneratedNames(names);
  };

  const handleGenPalette = () => {
    const randomHex = () =>
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0');
    setPalette([randomHex(), randomHex(), randomHex(), randomHex(), randomHex()]);
  };

  useEffect(() => {
    if (toolType === 'name' && generatedNames.length === 0) handleGenNames();
  }, [toolType]);

  if (toolType === 'number') {
    return (
      <div className="space-y-6">
        <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1">Minimum Range</label>
              <input
                type="number"
                value={minNum}
                onChange={(e) => setMinNum(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Maximum Range</label>
              <input
                type="number"
                value={maxNum}
                onChange={(e) => setMaxNum(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleGenNumber}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Shuffle className="w-4 h-4" />
            <span>Generate True Random Integer</span>
          </button>
        </div>

        <div className="p-8 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Generated Result
          </span>
          <span className="text-6xl md:text-7xl font-extrabold text-amber-500 font-display">
            {randomResult !== null ? randomResult : '—'}
          </span>
        </div>
      </div>
    );
  }

  if (toolType === 'palette') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleGenPalette}
            className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate New 5-Color Harmonic Palette</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {palette.map((color, idx) => (
            <div
              key={idx}
              className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col"
            >
              <div
                className="h-32 sm:h-44 w-full transition-colors"
                style={{ backgroundColor: color }}
              />
              <div className="p-3 bg-white dark:bg-[#0c1322] flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase">{color}</span>
                <button
                  type="button"
                  onClick={() => copyText(color, `pal-${idx}`)}
                  className="p-1 rounded text-slate-400 hover:text-amber-500"
                >
                  {copiedKey === `pal-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (toolType === 'gradient') {
    const cssCode = `background: linear-gradient(${gradAngle}deg, ${grad1}, ${grad2});`;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Color 1</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={grad1}
                    onChange={(e) => setGrad1(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={grad1}
                    onChange={(e) => setGrad1(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Color 2</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={grad2}
                    onChange={(e) => setGrad2(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={grad2}
                    onChange={(e) => setGrad2(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Gradient Angle</span>
                <span className="text-amber-500 font-bold">{gradAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={gradAngle}
                onChange={(e) => setGradAngle(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div
              className="w-full h-36 rounded-xl shadow-inner border border-slate-200/40"
              style={{ background: `linear-gradient(${gradAngle}deg, ${grad1}, ${grad2})` }}
            />
            <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <code className="text-xs font-mono break-all text-slate-800 dark:text-slate-200">{cssCode}</code>
              <button
                type="button"
                onClick={() => copyText(cssCode, 'css')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 shrink-0"
              >
                {copiedKey === 'css' ? 'Copied!' : 'Copy CSS'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Name Generator
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {(['username', 'fantasy', 'business'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setNameType(t)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize ${
                nameType === t ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleGenNames}
          className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Generate Random Names</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {generatedNames.map((n, i) => (
          <div
            key={n + i}
            className="p-4 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
          >
            <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{n}</span>
            <button
              type="button"
              onClick={() => copyText(n, `name-${i}`)}
              className="p-1 rounded text-slate-400 hover:text-amber-500"
            >
              {copiedKey === `name-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
