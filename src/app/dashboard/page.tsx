"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard"|"assessments">("dashboard");
  const [userName, setUserName] = useState("User");
  const [userGender, setUserGender] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [userResults, setUserResults] = useState<any[]>([]);
  const [hasSurvey, setHasSurvey] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const name = localStorage.getItem("userName") || "User";
    const gender = localStorage.getItem("userGender") || "";
    const userId = localStorage.getItem("userId");
    setUserName(name);
    setUserGender(gender);

    if (!userId) {
      setApiError("Sesi tidak ditemukan. Silakan login ulang.");
      setIsLoading(false);
      return;
    }

    Promise.all([
      fetch(`/api/assessment?userId=${userId}`).then(r => r.json()),
      fetch(`/api/survey`).then(r => r.json()),
    ])
      .then(([assData, surData]) => {
        const results = Array.isArray(assData) ? assData : [];
        setUserResults(results);
        if (Array.isArray(surData) && surData.find((s: any) => s.userId === userId)) {
          setHasSurvey(true);
        }
      })
      .catch(() => setApiError("Gagal memuat data. Pastikan server berjalan."))
      .finally(() => setIsLoading(false));
  }, []);

  const pdiResult = userResults.find(r => r.type === "PDI-DL");
  const madelResult = userResults.find(r => r.type === "MADEL5C");
  const pdiScore = pdiResult?.totalScore || 0;
  const madelScore = madelResult?.totalScore || 0;
  const hasPdi = !!pdiResult;
  const hasMadel = !!madelResult;
  const madelPct = Math.round((madelScore / 150) * 100);
  const title = userGender === "female" ? "Ibu" : "Bapak";

  const armyGreen = "#4B5320";

  const radarData = {
    labels: ["Information","Creation","Pedagogy","Ethics","Social"],
    datasets: [{
      label: "Profil Kompetensi",
      data: hasPdi && pdiScore > 0
        ? [Math.min(pdiScore*0.9,100), Math.min(pdiScore*0.7,100), Math.min(pdiScore*0.85,100), Math.min(pdiScore*0.8,100), Math.min(pdiScore*0.75,100)]
        : [0,0,0,0,0],
      backgroundColor: "rgba(75, 83, 32, 0.2)", borderColor: armyGreen, borderWidth: 2, pointBackgroundColor: armyGreen,
    }],
  };

  const handleLogout = () => { localStorage.clear(); router.push("/login"); };

  if (!isMounted) return null;

  return (
    <div className="antialiased flex h-screen overflow-hidden bg-white">
      
      {/* Sidebar (Right-ish / Left Column - White with Army Green Text) */}
      <aside className="w-20 lg:w-80 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col shadow-2xl z-20">
        <div className="h-28 flex items-center justify-center lg:justify-start lg:px-10 border-b border-slate-50">
          <div className={`w-14 h-14 rounded-2xl bg-[#4B5320] flex items-center justify-center shadow-xl shadow-[#4B5320]/20`}>
            <i className="fa-solid fa-graduation-cap text-white text-3xl"></i>
          </div>
          <div className="hidden lg:block ml-5">
             <h1 className="text-2xl font-black text-[#4B5320] tracking-tighter leading-none italic">HDAP PORTAL</h1>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">E-Assessment Platform</p>
          </div>
        </div>
        
        <nav className="flex-1 py-12 space-y-3 px-6">
          <p className="hidden lg:block text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] ml-4 mb-6">Menu Utama</p>
          {[{id:"dashboard",icon:"fa-house-user",label:"Dashboard"},{id:"assessments",icon:"fa-file-lines",label:"Asesmen Saya"}].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center px-6 py-5 rounded-[25px] transition-all font-black group ${activeTab===item.id?`bg-[#4B5320] text-white shadow-2xl shadow-[#4B5320]/30`:`text-[#4B5320] hover:bg-[#4B5320]/5`}`}>
              <i className={`fa-solid ${item.icon} text-xl lg:mr-5`}></i>
              <span className="hidden lg:block text-xs uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
          
          <div className="pt-10">
             <p className="hidden lg:block text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] ml-4 mb-6">Sesi Anda</p>
             <button onClick={handleLogout} className="w-full flex items-center px-6 py-5 rounded-[25px] text-rose-600 hover:bg-rose-50 font-black transition-all group">
                <i className="fa-solid fa-power-off text-xl lg:mr-5"></i>
                <span className="hidden lg:block text-xs uppercase tracking-widest">Logout</span>
             </button>
          </div>
        </nav>

        <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex items-center">
          <img src={`https://ui-avatars.com/api/?name=${userName}&background=4B5320&color=ffffff`} alt="Profile" className="w-14 h-14 rounded-2xl shadow-xl border-2 border-white" />
          <div className="hidden lg:block ml-5 overflow-hidden">
            <p className="text-sm font-black text-[#4B5320] truncate">{userName}</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Mahasiswa UNJ</p>
          </div>
        </div>
      </aside>

      {/* Main Content (With Campus Background) */}
      <main className="flex-1 flex flex-col overflow-hidden relative"
            style={{ 
              backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url('/unj_bg.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}>
        
        {/* Header Overlay */}
        <header className="h-28 flex items-center justify-between px-12 bg-white/40 backdrop-blur-xl border-b border-white/20 relative z-10">
          <div className="drop-shadow-[0_2px_10px_rgba(255,255,255,1)]">
            <h2 className="text-3xl font-black text-[#4B5320] italic uppercase tracking-tighter">Selamat Datang, {title} {userName}</h2>
            <p className="text-[#4B5320]/80 text-xs font-bold uppercase tracking-widest mt-1">Platform Analisis Psikometri Literasi Digital</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="bg-[#4B5320] text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                <span className="text-[10px] font-black uppercase tracking-widest">System Sync: Online</span>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-14 relative z-10">
          {apiError && <div className="mb-10 bg-rose-500 text-white rounded-3xl p-8 text-sm font-black shadow-2xl flex items-center gap-6 animate-bounce"><i className="fa-solid fa-triangle-exclamation text-3xl"></i> {apiError}</div>}
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-[#4B5320]">
              <i className="fa-solid fa-spinner fa-spin text-7xl mb-8"></i>
              <p className="font-black uppercase tracking-[0.5em] text-sm">Menyinkronkan Data Riset...</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-12 pb-20">
              {activeTab === "dashboard" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Info Card with White Glow */}
                  <div className="lg:col-span-8 space-y-10">
                     <div className="bg-white/80 backdrop-blur-2xl rounded-[60px] p-12 border border-white/50 shadow-2xl shadow-[#4B5320]/10 relative overflow-hidden group">
                        <div className="relative z-10">
                           <span className="px-6 py-2 bg-[#4B5320] text-white text-[10px] font-black rounded-full uppercase tracking-widest mb-10 inline-block shadow-lg">Diagnosa Kompetensi (AI)</span>
                           <div className="bg-white/60 rounded-[40px] p-10 border border-white italic font-bold text-[#4B5320] text-2xl lg:text-3xl leading-relaxed shadow-inner drop-shadow-[0_5px_15px_rgba(255,255,255,1)]">
                              {hasMadel 
                                ? `"${title} ${userName}, Skor Akhir Anda: ${madelScore}/150. Analisis IRT menunjukkan tingkat penguasaan digital yang solid. Data ini menjadi kontribusi berharga bagi riset disertasi kami."`
                                : `"Selamat datang di Portal Riset HDAP. Mohon selesaikan kedua instrumen untuk melihat profil kompetensi digital Bapak/Ibu."`
                              }
                           </div>
                        </div>
                        <i className="fa-solid fa-university absolute top-[-50px] right-[-50px] text-[300px] text-[#4B5320] opacity-[0.03] group-hover:rotate-6 transition-transform duration-1000"></i>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[50px] border border-white shadow-2xl">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Progres PDI-DL</p>
                           <div className="flex items-end justify-between mb-6">
                              <span className="text-5xl font-black text-[#4B5320] drop-shadow-[0_2px_4px_rgba(255,255,255,1)]">{hasPdi ? pdiScore : '0'}<span className="text-sm text-slate-300 ml-2">/100</span></span>
                              <span className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase shadow-sm ${hasPdi?`bg-[#4B5320] text-white`:`bg-slate-100 text-slate-400`}`}>{hasPdi?'Valid':'Tertunda'}</span>
                           </div>
                           <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                              <div className="h-full bg-[#4B5320] rounded-full transition-all duration-1000 shadow-lg" style={{width:`${hasPdi?pdiScore:0}%`}}></div>
                           </div>
                        </div>
                        <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[50px] border border-white shadow-2xl">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Progres MADEL5C</p>
                           <div className="flex items-end justify-between mb-6">
                              <span className="text-5xl font-black text-[#4B5320] drop-shadow-[0_2px_4px_rgba(255,255,255,1)]">{hasMadel ? madelScore : '0'}<span className="text-sm text-slate-300 ml-2">/150</span></span>
                              <span className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase shadow-sm ${hasMadel?`bg-blue-600 text-white`:`bg-slate-100 text-slate-400`}`}>{hasMadel?'Valid':'Tertunda'}</span>
                           </div>
                           <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                              <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-lg" style={{width:`${hasMadel?madelPct:0}%`}}></div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Profile Chart Card */}
                  <div className="lg:col-span-4 bg-white/90 backdrop-blur-xl rounded-[60px] p-10 border border-white shadow-2xl flex flex-col">
                     <div className="mb-10 text-center">
                        <h3 className="text-lg font-black text-[#4B5320] uppercase tracking-tighter italic">Mapping Kompetensi</h3>
                        <div className="w-12 h-1 bg-[#4B5320] mx-auto mt-2"></div>
                     </div>
                     <div className="flex-1 flex items-center justify-center">
                        {hasPdi 
                          ? <Radar data={radarData} options={{ scales: { r: { grid: { color: 'rgba(75, 83, 32, 0.1)' }, angleLines: { color: 'rgba(75, 83, 32, 0.1)' }, pointLabels: { color: '#4B5320', font: { weight: 'black', size: 11, family: 'Plus Jakarta Sans' } }, ticks: { display: false } } }, plugins: { legend: { display: false } } }} />
                          : <div className="text-center p-12 bg-slate-50/50 rounded-[40px] border-4 border-dashed border-slate-100">
                              <i className="fa-solid fa-lock text-6xl text-slate-200 mb-6"></i>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">Selesaikan Asesmen<br/>Untuk Membuka Grafik</p>
                            </div>
                        }
                     </div>
                  </div>
                </div>
              )}

              {activeTab === "assessments" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* PDI-DL Card */}
                  <div className="bg-white/95 backdrop-blur-2xl rounded-[60px] p-14 border-4 border-white shadow-2xl relative overflow-hidden group transition-all hover:translate-y-[-10px]">
                     <div className="relative z-10">
                        <div className="flex justify-between items-start mb-10">
                           <span className="px-6 py-2 bg-teal-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest italic shadow-lg">Tahap 01</span>
                           <i className="fa-solid fa-fingerprint text-4xl text-teal-600 opacity-20"></i>
                        </div>
                        <h3 className="text-4xl font-black text-[#4B5320] uppercase tracking-tighter mb-6 italic leading-none drop-shadow-[0_2px_4px_rgba(255,255,255,1)]">PDI-DL Diagnostic</h3>
                        <p className="text-slate-600 mb-12 leading-relaxed font-bold text-lg opacity-80">Pemetaan awal profil literasi digital menggunakan 10 butir instrumen diagnostik.</p>
                        {hasPdi 
                          ? <div className="w-full py-6 bg-emerald-50 border-2 border-emerald-100 rounded-[30px] text-center text-emerald-700 font-black text-xs uppercase tracking-widest shadow-inner">✓ Status: SELESAI</div>
                          : <button onClick={() => router.push("/assessment/preliminary")} className="w-full py-6 bg-[#4B5320] hover:bg-[#354B37] text-white rounded-[30px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-[#4B5320]/40 transition-all flex items-center justify-center gap-4">Buka Instrumen <i className="fa-solid fa-arrow-right"></i></button>
                        }
                     </div>
                  </div>

                  {/* MADEL5C Card */}
                  <div className={`bg-white/95 backdrop-blur-2xl rounded-[60px] p-14 border-4 shadow-2xl relative overflow-hidden group transition-all hover:translate-y-[-10px] ${(hasPdi && hasSurvey) ? 'border-white' : 'border-slate-100 opacity-60'}`}>
                     <div className="relative z-10">
                        <div className="flex justify-between items-start mb-10">
                           <span className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest italic shadow-lg">Tahap 03</span>
                           <i className="fa-solid fa-brain text-4xl text-indigo-600 opacity-20"></i>
                        </div>
                        <h3 className="text-4xl font-black text-[#4B5320] uppercase tracking-tighter mb-6 italic leading-none drop-shadow-[0_2px_4px_rgba(255,255,255,1)]">MADEL5C SJT</h3>
                        <p className="text-slate-600 mb-12 leading-relaxed font-bold text-lg opacity-80">Instrumen utama berbasis skenario (SJT) untuk memetakan aksi digital strategis.</p>
                        {hasMadel 
                          ? <div className="w-full py-6 bg-blue-50 border-2 border-blue-100 rounded-[30px] text-center text-blue-700 font-black text-xs uppercase tracking-widest shadow-inner">✓ Status: SELESAI</div>
                          : (hasPdi && hasSurvey) 
                            ? <button onClick={() => router.push("/assessment/madel5c")} className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[30px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/40 transition-all flex items-center justify-center gap-4">Mulai SJT <i className="fa-solid fa-play"></i></button>
                            : <div className="w-full py-6 bg-slate-100 border-2 border-slate-200 rounded-[30px] text-center text-slate-400 font-black text-xs uppercase tracking-widest italic flex items-center justify-center gap-4"><i className="fa-solid fa-lock"></i> Selesaikan Survey</div>
                        }
                     </div>
                  </div>

                  {/* Survey Banner */}
                  <div className="lg:col-span-2 bg-[#4B5320] rounded-[50px] p-12 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl border-4 border-[#354B37]/20 relative overflow-hidden">
                     <div className="flex items-center gap-10 relative z-10">
                        <div className="w-24 h-24 bg-white/10 rounded-[35px] flex items-center justify-center text-4xl text-white border border-white/20 shadow-2xl backdrop-blur-md"><i className="fa-solid fa-square-poll-vertical"></i></div>
                        <div>
                           <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">Tahap 02: Survey Usabilitas</h3>
                           <p className="text-white/60 font-bold text-lg italic">Evaluasi Platform menggunakan Skala SUS.</p>
                        </div>
                     </div>
                     {hasSurvey 
                       ? <div className="px-12 py-6 bg-white/10 border-2 border-white/20 text-white font-black rounded-[30px] text-xs uppercase tracking-widest backdrop-blur-xl">Telah Disubmit</div>
                       : <button onClick={() => router.push("/survey")} className="px-12 py-6 bg-white text-[#4B5320] font-black rounded-[30px] text-xs uppercase tracking-[0.3em] transition-all shadow-2xl hover:scale-105">Isi Survey Sekarang <i className="fa-solid fa-arrow-right-long ml-4"></i></button>
                     }
                     <i className="fa-solid fa-comments absolute right-[-40px] bottom-[-40px] text-[200px] text-white opacity-[0.03] rotate-12"></i>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
