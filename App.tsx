import React, { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { IntroView } from './components/Views/IntroView';
import { ArchitectureView } from './components/Views/ArchitectureView';
import { TechnologyView } from './components/Views/TechnologyView';
import { EcosystemView } from './components/Views/EcosystemView';
import { ScienceView } from './components/Views/ScienceView';
import { TrustView } from './components/Views/TrustView';
import { InfrastructureView } from './components/Views/InfrastructureView';
import { TokenomicsView } from './components/Views/TokenomicsView';
import { MonetizationView } from './components/Views/MonetizationView';
import { RoadmapView } from './components/Views/RoadmapView';
import { RisksView } from './components/Views/RisksView';
import { SectionId } from './types';
import { LanguageProvider } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>(SectionId.INTRO);

  const renderSection = () => {
    switch (activeSection) {
      case SectionId.INTRO:
        return <IntroView onStart={() => setActiveSection(SectionId.ARCHITECTURE)} />;
      case SectionId.ARCHITECTURE:
        return <ArchitectureView />;
      case SectionId.TECHNOLOGY:
        return <TechnologyView />;
      case SectionId.ECOSYSTEM:
        return <EcosystemView />;
      case SectionId.SCIENCE:
        return <ScienceView />;
      case SectionId.TRUST:
        return <TrustView />;
      case SectionId.INFRASTRUCTURE:
        return <InfrastructureView />;
      case SectionId.MONETIZATION:
        return <MonetizationView />;
      case SectionId.TOKENOMICS:
        return <TokenomicsView />;
      case SectionId.ROADMAP:
        return <RoadmapView />;
      case SectionId.RISKS:
        return <RisksView />;
      default:
        return <IntroView onStart={() => setActiveSection(SectionId.ARCHITECTURE)} />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-cyber-900 text-slate-200 font-sans overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="flex-1 relative h-full bg-gradient-to-br from-cyber-900 via-cyber-800 to-cyber-900">
        {renderSection()}
        
        {/* Decorative Overlay for "Screen" effect */}
        <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5 rounded-none z-50 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;