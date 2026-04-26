"use client";

import { useState, useEffect } from "react";
import { Radar, Bar, Line } from "react-chartjs-2";
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
  const [activeTab, setActiveTab] = useState("analytics");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Data Statistik Psikometrik (Sesuai Rancangan S3)
  const cfaData = {
    labels: ['Information', 'Creation', 'Pedagogy', 'Ethics', 'Social'],
    datasets: [{
      label: 'Model Fit (CFA)',
      data: [0.92, 0.88, 0.85, 0.94, 0.90],
      backgroundColor: 'rgba(56, 189, 248, 0.2)', // Light Blue
      borderColor: '#38bdf8',
      borderWidth: 2,
    }]
  };

  const scoreDistData = {
    labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
    datasets: [{
      label: 'Distribusi Skor Responden (N=284)',
      data: [12, 45, 120, 85, 22],
      backgroundColor: '#1e40af', // Deep Blue
    }]
  };

  if (!isMounted) return null;

  return (
    <div className="antialiased flex h-screen overflow-hidden relative"
         style={{ 
           backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url('/campus_bg.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      
      {/* Sidebar - Elegant Dark Blue Theme */}
      <aside className="w-20 lg:w-72 flex-shrink-0 glass-panel border-r border-white/10 flex flex-col transition-all duration-300 relative overflow-hidden bg-slate-900/40">
        <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/10 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <i className="fa-solid fa-microchip text-white text-2xl"></i>
          </div>
          <h1 className="hidden lg:block ml-4 text-2xl font-bold tracking-tight text-white uppercase italic">HDAP <span className="text-blue-400">Core</span></h1>
        </div>

        <nav className="flex-1 py-8 space-y-2 px-4">
          {[
            { id: 'analytics', icon: 'fa-chart-pie', label: 'Psychometric Analytics' },
            { id: 'instruments', icon: 'fa-folder-tree', label: 'Instrument Manager' },
            { id: 'dif', icon: 'fa-scale-balanced', label: 'DIF Analysis Report' },
            { id: 'users', icon: 'fa-users', label: 'Respondent Database' },
            { id: 'ai-config', icon: 'fa-robot', label: 'AI Engine Settings' }
          ].map((item) => (
            <button key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all border font-bold group ${
                      activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 border-blue-400' 
                      : 'text-slate-400 hover:bg-slate-800/40 border-transparent'
                    }`}>
              <i className={`fa-solid ${item.icon} text-xl w-8 text-center`}></i>
              <span className="hidden lg:block text-sm tracking-wide ml-2">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Profile Admin Section */}
        <div className="p-6 border-t border-white/10 bg-slate-950/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white shadow-lg">AD</div>
             <div className="hidden lg:block">
                <p className="text-sm font-bold text-white">Administrator</p>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">S3 Research Account</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header - Deep Blue Gradient */}
        <header className="h-24 flex items-center justify-between px-8 z-10 border-b border-white/10 bg-gradient-to-r from-slate-900 to-blue-900 text-white shadow-2xl">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Admin Analytics Center</h2>
            <p className="text-blue-300 text-xs mt-1 font-bold tracking-widest opacity-80">Hybrid-Diagnostic Assessment Platform Engine v1.0</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
               <div className="text-right">
                  <p className="text-[10px] font-bold text-blue-400 uppercase">Total Respondents</p>
                  <p className="text-lg font-black leading-none">284</p>
               </div>
               <div className="text-right border-l border-white/10 pl-4">
                  <p className="text-[10px] font-bold text-blue-400 uppercase">Reliability (α)</p>
                  <p className="text-lg font-black leading-none text-green-400">0.923</p>
               </div>
            </div>
            <button className="bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/20 transition">
              <i className="fa-solid fa-bell"></i>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-950/20">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {activeTab === 'analytics' && (
              <div className="animate-in fade-in duration-500 space-y-8">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   {[
                     { label: 'RMSEA', value: '0.042', status: 'Excellent', color: 'text-green-400' },
                     { label: 'CFI', value: '0.965', status: 'Good', color: 'text-blue-400' },
                     { label: 'TLI', value: '0.958', status: 'Good', color: 'text-blue-400' },
                     { label: 'SRMR', value: '0.031', status: 'Excellent', color: 'text-green-400' }
                   ].map((stat, i) => (
                     <div key={i} className="glass-panel p-6 rounded-3xl border-white/5 bg-slate-900/40">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 italic">Result: {stat.status}</p>
                     </div>
                   ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* CFA Radar Chart */}
                  <div className="glass-panel rounded-[40px] p-8 flex flex-col border border-white/10 shadow-xl bg-slate-900/60">
                    <h3 className="text-xl font-bold text-white mb-6">Structural Validity (CFA Factor Loadings)</h3>
                    <div className="flex-1 min-h-[350px] bg-white/5 rounded-3xl p-4">
                      <Radar data={cfaData} options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, angleLines: { color: 'rgba(255,255,255,0.05)' }, ticks: { display: false } } }
                      }} />
                    </div>
                  </div>

                  {/* Score Distribution */}
                  <div className="glass-panel rounded-[40px] p-8 bg-slate-900/60 border border-white/10 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6">Respondent Score Distribution</h3>
                    <div className="flex-1 min-h-[350px] bg-white/5 rounded-3xl p-4">
                      <Bar data={scoreDistData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'instruments' && (
              <div className="animate-in fade-in duration-500">
                <div className="glass-panel rounded-[40px] p-10 bg-slate-900/40 border-white/10 shadow-2xl">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h3 className="text-3xl font-bold text-white tracking-tight">Instrument Repository</h3>
                      <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">Manage Assessment Modules</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center gap-3">
                      <i className="fa-solid fa-cloud-arrow-up"></i> Upload New Instrument
                    </button>
                  </div>
                  
                  <div className="overflow-hidden rounded-3xl border border-white/10">
                     <table className="w-full text-left text-sm">
                        <thead className="bg-slate-800 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                           <tr>
                              <th className="px-6 py-4">Filename</th>
                              <th className="px-6 py-4">Dimensions</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {[
                             { name: 'madel5c_final_v1.json', dims: '5 Dimensi', status: 'ACTIVE' },
                             { name: 'pdi_dl_preliminary.csv', dims: '4 Dimensi', status: 'ARCHIVED' }
                           ].map((item, i) => (
                             <tr key={i} className="bg-slate-900/20 hover:bg-slate-800/40 transition">
                                <td className="px-6 py-5 font-bold text-white">{item.name}</td>
                                <td className="px-6 py-5 text-slate-400 font-medium">{item.dims}</td>
                                <td className="px-6 py-5">
                                   <span className={`px-3 py-1 rounded-full text-[10px] font-black ${item.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                                      {item.status}
                                   </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                   <button className="text-blue-400 hover:text-white mr-4 transition"><i className="fa-solid fa-edit"></i></button>
                                   <button className="text-red-400 hover:text-white transition"><i className="fa-solid fa-trash"></i></button>
                                </td>
                             </tr>
                           ))}
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
