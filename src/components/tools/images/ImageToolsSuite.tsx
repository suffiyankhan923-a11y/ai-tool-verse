import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Sparkles, RefreshCw, FileText, Check, Copy } from 'lucide-react';

export const ImageToolsSuite: React.FC<{ toolType: 'compress' | 'resize' | 'convert' | 'base64' }> = ({
  toolType,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [origSize, setOrigSize] = useState<number>(0);
  const [origDimensions, setOrigDimensions] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  // Compressor state
  const [quality, setQuality] = useState(80);
  const [compressedSrc, setCompressedSrc] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  // Resizer state
  const [newWidth, setNewWidth] = useState(800);
  const [newHeight, setNewHeight] = useState(600);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [resizedSrc, setResizedSrc] = useState<string | null>(null);

  // Convert state
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');
  const [convertedSrc, setConvertedSrc] = useState<string | null>(null);

  // Base64 state
  const [base64Output, setBase64Output] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setOrigSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      setBase64Output(src);

      // Load dimensions
      const img = new Image();
      img.onload = () => {
        setOrigDimensions({ w: img.naturalWidth, h: img.naturalHeight });
        setNewWidth(img.naturalWidth);
        setNewHeight(img.naturalHeight);
        // Automatically process initial image
        processImage(img, src, file.type);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const processImage = (img: HTMLImageElement, src: string, mimeType: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);

    // Compress
    const compData = canvas.toDataURL('image/jpeg', quality / 100);
    setCompressedSrc(compData);
    setCompressedSize(Math.round((compData.length * 3) / 4));

    // Convert
    const convData = canvas.toDataURL(targetFormat, 0.92);
    setConvertedSrc(convData);
  };

  const handleApplyResize = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      setResizedSrc(canvas.toDataURL('image/png'));
    };
    img.src = imageSrc;
  };

  const handleWidthChange = (w: number) => {
    setNewWidth(w);
    if (lockAspectRatio && origDimensions.w > 0) {
      const ratio = origDimensions.h / origDimensions.w;
      setNewHeight(Math.round(w * ratio));
    }
  };

  const handleHeightChange = (h: number) => {
    setNewHeight(h);
    if (lockAspectRatio && origDimensions.h > 0) {
      const ratio = origDimensions.w / origDimensions.h;
      setNewWidth(Math.round(h * ratio));
    }
  };

  const downloadFile = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-10 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50/50 dark:bg-slate-900/40 text-center hover:border-amber-500 cursor-pointer transition-all flex flex-col items-center justify-center space-y-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Select or Drop an Image Here
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports PNG, JPG, JPEG, WebP, SVG (All processed 100% in your browser)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Info Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src={imageSrc} alt="Thumbnail" className="w-10 h-10 object-cover rounded-lg" />
              <div className="text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 block truncate max-w-xs">
                  {imageFile?.name || 'Image'}
                </span>
                <span className="text-slate-400">
                  {origDimensions.w} × {origDimensions.h} px • {formatBytes(origSize)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setImageSrc(null);
                setImageFile(null);
              }}
              className="text-xs font-semibold text-rose-500 hover:underline"
            >
              Choose Different Image
            </button>
          </div>

          {/* Compressor Mode */}
          {toolType === 'compress' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Target Compression Quality</span>
                    <span className="text-amber-500 font-bold">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="95"
                    value={quality}
                    onChange={(e) => {
                      const q = Number(e.target.value);
                      setQuality(q);
                      const img = new Image();
                      img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        const ctx = canvas.getContext('2d');
                        ctx?.drawImage(img, 0, 0);
                        const compData = canvas.toDataURL('image/jpeg', q / 100);
                        setCompressedSrc(compData);
                        setCompressedSize(Math.round((compData.length * 3) / 4));
                      };
                      img.src = imageSrc;
                    }}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span>Original Size:</span>
                    <strong>{formatBytes(origSize)}</strong>
                  </div>
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Compressed Size:</span>
                    <span>{formatBytes(compressedSize)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-1">
                    <span>Saved Bandwidth:</span>
                    <span>{origSize > 0 ? `${Math.max(0, Math.round(((origSize - compressedSize) / origSize) * 100))}%` : '0%'}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => compressedSrc && downloadFile(compressedSrc, `compressed-${imageFile?.name || 'image.jpg'}`)}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Compressed JPG</span>
                </button>
              </div>

              <div className="lg:col-span-7 p-4 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-center overflow-hidden">
                <img
                  src={compressedSrc || imageSrc}
                  alt="Compressed Preview"
                  className="max-h-80 w-auto rounded-xl object-contain shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Resizer Mode */}
          {toolType === 'resize' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1">Width (px)</label>
                    <input
                      type="number"
                      value={newWidth}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">Height (px)</label>
                    <input
                      type="number"
                      value={newHeight}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lockAspectRatio}
                    onChange={(e) => setLockAspectRatio(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>Lock Aspect Ratio</span>
                </label>

                {/* Quick Presets */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                    Quick Scales:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[0.25, 0.5, 0.75, 2.0].map((scale) => (
                      <button
                        key={scale}
                        type="button"
                        onClick={() => {
                          handleWidthChange(Math.round(origDimensions.w * scale));
                        }}
                        className="py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 font-semibold"
                      >
                        {scale * 100}%
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyResize}
                  className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Apply Resize & Preview
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleApplyResize();
                    if (resizedSrc) downloadFile(resizedSrc, `resized-${newWidth}x${newHeight}.png`);
                  }}
                  className="w-full py-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resized Image</span>
                </button>
              </div>

              <div className="lg:col-span-7 p-4 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-center">
                <img
                  src={resizedSrc || imageSrc}
                  alt="Resized Preview"
                  className="max-h-80 w-auto rounded-xl object-contain"
                />
              </div>
            </div>
          )}

          {/* Converter Mode */}
          {toolType === 'convert' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div>
                  <label className="text-xs font-semibold block mb-2">Target Output Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'WebP (Modern)', val: 'image/webp' },
                      { label: 'PNG (Lossless)', val: 'image/png' },
                      { label: 'JPG (Universal)', val: 'image/jpeg' },
                    ].map((f) => (
                      <button
                        key={f.val}
                        type="button"
                        onClick={() => {
                          const fmt = f.val as any;
                          setTargetFormat(fmt);
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = img.naturalWidth;
                            canvas.height = img.naturalHeight;
                            const ctx = canvas.getContext('2d');
                            ctx?.drawImage(img, 0, 0);
                            setConvertedSrc(canvas.toDataURL(fmt, 0.92));
                          };
                          img.src = imageSrc;
                        }}
                        className={`py-2 rounded-xl text-xs font-bold ${
                          targetFormat === f.val ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-100 dark:bg-slate-800'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (convertedSrc) {
                      const ext = targetFormat.split('/')[1];
                      downloadFile(convertedSrc, `converted-image.${ext}`);
                    }
                  }}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Converted File</span>
                </button>
              </div>

              <div className="lg:col-span-7 p-4 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-center">
                <img src={convertedSrc || imageSrc} alt="Converted Preview" className="max-h-80 w-auto rounded-xl object-contain" />
              </div>
            </div>
          )}

          {/* Base64 Mode */}
          {toolType === 'base64' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Data URI Base64 String
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(base64Output);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Data URI!' : 'Copy Base64'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={10}
                value={base64Output}
                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
