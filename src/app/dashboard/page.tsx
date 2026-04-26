"use client";

import { useState, useEffect } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "assessments" | "survey">("dashboard");

  const radarData = {
    labels: ['Information', 'Creation', 'Pedagogy', 'Ethics', 'Social'],
    datasets: [{
      label: 'Profil Kompetensi Anda',
      data: [85, 60, 45, 70, 65],
      backgroundColor: 'rgba(56, 189, 248, 0.2)', // Light Blue
      borderColor: 'rgba(56, 189, 248, 1)',
      pointBackgroundColor: '#fff',
      pointBorderColor: '#38bdf8',
      borderWidth: 3,
    }]
  };

  return (
    <div className="flex h-screen overflow-hidden relative" 
         style={{ 
           backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.1), rgba(15, 23, 42, 0.2)), url('/campus_bg.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      
      {/* Sidebar - Blue Theme */}
      <aside className="w-20 lg:w-64 flex-shrink-0 glass-panel border-r border-white/20 flex flex-col transition-all duration-300 relative overflow-hidden bg-slate-900/40">
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/10 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <i className="fa-solid fa-graduation-cap text-white text-xl"></i>
          </div>
          <h1 className="hidden lg:block ml-3 text-2xl font-bold tracking-tight text-white uppercase italic">HDAP</h1>
        </div>

        <nav className="flex-1 py-8 space-y-3 px-4 relative z-10">
          {[
            { id: 'dashboard', icon: 'fa-border-all', label: 'My Dashboard' },
            { id: 'assessments', icon: 'fa-laptop-code', label: 'Assessments' },
            { id: 'survey', icon: 'fa-square-poll-vertical', label: 'Survei Pengguna' }
          ].map((item) => (
            <button key={item.id}
                    onClick={() => setActiveTab(item.id as any)} 
                    className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all border font-bold group ${
                      activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 border-blue-400' 
                      : 'text-slate-400 hover:bg-slate-800/40 border-transparent'
                    }`}>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <i className={`fa-solid ${item.icon} text-xl`}></i>
              </div>
              <span className="hidden lg:block text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-5 border-t border-white/10 flex justify-center lg:justify-start items-center bg-slate-950/80 backdrop-blur-md">
          <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center border-2 border-blue-400/50 shadow-lg font-bold text-white uppercase">BS</div>
          <div className="hidden lg:block ml-4">
            <p className="text-sm font-bold text-white tracking-tight">Budi Santoso</p>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Mahasiswa</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 flex items-center justify-between px-8 z-10 border-b border-white/10 bg-gradient-to-r from-slate-900 to-blue-900 text-white shadow-xl">
          <div>
            <h2 className="text-2xl font-black text-white italic tracking-tight">Welcome back, Budi! 👋</h2>
            <p className="text-blue-300 text-sm mt-1 font-bold opacity-80 uppercase tracking-widest text-[10px]">Digital Literacy Assessment Platform</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest">
                Profil Kompetensi: B1 Integrator
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 z-0 bg-slate-950/20">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* AI Diagnostic Panel - Blue Theme */}
                <div className="glass-panel rounded-3xl p-8 relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white ai-glow">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <i className="fa-solid fa-wand-magic-sparkles text-[120px]"></i>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <i className="fa-solid fa-brain text-blue-400 text-xl"></i>
                      </div>
                      <h3 className="text-2xl font-black tracking-tight italic">AI Intelligent Diagnostic Feedback</h3>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                      <p className="text-white text-lg leading-relaxed font-medium italic">
                        "Budi, berdasarkan data asesmen terbaru, Anda menunjukkan keunggulan pada dimensi <strong>Literasi Informasi</strong>. Untuk meningkatkan kompetensi ke level B2, disarankan untuk memperdalam pemanfaatan teknologi dalam skenario <strong>Pedagogik</strong> yang lebih kompleks."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Radar Chart Panel */}
                  <div className="glass-panel rounded-[40px] p-8 flex flex-col border border-white/10 shadow-xl bg-slate-900/60 text-white">
                    <h3 className="text-xl font-bold mb-1 italic tracking-tight">Profil Kompetensi Digital</h3>
                    <p className="text-xs text-blue-400 font-bold mb-6 uppercase tracking-widest">Framework MADEL5C</p>
                    <div className="flex-1 min-h-[350px] w-full flex items-center justify-center bg-white/5 rounded-3xl border border-white/10 p-4">
                      <Radar data={radarData} options={{ 
                         responsive: true, 
                         maintainAspectRatio: false,
                         scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, angleLines: { color: 'rgba(255,255,255,0.05)' }, ticks: { display: false } } }
                      }} />
                    </div>
                  </div>

                  {/* History Activity List */}
                  <div className="glass-panel rounded-[40px] p-8 bg-slate-900/60 border border-white/10 shadow-xl text-white">
                    <h3 className="text-xl font-bold mb-8 flex justify-between tracking-tight italic">
                      Riwayat Aktivitas <i className="fa-solid fa-clock-rotate-left text-blue-400"></i>
                    </h3>
                    <div className="space-y-4">
                      {[
                        { title: 'Asesmen SJT Literasi Digital', score: '64/100', date: '12 April 2026', status: 'Passed' },
                        { title: 'Pre-test Kompetensi IT', score: '88/100', date: '05 April 2026', status: 'Finished' }
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-900/30 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <i className="fa-solid fa-check-double text-xl"></i>
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{activity.title}</p>
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{activity.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className="font-black text-white">{activity.score}</p>
                             <p className="text-[10px] text-blue-400 font-bold uppercase">{activity.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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
