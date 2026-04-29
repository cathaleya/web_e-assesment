"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import HTMLFlipBook from "react-pageflip";
import { useRouter } from "next/navigation";

const PageItem = React.forwardRef((props: any, ref: any) => {
  return (
    <div className="bg-white shadow-2xl overflow-hidden border border-slate-100" ref={ref} data-density={props.density || "soft"}>
      <div className="h-full w-full flex flex-col items-center justify-center p-8 md:p-12 relative">
        {/* Page Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-50"></div>
        <div className="absolute bottom-6 right-8 text-[9px] font-black text-slate-300 tracking-[0.3em] uppercase">
          HDAP GUIDE • PG {props.number}
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
  const pageWidth = isMobile ? Math.min(windowWidth - 40, 360) : 480;
  const pageHeight = pageWidth * 1.41; // Golden ratio for books

  if (!mounted) return null;

  return (
    <div className="bg-white/30 backdrop-blur-3xl rounded-[40px] p-6 md:p-10 border border-white/40 shadow-2xl w-full flex flex-col items-center overflow-hidden">
      
      {/* Header with Download Button */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full mb-10 gap-6 px-4">
        <div className="text-center md:text-left">
          <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Panduan Cepat Website</h4>
          <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mt-1">
             Navigasi Cerdas & Operasional Platform HDAP
          </p>
        </div>
        <a 
          href="/media/Panduan_Website_HDAP.pdf" 
          download 
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl active:scale-95"
        >
          <i className="fa-solid fa-file-pdf"></i> Download PDF Lengkap
        </a>
      </div>

      <div className="relative w-full flex justify-center perspective-1000">
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
          className="mx-auto shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
        >
          {/* 1. COVER EXCLUSIVE */}
          <PageItem number={1} density="hard">
            <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1E3A8A] to-[#0F172A] p-12 text-white relative">
              <Image src="/unj_bg.png" alt="BG" fill className="object-cover opacity-10" />
              <div className="relative z-10 flex flex-col items-center">
                 <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl mb-8">
                    <i className="fa-solid fa-book-open text-4xl"></i>
                 </div>
                 <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">USER MANUAL</h1>
                 <p className="text-[11px] font-bold text-blue-400 uppercase tracking-[0.4em] mb-12">Platform HDAP v1.0</p>
                 <div className="w-12 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
          </PageItem>

          {/* 2. PENDAHULUAN (Fit to center) */}
          <PageItem number={2}>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                <i className="fa-solid fa-star text-2xl"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">PENDAHULUAN</h3>
              <div className="w-10 h-1 bg-blue-600 mx-auto"></div>
              <p className="text-sm text-slate-600 font-semibold leading-relaxed text-center px-4">
                Selamat datang di platform **HDAP**. Aplikasi ini dirancang untuk memetakan literasi digital Anda dengan akurasi tinggi melalui integrasi Model Rasch dan Generative AI.
              </p>
            </div>
          </PageItem>

          {/* 3. PERSIAPAN TEKNIS */}
          <PageItem number={3}>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                <i className="fa-solid fa-laptop-code text-2xl"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">PERSIAPAN TEKNIS</h3>
              <div className="w-10 h-1 bg-blue-600 mx-auto"></div>
              <ul className="text-[12px] text-slate-600 font-bold space-y-4 text-left inline-block">
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-check-circle text-green-500"></i> Koneksi Internet Stabil
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-check-circle text-green-500"></i> Browser (Chrome/Edge Terbaru)
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-check-circle text-green-500"></i> Akun Mahasiswa Terdaftar
                </li>
              </ul>
            </div>
          </PageItem>

          {/* 4. ALUR ASESMEN */}
          <PageItem number={4}>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                <i className="fa-solid fa-list-ol text-2xl"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">ALUR ASESMEN</h3>
              <div className="w-10 h-1 bg-blue-600 mx-auto"></div>
              <div className="grid grid-cols-1 gap-4 text-left">
                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">1</span>
                    <p className="text-[11px] font-bold text-slate-700">Login ke Portal</p>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">2</span>
                    <p className="text-[11px] font-bold text-slate-700">Pilih Instrumen MADEL5C</p>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">3</span>
                    <p className="text-[11px] font-bold text-slate-700">Kerjakan hingga Selesai</p>
                 </div>
              </div>
            </div>
          </PageItem>

          {/* 5. DIAGNOSA AI */}
          <PageItem number={5}>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
                <i className="fa-solid fa-robot text-2xl"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">DIAGNOSA AI</h3>
              <div className="w-10 h-1 bg-indigo-600 mx-auto"></div>
              <p className="text-sm text-slate-600 font-semibold leading-relaxed text-center px-4">
                Dapatkan bimbingan personal seketika. AI akan menganalisis pola jawaban Anda untuk memberikan saran pedagogis yang tepat sasaran.
              </p>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-slate-200">
                 <Image src="/unj_bg.png" alt="AI" fill className="object-cover" />
                 <div className="absolute inset-0 bg-blue-600/20"></div>
              </div>
            </div>
          </PageItem>

          {/* 6. SIAP MULAI? (PENUTUP) */}
          <PageItem number={6} density="hard">
            <div className="h-full flex flex-col items-center justify-center bg-slate-900 text-white relative">
              <Image src="/unj_bg.png" alt="BG" fill className="object-cover opacity-30" />
              <div className="relative z-10 flex flex-col items-center">
                 <h3 className="text-4xl font-black italic tracking-tighter uppercase mb-4">SIAP MULAI?</h3>
                 <div className="w-12 h-1 bg-blue-500 mb-8"></div>
                 <button 
                   onClick={() => router.push("/login")}
                   className="px-10 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95"
                 >
                   MASUK PORTAL
                 </button>
              </div>
            </div>
          </PageItem>
        </HTMLFlipBook>
      </div>

      {/* Modern Controls */}
      <div className="mt-12 flex items-center justify-center gap-8">
        <button 
          onClick={() => bookRef.current?.pageFlip().flipPrev()}
          className="w-14 h-14 rounded-2xl bg-white shadow-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 active:scale-90 transition-all border border-slate-100 group"
        >
          <i className="fa-solid fa-arrow-left text-xl group-hover:-translate-x-1 transition-transform"></i>
        </button>
        <div className="flex flex-col items-center">
           <span className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em]">Flip Page</span>
           <div className="flex gap-1 mt-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
              ))}
           </div>
        </div>
        <button 
          onClick={() => bookRef.current?.pageFlip().flipNext()}
          className="w-14 h-14 rounded-2xl bg-white shadow-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 active:scale-90 transition-all border border-slate-100 group"
        >
          <i className="fa-solid fa-arrow-right text-xl group-hover:translate-x-1 transition-transform"></i>
        </button>
      </div>
    </div>
  );
}
