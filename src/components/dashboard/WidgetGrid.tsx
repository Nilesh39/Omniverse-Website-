import React from 'react';
import { LiveClockWidget } from '../widgets/LiveClockWidget';
import { PomodoroWidget } from '../widgets/PomodoroWidget';
import { QuickCalcWidget } from '../widgets/QuickCalcWidget';
import { NotesWidget } from '../widgets/NotesWidget';
import { BatteryWidget } from '../widgets/BatteryWidget';
import { QuoteWidget } from '../widgets/QuoteWidget';
import { ExpenseSummaryWidget } from '../widgets/ExpenseSummaryWidget';
import { HabitWidget } from '../widgets/HabitWidget';

export const WidgetGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
      <LiveClockWidget />
      <PomodoroWidget />
      <QuickCalcWidget />
      <NotesWidget />
      <BatteryWidget />
      <QuoteWidget />
      <ExpenseSummaryWidget />
      <HabitWidget />
    </div>
  );
};
