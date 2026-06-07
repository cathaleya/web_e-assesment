"use client";

import { useState } from "react";
import { Radar, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

interface AssessmentOverviewProps {
  userName: string;
  userCampus: string;
  sessionDate?: string;
  madelScore?: number;
  preliminaryScore?: number;
  surveyDone?: boolean;
  radarData?: number[];
  onShowReflection?: () => void;
  onExit?: () => void;
  isAdminMode?: boolean;
}

export default function AssessmentOverview({
  userName,
  userCampus,
  sessionDate = "15 Okt 2023",
  madelScore = 0,
  preliminaryScore = 0,
  surveyDone = false,
  radarData = [85, 90, 80, 75, 88],
  onShowReflection,
  onExit,
  isAdminMode = false,
}: AssessmentOverviewProps) {
  const [activePage, setActivePage] = useState(1);

  // Calculate scores and categories
  const globalScorePercent = madelScore > 0 ? Math.round((madelScore / 150) * 100) : 88;
  
  let predictionText = "RENDAH (ADAPTIVE)";
  let predictionCategory = "Dasar";
  let predictionDesc = "Kesiapan adaptif Anda dalam literasi digital perlu ditingkatkan.";
  let bgGradient = "from-rose-500 to-rose-600 shadow-rose-500/20";
  let bgGradientCard = "from-rose-500/10 to-rose-600/10 border-rose-200";
  let predictionColor = "text-rose-600";

  if (globalScorePercent >= 80) {
    predictionText = "TINGGI (ADAPTIVE)";
    predictionCategory = "Mahir";
    predictionDesc = "Kesiapan adaptif Anda dalam literasi digital sangat baik.";
    bgGradient = "from-emerald-500 to-teal-600 shadow-emerald-500/20";
    bgGradientCard = "from-emerald-500/10 to-teal-600/10 border-emerald-200";
    predictionColor = "text-emerald-600";
  } else if (globalScorePercent >= 55) {
    predictionText = "SEDANG (ADAPTIVE)";
    predictionCategory = "Menengah";
    predictionDesc = "Kesiapan adaptif Anda dalam literasi digital cukup memadai.";
    bgGradient = "from-amber-500 to-orange-500 shadow-amber-500/20";
    bgGradientCard = "from-amber-500/10 to-orange-500/10 border-amber-200";
    predictionColor = "text-amber-600";
  }

  // Get initials for profile badge
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "JD";

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-50/50 rounded-3xl p-4 md:p-6 border border-slate-200/80 shadow-2xl backdrop-blur-md">
      {/* TABS HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase italic leading-none flex items-center gap-2">
            <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-sm not-italic font-bold">5C</span>
            Laporan Hasil & Rekomendasi
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1.5">
            E-Assesmen Literasi Digital MADEL5C · Multi-page Feedback View
          </p>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 self-start md:self-auto shadow-inner">
          <button
            onClick={() => setActivePage(1)}
            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
              activePage === 1
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Halaman 1
          </button>
          <button
            onClick={() => setActivePage(2)}
            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
              activePage === 2
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Halaman 2
          </button>
          <button
            onClick={() => setActivePage(3)}
            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
              activePage === 3
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Halaman 3
          </button>
        </div>
      </div>

      {/* 3-PAGE CONTAINER */}
      <div className="relative min-h-[500px]">
        {/* PAGE 1: RINGKASAN HASIL & RADAR CHART */}
        {activePage === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* HASIL PREDIKSI CARD */}
              <div className="lg:col-span-6 flex flex-col justify-between p-6 md:p-8 rounded-2xl text-white bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-2xl relative overflow-hidden">
                <div className="absolute right-4 top-4 opacity-5 text-9xl pointer-events-none">
                  <i className="fa-solid fa-circle-arrow-up"></i>
                </div>
                
                <div>
                  <div className={`px-4 py-1.5 bg-gradient-to-r ${bgGradient} rounded-xl inline-flex items-center gap-2.5 mb-6 border border-white/10 shadow-lg`}>
                    <i className="fa-solid fa-arrow-up-long text-white text-xs animate-bounce"></i>
                    <span className="text-[10px] font-black uppercase tracking-wider">{predictionText}</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Skor Global</p>
                    <h3 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
                      {globalScorePercent}%
                    </h3>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Kategori Kelulusan</p>
                      <p className={`text-2xl font-black italic ${predictionColor} tracking-tight`}>{predictionCategory}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
                      <i className={`fa-solid fa-medal ${predictionColor} text-xl`}></i>
                    </div>
                  </div>
                </div>

                <p className="mt-8 text-xs font-bold leading-relaxed italic text-slate-300 border-l-2 border-blue-500 pl-3">
                  &quot;{predictionDesc}&quot;
                </p>
              </div>

              {/* RADAR CHART COMPONENT */}
              <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center min-h-[350px]">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 text-center">
                  Visualisasi Kompetensi 5C Dimension Radar Chart
                </p>
                <div className="w-full max-w-[240px]">
                  <Radar
                    data={{
                      labels: [
                        "1. Critical Thinking",
                        "2. Communication",
                        "3. Collaboration",
                        "4. Creativity",
                        "5. Citizenship & Culture",
                      ],
                      datasets: [
                        {
                          label: "Skor Kompetensi",
                          data: radarData,
                          backgroundColor: "rgba(59, 130, 246, 0.2)",
                          borderColor: "#2563eb",
                          borderWidth: 3,
                          pointRadius: 5,
                          pointBackgroundColor: "#2563eb",
                          pointHoverRadius: 7,
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        r: {
                          suggestedMin: 0,
                          suggestedMax: 100,
                          pointLabels: {
                            font: { size: 9, weight: "bold", family: "sans-serif" },
                            color: "#1e293b",
                          },
                          ticks: { display: false },
                          grid: { color: "rgba(148, 163, 184, 0.15)" },
                        },
                      },
                      plugins: {
                        legend: { display: false },
                      },
                    }}
                  />
                </div>
                <div className="flex items-center gap-6 mt-6 border-t border-slate-100 pt-4 w-full justify-center text-[9px] font-bold text-slate-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-600 rounded"></span>
                    <span>Score: {globalScorePercent}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-emerald-500 rounded"></span>
                    <span>Mahir: &ge; 80%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* REKOMENDASI CERDAS SECTION */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-lg">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <i className="fa-solid fa-wand-magic-sparkles text-blue-600"></i>
                Rekomendasi Cerdas
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#E0F2F1]/60 p-5 rounded-2xl border border-[#B2DFDB]/80 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-6 -bottom-6 text-[#80CBC4]/20 text-7xl font-black group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-circle-info"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-ping"></span>
                      <span className="text-[9px] font-black text-teal-800 uppercase tracking-wider">Info & Data</span>
                    </div>
                    <p className="text-xs font-bold text-teal-900 leading-relaxed z-10 relative">
                      Tingkatkan validasi sumber informasi. Gunakan basis data akademis terpercaya dan saring informasi secara berkala sebelum menggunakannya.
                    </p>
                  </div>
                </div>

                <div className="bg-[#FFF8E1]/60 p-5 rounded-2xl border border-[#FFE082]/80 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-6 -bottom-6 text-[#FFE082]/20 text-7xl font-black group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-gavel"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping"></span>
                      <span className="text-[9px] font-black text-amber-800 uppercase tracking-wider">Etika</span>
                    </div>
                    <p className="text-xs font-bold text-amber-950 leading-relaxed z-10 relative">
                      Terapkan etika komunikasi digital dalam diskusi daring. Hormati hak kekayaan intelektual orang lain dan lakukan atribusi yang tepat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: STATISTIK SKOR & ANALISIS KEKUATAN */}
        {activePage === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* BAR CHART SECTION */}
              <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">
                    Statistik Skor Perkembangan Kompetensi
                  </p>
                  <div className="h-[250px] w-full flex items-center justify-center">
                    <Bar
                      data={{
                        labels: ["C1", "C2", "C3", "C4", "C5"],
                        datasets: [
                          {
                            label: "Skor Dimensi",
                            data: radarData,
                            backgroundColor: [
                              "rgba(59, 130, 246, 0.7)",
                              "rgba(16, 185, 129, 0.7)",
                              "rgba(245, 158, 11, 0.7)",
                              "rgba(139, 92, 246, 0.7)",
                              "rgba(236, 72, 153, 0.7)",
                            ],
                            borderColor: [
                              "#2563eb",
                              "#059669",
                              "#d97706",
                              "#7c3aed",
                              "#db2777",
                            ],
                            borderWidth: 1.5,
                            borderRadius: 6,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: {
                            min: 0,
                            max: 100,
                            ticks: { font: { size: 9, weight: "bold" } },
                            grid: { color: "rgba(148, 163, 184, 0.1)" },
                          },
                          x: {
                            ticks: { font: { size: 10, weight: "bold" } },
                            grid: { display: false },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="text-[9px] font-semibold text-slate-400 mt-4 leading-relaxed uppercase border-t border-slate-50 pt-3 flex justify-between">
                  <span>C1: Critical</span>
                  <span>C2: Comm</span>
                  <span>C3: Collab</span>
                  <span>C4: Creat</span>
                  <span>C5: Citizen</span>
                </div>
              </div>

              {/* ANALISIS KEKUATAN */}
              <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">
                    Analisis Kekuatan Dimensi
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      { label: "Critical Thinking", score: radarData[0], color: "bg-blue-600" },
                      { label: "Communication", score: radarData[1], color: "bg-emerald-500" },
                      { label: "Collaboration", score: radarData[2], color: "bg-amber-500" },
                      { label: "Creativity", score: radarData[3], color: "bg-purple-600" },
                      { label: "Citizenship & Culture", score: radarData[4], color: "bg-pink-500" },
                    ].map((dim, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold text-slate-700">
                          <span>{dim.label}</span>
                          <span className="font-black">{dim.score}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 shadow-inner">
                          <div
                            className={`h-2 rounded-full ${dim.color}`}
                            style={{ width: `${dim.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Dimensi Terkuat
                  </p>
                  <p className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase italic">
                    <i className="fa-solid fa-circle-check text-emerald-500"></i>
                    {[
                      "Critical Thinking",
                      "Communication",
                      "Collaboration",
                      "Creativity",
                      "Citizenship & Culture",
                    ][radarData.indexOf(Math.max(...radarData))]} ({Math.max(...radarData)}%)
                  </p>
                </div>
              </div>
            </div>

            {/* DETAIL BUTIR / INDIKATOR FEEDBACK */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-lg">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4">
                Statistik Skor & Rekomendasi Tiap Aspek
              </h4>
              <div className="space-y-3">
                {[
                  {
                    icon: "fa-brain",
                    label: "Critical Thinking",
                    text: "Tingkatkan validasi sumber informasi secara rutin dan uji keandalan argumen logis sebelum mengambil keputusan.",
                    score: radarData[0],
                    color: "text-blue-600 bg-blue-50 border-blue-100",
                  },
                  {
                    icon: "fa-comments",
                    label: "Communication",
                    text: "Gunakan saluran komunikasi formal dan informal secara efektif dengan memperhatikan audiens Anda di ruang siber.",
                    score: radarData[1],
                    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
                  },
                  {
                    icon: "fa-users-line",
                    label: "Collaboration",
                    text: "Terapkan etika kolaborasi daring dalam forum atau grup diskusi. Dorong partisipasi aktif semua anggota.",
                    score: radarData[2],
                    color: "text-amber-600 bg-amber-50 border-amber-100",
                  },
                ].map((item, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${item.color} flex items-start gap-3.5`}>
                    <div className="w-8 h-8 rounded-lg bg-white/80 shadow-sm border border-slate-200/40 flex items-center justify-center shrink-0">
                      <i className={`fa-solid ${item.icon} text-sm`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] font-black uppercase tracking-wider">{item.label}</p>
                        <span className="text-[10px] font-black bg-white/85 px-2 py-0.5 rounded-full shadow-sm">
                          {item.score}%
                        </span>
                      </div>
                      <p className="text-[11px] font-medium leading-relaxed opacity-90">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PAGE 3: PROFIL & GRAFIK AKTIVITAS */}
        {activePage === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* PROFILE CARD */}
              <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-5 mb-5">
                  <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-md">
                    {initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 leading-tight">{userName}</h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                      {userCampus}
                    </p>
                    <p className="text-[9px] font-semibold text-blue-600 mt-0.5 flex items-center gap-1">
                      <i className="fa-solid fa-clock"></i> Sesi: {sessionDate}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    Statistik Capaian Skor
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-700 mb-1">
                        <span>Pemahaman Materi Literasi</span>
                        <span className="font-black">92%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="h-2 rounded-full bg-blue-600" style={{ width: "92%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-700 mb-1">
                        <span>Penerapan Praktis Digital</span>
                        <span className="font-black">84%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="h-2 rounded-full bg-emerald-500" style={{ width: "84%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-slate-50 border border-slate-200/60 p-4 rounded-xl space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                    Ringkasan Capaian Lainnya
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-700">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span>CVI Validasi</span>
                      <span className="text-emerald-600">88%</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span>Rasch Fit</span>
                      <span className="text-blue-600">Fit</span>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span>CIPP Evaluasi</span>
                      <span className="text-purple-600">Lulus</span>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span>Kirkpatrick L4</span>
                      <span className="text-amber-600">92%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIVITY BAR CHART */}
              <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">
                    Aktivitas Penggunaan & Respon Bulanan
                  </p>
                  <div className="h-[250px] w-full flex items-center justify-center">
                    <Bar
                      data={{
                        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                        datasets: [
                          {
                            label: "Total Aktivitas",
                            data: [35, 48, 65, 82, 58, 72],
                            backgroundColor: "rgba(59, 130, 246, 0.85)",
                            borderRadius: 4,
                            barThickness: 16,
                          },
                          {
                            label: "Aktivitas Diskusi",
                            data: [18, 26, 40, 52, 38, 48],
                            backgroundColor: "rgba(16, 185, 129, 0.85)",
                            borderRadius: 4,
                            barThickness: 16,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: {
                            min: 0,
                            max: 100,
                            ticks: { font: { size: 9, weight: "bold" } },
                            grid: { color: "rgba(148, 163, 184, 0.08)" },
                          },
                          x: {
                            ticks: { font: { size: 9, weight: "bold" } },
                            grid: { display: false },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 border-t border-slate-100 pt-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider justify-center">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded"></span>
                    <span>Total Aktivitas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded"></span>
                    <span>Aktivitas Diskusi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTON BAR FOOTER (ONLY IF ONEXIT OR ONSHOWREFLECTION SPECIFIED) */}
            {(onShowReflection || onExit) && (
              <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
                  * Gunakan hasil laporan diagnostik e-assesmen literasi digital MADEL5C ini sebagai panduan utama refleksi kompetensi akademik Anda.
                </p>
                <div className="flex gap-2 w-full md:w-auto">
                  {onShowReflection && (
                    <button
                      onClick={onShowReflection}
                      className="flex-1 md:flex-none px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all hover:bg-slate-200"
                    >
                      Refleksi Jawaban
                    </button>
                  )}
                  {onExit && (
                    <button
                      onClick={onExit}
                      className="flex-1 md:flex-none px-6 py-3 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-95 transition-all hover:bg-rose-600"
                    >
                      {isAdminMode ? "Tutup Detail" : "Keluar"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
