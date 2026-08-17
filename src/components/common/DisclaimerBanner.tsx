import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

interface DisclaimerBannerProps {
  type?: 'financial' | 'health' | 'general';
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ type = 'general' }) => {
  const getContent = () => {
    switch (type) {
      case 'financial':
        return {
          title: 'Financial Disclaimer',
          text: 'This calculator provides estimates for informational and illustrative purposes only. Calculations should not be construed as financial, investment, or tax advice. Actual loan terms, interest calculations, and tax liabilities may vary based on lender policies, jurisdiction, and creditworthiness. Always verify calculations with a qualified financial advisor.',
        };
      case 'health':
        return {
          title: 'Medical & Health Disclaimer',
          text: 'Calculations provided by this health screening tool are estimates based on standard clinical formulas and are intended strictly for educational and fitness tracking purposes. They do not constitute medical advice, diagnosis, or treatment. Consult a licensed physician or healthcare provider before beginning any diet or training regimen.',
        };
      default:
        return {
          title: 'General Disclaimer',
          text: 'Tools and calculations on ToolVerse are provided free of charge for everyday informational use. While we strive for absolute mathematical precision, always verify critical outputs independently.',
        };
    }
  };

  const content = getContent();

  return (
    <div
      id="disclaimer-banner"
      role="note"
      aria-label={content.title}
      className="my-6 p-4 rounded-xl border border-[#D4AF37]/30 bg-[#0F172A] text-[#94A3B8] text-xs leading-relaxed flex items-start gap-3 shadow-md shadow-black/40"
    >
      <div className="p-1.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 shrink-0 mt-0.5">
        {type === 'health' ? <ShieldAlert className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      </div>
      <div>
        <strong className="font-semibold text-[#D4AF37] block mb-0.5 tracking-wide uppercase text-[11px]">
          {content.title}
        </strong>
        <p className="text-[#94A3B8]">{content.text}</p>
      </div>
    </div>
  );
};
