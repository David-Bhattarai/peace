
import React, { useState, useEffect, useCallback } from 'react';
import { View, MoodEntry, JournalEntry, Mood } from './types';
import Dashboard from './components/Dashboard';
import ChatBot from './components/ChatBot';
import Breathing from './components/Breathing';
import Journal from './components/Journal';
import History from './components/History';
import Sidebar from './components/Sidebar';
import WellnessHub from './components/WellnessHub';
import LiveTherapy from './components/LiveTherapy';
import EmotionScanner from './components/EmotionScanner';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  // Load initial data
  useEffect(() => {
    const savedMoods = localStorage.getItem('serenity_moods');
    const savedJournal = localStorage.getItem('serenity_journal');
    if (savedMoods) setMoodEntries(JSON.parse(savedMoods));
    if (savedJournal) setJournalEntries(JSON.parse(savedJournal));
  }, []);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('serenity_moods', JSON.stringify(moodEntries));
  }, [moodEntries]);

  useEffect(() => {
    localStorage.setItem('serenity_journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  const handleAddMood = useCallback((mood: Mood, note: string) => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood,
      note,
    };
    setMoodEntries(prev => [newEntry, ...prev]);
  }, []);

  const handleAddJournal = useCallback((title: string, content: string) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title,
      content,
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard moodEntries={moodEntries} onAddMood={handleAddMood} onViewChange={setCurrentView} />;
      case 'chat':
        return <ChatBot />;
      case 'video_call':
        return <LiveTherapy />;
      case 'emotion_detect':
        return <EmotionScanner />;
      case 'breathe':
        return <Breathing />;
      case 'journal':
        return <Journal onSave={handleAddJournal} />;
      case 'tools':
        return <WellnessHub />;
      case 'history':
        return <History moodEntries={moodEntries} journalEntries={journalEntries} />;
      default:
        return <Dashboard moodEntries={moodEntries} onAddMood={handleAddMood} onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-y-auto relative p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {renderView()}
        </div>
        
        {/* Safety Disclaimer */}
        <footer className="mt-12 mb-6 text-center text-xs text-slate-400 max-w-2xl mx-auto">
          <p>
            Serenity is an AI tool designed for wellness support. It is not a clinical mental health service. 
            If you are in immediate danger or a crisis, please contact your local emergency services or a crisis hotline immediately.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
