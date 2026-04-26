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
  const [bgImage, setBgImage] = useState("/dashboard_v2.png");

  useEffect(() => {
    if (activeTab === "dashboard") setBgImage("/dashboard_v2.png");
    else if (activeTab === "assessments") setBgImage("/assessment_v2.png");
    else if (activeTab === "survey") setBgImage("/survey_v2.png");
  }, [activeTab]);

  const radarData = {
    labels: ['Information', 'Creation', 'Pedagogy', 'Ethics'],
    datasets: [{
      label: 'Skor Saat Ini',
      data: [85, 60, 45, 70],
      backgroundColor: 'rgba(20, 184, 166, 0.2)',
      borderColor: 'rgba(20, 184, 166, 1)',
      pointBackgroundColor: '#fff',
      pointBorderColor: 'rgba(20, 184, 166, 1)',
      borderWidth: 2,
      pointRadius: 4,
    }]
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: {
          color: '#e2e8f0',
          font: { size: 12, weight: 700 as const }
        },
        ticks: { display: false, min: 0, max: 100 }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden transition-all duration-500" 
         style={{ 
           backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6)), url(${bgImage})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 flex-shrink-0 glass-panel border-r border-white/20 flex flex-col transition-all duration-300 relative overflow-hidden bg-white/40 backdrop-blur-xl">
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/20 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <i className="fa-solid fa-graduation-cap text-white text-xl"></i>
          </div>
          <h1 className="hidden lg:block ml-3 text-2xl font-bold tracking-wide text-slate-900">HDAP</h1>
        </div>

        <nav className="flex-1 py-8 space-y-4 px-4 relative z-10">
          {[
            { id: 'dashboard', icon: 'fa-border-all', label: 'My Dashboard' },
            { id: 'assessments', icon: 'fa-laptop-code', label: 'Assessments' },
            { id: 'survey', icon: 'fa-square-poll-vertical', label: 'Survei Pengguna' }
          ].map((item) => (
            <button key={item.id}
                    onClick={() => setActiveTab(item.id as any)} 
                    className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all border font-black group text-white ${activeTab === item.id ? 'bg-gradient-to-r from-green-700 to-green-900 shadow-lg shadow-green-900/40 border-white/20' : 'bg-green-900/40 text-green-100 hover:bg-green-800/60 border-transparent'}`}>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <i className={`fa-solid ${item.icon} text-xl`}></i>
              </div>
              <span className="hidden lg:block text-sm tracking-wide army-shadow">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Dynamic Empty Space with Leaf Ornament */}
        <div className="flex-1 relative overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-30" 
               style={{ backgroundImage: "url('/sidebar_ornament_v1.png')", transform: "scale(0.8)" }}></div>
        </div>

        <div className="p-5 border-t border-white/10 flex justify-center lg:justify-start items-center bg-gradient-to-r from-green-800 to-black shadow-2xl relative z-10">
          <img src="https://ui-avatars.com/api/?name=Budi+Santoso&background=ffffff&color=166534" alt="Profile" className="w-11 h-11 rounded-full border-2 border-green-500/50 shadow-lg" />
          <div className="hidden lg:block ml-4">
            <p className="text-sm font-black text-white army-shadow tracking-tight">Budi Santoso</p>
            <p className="text-[10px] text-green-400 font-black uppercase tracking-[0.2em]">Mahasiswa</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 flex items-center justify-between px-8 z-10 border-b border-white/20 bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 text-white shadow-xl">
          <div>
            <h2 className="text-2xl font-black text-white drop-shadow-md">Welcome back, Budi! 👋</h2>
            <p className="text-teal-50 text-sm mt-1 font-medium opacity-90">Sistem Pemetaan Kompetensi Literasi Digital (MADEL5C)</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2.5 rounded-full text-white transition border border-white/30 relative">
              <i className="fa-regular fa-bell text-xl"></i>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-teal-600"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 z-0">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* AI Diagnostic Panel */}
                <div className="glass-panel rounded-3xl p-8 relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-green-900 via-emerald-950 to-slate-900 text-white">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <i className="fa-solid fa-wand-magic-sparkles text-[120px]"></i>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <i className="fa-solid fa-brain text-white text-xl"></i>
                      </div>
                      <h3 className="text-2xl font-black">AI Intelligent Diagnostic Feedback</h3>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                      <p className="text-white text-lg leading-relaxed font-medium italic">
                        "Budi, berdasarkan data awal, kemampuan Anda dalam <strong>Literasi Informasi</strong> sudah sangat baik. Namun, pada aspek <strong>Pemanfaatan Pedagogik</strong>, disarankan untuk mulai mengeksplorasi aktivitas interaktif berbasis proyek menggunakan teknologi digital."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Radar Chart */}
                  <div className="glass-panel rounded-3xl p-8 flex flex-col border border-white/10 shadow-xl bg-gradient-to-b from-slate-900 to-green-950 text-white">
                    <h3 className="text-xl font-black mb-1">Profil Kompetensi Digital</h3>
                    <div className="flex-1 relative min-h-[300px] w-full flex items-center justify-center bg-white/5 rounded-3xl border border-white/10 p-4 mt-6">
                      <Radar data={radarData} options={radarOptions as any} />
                    </div>
                  </div>

                  {/* History */}
                  <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-xl bg-gradient-to-b from-slate-900 to-green-950 text-white">
                    <h3 className="text-xl font-black mb-8 flex justify-between">
                      Riwayat Aktivitas <i className="fa-solid fa-clock-rotate-left text-green-500"></i>
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-green-900/30 text-green-400 flex items-center justify-center">
                            <i className="fa-solid fa-check text-xl"></i>
                          </div>
                          <div>
                            <p className="font-black">Asesmen SJT Literasi Digital</p>
                            <p className="text-xs text-slate-400 font-bold">12 April 2026</p>
                          </div>
                        </div>
                        <p className="font-black text-lg">64<span className="text-xs text-slate-500 font-normal">/100</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assessments' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="relative overflow-hidden rounded-3xl bg-white border border-teal-100 p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl">
                    <div className="relative z-10 max-w-2xl">
                      <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">PDI-DL: Preliminary Diagnostic Instrument</h3>
                      <p className="text-slate-600 mb-8 text-lg leading-relaxed font-medium">Uji pemetaan profil awal literasi digital mahasiswa calon guru.</p>
                      <button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white font-black px-10 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                        Mulai Asesmen Sekarang <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                  
                  {/* MADEL5C Locked Card */}
                  <div className="glass-panel rounded-[40px] p-8 border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between bg-slate-50/50 opacity-80 grayscale cursor-not-allowed">
                    <div className="relative z-10 max-w-2xl">
                      <h3 className="text-4xl font-black text-slate-400 mb-4 tracking-tight">MADEL5C: Digital Literacy SJT</h3>
                      <button className="bg-slate-300 text-slate-500 font-black px-10 py-4 rounded-2xl cursor-not-allowed flex items-center gap-3">
                        <i className="fa-solid fa-lock"></i> Belum Tersedia
                      </button>
                    </div>
                  </div>
               </div>
            )}

            {activeTab === 'survey' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="glass-panel rounded-3xl p-8 lg:p-12 border-white shadow-xl bg-white/80">
                  <h2 className="text-3xl font-black text-slate-900">Statistik Survey Pengguna</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    <div className="bg-blue-600 rounded-3xl p-8 text-white">
                      <p className="text-xs font-bold uppercase mb-2">SUS Score</p>
                      <div className="text-5xl font-black">88.5</div>
                    </div>
                    {/* ... other stats ... */}
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
