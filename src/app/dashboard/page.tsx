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
      {/* SIDEBAR TIMBUL & ENLARGED */}
      <aside className="w-full md:w-64 bg-gradient-to-b from-[#3B4219] via-[#4B5320] to-[#2E3314] flex flex-col text-white shadow-2xl relative z-20 border-r border-[#5B6428]">
        {/* BRAND LOGO TIMBUL */}
        <div className="p-4 md:p-6 border-b border-white/15 flex items-center gap-3 bg-black/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-[#2E3314] flex items-center justify-center text-lg font-black shadow-lg border-b-2 border-amber-700 shrink-0">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <div>
            <h1 className="font-black text-sm md:text-base tracking-tight uppercase leading-tight text-amber-300 drop-shadow-sm">HDAP PORTAL</h1>
            <span className="text-[9px] font-bold text-slate-200 uppercase tracking-widest block">E-Assessment System</span>
          </div>
        </div>

        {/* NAVIGATION BUTTONS TIMBUL & ENLARGED */}
        <nav className="flex-1 p-3 md:p-4 space-y-2.5">
          <button 
            onClick={() => router.push("/dashboard")} 
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-white/25 to-white/15 text-white text-xs md:text-sm font-black text-left shadow-md border border-white/30 border-b-4 border-b-black/30 transition-all hover:translate-y-[-2px] active:translate-y-[0px]"
          >
            <i className="fa-solid fa-house text-amber-400 text-sm w-5 text-center"></i> 
            <span>DASHBOARD</span>
          </button>

          <button 
            onClick={() => router.push("/assessment/preliminary")} 
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-black text-left transition-all border border-white/15 border-b-4 border-b-black/20 hover:translate-y-[-2px]"
          >
            <span className="flex items-center gap-3.5">
              <i className="fa-solid fa-clipboard-check text-sky-400 text-sm w-5 text-center"></i>
              <span>PDI-DL (TES AWAL)</span>
            </span>
            {isPdiDone && <i className="fa-solid fa-circle-check text-emerald-400 text-sm"></i>}
          </button>

          <button 
            onClick={() => router.push("/assessment/madel5c")} 
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-black text-left transition-all border border-white/15 border-b-4 border-b-black/20 hover:translate-y-[-2px]"
          >
            <span className="flex items-center gap-3.5">
              <i className="fa-solid fa-file-pen text-emerald-400 text-sm w-5 text-center"></i>
              <span>MADEL-5C (SJT)</span>
            </span>
            {isMadelDone && <i className="fa-solid fa-circle-check text-emerald-400 text-sm"></i>}
          </button>

          <button 
            onClick={() => router.push("/assessment/think-aloud")} 
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-black text-left transition-all border border-white/15 border-b-4 border-b-black/20 hover:translate-y-[-2px]"
          >
            <span className="flex items-center gap-3.5">
              <i className="fa-solid fa-microphone-lines text-rose-300 text-sm w-5 text-center"></i>
              <span>THINK ALOUD (SUARA)</span>
            </span>
            <span className="px-2 py-0.5 bg-rose-500/40 text-rose-200 text-[8px] font-black rounded-md border border-rose-400/40">PROTOKOL</span>
          </button>

          <button 
            onClick={() => router.push("/survey")} 
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-black text-left transition-all border border-white/15 border-b-4 border-b-black/20 hover:translate-y-[-2px]"
          >
            <span className="flex items-center gap-3.5">
              <i className="fa-solid fa-poll-h text-amber-300 text-sm w-5 text-center"></i>
              <span>SURVEY KEPUASAN</span>
            </span>
            {isSurveyDone && <i className="fa-solid fa-circle-check text-emerald-400 text-sm"></i>}
          </button>

          <div className="pt-4 border-t border-white/10">
            <button 
              onClick={() => { localStorage.clear(); router.push("/login"); }} 
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-100 text-xs md:text-sm font-black text-left transition-all border border-rose-400/30 border-b-4 border-b-rose-950 hover:translate-y-[-2px]"
            >
              <i className="fa-solid fa-power-off text-rose-400 text-sm w-5 text-center"></i> 
              <span>KELUAR</span>
            </button>
          </div>
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
        
        <header className="sticky top-0 z-10 px-4 md:px-6 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between shadow-md">
           <div className="flex items-center gap-2.5 md:gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#4B5320] text-white flex items-center justify-center font-black text-xs shadow-sm border border-[#3B4219]">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h2 className="text-xs md:text-sm font-black text-slate-900 uppercase leading-tight">
                  User: {user.name}
                </h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{user.campus}</p>
              </div>
           </div>
           <div className="px-3 py-1 bg-emerald-600 text-white rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span> ONLINE
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
              {/* PROGRESS CARDS TIMBUL (2 COLUMNS FOCUSING ON MADEL5C & SURVEY SUS) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {/* TAHAP Utama: MADEL5C */}
                <div className="card-timbul p-5 md:p-6 rounded-[24px] bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/60 flex flex-col justify-between border border-emerald-200">
                   <div>
                      <div className="flex justify-between items-center mb-3">
                         <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                           Tahap Utama (SJT)
                         </span>
                         {isMadelDone && (
                           <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                             <i className="fa-solid fa-circle-check text-emerald-600"></i> Selesai
                           </span>
                         )}
                      </div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">MADEL5C (SJT)</h4>
                      <p className="text-[10px] font-semibold text-slate-600 mt-1">Asesmen Literasi Digital 5 Dimensi (30 Butir)</p>
                      {isMadelDone && <p className="mt-2 text-2xl font-black text-emerald-700 tracking-tight">Skor: {stats?.madel5c}</p>}
                   </div>
                   {isMadelDone ? (
                     <button onClick={() => setShowReflection('madel')} className="mt-5 py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm transition-all border border-emerald-300">
                       Lihat Refleksi
                     </button>
                   ) : (
                     <button onClick={() => router.push("/assessment/madel5c")} className="mt-5 py-3.5 bg-gradient-to-r from-emerald-700 to-[#4B5320] hover:from-emerald-800 hover:to-[#3B4119] text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg border-b-4 border-emerald-950 transition-all active:scale-95">
                       Mulai MADEL-5C <i className="fa-solid fa-arrow-right ml-1.5"></i>
                     </button>
                   )}
                </div>

                {/* TAHAP Akhir: SURVEY KEPUASAN */}
                <div className={`card-timbul p-5 md:p-6 rounded-[24px] bg-gradient-to-br from-amber-50/90 via-white to-orange-50/60 flex flex-col justify-between transition-all border ${!isMadelDone ? 'opacity-60 border-slate-200' : 'border-amber-200'}`}>
                   <div>
                      <div className="flex justify-between items-center mb-3">
                         <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                           Tahap Evaluasi
                         </span>
                         {isSurveyDone && (
                           <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                             <i className="fa-solid fa-circle-check text-emerald-600"></i> Selesai
                           </span>
                         )}
                      </div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Survey Kepuasan (SUS)</h4>
                      <p className="text-[10px] font-semibold text-slate-600 mt-1">Evaluasi Kebergunaan Sistem (10 Butir)</p>
                   </div>
                   <button disabled={!isMadelDone} onClick={() => router.push("/survey")}
                      className={`mt-5 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!isMadelDone ? "bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed" : isSurveyDone ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border-b-4 border-amber-800 active:scale-95"}`}>
                      {isSurveyDone ? "Survey Terisi" : "Isi Survey SUS"}
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
