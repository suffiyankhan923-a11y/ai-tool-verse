import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Calculator,
  Briefcase,
  Globe,
  PieChart,
  Building,
  Check,
  Copy,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const FinancialCalculatorsSuite: React.FC<{
  toolType:
    | 'simple-interest'
    | 'mortgage'
    | 'investment'
    | 'profit-margin'
    | 'roi'
    | 'tax'
    | 'salary'
    | 'meeting';
}> = ({ toolType }) => {
  const [copied, setCopied] = useState(false);

  const copyResult = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. SIMPLE INTEREST
  const [siPrincipal, setSiPrincipal] = useState(5000);
  const [siRate, setSiRate] = useState(6.5);
  const [siTime, setSiTime] = useState(3);
  const [siTimeUnit, setSiTimeUnit] = useState<'years' | 'months'>('years');

  const siYears = siTimeUnit === 'years' ? siTime : siTime / 12;
  const siInterest = (siPrincipal * siRate * siYears) / 100;
  const siTotal = siPrincipal + siInterest;

  // 2. MORTGAGE CALCULATOR
  const [homePrice, setHomePrice] = useState(400000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTerm, setLoanTerm] = useState(30);
  const [mortgageRate, setMortgageRate] = useState(6.75);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [homeInsurance, setHomeInsurance] = useState(1200);
  const [hoaFee, setHoaFee] = useState(0);

  const downPaymentAmount = (homePrice * downPaymentPercent) / 100;
  const loanPrincipal = Math.max(0, homePrice - downPaymentAmount);
  const monthlyRate = mortgageRate / 100 / 12;
  const totalMonths = loanTerm * 12;

  const monthlyPrincipalAndInterest =
    monthlyRate > 0 && totalMonths > 0
      ? (loanPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : loanPrincipal / (totalMonths || 1);

  const monthlyTax = (homePrice * (propertyTaxRate / 100)) / 12;
  const monthlyInsurance = homeInsurance / 12;
  const monthlyMortgageTotal =
    monthlyPrincipalAndInterest + monthlyTax + monthlyInsurance + hoaFee;

  // 3. INVESTMENT & COMPOUND GROWTH
  const [invInitial, setInvInitial] = useState(10000);
  const [invMonthly, setInvMonthly] = useState(500);
  const [invRate, setInvRate] = useState(8.0);
  const [invYears, setInvYears] = useState(15);
  const [inflationRate, setInflationRate] = useState(2.5);

  const n = 12;
  const r = invRate / 100;
  const t = invYears;
  const periods = n * t;
  const ratePerMonth = r / n;

  const futureFromInit = invInitial * Math.pow(1 + ratePerMonth, periods);
  const futureFromMonthly =
    ratePerMonth > 0
      ? invMonthly * ((Math.pow(1 + ratePerMonth, periods) - 1) / ratePerMonth)
      : invMonthly * periods;
  const invTotalNominal = futureFromInit + futureFromMonthly;
  const invTotalDeposited = invInitial + invMonthly * periods;
  const invTotalInterest = Math.max(0, invTotalNominal - invTotalDeposited);
  const inflationFactor = Math.pow(1 + inflationRate / 100, t);
  const invTotalReal = invTotalNominal / inflationFactor;

  // 4. PROFIT MARGIN & MARKUP
  const [costPrice, setCostPrice] = useState(60);
  const [sellingPrice, setSellingPrice] = useState(100);

  const grossProfit = sellingPrice - costPrice;
  const profitMarginPercent = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;
  const markupPercent = costPrice > 0 ? (grossProfit / costPrice) * 100 : 0;

  // 5. ROI CALCULATOR
  const [roiInvested, setRoiInvested] = useState(25000);
  const [roiReturned, setRoiReturned] = useState(38500);
  const [roiYears, setRoiYears] = useState(3);

  const roiNetProfit = roiReturned - roiInvested;
  const roiTotalPercent = roiInvested > 0 ? (roiNetProfit / roiInvested) * 100 : 0;
  const annualizedRoi =
    roiInvested > 0 && roiYears > 0
      ? (Math.pow(roiReturned / roiInvested, 1 / roiYears) - 1) * 100
      : 0;

  // 6. TAX ESTIMATOR
  const [taxGrossIncome, setTaxGrossIncome] = useState(85000);
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single');
  const [deductions, setDeductions] = useState(14600); // Standard deduction 2024/2026 approx

  const taxableIncome = Math.max(0, taxGrossIncome - deductions);
  // Tiered federal progressive brackets simulation
  const calcFederalTax = (taxable: number) => {
    let tax = 0;
    if (taxable > 100000) {
      tax += (taxable - 100000) * 0.24 + 100000 * 0.16;
    } else if (taxable > 45000) {
      tax += (taxable - 45000) * 0.22 + 45000 * 0.12;
    } else if (taxable > 11000) {
      tax += (taxable - 11000) * 0.12 + 11000 * 0.1;
    } else {
      tax += taxable * 0.1;
    }
    return tax;
  };
  const estimatedFedTax = calcFederalTax(taxableIncome);
  const estimatedFica = taxGrossIncome * 0.0765;
  const totalEstimatedTax = estimatedFedTax + estimatedFica;
  const netTakeHomeAnnual = Math.max(0, taxGrossIncome - totalEstimatedTax);
  const effectiveTaxRate = taxGrossIncome > 0 ? (totalEstimatedTax / taxGrossIncome) * 100 : 0;

  // 7. SALARY & WAGE CONVERTER
  const [salaryInput, setSalaryInput] = useState(75000);
  const [salaryMode, setSalaryMode] = useState<'hourly' | 'annual'>('annual');
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);

  const annualSalary =
    salaryMode === 'annual'
      ? salaryInput
      : salaryInput * hoursPerWeek * weeksPerYear;
  const hourlyWage =
    salaryMode === 'hourly'
      ? salaryInput
      : annualSalary / (hoursPerWeek * weeksPerYear || 1);
  const monthlySalary = annualSalary / 12;
  const biWeeklySalary = annualSalary / 26;
  const weeklySalary = annualSalary / 52;
  const dailySalary = annualSalary / (5 * weeksPerYear || 1);

  // 8. MEETING TIME CALCULATOR
  const [baseTimeUtc, setBaseTimeUtc] = useState(14); // 2:00 PM UTC
  const CITIES = [
    { name: 'San Francisco (PT)', offset: -7 },
    { name: 'New York (ET)', offset: -4 },
    { name: 'London (GMT/BST)', offset: 1 },
    { name: 'Berlin / Paris (CET)', offset: 2 },
    { name: 'Dubai (GST)', offset: 4 },
    { name: 'Mumbai (IST)', offset: 5.5 },
    { name: 'Singapore (SGT)', offset: 8 },
    { name: 'Tokyo (JST)', offset: 9 },
    { name: 'Sydney (AEST)', offset: 10 },
  ];

  const formatHour = (utcHour: number, offset: number) => {
    let local = (utcHour + offset) % 24;
    if (local < 0) local += 24;
    const hours = Math.floor(local);
    const mins = (local % 1) * 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 || 12;
    const minStr = mins > 0 ? `:${Math.round(mins).toString().padStart(2, '0')}` : ':00';
    return {
      formatted: `${h12}${minStr} ${ampm}`,
      hours,
      isWorkHours: hours >= 9 && hours <= 18,
      isConvenient: hours >= 8 && hours <= 21,
    };
  };

  return (
    <div className="space-y-6">
      {/* 1. SIMPLE INTEREST */}
      {toolType === 'simple-interest' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1">
                Principal Amount ($)
              </label>
              <input
                type="number"
                value={siPrincipal}
                onChange={(e) => setSiPrincipal(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1">
                Annual Interest Rate (% APR)
              </label>
              <input
                type="number"
                step="0.1"
                value={siRate}
                onChange={(e) => setSiRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1">
                  Time Period
                </label>
                <input
                  type="number"
                  value={siTime}
                  onChange={(e) => setSiTime(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1">
                  Duration Unit
                </label>
                <select
                  value={siTimeUnit}
                  onChange={(e) => setSiTimeUnit(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1E] border border-[#D4AF37]/20 shadow-lg shadow-black/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Total Interest Accrued
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyResult(
                      `Interest: $${siInterest.toFixed(2)}, Total: $${siTotal.toFixed(2)}`
                    )
                  }
                  className="flex items-center gap-1 text-xs text-[#94A3B8] hover:text-[#D4AF37]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="py-2">
                <span className="text-4xl md:text-5xl font-extrabold text-white font-serif">
                  ${siInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-[#94A3B8] block mt-1">
                  Simple interest over {siTime} {siTimeUnit}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/15 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#64748B] block">Initial Principal:</span>
                <strong className="text-white text-sm font-mono">${siPrincipal.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-[#64748B] block">Total Repayment / Value:</span>
                <strong className="text-[#D4AF37] text-sm font-mono font-bold">
                  ${siTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MORTGAGE CALCULATOR */}
      {toolType === 'mortgage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                <span>Home Purchase Price</span>
                <span className="text-[#D4AF37] font-mono">${homePrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="2000000"
                step="5000"
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full accent-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block text-[#94A3B8] mb-1">
                  Down Payment ({downPaymentPercent}%)
                </label>
                <input
                  type="number"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block text-[#94A3B8] mb-1">
                  Interest Rate (% APR)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={mortgageRate}
                  onChange={(e) => setMortgageRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block text-[#94A3B8] mb-1">
                Loan Term (Years)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 20, 30].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setLoanTerm(yr)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      loanTerm === yr
                        ? 'bg-[#D4AF37] text-[#050810]'
                        : 'bg-[#161E31] border border-[#D4AF37]/15 text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {yr} Years
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[#64748B] block mb-1">Prop Tax (%/yr)</label>
                <input
                  type="number"
                  step="0.1"
                  value={propertyTaxRate}
                  onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#161E31] border border-[#D4AF37]/20 text-white"
                />
              </div>
              <div>
                <label className="text-[#64748B] block mb-1">Insurance ($/yr)</label>
                <input
                  type="number"
                  value={homeInsurance}
                  onChange={(e) => setHomeInsurance(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#161E31] border border-[#D4AF37]/20 text-white"
                />
              </div>
              <div>
                <label className="text-[#64748B] block mb-1">HOA Fee ($/mo)</label>
                <input
                  type="number"
                  value={hoaFee}
                  onChange={(e) => setHoaFee(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#161E31] border border-[#D4AF37]/20 text-white"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1E] border border-[#D4AF37]/20 shadow-lg shadow-black/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Total Monthly Payment
                </span>
                <span className="text-xs font-mono text-[#94A3B8]">PITI Breakdown</span>
              </div>
              <div className="py-2">
                <span className="text-4xl md:text-5xl font-extrabold text-white font-serif">
                  ${monthlyMortgageTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-[#94A3B8] block mt-1">
                  Principal & Interest: ${monthlyPrincipalAndInterest.toFixed(2)}/mo
                </span>
              </div>

              {/* Breakdown Bars */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Principal Loan Amount:</span>
                  <strong className="text-white font-mono">${loanPrincipal.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Down Payment ({downPaymentPercent}%):</span>
                  <strong className="text-white font-mono">${downPaymentAmount.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Monthly Property Tax:</span>
                  <strong className="text-white font-mono">${monthlyTax.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Monthly Home Insurance:</span>
                  <strong className="text-white font-mono">${monthlyInsurance.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/15 text-xs text-[#94A3B8]">
              Total loan cost over {loanTerm} years:{' '}
              <strong className="text-[#D4AF37] font-mono">
                ${(monthlyPrincipalAndInterest * totalMonths).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* 3. INVESTMENT & ROI / GROWTH */}
      {toolType === 'investment' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block text-[#94A3B8] mb-1">Starting Capital ($)</label>
                <input
                  type="number"
                  value={invInitial}
                  onChange={(e) => setInvInitial(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block text-[#94A3B8] mb-1">Monthly Deposit ($)</label>
                <input
                  type="number"
                  value={invMonthly}
                  onChange={(e) => setInvMonthly(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold block text-[#94A3B8] mb-1">Expected Return (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={invRate}
                  onChange={(e) => setInvRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block text-[#94A3B8] mb-1">Years to Grow</label>
                <input
                  type="number"
                  value={invYears}
                  onChange={(e) => setInvYears(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block text-[#94A3B8] mb-1">Est. Inflation (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold text-sm"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1E] border border-[#D4AF37]/20 shadow-lg shadow-black/40 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Projected Portfolio Value ({invYears} Years)
              </span>
              <div className="py-2">
                <span className="text-4xl md:text-5xl font-extrabold text-white font-serif">
                  ${invTotalNominal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className="text-xs text-[#94A3B8] block mt-1">
                  Inflation-Adjusted Purchasing Power: ~${invTotalReal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/15 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#64748B] block">Total Contributions:</span>
                <strong className="text-white text-sm font-mono">${invTotalDeposited.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-[#64748B] block">Compound Interest Earned:</span>
                <strong className="text-emerald-400 text-sm font-mono font-bold">
                  +${invTotalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PROFIT MARGIN */}
      {toolType === 'profit-margin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1">
                Cost of Goods / Item Cost ($)
              </label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1">
                Selling Price ($)
              </label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1E] border border-[#D4AF37]/20 shadow-lg shadow-black/40 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Gross Profit Margin
              </span>
              <div className="py-2">
                <span className="text-4xl md:text-5xl font-extrabold text-emerald-400 font-serif">
                  {profitMarginPercent.toFixed(2)}%
                </span>
                <span className="text-xs text-[#94A3B8] block mt-1">
                  Net Profit: ${grossProfit.toFixed(2)} per unit
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/15 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#64748B] block">Markup Percentage:</span>
                <strong className="text-white text-sm font-mono">{markupPercent.toFixed(2)}%</strong>
              </div>
              <div>
                <span className="text-[#64748B] block">Profit Multiplier:</span>
                <strong className="text-[#D4AF37] text-sm font-mono">{(sellingPrice / (costPrice || 1)).toFixed(2)}x</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. ROI CALCULATOR */}
      {toolType === 'roi' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1">
                Total Amount Invested ($)
              </label>
              <input
                type="number"
                value={roiInvested}
                onChange={(e) => setRoiInvested(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1">
                Total Return / Final Value ($)
              </label>
              <input
                type="number"
                value={roiReturned}
                onChange={(e) => setRoiReturned(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1">
                Holding Period (Years)
              </label>
              <input
                type="number"
                value={roiYears}
                onChange={(e) => setRoiYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1E] border border-[#D4AF37]/20 shadow-lg shadow-black/40 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Total Return on Investment (ROI)
              </span>
              <div className="py-2">
                <span
                  className={`text-4xl md:text-5xl font-extrabold font-serif ${
                    roiTotalPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {roiTotalPercent >= 0 ? `+${roiTotalPercent.toFixed(2)}%` : `${roiTotalPercent.toFixed(2)}%`}
                </span>
                <span className="text-xs text-[#94A3B8] block mt-1">
                  Net Gain: ${roiNetProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/15 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#64748B] block">Annualized ROI (CAGR):</span>
                <strong className="text-white text-sm font-mono">{annualizedRoi.toFixed(2)}%/yr</strong>
              </div>
              <div>
                <span className="text-[#64748B] block">Capital Ratio:</span>
                <strong className="text-[#D4AF37] text-sm font-mono">{(roiReturned / (roiInvested || 1)).toFixed(2)}x</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAX ESTIMATOR */}
      {toolType === 'tax' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1">
                Annual Gross Income ($)
              </label>
              <input
                type="number"
                value={taxGrossIncome}
                onChange={(e) => setTaxGrossIncome(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block text-[#94A3B8] mb-1">Filing Status</label>
                <select
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs font-semibold"
                >
                  <option value="single">Single</option>
                  <option value="married">Married Filing Jointly</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold block text-[#94A3B8] mb-1">Deductions ($)</label>
                <input
                  type="number"
                  value={deductions}
                  onChange={(e) => setDeductions(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1E] border border-[#D4AF37]/20 shadow-lg shadow-black/40 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Estimated Annual Take-Home Pay
              </span>
              <div className="py-2">
                <span className="text-4xl md:text-5xl font-extrabold text-white font-serif">
                  ${netTakeHomeAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className="text-xs text-[#94A3B8] block mt-1">
                  ~${(netTakeHomeAnnual / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })} per month
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/15 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#64748B] block">Federal & FICA Tax:</span>
                <strong className="text-rose-400 text-sm font-mono">
                  ${totalEstimatedTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </strong>
              </div>
              <div>
                <span className="text-[#64748B] block">Effective Tax Rate:</span>
                <strong className="text-white text-sm font-mono">{effectiveTaxRate.toFixed(1)}%</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. SALARY & WAGE CONVERTER */}
      {toolType === 'salary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSalaryMode('annual');
                  setSalaryInput(75000);
                }}
                className={`py-2 rounded-xl text-xs font-bold ${
                  salaryMode === 'annual'
                    ? 'bg-[#D4AF37] text-[#050810]'
                    : 'bg-[#161E31] text-[#94A3B8]'
                }`}
              >
                Annual Salary ($)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSalaryMode('hourly');
                  setSalaryInput(36);
                }}
                className={`py-2 rounded-xl text-xs font-bold ${
                  salaryMode === 'hourly'
                    ? 'bg-[#D4AF37] text-[#050810]'
                    : 'bg-[#161E31] text-[#94A3B8]'
                }`}
              >
                Hourly Wage ($/hr)
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">
                Enter {salaryMode === 'annual' ? 'Annual Compensation' : 'Hourly Rate'}
              </label>
              <input
                type="number"
                value={salaryInput}
                onChange={(e) => setSalaryInput(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Hours / Week</label>
                <input
                  type="number"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Weeks / Year</label>
                <input
                  type="number"
                  value={weeksPerYear}
                  onChange={(e) => setWeeksPerYear(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-xs"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1E] border border-[#D4AF37]/20 shadow-lg shadow-black/40 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3 block">
              Equated Salary Schedule Breakdown
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#161E31] border border-[#D4AF37]/15">
                <span className="text-[11px] text-[#64748B] block">Hourly</span>
                <strong className="text-white font-mono text-base">${hourlyWage.toFixed(2)}</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#161E31] border border-[#D4AF37]/15">
                <span className="text-[11px] text-[#64748B] block">Daily (8h)</span>
                <strong className="text-white font-mono text-base">${dailySalary.toFixed(2)}</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#161E31] border border-[#D4AF37]/15">
                <span className="text-[11px] text-[#64748B] block">Weekly</span>
                <strong className="text-white font-mono text-base">${weeklySalary.toFixed(2)}</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#161E31] border border-[#D4AF37]/15">
                <span className="text-[11px] text-[#64748B] block">Bi-Weekly</span>
                <strong className="text-white font-mono text-base">${biWeeklySalary.toFixed(2)}</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#161E31] border border-[#D4AF37]/15">
                <span className="text-[11px] text-[#64748B] block">Monthly</span>
                <strong className="text-white font-mono text-base">${monthlySalary.toFixed(2)}</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#161E31] border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                <span className="text-[11px] text-[#D4AF37] block font-bold">Annual</span>
                <strong className="text-white font-mono text-base">${annualSalary.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. MEETING TIME CALCULATOR */}
      {toolType === 'meeting' && (
        <div className="space-y-6">
          <div className="p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1">
                  Adjust Universal Meeting Time (UTC)
                </label>
                <span className="text-sm font-bold text-white">
                  UTC Time: {baseTimeUtc}:00 (14 = 2:00 PM UTC)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBaseTimeUtc((prev) => (prev > 0 ? prev - 1 : 23))}
                  className="px-3 py-1.5 rounded-lg bg-[#161E31] border border-[#D4AF37]/20 text-white font-bold"
                >
                  -1 hr
                </button>
                <button
                  type="button"
                  onClick={() => setBaseTimeUtc((prev) => (prev < 23 ? prev + 1 : 0))}
                  className="px-3 py-1.5 rounded-lg bg-[#161E31] border border-[#D4AF37]/20 text-white font-bold"
                >
                  +1 hr
                </button>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="23"
              value={baseTimeUtc}
              onChange={(e) => setBaseTimeUtc(Number(e.target.value))}
              className="w-full accent-[#D4AF37]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {CITIES.map((city) => {
              const res = formatHour(baseTimeUtc, city.offset);
              return (
                <div
                  key={city.name}
                  className={`p-4 rounded-xl border transition-all ${
                    res.isWorkHours
                      ? 'bg-[#161E31] border-emerald-500/40 text-white'
                      : res.isConvenient
                      ? 'bg-[#161E31] border-amber-500/30 text-white'
                      : 'bg-[#0F172A] border-rose-500/20 text-[#94A3B8]'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold">{city.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        res.isWorkHours
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : res.isConvenient
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {res.isWorkHours ? 'Work Hours' : res.isConvenient ? 'Waking' : 'Night'}
                    </span>
                  </div>
                  <span className="text-xl font-bold font-mono text-white block">
                    {res.formatted}
                  </span>
                  <span className="text-[10px] text-[#64748B] block mt-0.5">
                    Offset UTC {city.offset >= 0 ? `+${city.offset}` : city.offset}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
