"use client";

import { useState, useEffect } from "react";
import { Radar, Bar, Doughnut } from "react-chartjs-2";
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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Data Statistik untuk Dashboard Admin
  const radarData = {
    labels: ['Information', 'Creation', 'Pedagogy', 'Ethics', 'Social'],
    datasets: [{
      label: 'Rata-rata Kemampuan Mahasiswa',
      data: [75, 62, 58, 81, 69],
      backgroundColor: 'rgba(20, 184, 166, 0.2)',
      borderColor: 'rgba(20, 184, 166, 1)',
      borderWidth: 2,
    }]
  };

  const barData = {
    labels: ['LPTK A', 'LPTK B', 'LPTK C', 'LPTK D'],
    datasets: [{
      label: 'Jumlah Peserta',
      data: [120, 95, 150, 80],
      backgroundColor: 'rgba(13, 148, 136, 0.7)',
    }]
  };

  if (!isMounted) return null;

  return (
    <div className="antialiased flex h-screen overflow-hidden relative"
         style={{ 
           backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.8)), url('/campus_bg.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      
      {/* Sidebar - Army Green Theme */}
      <aside className="w-20 lg:w-64 flex-shrink-0 glass-panel border-r border-white flex flex-col transition-all duration-300 relative overflow-hidden">
        <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <i className="fa-solid fa-graduation-cap text-white text-2xl"></i>
          </div>
          <h1 className="hidden lg:block ml-3 text-2xl font-bold tracking-wide text-slate-900">HDAP Admin</h1>
        </div>

        <nav className="flex-1 py-8 space-y-4 px-4">
          {[
            { id: 'dashboard', icon: 'fa-chart-line', label: 'Main Dashboard' },
            { id: 'instruments', icon: 'fa-file-medical', label: 'Instrument Manager' },
            { id: 'analysis', icon: 'fa-brain', label: 'Statistical Analysis' },
            { id: 'users', icon: 'fa-users-gear', label: 'User Management' },
            { id: 'settings', icon: 'fa-gears', label: 'System Settings' }
          ].map((item) => (
            <button key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all border font-black group text-white ${
                      activeTab === item.id 
                      ? 'bg-gradient-to-r from-green-700 to-green-900 shadow-lg shadow-green-900/40 border-white/20' 
                      : 'bg-green-900/40 text-green-100 hover:bg-green-800/60 border-transparent'
                    }`}>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <i className={`fa-solid ${item.icon} text-xl`}></i>
              </div>
              <span className="hidden lg:block text-sm tracking-wide army-shadow">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Profile Section */}
        <div className="p-5 border-t border-white/10 flex justify-center lg:justify-start items-center bg-gradient-to-r from-green-800 to-black shadow-2xl relative z-10">
          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center border-2 border-green-500/50 shadow-lg font-bold text-green-800">
            ADM
          </div>
          <div className="hidden lg:block ml-4">
            <p className="text-sm font-black text-white army-shadow tracking-tight">Administrator</p>
            <p className="text-[10px] text-green-400 font-black uppercase tracking-[0.2em]">Pusat Riset BIMA</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Nav - Teal Blue Gradient */}
        <header className="h-24 flex items-center justify-between px-8 z-10 border-b border-white/20 bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 text-white shadow-xl">
          <div>
            <h2 className="text-2xl font-black text-white drop-shadow-md">Panel Kendali Riset 🚀</h2>
            <p className="text-teal-50 text-sm mt-1 font-medium opacity-90">Pemantauan Real-time Instrumen Literasi Digital</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 px-4 py-2 rounded-full border border-white/30 backdrop-blur-md flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest">Server Active</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {activeTab === 'dashboard' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                
                {/* AI Intelligence Box - Premium Look */}
                <div className="glass-panel rounded-3xl p-8 relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-green-900 via-emerald-950 to-slate-900 text-white ai-glow">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <i className="fa-solid fa-wand-magic-sparkles text-[120px]"></i>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <i className="fa-solid fa-brain text-white text-xl"></i>
                      </div>
                      <h3 className="text-2xl font-black">AI Analysis Overview</h3>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-inner">
                      <p className="text-white text-lg leading-relaxed font-medium italic">
                        "Bapak Administrator, data menunjukkan partisipasi meningkat 24% minggu ini. Dimensi <strong>Pedagogi Digital</strong> memerlukan perhatian khusus karena rata-rata skor masih di bawah threshold validitas (60%)."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Radar Chart */}
                  <div className="glass-panel rounded-3xl p-8 flex flex-col border border-white/10 shadow-xl bg-gradient-to-b from-slate-900 to-green-950 text-white">
                    <h3 className="text-xl font-black text-white mb-1">Peta Kompetensi Kolektif</h3>
                    <p className="text-xs text-green-400 font-bold mb-8 uppercase tracking-widest">Global Overview (N=450)</p>
                    <div className="flex-1 min-h-[350px] bg-white/5 rounded-3xl border border-white/10 p-4">
                      <Radar data={radarData} options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        scales: { r: { grid: { color: 'rgba(255,255,255,0.1)' }, angleLines: { color: 'rgba(255,255,255,0.1)' } } }
                      }} />
                    </div>
                  </div>

                  {/* Activity List */}
                  <div className="glass-panel rounded-3xl p-8 bg-white/80 border border-white shadow-xl">
                    <h3 className="text-xl font-black text-slate-800 mb-6 flex justify-between items-center">
                      Monitoring Berkas 
                      <i className="fa-solid fa-folder-open text-teal-600"></i>
                    </h3>
                    <div className="space-y-4">
                      {[
                        { title: 'SJT_Version_Final.json', status: 'Active', size: '124 KB', date: 'Baru saja' },
                        { title: 'Preliminary_Test_V2.csv', status: 'Archived', size: '45 KB', date: '2 hari lalu' },
                        { title: 'User_Feedback_Report.pdf', status: 'Generated', size: '2.1 MB', date: '5 jam lalu' }
                      ].map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <i className="fa-solid fa-file-code"></i>
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{file.title}</p>
                              <p className="text-[10px] text-slate-400 font-bold">{file.date} • {file.size}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            file.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                          }`}>{file.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'instruments' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="glass-panel rounded-3xl p-8 bg-white border-white shadow-2xl">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Instrument Manager</h3>
                      <p className="text-slate-500 text-sm">Unggah dan Kelola Instrumen Penilaian</p>
                    </div>
                    <button className="bg-teal-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg shadow-teal-600/20 flex items-center gap-2">
                      <i className="fa-solid fa-plus"></i> Upload New
                    </button>
                  </div>
                  <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center bg-slate-50/50">
                    <i className="fa-solid fa-cloud-arrow-up text-5xl text-slate-300 mb-4"></i>
                    <p className="text-slate-500 font-medium">Tarik file JSON atau CSV ke sini untuk memproses instrumen baru</p>
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
