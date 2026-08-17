import React, { useState, useEffect } from 'react';
import { Cake, Calendar, Clock, Sparkles, RefreshCw, Copy, Check } from 'lucide-react';

export const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState('1998-05-15');
  const [birthTime, setBirthTime] = useState('08:30');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [copied, setCopied] = useState(false);

  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
    totalSeconds: number;
    dayOfWeekBorn: string;
    zodiacSign: string;
    nextBirthday: {
      date: string;
      daysRemaining: number;
      dayOfWeek: string;
    };
  } | null>(null);

  const getZodiac = (month: number, day: number) => {
    const zodiacs = [
      { name: 'Capricorn ♑', start: [1, 1], end: [1, 19] },
      { name: 'Aquarius ♒', start: [1, 20], end: [2, 18] },
      { name: 'Pisces ♓', start: [2, 19], end: [3, 20] },
      { name: 'Aries ♈', start: [3, 21], end: [4, 19] },
      { name: 'Taurus ♉', start: [4, 20], end: [5, 20] },
      { name: 'Gemini ♊', start: [5, 21], end: [6, 20] },
      { name: 'Cancer ♋', start: [6, 21], end: [7, 22] },
      { name: 'Leo ♌', start: [7, 23], end: [8, 22] },
      { name: 'Virgo ♍', start: [8, 23], end: [9, 22] },
      { name: 'Libra ♎', start: [9, 23], end: [10, 22] },
      { name: 'Scorpio ♏', start: [10, 23], end: [11, 21] },
      { name: 'Sagittarius ♐', start: [11, 22], end: [12, 21] },
      { name: 'Capricorn ♑', start: [12, 22], end: [12, 31] },
    ];
    for (const z of zodiacs) {
      if (
        (month === z.start[0] && day >= z.start[1]) ||
        (month === z.end[0] && day <= z.end[1])
      ) {
        return z.name;
      }
    }
    return 'Capricorn ♑';
  };

  const calculateAge = () => {
    if (!birthDate) return;
    const bDate = new Date(`${birthDate}T${birthTime || '00:00'}:00`);
    const tDate = new Date(`${targetDate}T23:59:59`);

    if (isNaN(bDate.getTime()) || isNaN(tDate.getTime()) || bDate > tDate) {
      setResult(null);
      return;
    }

    const birthYear = bDate.getFullYear();
    const birthMonth = bDate.getMonth();
    const birthDay = bDate.getDate();

    const targetYear = tDate.getFullYear();
    const targetMonth = tDate.getMonth();
    const targetDay = tDate.getDate();

    let years = targetYear - birthYear;
    let months = targetMonth - birthMonth;
    let days = targetDay - birthDay;

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(targetYear, targetMonth, 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = tDate.getTime() - bDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalSeconds = Math.floor(diffMs / 1000);

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeekBorn = weekdays[bDate.getDay()];
    const zodiacSign = getZodiac(birthMonth + 1, birthDay);

    // Next Birthday calculation
    let nextBdayYear = targetYear;
    let nextBdayDate = new Date(nextBdayYear, birthMonth, birthDay);
    if (nextBdayDate < tDate) {
      nextBdayYear += 1;
      nextBdayDate = new Date(nextBdayYear, birthMonth, birthDay);
    }
    const daysUntilNext = Math.ceil(
      (nextBdayDate.getTime() - tDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    setResult({
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      dayOfWeekBorn,
      zodiacSign,
      nextBirthday: {
        date: nextBdayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        daysRemaining: daysUntilNext,
        dayOfWeek: weekdays[nextBdayDate.getDay()],
      },
    });
  };

  useEffect(() => {
    calculateAge();
  }, [birthDate, birthTime, targetDate]);

  const handleCopySummary = () => {
    if (!result) return;
    const text = `Age Summary: ${result.years} years, ${result.months} months, ${result.days} days | Total Days: ${result.totalDays.toLocaleString()} | Next Birthday in: ${result.nextBirthday.daysRemaining} days (${result.nextBirthday.date})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setBirthDate('2000-01-01');
    setBirthTime('12:00');
    setTargetDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div id="age-calculator-tool" className="space-y-6">
      {/* Control Card */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg shadow-black/40">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
              Date of Birth
            </label>
            <input
              id="age-birth-date"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
              Birth Time (Optional)
            </label>
            <input
              id="age-birth-time"
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
              Age As Of Date
            </label>
            <input
              id="age-target-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between pt-3.5 border-t border-[#D4AF37]/15">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#D4AF37] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          {result && (
            <button
              type="button"
              id="copy-age-summary-btn"
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-[#050810] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Summary!' : 'Copy Summary'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Dashboard */}
      {result ? (
        <div className="space-y-4">
          {/* Main Hero Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1E] border border-[#D4AF37]/30 shadow-xl shadow-black/50">
            <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-2">
              <Cake className="w-4 h-4" />
              <span>Exact Chronological Age</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-4xl md:text-5xl font-extrabold text-white font-serif">
                {result.years} <span className="text-lg md:text-2xl font-normal text-[#D4AF37]">Years</span>
              </span>
              <span className="text-2xl md:text-3xl font-bold text-[#E2E8F0]">
                {result.months} <span className="text-base font-normal text-[#94A3B8]">Months</span>
              </span>
              <span className="text-2xl md:text-3xl font-bold text-[#E2E8F0]">
                {result.days} <span className="text-base font-normal text-[#94A3B8]">Days</span>
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-2">
              Born on a <strong className="text-white">{result.dayOfWeekBorn}</strong> • Zodiac: <strong className="text-[#D4AF37]">{result.zodiacSign}</strong>
            </p>
          </div>

          {/* Next Birthday Card & Total Units Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Next Birthday */}
            <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/15 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Next Birthday Countdown
                </h4>
                <p className="text-xl font-bold text-white mt-0.5">
                  {result.nextBirthday.daysRemaining === 0 ? 'Today is your Birthday! 🎂' : `in ${result.nextBirthday.daysRemaining} days`}
                </p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  {result.nextBirthday.date} ({result.nextBirthday.dayOfWeek})
                </p>
              </div>
            </div>

            {/* Total Days & Hours */}
            <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/15 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="w-full">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Total Lifetime Span
                </h4>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <span className="text-base font-bold text-white">
                      {result.totalDays.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-[#64748B]">Total Days</p>
                  </div>
                  <div>
                    <span className="text-base font-bold text-white">
                      {result.totalHours.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-[#64748B]">Total Hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-sm text-[#94A3B8] bg-[#0F172A] rounded-2xl border border-[#D4AF37]/15">
          Please select a valid birth date in the past.
        </div>
      )}
    </div>
  );
};
