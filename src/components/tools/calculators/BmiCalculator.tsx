import React, { useState } from 'react';
import { HeartPulse, Check, Copy } from 'lucide-react';

export const BmiCalculator: React.FC = () => {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');

  // Metric
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(70);

  // Imperial
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);
  const [weightLbs, setWeightLbs] = useState(154);

  const [copied, setCopied] = useState(false);

  // Calculate BMI
  let bmi = 0;
  let minHealthyWeight = 0;
  let maxHealthyWeight = 0;

  if (unitSystem === 'metric') {
    const heightM = heightCm / 100;
    if (heightM > 0) {
      bmi = weightKg / (heightM * heightM);
      minHealthyWeight = 18.5 * (heightM * heightM);
      maxHealthyWeight = 24.9 * (heightM * heightM);
    }
  } else {
    const totalInches = heightFt * 12 + heightIn;
    if (totalInches > 0) {
      bmi = (703 * weightLbs) / (totalInches * totalInches);
      minHealthyWeight = (18.5 * (totalInches * totalInches)) / 703;
      maxHealthyWeight = (24.9 * (totalInches * totalInches)) / 703;
    }
  }

  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { name: 'Underweight', color: 'text-sky-500', bg: 'bg-sky-500', pos: 15 };
    if (val <= 24.9) return { name: 'Normal / Healthy Weight', color: 'text-emerald-500', bg: 'bg-emerald-500', pos: 40 };
    if (val <= 29.9) return { name: 'Overweight', color: 'text-amber-500', bg: 'bg-amber-500', pos: 65 };
    if (val <= 34.9) return { name: 'Obesity Class I', color: 'text-orange-500', bg: 'bg-orange-500', pos: 85 };
    return { name: 'Obesity Class II/III', color: 'text-rose-500', bg: 'bg-rose-500', pos: 95 };
  };

  const category = getBmiCategory(bmi);

  const handleCopy = () => {
    const text = `BMI Result: ${bmi.toFixed(1)} (${category.name}) | Healthy Range: ${minHealthyWeight.toFixed(1)} - ${maxHealthyWeight.toFixed(1)} ${unitSystem === 'metric' ? 'kg' : 'lbs'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="bmi-calculator-tool" className="space-y-6">
      {/* Unit Selector */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1 rounded-xl bg-[#161E31] border border-[#D4AF37]/20">
          <button
            type="button"
            onClick={() => setUnitSystem('metric')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              unitSystem === 'metric'
                ? 'bg-[#D4AF37] text-[#050810] shadow-sm font-bold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Metric (cm / kg)
          </button>
          <button
            type="button"
            onClick={() => setUnitSystem('imperial')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              unitSystem === 'imperial'
                ? 'bg-[#D4AF37] text-[#050810] shadow-sm font-bold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Imperial (ft, in / lbs)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
            Enter Body Measurements
          </h3>

          {unitSystem === 'metric' ? (
            <>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-[#E2E8F0]">
                  <span>Height</span>
                  <span className="text-[#D4AF37] font-mono">{heightCm} cm</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="230"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-[#D4AF37]"
                />
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full mt-1.5 px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-[#E2E8F0]">
                  <span>Weight</span>
                  <span className="text-[#D4AF37] font-mono">{weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="200"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-[#D4AF37]"
                />
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full mt-1.5 px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1 text-[#94A3B8]">Height (Feet)</label>
                  <input
                    type="number"
                    min="3"
                    max="8"
                    value={heightFt}
                    onChange={(e) => setHeightFt(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1 text-[#94A3B8]">Height (Inches)</label>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={heightIn}
                    onChange={(e) => setHeightIn(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1 text-[#94A3B8]">Weight (Pounds / lbs)</label>
                <input
                  type="number"
                  min="60"
                  max="500"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </>
          )}
        </div>

        {/* Results Gauge Card */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <span>Your BMI Score</span>
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-[#94A3B8] hover:text-[#D4AF37] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="text-center py-3">
              <span className="text-5xl font-extrabold text-white font-serif">
                {bmi.toFixed(1)}
              </span>
              <p className={`text-sm font-bold mt-1 ${category.color}`}>
                {category.name}
              </p>
            </div>

            {/* Visual Color Scale Gauge */}
            <div className="my-4">
              <div className="h-3 w-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 via-amber-400 to-rose-500 relative overflow-hidden" />
              <div className="flex justify-between text-[10px] text-[#64748B] mt-1 font-mono">
                <span>16.0 Under</span>
                <span>18.5 Normal</span>
                <span>25.0 Over</span>
                <span>30.0 Obese</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#D4AF37]/15 text-xs text-[#94A3B8]">
            <p className="flex justify-between items-center">
              <span>Healthy Weight Span:</span>
              <strong className="text-white font-mono">
                {minHealthyWeight.toFixed(1)} – {maxHealthyWeight.toFixed(1)} {unitSystem === 'metric' ? 'kg' : 'lbs'}
              </strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
