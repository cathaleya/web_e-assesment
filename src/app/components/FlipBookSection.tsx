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
    <div className="w-full flex flex-col items-center">
      
      <div className="flex items-center justify-between w-full mb-8 gap-4 px-4">
        <div className="flex flex-col">
          <h4 className="text-sm font-black text-white uppercase tracking-tighter italic">Official User Manual</h4>
          <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest mt-1">Panduan Lengkap 8 Halaman</p>
        </div>
        <a 
          href="/media/Panduan_Website_HDAP.pdf" 
          download 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg"
        >
          <i className="fa-solid fa-file-pdf"></i> PDF
        </a>
      </div>

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
          className="mx-auto shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]"
        >
          {/* 1. COVER */}
          <PageItem number={1} density="hard">
            <div className="h-full flex flex-col items-center justify-center bg-[#1E3A8A] text-white p-10 relative">
              <Image src="/unj_bg.png" alt="BG" fill className="object-cover opacity-10" />
              <div className="relative z-10 flex flex-col items-center">
                 <div className="w-20 h-20 bg-blue-500 rounded-[2rem] flex items-center justify-center shadow-2xl mb-10">
                    <i className="fa-solid fa-shield-halved text-4xl"></i>
                 </div>
                 <h1 className="text-3xl font-black italic tracking-tighter uppercase text-center leading-none">HDAP<br/>USER GUIDE</h1>
                 <div className="w-16 h-1 bg-white mt-8 mb-4"></div>
                 <p className="text-[11px] font-bold text-blue-300 uppercase tracking-[0.4em]">Official v1.0</p>
              </div>
            </div>
          </PageItem>

          {/* 2. PENDAHULUAN */}
          <PageItem number={2}>
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">PENDAHULUAN</h3>
              <div className="w-10 h-1 bg-blue-600 mx-auto"></div>
              <p className="text-sm text-slate-600 font-semibold leading-relaxed text-center px-4">
                Platform **HDAP** mengintegrasikan Psikometrik Modern dan AI untuk memetakan literasi digital secara personal dan objektif bagi mahasiswa calon guru.
              </p>
              <div className="w-full h-32 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center">
                <i className="fa-solid fa-quote-left text-slate-200 text-4xl"></i>
              </div>
            </div>
          </PageItem>

          {/* 3. PERSIAPAN TEKNIS */}
          <PageItem number={3}>
            <div className="space-y-6 w-full">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">TEKNIS</h3>
              <div className="w-10 h-1 bg-blue-600 mx-auto"></div>
              <div className="grid grid-cols-1 gap-4 w-full">
                 <div className="p-4 bg-blue-50 rounded-2xl flex items-center gap-4">
                    <i className="fa-solid fa-wifi text-blue-600 text-xl"></i>
                    <p className="text-xs font-black text-slate-800 uppercase">Internet Stabil</p>
                 </div>
                 <div className="p-4 bg-blue-50 rounded-2xl flex items-center gap-4">
                    <i className="fa-solid fa-browser text-blue-600 text-xl"></i>
                    <p className="text-xs font-black text-slate-800 uppercase">Google Chrome</p>
                 </div>
              </div>
            </div>
          </PageItem>

          {/* 4. REGISTRASI & LOGIN */}
          <PageItem number={4}>
            <div className="space-y-6 w-full">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">REGISTRASI</h3>
              <div className="w-10 h-1 bg-blue-600 mx-auto"></div>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border-2 border-slate-100">
                 <Image src="/unj_bg.png" alt="Login" fill className="object-cover" />
                 <div className="absolute inset-0 bg-blue-900/10"></div>
              </div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Gunakan NIM dan Password terdaftar</p>
            </div>
          </PageItem>

          {/* 5. MEMILIH INSTRUMEN */}
          <PageItem number={5}>
            <div className="space-y-6 w-full">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">PILIH SOAL</h3>
              <div className="w-10 h-1 bg-blue-600 mx-auto"></div>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border-2 border-slate-100">
                 <Image src="/dashboard_v2.png" alt="Dashboard" fill className="object-cover" />
              </div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Pilih Instrumen MADEL5C untuk mulai</p>
            </div>
          </PageItem>

          {/* 6. PENGERJAAN SOAL */}
          <PageItem number={6}>
            <div className="space-y-6 w-full">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">PENGERJAAN</h3>
              <div className="w-10 h-1 bg-blue-600 mx-auto"></div>
              <div className="p-6 bg-slate-900 rounded-3xl text-white text-center">
                 <i className="fa-solid fa-clock text-3xl text-amber-400 mb-4 block"></i>
                 <p className="text-xs font-bold leading-relaxed">Bacalah setiap studi kasus dengan teliti sebelum memilih jawaban.</p>
              </div>
            </div>
          </PageItem>

          {/* 7. DIAGNOSA AI */}
          <PageItem number={7}>
            <div className="space-y-6 w-full">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">DIAGNOSA AI</h3>
              <div className="w-10 h-1 bg-indigo-600 mx-auto"></div>
              <p className="text-sm text-slate-600 font-semibold leading-relaxed text-center px-4">
                Analisis mendalam terhadap profil kompetensi Anda akan diproses secara instan oleh AI.
              </p>
              <div className="w-full h-24 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-center text-indigo-400">
                <i className="fa-solid fa-robot text-4xl"></i>
              </div>
            </div>
          </PageItem>

          {/* 8. SIAP MULAI? */}
          <PageItem number={8} density="hard">
            <div className="h-full flex flex-col items-center justify-center bg-slate-900 text-white relative">
              <Image src="/unj_bg.png" alt="BG" fill className="object-cover opacity-30" />
              <div className="relative z-10 flex flex-col items-center">
                 <h3 className="text-3xl font-black italic uppercase mb-6 text-center">SIAP MULAI?</h3>
                 <button 
                   onClick={() => router.push("/login")}
                   className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95"
                 >
                   MASUK KE PORTAL
                 </button>
              </div>
            </div>
          </PageItem>
        </HTMLFlipBook>
      </div>

      <div className="mt-10 flex items-center justify-center gap-6">
        <button 
          onClick={() => bookRef.current?.pageFlip().flipPrev()}
          className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-blue-600 active:scale-90 transition-all border border-slate-100"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button 
          onClick={() => bookRef.current?.pageFlip().flipNext()}
          className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-blue-600 active:scale-90 transition-all border border-slate-100"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}
