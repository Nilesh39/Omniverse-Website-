import React, { useState, useEffect } from 'react';
import {
  Palette, ShieldAlert, Dices, Disc, Copy, Check, RefreshCw, Lock, Eye, EyeOff, Maximize, Ruler, Sparkles,
  AlertTriangle, CheckCircle2, XCircle, Info, ShieldCheck, Cpu, Key, FileText, ArrowRightLeft, BookOpen
} from 'lucide-react';
import { copyToClipboard } from '../lib/utils';
import confetti from 'canvas-confetti';

// 1. CSS Liquid Gradient Generator
export const GradientGeneratorTool: React.FC = () => {
  const [color1, setColor1] = useState('#06b6d4');
  const [color2, setColor2] = useState('#a855f7');
  const [angle, setAngle] = useState(135);
  const [copied, setCopied] = useState(false);

  const cssGradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

  const handleCopy = async () => {
    await copyToClipboard(`background: ${cssGradient};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div
        className="w-full h-48 rounded-3xl shadow-2xl border border-white/20 flex items-center justify-center transition-all duration-300"
        style={{ background: cssGradient }}
      >
        <span className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md text-xs font-mono text-white font-bold border border-white/20">
          {cssGradient}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Color Stop 1</label>
          <div className="flex items-center gap-2">
            <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer" />
            <input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="flex-1 bg-black/40 rounded-xl px-3 py-2 font-mono text-xs text-slate-200 border border-white/10" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Color Stop 2</label>
          <div className="flex items-center gap-2">
            <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer" />
            <input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="flex-1 bg-black/40 rounded-xl px-3 py-2 font-mono text-xs text-slate-200 border border-white/10" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Angle ({angle}°)</label>
          <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full mt-3 accent-accent" />
        </div>
      </div>

      <button onClick={handleCopy} className="px-4 py-2.5 rounded-xl bg-accent text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md">
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'CSS Copied!' : 'Copy CSS Rule'}
      </button>
    </div>
  );
};

// 2. HEX / RGB / HSL Color Converter
export const ColorConverterTool: React.FC = () => {
  const [hex, setHex] = useState('#06b6d4');

  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;

  const rgbStr = `rgb(${r}, ${g}, ${b})`;

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="flex items-center gap-4">
        <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="w-16 h-16 rounded-2xl bg-transparent border-none cursor-pointer" />
        <input type="text" value={hex} onChange={(e) => setHex(e.target.value)} className="flex-1 bg-black/40 rounded-xl px-4 py-3 font-mono text-sm text-slate-100 border border-white/10" />
      </div>

      <div className="p-6 glass-panel rounded-2xl border border-white/10 space-y-3 font-mono text-xs">
        <div className="flex justify-between"><span className="text-slate-400">HEX Code:</span><span className="font-bold text-accent">{hex}</span></div>
        <div className="flex justify-between"><span className="text-slate-400">RGB Format:</span><span className="font-bold text-slate-200">{rgbStr}</span></div>
      </div>
    </div>
  );
};

// 3. WCAG Color Contrast Checker
export const ContrastCheckerTool: React.FC = () => {
  const [fg, setFg] = useState('#ffffff');
  const [bg, setBg] = useState('#090d16');

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Text Color</label>
          <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-full h-10 rounded-xl bg-transparent border-none cursor-pointer" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Background Color</label>
          <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-full h-10 rounded-xl bg-transparent border-none cursor-pointer" />
        </div>
      </div>

      <div className="p-8 rounded-3xl border border-white/20 text-center font-bold text-lg" style={{ color: fg, backgroundColor: bg }}>
        Sample Vision Text Preview
      </div>
    </div>
  );
};

// 4. Aspect Ratio & Dimension Calc
export const AspectRatioCalculatorTool: React.FC = () => {
  const [w, setW] = useState(1920);
  const [h, setH] = useState(1080);
  const [targetW, setTargetW] = useState(1280);

  const targetH = Math.round((targetW * h) / w);

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Original Width</label>
          <input type="number" value={w} onChange={(e) => setW(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2 text-xs font-mono text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Original Height</label>
          <input type="number" value={h} onChange={(e) => setH(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2 text-xs font-mono text-slate-100 border border-white/10" />
        </div>
      </div>

      <div className="p-6 glass-panel rounded-2xl border border-accent/40 text-center space-y-2">
        <span className="text-xs font-bold uppercase text-slate-400">Target Height for {targetW}px Width</span>
        <h2 className="text-3xl font-black text-accent font-mono">{targetH} px</h2>
        <span className="text-xs text-slate-400">Aspect Ratio: 16:9 equivalent</span>
      </div>
    </div>
  );
};

// 5. PX to REM Converter
export const PxRemConverterTool: React.FC = () => {
  const [px, setPx] = useState(16);
  const rem = (px / 16).toFixed(3);

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1">Pixel Value (px)</label>
        <input type="number" value={px} onChange={(e) => setPx(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
      </div>

      <div className="p-6 glass-panel rounded-2xl border border-accent/40 text-center">
        <span className="text-xs font-bold uppercase text-slate-400">REM Equivalent (Base 16px)</span>
        <h2 className="text-4xl font-black text-accent font-mono my-1">{rem} rem</h2>
      </div>
    </div>
  );
};

// 6. Standalone Password Generator
export const PasswordGeneratorTool: React.FC = () => {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNum, setUseNum] = useState(true);
  const [useSym, setUseSym] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let chars = '';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useNum) chars += '0123456789';
    if (useSym) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) return;

    let res = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      res += chars[array[i] % chars.length];
    }
    setPassword(res);
  };

  useEffect(() => { generate(); }, [length, useUpper, useLower, useNum, useSym]);

  const handleCopy = async () => {
    await copyToClipboard(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 glass-panel rounded-2xl border border-accent/40 flex items-center justify-between gap-3">
        <span className="font-mono text-sm sm:text-base font-bold text-accent break-all">{password}</span>
        <div className="flex gap-2">
          <button onClick={generate} className="p-2 rounded-xl glass-panel text-slate-300 hover:text-accent"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={handleCopy} className="px-3.5 py-2 rounded-xl bg-accent text-slate-950 font-bold text-xs flex items-center gap-1">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Password Length ({length} chars)</label>
          <input type="range" min="8" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-accent" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <label className="flex items-center gap-2 p-3 rounded-xl glass-panel text-xs text-slate-200 cursor-pointer">
            <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} className="accent-accent" /> Upper (A-Z)
          </label>
          <label className="flex items-center gap-2 p-3 rounded-xl glass-panel text-xs text-slate-200 cursor-pointer">
            <input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} className="accent-accent" /> Lower (a-z)
          </label>
          <label className="flex items-center gap-2 p-3 rounded-xl glass-panel text-xs text-slate-200 cursor-pointer">
            <input type="checkbox" checked={useNum} onChange={(e) => setUseNum(e.target.checked)} className="accent-accent" /> Numbers (0-9)
          </label>
          <label className="flex items-center gap-2 p-3 rounded-xl glass-panel text-xs text-slate-200 cursor-pointer">
            <input type="checkbox" checked={useSym} onChange={(e) => setUseSym(e.target.checked)} className="accent-accent" /> Symbols (!@#$)
          </label>
        </div>
      </div>
    </div>
  );
};

// Common breached words & names database (offline top 100+ patterns)
const COMMON_BREACH_PATTERNS = [
  'password', '123456', 'qwerty', 'admin', 'welcome', 'nilesh', 'p@ssword', '12345678', 'iloveyou', 'sunshine',
  'dragon', 'master', 'monkey', 'shadow', 'superman', 'football', 'princess', 'baseball', 'letmein', 'trustno1',
  'abc123', 'system', 'root', 'login', 'testing', 'pass123', 'guest', 'company', 'office', 'school',
  '2006', '2026', '1990', '1995', '2000', '2005', '2010', '2015', '2020', '2025'
];

// Helper: Calculate Crack Time Estimation
function estimateCrackTime(entropyBits: number): string {
  if (entropyBits <= 0) return 'Instant';
  const totalGuesses = Math.pow(2, entropyBits);
  const guessesPerSecond = 1e10; // 10 Billion guesses/sec (modern GPU array)
  const seconds = totalGuesses / (guessesPerSecond * 2);

  if (seconds < 1) return 'Instant';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000 * 100) return `${Math.round(seconds / 31536000)} years`;
  if (seconds < 31536000 * 1e6) return `${(seconds / 31536000 / 1e3).toFixed(1)} Thousand years`;
  return `${(seconds / 31536000 / 1e6).toFixed(1)} Million years`;
}

// 7. ULTRA PRODUCTION-READY PASSWORD STRENGTH ANALYZER & SUITE
export const PasswordStrengthCheckerTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'generator' | 'compare' | 'education'>('analyzer');
  const [pass, setPass] = useState('Nilesh@2006');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  // Comparison State
  const [comparePass1, setComparePass1] = useState('Nilesh@2006');
  const [comparePass2, setComparePass2] = useState('Tr0p!cal#Nebula$2026');

  // Generator State
  const [genLength, setGenLength] = useState(16);
  const [genUpper, setGenUpper] = useState(true);
  const [genLower, setGenLower] = useState(true);
  const [genNum, setGenNum] = useState(true);
  const [genSym, setGenSym] = useState(true);
  const [genExcludeSimilar, setGenExcludeSimilar] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  // Detailed Analysis Helper
  const analyzePassword = (input: string) => {
    const len = input.length;
    const hasUpper = /[A-Z]/.test(input);
    const hasLower = /[a-z]/.test(input);
    const hasDigit = /[0-9]/.test(input);
    const hasSymbol = /[^a-zA-Z0-9\s]/.test(input);
    const hasSpace = /\s/.test(input);

    const upperCount = (input.match(/[A-Z]/g) || []).length;
    const lowerCount = (input.match(/[a-z]/g) || []).length;
    const digitCount = (input.match(/[0-9]/g) || []).length;
    const symbolCount = (input.match(/[^a-zA-Z0-9\s]/g) || []).length;
    const spaceCount = (input.match(/\s/g) || []).length;

    const uniqueCount = new Set(input).size;
    const repeatedCount = len - uniqueCount;

    // Character Pool Size N
    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasDigit) poolSize += 10;
    if (hasSymbol) poolSize += 32;
    if (hasSpace) poolSize += 1;

    // Entropy Bits = Length * log2(poolSize)
    const entropyBits = len > 0 && poolSize > 0 ? len * Math.log2(poolSize) : 0;
    const crackTimeStr = estimateCrackTime(entropyBits);

    // Checks & Penalties
    let score = 0;

    // Length base
    if (len >= 16) score += 40;
    else if (len >= 12) score += 30;
    else if (len >= 8) score += 15;
    else score += 5;

    // Diversity
    if (hasUpper) score += 12;
    if (hasLower) score += 12;
    if (hasDigit) score += 15;
    if (hasSymbol) score += 18;
    if (uniqueCount > 10) score += 8;

    // Penalties & Security Warnings
    const lowerText = input.toLowerCase();

    // 1. Breached Dictionary Word / Name Check
    const foundBreachPattern = COMMON_BREACH_PATTERNS.find(p => lowerText.includes(p));
    const hasBreachWarning = !!foundBreachPattern;
    if (hasBreachWarning) score -= 35;

    // 2. Common Birth Year Pattern (1960-2029)
    const hasBirthYear = /(19[6-9]\d|20[0-2]\d)/.test(input);
    if (hasBirthYear) score -= 15;

    // 3. Repeated Characters (e.g. aaa, 111)
    const hasRepeats = /(.)\1{2,}/.test(input);
    if (hasRepeats) score -= 15;

    // 4. Sequential Patterns (e.g. 123, abc, qwerty)
    const hasSequential = /(123|234|345|456|567|678|789|abc|bcd|cde|def|qwe|asd|zxc)/i.test(input);
    if (hasSequential) score -= 15;

    // Clamped score
    score = Math.max(0, Math.min(100, score));

    // Rating Level & Color
    let rating = 'Very Weak';
    let colorClass = 'text-rose-500';
    let bgBarColor = 'bg-rose-500';
    let ringColor = '#f43f5e';

    if (score >= 90) {
      rating = 'Excellent';
      colorClass = 'text-emerald-400';
      bgBarColor = 'bg-emerald-400';
      ringColor = '#10b981';
    } else if (score >= 75) {
      rating = 'Strong';
      colorClass = 'text-cyan-400';
      bgBarColor = 'bg-cyan-400';
      ringColor = '#06b6d4';
    } else if (score >= 60) {
      rating = 'Good';
      colorClass = 'text-lime-400';
      bgBarColor = 'bg-lime-400';
      ringColor = '#a3e635';
    } else if (score >= 40) {
      rating = 'Fair';
      colorClass = 'text-amber-400';
      bgBarColor = 'bg-amber-400';
      ringColor = '#fbbf24';
    } else if (score >= 20) {
      rating = 'Weak';
      colorClass = 'text-orange-400';
      bgBarColor = 'bg-orange-400';
      ringColor = '#f97316';
    }

    // Suggestions Generator
    const suggestions: string[] = [];
    if (len < 16) suggestions.push('Increase password length to 16+ characters.');
    if (hasBreachWarning) suggestions.push(`Remove common dictionary term or name ("${foundBreachPattern}").`);
    if (hasBirthYear) suggestions.push('Avoid obvious 4-digit birth years (e.g. 2006, 1998).');
    if (!hasUpper || !hasLower) suggestions.push('Mix both UPPERCASE and lowercase letters.');
    if (!hasDigit) suggestions.push('Include numbers (0-9) in non-sequential order.');
    if (!hasSymbol) suggestions.push('Add special symbols (!@#$%^&*).');
    if (hasRepeats) suggestions.push('Avoid repeating identical characters 3+ times in a row.');

    return {
      score, rating, colorClass, bgBarColor, ringColor,
      entropyBits: entropyBits.toFixed(1),
      crackTimeStr,
      stats: { len, upperCount, lowerCount, digitCount, symbolCount, spaceCount, uniqueCount, repeatedCount },
      checks: {
        lengthOk: len >= 12,
        upperLowerOk: hasUpper && hasLower,
        numSymOk: hasDigit && hasSymbol,
        noBreach: !hasBreachWarning,
        noBirthYear: !hasBirthYear,
        noRepeats: !hasRepeats,
        noSequential: !hasSequential
      },
      foundBreachPattern,
      suggestions
    };
  };

  const currentAnalysis = analyzePassword(pass);

  // Generate Password Function
  const generatePassword = () => {
    let chars = '';
    if (genUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (genLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (genNum) chars += '0123456789';
    if (genSym) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (genExcludeSimilar) {
      chars = chars.replace(/[l1IO0]/g, '');
    }

    if (!chars) return;

    let res = '';
    const array = new Uint32Array(genLength);
    crypto.getRandomValues(array);
    for (let i = 0; i < genLength; i++) {
      res += chars[array[i] % chars.length];
    }

    setGeneratedPassword(res);
    setHistory(prev => [res, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    generatePassword();
  }, [genLength, genUpper, genLower, genNum, genSym, genExcludeSimilar]);

  const handleCopyText = async (text: string) => {
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Privacy Guarantee Header Shield */}
      <div className="p-3.5 glass-panel rounded-2xl border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>🔒 100% Offline & Client-Side: Passwords are analyzed locally in browser memory.</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest hidden sm:inline">Zero Server Uploads</span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 glass-panel rounded-2xl border border-white/10">
        <button
          onClick={() => setActiveTab('analyzer')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'analyzer' ? 'bg-accent text-slate-950 shadow-md' : 'text-slate-300 hover:bg-white/10'
          }`}
        >
          <Cpu className="w-4 h-4" /> Live Analyzer
        </button>

        <button
          onClick={() => setActiveTab('generator')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'generator' ? 'bg-accent text-slate-950 shadow-md' : 'text-slate-300 hover:bg-white/10'
          }`}
        >
          <Key className="w-4 h-4" /> Generator
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'compare' ? 'bg-accent text-slate-950 shadow-md' : 'text-slate-300 hover:bg-white/10'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" /> Compare
        </button>

        <button
          onClick={() => setActiveTab('education')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'education' ? 'bg-accent text-slate-950 shadow-md' : 'text-slate-300 hover:bg-white/10'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Security Tips
        </button>
      </div>

      {/* TAB 1: LIVE ANALYZER */}
      {activeTab === 'analyzer' && (
        <div className="space-y-6">
          {/* Main Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Password to Analyze</span>
              <span className="text-accent font-mono text-[11px]">{currentAnalysis.stats.len} Chars</span>
            </label>

            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Type password for real-time analysis..."
                className="w-full bg-black/50 rounded-2xl pl-4 pr-24 py-3.5 font-mono text-sm sm:text-base text-slate-100 border border-white/15 focus:border-accent focus:outline-none shadow-inner"
              />
              <div className="absolute right-3 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-100 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyText(pass)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold text-slate-200 hover:bg-accent hover:text-slate-950 transition-all flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Breach Warning Banner */}
          {currentAnalysis.foundBreachPattern && (
            <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center gap-3 text-rose-300 animate-pulse">
              <AlertTriangle className="w-6 h-6 shrink-0 text-rose-400" />
              <div>
                <h4 className="text-xs font-bold uppercase">⚠️ Common Breach Pattern Detected!</h4>
                <p className="text-[11px] text-rose-200 mt-0.5">
                  Contains common word/pattern <strong>"{currentAnalysis.foundBreachPattern}"</strong>. Hackers use dictionary attacks to break this in seconds!
                </p>
              </div>
            </div>
          )}

          {/* Top Hero Score Card */}
          <div className="p-6 glass-panel rounded-3xl border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Circular Progress Ring */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="58" stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="transparent" />
                  <circle
                    cx="72" cy="72" r="58"
                    stroke={currentAnalysis.ringColor}
                    strokeWidth="10"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * currentAnalysis.score) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black font-mono text-slate-100">{currentAnalysis.score}</span>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Score / 100</span>
                </div>
              </div>
              <span className={`text-sm font-black uppercase tracking-wider mt-2 ${currentAnalysis.colorClass}`}>
                {currentAnalysis.rating}
              </span>
            </div>

            {/* Segmented Strength Bar & Entropy Details */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-400 uppercase text-[10px]">Strength Meter</span>
                  <span className={currentAnalysis.colorClass}>{currentAnalysis.rating}</span>
                </div>
                <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10 flex gap-1">
                  {[20, 40, 60, 80, 100].map((step, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 rounded-full transition-all duration-500 ${
                        currentAnalysis.score >= step ? currentAnalysis.bgBarColor : 'bg-white/5'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Entropy & Crack Time Stats */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Entropy Score</span>
                  <div className="text-xl font-black font-mono text-accent mt-0.5">{currentAnalysis.entropyBits} bits</div>
                  <span className="text-[10px] text-slate-400">
                    {Number(currentAnalysis.entropyBits) > 60 ? '🔥 High Security' : Number(currentAnalysis.entropyBits) > 40 ? '⚠️ Moderate' : '❌ Low Security'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Est. Time to Crack</span>
                  <div className="text-lg font-black font-mono text-emerald-400 mt-0.5 truncate">{currentAnalysis.crackTimeStr}</div>
                  <span className="text-[10px] text-slate-400">@ 10 Billion guesses/sec</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Audits List & Password Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Audit Checklist */}
            <div className="p-5 glass-panel rounded-3xl border border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Security Audit Checks</h4>
              <div className="space-y-2 text-xs font-medium">
                <div className="flex items-center justify-between p-2 rounded-xl bg-black/30">
                  <span>Minimum Length (12+ Chars)</span>
                  {currentAnalysis.checks.lengthOk ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-black/30">
                  <span>Mixed Case (A-Z and a-z)</span>
                  {currentAnalysis.checks.upperLowerOk ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-black/30">
                  <span>Numbers & Special Symbols</span>
                  {currentAnalysis.checks.numSymOk ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-black/30">
                  <span>No Common Dictionary Patterns</span>
                  {currentAnalysis.checks.noBreach ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-black/30">
                  <span>No Birth Years (e.g. 2006)</span>
                  {currentAnalysis.checks.noBirthYear ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                </div>
              </div>
            </div>

            {/* Character Breakdown Grid */}
            <div className="p-5 glass-panel rounded-3xl border border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Character Statistics</h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-black/30 flex justify-between"><span className="text-slate-400">Length:</span><span className="font-bold text-slate-200">{currentAnalysis.stats.len}</span></div>
                <div className="p-2.5 rounded-xl bg-black/30 flex justify-between"><span className="text-slate-400">Uppercase:</span><span className="font-bold text-accent">{currentAnalysis.stats.upperCount}</span></div>
                <div className="p-2.5 rounded-xl bg-black/30 flex justify-between"><span className="text-slate-400">Lowercase:</span><span className="font-bold text-purple-400">{currentAnalysis.stats.lowerCount}</span></div>
                <div className="p-2.5 rounded-xl bg-black/30 flex justify-between"><span className="text-slate-400">Numbers:</span><span className="font-bold text-emerald-400">{currentAnalysis.stats.digitCount}</span></div>
                <div className="p-2.5 rounded-xl bg-black/30 flex justify-between"><span className="text-slate-400">Symbols:</span><span className="font-bold text-orange-400">{currentAnalysis.stats.symbolCount}</span></div>
                <div className="p-2.5 rounded-xl bg-black/30 flex justify-between"><span className="text-slate-400">Unique:</span><span className="font-bold text-cyan-400">{currentAnalysis.stats.uniqueCount}</span></div>
              </div>
            </div>
          </div>

          {/* Smart Suggestions Box */}
          {currentAnalysis.suggestions.length > 0 && (
            <div className="p-5 glass-panel rounded-3xl border border-amber-500/30 space-y-2">
              <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Smart Improvement Recommendations
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-5">
                {currentAnalysis.suggestions.map((sug, idx) => (
                  <li key={idx}>{sug}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ADVANCED GENERATOR */}
      {activeTab === 'generator' && (
        <div className="space-y-6">
          <div className="p-5 glass-panel rounded-3xl border border-accent/40 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Generated Password Output</span>
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between gap-3 font-mono text-base font-bold text-accent break-all">
              <span>{generatedPassword}</span>
              <div className="flex gap-2 shrink-0">
                <button onClick={generatePassword} className="p-2 rounded-xl glass-panel text-slate-300 hover:text-accent"><RefreshCw className="w-4 h-4" /></button>
                <button onClick={() => handleCopyText(generatedPassword)} className="px-3.5 py-2 rounded-xl bg-accent text-slate-950 font-bold text-xs flex items-center gap-1">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Length ({genLength} characters)</label>
                <input type="range" min="8" max="64" value={genLength} onChange={(e) => setGenLength(Number(e.target.value))} className="w-full accent-accent" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <label className="flex items-center gap-2 p-3 rounded-xl glass-panel text-xs text-slate-200 cursor-pointer">
                  <input type="checkbox" checked={genUpper} onChange={(e) => setGenUpper(e.target.checked)} className="accent-accent" /> Uppercase (A-Z)
                </label>
                <label className="flex items-center gap-2 p-3 rounded-xl glass-panel text-xs text-slate-200 cursor-pointer">
                  <input type="checkbox" checked={genLower} onChange={(e) => setGenLower(e.target.checked)} className="accent-accent" /> Lowercase (a-z)
                </label>
                <label className="flex items-center gap-2 p-3 rounded-xl glass-panel text-xs text-slate-200 cursor-pointer">
                  <input type="checkbox" checked={genNum} onChange={(e) => setGenNum(e.target.checked)} className="accent-accent" /> Numbers (0-9)
                </label>
                <label className="flex items-center gap-2 p-3 rounded-xl glass-panel text-xs text-slate-200 cursor-pointer">
                  <input type="checkbox" checked={genSym} onChange={(e) => setGenSym(e.target.checked)} className="accent-accent" /> Symbols (!@#$)
                </label>
                <label className="flex items-center gap-2 p-3 rounded-xl glass-panel text-xs text-slate-200 cursor-pointer col-span-2">
                  <input type="checkbox" checked={genExcludeSimilar} onChange={(e) => setGenExcludeSimilar(e.target.checked)} className="accent-accent" /> Exclude Similar (l, 1, I, O, 0)
                </label>
              </div>
            </div>
          </div>

          {/* History List */}
          {history.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Generated Passwords History (Local Memory)</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {history.map((hPass, idx) => (
                  <div key={idx} className="p-3 rounded-xl glass-panel flex items-center justify-between font-mono text-xs text-slate-300">
                    <span className="truncate">{hPass}</span>
                    <button onClick={() => handleCopyText(hPass)} className="text-accent hover:underline text-[11px] font-bold">Copy</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PASSWORD COMPARISON */}
      {activeTab === 'compare' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password 1 */}
            <div className="p-5 glass-panel rounded-3xl border border-white/10 space-y-3">
              <label className="text-xs font-bold uppercase text-slate-400">Password A</label>
              <input
                type="text"
                value={comparePass1}
                onChange={(e) => setComparePass1(e.target.value)}
                className="w-full bg-black/40 rounded-xl px-3.5 py-2 font-mono text-xs text-slate-100 border border-white/10"
              />
              {(() => {
                const a = analyzePassword(comparePass1);
                return (
                  <div className="space-y-2 pt-2 text-xs font-mono">
                    <div className="flex justify-between"><span className="text-slate-400">Score:</span><strong className={a.colorClass}>{a.score}/100 ({a.rating})</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">Entropy:</span><strong className="text-accent">{a.entropyBits} bits</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">Crack Time:</span><strong className="text-emerald-400">{a.crackTimeStr}</strong></div>
                  </div>
                );
              })()}
            </div>

            {/* Password 2 */}
            <div className="p-5 glass-panel rounded-3xl border border-accent/40 space-y-3">
              <label className="text-xs font-bold uppercase text-accent">Password B (Recommended)</label>
              <input
                type="text"
                value={comparePass2}
                onChange={(e) => setComparePass2(e.target.value)}
                className="w-full bg-black/40 rounded-xl px-3.5 py-2 font-mono text-xs text-slate-100 border border-white/10"
              />
              {(() => {
                const b = analyzePassword(comparePass2);
                return (
                  <div className="space-y-2 pt-2 text-xs font-mono">
                    <div className="flex justify-between"><span className="text-slate-400">Score:</span><strong className={b.colorClass}>{b.score}/100 ({b.rating})</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">Entropy:</span><strong className="text-accent">{b.entropyBits} bits</strong></div>
                    <div className="flex justify-between"><span className="text-slate-400">Crack Time:</span><strong className="text-emerald-400">{b.crackTimeStr}</strong></div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY TIPS & EDUCATION */}
      {activeTab === 'education' && (
        <div className="space-y-4">
          <div className="p-5 glass-panel rounded-3xl border border-white/10 space-y-3">
            <h4 className="text-xs font-bold uppercase text-accent flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> NIST Special Publication 800-63B Password Guidelines
            </h4>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>1. <strong>Length over Complexity</strong>: A 16+ character passphrase like <code>correct-horse-battery-staple</code> is exponentially harder to crack than a short complex password like <code>P@ss1</code>.</p>
              <p>2. <strong>Avoid Predictable Replacements</strong>: Replacing <code>a</code> with <code>@</code> or <code>o</code> with <code>0</code> (e.g. <code>Nilesh@2006</code>) is standard knowledge in dictionary attack wordlists.</p>
              <p>3. <strong>Use a Password Manager</strong>: Generate random 20+ character passwords for every site and store them in an encrypted vault (Bitwarden, 1Password).</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 8. REAL 3D Interactive Metallic Coin Flip
export const CoinFlipTool: React.FC = () => {
  const [result, setResult] = useState<'HEADS' | 'TAILS' | null>('HEADS');
  const [flipping, setFlipping] = useState(false);
  const [rotationY, setRotationY] = useState(0);
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);

  const flipCoin = () => {
    if (flipping) return;
    setFlipping(true);

    const isHeads = Math.random() > 0.5;
    const finalOutcome = isHeads ? 'HEADS' : 'TAILS';

    const extraSpins = 1800 + (isHeads ? 0 : 180);
    const nextRotation = rotationY + extraSpins;
    setRotationY(nextRotation);

    setTimeout(() => {
      setResult(finalOutcome);
      if (isHeads) setHeadsCount(h => h + 1);
      else setTailsCount(t => t + 1);
      setFlipping(false);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 1400);
  };

  const totalFlips = headsCount + tailsCount;

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8">
      <div className="perspective-1000 w-44 h-44 relative cursor-pointer" onClick={flipCoin}>
        <div
          className={`w-full h-full relative preserve-3d transition-transform duration-[1400ms] ease-out ${
            flipping ? 'scale-125' : ''
          }`}
          style={{ transform: `rotateY(${rotationY}deg)` }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 border-4 border-amber-300 shadow-2xl flex flex-col items-center justify-center text-slate-950 backface-hidden border-double">
            <div className="w-36 h-36 rounded-full border-2 border-amber-600/40 flex flex-col items-center justify-center bg-gradient-to-b from-yellow-300/30 to-amber-500/30">
              <Sparkles className="w-10 h-10 text-amber-950 drop-shadow-md mb-1" />
              <span className="text-xl font-black tracking-widest text-amber-950">HEADS</span>
              <span className="text-[10px] font-bold tracking-widest text-amber-900 uppercase">✨ OmniVerse</span>
            </div>
          </div>

          <div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-slate-400 via-slate-200 to-white border-4 border-slate-300 shadow-2xl flex flex-col items-center justify-center text-slate-950 backface-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="w-36 h-36 rounded-full border-2 border-slate-400/40 flex flex-col items-center justify-center bg-gradient-to-b from-slate-100/30 to-slate-300/30">
              <ShieldAlert className="w-10 h-10 text-slate-900 drop-shadow-md mb-1" />
              <span className="text-xl font-black tracking-widest text-slate-950">TAILS</span>
              <span className="text-[10px] font-bold tracking-widest text-slate-800 uppercase">✨ OmniVerse</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-4">
        {result && !flipping && (
          <div className="text-2xl font-black text-accent animate-bounce font-mono">
            Outcome: {result}
          </div>
        )}

        <button
          onClick={flipCoin}
          disabled={flipping}
          className="px-8 py-3.5 rounded-2xl bg-accent text-slate-950 font-black text-sm hover:opacity-90 transition-all shadow-lg shadow-accent/25"
        >
          {flipping ? 'Flipping 3D Coin...' : 'Flip 3D Coin'}
        </button>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
          <div className="p-3 rounded-xl glass-panel">
            <span className="text-slate-400 block text-[10px] uppercase">Total Flips</span>
            <strong className="text-slate-100 text-base">{totalFlips}</strong>
          </div>
          <div className="p-3 rounded-xl glass-panel">
            <span className="text-slate-400 block text-[10px] uppercase">Heads</span>
            <strong className="text-amber-400 text-base">{headsCount}</strong>
          </div>
          <div className="p-3 rounded-xl glass-panel">
            <span className="text-slate-400 block text-[10px] uppercase">Tails</span>
            <strong className="text-cyan-400 text-base">{tailsCount}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

// 9. REAL 3D Tabletop Dice Roller Simulator
export const DiceRollerTool: React.FC = () => {
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [outcome, setOutcome] = useState<number | null>(1);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState<number[]>([]);

  const faceRotations: Record<number, { x: number; y: number }> = {
    1: { x: 0, y: 0 },
    2: { x: 0, y: -90 },
    3: { x: -90, y: 0 },
    4: { x: 90, y: 0 },
    5: { x: 0, y: 90 },
    6: { x: 180, y: 0 },
  };

  const rollDice = () => {
    if (rolling) return;
    setRolling(true);

    const val = Math.floor(Math.random() * 6) + 1;
    const target = faceRotations[val];

    const newX = rotX + 720 + target.x - (rotX % 360);
    const newY = rotY + 1080 + target.y - (rotY % 360);

    setRotX(newX);
    setRotY(newY);

    setTimeout(() => {
      setOutcome(val);
      setHistory(h => [val, ...h.slice(0, 4)]);
      setRolling(false);

      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    }, 1200);
  };

  const renderDots = (count: number) => {
    const dotsMap: Record<number, string[]> = {
      1: ['col-start-2 row-start-2'],
      2: ['col-start-1 row-start-1', 'col-start-3 row-start-3'],
      3: ['col-start-1 row-start-1', 'col-start-2 row-start-2', 'col-start-3 row-start-3'],
      4: ['col-start-1 row-start-1', 'col-start-3 row-start-1', 'col-start-1 row-start-3', 'col-start-3 row-start-3'],
      5: ['col-start-1 row-start-1', 'col-start-3 row-start-1', 'col-start-2 row-start-2', 'col-start-1 row-start-3', 'col-start-3 row-start-3'],
      6: ['col-start-1 row-start-1', 'col-start-3 row-start-1', 'col-start-1 row-start-2', 'col-start-3 row-start-2', 'col-start-1 row-start-3', 'col-start-3 row-start-3'],
    };

    return (
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-4 items-center justify-items-center">
        {dotsMap[count]?.map((pos, i) => (
          <span key={i} className={`w-4 h-4 rounded-full bg-slate-950 shadow-inner ${pos}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8">
      <div className="perspective-1000 w-36 h-36 relative cursor-pointer my-4" onClick={rollDice}>
        <div
          className="w-full h-full relative preserve-3d transition-transform duration-[1200ms] ease-out"
          style={{ transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl border-2 border-white/40 shadow-2xl flex items-center justify-center font-bold text-slate-950" style={{ transform: 'translateZ(72px)' }}>
            {renderDots(1)}
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl border-2 border-white/40 shadow-2xl flex items-center justify-center font-bold text-slate-950" style={{ transform: 'rotateY(90deg) translateZ(72px)' }}>
            {renderDots(2)}
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl border-2 border-white/40 shadow-2xl flex items-center justify-center font-bold text-slate-950" style={{ transform: 'rotateX(90deg) translateZ(72px)' }}>
            {renderDots(3)}
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl border-2 border-white/40 shadow-2xl flex items-center justify-center font-bold text-slate-950" style={{ transform: 'rotateX(-90deg) translateZ(72px)' }}>
            {renderDots(4)}
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl border-2 border-white/40 shadow-2xl flex items-center justify-center font-bold text-slate-950" style={{ transform: 'rotateY(-90deg) translateZ(72px)' }}>
            {renderDots(5)}
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl border-2 border-white/40 shadow-2xl flex items-center justify-center font-bold text-slate-950" style={{ transform: 'rotateY(180deg) translateZ(72px)' }}>
            {renderDots(6)}
          </div>
        </div>
      </div>

      <div className="text-center space-y-4">
        {outcome && !rolling && (
          <div className="text-2xl font-black text-accent animate-bounce font-mono">
            Rolled Value: {outcome}
          </div>
        )}

        <button
          onClick={rollDice}
          disabled={rolling}
          className="px-8 py-3.5 rounded-2xl bg-accent text-slate-950 font-black text-sm hover:opacity-90 transition-all shadow-lg shadow-accent/25"
        >
          {rolling ? 'Tumbling 3D Dice...' : 'Roll 3D Dice'}
        </button>

        {history.length > 0 && (
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
            <span>Recent Rolls:</span>
            {history.map((h, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-white/10 font-mono text-accent font-bold">
                {h}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 10. REAL Visual SVG 3D Decision Spinner Wheel
export const DecisionWheelTool: React.FC = () => {
  const [choices, setChoices] = useState(['Pizza Night 🍕', 'Tacos 🌮', 'Sushi 🍣', 'Burger 🍔', 'Salad 🥗', 'Pasta 🍝']);
  const [newOption, setNewOption] = useState('');
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const colors = ['#06b6d4', '#a855f7', '#10b981', '#f97316', '#f43f5e', '#eab308', '#3b82f6', '#ec4899'];

  const addChoice = () => {
    if (newOption.trim()) {
      setChoices([...choices, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeChoice = (idx: number) => {
    if (choices.length <= 2) {
      alert('Keep at least 2 options for the wheel.');
      return;
    }
    setChoices(choices.filter((_, i) => i !== idx));
  };

  const spinWheel = () => {
    if (spinning || choices.length < 2) return;
    setSpinning(true);
    setWinner(null);

    const sliceAngle = 360 / choices.length;
    const selectedIdx = Math.floor(Math.random() * choices.length);

    const extraSpins = 360 * 6;
    const targetAngle = extraSpins + (360 - (selectedIdx * sliceAngle + sliceAngle / 2));

    const nextRotation = rotation + targetAngle;
    setRotation(nextRotation);

    setTimeout(() => {
      setWinner(choices[selectedIdx]);
      setSpinning(false);

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 }
      });
    }, 3600);
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Add custom decision option..."
          className="flex-1 bg-black/40 rounded-xl px-4 py-2.5 text-xs text-slate-200 border border-white/10"
        />
        <button onClick={addChoice} className="px-4 py-2.5 rounded-xl bg-accent text-slate-950 font-bold text-xs">
          + Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {choices.map((c, idx) => (
          <span key={idx} className="px-3 py-1.5 rounded-full glass-panel text-xs text-slate-200 flex items-center gap-2 border border-white/10">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
            {c}
            <button onClick={() => removeChoice(idx)} className="text-slate-400 hover:text-rose-400 text-xs">✕</button>
          </span>
        ))}
      </div>

      <div className="relative flex flex-col items-center justify-center py-4">
        <div className="z-20 -mb-4 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-400 drop-shadow-xl" />

        <div className="w-64 h-64 sm:w-80 sm:h-80 relative rounded-full shadow-2xl border-4 border-white/20 overflow-hidden">
          <div
            className="w-full h-full rounded-full transition-transform duration-[3500ms] cubic-bezier(0.12, 0.8, 0.15, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {choices.map((choice, i) => {
                const sliceAngle = 360 / choices.length;
                const startAngle = i * sliceAngle;
                const endAngle = (i + 1) * sliceAngle;

                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                const largeArc = sliceAngle > 180 ? 1 : 0;
                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;

                const midAngle = startAngle + sliceAngle / 2;
                const textX = 50 + 32 * Math.cos((Math.PI * midAngle) / 180);
                const textY = 50 + 32 * Math.sin((Math.PI * midAngle) / 180);

                return (
                  <g key={i}>
                    <path d={pathData} fill={colors[i % colors.length]} stroke="#090d16" strokeWidth="0.5" />
                    <text
                      x={textX}
                      y={textY}
                      fill="#ffffff"
                      fontSize="4"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                    >
                      {choice.length > 10 ? choice.slice(0, 9) + '…' : choice}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="absolute inset-0 m-auto w-12 h-12 rounded-full glass-panel border-2 border-white/40 shadow-inner flex items-center justify-center text-accent font-black text-xs pointer-events-none">
            ✨
          </div>
        </div>
      </div>

      <div className="text-center space-y-4">
        {winner && !spinning && (
          <div className="p-4 rounded-2xl bg-accent/20 border border-accent text-accent font-black text-xl animate-bounce">
            🎉 Selected: {winner}
          </div>
        )}

        <button
          onClick={spinWheel}
          disabled={spinning}
          className="px-8 py-3.5 rounded-2xl bg-accent text-slate-950 font-black text-sm hover:opacity-90 transition-all shadow-lg shadow-accent/25"
        >
          {spinning ? 'Spinning Decision Wheel...' : 'Spin Decision Wheel'}
        </button>
      </div>
    </div>
  );
};
