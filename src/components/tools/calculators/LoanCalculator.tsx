import React, { useState } from 'react';
import { DollarSign, Copy, Check, PieChart } from 'lucide-react';

export const LoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(5);
  const [copied, setCopied] = useState(false);

  // Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
  const principal = Number(loanAmount) || 0;
  const annualRate = (Number(interestRate) || 0) / 100;
  const monthlyRate = annualRate / 12;
  const totalMonths = (Number(loanTermYears) || 1) * 12;

  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = principal / totalMonths;
  } else {
    monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const totalRepayment = monthlyPayment * totalMonths;
  const totalInterest = totalRepayment - principal;
  const interestPercentage = totalRepayment > 0 ? (totalInterest / totalRepayment) * 100 : 0;

  const handleCopy = () => {
    const text = `Loan Estimate: $${principal.toLocaleString()} at ${interestRate}% for ${loanTermYears} years. Monthly Payment: $${monthlyPayment.toFixed(2)} | Total Interest: $${totalInterest.toFixed(2)} | Total Paid: $${totalRepayment.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="loan-calculator-tool" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40 space-y-5">
          <div>
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
              <span>Loan Amount (Principal)</span>
              <span className="text-[#D4AF37] font-bold font-mono">${loanAmount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="500000"
              step="1000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-[#D4AF37]"
            />
            <div className="relative mt-2">
              <span className="absolute left-3 top-2.5 text-[#64748B] text-sm font-semibold">$</span>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-sm font-semibold focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
              <span>Annual Interest Rate (APR)</span>
              <span className="text-[#D4AF37] font-bold font-mono">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="30"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-[#D4AF37]"
            />
            <div className="relative mt-2">
              <span className="absolute right-3 top-2.5 text-[#64748B] text-sm font-semibold">%</span>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-sm font-semibold focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
              <span>Loan Tenure (Years)</span>
              <span className="text-[#D4AF37] font-bold font-mono">{loanTermYears} Years ({totalMonths} mo)</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 3, 5, 10].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setLoanTermYears(yr)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    loanTermYears === yr
                      ? 'bg-[#D4AF37] text-[#050810] shadow-sm font-bold'
                      : 'bg-[#161E31] border border-[#D4AF37]/15 text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {yr} yr
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1E] border border-[#D4AF37]/20 shadow-lg shadow-black/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Monthly Repayment (EMI)
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

            <div className="text-left py-2">
              <span className="text-4xl md:text-5xl font-extrabold text-white font-serif">
                ${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-[#94A3B8] block mt-1">per month for {totalMonths} months</span>
            </div>

            {/* Visual ratio bar */}
            <div className="my-5">
              <div className="flex justify-between text-xs font-semibold text-[#94A3B8] mb-1">
                <span>Principal: ${principal.toLocaleString()}</span>
                <span>Interest: ${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-[#161E31] border border-[#D4AF37]/15 overflow-hidden flex">
                <div
                  className="bg-[#D4AF37] h-full"
                  style={{ width: `${100 - interestPercentage}%` }}
                  title="Principal"
                />
                <div
                  className="bg-rose-500 h-full"
                  style={{ width: `${interestPercentage}%` }}
                  title="Interest"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#D4AF37]/15 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#64748B] block">Total Interest:</span>
              <strong className="text-white text-sm font-mono">
                ${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </div>
            <div>
              <span className="text-[#64748B] block">Total Repaid:</span>
              <strong className="text-[#D4AF37] text-sm font-mono font-bold">
                ${totalRepayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
