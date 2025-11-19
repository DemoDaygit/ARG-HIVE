import React from 'react';
import { Shield, Lock, FileCheck, GitBranch, Globe, ArrowRightLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const TrustView: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <div className="mb-8 border-b border-cyber-700 pb-4">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Globe className="text-cyan-400" />
          {t.trust.title}
        </h2>
        <p className="text-slate-400">
          {t.trust.desc}
        </p>
      </div>

      {/* Cross-Chain Architecture Block */}
      <div className="glass-panel p-8 rounded-xl border border-cyan-500/20 mb-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10">
            <GitBranch size={100} className="text-white"/>
         </div>
         <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
           <ArrowRightLeft className="text-cyan-400"/> {t.trust.bridgeTitle}
         </h3>
         
         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Blockchains */}
            <div className="flex flex-col gap-3 w-full md:w-1/4">
               <div className="bg-slate-800 p-3 rounded border border-slate-600 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white text-xs">ETH</div>
                  <span className="text-slate-300 text-sm">Ethereum / L2s</span>
               </div>
               <div className="bg-slate-800 p-3 rounded border border-slate-600 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white text-xs">SOL</div>
                  <span className="text-slate-300 text-sm">Solana</span>
               </div>
               <div className="bg-slate-800 p-3 rounded border border-slate-600 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center font-bold text-white text-xs">TON</div>
                  <span className="text-slate-300 text-sm">TON</span>
               </div>
            </div>

            {/* The Bridge / Oracle Layer */}
            <div className="flex-1 h-32 md:h-auto flex flex-col items-center justify-center relative px-4">
               <div className="w-full h-1 bg-gradient-to-r from-slate-700 via-cyan-500 to-slate-700 absolute top-1/2 -translate-y-1/2 -z-10"></div>
               <div className="bg-cyber-900 border-2 border-cyan-500 p-4 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.3)] z-10 text-center">
                  <div className="text-cyan-400 font-bold text-lg">ARG H.I.V.E.</div>
                  <div className="text-[10px] text-slate-400 tracking-widest">CROSS-CHAIN ORACLE</div>
               </div>
               <div className="mt-2 text-xs text-cyan-300 animate-pulse">Settlement & Verification Layer</div>
            </div>

            {/* Compute Layer */}
            <div className="w-full md:w-1/4 bg-slate-800/50 p-4 rounded border border-slate-700 text-center">
               <div className="mb-2 text-slate-400 text-xs uppercase">Physical Layer</div>
               <div className="font-bold text-white mb-1">GPU CLUSTERS</div>
               <div className="text-xs text-green-400">Verified Execution</div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Smart Contracts */}
        <div className="glass-panel p-6 rounded-xl border border-blue-500/20">
          <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
            <FileCheck /> {t.trust.contracts}
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-cyber-800 rounded border border-cyber-700">
              <div className="bg-blue-900/50 p-2 rounded text-blue-300 font-mono text-xs">REGISTRY</div>
              <div>
                <h4 className="font-bold text-sm text-slate-200">{t.trust.regTitle}</h4>
                <p className="text-xs text-slate-400">{t.trust.regDesc}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-cyber-800 rounded border border-cyber-700">
              <div className="bg-yellow-900/50 p-2 rounded text-yellow-300 font-mono text-xs">ESCROW</div>
              <div>
                <h4 className="font-bold text-sm text-slate-200">{t.trust.escrowTitle}</h4>
                <p className="text-xs text-slate-400">{t.trust.escrowDesc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Consensus Mechanism */}
        <div className="glass-panel p-6 rounded-xl border border-green-500/20">
          <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
            <Shield /> {t.trust.polTitle}
          </h3>
          <p className="text-sm text-slate-300 mb-4">
            {t.trust.polDesc}
          </p>
          
          <div className="relative pl-6 border-l-2 border-cyber-700 space-y-6">
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-cyber-700 border-2 border-slate-500"></span>
              <h4 className="text-slate-200 font-bold text-sm">{t.trust.pol1Title}</h4>
              <p className="text-xs text-slate-400">{t.trust.pol1Desc}</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-yellow-500/20 border-2 border-yellow-500 animate-pulse"></span>
              <h4 className="text-yellow-400 font-bold text-sm">{t.trust.pol2Title}</h4>
              <p className="text-xs text-slate-400">{t.trust.pol2Desc}</p>
            </div>
            <div className="relative">
               <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-cyber-700 border-2 border-red-500"></span>
              <h4 className="text-red-400 font-bold text-sm">{t.trust.pol3Title}</h4>
              <p className="text-xs text-slate-400">{t.trust.pol3Desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ZK Section */}
      <div className="glass-panel p-6 rounded-xl bg-gradient-to-r from-cyber-900 to-cyber-800 border border-cyber-600">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-lg">
            <Lock className="text-indigo-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-indigo-400">{t.trust.zkTitle}</h3>
            <p className="text-sm text-slate-300 mt-1">
              {t.trust.zkDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};