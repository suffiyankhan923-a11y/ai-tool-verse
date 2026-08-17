import React from 'react';
import { SEOHead } from '../components/common/SEOHead.js';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 sm:p-10 shadow-xs">
      <SEOHead
        title="Privacy Policy - ToolVerse"
        description="Learn about our client-side zero-storage privacy policies and data protection standards."
      />

      <div className="border-b border-[#EAE2D5] dark:border-[#2C303B] pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B5824C] dark:text-[#DFB267]">Legal Disclosure</span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] mt-1 font-['Outfit',sans-serif]">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#756E65] dark:text-[#9E9B96] mt-1">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-[#756E65] dark:text-[#9E9B96] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">1. Client-Side Processing Architecture</h2>
          <p>
            At ToolVerse, user data privacy is our cornerstone. Most utilities on our platform (including JSON formatters, base64 encoders, image compressors, password generators, and PDF manipulators) execute entirely within your local browser sandbox via JavaScript and WebAssembly.
          </p>
          <p>
            Your input documents, uploaded images, raw source codes, and credentials are NEVER transmitted to or saved on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">2. Artificial Intelligence Requests</h2>
          <p>
            When utilizing AI-assisted features (such as Prompt Generation or Text Summarization), payloads are processed statelessly via our secure backend proxy to Google Gemini APIs. Queries are not used for model training and are immediately discarded after response delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">3. Local Storage & Preferences</h2>
          <p>
            We use browser <code>localStorage</code> solely to save your local UI preferences, including Dark/Light mode theme state and pinned tool bookmarks (Favorites). No personal identifiers or tracking pixels are placed.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">4. Advertisements & Third-Party Services</h2>
          <p>
            ToolVerse displays non-intrusive advertisements to maintain our servers and free access. Third-party advertising partners may use standard HTTP cookies according to their respective privacy standards.
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 bg-white dark:bg-[#181A20] border border-[#EAE2D5] dark:border-[#2C303B] rounded-3xl p-6 sm:p-10 shadow-xs">
      <SEOHead
        title="Terms of Service - ToolVerse"
        description="Review terms of service and usage guidelines for ToolVerse."
      />

      <div className="border-b border-[#EAE2D5] dark:border-[#2C303B] pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B5824C] dark:text-[#DFB267]">Terms & Conditions</span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F1B18] dark:text-[#F7F5F0] mt-1 font-['Outfit',sans-serif]">
          Terms of Service
        </h1>
        <p className="text-xs text-[#756E65] dark:text-[#9E9B96] mt-1">Effective Date: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-[#756E65] dark:text-[#9E9B96] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">1. Acceptance of Terms</h2>
          <p>
            By accessing or using ToolVerse utilities, you agree to be bound by these Terms of Service. If you disagree with any part, you must refrain from using the platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">2. Permitted Use</h2>
          <p>
            All tools are provided free of charge for personal, educational, and commercial purposes. You agree not to abuse, DDoS, or attempt to decompile backend administrative APIs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1F1B18] dark:text-[#F7F5F0] font-['Outfit',sans-serif]">3. Disclaimer of Warranty</h2>
          <p>
            The software and utilities are provided "as is" without warranty of any kind, express or implied. ToolVerse assumes no liability for loss of data or output accuracy resulting from the use of its tools.
          </p>
        </section>
      </div>
    </div>
  );
};
