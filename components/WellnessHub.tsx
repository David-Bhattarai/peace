
import React from 'react';

const WellnessHub: React.FC = () => {
  const therapyTools = [
    {
      title: 'Cognitive Behavioral (CBT)',
      desc: 'Techniques focused on identifying and changing negative thought patterns.',
      icon: 'fa-brain',
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      title: 'Mindfulness & Meditation',
      desc: 'Practices that encourage staying present and observing thoughts without judgment.',
      icon: 'fa-om',
      color: 'text-teal-500',
      bg: 'bg-teal-50'
    },
    {
      title: 'Dialectical Behavior (DBT)',
      desc: 'Strategies for emotional regulation, distress tolerance, and mindfulness.',
      icon: 'fa-balance-scale',
      color: 'text-purple-500',
      bg: 'bg-purple-50'
    },
    {
      title: 'Sleep Hygiene',
      desc: 'Scientific habits and environment optimization for restorative sleep.',
      icon: 'fa-moon',
      color: 'text-indigo-500',
      bg: 'bg-indigo-50'
    }
  ];

  const techStack = [
    { name: 'Gemini 3 Pro AI', type: 'Core Intelligence', icon: 'fa-sparkles', desc: 'Powers empathetic conversations and mood analysis.' },
    { name: 'React 19', type: 'Frontend Framework', icon: 'fa-atom', desc: 'Ensures a responsive, high-performance user interface.' },
    { name: 'Tailwind CSS', type: 'Design System', icon: 'fa-palette', desc: 'Provides a clean, modern, and accessible aesthetic.' },
    { name: 'TypeScript', type: 'Architecture', icon: 'fa-code', desc: 'Maintains robust, type-safe code for stability.' }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold font-brand text-slate-800">Wellness Hub</h2>
        <p className="text-slate-500 mt-1">Understanding the tools and technology that power your journey.</p>
      </header>

      <section>
        <h3 className="text-xl font-bold mb-6 text-slate-800 border-l-4 border-indigo-500 pl-4">Therapeutic Tools</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {therapyTools.map((tool, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex gap-5 hover:border-indigo-200 transition-colors">
              <div className={`${tool.bg} ${tool.color} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <i className={`fa-solid ${tool.icon} text-2xl`}></i>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">{tool.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 text-white rounded-3xl p-8 overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <i className="fa-solid fa-microchip text-indigo-400"></i>
            Technology Stack
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors">
                <div className="text-indigo-400 text-xl mb-3">
                  <i className={`fa-solid ${tech.icon}`}></i>
                </div>
                <h4 className="font-bold text-sm mb-1">{tech.name}</h4>
                <p className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold mb-2">{tech.type}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </section>

      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
          <i className="fa-solid fa-shield-halved"></i>
        </div>
        <div>
          <h4 className="font-bold text-indigo-900 text-sm">Privacy-First Architecture</h4>
          <p className="text-xs text-indigo-700">All journal and mood data is stored locally on your device. We don't track your identity.</p>
        </div>
      </div>
    </div>
  );
};

export default WellnessHub;
