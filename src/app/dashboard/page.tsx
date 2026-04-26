"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const [userName, setUserName] = useState("User");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const savedName = localStorage.getItem("userName");
    if (savedName) setUserName(savedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    router.push("/login");
  };

  const radarData = {
    labels: ['Information', 'Creation', 'Pedagogy', 'Ethics', 'Social'],
    datasets: [{
      label: 'Profil Kompetensi',
      data: [85, 60, 45, 70, 65],
      backgroundColor: 'rgba(20, 184, 166, 0.3)',
      borderColor: 'rgba(20, 184, 166, 1)',
      pointBackgroundColor: '#fff',
      pointBorderColor: 'rgba(20, 184, 166, 1)',
      borderWidth: 3,
    }]
  };

  if (!isMounted) return null;

  return (
    <div className="antialiased flex h-screen overflow-hidden" 
         style={{ 
           backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/dashboard_v2.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      
      {/* Sidebar - ARMY GREEN ELEGAN SAMA PERSIS MOCKUP */}
      <aside className="w-20 lg:w-72 flex-shrink-0 bg-green-950/80 backdrop-blur-xl border-r border-white/10 flex flex-col relative overflow-hidden">
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/10 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-graduation-cap text-white text-xl"></i>
          </div>
          <h1 className="hidden lg:block ml-3 text-2xl font-black tracking-wide text-white uppercase italic">HDAP</h1>
        </div>

        <nav className="flex-1 py-8 space-y-4 px-4">
          {[
            { id: 'dashboard', icon: 'fa-border-all', label: 'My Dashboard' },
            { id: 'assessments', icon: 'fa-laptop-code', label: 'Assessments' },
            { id: 'survey', icon: 'fa-square-poll-vertical', label: 'Survei Pengguna' }
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} 
                    className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all border font-black group text-white ${activeTab === item.id ? 'bg-gradient-to-r from-green-700 to-green-900 shadow-xl border-white/20' : 'bg-white/5 text-green-100 hover:bg-white/10 border-transparent'}`}>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform"><i className={`fa-solid ${item.icon} text-xl`}></i></div>
              <span className="hidden lg:block text-sm tracking-wide army-shadow uppercase">{item.label}</span>
            </button>
          ))}

          <button onClick={handleLogout} 
                  className="w-full flex items-center px-5 py-4 rounded-2xl transition-all border border-transparent bg-red-900/40 text-red-100 hover:bg-red-800/60 mt-8 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform"><i className="fa-solid fa-right-from-bracket text-xl text-red-400"></i></div>
            <span className="hidden lg:block text-sm font-black tracking-wide uppercase">Log Out</span>
          </button>
        </nav>

        <div className="p-5 border-t border-white/10 flex justify-center lg:justify-start items-center bg-black/40 shadow-2xl relative z-10">
          <img src={`https://ui-avatars.com/api/?name=${userName}&background=ffffff&color=166534`} alt="Profile" className="w-11 h-11 rounded-full border-2 border-green-500/50 shadow-lg" />
          <div className="hidden lg:block ml-4 text-white">
            <p className="text-sm font-black army-shadow">{userName}</p>
            <p className="text-[10px] text-green-400 font-black uppercase tracking-widest">Mahasiswa</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 flex items-center justify-between px-8 bg-gradient-to-r from-teal-600/80 via-teal-700/80 to-blue-800/80 backdrop-blur-md text-white shadow-xl border-b border-white/10">
          <div><h2 className="text-2xl font-black italic uppercase drop-shadow-lg">Welcome back, {userName}! 👋</h2><p className="text-teal-50 text-[10px] font-bold uppercase tracking-widest opacity-80">Hybrid-Diagnostic Assessment Platform</p></div>
          <button className="bg-white/10 p-3 rounded-full border border-white/20 relative"><i className="fa-solid fa-bell text-xl"></i><span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-teal-600"></span></button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 z-0">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                 {/* AI Feedback - GLASS PANEL ELEGAN */}
                 <div className="glass-panel rounded-[40px] p-10 bg-gradient-to-br from-green-900/60 via-emerald-950/60 to-slate-900/60 backdrop-blur-2xl text-white border border-white/20 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-3xl font-black italic mb-6 flex items-center gap-4 uppercase"><i className="fa-solid fa-brain text-blue-400"></i> AI Intelligent Feedback</h3>
                      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-inner"><p className="text-xl leading-relaxed italic font-medium">"Bapak {userName}, berdasarkan data awal, kemampuan Anda dalam <strong>Literasi Informasi</strong> sudah sangat baik. Namun, pada aspek <strong>Pemanfaatan Pedagogik</strong>, disarankan untuk mulai mengeksplorasi aktivitas interaktif berbasis proyek."</p></div>
                    </div>
                    <i className="fa-solid fa-wand-magic-sparkles absolute top-0 right-0 text-[180px] opacity-10"></i>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profil Kompetensi */}
                    <div className="glass-panel rounded-[40px] p-10 bg-slate-900/40 backdrop-blur-xl text-white border border-white/10 shadow-xl">
                      <h3 className="text-xl font-black mb-1 italic uppercase tracking-tight">Profil Kompetensi Digital</h3>
                      <p className="text-[10px] text-green-400 font-bold uppercase tracking-[0.3em] mb-6">Framework DigCompEdu</p>
                      <div className="h-[350px] bg-white/5 rounded-3xl p-6 flex items-center justify-center border border-white/5">
                        <Radar data={radarData} options={{ 
                          responsive: true, 
                          maintainAspectRatio: false,
                          scales: { r: { 
                            grid: { color: 'rgba(255,255,255,0.1)' }, 
                            angleLines: { color: 'rgba(255,255,255,0.1)' }, 
                            pointLabels: { color: '#fff', font: { weight: 'bold' } },
                            ticks: { display: false } 
                          } } 
                        }} />
                      </div>
                    </div>

                    {/* Riwayat Aktivitas */}
                    <div className="glass-panel rounded-[40px] p-10 bg-slate-900/40 backdrop-blur-xl text-white border border-white/10 shadow-xl">
                      <h3 className="text-xl font-black mb-8 flex justify-between items-center uppercase italic tracking-tight">Riwayat Aktivitas <i className="fa-solid fa-clock-rotate-left text-green-500"></i></h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group shadow-lg">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-green-500/20 text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform border border-green-500/20"><i className="fa-solid fa-check-double text-xl"></i></div>
                            <div><p className="font-bold text-white uppercase tracking-tight">Asesmen Preliminary</p><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">12 April 2026</p></div>
                          </div>
                          <div className="text-right"><p className="text-xl font-black text-white">82/100</p><p className="text-[10px] text-green-400 font-black uppercase">Level Lanjut</p></div>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'assessments' && (
              <div className="space-y-8">
                 <div className="relative overflow-hidden rounded-[40px] bg-white/90 backdrop-blur-xl border border-white p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl animate-in slide-in-from-bottom duration-500">
                    <div className="relative z-10 max-w-2xl">
                      <span className="px-4 py-1.5 bg-teal-100 text-teal-800 text-[10px] font-black rounded-full uppercase mb-6 inline-block tracking-[0.2em] shadow-sm">PDI-DL Platform</span>
                      <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">Preliminary Diagnostic</h3>
                      <p className="text-slate-600 mb-8 text-lg font-medium leading-relaxed italic">Uji pemetaan profil awal literasi digital mahasiswa calon guru.</p>
                      <button onClick={() => router.push('/assessment/preliminary')} className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-teal-500/40 flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 text-lg uppercase">Mulai Sekarang <i className="fa-solid fa-play"></i></button>
                    </div>
                    <i className="fa-solid fa-file-signature text-[180px] text-teal-500 opacity-20 transform -rotate-12"></i>
                 </div>
              </div>
            )}

            {activeTab === 'survey' && (
              <div className="space-y-8">
                 <div className="glass-panel rounded-[40px] p-12 bg-white/95 backdrop-blur-3xl border-white shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-6 mb-12">
                      <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-3xl shadow-xl shadow-blue-500/40"><i className="fa-solid fa-chart-line"></i></div>
                      <div><h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Statistik Survey Pengguna</h2><p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] mt-1">Real-time Usability Performance Matrix</p></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                       <div className="bg-blue-600 rounded-[35px] p-10 text-white shadow-2xl shadow-blue-900/40"><p className="text-xs font-bold opacity-80 uppercase mb-2">System Usability Score</p><div className="text-7xl font-black mb-2">88.5</div><p className="text-xs font-bold bg-white/20 rounded-full px-5 py-2 inline-block uppercase tracking-widest">Excellent Grade</p></div>
                       <div className="bg-slate-50 rounded-[35px] p-10 border border-slate-100 shadow-inner"><p className="text-xs font-bold text-slate-400 uppercase mb-2">User Satisfaction</p><div className="text-7xl font-black text-slate-900 mb-2">94%</div><p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Highly Positive</p></div>
                       <div className="bg-slate-50 rounded-[35px] p-10 border border-slate-100 shadow-inner"><p className="text-xs font-bold text-slate-400 uppercase mb-2">Platform Efficiency</p><div className="text-7xl font-black text-slate-900 mb-2">FAST</div><p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Optimized Cache</p></div>
                    </div>
                    <div className="space-y-8">
                       <h4 className="font-black text-slate-800 uppercase tracking-[0.2em] text-xs">Detail Parameter Usability (N=284)</h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          {[
                            { label: 'Learnability (Kemudahan)', score: '4.9/5', width: '98%', color: 'bg-blue-500' },
                            { label: 'Efficiency (Efisiensi)', score: '4.7/5', width: '94%', color: 'bg-blue-500' },
                            { label: 'Memorability (Daya Ingat)', score: '4.8/5', width: '96%', color: 'bg-teal-500' },
                            { label: 'Errors Control (Kontrol Error)', score: '4.5/5', width: '90%', color: 'bg-indigo-500' }
                          ].map((item, i) => (
                            <div key={i} className="p-8 bg-slate-50 rounded-[35px] border border-slate-100 shadow-md hover:shadow-lg transition-shadow">
                               <div className="flex justify-between mb-4"><span className="text-sm font-bold text-slate-700">{item.label}</span><span className="text-sm font-black text-blue-600">{item.score}</span></div>
                               <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden shadow-inner"><div className={`${item.color} h-full rounded-full shadow-lg`} style={{ width: item.width }}></div></div>
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
