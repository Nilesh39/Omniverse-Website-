import React from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { db } from '../../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { formatCurrency } from '../../lib/utils';

export const ExpenseSummaryWidget: React.FC = () => {
  const expenses = useLiveQuery(() => db.expenses.toArray(), []);

  const totalIncome = expenses
    ? expenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0)
    : 0;

  const totalExpense = expenses
    ? expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0)
    : 0;

  const balance = totalIncome - totalExpense;

  return (
    <div className="glass-panel rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between h-full min-h-[180px] border border-white/10 group hover:border-accent/40 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-accent">
          <Wallet className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Expense Tracker Overview</span>
        </div>
      </div>

      <div className="my-2">
        <span className="text-[10px] uppercase font-bold text-slate-400">Net Balance</span>
        <h3 className={`text-3xl font-black font-mono ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {formatCurrency(balance)}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <TrendingUp className="w-4 h-4" />
          <span>{formatCurrency(totalIncome)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
          <TrendingDown className="w-4 h-4" />
          <span>{formatCurrency(totalExpense)}</span>
        </div>
      </div>
    </div>
  );
};
