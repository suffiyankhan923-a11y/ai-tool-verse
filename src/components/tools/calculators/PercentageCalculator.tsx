import React, { useState } from 'react';
import { Percent, ArrowRight, RefreshCw, Copy, Check } from 'lucide-react';

export const PercentageCalculator: React.FC = () => {
  // Mode 1: What is X% of Y?
  const [m1X, setM1X] = useState<number | string>(15);
  const [m1Y, setM1Y] = useState<number | string>(300);

  // Mode 2: X is what % of Y?
  const [m2X, setM2X] = useState<number | string>(45);
  const [m2Y, setM2Y] = useState<number | string>(180);

  // Mode 3: % Increase/Decrease from X to Y
  const [m3X, setM3X] = useState<number | string>(80);
  const [m3Y, setM3Y] = useState<number | string>(100);

  // Mode 4: Add / Subtract X% to/from Y
  const [m4X, setM4X] = useState<number | string>(20);
  const [m4Y, setM4Y] = useState<number | string>(250);
  const [m4Op, setM4Op] = useState<'add' | 'subtract'>('add');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Calculations
  const r1 = (Number(m1X) / 100) * Number(m1Y);
  const r2 = Number(m2Y) !== 0 ? (Number(m2X) / Number(m2Y)) * 100 : 0;
  const r3 = Number(m3X) !== 0 ? ((Number(m3Y) - Number(m3X)) / Math.abs(Number(m3X))) * 100 : 0;
  const r3Diff = Number(m3Y) - Number(m3X);
  const r4 =
    m4Op === 'add'
      ? Number(m4Y) + (Number(m4X) / 100) * Number(m4Y)
      : Number(m4Y) - (Number(m4X) / 100) * Number(m4Y);

  return (
    <div id="percentage-calculator-tool" className="space-y-6">
      {/* Grid of 4 common calculation cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: What is X% of Y? */}
        <div className="p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                1. Find Percentage Value
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(r1.toFixed(2), 'c1')}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#D4AF37] hover:bg-[#161E31] transition-colors"
              >
                {copiedKey === 'c1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center flex-wrap gap-2 text-sm md:text-base font-medium text-white">
              <span>What is</span>
              <input
                type="number"
                value={m1X}
                onChange={(e) => setM1X(e.target.value)}
                className="w-20 px-2.5 py-1.5 rounded-lg bg-[#161E31] border border-[#D4AF37]/20 text-center font-bold text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]"
              />
              <span>% of</span>
              <input
                type="number"
                value={m1Y}
                onChange={(e) => setM1Y(e.target.value)}
                className="w-24 px-2.5 py-1.5 rounded-lg bg-[#161E31] border border-[#D4AF37]/20 text-center font-bold text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <span>?</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#D4AF37]/15 flex items-center justify-between">
            <span className="text-xs text-[#64748B] font-mono">({m1X} ÷ 100) × {m1Y}</span>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-white font-serif">
                {isNaN(r1) ? '0' : r1.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: X is what % of Y? */}
        <div className="p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                2. Calculate Percentage Share
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(`${r2.toFixed(2)}%`, 'c2')}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#D4AF37] hover:bg-[#161E31] transition-colors"
              >
                {copiedKey === 'c2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center flex-wrap gap-2 text-sm md:text-base font-medium text-white">
              <input
                type="number"
                value={m2X}
                onChange={(e) => setM2X(e.target.value)}
                className="w-24 px-2.5 py-1.5 rounded-lg bg-[#161E31] border border-[#D4AF37]/20 text-center font-bold text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <span>is what % of</span>
              <input
                type="number"
                value={m2Y}
                onChange={(e) => setM2Y(e.target.value)}
                className="w-24 px-2.5 py-1.5 rounded-lg bg-[#161E31] border border-[#D4AF37]/20 text-center font-bold text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <span>?</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#D4AF37]/15 flex items-center justify-between">
            <span className="text-xs text-[#64748B] font-mono">({m2X} ÷ {m2Y}) × 100</span>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-white font-serif">
                {isNaN(r2) ? '0%' : `${r2.toLocaleString(undefined, { maximumFractionDigits: 4 })}%`}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Percentage Increase / Decrease */}
        <div className="p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                3. Percentage Increase / Decrease
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(`${r3.toFixed(2)}%`, 'c3')}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#D4AF37] hover:bg-[#161E31] transition-colors"
              >
                {copiedKey === 'c3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center flex-wrap gap-2 text-sm md:text-base font-medium text-white">
              <span>From</span>
              <input
                type="number"
                value={m3X}
                onChange={(e) => setM3X(e.target.value)}
                className="w-24 px-2.5 py-1.5 rounded-lg bg-[#161E31] border border-[#D4AF37]/20 text-center font-bold text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <span>to</span>
              <input
                type="number"
                value={m3Y}
                onChange={(e) => setM3Y(e.target.value)}
                className="w-24 px-2.5 py-1.5 rounded-lg bg-[#161E31] border border-[#D4AF37]/20 text-center font-bold text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#D4AF37]/15 flex items-center justify-between">
            <span className="text-xs text-[#64748B]">
              Net Change: {r3Diff >= 0 ? `+${r3Diff}` : r3Diff}
            </span>
            <div className="text-right">
              <span
                className={`text-2xl font-extrabold font-serif ${
                  r3 >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {r3 >= 0 ? `+${r3.toFixed(2)}%` : `${r3.toFixed(2)}%`}
              </span>
              <span className="block text-[10px] text-[#64748B]">
                {r3 >= 0 ? 'Increase' : 'Decrease'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Add / Subtract Percentage */}
        <div className="p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                4. Add / Subtract % to Base
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(r4.toFixed(2), 'c4')}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#D4AF37] hover:bg-[#161E31] transition-colors"
              >
                {copiedKey === 'c4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center flex-wrap gap-2 text-sm md:text-base font-medium text-white">
              <select
                value={m4Op}
                onChange={(e) => setM4Op(e.target.value as 'add' | 'subtract')}
                className="px-2 py-1.5 rounded-lg bg-[#161E31] border border-[#D4AF37]/20 text-xs font-semibold text-[#D4AF37] focus:outline-none"
              >
                <option value="add">Add (+)</option>
                <option value="subtract">Subtract (-)</option>
              </select>
              <input
                type="number"
                value={m4X}
                onChange={(e) => setM4X(e.target.value)}
                className="w-20 px-2.5 py-1.5 rounded-lg bg-[#161E31] border border-[#D4AF37]/20 text-center font-bold text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]"
              />
              <span>% {m4Op === 'add' ? 'to' : 'from'}</span>
              <input
                type="number"
                value={m4Y}
                onChange={(e) => setM4Y(e.target.value)}
                className="w-24 px-2.5 py-1.5 rounded-lg bg-[#161E31] border border-[#D4AF37]/20 text-center font-bold text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#D4AF37]/15 flex items-center justify-between">
            <span className="text-xs text-[#64748B]">
              Adjustment: {((Number(m4X) / 100) * Number(m4Y)).toFixed(2)}
            </span>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-white font-serif">
                {r4.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
