
import React, { useState } from 'react';
import { MoodEntry, JournalEntry, Mood } from '../types';

interface HistoryProps {
  moodEntries: MoodEntry[];
  journalEntries: JournalEntry[];
}

const moodEmojis: Record<Mood, string> = {
  excellent: '✨',
  good: '😊',
  neutral: '😐',
  down: '😔',
  struggling: '😥',
};

const History: React.FC<HistoryProps> = ({ moodEntries, journalEntries }) => {
  const [tab, setTab] = useState<'moods' | 'journals'>('moods');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold font-brand text-slate-800">Your Journey</h2>
        <p className="text-slate-500 mt-1">Look back at how far you've come.</p>
      </header>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setTab('moods')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            tab === 'moods' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Mood History
        </button>
        <button
          onClick={() => setTab('journals')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            tab === 'journals' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Journal Logs
        </button>
      </div>

      <div className="space-y-4">
        {tab === 'moods' ? (
          moodEntries.length > 0 ? (
            moodEntries.map((entry) => (
              <div key={entry.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-start gap-6 hover:shadow-md transition-shadow">
                <div className="text-4xl">{moodEmojis[entry.mood]}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-800 capitalize">{entry.mood}</h4>
                    <time className="text-xs font-medium text-slate-400">
                      {new Date(entry.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </time>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{entry.note || <span className="italic opacity-40">No reflection added</span>}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <i className="fa-solid fa-calendar-xmark text-4xl text-slate-200 mb-4"></i>
              <p className="text-slate-400">No mood entries found.</p>
            </div>
          )
        ) : (
          journalEntries.length > 0 ? (
            journalEntries.map((entry) => (
              <div key={entry.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-800 text-lg">{entry.title}</h4>
                  <time className="text-xs font-medium text-slate-400">
                    {new Date(entry.date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                  </time>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{entry.content}</p>
                <button className="mt-4 text-xs font-bold text-indigo-600 hover:underline">Read full entry</button>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <i className="fa-solid fa-book-open text-4xl text-slate-200 mb-4"></i>
              <p className="text-slate-400">Your journal is currently empty.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default History;
