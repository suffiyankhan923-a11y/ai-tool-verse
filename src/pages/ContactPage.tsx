import React, { useState } from 'react';
import { SEOHead } from '../components/common/SEOHead.js';
import { Mail, MessageSquare, Send, CheckCircle2, Loader2, Sparkles, Clock } from 'lucide-react';
import { AdPlaceholder } from '../components/common/AdPlaceholder.js';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Tool Suggestion');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (err: any) {
      setError('Network connection error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SEOHead
        title="Contact ToolVerse - Support & Tool Requests"
        description="Have a tool suggestion or need technical assistance? Contact the ToolVerse engineering team."
      />

      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B5824C] dark:text-[#DFB267] px-3 py-1 rounded-full bg-[#B5824C]/10 dark:bg-[#DFB267]/15 border border-[#B5824C]/20">
          Concierge & Inquiries
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] tracking-tight font-['Outfit',sans-serif]">
          Contact Engineering & Support
        </h1>
        <p className="text-sm text-[#756E65] dark:text-[#9E9B96] max-w-xl mx-auto">
          We welcome new tool requests, bug reports, and partnership inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Info Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#1F1B18] dark:text-[#F7F5F0] flex items-center gap-2 font-['Outfit',sans-serif]">
              <Sparkles className="w-4 h-4 text-[#B5824C] dark:text-[#DFB267]" />
              Support Channels
            </h3>
            
            <div className="space-y-3 text-xs text-[#756E65] dark:text-[#9E9B96]">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#22252E] border border-[#EAE2D5]/50 dark:border-[#2C303B]/50">
                <Mail className="w-4 h-4 text-[#B5824C] dark:text-[#DFB267] mt-0.5" />
                <div>
                  <span className="font-semibold text-[#1F1B18] dark:text-[#F7F5F0] block">Email Concierge</span>
                  <span>support@toolverse.dev</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#22252E] border border-[#EAE2D5]/50 dark:border-[#2C303B]/50">
                <Clock className="w-4 h-4 text-[#C87D65] dark:text-[#E89D86] mt-0.5" />
                <div>
                  <span className="font-semibold text-[#1F1B18] dark:text-[#F7F5F0] block">Response Time</span>
                  <span>Within 24 business hours</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#22252E] border border-[#EAE2D5]/50 dark:border-[#2C303B]/50">
                <MessageSquare className="w-4 h-4 text-[#B5824C] dark:text-[#DFB267] mt-0.5" />
                <div>
                  <span className="font-semibold text-[#1F1B18] dark:text-[#F7F5F0] block">Tool Requests</span>
                  <span>Suggest tools to be added to our SQLite database</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7 bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 sm:p-8 shadow-xs">
          {success ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">Message Sent Successfully!</h3>
              <p className="text-xs text-[#756E65] dark:text-[#9E9B96] max-w-sm mx-auto">
                Thank you for reaching out. Our engineering team has logged your inquiry into our database.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 px-4 py-2 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-[#1F1B18] dark:text-[#F7F5F0] mb-2 font-['Outfit',sans-serif]">
                Send a Direct Message
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-xs text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-xs text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-xs text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none"
                >
                  <option>Tool Suggestion / Request</option>
                  <option>Bug Report / Technical Issue</option>
                  <option>Feature Request</option>
                  <option>General Feedback</option>
                  <option>Partnership & Advertising</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1B18] dark:text-[#F7F5F0] mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide details about your inquiry or tool suggestion..."
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE2D5] dark:border-[#2C303B] bg-[#FAF7F2] dark:bg-[#22252E] text-xs text-[#1F1B18] dark:text-[#F7F5F0] focus:outline-none focus:border-[#B5824C]"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>

      <AdPlaceholder location="in-content" />
    </div>
  );
};
