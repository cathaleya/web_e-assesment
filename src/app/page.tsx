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

  return (
    <div className="font-sans selection:bg-blue-100 overflow-x-hidden">

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm px-6 md:px-12 py-3 flex items-center justify-between border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-slate-200 pr-4 mr-2">
            <Image src="/logo_unj.png" alt="UNJ" width={35} height={35} className="object-contain" />
            <Image src="/logo_dikti.png" alt="DIKTI" width={35} height={35} className="object-contain" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-tighter text-[#1E3A8A] uppercase">MADEL5C</span>
            <span className="text-[8px] font-black text-[#2563EB] uppercase tracking-[0.2em]">E-ASSESSMENT PLATFORM</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <a href="#about" className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:text-blue-600 transition-colors">
            TENTANG PLATFORM
          </a>
          <a href="/buku-panduan" className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:text-blue-600 transition-colors">
            BUKU PANDUAN
          </a>
          <button
            onClick={() => router.push("/login")}
            className="ml-4 px-6 py-2 bg-[#2563EB] text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
          >
            MASUK PORTAL
          </button>
        </div>
      </nav>

      {/* ════════════════════════════════════════
          HALAMAN 1 — HERO (BACKGROUND PRAKTEK)
      ════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/praktek.jpeg"
            alt="Praktek Literasi Digital"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 w-full px-6 md:px-14 lg:px-20 text-white">
          <p className="text-sm md:text-2xl font-black italic uppercase tracking-tight mb-2 opacity-90">
            HYBRID-DIAGNOSTIC ASSESSMENT PLATFORM (HDAP)
          </p>
          <h1 className="text-4xl md:text-7xl lg:text-[100px] font-black italic uppercase tracking-tighter leading-[0.85] drop-shadow-2xl">
            OPTIMALISASI<br/>LITERASI DIGITAL.
          </h1>
          <div className="mt-12 max-w-lg bg-white/10 backdrop-blur-xl p-8 rounded-[40px] border border-white/20 shadow-2xl">
            <p className="text-base md:text-lg font-bold leading-relaxed">
              Transformasi pengukuran kompetensi digital mahasiswa melalui integrasi Rasch Model & Generative AI yang akurat dan terpercaya.
            </p>
            <button 
              onClick={() => router.push("/login")}
              className="mt-8 px-10 py-4 bg-white text-blue-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all active:scale-95"
            >
              MULAI ASESMEN SEKARANG
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HALAMAN 2 — VIDEO TUTORIAL (BESAR)
      ════════════════════════════════════════ */}
      <section id="about" className="relative min-h-screen py-32 px-6 md:px-14 lg:px-20 bg-slate-50">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center gap-16 text-center">
          
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black italic text-slate-900 uppercase tracking-tighter leading-none">
              PANDUAN VISUAL PLATFORM
            </h2>
            <div className="w-24 h-2 bg-blue-600 mx-auto rounded-full"></div>
            <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">Tonton Video Tutorial Lengkap di Bawah Ini</p>
          </div>

          {/* VIDEO TUTORIAL - DIPERBESAR */}
          <div className="w-full max-w-6xl aspect-video bg-slate-900 rounded-[48px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border-8 border-white relative group">
             <video className="w-full h-full object-cover" controls poster="/media/praktek.jpeg">
               <source src="/media/video_HDAP.mp4" type="video/mp4" />
             </video>
             <div className="absolute top-8 left-8 z-10 flex items-center gap-3 bg-red-600 text-white px-6 py-3 rounded-2xl shadow-xl border border-red-500/50">
                <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                <span className="text-xs font-black uppercase tracking-widest italic">Official Tutorial</span>
             </div>
          </div>

          <div className="max-w-3xl">
             <p className="text-lg text-slate-600 font-semibold leading-relaxed">
               Pelajari langkah-langkah penggunaan platform HDAP secara komprehensif. Mulai dari pendaftaran akun, pemilihan instrumen MADEL5C, hingga membaca hasil diagnosis AI secara personal.
             </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HALAMAN 3 — FLIPBOOK MANUAL (DI BAWAH)
      ════════════════════════════════════════ */}
      <section className="relative min-h-screen py-32 px-6 md:px-14 lg:px-20 bg-[#1E3A8A]">
        <div className="absolute inset-0 opacity-10">
           <Image src="/unj_bg.png" alt="BG" fill className="object-cover grayscale" />
        </div>
        
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center gap-16 relative z-10">
          
          <div className="space-y-4 text-center">
            <h2 className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter leading-none">
              BUKU PANDUAN DIGITAL
            </h2>
            <div className="w-24 h-2 bg-blue-400 mx-auto rounded-full"></div>
            <p className="text-blue-200 font-black uppercase tracking-[0.4em] text-[10px]">Silakan balik halaman untuk membaca detail teknis</p>
          </div>

          {/* FLIPBOOK - SEKARANG DI BAWAH VIDEO & FULL WIDTH */}
          <div className="w-full flex justify-center">
             <FlipBookSection />
          </div>

        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-950 text-white py-16 px-6 md:px-14 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <i className="fa-solid fa-graduation-cap text-xl"></i>
            </div>
            <div>
              <span className="font-black text-xl tracking-tighter block uppercase">MADEL5C · HDAP</span>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Institutional Research Platform</span>
            </div>
          </div>
          <div className="flex gap-8">
             <a href="#" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Support</a>
             <a href="#" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Documentation</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
