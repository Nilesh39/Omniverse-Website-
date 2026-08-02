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

// 7. DevTyping Speed Racer & Accuracy Tester
interface Snippet {
  language: string;
  code: string;
}

const SNIPPETS: Snippet[] = [
  {
    language: 'JavaScript',
    code: 'const calculateFactorial = (n) => {\n  if (n <= 1) return 1;\n  return n * calculateFactorial(n - 1);\n};'
  },
  {
    language: 'Python',
    code: 'def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1'
  },
  {
    language: 'CSS / HTML',
    code: '<div className="glass-card shadow-2xl">\n  <h1 className="text-accent font-black">Omniverse</h1>\n  <p className="backdrop-blur-md opacity-90">VisionOS Style</p>\n</div>'
  },
  {
    language: 'SQL Query',
    code: 'SELECT id, SUM(amount) FROM transactions\nINNER JOIN users ON users.id = transactions.user_id\nWHERE transactions.created_at >= \'2260-01-01\'\nGROUP BY id ORDER BY SUM(amount) DESC;'
  }
];

export const DevTypingSpeedRacerTool: React.FC = () => {
  const [langIndex, setLangIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [keystrokes, setKeystrokes] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const activeSnippet = SNIPPETS[langIndex].code;

  // Track time elapsed
  useEffect(() => {
    let timer: any = null;
    if (startTime !== null && !isFinished) {
      timer = setInterval(() => {
        setTimeElapsed(Math.round((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, isFinished]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (isFinished) return;

    if (startTime === null) {
      setStartTime(Date.now());
    }

    setKeystrokes(prev => prev + 1);
    setTypedText(val);

    if (val === activeSnippet) {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setTypedText('');
    setKeystrokes(0);
    setStartTime(null);
    setTimeElapsed(0);
    setIsFinished(false);
  };

  const changeLanguage = (idx: number) => {
    setLangIndex(idx);
    setTypedText('');
    setKeystrokes(0);
    setStartTime(null);
    setTimeElapsed(0);
    setIsFinished(false);
  };

  // Calculations
  const totalChars = typedText.length;
  let correctChars = 0;
  for (let i = 0; i < totalChars; i++) {
    if (typedText[i] === activeSnippet[i]) {
      correctChars++;
    }
  }

  const accuracy = keystrokes > 0 ? Math.round((correctChars / keystrokes) * 100) : 100;
  const minutes = timeElapsed > 0 ? timeElapsed / 60 : 1 / 60;
  
  // Standard WPM: (correct characters / 5) / time elapsed in minutes
  const wpm = Math.round((correctChars / 5) / minutes);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Language selectors */}
      <div className="flex flex-wrap gap-2 justify-center">
        {SNIPPETS.map((snip, idx) => (
          <button
            key={snip.language}
            onClick={() => changeLanguage(idx)}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${langIndex === idx ? 'bg-accent text-slate-950 shadow-md' : 'glass-panel border border-white/10 text-slate-300 hover:text-slate-100'}`}
          >
            {snip.language}
          </button>
        ))}
      </div>

      {/* Real-time stats grid */}
      <div className="grid grid-cols-3 gap-3 font-mono text-center">
        <div className="p-4 glass-panel rounded-2xl border border-white/10">
          <span className="text-[10px] text-slate-400 block uppercase">WPM (Speed)</span>
          <h3 className="text-3xl font-black text-accent mt-1">{wpm}</h3>
        </div>
        <div className="p-4 glass-panel rounded-2xl border border-white/10">
          <span className="text-[10px] text-slate-400 block uppercase">Accuracy</span>
          <h3 className="text-3xl font-black text-emerald-400 mt-1">{accuracy}%</h3>
        </div>
        <div className="p-4 glass-panel rounded-2xl border border-white/10">
          <span className="text-[10px] text-slate-400 block uppercase">Duration</span>
          <h3 className="text-3xl font-black text-slate-100 mt-1">{timeElapsed}s</h3>
        </div>
      </div>

      {/* Visual interactive preview editor box */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/15 p-6 bg-black/60">
        <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap select-none max-h-60 overflow-y-auto pr-2">
          {activeSnippet.split('').map((char, index) => {
            let colorClass = 'text-slate-500';
            const isTyped = index < typedText.length;
            const isCorrect = typedText[index] === char;

            if (isTyped) {
              colorClass = isCorrect ? 'text-emerald-400 font-bold' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-sm px-0.5';
            }

            const isCurrent = index === typedText.length;

            return (
              <span key={index} className={`relative ${colorClass}`}>
                {isCurrent && (
                  <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-accent animate-pulse" />
                )}
                {char}
              </span>
            );
          })}
        </div>

        {/* Hidden overlays when completed */}
        {isFinished && (
          <div className="absolute inset-0 bg-[#090d16]/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 space-y-3">
            <h2 className="text-2xl font-black text-accent">🎉 Race Completed!</h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              You finished typing the {SNIPPETS[langIndex].language} code block at <strong className="text-accent">{wpm} WPM</strong> speed with an accuracy rating of <strong className="text-emerald-400">{accuracy}%</strong>!
            </p>
            <button onClick={handleReset} className="px-5 py-2 rounded-xl bg-accent text-slate-950 font-black text-xs shadow-lg">
              Restart Test
            </button>
          </div>
        )}
      </div>

      {/* Actual text entry area */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Typing Area (Click inside to start)</label>
        <textarea
          value={typedText}
          onChange={handleInputChange}
          disabled={isFinished}
          placeholder="Start typing the code snippet above. The clock will begin automatically..."
          className="w-full h-24 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-100 border border-white/10 focus:outline-none focus:border-accent disabled:opacity-40"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={handleReset} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold text-xs">
          Reset Typing Test
        </button>
      </div>
    </div>
  );
};
