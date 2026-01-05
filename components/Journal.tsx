
import React, { useState } from 'react';

interface JournalProps {
  onSave: (title: string, content: string) => void;
}

const Journal: React.FC<JournalProps> = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    onSave(title, content);
    setTitle('');
    setContent('');
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-brand text-slate-800">Reflections</h2>
          <p className="text-slate-500 mt-1">Write down what's on your mind. Privacy is yours.</p>
        </div>
        {showSaved && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 animate-bounce">
            <i className="fa-solid fa-check"></i> Entry Saved
          </div>
        )}
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your reflection a title..."
          className="w-full text-2xl font-bold font-brand focus:outline-none placeholder:text-slate-300"
        />
        <hr className="border-slate-100" />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="How was your day? What are you grateful for? What's challenging you?"
          className="w-full h-96 focus:outline-none resize-none text-slate-700 leading-relaxed placeholder:text-slate-300"
        />
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <i className="fa-solid fa-floppy-disk"></i>
            Save Entry
          </button>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
        <h4 className="font-bold text-indigo-800 flex items-center gap-2 mb-2">
          <i className="fa-solid fa-lightbulb"></i>
          Journaling Prompt
        </h4>
        <p className="text-indigo-700/80 text-sm">
          "What is one small win you had today, no matter how tiny it might seem?"
        </p>
      </div>
    </div>
  );
};

export default Journal;
