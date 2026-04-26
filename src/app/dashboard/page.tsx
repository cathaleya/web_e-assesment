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
  const [userName, setUserName] = useState("User");
  const [showReport, setShowReport] = useState(false);
  const [surveyDone, setSurveyDone] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Ambil nama dari localStorage
    const savedName = localStorage.getItem("userName");
    if (savedName) setUserName(savedName);

    // Cek URL params seperti di Alpine.js Bapak
    const params = new URLSearchParams(window.location.search);
    if (params.get("finished") === "true" || params.get("survey") === "done") {
      setShowReport(true);
    }
    if (params.get("survey") === "done") {
      setSurveyDone(true);
    }
  }, []);

  // Radar Chart Config SAMA PERSIS dengan Mockup
  const radarData = {
    labels: ['Information', 'Creation', 'Pedagogy', 'Ethics'],
    datasets: [{
      label: 'Skor Saat Ini',
      data: showReport ? [85, 65, 78, 70] : [85, 60, 45, 70],
      backgroundColor: 'rgba(20, 184, 166, 0.2)', // Teal
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
        angleLines: { color: 'rgba(0, 0, 0, 0.05)' },
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        pointLabels: {
          color: '#475569',
          font: { size: 12, weight: '700' as const, family: "'Outfit'" }
        },
        ticks: { display: false, min: 0, max: 100 }
      }
    },
    plugins: {
      legend: { display: false },
    }
  };

  if (!isMounted) return null;

  // Background logic SAMA PERSIS dengan HTML Bapak
  const getBgImage = () => {
    let url = "/dashboard_v2.png";
    if (activeTab === "assessments") url = "/assessment_v2.png";
    if (activeTab === "survey") url = "/survey_v2.png";
    return `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6)), url('${url}')`;
  };

  return (
    <div className="antialiased flex h-screen overflow-hidden" 
         style={{ 
           backgroundImage: getBgImage(),
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed',
           transition: 'background-image 0.5s ease-in-out'
         }}>
      
      {/* Sidebar - COPY PASTE HTML STRUCTURE */}
      <aside className="w-20 lg:w-64 flex-shrink-0 glass-panel border-r border-white flex flex-col transition-all duration-300 relative overflow-hidden">
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <i className="fa-solid fa-graduation-cap text-white text-xl"></i>
          </div>
          <h1 className="hidden lg:block ml-3 text-2xl font-bold tracking-wide text-slate-900">HDAP</h1>
        </div>

        <nav className="flex-1 py-8 space-y-4 px-4">
          <button onClick={() => setActiveTab("dashboard")} 
                  className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all border font-black group text-white ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-green-700 to-green-900 shadow-lg shadow-green-900/40 border-white/20' : 'bg-green-900/40 text-green-100 hover:bg-green-800/60 border-transparent'}`}>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-border-all text-xl"></i>
            </div>
            <span className="hidden lg:block text-sm tracking-wide army-shadow uppercase">My Dashboard</span>
          </button>

          <button onClick={() => setActiveTab("assessments")} 
                  className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all border font-black group text-white ${activeTab === 'assessments' ? 'bg-gradient-to-r from-green-700 to-green-900 shadow-lg shadow-green-900/40 border-white/20' : 'bg-green-900/40 text-green-100 hover:bg-green-800/60 border-transparent'}`}>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-laptop-code text-xl"></i>
            </div>
            <span className="hidden lg:block text-sm tracking-wide army-shadow uppercase">Assessments</span>
          </button>

          <button onClick={() => setActiveTab("survey")} 
                  className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all border font-black group text-white ${activeTab === 'survey' ? 'bg-gradient-to-r from-green-700 to-green-900 shadow-lg shadow-green-900/40 border-white/20' : 'bg-green-900/40 text-green-100 hover:bg-green-800/60 border-transparent'}`}>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-square-poll-vertical text-xl"></i>
            </div>
            <span className="hidden lg:block text-sm tracking-wide army-shadow uppercase">Survei Pengguna</span>
          </button>
        </nav>

        {/* Ornament Leaf SAMA PERSIS */}
        <div className="flex-1 relative overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-30" 
               style={{ backgroundImage: "url('/sidebar_ornament_v1.png')", transform: "scale(0.8)" }}></div>
        </div>

        {/* Profile Section SAMA PERSIS */}
        <div className="p-5 border-t border-white/10 flex justify-center lg:justify-start items-center bg-gradient-to-r from-green-800 to-black shadow-2xl relative z-10">
          <img src={`https://ui-avatars.com/api/?name=${userName}&background=ffffff&color=166534`} alt="Profile" className="w-11 h-11 rounded-full border-2 border-green-500/50 shadow-lg" />
          <div className="hidden lg:block ml-4">
            <p className="text-sm font-black text-white army-shadow tracking-tight">{userName}</p>
            <p className="text-[10px] text-green-400 font-black uppercase tracking-[0.2em]">Mahasiswa</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 flex items-center justify-between px-8 z-10 border-b border-white/20 bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 text-white shadow-xl">
          <div>
            <h2 className="text-2xl font-black text-white drop-shadow-md uppercase italic">Welcome back, {userName}! 👋</h2>
            <p className="text-teal-50 text-sm mt-1 font-medium opacity-90 uppercase tracking-widest text-[10px]">Sistem Pemetaan Kompetensi Literasi Digital (MADEL5C)</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2.5 rounded-full text-white transition border border-white/30 relative">
              <i className="fa-regular fa-bell text-xl"></i>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-teal-600"></span>
            </button>
          </div>
        </header>

        {/* Content Tabs */}
        <div className="flex-1 overflow-y-auto p-8 z-0">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
               {/* AI Diagnostic Section */}
               <div className="glass-panel rounded-3xl p-8 relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-green-900 via-emerald-950 to-slate-900 text-white ai-glow">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <i className="fa-solid fa-wand-magic-sparkles text-[120px]"></i>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <i className="fa-solid fa-brain text-white text-xl"></i>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tight">AI Intelligent Diagnostic Feedback</h3>
                        <p className="text-green-100 text-[10px] font-bold uppercase tracking-widest mt-1">Sistem Pemetaan Kompetensi Otomatis</p>
                      </div>
                      {showReport && <span className="ml-auto px-3 py-1 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg animate-pulse">Analysis Updated</span>}
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-inner">
                      <p className="text-white text-lg leading-relaxed font-medium italic italic-serif">
                        {showReport 
                          ? "Luar Biasa! Diagnosa terbaru menunjukkan peningkatan signifikan pada pemahaman LMS & Diskusi Asinkron. Rekomendasi selanjutnya: Fokuslah pada pengembangan Bahan Ajar Mandiri yang mematuhi prinsip hak cipta (copyrights) untuk memperkuat dimensi C3 Anda."
                          : "Budi, berdasarkan data awal, kemampuan Anda dalam Literasi Informasi sudah sangat baik. Namun, pada aspek Pemanfaatan Pedagogik, disarankan untuk mulai mengeksplorasi aktivitas interaktif berbasis proyek menggunakan teknologi digital."}
                      </p>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass-panel rounded-3xl p-8 flex flex-col border border-white/10 shadow-xl bg-gradient-to-b from-slate-900 to-green-950 text-white">
                    <h3 className="text-xl font-black text-white mb-1 uppercase italic tracking-tight">Profil Kompetensi Digital</h3>
                    <p className="text-[10px] text-green-400 font-bold mb-8 uppercase tracking-widest">Framework DigCompEdu (C1-C5)</p>
                    <div className="flex-1 min-h-[300px] w-full flex items-center justify-center bg-white/5 rounded-3xl border border-white/10 p-4">
                      <Radar data={radarData} options={radarOptions as any} />
                    </div>
                  </div>

                  <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-xl bg-gradient-to-b from-slate-900 to-green-950 text-white">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Riwayat Aktivitas</h3>
                      <i className="fa-solid fa-clock-rotate-left text-green-500"></i>
                    </div>
                    <div className="space-y-4">
                       {/* Activity Items SAMA PERSIS */}
                       <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 shadow-sm hover:shadow-md cursor-pointer group">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-green-900/30 text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                             <i className="fa-solid fa-check text-xl"></i>
                           </div>
                           <div>
                             <p className="font-black text-white text-sm">Asesmen SJT Literasi Digital</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">12 April 2026</p>
                           </div>
                         </div>
                         <div className="text-right">
                           <p className="font-black text-white text-lg">64<span className="text-xs text-slate-500 font-normal">/100</span></p>
                           <p className="text-[10px] text-green-400 font-black uppercase tracking-widest">Passed</p>
                         </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* ASSESSMENTS TAB - COPY PASTE FROM HTML */}
          {activeTab === 'assessments' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
               <div className="relative overflow-hidden rounded-3xl bg-white border border-teal-100 p-12 flex flex-col md:flex-row items-center justify-between ai-glow shadow-2xl">
                  <div className="relative z-10 max-w-2xl">
                    <span className="px-4 py-1.5 bg-teal-100 text-teal-800 text-[10px] font-black rounded-full border border-teal-200 uppercase tracking-[0.2em] mb-6 inline-block shadow-sm">Instrumen Validasi Tersedia</span>
                    <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase italic">PDI-DL: Preliminary Diagnostic Instrument</h3>
                    <p className="text-slate-600 mb-8 text-lg leading-relaxed font-medium">Uji pemetaan profil awal literasi digital mahasiswa calon guru (pre-service teacher).</p>
                    <button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-black px-10 py-4 rounded-2xl transition-all shadow-xl shadow-teal-500/30 flex items-center gap-3 group">
                      Mulai Asesmen Sekarang <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-2"></i>
                    </button>
                  </div>
                  <div className="w-48 h-48 rounded-3xl bg-teal-50 flex items-center justify-center border border-teal-100 shadow-inner">
                    <i className="fa-solid fa-file-signature text-7xl text-teal-500 drop-shadow-lg"></i>
                  </div>
               </div>

               <div className="glass-panel rounded-[40px] p-12 border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between bg-slate-50/50 opacity-80 group grayscale hover:grayscale-0 transition-all cursor-not-allowed">
                  <div className="relative z-10 max-w-2xl">
                    <span className="px-4 py-1.5 bg-slate-200 text-slate-500 text-[10px] font-black rounded-full border border-slate-300 uppercase tracking-[0.2em] mb-6 inline-block uppercase">Main Research Instrument</span>
                    <h3 className="text-4xl font-black text-slate-400 mb-4 tracking-tight uppercase italic">MADEL5C: Digital Literacy SJT</h3>
                    <button className="bg-slate-300 text-slate-500 font-black px-10 py-4 rounded-2xl cursor-not-allowed flex items-center gap-3">
                      <i className="fa-solid fa-lock"></i> Belum Tersedia
                    </button>
                  </div>
                  <div className="w-48 h-48 rounded-3xl bg-slate-100 flex items-center justify-center border border-slate-200 opacity-30">
                    <i className="fa-solid fa-vial-circle-check text-7xl text-slate-400"></i>
                  </div>
               </div>
            </div>
          )}

          {/* SURVEY TAB - COPY PASTE FROM HTML */}
          {activeTab === 'survey' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
               <div className="glass-panel rounded-3xl p-12 bg-white border-white shadow-xl relative overflow-hidden">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl shadow-xl shadow-blue-500/30">
                      <i className="fa-solid fa-chart-line"></i>
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 leading-none italic uppercase">Statistik Survey Pengguna</h2>
                      <p className="text-slate-500 mt-2 font-black uppercase tracking-widest text-[10px]">Real-time Usability Performance</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div className="bg-blue-600 rounded-[35px] p-10 text-white shadow-xl shadow-blue-900/20">
                      <p className="text-xs font-bold opacity-80 uppercase mb-2">System Usability Score</p>
                      <div className="text-6xl font-black mb-2">88.5</div>
                      <p className="text-xs font-bold bg-white/20 rounded-full px-4 py-1 inline-block uppercase">Excellent Grade</p>
                    </div>
                    <div className="bg-white rounded-[35px] p-10 border border-slate-100 shadow-sm">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">User Satisfaction</p>
                      <div className="text-6xl font-black text-slate-900 mb-2">94%</div>
                      <p className="text-xs font-bold text-teal-600 uppercase">Highly Positive</p>
                    </div>
                    <div className="bg-white rounded-[35px] p-10 border border-slate-100 shadow-sm">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">Platform Efficiency</p>
                      <div className="text-6xl font-black text-slate-900 mb-2">FAST</div>
                      <p className="text-xs font-bold text-blue-600 uppercase">Optimized Cache</p>
                    </div>
                  </div>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
