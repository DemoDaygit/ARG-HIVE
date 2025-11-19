
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Coins, TrendingUp, Briefcase, Users, Server, Flame, RefreshCw, Lock } from 'lucide-react';
import { ROIChartData } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

const data: ROIChartData[] = [
  { month: 'Q1', revenue: 5000, costs: 15000, cumulativeProfit: -10000 },
  { month: 'Q2', revenue: 25000, costs: 20000, cumulativeProfit: -5000 },
  { month: 'Q3', revenue: 60000, costs: 25000, cumulativeProfit: 30000 },
  { month: 'Q4', revenue: 120000, costs: 35000, cumulativeProfit: 115000 },
  { month: 'Y2-Q1', revenue: 250000, costs: 50000, cumulativeProfit: 315000 },
  { month: 'Y2-Q2', revenue: 450000, costs: 70000, cumulativeProfit: 695000 },
];

export const TokenomicsView: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <div className="mb-8 border-b border-cyber-700 pb-4">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Briefcase className="text-cyan-400" />
          {t.tokenomics.title}
        </h2>
        <p className="text-slate-400">
          {t.tokenomics.desc}
        </p>
      </div>

      {/* Revenue Streams Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="glass-panel p-5 rounded-lg border border-cyber-600 relative overflow-hidden group hover:border-cyan-500 transition-colors">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
               <Server size={64} className="text-white" />
            </div>
            <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-wider mb-2">{t.tokenomics.revStream1}</h4>
            <div className="text-2xl font-bold text-white mb-1">$100B+</div>
            <p className="text-xs text-slate-400">Global B2B AI Market</p>
            <div className="mt-4 pt-4 border-t border-cyber-700">
               <p className="text-sm text-slate-300">{t.tokenomics.uDesc}</p>
            </div>
         </div>

         <div className="glass-panel p-5 rounded-lg border border-cyber-600 relative overflow-hidden group hover:border-purple-500 transition-colors">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
               <Users size={64} className="text-white" />
            </div>
            <h4 className="text-purple-400 font-bold text-sm uppercase tracking-wider mb-2">{t.tokenomics.revStream2}</h4>
            <div className="text-2xl font-bold text-white mb-1">High Margin</div>
            <p className="text-xs text-slate-400">Enterprise Installations</p>
            <div className="mt-4 pt-4 border-t border-cyber-700">
               <p className="text-sm text-slate-300">{t.tokenomics.uVal}</p>
            </div>
         </div>

         <div className="glass-panel p-5 rounded-lg border border-cyber-600 relative overflow-hidden group hover:border-green-500 transition-colors">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
               <Coins size={64} className="text-white" />
            </div>
            <h4 className="text-green-400 font-bold text-sm uppercase tracking-wider mb-2">{t.tokenomics.revStream3}</h4>
            <div className="text-2xl font-bold text-white mb-1">Deflationary</div>
            <p className="text-xs text-slate-400">Token Value Capture</p>
             <div className="mt-4 pt-4 border-t border-cyber-700">
               <p className="text-sm text-slate-300">{t.tokenomics.bDesc}</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-xl border border-cyber-700 h-[350px]">
             <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <TrendingUp size={18} className="text-green-400"/>
               {t.tokenomics.chartTitle}
             </h3>
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" tick={{fill: '#64748b'}} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b'}} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#22d3ee" fill="url(#colorRev)" name={t.tokenomics.chartRev} />
                  <Area type="monotone" dataKey="cumulativeProfit" stackId="2" stroke="#4ade80" fill="url(#colorProfit)" name={t.tokenomics.chartProf} />
                </AreaChart>
             </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-600 italic text-center">{t.tokenomics.disclaimer}</p>
        </div>

        {/* Economic Engine Deep Dive */}
        <div className="flex flex-col gap-4 h-full">
           <h3 className="text-xl font-bold text-white mb-2">{t.tokenomics.engineTitle}</h3>
           
           <div className="glass-panel p-4 rounded-lg border-l-4 border-cyan-500 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                 <RefreshCw size={18} className="text-cyan-400" />
                 <h4 className="text-cyan-400 font-bold text-sm">{t.tokenomics.engine1Title}</h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{t.tokenomics.engine1Desc}</p>
           </div>

           <div className="glass-panel p-4 rounded-lg border-l-4 border-yellow-500 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                 <Lock size={18} className="text-yellow-400" />
                 <h4 className="text-yellow-400 font-bold text-sm">{t.tokenomics.engine2Title}</h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{t.tokenomics.engine2Desc}</p>
           </div>

           <div className="glass-panel p-4 rounded-lg border-l-4 border-red-500 flex-1 flex flex-col justify-center bg-red-900/10">
              <div className="flex items-center gap-2 mb-2">
                 <Flame size={18} className="text-red-400" />
                 <h4 className="text-red-400 font-bold text-sm">{t.tokenomics.engine3Title}</h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{t.tokenomics.engine3Desc}</p>
           </div>
        </div>
      </div>
    </div>
  );
};
