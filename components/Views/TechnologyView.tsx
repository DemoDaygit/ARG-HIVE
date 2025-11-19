import React from 'react';
import { Cpu, Zap, Layers, Database, Settings, HardDrive, MemoryStick } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const TechnologyView: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <div className="mb-8 border-b border-cyber-700 pb-4">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Cpu className="text-cyan-400" />
          {t.technology.title}
        </h2>
        <p className="text-slate-400">
          {t.technology.desc}
        </p>
      </div>

      {/* Hardware & Model Specs Block */}
      <div className="glass-panel p-6 rounded-xl border border-cyan-500/40 mb-8 bg-cyber-900/50">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Settings size={20} className="text-cyan-400"/> {t.technology.reqTitle}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hardware Requirements */}
            <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600">
                <div className="flex items-center gap-2 mb-4 text-cyan-400">
                    <HardDrive size={18} />
                    <h4 className="font-bold uppercase text-sm">{t.technology.hwTitle}</h4>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-cyber-700 pb-2">
                        <span className="text-sm text-slate-300">Consumer Grade (Tier 2)</span>
                        <span className="text-xs font-mono text-yellow-400">RTX 3090 / 4090 (24GB)</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-cyber-700 pb-2">
                        <span className="text-sm text-slate-300">Enterprise (Tier 1)</span>
                        <span className="text-xs font-mono text-green-400">A100 / H100 (80GB)</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-cyber-700 pb-2">
                        <span className="text-sm text-slate-300">RAM (System)</span>
                        <span className="text-xs font-mono text-slate-400">Min: 64GB DDR5</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Bandwidth</span>
                        <span className="text-xs font-mono text-slate-400">PCIe 4.0 x16</span>
                    </div>
                </div>
            </div>

            {/* Model Specifications */}
            <div className="bg-cyber-800 p-4 rounded-lg border border-cyber-600">
                <div className="flex items-center gap-2 mb-4 text-purple-400">
                    <MemoryStick size={18} />
                    <h4 className="font-bold uppercase text-sm">{t.technology.modelTitle}</h4>
                </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-cyber-700 pb-2">
                        <span className="text-sm text-slate-300">Base Model (Draft)</span>
                        <span className="text-xs font-mono text-blue-300">Llama-3-8B-Instruct</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-cyber-700 pb-2">
                        <span className="text-sm text-slate-300">Main Model (Verify)</span>
                        <span className="text-xs font-mono text-purple-300">Llama-3-70B-GGUF (Q4_K_M)</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-cyber-700 pb-2">
                        <span className="text-sm text-slate-300">Context Window</span>
                        <span className="text-xs font-mono text-slate-400">8192 Tokens</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Format</span>
                        <span className="text-xs font-mono text-slate-400">SafeTensors / GGUF</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Core Innovation: Speculative Decoding */}
        <div className="glass-panel p-6 rounded-xl border border-blue-500/20">
          <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
             <Zap size={20} /> {t.technology.specTitle}
          </h3>
          <p className="text-sm text-slate-300 mb-4">
            {t.technology.specDesc}
          </p>
          
          <div className="bg-cyber-900/50 p-4 rounded border border-cyber-700 relative">
             <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                   <div className="text-xs text-slate-500 mb-1">DRAFT MODEL</div>
                   <div className="px-3 py-1 bg-blue-900/30 border border-blue-500/50 rounded text-blue-300 text-xs font-mono">
                      Llama-3-8B
                   </div>
                </div>
                <div className="flex-1 h-[1px] bg-blue-500/30 relative">
                   <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] text-blue-400">Token Drafts (ms)</div>
                </div>
                <div className="text-center">
                   <div className="text-xs text-slate-500 mb-1">VERIFIER MODEL</div>
                   <div className="px-3 py-1 bg-purple-900/30 border border-purple-500/50 rounded text-purple-300 text-xs font-mono">
                      Llama-3-70B
                   </div>
                </div>
             </div>
             <div className="text-xs text-center text-slate-400 italic">
                {t.technology.specNote}
             </div>
          </div>
        </div>

        {/* Vector Engine */}
        <div className="glass-panel p-6 rounded-xl border border-purple-500/20">
          <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
             <Database size={20} /> {t.technology.vecTitle}
          </h3>
          <ul className="space-y-3">
             <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                <div>
                   <strong className="text-slate-200 text-sm block">PagedAttention (vLLM)</strong>
                   <p className="text-xs text-slate-400">{t.technology.vec1}</p>
                </div>
             </li>
             <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                <div>
                   <strong className="text-slate-200 text-sm block">Continuous Batching</strong>
                   <p className="text-xs text-slate-400">{t.technology.vec2}</p>
                </div>
             </li>
             <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                <div>
                   <strong className="text-slate-200 text-sm block">AWQ Quantization (4-bit)</strong>
                   <p className="text-xs text-slate-400">{t.technology.vec3}</p>
                </div>
             </li>
          </ul>
        </div>
      </div>

      {/* The Stack */}
      <div className="glass-panel p-8 rounded-xl border border-cyan-500/20">
         <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Layers size={20} className="text-cyan-400"/> {t.technology.stackTitle}
         </h3>
         
         <div className="space-y-2">
            {/* Application Layer */}
            <div className="flex items-center gap-4 p-3 bg-cyber-800/30 rounded border border-cyber-700 hover:border-cyan-500/50 transition-colors">
               <div className="w-24 text-xs font-mono text-slate-500 text-right uppercase">Agentic</div>
               <div className="h-8 w-[1px] bg-cyber-600"></div>
               <div className="flex gap-2">
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-600">LangGraph</span>
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-600">AutoGPT Fork</span>
               </div>
            </div>

            {/* Inference Layer */}
            <div className="flex items-center gap-4 p-3 bg-cyber-800/50 rounded border border-cyber-700 hover:border-cyan-500/50 transition-colors">
               <div className="w-24 text-xs font-mono text-cyan-500 text-right uppercase font-bold">Inference</div>
               <div className="h-8 w-[1px] bg-cyber-600"></div>
               <div className="flex gap-2">
                  <span className="px-2 py-1 rounded bg-cyan-900/20 text-cyan-300 text-xs border border-cyan-700">vLLM</span>
                  <span className="px-2 py-1 rounded bg-cyan-900/20 text-cyan-300 text-xs border border-cyan-700">TensorRT-LLM</span>
                  <span className="px-2 py-1 rounded bg-cyan-900/20 text-cyan-300 text-xs border border-cyan-700">ExLlamaV2</span>
               </div>
            </div>

            {/* Orchestration Layer */}
            <div className="flex items-center gap-4 p-3 bg-cyber-800/30 rounded border border-cyber-700 hover:border-cyan-500/50 transition-colors">
               <div className="w-24 text-xs font-mono text-slate-500 text-right uppercase">Orchestrator</div>
               <div className="h-8 w-[1px] bg-cyber-600"></div>
               <div className="flex gap-2">
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-600">Ray.io</span>
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-600">K8s (K3s)</span>
               </div>
            </div>

             {/* Hardware Layer */}
            <div className="flex items-center gap-4 p-3 bg-cyber-800/30 rounded border border-cyber-700 hover:border-cyan-500/50 transition-colors">
               <div className="w-24 text-xs font-mono text-slate-500 text-right uppercase">Metal</div>
               <div className="h-8 w-[1px] bg-cyber-600"></div>
               <div className="flex gap-2">
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-600">NVIDIA H100</span>
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-600">RTX 4090 (Modded)</span>
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-600">InfiniBand</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};