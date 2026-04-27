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

  const isPdiDone = stats?.preliminary > 0;
  const isSurveyDone = stats?.surveyDone;
  const isMadelDone = stats?.madel5c > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-full md:w-48 bg-[#4B5320] flex flex-col text-white shadow-xl relative z-20">
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <i className="fa-solid fa-graduation-cap text-lg"></i>
          <h1 className="font-black text-xs tracking-tighter uppercase leading-none">HDAP PORTAL</h1>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10 text-[10px] font-bold">
            <i className="fa-solid fa-house w-4"></i> DASHBOARD
          </button>
          <button onClick={() => { localStorage.clear(); router.push("/login"); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-rose-500/20 text-rose-300 text-[10px] font-medium transition-all">
            <i className="fa-solid fa-power-off w-4"></i> KELUAR
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 h-screen overflow-y-auto relative"
            style={{ 
              backgroundImage: "url('/unj_bg_v2.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}>
        
        <header className="sticky top-0 z-10 px-4 py-2 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm">
           <h2 className="text-[10px] font-black text-slate-800 uppercase italic">
              User: {user.name} | {user.campus}
           </h2>
           <div className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[7px] font-black uppercase">
              ONLINE
           </div>
        </header>

        <div className="p-4 space-y-4 max-w-4xl">
          {/* PROGRESS CARDS - SEQUENTIAL FLOW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* STEP 1: PDI-DL */}
            <div className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-md flex flex-col justify-between">
               <div>
                  <div className="flex justify-between items-start mb-2">
                     <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Tahap 1</p>
                     {isPdiDone && <i className="fa-solid fa-circle-check text-emerald-500"></i>}
                  </div>
                  <h4 className="text-[10px] font-black text-slate-900 uppercase leading-none">Instrumen PDI-DL</h4>
                  <p className="text-[7px] font-bold text-slate-400 mt-1 uppercase">Pemetaan Profil Awal</p>
               </div>
               <button 
                  onClick={() => router.push("/assessment/preliminary")}
                  className={`mt-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                    isPdiDone ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  }`}
               >
                  {isPdiDone ? "Selesai diisi" : "Mulai Mengisi"}
               </button>
            </div>

            {/* STEP 2: SURVEY (Unlocked by PDI-DL) */}
            <div className={`bg-white p-4 rounded-xl border-2 shadow-md flex flex-col justify-between transition-all ${!isPdiDone ? 'opacity-50 grayscale bg-slate-50' : 'border-amber-200'}`}>
               <div>
                  <div className="flex justify-between items-start mb-2">
                     <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Tahap 2</p>
                     {!isPdiDone && <i className="fa-solid fa-lock text-slate-300"></i>}
                     {isSurveyDone && <i className="fa-solid fa-circle-check text-emerald-500"></i>}
                  </div>
                  <h4 className="text-[10px] font-black text-slate-900 uppercase leading-none">Survey Usabilitas</h4>
                  <p className="text-[7px] font-bold text-slate-400 mt-1 uppercase">Evaluasi Sistem (SUS)</p>
               </div>
               <button 
                  disabled={!isPdiDone}
                  onClick={() => router.push("/survey")}
                  className={`mt-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                    !isPdiDone ? "bg-slate-100 text-slate-400 cursor-not-allowed" : 
                    isSurveyDone ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-500 text-white shadow-lg shadow-amber-200"
                  }`}
               >
                  {isSurveyDone ? "Selesai diisi" : "Isi Survey"}
               </button>
            </div>

            {/* STEP 3: MADEL5C (Unlocked by Survey) */}
            <div className={`bg-white p-4 rounded-xl border-2 shadow-md flex flex-col justify-between transition-all ${!isSurveyDone ? 'opacity-50 grayscale bg-slate-50' : 'border-[#4B5320]/30'}`}>
               <div>
                  <div className="flex justify-between items-start mb-2">
                     <p className="text-[8px] font-black text-[#4B5320] uppercase tracking-widest">Tahap 3</p>
                     {!isSurveyDone && <i className="fa-solid fa-lock text-slate-300"></i>}
                     {isMadelDone && <i className="fa-solid fa-circle-check text-emerald-500"></i>}
                  </div>
                  <h4 className="text-[10px] font-black text-slate-900 uppercase leading-none">Instrumen MADEL5C</h4>
                  <p className="text-[7px] font-bold text-slate-400 mt-1 uppercase">Skenario Situasi</p>
               </div>
               <button 
                  disabled={!isSurveyDone}
                  onClick={() => router.push("/assessment/madel5c")}
                  className={`mt-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                    !isSurveyDone ? "bg-slate-100 text-slate-400 cursor-not-allowed" : 
                    isMadelDone ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-[#4B5320] text-white shadow-lg shadow-[#4B5320]/20"
                  }`}
               >
                  {isMadelDone ? "Selesai diisi" : "Mulai MADEL5C"}
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
             {/* INFO CARD */}
             <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
                <h3 className="text-xs font-black text-slate-900 mb-2">Panduan Urutan Pengisian:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-[9px] font-bold text-slate-600">
                    <div className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black">1</div>
                    Isi instrumen Preliminary PDI-DL sampai selesai.
                  </li>
                  <li className="flex items-center gap-2 text-[9px] font-bold text-slate-600">
                    <div className="w-4 h-4 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-black">2</div>
                    Lanjutkan mengisi kuesioner Survey Usabilitas sistem.
                  </li>
                  <li className="flex items-center gap-2 text-[9px] font-bold text-slate-600">
                    <div className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-black">3</div>
                    Selesaikan tahap akhir instrumen MADEL5C.
                  </li>
                </ul>
             </div>

             {/* RADAR CHART - SMALL */}
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-md flex flex-col items-center justify-center">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-4">MAPPING PROFIL AKHIR</p>
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
