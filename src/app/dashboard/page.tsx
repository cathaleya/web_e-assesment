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
                <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">AI Diagnostik</p>
             </div>
             <h3 className="text-sm font-bold text-slate-900 leading-tight italic">
                &quot;{aiMessage}&quot;
             </h3>
          </div>

          {/* PROGRESS CARDS / LAPORAN HASIL */}
          {isMadelDone ? (
            (() => {
              const globalScore = stats?.madel5c || 0;
              const globalScorePercent = Math.round((globalScore / 150) * 100);
              
              let predictionText = "RENDAH (ADAPTIVE)";
              let predictionCategory = "Dasar";
              let predictionDesc = "Kesiapan adaptif Anda dalam literasi digital perlu ditingkatkan.";
              let bgGradient = "from-rose-500 to-rose-600";

              if (globalScorePercent >= 80) {
                predictionText = "TINGGI (ADAPTIVE)";
                predictionCategory = "Mahir";
                predictionDesc = "Kesiapan adaptif Anda dalam literasi digital sangat baik.";
                bgGradient = "from-emerald-600 to-teal-600";
              } else if (globalScorePercent >= 55) {
                predictionText = "SEDANG (ADAPTIVE)";
                predictionCategory = "Menengah";
                predictionDesc = "Kesiapan adaptif Anda dalam literasi digital cukup memadai.";
                bgGradient = "from-amber-500 to-orange-500";
              }

              return (
                <div className="space-y-6">
                  {/* HEADER LAPORAN */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                      <div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase italic leading-none">
                          Laporan Hasil & Rekomendasi
                        </h2>
                        <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider mt-2">
                          E-Assesmen Literasi Digital MADEL5C · Laporan Hasil Evaluasi
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-file-invoice text-blue-600 text-xl"></i>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                      {/* KARTU PREDIKSI */}
                      <div className={`rounded-2xl p-6 text-white bg-gradient-to-br ${bgGradient} shadow-xl flex flex-col justify-between relative overflow-hidden`}>
                        <div className="absolute right-4 top-4 opacity-10 text-9xl pointer-events-none">
                          <i className="fa-solid fa-circle-arrow-up"></i>
                        </div>
                        <div>
                          <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg inline-flex items-center gap-2 mb-4">
                            <i className="fa-solid fa-circle-arrow-up text-white text-xs animate-bounce"></i>
                            <span className="text-[9px] font-black uppercase tracking-wider">HASIL PREDIKSI: {predictionText}</span>
                          </div>
                          <div className="space-y-1 mt-2">
                            <p className="text-slate-100 text-[10px] font-bold uppercase tracking-widest">Skor Global</p>
                            <h3 className="text-5xl font-black tracking-tighter">{globalScorePercent}%</h3>
                          </div>
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-100">Kategori</p>
                            <p className="text-xl font-black">{predictionCategory}</p>
                          </div>
                        </div>
                        <p className="mt-6 text-xs font-bold leading-relaxed italic text-white/90">
                          &quot;{predictionDesc}&quot;
                        </p>
                      </div>

                      {/* RADAR CHART DIMENSI */}
                      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 flex flex-col items-center justify-center">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 text-center">
                          Visualisasi Kompetensi 5C Dimension Radar Chart
                        </p>
                        <div className="w-full max-w-[220px]">
                          <Radar data={{
                            labels: ['Critical Thinking', 'Communication', 'Collaboration', 'Creativity', 'Citizenship & Culture'],
                            datasets: [{
                              label: 'Skor Kompetensi',
                              data: stats?.radar || [0,0,0,0,0],
                              backgroundColor: 'rgba(59, 130, 246, 0.2)',
                              borderColor: '#2563eb',
                              borderWidth: 2,
                              pointRadius: 4,
                              pointBackgroundColor: '#2563eb'
                            }]
                          }} options={{
                            scales: { 
                              r: { 
                                suggestedMin: 0, 
                                suggestedMax: 100, 
                                pointLabels: { font: { size: 8, weight: 'bold' } }, 
                                ticks: { display: false } 
                              } 
                            },
                            plugins: { legend: { display: false } }
                          }} />
                        </div>
                      </div>
                    </div>

                    {/* REKOMENDASI CERDAS */}
                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4">Rekomendasi Cerdas</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#E0F2F1] p-5 rounded-2xl border border-[#B2DFDB] flex flex-col justify-between shadow-sm relative overflow-hidden group">
                          <div className="absolute -right-6 -bottom-6 text-[#80CBC4]/20 text-7xl font-black group-hover:scale-110 transition-transform"><i className="fa-solid fa-circle-info"></i></div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping"></span>
                              <span className="text-[9px] font-black text-teal-800 uppercase tracking-wider">Info & Data</span>
                            </div>
                            <p className="text-xs font-bold text-teal-900 leading-relaxed">
                              Tingkatkan validasi sumber informasi. Gunakan basis data akademis terpercaya dan saring informasi secara berkala sebelum menggunakannya.
                            </p>
                          </div>
                        </div>

                        <div className="bg-[#FFF8E1] p-5 rounded-2xl border border-[#FFE082] flex flex-col justify-between shadow-sm relative overflow-hidden group">
                          <div className="absolute -right-6 -bottom-6 text-[#FFE082]/20 text-7xl font-black group-hover:scale-110 transition-transform"><i className="fa-solid fa-gavel"></i></div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
                              <span className="text-[9px] font-black text-amber-800 uppercase tracking-wider">Etika & Keamanan</span>
                            </div>
                            <p className="text-xs font-bold text-amber-950 leading-relaxed">
                              Terapkan etika komunikasi digital dalam diskusi daring. Hormati hak kekayaan intelektual orang lain dan lakukan atribusi yang tepat.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* STATUS & EXIT BUTTON */}
                    <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">
                        Selamat! Anda telah menyelesaikan seluruh rangkaian evaluasi literasi digital. Gunakan hasil diagnosis AI sebagai bahan refleksi pengembangan diri Anda.
                      </p>
                      <div className="flex gap-2">
                        <button onClick={() => setShowReflection('madel')} className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">Refleksi Jawaban</button>
                        <button onClick={() => { localStorage.clear(); router.push("/login"); }} className="px-6 py-3 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-500/20 active:scale-95 transition-all">Keluar</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <>
              {/* PROGRESS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-md flex flex-col justify-between">
                   <div>
                      <div className="flex justify-between items-start mb-2">
                         <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Tahap 1</p>
                         {isPdiDone && <i className="fa-solid fa-circle-check text-emerald-500"></i>}
                      </div>
                      <h4 className="text-[10px] font-black text-slate-900 uppercase leading-none">PDI-DL</h4>
                      {isPdiDone && <p className="mt-2 text-xl font-black text-blue-600">Skor: {stats?.preliminary}</p>}
                   </div>
                   {isPdiDone ? (
                     <button onClick={() => setShowReflection('pdi')} className="mt-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-[8px] font-black uppercase tracking-widest">Lihat Refleksi</button>
                   ) : (
                     <button onClick={() => router.push("/assessment/preliminary")} className="mt-4 py-2 bg-blue-600 text-white rounded-lg text-[8px] font-black uppercase shadow-lg">Mulai</button>
                   )}
                </div>

                <div className={`bg-white p-4 rounded-xl border-2 shadow-md flex flex-col justify-between transition-all ${!isPdiDone ? 'opacity-50 grayscale' : 'border-amber-200'}`}>
                   <div>
                      <div className="flex justify-between items-start mb-2">
                         <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Tahap 2</p>
                         {isSurveyDone && <i className="fa-solid fa-circle-check text-emerald-500"></i>}
                      </div>
                      <h4 className="text-[10px] font-black text-slate-900 uppercase leading-none">Survey</h4>
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
                      <h4 className="text-[10px] font-black text-slate-900 uppercase leading-none">MADEL5C</h4>
                      {isMadelDone && <p className="mt-2 text-xl font-black text-[#4B5320]">Skor: {stats?.madel5c}</p>}
                   </div>
                   {isMadelDone ? (
                     <button onClick={() => setShowReflection('madel')} className="mt-4 py-2 bg-slate-100 text-[#4B5320] rounded-lg text-[8px] font-black uppercase tracking-widest">Lihat Refleksi</button>
                   ) : (
                     <button disabled={!isSurveyDone} onClick={() => router.push("/assessment/madel5c")} className="mt-4 py-2 bg-[#4B5320] text-white rounded-lg text-[8px] font-black uppercase shadow-lg tracking-widest">Mulai</button>
                   )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 {/* RADAR CHART */}
                 <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg flex flex-col items-center">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-4">Profil Kompetensi Digital</p>
                    <div className="w-full max-w-[200px]">
                      <Radar data={{
                        labels: ['C1', 'C2', 'C3', 'C4', 'C5'],
                        datasets: [{
                          label: 'Kompetensi',
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

                 <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg flex flex-col justify-center">
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Status Akhir:</h3>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                       <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">
                         Silakan selesaikan seluruh tahapan instrumen untuk mendapatkan profil kompetensi digital Anda secara utuh.
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
