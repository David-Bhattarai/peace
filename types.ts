
export type Mood = 'excellent' | 'good' | 'neutral' | 'down' | 'struggling';

export interface MoodEntry {
  id: string;
  date: string;
  mood: Mood;
  note: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type View = 'dashboard' | 'chat' | 'breathe' | 'journal' | 'history' | 'tools' | 'video_call' | 'emotion_detect';
