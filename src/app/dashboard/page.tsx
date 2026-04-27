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

  if (!user) return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-xs">MEMUAT...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* SIDEBAR - ULTRA COMPACT */}
      <aside className="w-full md:w-48 bg-[#4B5320] flex flex-col text-white shadow-xl relative z-20">
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <i className="fa-solid fa-graduation-cap text-lg"></i>
          <h1 className="font-black text-xs tracking-tighter uppercase leading-none">HDAP PORTAL</h1>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10 text-[10px] font-bold">
            <i className="fa-solid fa-house w-4"></i> DASHBOARD
          </button>
          <button onClick={() => router.push("/assessment/preliminary")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-[10px] font-medium transition-all">
            <i className="fa-solid fa-file-lines w-4"></i> ASESMEN
          </button>
          <button onClick={() => { localStorage.clear(); router.push("/login"); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-rose-500/20 text-rose-300 text-[10px] font-medium transition-all">
            <i className="fa-solid fa-power-off w-4"></i> KELUAR
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT - NO FILTER BACKGROUND */}
      <main className="flex-1 h-screen overflow-y-auto relative"
            style={{ 
              backgroundImage: "url('/unj_bg_v2.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}>
        
        <header className="sticky top-0 z-10 px-4 py-2 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm">
           <h2 className="text-[10px] font-black text-slate-800 uppercase italic">
              User: {user.name}
           </h2>
           <div className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[7px] font-black uppercase">
              ONLINE
           </div>
        </header>

        <div className="p-4 space-y-4 max-w-4xl">
          {/* WELCOME CARD - MINI & HIGH CONTRAST */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
             <div className="max-w-md">
                <p className="text-[7px] font-black text-slate-400 mb-2 uppercase tracking-widest">PEMBERITAHUAN</p>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                   "Halo {user.name.split(' ')[0]}, selesaikan seluruh instrumen untuk pemetaan profil literasi digital Anda."
                </h3>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* PROGRESS SECTION */}
            <div className="space-y-3">
               {[
                 { id: 'preliminary', title: "PROGRES PDI-DL", score: stats?.preliminary || 0, total: 100, path: "/assessment/preliminary", color: "bg-blue-600" },
                 { id: 'madel5c', title: "PROGRES MADEL5C", score: stats?.madel5c || 0, total: 150, path: "/assessment/madel5c", color: "bg-[#4B5320]" }
               ].map((p, i) => (
                 <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-md">
                    <div className="flex justify-between items-center mb-2">
                       <p className="text-[8px] font-black text-slate-500 uppercase">{p.title}</p>
                       <span className="text-xs font-black text-slate-900">{p.score}<span className="text-[9px] text-slate-300">/{p.total}</span></span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mb-3">
                       <div className={`h-full ${p.color}`} style={{ width: `${(p.score/p.total)*100}%` }}></div>
                    </div>
                    <button onClick={() => router.push(p.path)} className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-900 text-[8px] font-black uppercase tracking-widest rounded-lg border border-slate-200 transition-all">
                       Lanjutkan Asesmen
                    </button>
                 </div>
               ))}

               {/* SURVEY - COMPACT */}
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-md flex items-center justify-between">
                  <div>
                    <h4 className="text-[9px] font-black text-slate-900 uppercase">Evaluasi Usabilitas (SUS)</h4>
                    <p className="text-[7px] font-bold text-slate-400 uppercase">Ukur kenyamanan platform</p>
                  </div>
                  <button onClick={() => router.push("/survey")} className="px-4 py-2 bg-[#4B5320] text-white text-[8px] font-black uppercase rounded-lg shadow-md transition-transform hover:scale-105">
                     ISI SURVEY
                  </button>
               </div>
            </div>

            {/* RADAR - SMALL */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-md flex flex-col items-center justify-center">
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-4">MAPPING PROFIL</p>
               <div className="w-full max-w-[180px]">
                 <Radar data={{
                   labels: ['C1', 'C2', 'C3', 'C4', 'C5'],
                   datasets: [{
                     data: stats?.radar || [0,0,0,0,0],
                     backgroundColor: 'rgba(75, 83, 32, 0.2)',
                     borderColor: '#4B5320',
                     borderWidth: 1.5,
                     pointRadius: 2
                   }]
                 }} options={{
                   scales: {
                     r: {
                       suggestedMin: 0,
                       suggestedMax: 5,
                       pointLabels: { font: { size: 8, weight: 'bold' }, color: '#000' },
                       ticks: { display: false }
                     }
                   },
                   plugins: { legend: { display: false } }
                 }} />
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
