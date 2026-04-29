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
          HALAMAN 1 — HERO (JUDUL ASLI DIKEMBALIKAN)
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
          {/* Tanpa Filter/Overlay sesuai permintaan */}
        </div>
        <div className="relative z-10 w-full px-6 md:px-14 lg:px-20">
          <p className="text-sm md:text-2xl lg:text-[28px] font-black italic text-[#4338CA] uppercase tracking-tight whitespace-nowrap leading-none mb-2 drop-shadow-sm">
            HYBRID-DIAGNOSTIC ASSESSMENT PLATFORM (HDAP)
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-[75px] xl:text-[90px] font-black italic text-[#2563EB] uppercase tracking-tighter leading-none whitespace-nowrap drop-shadow-md">
            E-ASSESSMEN LITERASI DIGITAL.
          </h1>
          
          <div className="mt-12 md:mt-20 max-w-xs md:max-w-md bg-white/70 backdrop-blur-lg p-5 md:p-8 rounded-3xl border border-white/50 shadow-xl">
            <p className="text-sm md:text-base text-slate-800 font-bold leading-relaxed">
              Integrasi Analisis Item Response Theory dengan kecerdasan Generative AI untuk memetakan kompetensi Literasi Digital secara objektif.
            </p>
            <button 
              onClick={() => router.push("/login")}
              className="mt-6 px-8 py-3 bg-[#2563EB] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all active:scale-95"
            >
              MULAI SEKARANG
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HALAMAN 2 — VIDEO TUTORIAL (BESAR)
      ════════════════════════════════════════ */}
      <section id="about" className="relative min-h-screen py-32 px-6 md:px-14 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center gap-16 text-center">
          
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black italic text-slate-900 uppercase tracking-tighter leading-none">
              PANDUAN VISUAL PLATFORM
            </h2>
            <div className="w-24 h-2 bg-blue-600 mx-auto rounded-full"></div>
            <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">Video Tutorial Lengkap</p>
          </div>

          <div className="w-full max-w-6xl aspect-video bg-slate-900 rounded-[48px] shadow-2xl overflow-hidden border-4 border-slate-100 relative group">
             <video className="w-full h-full object-contain" controls>
               <source src="/media/video_HDAP.mp4" type="video/mp4" />
             </video>
             <div className="absolute top-8 left-8 z-10 flex items-center gap-3 bg-black/60 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl border border-white/20">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest italic">Tutorial Video</span>
             </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HALAMAN 3 — FLIPBOOK MANUAL (DI BAWAH)
      ════════════════════════════════════════ */}
      <section className="relative min-h-screen py-32 px-6 md:px-14 lg:px-20 bg-slate-50">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center gap-16 relative z-10">
          
          <div className="space-y-4 text-center">
            <h2 className="text-4xl md:text-6xl font-black italic text-slate-900 uppercase tracking-tighter leading-none">
              BUKU PANDUAN DIGITAL
            </h2>
            <div className="w-24 h-2 bg-blue-600 mx-auto rounded-full"></div>
            <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">Manual Penggunaan Platform</p>
          </div>

          <div className="w-full flex justify-center">
             <FlipBookSection />
          </div>

        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-white text-slate-900 py-16 px-6 md:px-14 border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl">
              <i className="fa-solid fa-graduation-cap text-lg"></i>
            </div>
            <div>
              <span className="font-black text-lg tracking-tighter block uppercase">MADEL5C · HDAP</span>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Institutional Research Platform</span>
            </div>
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            © 2025 HDAP. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
