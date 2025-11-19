
import React from 'react';
import { AlertTriangle, ShieldAlert, WifiOff, ZapOff, Scale, Activity, Server, Coins } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const RisksView: React.FC = () => {
  const { t } = useLanguage();

  // Define the matrix quadrants
  const matrixData = [
    {
      id: 'op',
      type: t.risks.matrix.op,
      icon: <Server size={24} className="text-red-400"/>,
      data: t.risks.r1,
      color: 'red',
      quadrant: 'High Impact / High Prob'
    },
    {
      id: 'tech',
      type: t.risks.matrix.tech,
      icon: <Activity size={24} className="text-orange-400"/>,
      data: t.risks.r2,
      color: 'orange',
      quadrant: 'High Impact / Low Prob'
    },
    {
      id: 'fin',
      type: t.risks.matrix.fin,
      icon: <Coins size={24} className="text-yellow-400"/>,
      data: t.risks.r3,
      color: 'yellow',
      quadrant: 'Med Impact / Med Prob'
    },
    {
      id: 'reg',
      type: t.risks.matrix.reg,
      icon: <Scale size={24} className="text-blue-400"/>,
      data: t.risks.r4,
      color: 'blue',
      quadrant: 'High Impact / Med Prob'
    }
  ];

  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <div className="mb-8 border-b border-cyber-700 pb-4">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <AlertTriangle className="text-cyan-400" />
          {t.risks.title}
        </h2>
        <p className="text-slate-400">
          {t.risks.desc}
        </p>
      </div>

      {/* 2x2 Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {matrixData.map((item, index) => (
          <div key={index} className={`glass-panel p-6 rounded-xl border-l-4 border-${item.color}-500 hover:bg-cyber-800 transition-all duration-300 group relative overflow-hidden`}>
            
            {/* Quadrant Badge */}
            <div className="absolute top-0 right-0 bg-black/40 px-3 py-1 text-[10px] font-mono text-slate-500 rounded-bl-lg border-b border-l border-white/5">
               {item.quadrant}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 bg-${item.color}-900/20 rounded-lg border border-${item.color}-500/20 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white">{item.type}</h3>
            </div>

            <h4 className={`text-lg font-bold text-${item.color}-400 mb-2`}>{item.data.title}</h4>
            <p className="text-sm text-slate-400 mb-4 min-h-[40px]">{item.data.desc}</p>

            <div className="mt-4 pt-4 border-t border-white/5">
               <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                 <ShieldAlert size={12} /> {t.risks.mitStrat}
               </p>
               <p className="text-sm text-slate-300 leading-relaxed bg-cyber-900/50 p-3 rounded border border-white/5">
                 {item.data.mitigation}
               </p>
            </div>
          </div>
        ))}
      </div>

      {/* Investment Thesis Footer */}
      <div className="glass-panel p-8 rounded-xl bg-gradient-to-r from-cyber-900 to-blue-950/30 border border-cyan-500/20">
         <h3 className="text-xl font-bold text-white mb-6">{t.risks.whyTitle}</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-l-2 border-cyan-500 pl-4">
               <div className="text-cyan-400 font-bold text-lg mb-1">{t.risks.w1Title}</div>
               <p className="text-sm text-slate-400">{t.risks.w1Desc}</p>
            </div>
            <div className="border-l-2 border-purple-500 pl-4">
               <div className="text-purple-400 font-bold text-lg mb-1">{t.risks.w2Title}</div>
               <p className="text-sm text-slate-400">{t.risks.w2Desc}</p>
            </div>
            <div className="border-l-2 border-green-500 pl-4">
               <div className="text-green-400 font-bold text-lg mb-1">{t.risks.w3Title}</div>
               <p className="text-sm text-slate-400">{t.risks.w3Desc}</p>
            </div>
         </div>
      </div>
    </div>
  );
};
