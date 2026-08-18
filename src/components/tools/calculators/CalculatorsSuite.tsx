import React, { useState } from 'react';
import { Receipt, Tag, FileSpreadsheet, TrendingUp, Clock, Calendar, Copy, Check, Users } from 'lucide-react';

// ================= TIP CALCULATOR =================
export const TipCalculator: React.FC = () => {
  const [billAmount, setBillAmount] = useState(85);
  const [tipPercent, setTipPercent] = useState(18);
  const [splitCount, setSplitCount] = useState(2);
  const [copied, setCopied] = useState(false);

  const bill = Number(billAmount) || 0;
  const tip = (bill * (Number(tipPercent) || 0)) / 100;
  const total = bill + tip;
  const perPersonTotal = splitCount > 0 ? total / splitCount : total;
  const perPersonTip = splitCount > 0 ? tip / splitCount : tip;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
            Bill Total ($)
          </label>
          <input
            type="number"
            value={billAmount}
            onChange={(e) => setBillAmount(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
            Select Tip %
          </label>
          <div className="grid grid-cols-5 gap-1.5 mb-2">
            {[10, 15, 18, 20, 25].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setTipPercent(pct)}
                className={`py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  tipPercent === pct
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
          <input
            type="number"
            value={tipPercent}
            onChange={(e) => setTipPercent(Number(e.target.value))}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
            placeholder="Custom %"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
            Split Between (People)
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-base font-bold text-slate-700 dark:text-slate-200"
            >
              -
            </button>
            <span className="text-lg font-bold w-12 text-center text-slate-900 dark:text-slate-100">
              {splitCount}
            </span>
            <button
              type="button"
              onClick={() => setSplitCount(splitCount + 1)}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-base font-bold text-slate-700 dark:text-slate-200"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-slate-900/10 dark:from-[#0c1322] dark:to-[#080d1a] border border-amber-500/20 shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Per Person
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`Bill: $${bill.toFixed(2)}, Tip: $${tip.toFixed(2)}, Per Person: $${perPersonTotal.toFixed(2)}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs text-amber-600 dark:text-amber-400 font-medium"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="py-2">
            <span className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-display">
              ${perPersonTotal.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 block mt-1">
              includes ${perPersonTip.toFixed(2)} tip each
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-400 block">Total Tip ({tipPercent}%):</span>
            <strong className="text-slate-900 dark:text-slate-100 text-sm">${tip.toFixed(2)}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Grand Total:</span>
            <strong className="text-slate-900 dark:text-slate-100 text-sm">${total.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= DISCOUNT CALCULATOR =================
export const DiscountCalculator: React.FC = () => {
  const [originalPrice, setOriginalPrice] = useState(120);
  const [primaryDiscount, setPrimaryDiscount] = useState(25);
  const [additionalCoupon, setAdditionalCoupon] = useState(10);
  const [salesTax, setSalesTax] = useState(8);

  const price = Number(originalPrice) || 0;
  const afterFirstDiscount = price - (price * (Number(primaryDiscount) || 0)) / 100;
  const afterSecondDiscount = afterFirstDiscount - (afterFirstDiscount * (Number(additionalCoupon) || 0)) / 100;
  const taxAmount = (afterSecondDiscount * (Number(salesTax) || 0)) / 100;
  const finalPrice = afterSecondDiscount + taxAmount;
  const totalSavings = price - afterSecondDiscount;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Original Price ($)
          </label>
          <input
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold block mb-1">Discount (% Off)</label>
            <input
              type="number"
              value={primaryDiscount}
              onChange={(e) => setPrimaryDiscount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Extra Coupon (% Off)</label>
            <input
              type="number"
              value={additionalCoupon}
              onChange={(e) => setAdditionalCoupon(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Sales Tax (% Optional)</label>
          <input
            type="number"
            value={salesTax}
            onChange={(e) => setSalesTax(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Final Checkout Price
          </span>
          <div className="py-3">
            <span className="text-4xl md:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400 font-display">
              ${finalPrice.toFixed(2)}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold block mt-1">
              You Save: ${totalSavings.toFixed(2)} ({((totalSavings / (price || 1)) * 100).toFixed(0)}% Off)
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1 text-slate-500">
          <div className="flex justify-between">
            <span>After primary discount:</span>
            <strong>${afterFirstDiscount.toFixed(2)}</strong>
          </div>
          <div className="flex justify-between">
            <span>Sales tax ({salesTax}%):</span>
            <strong>+${taxAmount.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= GST / VAT CALCULATOR =================
export const GstCalculator: React.FC = () => {
  const [amount, setAmount] = useState(1000);
  const [gstRate, setGstRate] = useState(18);
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  const base = Number(amount) || 0;
  const rate = Number(gstRate) || 0;

  let netAmount = 0;
  let taxAmount = 0;
  let grossAmount = 0;

  if (mode === 'exclusive') {
    netAmount = base;
    taxAmount = (base * rate) / 100;
    grossAmount = base + taxAmount;
  } else {
    grossAmount = base;
    taxAmount = base - base * (100 / (100 + rate));
    netAmount = grossAmount - taxAmount;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
            Calculation Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('exclusive')}
              className={`py-2 rounded-xl text-xs font-bold ${
                mode === 'exclusive'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              GST Exclusive (+ Tax)
            </button>
            <button
              type="button"
              onClick={() => setMode('inclusive')}
              className={`py-2 rounded-xl text-xs font-bold ${
                mode === 'inclusive'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              GST Inclusive (- Tax)
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold block mb-1">Base Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
          />
        </div>

        <div>
          <label className="text-xs font-semibold block mb-1">GST / VAT Rate (%)</label>
          <div className="grid grid-cols-5 gap-1 mb-2">
            {[5, 12, 18, 20, 28].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setGstRate(r)}
                className={`py-1 rounded text-xs font-semibold ${
                  gstRate === r ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {r}%
              </button>
            ))}
          </div>
          <input
            type="number"
            value={gstRate}
            onChange={(e) => setGstRate(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total {mode === 'exclusive' ? 'Gross Amount' : 'Net Amount'}
          </span>
          <div className="py-3">
            <span className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-display">
              ${grossAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-400">
          <div className="flex justify-between">
            <span>Net Base Amount:</span>
            <strong className="text-slate-900 dark:text-slate-100">${netAmount.toFixed(2)}</strong>
          </div>
          <div className="flex justify-between">
            <span>Tax Amount ({rate}%):</span>
            <strong className="text-amber-600 dark:text-amber-400">${taxAmount.toFixed(2)}</strong>
          </div>
          <div className="flex justify-between font-bold border-t border-slate-100 dark:border-slate-800 pt-1 text-slate-900 dark:text-slate-100">
            <span>Gross Total:</span>
            <span>${grossAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= COMPOUND INTEREST CALCULATOR =================
export const CompoundInterestCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState(10000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(250);
  const [rate, setRate] = useState(7.5);
  const [years, setYears] = useState(10);
  const [frequency, setFrequency] = useState<number>(12); // monthly

  const p = Number(principal) || 0;
  const pmt = Number(monthlyDeposit) || 0;
  const r = (Number(rate) || 0) / 100;
  const t = Number(years) || 1;
  const n = frequency;

  // Compound with regular deposits formula
  // FV = P*(1+r/n)^(nt) + PMT * [((1+r/n)^(nt) - 1) / (r/n)]
  const totalPeriods = n * t;
  const ratePerPeriod = r / n;
  const compoundFactor = Math.pow(1 + ratePerPeriod, totalPeriods);

  const futureFromPrincipal = p * compoundFactor;
  const futureFromDeposits = ratePerPeriod > 0
    ? (pmt * 12 / n) * ((compoundFactor - 1) / ratePerPeriod)
    : pmt * 12 * t;

  const finalBalance = futureFromPrincipal + futureFromDeposits;
  const totalDeposited = p + pmt * 12 * t;
  const totalInterestEarned = finalBalance - totalDeposited;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div>
          <label className="text-xs font-semibold block mb-1">Initial Deposit ($)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Monthly Contribution ($)</label>
          <input
            type="number"
            value={monthlyDeposit}
            onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold block mb-1">Annual Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Investment Years</label>
            <input
              type="number"
              min="1"
              max="50"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-slate-900/10 dark:from-[#0c1322] dark:to-[#080d1a] border border-amber-500/20 shadow-md flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Projected Balance after {years} Years
          </span>
          <div className="py-3">
            <span className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-display">
              ${finalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block">Total Contributions:</span>
            <strong className="text-slate-900 dark:text-slate-100 text-sm">${totalDeposited.toLocaleString()}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Total Interest Accrued:</span>
            <strong className="text-amber-600 dark:text-amber-400 text-sm">${totalInterestEarned.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= TIME CALCULATOR =================
export const TimeCalculator: React.FC = () => {
  const [h1, setH1] = useState(8);
  const [m1, setM1] = useState(30);
  const [h2, setH2] = useState(4);
  const [m2, setM2] = useState(45);
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');

  const totalMin1 = Number(h1) * 60 + Number(m1);
  const totalMin2 = Number(h2) * 60 + Number(m2);

  const diffMins = operation === 'add' ? totalMin1 + totalMin2 : Math.max(0, totalMin1 - totalMin2);
  const resHours = Math.floor(diffMins / 60);
  const resMinutes = diffMins % 60;
  const decimalHours = (diffMins / 60).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setOperation('add')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
              operation === 'add' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            Add Times (+)
          </button>
          <button
            type="button"
            onClick={() => setOperation('subtract')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
              operation === 'subtract' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            Subtract Times (-)
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold block mb-1">Time 1 (Hours : Mins)</label>
            <div className="flex gap-1">
              <input
                type="number"
                value={h1}
                onChange={(e) => setH1(Number(e.target.value))}
                className="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center text-sm font-semibold"
              />
              <input
                type="number"
                value={m1}
                onChange={(e) => setM1(Number(e.target.value))}
                className="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center text-sm font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Time 2 (Hours : Mins)</label>
            <div className="flex gap-1">
              <input
                type="number"
                value={h2}
                onChange={(e) => setH2(Number(e.target.value))}
                className="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center text-sm font-semibold"
              />
              <input
                type="number"
                value={m2}
                onChange={(e) => setM2(Number(e.target.value))}
                className="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center text-sm font-semibold"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Accumulated Time
          </span>
          <div className="py-3">
            <span className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-display">
              {resHours}h {resMinutes}m
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <p>
            Decimal Hours (for timesheets): <strong>{decimalHours} hours</strong>
          </p>
          <p className="mt-1">
            Total Seconds: <strong>{(diffMins * 60).toLocaleString()}s</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

// ================= DATE CALCULATOR =================
export const DateCalculator: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [includeEnd, setIncludeEnd] = useState(true);

  const d1 = new Date(startDate);
  const d2 = new Date(endDate);

  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (includeEnd && diffDays >= 0) diffDays += 1;

  // Calculate business days (excluding Saturday & Sunday)
  let businessDays = 0;
  const cur = new Date(d1 < d2 ? d1 : d2);
  const end = new Date(d1 < d2 ? d2 : d1);

  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) {
      businessDays++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div>
          <label className="text-xs font-semibold block mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={includeEnd}
            onChange={(e) => setIncludeEnd(e.target.checked)}
            className="rounded accent-amber-500"
          />
          <span>Include end date in total count</span>
        </label>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Calendar Days
          </span>
          <div className="py-3">
            <span className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-display">
              {diffDays.toLocaleString()} Days
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
          <p>
            Working / Business Days (Mon–Fri): <strong>{businessDays} days</strong>
          </p>
          <p>
            Total Weeks: <strong>{(diffDays / 7).toFixed(1)} weeks</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
