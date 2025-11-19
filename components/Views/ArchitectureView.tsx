
import React, { useState } from 'react';
import { Cpu, Network, Share2, Layers, Brain, GitMerge, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const ArchitectureView: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const { t } = useLanguage();

  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <div className="mb-8 border-b border-cyber-700 pb-4">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Network className="text-cyan-400" />
          {t.architecture.title}
        </h2>
        <p className="text-slate-400">
          {t.architecture.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Specs & Mechanics */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* MoA / Drift Section */}
          <div className="glass-panel p-5 rounded-xl">
            <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
              <Layers size={18} />
              {t.architecture.driftTitle}
            </h3>
             <ul className="list-disc list-inside text-sm text-slate-300 space-y-3">
               {t.architecture.driftPoints.map((point, i) => (
                 <li key={i} className="leading-relaxed"><span className="text-slate-400">{point}</span></li>
               ))}
             </ul>
          </div>

          {/* Swarm Mechanics */}
           <div className="glass-panel p-5 rounded-xl border border-cyan-500/20">
            <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <GitMerge size={18} />
              {t.architecture.mechTitle}
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                   <Brain size={14} className="text-blue-400"/> {t.architecture.mech1Title}
                </h4>
                <p className="text-xs text-slate-400 mt-1">{t.architecture.mech1Desc}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                   <RefreshCw size={14} className="text-green-400"/> {t.architecture.mech2Title}
                </h4>
                <p className="text-xs text-slate-400 mt-1">{t.architecture.mech2Desc}</p>
              </div>
            </div>
          </div>

          {/* CIAP Details */}
          <div className="glass-panel p-5 rounded-xl">
            <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
              <Share2 size={18} />
              {t.architecture.ciapTitle}
            </h3>
            <div className="space-y-3 text-sm text-slate-400">
              <p dangerouslySetInnerHTML={{__html: t.architecture.ciapDesc}} />
              <p className="text-xs italic border-l-2 border-cyan-500 pl-2">{t.architecture.ciapCompDesc}</p>
            </div>
          </div>
        </div>

        {/* Right Col: Visual Diagram */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <div className="glass-panel p-6 rounded-xl flex-1 relative min-h-[600px] border border-cyan-500/20 bg-gradient-to-b from-cyber-800 to-cyber-900">
             {/* Architecture Diagram */}
             <div className="absolute inset-0 flex flex-col justify-between p-8">
                
                {/* Layer 1: Proposers */}
                <div 
                  className={`transition-all duration-500 p-4 rounded-lg border ${activeLayer === 1 ? 'border-blue-400 bg-blue-900/20 scale-105' : 'border-cyber-700 bg-black/20'}`}
                  onMouseEnter={() => setActiveLayer(1)}
                  onMouseLeave={() => setActiveLayer(null)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-blue-400 font-mono font-bold uppercase">{t.architecture.l1Title}</h4>
                    <div className="flex gap-2">
                      <span className="text-[10px] bg-blue-900/50 px-2 py-0.5 rounded text-blue-200">Mistral</span>
                      <span className="text-[10px] bg-blue-900/50 px-2 py-0.5 rounded text-blue-200">Llama-3</span>
                      <span className="text-[10px] bg-blue-900/50 px-2 py-0.5 rounded text-blue-200">Gemma</span>
                    </div>
                  </div>
                  <div className="flex justify-around gap-4">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="flex flex-col items-center gap-2">
                         <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center animate-pulse">
                           <Cpu size={20} className="text-blue-400" />
                         </div>
                         <div className="h-6 w-0.5 bg-blue-500/30"></div>
                         <span className="text-[10px] text-blue-300/70">Agent {i}</span>
                       </div>
                     ))}
                  </div>
                  <p className="text-xs text-center text-slate-400 mt-4 px-8">{t.architecture.l1Desc}</p>
                </div>

                {/* Connection Lines 1-2 */}
                <div className="flex-1 flex justify-center items-center relative my-2">
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent absolute"></div>
                  <div className="z-10 bg-cyber-900 px-3 py-1 rounded border border-cyan-500/30 text-xs text-cyan-500 font-mono flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></span>
                    {t.architecture.conn1}
                  </div>
                </div>

                {/* Layer 2: Critics */}
                <div 
                  className={`transition-all duration-500 p-4 rounded-lg border ${activeLayer === 2 ? 'border-purple-400 bg-purple-900/20 scale-105' : 'border-cyber-700 bg-black/20'}`}
                  onMouseEnter={() => setActiveLayer(2)}
                  onMouseLeave={() => setActiveLayer(null)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-purple-400 font-mono font-bold uppercase">{t.architecture.l2Title}</h4>
                    <span className="text-xs text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded">Role: Adversarial Validator</span>
                  </div>
                  <div className="flex justify-center gap-16">
                     {[1, 2].map(i => (
                       <div key={i} className="flex flex-col items-center gap-2">
                         <div className="w-14 h-14 rounded-md bg-purple-500/20 border border-purple-400 flex items-center justify-center relative">
                           <ShieldCheckIcon className="text-purple-400" size={24}/>
                           <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black"></div>
                         </div>
                         <div className="h-6 w-0.5 bg-purple-500/30"></div>
                         <span className="text-[10px] text-purple-300/70">Critic {i}</span>
                       </div>
                     ))}
                  </div>
                   <p className="text-xs text-center text-slate-400 mt-4 px-8">{t.architecture.l2Desc}</p>
                </div>

                {/* Connection Lines 2-3 */}
                <div className="flex-1 flex justify-center items-center relative my-2">
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent absolute"></div>
                   <div className="z-10 bg-cyber-900 px-3 py-1 rounded border border-cyan-500/30 text-xs text-cyan-500 font-mono">
                    {t.architecture.conn2}
                  </div>
                </div>

                {/* Layer 3: Synthesizer */}
                <div 
                  className={`transition-all duration-500 p-4 rounded-lg border ${activeLayer === 3 ? 'border-green-400 bg-green-900/20 scale-105' : 'border-cyber-700 bg-black/20'}`}
                  onMouseEnter={() => setActiveLayer(3)}
                  onMouseLeave={() => setActiveLayer(null)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-green-400 font-mono font-bold uppercase">{t.architecture.l3Title}</h4>
                    <span className="text-xs text-green-300 bg-green-900/40 px-2 py-0.5 rounded">DeepSeek-V3 / Llama-70B</span>
                  </div>
                  <div className="flex justify-center">
                      <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center shadow-[0_0_40px_rgba(74,222,128,0.3)] relative">
                         <Brain size={40} className="text-green-400" />
                         <div className="absolute inset-0 rounded-full border border-green-400/50 animate-[ping_3s_linear_infinite]"></div>
                      </div>
                  </div>
                   <p className="text-xs text-center text-slate-400 mt-4 px-8">{t.architecture.l3Desc}</p>
                </div>

             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShieldCheckIcon = ({size, className}: {size: number, className: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
)
