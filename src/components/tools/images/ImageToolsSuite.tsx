import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  FileText,
  Check,
  Copy,
  Crop,
  Layers,
} from 'lucide-react';

export const ImageToolsSuite: React.FC<{
  toolType:
    | 'compress'
    | 'resize'
    | 'crop'
    | 'convert'
    | 'jpg-to-png'
    | 'png-to-jpg'
    | 'base64'
    | 'base64-to-img';
}> = ({ toolType }) => {
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

  // Cropper state
  const [cropAspect, setCropAspect] = useState<'1:1' | '16:9' | '4:3' | 'free'>('1:1');
  const [croppedSrc, setCroppedSrc] = useState<string | null>(null);

  // Convert state
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>(
    toolType === 'jpg-to-png'
      ? 'image/png'
      : toolType === 'png-to-jpg'
      ? 'image/jpeg'
      : 'image/webp'
  );
  const [convertedSrc, setConvertedSrc] = useState<string | null>(null);

  // Base64 state
  const [base64Output, setBase64Output] = useState<string>('');
  const [base64Input, setBase64Input] = useState<string>('');
  const [renderedBase64Img, setRenderedBase64Img] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

      const img = new Image();
      img.onload = () => {
        setOrigDimensions({ w: img.naturalWidth, h: img.naturalHeight });
        setNewWidth(img.naturalWidth);
        setNewHeight(img.naturalHeight);
        processImage(img, src);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const processImage = (img: HTMLImageElement, src: string) => {
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

    // Crop Preview (Center crop 1:1 default)
    applyCrop('1:1', img);
  };

  const applyCrop = (aspect: '1:1' | '16:9' | '4:3' | 'free', imgEl?: HTMLImageElement) => {
    setCropAspect(aspect);
    const sourceImg = imgEl || (imageSrc ? new Image() : null);
    if (!sourceImg) return;

    const performCrop = (img: HTMLImageElement) => {
      const canvas = document.createElement('canvas');
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      let sx = 0;
      let sy = 0;
      let sWidth = w;
      let sHeight = h;

      if (aspect === '1:1') {
        const side = Math.min(w, h);
        sx = (w - side) / 2;
        sy = (h - side) / 2;
        sWidth = side;
        sHeight = side;
        canvas.width = side;
        canvas.height = side;
      } else if (aspect === '16:9') {
        let calcH = Math.round((w * 9) / 16);
        if (calcH <= h) {
          sy = (h - calcH) / 2;
          sHeight = calcH;
          canvas.width = w;
          canvas.height = calcH;
        } else {
          let calcW = Math.round((h * 16) / 9);
          sx = (w - calcW) / 2;
          sWidth = calcW;
          canvas.width = calcW;
          canvas.height = h;
        }
      } else if (aspect === '4:3') {
        let calcH = Math.round((w * 3) / 4);
        if (calcH <= h) {
          sy = (h - calcH) / 2;
          sHeight = calcH;
          canvas.width = w;
          canvas.height = calcH;
        } else {
          let calcW = Math.round((h * 4) / 3);
          sx = (w - calcW) / 2;
          sWidth = calcW;
          canvas.width = calcW;
          canvas.height = h;
        }
      } else {
        canvas.width = w;
        canvas.height = h;
      }

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
        setCroppedSrc(canvas.toDataURL('image/png'));
      }
    };

    if (imgEl) {
      performCrop(imgEl);
    } else if (imageSrc) {
      const img = new Image();
      img.onload = () => performCrop(img);
      img.src = imageSrc;
    }
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

  const downloadFile = (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  };

  const handleRenderBase64 = () => {
    let clean = base64Input.trim();
    if (!clean.startsWith('data:image')) {
      clean = `data:image/png;base64,${clean}`;
    }
    setRenderedBase64Img(clean);
  };

  return (
    <div className="space-y-6">
      {/* BASE64 TO IMAGE MODE */}
      {toolType === 'base64-to-img' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] block">
              Paste Base64 or Data URI String
            </label>
            <textarea
              rows={10}
              value={base64Input}
              onChange={(e) => setBase64Input(e.target.value)}
              placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
              className="w-full p-3.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 font-mono text-xs text-white leading-relaxed"
            />
            <button
              type="button"
              onClick={handleRenderBase64}
              className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#050810] font-bold text-xs shadow-md"
            >
              Decode & Render Image
            </button>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 flex flex-col justify-between items-center text-center">
            {renderedBase64Img ? (
              <div className="space-y-4 w-full flex flex-col items-center">
                <img
                  src={renderedBase64Img}
                  alt="Decoded"
                  className="max-h-64 w-auto rounded-xl object-contain border border-white/10"
                />
                <button
                  type="button"
                  onClick={() => downloadFile(renderedBase64Img, 'decoded-image.png')}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-[#050810] font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image (.png)</span>
                </button>
              </div>
            ) : (
              <div className="py-16 text-[#64748B] text-xs">
                Rendered image will appear here after pasting and clicking decode.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* STANDARD FILE UPLOAD WORKFLOW */
        <div className="space-y-6">
          {!imageSrc ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-12 md:p-16 border-2 border-dashed border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-3xl bg-[#0F172A] text-center cursor-pointer transition-all duration-200"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-[#161E31] border border-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Select or Drop an Image File Here
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Supports PNG, JPG, JPEG, WEBP, GIF, SVG (up to 25MB) • 100% Client-Side Processing
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Info & Reset Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#161E31] flex items-center justify-center overflow-hidden border border-[#D4AF37]/20">
                    <img src={imageSrc} alt="Thumb" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white truncate max-w-xs">
                      {imageFile?.name || 'Image'}
                    </h4>
                    <span className="text-xs text-[#94A3B8] font-mono">
                      {origDimensions.w} x {origDimensions.h} px • {(origSize / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImageSrc(null);
                    setImageFile(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#161E31] hover:bg-[#1E293B] text-xs font-semibold text-white border border-[#D4AF37]/20"
                >
                  Choose Different Image
                </button>
              </div>

              {/* 1. COMPRESS MODE */}
              {toolType === 'compress' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-[#94A3B8] mb-1">
                        <span>Compression Quality ({quality}%)</span>
                        <span className="text-[#D4AF37] font-bold">
                          {quality >= 80 ? 'High Quality' : quality >= 50 ? 'Balanced' : 'Small Size'}
                        </span>
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
                        className="w-full accent-[#D4AF37]"
                      />
                    </div>

                    <div className="pt-4 border-t border-[#D4AF37]/15 space-y-2 text-xs">
                      <div className="flex justify-between text-[#94A3B8]">
                        <span>Original Size:</span>
                        <strong className="text-white font-mono">{(origSize / 1024).toFixed(1)} KB</strong>
                      </div>
                      <div className="flex justify-between text-[#94A3B8]">
                        <span>Compressed Size:</span>
                        <strong className="text-emerald-400 font-mono">
                          {(compressedSize / 1024).toFixed(1)} KB (
                          {Math.max(0, Math.round(((origSize - compressedSize) / origSize) * 100))}% smaller)
                        </strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (compressedSrc) downloadFile(compressedSrc, `compressed-${imageFile?.name || 'image.jpg'}`);
                      }}
                      className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#050810] font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#D4AF37]/20"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Compressed Image</span>
                    </button>
                  </div>

                  <div className="lg:col-span-7 p-4 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 flex items-center justify-center">
                    <img
                      src={compressedSrc || imageSrc}
                      alt="Compressed Preview"
                      className="max-h-80 w-auto rounded-xl object-contain border border-white/10"
                    />
                  </div>
                </div>
              )}

              {/* 2. RESIZE MODE */}
              {toolType === 'resize' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Width (px)</label>
                        <input
                          type="number"
                          value={newWidth}
                          onChange={(e) => handleWidthChange(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Height (px)</label>
                        <input
                          type="number"
                          value={newHeight}
                          onChange={(e) => setNewHeight(Number(e.target.value))}
                          disabled={lockAspectRatio}
                          className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-mono text-sm disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-xs text-[#94A3B8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lockAspectRatio}
                        onChange={(e) => setLockAspectRatio(e.target.checked)}
                        className="rounded accent-[#D4AF37]"
                      />
                      <span>Lock Aspect Ratio</span>
                    </label>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleApplyResize}
                        className="flex-1 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#050810] font-bold text-xs"
                      >
                        Apply Resizing
                      </button>
                      {resizedSrc && (
                        <button
                          type="button"
                          onClick={() => downloadFile(resizedSrc, `resized-${newWidth}x${newHeight}.png`)}
                          className="px-4 py-3 rounded-xl bg-[#161E31] text-white font-bold text-xs border border-[#D4AF37]/20 flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-7 p-4 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 flex items-center justify-center">
                    <img
                      src={resizedSrc || imageSrc}
                      alt="Resized Preview"
                      className="max-h-80 w-auto rounded-xl object-contain border border-white/10"
                    />
                  </div>
                </div>
              )}

              {/* 3. CROP MODE */}
              {toolType === 'crop' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
                    <label className="text-xs font-semibold text-[#94A3B8] block mb-1">
                      Choose Aspect Ratio Preset
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['1:1', '16:9', '4:3', 'free'] as const).map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => applyCrop(a)}
                          className={`py-2 rounded-xl text-xs font-bold ${
                            cropAspect === a
                              ? 'bg-[#D4AF37] text-[#050810]'
                              : 'bg-[#161E31] text-[#94A3B8]'
                          }`}
                        >
                          {a === '1:1'
                            ? 'Square 1:1'
                            : a === '16:9'
                            ? 'Widescreen 16:9'
                            : a === '4:3'
                            ? 'Standard 4:3'
                            : 'Original Full'}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (croppedSrc) downloadFile(croppedSrc, `cropped-${cropAspect}.png`);
                      }}
                      className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#050810] font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#D4AF37]/20"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Cropped Image</span>
                    </button>
                  </div>

                  <div className="lg:col-span-7 p-4 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 flex items-center justify-center">
                    <img
                      src={croppedSrc || imageSrc}
                      alt="Cropped Preview"
                      className="max-h-80 w-auto rounded-xl object-contain border border-white/10"
                    />
                  </div>
                </div>
              )}

              {/* 4. CONVERT MODE (JPG to PNG, PNG to JPG, WebP) */}
              {(toolType === 'convert' || toolType === 'jpg-to-png' || toolType === 'png-to-jpg') && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-[#94A3B8] block mb-1">
                        Select Target Format
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'PNG (.png)', val: 'image/png' },
                          { label: 'JPG (.jpg)', val: 'image/jpeg' },
                          { label: 'WebP (.webp)', val: 'image/webp' },
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
                              targetFormat === f.val
                                ? 'bg-[#D4AF37] text-[#050810]'
                                : 'bg-[#161E31] text-[#94A3B8]'
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
                          const ext = targetFormat === 'image/jpeg' ? 'jpg' : targetFormat.split('/')[1];
                          downloadFile(convertedSrc, `converted-image.${ext}`);
                        }
                      }}
                      className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#050810] font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#D4AF37]/20"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Converted File</span>
                    </button>
                  </div>

                  <div className="lg:col-span-7 p-4 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 flex items-center justify-center">
                    <img
                      src={convertedSrc || imageSrc}
                      alt="Converted Preview"
                      className="max-h-80 w-auto rounded-xl object-contain border border-white/10"
                    />
                  </div>
                </div>
              )}

              {/* 5. BASE64 ENCODER */}
              {toolType === 'base64' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Data URI Base64 Output
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(base64Output);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-[#D4AF37] text-[#050810] flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy Base64'}</span>
                    </button>
                  </div>
                  <textarea
                    readOnly
                    rows={8}
                    value={base64Output}
                    className="w-full p-3.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 font-mono text-xs text-white"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
