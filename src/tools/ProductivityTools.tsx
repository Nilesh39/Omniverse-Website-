import React, { useState, useEffect } from 'react';
import { CheckSquare, Wallet, Notebook, Plus, Trash2, CheckCircle2, Flame, Save } from 'lucide-react';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { formatCurrency } from '../lib/utils';

// 1. Habit Tracker & Streaks
export const HabitTrackerTool: React.FC = () => {
  const habits = useLiveQuery(() => db.habits.toArray(), []);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Fitness');

  const todayStr = new Date().toISOString().split('T')[0];

  const addHabit = async () => {
    if (!title.trim()) return;
    await db.habits.add({
      title: title.trim(),
      category,
      streak: 0,
      completedDates: []
    });
    setTitle('');
  };

  const toggleHabitToday = async (id: number, dates: string[], streak: number) => {
    const isDone = dates.includes(todayStr);
    const updatedDates = isDone ? dates.filter(d => d !== todayStr) : [...dates, todayStr];
    const updatedStreak = isDone ? Math.max(0, streak - 1) : streak + 1;

    await db.habits.update(id, {
      completedDates: updatedDates,
      streak: updatedStreak
    });
  };

  const deleteHabit = async (id: number) => {
    await db.habits.delete(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Habit (e.g. Read 20 mins, Drink 3L Water)..."
          className="flex-1 bg-black/40 rounded-xl px-4 py-2 text-xs text-slate-200 border border-white/10"
        />
        <button onClick={addHabit} className="px-4 py-2 rounded-xl bg-accent text-slate-950 font-bold text-xs flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Habit
        </button>
      </div>

      <div className="space-y-3">
        {(!habits || habits.length === 0) ? (
          <p className="text-xs text-slate-400 italic text-center py-6">No active habits added yet.</p>
        ) : (
          habits.map(h => {
            const isDone = h.completedDates?.includes(todayStr);
            return (
              <div key={h.id} className="p-4 glass-panel rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => h.id && toggleHabitToday(h.id, h.completedDates || [], h.streak || 0)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isDone ? 'bg-emerald-400 text-slate-950' : 'border border-slate-500 hover:border-accent'}`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <div>
                    <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {h.title}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-400">{h.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-orange-400 flex items-center gap-1">
                    <Flame className="w-4 h-4" /> {h.streak} Day Streak
                  </span>
                  <button onClick={() => h.id && deleteHabit(h.id)} className="text-slate-500 hover:text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// 2. Glass Quick Notes Notepad
export const QuickNotesTool: React.FC = () => {
  const notes = useLiveQuery(() => db.notes.orderBy('updatedAt').reverse().toArray(), []);
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (notes && !hasInitialized) {
      if (notes.length > 0) {
        setActiveNoteId(notes[0].id || null);
        setTitle(notes[0].title);
        setContent(notes[0].content);
      } else {
        setTitle('Untitled Glass Note');
        setContent('');
      }
      setHasInitialized(true);
    }
  }, [notes, hasInitialized]);

  const createNewNote = () => {
    setActiveNoteId(null);
    setTitle('Untitled Glass Note');
    setContent('');
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    if (activeNoteId) {
      await db.notes.update(activeNoteId, {
        title,
        content,
        updatedAt: new Date().toISOString()
      });
    } else {
      const newId = await db.notes.add({
        title,
        content,
        updatedAt: new Date().toISOString(),
        pinned: false
      });
      setActiveNoteId(newId as number);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteNote = async (id: number) => {
    await db.notes.delete(id);
    if (activeNoteId === id) {
      const remaining = notes?.filter(n => n.id !== id) || [];
      if (remaining.length > 0) {
        setActiveNoteId(remaining[0].id || null);
        setTitle(remaining[0].title);
        setContent(remaining[0].content);
      } else {
        createNewNote();
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Sidebar List */}
      <div className="space-y-2">
        <button onClick={createNewNote} className="w-full py-2.5 rounded-xl bg-accent text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-md">
          <Plus className="w-4 h-4" /> New Glass Note
        </button>

        <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
          {notes?.map(n => (
            <div
              key={n.id}
              onClick={() => {
                setActiveNoteId(n.id || null);
                setTitle(n.title);
                setContent(n.content);
              }}
              className={`p-3 rounded-xl glass-panel glass-panel-hover cursor-pointer flex items-center justify-between text-xs ${activeNoteId === n.id ? 'border border-accent text-accent font-bold bg-accent/15' : 'text-slate-300'}`}
            >
              <span className="truncate">{n.title}</span>
              {n.id && (
                <button onClick={(e) => { e.stopPropagation(); deleteNote(n.id!); }} className="text-slate-500 hover:text-rose-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Editor Main */}
      <div className="md:col-span-2 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title..."
            className="flex-1 bg-black/40 rounded-xl px-4 py-2 text-sm font-bold text-slate-100 border border-white/10"
          />
          <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-accent text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md">
            <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save'}
          </button>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write markdown note content here..."
          className="w-full h-80 bg-black/40 rounded-2xl p-4 font-mono text-xs text-slate-200 border border-white/10 focus:outline-none focus:border-accent"
        />
      </div>
    </div>
  );
};

// 3. Expense & Budget Planner
export const ExpenseTrackerTool: React.FC = () => {
  const expenses = useLiveQuery(() => db.expenses.toArray(), []);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(50);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState('Food & Dining');

  const addEntry = async () => {
    if (!title.trim() || amount <= 0) return;
    await db.expenses.add({
      title: title.trim(),
      amount,
      type,
      category,
      date: new Date().toISOString().split('T')[0]
    });
    setTitle('');
    setAmount(0);
  };

  const deleteEntry = async (id: number) => {
    await db.expenses.delete(id);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (e.g. Groceries, Freelance)..."
          className="sm:col-span-2 bg-black/40 rounded-xl px-4 py-2 text-xs text-slate-200 border border-white/10"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount ($)"
          className="bg-black/40 rounded-xl px-4 py-2 font-mono text-xs text-slate-200 border border-white/10"
        />
        <button onClick={addEntry} className="px-4 py-2 rounded-xl bg-accent text-slate-950 font-bold text-xs">
          + Add Entry
        </button>
      </div>

      <div className="space-y-2">
        {(!expenses || expenses.length === 0) ? (
          <p className="text-xs text-slate-400 italic text-center py-6">No expenses logged yet.</p>
        ) : (
          expenses.map(e => (
            <div key={e.id} className="p-3 rounded-2xl glass-panel flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-100">{e.title}</h4>
                <span className="text-[10px] text-slate-400">{e.category} • {e.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-mono text-xs font-bold ${e.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {e.type === 'income' ? '+' : '-'}{formatCurrency(e.amount)}
                </span>
                <button onClick={() => e.id && deleteEntry(e.id)} className="text-slate-500 hover:text-rose-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
