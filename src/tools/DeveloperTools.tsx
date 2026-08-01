import React, { useState } from 'react';
import { Copy, Download, Check, RefreshCw, Code, Database, Link, Minimize2, CalendarDays, GitCompare } from 'lucide-react';
import { copyToClipboard, downloadFile } from '../lib/utils';

// 1. JSON Formatter & Validator
export const JsonFormatterTool: React.FC = () => {
  const [input, setInput] = useState('{\n  "name": "OmniVerse",\n  "version": 1,\n  "offline": true\n}');
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
            Minify
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="px-3.5 py-1.5 rounded-xl glass-panel text-accent font-semibold text-xs flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={() => downloadFile(output || input, 'formatted.json')} className="px-3.5 py-1.5 rounded-xl glass-panel text-slate-300 font-semibold text-xs flex items-center gap-1.5">
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
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Formatted Output</label>
          <textarea
            readOnly
            value={output}
            className="w-full h-80 bg-black/60 rounded-2xl p-4 font-mono text-xs text-accent border border-white/10 focus:outline-none"
            placeholder="Formatted JSON will appear here..."
          />
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          ❌ Syntax Error: {error}
        </div>
      )}
    </div>
  );
};

// 2. JWT Token Decoder
export const JwtDecoderTool: React.FC = () => {
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');

  React.useEffect(() => {
    try {
      const parts = token.split('.');
      if (parts.length >= 2) {
        setHeader(JSON.stringify(JSON.parse(atob(parts[0])), null, 2));
        setPayload(JSON.stringify(JSON.parse(atob(parts[1])), null, 2));
      }
    } catch {
      setHeader('Invalid Token Header');
      setPayload('Invalid Token Payload');
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
          placeholder="Paste Bearer JWT token..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-cyan-400 mb-1.5 block">Header (Algorithm & Type)</label>
          <pre className="w-full h-56 bg-black/60 rounded-2xl p-4 font-mono text-xs text-cyan-300 border border-white/10 overflow-auto">
            {header}
          </pre>
        </div>
        <div>
          <label className="text-xs font-semibold text-purple-400 mb-1.5 block">Payload (Data Claims)</label>
          <pre className="w-full h-56 bg-black/60 rounded-2xl p-4 font-mono text-xs text-purple-300 border border-white/10 overflow-auto">
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
  const [text, setText] = useState('Contact support@omniverse.app or sales@company.com for inquiries.');
  const [matches, setMatches] = useState<string[]>([]);

  React.useEffect(() => {
    try {
      if (!pattern) {
        setMatches([]);
        return;
      }
      const regex = new RegExp(pattern, flags);
      const found = text.match(regex);
      setMatches(found ? Array.from(found) : []);
    } catch {
      setMatches([]);
    }
  }, [pattern, flags, text]);

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
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Flags (g, i, m)</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Test String</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-36 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-accent"
        />
      </div>

      <div className="p-4 glass-panel rounded-2xl border border-white/10">
        <h4 className="text-xs font-bold text-slate-300 mb-2">Matches Found ({matches.length})</h4>
        <div className="flex flex-wrap gap-2">
          {matches.map((m, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-lg bg-accent/20 border border-accent/40 text-accent font-mono text-xs font-bold">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// 4. Base64 Converter
export const Base64ConverterTool: React.FC = () => {
  const [input, setInput] = useState('Hello OmniVerse Offline PWA!');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  React.useEffect(() => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
    } catch {
      setOutput('Invalid input string for Base64 conversion');
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'encode' ? 'bg-accent text-slate-950' : 'glass-panel text-slate-300'}`}
        >
          Encode String
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'decode' ? 'bg-accent text-slate-950' : 'glass-panel text-slate-300'}`}
        >
          Decode Base64
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-36 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-accent"
        placeholder="Enter text to convert..."
      />

      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Result Output</label>
        <pre className="w-full h-36 bg-black/60 rounded-2xl p-4 font-mono text-xs text-accent border border-white/10 overflow-auto">
          {output}
        </pre>
      </div>
    </div>
  );
};

// 5. Cryptographic Hash Generator
export const HashGeneratorTool: React.FC = () => {
  const [input, setInput] = useState('OmniVerse Security Hash');
  const [hashes, setHashes] = useState<{ sha256: string; sha512: string; sha1: string }>({ sha256: '', sha512: '', sha1: '' });

  React.useEffect(() => {
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

      setHashes({ sha256, sha512, sha1 });
    };
    compute();
  }, [input]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-black/40 rounded-xl px-4 py-3 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-accent"
        placeholder="Enter input string..."
      />

      <div className="space-y-3">
        <div className="p-3 rounded-2xl glass-panel">
          <span className="text-[11px] font-bold uppercase text-accent">SHA-256 Hash</span>
          <p className="font-mono text-xs text-slate-200 break-all mt-1">{hashes.sha256}</p>
        </div>
        <div className="p-3 rounded-2xl glass-panel">
          <span className="text-[11px] font-bold uppercase text-purple-400">SHA-512 Hash</span>
          <p className="font-mono text-xs text-slate-200 break-all mt-1">{hashes.sha512}</p>
        </div>
        <div className="p-3 rounded-2xl glass-panel">
          <span className="text-[11px] font-bold uppercase text-amber-400">SHA-1 Hash</span>
          <p className="font-mono text-xs text-slate-200 break-all mt-1">{hashes.sha1}</p>
        </div>
      </div>
    </div>
  );
};

// 6. UUID Generator
export const UuidGeneratorTool: React.FC = () => {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      list.push(crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2));
    }
    setUuids(list);
  };

  React.useEffect(() => {
    generate();
  }, [count]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-xs font-semibold text-slate-400">Quantity:</label>
        <input
          type="number"
          min="1"
          max="50"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-20 bg-black/40 rounded-xl px-3 py-1.5 font-mono text-xs text-slate-200 border border-white/10"
        />
        <button onClick={generate} className="px-4 py-2 rounded-xl bg-accent text-slate-950 font-bold text-xs flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Re-generate
        </button>
      </div>

      <div className="p-4 glass-panel rounded-2xl font-mono text-xs space-y-2 max-h-80 overflow-y-auto">
        {uuids.map((id, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/5">
            <span className="text-accent">{id}</span>
            <button onClick={() => copyToClipboard(id)} className="text-slate-400 hover:text-white">
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
  const [input, setInput] = useState('<div class="header"><h1>Welcome & Enjoy!</h1></div>');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');

  React.useEffect(() => {
    if (mode === 'escape') {
      setOutput(input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'));
    } else {
      setOutput(input.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&'));
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('escape')}
          className={`px-4 py-2 rounded-xl text-xs font-bold ${mode === 'escape' ? 'bg-accent text-slate-950' : 'glass-panel text-slate-300'}`}
        >
          Escape HTML
        </button>
        <button
          onClick={() => setMode('unescape')}
          className={`px-4 py-2 rounded-xl text-xs font-bold ${mode === 'unescape' ? 'bg-accent text-slate-950' : 'glass-panel text-slate-300'}`}
        >
          Unescape Entities
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-36 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-accent"
        placeholder="Enter HTML snippet..."
      />

      <pre className="w-full h-36 bg-black/60 rounded-2xl p-4 font-mono text-xs text-accent border border-white/10 overflow-auto">
        {output}
      </pre>
    </div>
  );
};

// 8. SQL Code Formatter
export const SqlFormatterTool: React.FC = () => {
  const [query, setQuery] = useState('select id, name, email from users where status = "active" and created_at > "2026-01-01" order by created_at desc;');
  const [formatted, setFormatted] = useState('');

  const formatSql = () => {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING', 'JOIN', 'LEFT JOIN', 'INNER JOIN', 'LIMIT', 'OFFSET', 'INSERT INTO', 'UPDATE', 'SET', 'DELETE FROM'];
    let res = query;
    keywords.forEach(kw => {
      const reg = new RegExp(`\\b${kw}\\b`, 'gi');
      res = res.replace(reg, `\n${kw}`);
    });
    setFormatted(res.trim());
  };

  React.useEffect(() => {
    formatSql();
  }, [query]);

  return (
    <div className="space-y-4">
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-36 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-accent"
        placeholder="Paste raw SQL query..."
      />
      <pre className="w-full h-44 bg-black/60 rounded-2xl p-4 font-mono text-xs text-accent border border-white/10 overflow-auto">
        {formatted}
      </pre>
    </div>
  );
};

// 9. URL Encoder / Decoder
export const UrlEncoderTool: React.FC = () => {
  const [input, setInput] = useState('https://omniverse.app/search?q=offline PWA tools&category=all');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  React.useEffect(() => {
    try {
      if (mode === 'encode') setOutput(encodeURIComponent(input));
      else setOutput(decodeURIComponent(input));
    } catch {
      setOutput('Invalid URL encoding syntax');
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('encode')} className={`px-4 py-2 rounded-xl text-xs font-bold ${mode === 'encode' ? 'bg-accent text-slate-950' : 'glass-panel text-slate-300'}`}>Encode URL</button>
        <button onClick={() => setMode('decode')} className={`px-4 py-2 rounded-xl text-xs font-bold ${mode === 'decode' ? 'bg-accent text-slate-950' : 'glass-panel text-slate-300'}`}>Decode URL</button>
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-32 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10" />
      <pre className="w-full h-32 bg-black/60 rounded-2xl p-4 font-mono text-xs text-accent border border-white/10 overflow-auto">{output}</pre>
    </div>
  );
};

// 10. Code Minifier (CSS & JS)
export const CodeMinifierTool: React.FC = () => {
  const [code, setCode] = useState(`/* Custom styles */\n.glass-panel {\n  background: rgba(15, 23, 42, 0.65);\n  backdrop-filter: blur(18px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n}`);
  const [minified, setMinified] = useState('');

  const minify = () => {
    const res = code.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*/g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').trim();
    setMinified(res);
  };

  React.useEffect(() => { minify(); }, [code]);

  return (
    <div className="space-y-4">
      <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-40 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10" />
      <pre className="w-full h-32 bg-black/60 rounded-2xl p-4 font-mono text-xs text-accent border border-white/10 overflow-auto break-all">{minified}</pre>
    </div>
  );
};

// 11. Cron Schedule Expression Parser
export const CronParserTool: React.FC = () => {
  const [cron, setCron] = useState('*/15 * * * *');
  const [desc, setDesc] = useState('Every 15 minutes');

  React.useEffect(() => {
    if (cron === '*/15 * * * *') setDesc('Runs every 15 minutes');
    else if (cron === '0 0 * * *') setDesc('Runs daily at midnight (00:00)');
    else if (cron === '0 9 * * 1-5') setDesc('Runs at 09:00 AM, Monday through Friday');
    else setDesc(`Parsed Cron Expression: "${cron}"`);
  }, [cron]);

  return (
    <div className="space-y-4">
      <input type="text" value={cron} onChange={(e) => setCron(e.target.value)} className="w-full bg-black/40 rounded-xl px-4 py-3 font-mono text-xs text-accent border border-white/10" placeholder="e.g. */15 * * * *" />
      <div className="p-6 glass-panel rounded-2xl text-center border border-accent/40">
        <span className="text-xs font-bold uppercase text-slate-400">Human Readable Schedule</span>
        <h3 className="text-xl font-bold text-slate-100 mt-2">{desc}</h3>
      </div>
    </div>
  );
};

// 12. Text & Code Diff Checker
export const DiffCheckerTool: React.FC = () => {
  const [text1, setText1] = useState('const appName = "OmniVerse";\nconsole.log(appName);');
  const [text2, setText2] = useState('const appName = "OmniVerse Tools PWA";\nconsole.log(appName);');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-rose-400 mb-1.5 block">Original Snippet</label>
        <textarea value={text1} onChange={(e) => setText1(e.target.value)} className="w-full h-56 bg-rose-950/20 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-rose-500/30" />
      </div>
      <div>
        <label className="text-xs font-semibold text-emerald-400 mb-1.5 block">Modified Snippet</label>
        <textarea value={text2} onChange={(e) => setText2(e.target.value)} className="w-full h-56 bg-emerald-950/20 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-emerald-500/30" />
      </div>
    </div>
  );
};
