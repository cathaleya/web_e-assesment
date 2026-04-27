"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return router.push("/login");
    fetchData(userId);
  }, []);

  const fetchData = async (userId: string) => {
    try {
      const res = await fetch(`/api/user/stats?userId=${userId}`);
      const data = await res.json();
      setUser(data.user);
      setStats(data.stats);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!user) return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-xs">MEMUAT DASHBOARD...</div>;

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col md:flex-row overflow-hidden">
      {/* SIDEBAR - COMPACT */}
      <aside className="w-full md:w-56 bg-white border-r border-slate-100 flex flex-col shadow-sm relative z-20">
        <div className="p-4 border-b border-slate-50 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#4B5320] rounded-xl flex items-center justify-center text-white shadow-md">
            <i className="fa-solid fa-graduation-cap text-sm"></i>
          </div>
          <div>
            <h1 className="font-black text-sm tracking-tighter text-[#4B5320] leading-none">HDAP PORTAL</h1>
            <p className="text-[7px] font-bold text-[#4B5320]/40 uppercase tracking-widest mt-1">E-Assessment Platform</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#4B5320] text-white text-[10px] font-black shadow-md">
            <i className="fa-solid fa-house-chimney w-4"></i> DASHBOARD
          </button>
          <button onClick={() => router.push("/assessment/preliminary")} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#4B5320]/60 hover:bg-slate-50 text-[10px] font-black transition-all">
            <i className="fa-solid fa-file-signature w-4"></i> ASESMEN SAYA
          </button>
        </nav>

        <div className="p-4 border-t border-slate-50 space-y-4">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-rose-500 hover:bg-rose-50 text-[10px] font-black transition-all">
            <i className="fa-solid fa-power-off w-4"></i> KELUAR
          </button>
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl">
             <div className="w-8 h-8 bg-[#4B5320] rounded-lg flex items-center justify-center text-white font-black text-xs">
                {user.name.charAt(0)}
             </div>
             <div className="overflow-hidden">
                <p className="text-[9px] font-black text-[#4B5320] truncate uppercase">{user.name}</p>
                <p className="text-[7px] font-bold text-[#4B5320]/40 uppercase truncate">{user.campus}</p>
             </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT - COMPACT */}
      <main className="flex-1 h-screen overflow-y-auto relative"
            style={{ 
              backgroundImage: "linear-gradient(rgba(250, 249, 246, 0.8), rgba(250, 249, 246, 0.8)), url('/unj_bg_v2.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}>
        
        <header className="sticky top-0 z-10 px-4 sm:px-8 py-3 bg-white/80 backdrop-blur-md flex items-center justify-between border-b border-slate-100 shadow-sm">
           <h2 className="text-xs sm:text-sm font-black text-[#4B5320] uppercase tracking-tighter italic">
              Selamat Datang, {user.name.split(' ')[0]}
           </h2>
           <div className="px-3 py-1 bg-[#4B5320]/10 text-[#4B5320] rounded-full text-[8px] font-black uppercase tracking-widest border border-[#4B5320]/20">
              SYSTEM ONLINE
           </div>
        </header>

        <div className="p-4 sm:p-8 space-y-6 max-w-5xl">
          {/* WELCOME CARD - SMALL VERSION */}
          <div className="bg-white rounded-[30px] p-6 sm:p-8 shadow-xl border-2 border-white relative overflow-hidden group">
             <div className="relative z-10 max-w-lg">
                <p className="text-[8px] font-black text-[#4B5320] bg-[#4B5320]/5 px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-widest">Diagnosa Psikometri</p>
                <h3 className="text-lg sm:text-2xl font-black text-[#4B5320] leading-tight italic mb-4">
                   "Halo {user.name.split(' ')[0]}, selesaikan seluruh butir instrumen untuk pemetaan profil literasi digital Anda."
                </h3>
             </div>
             {/* Abstract Background Elements */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#4B5320]/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* PROGRESS SECTION */}
            <div className="lg:col-span-7 space-y-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'preliminary', title: "Progres PDI-DL", score: stats?.preliminary || 0, total: 100, path: "/assessment/preliminary", color: "bg-blue-500" },
                    { id: 'madel5c', title: "Progres MADEL5C", score: stats?.madel5c || 0, total: 150, path: "/assessment/madel5c", color: "bg-[#4B5320]" }
                  ].map((p, i) => (
                    <div key={i} className="bg-white p-5 rounded-3xl border border-slate-50 shadow-lg">
                       <div className="flex justify-between items-start mb-3">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{p.title}</p>
                          <span className={`px-2 py-0.5 rounded-full text-[7px] font-black text-white uppercase tracking-tighter ${p.score > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                             {p.score > 0 ? 'Aktif' : 'Tertunda'}
                          </span>
                       </div>
                       <div className="flex items-baseline gap-1 mb-3">
                          <span className="text-xl font-black text-[#4B5320]">{p.score}</span>
                          <span className="text-[10px] font-bold text-slate-300">/{p.total}</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden mb-4">
                          <div className={`h-full ${p.color} transition-all duration-1000`} style={{ width: `${(p.score/p.total)*100}%` }}></div>
                       </div>
                       <button onClick={() => router.push(p.path)} className="w-full py-2 bg-slate-50 hover:bg-[#4B5320] text-[#4B5320] hover:text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-xl transition-all border border-slate-100">
                          {p.score > 0 ? 'Lanjutkan' : 'Mulai Sekarang'}
                       </button>
                    </div>
                  ))}
               </div>

               {/* SURVEY CARD - COMPACT */}
               <div className="bg-white p-5 rounded-3xl border border-slate-50 shadow-lg flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#4B5320] rounded-xl flex items-center justify-center text-white shadow-lg"><i className="fa-solid fa-square-poll-vertical text-lg"></i></div>
                    <div>
                      <h4 className="text-[10px] font-black text-[#4B5320] uppercase leading-none">Evaluasi Usabilitas (SUS)</h4>
                      <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Ukur kenyamanan platform</p>
                    </div>
                  </div>
                  <button onClick={() => router.push("/survey")} className="px-6 py-2 bg-[#4B5320] text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-xl shadow-lg shadow-[#4B5320]/20 hover:scale-105 transition-all">
                     ISI SURVEY
                  </button>
               </div>
            </div>

            {/* CHART SECTION */}
            <div className="lg:col-span-5">
               <div className="bg-white p-6 rounded-[35px] border border-slate-50 shadow-2xl h-full flex flex-col items-center">
                  <p className="text-[9px] font-black text-[#4B5320] uppercase tracking-[0.4em] mb-6">Mapping Profil</p>
                  <div className="w-full max-w-[280px]">
                    <Radar data={{
                      labels: ['C1', 'C2', 'C3', 'C4', 'C5'],
                      datasets: [{
                        label: 'Skor',
                        data: stats?.radar || [0,0,0,0,0],
                        backgroundColor: 'rgba(75, 83, 32, 0.15)',
                        borderColor: '#4B5320',
                        borderWidth: 2,
                        pointBackgroundColor: '#4B5320',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#4B5320'
                      }]
                    }} options={{
                      scales: {
                        r: {
                          angleLines: { color: 'rgba(0,0,0,0.05)' },
                          grid: { color: 'rgba(0,0,0,0.05)' },
                          suggestedMin: 0,
                          suggestedMax: 5,
                          pointLabels: { color: '#4B5320', font: { weight: 'bold', size: 9 } },
                          ticks: { display: false }
                        }
                      },
                      plugins: { legend: { display: false } }
                    }} />
                  </div>
                  {stats?.radar ? null : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center mt-4">
                       <i className="fa-solid fa-lock text-slate-200 text-3xl mb-3"></i>
                       <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Selesaikan asesmen untuk melihat profil</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
