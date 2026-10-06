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
    <div className="font-sans selection:bg-blue-100 overflow-x-hidden bg-slate-900">

      {/* ─── NAVBAR TIMBUL 3D ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md px-4 md:px-10 py-3.5 flex items-center justify-between border-b-4 border-slate-200 shadow-2xl">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-3 border-r border-slate-200 pr-4 md:pr-6 mr-1 md:mr-2">
            <Image src="/logo_madel5c.png" alt="MADEL-5C Logo" width={50} height={50} className="object-contain drop-shadow-md" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg md:text-xl font-black tracking-tighter text-[#1E3A8A] uppercase leading-tight">MADEL-5C</span>
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
          HALAMAN 1 — HERO TIMBUL
      ════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-28 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/bg_landing.jpg"
            alt="Praktek Literasi Digital 1"
            fill
            className="object-cover opacity-90"
            priority
          />
        </div>
        
        <div className="relative z-10 w-full px-4 md:px-14 lg:px-20 max-w-7xl mx-auto">
          <p className="text-xs md:text-xl lg:text-2xl font-black italic text-amber-300 uppercase tracking-tight leading-tight mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] max-w-[90%]">
            HYBRID-DIAGNOSTIC ASSESSMENT PLATFORM (HDAP)
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-[68px] xl:text-[80px] font-black italic text-white uppercase tracking-tighter leading-[1.15] md:leading-none drop-shadow-[0_6px_16px_rgba(0,0,0,0.9)] break-words max-w-5xl">
            E-ASSESSMENT LITERASI DIGITAL.
          </h1>
          
          <div className="mt-8 md:mt-12 max-w-sm md:max-w-lg card-timbul p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-white/95 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md">
                <i className="fa-solid fa-microchip"></i>
              </div>
              <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">IRT & Generative AI Engine</span>
            </div>
            <p className="text-xs md:text-sm text-slate-800 font-bold leading-relaxed">
              Integrasi Analisis Item Response Theory (IRT) dengan kecerdasan Generative AI untuk memetakan profil kompetensi Literasi Digital mahasiswa calon guru secara holistik dan objektif.
            </p>
            <button 
              onClick={() => router.push("/login")}
              className="mt-6 w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl border-b-4 border-indigo-950 active:scale-95 transition-all"
            >
              MULAI SEKARANG <i className="fa-solid fa-rocket ml-2"></i>
            </button>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════
          HALAMAN BARU: FRAMEWORK MADEL & 5 SUB-MODEL (BIOLOGICAL BLOOD VASCULAR CONNECTION NETWORK)
      ════════════════════════════════════════ */}
      <section id="framework" className="relative py-28 px-4 md:px-12 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden border-y-4 border-slate-800">
        
        {/* BACKGROUND ANIMATED BIOLOGICAL BLOOD VESSEL NETWORK SVG */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bloodFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e11d48" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Vascular Capillary Lines */}
            <path d="M150 100 Q 400 300 800 200 T 1400 400" fill="none" stroke="url(#bloodFlow)" strokeWidth="3" filter="url(#glow)" strokeDasharray="8 6" className="animate-pulse" />
            <path d="M100 600 Q 500 400 900 700 T 1500 500" fill="none" stroke="url(#bloodFlow)" strokeWidth="2.5" filter="url(#glow)" strokeDasharray="6 4" />
            <path d="M800 50 L 800 900" fill="none" stroke="url(#bloodFlow)" strokeWidth="3" filter="url(#glow)" strokeDasharray="10 5" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="text-center space-y-3 mb-16">
            <span className="px-4 py-1.5 bg-rose-950/80 text-rose-300 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-rose-800/60 shadow-lg inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span> BIOLOGICAL ARCHITECTURE NETWORK
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black italic text-white uppercase tracking-tight leading-tight drop-shadow-lg">
              KETERHUBUNGAN FRAMEWORK <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-emerald-400 to-cyan-400">MADEL</span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-500 mx-auto rounded-full shadow-lg"></div>
            <p className="text-slate-300 font-bold max-w-3xl mx-auto text-xs md:text-sm leading-relaxed">
              Jaringan pembuluh sistemik utama <strong className="text-white">MADEL (Model Asesmen Digital Evaluasi Literasi)</strong> yang mengalirkan energi & analisis psikometris ke dalam 5 Sub-Model Spesifik.
            </p>
          </div>

          {/* CENTER VASCULAR HEART HUB (MODEL UTAMA MADEL) */}
          <div className="flex justify-center mb-14">
            <div className="card-timbul p-6 md:p-8 rounded-[36px] bg-gradient-to-br from-rose-950/90 via-slate-900 to-slate-950 border-2 border-rose-500/80 shadow-[0_0_50px_rgba(225,29,72,0.35)] text-center max-w-xl relative overflow-hidden group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl border-b-4 border-rose-950 animate-bounce">
                <i className="fa-solid fa-heart-pulse"></i>
              </div>
              <span className="text-[9px] font-black text-rose-400 uppercase tracking-[0.3em] block mb-1">CORE ARTERIAL ENGINE</span>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight italic">
                FRAMEWORK UTAMA MADEL
              </h3>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed mt-2">
                Pusat sirkulasi konseptual & analitis yang memetakan kompetensi literasi digital secara terintegrasi melalui 5 pembuluh sub-model ekosistem riset.
              </p>
            </div>
          </div>

          {/* 5 SUB-MODEL CARDS TIMBUL 3D (VASCULAR BRANCHES) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {subModels.map((m, idx) => (
              <div 
                key={m.id} 
                className="card-timbul p-6 rounded-[32px] bg-white text-slate-900 border-2 border-slate-200 flex flex-col justify-between hover:translate-y-[-6px] transition-all duration-300 relative group overflow-hidden"
              >
                {/* Header Indicator */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border ${m.accent}`}>
                      Sub-Model #{idx + 1}
                    </span>
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${m.color} text-white flex items-center justify-center text-lg shadow-md border-b-2 border-black/30`}>
                      <i className={`fa-solid ${m.icon}`}></i>
                    </div>
                  </div>

                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight italic mb-2">
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
                    Status: <span className="text-emerald-700 font-bold">Terhubung Organik</span>
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
          HALAMAN 2 — VIDEO TUTORIAL TIMBUL (TANPA FILTER)
      ════════════════════════════════════════ */}
      <section id="about" className="relative min-h-screen py-28 px-4 md:px-14 lg:px-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/praktek_2.jpeg"
            alt="Praktek Literasi Digital 2"
            fill
            className="object-cover opacity-90"
          />
        </div>

        <div className="max-w-7xl mx-auto w-full flex flex-col items-center gap-10 text-center relative z-10">
          <div className="space-y-3 card-timbul p-6 md:p-8 rounded-[36px] bg-white/95 backdrop-blur-md max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-5xl font-black italic text-slate-900 uppercase tracking-tighter leading-tight drop-shadow-sm">
              PANDUAN VISUAL PLATFORM
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full shadow-sm"></div>
            <p className="text-slate-800 font-black uppercase tracking-[0.3em] text-[10px]">Video Tutorial Lengkap HDAP</p>
          </div>

          {/* FRAME VIDEO TIMBUL 3D */}
          <div className="w-full max-w-5xl aspect-video bg-slate-950 rounded-3xl md:rounded-[48px] shadow-2xl overflow-hidden border-4 md:border-8 border-white relative group card-timbul">
             <video className="w-full h-full object-contain" controls>
               <source src="/media/video_HDAP.mp4" type="video/mp4" />
             </video>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════
          HALAMAN 3 — FLIPBOOK MANUAL TIMBUL (TANPA FILTER)
      ════════════════════════════════════════ */}
      <section id="manual" className="relative min-h-screen py-28 px-4 md:px-14 lg:px-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/praktek_3.jpeg"
            alt="Praktek Literasi Digital 3"
            fill
            className="object-cover opacity-90"
          />
        </div>

        <div className="max-w-7xl mx-auto w-full flex flex-col items-center gap-10 relative z-10">
          <div className="space-y-3 text-center card-timbul p-6 md:p-8 rounded-[36px] bg-white/95 backdrop-blur-md max-w-2xl mx-auto">
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
      <footer className="bg-white text-slate-900 py-12 px-6 md:px-14 border-t-4 border-slate-200">
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

