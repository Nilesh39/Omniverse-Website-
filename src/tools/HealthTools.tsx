import React, { useState } from 'react';
import { HeartPulse, Flame, Droplets, Activity } from 'lucide-react';

// 1. BMI Calculator
export const BmiCalculatorTool: React.FC = () => {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);

  const heightM = height / 100;
  const bmi = heightM > 0 ? (weight / (heightM * heightM)).toFixed(1) : '0';
  const bmiNum = Number(bmi);

  let category = 'Normal Weight';
  let colorClass = 'text-emerald-400 border-emerald-500/30';
  if (bmiNum < 18.5) {
    category = 'Underweight';
    colorClass = 'text-sky-400 border-sky-500/30';
  } else if (bmiNum >= 25 && bmiNum < 29.9) {
    category = 'Overweight';
    colorClass = 'text-amber-400 border-amber-500/30';
  } else if (bmiNum >= 30) {
    category = 'Obese';
    colorClass = 'text-rose-400 border-rose-500/30';
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Weight (kg)</label>
          <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Height (cm)</label>
          <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
        </div>
      </div>

      <div className={`p-6 glass-panel rounded-2xl border text-center ${colorClass}`}>
        <span className="text-xs font-bold uppercase tracking-wider">Your Body Mass Index</span>
        <h2 className="text-5xl font-black my-2 font-mono">{bmi}</h2>
        <p className="text-sm font-bold uppercase tracking-wide">{category}</p>
      </div>
    </div>
  );
};

// 2. BMR & TDEE Calculator
export const BmrTdeeCalculatorTool: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [age, setAge] = useState(25);
  const [activity, setActivity] = useState(1.375);

  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;
  const tdee = bmr * activity;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setGender('male')} className={`px-4 py-2 rounded-xl text-xs font-bold ${gender === 'male' ? 'bg-accent text-slate-950' : 'glass-panel text-slate-300'}`}>Male</button>
        <button onClick={() => setGender('female')} className={`px-4 py-2 rounded-xl text-xs font-bold ${gender === 'female' ? 'bg-accent text-slate-950' : 'glass-panel text-slate-300'}`}>Female</button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Age</label>
          <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Weight (kg)</label>
          <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Height (cm)</label>
          <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 border border-white/10" />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1 block">Activity Level</label>
        <select value={activity} onChange={(e) => setActivity(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2 text-xs text-slate-100 border border-white/10">
          <option value={1.2}>Sedentary (Little or no exercise)</option>
          <option value={1.375}>Lightly Active (Exercise 1-3 days/week)</option>
          <option value={1.55}>Moderately Active (Exercise 3-5 days/week)</option>
          <option value={1.725}>Very Active (Hard exercise 6-7 days/week)</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 glass-panel rounded-2xl border border-white/10 text-center"><span className="text-[10px] font-bold uppercase text-slate-400">BMR (Basal Rate)</span><h3 className="text-2xl font-black text-amber-400 mt-1">{Math.round(bmr)} kcal</h3></div>
        <div className="p-4 glass-panel rounded-2xl border border-accent/40 text-center"><span className="text-[10px] font-bold uppercase text-slate-400">TDEE (Daily Maintenance)</span><h3 className="text-2xl font-black text-accent mt-1">{Math.round(tdee)} kcal</h3></div>
      </div>
    </div>
  );
};

// 3. Water Intake Calculator
export const WaterIntakeCalculatorTool: React.FC = () => {
  const [weight, setWeight] = useState(70);
  const [workoutMin, setWorkoutMin] = useState(30);

  const waterLiters = (weight * 0.033) + (workoutMin / 30) * 0.35;

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Body Weight (kg)</label>
          <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Daily Workout (mins)</label>
          <input type="number" value={workoutMin} onChange={(e) => setWorkoutMin(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-accent border border-white/10" />
        </div>
      </div>

      <div className="p-6 glass-panel rounded-2xl border border-accent/40 text-center space-y-2">
        <span className="text-xs font-bold uppercase text-slate-400">Target Daily Hydration</span>
        <h2 className="text-4xl font-black text-accent font-mono">{waterLiters.toFixed(2)} Liters</h2>
        <p className="text-xs text-slate-300">Equivalent to approximately <strong>{Math.round(waterLiters * 4)} glasses</strong> of water (250ml each).</p>
      </div>
    </div>
  );
};

// 4. Target Heart Rate Zones
export const HeartRateCalculatorTool: React.FC = () => {
  const [age, setAge] = useState(25);

  const maxHeartRate = 220 - age;
  const fatBurnLow = Math.round(maxHeartRate * 0.5);
  const fatBurnHigh = Math.round(maxHeartRate * 0.7);
  const cardioLow = Math.round(maxHeartRate * 0.7);
  const cardioHigh = Math.round(maxHeartRate * 0.85);

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1 block">Your Age</label>
        <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-4 glass-panel rounded-2xl border border-amber-500/30">
          <span className="text-[10px] font-bold text-amber-400 uppercase">Fat Burn Zone (50-70%)</span>
          <h3 className="text-xl font-black text-slate-100 mt-1">{fatBurnLow} - {fatBurnHigh} BPM</h3>
        </div>
        <div className="p-4 glass-panel rounded-2xl border border-rose-500/30">
          <span className="text-[10px] font-bold text-rose-400 uppercase">Cardio Zone (70-85%)</span>
          <h3 className="text-xl font-black text-slate-100 mt-1">{cardioLow} - {cardioHigh} BPM</h3>
        </div>
      </div>
    </div>
  );
};
