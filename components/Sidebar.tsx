
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: 'fa-house' },
    { id: 'chat', label: 'Serenity Chat', icon: 'fa-comments' },
    { id: 'video_call', label: 'Live Session', icon: 'fa-video' },
    { id: 'emotion_detect', label: 'Emotion Scanner', icon: 'fa-face-smile-wink' },
    { id: 'breathe', label: 'Breathe', icon: 'fa-wind' },
    { id: 'journal', label: 'Journal', icon: 'fa-book-open' },
    { id: 'tools', label: 'Wellness Hub', icon: 'fa-microchip' },
    { id: 'history', label: 'History', icon: 'fa-clock-rotate-left' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
            <i className="fa-solid fa-leaf text-xl"></i>
          </div>
          <h1 className="text-xl font-bold font-brand tracking-tight text-slate-800">SerenityMind</h1>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as View)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                currentView === item.id
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5`}></i>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100">
        <div className="bg-indigo-600 rounded-xl p-4 text-white">
          <p className="text-xs font-semibold mb-1 opacity-80 uppercase tracking-wider">Today's Quote</p>
          <p className="text-sm italic font-medium">"One small positive thought can change your whole day."</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
