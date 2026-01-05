
import React, { useState, useEffect } from 'react';
import { MoodEntry, Mood, View } from '../types';
// Fix: Renamed analyzeMoodReflection to getMoodReflection to match export in services/gemini.ts
import { getMoodReflection } from '../services/gemini';

interface DashboardProps {
  moodEntries: MoodEntry[];
  onAddMood: (mood: Mood, note: string) => void;
  onViewChange: (view: View) => void;
}

const moodEmojis: Record<Mood, string> = {
  excellent: '✨',
  good: '😊',
  neutral: '😐',
  down: '😔',
  struggling: '😥',
};

const Dashboard: React.FC<DashboardProps> = ({ moodEntries, onAddMood, onViewChange }) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'connecting' | 'online'>('connecting');

  useEffect(() => {
    const timer = setTimeout(() => setBackendStatus('online'), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    if (!selectedMood) return;
    setIsSubmitting(true);
    onAddMood(selectedMood, note);
    // Fix: Using getMoodReflection instead of analyzeMoodReflection
    const insight = await getMoodReflection(note || `Feeling ${selectedMood}`);
    setAiInsight(insight);
    setNote('');
    setSelectedMood(null);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold font-brand text-slate-800">Welcome back, Friend</h2>
          <p className="text-slate-500 mt-1">Take a moment for your mind today.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
          <div className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            AI Backend {backendStatus}
          </span>
        </div>
      </header>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <i className="fa-solid fa-heart text-rose-500"></i>
          How are you feeling right now?
        </h3>
        
        <div className="grid grid-cols-5 gap-4 mb-6">
          {(Object.keys(moodEmojis) as Mood[]).map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMood(m)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 ${
                selectedMood === m 
                  ? 'bg-indigo-50 border-2 border-indigo-500 scale-105' 
                  : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
              }`}
            >
              <span className="text-3xl">{moodEmojis[m]}</span>
              <span className="text-xs font-medium capitalize text-slate-600">{m}</span>
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="space-y-4 animate-in zoom-in-95 duration-200">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's contributing to your mood? (optional)"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
              rows={3}
            />
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Record Feeling'}
            </button>
          </div>
        )}

        {aiInsight && !selectedMood && (
          <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100 animate-in fade-in">
            <p className="text-sm font-medium text-indigo-800 italic">
              <i className="fa-solid fa-sparkles mr-2"></i>
              "{aiInsight}"
            </p>
          </div>
        )}
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <div 
          onClick={() => onViewChange('emotion_detect')}
          className="bg-slate-900 text-white rounded-2xl p-6 cursor-pointer hover:bg-slate-800 transition-all group overflow-hidden relative shadow-lg"
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Neural Scan</h3>
            <p className="text-slate-400 text-sm opacity-90">Let AI analyze your facial cues to understand your state.</p>
            <div className="mt-4 flex items-center gap-2 font-semibold text-indigo-400">
              Run Diagnostic <i className="fa-solid fa-microchip group-hover:rotate-90 transition-transform duration-500"></i>
            </div>
          </div>
          <i className="fa-solid fa-face-viewfinder text-8xl absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform"></i>
        </div>

        <div 
          onClick={() => onViewChange('video_call')}
          className="bg-indigo-600 text-white rounded-2xl p-6 cursor-pointer hover:bg-indigo-700 transition-all group overflow-hidden relative shadow-lg"
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Live Session</h3>
            <p className="text-indigo-100 text-sm opacity-90">Instant real-time video therapy with Serenity Pro.</p>
            <div className="mt-4 flex items-center gap-2 font-semibold">
              Connect Now <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </div>
          </div>
          <i className="fa-solid fa-video text-8xl absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform"></i>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800">Recent Activity</h3>
          <button onClick={() => onViewChange('history')} className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
        </div>
        <div className="space-y-3">
          {moodEntries.slice(0, 3).map((entry) => (
            <div key={entry.id} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4">
              <span className="text-2xl">{moodEmojis[entry.mood]}</span>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 capitalize">{entry.mood}</p>
                <p className="text-xs text-slate-500 truncate">{entry.note || 'No notes added'}</p>
              </div>
              <time className="text-xs font-medium text-slate-400">{new Date(entry.date).toLocaleDateString()}</time>
            </div>
          ))}
          {moodEntries.length === 0 && (
            <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center">
              <p className="text-slate-400 text-sm italic">No records yet. Start by sharing how you feel.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
