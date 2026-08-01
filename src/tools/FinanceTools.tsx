import React, { useState } from 'react';
import { Receipt, Landmark, TrendingUp, DollarSign, Tag, PiggyBank, Briefcase, Banknote } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

// 1. GST Calculator
export const GstCalculatorTool: React.FC = () => {
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  const gstAmount = mode === 'exclusive'
    ? (amount * rate) / 100
    : amount - (amount * (100 / (100 + rate)));

  const totalAmount = mode === 'exclusive' ? amount + gstAmount : amount;
  const baseAmount = mode === 'exclusive' ? amount : amount - gstAmount;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('exclusive')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'exclusive' ? 'bg-accent text-slate-950' : 'glass-panel text-slate-300'}`}>Add GST (Exclusive)</button>
        <button onClick={() => setMode('inclusive')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'inclusive' ? 'bg-accent text-slate-950' : 'glass-panel text-slate-300'}`}>Remove GST (Inclusive)</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Initial Amount ($)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">GST Rate (%)</label>
          <select value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-accent border border-white/10">
            <option value={5}>5%</option>
            <option value={12}>12%</option>
            <option value={18}>18%</option>
            <option value={28}>28%</option>
          </select>
        </div>
      </div>

      <div className="p-6 glass-panel rounded-2xl border border-white/10 space-y-3">
        <div className="flex justify-between text-xs"><span className="text-slate-400">Net Base Amount:</span><span className="font-bold text-slate-200">{formatCurrency(baseAmount)}</span></div>
        <div className="flex justify-between text-xs"><span className="text-slate-400">CGST ({(rate/2)}%) + SGST ({(rate/2)}%):</span><span className="font-bold text-accent">{formatCurrency(gstAmount)}</span></div>
        <div className="flex justify-between text-base border-t border-white/10 pt-3 font-bold"><span className="text-slate-100">Total Gross Payable:</span><span className="text-emerald-400 font-mono text-xl">{formatCurrency(totalAmount)}</span></div>
      </div>
    </div>
  );
};

// 2. EMI Calculator
export const EmiCalculatorTool: React.FC = () => {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(5);

  const monthlyRate = rate / 12 / 100;
  const totalMonths = years * 12;

  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - principal;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Loan Amount ($)</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Annual Interest Rate (%)</label>
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Tenure (Years)</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
        </div>
      </div>

      <div className="p-6 glass-panel rounded-2xl border border-accent/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div><span className="text-[11px] font-bold text-slate-400 uppercase">Monthly EMI</span><h3 className="text-2xl font-black text-accent mt-1">{formatCurrency(isNaN(emi) ? 0 : emi)}</h3></div>
        <div><span className="text-[11px] font-bold text-slate-400 uppercase">Total Interest</span><h3 className="text-2xl font-black text-rose-400 mt-1">{formatCurrency(isNaN(totalInterest) ? 0 : totalInterest)}</h3></div>
        <div><span className="text-[11px] font-bold text-slate-400 uppercase">Total Amount</span><h3 className="text-2xl font-black text-emerald-400 mt-1">{formatCurrency(isNaN(totalPayment) ? 0 : totalPayment)}</h3></div>
      </div>
    </div>
  );
};

// 3. SIP & Mutual Fund Growth Calculator
export const SipCalculatorTool: React.FC = () => {
  const [monthlyInvest, setMonthlyInvest] = useState(5000);
  const [annualRate, setAnnualRate] = useState(12);
  const [years, setYears] = useState(10);

  const i = annualRate / 12 / 100;
  const n = years * 12;
  const totalInvestment = monthlyInvest * n;
  const totalValue = monthlyInvest * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const estimatedReturns = totalValue - totalInvestment;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Monthly Investment ($)</label>
          <input type="number" value={monthlyInvest} onChange={(e) => setMonthlyInvest(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Expected Return Rate (%)</label>
          <input type="number" step="0.5" value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Time Horizon (Years)</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
        </div>
      </div>

      <div className="p-6 glass-panel rounded-2xl border border-accent/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div><span className="text-[11px] font-bold text-slate-400 uppercase">Total Invested</span><h3 className="text-2xl font-black text-slate-200 mt-1">{formatCurrency(totalInvestment)}</h3></div>
        <div><span className="text-[11px] font-bold text-slate-400 uppercase">Estimated Wealth Gain</span><h3 className="text-2xl font-black text-emerald-400 mt-1">{formatCurrency(estimatedReturns)}</h3></div>
        <div><span className="text-[11px] font-bold text-slate-400 uppercase">Total Maturity Value</span><h3 className="text-2xl font-black text-accent mt-1">{formatCurrency(totalValue)}</h3></div>
      </div>
    </div>
  );
};

// 4. Compound Interest Calculator
export const CompoundInterestCalculatorTool: React.FC = () => {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);

  const amount = principal * Math.pow(1 + rate / 100, years);
  const interest = amount - principal;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Initial Principal ($)</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Annual Interest (%)</label>
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Duration (Years)</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
        </div>
      </div>

      <div className="p-6 glass-panel rounded-2xl border border-white/10 text-center space-y-2">
        <span className="text-xs font-bold uppercase text-slate-400">Total Future Balance</span>
        <h2 className="text-4xl font-black text-emerald-400 font-mono">{formatCurrency(amount)}</h2>
        <p className="text-xs text-slate-300">Total Interest Earned: <strong className="text-accent">{formatCurrency(interest)}</strong></p>
      </div>
    </div>
  );
};

// 5. Discount & Savings Calculator
export const DiscountCalculatorTool: React.FC = () => {
  const [price, setPrice] = useState(150);
  const [discount, setDiscount] = useState(20);

  const savings = (price * discount) / 100;
  const finalPrice = price - savings;

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Original Price ($)</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Discount (%)</label>
          <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-accent border border-white/10" />
        </div>
      </div>

      <div className="p-6 glass-panel rounded-2xl border border-accent/40 text-center space-y-2">
        <span className="text-xs font-bold uppercase text-slate-400">Final Discounted Price</span>
        <h2 className="text-4xl font-black text-accent font-mono">{formatCurrency(finalPrice)}</h2>
        <p className="text-xs text-emerald-400 font-bold">You Save: {formatCurrency(savings)} ({discount}%)</p>
      </div>
    </div>
  );
};

// 6. Profit Margin & Markup Calculator
export const MarginCalculatorTool: React.FC = () => {
  const [cost, setCost] = useState(80);
  const [revenue, setRevenue] = useState(120);

  const profit = revenue - cost;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const markup = cost > 0 ? (profit / cost) * 100 : 0;

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Item Cost ($)</label>
          <input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Selling Revenue ($)</label>
          <input type="number" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-accent border border-white/10" />
        </div>
      </div>

      <div className="p-6 glass-panel rounded-2xl border border-white/10 grid grid-cols-2 gap-4 text-center">
        <div><span className="text-[10px] font-bold text-slate-400 uppercase">Gross Margin</span><h3 className="text-2xl font-black text-accent mt-1">{margin.toFixed(1)}%</h3></div>
        <div><span className="text-[10px] font-bold text-slate-400 uppercase">Markup</span><h3 className="text-2xl font-black text-emerald-400 mt-1">{markup.toFixed(1)}%</h3></div>
      </div>
    </div>
  );
};

// 7. ROI Calculator
export const RoiCalculatorTool: React.FC = () => {
  const [invested, setInvested] = useState(5000);
  const [returned, setReturned] = useState(7500);

  const gain = returned - invested;
  const roi = invested > 0 ? (gain / invested) * 100 : 0;

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Amount Invested ($)</label>
          <input type="number" value={invested} onChange={(e) => setInvested(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Amount Returned ($)</label>
          <input type="number" value={returned} onChange={(e) => setReturned(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-accent border border-white/10" />
        </div>
      </div>

      <div className="p-6 glass-panel rounded-2xl border border-accent/40 text-center space-y-2">
        <span className="text-xs font-bold uppercase text-slate-400">Return on Investment (ROI)</span>
        <h2 className={`text-4xl font-black font-mono ${roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {roi >= 0 ? `+${roi.toFixed(1)}%` : `${roi.toFixed(1)}%`}
        </h2>
        <p className="text-xs text-slate-300">Net Profit / Gain: <strong>{formatCurrency(gain)}</strong></p>
      </div>
    </div>
  );
};

// 8. Offline Currency Converter
export const CurrencyConverterTool: React.FC = () => {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');

  const rates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    INR: 83.25,
    JPY: 155.4,
    CAD: 1.36,
    AUD: 1.51
  };

  const converted = (amount / rates[from]) * rates[to];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full bg-black/40 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-100 border border-white/10" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">From Currency</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full bg-black/40 rounded-xl px-4 py-2.5 text-xs text-slate-100 border border-white/10">
            {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">To Currency</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full bg-black/40 rounded-xl px-4 py-2.5 text-xs text-accent font-bold border border-white/10">
            {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="p-6 glass-panel rounded-2xl border border-white/10 text-center">
        <span className="text-xs font-bold text-slate-400 uppercase">Converted Equivalent</span>
        <h2 className="text-4xl font-black text-accent my-2 font-mono">
          {converted.toFixed(2)} {to}
        </h2>
        <p className="text-[11px] text-slate-400">1 {from} = {(rates[to] / rates[from]).toFixed(4)} {to}</p>
      </div>
    </div>
  );
};
