
import React from 'react';
import { Map, CheckCircle, Circle, Flag, Layout, Coins, Cpu, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const RoadmapView: React.FC = () => {
  const { t } = useLanguage();

  const phases = [
    {
      id: 1,
      title: t.roadmap.p1Title,
      time: t.roadmap.p1Time,
      status: "active",
      icon: <Layout size={20} />,
      color: "cyan",
      items: t.roadmap.p1Items
    },
    {
      id: 2,
      title: t.roadmap.p2Title,
      time: t.roadmap.p2Time,
      status: "future",
      icon: <Coins size={20} />,
      color: "purple",
      items: t.roadmap.p2Items
    },
    {
      id: 3,
      title: t.roadmap.p3Title,
      time: t.roadmap.p3Time,
      status: "future",
      icon: <Cpu size={20} />,
      color: "blue",
      items: t.roadmap.p3Items
    },
    {
      id: 4,
      title: t.roadmap.p4Title,
      time: t.roadmap.p4Time,
      status: "future",
      icon: <Globe size={20} />,
      color: "green",
      items: t.roadmap.p4Items
    }
  ];

  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <div className="mb-8 border-b border-cyber-700 pb-4">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Map className="text-cyan-400" />
          {t.roadmap.title}
        </h2>
        <p className="text-slate-400">
          {t.roadmap.desc}
        </p>
      </div>

      <div className="space-y-0 relative max-w-4xl mx-auto pb-12">
         {/* Vertical Line */}
         <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyber-600 via-cyan-900 to-cyber-900"></div>

         {phases.map((phase, index) => (
           <div key={phase.id} className="relative pl-24 py-8">
              {/* Time Marker */}
              <div className="absolute left-0 top-10 w-16 text-right">
                 <div className="text-sm font-bold text-white font-mono">{phase.time.split(' ')[0]}</div>
                 <div className="text-[10px] text-slate-500">{phase.time.split(' ')[1]}</div>
              </div>

              {/* Icon Connector */}
              <div className={`absolute left-5 top-9 w-7 h-7 rounded-full border-4 z-10 bg-cyber-900 flex items-center justify-center transition-all duration-500 ${
                phase.status === 'active' 
                  ? 'border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)] scale-110' 
                  : 'border-cyber-700 text-slate-600'
              }`}>
                 {phase.status === 'active' && <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>}
              </div>

              <div className={`glass-panel p-6 rounded-xl border-l-4 transition-all duration-300 hover:bg-cyber-800 group ${
                 phase.status === 'active' 
                   ? 'border-cyan-500 bg-cyber-800/50 shadow-[0_0_30px_rgba(0,0,0,0.3)]' 
                   : `border-${phase.color}-900 opacity-80 hover:opacity-100`
              }`}>
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-4">
                       <div className={`p-3 rounded-lg bg-${phase.color}-900/20 text-${phase.color}-400 border border-${phase.color}-500/20`}>
                          {phase.icon}
                       </div>
                       <div>
                          <h3 className={`text-xl font-bold ${phase.status === 'active' ? 'text-white' : 'text-slate-300'}`}>
                            {phase.title}
                          </h3>
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Phase {phase.id}</span>
                       </div>
                    </div>
                    {phase.status === 'active' && (
                      <span className="mt-2 md:mt-0 px-3 py-1 bg-cyan-900/50 text-cyan-400 text-xs rounded border border-cyan-700 font-bold animate-pulse flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                        {t.roadmap.inProgress}
                      </span>
                    )}
                 </div>

                 <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                       <Flag size={12} /> {t.roadmap.deliverable}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                        {phase.items.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-sm group-hover:text-white transition-colors">
                            {phase.status === 'active' && idx < 2 
                               ? <CheckCircle size={16} className="text-green-400 shrink-0 mt-0.5" /> 
                               : <Circle size={16} className={`shrink-0 mt-0.5 ${phase.status === 'active' ? 'text-slate-600' : 'text-slate-800'}`} />
                            }
                            <span className="text-slate-400 leading-snug">{item}</span>
                          </div>
                        ))}
                    </div>
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};
