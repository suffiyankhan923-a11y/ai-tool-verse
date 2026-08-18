import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Shuffle,
  Sparkles,
  Save,
  Download,
  Calendar,
  Clock,
  Flame,
  Check,
  Copy,
  FileText,
  Flag,
} from 'lucide-react';

export const ProductivitySuite: React.FC<{
  toolType:
    | 'pomodoro'
    | 'countdown'
    | 'stopwatch'
    | 'habits'
    | 'decision'
    | 'todo'
    | 'notes';
}> = ({ toolType }) => {
  // 1. POMODORO TIMER
  const [pomoMode, setPomoMode] = useState<'work' | 'short' | 'long'>('work');
  const [pomoSecondsLeft, setPomoSecondsLeft] = useState(25 * 60);
  const [pomoIsRunning, setPomoIsRunning] = useState(false);
  const [pomoCycles, setPomoCycles] = useState(0);

  useEffect(() => {
    let timer: any = null;
    if (pomoIsRunning && pomoSecondsLeft > 0) {
      timer = setInterval(() => {
        setPomoSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (pomoSecondsLeft === 0 && pomoIsRunning) {
      setPomoIsRunning(false);
      if (pomoMode === 'work') {
        setPomoCycles((c) => c + 1);
        setPomoMode('short');
        setPomoSecondsLeft(5 * 60);
      } else {
        setPomoMode('work');
        setPomoSecondsLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [pomoIsRunning, pomoSecondsLeft, pomoMode]);

  const setPomoType = (mode: 'work' | 'short' | 'long') => {
    setPomoMode(mode);
    setPomoIsRunning(false);
    if (mode === 'work') setPomoSecondsLeft(25 * 60);
    if (mode === 'short') setPomoSecondsLeft(5 * 60);
    if (mode === 'long') setPomoSecondsLeft(15 * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 2. STOPWATCH
  const [swTimeMs, setSwTimeMs] = useState(0);
  const [swIsRunning, setSwIsRunning] = useState(false);
  const [swLaps, setSwLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: any = null;
    if (swIsRunning) {
      const startTime = Date.now() - swTimeMs;
      interval = setInterval(() => {
        setSwTimeMs(Date.now() - startTime);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [swIsRunning]);

  const formatSwTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const hundredths = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
  };

  const handleLap = () => {
    if (swIsRunning) {
      setSwLaps((prev) => [swTimeMs, ...prev]);
    }
  };

  // 3. COUNTDOWN TIMER
  const [eventName, setEventName] = useState('New Year 2027');
  const [targetDateTime, setTargetDateTime] = useState('2027-01-01T00:00');
  const [cdDays, setCdDays] = useState(0);
  const [cdHours, setCdHours] = useState(0);
  const [cdMins, setCdMins] = useState(0);
  const [cdSecs, setCdSecs] = useState(0);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(targetDateTime).getTime();
      const diff = Math.max(0, target - now);

      setCdDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
      setCdHours(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      setCdMins(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
      setCdSecs(Math.floor((diff % (1000 * 60)) / 1000));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDateTime]);

  // 4. HABIT TRACKER
  const [habits, setHabits] = useState<
    { id: string; name: string; days: boolean[] }[]
  >(() => {
    const saved = localStorage.getItem('toolverse_habits');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: '1', name: 'Drink 2.5L Water', days: [true, true, true, false, true, false, true] },
      { id: '2', name: '30m Workout / Cardio', days: [true, false, true, true, true, false, false] },
      { id: '3', name: 'Read 15 Pages', days: [true, true, true, true, true, true, false] },
    ];
  });
  const [newHabitName, setNewHabitName] = useState('');

  const saveHabits = (newHabits: typeof habits) => {
    setHabits(newHabits);
    localStorage.setItem('toolverse_habits', JSON.stringify(newHabits));
  };

  const toggleHabitDay = (habitId: string, dayIndex: number) => {
    const updated = habits.map((h) => {
      if (h.id === habitId) {
        const d = [...h.days];
        d[dayIndex] = !d[dayIndex];
        return { ...h, days: d };
      }
      return h;
    });
    saveHabits(updated);
  };

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    const newH = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      days: [false, false, false, false, false, false, false],
    };
    saveHabits([...habits, newH]);
    setNewHabitName('');
  };

  const deleteHabit = (id: string) => {
    saveHabits(habits.filter((h) => h.id !== id));
  };

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // 5. RANDOM DECISION MAKER
  const [decisionQuestion, setDecisionQuestion] = useState('What should I cook for dinner?');
  const [optionsList, setOptionsList] = useState('Italian Pasta\nJapanese Sushi\nGrilled Chicken Salad\nThai Curry\nTacos');
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const makeDecision = () => {
    const opts = optionsList
      .split('\n')
      .map((o) => o.trim())
      .filter(Boolean);
    if (opts.length === 0) return;

    setIsSpinning(true);
    let counter = 0;
    const interval = setInterval(() => {
      const rand = opts[Math.floor(Math.random() * opts.length)];
      setSelectedDecision(rand);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 80);
  };

  // 6. TODO LIST
  const [todos, setTodos] = useState<{ id: string; text: string; completed: boolean; priority: 'low' | 'medium' | 'high' }[]>(() => {
    const saved = localStorage.getItem('toolverse_todos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: '1', text: 'Review quarterly financial report', completed: false, priority: 'high' },
      { id: '2', text: 'Send project updates to client', completed: true, priority: 'medium' },
      { id: '3', text: 'Backup database and verify logs', completed: false, priority: 'high' },
    ];
  });
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const saveTodos = (newT: typeof todos) => {
    setTodos(newT);
    localStorage.setItem('toolverse_todos', JSON.stringify(newT));
  };

  const addTodo = () => {
    if (!newTodoText.trim()) return;
    saveTodos([
      ...todos,
      { id: Date.now().toString(), text: newTodoText.trim(), completed: false, priority: newTodoPriority },
    ]);
    setNewTodoText('');
  };

  const toggleTodo = (id: string) => {
    saveTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id: string) => {
    saveTodos(todos.filter((t) => t.id !== id));
  };

  // 7. NOTES & SCRATCHPAD
  const [noteContent, setNoteContent] = useState<string>(() => {
    return (
      localStorage.getItem('toolverse_note') ||
      `# ToolVerse Quick Scratchpad

- Auto-saves instantly to your local browser storage.
- Zero server sync ensures 100% private notes.
- Click download to save as .txt or .md.

## Action Items
1. Complete design review
2. Finalize client specifications`
    );
  });
  const [noteSaved, setNoteSaved] = useState(false);

  const handleNoteChange = (text: string) => {
    setNoteContent(text);
    localStorage.setItem('toolverse_note', text);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1500);
  };

  const downloadNote = () => {
    const blob = new Blob([noteContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quick-note.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. POMODORO */}
      {toolType === 'pomodoro' && (
        <div className="max-w-xl mx-auto p-6 md:p-8 rounded-3xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-2xl text-center space-y-6">
          <div className="flex justify-center gap-2">
            {[
              { id: 'work', label: 'Focus (25m)' },
              { id: 'short', label: 'Short Break (5m)' },
              { id: 'long', label: 'Long Break (15m)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPomoType(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  pomoMode === tab.id
                    ? 'bg-[#D4AF37] text-[#050810] shadow-md shadow-[#D4AF37]/20'
                    : 'bg-[#161E31] text-[#94A3B8] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-6">
            <span className="text-6xl md:text-7xl font-extrabold font-mono text-white tracking-wider">
              {formatTime(pomoSecondsLeft)}
            </span>
            <span className="text-xs text-[#94A3B8] block mt-2">
              Completed Focus Intervals: <strong className="text-[#D4AF37]">{pomoCycles}</strong>
            </span>
          </div>

          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setPomoIsRunning(!pomoIsRunning)}
              className={`px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
                pomoIsRunning
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-[#D4AF37] hover:bg-[#E5C158] text-[#050810] shadow-lg shadow-[#D4AF37]/25'
              }`}
            >
              {pomoIsRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{pomoIsRunning ? 'Pause Session' : 'Start Focus'}</span>
            </button>
            <button
              type="button"
              onClick={() => setPomoType(pomoMode)}
              className="p-3.5 rounded-2xl bg-[#161E31] hover:bg-[#1E293B] border border-[#D4AF37]/20 text-[#94A3B8] hover:text-white"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. STOPWATCH */}
      {toolType === 'stopwatch' && (
        <div className="max-w-xl mx-auto p-6 md:p-8 rounded-3xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-2xl text-center space-y-6">
          <div className="py-6">
            <span className="text-5xl md:text-6xl font-extrabold font-mono text-white tracking-tight">
              {formatSwTime(swTimeMs)}
            </span>
          </div>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setSwIsRunning(!swIsRunning)}
              className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 ${
                swIsRunning
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-[#D4AF37] hover:bg-[#E5C158] text-[#050810]'
              }`}
            >
              {swIsRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{swIsRunning ? 'Stop' : 'Start'}</span>
            </button>
            <button
              type="button"
              onClick={handleLap}
              disabled={!swIsRunning}
              className="px-5 py-3 rounded-2xl bg-[#161E31] hover:bg-[#1E293B] border border-[#D4AF37]/20 text-white font-bold text-sm disabled:opacity-40"
            >
              Lap
            </button>
            <button
              type="button"
              onClick={() => {
                setSwIsRunning(false);
                setSwTimeMs(0);
                setSwLaps([]);
              }}
              className="p-3 rounded-2xl bg-[#161E31] hover:bg-[#1E293B] border border-[#D4AF37]/20 text-[#94A3B8] hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {swLaps.length > 0 && (
            <div className="mt-6 pt-4 border-t border-[#D4AF37]/15 max-h-48 overflow-y-auto space-y-2 text-xs font-mono text-left">
              {swLaps.map((lap, idx) => (
                <div key={idx} className="flex justify-between px-3 py-1.5 rounded-lg bg-[#161E31]">
                  <span className="text-[#94A3B8]">Lap #{swLaps.length - idx}</span>
                  <span className="text-white font-bold">{formatSwTime(lap)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. COUNTDOWN TIMER */}
      {toolType === 'countdown' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Target Event Title</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Target Date & Time</label>
                <input
                  type="datetime-local"
                  value={targetDateTime}
                  onChange={(e) => setTargetDateTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold text-sm"
                />
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1E] border border-[#D4AF37]/30 text-center shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 font-serif">{eventName || 'Countdown'}</h3>
            <div className="grid grid-cols-4 gap-3 md:gap-4">
              <div className="p-4 rounded-2xl bg-[#161E31] border border-[#D4AF37]/20">
                <span className="text-3xl md:text-5xl font-extrabold text-[#D4AF37] font-mono block">
                  {cdDays}
                </span>
                <span className="text-[11px] text-[#94A3B8] font-bold uppercase tracking-wider mt-1 block">
                  Days
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#161E31] border border-[#D4AF37]/20">
                <span className="text-3xl md:text-5xl font-extrabold text-white font-mono block">
                  {cdHours}
                </span>
                <span className="text-[11px] text-[#94A3B8] font-bold uppercase tracking-wider mt-1 block">
                  Hours
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#161E31] border border-[#D4AF37]/20">
                <span className="text-3xl md:text-5xl font-extrabold text-white font-mono block">
                  {cdMins}
                </span>
                <span className="text-[11px] text-[#94A3B8] font-bold uppercase tracking-wider mt-1 block">
                  Mins
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#161E31] border border-[#D4AF37]/20">
                <span className="text-3xl md:text-5xl font-extrabold text-amber-400 font-mono block">
                  {cdSecs}
                </span>
                <span className="text-[11px] text-[#94A3B8] font-bold uppercase tracking-wider mt-1 block">
                  Secs
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. HABIT TRACKER */}
      {toolType === 'habits' && (
        <div className="space-y-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addHabit()}
              placeholder="Add a new daily habit (e.g. Read 20 pages, Gym)..."
              className="flex-1 px-4 py-3 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 text-white placeholder:text-[#64748B] text-sm focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              type="button"
              onClick={addHabit}
              className="px-5 py-3 rounded-2xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#050810] font-bold text-sm flex items-center gap-1.5 shadow-md shadow-[#D4AF37]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Habit</span>
            </button>
          </div>

          <div className="p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg space-y-4">
            <div className="grid grid-cols-12 text-xs font-bold text-[#94A3B8] uppercase tracking-wider pb-2 border-b border-[#D4AF37]/15">
              <span className="col-span-5">Habit Routine</span>
              <div className="col-span-6 grid grid-cols-7 text-center">
                {DAYS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <span className="col-span-1 text-right">Action</span>
            </div>

            <div className="space-y-3">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="grid grid-cols-12 items-center p-3 rounded-xl bg-[#161E31] border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all"
                >
                  <span className="col-span-5 text-sm font-semibold text-white truncate pr-2">
                    {habit.name}
                  </span>
                  <div className="col-span-6 grid grid-cols-7 gap-1">
                    {habit.days.map((checked, dIdx) => (
                      <button
                        key={dIdx}
                        type="button"
                        onClick={() => toggleHabitDay(habit.id, dIdx)}
                        className={`h-7 w-full rounded-lg flex items-center justify-center transition-all ${
                          checked
                            ? 'bg-[#D4AF37] text-[#050810] font-bold shadow-sm'
                            : 'bg-[#0F172A] border border-[#D4AF37]/20 text-transparent hover:border-[#D4AF37]/60'
                        }`}
                      >
                        ✓
                      </button>
                    ))}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => deleteHabit(habit.id)}
                      className="p-1 text-[#64748B] hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. RANDOM DECISION MAKER */}
      {toolType === 'decision' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Your Question / Dilemma</label>
              <input
                type="text"
                value={decisionQuestion}
                onChange={(e) => setDecisionQuestion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-semibold text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] block mb-1">
                Choices & Options (One per line)
              </label>
              <textarea
                rows={6}
                value={optionsList}
                onChange={(e) => setOptionsList(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white text-sm leading-relaxed font-sans"
              />
            </div>
            <button
              type="button"
              onClick={makeDecision}
              disabled={isSpinning}
              className="w-full py-3.5 rounded-2xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#050810] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/25 transition-all"
            >
              <Shuffle className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Selecting...' : 'Pick a Choice at Random'}</span>
            </button>
          </div>

          <div className="md:col-span-6 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1E] border border-[#D4AF37]/20 shadow-xl flex flex-col justify-center items-center text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
              Decision Result
            </span>
            <div className="py-6 min-h-[140px] flex items-center justify-center">
              {selectedDecision ? (
                <div className="animate-in fade-in zoom-in duration-300">
                  <span className="text-3xl md:text-4xl font-extrabold text-white font-serif block">
                    ✨ {selectedDecision} ✨
                  </span>
                  <span className="text-xs text-[#94A3B8] block mt-2">
                    Decision finalized for "{decisionQuestion}"
                  </span>
                </div>
              ) : (
                <p className="text-sm text-[#64748B]">Click the button to let the generator decide!</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. TODO LIST */}
      {toolType === 'todo' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 text-white placeholder:text-[#64748B] text-sm focus:outline-none focus:border-[#D4AF37]"
            />
            <select
              value={newTodoPriority}
              onChange={(e) => setNewTodoPriority(e.target.value as any)}
              className="px-3 py-3 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 text-white text-xs font-semibold"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium</option>
              <option value="high">High Priority</option>
            </select>
            <button
              type="button"
              onClick={addTodo}
              className="px-5 py-3 rounded-2xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#050810] font-bold text-sm flex items-center gap-1 shadow-md shadow-[#D4AF37]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg space-y-3">
            <div className="flex justify-between items-center text-xs text-[#94A3B8] pb-2 border-b border-[#D4AF37]/15">
              <span>
                Pending Tasks: <strong className="text-white">{todos.filter((t) => !t.completed).length}</strong>
              </span>
              <button
                type="button"
                onClick={() => saveTodos(todos.filter((t) => !t.completed))}
                className="text-rose-400 hover:underline text-[11px]"
              >
                Clear Completed
              </button>
            </div>

            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    todo.completed
                      ? 'bg-[#0F172A]/50 border-white/5 opacity-60'
                      : 'bg-[#161E31] border-[#D4AF37]/15 hover:border-[#D4AF37]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleTodo(todo.id)}
                      className="text-[#D4AF37] hover:text-[#E5C158]"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="w-5 h-5 fill-[#D4AF37]/20 text-[#D4AF37]" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#64748B]" />
                      )}
                    </button>
                    <span
                      className={`text-sm font-medium ${
                        todo.completed ? 'line-through text-[#64748B]' : 'text-white'
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        todo.priority === 'high'
                          ? 'bg-rose-500/20 text-rose-400'
                          : todo.priority === 'medium'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {todo.priority}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1 text-[#64748B] hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. NOTES TOOL */}
      {toolType === 'notes' && (
        <div className="p-5 md:p-6 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/20 shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
              <span className="font-semibold text-white">Private Local Scratchpad</span>
              {noteSaved && <span className="text-emerald-400 font-bold">✓ Saved</span>}
            </div>
            <button
              type="button"
              onClick={downloadNote}
              className="px-3 py-1.5 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-xs font-semibold text-white hover:border-[#D4AF37] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .md</span>
            </button>
          </div>

          <textarea
            rows={14}
            value={noteContent}
            onChange={(e) => handleNoteChange(e.target.value)}
            className="w-full p-4 rounded-xl bg-[#161E31] border border-[#D4AF37]/20 text-white font-mono text-sm leading-relaxed focus:outline-none focus:border-[#D4AF37]"
            placeholder="Type your notes or Markdown here..."
          />

          <div className="flex justify-between text-xs text-[#64748B] pt-2 border-t border-[#D4AF37]/15">
            <span>
              {noteContent.trim().split(/\s+/).filter(Boolean).length} Words | {noteContent.length} Characters
            </span>
            <span>Stored in browser sandbox</span>
          </div>
        </div>
      )}
    </div>
  );
};
