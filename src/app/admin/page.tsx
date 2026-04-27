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
  const [currentTab, setCurrentTab] = useState("madel5c");
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
  const cfaRadarData = {
    labels: ['Information', 'Creation', 'Pedagogy', 'Ethics', 'Social'],
    datasets: [{
      label: 'Standardized Loadings',
      data: [0.82, 0.75, 0.88, 0.79, 0.85],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
    }]
  };

  // Wright Map Data (Simplified as Bar)
  const wrightMapData = {
    labels: ['Persons', 'Items'],
    datasets: [
      { label: 'Distribution', data: [2.5, 1.8], backgroundColor: ['#3b82f6', '#8b5cf6'], borderRadius: 4 }
    ]
  };

  // Literacy Level (Doughnut)
  const literacyData = {
    labels: ['Tinggi', 'Sedang', 'Rendah'],
    datasets: [{
      data: [45, 120, 119],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
      borderWidth: 0,
    }]
  };

  // Cluster LPTK (Horizontal Bar)
  const clusterData = {
    labels: ['UNJ', 'UPI', 'UNESA', 'UM', 'Swasta Lainnya'],
    datasets: [{
      label: 'Respondents',
      data: [85, 72, 60, 45, 22],
      backgroundColor: '#3b82f6',
      borderRadius: 4,
    }]
  };

  // DIF Plot Data
  const difChartData = {
    labels: ['PED_02', 'ETH_05', 'INFO_01', 'CREATE_04'],
    datasets: [
        { label: 'Male', data: [1.2, 0.5, 0.8, 1.0], backgroundColor: '#3b82f6', borderRadius: 4 },
        { label: 'Female', data: [2.5, 1.4, 0.7, 0.9], backgroundColor: '#f43f5e', borderRadius: 4 }
    ]
  };

  if (!isMounted) return null;

  return (
    <div className="antialiased flex h-screen overflow-hidden bg-[#0B1120] text-[#f8fafc]"
         style={{ 
           backgroundImage: "linear-gradient(rgba(11, 17, 32, 0.9), rgba(11, 17, 32, 0.95)), url('/admin_bg_v1.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#0F172A]/80 backdrop-blur-2xl border-r border-slate-800 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <i className="fa-solid fa-microchip text-blue-500 text-xl mr-3"></i>
            <h1 className="text-lg font-bold text-white tracking-wide">HDAP Admin</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {[
              { id: 'preliminary', icon: 'fa-stethoscope', label: 'Preliminary Analysis' },
              { id: 'madel5c', icon: 'fa-vial-circle-check', label: 'MADEL5C Analysis' },
              { id: 'instruments', icon: 'fa-file-code', label: 'Instrument Manager' },
              { id: 'participants', icon: 'fa-users', label: 'Participants Data' },
              { id: 'usability', icon: 'fa-face-smile', label: 'User Experience (SUS)' },
              { id: 'settings', icon: 'fa-cog', label: 'System Settings' }
            ].map((item) => (
              <button key={item.id} onClick={() => setCurrentTab(item.id)} 
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all text-sm ${
                        currentTab === item.id 
                        ? 'bg-blue-600/20 text-blue-400 font-bold border-l-2 border-blue-500' 
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}>
                <i className={`fa-solid ${item.icon} w-5`}></i>
                <span className="ml-2">{item.label}</span>
              </button>
            ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">A</div>
              <div><p className="text-xs font-bold text-white">Admin Pusat</p><p className="text-[10px] text-slate-500">System Administrator</p></div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-8 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 z-10">
            <h2 className="text-lg font-bold text-white">
                {currentTab === 'preliminary' ? 'Preliminary Analysis' : 
                 currentTab === 'madel5c' ? 'MADEL5C Psychometric Analysis' : 
                 currentTab === 'participants' ? 'Participants Data' : 
                 currentTab === 'instruments' ? 'Instrument Manager' : 
                 currentTab === 'usability' ? 'User Experience' : 'System Configuration'}
            </h2>
            <div className="flex items-center gap-4">
                <button className="px-4 py-1.5 bg-blue-600/20 text-blue-400 text-xs font-bold rounded-full border border-blue-500/30 flex items-center gap-2 hover:bg-blue-600/30 transition-all">
                   <i className="fa-solid fa-download"></i> DOWNLOAD CSV (25 ITEMS)
                </button>
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                   <span className="text-[10px] font-bold text-slate-300">ENGINE ONLINE</span>
                </div>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 relative">
            <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">
                
                {currentTab === 'madel5c' && (
                  <>
                     {/* STATS CARDS */}
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                          { label: 'PARTICIPANTS', value: '284', icon: 'fa-users', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                          { label: 'SJT ITEMS', value: '25', icon: 'fa-file-lines', color: 'text-green-400', bg: 'bg-green-500/10' },
                          { label: "AIKEN'S V", value: '0.86', icon: 'fa-vial', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                          { label: 'DIF FLAGS', value: '2', icon: 'fa-triangle-exclamation', color: 'text-orange-400', bg: 'bg-orange-500/10' }
                        ].map((stat, i) => (
                          <div key={i} className="bg-[#1E293B]/80 rounded-2xl p-5 border border-slate-700/50 flex items-center gap-4 shadow-lg">
                             <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}><i className={`fa-solid ${stat.icon}`}></i></div>
                             <div><p className="text-[10px] text-slate-400 font-bold tracking-wider">{stat.label}</p><p className="text-2xl font-black text-white">{stat.value}</p></div>
                          </div>
                        ))}
                     </div>

                     {/* TOP CHARTS ROW */}
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* CFA Chart */}
                        <div className="lg:col-span-2 bg-[#1E293B]/80 rounded-2xl p-6 border border-slate-700/50 shadow-lg">
                           <div className="flex justify-between items-center mb-6">
                              <h3 className="text-sm font-bold text-white flex items-center gap-2"><i className="fa-solid fa-chart-network text-blue-400"></i> Structural Validity (CFA)</h3>
                              <span className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-full font-bold">LAVAAN</span>
                           </div>
                           <div className="flex gap-6 mb-6">
                              <div className="border-l-2 border-green-500 pl-3"><p className="text-[10px] text-slate-400">RMSEA</p><p className="text-lg font-bold text-white">0.045</p></div>
                              <div className="border-l-2 border-green-500 pl-3"><p className="text-[10px] text-slate-400">CFI</p><p className="text-lg font-bold text-white">0.962</p></div>
                              <div className="border-l-2 border-blue-500 pl-3"><p className="text-[10px] text-slate-400">TLI</p><p className="text-lg font-bold text-white">0.941</p></div>
                           </div>
                           <div className="h-64 flex justify-center">
                              <Radar data={cfaRadarData} options={{ responsive: true, maintainAspectRatio: false, scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, angleLines: { color: 'rgba(255,255,255,0.05)' }, pointLabels: { color: '#94a3b8' }, ticks: { display: false } } }, plugins: { legend: { display: false } } }} />
                           </div>
                        </div>

                        {/* Wright Map */}
                        <div className="bg-[#1E293B]/80 rounded-2xl p-6 border border-slate-700/50 shadow-lg flex flex-col">
                           <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2"><i className="fa-solid fa-align-left text-purple-400"></i> Wright Map (PCM)</h3>
                           <div className="flex-1 h-64">
                              <Bar data={wrightMapData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#94a3b8' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } } } }} />
                           </div>
                           <p className="text-[9px] text-slate-500 mt-4 text-center">Wright Map shows person ability (theta) vs item difficulty (beta) on the same logit scale.</p>
                        </div>
                     </div>

                     {/* BOTTOM CHARTS ROW */}
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Literacy Level */}
                        <div className="bg-[#1E293B]/80 rounded-2xl p-6 border border-slate-700/50 shadow-lg">
                           <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2"><i className="fa-solid fa-chart-pie text-emerald-400"></i> Literacy Level (Descriptive)</h3>
                           <div className="h-56 flex justify-center">
                              <Doughnut data={literacyData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: '#94a3b8', boxWidth: 12 } } }, cutout: '70%' }} />
                           </div>
                        </div>

                        {/* LPTK Cluster */}
                        <div className="bg-[#1E293B]/80 rounded-2xl p-6 border border-slate-700/50 shadow-lg">
                           <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2"><i className="fa-solid fa-sitemap text-blue-400"></i> Cluster Dist. (LPTK)</h3>
                           <div className="h-56">
                              <Bar data={clusterData} options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }, y: { grid: { display: false }, ticks: { color: '#94a3b8' } } } }} />
                           </div>
                        </div>
                     </div>

                     {/* DIF ROW */}
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-[#1E293B]/80 rounded-2xl p-6 border border-slate-700/50 shadow-lg">
                           <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2"><i className="fa-solid fa-table text-orange-400"></i> DIF Table (Likelihood Ratio Test)</h3>
                           <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                 <thead><tr className="text-slate-400 border-b border-slate-700"><th className="pb-2 font-medium">Item</th><th className="pb-2 font-medium">Dimension</th><th className="pb-2 font-medium">p-value</th><th className="pb-2 font-medium">Status</th></tr></thead>
                                 <tbody>
                                    <tr className="border-b border-slate-700/50"><td className="py-3 text-white">PED_02</td><td className="py-3 text-slate-300">Pedagogy</td><td className="py-3 text-red-400 font-bold">0.024 *</td><td className="py-3"><span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-[9px] font-bold">Bias Detected</span></td></tr>
                                    <tr className="border-b border-slate-700/50"><td className="py-3 text-white">ETH_05</td><td className="py-3 text-slate-300">Ethics</td><td className="py-3 text-red-400 font-bold">0.041 *</td><td className="py-3"><span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-[9px] font-bold">Bias Detected</span></td></tr>
                                    <tr className="border-b border-slate-700/50"><td className="py-3 text-white">INFO_01</td><td className="py-3 text-slate-300">Information</td><td className="py-3 text-emerald-400">0.421</td><td className="py-3"><span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-[9px] font-bold">Neutral</span></td></tr>
                                    <tr><td className="py-3 text-white">CREATE_04</td><td className="py-3 text-slate-300">Creation</td><td className="py-3 text-emerald-400">0.156</td><td className="py-3"><span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-[9px] font-bold">Neutral</span></td></tr>
                                 </tbody>
                              </table>
                           </div>
                        </div>
                        <div className="bg-[#1E293B]/80 rounded-2xl p-6 border border-slate-700/50 shadow-lg">
                           <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2"><i className="fa-solid fa-chart-column text-rose-400"></i> DIF Contrast Plot (Male vs Female)</h3>
                           <div className="h-48"><Bar data={difChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: '#94a3b8', boxWidth: 10 } } }, scales: { x: { grid: { display: false }, ticks: { color: '#94a3b8' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } } } }} /></div>
                        </div>
                     </div>
                  </>
                )}

              </div>
        </div>
      </main>
    </div>
  );
}
