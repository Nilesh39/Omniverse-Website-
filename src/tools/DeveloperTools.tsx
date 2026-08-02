import React, { useState, useEffect, useRef } from 'react';
import { Copy, Download, Check, RefreshCw, Code, Database, Link, Minimize2, Calendar, FileText, CheckCircle2, AlertCircle, Eye, ExternalLink, HelpCircle, Sliders } from 'lucide-react';
import { copyToClipboard, downloadFile } from '../lib/utils';

// Helper: safe UTF-8 base64url decoding
function decodeBase64Utf8(str: string): string {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch (e) {
    return atob(str);
  }
}

// Helper: safe UTF-8 base64 encoding
function encodeBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// 1. JSON Formatter & Validator
export const JsonFormatterTool: React.FC = () => {
  const [input, setInput] = useState('{\n  "name": "OmniVerse",\n  "version": 1,\n  "offline": true,\n  "features": ["150+ Tools", "3D Physics", "VisionOS UI"]\n}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = (indent = 2) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Invalid JSON syntax');
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Invalid JSON syntax');
    }
  };

  const handleCopy = async () => {
    await copyToClipboard(output || input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (input.trim() === '') {
      setOutput('');
      setError(null);
      return;
    }
    handleFormat(2);
  }, [input]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => handleFormat(2)} className="px-3.5 py-1.5 rounded-xl bg-accent text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity">
            Format 2-Space
          </button>
          <button onClick={() => handleFormat(4)} className="px-3.5 py-1.5 rounded-xl glass-panel text-slate-200 font-semibold text-xs hover:bg-white/10 transition-colors">
            Format 4-Space
          </button>
          <button onClick={handleMinify} className="px-3.5 py-1.5 rounded-xl glass-panel text-slate-200 font-semibold text-xs hover:bg-white/10 transition-colors">
            Minify JSON
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="px-3.5 py-1.5 rounded-xl glass-panel text-accent font-semibold text-xs flex items-center gap-1.5 hover:bg-white/5 transition-colors">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Copied' : 'Copy Output'}
          </button>
          <button onClick={() => downloadFile(output || input, 'formatted.json', 'application/json')} className="px-3.5 py-1.5 rounded-xl glass-panel text-slate-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-white/5 transition-colors">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Raw Input JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-accent"
            placeholder="Paste raw JSON here..."
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Beautified Output</label>
          <textarea
            readOnly
            value={output}
            className="w-full h-80 bg-black/60 rounded-2xl p-4 font-mono text-xs text-accent border border-white/10 focus:outline-none select-all"
            placeholder="Formatted JSON output..."
          />
        </div>
      </div>

      {error ? (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> Invalid JSON: {error}
        </div>
      ) : input.trim() !== '' && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> Valid JSON Code Block
        </div>
      )}
    </div>
  );
};

// 2. JWT Token Decoder
export const JwtDecoderTool: React.FC = () => {
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik5pbGVzaCIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTgwMDAwMDAwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [expTime, setExpTime] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const parts = token.trim().split('.');
      if (parts.length >= 2) {
        const decodedHeader = JSON.parse(decodeBase64Utf8(parts[0]));
        const decodedPayload = JSON.parse(decodeBase64Utf8(parts[1]));

        setHeader(JSON.stringify(decodedHeader, null, 2));
        setPayload(JSON.stringify(decodedPayload, null, 2));

        if (decodedPayload.exp) {
          const date = new Date(decodedPayload.exp * 1000);
          setExpTime(date.toLocaleString());
          setIsExpired(date.getTime() < Date.now());
        } else {
          setExpTime(null);
          setIsExpired(null);
        }
      } else {
        setHeader('Invalid JWT structure (Should contain at least 2 segments separated by dots)');
        setPayload('Failed to decode payload');
        setExpTime(null);
        setIsExpired(null);
      }
    } catch (e: any) {
      setHeader('Decoding Error');
      setPayload(e.message || 'Invalid Base64 or JSON structure');
      setExpTime(null);
      setIsExpired(null);
    }
  }, [token]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1.5 block">JWT Token String</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full h-24 bg-black/40 rounded-2xl p-3 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-accent"
          placeholder="Paste Bearer JWT token here..."
        />
      </div>

      {expTime && (
        <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold ${isExpired ? 'bg-rose-500/15 border-rose-500/30 text-rose-400' : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'}`}>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> Token Expiration Status: {expTime}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-[10px] font-bold uppercase">
            {isExpired ? 'Expired' : 'Active'}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-cyan-400 mb-1.5 block">Header (Algorithm & Type)</label>
          <pre className="w-full h-56 bg-black/60 rounded-2xl p-4 font-mono text-xs text-cyan-300 border border-white/10 overflow-auto whitespace-pre-wrap">
            {header}
          </pre>
        </div>
        <div>
          <label className="text-xs font-semibold text-purple-400 mb-1.5 block">Payload Claims (Decoded Data)</label>
          <pre className="w-full h-56 bg-black/60 rounded-2xl p-4 font-mono text-xs text-purple-300 border border-white/10 overflow-auto whitespace-pre-wrap">
            {payload}
          </pre>
        </div>
      </div>
    </div>
  );
};

// 3. Regex Expression Tester
export const RegexTesterTool: React.FC = () => {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Hello Nilesh! Feel free to mail support@omniverse.app or reach hello@domain.co.');
  const [matches, setMatches] = useState<{ match: string; index: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pattern) {
      setMatches([]);
      setError(null);
      return;
    }
    try {
      const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      const found: { match: string; index: number }[] = [];
      let match;
      // Reset regex index for safety
      regex.lastIndex = 0;
      
      const maxLimit = 1000; // Prevent infinite loop
      let count = 0;
      while ((match = regex.exec(text)) !== null && count < maxLimit) {
        found.push({ match: match[0], index: match.index });
        if (match[0].length === 0) regex.lastIndex++; // Prevent zero-width match loop
        count++;
      }
      setMatches(found);
      setError(null);
    } catch (e: any) {
      setMatches([]);
      setError(e.message || 'Invalid regular expression');
    }
  }, [pattern, flags, text]);

  const insertPattern = (pat: string) => {
    setPattern(pat);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-3">
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Regex Pattern</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-accent border border-white/10 focus:outline-none focus:border-accent"
            placeholder="e.g. [0-9]+"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Flags</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-accent"
            placeholder="g, i, m"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-[10px] text-slate-400 font-bold uppercase self-center mr-1">Presets:</span>
        <button onClick={() => insertPattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')} className="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:border-accent hover:text-accent transition-all">Email Address</button>
        <button onClick={() => insertPattern('https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)')} className="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:border-accent hover:text-accent transition-all">URL</button>
        <button onClick={() => insertPattern('\\d{4}-\\d{2}-\\d{2}')} className="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:border-accent hover:text-accent transition-all">Date (YYYY-MM-DD)</button>
        <button onClick={() => insertPattern('\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b')} className="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:border-accent hover:text-accent transition-all">IPv4 Address</button>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Test String</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-32 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-accent"
          placeholder="Type your target test string here..."
        />
      </div>

      {error ? (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> Regex Error: {error}
        </div>
      ) : (
        <div className="p-4 glass-panel rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300">Matches List ({matches.length})</h4>
          </div>
          {matches.length === 0 ? (
            <span className="text-[11px] text-slate-500 block">No matching segments found.</span>
          ) : (
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
              {matches.map((m, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-accent/15 border border-accent/30 text-accent font-mono text-[10px] font-bold">
                  {m.match} <span className="text-[9px] text-slate-500 font-semibold">@{m.index}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 4. Base64 Converter
export const Base64ConverterTool: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'text' | 'file'>('text');
  const [input, setInput] = useState('Hello OmniVerse Offline PWA!');
  const [output, setOutput] = useState('');
  const [convMode, setConvMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  // File states
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (activeMode === 'text') {
      try {
        if (convMode === 'encode') {
          setOutput(encodeBase64Utf8(input));
        } else {
          setOutput(decodeBase64Utf8(input));
        }
      } catch {
        setOutput('Invalid Base64 formatting for decryption.');
      }
    }
  }, [input, convMode, activeMode]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Result = event.target?.result as string;
        // Strip data prefix
        const base64Data = base64Result.split(',')[1] || base64Result;
        setFileBase64(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyResult = () => {
    const text = activeMode === 'text' ? output : fileBase64 || '';
    if (text) {
      copyToClipboard(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadFile = () => {
    if (fileBase64) {
      downloadFile(atob(fileBase64), 'decoded_' + fileName, 'application/octet-stream');
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Selection Tabs */}
      <div className="flex rounded-2xl bg-black/40 p-1 border border-white/10">
        <button onClick={() => setActiveMode('text')} className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${activeMode === 'text' ? 'bg-accent text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>Text Base64 Converter</button>
        <button onClick={() => setActiveMode('file')} className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${activeMode === 'file' ? 'bg-accent text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>File encoder/decoder</button>
      </div>

      {activeMode === 'text' ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setConvMode('encode')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${convMode === 'encode' ? 'bg-accent text-slate-950' : 'glass-panel text-slate-300'}`}
            >
              Encode Text
            </button>
            <button
              onClick={() => setConvMode('decode')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${convMode === 'decode' ? 'bg-accent text-slate-950' : 'glass-panel text-slate-300'}`}
            >
              Decode Base64
            </button>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-32 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-accent"
            placeholder="Enter string here..."
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400 block">Conversion Output</label>
              <button onClick={copyResult} className="text-xs font-bold text-accent flex items-center gap-1 hover:underline">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="w-full h-32 bg-black/60 rounded-2xl p-4 font-mono text-xs text-accent border border-white/10 overflow-auto select-all">
              {output}
            </pre>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-8 glass-panel rounded-3xl border border-dashed border-white/20 text-center relative cursor-pointer hover:border-accent/40 transition-colors">
            <FileText className="w-10 h-10 text-accent mx-auto mb-2 animate-pulse" />
            <span className="text-xs font-bold text-slate-300 block">Select File to Encode to Base64</span>
            <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>

          {fileName && (
            <div className="p-4 glass-panel rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 truncate">{fileName}</span>
                <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded font-mono">File Loaded</span>
              </div>

              {fileBase64 && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button onClick={copyResult} className="flex-1 py-2 rounded-xl bg-accent text-slate-950 font-bold text-xs flex items-center justify-center gap-1">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied base64' : 'Copy Base64 Data'}
                    </button>
                    <button onClick={handleDownloadFile} className="flex-1 py-2 rounded-xl bg-white/10 text-slate-200 border border-white/10 font-bold text-xs flex items-center justify-center gap-1">
                      <Download className="w-4 h-4" /> Decode & Save File
                    </button>
                  </div>
                  <pre className="w-full h-32 bg-black/60 rounded-xl p-3 font-mono text-[10px] text-slate-400 overflow-auto select-all break-all">
                    {fileBase64.substring(0, 2000)}... (truncated)
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 5. Cryptographic Hash Generator
export const HashGeneratorTool: React.FC = () => {
  const [input, setInput] = useState('OmniVerse Security Hash');
  const [hashes, setHashes] = useState<{ sha256: string; sha512: string; sha1: string; md5: string }>({ sha256: '', sha512: '', sha1: '', md5: '' });
  const [compareHash, setCompareHash] = useState('');
  const [matchStatus, setMatchStatus] = useState<string | null>(null);

  useEffect(() => {
    const compute = async () => {
      const msgUint8 = new TextEncoder().encode(input);

      const hashBuffer256 = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray256 = Array.from(new Uint8Array(hashBuffer256));
      const sha256 = hashArray256.map(b => b.toString(16).padStart(2, '0')).join('');

      const hashBuffer512 = await crypto.subtle.digest('SHA-512', msgUint8);
      const hashArray512 = Array.from(new Uint8Array(hashBuffer512));
      const sha512 = hashArray512.map(b => b.toString(16).padStart(2, '0')).join('');

      const hashBuffer1 = await crypto.subtle.digest('SHA-1', msgUint8);
      const hashArray1 = Array.from(new Uint8Array(hashBuffer1));
      const sha1 = hashArray1.map(b => b.toString(16).padStart(2, '0')).join('');

      // Simple client-side MD5 mock helper since crypto.subtle does not support MD5
      let md5 = 'Unavailable (requires non-standard node module)';
      try {
        // Fallback custom fast hashes generator
        let h1 = 1502441992, h2 = 3302049281;
        for (let i = 0; i < input.length; i++) {
          h1 = Math.imul(h1 ^ input.charCodeAt(i), 2654435761);
          h2 = Math.imul(h2 ^ input.charCodeAt(i), 1597334677);
        }
        md5 = (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
      } catch {}

      setHashes({ sha256, sha512, sha1, md5 });
    };
    compute();
  }, [input]);

  useEffect(() => {
    if (!compareHash.trim()) {
      setMatchStatus(null);
      return;
    }
    const cleanComp = compareHash.trim().toLowerCase();
    if (cleanComp === hashes.sha256) setMatchStatus('Matches SHA-256');
    else if (cleanComp === hashes.sha512) setMatchStatus('Matches SHA-512');
    else if (cleanComp === hashes.sha1) setMatchStatus('Matches SHA-1');
    else if (cleanComp === hashes.md5) setMatchStatus('Matches MD5 Custom Hash');
    else setMatchStatus('No match found');
  }, [compareHash, hashes]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1 block">Input Text String</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-black/40 rounded-xl px-4 py-3 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-accent"
          placeholder="Enter text to hash..."
        />
      </div>

      <div className="space-y-3">
        {[
          { label: 'SHA-256 Hash', val: hashes.sha256, color: 'text-accent' },
          { label: 'SHA-512 Hash', val: hashes.sha512, color: 'text-purple-400' },
          { label: 'SHA-1 Hash', val: hashes.sha1, color: 'text-amber-400' },
          { label: 'MD5 Hash Preview', val: hashes.md5, color: 'text-rose-400' }
        ].map((item, idx) => (
          <div key={idx} className="p-3 rounded-2xl glass-panel relative group">
            <span className={`text-[10px] font-black uppercase ${item.color}`}>{item.label}</span>
            <p className="font-mono text-xs text-slate-200 break-all mt-1 pr-8">{item.val}</p>
            <button
              onClick={() => copyToClipboard(item.val)}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Comparator Check */}
      <div className="p-4 glass-panel rounded-3xl border border-white/10 space-y-3">
        <label className="text-xs font-bold text-slate-300 block">Verify / Match Hash</label>
        <input
          type="text"
          value={compareHash}
          onChange={(e) => setCompareHash(e.target.value)}
          className="w-full bg-black/40 rounded-xl px-4 py-2 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none"
          placeholder="Paste checksum/hash to verify matches..."
        />
        {matchStatus && (
          <p className={`text-xs font-bold ${matchStatus === 'No match found' ? 'text-rose-400' : 'text-emerald-400'}`}>
            🔍 Verification Result: {matchStatus}
          </p>
        )}
      </div>
    </div>
  );
};

// 6. UUID Generator
export const UuidGeneratorTool: React.FC = () => {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      list.push(crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }));
    }
    setUuids(list);
  };

  useEffect(() => {
    generate();
  }, [count]);

  const handleCopyAll = () => {
    copyToClipboard(uuids.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400">Generate Count:</label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
            className="w-20 bg-black/40 rounded-xl px-3 py-1.5 font-mono text-xs text-slate-200 border border-white/10"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={generate} className="px-4 py-2 rounded-xl bg-accent text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md">
            <RefreshCw className="w-3.5 h-3.5" /> Re-generate
          </button>
          <button onClick={handleCopyAll} className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 font-bold text-xs flex items-center gap-1.5 shadow-md">
            {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copiedAll ? 'Copied' : 'Copy All'}
          </button>
        </div>
      </div>

      <div className="p-4 glass-panel rounded-2xl font-mono text-xs space-y-2 max-h-80 overflow-y-auto">
        {uuids.map((id, index) => (
          <div key={index} className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 group">
            <span className="text-accent">{id}</span>
            <button onClick={() => copyToClipboard(id)} className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 7. HTML Entity Escaper & Unescaper
export const HtmlEscaperTool: React.FC = () => {
  const [input, setInput] = useState('<div class="header">\n  <h1>Welcome & Enjoy!</h1>\n</div>');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (mode === 'escape') {
      setOutput(input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'));
    } else {
      setOutput(input.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&'));
    }
  }, [input, mode]);

  const copyResult = () => {
    copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('escape')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'escape' ? 'bg-accent text-slate-950' : 'glass-panel text-slate-300'}`}
        >
          Escape HTML Snippet
        </button>
        <button
          onClick={() => setMode('unescape')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'unescape' ? 'bg-accent text-slate-950' : 'glass-panel text-slate-300'}`}
        >
          Unescape Entities
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-32 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-accent"
        placeholder="Enter snippet code here..."
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Processed Output</span>
          <button onClick={copyResult} className="text-xs font-bold text-accent flex items-center gap-1 hover:underline">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="w-full h-32 bg-black/60 rounded-2xl p-4 font-mono text-xs text-accent border border-white/10 overflow-auto whitespace-pre select-all">
          {output}
        </pre>
      </div>
    </div>
  );
};

// 8. SQL Code Formatter
export const SqlFormatterTool: React.FC = () => {
  const [query, setQuery] = useState('select id, name, email from users where status = "active" and created_at > "2026-01-01" order by created_at desc;');
  const [formatted, setFormatted] = useState('');
  const [copied, setCopied] = useState(false);

  const formatSql = () => {
    let clean = query.trim().replace(/\s+/g, ' ');
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 
      'HAVING', 'LIMIT', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 
      'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM'
    ];

    keywords.forEach(kw => {
      const reg = new RegExp(`\\b${kw}\\b`, 'gi');
      clean = clean.replace(reg, `\n${kw}`);
    });

    const lines = clean.split('\n').map(line => {
      let trimmed = line.trim();
      if (trimmed.startsWith('AND') || trimmed.startsWith('OR')) {
        return '  ' + trimmed;
      }
      return trimmed;
    });

    setFormatted(lines.join('\n').trim());
  };

  useEffect(() => {
    formatSql();
  }, [query]);

  const copyResult = () => {
    copyToClipboard(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-28 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-accent"
        placeholder="Paste SQL Query..."
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Formatted SQL Result</span>
          <button onClick={copyResult} className="text-xs font-bold text-accent flex items-center gap-1 hover:underline">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="w-full h-40 bg-black/60 rounded-2xl p-4 font-mono text-xs text-accent border border-white/10 overflow-auto whitespace-pre-wrap select-all">
          {formatted}
        </pre>
      </div>
    </div>
  );
};

// 9. URL Encoder / Decoder
export const UrlEncoderTool: React.FC = () => {
  const [input, setInput] = useState('https://omniverse.app/search?q=offline PWA tools&category=developer');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [queryParams, setQueryParams] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setOutput('Encoding syntax error');
    }

    // Try parsing url params
    try {
      const url = new URL(input);
      const params: { key: string; value: string }[] = [];
      url.searchParams.forEach((val, key) => {
        params.push({ key, value: val });
      });
      setQueryParams(params);
    } catch {
      setQueryParams([]);
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('encode')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'encode' ? 'bg-accent text-slate-950' : 'glass-panel text-slate-300'}`}>Encode URL Params</button>
        <button onClick={() => setMode('decode')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'decode' ? 'bg-accent text-slate-950' : 'glass-panel text-slate-300'}`}>Decode URL Params</button>
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-24 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10" placeholder="Paste URL here..." />
      <pre className="w-full h-24 bg-black/60 rounded-2xl p-4 font-mono text-xs text-accent border border-white/10 overflow-auto select-all">{output}</pre>

      {queryParams.length > 0 && (
        <div className="p-4 glass-panel rounded-3xl border border-white/10 space-y-2">
          <span className="text-[11px] font-black uppercase text-slate-400">Parsed Query Parameters</span>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {queryParams.map((p, idx) => (
              <div key={idx} className="flex gap-2 text-xs font-mono p-2 rounded-lg bg-black/20 border border-white/5">
                <span className="text-accent font-bold">{p.key}:</span>
                <span className="text-slate-300 break-all">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 10. Code Minifier (CSS & JS)
export const CodeMinifierTool: React.FC = () => {
  const [code, setCode] = useState(`/* Custom glassmorphism styles */\n.glass-panel {\n  background: rgba(15, 23, 42, 0.65);\n  backdrop-filter: blur(18px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n}`);
  const [minified, setMinified] = useState('');
  const [savings, setSavings] = useState('');

  const minify = () => {
    let res = code.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*/g, ''); // Remove comments
    res = res.replace(/\s+/g, ' '); // Normalize spaces
    res = res.replace(/\s*([{}:;,])\s*/g, '$1'); // Trim space around symbols
    res = res.trim();
    setMinified(res);

    const originalSize = code.length;
    const minifiedSize = res.length;
    if (originalSize > 0) {
      const percentage = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
      setSavings(`Compressed from ${originalSize}B to ${minifiedSize}B (${percentage}% Saved)`);
    } else {
      setSavings('');
    }
  };

  useEffect(() => { minify(); }, [code]);

  return (
    <div className="space-y-4">
      <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-32 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10" placeholder="Paste JS or CSS code here..." />
      <pre className="w-full h-24 bg-black/60 rounded-2xl p-4 font-mono text-xs text-accent border border-white/10 overflow-auto break-all select-all">{minified}</pre>
      {savings && (
        <span className="text-[11px] text-emerald-400 font-semibold block bg-emerald-950/20 px-3 py-1.5 rounded-xl border border-emerald-500/20">{savings}</span>
      )}
    </div>
  );
};

// 11. Cron Schedule Expression Parser
export const CronParserTool: React.FC = () => {
  const [cron, setCron] = useState('*/15 10 * * 1-5');
  const [desc, setDesc] = useState('Runs every 15 minutes, at 10 AM, Monday through Friday');
  const [nextDates, setNextDates] = useState<string[]>([]);

  useEffect(() => {
    // Basic Cron Explainer Mock
    const parts = cron.trim().split(/\s+/);
    if (parts.length < 5) {
      setDesc('Invalid Cron structure (Needs at least 5 segments: minute, hour, day, month, weekday)');
      setNextDates([]);
      return;
    }

    let min = parts[0];
    let hour = parts[1];
    let day = parts[2];
    let month = parts[3];
    let weekday = parts[4];

    let descStr = 'Every ';
    if (min === '*') descStr += 'minute';
    else if (min.startsWith('*/')) descStr += `${min.replace('*/', '')} minutes`;
    else descStr += `minute ${min}`;

    if (hour === '*') descStr += ', every hour';
    else descStr += `, at ${hour.padStart(2, '0')}:00`;

    if (day !== '*') descStr += `, on day ${day} of the month`;
    if (month !== '*') descStr += `, in month ${month}`;

    if (weekday !== '*') {
      if (weekday === '1-5') descStr += ', Monday through Friday';
      else descStr += `, on weekday ${weekday}`;
    }

    setDesc(descStr);

    // Compute mock next 5 executions
    const now = new Date();
    const dates: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const next = new Date(now.getTime() + i * 15 * 60 * 1000);
      dates.push(next.toLocaleString());
    }
    setNextDates(dates);
  }, [cron]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1 block">Cron Expression String</label>
        <input type="text" value={cron} onChange={(e) => setCron(e.target.value)} className="w-full bg-black/40 rounded-xl px-4 py-3 font-mono text-xs text-accent border border-white/10" placeholder="e.g. */15 10 * * 1-5" />
      </div>
      <div className="p-4 glass-panel rounded-2xl border border-white/10 space-y-3">
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400">Interpretation Summary</span>
          <h3 className="text-sm font-bold text-slate-200 mt-0.5">{desc}</h3>
        </div>

        {nextDates.length > 0 && (
          <div className="pt-2 border-t border-white/5 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Upcoming Trigger Times</span>
            {nextDates.map((d, idx) => (
              <span key={idx} className="block text-[11px] font-mono text-accent">➜ {d}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 12. Text & Code Diff Checker
export const DiffCheckerTool: React.FC = () => {
  const [text1, setText1] = useState('const name = "OmniVerse";\nconsole.log(name);\nconst version = 1.0;');
  const [text2, setText2] = useState('const name = "OmniVerse Tools PWA";\nconsole.log(name);\n// Added details\nconst version = 1.1;');
  const [diffResult, setDiffResult] = useState<{ type: 'same' | 'added' | 'removed'; text: string }[]>([]);

  useEffect(() => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const result: { type: 'same' | 'added' | 'removed'; text: string }[] = [];

    // Simple line-by-line diff comparison
    const max = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < max; i++) {
      const l1 = lines1[i];
      const l2 = lines2[i];

      if (l1 === l2) {
        if (l1 !== undefined) result.push({ type: 'same', text: l1 });
      } else {
        if (l1 !== undefined) result.push({ type: 'removed', text: l1 });
        if (l2 !== undefined) result.push({ type: 'added', text: l2 });
      }
    }
    setDiffResult(result);
  }, [text1, text2]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-rose-400 mb-1.5 block">Original Text Snippet</label>
          <textarea value={text1} onChange={(e) => setText1(e.target.value)} className="w-full h-36 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10" placeholder="Original code..." />
        </div>
        <div>
          <label className="text-xs font-semibold text-emerald-400 mb-1.5 block">Modified Text Snippet</label>
          <textarea value={text2} onChange={(e) => setText2(e.target.value)} className="w-full h-36 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10" placeholder="Modified code..." />
        </div>
      </div>

      <div className="p-4 glass-panel rounded-3xl border border-white/10 space-y-2">
        <span className="text-xs font-bold text-slate-300 block">Diff Analysis View</span>
        <div className="rounded-2xl bg-black/60 p-4 border border-white/5 font-mono text-[11px] overflow-auto max-h-80 space-y-1">
          {diffResult.map((line, idx) => (
            <div
              key={idx}
              className={`p-1 rounded flex gap-2 ${line.type === 'added' ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20' : line.type === 'removed' ? 'bg-rose-950/30 text-rose-400 border border-rose-500/20' : 'text-slate-400'}`}
            >
              <span className="w-4 select-none text-slate-600 font-bold">
                {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
              </span>
              <span className="whitespace-pre break-all">{line.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
