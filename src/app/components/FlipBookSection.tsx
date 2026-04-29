"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import HTMLFlipBook from "react-pageflip";
import { useRouter } from "next/navigation";

const PageItem = React.forwardRef((props: any, ref: any) => {
  return (
    <div className="bg-white shadow-2xl overflow-hidden border-x border-slate-100" ref={ref} data-density={props.density || "soft"}>
      <div className="h-full w-full flex flex-col items-center justify-center p-8 md:p-14 relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-300 tracking-[0.5em] uppercase">
          HALAMAN {props.number} / 8
        </div>
        
        <div className="w-full flex flex-col items-center justify-center text-center">
          {props.children}
        </div>
      </div>
    </div>
  );
});
PageItem.displayName = "PageItem";

export default function FlipBookSection() {
  const bookRef = useRef<any>(null);
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const pageWidth = isMobile ? Math.min(windowWidth - 40, 360) : 460;
  const pageHeight = pageWidth * 1.4;

  if (!mounted) return null;

  return (
    <div className="w-full flex flex-col items-center relative pt-0">
      
      {/* ── HEADER MELAYANG (Agar tidak mendorong buku ke bawah) ── */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 pointer-events-auto">
          <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Visual Guide</span>
        </div>
        <a 
          href="/media/Panduan_Website_HDAP.pdf" 
          download 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 pointer-events-auto"
        >
          <i className="fa-solid fa-file-pdf"></i> PDF
        </a>
      </div>

      {/* ── BUKU (Sekarang akan sejajar dengan Video karena header sudah melayang) ── */}
      <div className="relative flex justify-center w-full">
        {/* @ts-ignore */}
        <HTMLFlipBook 
          width={pageWidth} 
          height={pageHeight} 
          size="fixed"
          minWidth={pageWidth}
          maxWidth={pageWidth}
          minHeight={pageHeight}
          maxHeight={pageHeight}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={true} 
          startPage={0}
          showCover={false}
          mobileScrollSupport={true}
          ref={bookRef}
          className="mx-auto shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] rounded-[32px] overflow-hidden"
        >
          {/* 1. COVER */}
          <PageItem number={1} density="hard">
            <div className="h-full flex flex-col items-center justify-center bg-[#1E3A8A] text-white p-10 relative">
              <Image src="/unj_bg.png" alt="BG" fill className="object-cover opacity-10" />
              <div className="relative z-10 flex flex-col items-center mt-10">
                 <div className="w-16 h-16 bg-blue-500 rounded-3xl flex items-center justify-center shadow-2xl mb-8">
                    <i className="fa-solid fa-laptop-medical text-3xl"></i>
                 </div>
                 <h1 className="text-2xl font-black italic tracking-tighter uppercase text-center leading-none">HDAP PORTAL<br/>USER GUIDE</h1>
                 <div className="w-12 h-1 bg-white mt-6 mb-4"></div>
                 <p className="text-[10px] font-bold text-blue-300 uppercase tracking-[0.3em]">Official v1.0</p>
              </div>
            </div>
          </PageItem>

          {/* 2. PENDAHULUAN */}
          <PageItem number={2}>
            <div className="space-y-6 pt-10">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">PENDAHULUAN</h3>
              <div className="w-10 h-1 bg-blue-600 mx-auto"></div>
              <p className="text-xs text-slate-600 font-bold leading-relaxed text-center px-4">
                Platform **HDAP** mengintegrasikan Psikometrik Modern dan AI untuk mendiagnosis kompetensi Literasi Digital.
              </p>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
                 <Image src="/unj_bg.png" alt="Hero" fill className="object-cover" />
              </div>
            </div>
          </PageItem>

          {/* SISA HALAMAN... */}
          <PageItem number={3}>
            <div className="space-y-6 pt-10 w-full">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">TEKNIS</h3>
              <div className="w-10 h-1 bg-blue-600 mx-auto"></div>
              <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100 mx-4">
                 <i className="fa-solid fa-wifi text-blue-600"></i>
                 <p className="text-[10px] font-black text-slate-800 uppercase text-left">Gunakan Koneksi Internet Stabil</p>
              </div>
            </div>
          </PageItem>

          <PageItem number={4}>
            <div className="space-y-4 pt-10 w-full">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">LOGIN PORTAL</h3>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-50">
                 <Image src="/unj_bg.png" alt="Login" fill className="object-cover" />
              </div>
              <p className="text-[10px] text-slate-600 font-bold leading-relaxed px-4 text-center">Masuk dengan Role **Responden**.</p>
            </div>
          </PageItem>

          <PageItem number={5}>
            <div className="space-y-4 pt-10 w-full">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">DASHBOARD</h3>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-50">
                 <Image src="/dashboard_v2.png" alt="Dashboard" fill className="object-cover" />
              </div>
              <p className="text-[10px] text-slate-600 font-bold leading-relaxed px-4 text-center">Klik **MULAI** untuk mengerjakan soal.</p>
            </div>
          </PageItem>

          <PageItem number={6}>
            <div className="space-y-4 pt-10 w-full">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">REFLEKSI</h3>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-50">
                 <Image src="/unj_bg.png" alt="Refleksi" fill className="object-cover" />
              </div>
              <p className="text-[10px] text-slate-600 font-bold leading-relaxed px-4 text-center">Analisis Skenario Situasi.</p>
            </div>
          </PageItem>

          <PageItem number={7}>
            <div className="space-y-4 pt-10 w-full">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">HASIL AKHIR</h3>
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl scale-90">
                 <Image src="/unj_bg.png" alt="Result" fill className="object-cover" />
              </div>
              <p className="text-[9px] text-slate-600 font-bold leading-relaxed uppercase">Grafik Radar Kompetensi.</p>
            </div>
          </PageItem>

          <PageItem number={8} density="hard">
            <div className="h-full flex flex-col items-center justify-center bg-slate-900 text-white relative">
              <Image src="/unj_bg.png" alt="BG" fill className="object-cover opacity-30" />
              <div className="relative z-10 flex flex-col items-center">
                 <h3 className="text-3xl font-black italic uppercase mb-2">SIAP MULAI?</h3>
                 <button 
                   onClick={() => router.push("/login")}
                   className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase shadow-2xl transition-all active:scale-95"
                 >
                   PORTAL LOGIN
                 </button>
              </div>
            </div>
          </PageItem>
        </HTMLFlipBook>
      </div>

      {/* Kontrol Navigasi (Pindah ke bawah agar tidak ganggu perataan atas) */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button 
          onClick={() => bookRef.current?.pageFlip().flipPrev()}
          className="w-10 h-10 rounded-xl bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-blue-600 active:scale-90 transition-all border border-slate-100"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button 
          onClick={() => bookRef.current?.pageFlip().flipNext()}
          className="w-10 h-10 rounded-xl bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-blue-600 active:scale-90 transition-all border border-slate-100"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}
