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
  const [aiMessage, setAiMessage] = useState<string>("Sedang menganalisis profil Anda...");
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return router.push("/login");
    fetchData(userId);
    fetchAiFeedback(userId);
  }, []);

  const fetchData = async (userId: string) => {
    try {
      const res = await fetch(`/api/user/stats?userId=${userId}`);
      const data = await res.json();
      setUser(data.user);
      setStats(data.stats);
    } catch (err) { console.error(err); }
  };

  const fetchAiFeedback = async (userId: string) => {
    try {
      const res = await fetch(`/api/ai/feedback?userId=${userId}`);
      const data = await res.json();
      setAiMessage(data.message);
    } catch (err) { setAiMessage("Selamat datang di Portal HDAP!"); }
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
          {/* AI DIAGNOSTIC WELCOME CARD */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border-l-8 border-blue-600">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-[10px]"><i className="fa-solid fa-robot"></i></div>
                <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">AI Diagnostik UNJ</p>
             </div>
             <h3 className="text-sm font-bold text-slate-900 leading-tight">
                "{aiMessage}"
             </h3>
          </div>

          {/* PROGRESS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-md flex flex-col justify-between">
               <div>
                  <div className="flex justify-between items-start mb-2">
                     <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Tahap 1</p>
                     {isPdiDone && <i className="fa-solid fa-circle-check text-emerald-500"></i>}
                  </div>
                  <h4 className="text-[10px] font-black text-slate-900 uppercase leading-none">Instrumen PDI-DL</h4>
               </div>
               <button onClick={() => router.push("/assessment/preliminary")}
                  className={`mt-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${isPdiDone ? "bg-emerald-50 text-emerald-600" : "bg-blue-600 text-white shadow-lg"}`}>
                  {isPdiDone ? "Selesai" : "Mulai"}
               </button>
            </div>

            <div className={`bg-white p-4 rounded-xl border-2 shadow-md flex flex-col justify-between transition-all ${!isPdiDone ? 'opacity-50 grayscale' : 'border-amber-200'}`}>
               <div>
                  <div className="flex justify-between items-start mb-2">
                     <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Tahap 2</p>
                     {isSurveyDone && <i className="fa-solid fa-circle-check text-emerald-500"></i>}
                  </div>
                  <h4 className="text-[10px] font-black text-slate-900 uppercase leading-none">Survey Usabilitas</h4>
               </div>
               <button disabled={!isPdiDone} onClick={() => router.push("/survey")}
                  className={`mt-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${!isPdiDone ? "bg-slate-100 text-slate-400" : isSurveyDone ? "bg-emerald-50 text-emerald-600" : "bg-amber-500 text-white shadow-lg"}`}>
                  {isSurveyDone ? "Selesai" : "Isi Survey"}
               </button>
            </div>

            <div className={`bg-white p-4 rounded-xl border-2 shadow-md flex flex-col justify-between transition-all ${!isSurveyDone ? 'opacity-50 grayscale' : 'border-[#4B5320]/30'}`}>
               <div>
                  <div className="flex justify-between items-start mb-2">
                     <p className="text-[8px] font-black text-[#4B5320] uppercase tracking-widest">Tahap 3</p>
                     {isMadelDone && <i className="fa-solid fa-circle-check text-emerald-500"></i>}
                  </div>
                  <h4 className="text-[10px] font-black text-slate-900 uppercase leading-none">Instrumen MADEL5C</h4>
               </div>
               <button disabled={!isSurveyDone} onClick={() => router.push("/assessment/madel5c")}
                  className={`mt-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${!isSurveyDone ? "bg-slate-100 text-slate-400" : isMadelDone ? "bg-emerald-50 text-emerald-600" : "bg-[#4B5320] text-white shadow-lg"}`}>
                  {isMadelDone ? "Selesai" : "Mulai"}
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
             {/* RADAR CHART */}
             <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg flex flex-col items-center">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-4">Mapping Kompetensi</p>
                <div className="w-full max-w-[200px]">
                  <Radar data={{
                    labels: ['C1', 'C2', 'C3', 'C4', 'C5'],
                    datasets: [{
                      data: stats?.radar || [0,0,0,0,0],
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      borderColor: '#2563eb',
                      borderWidth: 2,
                      pointRadius: 3
                    }]
                  }} options={{
                    scales: { r: { suggestedMin: 0, suggestedMax: 5, pointLabels: { font: { size: 9, weight: 'bold' } }, ticks: { display: false } } },
                    plugins: { legend: { display: false } }
                  }} />
                </div>
             </div>

             <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Info Pengisian:</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-[9px] font-black text-blue-900 uppercase">Tahap 1: PDI-DL</p>
                    <p className="text-[8px] font-bold text-blue-700">Diagnosis awal tingkat literasi digital secara mandiri.</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-[9px] font-black text-amber-900 uppercase">Tahap 2: Survey</p>
                    <p className="text-[8px] font-bold text-amber-700">Evaluasi pengalaman Anda menggunakan platform HDAP.</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-[9px] font-black text-emerald-900 uppercase">Tahap 3: MADEL5C</p>
                    <p className="text-[8px] font-bold text-emerald-700">Asesmen berbasis skenario situasi dunia nyata.</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
