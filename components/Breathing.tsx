
import React, { useState, useEffect } from 'react';

const Breathing: React.FC = () => {
  const [phase, setPhase] = useState<'In' | 'Hold' | 'Out'>('In');
  const [timeLeft, setTimeLeft] = useState(4);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isActive) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (phase === 'In') {
              setPhase('Hold');
              return 4;
            } else if (phase === 'Hold') {
              setPhase('Out');
              return 4;
            } else {
              setPhase('In');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase]);

  const toggleExercise = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setPhase('In');
      setTimeLeft(4);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center space-y-12 bg-white rounded-2xl shadow-sm border border-slate-100 animate-in fade-in zoom-in duration-700">
      <div className="max-w-md px-6">
        <h2 className="text-3xl font-bold font-brand text-slate-800 mb-4">Box Breathing</h2>
        <p className="text-slate-500">A simple technique to lower stress and center your mind.</p>
      </div>

      <div className="relative flex items-center justify-center w-64 h-64">
        {/* Breathing Circle */}
        <div className={`absolute inset-0 rounded-full border-4 border-indigo-100 transition-transform duration-[4000ms] ease-in-out ${
          isActive && phase === 'In' ? 'scale-150 bg-indigo-50/50' : 
          isActive && phase === 'Out' ? 'scale-100 bg-transparent' : 
          isActive && phase === 'Hold' ? 'scale-150 bg-indigo-50' : 'scale-100'
        }`}></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-4xl font-bold text-indigo-600 mb-1">{isActive ? timeLeft : 'Ready?'}</span>
          <span className="text-sm font-semibold uppercase tracking-widest text-slate-400">{isActive ? phase : 'Click Start'}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={toggleExercise}
          className={`px-12 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
            isActive ? 'bg-slate-200 text-slate-600' : 'bg-indigo-600 text-white'
          }`}
        >
          {isActive ? 'Stop' : 'Start Session'}
        </button>
        <p className="text-sm text-slate-400 font-medium">4s In • 4s Hold • 4s Out</p>
      </div>
      
      {!isActive && (
        <div className="grid grid-cols-3 gap-4 max-w-lg">
          <div className="p-4 bg-slate-50 rounded-xl">
             <i className="fa-solid fa-brain text-indigo-500 mb-2"></i>
             <p className="text-xs font-semibold">Calm Anxiety</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
             <i className="fa-solid fa-bolt text-indigo-500 mb-2"></i>
             <p className="text-xs font-semibold">Focus Mind</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
             <i className="fa-solid fa-bed text-indigo-500 mb-2"></i>
             <p className="text-xs font-semibold">Better Sleep</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Breathing;
