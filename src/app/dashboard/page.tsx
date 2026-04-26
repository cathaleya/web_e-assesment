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
  CategoryScale,
  LinearScale,
  BarElement,
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
  BarElement
);

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "assessments" | "survey">("dashboard");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const radarData = {
    labels: ['Information', 'Creation', 'Pedagogy', 'Ethics', 'Social'],
    datasets: [{
      label: 'Profil Kompetensi',
      data: [85, 60, 45, 70, 65],
      backgroundColor: 'rgba(56, 189, 248, 0.2)',
      borderColor: 'rgba(56, 189, 248, 1)',
      pointBackgroundColor: '#fff',
      pointBorderColor: '#38bdf8',
      borderWidth: 3,
    }]
  };

  if (!isMounted) return null;

  return (
    <div className="flex h-screen overflow-hidden relative" 
         style={{ 
           backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url('/campus_bg.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      
      {/* Sidebar - Blue Premium Theme */}
      <aside className="w-20 lg:w-72 flex-shrink-0 glass-panel border-r border-white/10 flex flex-col transition-all duration-300 relative overflow-hidden bg-slate-900/40">
        <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/10 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <i className="fa-solid fa-graduation-cap text-white text-2xl"></i>
          </div>
          <h1 className="hidden lg:block ml-4 text-2xl font-bold tracking-tight text-white italic">HDAP <span className="text-blue-400">Student</span></h1>
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
              <span className="hidden lg:block text-sm tracking-wide ml-2">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-6 border-t border-white/10 bg-slate-950/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white shadow-lg">BS</div>
             <div className="hidden lg:block">
                <p className="text-sm font-bold text-white">Budi Santoso</p>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">PPG Mahasiswa</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <header className="h-24 flex items-center justify-between px-8 z-10 border-b border-white/10 bg-gradient-to-r from-slate-900 to-blue-900 text-white shadow-xl">
          <div>
            <h2 className="text-2xl font-black text-white italic tracking-tight">Welcome back, Budi! 👋</h2>
            <p className="text-blue-300 text-xs mt-1 font-bold opacity-80 uppercase tracking-widest">Sistem Pemetaan Literasi Digital (MADEL5C)</p>
          </div>
          <div className="flex items-center gap-4">
             <button className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition relative">
                <i className="fa-solid fa-bell"></i>
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></span>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-950/10">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            {/* TAB 1: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* AI Diagnostic Panel */}
                <div className="glass-panel rounded-[40px] p-10 relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white ai-glow">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <i className="fa-solid fa-wand-magic-sparkles text-[120px]"></i>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <i className="fa-solid fa-brain text-blue-400 text-2xl"></i>
                      </div>
                      <h3 className="text-3xl font-black italic tracking-tight">AI Intelligent Feedback</h3>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-[30px] p-8 border border-white/10">
                      <p className="text-white text-xl leading-relaxed font-medium italic">
                        "Budi, profil kompetensi Anda menunjukkan kekuatan pada <strong>Social Literacy</strong>. Rekomendasi AI: Fokuslah pada pengembangan <strong>Produksi Konten Digital</strong> untuk memperkuat dimensi C2 Anda menuju level B2 Expert."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Radar Chart */}
                  <div className="glass-panel rounded-[40px] p-10 bg-slate-900/60 border border-white/10 shadow-xl text-white">
                    <h3 className="text-xl font-bold mb-1 italic tracking-tight uppercase">Kompetensi Digital</h3>
                    <p className="text-xs text-blue-400 font-bold mb-8 uppercase tracking-widest">Framework MADEL5C</p>
                    <div className="min-h-[350px] bg-white/5 rounded-[30px] p-6 border border-white/5 flex items-center justify-center">
                       <Radar data={radarData} options={{ 
                          responsive: true, 
                          maintainAspectRatio: false,
                          scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, angleLines: { color: 'rgba(255,255,255,0.05)' }, ticks: { display: false } } }
                       }} />
                    </div>
                  </div>

                  {/* Activity History */}
                  <div className="glass-panel rounded-[40px] p-10 bg-slate-900/60 border border-white/10 shadow-xl text-white">
                    <h3 className="text-xl font-bold mb-10 flex justify-between items-center italic tracking-tight uppercase">
                      Riwayat Aktivitas <i className="fa-solid fa-clock-rotate-left text-blue-400"></i>
                    </h3>
                    <div className="space-y-4">
                       {[
                         { title: 'Asesmen SJT Literasi Digital', score: '64/100', date: '12 April 2026', status: 'Passed' },
                         { title: 'Pre-test Kompetensi IT', score: '88/100', date: '05 April 2026', status: 'Finished' }
                       ].map((activity, i) => (
                         <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group">
                           <div className="flex items-center gap-5">
                             <div className="w-12 h-12 rounded-2xl bg-blue-900/40 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                               <i className="fa-solid fa-check-double text-xl"></i>
                             </div>
                             <div>
                               <p className="font-bold text-white">{activity.title}</p>
                               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{activity.date}</p>
                             </div>
                           </div>
                           <div className="text-right">
                              <p className="text-lg font-black text-white">{activity.score}</p>
                              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{activity.status}</p>
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ASSESSMENTS (SESUAI HTML) */}
            {activeTab === 'assessments' && (
              <div className="space-y-8">
                 {/* PDI-DL Banner */}
                 <div className="relative overflow-hidden rounded-[40px] bg-white border border-blue-100 p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl">
                    <div className="relative z-10 max-w-2xl">
                      <span className="px-4 py-1.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-full border border-blue-200 uppercase tracking-widest mb-6 inline-block">Validasi Tersedia</span>
                      <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">PDI-DL: Preliminary Diagnostic Instrument</h3>
                      <p className="text-slate-600 mb-8 text-lg leading-relaxed font-medium italic">Uji pemetaan profil awal literasi digital mahasiswa calon guru.</p>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center gap-3 transition-all group">
                        Mulai Asesmen Sekarang <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
                      </button>
                    </div>
                    <div className="relative z-10 mt-10 md:mt-0">
                       <i className="fa-solid fa-file-signature text-[120px] text-blue-500 drop-shadow-lg opacity-20"></i>
                    </div>
                 </div>
                 
                 {/* MADEL5C Locked Card */}
                 <div className="glass-panel rounded-[40px] p-12 border-white/10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between bg-slate-900/40 opacity-70 grayscale cursor-not-allowed">
                    <div className="relative z-10 max-w-2xl">
                      <span className="px-4 py-1.5 bg-slate-800 text-slate-400 text-[10px] font-black rounded-full border border-slate-700 uppercase tracking-widest mb-6 inline-block">Main Research Instrument</span>
                      <h3 className="text-4xl font-black text-slate-400 mb-4 tracking-tight uppercase">MADEL5C: Digital Literacy SJT</h3>
                      <button className="bg-slate-800 text-slate-600 font-black px-10 py-4 rounded-2xl cursor-not-allowed flex items-center gap-3">
                        <i className="fa-solid fa-lock"></i> Belum Tersedia
                      </button>
                      <p className="mt-4 text-[11px] font-bold text-blue-400 uppercase tracking-widest">Selesaikan PDI-DL untuk membuka instrumen utama</p>
                    </div>
                    <i className="fa-solid fa-lock text-[120px] text-slate-800 opacity-20"></i>
                 </div>
              </div>
            )}

            {/* TAB 3: SURVEY (SESUAI HTML) */}
            {activeTab === 'survey' && (
              <div className="space-y-8">
                 <div className="glass-panel rounded-[40px] p-12 bg-white border-white shadow-2xl">
                    <div className="flex items-center gap-6 mb-10">
                       <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-3xl shadow-xl shadow-blue-500/30">
                          <i className="fa-solid fa-chart-line"></i>
                       </div>
                       <div>
                          <h2 className="text-3xl font-black text-slate-900">Statistik Survey Pengguna</h2>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Real-time Usability Performance (ISO 25010)</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <div className="bg-blue-600 rounded-[35px] p-10 text-white shadow-xl shadow-blue-900/20">
                          <p className="text-xs font-bold opacity-80 uppercase mb-2">System Usability Score</p>
                          <div className="text-6xl font-black mb-2">88.5</div>
                          <p className="text-xs font-bold bg-white/20 rounded-full px-4 py-1 inline-block uppercase">Excellent Grade</p>
                       </div>
                       <div className="bg-slate-50 rounded-[35px] p-10 border border-slate-100 shadow-inner">
                          <p className="text-xs font-bold text-slate-400 uppercase mb-2">User Satisfaction</p>
                          <div className="text-6xl font-black text-slate-900 mb-2">94%</div>
                          <p className="text-xs font-bold text-blue-600 uppercase">Highly Positive</p>
                       </div>
                       <div className="bg-slate-50 rounded-[35px] p-10 border border-slate-100 shadow-inner">
                          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Platform Efficiency</p>
                          <div className="text-6xl font-black text-slate-900 mb-2">FAST</div>
                          <p className="text-xs font-bold text-blue-600 uppercase">Optimized Cache</p>
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
