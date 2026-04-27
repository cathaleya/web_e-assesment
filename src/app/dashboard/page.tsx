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

  const radarData = {
    labels: ["Information","Creation","Pedagogy","Ethics","Social"],
    datasets: [{
      label: "Profil Kompetensi",
      data: hasPdi && pdiScore > 0
        ? [Math.min(pdiScore*0.9,100), Math.min(pdiScore*0.7,100), Math.min(pdiScore*0.85,100), Math.min(pdiScore*0.8,100), Math.min(pdiScore*0.75,100)]
        : [0,0,0,0,0],
      backgroundColor: "rgba(37, 99, 235, 0.2)", borderColor: "rgba(37, 99, 235, 1)", borderWidth: 2, pointBackgroundColor: "#2563eb",
    }],
  };

  const handleLogout = () => { localStorage.clear(); router.push("/login"); };

  if (!isMounted) return null;

  return (
    <div className="antialiased flex h-screen overflow-hidden bg-[#F1F5F9]">
      
      {/* Sidebar (Light Professional) */}
      <aside className="w-20 lg:w-72 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <i className="fa-solid fa-graduation-cap text-white text-2xl"></i>
          </div>
          <h1 className="hidden lg:block ml-4 text-2xl font-black text-slate-900 uppercase tracking-tighter italic">HDAP Portal</h1>
        </div>
        <nav className="flex-1 py-10 space-y-4 px-6">
          {[{id:"dashboard",icon:"fa-house-user",label:"Dashboard"},{id:"assessments",icon:"fa-file-lines",label:"Asesmen Saya"}].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all border font-bold group ${activeTab===item.id?"bg-blue-600 text-white shadow-xl shadow-blue-600/20 border-blue-500":"bg-white border-transparent text-slate-500 hover:bg-slate-50"}`}>
              <i className={`fa-solid ${item.icon} text-lg lg:mr-4`}></i>
              <span className="hidden lg:block text-xs uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center px-5 py-4 rounded-2xl bg-slate-50 text-rose-600 hover:bg-rose-50 mt-10 font-bold transition-all border border-transparent hover:border-rose-100">
            <i className="fa-solid fa-power-off text-lg lg:mr-4"></i>
            <span className="hidden lg:block text-xs uppercase tracking-widest">Keluar</span>
          </button>
        </nav>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center">
          <img src={`https://ui-avatars.com/api/?name=${userName}&background=2563eb&color=ffffff`} alt="Profile" className="w-12 h-12 rounded-2xl shadow-md" />
          <div className="hidden lg:block ml-4 overflow-hidden">
            <p className="text-sm font-black text-slate-900 truncate">{userName}</p>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Responden</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 flex items-center justify-between px-10 bg-white border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-black text-slate-900 italic uppercase">Selamat Datang, {title} {userName}</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Status: {hasMadel ? 'Lengkap' : 'Pengerjaan Berlangsung'}</p>
          </div>
          <div className="flex gap-3">
             <div className="hidden md:flex flex-col items-end">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Server Sync</p>
                <p className="text-xs font-bold text-emerald-600 uppercase">● Online</p>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          {apiError && <div className="mb-8 bg-rose-50 border border-rose-100 rounded-2xl p-6 text-rose-600 text-sm font-bold flex items-center gap-4"><i className="fa-solid fa-circle-exclamation text-xl"></i> {apiError}</div>}
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <i className="fa-solid fa-circle-notch fa-spin text-5xl mb-6 text-blue-600"></i>
              <p className="font-black uppercase tracking-[0.3em] text-xs">Menyinkronkan Data...</p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
              {activeTab === "dashboard" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* Info Card */}
                  <div className="lg:col-span-2 space-y-8">
                     <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-xl shadow-slate-900/5 relative overflow-hidden">
                        <div className="relative z-10">
                           <span className="px-5 py-2 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest mb-6 inline-block">AI Diagnostic Feedback</span>
                           <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 italic font-medium text-slate-700 text-lg leading-relaxed shadow-inner">
                              {hasMadel 
                                ? `"${title} ${userName}, skor MADEL5C Anda adalah ${madelScore}/150 (${madelPct}%). Berdasarkan analisis IRT, kompetensi Anda berada di level ${madelPct >= 80 ? 'PAKAR' : madelPct >= 60 ? 'LANJUT' : 'DASAR'}. Teruslah berkembang!"`
                                : `"Halo ${userName}, silakan selesaikan seluruh instrumen untuk melihat hasil diagnosa kompetensi literasi digital Anda secara lengkap."`
                              }
                           </div>
                        </div>
                        <i className="fa-solid fa-robot absolute top-[-20px] right-[-20px] text-[150px] text-blue-600 opacity-[0.03]"></i>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-lg">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">PDI-DL Progress</p>
                           <div className="flex items-end justify-between mb-4">
                              <span className="text-4xl font-black text-slate-900">{hasPdi ? pdiScore : '0'}<span className="text-sm text-slate-400">/100</span></span>
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${hasPdi?'bg-emerald-50 text-emerald-600':'bg-slate-50 text-slate-400'}`}>{hasPdi?'✓ Selesai':'Tertunda'}</span>
                           </div>
                           <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-teal-500 transition-all duration-1000" style={{width:`${hasPdi?pdiScore:0}%`}}></div>
                           </div>
                        </div>
                        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-lg">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">MADEL5C Progress</p>
                           <div className="flex items-end justify-between mb-4">
                              <span className="text-4xl font-black text-slate-900">{hasMadel ? madelScore : '0'}<span className="text-sm text-slate-400">/150</span></span>
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${hasMadel?'bg-blue-50 text-blue-600':'bg-slate-50 text-slate-400'}`}>{hasMadel?'✓ Selesai':'Tertunda'}</span>
                           </div>
                           <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 transition-all duration-1000" style={{width:`${hasMadel?madelPct:0}%`}}></div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Profile Chart */}
                  <div className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-xl shadow-slate-900/5">
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2 italic">Profil Kompetensi</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-8">DigCompEdu Framework Mapping</p>
                     <div className="h-[300px] flex items-center justify-center">
                        {hasPdi 
                          ? <Radar data={radarData} options={{ scales: { r: { grid: { color: 'rgba(0,0,0,0.05)' }, angleLines: { color: 'rgba(0,0,0,0.05)' }, pointLabels: { color: '#64748b', font: { weight: 'bold', size: 10 } }, ticks: { display: false } } }, plugins: { legend: { display: false } } }} />
                          : <div className="text-center p-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200"><i className="fa-solid fa-chart-pie text-4xl text-slate-200 mb-4 block"></i><p className="text-[10px] font-black text-slate-400 uppercase">Selesaikan PDI-DL</p></div>
                        }
                     </div>
                  </div>
                </div>
              )}

              {activeTab === "assessments" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* PDI-DL Card */}
                  <div className="bg-white rounded-[50px] p-12 border border-slate-200 shadow-2xl relative overflow-hidden group">
                     <div className="relative z-10">
                        <span className="px-5 py-2 bg-teal-50 text-teal-700 text-[10px] font-black rounded-full uppercase tracking-widest mb-8 inline-block italic">Tahap 1: Preliminary</span>
                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4 italic">PDI-DL Diagnostic</h3>
                        <p className="text-slate-500 mb-10 leading-relaxed font-medium">Pemetaan profil literasi digital awal mahasiswa calon guru melalui instrumen diagnostik 10 butir.</p>
                        {hasPdi 
                          ? <div className="w-full py-5 bg-teal-50 border border-teal-100 rounded-3xl text-center text-teal-700 font-black text-xs uppercase tracking-widest shadow-inner">✓ Selesai Terkirim</div>
                          : <button onClick={() => router.push("/assessment/preliminary")} className="w-full py-5 bg-teal-600 hover:bg-teal-700 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-teal-600/30 transition-all flex items-center justify-center gap-3">Mulai Asesmen <i className="fa-solid fa-play"></i></button>
                        }
                     </div>
                     <i className="fa-solid fa-fingerprint absolute bottom-[-30px] right-[-30px] text-[200px] text-teal-600 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000"></i>
                  </div>

                  {/* MADEL5C Card */}
                  <div className={`bg-white rounded-[50px] p-12 border shadow-2xl relative overflow-hidden group transition-all ${(hasPdi && hasSurvey) ? 'border-blue-200' : 'border-slate-100 opacity-60'}`}>
                     <div className="relative z-10">
                        <span className="px-5 py-2 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-widest mb-8 inline-block italic">Tahap 3: Instrumen Utama</span>
                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4 italic">MADEL5C SJT</h3>
                        <p className="text-slate-500 mb-10 leading-relaxed font-medium">Pengukuran kesiapan aksi digital komprehensif menggunakan 30 skenario Situational Judgment Test.</p>
                        {hasMadel 
                          ? <div className="w-full py-5 bg-blue-50 border border-blue-100 rounded-3xl text-center text-blue-700 font-black text-xs uppercase tracking-widest shadow-inner">✓ Selesai Terkirim</div>
                          : (hasPdi && hasSurvey) 
                            ? <button onClick={() => router.push("/assessment/madel5c")} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3">Mulai MADEL5C <i className="fa-solid fa-play"></i></button>
                            : <div className="w-full py-5 bg-slate-100 border border-slate-200 rounded-3xl text-center text-slate-400 font-black text-xs uppercase tracking-widest italic flex items-center justify-center gap-3"><i className="fa-solid fa-lock"></i> Selesaikan Survey Dahulu</div>
                        }
                     </div>
                     <i className="fa-solid fa-brain absolute bottom-[-30px] right-[-30px] text-[200px] text-blue-600 opacity-[0.03] group-hover:-rotate-12 transition-transform duration-1000"></i>
                  </div>

                  {/* Survey Card */}
                  <div className="md:col-span-2 bg-slate-900 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                     <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-3xl text-white border border-white/10"><i className="fa-solid fa-square-poll-vertical"></i></div>
                        <div>
                           <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Tahap 2: Survey Usabilitas (SUS)</h3>
                           <p className="text-slate-400 font-medium italic">Wajib diisi sebelum melanjutkan ke instrumen MADEL5C.</p>
                        </div>
                     </div>
                     {hasSurvey 
                       ? <div className="px-10 py-5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-black rounded-3xl text-xs uppercase tracking-widest">Selesai</div>
                       : <button onClick={() => router.push("/survey")} className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-3xl text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/30">Isi Survey <i className="fa-solid fa-arrow-right-long ml-3"></i></button>
                     }
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
