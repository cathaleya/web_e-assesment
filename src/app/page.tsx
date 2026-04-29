"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

// Import FlipBookSection secara dinamis untuk menghindari error SSR di VPS
const FlipBookSection = dynamic(() => import("./components/FlipBookSection"), { 
  ssr: false,
  loading: () => <div className="text-white font-black animate-pulse">MEMUAT PANDUAN INTERAKTIF...</div>
});

export default function Home() {
  const router = useRouter();

  return (
    <div className="font-sans selection:bg-blue-100 overflow-x-hidden">

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm px-6 md:px-12 py-4 flex items-center justify-between border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#2563EB] rounded-xl flex items-center justify-center text-white shadow-md">
            <i className="fa-solid fa-graduation-cap text-xl"></i>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tighter text-[#1E3A8A] uppercase">MADEL5C</span>
            <span className="text-[9px] font-black text-[#2563EB] uppercase tracking-[0.2em]">E-ASSESSMENT PLATFORM</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <a href="#about" className="text-[11px] font-bold text-slate-600 uppercase tracking-widest hover:text-blue-600 transition-colors">
            TENTANG PLATFORM
          </a>
          <a href="/buku-panduan" className="text-[11px] font-bold text-slate-600 uppercase tracking-widest hover:text-blue-600 transition-colors">
            BUKU PANDUAN
          </a>
          <a
            href="https://e-assessment.id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-slate-600 uppercase tracking-widest hover:text-blue-600 transition-colors"
          >
            WEBSITE PAYUNG RISET
          </a>
          <button
            onClick={() => router.push("/login")}
            className="ml-4 px-7 py-2.5 bg-[#2563EB] text-white rounded-lg text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/25 hover:bg-blue-700 active:scale-95 transition-all"
          >
            MASUK PORTAL
          </button>
        </div>

        <button
          onClick={() => router.push("/login")}
          className="lg:hidden px-5 py-2 bg-[#2563EB] text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md"
        >
          MASUK PORTAL
        </button>
      </nav>

      {/* ════════════════════════════════════════
          HALAMAN 1 — HERO
      ════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/unj_bg.png"
            alt="Universitas Negeri Jakarta"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 w-full px-6 md:px-14 lg:px-20">
          <p className="text-sm md:text-2xl lg:text-[28px] font-black italic text-[#4338CA] uppercase tracking-tight whitespace-nowrap leading-none mb-2">
            HYBRID-DIAGNOSTIC ASSESSMENT PLATFORM (HDAP)
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-[75px] xl:text-[90px] font-black italic text-[#2563EB] uppercase tracking-tighter leading-none whitespace-nowrap">
            E-ASSESSMEN LITERASI DIGITAL.
          </h1>
          <div className="mt-10 md:mt-16 max-w-xs md:max-w-md bg-white/70 backdrop-blur-lg p-5 md:p-8 rounded-3xl border border-white/50 shadow-xl">
            <p className="text-sm md:text-base text-slate-800 font-bold leading-relaxed">
              Tehnik Analisis Item Response Theory dengan kecerdasan Generative AI untuk memetakan kompetensi Literasi Digital secara objektif.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HALAMAN 2 — TENTANG PLATFORM & VIDEO/PDF
      ════════════════════════════════════════ */}
      <section id="about" className="relative min-h-[140vh] py-24 px-6 md:px-14 lg:px-20 flex flex-col justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/unj_bg.png"
            alt="Universitas Negeri Jakarta"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col gap-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg">
                TENTANG PLATFORM & PANDUAN
              </h2>
              <p className="text-blue-200 font-bold uppercase tracking-[0.3em] mt-2">Hybrid-Diagnostic Assessment Ecosystem</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
            
            {/* KIRI: Video Tutorial */}
            <div className="flex flex-col gap-6">
              <div className="bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden border-4 border-white/10 relative group aspect-video">
                <div className="absolute top-5 left-5 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-[11px] font-black text-white uppercase tracking-widest">Tutorial Video</span>
                </div>
                <video className="w-full h-full object-contain" controls>
                  <source src="/media/Panduan_Platform_HDAP.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-xl">
                 <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">Platform HDAP (Hybrid-Diagnostic Assessment Platform)</h4>
                 <p className="text-sm text-slate-600 font-semibold leading-relaxed text-justify">
                   Integrasi Psikometrik Modern (Model Rasch) dan Generative AI untuk pemetaan profil Literasi Digital mahasiswa calon guru secara objektif. Sistem ini memberikan diagnosa kualitatif yang personal dan mendalam bagi setiap responden.
                 </p>
              </div>
            </div>

            {/* KANAN: PDF Flipbook (LOAD SECARA DINAMIS) */}
            <div className="flex flex-col gap-6 items-center">
               <FlipBookSection />
            </div>

          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-900 text-white py-10 px-6 md:px-14">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#2563EB] rounded-lg flex items-center justify-center text-white shadow">
              <i className="fa-solid fa-graduation-cap text-base"></i>
            </div>
            <div>
              <span className="font-black text-base tracking-tight block">MADEL5C · HDAP</span>
              <span className="text-slate-400 text-[10px] font-bold">Hybrid-Diagnostic Assessment Platform</span>
            </div>
          </div>
          <div className="text-center md:text-right">
            <a href="mailto:ruslina.irianty@mhs.unj.ac.id" className="text-blue-400 hover:text-blue-300 text-xs font-bold transition-colors">
              ruslina.irianty@mhs.unj.ac.id
            </a>
            <p className="text-slate-600 text-[10px] mt-1 font-bold uppercase tracking-widest">
              © 2025 HDAP. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .react-pdf__Page__canvas {
          margin: 0 auto;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
      `}</style>

    </div>
  );
}
