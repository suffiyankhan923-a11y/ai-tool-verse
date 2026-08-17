import React from 'react';
import { Tool } from '../../types/index.js';
import { AITool } from './AITools.js';
import { WritingTool } from './WritingTools.js';
import { DeveloperTool } from './DeveloperTools.js';
import { ImageTool } from './ImageTools.js';
import { PdfTool } from './PdfTools.js';
import { GenericToolRunner } from './GenericToolRunner.js';

interface ToolRendererProps {
  tool: Tool;
  onUse?: () => void;
}

export const ToolRenderer: React.FC<ToolRendererProps> = ({ tool, onUse }) => {
  const { slug } = tool;

  const aiSlugs = [
    'ai-prompt-generator',
    'ai-email-generator',
    'ai-caption-generator',
    'ai-headline-generator',
    'ai-hashtag-generator',
    'ai-product-description-generator'
  ];

  const writingSlugs = [
    'word-counter',
    'character-counter',
    'reading-time-calculator',
    'case-converter',
    'text-summarizer',
    'grammar-checker'
  ];

  const devSlugs = [
    'json-formatter',
    'base64-encoder',
    'base64-decoder',
    'url-encoder',
    'url-decoder',
    'password-generator'
  ];

  const imageSlugs = [
    'qr-code-generator',
    'color-palette-generator',
    'image-compressor',
    'image-resizer',
    'image-format-converter',
    'gradient-generator'
  ];

  const pdfSlugs = [
    'pdf-merger',
    'pdf-splitter',
    'pdf-page-extractor',
    'pdf-to-image-converter',
    'image-to-pdf-converter',
    'pdf-metadata-viewer'
  ];

  if (aiSlugs.includes(slug)) {
    return <AITool slug={slug} onUse={onUse} />;
  }

  if (writingSlugs.includes(slug)) {
    return <WritingTool slug={slug} onUse={onUse} />;
  }

  if (devSlugs.includes(slug)) {
    return <DeveloperTool slug={slug} onUse={onUse} />;
  }

  if (imageSlugs.includes(slug)) {
    return <ImageTool slug={slug} onUse={onUse} />;
  }

  if (pdfSlugs.includes(slug)) {
    return <PdfTool slug={slug} onUse={onUse} />;
  }

  return <GenericToolRunner tool={tool} onUse={onUse} />;
};
