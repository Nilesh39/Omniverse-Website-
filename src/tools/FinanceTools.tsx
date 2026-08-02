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

// 9. Split Bills & Expenses Calculator
interface BillItem {
  id: string;
  name: string;
  amount: number;
  assignedTo: string[]; // List of person names
}

export const SplitBillsTool: React.FC = () => {
  const [totalBill, setTotalBill] = useState(120);
  const [tipPct, setTipPct] = useState(15);
  const [numPeople, setNumPeople] = useState(4);
  const [peopleNames, setPeopleNames] = useState<string[]>(['Person 1', 'Person 2', 'Person 3', 'Person 4']);

  // Itemized split states
  const [isItemized, setIsItemized] = useState(false);
  const [items, setItems] = useState<BillItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState(10);
  const [newItemAssigned, setNewItemAssigned] = useState<string[]>([]);

  // Adjust people count & sync names list
  const handlePeopleChange = (val: number) => {
    const count = Math.max(1, Math.min(50, val));
    setNumPeople(count);
    
    // Sync names array
    const updated = [...peopleNames];
    if (count > updated.length) {
      for (let i = updated.length; i < count; i++) {
        updated.push(`Person ${i + 1}`);
      }
    } else {
      updated.splice(count);
    }
    setPeopleNames(updated);
  };

  const handleNameChange = (idx: number, name: string) => {
    const updated = [...peopleNames];
    updated[idx] = name || `Person ${idx + 1}`;
    setPeopleNames(updated);
  };

  // Itemized actions
  const addItem = () => {
    if (!newItemName.trim() || newItemAmount <= 0 || newItemAssigned.length === 0) return;
    const newItem: BillItem = {
      id: Math.random().toString(),
      name: newItemName.trim(),
      amount: newItemAmount,
      assignedTo: [...newItemAssigned]
    };
    setItems([...items, newItem]);
    setNewItemName('');
    setNewItemAmount(10);
    setNewItemAssigned([]);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(it => it.id !== id));
  };

  // Calculations
  const tipAmount = isItemized 
    ? (items.reduce((acc, it) => acc + it.amount, 0) * tipPct) / 100
    : (totalBill * tipPct) / 100;
  
  const subtotal = isItemized 
    ? items.reduce((acc, it) => acc + it.amount, 0)
    : totalBill;

  const grandTotal = subtotal + tipAmount;

  // Simple Split (Equal Share)
  const equalShare = grandTotal / Math.max(1, numPeople);

  // Itemized splits map
  const itemizedBalances: Record<string, number> = {};
  peopleNames.forEach(n => { itemizedBalances[n] = 0; });

  if (isItemized && items.length > 0) {
    items.forEach(item => {
      const share = item.amount / item.assignedTo.length;
      item.assignedTo.forEach(person => {
        if (itemizedBalances[person] !== undefined) {
          itemizedBalances[person] += share;
        }
      });
    });

    // Add tip distributed proportionally to everyone's share
    const totalItemSubtotal = items.reduce((acc, it) => acc + it.amount, 0);
    if (totalItemSubtotal > 0) {
      peopleNames.forEach(person => {
        const proportion = itemizedBalances[person] / totalItemSubtotal;
        itemizedBalances[person] += tipAmount * proportion;
      });
    }
  }

  const toggleAssignee = (name: string) => {
    if (newItemAssigned.includes(name)) {
      setNewItemAssigned(newItemAssigned.filter(n => n !== name));
    } else {
      setNewItemAssigned([...newItemAssigned, name]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode selectors */}
      <div className="flex rounded-2xl bg-black/40 p-1 border border-white/10">
        <button onClick={() => setIsItemized(false)} className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${!isItemized ? 'bg-accent text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>Simple Equal Split</button>
        <button onClick={() => setIsItemized(true)} className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${isItemized ? 'bg-accent text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>Itemized Custom Split</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column inputs */}
        <div className="space-y-4 md:col-span-1">
          {!isItemized && (
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Bill Subtotal ($)</label>
              <input
                type="number"
                value={totalBill}
                onChange={(e) => setTotalBill(Number(e.target.value))}
                className="w-full bg-black/40 rounded-xl px-4 py-2 font-mono text-xs text-slate-100 border border-white/10"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Tip Percentage ({tipPct}%)</label>
            <div className="grid grid-cols-5 gap-1 mb-2">
              {[0, 10, 15, 18, 20].map(pct => (
                <button
                  key={pct}
                  onClick={() => setTipPct(pct)}
                  className={`py-1 text-[10px] font-bold rounded-lg border transition-all ${tipPct === pct ? 'bg-accent text-slate-950 border-accent' : 'glass-panel border-white/10 text-slate-300'}`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={tipPct}
              onChange={(e) => setTipPct(Number(e.target.value))}
              className="w-full h-1 bg-black/40 rounded-full appearance-none cursor-pointer accent-accent"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-400">Number of People ({numPeople})</label>
              <div className="flex items-center gap-1">
                <button onClick={() => handlePeopleChange(numPeople - 1)} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 text-xs font-bold">-</button>
                <button onClick={() => handlePeopleChange(numPeople + 1)} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 text-xs font-bold">+</button>
              </div>
            </div>
          </div>

          {/* Edit Names */}
          <div className="p-3.5 glass-panel rounded-2xl border border-white/10 space-y-2 max-h-48 overflow-y-auto">
            <span className="text-[10px] font-bold uppercase text-slate-400">People Names</span>
            <div className="space-y-1.5">
              {peopleNames.map((name, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  className="w-full bg-black/20 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-200 border border-white/5"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center column (Itemized Builder) */}
        <div className="md:col-span-2 space-y-4">
          {isItemized ? (
            <div className="space-y-4">
              {/* Add item form */}
              <div className="p-4 glass-panel rounded-2xl border border-white/10 space-y-3">
                <span className="text-xs font-bold text-slate-300 block">Add Itemized Expense</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Item (e.g. Pizza, Drink)"
                    className="bg-black/20 rounded-xl px-3 py-2 text-xs text-slate-100 border border-white/5"
                  />
                  <input
                    type="number"
                    value={newItemAmount}
                    onChange={(e) => setNewItemAmount(Number(e.target.value))}
                    placeholder="Amount ($)"
                    className="bg-black/20 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 border border-white/5"
                  />
                  <button onClick={addItem} className="px-4 py-2 rounded-xl bg-accent text-slate-950 font-bold text-xs">
                    + Add Item
                  </button>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 block">Who shared this item?</span>
                  <div className="flex flex-wrap gap-1.5">
                    {peopleNames.map(name => (
                      <button
                        key={name}
                        onClick={() => toggleAssignee(name)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${newItemAssigned.includes(name) ? 'bg-accent/20 border border-accent text-accent' : 'bg-white/5 border border-white/10 text-slate-300'}`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">Added Items ({items.length})</span>
                {items.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">No itemized splits added yet.</p>
                ) : (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {items.map(it => (
                      <div key={it.id} className="p-3 rounded-xl glass-panel flex items-center justify-between text-xs">
                        <div>
                          <h4 className="font-bold text-slate-200">{it.name}</h4>
                          <p className="text-[9px] text-slate-400 truncate max-w-xs">Shared by: {it.assignedTo.join(', ')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-accent">${it.amount.toFixed(2)}</span>
                          <button onClick={() => deleteItem(it.id)} className="text-slate-500 hover:text-rose-400">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Simple Splits Calculations Cards */
            <div className="p-6 glass-panel rounded-3xl border border-accent/40 bg-accent/5 text-center flex flex-col justify-center space-y-4 h-full">
              <div>
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Per Person Equal Share</span>
                <h1 className="text-5xl font-black text-accent mt-2 font-mono">${equalShare.toFixed(2)}</h1>
              </div>

              <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
                <div><span className="text-slate-400 block">Subtotal</span><span className="font-bold text-slate-200">${subtotal.toFixed(2)}</span></div>
                <div><span className="text-slate-400 block">Tip ({tipPct}%)</span><span className="font-bold text-slate-200">${tipAmount.toFixed(2)}</span></div>
                <div><span className="text-slate-400 block">Total payable</span><span className="font-bold text-emerald-400">${grandTotal.toFixed(2)}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Itemized Split Calculations Outputs */}
      {isItemized && items.length > 0 && (
        <div className="p-5 glass-panel rounded-3xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Detailed Individual Balances (Includes Tip Shares)</span>
            <span className="text-xs font-mono font-bold text-emerald-400">Grand Total: ${grandTotal.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {peopleNames.map(person => (
              <div key={person} className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase truncate">{person}</span>
                <h3 className="text-xl font-black text-accent mt-1.5 font-mono">${itemizedBalances[person].toFixed(2)}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
