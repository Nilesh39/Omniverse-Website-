import React, { useState, useEffect } from 'react';
import { Notebook, Save } from 'lucide-react';
import { db } from '../../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export const NotesWidget: React.FC = () => {
  const latestNote = useLiveQuery(() => db.notes.orderBy('updatedAt').reverse().first(), []);
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (latestNote) {
      setContent(latestNote.content);
    }
  }, [latestNote]);

  const handleSave = async () => {
    if (latestNote && latestNote.id) {
      await db.notes.update(latestNote.id, {
        content,
        updatedAt: new Date().toISOString()
      });
    } else {
      await db.notes.add({
        title: 'Quick Note',
        content,
        updatedAt: new Date().toISOString(),
        pinned: true
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="glass-panel rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between h-full min-h-[220px] border border-white/10 group hover:border-accent/40 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-accent">
          <Notebook className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Quick Glass Notes</span>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-1 text-[11px] font-bold text-accent px-2.5 py-1 rounded-full bg-accent/15 hover:bg-accent/25 transition-all"
        >
          <Save className="w-3 h-3" /> {saved ? 'Saved!' : 'Save'}
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a quick offline note or todo list..."
        className="w-full flex-1 bg-black/20 rounded-2xl p-3 text-xs text-slate-200 placeholder-slate-500 border border-white/5 focus:outline-none focus:border-accent/40 resize-none font-mono"
      />
    </div>
  );
};
