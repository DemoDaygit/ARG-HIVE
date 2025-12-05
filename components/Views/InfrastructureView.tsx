
import React from 'react';
import { Server, MapPin, Radio, Wind, Zap, Cable } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const InfrastructureView: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <div className="mb-8 border-b border-cyber-700 pb-4">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Server className="text-cyan-400" />
          {t.infrastructure.title}
        </h2>
        <p className="text-slate-400">
          {t.infrastructure.desc}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 h-auto lg:h-[500px]">
        
        {/* Left: Location Specs */}
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="glass-panel p-5 rounded-xl border-l-4 border-cyan-500">
             <div className="flex items-center justify-between mb-2">
               <h3 className="font-bold text-white flex items-center gap-2"><MapPin size={16}/> {t.infrastructure.locTitle}</h3>
               <span className="text-xs font-mono text-cyan-400">{t.infrastructure.locHub}</span>
             </div>
             <p className="text-sm text-slate-300">{t.infrastructure.locDesc}</p>
          </div>

          <div className="glass-panel p-5 rounded-xl border-l-4 border-yellow-500">
             <div className="flex items-center justify-between mb-2">
               <h3 className="font-bold text-white flex items-center gap-2"><Zap size={16}/> {t.infrastructure.powTitle}</h3>
             </div>
             <div className="flex justify-between items-end">
               <div>
                 <p className="text-xs text-slate-400">{t.infrastructure.powCost}</p>
                 <p className="text-2xl font-mono font-bold text-yellow-400">$0.02</p>
               </div>
               <div className="text-right">
                 <p className="text-xs text-slate-400">{t.infrastructure.powAvg}</p>
                 <p className="text-sm text-slate-500 line-through">$0.12</p>
               </div>
             </div>
          </div>

          <div className="glass-panel p-5 rounded-xl border-l-4 border-blue-500">
             <div className="flex items-center justify-between mb-2">
               <h3 className="font-bold text-white flex items-center gap-2"><Wind size={16}/> {t.infrastructure.coolTitle}</h3>
             </div>
             <p className="text-sm text-slate-300 mb-2">{t.infrastructure.coolDesc}</p>
             <div className="w-full bg-cyber-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '90%'}}></div>
             </div>
             <p className="text-right text-xs text-blue-400 mt-1">PUE &lt; 1.1</p>
          </div>
        </div>

        {/* Right: Hardware Rack Visualization */}
        <div className="flex-1 glass-panel rounded-xl p-6 relative overflow-hidden border border-cyber-600 flex flex-col bg-cyber-900">
          <div className="flex justify-between items-start mb-6 border-b border-cyber-700 pb-4">
             <div>
                <h3 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  {t.infrastructure.rackUnit}
                </h3>
                <p className="text-slate-500 text-xs mt-1">SXM5 INTERCONNECT FABRIC</p>
             </div>
             <div className="text-right">
                <p className="text-cyan-400 font-bold text-sm">NVIDIA H100 / RTX 4090</p>
                <p className="text-[10px] text-slate-500 font-mono">HGX CLUSTER CONFIG</p>
             </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center space-y-3">
             {/* Realistic Server Blades */}
             {[1, 2, 3, 4, 5].map((blade) => (
                <div key={blade} className="w-full max-w-lg h-14 bg-gray-900 rounded border border-gray-700 flex items-center px-4 relative shadow-lg group hover:border-cyan-500 transition-colors">
                   {/* Handle/Latch */}
                   <div className="absolute left-0 top-0 bottom-0 w-2 bg-gray-800 border-r border-gray-700 rounded-l"></div>
                   <div className="absolute right-0 top-0 bottom-0 w-2 bg-gray-800 border-l border-gray-700 rounded-r"></div>
                   
                   <div className="ml-4 flex items-center gap-4 w-full">
                      {/* Status LEDs */}
                      <div className="flex flex-col gap-1">
                         <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></div>
                         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>

                      {/* Label */}
                      <div className="font-mono text-xs text-gray-400 w-16">
                         {blade % 2 === 0 ? 'RTX-4090' : 'H100-SXM'}
                      </div>

                      {/* Tensor Core Visualizer */}
                      <div className="flex-1 grid grid-cols-12 gap-0.5 h-6">
                         {Array.from({ length: 24 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`rounded-[1px] ${
                                Math.random() > 0.6 
                                  ? (blade % 2 === 0 ? 'bg-green-500/80 shadow-[0_0_2px_#22c55e]' : 'bg-cyan-500/80 shadow-[0_0_2px_#06b6d4]') 
                                  : 'bg-gray-800'
                              } transition-colors duration-300`}
                            ></div>
                         ))}
                      </div>

                      {/* Fan/Heat Exhaust */}
                      <div className="w-8 h-8 rounded-full border-2 border-gray-700 flex items-center justify-center">
                         <div className="w-6 h-6 border-t-2 border-b-2 border-gray-600 rounded-full animate-[spin_0.5s_linear_infinite]"></div>
                      </div>
                   </div>
                </div>
             ))}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 p-4 bg-black/40 rounded-lg border border-cyber-700">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-cyan-900/30 rounded border border-cyan-500/30">
                  <Cable className="text-cyan-400" size={16} />
                </div>
                <div>
                   <h4 className="text-xs font-bold text-white">{t.infrastructure.uplinkTitle}</h4>
                   <p className="text-[10px] text-slate-400 uppercase">400Gbps InfiniBand NDR</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
               <div className="text-[10px] font-mono bg-green-900/20 px-2 py-1 rounded text-green-400 border border-green-900/50 flex items-center gap-1">
                 <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                 {t.infrastructure.linkUp}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
