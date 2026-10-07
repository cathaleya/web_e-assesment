"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

// Import FlipBookSection secara dinamis
const FlipBookSection = dynamic(() => import("./components/FlipBookSection"), { 
  ssr: false,
  loading: () => <div className="text-white font-black animate-pulse py-20 text-center">MEMUAT PANDUAN...</div>
});

export default function Home() {
  const router = useRouter();

  const subModels = [
    {
      id: "madel-5c",
      code: "MADEL-5C",
      name: "Pendidikan Guru Sekolah Dasar (PGSD)",
      desc: "Model Utama Asesmen 5 Dimensi Kompetensi Literasi Digital Guru Sekolah Dasar (PGSD) berbasis Item Response Theory (IRT).",
      color: "from-emerald-400 via-teal-500 to-emerald-600",
      accent: "border-emerald-300 text-emerald-800 bg-emerald-50/90 shadow-sm",
      icon: "fa-chalkboard-user"
    },
    {
      id: "madel-go",
      code: "MADEL-GO",
      name: "Guru Olahraga (Pendidikan Jasmani)",
      desc: "Model Asesmen Literasi Digital & Integrasi Teknologi Pembelajaran Olahraga, Kesehatan, serta Kebugaran Jasmani Guru.",
      color: "from-sky-400 via-blue-500 to-cyan-600",
      accent: "border-sky-300 text-sky-800 bg-sky-50/90 shadow-sm",
      icon: "fa-person-running"
    },
    {
      id: "madel-pak",
      code: "MADEL-PAK",
      name: "Guru Agama (Pendidikan Karakter)",
      desc: "Model Asesmen Literasi Digital Pengetahuan Pedagogik & Etika Digital dalam Integrasi Nilai Keagamaan serta Pembentukan Karakter Siswa.",
      color: "from-amber-400 via-yellow-500 to-orange-500",
      accent: "border-amber-300 text-amber-900 bg-amber-50/90 shadow-sm",
      icon: "fa-hands-praying"
    },
    {
      id: "madel-art",
      code: "MADEL-ART",
      name: "Guru Seni & Budaya",
      desc: "Model Asesmen Literasi Digital Kreativitas Seni, Media Ekspresi Digital Rupa, Musik, & Pembelajaran Kebudayaan Interaktif.",
      color: "from-purple-400 via-indigo-500 to-violet-600",
      accent: "border-purple-300 text-purple-800 bg-purple-50/90 shadow-sm",
      icon: "fa-palette"
    },
    {
      id: "madel-v",
      code: "MADEL-V",
      name: "Guru Vokasi & Keahlian Terapan",
      desc: "Model Asesmen Literasi Digital Keterampilan Praktik Vokasi, Terapan Teknologi Industri, & Uji Kompetensi Keahlian Terapan.",
      color: "from-rose-400 via-pink-500 to-red-600",
      accent: "border-rose-300 text-rose-800 bg-rose-50/90 shadow-sm",
      icon: "fa-screwdriver-wrench"
    }
  ];



  return (
    <div className="font-sans selection:bg-blue-100 overflow-x-hidden bg-[#FAF8F5]">

      {/* ─── NAVBAR TIMBUL 3D ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md px-4 md:px-10 py-3.5 flex items-center justify-between border-b-4 border-amber-200 shadow-2xl">
        <div className="flex items-center gap-3 md:gap-4">
          {/* LOGO TIMBUL 3D */}
          <div className="card-timbul p-1.5 rounded-2xl bg-white shadow-xl border-2 border-slate-200 border-b-4 border-b-slate-400 flex items-center justify-center shrink-0">
            <Image src="/logo_madel5c.png" alt="MADEL-5C Logo" width={48} height={48} className="object-contain drop-shadow-md" />
          </div>
          <div className="flex flex-col leading-none border-l-2 border-slate-200 pl-3">
            {/* TULISAN MADEL TIMBUL 3D */}
            <span className="text-xl md:text-2xl font-black tracking-tighter text-[#1E3A8A] uppercase leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] italic">
              MADEL-5C
            </span>
            <span className="text-[8px] md:text-[9px] font-black text-[#2563EB] uppercase tracking-[0.2em]">E-ASSESSMENT PLATFORM</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <div className="flex items-center gap-3 border-r border-slate-200 pr-6 mr-2">
            <Image src="/logo_penari.png" alt="Penari" width={38} height={38} className="object-contain" />
            <Image src="/logo_dikti.png" alt="DIKTI" width={38} height={38} className="object-contain" />
            <Image src="/logo_unj.png" alt="UNJ" width={38} height={38} className="object-contain" />
          </div>
          <a href="#about" className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-blue-600 transition-colors">
            TENTANG PLATFORM
          </a>
          <a href="#framework" className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-blue-600 transition-colors">
            FRAMEWORK MADEL
          </a>
          <a href="#manual" className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-blue-600 transition-colors">
            BUKU PANDUAN
          </a>
          <a href="https://e-assessment.id/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors border-l border-slate-200 pl-6 ml-1">
            PAYUNG RISET <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-[8px]"></i>
          </a>
          <button
            onClick={() => router.push("/login")}
            className="ml-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl border-b-4 border-indigo-950 hover:from-blue-700 hover:to-indigo-800 active:scale-95 transition-all"
          >
            MASUK PORTAL <i className="fa-solid fa-arrow-right ml-1"></i>
          </button>
        </div>
      </nav>


      {/* ════════════════════════════════════════
          HALAMAN 1 — HERO TIMBUL (BACKGROUND WARM CREAM WITH FLOATING PSYCHOMETRICS)
      ════════════════════════════════════════ */}
      {/* ════════════════════════════════════════
          HALAMAN 1 — HERO TIMBUL (BACKGROUND MOTIF BATIK PAPUA TANPA FILTER + LARGE 3D EMBOSSED ICONS)
      ════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-28 pb-16 bg-[#FAF5EF] overflow-hidden border-b-4 border-amber-200">
        
        {/* BACKGROUND MOTIF BATIK PAPUA (UKIRAN ASMAT & SPIRAL PAPUA) TANPA FILTER */}
        <div className="absolute inset-0 z-0 opacity-[0.16] pointer-events-none overflow-hidden">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="batikPapuaPatternHero" width="140" height="140" patternUnits="userSpaceOnUse">
                {/* Traditional Papuan Carving Diamond */}
                <path d="M 70,0 L 140,70 L 70,140 L 0,70 Z" fill="none" stroke="#b45309" strokeWidth="1.8" />
                <path d="M 70,18 L 122,70 L 70,122 L 18,70 Z" fill="none" stroke="#1e40af" strokeWidth="1.2" strokeDasharray="4 4" />
                {/* Asmat Tribal Spiral Motif */}
                <path d="M 70,40 Q 98,70 70,100 Q 42,70 70,40" fill="none" stroke="#047857" strokeWidth="1.8" />
                <circle cx="70" cy="70" r="10" fill="none" stroke="#b45309" strokeWidth="1.8" />
                {/* Papuan Carving Wave Lines */}
                <path d="M 0,0 Q 35,35 70,0 Q 105,35 140,0" fill="none" stroke="#b45309" strokeWidth="1.5" />
                <path d="M 0,140 Q 35,105 70,140 Q 105,105 140,140" fill="none" stroke="#b45309" strokeWidth="1.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#batikPapuaPatternHero)" />
          </svg>
        </div>

        {/* ─── CONSTELLATION FLOATING ICONS (ORGANIC NON-VERTICAL STAGGERED LAYOUT) ─── */}
        
        {/* Left Top (Inward Offset): Claude AI (Authentic Orange Logo) */}
        <div className="hidden xl:flex absolute top-[14%] left-[4%] z-10 flex-col items-center group float-anim-delay">
          <div className="w-13 h-13 md:w-15 md:h-15 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-600 to-rose-600 text-white flex items-center justify-center shadow-2xl border-2 border-white icon-timbul-3d">
            <i className="fa-solid fa-asterisk text-2xl text-amber-100"></i>
          </div>
          <span className="mt-2 text-[8px] font-black text-orange-900 bg-orange-100/90 px-2.5 py-0.5 rounded-full border border-orange-300 shadow-sm uppercase tracking-wider">
            Claude Code AI
          </span>
        </div>

        {/* Left Mid (Outward Offset): Google Gemini AI (Authentic G-Sparkle Logo) */}
        <div className="hidden xl:flex absolute top-[48%] left-[2%] z-10 flex-col items-center group float-anim">
          <div className="w-13 h-13 md:w-15 md:h-15 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-amber-500 text-white flex items-center justify-center font-black shadow-2xl border-2 border-white icon-timbul-3d">
            <span className="font-black text-xl tracking-tighter text-white font-sans drop-shadow-md">G<span className="text-amber-300 text-xs font-bold">✦</span></span>
          </div>
          <span className="mt-2 text-[8px] font-black text-purple-900 bg-purple-100/90 px-2.5 py-0.5 rounded-full border border-purple-300 shadow-sm uppercase tracking-wider">
            Google Gemini AI
          </span>
        </div>

        {/* Left Bottom (Inward Offset): Uji Pakar (SME) */}
        <div className="hidden xl:flex absolute top-[80%] left-[5%] z-10 flex-col items-center group float-anim-reverse">
          <i className="fa-solid fa-user-tie text-amber-600 text-5xl md:text-6xl icon-timbul-3d"></i>
          <span className="mt-2 text-[8px] font-black text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300 shadow-sm uppercase tracking-wider">
            Uji Pakar (SME)
          </span>
        </div>

        {/* Right Top (Outward Offset): R-Studio Engine (Huruf 'R') */}
        <div className="hidden xl:flex absolute top-[14%] right-[3%] z-10 flex-col items-center group float-anim-reverse">
          <div className="w-13 h-13 md:w-15 md:h-15 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900 text-white flex items-center justify-center shadow-2xl border-2 border-white icon-timbul-3d">
            <i className="fa-brands fa-r-project text-3xl text-sky-200"></i>
          </div>
          <span className="mt-2 text-[8px] font-black text-blue-900 bg-blue-100/90 px-2 py-0.5 rounded-full border border-blue-300 shadow-sm uppercase tracking-wider">
            R-Studio Engine
          </span>
        </div>

        {/* Right Mid (Inward Offset): Wright Map Rasch */}
        <div className="hidden xl:flex absolute top-[50%] right-[11%] z-10 flex-col items-center group float-anim">
          <div className="w-13 h-13 md:w-15 md:h-15 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-700 text-white flex items-center justify-center shadow-2xl border-2 border-white icon-timbul-3d">
            <i className="fa-solid fa-ruler-combined text-2xl text-teal-100"></i>
          </div>
          <span className="mt-2 text-[8px] font-black text-teal-900 bg-teal-100/90 px-2.5 py-0.5 rounded-full border border-teal-300 shadow-sm uppercase tracking-wider">
            Wright Map Rasch
          </span>
        </div>

        {/* Right Bottom (Outward Offset): DIF Bias Analysis */}
        <div className="hidden xl:flex absolute top-[80%] right-[3%] z-10 flex-col items-center group float-anim-delay">
          <i className="fa-solid fa-scale-balanced text-rose-600 text-5xl md:text-6xl icon-timbul-3d"></i>
          <span className="mt-2 text-[8px] font-black text-rose-900 bg-rose-100/90 px-2.5 py-0.5 rounded-full border border-rose-300 shadow-sm uppercase tracking-wider">
            DIF Bias Analysis
          </span>
        </div>


        {/* MAIN CONTENT CONTAINER */}
        <div className="relative z-20 w-full px-4 md:px-14 lg:px-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[10px] md:text-xs font-black uppercase tracking-widest shadow-md mb-4">
              <i className="fa-solid fa-square-poll-vertical text-blue-700 animate-bounce"></i> HYBRID-DIAGNOSTIC ASSESSMENT PLATFORM (HDAP)
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-[60px] xl:text-[70px] font-black italic text-slate-900 uppercase tracking-tighter leading-[1.1] drop-shadow-sm break-words">
              E-ASSESSMENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700">LITERASI DIGITAL</span>.
            </h1>

            <div className="mt-8 max-w-xl card-timbul p-6 md:p-8 rounded-[32px] bg-white/95 backdrop-blur-md shadow-2xl border-t-4 border-t-blue-600 border-x-2 border-b-4 border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm shadow-md border-b-2 border-indigo-950">
                  <i className="fa-solid fa-microchip"></i>
                </div>
                <span className="text-[11px] font-black text-blue-800 uppercase tracking-widest">IRT & Generative AI Engine (Gemini & Claude)</span>
              </div>
              <p className="text-xs md:text-sm text-slate-800 font-bold leading-relaxed">
                Integrasi Analisis Item Response Theory (IRT) dengan kecerdasan Generative AI (Google Gemini & Claude Code AI) untuk memetakan profil kompetensi Literasi Digital mahasiswa calon guru secara holistik, presisi, dan objektif.
              </p>
              <button 
                onClick={() => router.push("/login")}
                className="mt-6 w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl border-b-4 border-indigo-950 active:scale-95 transition-all"
              >
                MULAI SEKARANG <i className="fa-solid fa-rocket ml-2"></i>
              </button>
            </div>
          </div>

          {/* ─── SHOWCASE PANEL DASHBOARD USER & ADMIN (RADAR CHART 5D, DIF, WRIGHT MAP, CTT, R-STUDIO) ─── */}
          <div className="w-full lg:w-[480px] shrink-0 float-anim">
            <div className="card-timbul p-6 rounded-[36px] bg-white backdrop-blur-xl border-2 border-slate-200 border-b-8 border-b-slate-400 shadow-2xl text-slate-900 relative overflow-hidden">
              
              {/* Header Card Panel */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-base shadow-lg border-b-2 border-indigo-950">
                    <i className="fa-solid fa-chart-pie"></i>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-blue-700 uppercase tracking-widest block">PANEL USER & ADMIN</span>
                    <span className="text-sm font-black text-slate-900 uppercase tracking-tight block">Radar Chart & Analisis Psikometri</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-[8px] font-black uppercase">
                  ● Realtime Diagnostic
                </span>
              </div>

              {/* VISUAL RADAR CHART 5 DIMENSI (SVG VECTOR INTERAKTIF) */}
              <div className="relative w-full h-52 flex items-center justify-center bg-slate-50 rounded-2xl p-2 border border-slate-200">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  {/* Grid Pentagon Radar */}
                  <polygon points="100,20 176,75 147,165 53,165 24,75" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                  <polygon points="100,45 152,82 132,142 68,142 48,82" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                  <polygon points="100,70 128,90 118,120 82,120 72,90" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                  
                  {/* Radar Axes */}
                  <line x1="100" y1="100" x2="100" y2="20" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="100" y1="100" x2="176" y2="75" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="100" y1="100" x2="147" y2="165" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="100" y1="100" x2="53" y2="165" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="100" y1="100" x2="24" y2="75" stroke="#cbd5e1" strokeWidth="1" />

                  {/* Dynamic Radar Score Polygon */}
                  <polygon 
                    points="100,32 165,80 138,155 60,150 35,78" 
                    fill="rgba(37, 99, 235, 0.25)" 
                    stroke="#2563eb" 
                    strokeWidth="2.5" 
                  />
                  {/* Radar Vertex Dots */}
                  <circle cx="100" cy="32" r="4" fill="#2563eb" />
                  <circle cx="165" cy="80" r="4" fill="#059669" />
                  <circle cx="138" cy="155" r="4" fill="#d97706" />
                  <circle cx="60" cy="150" r="4" fill="#7c3aed" />
                  <circle cx="35" cy="78" r="4" fill="#e11d48" />
                </svg>

                {/* Radar Axis Labels */}
                <span className="absolute top-1 text-[8px] font-black text-blue-700 bg-white px-1.5 py-0.5 rounded border border-blue-200 shadow-sm">MADEL-5C</span>
                <span className="absolute top-14 right-2 text-[8px] font-black text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200 shadow-sm">MADEL-GO</span>
                <span className="absolute bottom-2 right-6 text-[8px] font-black text-amber-700 bg-white px-1.5 py-0.5 rounded border border-amber-200 shadow-sm">MADEL-PAK</span>
                <span className="absolute bottom-2 left-6 text-[8px] font-black text-purple-700 bg-white px-1.5 py-0.5 rounded border border-purple-200 shadow-sm">MADEL-ART</span>
                <span className="absolute top-14 left-2 text-[8px] font-black text-rose-700 bg-white px-1.5 py-0.5 rounded border border-rose-200 shadow-sm">MADEL-V</span>
              </div>

              {/* ADMIN TOOLBAR BADGES (DIF, WRIGHT MAP, CTT, R-STUDIO) */}
              <div className="grid grid-cols-4 gap-1.5 mt-3">
                <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-center">
                  <i className="fa-solid fa-scale-balanced text-blue-600 text-xs block mb-0.5"></i>
                  <span className="text-[7px] font-black text-slate-800 uppercase block">DIF Bias</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-center">
                  <i className="fa-solid fa-ruler-vertical text-emerald-600 text-xs block mb-0.5"></i>
                  <span className="text-[7px] font-black text-slate-800 uppercase block">Wright Map</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-center">
                  <i className="fa-solid fa-calculator text-amber-600 text-xs block mb-0.5"></i>
                  <span className="text-[7px] font-black text-slate-800 uppercase block">CTT Engine</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-center">
                  <i className="fa-solid fa-code text-purple-600 text-xs block mb-0.5"></i>
                  <span className="text-[7px] font-black text-slate-800 uppercase block">R-Studio</span>
                </div>
              </div>

              {/* Metrics Bar inside Panel */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] font-black text-slate-500 uppercase block">SKOR THETA (IRT)</span>
                    <span className="text-sm font-black text-blue-700 block">θ = +1.68</span>
                  </div>
                  <span className="text-[8px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">HIGH</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] font-black text-slate-500 uppercase block">RELIABILITAS (α)</span>
                    <span className="text-sm font-black text-amber-700 block">α = 0.94</span>
                  </div>
                  <span className="text-[8px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">VERY HIGH</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════
          HALAMAN 2: DIAGRAM KETERHUBUNGAN INTEGRASI FRAMEWORK MADEL (THEME CREAM)
      ════════════════════════════════════════ */}
      <section id="framework" className="relative py-28 px-4 md:px-12 bg-gradient-to-b from-[#F7F3EA] via-[#EFE9DC] to-[#F7F3EA] text-slate-900 overflow-hidden border-y-4 border-amber-200">
        
        {/* NETWORK CONNECTION VECTOR BACKGROUND WITH MOVING FLOW */}
        <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="networkGradientFlowCream" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e40af" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#047857" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <circle cx="50%" cy="50%" r="280" fill="none" stroke="url(#networkGradientFlowCream)" strokeWidth="2" strokeDasharray="10 10" className="network-bond-animated" />
            <circle cx="50%" cy="50%" r="420" fill="none" stroke="url(#networkGradientFlowCream)" strokeWidth="1.5" strokeDasharray="6 6" className="network-bond-animated" />
          </svg>
        </div>

        {/* ─── FLOATING 3D EMBOSSED PSYCHOMETRIC, DIMENSI MADEL 5C & GENERATIVE AI ICONS (ORGANIC CONSTELLATION LAYOUT) ─── */}
        
        {/* Left Top Outer: Google Gemini AI (Authentic G-Sparkle Logo) */}
        <div className="hidden xl:flex absolute top-[10%] left-[2%] z-10 flex-col items-center group float-anim">
          <div className="w-13 h-13 md:w-15 md:h-15 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-amber-500 text-white flex items-center justify-center font-black shadow-2xl border-2 border-white icon-timbul-3d">
            <span className="font-black text-xl tracking-tighter text-white font-sans drop-shadow-md">G<span className="text-amber-300 text-xs font-bold">✦</span></span>
          </div>
          <span className="mt-2 text-[8px] font-black text-purple-900 bg-purple-100/90 px-2.5 py-0.5 rounded-full border border-purple-300 shadow-sm uppercase tracking-wider">
            Google Gemini AI
          </span>
        </div>

        {/* Left Upper Inward: C1 - Contextual Understanding */}
        <div className="hidden xl:flex absolute top-[28%] left-[10%] z-10 flex-col items-center group float-anim-delay">
          <i className="fa-solid fa-brain text-amber-600 text-5xl md:text-6xl icon-timbul-3d"></i>
          <span className="mt-2 text-[8px] font-black text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300 shadow-sm uppercase tracking-wider">
            C1: Contextual Understanding
          </span>
        </div>

        {/* Left Mid Outer: C2 - Communication */}
        <div className="hidden xl:flex absolute top-[50%] left-[1.5%] z-10 flex-col items-center group float-anim">
          <i className="fa-solid fa-comments text-blue-600 text-5xl md:text-6xl icon-timbul-3d"></i>
          <span className="mt-2 text-[8px] font-black text-blue-900 bg-blue-100/90 px-2 py-0.5 rounded-full border border-blue-300 shadow-sm uppercase tracking-wider">
            C2: Communication
          </span>
        </div>

        {/* Left Lower Inward: Structural Equation Modeling (SEM Diagram Logo) */}
        <div className="hidden xl:flex absolute top-[72%] left-[8%] z-10 flex-col items-center group float-anim-reverse">
          <div className="w-13 h-13 md:w-15 md:h-15 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-800 text-white flex items-center justify-center shadow-2xl border-2 border-white icon-timbul-3d">
            <i className="fa-solid fa-diagram-successor text-2xl text-indigo-100"></i>
          </div>
          <span className="mt-2 text-[8px] font-black text-indigo-900 bg-indigo-100/90 px-2 py-0.5 rounded-full border border-indigo-300 shadow-sm uppercase tracking-wider">
            Diagram SEM
          </span>
        </div>

        {/* Left Bottom Gap: C3 - Collaboration */}
        <div className="hidden xl:flex absolute top-[88%] left-[16%] z-10 flex-col items-center group float-anim">
          <i className="fa-solid fa-people-group text-emerald-600 text-5xl md:text-6xl icon-timbul-3d"></i>
          <span className="mt-2 text-[8px] font-black text-emerald-900 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300 shadow-sm uppercase tracking-wider">
            C3: Collaboration
          </span>
        </div>

        {/* Right Top Outer: Claude AI (Authentic Orange Logo) */}
        <div className="hidden xl:flex absolute top-[10%] right-[2%] z-10 flex-col items-center group float-anim-reverse">
          <div className="w-13 h-13 md:w-15 md:h-15 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-600 to-rose-600 text-white flex items-center justify-center shadow-2xl border-2 border-white icon-timbul-3d">
            <i className="fa-solid fa-asterisk text-2xl text-amber-100"></i>
          </div>
          <span className="mt-2 text-[8px] font-black text-orange-900 bg-orange-100/90 px-2.5 py-0.5 rounded-full border border-orange-300 shadow-sm uppercase tracking-wider">
            Claude Code AI
          </span>
        </div>

        {/* Right Upper Inward: C4 - Content Creation */}
        <div className="hidden xl:flex absolute top-[28%] right-[10%] z-10 flex-col items-center group float-anim">
          <i className="fa-solid fa-layer-group text-rose-600 text-5xl md:text-6xl icon-timbul-3d"></i>
          <span className="mt-2 text-[8px] font-black text-rose-900 bg-rose-100/90 px-2 py-0.5 rounded-full border border-rose-300 shadow-sm uppercase tracking-wider">
            C4: Content Creation
          </span>
        </div>

        {/* Right Mid Outer: C5 - Critical Problem Solving */}
        <div className="hidden xl:flex absolute top-[50%] right-[1.5%] z-10 flex-col items-center group float-anim-delay">
          <i className="fa-solid fa-puzzle-piece text-purple-600 text-5xl md:text-6xl icon-timbul-3d"></i>
          <span className="mt-2 text-[8px] font-black text-purple-900 bg-purple-100/90 px-2 py-0.5 rounded-full border border-purple-300 shadow-sm uppercase tracking-wider">
            C5: Critical Problem Solving
          </span>
        </div>

        {/* Right Lower Inward: Legitimizing / Evaluation */}
        <div className="hidden xl:flex absolute top-[72%] right-[8%] z-10 flex-col items-center group float-anim-reverse">
          <i className="fa-solid fa-award text-amber-600 text-5xl md:text-6xl icon-timbul-3d"></i>
          <span className="mt-2 text-[8px] font-black text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300 shadow-sm uppercase tracking-wider">
            Legitimizing / Eval
          </span>
        </div>

        {/* Right Bottom Gap: Rasch Winsteps Engine */}
        <div className="hidden xl:flex absolute top-[88%] right-[16%] z-10 flex-col items-center group float-anim">
          <i className="fa-solid fa-sliders text-teal-600 text-5xl md:text-6xl icon-timbul-3d"></i>
          <span className="mt-2 text-[8px] font-black text-teal-900 bg-teal-100/90 px-2 py-0.5 rounded-full border border-teal-300 shadow-sm uppercase tracking-wider">
            Rasch Winsteps
          </span>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="text-center space-y-3 mb-16">
            <span className="px-4 py-1.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-amber-300 shadow-md inline-flex items-center gap-2">
              <i className="fa-solid fa-diagram-project text-blue-700 animate-spin-slow"></i> INTEGRATED FRAMEWORK NETWORK
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black italic text-slate-900 uppercase tracking-tight leading-tight drop-shadow-sm">
              PLATFORM <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-emerald-600 to-blue-700">MADEL</span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-blue-500 mx-auto rounded-full shadow-lg"></div>
            <p className="text-slate-700 font-bold max-w-3xl mx-auto text-xs md:text-sm leading-relaxed">
              Jaringan integrasi interaktif antara <strong className="text-slate-900">CORE PLATFORM MADEL</strong> dan 5 Sub-Model Spesifik dalam sistem evaluasi kompetensi.
            </p>
          </div>

          {/* ─── DIAGRAM NETWORK TIMBUL 3D WITH ANIMATED CONNECTION LINES ─── */}
          <div className="relative my-8 py-12 flex flex-col items-center justify-center">
            
            {/* SVG CONNECTION LINES CONNECTING CORE MODEL TO SATELLITES */}
            <div className="absolute inset-0 z-0 hidden md:block pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 1000 500">
                {/* Lines from Center (500, 250) to 5 Satellite Nodes */}
                <line x1="500" y1="250" x2="150" y2="380" stroke="#059669" strokeWidth="4" className="network-bond-animated" />
                <line x1="500" y1="250" x2="320" y2="380" stroke="#2563eb" strokeWidth="4" className="network-bond-animated" />
                <line x1="500" y1="250" x2="500" y2="380" stroke="#d97706" strokeWidth="4" className="network-bond-animated" />
                <line x1="500" y1="250" x2="680" y2="380" stroke="#7c3aed" strokeWidth="4" className="network-bond-animated" />
                <line x1="500" y1="250" x2="850" y2="380" stroke="#e11d48" strokeWidth="4" className="network-bond-animated" />

                {/* Animated Connection Nodes on Lines */}
                <circle cx="325" cy="315" r="7" fill="#059669" className="animate-ping" />
                <circle cx="410" cy="315" r="7" fill="#2563eb" className="animate-ping" />
                <circle cx="500" cy="315" r="7" fill="#d97706" className="animate-ping" />
                <circle cx="590" cy="315" r="7" fill="#7c3aed" className="animate-ping" />
                <circle cx="675" cy="315" r="7" fill="#e11d48" className="animate-ping" />
              </svg>
            </div>

            {/* CORE HUB (PUSAT FRAMEWORK MADEL) */}
            <div className="relative z-20 mb-12">
              <div className="w-56 h-56 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-2 shadow-[0_0_80px_rgba(245,158,11,0.4)] border-4 border-white flex flex-col items-center justify-center text-center z-20 hover:scale-105 transition-all duration-300 relative network-pulse-glow">
                
                {/* Rotating Outer Ring */}
                <div className="absolute -inset-4 rounded-full stroke-amber-500 border-2 border-dashed border-amber-500/60 animate-spin-slow pointer-events-none"></div>

                <div className="w-14 h-14 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center text-3xl mb-2 shadow-xl border-2 border-amber-300">
                  <i className="fa-solid fa-diagram-project"></i>
                </div>
                <span className="text-[9px] font-black text-slate-950 uppercase tracking-widest block bg-white/90 px-3 py-0.5 rounded-full mb-1 border border-amber-300">
                  MODEL INDUK UTAMA
                </span>
                <h3 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-tight italic drop-shadow-sm leading-tight">
                  PLATFORM MADEL
                </h3>
                <p className="text-[9px] font-black text-slate-900 mt-1 max-w-[170px] leading-tight">
                  Model Asesmen Digital Evaluasi Literasi
                </p>
              </div>
            </div>

            {/* 5 SATELLITE CIRCULAR SPHERES (SUB-MODEL PRODI BULAT WITH DUAL-TONE CONTRAST CREAM & WHITE) */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 w-full max-w-6xl z-10">
              {subModels.map((m, idx) => (
                <div 
                  key={m.id}
                  onClick={() => router.push("/login")}
                  className="card-timbul w-44 h-44 md:w-52 md:h-52 mx-auto rounded-full bg-gradient-to-br from-white via-[#FFFDF9] to-[#FAF5EF] text-slate-900 border-4 border-amber-300/90 flex flex-col items-center justify-center text-center p-4 shadow-[0_16px_36px_rgba(0,0,0,0.12)] hover:scale-105 hover:translate-y-[-6px] transition-all duration-300 group cursor-pointer relative overflow-hidden ring-4 ring-white"
                >
                  <div className={`w-13 h-13 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${m.color} text-white flex items-center justify-center text-2xl shadow-xl border-2 border-white mb-2 ring-4 ring-amber-200/80 group-hover:scale-110 transition-transform shrink-0`}>
                    <i className={`fa-solid ${m.icon}`}></i>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase mb-1 border ${m.accent}`}>
                    Sub-Model #{idx + 1}
                  </span>
                  <h4 className="text-sm md:text-base font-black text-slate-900 uppercase tracking-tight italic leading-none">
                    {m.code}
                  </h4>
                  <p className="text-[9px] font-black text-slate-700 leading-tight mt-1 px-2 line-clamp-2">
                    {m.name}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* RINCIAN DESKRIPSI 5 SUB-MODEL (KARTU TIMBUL 3D DUAL-TONE CREAM & WHITE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-16">
            {subModels.map((m, idx) => (
              <div 
                key={m.id} 
                className="card-timbul p-6 rounded-[32px] bg-gradient-to-br from-white via-[#FFFDF9] to-[#FAF5EF] text-slate-900 border-2 border-amber-200/90 border-t-4 border-t-amber-500 flex flex-col justify-between shadow-xl hover:translate-y-[-4px] transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border ${m.accent}`}>
                      Sub-Model #{idx + 1}
                    </span>
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${m.color} text-white flex items-center justify-center text-sm shadow-md border-b-2 border-black/30`}>
                      <i className={`fa-solid ${m.icon}`}></i>
                    </div>
                  </div>

                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight italic mb-1">
                    {m.code}
                  </h4>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">
                    {m.name}
                  </span>
                  <p className="text-xs font-bold text-slate-600 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Hirarki: <span className="text-blue-600 font-bold">Terintegrasi</span>
                  </span>
                  <button 
                    onClick={() => router.push("/login")}
                    className={`px-4 py-2 bg-gradient-to-r ${m.color} text-white font-black rounded-xl text-[9px] uppercase tracking-widest shadow-md border-b-2 border-black/30 active:scale-95 transition-all`}
                  >
                    Buka Model <i className="fa-solid fa-arrow-right ml-1"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ════════════════════════════════════════
          HALAMAN 3 — VIDEO TUTORIAL TIMBUL (THEME SOFT SKY BLUE)
      ════════════════════════════════════════ */}
      <section id="about" className="relative min-h-screen py-28 px-4 md:px-14 lg:px-20 overflow-hidden bg-[#F3F6FA] border-b-4 border-blue-200">
        
        {/* BACKGROUND MOTIF BATIK PAPUA - HALAMAN 3 (SAPPHIRE BLUE & ROYAL INDIGO MOTIF) */}
        <div className="absolute inset-0 z-0 opacity-[0.16] pointer-events-none overflow-hidden">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="batikPapuaPatternH3" width="140" height="140" patternUnits="userSpaceOnUse">
                <path d="M 70,0 L 140,70 L 70,140 L 0,70 Z" fill="none" stroke="#2563eb" strokeWidth="1.8" />
                <path d="M 70,18 L 122,70 L 70,122 L 18,70 Z" fill="none" stroke="#4f46e5" strokeWidth="1.2" strokeDasharray="4 4" />
                <path d="M 70,40 Q 98,70 70,100 Q 42,70 70,40" fill="none" stroke="#1d4ed8" strokeWidth="1.8" />
                <circle cx="70" cy="70" r="10" fill="none" stroke="#2563eb" strokeWidth="1.8" />
                <path d="M 0,0 Q 35,35 70,0 Q 105,35 140,0" fill="none" stroke="#4f46e5" strokeWidth="1.5" />
                <path d="M 0,140 Q 35,105 70,140 Q 105,105 140,140" fill="none" stroke="#2563eb" strokeWidth="1.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#batikPapuaPatternH3)" />
          </svg>
        </div>

        {/* ─── STANDALONE 3D EMBOSSED FLOATING ICONS (ORGANIC NON-VERTICAL STAGGERED LAYOUT) ─── */}
        
        {/* Left Top Outer: Google Gemini AI (Authentic G-Sparkle Logo) */}
        <div className="hidden xl:flex absolute top-[12%] left-[2%] z-10 flex-col items-center group float-anim">
          <div className="w-13 h-13 md:w-15 md:h-15 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-amber-500 text-white flex items-center justify-center font-black shadow-2xl border-2 border-white icon-timbul-3d">
            <span className="font-black text-xl tracking-tighter text-white font-sans drop-shadow-md">G<span className="text-amber-300 text-xs font-bold">✦</span></span>
          </div>
          <span className="mt-2 text-[8px] font-black text-purple-900 bg-purple-100/90 px-2.5 py-0.5 rounded-full border border-purple-300 shadow-sm uppercase tracking-wider">
            Google Gemini AI
          </span>
        </div>

        {/* Left Upper Inward: Developing / Content Development */}
        <div className="hidden xl:flex absolute top-[34%] left-[10%] z-10 flex-col items-center group float-anim-delay">
          <i className="fa-solid fa-laptop-code text-teal-600 text-5xl md:text-6xl icon-timbul-3d"></i>
          <span className="mt-2 text-[8px] font-black text-teal-900 bg-teal-100/90 px-2 py-0.5 rounded-full border border-teal-300 shadow-sm uppercase tracking-wider">
            Developing / Content
          </span>
        </div>

        {/* Left Mid Outer: Think-Aloud Protocol */}
        <div className="hidden xl:flex absolute top-[58%] left-[2.5%] z-10 flex-col items-center group float-anim">
          <i className="fa-solid fa-comments text-amber-600 text-5xl md:text-6xl icon-timbul-3d"></i>
          <span className="mt-2 text-[8px] font-black text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300 shadow-sm uppercase tracking-wider">
            Think-Aloud Protocol
          </span>
        </div>

        {/* Left Lower Inward: Item Bias DIF */}
        <div className="hidden xl:flex absolute top-[80%] left-[8%] z-10 flex-col items-center group float-anim-reverse">
          <i className="fa-solid fa-scale-balanced text-blue-600 text-5xl md:text-6xl icon-timbul-3d"></i>
          <span className="mt-2 text-[8px] font-black text-blue-900 bg-blue-100/90 px-2 py-0.5 rounded-full border border-blue-300 shadow-sm uppercase tracking-wider">
            DIF Bias Analysis
          </span>
        </div>

        {/* Right Top Outer: Claude AI (Authentic Orange Logo) */}
        <div className="hidden xl:flex absolute top-[12%] right-[2%] z-10 flex-col items-center group float-anim-reverse">
          <div className="w-13 h-13 md:w-15 md:h-15 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-600 to-rose-600 text-white flex items-center justify-center shadow-2xl border-2 border-white icon-timbul-3d">
            <i className="fa-solid fa-asterisk text-2xl text-amber-100"></i>
          </div>
          <span className="mt-2 text-[8px] font-black text-orange-900 bg-orange-100/90 px-2.5 py-0.5 rounded-full border border-orange-300 shadow-sm uppercase tracking-wider">
            Claude Code AI
          </span>
        </div>

        {/* Right Upper Inward: R-Studio Engine (Huruf 'R') */}
        <div className="hidden xl:flex absolute top-[34%] right-[10%] z-10 flex-col items-center group float-anim-delay">
          <div className="w-13 h-13 md:w-15 md:h-15 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900 text-white flex items-center justify-center shadow-2xl border-2 border-white icon-timbul-3d">
            <i className="fa-brands fa-r-project text-3xl text-sky-200"></i>
          </div>
          <span className="mt-2 text-[8px] font-black text-blue-900 bg-blue-100/90 px-2 py-0.5 rounded-full border border-blue-300 shadow-sm uppercase tracking-wider">
            R-Studio Engine
          </span>
        </div>

        {/* Right Mid Outer: Wright Map Rasch */}
        <div className="hidden xl:flex absolute top-[58%] right-[2.5%] z-10 flex-col items-center group float-anim">
          <div className="w-13 h-13 md:w-15 md:h-15 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-700 text-white flex items-center justify-center shadow-2xl border-2 border-white icon-timbul-3d">
            <i className="fa-solid fa-ruler-combined text-2xl text-teal-100"></i>
          </div>
          <span className="mt-2 text-[8px] font-black text-teal-900 bg-teal-100/90 px-2 py-0.5 rounded-full border border-teal-300 shadow-sm uppercase tracking-wider">
            Wright Map Rasch
          </span>
        </div>

        {/* Right Lower Inward: Model IRT 3PL */}
        <div className="hidden xl:flex absolute top-[80%] right-[8%] z-10 flex-col items-center group float-anim-delay">
          <i className="fa-solid fa-arrow-trend-up text-rose-600 text-5xl md:text-6xl icon-timbul-3d"></i>
          <span className="mt-2 text-[8px] font-black text-rose-900 bg-rose-100/90 px-2 py-0.5 rounded-full border border-rose-300 shadow-sm uppercase tracking-wider">
            Model IRT 3PL
          </span>
        </div>

        <div className="max-w-7xl mx-auto w-full flex flex-col items-center gap-10 text-center relative z-10">
          <div className="space-y-3 card-timbul p-6 md:p-8 rounded-[36px] bg-white/95 backdrop-blur-md max-w-2xl mx-auto border-2 border-slate-200">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[9px] font-black uppercase tracking-widest shadow-sm mb-1">
              <i className="fa-solid fa-circle-play text-blue-600"></i> MEDIA EDUKASI PLATFORM
            </div>
            <h2 className="text-2xl md:text-5xl font-black italic text-slate-900 uppercase tracking-tighter leading-tight drop-shadow-sm">
              PANDUAN VISUAL PLATFORM
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full shadow-sm"></div>
            <p className="text-slate-800 font-black uppercase tracking-[0.3em] text-[10px]">Video Tutorial Lengkap HDAP</p>
          </div>

          {/* FRAME VIDEO TIMBUL 3D TERJAGA 100% */}
          <div className="w-full max-w-5xl aspect-video bg-slate-950 rounded-3xl md:rounded-[48px] shadow-2xl overflow-hidden border-4 md:border-8 border-white relative group card-timbul">
             <video className="w-full h-full object-contain" controls>
               <source src="/media/video_HDAP.mp4" type="video/mp4" />
             </video>
          </div>
        </div>
      </section>
      {/* ════════════════════════════════════════
          HALAMAN 4 — FLIPBOOK MANUAL TIMBUL (THEME TERRACOTTA WARM CREAM)
      ════════════════════════════════════════ */}
      <section id="manual" className="relative min-h-screen py-28 px-4 md:px-14 lg:px-20 overflow-hidden bg-[#FDF6EE] border-b-4 border-amber-300">
        
        {/* BACKGROUND MOTIF BATIK PAPUA - HALAMAN 4 (CRIMSON TERRACOTTA & GOLDEN OCHRE MOTIF) */}
        <div className="absolute inset-0 z-0 opacity-[0.16] pointer-events-none overflow-hidden">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="batikPapuaPatternH4" width="140" height="140" patternUnits="userSpaceOnUse">
                <path d="M 70,0 L 140,70 L 70,140 L 0,70 Z" fill="none" stroke="#dc2626" strokeWidth="1.8" />
                <path d="M 70,18 L 122,70 L 70,122 L 18,70 Z" fill="none" stroke="#ea580c" strokeWidth="1.2" strokeDasharray="4 4" />
                <path d="M 70,40 Q 98,70 70,100 Q 42,70 70,40" fill="none" stroke="#991b1b" strokeWidth="1.8" />
                <circle cx="70" cy="70" r="10" fill="none" stroke="#dc2626" strokeWidth="1.8" />
                <path d="M 0,0 Q 35,35 70,0 Q 105,35 140,0" fill="none" stroke="#ea580c" strokeWidth="1.5" />
                <path d="M 0,140 Q 35,105 70,140 Q 105,105 140,140" fill="none" stroke="#dc2626" strokeWidth="1.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#batikPapuaPatternH4)" />
          </svg>
        </div>

        {/* ─── STANDALONE 3D EMBOSSED FLOATING ICONS (ORGANIC NON-VERTICAL STAGGERED LAYOUT) ─── */}
        
        {/* Left Top Outer: Validitas Aiken's V */}
        <div className="hidden xl:flex absolute top-[12%] left-[2%] z-10 flex-col items-center group float-anim-reverse">
          <i className="fa-solid fa-stamp text-rose-600 text-5xl md:text-6xl icon-timbul-3d"></i>
          <span className="mt-2 text-[8px] font-black text-rose-900 bg-rose-100/90 px-2 py-0.5 rounded-full border border-rose-300 shadow-sm uppercase tracking-wider">
            Validitas Aiken's V
          </span>
        </div>

        {/* Left Upper Inward: Teori Tes Klasik (CTT) */}
        <div className="hidden xl:flex absolute top-[34%] left-[10%] z-10 flex-col items-center group float-anim">
          <i className="fa-solid fa-calculator text-amber-600 text-5xl md:text-6xl icon-timbul-3d"></i>
          <span className="mt-2 text-[8px] font-black text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300 shadow-sm uppercase tracking-wider">
            Teori Tes Klasik (CTT)
          </span>
        </div>

        {/* Left Mid Outer: Google Gemini AI (Authentic G-Sparkle Logo) */}
        <div className="hidden xl:flex absolute top-[58%] left-[2.5%] z-10 flex-col items-center group float-anim-delay">
          <div className="w-13 h-13 md:w-15 md:h-15 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-amber-500 text-white flex items-center justify-center font-black shadow-2xl border-2 border-white icon-timbul-3d">
            <span className="font-black text-xl tracking-tighter text-white font-sans drop-shadow-md">G<span className="text-amber-300 text-xs font-bold">✦</span></span>
          </div>
          <span className="mt-2 text-[8px] font-black text-purple-900 bg-purple-100/90 px-2.5 py-0.5 rounded-full border border-purple-300 shadow-sm uppercase tracking-wider">
            Google Gemini AI
          </span>
        </div>

        {/* Left Lower Inward: Uji-t & Stat Rasch */}
        <div className="hidden xl:flex absolute top-[80%] left-[8%] z-10 flex-col items-center group float-anim">
          <i className="fa-solid fa-square-root-variable text-emerald-600 text-5xl md:text-6xl icon-timbul-3d"></i>
          <span className="mt-2 text-[8px] font-black text-emerald-900 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300 shadow-sm uppercase tracking-wider">
            Uji-t & Stat Rasch
          </span>
        </div>

        {/* Right Top Outer: Claude AI (Authentic Orange Logo) */}
        <div className="hidden xl:flex absolute top-[12%] right-[2%] z-10 flex-col items-center group float-anim">
          <div className="w-13 h-13 md:w-15 md:h-15 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-600 to-rose-600 text-white flex items-center justify-center shadow-2xl border-2 border-white icon-timbul-3d">
            <i className="fa-solid fa-asterisk text-2xl text-amber-100"></i>
          </div>
          <span className="mt-2 text-[8px] font-black text-orange-900 bg-orange-100/90 px-2.5 py-0.5 rounded-full border border-orange-300 shadow-sm uppercase tracking-wider">
            Claude Code AI
          </span>
        </div>

        {/* Right Upper Inward: Analisis CFA */}
        <div className="hidden xl:flex absolute top-[34%] right-[10%] z-10 flex-col items-center group float-anim-reverse">
          <i className="fa-solid fa-diagram-project text-blue-600 text-5xl md:text-6xl icon-timbul-3d"></i>
          <span className="mt-2 text-[8px] font-black text-blue-900 bg-blue-100/90 px-2 py-0.5 rounded-full border border-blue-300 shadow-sm uppercase tracking-wider">
            Analisis CFA
          </span>
        </div>

        {/* Right Mid Outer: Reliabilitas Alpha & Omega */}
        <div className="hidden xl:flex absolute top-[58%] right-[2.5%] z-10 flex-col items-center group float-anim-delay">
          <i className="fa-solid fa-chart-line text-teal-600 text-5xl md:text-6xl icon-timbul-3d"></i>
          <span className="mt-2 text-[8px] font-black text-teal-900 bg-teal-100/90 px-2 py-0.5 rounded-full border border-teal-300 shadow-sm uppercase tracking-wider">
            Reliabilitas Alpha & Omega
          </span>
        </div>

        {/* Right Lower Inward: R-Studio Engine (Huruf 'R') */}
        <div className="hidden xl:flex absolute top-[80%] right-[8%] z-10 flex-col items-center group float-anim">
          <div className="w-13 h-13 md:w-15 md:h-15 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900 text-white flex items-center justify-center shadow-2xl border-2 border-white icon-timbul-3d">
            <i className="fa-brands fa-r-project text-3xl text-sky-200"></i>
          </div>
          <span className="mt-2 text-[8px] font-black text-blue-900 bg-blue-100/90 px-2 py-0.5 rounded-full border border-blue-300 shadow-sm uppercase tracking-wider">
            R-Studio Engine
          </span>
        </div>

        <div className="max-w-7xl mx-auto w-full flex flex-col items-center gap-10 relative z-10">
          <div className="space-y-3 text-center card-timbul p-6 md:p-8 rounded-[36px] bg-white/95 backdrop-blur-md max-w-2xl mx-auto border-2 border-slate-200">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[9px] font-black uppercase tracking-widest shadow-sm mb-1">
              <i className="fa-solid fa-book-bookmark text-amber-600"></i> MONOGRAF & MANUAL OPERASIONAL
            </div>
            <h2 className="text-2xl md:text-5xl font-black italic text-slate-900 uppercase tracking-tighter leading-tight drop-shadow-sm">
              BUKU PANDUAN DIGITAL
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full shadow-sm"></div>
            <p className="text-slate-800 font-black uppercase tracking-[0.3em] text-[10px]">Monograf & Manual Penggunaan Platform</p>
          </div>

          <div className="w-full flex justify-center">
             <FlipBookSection />
          </div>
        </div>
      </section>


      {/* ─── FOOTER TIMBUL ─── */}
      <footer className="bg-white text-slate-900 py-12 px-6 md:px-14 border-t-4 border-amber-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-xl border-b-2 border-blue-950">
              <i className="fa-solid fa-graduation-cap text-xl"></i>
            </div>
            <div className="text-left">
              <span className="font-black text-xl tracking-tighter block uppercase leading-none text-slate-900">MADEL5C · HDAP</span>
              <span className="text-blue-700 text-[10px] font-black uppercase tracking-[0.25em] block mt-1">Institutional Research Platform</span>
            </div>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            © 2025 HDAP. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}


