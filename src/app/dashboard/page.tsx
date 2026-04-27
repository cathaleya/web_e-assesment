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

    const params = new URLSearchParams(window.location.search);
    if (params.get("survey") === "done") setHasSurvey(true);

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

  const getAIFeedback = () => {
    if (hasMadel && madelScore > 0) {
      if (madelPct >= 80) return `"${title} ${userName}, skor MADEL5C Anda ${madelScore}/150 (${madelPct}%) — Level PAKAR. Kemampuan literasi digital dan etika Anda sangat memuaskan. Teruskan!"`;
      if (madelPct >= 60) return `"${title} ${userName}, skor MADEL5C ${madelScore}/150 (${madelPct}%) — Level LANJUT. Tingkatkan kolaborasi dan pedagogi digital untuk mencapai level Pakar."`;
      return `"${title} ${userName}, skor MADEL5C ${madelScore}/150 (${madelPct}%) — Level DASAR. Perbanyak latihan literasi data dan keamanan informasi digital."`;
    }
    if (hasPdi && pdiScore > 0) return `"${title} ${userName}, PDI-DL selesai (${pdiScore}/100). Isi Survei SUS lalu kerjakan MADEL5C untuk diagnosa lengkap."`;
    return `"Selamat datang, ${userName}. Selesaikan Asesmen PDI-DL untuk memulai diagnosa kompetensi literasi digital Anda."`;
  };

  const radarData = {
    labels: ["Information","Creation","Pedagogy","Ethics","Social"],
    datasets: [{
      label: "Profil Kompetensi",
      data: hasPdi && pdiScore > 0
        ? [Math.min(pdiScore*0.9,100), Math.min(pdiScore*0.7,100), Math.min(pdiScore*0.85,100), Math.min(pdiScore*0.8,100), Math.min(pdiScore*0.75,100)]
        : [0,0,0,0,0],
      backgroundColor: "rgba(20,184,166,0.3)", borderColor: "rgba(20,184,166,1)", borderWidth: 2, pointBackgroundColor: "#fff",
    }],
  };

  const handleLogout = () => { localStorage.clear(); router.push("/login"); };

  if (!isMounted) return null;

  return (
    <div className="antialiased flex h-screen overflow-hidden" style={{ backgroundImage:"linear-gradient(rgba(0,0,0,0.65),rgba(0,0,0,0.75)),url('/dashboard_v2.png')", backgroundSize:"cover", backgroundPosition:"center", backgroundAttachment:"fixed" }}>
      
      {/* Sidebar */}
      <aside className="w-20 lg:w-72 flex-shrink-0 bg-green-950/90 backdrop-blur-2xl border-r border-white/10 flex flex-col">
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-graduation-cap text-white text-xl"></i>
          </div>
          <h1 className="hidden lg:block ml-3 text-2xl font-black text-white uppercase italic">HDAP</h1>
        </div>
        <nav className="flex-1 py-8 space-y-4 px-4">
          {[{id:"dashboard",icon:"fa-border-all",label:"My Dashboard"},{id:"assessments",icon:"fa-laptop-code",label:"Assessments"}].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all border font-black group text-white ${activeTab===item.id?"bg-gradient-to-r from-green-700 to-green-900 shadow-xl border-white/20":"bg-white/5 hover:bg-white/10 border-transparent"}`}>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform"><i className={`fa-solid ${item.icon} text-xl`}></i></div>
              <span className="hidden lg:block text-sm uppercase">{item.label}</span>
            </button>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center px-5 py-4 rounded-2xl bg-red-900/40 text-red-100 hover:bg-red-800/60 mt-8 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mr-4"><i className="fa-solid fa-right-from-bracket text-red-400"></i></div>
            <span className="hidden lg:block text-sm font-black uppercase">Log Out</span>
          </button>
        </nav>
        <div className="p-5 border-t border-white/10 flex items-center bg-black/60">
          <img src={`https://ui-avatars.com/api/?name=${userName}&background=ffffff&color=166534`} alt="Profile" className="w-11 h-11 rounded-full border-2 border-green-500/50" />
          <div className="hidden lg:block ml-4 text-white">
            <p className="text-sm font-black">{userName}</p>
            <p className="text-[10px] text-green-400 font-black uppercase tracking-widest">Mahasiswa</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 flex items-center justify-between px-8 bg-green-900/60 backdrop-blur-xl text-white shadow-xl border-b border-white/10">
          <div>
            <h2 className="text-2xl font-black italic uppercase">Halo, {userName}! 👋</h2>
            <p className="text-teal-50 text-[10px] font-bold uppercase tracking-widest opacity-80">Hybrid-Diagnostic Assessment Platform</p>
          </div>
          <div className="flex items-center gap-2">
            {hasPdi && <span className="px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[10px] font-black uppercase">PDI-DL ✓</span>}
            {hasSurvey && <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[10px] font-black uppercase">SUS ✓</span>}
            {hasMadel && <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-black uppercase">MADEL5C ✓</span>}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Error Banner */}
          {apiError && (
            <div className="mb-6 bg-red-500/20 border border-red-500/40 rounded-2xl p-4 flex items-center gap-3 text-red-300 text-sm font-bold">
              <i className="fa-solid fa-triangle-exclamation"></i> {apiError}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-slate-400">
                <i className="fa-solid fa-circle-notch fa-spin text-4xl mb-4 text-teal-400"></i>
                <p className="font-bold uppercase text-sm tracking-widest">Memuat data dari server...</p>
              </div>
            </div>
          )}

          {!isLoading && (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

              {activeTab === "dashboard" && (
                <div className="space-y-8">
                  {/* AI Feedback */}
                  <div className="rounded-[40px] p-10 bg-gradient-to-br from-green-900 via-emerald-950 to-slate-950 text-white border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-2xl font-black italic mb-6 flex items-center gap-4 uppercase"><i className="fa-solid fa-brain text-blue-400"></i> AI Diagnostic Feedback</h3>
                      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 mb-6">
                        <p className="text-lg leading-relaxed italic font-medium">{getAIFeedback()}</p>
                      </div>
                      {(hasPdi || hasMadel) && (
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                            <p className="text-[10px] text-teal-400 font-black uppercase mb-1">PDI-DL Score</p>
                            <p className="text-3xl font-black">{hasPdi ? pdiScore : "—"}<span className="text-sm text-slate-400">{hasPdi ? "/100" : ""}</span></p>
                          </div>
                          <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                            <p className="text-[10px] text-blue-400 font-black uppercase mb-1">MADEL5C Score</p>
                            <p className="text-3xl font-black">{hasMadel ? madelScore : "—"}<span className="text-sm text-slate-400">{hasMadel ? "/150" : ""}</span></p>
                          </div>
                          <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                            <p className="text-[10px] text-purple-400 font-black uppercase mb-1">Level</p>
                            <p className="text-2xl font-black">{hasMadel ? (madelPct>=80?"PAKAR":madelPct>=60?"LANJUT":"DASAR") : "—"}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <i className="fa-solid fa-wand-magic-sparkles absolute top-0 right-0 text-[180px] opacity-10"></i>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Radar */}
                    <div className="lg:col-span-1 rounded-[40px] p-8 bg-gradient-to-b from-slate-900 to-green-950 text-white border border-white/10 shadow-xl">
                      <h3 className="text-sm font-black italic uppercase">Profil Kompetensi Digital</h3>
                      <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mb-4">DigCompEdu Framework</p>
                      <div className="h-[250px] bg-white/5 rounded-3xl p-4 flex items-center justify-center border border-white/5">
                        {hasPdi
                          ? <Radar data={radarData} options={{ responsive:true, maintainAspectRatio:false, scales:{ r:{ grid:{color:"rgba(255,255,255,0.05)"}, angleLines:{color:"rgba(255,255,255,0.05)"}, pointLabels:{color:"#fff",font:{size:8}}, ticks:{display:false} } }, plugins:{legend:{display:false}} }} />
                          : <div className="text-center opacity-30 flex flex-col items-center gap-2"><i className="fa-solid fa-chart-radar text-5xl"></i><p className="font-black text-xs uppercase">Selesaikan PDI-DL</p></div>
                        }
                      </div>
                    </div>

                    {/* Score Cards */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* PDI-DL */}
                      <div className={`rounded-[40px] p-8 border flex flex-col justify-between transition-all ${hasPdi?"bg-teal-900/20 border-teal-500/30":"bg-white/5 border-white/10"}`}>
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30"><i className="fa-solid fa-stethoscope"></i></div>
                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${hasPdi?"bg-teal-500/20 text-teal-400":"bg-slate-700 text-slate-500"}`}>{hasPdi?"✓ Selesai":"Belum dikerjakan"}</span>
                          </div>
                          <h4 className="text-lg font-black text-white italic uppercase">Hasil PDI-DL</h4>
                          <p className="text-xs text-slate-400 mt-1 italic">Pemetaan profil awal literasi digital.</p>
                        </div>
                        <div className="mt-6">
                          <div className="text-4xl font-black text-teal-400 mb-2">{hasPdi ? pdiScore : "0"} <span className="text-xs text-slate-500">/ 100</span></div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-teal-500 transition-all duration-700" style={{width:`${hasPdi?pdiScore:0}%`}}></div></div>
                        </div>
                      </div>

                      {/* MADEL5C */}
                      <div className={`rounded-[40px] p-8 border flex flex-col justify-between transition-all ${hasMadel?"bg-blue-900/20 border-blue-500/30":"bg-white/5 border-white/10"}`}>
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30"><i className="fa-solid fa-brain"></i></div>
                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${hasMadel?"bg-blue-500/20 text-blue-400":"bg-slate-700 text-slate-500"}`}>{hasMadel?"✓ Selesai":"Belum dikerjakan"}</span>
                          </div>
                          <h4 className="text-lg font-black text-white italic uppercase">Hasil MADEL5C</h4>
                          <p className="text-xs text-slate-400 mt-1 italic">Instrumen utama SJT (30 Butir).</p>
                        </div>
                        <div className="mt-6">
                          <div className="text-4xl font-black text-blue-400 mb-2">{hasMadel ? madelScore : "0"} <span className="text-xs text-slate-500">/ 150</span></div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 transition-all duration-700" style={{width:`${hasMadel?madelPct:0}%`}}></div></div>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="md:col-span-2 rounded-[30px] p-6 bg-slate-900/80 border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-wrap">
                          <i className="fa-solid fa-clock-rotate-left text-slate-500"></i>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status:</span>
                          <span className="text-sm font-bold text-white italic">
                            {hasMadel?"🎉 Semua asesmen selesai!":hasSurvey?"Siap mengerjakan MADEL5C":hasPdi?"PDI-DL ✓ → Isi Survei SUS terlebih dahulu":"Mulai dari Asesmen PDI-DL"}
                          </span>
                        </div>
                        <span className="text-[9px] bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-black uppercase border border-green-500/20 flex-shrink-0">● Live DB Sync</span>
                      </div>
                    </div>
                  </div>

                  {/* Riwayat Aktivitas */}
                  {userResults.length > 0 && (
                    <div className="rounded-[30px] p-8 bg-slate-900/60 border border-white/5 shadow-xl">
                      <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3"><i className="fa-solid fa-list-check text-teal-400"></i> Riwayat Aktivitas Pengerjaan</h3>
                      <div className="space-y-3">
                        {userResults.map((r, i) => (
                          <div key={i} className="flex items-center justify-between bg-white/5 rounded-2xl px-6 py-4 border border-white/5">
                            <div className="flex items-center gap-4">
                              <div className={`w-3 h-3 rounded-full ${r.type==="PDI-DL"?"bg-teal-400":"bg-blue-400"}`}></div>
                              <span className="font-bold text-white text-sm">{r.type === "PDI-DL" ? "Preliminary Diagnostic (PDI-DL)" : "MADEL5C SJT Instrument"}</span>
                            </div>
                            <div className="flex items-center gap-6">
                              <span className={`text-2xl font-black ${r.type==="PDI-DL"?"text-teal-400":"text-blue-400"}`}>{r.totalScore} <span className="text-xs text-slate-500">/{r.type==="PDI-DL"?100:150}</span></span>
                              <span className="text-[10px] text-slate-500">{new Date(r.createdAt).toLocaleString("id-ID")}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "assessments" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom duration-500">
                  {/* PDI-DL */}
                  <div className="relative overflow-hidden rounded-[40px] bg-white/95 border border-white p-12 shadow-2xl">
                    <div className="relative z-10 w-full">
                      <span className="px-4 py-1.5 bg-teal-100 text-teal-800 text-[10px] font-black rounded-full uppercase mb-6 inline-block">PDI-DL Platform</span>
                      <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase italic">Preliminary Diagnostic</h3>
                      <p className="text-slate-600 mb-8 italic">Uji pemetaan profil awal literasi digital mahasiswa calon guru.</p>
                      {hasPdi
                        ? <div className="w-full text-center bg-teal-50 border border-teal-200 rounded-2xl py-4 px-6"><p className="text-teal-700 font-black text-xs uppercase">✓ Selesai — Skor: {pdiScore}/100</p></div>
                        : <button onClick={() => router.push("/assessment/preliminary")} className="w-full justify-center bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-black px-8 py-4 rounded-2xl shadow-xl flex items-center gap-3 uppercase transition-all">Mulai Sekarang <i className="fa-solid fa-play"></i></button>
                      }
                    </div>
                    <i className="fa-solid fa-file-signature text-[120px] text-teal-500 opacity-10 absolute bottom-[-20px] right-[-20px] -rotate-12"></i>
                  </div>

                  {/* MADEL5C */}
                  {(hasPdi && hasSurvey) ? (
                    <div className="relative overflow-hidden rounded-[40px] bg-[#1E293B]/95 border border-blue-500/30 p-12 shadow-2xl">
                      <div className="relative z-10 w-full">
                        <span className="px-4 py-1.5 bg-blue-500/20 text-blue-300 text-[10px] font-black rounded-full uppercase mb-6 inline-block">Main Instrument</span>
                        <h3 className="text-3xl font-black text-white mb-4 uppercase italic">MADEL5C SJT</h3>
                        <p className="text-slate-400 mb-8 italic">Asesmen komprehensif 30 butir Situational Judgment Test.</p>
                        {hasMadel
                          ? <div className="w-full text-center bg-blue-900/30 border border-blue-500/30 rounded-2xl py-4"><p className="text-blue-300 font-black text-xs uppercase">✓ Selesai — Skor: {madelScore}/150 ({madelPct}%)</p></div>
                          : <button onClick={() => router.push("/assessment/madel5c")} className="w-full justify-center bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 text-white font-black px-8 py-4 rounded-2xl shadow-xl flex items-center gap-3 uppercase transition-all">Mulai MADEL5C <i className="fa-solid fa-play"></i></button>
                        }
                      </div>
                      <i className="fa-solid fa-brain text-[120px] text-blue-500 opacity-10 absolute bottom-[-20px] right-[-20px] -rotate-12"></i>
                    </div>
                  ) : (
                    <div className="relative overflow-hidden rounded-[40px] bg-slate-800/50 border border-slate-700 p-12 shadow-inner">
                      <div className="relative z-10 w-full opacity-50">
                        <span className="px-4 py-1.5 bg-slate-700 text-slate-400 text-[10px] font-black rounded-full uppercase mb-6 inline-block">Terkunci</span>
                        <h3 className="text-3xl font-black text-slate-500 mb-4 uppercase italic">MADEL5C SJT</h3>
                        <p className="text-slate-500 mb-8 italic">
                          {!hasPdi && "Langkah 1: Kerjakan PDI-DL → Langkah 2: Isi Survei SUS → Langkah 3: MADEL5C terbuka."}
                          {hasPdi && !hasSurvey && "✅ PDI-DL Selesai! Isi Survei SUS (di bawah) untuk membuka MADEL5C."}
                        </p>
                        <button disabled className="w-full justify-center bg-slate-700 text-slate-500 font-black px-8 py-4 rounded-2xl flex items-center gap-3 cursor-not-allowed uppercase"><i className="fa-solid fa-lock"></i> Terkunci</button>
                      </div>
                      <i className="fa-solid fa-lock text-[120px] text-slate-600 opacity-10 absolute bottom-[-20px] right-[-20px] -rotate-12"></i>
                    </div>
                  )}

                  {/* Survey Card */}
                  <div className="md:col-span-2 rounded-[40px] bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 p-10 shadow-xl flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl border border-purple-500/30"><i className="fa-solid fa-square-poll-vertical"></i></div>
                      <div>
                        <h3 className="text-xl font-black text-white uppercase italic">Survei Pengguna (SUS)</h3>
                        <p className="text-slate-400 text-sm mt-1">Evaluasi usabilitas platform — 10 Butir</p>
                      </div>
                    </div>
                    {hasSurvey
                      ? <span className="px-6 py-3 bg-purple-500/20 border border-purple-500/30 text-purple-300 font-black rounded-2xl text-xs uppercase tracking-widest">✓ Survei Selesai</span>
                      : <button onClick={() => router.push("/survey")} className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all shadow-lg">Isi Survei <i className="fa-solid fa-arrow-right ml-1"></i></button>
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
