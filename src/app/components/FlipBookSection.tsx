"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import HTMLFlipBook from "react-pageflip";
import { useRouter } from "next/navigation";

const PageItem = React.forwardRef((props: any, ref: any) => {
  return (
    <div className="bg-white shadow-2xl overflow-hidden border border-slate-100" ref={ref} data-density={props.density || "soft"}>
      <div className="h-full w-full flex flex-col items-center justify-center p-6 md:p-10 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-30"></div>
        <div className="absolute bottom-4 right-6 text-[8px] font-black text-slate-300 tracking-widest uppercase">
          PG {props.number}
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
  const isTablet = windowWidth >= 768 && windowWidth < 1280;
  
  // Penyesuaian ukuran agar pas berdampingan dengan video
  let pageWidth = 320; // Default desktop (Side-by-side)
  if (isMobile) pageWidth = Math.min(windowWidth - 60, 340);
  if (isTablet) pageWidth = 380;

  const pageHeight = pageWidth * 1.4;

  if (!mounted) return null;

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Header Kecil */}
      <div className="flex items-center justify-between w-full mb-6 gap-4 px-2">
        <div className="hidden md:block">
          <h4 className="text-xs font-black text-white uppercase tracking-widest italic">Quick Guide</h4>
        </div>
        <a 
          href="/media/Panduan_Website_HDAP.pdf" 
          download 
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
        >
          <i className="fa-solid fa-file-pdf"></i> PDF
        </a>
      </div>

      {/* Book Container - Dibuat sedikit ke kiri dengan margin negatif jika diperlukan */}
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
          usePortrait={isMobile}
          startPage={0}
          showCover={true}
          mobileScrollSupport={true}
          ref={bookRef}
          className="shadow-2xl"
        >
          {/* 1. COVER */}
          <PageItem number={1} density="hard">
            <div className="h-full flex flex-col items-center justify-center bg-slate-900 p-8 text-white relative">
              <Image src="/unj_bg.png" alt="BG" fill className="object-cover opacity-10" />
              <div className="relative z-10 flex flex-col items-center">
                 <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
                    <i className="fa-solid fa-book-open text-3xl"></i>
                 </div>
                 <h1 className="text-2xl font-black italic tracking-tighter uppercase text-center">USER GUIDE</h1>
                 <p className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.3em] mt-2">HDAP PLATFORM</p>
              </div>
            </div>
          </PageItem>

          {/* 2. PENDAHULUAN */}
          <PageItem number={2}>
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">PENDAHULUAN</h3>
              <div className="w-8 h-1 bg-blue-600 mx-auto"></div>
              <p className="text-[11px] text-slate-600 font-bold leading-relaxed text-center">
                Platform **HDAP** memetakan literasi digital mahasiswa dengan presisi tinggi melalui integrasi Rasch Model & Generative AI.
              </p>
            </div>
          </PageItem>

          {/* 3. PERSIAPAN TEKNIS */}
          <PageItem number={3}>
            <div className="space-y-4 text-left w-full">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic text-center">TEKNIS</h3>
              <div className="w-8 h-1 bg-blue-600 mx-auto mb-4"></div>
              <ul className="text-[10px] text-slate-600 font-bold space-y-3 px-2">
                <li className="flex items-center gap-2"><i className="fa-solid fa-wifi text-blue-500"></i> Internet Stabil</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-globe text-blue-500"></i> Google Chrome</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-user-circle text-blue-500"></i> Akun Login</li>
              </ul>
            </div>
          </PageItem>

          {/* 4. ALUR ASESMEN */}
          <PageItem number={4}>
            <div className="space-y-4 w-full">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">ALUR</h3>
              <div className="w-8 h-1 bg-blue-600 mx-auto"></div>
              <div className="space-y-2">
                 <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-[10px]">1</span>
                    <p className="text-[10px] font-bold text-slate-700">Masuk Portal</p>
                 </div>
                 <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-[10px]">2</span>
                    <p className="text-[10px] font-bold text-slate-700">Pilih Instrumen</p>
                 </div>
              </div>
            </div>
          </PageItem>

          {/* 5. DIAGNOSA AI */}
          <PageItem number={5}>
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">DIAGNOSA AI</h3>
              <div className="w-8 h-1 bg-indigo-600 mx-auto"></div>
              <p className="text-[11px] text-slate-600 font-bold leading-relaxed text-center">
                AI menganalisis pola jawaban untuk memberikan saran pedagogis personal seketika.
              </p>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-200">
                 <Image src="/unj_bg.png" alt="AI" fill className="object-cover opacity-50" />
              </div>
            </div>
          </PageItem>

          {/* 6. SIAP MULAI? */}
          <PageItem number={6} density="hard">
            <div className="h-full flex flex-col items-center justify-center bg-slate-900 text-white relative">
              <Image src="/unj_bg.png" alt="BG" fill className="object-cover opacity-30" />
              <div className="relative z-10 flex flex-col items-center p-4">
                 <h3 className="text-xl font-black italic uppercase mb-4 text-center">SIAP MULAI?</h3>
                 <button 
                   onClick={() => router.push("/login")}
                   className="px-6 py-2 bg-blue-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95"
                 >
                   MASUK
                 </button>
              </div>
            </div>
          </PageItem>
        </HTMLFlipBook>
      </div>

      {/* Controls Sederhana */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button 
          onClick={() => bookRef.current?.pageFlip().flipPrev()}
          className="w-10 h-10 rounded-xl bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-blue-600 active:scale-90 transition-all"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button 
          onClick={() => bookRef.current?.pageFlip().flipNext()}
          className="w-10 h-10 rounded-xl bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-blue-600 active:scale-90 transition-all"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}
