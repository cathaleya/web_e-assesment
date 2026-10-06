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
      name: "Competence Assessment Model",
      desc: "Model Utama Asesmen SJT 5 Dimensi Kompetensi Digital Calon Guru berbasis Item Response Theory (IRT).",
      color: "from-emerald-600 to-teal-700",
      accent: "border-emerald-500 text-emerald-700 bg-emerald-50",
      icon: "fa-brain"
    },
    {
      id: "madel-go",
      code: "MADEL-GO",
      name: "Governance & Organization",
      desc: "Model Tatakelola & Kebijakan Organisasi Digital dalam Ekosistem Pendidikan Tinggi.",
      color: "from-blue-600 to-indigo-700",
      accent: "border-blue-500 text-blue-700 bg-blue-50",
      icon: "fa-landmark"
    },
    {
      id: "madel-pak",
      code: "MADEL-PAK",
      name: "Pedagogical Assessment Knowledge",
      desc: "Model Integrasi Pengetahuan Pedagogik Asesmen Digital dalam Kurikulum Pembelajaran.",
      color: "from-amber-500 to-orange-600",
      accent: "border-amber-500 text-amber-800 bg-amber-50",
      icon: "fa-book-open-reader"
    },
    {
      id: "madel-art",
      code: "MADEL-ART",
      name: "Artificial Intelligence & Resources",
      desc: "Model Kecerdasan Buatan (GenAI) & Sumber Daya Teknologi Pembelajaran Interaktif.",
      color: "from-purple-600 to-indigo-800",
      accent: "border-purple-500 text-purple-700 bg-purple-50",
      icon: "fa-wand-magic-sparkles"
    },
    {
      id: "madel-v",
      code: "MADEL-V",
      name: "Validation & Verification Engine",
      desc: "Model Validasi Psikometris (CFA, EFA, Rasch, MFRM) & Verifikasi Empiris Platform.",
      color: "from-rose-600 to-red-700",
      accent: "border-rose-500 text-rose-700 bg-rose-50",
      icon: "fa-shield-halved"
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
      <section className="relative min-h-screen flex items-center pt-28 pb-16 bg-gradient-to-br from-[#FAF5EF] via-[#F3EFE6] to-[#E5DEC9] overflow-hidden border-b-4 border-amber-200">
        
        {/* BACKGROUND DIAGRAM PSIKOMETRI & GRID RADIUS */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="psychGradCream" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e40af" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#047857" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path d="M 0 500 Q 300 500 500 200 T 1000 500 T 1600 500" fill="none" stroke="url(#psychGradCream)" strokeWidth="3" strokeDasharray="8 8" />
            <path d="M 0 450 Q 400 450 650 150 T 1300 450 T 1800 450" fill="none" stroke="url(#psychGradCream)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(15,23,42,0.08)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(15,23,42,0.08)" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* ─── KARTU/BADGE SYMBOL PSIKOMETRI & EVALUASI 3D MELAYANG (THEME CREAM) ─── */}
        
        {/* Floating Symbol 1: Kurva Gaussian Normal IRT (Top Right) */}
        <div className="hidden lg:flex absolute top-32 right-12 z-10 psychometric-card-3d-cream p-4 rounded-3xl float-anim items-center gap-4 max-w-xs">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-xl font-black shadow-lg border-b-2 border-indigo-950 shrink-0">
            <i className="fa-solid fa-chart-area"></i>
          </div>
          <div>
            <span className="text-[9px] font-black text-blue-700 uppercase tracking-widest block">IRT LATENT TRAIT</span>
            <span className="text-xs font-black text-slate-900 uppercase tracking-tight block">Kurva Normal θ ~ N(0,1)</span>
            <span className="text-[9px] text-slate-600 font-bold block mt-0.5">Item Characteristic Curve (ICC)</span>
          </div>
        </div>

        {/* Floating Symbol 2: Fit Statistics Rasch MFRM (Middle Right) */}
        <div className="hidden lg:flex absolute top-72 right-36 z-10 psychometric-card-3d-cream p-4 rounded-3xl float-anim-delay items-center gap-4 max-w-xs !border-b-emerald-600">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center text-xl font-black shadow-lg border-b-2 border-teal-950 shrink-0">
            <i className="fa-solid fa-square-poll-vertical"></i>
          </div>
          <div>
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest block">MODEL RASCH & MFRM</span>
            <span className="text-xs font-black text-slate-900 uppercase tracking-tight block">Infit & Outfit MNSQ</span>
            <span className="text-[9px] text-slate-600 font-bold block mt-0.5">Rentang Ideal: 0.5 - 1.5</span>
          </div>
        </div>

        {/* Floating Symbol 3: Reliabilitas & Alfa Cronbach (Bottom Right) */}
        <div className="hidden lg:flex absolute bottom-24 right-20 z-10 psychometric-card-3d-cream p-4 rounded-3xl float-anim-reverse items-center gap-4 max-w-xs !border-b-amber-600">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-xl font-black shadow-lg border-b-2 border-orange-950 shrink-0">
            <i className="fa-solid fa-certificate"></i>
          </div>
          <div>
            <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest block">UJI KONSISTENSI INTERNAL</span>
            <span className="text-xs font-black text-slate-900 uppercase tracking-tight block">Cronbach α = 0.942</span>
            <span className="text-[9px] text-slate-600 font-bold block mt-0.5">Keandalan Tinggi Terverifikasi</span>
          </div>
        </div>


        {/* MAIN CONTENT CONTAINER */}
        <div className="relative z-20 w-full px-4 md:px-14 lg:px-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[10px] md:text-xs font-black uppercase tracking-widest shadow-md mb-4">
              <i className="fa-solid fa-atom text-blue-700 animate-spin-slow"></i> HYBRID-DIAGNOSTIC ASSESSMENT PLATFORM (HDAP)
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-[60px] xl:text-[70px] font-black italic text-slate-900 uppercase tracking-tighter leading-[1.1] drop-shadow-sm break-words">
              E-ASSESSMENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700">LITERASI DIGITAL</span>.
            </h1>

            <div className="mt-8 max-w-xl card-timbul p-6 md:p-8 rounded-[32px] bg-white/95 backdrop-blur-md shadow-2xl border-t-4 border-t-blue-600 border-x-2 border-b-4 border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm shadow-md border-b-2 border-indigo-950">
                  <i className="fa-solid fa-microchip"></i>
                </div>
                <span className="text-[11px] font-black text-blue-800 uppercase tracking-widest">IRT & Generative AI Engine</span>
              </div>
              <p className="text-xs md:text-sm text-slate-800 font-bold leading-relaxed">
                Integrasi Analisis Item Response Theory (IRT) dengan kecerdasan Generative AI untuk memetakan profil kompetensi Literasi Digital mahasiswa calon guru secara holistik, presisi, dan objektif.
              </p>
              <button 
                onClick={() => router.push("/login")}
                className="mt-6 w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl border-b-4 border-indigo-950 active:scale-95 transition-all"
              >
                MULAI SEKARANG <i className="fa-solid fa-rocket ml-2"></i>
              </button>
            </div>
          </div>

          {/* ─── SHOWCASE PANEL DASHBOARD USER & ADMIN (RADAR CHART 5D & IRT THETA METER) ─── */}
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
                    <span className="text-sm font-black text-slate-900 uppercase tracking-tight block">Radar Chart Kompetensi 5D</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-[8px] font-black uppercase">
                  ● Realtime Diagnostic
                </span>
              </div>

              {/* VISUAL RADAR CHART 5 DIMENSI (SVG VECTOR INTERAKTIF) */}
              <div className="relative w-full h-56 flex items-center justify-center bg-slate-50 rounded-2xl p-2 border border-slate-200">
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

              {/* Metrics Bar inside Panel */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] font-black text-slate-500 uppercase block">SKOR THETA (IRT)</span>
                    <span className="text-base font-black text-blue-700 block">θ = +1.68</span>
                  </div>
                  <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">HIGH</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] font-black text-slate-500 uppercase block">RELIABILITAS (α)</span>
                    <span className="text-base font-black text-amber-700 block">α = 0.94</span>
                  </div>
                  <span className="text-[9px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">VERY HIGH</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>



      {/* ════════════════════════════════════════
          HALAMAN 2: DIAGRAM KETERHUBUNGAN ION FRAMEWORK MADEL (ANIMASI MOLEKULER BERGERAK - THEME CREAM)
      ════════════════════════════════════════ */}
      <section id="framework" className="relative py-28 px-4 md:px-12 bg-gradient-to-b from-[#F7F3EA] via-[#EFE9DC] to-[#F7F3EA] text-slate-900 overflow-hidden border-y-4 border-amber-200">
        
        {/* ION MOLECULAR BOND VECTOR BACKGROUND WITH MOVING FLOW */}
        <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ionGradientFlowCream" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e40af" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#047857" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <circle cx="50%" cy="50%" r="280" fill="none" stroke="url(#ionGradientFlowCream)" strokeWidth="2" strokeDasharray="10 10" className="ion-bond-animated" />
            <circle cx="50%" cy="50%" r="420" fill="none" stroke="url(#ionGradientFlowCream)" strokeWidth="1.5" strokeDasharray="6 6" className="ion-bond-animated" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="text-center space-y-3 mb-16">
            <span className="px-4 py-1.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-amber-300 shadow-md inline-flex items-center gap-2">
              <i className="fa-solid fa-atom text-blue-700 animate-spin-slow"></i> HETERO-IONIC FRAMEWORK NETWORK
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black italic text-slate-900 uppercase tracking-tight leading-tight drop-shadow-sm">
              KETERHUBUNGAN ION FRAMEWORK <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-emerald-600 to-blue-700">MADEL</span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-blue-500 mx-auto rounded-full shadow-lg"></div>
            <p className="text-slate-700 font-bold max-w-3xl mx-auto text-xs md:text-sm leading-relaxed">
              Jaringan ikatan ikatan molekuler interaktif antara <strong className="text-slate-900">CORE MADEL NUCLEUS</strong> dan 5 Orbit Sub-Model Ion Spesifik dalam sistem evaluasi kompetensi.
            </p>
          </div>

          {/* ─── DIAGRAM IONIK MOLEKULER TIMBUL 3D WITH ANIMATED BOND LINES ─── */}
          <div className="relative my-8 py-12 flex flex-col items-center justify-center">
            
            {/* SVG ATOMIC BONDS CONNECTING CORE NUCLEUS TO SATELLITES */}
            <div className="absolute inset-0 z-0 hidden md:block pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 1000 500">
                {/* Bonds from Center (500, 250) to 5 Satellite Nodes */}
                <line x1="500" y1="250" x2="150" y2="380" stroke="#059669" strokeWidth="4" className="ion-bond-animated" />
                <line x1="500" y1="250" x2="320" y2="380" stroke="#2563eb" strokeWidth="4" className="ion-bond-animated" />
                <line x1="500" y1="250" x2="500" y2="380" stroke="#d97706" strokeWidth="4" className="ion-bond-animated" />
                <line x1="500" y1="250" x2="680" y2="380" stroke="#7c3aed" strokeWidth="4" className="ion-bond-animated" />
                <line x1="500" y1="250" x2="850" y2="380" stroke="#e11d48" strokeWidth="4" className="ion-bond-animated" />

                {/* Animated Electron Nodes on Bonds */}
                <circle cx="325" cy="315" r="7" fill="#059669" className="animate-ping" />
                <circle cx="410" cy="315" r="7" fill="#2563eb" className="animate-ping" />
                <circle cx="500" cy="315" r="7" fill="#d97706" className="animate-ping" />
                <circle cx="590" cy="315" r="7" fill="#7c3aed" className="animate-ping" />
                <circle cx="675" cy="315" r="7" fill="#e11d48" className="animate-ping" />
              </svg>
            </div>

            {/* CORE NUCLEUS ION SPHERE (PUSAT MOLEKUL MADEL) */}
            <div className="relative z-20 mb-12">
              <div className="w-56 h-56 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-2 shadow-[0_0_80px_rgba(245,158,11,0.4)] border-4 border-white flex flex-col items-center justify-center text-center z-20 hover:scale-105 transition-all duration-300 relative ion-pulse-glow">
                
                {/* Rotating Outer Atomic Orbital Ring */}
                <div className="absolute -inset-4 rounded-full stroke-amber-500 border-2 border-dashed border-amber-500/60 animate-spin-slow pointer-events-none"></div>

                <div className="w-14 h-14 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center text-3xl mb-2 shadow-xl border-2 border-amber-300">
                  <i className="fa-solid fa-atom"></i>
                </div>
                <span className="text-[9px] font-black text-slate-950 uppercase tracking-widest block bg-white/90 px-3 py-0.5 rounded-full mb-1 border border-amber-300">
                  INTI INDUK MOLEKUL
                </span>
                <h3 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-tight italic drop-shadow-sm leading-tight">
                  FRAMEWORK MADEL
                </h3>
                <p className="text-[9px] font-black text-slate-900 mt-1 max-w-[170px] leading-tight">
                  Model Asesmen Digital Evaluasi Literasi
                </p>
              </div>
            </div>

            {/* 5 ION SATELLITE SPHERES (ORBIT MOLEKUL SUB-MODEL) */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 w-full max-w-6xl z-10">
              {subModels.map((m, idx) => (
                <div 
                  key={m.id}
                  className="card-timbul p-5 rounded-[32px] bg-white text-slate-900 border-2 border-slate-200 flex flex-col items-center text-center shadow-2xl hover:translate-y-[-8px] transition-all duration-300 group relative overflow-hidden"
                >
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${m.color} text-white flex items-center justify-center text-2xl shadow-xl border-4 border-white mb-3 ring-4 ring-slate-100`}>
                    <i className={`fa-solid ${m.icon}`}></i>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase mb-1.5 border ${m.accent}`}>
                    Ion Sub-Model #{idx + 1}
                  </span>
                  <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">
                    {m.code}
                  </h4>
                  <p className="text-[9px] font-bold text-slate-500 mt-1 leading-snug line-clamp-2">
                    {m.name}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* RINCIAN DESKRIPSI 5 SUB-MODEL (KARTU TIMBUL 3D) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-16">
            {subModels.map((m, idx) => (
              <div 
                key={m.id} 
                className="card-timbul p-6 rounded-[32px] bg-white text-slate-900 border-2 border-slate-200 flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300"
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
                    onClick={() => router.push(m.id === "madel-5c" ? "/assessment/madel5c" : "/login")}
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
          HALAMAN 3 — VIDEO TUTORIAL TIMBUL (CREAM THEME & TERJAGA 100%)
      ════════════════════════════════════════ */}
      <section id="about" className="relative min-h-screen py-28 px-4 md:px-14 lg:px-20 overflow-hidden bg-[#FAF5EF] border-b-4 border-amber-200">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center gap-10 text-center relative z-10">
          <div className="space-y-3 card-timbul p-6 md:p-8 rounded-[36px] bg-white/95 backdrop-blur-md max-w-2xl mx-auto border-2 border-slate-200">
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
          HALAMAN 4 — FLIPBOOK MANUAL TIMBUL (CREAM THEME & TERJAGA 100%)
      ════════════════════════════════════════ */}
      <section id="manual" className="relative min-h-screen py-28 px-4 md:px-14 lg:px-20 overflow-hidden bg-[#F5EFE6]">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center gap-10 relative z-10">
          <div className="space-y-3 text-center card-timbul p-6 md:p-8 rounded-[36px] bg-white/95 backdrop-blur-md max-w-2xl mx-auto border-2 border-slate-200">
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

