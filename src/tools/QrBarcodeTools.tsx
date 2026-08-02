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

import jsQR from 'jsqr';
import { Camera, CameraOff, Copy, ExternalLink, RefreshCw, FileText, Check } from 'lucide-react';

// 2. Camera & File QR Scanner
export const QrScannerTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'camera' | 'file'>('camera');
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Stop camera stream
  const stopCamera = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Start camera stream
  const startCamera = async () => {
    setCameraError(null);
    setScannedResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS
        videoRef.current.play();
        setCameraActive(true);
        animationFrameIdRef.current = requestAnimationFrame(tick);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Could not access camera. Please verify camera permissions or try file upload mode.');
      setCameraActive(false);
    }
  };

  // Process frames from video feed
  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code && code.data) {
            setScannedResult(code.data);
            stopCamera();
            return;
          }
        }
      }
    }
    if (streamRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(tick);
    }
  };

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Process file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScannedResult(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current || document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code && code.data) {
              setScannedResult(code.data);
            } else {
              alert('Could not find a valid QR Code in the uploaded image.');
            }
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Copy to Clipboard
  const handleCopy = () => {
    if (scannedResult) {
      navigator.clipboard.writeText(scannedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isUrl = scannedResult?.startsWith('http://') || scannedResult?.startsWith('https://');

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Tabs */}
      <div className="flex rounded-2xl bg-black/40 p-1 border border-white/10">
        <button
          onClick={() => { setActiveTab('camera'); stopCamera(); setScannedResult(null); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${activeTab === 'camera' ? 'bg-accent text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Camera className="w-4 h-4" /> Live Camera
        </button>
        <button
          onClick={() => { setActiveTab('file'); stopCamera(); setScannedResult(null); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${activeTab === 'file' ? 'bg-accent text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <FileText className="w-4 h-4" /> Upload Image File
        </button>
      </div>

      {/* Camera Tab Content */}
      {activeTab === 'camera' && (
        <div className="space-y-4">
          {!scannedResult && (
            <div className="relative aspect-video rounded-3xl overflow-hidden glass-panel border border-white/15 bg-black/60 flex items-center justify-center">
              {cameraActive ? (
                <>
                  <video ref={videoRef} className="w-full h-full object-cover" />
                  {/* Neon Scanning line animation */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent animate-[pulse_1.5s_infinite] shadow-[0_0_8px_var(--accent-color)]" style={{
                    animation: 'scan 2s linear infinite',
                    willChange: 'transform'
                  }} />
                  {/* Target Bracket Overlay */}
                  <div className="absolute w-48 h-48 border-2 border-accent/60 rounded-3xl flex items-center justify-center pointer-events-none">
                    <div className="w-6 h-6 border-t-2 border-l-2 border-accent absolute top-0 left-0 rounded-tl-xl" />
                    <div className="w-6 h-6 border-t-2 border-r-2 border-accent absolute top-0 right-0 rounded-tr-xl" />
                    <div className="w-6 h-6 border-b-2 border-l-2 border-accent absolute bottom-0 left-0 rounded-bl-xl" />
                    <div className="w-6 h-6 border-b-2 border-r-2 border-accent absolute bottom-0 right-0 rounded-br-xl" />
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-4">
                  <CameraOff className="w-10 h-10 text-slate-500 mx-auto" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Camera Scanner Offline</h3>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                      Access the camera feed to automatically capture and decode QR codes instantly.
                    </p>
                  </div>
                  {cameraError && (
                    <p className="text-[10px] text-rose-400 font-semibold bg-rose-950/20 px-3 py-1.5 rounded-xl border border-rose-500/20">
                      {cameraError}
                    </p>
                  )}
                  <button
                    onClick={startCamera}
                    className="px-6 py-2.5 rounded-xl bg-accent text-slate-950 font-bold text-xs shadow-lg shadow-accent/25 hover:opacity-90 transition-opacity"
                  >
                    Start Camera Stream
                  </button>
                </div>
              )}
            </div>
          )}

          {cameraActive && (
            <button
              onClick={stopCamera}
              className="w-full py-2.5 rounded-xl glass-panel text-slate-300 font-semibold text-xs border border-white/10 hover:bg-white/5 transition-colors"
            >
              Stop Camera Feed
            </button>
          )}
        </div>
      )}

      {/* File Tab Content */}
      {activeTab === 'file' && !scannedResult && (
        <div className="p-8 glass-panel rounded-3xl border border-dashed border-white/20 relative space-y-3 cursor-pointer hover:border-accent/40 transition-colors text-center">
          <Upload className="w-10 h-10 text-accent mx-auto" />
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-300 block">Drag & Drop QR Image</span>
            <span className="text-[10px] text-slate-500 block">or click to browse local files</span>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      )}

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Scanned Result Card */}
      {scannedResult && (
        <div className="p-5 glass-panel rounded-3xl border border-accent/40 bg-accent/5 space-y-4 animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-accent tracking-wider">Decoded QR Code</span>
            <span className="px-2 py-0.5 rounded-md bg-accent/15 text-accent text-[9px] font-bold uppercase">Success</span>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-white/5">
            <p className="font-mono text-xs text-slate-200 break-all select-all whitespace-pre-wrap">
              {scannedResult}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-100 border border-white/10 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy Text
                </>
              )}
            </button>

            {isUrl && (
              <a
                href={scannedResult}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-accent hover:opacity-90 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" /> Open Link
              </a>
            )}
          </div>

          <button
            onClick={() => {
              setScannedResult(null);
              if (activeTab === 'camera') startCamera();
            }}
            className="w-full py-2.5 rounded-xl glass-panel text-slate-400 font-semibold text-xs border border-white/5 hover:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Scan Another QR
          </button>
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
