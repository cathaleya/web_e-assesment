"use client";

import { useState, useEffect, useCallback } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import AssessmentOverview from "../components/AssessmentOverview";

// Menghindari timeout saat build di VPS
export const dynamic = "force-dynamic";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface UserData {
  name: string;
  campus: string;
}

interface StatsData {
  preliminary: number;
  pdiAnswers: Record<string, number> | null;
  madel5c: number;
  madelAnswers: Record<string, number> | null;
  surveyDone: boolean;
  radar: number[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [aiMessage, setAiMessage] = useState<string>("Sedang menganalisis profil Anda...");
  const [showReflection, setShowReflection] = useState<string | null>(null);
  const router = useRouter();

  const fetchData = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`/api/user/stats?userId=${userId}`);
      const data = await res.json();
      setUser(data.user);
      setStats(data.stats);
    } catch (err) { console.error(err); }
  }, []);

  const fetchAiFeedback = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`/api/ai/feedback?userId=${userId}`);
      const data = await res.json();
      setAiMessage(data.message);
    } catch (err) { 
      console.error(err);
      setAiMessage("Selamat datang di Portal HDAP!"); 
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }
    fetchData(userId);
    fetchAiFeedback(userId);
  }, [fetchData, fetchAiFeedback, router]);

  if (!user) return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-xs">MEMUAT...</div>;

  const isPdiDone = (stats?.preliminary ?? 0) > 0;
  const isSurveyDone = stats?.surveyDone ?? false;
  const isMadelDone = (stats?.madel5c ?? 0) > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-full md:w-48 bg-[#4B5320] flex flex-col text-white shadow-xl relative z-20">
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <i className="fa-solid fa-graduation-cap text-lg"></i>
          <h1 className="font-black text-xs tracking-tighter uppercase leading-none">HDAP PORTAL</h1>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          <button onClick={() => router.push("/dashboard")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10 text-[10px] font-bold text-left">
            <i className="fa-solid fa-house w-4"></i> DASHBOARD
          </button>
          <button onClick={() => router.push("/assessment/preliminary")} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 text-[10px] font-medium text-left transition-all">
            <span className="flex items-center gap-3">
              <i className="fa-solid fa-clipboard-check w-4"></i> PDI-DL (TES AWAL)
            </span>
            {isPdiDone && <i className="fa-solid fa-circle-check text-emerald-400 text-xs"></i>}
          </button>
          <button onClick={() => { localStorage.clear(); router.push("/login"); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-rose-500/20 text-rose-300 text-[10px] font-medium text-left transition-all">
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

        <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-4xl mx-auto">
          {/* AI DIAGNOSTIC WELCOME CARD TIMBUL */}
          <div className="card-timbul p-5 md:p-6 rounded-[24px] md:rounded-[28px] border-l-8 border-l-blue-600 bg-gradient-to-r from-blue-50/90 via-white to-slate-50/80">
             <div className="flex items-center gap-3 mb-2.5">
                <div className="w-7 h-7 bg-blue-600 rounded-xl flex items-center justify-center text-white text-[11px] shadow-md">
                  <i className="fa-solid fa-robot"></i>
                </div>
                <p className="text-[9px] font-black text-blue-700 uppercase tracking-widest">AI Diagnostik Realtime</p>
             </div>
             <h3 className="text-xs md:text-sm font-bold text-slate-900 leading-relaxed italic">
                &quot;{aiMessage}&quot;
             </h3>
          </div>

          {/* PROGRESS CARDS / LAPORAN HASIL */}
          {(isMadelDone && isSurveyDone) ? (
            <AssessmentOverview
              userName={user.name}
              userCampus={user.campus}
              sessionDate="15 Okt 2023"
              madelScore={stats?.madel5c || 0}
              preliminaryScore={stats?.preliminary || 0}
              surveyDone={stats?.surveyDone || false}
              radarData={stats?.radar || [85, 90, 80, 75, 88]}
              onShowReflection={() => setShowReflection('madel')}
              onExit={() => { localStorage.clear(); router.push("/login"); }}
            />
          ) : (
            <>
              {/* PROGRESS CARDS TIMBUL (SOFT CONTRAST) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {/* TAHAP 1: MADEL5C */}
                <div className="card-timbul p-5 md:p-6 rounded-[24px] md:rounded-[28px] bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/60 flex flex-col justify-between border border-emerald-200">
                   <div>
                      <div className="flex justify-between items-center mb-3">
                         <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                           Tahap 1
                         </span>
                         {isMadelDone && (
                           <span className="flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                             <i className="fa-solid fa-circle-check text-emerald-600"></i> Selesai
                           </span>
                         )}
                      </div>
                      <h4 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight">MADEL5C (SJT 30 Butir)</h4>
                      <p className="text-[10px] font-semibold text-slate-600 mt-1">Asesmen Literasi Digital 5 Dimensi</p>
                      {isMadelDone && <p className="mt-3 text-2xl font-black text-emerald-700 tracking-tight">Skor: {stats?.madel5c}</p>}
                   </div>
                   {isMadelDone ? (
                     <button onClick={() => setShowReflection('madel')} className="mt-5 py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm transition-all border border-emerald-300">
                       Lihat Refleksi
                     </button>
                   ) : (
                     <button onClick={() => router.push("/assessment/madel5c")} className="mt-5 py-3.5 bg-gradient-to-r from-emerald-700 to-[#4B5320] hover:from-emerald-800 hover:to-[#3B4119] text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg border-b-4 border-emerald-950 transition-all active:scale-95">
                       Mulai Asesmen <i className="fa-solid fa-arrow-right ml-1"></i>
                     </button>
                   )}
                </div>

                {/* TAHAP 2: SURVEY KEPUASAN */}
                <div className={`card-timbul p-5 md:p-6 rounded-[24px] md:rounded-[28px] bg-gradient-to-br from-amber-50/90 via-white to-orange-50/60 flex flex-col justify-between transition-all border ${!isMadelDone ? 'opacity-60 border-slate-200' : 'border-amber-200'}`}>
                   <div>
                      <div className="flex justify-between items-center mb-3">
                         <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                           Tahap 2
                         </span>
                         {isSurveyDone && (
                           <span className="flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                             <i className="fa-solid fa-circle-check text-emerald-600"></i> Selesai
                           </span>
                         )}
                      </div>
                      <h4 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight">Survey Kepuasan Sistem (SUS)</h4>
                      <p className="text-[10px] font-semibold text-slate-600 mt-1">Evaluasi Pengalaman Pengguna (10 Butir)</p>
                   </div>
                   <button disabled={!isMadelDone} onClick={() => router.push("/survey")}
                      className={`mt-5 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!isMadelDone ? "bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed" : isSurveyDone ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border-b-4 border-amber-800 active:scale-95"}`}>
                      {isSurveyDone ? "Survey Terisi" : "Isi Survey Kepuasan"}
                   </button>
                </div>
              </div>

              {/* RADAR & STATUS AKHIR CARDS TIMBUL */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                 {/* RADAR CHART CARD TIMBUL */}
                 <div className="card-timbul p-5 md:p-6 rounded-[24px] md:rounded-[28px] bg-white flex flex-col items-center border border-slate-200">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Profil Kompetensi Digital 5 Dimensi</p>
                    <div className="w-full max-w-[210px]">
                      <Radar data={{
                        labels: ['C1', 'C2', 'C3', 'C4', 'C5'],
                        datasets: [{
                          label: 'Kompetensi',
                          data: stats?.radar || [0,0,0,0,0],
                          backgroundColor: 'rgba(75, 83, 32, 0.2)',
                          borderColor: '#4B5320',
                          borderWidth: 2,
                          pointRadius: 3
                        }]
                      }} options={{
                        scales: { r: { suggestedMin: 0, suggestedMax: 100, pointLabels: { font: { size: 9, weight: 'bold' } }, ticks: { display: false } } },
                        plugins: { legend: { display: false } }
                      }} />
                    </div>
                 </div>

                 {/* STATUS AKHIR CARD TIMBUL */}
                 <div className="card-timbul p-5 md:p-6 rounded-[24px] md:rounded-[28px] bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 flex flex-col justify-center border border-indigo-100">
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-flag-checkered text-indigo-600"></i> Status Kelengkapan Riset:
                    </h3>
                    <div className="p-4 scenario-timbul rounded-2xl">
                       <p className="text-[11px] font-bold text-emerald-950 leading-relaxed italic">
                         &quot;Silakan selesaikan seluruh 30 butir instrumen MADEL5C dan 10 butir survey kepuasan untuk mengunduh laporan kompetensi digital utuh Anda.&quot;
                       </p>
                    </div>
                 </div>
              </div>
            </>
          )}

        </div>
      </main>

      {/* REFLECTION MODAL */}
      <AnimatePresence>
        {showReflection && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReflection(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[40px] p-8 shadow-3xl border border-slate-100 max-h-[80vh] flex flex-col">
               <h2 className="text-xl font-black text-slate-900 mb-6 tracking-tight uppercase border-b pb-4">Refleksi Jawaban {showReflection.toUpperCase()}</h2>
               <div className="flex-1 overflow-y-auto pr-4 space-y-4">
                  {showReflection === 'pdi' && stats?.pdiAnswers && Object.entries(stats.pdiAnswers).map(([key, val], i) => (
                    <div key={i} className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                       <p className="text-[9px] font-black text-blue-500 uppercase mb-1">Butir Pertanyaan {Number(key) + 1}</p>
                       <p className="text-xs font-bold text-slate-900">Skor Kemampuan Mandiri: <span className="text-blue-600">{val}</span> / 5</p>
                    </div>
                  ))}
                  {showReflection === 'madel' && stats?.madelAnswers && Object.entries(stats.madelAnswers).map(([key, val], i) => (
                    <div key={i} className="p-4 bg-[#4B5320]/10 rounded-2xl border border-[#4B5320]/20">
                       <p className="text-[9px] font-black text-[#4B5320] uppercase mb-1">Skenario Situasi {Number(key) + 1}</p>
                       <p className="text-xs font-bold text-slate-900">Skor Efektivitas Tindakan: <span className="text-[#4B5320]">{val}</span> / 5</p>
                    </div>
                  ))}
               </div>
               <button onClick={() => setShowReflection(null)} className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Tutup</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
