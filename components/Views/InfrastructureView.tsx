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
        <div className="flex-1 glass-panel rounded-xl p-6 relative overflow-hidden border border-cyber-600 flex flex-col">
          <div className="absolute top-0 right-0 p-4 text-right">
             <h3 className="text-2xl font-bold text-white font-mono">{t.infrastructure.rackUnit}</h3>
             <p className="text-cyan-500 font-mono text-sm">NVIDIA H100 / RTX 4090 Cluster</p>
          </div>

          <div className="flex-1 flex items-center justify-center mt-8">
             {/* Stylized Server Rack */}
             <div className="w-64 bg-cyber-900 border border-cyber-500 p-2 rounded shadow-[0_0_50px_rgba(6,182,212,0.15)]">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((slot) => (
                  <div key={slot} className="h-12 mb-2 bg-cyber-800 border border-cyber-600 rounded flex items-center px-3 justify-between group hover:bg-cyber-700 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${slot % 2 === 0 ? 'bg-green-500 animate-pulse' : 'bg-green-600'}`}></div>
                      <span className="text-xs font-mono text-slate-400">GPU-{slot}</span>
                    </div>
                    <div className="h-1 w-16 bg-cyan-900 rounded overflow-hidden">
                       <div className="h-full bg-cyan-400 animate-[pulse_2s_ease-in-out_infinite]" style={{width: `${Math.random() * 40 + 60}%`}}></div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 border-t border-cyber-600 pt-2 flex justify-between px-2">
                   <span className="text-[10px] text-slate-500">IB NDR 400Gbps</span>
                   <span className="text-[10px] text-green-500">{t.infrastructure.linkUp}</span>
                </div>
             </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 p-4 bg-cyber-900/50 rounded-lg border border-cyber-700">
            <div className="flex items-center justify-center w-10 h-10 bg-cyan-900/30 rounded-full border border-cyan-500/30">
              <Cable className="text-cyan-400" size={20} />
            </div>
            <div className="flex-1">
               <h4 className="text-sm font-bold text-white">{t.infrastructure.uplinkTitle}</h4>
               <p className="text-xs text-slate-400">{t.infrastructure.uplinkDesc}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
               <div className="text-[10px] font-mono bg-black px-2 py-0.5 rounded text-green-400 border border-green-900 flex items-center gap-1">
                 <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                 {t.infrastructure.linkUp}
               </div>
               <div className="text-[10px] font-mono bg-black px-2 py-0.5 rounded text-yellow-500 border border-yellow-900 flex items-center gap-1">
                  <Radio size={10} />
                  {t.infrastructure.connected}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};