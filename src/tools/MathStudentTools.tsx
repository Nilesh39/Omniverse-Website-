import React, { useState } from 'react';
import { Calculator, GraduationCap, UserCheck, Percent, Divide, BarChart2, Binary, Plus, Trash2 } from 'lucide-react';

// 1. Scientific Calculator
export const ScientificCalculatorTool: React.FC = () => {
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState('0');

  const append = (val: string) => setExpr(prev => prev + val);
  const clear = () => { setExpr(''); setResult('0'); };
  const backspace = () => setExpr(prev => prev.slice(0, -1));

  const evaluate = () => {
    try {
      let sanitized = expr
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/log/g, 'Math.log10')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/×/g, '*')
        .replace(/÷/g, '/');

      // eslint-disable-next-line no-eval
      const res = Function(`"use strict"; return (${sanitized})`)();
      setResult(String(res));
    } catch {
      setResult('Syntax Error');
    }
  };

  const keys = [
    'sin', 'cos', 'tan', 'sqrt',
    'log', 'π', 'e', '(',
    ')', '^', '÷', '×',
    '7', '8', '9', '-',
    '4', '5', '6', '+',
    '1', '2', '3', '=',
    'C', '0', '.', '⌫'
  ];

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="bg-black/50 rounded-2xl p-4 border border-white/10 text-right">
        <div className="text-xs font-mono text-slate-400 h-6 overflow-hidden">{expr || '0'}</div>
        <div className="text-3xl font-mono font-bold text-accent mt-1">{result}</div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {keys.map(k => (
          <button
            key={k}
            onClick={() => {
              if (k === '=') evaluate();
              else if (k === 'C') clear();
              else if (k === '⌫') backspace();
              else if (['sin', 'cos', 'tan', 'sqrt', 'log'].includes(k)) append(`${k}(`);
              else append(k);
            }}
            className={`p-3 rounded-xl text-xs font-bold font-mono transition-all ${
              k === '='
                ? 'bg-accent text-slate-950 col-span-1 shadow-lg shadow-accent/20'
                : k === 'C'
                ? 'bg-rose-500/20 text-rose-400'
                : ['÷', '×', '-', '+'].includes(k)
                ? 'bg-accent/20 text-accent'
                : 'glass-panel text-slate-200 hover:bg-white/15'
            }`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
};

// Helper: Convert percentage marks (0-100) to 10-point scale grade point
function marksToGradePoint(marks: number): number {
  if (isNaN(marks) || marks < 0) return 0;
  if (marks > 100) return 10;
  if (marks >= 90) return 10;
  if (marks >= 80) return 9;
  if (marks >= 70) return 8;
  if (marks >= 60) return 7;
  if (marks >= 50) return 6;
  if (marks >= 40) return 5;
  return 0; // Fail (<40)
}

// 2. CGPA & GPA Calculator
export const CgpaCalculatorTool: React.FC = () => {
  const [inputMode, setInputMode] = useState<'marks' | 'gradepoint' | 'letter'>('marks');
  const [courses, setCourses] = useState([
    { name: 'Mathematics', credits: 4, markValue: '85', letter: 'A+' },
    { name: 'Physics', credits: 3, markValue: '75', letter: 'A' },
    { name: 'Computer Science', credits: 4, markValue: '92', letter: 'O' },
    { name: 'AI & Data Science', credits: 3, markValue: '68', letter: 'B+' },
  ]);

  const addCourse = () => {
    setCourses([...courses, { name: `Subject ${courses.length + 1}`, credits: 3, markValue: '70', letter: 'A' }]);
  };

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const updateCourse = (index: number, field: string, value: any) => {
    const updated = [...courses];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updated[index] as any)[field] = value;
    setCourses(updated);
  };

  // Helper to compute grade point for a row
  const getRowGradePoint = (c: typeof courses[0]): number => {
    if (inputMode === 'marks') {
      const num = parseFloat(c.markValue);
      return isNaN(num) ? 0 : marksToGradePoint(num);
    } else if (inputMode === 'gradepoint') {
      const num = parseFloat(c.markValue);
      return isNaN(num) ? 0 : Math.min(10, Math.max(0, num));
    } else {
      switch (c.letter) {
        case 'O': return 10;
        case 'A+': return 9;
        case 'A': return 8;
        case 'B+': return 7;
        case 'B': return 6;
        case 'C': return 5;
        case 'P': return 4;
        case 'F': return 0;
        default: return 0;
      }
    }
  };

  const totalCredits = courses.reduce((acc, c) => acc + Math.max(1, Number(c.credits) || 1), 0);
  const totalWeightedPoints = courses.reduce((acc, c) => {
    const cr = Math.max(1, Number(c.credits) || 1);
    const gp = getRowGradePoint(c);
    return acc + (cr * gp);
  }, 0);

  const cgpaNum = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
  const cgpa = cgpaNum.toFixed(2);
  const percentageEq = (cgpaNum * 9.5).toFixed(1); // Standard CBSE / UGC formula

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 glass-panel rounded-2xl border border-white/10">
        <span className="text-xs font-bold text-slate-300">Grade Input Mode:</span>
        <div className="flex gap-2">
          <button
            onClick={() => setInputMode('marks')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              inputMode === 'marks' ? 'bg-accent text-slate-950 shadow-md' : 'glass-panel text-slate-300 hover:bg-white/10'
            }`}
          >
            Marks % (0-100)
          </button>
          <button
            onClick={() => setInputMode('gradepoint')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              inputMode === 'gradepoint' ? 'bg-accent text-slate-950 shadow-md' : 'glass-panel text-slate-300 hover:bg-white/10'
            }`}
          >
            Grade Points (0-10)
          </button>
          <button
            onClick={() => setInputMode('letter')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              inputMode === 'letter' ? 'bg-accent text-slate-950 shadow-md' : 'glass-panel text-slate-300 hover:bg-white/10'
            }`}
          >
            Letter Grade (O, A+, A...)
          </button>
        </div>
      </div>

      {/* Results Header Card */}
      <div className="p-6 glass-panel rounded-3xl border border-accent/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cumulative GPA (CGPA)</span>
          <h2 className="text-4xl font-black text-accent font-mono my-1">{cgpa} <span className="text-sm font-normal text-slate-400">/ 10</span></h2>
          <span className="text-[10px] text-slate-400">Weighted Average</span>
        </div>

        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Credit Hours</span>
          <h2 className="text-4xl font-black text-purple-400 font-mono my-1">{totalCredits}</h2>
          <span className="text-[10px] text-slate-400">Sum of Course Credits</span>
        </div>

        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Percentage Equivalent</span>
          <h2 className="text-4xl font-black text-emerald-400 font-mono my-1">{percentageEq}%</h2>
          <span className="text-[10px] text-slate-400">UGC Formula (CGPA × 9.5)</span>
        </div>
      </div>

      {/* Course Entry Table */}
      <div className="space-y-3">
        <div className="hidden sm:grid grid-cols-12 gap-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span className="col-span-5">Subject / Course Name</span>
          <span className="col-span-3 text-center">Credits</span>
          <span className="col-span-3 text-center">
            {inputMode === 'marks' ? 'Marks % (0-100)' : inputMode === 'gradepoint' ? 'Grade Point (0-10)' : 'Letter Grade'}
          </span>
          <span className="col-span-1 text-right">GP</span>
        </div>

        {courses.map((c, idx) => {
          const rowGP = getRowGradePoint(c);
          return (
            <div key={idx} className="p-3 sm:p-4 rounded-2xl glass-panel grid grid-cols-1 sm:grid-cols-12 gap-3 items-center border border-white/10 hover:border-white/20 transition-all">
              <div className="sm:col-span-5">
                <label className="sm:hidden text-[10px] font-bold text-slate-400 block mb-1">Subject Name</label>
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => updateCourse(idx, 'name', e.target.value)}
                  className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 border border-white/10 focus:border-accent focus:outline-none"
                  placeholder="Subject Name"
                />
              </div>

              {/* Credits with +/- Stepper */}
              <div className="sm:col-span-3">
                <label className="sm:hidden text-[10px] font-bold text-slate-400 block mb-1">Credits</label>
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => updateCourse(idx, 'credits', Math.max(1, (Number(c.credits) || 1) - 1))}
                    className="w-7 h-7 rounded-lg glass-panel text-slate-300 font-bold text-xs hover:bg-white/15"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={c.credits}
                    onChange={(e) => updateCourse(idx, 'credits', Math.max(1, Number(e.target.value) || 1))}
                    className="w-14 bg-black/40 text-center rounded-lg px-2 py-1 font-mono text-xs font-bold text-slate-100 border border-white/10"
                  />
                  <button
                    onClick={() => updateCourse(idx, 'credits', (Number(c.credits) || 1) + 1)}
                    className="w-7 h-7 rounded-lg glass-panel text-slate-300 font-bold text-xs hover:bg-white/15"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Grade / Marks Input */}
              <div className="sm:col-span-3">
                <label className="sm:hidden text-[10px] font-bold text-slate-400 block mb-1">Score / Grade</label>
                {inputMode === 'marks' && (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={c.markValue}
                    onChange={(e) => updateCourse(idx, 'markValue', e.target.value)}
                    className="w-full bg-black/40 rounded-xl px-3 py-2 font-mono text-xs text-accent font-bold text-center border border-white/10 focus:border-accent focus:outline-none"
                    placeholder="Marks % (0-100)"
                  />
                )}

                {inputMode === 'gradepoint' && (
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={c.markValue}
                    onChange={(e) => updateCourse(idx, 'markValue', e.target.value)}
                    className="w-full bg-black/40 rounded-xl px-3 py-2 font-mono text-xs text-accent font-bold text-center border border-white/10 focus:border-accent focus:outline-none"
                    placeholder="GP (0-10)"
                  />
                )}

                {inputMode === 'letter' && (
                  <select
                    value={c.letter}
                    onChange={(e) => updateCourse(idx, 'letter', e.target.value)}
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs font-bold text-accent text-center border border-white/10 focus:border-accent focus:outline-none"
                  >
                    <option value="O">O (Outstanding - 10)</option>
                    <option value="A+">A+ (Excellent - 9)</option>
                    <option value="A">A (Very Good - 8)</option>
                    <option value="B+">B+ (Good - 7)</option>
                    <option value="B">B (Above Avg - 6)</option>
                    <option value="C">C (Average - 5)</option>
                    <option value="P">P (Pass - 4)</option>
                    <option value="F">F (Fail - 0)</option>
                  </select>
                )}
              </div>

              {/* Calculated Grade Point Badge & Delete */}
              <div className="sm:col-span-1 flex items-center justify-between sm:justify-end gap-3">
                <span className="font-mono text-xs font-bold text-accent bg-accent/15 px-2.5 py-1 rounded-lg border border-accent/30">
                  {rowGP.toFixed(1)}
                </span>
                <button
                  onClick={() => removeCourse(idx)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Remove Course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={addCourse}
        className="w-full py-3 rounded-2xl glass-panel text-accent font-bold text-xs hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border border-accent/30"
      >
        <Plus className="w-4 h-4" /> Add Subject Course
      </button>

      {/* Standard Grading Table Reference */}
      <div className="p-4 glass-panel rounded-2xl border border-white/10 text-xs text-slate-400 space-y-2">
        <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">UGC 10-Point Grading Scale Reference</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
          <div>90-100% ➜ <strong>10.0 (O)</strong></div>
          <div>80-89% ➜ <strong>9.0 (A+)</strong></div>
          <div>70-79% ➜ <strong>8.0 (A)</strong></div>
          <div>60-69% ➜ <strong>7.0 (B+)</strong></div>
          <div>50-59% ➜ <strong>6.0 (B)</strong></div>
          <div>40-49% ➜ <strong>5.0 (C)</strong></div>
          <div>&lt;40% ➜ <strong className="text-rose-400">0.0 (F)</strong></div>
        </div>
      </div>
    </div>
  );
};

// 3. Attendance Percentage Tracker
export const AttendanceCalculatorTool: React.FC = () => {
  const [attended, setAttended] = useState(38);
  const [total, setTotal] = useState(45);
  const [targetPct, setTargetPct] = useState(75);

  const currentPct = total > 0 ? ((attended / total) * 100).toFixed(1) : '0';

  let statusMsg = '';
  if (Number(currentPct) >= targetPct) {
    const maxBunks = Math.floor((attended - (targetPct / 100) * total) / (targetPct / 100));
    statusMsg = `🎉 You can safely bunk ${Math.max(0, maxBunks)} more classes while staying above ${targetPct}%.`;
  } else {
    const needed = Math.ceil(((targetPct / 100) * total - attended) / (1 - targetPct / 100));
    statusMsg = `⚠️ You need to attend ${Math.max(0, needed)} consecutive classes to reach ${targetPct}%.`;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Classes Attended</label>
          <input
            type="number"
            value={attended}
            onChange={(e) => setAttended(Number(e.target.value))}
            className="w-full bg-black/40 rounded-xl px-4 py-2 text-xs font-bold text-slate-100 border border-white/10"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Total Classes Held</label>
          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
            className="w-full bg-black/40 rounded-xl px-4 py-2 text-xs font-bold text-slate-100 border border-white/10"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Target Percentage %</label>
          <input
            type="number"
            value={targetPct}
            onChange={(e) => setTargetPct(Number(e.target.value))}
            className="w-full bg-black/40 rounded-xl px-4 py-2 text-xs font-bold text-accent border border-white/10"
          />
        </div>
      </div>

      <div className="p-6 glass-panel rounded-2xl border border-white/10 text-center">
        <span className="text-xs font-bold uppercase text-slate-400">Current Attendance</span>
        <h2 className="text-4xl font-black text-accent my-1">{currentPct}%</h2>
        <p className="text-xs font-medium text-slate-300 mt-2">{statusMsg}</p>
      </div>
    </div>
  );
};

// 4. Percentage & Change Calculator
export const PercentageCalculatorTool: React.FC = () => {
  const [val, setVal] = useState(250);
  const [pct, setPct] = useState(15);
  const [orig, setOrig] = useState(100);
  const [nextVal, setNextVal] = useState(125);

  const pctResult = (val * pct) / 100;
  const pctChange = orig > 0 ? (((nextVal - orig) / orig) * 100).toFixed(2) : '0';

  return (
    <div className="space-y-6">
      <div className="p-5 glass-panel rounded-2xl border border-white/10 space-y-3">
        <h3 className="text-xs font-bold uppercase text-accent">Calculate X% of Y</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Percentage (%)</label>
            <input type="number" value={pct} onChange={(e) => setPct(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 border border-white/10" />
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Total Value</label>
            <input type="number" value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 border border-white/10" />
          </div>
        </div>
        <div className="p-3 bg-black/30 rounded-xl text-center">
          <span className="text-xs text-slate-400">{pct}% of {val} = </span>
          <strong className="text-xl font-bold text-accent font-mono ml-2">{pctResult}</strong>
        </div>
      </div>

      <div className="p-5 glass-panel rounded-2xl border border-white/10 space-y-3">
        <h3 className="text-xs font-bold uppercase text-purple-400">Percentage Change (Increase / Decrease)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Original Value</label>
            <input type="number" value={orig} onChange={(e) => setOrig(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 border border-white/10" />
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">New Value</label>
            <input type="number" value={nextVal} onChange={(e) => setNextVal(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 border border-white/10" />
          </div>
        </div>
        <div className="p-3 bg-black/30 rounded-xl text-center">
          <span className="text-xs text-slate-400">Percentage Change = </span>
          <strong className={`text-xl font-bold font-mono ml-2 ${Number(pctChange) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {Number(pctChange) >= 0 ? `+${pctChange}%` : `${pctChange}%`}
          </strong>
        </div>
      </div>
    </div>
  );
};

// 5. Matrix Mathematics Calculator
export const MatrixCalculatorTool: React.FC = () => {
  const [m, setM] = useState([[1, 2], [3, 4]]);

  const det = m[0][0] * m[1][1] - m[0][1] * m[1][0];

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <h3 className="text-xs font-bold uppercase text-accent text-center">2x2 Matrix Determinant</h3>
      <div className="grid grid-cols-2 gap-3 p-6 glass-panel rounded-2xl border border-white/10">
        <input type="number" value={m[0][0]} onChange={(e) => setM([[Number(e.target.value), m[0][1]], m[1]])} className="p-3 bg-black/40 text-center font-mono text-lg font-bold text-slate-100 rounded-xl border border-white/10" />
        <input type="number" value={m[0][1]} onChange={(e) => setM([[m[0][0], Number(e.target.value)], m[1]])} className="p-3 bg-black/40 text-center font-mono text-lg font-bold text-slate-100 rounded-xl border border-white/10" />
        <input type="number" value={m[1][0]} onChange={(e) => setM([m[0], [Number(e.target.value), m[1][1]]])} className="p-3 bg-black/40 text-center font-mono text-lg font-bold text-slate-100 rounded-xl border border-white/10" />
        <input type="number" value={m[1][1]} onChange={(e) => setM([m[0], [m[1][0], Number(e.target.value)]])} className="p-3 bg-black/40 text-center font-mono text-lg font-bold text-slate-100 rounded-xl border border-white/10" />
      </div>

      <div className="p-4 glass-panel rounded-2xl text-center border border-accent/40">
        <span className="text-xs font-bold uppercase text-slate-400">Determinant |A|</span>
        <h2 className="text-3xl font-black text-accent mt-1 font-mono">{det}</h2>
      </div>
    </div>
  );
};

// 6. Quadratic Equation Solver
export const QuadraticSolverTool: React.FC = () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-5);
  const [c, setC] = useState(6);

  const disc = b * b - 4 * a * c;
  let root1 = '', root2 = '';
  if (disc >= 0) {
    root1 = ((-b + Math.sqrt(disc)) / (2 * a)).toFixed(2);
    root2 = ((-b - Math.sqrt(disc)) / (2 * a)).toFixed(2);
  } else {
    const real = (-b / (2 * a)).toFixed(2);
    const imag = (Math.sqrt(-disc) / (2 * a)).toFixed(2);
    root1 = `${real} + ${imag}i`;
    root2 = `${real} - ${imag}i`;
  }

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">a (x²)</label>
          <input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">b (x)</label>
          <input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">c (constant)</label>
          <input type="number" value={c} onChange={(e) => setC(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 border border-white/10" />
        </div>
      </div>

      <div className="p-6 glass-panel rounded-2xl border border-white/10 text-center space-y-2">
        <span className="text-xs font-bold uppercase text-slate-400">Roots of Equation ({a}x² + {b}x + {c} = 0)</span>
        <div className="flex justify-center gap-6 mt-2 font-mono text-xl font-black text-accent">
          <span>x₁ = {root1}</span>
          <span>x₂ = {root2}</span>
        </div>
      </div>
    </div>
  );
};

// 7. Fraction Operator & Converter
export const FractionCalculatorTool: React.FC = () => {
  const [num1, setNum1] = useState(3);
  const [den1, setDen1] = useState(4);
  const [num2, setNum2] = useState(1);
  const [den2, setDen2] = useState(2);
  const [op, setOp] = useState('+');

  let resNum = 0, resDen = 1;
  if (op === '+') { resNum = num1 * den2 + num2 * den1; resDen = den1 * den2; }
  else if (op === '-') { resNum = num1 * den2 - num2 * den1; resDen = den1 * den2; }
  else if (op === '*') { resNum = num1 * num2; resDen = den1 * den2; }
  else if (op === '/') { resNum = num1 * den2; resDen = den1 * num2; }

  const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
  const common = gcd(Math.abs(resNum), Math.abs(resDen));
  const simNum = resNum / common;
  const simDen = resDen / common;

  return (
    <div className="space-y-4 max-w-md mx-auto text-center">
      <div className="flex items-center justify-center gap-4">
        <div className="space-y-1">
          <input type="number" value={num1} onChange={(e) => setNum1(Number(e.target.value))} className="w-16 p-2 bg-black/40 text-center font-mono text-xs rounded-lg border border-white/10" />
          <div className="h-0.5 bg-accent" />
          <input type="number" value={den1} onChange={(e) => setDen1(Number(e.target.value))} className="w-16 p-2 bg-black/40 text-center font-mono text-xs rounded-lg border border-white/10" />
        </div>

        <select value={op} onChange={(e) => setOp(e.target.value)} className="bg-accent/20 text-accent font-bold text-lg p-2 rounded-xl border border-accent/40">
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">×</option>
          <option value="/">÷</option>
        </select>

        <div className="space-y-1">
          <input type="number" value={num2} onChange={(e) => setNum2(Number(e.target.value))} className="w-16 p-2 bg-black/40 text-center font-mono text-xs rounded-lg border border-white/10" />
          <div className="h-0.5 bg-accent" />
          <input type="number" value={den2} onChange={(e) => setDen2(Number(e.target.value))} className="w-16 p-2 bg-black/40 text-center font-mono text-xs rounded-lg border border-white/10" />
        </div>
      </div>

      <div className="p-4 glass-panel rounded-2xl border border-accent/40">
        <span className="text-xs font-bold uppercase text-slate-400">Simplified Fraction Result</span>
        <h3 className="text-2xl font-black text-accent font-mono mt-1">{simNum} / {simDen} ({(simNum / simDen).toFixed(4)})</h3>
      </div>
    </div>
  );
};

// 8. Standard Deviation & Variance
export const StatsCalculatorTool: React.FC = () => {
  const [input, setInput] = useState('10, 20, 30, 40, 50');
  const arr = input.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n));

  const mean = arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const variance = arr.length > 0 ? arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length : 0;
  const stdDev = Math.sqrt(variance);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1 block">Dataset (comma-separated numbers)</label>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-4 glass-panel rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Mean (Average)</span>
          <h3 className="text-2xl font-black text-accent mt-1">{mean.toFixed(2)}</h3>
        </div>
        <div className="p-4 glass-panel rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Variance</span>
          <h3 className="text-2xl font-black text-purple-400 mt-1">{variance.toFixed(2)}</h3>
        </div>
        <div className="p-4 glass-panel rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Std Deviation</span>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">{stdDev.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
};

// 9. Prime Factorizer & GCD / LCM
export const PrimeFactorizerTool: React.FC = () => {
  const [num, setNum] = useState(84);

  const getPrimeFactors = (n: number) => {
    const factors: number[] = [];
    let d = 2;
    while (n >= 2) {
      if (n % d === 0) {
        factors.push(d);
        n = n / d;
      } else {
        d++;
      }
    }
    return factors;
  };

  const factors = getPrimeFactors(num);

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1 block">Number to Factorize</label>
        <input type="number" value={num} onChange={(e) => setNum(Math.max(2, Number(e.target.value)))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
      </div>

      <div className="p-6 glass-panel rounded-2xl border border-accent/40 text-center">
        <span className="text-xs font-bold uppercase text-slate-400">Prime Factors</span>
        <h3 className="text-2xl font-black text-accent font-mono mt-2">{factors.join(' × ')}</h3>
      </div>
    </div>
  );
};
