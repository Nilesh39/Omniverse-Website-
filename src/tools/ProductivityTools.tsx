import React, { useState, useEffect, useRef } from 'react';
import { CheckSquare, Wallet, Notebook, Plus, Trash2, CheckCircle2, Flame, Save, Brush, Eraser, Square, Circle, Type, RotateCcw, RotateCw, StickyNote, Download, Trash, Minimize2 } from 'lucide-react';
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

// 5. Sudoku Game & Auto-Solver
export const SudokuGameTool: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(() => Array(9).fill(null).map(() => Array(9).fill(0)));
  const [initialMask, setInitialMask] = useState<boolean[][]>(() => Array(9).fill(null).map(() => Array(9).fill(false)));
  const [solution, setSolution] = useState<number[][]>(() => Array(9).fill(null).map(() => Array(9).fill(0)));
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [conflicts, setConflicts] = useState<boolean[][]>(() => Array(9).fill(null).map(() => Array(9).fill(false)));
  const [showMistakes, setShowMistakes] = useState(true);
  const [statusText, setStatusText] = useState('Select a difficulty level or custom board to begin.');

  const generateBoard = (difficulty: 'easy' | 'medium' | 'hard') => {
    // Standard template solved sudoku
    const solved = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

    let board = solved.map(row => [...row]);

    // Shuffle solved board rows within their 3x3 blocks
    for (let i = 0; i < 15; i++) {
      const bOffset = Math.floor(Math.random() * 3) * 3;
      const r1 = bOffset + Math.floor(Math.random() * 3);
      const r2 = bOffset + Math.floor(Math.random() * 3);
      if (r1 !== r2) {
        const temp = board[r1];
        board[r1] = board[r2];
        board[r2] = temp;
      }
    }

    // Shuffle solved board columns within their 3x3 blocks
    for (let i = 0; i < 15; i++) {
      const bOffset = Math.floor(Math.random() * 3) * 3;
      const c1 = bOffset + Math.floor(Math.random() * 3);
      const c2 = bOffset + Math.floor(Math.random() * 3);
      if (c1 !== c2) {
        for (let r = 0; r < 9; r++) {
          const temp = board[r][c1];
          board[r][c1] = board[r][c2];
          board[r][c2] = temp;
        }
      }
    }

    // Save final shuffled solution
    const finalSolution = board.map(row => [...row]);
    setSolution(finalSolution);

    // Determine number of empty cells
    let empties = 35; // Easy mode
    if (difficulty === 'medium') empties = 45;
    if (difficulty === 'hard') empties = 54;

    const mask = Array(9).fill(null).map(() => Array(9).fill(false));
    let count = 0;
    while (count < empties) {
      const r = Math.floor(Math.random() * 9);
      const c = Math.floor(Math.random() * 9);
      if (board[r][c] !== 0) {
        board[r][c] = 0;
        count++;
      }
    }

    // Set initial mask for read-only clues
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== 0) {
          mask[r][c] = true;
        }
      }
    }

    setGrid(board);
    setInitialMask(mask);
    setConflicts(Array(9).fill(null).map(() => Array(9).fill(false)));
    setSelectedCell(null);
    setStatusText(`Game Started: ${difficulty.toUpperCase()} mode.`);
  };

  const handleCellClick = (r: number, c: number) => {
    if (initialMask[r][c]) return; // Cannot edit initial clue cells
    setSelectedCell({ r, c });
  };

  const handleKeyPress = (num: number) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = num;
    setGrid(newGrid);
    validateGrid(newGrid);
  };

  const handleClearCell = () => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = 0;
    setGrid(newGrid);
    validateGrid(newGrid);
  };

  // Listen to physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;
      if (e.key >= '1' && e.key <= '9') {
        handleKeyPress(Number(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'c' || e.key === 'C') {
        handleClearCell();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, grid]);

  const validateGrid = (board: number[][]) => {
    const newConflicts = Array(9).fill(null).map(() => Array(9).fill(false));
    let hasConflicts = false;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = board[r][c];
        if (val !== 0) {
          // Check row
          for (let col = 0; col < 9; col++) {
            if (board[r][col] === val && col !== c) {
              newConflicts[r][c] = true;
              newConflicts[r][col] = true;
              hasConflicts = true;
            }
          }
          // Check column
          for (let row = 0; row < 9; row++) {
            if (board[row][c] === val && row !== r) {
              newConflicts[r][c] = true;
              newConflicts[row][c] = true;
              hasConflicts = true;
            }
          }
          // Check 3x3 box
          const boxRow = 3 * Math.floor(r / 3);
          const boxCol = 3 * Math.floor(c / 3);
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              const curRow = boxRow + i;
              const curCol = boxCol + j;
              if (board[curRow][curCol] === val && (curRow !== r || curCol !== c)) {
                newConflicts[r][c] = true;
                newConflicts[curRow][curCol] = true;
                hasConflicts = true;
              }
            }
          }
        }
      }
    }

    setConflicts(newConflicts);
    if (hasConflicts) {
      setStatusText('Conflict detected in row, column, or 3x3 grid!');
    } else {
      // Check if completely solved
      const isComplete = board.every(row => row.every(cell => cell !== 0));
      if (isComplete) {
        // Double check against solution
        const matchesSolution = board.every((row, rIdx) => row.every((cell, cIdx) => cell === solution[rIdx][cIdx]));
        if (matchesSolution) {
          setStatusText('Congratulations! Puzzle solved correctly.');
        } else {
          setStatusText('Board complete, but some inputs do not match the correct solution.');
        }
      } else {
        setStatusText('No duplicate conflicts detected. Keep going!');
      }
    }
  };

  // Backtracking Solver
  const solveBoard = () => {
    // If solution state exists, just set it directly to avoid complex backtracking lags
    const isSolutionAvailable = solution.some(row => row.some(cell => cell !== 0));
    if (isSolutionAvailable) {
      setGrid(solution.map(row => [...row]));
      setConflicts(Array(9).fill(null).map(() => Array(9).fill(false)));
      setStatusText('Puzzle solved instantly using stored solution template!');
      return;
    }

    // Fallback: solve using backtracking solver (e.g. for custom boards)
    const board = grid.map(row => [...row]);
    
    const isValidValue = (b: number[][], r: number, c: number, val: number): boolean => {
      for (let i = 0; i < 9; i++) {
        if (b[r][i] === val && i !== c) return false;
        if (b[i][c] === val && i !== r) return false;
        const boxR = 3 * Math.floor(r / 3) + Math.floor(i / 3);
        const boxC = 3 * Math.floor(c / 3) + (i % 3);
        if (b[boxR][boxC] === val && (boxR !== r || boxC !== c)) return false;
      }
      return true;
    };

    const backtrack = (b: number[][]): boolean => {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (b[r][c] === 0) {
            for (let val = 1; val <= 9; val++) {
              if (isValidValue(b, r, c, val)) {
                b[r][c] = val;
                if (backtrack(b)) return true;
                b[r][c] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    if (backtrack(board)) {
      setGrid(board);
      setConflicts(Array(9).fill(null).map(() => Array(9).fill(false)));
      setStatusText('Puzzle solved using recursive backtracking solver!');
    } else {
      setStatusText('This puzzle is unsolvable. Verify inputs.');
    }
  };

  const handleCustomBoard = () => {
    setGrid(Array(9).fill(null).map(() => Array(9).fill(0)));
    setInitialMask(Array(9).fill(null).map(() => Array(9).fill(false)));
    setSolution(Array(9).fill(null).map(() => Array(9).fill(0)));
    setConflicts(Array(9).fill(null).map(() => Array(9).fill(false)));
    setSelectedCell(null);
    setStatusText('Custom Grid Enabled. Enter clues and click "Solve Board".');
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* Game Mode Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button onClick={() => generateBoard('easy')} className="px-3.5 py-1.5 rounded-xl bg-accent text-slate-950 font-bold text-xs">Easy Mode</button>
        <button onClick={() => generateBoard('medium')} className="px-3.5 py-1.5 rounded-xl glass-panel border border-white/10 text-slate-200 font-bold text-xs hover:bg-white/5">Medium Mode</button>
        <button onClick={() => generateBoard('hard')} className="px-3.5 py-1.5 rounded-xl glass-panel border border-white/10 text-slate-200 font-bold text-xs hover:bg-white/5">Hard Mode</button>
        <button onClick={handleCustomBoard} className="px-3.5 py-1.5 rounded-xl glass-panel border border-accent/20 text-accent font-bold text-xs hover:bg-white/5">Empty Custom</button>
      </div>

      {/* Accuracy & Validation Toggles */}
      <div className="flex items-center justify-between px-2 text-xs">
        <span className="text-slate-400 font-medium">Verify accuracy against solution template:</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showMistakes}
            onChange={(e) => setShowMistakes(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-black/40 border border-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-accent peer-checked:after:bg-slate-950" />
        </label>
      </div>

      {/* Grid rendering */}
      <div className="p-4 glass-panel rounded-3xl border border-white/10">
        <div className="grid grid-cols-9 gap-1 bg-white/5 p-2 rounded-2xl">
          {grid.map((row, rIdx) => (
            row.map((cell, cIdx) => {
              const isSelected = selectedCell?.r === rIdx && selectedCell?.c === cIdx;
              const isClue = initialMask[rIdx][cIdx];
              const isConflict = conflicts[rIdx][cIdx];
              
              // Verify mistake if cell has input and is different from solution template
              const isMistake = showMistakes && cell !== 0 && solution[rIdx]?.[cIdx] !== undefined && solution[rIdx][cIdx] !== 0 && cell !== solution[rIdx][cIdx];

              // Alternating 3x3 block subgrid backgrounds
              const boxRowIdx = Math.floor(rIdx / 3);
              const boxColIdx = Math.floor(cIdx / 3);
              const isEvenBox = (boxRowIdx + boxColIdx) % 2 === 0;
              const boxBg = isEvenBox ? 'bg-white/[0.04]' : 'bg-black/30';

              // Visual styling priorities
              let cellStyle = `${boxBg} text-slate-200 hover:bg-white/5 border border-white/5`;

              if (isClue) {
                cellStyle = 'bg-white/15 text-slate-400 font-bold border border-white/5';
                if (isConflict) {
                  cellStyle = 'bg-rose-950/40 text-rose-300 border border-dashed border-rose-500/50';
                }
              } else if (isConflict || isMistake) {
                cellStyle = 'bg-rose-500/20 text-rose-300 border border-rose-500 scale-102';
              } else if (cell !== 0) {
                cellStyle = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40';
              } else if (isSelected) {
                cellStyle = 'bg-accent/20 border border-accent text-accent scale-105';
              }

              // 3x3 visual boundary lines
              const borderRight = (cIdx === 2 || cIdx === 5) ? 'border-r border-white/30 mr-0.5' : '';
              const borderBottom = (rIdx === 2 || rIdx === 5) ? 'border-b border-white/30 mb-0.5' : '';

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => handleCellClick(rIdx, cIdx)}
                  className={`aspect-square flex items-center justify-center font-mono text-base font-black rounded-lg cursor-pointer transition-all ${borderRight} ${borderBottom} ${cellStyle}`}
                >
                  {cell !== 0 ? cell : ''}
                </div>
              );
            })
          ))}
        </div>
      </div>

      {/* Status Alert block */}
      <div className="p-3 text-center glass-panel rounded-2xl border border-white/5 text-xs text-slate-300 font-medium">
        {statusText}
      </div>

      {/* Inputs controls */}
      <div className="space-y-3">
        {selectedCell && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Input value for selected cell</span>
            <div className="grid grid-cols-5 gap-1.5 w-full">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => handleKeyPress(n)} className="py-2.5 rounded-xl bg-accent/20 border border-accent/40 text-accent font-bold text-sm hover:bg-accent/35">{n}</button>
              ))}
              {[6, 7, 8, 9].map(n => (
                <button key={n} onClick={() => handleKeyPress(n)} className="py-2.5 rounded-xl bg-accent/20 border border-accent/40 text-accent font-bold text-sm hover:bg-accent/35">{n}</button>
              ))}
              <button onClick={handleClearCell} className="py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-sm hover:bg-rose-500/35">C</button>
            </div>
          </div>
        )}

        <button
          onClick={solveBoard}
          className="w-full py-3 rounded-2xl bg-accent text-slate-950 font-black text-xs shadow-lg shadow-accent/25 flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" /> Solve Board Instantly
        </button>
      </div>
    </div>
  );
};

// 6. 3D Rubik's Cube Solver & Game
interface CubeState {
  U: string[];
  D: string[];
  L: string[];
  R: string[];
  F: string[];
  B: string[];
}

export const RubiksCubeTool: React.FC = () => {
  const [cube, setCube] = useState<CubeState>({
    U: Array(9).fill('W'),
    D: Array(9).fill('Y'),
    L: Array(9).fill('O'),
    R: Array(9).fill('R'),
    F: Array(9).fill('G'),
    B: Array(9).fill('B')
  });

  const [selectedColor, setSelectedColor] = useState<string>('W');
  const [rotation, setRotation] = useState({ x: -30, y: 45 });
  const [isRotating, setIsRotating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Solver & Autoplay states
  const [scrambleMoves, setScrambleMoves] = useState<string[]>([]);
  const [solutionSteps, setSolutionSteps] = useState<string[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [autoplaySpeed, setAutoplaySpeed] = useState<number>(1800); // 1.8s
  const [showNotationGuide, setShowNotationGuide] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Scramble the cube or click face rotation triggers to play.');

  // Color Swatches Mappings
  const colorMap: Record<string, string> = {
    'W': '#ffffff', // White (U)
    'Y': '#eab308', // Yellow (D)
    'O': '#ea580c', // Orange (L)
    'R': '#dc2626', // Red (R)
    'G': '#16a34a', // Green (F)
    'B': '#2563eb'  // Blue (B)
  };

  const getOppositeMove = (move: string): string => {
    return move.endsWith("'") ? move.slice(0, -1) : `${move}'`;
  };

  // Helper rotation arrays
  const rotateCW = (arr: string[]): string[] => [
    arr[6], arr[3], arr[0],
    arr[7], arr[4], arr[1],
    arr[8], arr[5], arr[2]
  ];

  const rotateCCW = (arr: string[]): string[] => [
    arr[2], arr[5], arr[8],
    arr[1], arr[4], arr[7],
    arr[0], arr[3], arr[6]
  ];

  // Plain descriptions mapping for moves
  const getMoveDescription = (move: string): string => {
    switch (move) {
      case 'U': return "Rotate the Top (Up) layer Clockwise (rotate top row towards Left)";
      case "U'": return "Rotate the Top (Up) layer Counter-Clockwise (rotate top row towards Right)";
      case 'D': return "Rotate the Bottom (Down) layer Clockwise (rotate bottom row towards Right)";
      case "D'": return "Rotate the Bottom (Down) layer Counter-Clockwise (rotate bottom row towards Left)";
      case 'R': return "Rotate the Right vertical column Clockwise (rotate Right column Upward)";
      case "R'": return "Rotate the Right vertical column Counter-Clockwise (rotate Right column Downward)";
      case 'L': return "Rotate the Left vertical column Clockwise (rotate Left column Downward)";
      case "L'": return "Rotate the Left vertical column Counter-Clockwise (rotate Left column Upward)";
      case 'F': return "Rotate the Front face Clockwise (turn Front layer to the Right)";
      case "F'": return "Rotate the Front face Counter-Clockwise (turn Front layer to the Left)";
      case 'B': return "Rotate the Back face Clockwise (turn Back layer to the Left)";
      case "B'": return "Rotate the Back face Counter-Clockwise (turn Back layer to the Right)";
      default: return "Execute rotation move: " + move;
    }
  };

  // Rotate layer functions
  const performMove = (move: string) => {
    setCube((prev) => {
      const next: CubeState = {
        U: [...prev.U],
        D: [...prev.D],
        L: [...prev.L],
        R: [...prev.R],
        F: [...prev.F],
        B: [...prev.B]
      };

      switch (move) {
        case 'U':
          next.U = rotateCW(prev.U);
          next.F[0] = prev.R[0]; next.F[1] = prev.R[1]; next.F[2] = prev.R[2];
          next.L[0] = prev.F[0]; next.L[1] = prev.F[1]; next.L[2] = prev.F[2];
          next.B[0] = prev.L[0]; next.B[1] = prev.L[1]; next.B[2] = prev.L[2];
          next.R[0] = prev.B[0]; next.R[1] = prev.B[1]; next.R[2] = prev.B[2];
          break;
        case "U'":
          next.U = rotateCCW(prev.U);
          next.F[0] = prev.L[0]; next.F[1] = prev.L[1]; next.F[2] = prev.L[2];
          next.R[0] = prev.F[0]; next.R[1] = prev.F[1]; next.R[2] = prev.F[2];
          next.B[0] = prev.R[0]; next.B[1] = prev.R[1]; next.B[2] = prev.R[2];
          next.L[0] = prev.B[0]; next.L[1] = prev.B[1]; next.L[2] = prev.B[2];
          break;
        case 'D':
          next.D = rotateCW(prev.D);
          next.F[6] = prev.L[6]; next.F[7] = prev.L[7]; next.F[8] = prev.L[8];
          next.R[6] = prev.F[6]; next.R[7] = prev.F[7]; next.R[8] = prev.F[8];
          next.B[6] = prev.R[6]; next.B[7] = prev.R[7]; next.B[8] = prev.R[8];
          next.L[6] = prev.B[6]; next.L[7] = prev.B[7]; next.L[8] = prev.B[8];
          break;
        case "D'":
          next.D = rotateCCW(prev.D);
          next.F[6] = prev.R[6]; next.F[7] = prev.R[7]; next.F[8] = prev.R[8];
          next.L[6] = prev.F[6]; next.L[7] = prev.F[7]; next.L[8] = prev.F[8];
          next.B[6] = prev.L[6]; next.B[7] = prev.L[7]; next.B[8] = prev.L[8];
          next.R[6] = prev.B[6]; next.R[7] = prev.B[7]; next.R[8] = prev.B[8];
          break;
        case 'R':
          next.R = rotateCW(prev.R);
          next.U[2] = prev.F[2]; next.U[5] = prev.F[5]; next.U[8] = prev.F[8];
          next.B[6] = prev.U[2]; next.B[3] = prev.U[5]; next.B[0] = prev.U[8];
          next.D[2] = prev.B[6]; next.D[5] = prev.B[3]; next.D[8] = prev.B[0];
          next.F[2] = prev.D[2]; next.F[5] = prev.D[5]; next.F[8] = prev.D[8];
          break;
        case "R'":
          next.R = rotateCCW(prev.R);
          next.U[2] = prev.B[6]; next.U[5] = prev.B[3]; next.U[8] = prev.B[0];
          next.F[2] = prev.U[2]; next.F[5] = prev.U[5]; next.F[8] = prev.U[8];
          next.D[2] = prev.F[2]; next.D[5] = prev.F[5]; next.D[8] = prev.F[8];
          next.B[6] = prev.D[2]; next.B[3] = prev.D[5]; next.B[0] = prev.D[8];
          break;
        case 'L':
          next.L = rotateCW(prev.L);
          next.U[0] = prev.B[8]; next.U[3] = prev.B[5]; next.U[6] = prev.B[2];
          next.F[0] = prev.U[0]; next.F[3] = prev.U[3]; next.F[6] = prev.U[6];
          next.D[0] = prev.F[0]; next.D[3] = prev.F[3]; next.D[6] = prev.F[6];
          next.B[8] = prev.D[0]; next.B[5] = prev.D[3]; next.B[2] = prev.D[6];
          break;
        case "L'":
          next.L = rotateCCW(prev.L);
          next.U[0] = prev.F[0]; next.U[3] = prev.F[3]; next.U[6] = prev.F[6];
          next.B[8] = prev.U[0]; next.B[5] = prev.U[3]; next.B[2] = prev.U[6];
          next.D[0] = prev.B[8]; next.D[3] = prev.B[5]; next.D[6] = prev.B[2];
          next.F[0] = prev.D[0]; next.F[3] = prev.D[3]; next.F[6] = prev.D[6];
          break;
        case 'F':
          next.F = rotateCW(prev.F);
          next.U[6] = prev.L[8]; next.U[7] = prev.L[5]; next.U[8] = prev.L[2];
          next.R[0] = prev.U[6]; next.R[3] = prev.U[7]; next.R[6] = prev.U[8];
          next.D[2] = prev.R[0]; next.D[1] = prev.R[3]; next.D[0] = prev.R[6];
          next.L[8] = prev.D[2]; next.L[5] = prev.D[1]; next.L[2] = prev.D[0];
          break;
        case "F'":
          next.F = rotateCCW(prev.F);
          next.L[8] = prev.U[6]; next.L[5] = prev.U[7]; next.L[2] = prev.U[8];
          next.D[2] = prev.L[8]; next.D[1] = prev.L[5]; next.D[0] = prev.L[2];
          next.R[0] = prev.D[2]; next.R[3] = prev.D[1]; next.R[6] = prev.D[0];
          next.U[6] = prev.R[0]; next.U[7] = prev.R[3]; next.U[8] = prev.R[6];
          break;
        case 'B':
          next.B = rotateCW(prev.B);
          next.U[0] = prev.R[2]; next.U[1] = prev.R[5]; next.U[2] = prev.R[8];
          next.L[6] = prev.U[0]; next.L[3] = prev.U[1]; next.L[0] = prev.U[2];
          next.D[8] = prev.L[6]; next.D[7] = prev.L[3]; next.D[6] = prev.L[0];
          next.R[2] = prev.D[8]; next.R[5] = prev.D[7]; next.R[8] = prev.D[6];
          break;
        case "B'":
          next.B = rotateCCW(prev.B);
          next.R[2] = prev.U[0]; next.R[5] = prev.U[1]; next.R[8] = prev.U[2];
          next.D[8] = prev.R[2]; next.D[7] = prev.R[5]; next.D[6] = prev.R[8];
          next.L[6] = prev.D[8]; next.L[3] = prev.D[7]; next.L[0] = prev.D[6];
          next.U[0] = prev.L[6]; next.U[1] = prev.L[3]; next.U[2] = prev.L[0];
          break;
      }

      return next;
    });
  };

  // Scramble cube with 15 random moves
  const handleScramble = () => {
    setIsAutoplay(false);
    const moves = ['U', "U'", 'D', "D'", 'R', "R'", 'L', "L'", 'F', "F'", 'B', "B'"];
    const sequence: string[] = [];
    for (let i = 0; i < 12; i++) {
      const randMove = moves[Math.floor(Math.random() * moves.length)];
      sequence.push(randMove);
    }

    // Apply scramble sequentially
    sequence.forEach(move => performMove(move));
    setScrambleMoves(sequence);

    // Build reversed solution steps
    const reversed = [...sequence].reverse().map(m => getOppositeMove(m));
    setSolutionSteps(reversed);
    setCurrentStepIdx(-1);
    setStatusMsg('Cube scrambled! Follow the glowing face or use the Autoplay guide.');
  };

  const handleNextSolveStep = () => {
    if (currentStepIdx < solutionSteps.length - 1) {
      const nextIdx = currentStepIdx + 1;
      const move = solutionSteps[nextIdx];
      performMove(move);
      setCurrentStepIdx(nextIdx);
      setStatusMsg(`Step ${nextIdx + 1}/${solutionSteps.length}: Execute ${move}`);
    } else {
      setIsAutoplay(false);
      setStatusMsg('Cube is fully solved! Great job.');
    }
  };

  const handlePrevSolveStep = () => {
    setIsAutoplay(false);
    if (currentStepIdx >= 0) {
      const move = solutionSteps[currentStepIdx];
      const inverse = getOppositeMove(move);
      performMove(inverse);
      setCurrentStepIdx(currentStepIdx - 1);
      setStatusMsg(currentStepIdx > 0 ? `Went back. Next step: ${solutionSteps[currentStepIdx]}` : 'Ready to start solving.');
    }
  };

  // Autoplay handler
  useEffect(() => {
    let timer: any = null;
    if (isAutoplay && currentStepIdx < solutionSteps.length - 1) {
      timer = setTimeout(() => {
        handleNextSolveStep();
      }, autoplaySpeed);
    } else if (currentStepIdx >= solutionSteps.length - 1) {
      setIsAutoplay(false);
    }
    return () => clearTimeout(timer);
  }, [isAutoplay, currentStepIdx, solutionSteps, autoplaySpeed]);

  const handleStickerClick = (face: keyof CubeState, idx: number) => {
    setCube((prev) => {
      const next = { ...prev };
      next[face] = [...prev[face]];
      next[face][idx] = selectedColor;
      return next;
    });
  };

  const handleReset = () => {
    setIsAutoplay(false);
    setCube({
      U: Array(9).fill('W'),
      D: Array(9).fill('Y'),
      L: Array(9).fill('O'),
      R: Array(9).fill('R'),
      F: Array(9).fill('G'),
      B: Array(9).fill('B')
    });
    setScrambleMoves([]);
    setSolutionSteps([]);
    setCurrentStepIdx(-1);
    setStatusMsg('Cube reset to solved state.');
  };

  // Drag listeners to rotate 3D view
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsRotating(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isRotating) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotation(prev => ({
      x: prev.x - dy * 0.5,
      y: prev.y + dx * 0.5
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsRotating(false);
  };

  // Validate state
  const counts: Record<string, number> = { W: 0, Y: 0, O: 0, R: 0, G: 0, B: 0 };
  Object.values(cube).forEach(face => {
    face.forEach(col => {
      if (counts[col] !== undefined) counts[col]++;
    });
  });

  const isInvalid = Object.values(counts).some(cnt => cnt !== 9);

  // Identify next face to turn for visual glow guide
  const nextMove = currentStepIdx < solutionSteps.length - 1 ? solutionSteps[currentStepIdx + 1] : null;
  const nextFace = nextMove ? nextMove[0] : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Visual Collapsible Notation Guide */}
      <div className="glass-panel border border-white/10 rounded-3xl overflow-hidden">
        <button
          onClick={() => setShowNotationGuide(!showNotationGuide)}
          className="w-full px-5 py-3.5 flex items-center justify-between font-bold text-xs text-slate-300 hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-2">
            📖 How to Read Rubik's Cube Notation & Solve
          </span>
          <span className="text-[10px] text-accent uppercase tracking-wider">{showNotationGuide ? 'Hide Guide' : 'Show Guide'}</span>
        </button>

        {showNotationGuide && (
          <div className="p-5 border-t border-white/10 bg-black/40 text-xs text-slate-300 space-y-3 leading-relaxed">
            <p>Standard Rubik's cube notation uses single letters to represent the 6 faces. When a move is shown, turn that face 90 degrees:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-[11px] mt-2">
              <div className="p-2.5 glass-panel rounded-xl border border-white/5"><span className="text-accent font-bold">U (Up)</span>: Rotate top layer to the left.</div>
              <div className="p-2.5 glass-panel rounded-xl border border-white/5"><span className="text-accent font-bold">D (Down)</span>: Rotate bottom layer to the right.</div>
              <div className="p-2.5 glass-panel rounded-xl border border-white/5"><span className="text-accent font-bold">R (Right)</span>: Rotate right column upwards.</div>
              <div className="p-2.5 glass-panel rounded-xl border border-white/5"><span className="text-accent font-bold">L (Left)</span>: Rotate left column downwards.</div>
              <div className="p-2.5 glass-panel rounded-xl border border-white/5"><span className="text-accent font-bold">F (Front)</span>: Rotate front layer to the right.</div>
              <div className="p-2.5 glass-panel rounded-xl border border-white/5"><span className="text-accent font-bold">B (Back)</span>: Rotate back layer to the left.</div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 bg-accent/5 p-2 rounded-xl border border-accent/15">
              💡 **What is the Prime (') symbol?** A prime symbol (like <strong className="text-accent">R'</strong>) means rotate that face <strong>Counter-Clockwise (opposite direction)</strong>. Turn the right column downwards instead of upwards!
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: 3D Render Window with dynamic face glows */}
        <div className="md:col-span-1 flex flex-col items-center space-y-4">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">3D Interactive Preview</span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Drag to rotate • Glowing face indicates next move</span>
          </div>
          
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-64 h-64 glass-panel border border-white/10 rounded-3xl flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden relative"
            style={{ perspective: '800px' }}
          >
            {/* Soft Shadow */}
            <div className="absolute bottom-6 w-28 h-3.5 bg-black/75 rounded-full blur-lg pointer-events-none animate-pulse" />

            {/* 3D Cube container */}
            <div
              className="w-32 h-32 relative transition-transform duration-100"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
              }}
            >
              {/* Up Face */}
              <div
                className="absolute w-32 h-32 bg-slate-950 p-1.5 grid grid-cols-3 gap-1 rounded-2xl border transition-all duration-300"
                style={{
                  transform: 'rotateX(90deg) translateZ(64px)',
                  backfaceVisibility: 'hidden',
                  border: nextFace === 'U' ? '3px solid #06b6d4' : '1px solid black',
                  boxShadow: nextFace === 'U' ? '0 0 20px #06b6d4, inset 0 0 10px #06b6d4' : ''
                }}
              >
                {cube.U.map((c, i) => (
                  <div
                    key={`u-${i}`}
                    className="w-full h-full rounded-md border border-black/45 relative overflow-hidden shadow-[inset_0_1.5px_3px_rgba(255,255,255,0.2)]"
                    style={{ backgroundColor: colorMap[c] }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/35 pointer-events-none" />
                  </div>
                ))}
              </div>

              {/* Front Face */}
              <div
                className="absolute w-32 h-32 bg-slate-950 p-1.5 grid grid-cols-3 gap-1 rounded-2xl border transition-all duration-300"
                style={{
                  transform: 'rotateY(0deg) translateZ(64px)',
                  backfaceVisibility: 'hidden',
                  border: nextFace === 'F' ? '3px solid #06b6d4' : '1px solid black',
                  boxShadow: nextFace === 'F' ? '0 0 20px #06b6d4, inset 0 0 10px #06b6d4' : ''
                }}
              >
                {cube.F.map((c, i) => (
                  <div
                    key={`f-${i}`}
                    className="w-full h-full rounded-md border border-black/45 relative overflow-hidden shadow-[inset_0_1.5px_3px_rgba(255,255,255,0.2)]"
                    style={{ backgroundColor: colorMap[c] }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/35 pointer-events-none" />
                  </div>
                ))}
              </div>

              {/* Right Face */}
              <div
                className="absolute w-32 h-32 bg-slate-950 p-1.5 grid grid-cols-3 gap-1 rounded-2xl border transition-all duration-300"
                style={{
                  transform: 'rotateY(90deg) translateZ(64px)',
                  backfaceVisibility: 'hidden',
                  border: nextFace === 'R' ? '3px solid #06b6d4' : '1px solid black',
                  boxShadow: nextFace === 'R' ? '0 0 20px #06b6d4, inset 0 0 10px #06b6d4' : ''
                }}
              >
                {cube.R.map((c, i) => (
                  <div
                    key={`r-${i}`}
                    className="w-full h-full rounded-md border border-black/45 relative overflow-hidden shadow-[inset_0_1.5px_3px_rgba(255,255,255,0.2)]"
                    style={{ backgroundColor: colorMap[c] }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/35 pointer-events-none" />
                  </div>
                ))}
              </div>

              {/* Left Face */}
              <div
                className="absolute w-32 h-32 bg-slate-950 p-1.5 grid grid-cols-3 gap-1 rounded-2xl border transition-all duration-300"
                style={{
                  transform: 'rotateY(-90deg) translateZ(64px)',
                  backfaceVisibility: 'hidden',
                  border: nextFace === 'L' ? '3px solid #06b6d4' : '1px solid black',
                  boxShadow: nextFace === 'L' ? '0 0 20px #06b6d4, inset 0 0 10px #06b6d4' : ''
                }}
              >
                {cube.L.map((c, i) => (
                  <div
                    key={`l-${i}`}
                    className="w-full h-full rounded-md border border-black/45 relative overflow-hidden shadow-[inset_0_1.5px_3px_rgba(255,255,255,0.2)]"
                    style={{ backgroundColor: colorMap[c] }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/35 pointer-events-none" />
                  </div>
                ))}
              </div>

              {/* Back Face */}
              <div
                className="absolute w-32 h-32 bg-slate-950 p-1.5 grid grid-cols-3 gap-1 rounded-2xl border transition-all duration-300"
                style={{
                  transform: 'rotateY(180deg) translateZ(64px)',
                  backfaceVisibility: 'hidden',
                  border: nextFace === 'B' ? '3px solid #06b6d4' : '1px solid black',
                  boxShadow: nextFace === 'B' ? '0 0 20px #06b6d4, inset 0 0 10px #06b6d4' : ''
                }}
              >
                {cube.B.map((c, i) => (
                  <div
                    key={`b-${i}`}
                    className="w-full h-full rounded-md border border-black/45 relative overflow-hidden shadow-[inset_0_1.5px_3px_rgba(255,255,255,0.2)]"
                    style={{ backgroundColor: colorMap[c] }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/35 pointer-events-none" />
                  </div>
                ))}
              </div>

              {/* Down Face */}
              <div
                className="absolute w-32 h-32 bg-slate-950 p-1.5 grid grid-cols-3 gap-1 rounded-2xl border transition-all duration-300"
                style={{
                  transform: 'rotateX(-90deg) translateZ(64px)',
                  backfaceVisibility: 'hidden',
                  border: nextFace === 'D' ? '3px solid #06b6d4' : '1px solid black',
                  boxShadow: nextFace === 'D' ? '0 0 20px #06b6d4, inset 0 0 10px #06b6d4' : ''
                }}
              >
                {cube.D.map((c, i) => (
                  <div
                    key={`d-${i}`}
                    className="w-full h-full rounded-md border border-black/45 relative overflow-hidden shadow-[inset_0_1.5px_3px_rgba(255,255,255,0.2)]"
                    style={{ backgroundColor: colorMap[c] }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/35 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full">
            <button onClick={handleScramble} className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-accent text-slate-950 shadow-md">
              Scramble Cube
            </button>
            <button onClick={handleReset} className="px-4 py-2.5 text-xs font-bold rounded-xl bg-white/5 border border-white/10 text-slate-300">
              Reset
            </button>
          </div>
        </div>

        {/* Center/Right: Unfolded 2D Net Editor & Interactive color palette */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unfolded Flat net Editor</span>
            <div className="flex items-center gap-1.5">
              {Object.keys(colorMap).map(col => (
                <button
                  key={col}
                  onClick={() => setSelectedColor(col)}
                  className={`w-5 h-5 rounded-lg border transition-all ${selectedColor === col ? 'scale-125 border-white ring-2 ring-accent/40' : 'border-white/20'}`}
                  style={{ backgroundColor: colorMap[col] }}
                />
              ))}
            </div>
          </div>

          <div className="p-4 glass-panel rounded-3xl border border-white/10 flex flex-col items-center justify-center space-y-1.5">
            {/* Row 1: U Face */}
            <div
              className="grid grid-cols-3 gap-0.5 border p-1 rounded-xl bg-black/40 transition-all duration-300"
              style={{ border: nextFace === 'U' ? '2.5px solid #06b6d4' : '1px solid rgba(255,255,255,0.15)' }}
            >
              {cube.U.map((c, idx) => (
                <button key={`u-net-${idx}`} onClick={() => handleStickerClick('U', idx)} className="w-6 h-6 rounded-md transition-colors" style={{ backgroundColor: colorMap[c] }} />
              ))}
            </div>

            {/* Row 2: L, F, R, B Adjacent Faces */}
            <div className="flex gap-2">
              <div
                className="grid grid-cols-3 gap-0.5 border p-1 rounded-xl bg-black/40 transition-all duration-300"
                style={{ border: nextFace === 'L' ? '2.5px solid #06b6d4' : '1px solid rgba(255,255,255,0.15)' }}
              >
                {cube.L.map((c, idx) => (
                  <button key={`l-net-${idx}`} onClick={() => handleStickerClick('L', idx)} className="w-6 h-6 rounded-md transition-colors" style={{ backgroundColor: colorMap[c] }} />
                ))}
              </div>
              <div
                className="grid grid-cols-3 gap-0.5 border p-1 rounded-xl bg-black/40 transition-all duration-300"
                style={{ border: nextFace === 'F' ? '2.5px solid #06b6d4' : '1px solid rgba(255,255,255,0.15)' }}
              >
                {cube.F.map((c, idx) => (
                  <button key={`f-net-${idx}`} onClick={() => handleStickerClick('F', idx)} className="w-6 h-6 rounded-md transition-colors" style={{ backgroundColor: colorMap[c] }} />
                ))}
              </div>
              <div
                className="grid grid-cols-3 gap-0.5 border p-1 rounded-xl bg-black/40 transition-all duration-300"
                style={{ border: nextFace === 'R' ? '2.5px solid #06b6d4' : '1px solid rgba(255,255,255,0.15)' }}
              >
                {cube.R.map((c, idx) => (
                  <button key={`r-net-${idx}`} onClick={() => handleStickerClick('R', idx)} className="w-6 h-6 rounded-md transition-colors" style={{ backgroundColor: colorMap[c] }} />
                ))}
              </div>
              <div
                className="grid grid-cols-3 gap-0.5 border p-1 rounded-xl bg-black/40 transition-all duration-300"
                style={{ border: nextFace === 'B' ? '2.5px solid #06b6d4' : '1px solid rgba(255,255,255,0.15)' }}
              >
                {cube.B.map((c, idx) => (
                  <button key={`b-net-${idx}`} onClick={() => handleStickerClick('B', idx)} className="w-6 h-6 rounded-md transition-colors" style={{ backgroundColor: colorMap[c] }} />
                ))}
              </div>
            </div>

            {/* Row 3: D Face */}
            <div
              className="grid grid-cols-3 gap-0.5 border p-1 rounded-xl bg-black/40 transition-all duration-300"
              style={{ border: nextFace === 'D' ? '2.5px solid #06b6d4' : '1px solid rgba(255,255,255,0.15)' }}
            >
              {cube.D.map((c, idx) => (
                <button key={`d-net-${idx}`} onClick={() => handleStickerClick('D', idx)} className="w-6 h-6 rounded-md transition-colors" style={{ backgroundColor: colorMap[c] }} />
              ))}
            </div>
          </div>

          <div className="p-3 text-center rounded-2xl glass-panel text-xs text-slate-300 border border-white/5 font-medium leading-relaxed">
            {statusMsg}
            {isInvalid && (
              <span className="block text-[10px] text-rose-400 font-bold mt-1 uppercase">
                ⚠️ Warning: Color counts are unbalanced. Must have exactly 9 of each color.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Solver Steps timeline & Autoplay panel */}
      {solutionSteps.length > 0 && (
        <div className="p-5 glass-panel rounded-3xl border border-accent/30 bg-accent/5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <span className="text-xs font-bold text-slate-300 block">Autosolver Step-by-Step Moves Player</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Follow instructions to solve the cube. Glowing layers point to the next turn.</span>
            </div>
            
            {/* Autoplay controllers */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Autoplay Speed:</span>
              <select
                value={autoplaySpeed}
                onChange={(e) => setAutoplaySpeed(Number(e.target.value))}
                className="bg-black/60 rounded-xl px-2.5 py-1.5 font-mono text-[10px] text-accent border border-white/10"
              >
                <option value={2800}>Slow (2.8s)</option>
                <option value={1800}>Normal (1.8s)</option>
                <option value={1000}>Fast (1.0s)</option>
              </select>
              <button
                onClick={() => setIsAutoplay(!isAutoplay)}
                className={`px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase shadow-md transition-colors ${
                  isAutoplay ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'
                }`}
              >
                {isAutoplay ? '⏸ Pause' : '▶ Autoplay'}
              </button>
            </div>
          </div>

          {/* Current Step Instruction Description Box */}
          {nextMove && (
            <div className="p-4 bg-accent/15 border border-accent/30 rounded-2xl text-center space-y-1.5 animate-pulse">
              <span className="text-[9px] font-black uppercase text-accent tracking-wider">Next Step Instruction</span>
              <h4 className="text-sm font-black text-slate-100 font-mono">Move: {nextMove}</h4>
              <p className="text-xs text-emerald-400 font-bold">{getMoveDescription(nextMove)}</p>
            </div>
          )}

          {/* Moves Timeline Track */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-2">
            {solutionSteps.map((step, idx) => (
              <span
                key={idx}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold shrink-0 border transition-all ${
                  idx === currentStepIdx
                    ? 'bg-accent text-slate-950 border-accent scale-110 shadow-lg'
                    : idx < currentStepIdx
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 opacity-60'
                    : 'glass-panel border-white/10 text-slate-400'
                }`}
              >
                {step}
              </span>
            ))}
          </div>

          {/* Manual steps controls */}
          <div className="flex gap-2">
            <button
              onClick={handlePrevSolveStep}
              disabled={currentStepIdx < 0}
              className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-bold disabled:opacity-30 hover:bg-white/10"
            >
              ⬅ Prev Step
            </button>
            <button
              onClick={handleNextSolveStep}
              disabled={currentStepIdx >= solutionSteps.length - 1}
              className="flex-1 py-2.5 rounded-xl bg-accent text-slate-950 text-xs font-black shadow-lg disabled:opacity-30"
            >
              Solve Next Step ➡
            </button>
          </div>
        </div>
      )}

      {/* Manual layer rotation move triggers */}
      <div className="p-4 glass-panel rounded-3xl border border-white/10 space-y-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Manual Layer Rotations</span>
        <div className="grid grid-cols-6 gap-2">
          {['U', 'D', 'R', 'L', 'F', 'B'].map(move => (
            <div key={move} className="flex flex-col gap-1.5">
              <button onClick={() => performMove(move)} className="py-2 rounded-xl bg-accent/25 border border-accent/40 text-accent font-bold text-xs hover:bg-accent/40">{move}</button>
              <button onClick={() => performMove(`${move}'`)} className="py-2 rounded-xl glass-panel border border-white/10 text-slate-300 font-bold text-xs hover:bg-white/10">{move}'</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

