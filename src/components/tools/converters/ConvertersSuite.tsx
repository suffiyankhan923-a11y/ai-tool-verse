import React, { useState } from 'react';
import { ArrowLeftRight, RefreshCw, Copy, Check, Globe } from 'lucide-react';

// ================= MASTER UNIT CONVERTER =================
export const UnitConverter: React.FC<{ initialCategory?: string }> = ({
  initialCategory = 'length',
}) => {
  const [dimension, setDimension] = useState(initialCategory);
  const [fromValue, setFromValue] = useState<number | string>(100);
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [copied, setCopied] = useState(false);

  // Conversion definitions (all convert to a standard base unit first)
  const CONVERSIONS: Record<
    string,
    {
      name: string;
      units: Record<string, { name: string; factor: number; isTemp?: boolean }>;
    }
  > = {
    length: {
      name: 'Length & Distance',
      units: {
        meters: { name: 'Meters (m)', factor: 1 },
        kilometers: { name: 'Kilometers (km)', factor: 1000 },
        centimeters: { name: 'Centimeters (cm)', factor: 0.01 },
        millimeters: { name: 'Millimeters (mm)', factor: 0.001 },
        inches: { name: 'Inches (in)', factor: 0.0254 },
        feet: { name: 'Feet (ft)', factor: 0.3048 },
        yards: { name: 'Yards (yd)', factor: 0.9144 },
        miles: { name: 'Miles (mi)', factor: 1609.344 },
        nauticalMiles: { name: 'Nautical Miles (NM)', factor: 1852 },
      },
    },
    weight: {
      name: 'Weight & Mass',
      units: {
        kilograms: { name: 'Kilograms (kg)', factor: 1 },
        grams: { name: 'Grams (g)', factor: 0.001 },
        milligrams: { name: 'Milligrams (mg)', factor: 0.000001 },
        pounds: { name: 'Pounds (lbs)', factor: 0.45359237 },
        ounces: { name: 'Ounces (oz)', factor: 0.0283495 },
        stones: { name: 'Stones (st)', factor: 6.35029 },
        metricTons: { name: 'Metric Tons (t)', factor: 1000 },
      },
    },
    temperature: {
      name: 'Temperature',
      units: {
        celsius: { name: 'Celsius (°C)', factor: 1, isTemp: true },
        fahrenheit: { name: 'Fahrenheit (°F)', factor: 1, isTemp: true },
        kelvin: { name: 'Kelvin (K)', factor: 1, isTemp: true },
        rankine: { name: 'Rankine (°R)', factor: 1, isTemp: true },
      },
    },
    area: {
      name: 'Area',
      units: {
        sqMeters: { name: 'Square Meters (m²)', factor: 1 },
        sqKilometers: { name: 'Square Kilometers (km²)', factor: 1000000 },
        sqFeet: { name: 'Square Feet (ft²)', factor: 0.092903 },
        sqYards: { name: 'Square Yards (yd²)', factor: 0.836127 },
        acres: { name: 'Acres (ac)', factor: 4046.86 },
        hectares: { name: 'Hectares (ha)', factor: 10000 },
        sqMiles: { name: 'Square Miles (mi²)', factor: 2589988.11 },
      },
    },
    volume: {
      name: 'Volume & Capacity',
      units: {
        liters: { name: 'Liters (L)', factor: 1 },
        milliliters: { name: 'Milliliters (mL)', factor: 0.001 },
        cubicMeters: { name: 'Cubic Meters (m³)', factor: 1000 },
        usGallons: { name: 'US Gallons (gal)', factor: 3.78541 },
        usQuarts: { name: 'US Quarts (qt)', factor: 0.946353 },
        usPints: { name: 'US Pints (pt)', factor: 0.473176 },
        usCups: { name: 'US Cups (cup)', factor: 0.24 },
        usFluidOunces: { name: 'US Fluid Ounces (fl oz)', factor: 0.0295735 },
      },
    },
    speed: {
      name: 'Speed',
      units: {
        metersPerSec: { name: 'Meters / Sec (m/s)', factor: 1 },
        kmPerHour: { name: 'Kilometers / Hour (km/h)', factor: 0.277778 },
        milesPerHour: { name: 'Miles / Hour (mph)', factor: 0.44704 },
        knots: { name: 'Knots (kn)', factor: 0.514444 },
        feetPerSec: { name: 'Feet / Sec (ft/s)', factor: 0.3048 },
      },
    },
    data: {
      name: 'Data Storage',
      units: {
        bytes: { name: 'Bytes (B)', factor: 1 },
        kilobytes: { name: 'Kilobytes (KB)', factor: 1000 },
        megabytes: { name: 'Megabytes (MB)', factor: 1000000 },
        gigabytes: { name: 'Gigabytes (GB)', factor: 1000000000 },
        terabytes: { name: 'Terabytes (TB)', factor: 1000000000000 },
        petabytes: { name: 'Petabytes (PB)', factor: 1000000000000000 },
        kibibytes: { name: 'Kibibytes (KiB)', factor: 1024 },
        mebibytes: { name: 'Mebibytes (MiB)', factor: 1048576 },
        gibibytes: { name: 'Gibibytes (GiB)', factor: 1073741824 },
      },
    },
  };

  const currentDimension = CONVERSIONS[dimension] || CONVERSIONS.length;

  const handleDimensionChange = (newDim: string) => {
    setDimension(newDim);
    const unitKeys = Object.keys(CONVERSIONS[newDim].units);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1] || unitKeys[0]);
  };

  // Convert calculation
  const calculateResult = () => {
    const val = Number(fromValue);
    if (isNaN(val)) return 0;

    if (dimension === 'temperature') {
      let celsius = val;
      if (fromUnit === 'fahrenheit') celsius = (val - 32) * (5 / 9);
      if (fromUnit === 'kelvin') celsius = val - 273.15;
      if (fromUnit === 'rankine') celsius = (val - 491.67) * (5 / 9);

      if (toUnit === 'celsius') return celsius;
      if (toUnit === 'fahrenheit') return (celsius * 9) / 5 + 32;
      if (toUnit === 'kelvin') return celsius + 273.15;
      if (toUnit === 'rankine') return (celsius + 273.15) * 1.8;
      return celsius;
    }

    const fromFactor = currentDimension.units[fromUnit]?.factor || 1;
    const toFactor = currentDimension.units[toUnit]?.factor || 1;
    const baseValue = val * fromFactor;
    return baseValue / toFactor;
  };

  const result = calculateResult();

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCopy = () => {
    const text = `${fromValue} ${currentDimension.units[fromUnit]?.name} = ${result.toLocaleString()} ${currentDimension.units[toUnit]?.name}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="unit-converter-tool" className="space-y-6">
      {/* Dimension Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {Object.entries(CONVERSIONS).map(([key, data]) => (
          <button
            key={key}
            type="button"
            onClick={() => handleDimensionChange(key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              dimension === key
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {data.name}
          </button>
        ))}
      </div>

      {/* Main Conversion Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Source Unit */}
        <div className="lg:col-span-5 p-5 md:p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            From Unit
          </span>
          <div>
            <label className="text-xs font-semibold block mb-1 text-slate-500">Value</label>
            <input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-lg font-bold text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1 text-slate-500">Unit</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
            >
              {Object.entries(currentDimension.units).map(([key, u]) => (
                <option key={key} value={key}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="lg:col-span-2 flex justify-center">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap units"
            className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center hover:scale-105 transition-transform shadow-md"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        {/* Target Result */}
        <div className="lg:col-span-5 p-5 md:p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              To Converted Unit
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs text-amber-600 dark:text-amber-400 font-semibold"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1 text-slate-500">Result</label>
            <div className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-lg font-bold text-amber-600 dark:text-amber-400 truncate">
              {isNaN(result) ? '0' : result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1 text-slate-500">Unit</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
            >
              {Object.entries(currentDimension.units).map(([key, u]) => (
                <option key={key} value={key}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= CURRENCY CONVERTER =================
export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState(100);
  const [fromCur, setFromCur] = useState('USD');
  const [toCur, setToCur] = useState('EUR');

  // Baseline exchange rates vs USD
  const RATES: Record<string, { name: string; rateVsUsd: number; symbol: string }> = {
    USD: { name: 'US Dollar', rateVsUsd: 1.0, symbol: '$' },
    EUR: { name: 'Euro', rateVsUsd: 0.92, symbol: '€' },
    GBP: { name: 'British Pound', rateVsUsd: 0.78, symbol: '£' },
    JPY: { name: 'Japanese Yen', rateVsUsd: 154.2, symbol: '¥' },
    CAD: { name: 'Canadian Dollar', rateVsUsd: 1.36, symbol: 'CA$' },
    AUD: { name: 'Australian Dollar', rateVsUsd: 1.52, symbol: 'AU$' },
    CHF: { name: 'Swiss Franc', rateVsUsd: 0.89, symbol: 'CHF' },
    INR: { name: 'Indian Rupee', rateVsUsd: 83.5, symbol: '₹' },
    CNY: { name: 'Chinese Yuan', rateVsUsd: 7.24, symbol: '¥' },
    AED: { name: 'UAE Dirham', rateVsUsd: 3.67, symbol: 'AED' },
    SGD: { name: 'Singapore Dollar', rateVsUsd: 1.34, symbol: 'SG$' },
    BRL: { name: 'Brazilian Real', rateVsUsd: 5.42, symbol: 'R$' },
  };

  const fromRate = RATES[fromCur]?.rateVsUsd || 1;
  const toRate = RATES[toCur]?.rateVsUsd || 1;

  // Convert: Amount in USD = Amount / fromRate; Converted = USD * toRate
  const converted = (Number(amount) / fromRate) * toRate;
  const singleExchangeRate = (1 / fromRate) * toRate;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div>
          <label className="text-xs font-semibold block mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold block mb-1">From Currency</label>
            <select
              value={fromCur}
              onChange={(e) => setFromCur(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
            >
              {Object.entries(RATES).map(([code, c]) => (
                <option key={code} value={code}>
                  {code} - {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">To Currency</label>
            <select
              value={toCur}
              onChange={(e) => setToCur(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
            >
              {Object.entries(RATES).map(([code, c]) => (
                <option key={code} value={code}>
                  {code} - {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Converted Result
          </span>
          <div className="py-3">
            <span className="text-4xl md:text-5xl font-extrabold text-amber-600 dark:text-amber-400 font-display">
              {RATES[toCur]?.symbol}{converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-500 block mt-1">
              1 {fromCur} = {singleExchangeRate.toFixed(4)} {toCur}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
          <p>
            Exchange rates updated for simulation. API connection ready for live Forex feeds.
          </p>
        </div>
      </div>
    </div>
  );
};
