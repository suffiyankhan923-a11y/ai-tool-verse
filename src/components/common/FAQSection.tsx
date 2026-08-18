import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { ToolFAQ } from '../../types';

interface FAQSectionProps {
  faqs: ToolFAQ[];
  title?: string;
  className?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  faqs,
  title = 'Frequently Asked Questions',
  className = '',
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section id="faq-section" aria-label="Frequently Asked Questions" className={`my-10 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
          <HelpCircle className="w-4 h-4" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold font-serif text-white">
          {title}
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              id={`faq-item-${index}`}
              className="rounded-xl border border-[#D4AF37]/15 bg-[#0F172A] overflow-hidden transition-colors"
            >
              <button
                type="button"
                id={`faq-toggle-${index}`}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left text-sm md:text-base font-semibold text-[#E2E8F0] hover:text-[#D4AF37] transition-colors focus:outline-none"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#D4AF37] shrink-0 ml-3 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${index}`}
                  className="px-4 pb-5 md:px-5 text-xs md:text-sm text-[#94A3B8] leading-relaxed border-t border-[#D4AF37]/10 pt-3"
                >
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
