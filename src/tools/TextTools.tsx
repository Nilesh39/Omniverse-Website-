import React, { useState } from 'react';
import { Type, FileText, FileCode, Copy, Check, Mic, Eraser, AlignLeft } from 'lucide-react';
import { copyToClipboard } from '../lib/utils';

// 1. Case Converter
export const CaseConverterTool: React.FC = () => {
  const [text, setText] = useState('Build stunning glassmorphism PWAs with OmniVerse Tools!');
  const [copied, setCopied] = useState(false);

  const convert = (type: string) => {
    switch (type) {
      case 'upper': setText(text.toUpperCase()); break;
      case 'lower': setText(text.toLowerCase()); break;
      case 'title': setText(text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())); break;
      case 'camel': setText(text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())); break;
      case 'snake': setText(text.toLowerCase().trim().replace(/[\s\W]+/g, '_')); break;
      case 'kebab': setText(text.toLowerCase().trim().replace(/[\s\W]+/g, '-')); break;
    }
  };

  const handleCopy = async () => {
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => convert('upper')} className="px-3 py-1.5 rounded-xl bg-accent/20 text-accent font-bold text-xs">UPPERCASE</button>
        <button onClick={() => convert('lower')} className="px-3 py-1.5 rounded-xl bg-accent/20 text-accent font-bold text-xs">lowercase</button>
        <button onClick={() => convert('title')} className="px-3 py-1.5 rounded-xl bg-accent/20 text-accent font-bold text-xs">Title Case</button>
        <button onClick={() => convert('camel')} className="px-3 py-1.5 rounded-xl glass-panel text-slate-300 font-semibold text-xs">camelCase</button>
        <button onClick={() => convert('snake')} className="px-3 py-1.5 rounded-xl glass-panel text-slate-300 font-semibold text-xs">snake_case</button>
        <button onClick={() => convert('kebab')} className="px-3 py-1.5 rounded-xl glass-panel text-slate-300 font-semibold text-xs">kebab-case</button>
      </div>

      <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-48 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-accent" />

      <button onClick={handleCopy} className="px-4 py-2 rounded-xl bg-accent text-slate-950 font-bold text-xs flex items-center gap-1.5">
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied' : 'Copy Converted Text'}
      </button>
    </div>
  );
};

// 2. Word & Character Counter
export const WordCounterTool: React.FC = () => {
  const [text, setText] = useState('OmniVerse Tools provides 150+ real working offline utilities designed with liquid glass aesthetics.');

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const readingTimeMinutes = (words / 200).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 glass-panel rounded-2xl text-center"><span className="text-[10px] font-bold uppercase text-slate-400">Words</span><h3 className="text-2xl font-black text-accent mt-1">{words}</h3></div>
        <div className="p-4 glass-panel rounded-2xl text-center"><span className="text-[10px] font-bold uppercase text-slate-400">Characters</span><h3 className="text-2xl font-black text-slate-100 mt-1">{chars}</h3></div>
        <div className="p-4 glass-panel rounded-2xl text-center"><span className="text-[10px] font-bold uppercase text-slate-400">Sentences</span><h3 className="text-2xl font-black text-purple-400 mt-1">{sentences}</h3></div>
        <div className="p-4 glass-panel rounded-2xl text-center"><span className="text-[10px] font-bold uppercase text-slate-400">Reading Time</span><h3 className="text-2xl font-black text-emerald-400 mt-1">{readingTimeMinutes} min</h3></div>
      </div>

      <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-48 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-accent" placeholder="Type or paste text for real-time analysis..." />
    </div>
  );
};

// 3. Markdown Previewer
export const MarkdownPreviewerTool: React.FC = () => {
  const [markdown, setMarkdown] = useState(`# ✨ OmniVerse Tools\nWelcome to the **PWA Offline Utility Suite**.\n\n### Features:\n- 100% Offline Capability\n- Glassmorphism & Liquid Design\n- 150+ Functional Utilities\n\n\`\`\`javascript\nconst app = "OmniVerse";\nconsole.log(\`Running \${app} 100% offline!\`);\n\`\`\`\n`);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Markdown Input</label>
        <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} className="w-full h-80 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-accent" />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Rendered View</label>
        <div className="w-full h-80 bg-black/60 rounded-2xl p-4 font-sans text-xs text-slate-200 border border-white/10 overflow-auto prose prose-invert">
          <pre className="whitespace-pre-wrap font-sans">{markdown}</pre>
        </div>
      </div>
    </div>
  );
};

// 4. Lorem Ipsum Generator
export const LoremIpsumGeneratorTool: React.FC = () => {
  const [count, setCount] = useState(3);
  const [text, setText] = useState('');

  const generate = () => {
    const p = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    ];
    let res = [];
    for (let i = 0; i < count; i++) {
      res.push(p[i % p.length]);
    }
    setText(res.join('\n\n'));
  };

  React.useEffect(() => { generate(); }, [count]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-slate-400">Paragraphs:</label>
        <input type="number" min="1" max="10" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-20 bg-black/40 rounded-xl px-3 py-1.5 font-mono text-xs text-slate-100 border border-white/10" />
      </div>
      <textarea readOnly value={text} className="w-full h-64 bg-black/60 rounded-2xl p-4 font-mono text-xs text-accent border border-white/10 overflow-auto" />
    </div>
  );
};

// 5. Speech & Presentation Time Estimator
export const SpeechTimeEstimatorTool: React.FC = () => {
  const [text, setText] = useState('Welcome ladies and gentlemen to the presentation of OmniVerse Tools PWA. Today we are launching a suite of 150 offline tools.');
  const [speed, setSpeed] = useState(130); // words per min

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minutes = (words / speed).toFixed(1);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1 block">Speaking Pace ({speed} words / min)</label>
        <input type="range" min="80" max="200" step="10" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-accent" />
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-40 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10" placeholder="Paste presentation transcript..." />
      <div className="p-6 glass-panel rounded-2xl text-center border border-accent/40">
        <span className="text-xs font-bold uppercase text-slate-400">Estimated Spoken Duration</span>
        <h2 className="text-3xl font-black text-accent mt-1">{minutes} Minutes</h2>
        <span className="text-xs text-slate-400">Total Word Count: {words} words</span>
      </div>
    </div>
  );
};

// 6. Text Cleaner & De-duplicator
export const TextCleanerTool: React.FC = () => {
  const [input, setInput] = useState('Apple\nBanana\nApple\n\nOrange\n  Banana  ');
  const [cleaned, setCleaned] = useState('');

  const clean = () => {
    const lines = input.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const unique = Array.from(new Set(lines));
    setCleaned(unique.join('\n'));
  };

  React.useEffect(() => { clean(); }, [input]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Messy Input Text</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-64 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10" />
      </div>
      <div>
        <label className="text-xs font-semibold text-accent mb-1.5 block">Cleaned & De-duplicated</label>
        <pre className="w-full h-64 bg-black/60 rounded-2xl p-4 font-mono text-xs text-accent border border-white/10 overflow-auto">{cleaned}</pre>
      </div>
    </div>
  );
};
