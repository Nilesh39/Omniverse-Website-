import Dexie, { type Table } from 'dexie';

export interface FavoriteItem {
  id?: number;
  toolId: string;
  addedAt: string;
}

export interface HistoryItem {
  id?: number;
  toolId: string;
  toolTitle: string;
  category: string;
  timestamp: string;
  summary?: string;
}

export interface QuickNote {
  id?: number;
  title: string;
  content: string;
  updatedAt: string;
  pinned: boolean;
  category?: string;
}

export interface ExpenseItem {
  id?: number;
  title: string;
  amount: number;
  type: 'expense' | 'income';
  category: string;
  date: string;
}

export interface HabitItem {
  id?: number;
  title: string;
  category: string;
  streak: number;
  completedDates: string[]; // YYYY-MM-DD
}

export interface CustomWidget {
  id?: number;
  widgetId: string;
  title: string;
  order: number;
  visible: boolean;
}

export class OmniVerseDB extends Dexie {
  favorites!: Table<FavoriteItem>;
  history!: Table<HistoryItem>;
  notes!: Table<QuickNote>;
  expenses!: Table<ExpenseItem>;
  habits!: Table<HabitItem>;
  widgets!: Table<CustomWidget>;

  constructor() {
    super('OmniVerseDB');
    this.version(1).stores({
      favorites: '++id, toolId, addedAt',
      history: '++id, toolId, toolTitle, category, timestamp',
      notes: '++id, title, updatedAt, pinned',
      expenses: '++id, title, category, date, type',
      habits: '++id, title, category, streak',
      widgets: '++id, widgetId, order, visible'
    });
  }
}

export const db = new OmniVerseDB();

// Helper seed function for initial state
export async function initDatabaseDefaults() {
  const widgetCount = await db.widgets.count();
  if (widgetCount === 0) {
    await db.widgets.bulkAdd([
      { widgetId: 'clock', title: 'Live Vision Clock', order: 1, visible: true },
      { widgetId: 'pomodoro', title: 'Pomodoro Focus Timer', order: 2, visible: true },
      { widgetId: 'quickcalc', title: 'Express Calculator', order: 3, visible: true },
      { widgetId: 'notes', title: 'Quick Glass Notes', order: 4, visible: true },
      { widgetId: 'battery', title: 'System Diagnostics', order: 5, visible: true },
      { widgetId: 'quote', title: 'Daily Inspiration', order: 6, visible: true },
      { widgetId: 'expense', title: 'Expense Tracker Overview', order: 7, visible: true },
      { widgetId: 'habit', title: 'Habits Pulse', order: 8, visible: true }
    ]);
  }

  const noteCount = await db.notes.count();
  if (noteCount === 0) {
    await db.notes.add({
      title: 'Welcome to OmniVerse Tools 🚀',
      content: 'This app runs 100% offline. All your data is stored locally in IndexedDB and LocalStorage. Enjoy 150+ utilities!',
      updatedAt: new Date().toISOString(),
      pinned: true,
      category: 'General'
    });
  }
}
