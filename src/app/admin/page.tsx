"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Radar, Bar, Doughnut, Scatter } from "react-chartjs-2";
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
  const [currentTab, setCurrentTab] = useState("settings");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    router.push("/login");
  };

  // CFA Radar Data
  const cfaData = {
    labels: ['Information', 'Creation', 'Pedagogy', 'Ethics'],
    datasets: [{
      label: 'Standard Score',
      data: [4.2, 3.8, 4.5, 4.0],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
    }]
  };

  // SUS Distribution Data
  const susDistData = {
    labels: ['0-50', '51-60', '61-70', '71-80', '81-90', '91-100'],
    datasets: [{
      label: 'Users',
      data: [2, 5, 12, 28, 65, 30],
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      borderColor: '#3b82f6',
      borderWidth: 1
    }]
  };

  if (!isMounted) return null;

  return (
    <div className="antialiased flex h-screen overflow-hidden bg-[#0f172a] text-[#f8fafc]"
         style={{ 
           backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('/admin_bg_v1.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      
      {/* Sidebar - 1:1 Mockup */}
      <aside className="w-64 flex-shrink-0 glass-panel border-r border-slate-700/50 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
            <i className="fa-solid fa-microchip text-blue-400 text-2xl mr-3"></i>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 italic">HDAP Admin</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {[
              { id: 'preliminary', icon: 'fa-stethoscope', label: 'Preliminary Analysis', color: 'border-blue-400 text-blue-400' },
              { id: 'madel5c', icon: 'fa-vial-circle-check', label: 'MADEL5C Analysis', color: 'border-indigo-400 text-indigo-400' },
              { id: 'instruments', icon: 'fa-file-code', label: 'Instrument Manager', color: 'border-blue-400 text-blue-400' },
              { id: 'participants', icon: 'fa-users', label: 'Participants Data', color: 'border-blue-400 text-blue-400' },
              { id: 'usability', icon: 'fa-face-smile', label: 'User Experience (SUS)', color: 'border-blue-400 text-blue-400' },
              { id: 'settings', icon: 'fa-cog', label: 'System Settings', color: 'border-orange-400 text-orange-400' }
            ].map((item) => (
              <button key={item.id} onClick={() => setCurrentTab(item.id)} 
                      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all border-l-4 ${
                        currentTab === item.id 
                        ? `bg-slate-800/80 ${item.color.split(' ')[0]} ${item.color.split(' ')[1]}` 
                        : 'text-slate-400 hover:bg-slate-800/50 border-transparent'
                      }`}>
                <i className={`fa-solid ${item.icon} w-6`}></i>
                <span className="font-bold text-sm tracking-tight ml-2">{item.label}</span>
              </button>
            ))}

            {/* LOG OUT ADMIN - DITAMBAHKAN */}
            <button onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 rounded-xl transition-all text-red-400 hover:bg-red-900/20 mt-10">
                <i className="fa-solid fa-right-from-bracket w-6"></i>
                <span className="font-bold text-sm ml-2 uppercase">Log Out</span>
            </button>
        </nav>
        <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold">A</div>
                <div>
                    <p className="text-xs font-bold">Admin Pusat</p>
                    <p className="text-[10px] text-slate-500">Infrastructure Manager</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-8 glass-panel border-b border-slate-700/50 z-10">
            <h2 className="text-xl font-bold uppercase italic tracking-tighter">
                {currentTab === 'preliminary' ? 'Preliminary Diagnostic' : 
                 currentTab === 'madel5c' ? 'MADEL5C Psychometric Analysis' : 
                 currentTab === 'instruments' ? 'Instrument Manager' : 
                 currentTab === 'usability' ? 'User Experience' : 
                 currentTab === 'settings' ? 'System & AI Configuration' : 'Participants'}
            </h2>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold text-slate-300">SERVER ONLINE</span>
                </div>
                <button className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"><i className="fa-solid fa-bell"></i></button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative">
            <div className="max-w-7xl mx-auto space-y-8 relative animate-in fade-in duration-500">
                
                {/* SYSTEM SETTINGS TAB */}
                {currentTab === 'settings' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="glass-panel rounded-3xl p-8 border-indigo-500/20 bg-indigo-500/5">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <i className="fa-solid fa-brain text-3xl"></i>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">AI Engine Configuration</h3>
                                <p className="text-sm text-slate-400">Integrasi Google Gemini Pro / OpenAI</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">AI Model Provider</label>
                                <select className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-5 py-4 text-sm text-white outline-none">
                                    <option>Google Gemini Pro (Recommended)</option>
                                    <option>OpenAI GPT-4o</option>
                                </select>
                            </div>
                            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all">Save & Test Connection</button>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="glass-panel rounded-3xl p-8 border-blue-500/20">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <i className="fa-solid fa-server text-3xl"></i>
                                    </div>
                                    <h3 className="text-xl font-bold">VPS Monitoring</h3>
                                </div>
                                <span className="px-4 py-1 bg-green-500 text-white text-[10px] font-black rounded-full">HEALTHY</span>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">RAM Usage (4GB Total)</p>
                                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden"><div className="bg-blue-500 h-full w-[30%]"></div></div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">CPU Load</p>
                                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden"><div className="bg-purple-500 h-full w-[18%]"></div></div>
                                </div>
                            </div>
                        </div>
                     </div>
                  </div>
                )}

                {/* MADEL5C ANALYSIS TAB */}
                {currentTab === 'madel5c' && (
                  <div className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                          { label: 'Participants', value: '284', icon: 'fa-users', color: 'text-blue-400' },
                          { label: 'SJT Items', value: '25', icon: 'fa-check-double', color: 'text-green-400' },
                          { label: 'Aiken\'s V', value: '0.86', icon: 'fa-vial-circle-check', color: 'text-purple-400' },
                          { label: 'DIF Flags', value: '2', icon: 'fa-triangle-exclamation', color: 'text-red-400' }
                        ].map((stat, i) => (
                          <div key={i} className="glass-panel rounded-2xl p-6 flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center ${stat.color}`}><i className={`fa-solid ${stat.icon}`}></i></div>
                             <div><p className="text-[10px] text-slate-500 font-bold uppercase">{stat.label}</p><p className="text-2xl font-black">{stat.value}</p></div>
                          </div>
                        ))}
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="glass-panel rounded-3xl p-8 lg:col-span-2">
                           <h3 className="text-xl font-bold mb-8 italic tracking-tight uppercase">Structural Validity (CFA)</h3>
                           <div className="grid grid-cols-3 gap-4 mb-8">
                              <div className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-green-500"><p className="text-[10px] text-slate-500 font-bold">RMSEA</p><p className="text-xl font-black text-green-400">0.045</p></div>
                              <div className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-green-500"><p className="text-[10px] text-slate-500 font-bold">CFI</p><p className="text-xl font-black text-green-400">0.962</p></div>
                              <div className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-blue-500"><p className="text-[10px] text-slate-500 font-bold">TLI</p><p className="text-xl font-black text-blue-400">0.941</p></div>
                           </div>
                           <div className="h-64"><Radar data={cfaData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                        </div>

                        <div className="glass-panel rounded-3xl p-8 lg:col-span-1">
                           <h3 className="text-xl font-bold mb-8 italic tracking-tight uppercase">Wright Map (PCM)</h3>
                           <div className="h-[400px] bg-slate-800/30 rounded-2xl border border-slate-700 flex flex-col items-center justify-center p-4">
                              <div className="flex gap-4 h-full w-full items-end justify-center">
                                 <div className="w-8 bg-blue-500/40 h-[80%] rounded-t-lg"></div>
                                 <div className="w-1 bg-slate-600 h-full"></div>
                                 <div className="w-8 bg-purple-500/40 h-[60%] rounded-t-lg"></div>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-6 text-center italic">Persons (Left) vs Items (Right)</p>
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {/* USABILITY TAB */}
                {currentTab === 'usability' && (
                  <div className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="glass-panel rounded-3xl p-10 bg-blue-600/10 border-blue-500/30">
                           <p className="text-sm font-bold text-blue-400 uppercase mb-4">Avg SUS Score</p>
                           <p className="text-7xl font-black">88.5</p>
                           <p className="text-xs font-bold text-green-400 mt-4 uppercase">Grade A / Excellent</p>
                        </div>
                        <div className="glass-panel rounded-3xl p-10 bg-purple-600/10 border-purple-500/30">
                           <p className="text-sm font-bold text-purple-400 uppercase mb-4">User Satisfaction</p>
                           <p className="text-7xl font-black">94%</p>
                           <p className="text-xs font-bold text-purple-400 mt-4 uppercase">N=142 RESPONDENTS</p>
                        </div>
                        <div className="glass-panel rounded-3xl p-10 bg-slate-800/50">
                           <p className="text-xs font-bold text-slate-500 uppercase mb-6 tracking-widest">Usability Matrix</p>
                           <div className="space-y-5">
                              {['Efficiency', 'Memorability', 'Learnability'].map((label, i) => (
                                <div key={i}>
                                   <div className="flex justify-between text-xs font-bold mb-1"><span>{label}</span><span className="text-blue-400">4.8</span></div>
                                   <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-400 h-full w-[96%]"></div></div>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="glass-panel rounded-3xl p-8">
                        <h3 className="text-xl font-bold mb-8 uppercase italic tracking-tight">SUS Score Distribution</h3>
                        <div className="h-64"><Bar data={susDistData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                     </div>
                  </div>
                )}

            </div>
        </div>
      </main>
    </div>
  );
}
