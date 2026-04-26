"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Radar, Bar, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement
);

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState("preliminary");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    router.push("/login");
  };

  // Predictive Correlation Data (Scatter Plot)
  const correlationData = {
    datasets: [{
      label: 'Prelim Score vs MADEL5C Theta',
      data: Array.from({length: 50}, () => ({
        x: Math.random() * 60 + 40,
        y: Math.random() * 4 - 2
      })),
      backgroundColor: 'rgba(52, 211, 153, 0.6)'
    }]
  };

  // Preliminary Stats
  const prelimDistData = {
    labels: ['Level Awal', 'Level Menengah', 'Level Lanjut'],
    datasets: [{
      label: 'Jumlah Mahasiswa',
      data: [450, 820, 150],
      backgroundColor: ['#f43f5e', '#3b82f6', '#10b981'],
      borderRadius: 15
    }]
  };

  // DIF Plot Data
  const difChartData = {
    labels: ['PED_02', 'ETH_05', 'INFO_01', 'CREATE_04'],
    datasets: [
        { label: 'Laki-laki', data: [1.2, 0.5, 0.8, 1.0], backgroundColor: '#3b82f6', borderRadius: 6 },
        { label: 'Perempuan', data: [2.5, 1.4, 0.7, 0.9], backgroundColor: '#f43f5e', borderRadius: 6 }
    ]
  };

  if (!isMounted) return null;

  return (
    <div className="antialiased flex h-screen overflow-hidden bg-[#0f172a] text-[#f8fafc]"
         style={{ 
           backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95)), url('/admin_bg_v1.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 glass-panel border-r border-slate-700/50 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
            <i className="fa-solid fa-microchip text-blue-400 text-2xl mr-3"></i>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 italic">HDAP Admin</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {[
              { id: 'preliminary', icon: 'fa-stethoscope', label: 'Preliminary Analysis' },
              { id: 'madel5c', icon: 'fa-vial-circle-check', label: 'MADEL5C (PCM & DIF)' },
              { id: 'instruments', icon: 'fa-file-code', label: 'Instrument Manager' },
              { id: 'usability', icon: 'fa-face-smile', label: 'User Experience (SUS)' },
              { id: 'settings', icon: 'fa-cog', label: 'System Settings' }
            ].map((item) => (
              <button key={item.id} onClick={() => setCurrentTab(item.id)} 
                      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all border-l-4 ${
                        currentTab === item.id 
                        ? 'bg-slate-800/80 border-blue-400 text-blue-400' 
                        : 'text-slate-400 hover:bg-slate-800/50 border-transparent'
                      }`}>
                <i className={`fa-solid ${item.icon} w-6`}></i>
                <span className="font-bold text-sm ml-2">{item.label}</span>
              </button>
            ))}
            <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 rounded-xl transition-all text-red-400 hover:bg-red-900/20 mt-10"><i className="fa-solid fa-right-from-bracket w-6"></i><span className="font-bold text-sm ml-2 uppercase">Log Out</span></button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-8 glass-panel border-b border-slate-700/50 z-10">
            <h2 className="text-xl font-bold uppercase italic tracking-tighter">
                {currentTab === 'preliminary' ? 'Preliminary & Predictive Analysis' : 
                 currentTab === 'madel5c' ? 'MADEL5C: PCM & DIF Analysis' : 
                 currentTab === 'instruments' ? 'Instrument Manager' : 
                 currentTab === 'usability' ? 'User Experience' : 'System Configuration'}
            </h2>
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span><span className="text-[10px] font-bold text-slate-300 uppercase">Engine Ready</span></div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                
                {/* PRELIMINARY TAB */}
                {currentTab === 'preliminary' && (
                  <div className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-panel rounded-3xl p-8 bg-blue-600/5 border-blue-500/20"><p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Total Diagnostic</p><p className="text-4xl font-black">1,420</p></div>
                        <div className="glass-panel rounded-3xl p-8 bg-green-600/5 border-green-500/20"><p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-2">Qualified to SJT</p><p className="text-4xl font-black">284</p></div>
                        <div className="glass-panel rounded-3xl p-8 bg-purple-600/5 border-purple-500/20"><p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Predictive Validty (R)</p><p className="text-4xl font-black">0.82</p></div>
                     </div>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="glass-panel rounded-3xl p-8 bg-slate-900/60 border-white/10 shadow-xl">
                           <h3 className="text-lg font-bold mb-6 uppercase italic tracking-tight"><i className="fa-solid fa-chart-bar text-blue-400"></i> Initial Level Distribution</h3>
                           <div className="h-80"><Bar data={prelimDistData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                        </div>
                        <div className="glass-panel rounded-3xl p-8 border-blue-500/20 bg-slate-900/60 shadow-xl">
                           <h3 className="text-lg font-bold mb-6 uppercase italic tracking-tight"><i className="fa-solid fa-link text-green-400"></i> Predictive Analysis (Scatter)</h3>
                           <div className="h-80"><Scatter data={correlationData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                        </div>
                     </div>
                  </div>
                )}

                {/* MADEL5C (PCM & DIF) TAB */}
                {currentTab === 'madel5c' && (
                  <div className="space-y-8">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Wright Map PCM */}
                        <div className="glass-panel rounded-3xl p-10 bg-slate-900/60 border-white/10 shadow-xl">
                           <h3 className="text-xl font-bold mb-8 uppercase italic tracking-tight"><i className="fa-solid fa-align-left text-purple-400"></i> Wright Map (PCM Engine)</h3>
                           <div className="h-[400px] bg-slate-800/30 rounded-[30px] flex items-center justify-center p-8 border border-white/5">
                               <div className="flex gap-10 items-end h-full">
                                  <div className="w-12 bg-blue-500/30 h-[90%] rounded-t-xl relative"><span className="absolute -top-6 left-0 text-[10px] font-bold">Ability (θ)</span></div>
                                  <div className="w-1 bg-slate-700 h-full"></div>
                                  <div className="w-12 bg-purple-500/30 h-[70%] rounded-t-xl relative"><span className="absolute -top-6 left-0 text-[10px] font-bold">Difficulty (β)</span></div>
                               </div>
                           </div>
                           <p className="text-[10px] text-slate-500 mt-6 text-center italic">"Wright Map menunjukkan distribusi kemampuan laten (theta) dibandingkan tingkat kesulitan butir (beta)."</p>
                        </div>

                        {/* DIF Analysis */}
                        <div className="glass-panel rounded-3xl p-10 bg-slate-900/60 border-white/10 shadow-xl">
                           <h3 className="text-xl font-bold mb-8 uppercase italic tracking-tight"><i className="fa-solid fa-scale-unbalanced text-orange-400"></i> Differential Item Functioning (DIF)</h3>
                           <div className="h-64 mb-8"><Bar data={difChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                           <table className="w-full text-left text-[10px] border-collapse">
                              <thead><tr className="text-slate-500 border-b border-white/10"><th className="pb-3">Item</th><th className="pb-3">Dimension</th><th className="pb-3">p-value</th><th className="pb-3">Status</th></tr></thead>
                              <tbody>
                                 <tr className="border-b border-white/5"><td className="py-3">PED_02</td><td className="py-3">Pedagogy</td><td className="py-3 text-red-400">0.024 *</td><td className="py-3"><span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[8px] font-black uppercase">Bias</span></td></tr>
                                 <tr className="border-b border-white/5"><td className="py-3">ETH_05</td><td className="py-3">Ethics</td><td className="py-3 text-red-400">0.041 *</td><td className="py-3"><span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[8px] font-black uppercase">Bias</span></td></tr>
                                 <tr><td className="py-3">INFO_01</td><td className="py-3">Info</td><td className="py-3">0.421</td><td className="py-3"><span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[8px] font-black uppercase">Neutral</span></td></tr>
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
                )}

              </div>
        </div>
      </main>
    </div>
  );
}
