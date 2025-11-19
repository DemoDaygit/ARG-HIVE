import React from 'react';
import { SectionId, NavItem } from '../../types';
import { Brain, ShieldCheck, Server, Coins, Map, AlertTriangle, Hexagon, Globe, Calculator, Cpu, FlaskConical, BookOpen } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SidebarProps {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();

  const navItems: NavItem[] = [
    { id: SectionId.INTRO, label: t.sidebar.intro, icon: <Hexagon size={20} /> },
    { id: SectionId.ARCHITECTURE, label: t.sidebar.architecture, icon: <Brain size={20} /> },
    { id: SectionId.TECHNOLOGY, label: t.sidebar.technology, icon: <Cpu size={20} /> },
    { id: SectionId.ECOSYSTEM, label: t.sidebar.ecosystem, icon: <FlaskConical size={20} /> },
    { id: SectionId.SCIENCE, label: t.sidebar.science, icon: <BookOpen size={20} /> },
    { id: SectionId.TRUST, label: t.sidebar.trust, icon: <ShieldCheck size={20} /> },
    { id: SectionId.INFRASTRUCTURE, label: t.sidebar.infrastructure, icon: <Server size={20} /> },
    { id: SectionId.MONETIZATION, label: t.sidebar.monetization, icon: <Calculator size={20} /> },
    { id: SectionId.TOKENOMICS, label: t.sidebar.tokenomics, icon: <Coins size={20} /> },
    { id: SectionId.ROADMAP, label: t.sidebar.roadmap, icon: <Map size={20} /> },
    { id: SectionId.RISKS, label: t.sidebar.risks, icon: <AlertTriangle size={20} /> },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  return (
    <div className="w-64 h-full border-r border-cyber-700 bg-cyber-900 flex flex-col shrink-0">
      <div className="p-6 border-b border-cyber-700 flex items-center space-x-3 justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-md flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="font-bold text-white text-xs">ARG</span>
          </div>
          <div>
            <h1 className="font-bold text-white text-sm tracking-wider">ARG H.I.V.E.</h1>
            <p className="text-[9px] text-cyber-400">Swarm Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              activeSection === item.id
                ? 'bg-cyber-700 text-cyan-400 border-l-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                : 'text-slate-400 hover:bg-cyber-800 hover:text-slate-200'
            }`}
          >
            <span className={activeSection === item.id ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}>
              {item.icon}
            </span>
            <span className="font-medium text-sm text-left">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-cyber-700 space-y-4">
        <button 
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between px-3 py-2 rounded bg-cyber-800 hover:bg-cyber-700 transition-colors border border-cyber-600 group"
        >
          <div className="flex items-center gap-2 text-xs text-slate-300 group-hover:text-white">
            <Globe size={14} />
            <span>Language</span>
          </div>
          <div className="flex items-center text-xs font-mono">
            <span className={`${language === 'en' ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>EN</span>
            <span className="mx-1 text-slate-600">/</span>
            <span className={`${language === 'ru' ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>RU</span>
          </div>
        </button>

        <div className="glass-panel rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">{t.sidebar.status}</span>
            <span className="text-[10px] text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              {t.sidebar.online}
            </span>
          </div>
          <div className="text-xs font-mono text-cyan-400 truncate">
            {t.sidebar.net}: Irkutsk-1
          </div>
          <div className="text-xs font-mono text-slate-500 truncate">
            {t.sidebar.lat}: 24ms
          </div>
        </div>
      </div>
    </div>
  );
};