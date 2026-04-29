"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from 'react-pdf';

// Konfigurasi Worker untuk react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Komponen Halaman untuk PDF
const PDFPage = React.forwardRef((props: any, ref: any) => {
  return (
    <div className="bg-white shadow-2xl" ref={ref}>
      <Page 
        pageNumber={props.pageNumber} 
        width={350} 
        renderAnnotationLayer={false} 
        renderTextLayer={false}
      />
    </div>
  );
});
PDFPage.displayName = "PDFPage";

export default function Home() {
  const router = useRouter();
  const bookRef = useRef<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

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
          
          {/* HEADER SECTION 2 */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg">
                TENTANG PLATFORM & PANDUAN
              </h2>
              <p className="text-blue-200 font-bold uppercase tracking-[0.3em] mt-2">Hybrid-Diagnostic Assessment Ecosystem</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
               <p className="text-white text-sm font-semibold">
                 <strong>HDAP</strong> mengintegrasikan IRT (Modern Psychometrics) & Generative AI.
               </p>
            </div>
          </div>

          {/* ── BARIS UTAMA: VIDEO & FLIPBOOK BERSEBELAHAN ── */}
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
                 <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">Panduan Operasional</h4>
                 <p className="text-sm text-slate-600 font-semibold leading-relaxed">
                   Pelajari bagaimana menggunakan platform HDAP mulai dari proses pendaftaran, pengerjaan instrumen SJT, hingga melihat hasil diagnosa berbasis kecerdasan buatan secara real-time.
                 </p>
              </div>
            </div>

            {/* KANAN: PDF Flipbook */}
            <div className="flex flex-col gap-6 items-center">
              <div className="bg-white/30 backdrop-blur-2xl rounded-[40px] p-8 border border-white/40 shadow-2xl w-full flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-6 px-4">
                   <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Interactive PDF Guide</h4>
                   <a 
                     href="/media/Panduan_Website_HDAP.pdf" 
                     download 
                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg"
                   >
                     <i className="fa-solid fa-download"></i> Unduh PDF
                   </a>
                </div>

                {mounted && (
                  <div className="relative group">
                    <Document
                      file="/media/Panduan_Website_HDAP.pdf"
                      onLoadSuccess={onDocumentLoadSuccess}
                      loading={<div className="text-white font-black animate-pulse uppercase tracking-widest">Memuat PDF...</div>}
                    >
                      {/* @ts-ignore */}
                      <HTMLFlipBook 
                        width={350} 
                        height={500} 
                        size="stretch"
                        minWidth={300}
                        maxWidth={450}
                        minHeight={400}
                        maxHeight={650}
                        drawShadow={true}
                        flippingTime={800}
                        usePortrait={true}
                        startPage={0}
                        showCover={true}
                        mobileScrollSupport={true}
                        ref={bookRef}
                        className="shadow-2xl rounded-xl"
                      >
                        {Array.from(new Array(numPages), (el, index) => (
                          <PDFPage key={`page_${index + 1}`} pageNumber={index + 1} />
                        ))}
                      </HTMLFlipBook>
                    </Document>

                    {/* PDF Controls */}
                    <div className="mt-8 flex items-center justify-center gap-4">
                      <button 
                        onClick={() => bookRef.current.pageFlip().flipPrev()}
                        className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-blue-600 active:scale-90 transition-all border border-slate-100"
                      >
                        <i className="fa-solid fa-chevron-left text-lg"></i>
                      </button>
                      <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-2xl border border-slate-100 shadow-md">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                           Halaman {numPages > 0 ? "1" : "0"} / {numPages}
                         </p>
                      </div>
                      <button 
                        onClick={() => bookRef.current.pageFlip().flipNext()}
                        className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-blue-600 active:scale-90 transition-all border border-slate-100"
                      >
                        <i className="fa-solid fa-chevron-right text-lg"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
      `}</style>

    </div>
  );
}
