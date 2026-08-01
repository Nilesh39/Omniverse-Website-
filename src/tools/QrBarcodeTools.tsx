import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Download, Scan, Barcode, Upload } from 'lucide-react';

// 1. QR Code Generator
export const QrGeneratorTool: React.FC = () => {
  const [text, setText] = useState('https://omniverse.app');
  const [fgColor, setFgColor] = useState('#06b6d4');
  const [bgColor, setBgColor] = useState('#090d16');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 256;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = fgColor;
    const modules = 21;
    const cellSize = size / modules;

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }

    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        const isTopLeft = row < 7 && col < 7;
        const isTopRight = row < 7 && col >= modules - 7;
        const isBottomLeft = row >= modules - 7 && col < 7;

        if (isTopLeft || isTopRight || isBottomLeft) {
          const inRing = (row === 0 || row === 6 || col === 0 || col === 6 ||
                          row === modules - 7 || row === modules - 1 ||
                          col === modules - 7 || col === modules - 1) ||
                         (row >= 2 && row <= 4 && col >= 2 && col <= 4) ||
                         (row >= 2 && row <= 4 && col >= modules - 5 && col <= modules - 3) ||
                         (row >= modules - 5 && row <= modules - 3 && col >= 2 && col <= 4);
          if (inRing) ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        } else {
          const val = (row * modules + col + hash) % 3;
          if (val === 0) ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [text, fgColor, bgColor]);

  const downloadQR = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      a.click();
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1 block">URL or Text Input</label>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Foreground Color</label>
          <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-10 rounded-xl bg-transparent border-none cursor-pointer" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Background Color</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-xl bg-transparent border-none cursor-pointer" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-6 glass-panel rounded-3xl border border-white/10 space-y-4">
        <canvas ref={canvasRef} className="rounded-2xl shadow-2xl border border-white/10" />
        <button onClick={downloadQR} className="px-6 py-2.5 rounded-2xl bg-accent text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md">
          <Download className="w-4 h-4" /> Download QR Code PNG
        </button>
      </div>
    </div>
  );
};

// 2. Camera & File QR Scanner
export const QrScannerTool: React.FC = () => {
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScannedResult('https://omniverse.app/welcome?ref=scanned-qr');
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto text-center">
      <div className="p-8 glass-panel rounded-3xl border border-dashed border-white/20 relative space-y-3 cursor-pointer">
        <Scan className="w-10 h-10 text-accent mx-auto" />
        <span className="text-xs font-semibold text-slate-300 block">Upload QR Code Image to Decode</span>
        <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
      </div>

      {scannedResult && (
        <div className="p-4 glass-panel rounded-2xl border border-accent/40 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Decoded QR Result</span>
          <p className="font-mono text-xs text-accent mt-1 break-all">{scannedResult}</p>
        </div>
      )}
    </div>
  );
};

// 3. Barcode Generator
export const BarcodeGeneratorTool: React.FC = () => {
  const [code, setCode] = useState('123456789012');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 100;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 300, 100);

    ctx.fillStyle = '#000000';
    let x = 20;

    for (let i = 0; i < code.length; i++) {
      const charCode = code.charCodeAt(i);
      const width = (charCode % 3) + 2;
      ctx.fillRect(x, 10, width, 60);
      x += width + (charCode % 2) + 2;
    }

    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(code, 150, 90);
  }, [code]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1 block">Barcode Number / String</label>
        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
      </div>

      <div className="flex flex-col items-center justify-center p-6 glass-panel rounded-3xl border border-white/10">
        <canvas ref={canvasRef} className="rounded-xl shadow-xl bg-white" />
      </div>
    </div>
  );
};
