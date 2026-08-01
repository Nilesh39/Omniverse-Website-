import React from 'react';
import { Flame, CheckCircle2 } from 'lucide-react';
import { db } from '../../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export const HabitWidget: React.FC = () => {
  const habits = useLiveQuery(() => db.habits.toArray(), []);

  const todayStr = new Date().toISOString().split('T')[0];

  const toggleTodayHabit = async (id: number, currentDates: string[], currentStreak: number) => {
    const doneToday = currentDates.includes(todayStr);
    let updatedDates: string[];
    let updatedStreak = currentStreak;

    if (doneToday) {
      updatedDates = currentDates.filter(d => d !== todayStr);
      updatedStreak = Math.max(0, currentStreak - 1);
    } else {
      updatedDates = [...currentDates, todayStr];
      updatedStreak = currentStreak + 1;
    }

    await db.habits.update(id, {
      completedDates: updatedDates,
      streak: updatedStreak
    });
  };

  return (
    <div className="glass-panel rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between h-full min-h-[180px] border border-white/10 group hover:border-accent/40 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-accent">
          <Flame className="w-5 h-5 text-orange-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Habits Pulse</span>
        </div>
      </div>

      <div className="space-y-2 max-h-[110px] overflow-y-auto pr-1">
        {(!habits || habits.length === 0) ? (
          <p className="text-xs text-slate-400 italic">No habits added yet. Visit Habit Tracker tool to start.</p>
        ) : (
          habits.slice(0, 3).map(h => {
            const isDone = h.completedDates?.includes(todayStr);
            return (
              <div
                key={h.id}
                onClick={() => h.id && toggleTodayHabit(h.id, h.completedDates || [], h.streak || 0)}
                className="flex items-center justify-between p-2 rounded-xl glass-panel glass-panel-hover cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-500'}`} />
                  <span className={`font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                    {h.title}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-orange-400 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> {h.streak}d
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="text-[10px] text-slate-500 mt-2">
        Daily streak maintenance
      </div>
    </div>
  );
};
