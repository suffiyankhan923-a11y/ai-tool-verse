import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, RefreshCw, Upload, Sparkles, Image as ImageIcon } from 'lucide-react';

interface ImageToolProps {
  slug: string;
  onUse?: () => void;
}

export const ImageTool: React.FC<ImageToolProps> = ({ slug, onUse }) => {
  const [copied, setCopied] = useState(false);

  // QR Code state
  const [qrText, setQrText] = useState('https://ai.studio/build');
  const [qrFgColor, setQrFgColor] = useState('#1F2937');
  const [qrBgColor, setQrBgColor] = useState('#FFFFFF');
  const [qrErrorLevel, setQrErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Color Palette state
  const [palette, setPalette] = useState<string[]>(['#89906F', '#EFE6DA', '#D4A373', '#1F2937', '#FAF8F5']);
  const [harmonyType, setHarmonyType] = useState('complementary');

  // Image Processing state (Compressor, Resizer, Converter)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedSize, setProcessedSize] = useState<number>(0);
  
  // Resizer state
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [targetFormat, setTargetFormat] = useState<string>('image/jpeg');
  const [quality, setQuality] = useState<number>(0.85);

  // Gradient state
  const [gradientType, setGradientType] = useState<'linear' | 'radial' | 'conic'>('linear');
  const [gradientAngle, setGradientAngle] = useState<number>(135);
  const [gradColor1, setGradColor1] = useState('#89906F');
  const [gradColor2, setGradColor2] = useState('#D4A373');
  const [gradColor3, setGradColor3] = useState('#EFE6DA');

  // QR Code Generation
  useEffect(() => {
    if (slug === 'qr-code-generator') {
      QRCode.toDataURL(qrText || 'ToolVerse', {
        width: 360,
        margin: 2,
        color: {
          dark: qrFgColor,
          light: qrBgColor
        },
        errorCorrectionLevel: qrErrorLevel
      }).then(url => {
        setQrDataUrl(url);
      }).catch(err => console.error(err));
    }
  }, [qrText, qrFgColor, qrBgColor, qrErrorLevel, slug]);

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Color Palette Generator
  const generateRandomPalette = () => {
    const randomHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setPalette([randomHex(), randomHex(), randomHex(), randomHex(), randomHex()]);
    if (onUse) onUse();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalFile(file);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setUploadedImage(src);

      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        processImage(src, img.width, img.height, targetFormat, quality);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    if (onUse) onUse();
  };

  const processImage = (
    imageSrc: string,
    w: number,
    h: number,
    format: string,
    q: number
  ) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL(format, q);
      setProcessedUrl(dataUrl);

      // Estimate byte size from data URL
      const head = `data:${format};base64,`;
      const base64Len = dataUrl.length - head.length;
      const sizeBytes = Math.round((base64Len * 3) / 4);
      setProcessedSize(sizeBytes);
    };
    img.src = imageSrc;
  };

  const handleResizeChange = (newW: number, newH: number) => {
    let finalW = newW;
    let finalH = newH;
    if (lockAspect && originalDimensions.width > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      if (newW !== targetWidth) {
        finalH = Math.round(newW / ratio);
      } else if (newH !== targetHeight) {
        finalW = Math.round(newH * ratio);
      }
    }
    setTargetWidth(finalW);
    setTargetHeight(finalH);
    if (uploadedImage) {
      processImage(uploadedImage, finalW, finalH, targetFormat, quality);
    }
  };

  // Gradient CSS string
  const gradientCss = gradientType === 'linear'
    ? `linear-gradient(${gradientAngle}deg, ${gradColor1}, ${gradColor2}, ${gradColor3})`
    : gradientType === 'radial'
    ? `radial-gradient(circle, ${gradColor1}, ${gradColor2}, ${gradColor3})`
    : `conic-gradient(from ${gradientAngle}deg, ${gradColor1}, ${gradColor2}, ${gradColor3})`;

  return (
    <div className="space-y-6">
      {/* 1. QR Code Generator */}
      {slug === 'qr-code-generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Payload Content (URL / Text / WiFi)</label>
              <textarea
                rows={3}
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                placeholder="Enter URL or text to encode..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-sm text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Foreground Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={qrFgColor}
                    onChange={(e) => setQrFgColor(e.target.value)}
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={qrFgColor}
                    onChange={(e) => setQrFgColor(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono rounded border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono rounded border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Error Correction Level</label>
              <div className="grid grid-cols-4 gap-2">
                {(['L', 'M', 'Q', 'H'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setQrErrorLevel(lvl)}
                    className={`py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      qrErrorLevel === lvl
                        ? 'bg-[#89906F] text-white border-[#89906F]'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Level {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center text-center">
            {qrDataUrl ? (
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-xl shadow-sm inline-block border border-gray-100">
                  <img src={qrDataUrl} alt="Generated QR Code" className="w-52 h-52 object-contain" />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <a
                    href={qrDataUrl}
                    download="toolverse-qrcode.png"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#89906F] hover:bg-[#767D5E] text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download PNG
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-xs">Generating QR code...</div>
            )}
          </div>
        </div>
      )}

      {/* 2. Color Palette Generator */}
      {slug === 'color-palette-generator' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#1E211D] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <button
              onClick={generateRandomPalette}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#89906F] hover:bg-[#767D5E] text-white text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Generate Random Palette
            </button>
            <button
              onClick={() => handleCopy(JSON.stringify(palette, null, 2))}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied JSON' : 'Export JSON'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {palette.map((hex, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs flex flex-col"
              >
                <div
                  className="h-32 sm:h-44 w-full transition-all duration-300"
                  style={{ backgroundColor: hex }}
                />
                <div className="p-3 text-center space-y-1">
                  <span className="font-mono text-xs font-bold text-gray-800 dark:text-gray-200 block">{hex.toUpperCase()}</span>
                  <button
                    onClick={() => handleCopy(hex)}
                    className="text-[11px] text-[#89906F] hover:underline cursor-pointer"
                  >
                    Copy HEX
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Image Compressor / Resizer / Converter */}
      {(slug === 'image-compressor' || slug === 'image-resizer' || slug === 'image-format-converter') && (
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="bg-white dark:bg-[#1E211D] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center hover:border-[#89906F] transition-colors cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] dark:bg-[#252824] flex items-center justify-center text-[#89906F]">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {originalFile ? originalFile.name : 'Click or Drag & Drop image file here'}
              </p>
              <p className="text-xs text-gray-500">Supports PNG, JPEG, WebP, SVG, BMP</p>
            </div>
          </div>

          {uploadedImage && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls */}
              <div className="lg:col-span-5 bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Adjust Optimization Settings</h4>

                {slug === 'image-resizer' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Width (px)</label>
                        <input
                          type="number"
                          value={targetWidth}
                          onChange={(e) => handleResizeChange(Number(e.target.value), targetHeight)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Height (px)</label>
                        <input
                          type="number"
                          value={targetHeight}
                          onChange={(e) => handleResizeChange(targetWidth, Number(e.target.value))}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824]"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lockAspect}
                        onChange={(e) => setLockAspect(e.target.checked)}
                        className="rounded text-[#89906F]"
                      />
                      Maintain Proportional Aspect Ratio
                    </label>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Output Format</label>
                  <select
                    value={targetFormat}
                    onChange={(e) => {
                      setTargetFormat(e.target.value);
                      processImage(uploadedImage, targetWidth, targetHeight, e.target.value, quality);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF8F5] dark:bg-[#252824] text-xs text-gray-900 dark:text-gray-100"
                  >
                    <option value="image/jpeg">JPEG (.jpg)</option>
                    <option value="image/png">PNG (.png)</option>
                    <option value="image/webp">WebP (.webp - Ultra Compressed)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    <span>Compression Quality: {Math.round(quality * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={(e) => {
                      const q = Number(e.target.value);
                      setQuality(q);
                      processImage(uploadedImage, targetWidth, targetHeight, targetFormat, q);
                    }}
                    className="w-full accent-[#89906F]"
                  />
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Original Size:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{(originalSize / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Optimized Size:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{(processedSize / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Savings:</span>
                    <span className="text-[#89906F]">
                      {originalSize > 0 ? Math.max(0, Math.round(((originalSize - processedSize) / originalSize) * 100)) : 0}%
                    </span>
                  </div>
                </div>

                {processedUrl && (
                  <a
                    href={processedUrl}
                    download={`optimized-image.${targetFormat.split('/')[1]}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#89906F] hover:bg-[#767D5E] text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Optimized Image
                  </a>
                )}
              </div>

              {/* Preview */}
              <div className="lg:col-span-7 bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Live Image Preview</span>
                <img
                  src={processedUrl || uploadedImage}
                  alt="Preview"
                  className="max-h-72 object-contain rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Gradient Generator */}
      {slug === 'gradient-generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Gradient Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['linear', 'radial', 'conic'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setGradientType(t)}
                    className={`py-1.5 rounded-lg text-xs font-semibold capitalize border transition-colors ${
                      gradientType === t
                        ? 'bg-[#89906F] text-white border-[#89906F]'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {gradientType !== 'radial' && (
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  <span>Angle: {gradientAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={gradientAngle}
                  onChange={(e) => setGradientAngle(Number(e.target.value))}
                  className="w-full accent-[#89906F]"
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Color 1</label>
                <input
                  type="color"
                  value={gradColor1}
                  onChange={(e) => setGradColor1(e.target.value)}
                  className="w-full h-9 rounded border-0 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Color 2</label>
                <input
                  type="color"
                  value={gradColor2}
                  onChange={(e) => setGradColor2(e.target.value)}
                  className="w-full h-9 rounded border-0 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Color 3</label>
                <input
                  type="color"
                  value={gradColor3}
                  onChange={(e) => setGradColor3(e.target.value)}
                  className="w-full h-9 rounded border-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">CSS Code</label>
              <div className="p-3 bg-[#FAF8F5] dark:bg-[#252824] rounded-xl border border-gray-200 dark:border-gray-700 font-mono text-xs text-gray-800 dark:text-gray-200 flex items-center justify-between gap-2">
                <span className="truncate">background: {gradientCss};</span>
                <button
                  onClick={() => handleCopy(`background: ${gradientCss};`)}
                  className="p-1.5 hover:text-[#89906F] shrink-0"
                  title="Copy CSS"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-[#1E211D] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center">
            <div
              className="w-full h-64 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700 transition-all duration-300"
              style={{ background: gradientCss }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
