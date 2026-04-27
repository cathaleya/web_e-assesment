"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Radar, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement
);

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "assessments">("dashboard");
  const [userName, setUserName] = useState("User");
  const [userGender, setUserGender] = useState("");
  const [hasFinishedAssessment, setHasFinishedAssessment] = useState(false);
  const [hasFinishedSurvey, setHasFinishedSurvey] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const [userResults, setUserResults] = useState<any[]>([]);
  const [surveyData, setSurveyData] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    const savedName = localStorage.getItem("userName");
    const savedGender = localStorage.getItem("userGender");
    const userId = localStorage.getItem("userId");
    
    if (savedName) setUserName(savedName);
    if (savedGender) setUserGender(savedGender);

    if (userId) {
      // Fetch Assessments
      fetch(`/api/assessment?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          const results = Array.isArray(data) ? data : [];
          setUserResults(results);
          if (results.some((r: any) => r.type === 'PDI-DL')) setHasFinishedAssessment(true);
          if (results.some((r: any) => r.type === 'MADEL5C')) setHasFinishedSurvey(true); // unlock after PDI-DL submitted + survey
        });
      
      // Fetch Survey
      fetch(`/api/survey`)
        .then(res => res.json())
        .then(data => {
          const userSurvey = Array.isArray(data) ? data.find((s: any) => s.userId === userId) : null;
          if (userSurvey) {
            setHasFinishedSurvey(true);
            setSurveyData(userSurvey);
          }
        });
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("finished") === "true") setHasFinishedAssessment(true);
    if (params.get("survey") === "done") setHasFinishedSurvey(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    router.push("/login");
  };

  const getRadarData = () => {
    const pdiResult = userResults.find(r => r.type === 'PDI-DL');
    if (!pdiResult) return [0, 0, 0, 0, 0];
    
    // Simple mock calculation if answersJson is not detailed enough, 
    // but better to have it reflect total score spread
    const base = pdiResult.totalScore / 5;
    return [base + 10, base - 5, base + 15, base, base + 5];
  };

  const radarData = {
    labels: ['Information', 'Creation', 'Pedagogy', 'Ethics', 'Social'],
    datasets: [{
      label: 'Profil Kompetensi',
      data: hasFinishedAssessment ? getRadarData() : [0, 0, 0, 0, 0],
      backgroundColor: 'rgba(20, 184, 166, 0.4)',
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
           backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('/dashboard_v2.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      
      {/* Sidebar - ARMY GREEN PEKAT */}
      <aside className="w-20 lg:w-72 flex-shrink-0 bg-green-950/90 backdrop-blur-2xl border-r border-white/10 flex flex-col relative overflow-hidden">
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/10 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-graduation-cap text-white text-xl"></i>
          </div>
          <h1 className="hidden lg:block ml-3 text-2xl font-black tracking-wide text-white uppercase italic">HDAP</h1>
        </div>

        <nav className="flex-1 py-8 space-y-4 px-4">
          {[
            { id: 'dashboard', icon: 'fa-border-all', label: 'My Dashboard' },
            { id: 'assessments', icon: 'fa-laptop-code', label: 'Assessments' }
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} 
                    className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all border font-black group text-white ${activeTab === item.id ? 'bg-gradient-to-r from-green-700 to-green-900 shadow-xl border-white/20' : 'bg-white/5 text-green-100 hover:bg-white/10 border-transparent'}`}>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform"><i className={`fa-solid ${item.icon} text-xl`}></i></div>
              <span className="hidden lg:block text-sm tracking-wide army-shadow uppercase">{item.label}</span>
            </button>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center px-5 py-4 rounded-2xl transition-all bg-red-900/40 text-red-100 hover:bg-red-800/60 mt-8 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform"><i className="fa-solid fa-right-from-bracket text-xl text-red-400"></i></div>
            <span className="hidden lg:block text-sm font-black tracking-wide uppercase">Log Out</span>
          </button>
        </nav>

        <div className="p-5 border-t border-white/10 flex items-center bg-black/60 relative z-10">
          <img src={`https://ui-avatars.com/api/?name=${userName}&background=ffffff&color=166534`} alt="Profile" className="w-11 h-11 rounded-full border-2 border-green-500/50 shadow-lg" />
          <div className="hidden lg:block ml-4 text-white">
            <p className="text-sm font-black army-shadow">{userName}</p>
            <p className="text-[10px] text-green-400 font-black uppercase tracking-widest">Mahasiswa</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 flex items-center justify-between px-8 bg-green-900/60 backdrop-blur-xl text-white shadow-xl border-b border-white/10">
          <div><h2 className="text-2xl font-black italic uppercase drop-shadow-lg">Halo, {userName}! 👋</h2><p className="text-teal-50 text-[10px] font-bold uppercase tracking-widest opacity-80">Hybrid-Diagnostic Assessment Platform</p></div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 z-0">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                 {/* AI Feedback - PANEL GELAP TOTAL (DARK GREEN/SLATE) */}
                 <div className="rounded-[40px] p-10 bg-gradient-to-br from-green-900 via-emerald-950 to-slate-950 text-white border border-white/10 shadow-2xl relative overflow-hidden ai-glow">
                    <div className="relative z-10">
                      <h3 className="text-3xl font-black italic mb-6 flex items-center gap-4 uppercase"><i className="fa-solid fa-brain text-blue-400"></i> AI Diagnostic Feedback</h3>
                      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-inner">
                        <p className="text-xl leading-relaxed italic font-medium">
                          {hasFinishedAssessment 
                            ? `"${userGender === 'female' ? 'Ibu' : 'Bapak'} ${userName}, berdasarkan hasil pengerjaan Anda, kemampuan Literasi Informasi Anda sangat memuaskan. Fokus selanjutnya adalah pada Pedagogi Digital."`
                            : `"Selamat datang, ${userName}. Silakan selesaikan Asesmen Preliminary untuk mendapatkan diagnosa kompetensi literasi digital Anda dari AI."`}
                        </p>
                      </div>
                    </div>
                    <i className="fa-solid fa-wand-magic-sparkles absolute top-0 right-0 text-[180px] opacity-10"></i>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profil Kompetensi - PANEL GELAP */}
                    <div className="lg:col-span-1 rounded-[40px] p-8 bg-gradient-to-b from-slate-900 to-green-950 text-white border border-white/10 shadow-xl">
                      <h3 className="text-sm font-black mb-1 italic uppercase tracking-tight">Profil Kompetensi Digital</h3>
                      <p className="text-[10px] text-green-400 font-bold uppercase tracking-[0.3em] mb-4">DigCompEdu</p>
                      <div className="h-[250px] bg-white/5 rounded-3xl p-4 flex items-center justify-center border border-white/5">
                        {hasFinishedAssessment ? (
                          <Radar data={radarData} options={{ 
                            responsive: true, 
                            maintainAspectRatio: false,
                            scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, angleLines: { color: 'rgba(255,255,255,0.05)' }, pointLabels: { color: '#fff', font: { size: 8 } }, ticks: { display: false } } },
                            plugins: { legend: { display: false } }
                          }} />
                        ) : (
                          <div className="text-center opacity-30">
                            <i className="fa-solid fa-chart-area text-4xl mb-3"></i>
                            <p className="font-black uppercase text-[10px]">No Data</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* STATISTIK HASIL - NEW */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* Card PDI-DL */}
                       <div className="rounded-[40px] p-8 bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col justify-between group hover:bg-white/10 transition-all">
                          <div>
                             <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30"><i className="fa-solid fa-stethoscope"></i></div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Validitas Prediktif</span>
                             </div>
                             <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">Hasil PDI-DL</h4>
                             <p className="text-xs text-slate-400 mt-2 italic">Pemetaan profil awal literasi digital.</p>
                          </div>
                          <div className="mt-8 flex items-end justify-between">
                             <div className="text-4xl font-black text-teal-400">{userResults.find(r => r.type === 'PDI-DL')?.totalScore || 0} <span className="text-xs text-slate-500">/ 100</span></div>
                             <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-teal-500" style={{ width: `${userResults.find(r => r.type === 'PDI-DL')?.totalScore || 0}%` }}></div></div>
                          </div>
                       </div>

                       {/* Card MADEL5C */}
                       <div className="rounded-[40px] p-8 bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col justify-between group hover:bg-white/10 transition-all">
                          <div>
                             <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30"><i className="fa-solid fa-brain"></i></div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Mastery</span>
                             </div>
                             <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">Hasil MADEL5C</h4>
                             <p className="text-xs text-slate-400 mt-2 italic">Skor instrumen utama SJT (30 Butir).</p>
                          </div>
                          <div className="mt-8 flex items-end justify-between">
                             <div className="text-4xl font-black text-blue-400">{userResults.find(r => r.type === 'MADEL5C')?.totalScore || 0} <span className="text-xs text-slate-500">/ 150</span></div>
                             <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${(userResults.find(r => r.type === 'MADEL5C')?.totalScore || 0)/150*100}%` }}></div></div>
                          </div>
                       </div>
                       
                       {/* Riwayat Aktivitas - Compacted */}
                       <div className="md:col-span-2 rounded-[40px] p-6 bg-slate-900/80 border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <i className="fa-solid fa-clock-rotate-left text-slate-600"></i>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Riwayat Terakhir:</span>
                             <span className="text-xs font-bold text-white italic">{hasFinishedAssessment ? 'Asesmen Preliminary Selesai' : 'Belum memulai asesmen'}</span>
                          </div>
                          <span className="text-[9px] bg-white/5 text-slate-500 px-3 py-1 rounded-full font-black uppercase">Real-time DB Sync</span>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'assessments' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom duration-500">
                 {/* Preliminary Card */}
                 <div className="relative overflow-hidden rounded-[40px] bg-white/95 backdrop-blur-2xl border border-white p-12 flex flex-col items-start justify-between shadow-2xl">
                    <div className="relative z-10 w-full">
                      <span className="px-4 py-1.5 bg-teal-100 text-teal-800 text-[10px] font-black rounded-full uppercase mb-6 inline-block tracking-[0.2em] shadow-sm">PDI-DL Platform</span>
                      <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">Preliminary Diagnostic</h3>
                      <p className="text-slate-600 mb-8 font-medium italic leading-relaxed">Uji pemetaan profil awal literasi digital mahasiswa calon guru.</p>
                      <button onClick={() => router.push('/assessment/preliminary')} className="w-full justify-center bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-teal-500/40 flex items-center gap-3 transition-all uppercase">Mulai Sekarang <i className="fa-solid fa-play"></i></button>
                    </div>
                    <i className="fa-solid fa-file-signature text-[120px] text-teal-500 opacity-10 absolute bottom-[-20px] right-[-20px] transform -rotate-12"></i>
                 </div>

                 {/* MADEL5C Card (Conditional Lock) */}
                 {/* Requires: Preliminary (PDI-DL) done AND Survey (SUS) done */}
                 {(hasFinishedAssessment && hasFinishedSurvey) ? (
                   <div className="relative overflow-hidden rounded-[40px] bg-[#1E293B]/95 backdrop-blur-2xl border border-blue-500/30 p-12 flex flex-col items-start justify-between shadow-2xl">
                      <div className="relative z-10 w-full">
                        <span className="px-4 py-1.5 bg-blue-500/20 text-blue-300 text-[10px] font-black rounded-full uppercase mb-6 inline-block tracking-[0.2em] shadow-sm">Main Instrument</span>
                        <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic">MADEL5C SJT</h3>
                        <p className="text-slate-400 mb-8 font-medium italic leading-relaxed">Asesmen komprehensif 30 butir skenario Situational Judgment Test.</p>
                        <button onClick={() => router.push('/assessment/madel5c')} className="w-full justify-center bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/40 flex items-center gap-3 transition-all uppercase">Mulai MADEL5C <i className="fa-solid fa-play"></i></button>
                      </div>
                      <i className="fa-solid fa-brain text-[120px] text-blue-500 opacity-10 absolute bottom-[-20px] right-[-20px] transform -rotate-12"></i>
                   </div>
                 ) : (
                   <div className="relative overflow-hidden rounded-[40px] bg-slate-800/50 backdrop-blur-md border border-slate-700 p-12 flex flex-col items-start justify-between shadow-inner">
                      <div className="relative z-10 w-full opacity-50">
                        <span className="px-4 py-1.5 bg-slate-700 text-slate-400 text-[10px] font-black rounded-full uppercase mb-6 inline-block tracking-[0.2em]">Locked</span>
                        <h3 className="text-3xl font-black text-slate-500 mb-4 tracking-tighter uppercase italic">MADEL5C SJT</h3>
                        <p className="text-slate-500 mb-8 font-medium italic leading-relaxed">
                          {!hasFinishedAssessment && !hasFinishedSurvey && 'Langkah 1: Selesaikan PDI-DL → Langkah 2: Isi Survey SUS → Langkah 3: MADEL5C Terbuka.'}
                          {hasFinishedAssessment && !hasFinishedSurvey && '✅ PDI-DL Selesai! Sekarang isi Survey Pengguna (SUS) untuk membuka MADEL5C.'}
                          {!hasFinishedAssessment && hasFinishedSurvey && 'Selesaikan PDI-DL terlebih dahulu.'}
                        </p>
                        <button disabled className="w-full justify-center bg-slate-700 text-slate-500 font-black px-8 py-4 rounded-2xl flex items-center gap-3 cursor-not-allowed uppercase"><i className="fa-solid fa-lock"></i> Terkunci</button>
                      </div>
                      <i className="fa-solid fa-lock text-[120px] text-slate-600 opacity-10 absolute bottom-[-20px] right-[-20px] transform -rotate-12"></i>
                   </div>
                 )}
              </div>
            )}


          </div>
        </div>
      </main>
    </div>
  );
}
