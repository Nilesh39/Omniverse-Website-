import React, { useState } from 'react';
import { Minimize, Scaling, FileImage, Upload, Download } from 'lucide-react';
import jsPDF from 'jspdf';

// 1. Browser Image Compressor
export const ImageCompressorTool: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOriginalFile(file);
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
      compress(url, quality);
    }
  };

  const compress = (url: string, q: number) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            setCompressedUrl(URL.createObjectURL(blob));
            setCompressedSize(blob.size);
          }
        }, 'image/jpeg', q);
      }
    };
  };

  const handleQualityChange = (q: number) => {
    setQuality(q);
    if (originalUrl) compress(originalUrl, q);
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="p-6 glass-panel rounded-3xl border border-dashed border-white/20 text-center space-y-3 cursor-pointer relative">
        <Upload className="w-8 h-8 text-accent mx-auto" />
        <span className="text-xs font-semibold text-slate-300 block">Upload Image (JPG, PNG, WEBP)</span>
        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
      </div>

      {originalFile && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Compression Quality ({Math.round(quality * 100)}%)</label>
            <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => handleQualityChange(Number(e.target.value))} className="w-full accent-accent" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 glass-panel rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Original Size</span>
              <p className="font-mono text-sm font-bold text-slate-200 mt-1">{(originalFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <div className="p-4 glass-panel rounded-2xl border border-accent/40">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Compressed Size</span>
              <p className="font-mono text-sm font-bold text-accent mt-1">{compressedSize ? (compressedSize / 1024).toFixed(1) : '...'} KB</p>
            </div>
          </div>

          {compressedUrl && (
            <div className="text-center">
              <a href={compressedUrl} download="compressed-image.jpg" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-accent text-slate-950 font-bold text-xs shadow-lg">
                <Download className="w-4 h-4" /> Download Compressed Image
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 2. Image Resizer & Format Converter
export const ImageResizerTool: React.FC = () => {
  const [targetWidth, setTargetWidth] = useState(800);

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1 block">Target Output Width (px)</label>
        <input type="number" value={targetWidth} onChange={(e) => setTargetWidth(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
      </div>
      <div className="p-8 glass-panel rounded-3xl border border-dashed border-white/20 text-center space-y-3 relative cursor-pointer">
        <Scaling className="w-8 h-8 text-accent mx-auto" />
        <span className="text-xs font-semibold text-slate-300 block">Select Image to Resize ({targetWidth}px)</span>
        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
      </div>
    </div>
  );
};

// 3. Image to PDF Converter
export const ImageToPdfTool: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const urls = files.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...urls]);
    }
  };

  const generatePdf = () => {
    if (images.length === 0) return;
    const pdf = new jsPDF();
    images.forEach((imgUrl, idx) => {
      if (idx > 0) pdf.addPage();
      pdf.addImage(imgUrl, 'JPEG', 10, 10, 190, 270);
    });
    pdf.save('compiled-document.pdf');
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="p-6 glass-panel rounded-3xl border border-dashed border-white/20 text-center space-y-3 cursor-pointer relative">
        <FileImage className="w-8 h-8 text-accent mx-auto" />
        <span className="text-xs font-semibold text-slate-300 block">Select Multiple Images</span>
        <input type="file" multiple accept="image/*" onChange={handleFiles} className="absolute inset-0 opacity-0 cursor-pointer" />
      </div>

      {images.length > 0 && (
        <div className="space-y-4 text-center">
          <div className="grid grid-cols-3 gap-2">
            {images.map((url, idx) => (
              <img key={idx} src={url} alt="Uploaded" className="w-full h-24 object-cover rounded-xl border border-white/10" />
            ))}
          </div>

          <button onClick={generatePdf} className="px-6 py-3 rounded-2xl bg-accent text-slate-950 font-bold text-xs flex items-center justify-center gap-2 mx-auto shadow-lg">
            <Download className="w-4 h-4" /> Compile & Download PDF ({images.length} pages)
          </button>
        </div>
      )}
    </div>
  );
};
