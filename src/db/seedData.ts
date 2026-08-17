export const seedCategories = [
  {
    name: "AI Tools",
    slug: "ai-tools",
    description: "Supercharge your workflow with next-generation AI prompt, copy, email, and social media generators.",
    icon: "Sparkles",
    color: "#89906F"
  },
  {
    name: "Writing Tools",
    slug: "writing-tools",
    description: "Analyze, format, proofread, and summarize text with instant precision and readability scoring.",
    icon: "PenTool",
    color: "#D4A373"
  },
  {
    name: "Developer Tools",
    slug: "developer-tools",
    description: "Clean JSON, encode/decode base64 and URLs, generate high-entropy passwords, and debug faster.",
    icon: "Code2",
    color: "#6B7280"
  },
  {
    name: "Image Tools",
    slug: "image-tools",
    description: "Generate dynamic QR codes, extract color palettes, compress, resize, and convert images client-side.",
    icon: "Image",
    color: "#AFB892"
  },
  {
    name: "PDF Tools",
    slug: "pdf-tools",
    description: "Merge, split, extract pages, convert between images and PDF, and inspect document metadata securely.",
    icon: "FileText",
    color: "#89906F"
  }
];

export const seedTools = [
  // AI TOOLS
  {
    name: "AI Prompt Generator",
    slug: "ai-prompt-generator",
    short_description: "Generate highly optimized, context-rich prompts for ChatGPT, Claude, and Gemini.",
    full_description: "Unlock high-quality AI outputs by crafting structured, role-based prompts. Specify your target persona, audience, output constraints, tone, and goals to generate prompt templates ready for one-click copying.",
    category: "ai-tools",
    keywords: "ai prompt, prompt engineering, chatgpt prompt, claude prompt, gemini prompt, prompt builder",
    faq: JSON.stringify([
      { question: "Why do structured prompts yield better results?", answer: "Structured prompts provide the AI model with clear constraints, contextual background, and explicit formatting instructions, preventing hallucinations." },
      { question: "Can I use these prompts across any AI platform?", answer: "Yes, generated prompts are universal and work seamlessly in Gemini, ChatGPT, Claude, and open-source LLMs." }
    ]),
    icon: "Sparkles",
    featured: 1,
    trending: 1
  },
  {
    name: "AI Email Generator",
    slug: "ai-email-generator",
    short_description: "Draft professional, persuasive, or casual emails tailored to your recipient in seconds.",
    full_description: "Eliminate email writer's block. Select your objective (Cold outreach, follow-up, apology, job inquiry, team update), recipient relationship, tone, and bullet points to generate complete, polished email drafts with subject lines.",
    category: "ai-tools",
    keywords: "ai email, cold email, business email generator, email copywriter, email templates",
    faq: JSON.stringify([
      { question: "How do I ensure the email sounds like me?", answer: "Select your preferred tone setting (Casual, Friendly, Executive, Direct) and provide key context in the bullet notes." }
    ]),
    icon: "Mail",
    featured: 1,
    trending: 0
  },
  {
    name: "AI Caption Generator",
    slug: "ai-caption-generator",
    short_description: "Create engaging social media captions for Instagram, TikTok, LinkedIn, and Twitter.",
    full_description: "Generate viral social media copy tailored specifically to platform algorithms. Includes hooks, storytelling bodies, call-to-actions, and relevant hashtag suggestions.",
    category: "ai-tools",
    keywords: "instagram captions, tiktok captions, linkedin posts, social media ai, caption writer",
    faq: JSON.stringify([
      { question: "Does this include hashtags?", answer: "Yes, the generator appends curated, high-converting hashtags optimized for your niche." }
    ]),
    icon: "Share2",
    featured: 0,
    trending: 1
  },
  {
    name: "AI Headline Generator",
    slug: "ai-headline-generator",
    short_description: "Generate high-converting headlines and titles for blog posts, ads, and landing pages.",
    full_description: "Boost your click-through rates with AI-crafted headlines utilizing proven copywriting formulas (How-To, Listicle, Question, Urgency, Emotional, Curiosity Gap).",
    category: "ai-tools",
    keywords: "headline generator, title generator, blog titles, youtube title generator, ad headlines",
    faq: JSON.stringify([
      { question: "What headline formulas are supported?", answer: "Formulas include Listicle, Curiosity Gap, How-To, Direct Benefit, Question, and Urgency-driven titles." }
    ]),
    icon: "Type",
    featured: 0,
    trending: 0
  },
  {
    name: "AI Hashtag Generator",
    slug: "ai-hashtag-generator",
    short_description: "Discover trending and niche hashtags to maximize reach across all social networks.",
    full_description: "Generate balanced hashtag sets categorized by high-volume, mid-tier, and hyper-targeted niche tags to expand organic reach without triggering spam filters.",
    category: "ai-tools",
    keywords: "hashtag generator, instagram hashtags, tiktok tags, twitter hashtags, hashtag finder",
    faq: JSON.stringify([
      { question: "How many hashtags should I use?", answer: "Instagram generally favors 3-8 highly relevant hashtags, while TikTok and LinkedIn perform best with 3-5 focused tags." }
    ]),
    icon: "Hash",
    featured: 0,
    trending: 0
  },
  {
    name: "AI Product Description Generator",
    slug: "ai-product-description-generator",
    short_description: "Generate persuasive e-commerce product descriptions that convert visitors into buyers.",
    full_description: "Transform dry product specifications into compelling, benefit-focused sales copy tailored for Shopify, Amazon, Etsy, or WooCommerce stores.",
    category: "ai-tools",
    keywords: "product description, ecommerce copy, amazon description, shopify product generator",
    faq: JSON.stringify([
      { question: "Is the output SEO friendly?", answer: "Yes, the copy incorporates natural product keywords and bullet-point formatting for easy scanning." }
    ]),
    icon: "ShoppingBag",
    featured: 1,
    trending: 1
  },

  // WRITING TOOLS
  {
    name: "Word Counter",
    slug: "word-counter",
    short_description: "Instant word, character, sentence, paragraph, and reading time counter.",
    full_description: "Comprehensive live text metrics analyzer. Track exact word counts, character counts (with and without spaces), sentence counts, average word length, speaking time, and reading duration.",
    category: "writing-tools",
    keywords: "word counter, character counter, text statistics, word count tool, word calculator",
    faq: JSON.stringify([
      { question: "How is reading time calculated?", answer: "Reading time is based on standard adult reading speed of 225 words per minute." }
    ]),
    icon: "FileText",
    featured: 1,
    trending: 1
  },
  {
    name: "Character Counter",
    slug: "character-counter",
    short_description: "Track character limits for Twitter (X), SMS, Meta Ads, and SEO meta tags.",
    full_description: "Never exceed character boundaries again. Features live visual progress meters for Twitter (280 chars), SMS segments (160 chars), Google Meta Title (60 chars), Meta Description (160 chars), and Instagram Bio (150 chars).",
    category: "writing-tools",
    keywords: "character counter, twitter character count, sms length calculator, meta description length",
    faq: JSON.stringify([
      { question: "Does it count spaces and emojis?", answer: "Yes, it tracks total characters, characters excluding whitespace, and multi-byte emoji counts." }
    ]),
    icon: "AlignLeft",
    featured: 0,
    trending: 0
  },
  {
    name: "Reading Time Calculator",
    slug: "reading-time-calculator",
    short_description: "Calculate exact reading and speaking duration for articles, speeches, and scripts.",
    full_description: "Accurately estimate speech and reading lengths with adjustable Words-Per-Minute (WPM) rates for slow, average, fast readers, and stage presentation pace.",
    category: "writing-tools",
    keywords: "reading time calculator, speech duration calculator, script timer, words per minute",
    faq: JSON.stringify([
      { question: "What is the standard speech pace?", answer: "A normal conversational presentation pace is approximately 130-150 words per minute." }
    ]),
    icon: "Clock",
    featured: 0,
    trending: 0
  },
  {
    name: "Case Converter",
    slug: "case-converter",
    short_description: "Transform text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.",
    full_description: "One-click text case transformation. Supports UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and Alternating cAsE.",
    category: "writing-tools",
    keywords: "case converter, uppercase to lowercase, title case converter, camelcase converter, snake case",
    faq: JSON.stringify([
      { question: "Does Title Case handle small words like 'and', 'the' properly?", answer: "Yes, standard English capitalization rules for prepositions and conjunctions are applied." }
    ]),
    icon: "CaseSensitive",
    featured: 0,
    trending: 1
  },
  {
    name: "Text Summarizer",
    slug: "text-summarizer",
    short_description: "Summarize long articles, essays, and documents into key takeaways and bullet points.",
    full_description: "Extract the core message from lengthy text. Choose between concise 3-bullet summaries, executive paragraphs, or key sentence extractions instantly.",
    category: "writing-tools",
    keywords: "text summarizer, article summary, tl;dr generator, summary tool, condense text",
    faq: JSON.stringify([
      { question: "What length of text can I summarize?", answer: "You can input up to 15,000 words for instant client-side or AI-assisted summarization." }
    ]),
    icon: "FileSearch",
    featured: 1,
    trending: 0
  },
  {
    name: "Grammar Checker",
    slug: "grammar-checker",
    short_description: "Detect spelling errors, grammatical mistakes, punctuation issues, and enhance readability.",
    full_description: "Instant proofreading utility that flags common spelling errors, double words, passive voice overuse, and suggests clear, concise vocabulary replacements.",
    category: "writing-tools",
    keywords: "grammar checker, spell check, proofreader, writing assistant, fix grammar",
    faq: JSON.stringify([
      { question: "Is my text saved or logged?", answer: "No, all analysis is performed securely in your browser session." }
    ]),
    icon: "CheckSquare",
    featured: 0,
    trending: 0
  },

  // DEVELOPER TOOLS
  {
    name: "JSON Formatter",
    slug: "json-formatter",
    short_description: "Format, validate, beautify, and minify JSON with syntax highlighting and tree view.",
    full_description: "A fast, privacy-focused JSON editor. Beautify with 2-space, 4-space, or tab indentation, validate syntax errors with line numbers, minify for production, and inspect interactive trees.",
    category: "developer-tools",
    keywords: "json formatter, json beautifier, json validator, json minifier, format json online",
    faq: JSON.stringify([
      { question: "Is my JSON data uploaded to a server?", answer: "No, formatting and validation happen 100% locally in your browser." }
    ]),
    icon: "Braces",
    featured: 1,
    trending: 1
  },
  {
    name: "Base64 Encoder",
    slug: "base64-encoder",
    short_description: "Encode plain text, URLs, and binary files into Base64 format instantly.",
    full_description: "Convert strings or files to RFC 4648 Base64 strings. Supports standard encoding, URL-safe Base64, and formatted Data URI output ready for HTML/CSS embedding.",
    category: "developer-tools",
    keywords: "base64 encoder, encode base64, string to base64, data uri encoder",
    faq: JSON.stringify([
      { question: "What is URL-safe Base64?", answer: "URL-safe Base64 replaces '+' with '-' and '/' with '_' to allow transmission in query strings without percent-encoding." }
    ]),
    icon: "Binary",
    featured: 0,
    trending: 0
  },
  {
    name: "Base64 Decoder",
    slug: "base64-decoder",
    short_description: "Decode Base64 strings back to plain text, images, or inspect raw bytes.",
    full_description: "Instantly decode Base64 encoded data with automatic detection of text, JSON, SVG, and binary images with live preview.",
    category: "developer-tools",
    keywords: "base64 decoder, decode base64, base64 to text, base64 image preview",
    faq: JSON.stringify([
      { question: "Can I preview decoded images?", answer: "Yes, if the Base64 data represents an image (PNG, JPEG, SVG, WebP), a live visual preview is rendered." }
    ]),
    icon: "FileCode",
    featured: 0,
    trending: 0
  },
  {
    name: "URL Encoder",
    slug: "url-encoder",
    short_description: "Encode query parameters and URLs into standard percent-encoded format.",
    full_description: "Safely encode special characters, whitespace, and Unicode text into URI percent-encoding (RFC 3986) to prevent broken links and API errors.",
    category: "developer-tools",
    keywords: "url encoder, uri encode, percent encode, encode url component",
    faq: JSON.stringify([
      { question: "What is the difference between encodeURI and encodeURIComponent?", answer: "encodeURI keeps protocol and host characters intact, while encodeURIComponent encodes everything including slashes, ampersands, and question marks." }
    ]),
    icon: "Link",
    featured: 0,
    trending: 0
  },
  {
    name: "URL Decoder",
    slug: "url-decoder",
    short_description: "Decode percent-encoded URLs and inspect query string parameters in a clean table.",
    full_description: "Decode percent-encoded strings back to human-readable text and automatically parse URL protocols, paths, and query string key-value pairs into an editable table.",
    category: "developer-tools",
    keywords: "url decoder, uri decode, query param parser, decode percent encoding",
    faq: JSON.stringify([
      { question: "Does it break down query parameters?", answer: "Yes, the tool displays a structured table of every query key and its decoded value." }
    ]),
    icon: "Unlink",
    featured: 0,
    trending: 0
  },
  {
    name: "Password Generator",
    slug: "password-generator",
    short_description: "Generate cryptographically secure, high-entropy passwords with custom rule sets.",
    full_description: "Create unbreakable passwords using the Web Crypto API. Customize length (4-64 chars), uppercase, lowercase, digits, symbols, eliminate ambiguous characters (like 1, l, I, 0, O), and check password entropy strength.",
    category: "developer-tools",
    keywords: "password generator, secure password generator, random password, strong password, password strength",
    faq: JSON.stringify([
      { question: "Is this cryptographically random?", answer: "Yes, it utilizes window.crypto.getRandomValues for true cryptographic entropy." }
    ]),
    icon: "KeyRound",
    featured: 1,
    trending: 1
  },

  // IMAGE TOOLS
  {
    name: "QR Code Generator",
    slug: "qr-code-generator",
    short_description: "Generate custom QR codes for URLs, WiFi networks, text, emails, and vCards with PNG/SVG export.",
    full_description: "Create high-resolution QR codes with customizable foreground/background colors, error correction levels (L, M, Q, H), margin padding, and download options in PNG and SVG vectors.",
    category: "image-tools",
    keywords: "qr code generator, custom qr code, wifi qr code, svg qr code, qr maker",
    faq: JSON.stringify([
      { question: "Do these QR codes expire?", answer: "No, these are static QR codes that directly encode your payload and will work indefinitely." }
    ]),
    icon: "QrCode",
    featured: 1,
    trending: 1
  },
  {
    name: "Color Palette Generator",
    slug: "color-palette-generator",
    short_description: "Generate cohesive color schemes or extract dominant palettes from uploaded images.",
    full_description: "Create harmonious palettes using color theory rules (Monochromatic, Analogous, Complementary, Triadic). Lock colors, copy HEX/RGB/HSL values, and export directly to Tailwind CSS or CSS variables.",
    category: "image-tools",
    keywords: "color palette generator, color schemes, image color extractor, hex palette, tailwind colors",
    faq: JSON.stringify([
      { question: "Can I extract colors from my own photo?", answer: "Yes, simply drag and drop any image to extract its top 5 dominant colors." }
    ]),
    icon: "Palette",
    featured: 1,
    trending: 0
  },
  {
    name: "Image Compressor",
    slug: "image-compressor",
    short_description: "Compress PNG, JPEG, and WebP images without noticeable quality loss.",
    full_description: "Reduce image file sizes by up to 85% directly in your browser. Adjust compression quality sliders, compare before/after file sizes, and download optimized assets.",
    category: "image-tools",
    keywords: "image compressor, compress png, compress jpeg, reduce image size, optimize images",
    faq: JSON.stringify([
      { question: "Are my photos uploaded to a cloud server?", answer: "No, compression runs completely client-side in your browser for maximum privacy." }
    ]),
    icon: "Minimize2",
    featured: 0,
    trending: 1
  },
  {
    name: "Image Resizer",
    slug: "image-resizer",
    short_description: "Resize images by exact pixel dimensions or percentage while maintaining aspect ratio.",
    full_description: "Fast browser-based image scaling. Enter custom width/height in pixels, toggle aspect ratio lock, choose resampling quality, and export to PNG, JPEG, or WebP.",
    category: "image-tools",
    keywords: "image resizer, resize photo, change image resolution, scale image online",
    faq: JSON.stringify([
      { question: "Will resizing distort the image?", answer: "With the 'Lock Aspect Ratio' toggle active, width and height automatically stay proportional." }
    ]),
    icon: "Maximize2",
    featured: 0,
    trending: 0
  },
  {
    name: "Image Format Converter",
    slug: "image-format-converter",
    short_description: "Convert images seamlessly between PNG, JPEG, WebP, and BMP formats.",
    full_description: "Convert multiple images between modern image formats. Convert heavy PNGs to lightweight WebP, or JPEGs to lossless PNGs with quality fine-tuning.",
    category: "image-tools",
    keywords: "image format converter, png to webp, webp to png, jpg to png, convert image format",
    faq: JSON.stringify([
      { question: "Why should I convert to WebP?", answer: "WebP provides superior lossless and lossy compression, resulting in 25-35% smaller file sizes compared to JPEG." }
    ]),
    icon: "RefreshCw",
    featured: 0,
    trending: 0
  },
  {
    name: "Gradient Generator",
    slug: "gradient-generator",
    short_description: "Create stunning CSS linear, radial, and conic gradients with live preview and code export.",
    full_description: "Design smooth color blends with multi-stop color pickers, degree angle controls, gradient direction presets, and copy-ready CSS code.",
    category: "image-tools",
    keywords: "css gradient generator, linear gradient, radial gradient, background gradient, css color generator",
    faq: JSON.stringify([
      { question: "Can I add more than two colors?", answer: "Yes, you can add unlimited color stops along the gradient timeline." }
    ]),
    icon: "Layers",
    featured: 0,
    trending: 0
  },

  // PDF TOOLS
  {
    name: "PDF Merger",
    slug: "pdf-merger",
    short_description: "Combine multiple PDF documents into a single organized file in seconds.",
    full_description: "Easily merge two or more PDF files into a single consolidated document. Reorder documents via drag-and-drop, preview page counts, and download the combined PDF.",
    category: "pdf-tools",
    keywords: "pdf merger, combine pdf, merge pdf online, join pdf files, merge documents",
    faq: JSON.stringify([
      { question: "Is there a limit on how many PDFs I can combine?", answer: "You can merge as many documents as your device's memory can process." },
      { question: "Are my confidential PDFs private?", answer: "Yes, merging is performed entirely locally in your browser using pdf-lib. No files are uploaded." }
    ]),
    icon: "Files",
    featured: 1,
    trending: 1
  },
  {
    name: "PDF Splitter",
    slug: "pdf-splitter",
    short_description: "Split large PDF files by custom page ranges or extract distinct sections.",
    full_description: "Separate specific page ranges (e.g. 1-5, 8, 11-14) from multi-page PDF documents into a clean new document without quality loss.",
    category: "pdf-tools",
    keywords: "pdf splitter, split pdf, separate pdf pages, extract pdf range",
    faq: JSON.stringify([
      { question: "How do I specify page ranges?", answer: "Use standard range syntax like '1-3, 5, 7-10' to select the exact pages you want to keep." }
    ]),
    icon: "Scissors",
    featured: 0,
    trending: 0
  },
  {
    name: "PDF Page Extractor",
    slug: "pdf-page-extractor",
    short_description: "Select and extract individual pages from any PDF file into a new document.",
    full_description: "Visual page selector for PDF documents. Click on the specific pages you need to extract and generate a streamlined PDF file instantly.",
    category: "pdf-tools",
    keywords: "pdf page extractor, extract pages from pdf, save single pdf page",
    faq: JSON.stringify([
      { question: "Can I extract multiple non-consecutive pages?", answer: "Yes, simply check the boxes for each page you wish to extract." }
    ]),
    icon: "Copy",
    featured: 0,
    trending: 0
  },
  {
    name: "PDF to Image Converter",
    slug: "pdf-to-image-converter",
    short_description: "Render PDF document pages into high-resolution PNG or JPEG image files.",
    full_description: "Convert PDF documents into crisp images. Choose desired DPI scaling (1x, 2x for retina), select specific pages, and download image assets.",
    category: "pdf-tools",
    keywords: "pdf to image, pdf to png, pdf to jpg, convert pdf to picture",
    faq: JSON.stringify([
      { question: "What image formats are supported?", answer: "You can export rendered pages as PNG (lossless) or JPEG (standard)." }
    ]),
    icon: "FileImage",
    featured: 1,
    trending: 0
  },
  {
    name: "Image to PDF Converter",
    slug: "image-to-pdf-converter",
    short_description: "Convert multiple PNG, JPEG, and WebP images into a clean, formatted PDF document.",
    full_description: "Turn photos, receipts, and scans into a single multi-page PDF document. Configure page sizes (A4, Letter, Auto-Fit), page orientation, and margin spacing.",
    category: "pdf-tools",
    keywords: "image to pdf, photos to pdf, jpg to pdf, png to pdf, make pdf from images",
    faq: JSON.stringify([
      { question: "Can I reorder the images before generating the PDF?", answer: "Yes, you can reorder images to ensure they appear in your desired page sequence." }
    ]),
    icon: "ImagePlus",
    featured: 0,
    trending: 1
  },
  {
    name: "PDF Metadata Viewer",
    slug: "pdf-metadata-viewer",
    short_description: "View and edit PDF metadata including Title, Author, Subject, Creator, and Keywords.",
    full_description: "Inspect hidden document metadata (Title, Author, Subject, Producer, Creation Date, Modification Date) and easily update or sanitize metadata fields before sharing.",
    category: "pdf-tools",
    keywords: "pdf metadata viewer, edit pdf metadata, inspect pdf properties, pdf author editor",
    faq: JSON.stringify([
      { question: "Why is sanitizing PDF metadata important?", answer: "PDF files often contain hidden author names, file paths, and editing history that you may not want to share publicly." }
    ]),
    icon: "Info",
    featured: 0,
    trending: 0
  }
];

export const seedBlogs = [
  {
    title: "The Ultimate Guide to Effective AI Prompt Engineering in 2026",
    slug: "ultimate-guide-ai-prompt-engineering",
    excerpt: "Master the fundamental frameworks of role-based prompting, few-shot examples, and chain-of-thought instructions for LLMs.",
    content: `# The Ultimate Guide to Effective AI Prompt Engineering

Prompt engineering has evolved from a niche curiosity into an essential skill for modern knowledge workers, engineers, and creatives.

## 1. The Core Anatomy of a High-Yield Prompt

When working with modern LLMs like Gemini 3, ChatGPT, or Claude, generic instructions produce generic answers. A high-yield prompt contains five distinct components:

1. **Role Definition**: Who the AI is acting as (e.g., "Senior Full-Stack Architect").
2. **Contextual Scope**: The background information, system constraints, and input data.
3. **Primary Task**: The explicit action to take, expressed with unambiguous verbs.
4. **Negative Constraints**: What the model must strictly avoid doing.
5. **Output Schema**: The exact formatting desired (e.g., JSON, markdown table, bulleted executive summary).

> *"Clarity of constraint is the mother of accurate intelligence."*

## 2. Few-Shot Prompting vs Zero-Shot

Zero-shot prompting asks the model to perform a task with zero prior examples. While adequate for standard queries, complex taxonomy classification or specific brand voice tone benefits dramatically from 2-3 input/output examples ("few-shot").

\`\`\`json
{
  "task": "Headline classification",
  "examples": [
    { "input": "10 Ways to Save Time", "category": "Listicle" },
    { "input": "Why We Failed Our First Launch", "category": "Retrospective" }
  ]
}
\`\`\`

## 3. Summary Checklist

- Provide structured role context.
- Keep negative constraints explicit.
- Use ToolVerse AI Prompt Generator to automate prompt structures.`,
    author: "Elena Rostova",
    category: "AI Tools",
    tags: "Prompt Engineering, Artificial Intelligence, Productivity, Gemini",
    featured_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    seo_title: "The Ultimate Guide to AI Prompt Engineering (2026)",
    seo_description: "Learn how to craft high-converting, accurate AI prompts with proven frameworks, few-shot examples, and real-world prompt templates.",
    published: 1
  },
  {
    title: "10 Essential Developer Utilities Every Modern Engineer Needs",
    slug: "10-essential-developer-utilities",
    excerpt: "From JSON validation to Base64 conversions and cryptographic password generation, explore the essential client-side toolkit.",
    content: `# 10 Essential Developer Utilities Every Modern Engineer Needs

Modern software development moves at lightning speed. Having reliable, instant, client-side developer utilities at your fingertips prevents context switching and protects sensitive data.

## Why Client-Side Utilities Matter

When working with customer data, API tokens, or proprietary JSON payloads, pasting strings into unknown web servers poses severe security risks. Client-side tools execute directly in your browser without transmitting payloads over the wire.

### Top Essential Tools:

1. **JSON Formatter & Validator**: Catches trailing commas, missing quotes, and formats nested structures in seconds.
2. **Base64 Encoder & Decoder**: Essential for debugging JWT payloads, basic auth headers, and data URIs.
3. **URL Encoder/Decoder**: Troubleshoots broken query strings, special character escaping, and OAuth callback URLs.
4. **High-Entropy Password Generator**: Generates cryptographically secure secrets utilizing Web Crypto.

| Tool | Primary Use Case | Security Benefit |
| --- | --- | --- |
| JSON Formatter | API Debugging | Zero server transmission |
| Base64 Tool | Header analysis | Instant offline decoding |
| QR Code Maker | Mobile testing | Pure client-side SVG |

## Conclusion

Bookmark ToolVerse developer utilities to streamline your daily engineering workflows!`,
    author: "Marcus Chen",
    category: "Developer Tools",
    tags: "Web Development, Developer Tools, JSON, Security, Base64",
    featured_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    seo_title: "10 Essential Developer Utilities for Fast Engineering",
    seo_description: "Discover top browser-based developer utilities that accelerate API debugging, encoding, formatting, and secure key generation.",
    published: 1
  },
  {
    title: "How to Optimize Web Images for Maximum Core Web Vitals Performance",
    slug: "optimize-web-images-core-web-vitals",
    excerpt: "Learn how WebP format conversion, proportional resizing, and smart compression supercharge page speed and SEO rankings.",
    content: `# How to Optimize Web Images for Maximum Core Web Vitals Performance

Images represent over 60% of total payload bytes on the average web page. Optimizing image delivery is the single highest-impact action you can take to achieve perfect Lighthouse scores.

## 1. Choose Modern Formats: WebP & AVIF

Legacy formats like JPEG and PNG are notoriously inefficient for responsive web layouts. Converting standard images to WebP reduces file size by 25-35% at identical visual quality.

## 2. Proper Dimensions: Never Serve Oversized Assets

A common performance bottleneck is loading a 4000x3000px image into a 400x300px container on mobile. Resize images to their exact target layout dimensions before uploading.

## 3. Lossless vs Lossy Compression

- **Lossy**: Discards imperceptible pixel data to achieve 70-85% compression ratios (ideal for blog hero banners and product photos).
- **Lossless**: Preserves 100% of image pixel accuracy (ideal for technical diagrams, logos, and UI screenshots).

Use the ToolVerse Image Compressor and Format Converter to optimize your assets today!`,
    author: "Sophia Patel",
    category: "Image Tools",
    tags: "Web Performance, Core Web Vitals, Image Optimization, WebP, SEO",
    featured_image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    seo_title: "How to Optimize Web Images for Core Web Vitals",
    seo_description: "Master modern image optimization techniques: WebP conversion, responsive resizing, and lossless compression for faster page load times.",
    published: 1
  }
];

export const seedFaqs = [
  {
    question: "Are ToolVerse tools completely free to use?",
    answer: "Yes, 100% of the tools across all categories on ToolVerse are completely free with unlimited usage, no credit card required, and no forced account registration.",
    category: "General"
  },
  {
    question: "Is my data and uploaded files secure?",
    answer: "Absolutely. Sensitive client utilities (such as PDF mergers, image compressors, JSON formatters, and Base64 encoders) execute entirely in your local browser sandbox using client-side JavaScript and WebAssembly. Your files and text are never sent to or stored on third-party servers.",
    category: "Security"
  },
  {
    question: "How do the AI tools work?",
    answer: "ToolVerse AI tools connect to Google's advanced Gemini models on the backend to provide intelligent prompt drafting, email crafting, caption ideas, and product descriptions in real time.",
    category: "AI"
  },
  {
    question: "Can I use ToolVerse tools on mobile devices?",
    answer: "Yes, ToolVerse is designed with responsive, touch-friendly interfaces that work seamlessly across desktop, tablets, and mobile smartphones.",
    category: "General"
  },
  {
    question: "How frequently are new tools added?",
    answer: "Our dynamic database allows our team to publish new utilities, features, and blog guides weekly. You can also request specific tools via our Contact page.",
    category: "General"
  }
];
