
import React, { useState } from 'react';
import { Calculator, TrendingUp, Battery, Cpu, DollarSign, Scale, ArrowRight, Network } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const MonetizationView: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'economics' | 'flow'>('economics');

  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <div className="mb-8 border-b border-cyber-700 pb-4">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Calculator className="text-cyan-400" />
          {t.monetization.title}
        </h2>
        <p className="text-slate-400">
          {t.monetization.desc}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('economics')}
          className={`px-4 py-2 rounded font-bold transition-all ${
            activeTab === 'economics' 
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]' 
              : 'bg-cyber-800 text-slate-400 hover:text-white border border-cyber-600'
          }`}
        >
          {t.monetization.tabs.economics}
        </button>
        <button
          onClick={() => setActiveTab('flow')}
          className={`px-4 py-2 rounded font-bold transition-all ${
            activeTab === 'flow' 
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]' 
              : 'bg-cyber-800 text-slate-400 hover:text-white border border-cyber-600'
          }`}
        >
          {t.monetization.tabs.flow}
        </button>
      </div>

      {activeTab === 'economics' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Unit Economics Breakdown */}
          <div className="glass-panel p-0 rounded-xl border border-cyan-500/30 overflow-hidden">
            <div className="bg-cyber-800 p-4 border-b border-cyber-600">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Scale size={18} className="text-cyan-400" />
                {t.monetization.unitEcoTitle}
              </h3>
              <p className="text-xs text-slate-400">{t.monetization.unitEcoSubtitle}</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-cyber-700/50">
                 <div>
                   <span className="text-sm text-slate-400 block">Energy Cost (Irkutsk)</span>
                   <span className="text-xs text-slate-500">0.7 kWh per 1M tokens (H100)</span>
                 </div>
                 <div className="text-right font-mono text-red-400">
                   $0.021
                 </div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-cyber-700/50">
                 <div>
                   <span className="text-sm text-slate-400 block">Hardware Amortization</span>
                   <span className="text-xs text-slate-500">Based on 3yr lifecycle</span>
                 </div>
                 <div className="text-right font-mono text-red-400">
                   $0.048
                 </div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-cyber-700/50 bg-cyber-800/30 -mx-6 px-6">
                 <div>
                   <span className="text-sm text-white font-bold block">TOTAL COST (COGS)</span>
                   <span className="text-xs text-slate-500">Per 1 Million Tokens</span>
                 </div>
                 <div className="text-right font-mono font-bold text-white">
                   $0.069
                 </div>
              </div>
              
              <div className="pt-2">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-sm text-green-400">Market Price (GPT-4)</span>
                   <span className="text-sm font-mono text-green-400 line-through">$30.00</span>
                 </div>
                 <div className="flex justify-between items-center mb-4">
                   <span className="text-sm text-cyan-400 font-bold">Our Protocol Price</span>
                   <span className="text-lg font-mono font-bold text-cyan-400">$2.00</span>
                 </div>
                 <div className="w-full bg-cyber-800 rounded p-3 text-center border border-cyan-500/50">
                    <span className="text-xs text-slate-400 uppercase tracking-widest">Gross Margin</span>
                    <div className="text-2xl font-bold text-cyan-400 mt-1">96.5%</div>
                 </div>
              </div>
            </div>
          </div>

          {/* Node Operator P&L */}
          <div className="glass-panel p-6 rounded-xl border border-cyber-600">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-green-400" />
                {t.monetization.nodeTitle}
             </h3>
             
             <div className="space-y-4">
                <div className="bg-cyber-900/50 p-4 rounded border border-cyber-700">
                   <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-300">Cluster Capacity</span>
                      <span className="text-sm font-mono text-white">8x H100 SXM5</span>
                   </div>
                   <div className="w-full bg-cyber-700 h-1.5 rounded-full mt-2">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{width: '100%'}}></div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-3 rounded bg-cyber-800 border border-cyber-700">
                      <div className="text-xs text-slate-400 mb-1">Monthly Revenue</div>
                      <div className="text-lg font-mono text-green-400 font-bold">$24,800</div>
                      <div className="text-[10px] text-slate-500">@ 70% Utilization</div>
                   </div>
                   <div className="p-3 rounded bg-cyber-800 border border-cyber-700">
                      <div className="text-xs text-slate-400 mb-1">Monthly OpEx</div>
                      <div className="text-lg font-mono text-red-400 font-bold">-$1,650</div>
                      <div className="text-[10px] text-slate-500">Power + Cooling (Irkutsk)</div>
                   </div>
                </div>

                <div className="p-4 rounded bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30">
                   <div className="flex justify-between items-end">
                      <div>
                         <div className="text-sm text-cyan-300 font-bold">Net Monthly Profit</div>
                         <div className="text-[10px] text-slate-400">After Protocol Fees (15%)</div>
                      </div>
                      <div className="text-2xl font-mono font-bold text-white">$19,430</div>
                   </div>
                </div>

                <div className="flex gap-2 mt-2">
                   <div className="px-2 py-1 rounded bg-green-900/20 border border-green-800 text-[10px] text-green-400">ROI: 14 Months</div>
                   <div className="px-2 py-1 rounded bg-blue-900/20 border border-blue-800 text-[10px] text-blue-400">IRR: 82%</div>
                </div>
             </div>
          </div>
        </div>
      ) : (
        /* Cash Flow Graph */
        <div className="glass-panel p-6 rounded-xl border border-cyan-500/20 min-h-[600px] flex items-center justify-center relative bg-cyber-900 overflow-hidden">
           {/* Graph Container */}
           <div className="relative w-full max-w-4xl h-[500px]">
              
              {/* Client Node */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20">
                 <div className="w-32 p-4 bg-blue-900/80 border border-blue-500 rounded-lg text-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <div className="mb-2 text-blue-300"><DollarSign className="mx-auto" size={24}/></div>
                    <div className="text-xs font-bold text-white">{t.monetization.flow.client}</div>
                 </div>
              </div>

              {/* Bridge Node */}
              <div className="absolute left-[25%] top-1/2 -translate-y-1/2 z-20">
                 <div className="w-32 p-4 bg-slate-800/80 border border-slate-500 rounded-lg text-center">
                    <div className="mb-2 text-slate-300"><ArrowRight className="mx-auto" size={24}/></div>
                    <div className="text-xs font-bold text-white">{t.monetization.flow.bridge}</div>
                 </div>
                 <div className="absolute -top-8 left-0 w-full text-center text-[10px] text-slate-400">
                    {t.monetization.flow.step1}
                 </div>
              </div>

              {/* Smart Contract Node (Center) */}
              <div className="absolute left-[50%] top-1/2 -translate-y-1/2 -translate-x-1/2 z-20">
                 <div className="w-40 p-6 bg-cyan-900/80 border-2 border-cyan-400 rounded-xl text-center shadow-[0_0_40px_rgba(34,211,238,0.2)] relative">
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                    <div className="mb-2 text-cyan-300"><Network className="mx-auto" size={32}/></div>
                    <div className="text-sm font-bold text-white">{t.monetization.flow.contract}</div>
                    <div className="mt-2 text-[10px] text-cyan-300 bg-cyan-950 rounded px-1">
                       {t.monetization.flow.step2}
                    </div>
                 </div>
              </div>

              {/* Node (Miner) */}
              <div className="absolute right-0 top-[20%] z-20">
                 <div className="w-32 p-4 bg-green-900/80 border border-green-500 rounded-lg text-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    <div className="mb-2 text-green-300"><Cpu className="mx-auto" size={24}/></div>
                    <div className="text-xs font-bold text-white">{t.monetization.flow.node}</div>
                    <div className="mt-2 text-[10px] text-green-400 font-mono">85% Payout</div>
                 </div>
              </div>

               {/* Treasury */}
               <div className="absolute right-0 bottom-[20%] z-20">
                 <div className="w-32 p-4 bg-purple-900/80 border border-purple-500 rounded-lg text-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    <div className="mb-2 text-purple-300"><DollarSign className="mx-auto" size={24}/></div>
                    <div className="text-xs font-bold text-white">{t.monetization.flow.treasury}</div>
                     <div className="mt-2 text-[10px] text-purple-400 font-mono">15% Fee/Burn</div>
                 </div>
              </div>

              {/* SVG Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                 <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                       <path d="M0,0 L0,6 L9,3 z" fill="#475569" />
                    </marker>
                 </defs>
                 
                 {/* Line 1: Client -> Bridge */}
                 <line x1="12%" x2="25%" y1="50%" y2="50%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
                 <circle r="3" fill="#60a5fa">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M100,250 L210,250" />
                 </circle>

                 {/* Line 2: Bridge -> Contract */}
                 <line x1="35%" x2="44%" y1="50%" y2="50%" stroke="#22d3ee" strokeWidth="2" />
                 <circle r="3" fill="#22d3ee">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path="M300,250 L380,250" />
                 </circle>

                 {/* Line 3: Contract -> Node */}
                 <path d="M450,250 C550,250 600,120 750,120" fill="none" stroke="#4ade80" strokeWidth="2" />
                 <circle r="3" fill="#4ade80">
                     <animateMotion dur="3s" repeatCount="indefinite" path="M450,250 C550,250 600,120 750,120" />
                 </circle>

                 {/* Line 4: Contract -> Treasury */}
                 <path d="M450,250 C550,250 600,380 750,380" fill="none" stroke="#a855f7" strokeWidth="2" />
                 <circle r="3" fill="#a855f7">
                     <animateMotion dur="3s" repeatCount="indefinite" path="M450,250 C550,250 600,380 750,380" />
                 </circle>
              </svg>
           </div>
        </div>
      )}

      {/* Protocol Revenue Model (Bottom Block) */}
      {activeTab === 'economics' && (
        <div className="glass-panel p-6 rounded-xl border-t-4 border-purple-500">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                 <h3 className="text-lg font-bold text-white">{t.monetization.protocolTitle}</h3>
                 <p className="text-sm text-slate-400">{t.monetization.protocolDesc}</p>
              </div>
              <div className="mt-4 md:mt-0 px-3 py-1 bg-purple-900/30 rounded border border-purple-500/50 text-purple-300 text-xs font-mono">
                 Protocol Take Rate: 15-20%
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 relative group">
                 <div className="absolute inset-0 bg-purple-500/5 rounded-lg transform group-hover:scale-105 transition-transform"></div>
                 <div className="relative">
                    <div className="mx-auto w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mb-3 text-purple-400">
                       <DollarSign size={20} />
                    </div>
                    <div className="font-bold text-white mb-1">Transaction Fees</div>
                    <div className="text-xs text-slate-400 px-4">Small fee on every compute task routed through the bridge.</div>
                 </div>
              </div>
              
              <div className="p-4 relative group">
                 <div className="absolute inset-0 bg-purple-500/5 rounded-lg transform group-hover:scale-105 transition-transform"></div>
                 <div className="relative">
                    <div className="mx-auto w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mb-3 text-purple-400">
                       <Battery size={20} />
                    </div>
                    <div className="font-bold text-white mb-1">Liquidity Slashing</div>
                    <div className="text-xs text-slate-400 px-4">Revenue from malicious nodes failing Proof-of-Learning.</div>
                 </div>
              </div>

              <div className="p-4 relative group">
                 <div className="absolute inset-0 bg-purple-500/5 rounded-lg transform group-hover:scale-105 transition-transform"></div>
                 <div className="relative">
                    <div className="mx-auto w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mb-3 text-purple-400">
                       <Cpu size={20} />
                    </div>
                    <div className="font-bold text-white mb-1">Priority Access</div>
                    <div className="text-xs text-slate-400 px-4">Premium fees from institutional clients for reserved H100 clusters.</div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
