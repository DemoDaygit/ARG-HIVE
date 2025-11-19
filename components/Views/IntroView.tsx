
import React from 'react';
import { ArrowRight, TrendingUp, ShieldX, Unlock, Building2, Banknote, Lock, Zap } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface IntroViewProps {
  onStart: () => void;
}

export const IntroView: React.FC<IntroViewProps> = ({ onStart }) => {
  const { t } = useLanguage();
  
  return (
    <div className="h-full w-full flex flex-col justify-center items-start p-12 relative overflow-hidden overflow-y-auto">
      {/* Background grid effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>
      
      {/* Glowing Orb */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 max-w-5xl w-full pt-20 pb-12">
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-6">
          <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
          {t.intro.tag}
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight tracking-tight">
          {t.intro.title}
        </h1>
        
        <p className="text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed" dangerouslySetInnerHTML={{__html: t.intro.desc}} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Problem Card */}
          <div className="glass-panel p-6 rounded-xl border-l-4 border-red-500 hover:bg-cyber-800/50 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-500/10 rounded-lg text-red-400 group-hover:text-red-300 transition-colors">
                <ShieldX size={24} />
              </div>
              <h3 className="text-red-400 font-bold text-lg">{t.intro.problemTitle}</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t.intro.problemDesc}
            </p>
          </div>

          {/* Solution Card */}
          <div className="glass-panel p-6 rounded-xl border-l-4 border-green-500 hover:bg-cyber-800/50 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg text-green-400 group-hover:text-green-300 transition-colors">
                <Unlock size={24} />
              </div>
              <h3 className="text-green-400 font-bold text-lg">{t.intro.solutionTitle}</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t.intro.solutionDesc}
            </p>
          </div>

          {/* Market Card */}
          <div className="glass-panel p-6 rounded-xl border-l-4 border-cyan-500 hover:bg-cyber-800/50 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
               <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 group-hover:text-cyan-300 transition-colors">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-cyan-400 font-bold text-lg">{t.intro.marketTitle}</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t.intro.marketDesc}
            </p>
          </div>
        </div>

        {/* Strategic Business Value Block */}
        <div className="mb-12 pt-8 border-t border-cyber-700">
           <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
             <Building2 className="text-purple-400"/> {t.intro.bizTitle}
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-4 rounded-lg bg-purple-900/10 border border-purple-500/20 hover:bg-purple-900/20 transition-colors">
                 <div className="flex items-center gap-3 mb-3">
                    <Zap size={20} className="text-purple-400" />
                    <h4 className="text-white font-bold text-sm">{t.intro.biz1Title}</h4>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed">{t.intro.biz1Desc}</p>
              </div>

              <div className="p-4 rounded-lg bg-blue-900/10 border border-blue-500/20 hover:bg-blue-900/20 transition-colors">
                 <div className="flex items-center gap-3 mb-3">
                    <Lock size={20} className="text-blue-400" />
                    <h4 className="text-white font-bold text-sm">{t.intro.biz2Title}</h4>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed">{t.intro.biz2Desc}</p>
              </div>

              <div className="p-4 rounded-lg bg-green-900/10 border border-green-500/20 hover:bg-green-900/20 transition-colors">
                 <div className="flex items-center gap-3 mb-3">
                    <Banknote size={20} className="text-green-400" />
                    <h4 className="text-white font-bold text-sm">{t.intro.biz3Title}</h4>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed">{t.intro.biz3Desc}</p>
              </div>
           </div>
        </div>

        <button 
          onClick={onStart}
          className="group bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-10 py-4 rounded-lg font-semibold transition-all flex items-center space-x-3 shadow-lg shadow-cyan-600/20 border border-cyan-400/30"
        >
          <span className="tracking-wide">{t.intro.btn}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
