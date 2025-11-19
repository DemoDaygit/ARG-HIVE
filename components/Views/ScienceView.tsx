import React from 'react';
import { BookOpen, FileText } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const ScienceView: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="h-full w-full p-8 overflow-y-auto bg-gradient-to-b from-cyan-950/20 to-black">
      <div className="mb-8 border-b border-cyber-700 pb-4">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <BookOpen className="text-cyan-400" />
          {t.science.title}
        </h2>
        <p className="text-slate-400">
          {t.science.desc}
        </p>
      </div>

      {/* BLOCK B: The Science (Research Base) */}
      <div className="p-6 rounded-2xl border border-cyan-900/50 bg-gradient-to-b from-cyan-950/10 to-transparent">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyan-900/50 rounded-lg text-cyan-400">
                <FileText size={24} />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-white">{t.science.sciTitle}</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                    {t.science.sciDesc}
                </p>
            </div>
        </div>

        <div className="space-y-4">
            {/* Paper 1 */}
            <div className="glass-panel p-5 rounded-lg border-l-4 border-cyan-500 hover:bg-cyber-800 transition-colors">
                <div className="flex items-start gap-4">
                    <div className="mt-1 text-cyan-500"><FileText size={24} /></div>
                    <div>
                        <h4 className="text-white font-bold text-lg hover:text-cyan-400 cursor-pointer transition-colors">
                            {t.science.paper1Title}
                        </h4>
                        <div className="text-xs text-slate-500 font-mono mb-2 mt-1">IEEE Access (2024) • Authors: Zhang, Li, et al.</div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            {t.science.paper1Abst}
                        </p>
                    </div>
                </div>
            </div>

            {/* Paper 2 */}
             <div className="glass-panel p-5 rounded-lg border-l-4 border-purple-500 hover:bg-cyber-800 transition-colors">
                <div className="flex items-start gap-4">
                    <div className="mt-1 text-purple-500"><FileText size={24} /></div>
                    <div>
                        <h4 className="text-white font-bold text-lg hover:text-purple-400 cursor-pointer transition-colors">
                            {t.science.paper2Title}
                        </h4>
                         <div className="text-xs text-slate-500 font-mono mb-2 mt-1">arXiv:2401.xxxxx • Cryptographic ePrint Archive</div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                             {t.science.paper2Abst}
                        </p>
                    </div>
                </div>
            </div>

             {/* Paper 3 */}
             <div className="glass-panel p-5 rounded-lg border-l-4 border-green-500 hover:bg-cyber-800 transition-colors">
                <div className="flex items-start gap-4">
                    <div className="mt-1 text-green-500"><FileText size={24} /></div>
                    <div>
                        <h4 className="text-white font-bold text-lg hover:text-green-400 cursor-pointer transition-colors">
                           {t.science.paper3Title}
                        </h4>
                         <div className="text-xs text-slate-500 font-mono mb-2 mt-1">NeurIPS 2024 (Workshop)</div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                             {t.science.paper3Abst}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};