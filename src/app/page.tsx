"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HTMLFlipBook from "react-pageflip";

// Komponen Halaman Flipbook
const Page = React.forwardRef((props: any, ref: any) => {
  return (
    <div className="bg-white shadow-lg border border-slate-100" ref={ref} data-density="hard">
      <div className="h-full flex flex-col p-6 md:p-10 relative overflow-hidden">
        {/* Page Number */}
        <div className="absolute bottom-4 right-6 text-[9px] font-black text-slate-300 tracking-widest">
           PAGE {props.number}
        </div>
        {props.children}
      </div>
    </div>
  );
});
Page.displayName = "Page";

export default function Home() {
  const router = useRouter();
  const bookRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Konten Halaman Panduan untuk Landing Page
  const PANDUAN_PAGES = [
    {
      type: "cover",
      image: "/buku_cover.png",
      title: "PANDUAN HDAP",
      subtitle: "Hybrid-Diagnostic Assessment Platform"
    },
    {
      type: "content",
      title: "PENDAHULUAN",
      content: `Platform ini dirancang untuk memetakan literasi digital mahasiswa dengan presisi tinggi. Menggunakan gabungan Item Response Theory dan Generative AI.`
    },
    {
      type: "content",
      title: "ALUR PENGGUNAAN",
      content: `1. Login menggunakan akun mahasiswa.\n2. Pilih instrumen yang tersedia.\n3. Kerjakan soal SJT dengan jujur.\n4. Dapatkan diagnosa AI seketika.`
    },
    {
      type: "content",
      title: "DIAGNOSA AI",
      content: `AI akan menganalisis pola jawaban Anda dan memberikan narasi bimbingan yang mendalam tentang area yang perlu Anda tingkatkan.`
    },
    {
      type: "image",
      image: "/dashboard_v2.png",
      caption: "Tampilan Dashboard Mahasiswa"
    },
    {
      type: "cover",
      image: "/unj_bg.png",
      title: "SIAP MULAI?",
      subtitle: "Riset BIMA - UNJ 2025"
    }
  ];

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

        {/* Mobile */}
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
          HALAMAN 2 — TENTANG PLATFORM & PANDUAN
      ════════════════════════════════════════ */}
      <section id="about" className="relative min-h-screen py-24 px-6 md:px-14 lg:px-20 flex flex-col justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/unj_bg.png"
            alt="Universitas Negeri Jakarta"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <h2 className="text-2xl md:text-4xl font-black italic text-white uppercase tracking-tight mb-10 drop-shadow-md">
            TENTANG PLATFORM
          </h2>

          <div className="flex flex-col gap-12">
            {/* ── BARIS 1: Tentang & Video ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              
              {/* KARTU 1: Tentang Platform */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl p-8 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                    <i className="fa-solid fa-info-circle text-3xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Platform HDAP</h3>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Hybrid-Diagnostic Assessment</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm md:text-base text-slate-700 font-semibold leading-relaxed text-justify">
                    <strong>HDAP</strong> adalah sistem penilaian cerdas yang dirancang untuk memetakan profil literasi digital mahasiswa calon guru secara objektif dan mendalam menggunakan integrasi <strong>Model Rasch (IRT)</strong> dan <strong>Generative AI</strong>.
                  </p>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed text-justify">
                    Platform ini memberikan diagnosa personal berupa narasi bimbingan pedagogis yang membantu mahasiswa memahami kelemahan literasi digital mereka secara spesifik.
                  </p>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4">
                  <button
                    onClick={() => router.push("/login")}
                    className="py-3.5 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/25 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-play"></i> MULAI ASESMEN
                  </button>
                  <a
                    href="/media/Panduan_Website_HDAP.pdf"
                    download
                    className="py-3.5 bg-white border-2 border-slate-200 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-download"></i> UNDUH PDF
                  </a>
                </div>
              </div>

              {/* KARTU 2: Video Tutorial */}
              <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col relative group">
                <div className="absolute top-5 left-5 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Video Tutorial</span>
                </div>
                <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px]">
                  <video className="w-full h-full object-contain" controls>
                    <source src="/media/Panduan_Platform_HDAP.mp4" type="video/mp4" />
                    Your browser does not support video.
                  </video>
                </div>
                <div className="p-5 bg-slate-800/50 border-t border-white/5">
                  <p className="text-sm font-black text-white uppercase tracking-tight">Panduan Operasional Platform</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">Pelajari alur penggunaan sistem dari awal hingga akhir.</p>
                </div>
              </div>
            </div>

            {/* ── BARIS 2: Flipbook Panduan AKTIF ── */}
            <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-6 md:p-10 border border-white/30 shadow-xl flex flex-col items-center">
              <div className="text-center mb-10">
                <h3 className="text-xl md:text-3xl font-black italic text-[#1E3A8A] uppercase tracking-tighter">Flipbook Panduan Interaktif</h3>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Buka Halaman Langsung Di Sini</p>
              </div>

              {mounted && (
                <div className="relative group">
                  {/* @ts-ignore */}
                  <HTMLFlipBook 
                    width={350} 
                    height={500} 
                    size="stretch"
                    minWidth={300}
                    maxWidth={1000}
                    minHeight={400}
                    maxHeight={1533}
                    drawShadow={true}
                    flippingTime={1000}
                    usePortrait={true}
                    startPage={0}
                    showCover={true}
                    mobileScrollSupport={true}
                    ref={bookRef}
                    className="shadow-2xl rounded-lg"
                  >
                    {PANDUAN_PAGES.map((page, index) => (
                      <Page key={index} number={index + 1}>
                        {page.type === "cover" ? (
                          <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="relative w-full aspect-[3/4] mb-6 rounded-xl overflow-hidden shadow-xl">
                              <Image src={page.image!} alt={page.title!} fill className="object-cover" />
                            </div>
                            <h3 className="text-xl font-black text-[#1E3A8A] uppercase tracking-tighter mb-1 italic">{page.title}</h3>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{page.subtitle}</p>
                          </div>
                        ) : page.type === "image" ? (
                          <div className="h-full flex flex-col">
                             <div className="relative w-full flex-1 rounded-xl overflow-hidden shadow-inner bg-slate-50 mb-4">
                                <Image src={page.image!} alt="Illustration" fill className="object-cover" />
                             </div>
                             <p className="text-[9px] font-bold text-slate-500 italic text-center uppercase tracking-widest">
                                {page.caption}
                             </p>
                          </div>
                        ) : (
                          <div className="h-full flex flex-col">
                            <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4 border-b pb-2">
                               {page.title}
                            </h4>
                            <p className="text-[12px] text-slate-700 font-bold leading-relaxed text-justify whitespace-pre-line">
                              {page.content}
                            </p>
                          </div>
                        )}
                      </Page>
                    ))}
                  </HTMLFlipBook>
                  
                  {/* Controls */}
                  <div className="mt-8 flex items-center justify-center gap-6">
                    <button 
                      onClick={() => bookRef.current.pageFlip().flipPrev()}
                      className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-400 hover:text-blue-600 active:scale-90 transition-all"
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gunakan mouse/jari untuk membalik halaman</span>
                    <button 
                      onClick={() => bookRef.current.pageFlip().flipNext()}
                      className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-400 hover:text-blue-600 active:scale-90 transition-all"
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              )}
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

    </div>
  );
}
