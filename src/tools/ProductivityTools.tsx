import React, { useState, useEffect, useRef } from 'react';
import { CheckSquare, Wallet, Notebook, Plus, Trash2, CheckCircle2, Flame, Save, Brush, Eraser, Square, Circle, Type, RotateCcw, RotateCw, StickyNote, Download, Trash } from 'lucide-react';
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

// 4. VisionOS Glass Canvas Whiteboard & Mind Mapper
interface StickyNoteData {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

export const GlassCanvasTool: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeTool, setActiveTool] = useState<'brush' | 'line' | 'rect' | 'circle' | 'eraser' | 'text'>('brush');
  const [color, setColor] = useState('#06b6d4');
  const [size, setSize] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [bgStyle, setBgStyle] = useState<'dark' | 'grid' | 'dots'>('grid');

  const [stickyNotes, setStickyNotes] = useState<StickyNoteData[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [canvasSnapshot, setCanvasSnapshot] = useState<ImageData | null>(null);

  // Undo/Redo history stack
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Drag state for sticky notes
  const [draggingNoteId, setDraggingNoteId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Init canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = 500;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Save initial snapshot
        const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([snapshot]);
        setHistoryIndex(0);
      }
    }

    // Load saved sticky notes
    try {
      const saved = localStorage.getItem('omni_glass_canvas_notes');
      if (saved) setStickyNotes(JSON.parse(saved));
    } catch (e) {}
  }, []);

  // Save notes to local storage
  useEffect(() => {
    localStorage.setItem('omni_glass_canvas_notes', JSON.stringify(stickyNotes));
  }, [stickyNotes]);

  const saveHistoryStep = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imgData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (canvas && historyIndex > 0) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const prevIndex = historyIndex - 1;
        ctx.putImageData(history[prevIndex], 0, 0);
        setHistoryIndex(prevIndex);
      }
    }
  };

  const handleRedo = () => {
    const canvas = canvasRef.current;
    if (canvas && historyIndex < history.length - 1) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const nextIndex = historyIndex + 1;
        ctx.putImageData(history[nextIndex], 0, 0);
        setHistoryIndex(nextIndex);
      }
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Check if touch event
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handleStartDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    setStartPos(coords);
    setIsDrawing(true);

    // Save snapshot of current canvas state for shape previews
    setCanvasSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

    if (activeTool === 'brush' || activeTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.strokeStyle = activeTool === 'eraser' ? '#000000' : color;
      ctx.globalCompositeOperation = activeTool === 'eraser' ? 'destination-out' : 'source-over';
      ctx.lineWidth = size;
      ctx.globalAlpha = opacity;
    }
  };

  const handleDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const coords = getCoordinates(e);

    if (activeTool === 'brush' || activeTool === 'eraser') {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (canvasSnapshot) {
      // Clear to snapshot before drawing preview shape
      ctx.putImageData(canvasSnapshot, 0, 0);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = size;
      ctx.globalAlpha = opacity;

      if (activeTool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else if (activeTool === 'rect') {
        ctx.beginPath();
        const width = coords.x - startPos.x;
        const height = coords.y - startPos.y;
        ctx.rect(startPos.x, startPos.y, width, height);
        ctx.stroke();
      } else if (activeTool === 'circle') {
        ctx.beginPath();
        const radius = Math.sqrt(Math.pow(coords.x - startPos.x, 2) + Math.pow(coords.y - startPos.y, 2));
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const handleEndDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      if (activeTool === 'text') {
        const coords = getCoordinates(e);
        const text = prompt('Enter text value:');
        if (text) {
          ctx.font = `${size * 3}px sans-serif`;
          ctx.fillStyle = color;
          ctx.globalAlpha = opacity;
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillText(text, coords.x, coords.y);
          saveHistoryStep(ctx, canvas);
        }
      } else {
        saveHistoryStep(ctx, canvas);
      }
    }
    setCanvasSnapshot(null);
  };

  // Clear Canvas
  const handleClear = () => {
    if (confirm('Clear entire canvas drawings?')) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          saveHistoryStep(ctx, canvas);
        }
      }
    }
  };

  // Export Canvas Drawing
  const handleExport = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Create temporary canvas to draw background + drawings
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        // Draw background style
        tempCtx.fillStyle = '#090d16';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        if (bgStyle === 'grid') {
          tempCtx.strokeStyle = 'rgba(255,255,255,0.05)';
          tempCtx.lineWidth = 1;
          for (let x = 0; x < tempCanvas.width; x += 30) {
            tempCtx.beginPath();
            tempCtx.moveTo(x, 0);
            tempCtx.lineTo(x, tempCanvas.height);
            tempCtx.stroke();
          }
          for (let y = 0; y < tempCanvas.height; y += 30) {
            tempCtx.beginPath();
            tempCtx.moveTo(0, y);
            tempCtx.lineTo(tempCanvas.width, y);
            tempCtx.stroke();
          }
        } else if (bgStyle === 'dots') {
          tempCtx.fillStyle = 'rgba(255,255,255,0.1)';
          for (let x = 15; x < tempCanvas.width; x += 30) {
            for (let y = 15; y < tempCanvas.height; y += 30) {
              tempCtx.beginPath();
              tempCtx.arc(x, y, 1.5, 0, 2 * Math.PI);
              tempCtx.fill();
            }
          }
        }

        // Draw canvas drawing contents
        tempCtx.drawImage(canvas, 0, 0);

        // Download PNG
        const url = tempCanvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'glass_canvas.png';
        a.click();
      }
    }
  };

  // Sticky notes handlers
  const addStickyNote = () => {
    const newNote: StickyNoteData = {
      id: Math.random().toString(),
      text: 'Double click to edit idea',
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 150,
      color: ['bg-cyan-500/20 border-cyan-500/40 text-cyan-200', 'bg-purple-500/20 border-purple-500/40 text-purple-200', 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200', 'bg-orange-500/20 border-orange-500/40 text-orange-200', 'bg-rose-500/20 border-rose-500/40 text-rose-200'][Math.floor(Math.random() * 5)]
    };
    setStickyNotes([...stickyNotes, newNote]);
  };

  const updateStickyNote = (id: string, text: string) => {
    setStickyNotes(stickyNotes.map(n => n.id === id ? { ...n, text } : n));
  };

  const deleteStickyNote = (id: string) => {
    setStickyNotes(stickyNotes.filter(n => n.id !== id));
  };

  const clearAllStickyNotes = () => {
    if (confirm('Delete all sticky notes?')) {
      setStickyNotes([]);
    }
  };

  // Drag and drop sticky notes
  const startDragNote = (e: React.MouseEvent, note: StickyNoteData) => {
    e.preventDefault();
    setDraggingNoteId(note.id);
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - note.x,
        y: e.clientY - rect.top - note.y
      });
    }
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (draggingNoteId) {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const newX = e.clientX - rect.left - dragOffset.x;
        const newY = e.clientY - rect.top - dragOffset.y;
        setStickyNotes(stickyNotes.map(n => n.id === draggingNoteId ? { ...n, x: newX, y: newY } : n));
      }
    }
  };

  const stopDragNote = () => {
    setDraggingNoteId(null);
  };

  return (
    <div className="space-y-4" onMouseMove={handleDragMove} onMouseUp={stopDragNote}>
      {/* Visual Floating Action Panel */}
      <div className="flex flex-wrap items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/10 gap-3">
        {/* Drawing Tools Swatches */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTool('brush')}
            className={`p-2 rounded-xl transition-all ${activeTool === 'brush' ? 'bg-accent text-slate-950 shadow-md' : 'text-slate-400 hover:bg-white/5'}`}
            title="Brush Draw"
          >
            <Brush className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('line')}
            className={`p-2 rounded-xl transition-all ${activeTool === 'line' ? 'bg-accent text-slate-950 shadow-md' : 'text-slate-400 hover:bg-white/5'}`}
            title="Line Tool"
          >
            <Minimize2 className="w-4 h-4 rotate-45" />
          </button>
          <button
            onClick={() => setActiveTool('rect')}
            className={`p-2 rounded-xl transition-all ${activeTool === 'rect' ? 'bg-accent text-slate-950 shadow-md' : 'text-slate-400 hover:bg-white/5'}`}
            title="Rectangle"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('circle')}
            className={`p-2 rounded-xl transition-all ${activeTool === 'circle' ? 'bg-accent text-slate-950 shadow-md' : 'text-slate-400 hover:bg-white/5'}`}
            title="Circle"
          >
            <Circle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('text')}
            className={`p-2 rounded-xl transition-all ${activeTool === 'text' ? 'bg-accent text-slate-950 shadow-md' : 'text-slate-400 hover:bg-white/5'}`}
            title="Text Tool"
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('eraser')}
            className={`p-2 rounded-xl transition-all ${activeTool === 'eraser' ? 'bg-accent text-slate-950 shadow-md' : 'text-slate-400 hover:bg-white/5'}`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        {/* Color Palette & Styles Selector */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Color swatches */}
          <div className="flex items-center gap-1">
            {['#06b6d4', '#a855f7', '#10b981', '#f97316', '#f43f5e', '#ffffff'].map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-4 h-4 rounded-full border border-white/20 transition-all ${color === c ? 'scale-125 shadow-md shadow-accent/20 border-white' : 'opacity-70 hover:opacity-100'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Size & Opacity Slider */}
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-1.5">
              <span>Size:</span>
              <input type="range" min="1" max="40" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-16 h-1 bg-black/40 rounded-full appearance-none cursor-pointer accent-accent" />
            </div>
            <div className="flex items-center gap-1.5">
              <span>Opacity:</span>
              <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-16 h-1 bg-black/40 rounded-full appearance-none cursor-pointer accent-accent" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button onClick={addStickyNote} className="px-3 py-1.5 rounded-xl bg-accent/20 border border-accent/40 text-accent font-bold text-xs flex items-center gap-1 shadow-md hover:bg-accent/30 transition-colors">
            <StickyNote className="w-3.5 h-3.5" /> + Sticky
          </button>
          <button onClick={handleUndo} disabled={historyIndex <= 0} className="p-2 rounded-xl text-slate-400 hover:bg-white/5 disabled:opacity-30 transition-colors" title="Undo">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-2 rounded-xl text-slate-400 hover:bg-white/5 disabled:opacity-30 transition-colors" title="Redo">
            <RotateCw className="w-4 h-4" />
          </button>
          <button onClick={handleExport} className="p-2 rounded-xl text-slate-400 hover:bg-white/5 transition-colors" title="Export PNG">
            <Download className="w-4 h-4" />
          </button>
          <button onClick={handleClear} className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors" title="Clear Canvas">
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Canvas Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main Canvas Frame */}
        <div className="md:col-span-3 space-y-2">
          {/* Canvas Wrapper */}
          <div
            ref={containerRef}
            className={`relative rounded-3xl overflow-hidden border border-white/10 select-none bg-[#090d16] ${bgStyle === 'grid' ? 'bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:25px_25px]' : bgStyle === 'dots' ? 'bg-[radial-gradient(rgba(255,255,255,0.07)_1.5px,transparent_1.5px)] bg-[size:25px_25px]' : ''}`}
            style={{ height: '500px' }}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 cursor-crosshair"
              onMouseDown={handleStartDrawing}
              onMouseMove={handleDraw}
              onMouseUp={handleEndDrawing}
              onMouseLeave={handleEndDrawing}
              onTouchStart={handleStartDrawing}
              onTouchMove={handleDraw}
              onTouchEnd={handleEndDrawing}
            />

            {/* Interactive Sticky Notes */}
            {stickyNotes.map((note) => (
              <div
                key={note.id}
                style={{
                  position: 'absolute',
                  left: `${note.x}px`,
                  top: `${note.y}px`,
                  width: '150px',
                  minHeight: '80px',
                  zIndex: draggingNoteId === note.id ? 50 : 10
                }}
                className={`p-3 rounded-2xl border backdrop-blur-md shadow-2xl flex flex-col justify-between cursor-grab active:cursor-grabbing ${note.color}`}
              >
                <div
                  onMouseDown={(e) => startDragNote(e, note)}
                  className="w-full h-4 border-b border-white/10 flex items-center justify-between pb-1.5 mb-1.5"
                >
                  <span className="text-[8px] font-black uppercase opacity-60 tracking-wider">Note</span>
                  <button onClick={() => deleteStickyNote(note.id)} className="text-slate-400 hover:text-rose-400">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <textarea
                  value={note.text}
                  onChange={(e) => updateStickyNote(note.id, e.target.value)}
                  className="w-full flex-1 bg-transparent text-[11px] font-semibold focus:outline-none resize-none overflow-hidden h-12 leading-relaxed"
                  placeholder="Enter text..."
                />
              </div>
            ))}
          </div>

          {/* Grid Selection control */}
          <div className="flex gap-2 text-xs font-semibold text-slate-400">
            <span>Background Grid Style:</span>
            <button onClick={() => setBgStyle('dark')} className={`hover:text-slate-200 ${bgStyle === 'dark' ? 'text-accent' : ''}`}>Clean Dark</button>
            <span>•</span>
            <button onClick={() => setBgStyle('grid')} className={`hover:text-slate-200 ${bgStyle === 'grid' ? 'text-accent' : ''}`}>Grid Paper</button>
            <span>•</span>
            <button onClick={() => setBgStyle('dots')} className={`hover:text-slate-200 ${bgStyle === 'dots' ? 'text-accent' : ''}`}>Dots Blueprint</button>
          </div>
        </div>

        {/* Mind Mapping Sidebar */}
        <div className="p-4 glass-panel rounded-3xl border border-white/10 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Mind Mapping Cards</span>
              {stickyNotes.length > 0 && (
                <button onClick={clearAllStickyNotes} className="text-[10px] font-bold text-rose-400 hover:underline">
                  Delete All
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {stickyNotes.length === 0 ? (
                <p className="text-[10px] text-slate-500 italic">No active sticky notes. Click "+ Sticky" to spawn notes on the canvas and map your ideas.</p>
              ) : (
                stickyNotes.map((note) => (
                  <div key={note.id} className="p-2.5 rounded-xl bg-black/30 border border-white/5 text-[10px] flex items-center justify-between text-slate-300">
                    <span className="truncate w-3/4">{note.text || '(Empty Note)'}</span>
                    <button onClick={() => deleteStickyNote(note.id)} className="text-slate-500 hover:text-rose-400 shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-accent/5 p-3 rounded-2xl border border-accent/20">
            <span className="text-[9px] font-bold text-accent uppercase tracking-wider block mb-1">Canvas Tip</span>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Drag notes to position them. Switch tools to sketch lines, boxes, or write text directly onto the canvas grids.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

