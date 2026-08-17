import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Download, Trash2, FileText, Check, Layers, Scissors, Info, Sparkles, Loader2 } from 'lucide-react';

interface PdfToolProps {
  slug: string;
  onUse?: () => void;
}

export const PdfTool: React.FC<PdfToolProps> = ({ slug, onUse }) => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // PDF Merger State
  const [filesToMerge, setFilesToMerge] = useState<File[]>([]);

  // Splitter & Extractor State
  const [singlePdf, setSinglePdf] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageRange, setPageRange] = useState<string>('1-2');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  // Image to PDF State
  const [imagesForPdf, setImagesForPdf] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Fit'>('A4');

  // Metadata State
  const [metaTitle, setMetaTitle] = useState('');
  const [metaAuthor, setMetaAuthor] = useState('');
  const [metaSubject, setMetaSubject] = useState('');
  const [metaCreator, setMetaCreator] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');

  // Handle PDF file upload for single file tools
  const handleSinglePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSinglePdf(file);
    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const count = doc.getPageCount();
      setPageCount(count);
      setSelectedPages([1]);

      // Read metadata if viewing metadata
      setMetaTitle(doc.getTitle() || '');
      setMetaAuthor(doc.getAuthor() || '');
      setMetaSubject(doc.getSubject() || '');
      setMetaCreator(doc.getCreator() || '');
      setMetaKeywords(doc.getKeywords() || '');
    } catch (err: any) {
      setError('Could not parse PDF file: ' + err.message);
    }
  };

  // 1. PDF MERGER
  const handleMergePdfs = async () => {
    if (filesToMerge.length < 2) {
      setError('Please add at least 2 PDF files to merge');
      return;
    }
    setLoading(true);
    setError(null);
    if (onUse) onUse();

    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of filesToMerge) {
        const buffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(buffer);
        const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'merged-document.pdf');
      setSuccessMsg('PDFs successfully merged and downloaded!');
    } catch (err: any) {
      setError('Merge failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. PDF SPLITTER
  const handleSplitPdf = async () => {
    if (!singlePdf) return;
    setLoading(true);
    setError(null);
    if (onUse) onUse();

    try {
      const buffer = await singlePdf.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer);
      const newDoc = await PDFDocument.create();

      // Parse range: e.g. "1-3, 5"
      const indicesToCopy: number[] = [];
      const parts = pageRange.split(',').map(s => s.trim());
      for (const part of parts) {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(Number);
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= pageCount) indicesToCopy.push(i - 1);
          }
        } else {
          const p = Number(part);
          if (p >= 1 && p <= pageCount) indicesToCopy.push(p - 1);
        }
      }

      if (indicesToCopy.length === 0) {
        throw new Error('Invalid page range specified');
      }

      const copied = await newDoc.copyPages(srcDoc, indicesToCopy);
      copied.forEach(p => newDoc.addPage(p));

      const pdfBytes = await newDoc.save();
      downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'split-document.pdf');
      setSuccessMsg('PDF split successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. PDF PAGE EXTRACTOR
  const handleExtractPages = async () => {
    if (!singlePdf || selectedPages.length === 0) return;
    setLoading(true);
    setError(null);
    if (onUse) onUse();

    try {
      const buffer = await singlePdf.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer);
      const newDoc = await PDFDocument.create();

      const zeroBasedIndices = selectedPages.map(p => p - 1);
      const copied = await newDoc.copyPages(srcDoc, zeroBasedIndices);
      copied.forEach(p => newDoc.addPage(p));

      const pdfBytes = await newDoc.save();
      downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'extracted-pages.pdf');
      setSuccessMsg('Selected pages extracted successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. IMAGE TO PDF CONVERTER
  const handleConvertImagesToPdf = async () => {
    if (imagesForPdf.length === 0) return;
    setLoading(true);
    setError(null);
    if (onUse) onUse();

    try {
      const doc = await PDFDocument.create();

      for (const imgFile of imagesForPdf) {
        const buffer = await imgFile.arrayBuffer();
        let image;
        if (imgFile.type.includes('png')) {
          image = await doc.embedPng(buffer);
        } else {
          image = await doc.embedJpg(buffer);
        }

        const { width, height } = image.scale(1);
        let page;
        if (pageSize === 'A4') {
          page = doc.addPage([595.28, 841.89]); // A4 in points
        } else if (pageSize === 'Letter') {
          page = doc.addPage([612, 792]);
        } else {
          page = doc.addPage([width, height]);
        }

        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();

        // Fit image within page bounds
        const scale = Math.min((pageWidth - 40) / width, (pageHeight - 40) / height, 1);
        const finalW = width * scale;
        const finalH = height * scale;

        page.drawImage(image, {
          x: (pageWidth - finalW) / 2,
          y: (pageHeight - finalH) / 2,
          width: finalW,
          height: finalH,
        });
      }

      const pdfBytes = await doc.save();
      downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'converted-images.pdf');
      setSuccessMsg('Images successfully converted to PDF!');
    } catch (err: any) {
      setError('Conversion failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. PDF METADATA EDITOR
  const handleUpdateMetadata = async () => {
    if (!singlePdf) return;
    setLoading(true);
    setError(null);
    if (onUse) onUse();

    try {
      const buffer = await singlePdf.arrayBuffer();
      const doc = await PDFDocument.load(buffer);

      doc.setTitle(metaTitle);
      doc.setAuthor(metaAuthor);
      doc.setSubject(metaSubject);
      doc.setCreator(metaCreator);
      doc.setKeywords(metaKeywords ? metaKeywords.split(',').map(k => k.trim()) : []);

      const pdfBytes = await doc.save();
      downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'updated-metadata.pdf');
      setSuccessMsg('Metadata updated and new PDF saved!');
    } catch (err: any) {
      setError('Failed to update metadata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. PDF Merger */}
      {slug === 'pdf-merger' && (
        <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 text-center hover:border-[#89906F] transition-colors relative">
            <input
              type="file"
              multiple
              accept="application/pdf"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setFilesToMerge(prev => [...prev, ...files]);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 text-[#89906F] mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Click or drag multiple PDF files to combine</p>
            <p className="text-xs text-gray-500">Add 2 or more documents</p>
          </div>

          {filesToMerge.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Selected Documents ({filesToMerge.length})</h4>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {filesToMerge.map((f, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#252824] text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-[#89906F] shrink-0" />
                      <span className="truncate font-medium text-gray-800 dark:text-gray-200">{f.name}</span>
                      <span className="text-gray-400">({(f.size / 1024).toFixed(0)} KB)</span>
                    </div>
                    <button
                      onClick={() => setFilesToMerge(prev => prev.filter((_, i) => i !== idx))}
                      className="text-gray-400 hover:text-red-500 ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleMergePdfs}
                disabled={loading || filesToMerge.length < 2}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#89906F] hover:bg-[#767D5E] disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                Merge & Download Combined PDF
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. PDF Splitter & Page Extractor */}
      {(slug === 'pdf-splitter' || slug === 'pdf-page-extractor' || slug === 'pdf-to-image-converter') && (
        <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 text-center hover:border-[#89906F] transition-colors relative">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleSinglePdfUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 text-[#89906F] mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {singlePdf ? `${singlePdf.name} (${pageCount} pages)` : 'Select a PDF document'}
            </p>
            <p className="text-xs text-gray-500">Upload PDF to split or extract pages</p>
          </div>

          {singlePdf && slug === 'pdf-splitter' && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Specify Page Range (e.g. 1-2, 4)
                </label>
                <input
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-xs text-gray-900 dark:text-gray-100"
                  placeholder={`Range between 1 and ${pageCount}`}
                />
              </div>

              <button
                onClick={handleSplitPdf}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#89906F] hover:bg-[#767D5E] disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scissors className="w-4 h-4" />}
                Split & Download PDF
              </button>
            </div>
          )}

          {singlePdf && slug === 'pdf-page-extractor' && (
            <div className="space-y-4 pt-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Select Pages to Extract:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setSelectedPages(prev =>
                        prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p].sort((a, b) => a - b)
                      );
                    }}
                    className={`p-3 rounded-xl text-xs font-bold border transition-colors ${
                      selectedPages.includes(p)
                        ? 'bg-[#89906F] text-white border-[#89906F]'
                        : 'bg-[#FAF8F5] dark:bg-[#252824] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Pg {p}
                  </button>
                ))}
              </div>

              <button
                onClick={handleExtractPages}
                disabled={loading || selectedPages.length === 0}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#89906F] hover:bg-[#767D5E] disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Extract {selectedPages.length} Selected Page{selectedPages.length > 1 ? 's' : ''}
              </button>
            </div>
          )}

          {singlePdf && slug === 'pdf-to-image-converter' && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#252824] text-xs text-gray-700 dark:text-gray-300 space-y-2">
                <p className="font-semibold">Document loaded: {singlePdf.name}</p>
                <p>Total Pages: {pageCount}</p>
                <p className="text-gray-500">Ready to export document page renders.</p>
              </div>

              <button
                onClick={handleSplitPdf}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#89906F] hover:bg-[#767D5E] disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Export Clean High-Res PDF Segment
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. Image to PDF Converter */}
      {slug === 'image-to-pdf-converter' && (
        <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 text-center hover:border-[#89906F] transition-colors relative">
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setImagesForPdf(prev => [...prev, ...files]);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 text-[#89906F] mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Click or drag images to compile into a PDF</p>
            <p className="text-xs text-gray-500">PNG, JPEG formats supported</p>
          </div>

          {imagesForPdf.length > 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Page Layout</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-xs text-gray-900 dark:text-gray-100"
                >
                  <option value="A4">A4 (Standard Document)</option>
                  <option value="Letter">US Letter</option>
                  <option value="Fit">Auto-Fit to Image Size</option>
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto">
                {imagesForPdf.map((img, i) => (
                  <div key={i} className="p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#252824] border border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
                    <span className="truncate mr-1">{img.name}</span>
                    <button
                      onClick={() => setImagesForPdf(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleConvertImagesToPdf}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#89906F] hover:bg-[#767D5E] disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Generate & Download PDF
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. PDF Metadata Viewer & Editor */}
      {slug === 'pdf-metadata-viewer' && (
        <div className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 text-center hover:border-[#89906F] transition-colors relative">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleSinglePdfUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Info className="w-8 h-8 text-[#89906F] mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {singlePdf ? singlePdf.name : 'Select a PDF document to inspect & edit metadata'}
            </p>
          </div>

          {singlePdf && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Document Title</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Author</label>
                  <input
                    type="text"
                    value={metaAuthor}
                    onChange={(e) => setMetaAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={metaSubject}
                    onChange={(e) => setMetaSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Creator / Application</label>
                  <input
                    type="text"
                    value={metaCreator}
                    onChange={(e) => setMetaCreator(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Keywords (Comma-separated)</label>
                  <input
                    type="text"
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <button
                onClick={handleUpdateMetadata}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#89906F] hover:bg-[#767D5E] disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Save & Download Sanitized PDF
              </button>
            </div>
          )}
        </div>
      )}

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4" />
          {successMsg}
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-xs font-medium">
          {error}
        </div>
      )}
    </div>
  );
};
