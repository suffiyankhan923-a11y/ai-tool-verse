import React, { useState } from 'react';
import {
  Heart,
  Activity,
  Flame,
  Scale,
  Droplets,
  Timer,
  Check,
  Copy,
  User,
  Zap,
} from 'lucide-react';

export const HealthCalculatorsSuite: React.FC<{
  toolType:
    | 'bmr'
    | 'tdee'
    | 'calorie'
    | 'ideal-weight'
    | 'body-fat'
    | 'water'
    | 'pace';
}> = ({ toolType }) => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(28);
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');

  // Common measurements
  const [neckCm, setNeckCm] = useState(38);
  const [waistCm, setWaistCm] = useState(82);
  const [hipCm, setHipCm] = useState(96);

  // Activity Level
  const [activityLevel, setActivityLevel] = useState<number>(1.55); // 1.2 = Sedentary, 1.375 = Light, 1.55 = Moderate, 1.725 = Very active, 1.9 = Athlete

  // Running Pace
  const [paceDistanceKm, setPaceDistanceKm] = useState(10);
  const [paceHours, setPaceHours] = useState(0);
  const [paceMinutes, setPaceMinutes] = useState(50);
  const [paceSeconds, setPaceSeconds] = useState(0);

  // Water climate
  const [climate, setClimate] = useState<'temperate' | 'hot' | 'very-hot'>('temperate');

  // 1. BMR (Mifflin-St Jeor Formula)
  // Men: BMR = 10W + 6.25H - 5A + 5
  // Women: BMR = 10W + 6.25H - 5A - 161
  const bmr =
    gender === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  // 2. TDEE
  const tdee = bmr * activityLevel;

  // 3. Calorie Goals
  const calorieDeficit = Math.max(1200, tdee - 500); // 0.5kg/week loss
  const calorieSurplus = tdee + 400; // 0.4kg/week gain

  // 4. Ideal Weight (Devine, Robinson, Miller formulas)
  const heightInches = heightCm / 2.54;
  const inchesOver5Ft = Math.max(0, heightInches - 60);

  const devineKg =
    gender === 'male'
      ? 50 + 2.3 * inchesOver5Ft
      : 45.5 + 2.3 * inchesOver5Ft;
  const robinsonKg =
    gender === 'male'
      ? 52 + 1.9 * inchesOver5Ft
      : 49 + 1.7 * inchesOver5Ft;
  const millerKg =
    gender === 'male'
      ? 56.2 + 1.41 * inchesOver5Ft
      : 53.1 + 1.36 * inchesOver5Ft;

  const avgIdealWeightKg = (devineKg + robinsonKg + millerKg) / 3;

  // 5. Body Fat % (US Navy Formula)
  // Men: 495 / (1.0324 - 0.19077(log10(waist-neck)) + 0.15456(log10(height))) - 450
  // Women: 495 / (1.29579 - 0.35004(log10(waist+hip-neck)) + 0.22100(log10(height))) - 450
  let bodyFatPercent = 0;
  if (gender === 'male') {
    const diff = Math.max(1, waistCm - neckCm);
    const denom =
      1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(heightCm);
    bodyFatPercent = Math.max(3, Math.min(50, 495 / denom - 450));
  } else {
    const sumDiff = Math.max(1, waistCm + hipCm - neckCm);
    const denom =
      1.29579 - 0.35004 * Math.log10(sumDiff) + 0.221 * Math.log10(heightCm);
    bodyFatPercent = Math.max(8, Math.min(55, 495 / denom - 450));
  }

  // 6. Water Intake
  // Base: 35ml per kg of bodyweight + activity + climate
  let waterMl = weightKg * 35;
  if (activityLevel >= 1.55) waterMl += 500;
  if (activityLevel >= 1.725) waterMl += 500;
  if (climate === 'hot') waterMl += 400;
  if (climate === 'very-hot') waterMl += 800;
  const waterLiters = waterMl / 1000;
  const waterGlasses = Math.round(waterMl / 250);

  // 7. Running Pace
  const totalPaceSeconds = paceHours * 3600 + paceMinutes * 60 + paceSeconds;
  const pacePerKmSec = paceDistanceKm > 0 ? totalPaceSeconds / paceDistanceKm : 0;
  const paceMinPart = Math.floor(pacePerKmSec / 60);
  const paceSecPart = Math.round(pacePerKmSec % 60);
  const paceKmString = `${paceMinPart}:${paceSecPart.toString().padStart(2, '0')}/km`;

  const pacePerMileSec = pacePerKmSec * 1.60934;
  const paceMileMinPart = Math.floor(pacePerMileSec / 60);
  const paceMileSecPart = Math.round(pacePerMileSec % 60);
  const paceMileString = `${paceMileMinPart}:${paceMileSecPart.toString().padStart(2, '0')}/mi`;

  const speedKmh = totalPaceSeconds > 0 ? (paceDistanceKm / (totalPaceSeconds / 3600)) : 0;

  return (
    <div className="space-y-6">
      {/* 1. BMR & 2. TDEE & 3. CALORIE */}
      {(toolType === 'bmr' || toolType === 'tdee' || toolType === 'calorie') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2 rounded-xl text-xs font-bold ${
                  gender === 'male' ? 'bg-[#D4AF37] text-[#050810]' : 'bg-[#161E31] text-[#94A3B8]'
                }`}
              >
                Male ♂
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2 rounded-xl text-xs font-bold ${
                  gender === 'female' ? 'bg-[#D4AF37] text-[#050810]' : 'bg-[#161E31] text-[#94A3B8]'
                }`}
              >
                Female ♀
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">
                Daily Physical Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs"
              >
                <option value={1.2}>Sedentary (Little or no exercise, desk job)</option>
                <option value={1.375}>Lightly Active (Light exercise 1-3 days/wk)</option>
                <option value={1.55}>Moderately Active (Moderate exercise 3-5 days/wk)</option>
                <option value={1.725}>Very Active (Hard training 6-7 days/wk)</option>
                <option value={1.9}>Extra Active (Physical labor or intense athletic training)</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1E] border border-[#D4AF37]/20 shadow-lg shadow-black/40 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                {toolType === 'bmr'
                  ? 'Basal Metabolic Rate (BMR)'
                  : toolType === 'tdee'
                  ? 'Total Daily Energy Expenditure (TDEE)'
                  : 'Target Daily Maintenance Calories'}
              </span>
              <div className="py-2">
                <span className="text-4xl md:text-5xl font-extrabold text-white font-serif">
                  {Math.round(toolType === 'bmr' ? bmr : tdee).toLocaleString()} kcal
                </span>
                <span className="text-xs text-[#94A3B8] block mt-1">
                  {toolType === 'bmr'
                    ? 'Calories burned strictly at complete rest'
                    : 'Calories required daily to maintain current weight'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/15 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-[#161E31]">
                <span className="text-[#64748B] block text-[10px]">Fat Loss (-0.5kg/wk)</span>
                <strong className="text-emerald-400 font-mono text-sm">{Math.round(calorieDeficit)} kcal</strong>
              </div>
              <div className="p-2 rounded-lg bg-[#161E31] border border-[#D4AF37]/30">
                <span className="text-[#D4AF37] block text-[10px] font-bold">Maintain</span>
                <strong className="text-white font-mono text-sm">{Math.round(tdee)} kcal</strong>
              </div>
              <div className="p-2 rounded-lg bg-[#161E31]">
                <span className="text-[#64748B] block text-[10px]">Muscle Gain (+0.4kg/wk)</span>
                <strong className="text-amber-400 font-mono text-sm">{Math.round(calorieSurplus)} kcal</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. IDEAL WEIGHT CALCULATOR */}
      {toolType === 'ideal-weight' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2 rounded-xl text-xs font-bold ${
                  gender === 'male' ? 'bg-[#D4AF37] text-[#050810]' : 'bg-[#161E31] text-[#94A3B8]'
                }`}
              >
                Male ♂
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2 rounded-xl text-xs font-bold ${
                  gender === 'female' ? 'bg-[#D4AF37] text-[#050810]' : 'bg-[#161E31] text-[#94A3B8]'
                }`}
              >
                Female ♀
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#94A3B8] mb-1">
                <span>Height</span>
                <span className="text-[#D4AF37] font-mono">{heightCm} cm ({(heightCm / 30.48).toFixed(1)} ft)</span>
              </div>
              <input
                type="range"
                min="130"
                max="220"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full accent-[#D4AF37]"
              />
            </div>
          </div>

          <div className="lg:col-span-7 p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1E] border border-[#D4AF37]/20 shadow-lg shadow-black/40 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Estimated Healthy Ideal Weight
              </span>
              <div className="py-2">
                <span className="text-4xl md:text-5xl font-extrabold text-white font-serif">
                  {avgIdealWeightKg.toFixed(1)} kg
                </span>
                <span className="text-xs text-[#94A3B8] block mt-1">
                  ~{(avgIdealWeightKg * 2.20462).toFixed(1)} lbs based on clinical formulas
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/15 grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-[#161E31]">
                <span className="text-[#64748B] block text-[10px]">Devine Formula</span>
                <strong className="text-white font-mono">{devineKg.toFixed(1)} kg</strong>
              </div>
              <div className="p-2 rounded-lg bg-[#161E31]">
                <span className="text-[#64748B] block text-[10px]">Robinson Formula</span>
                <strong className="text-white font-mono">{robinsonKg.toFixed(1)} kg</strong>
              </div>
              <div className="p-2 rounded-lg bg-[#161E31]">
                <span className="text-[#64748B] block text-[10px]">Miller Formula</span>
                <strong className="text-white font-mono">{millerKg.toFixed(1)} kg</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. BODY FAT CALCULATOR */}
      {toolType === 'body-fat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2 rounded-xl text-xs font-bold ${
                  gender === 'male' ? 'bg-[#D4AF37] text-[#050810]' : 'bg-[#161E31] text-[#94A3B8]'
                }`}
              >
                Male ♂
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2 rounded-xl text-xs font-bold ${
                  gender === 'female' ? 'bg-[#D4AF37] text-[#050810]' : 'bg-[#161E31] text-[#94A3B8]'
                }`}
              >
                Female ♀
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Neck (cm)</label>
                <input
                  type="number"
                  value={neckCm}
                  onChange={(e) => setNeckCm(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Waist (cm at navel)</label>
                <input
                  type="number"
                  value={waistCm}
                  onChange={(e) => setWaistCm(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs font-semibold"
                />
              </div>
              {gender === 'female' && (
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Hips (cm widest)</label>
                  <input
                    type="number"
                    value={hipCm}
                    onChange={(e) => setHipCm(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs font-semibold"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1E] border border-[#D4AF37]/20 shadow-lg shadow-black/40 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Estimated Body Fat Percentage
              </span>
              <div className="py-2">
                <span className="text-4xl md:text-5xl font-extrabold text-white font-serif">
                  {bodyFatPercent.toFixed(1)}%
                </span>
                <span className="text-xs text-[#94A3B8] block mt-1">
                  US Navy Circumference Method
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/15 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#64748B] block">Estimated Fat Mass:</span>
                <strong className="text-white text-sm font-mono">
                  {((weightKg * bodyFatPercent) / 100).toFixed(1)} kg
                </strong>
              </div>
              <div>
                <span className="text-[#64748B] block">Lean Body Mass:</span>
                <strong className="text-emerald-400 text-sm font-mono font-bold">
                  {(weightKg * (1 - bodyFatPercent / 100)).toFixed(1)} kg
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. WATER INTAKE */}
      {toolType === 'water' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 space-y-4">
            <div>
              <div className="flex justify-between text-xs text-[#94A3B8] mb-1">
                <span>Body Weight</span>
                <span className="text-[#D4AF37] font-mono">{weightKg} kg</span>
              </div>
              <input
                type="range"
                min="40"
                max="160"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full accent-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Climate / Weather</label>
              <div className="grid grid-cols-3 gap-2">
                {(['temperate', 'hot', 'very-hot'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setClimate(c)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize ${
                      climate === c ? 'bg-[#D4AF37] text-[#050810]' : 'bg-[#161E31] text-[#94A3B8]'
                    }`}
                  >
                    {c.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1E] border border-[#D4AF37]/20 shadow-lg shadow-black/40 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Recommended Daily Water Intake
              </span>
              <div className="py-2">
                <span className="text-4xl md:text-5xl font-extrabold text-cyan-400 font-serif">
                  {waterLiters.toFixed(1)} Liters
                </span>
                <span className="text-xs text-[#94A3B8] block mt-1">
                  Approximately {waterGlasses} standard glasses (250ml each) per day
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/15 text-xs text-[#94A3B8]">
              💧 Increase by 300–500ml for every 30 minutes of vigorous workout or intense perspiration.
            </div>
          </div>
        </div>
      )}

      {/* 7. RUNNING PACE CALCULATOR */}
      {toolType === 'pace' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Preset Distance</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[
                  { name: '5K', dist: 5 },
                  { name: '10K', dist: 10 },
                  { name: 'Half (21.1K)', dist: 21.0975 },
                  { name: 'Marathon (42.2K)', dist: 42.195 },
                ].map((d) => (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => setPaceDistanceKm(d.dist)}
                    className={`py-1.5 rounded-lg text-xs font-bold ${
                      Math.abs(paceDistanceKm - d.dist) < 0.01
                        ? 'bg-[#D4AF37] text-[#050810]'
                        : 'bg-[#161E31] text-[#94A3B8]'
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
              <input
                type="number"
                step="0.1"
                value={paceDistanceKm}
                onChange={(e) => setPaceDistanceKm(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs font-semibold"
                placeholder="Custom distance in km"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">
                Total Time (Hours : Minutes : Seconds)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min="0"
                  value={paceHours}
                  onChange={(e) => setPaceHours(Number(e.target.value))}
                  className="px-2 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-center font-mono"
                  placeholder="HH"
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={paceMinutes}
                  onChange={(e) => setPaceMinutes(Number(e.target.value))}
                  className="px-2 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-center font-mono"
                  placeholder="MM"
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={paceSeconds}
                  onChange={(e) => setPaceSeconds(Number(e.target.value))}
                  className="px-2 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-center font-mono"
                  placeholder="SS"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1E] border border-[#D4AF37]/20 shadow-lg shadow-black/40 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Calculated Running Pace
              </span>
              <div className="py-2">
                <span className="text-4xl md:text-5xl font-extrabold text-white font-serif">
                  {paceKmString}
                </span>
                <span className="text-xs text-[#94A3B8] block mt-1">
                  Imperial Pace: {paceMileString}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/15 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#64748B] block">Average Speed:</span>
                <strong className="text-white text-sm font-mono">{speedKmh.toFixed(2)} km/h</strong>
              </div>
              <div>
                <span className="text-[#64748B] block">Miles / Hour:</span>
                <strong className="text-[#D4AF37] text-sm font-mono">{(speedKmh * 0.621371).toFixed(2)} mph</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
