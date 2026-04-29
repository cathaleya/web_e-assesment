"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from 'react-pdf';
import { useRouter } from "next/navigation";

// Konfigurasi Worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PageItem = React.forwardRef((props: any, ref: any) => {
  return (
    <div className="bg-white shadow-md overflow-hidden" ref={ref} data-density={props.density || "soft"}>
      <div className="h-full w-full flex flex-col items-center justify-center">
        {props.children}
      </div>
    </div>
  );
});
PageItem.displayName = "PageItem";

export default function FlipBookSection() {
  const bookRef = useRef<any>(null);
  const router = useRouter();
  const [numPages, setNumPages] = useState<number>(0);
  const [isPdfReady, setIsPdfReady] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Handle window resize for responsiveness
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsPdfReady(true);
  }

  // Tentukan dimensi berdasarkan layar
  const isMobile = windowWidth < 768;
  const pageWidth = isMobile ? Math.min(windowWidth - 40, 350) : 450;
  const pageHeight = pageWidth * 1.41; // Rasio A4

  return (
    <div className="bg-white/30 backdrop-blur-2xl rounded-[40px] p-4 md:p-8 border border-white/40 shadow-2xl w-full flex flex-col items-center overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between w-full mb-6 gap-4 px-4">
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Interactive Flipbook Guide</h4>
          <p className="text-[9px] font-bold text-blue-200 uppercase mt-1">
             {isMobile ? "Geser untuk membalik halaman" : "Gunakan mouse untuk membalik halaman"}
          </p>
        </div>
        <a 
          href="/media/Panduan_Website_HDAP.pdf" 
          download 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg active:scale-95"
        >
          <i className="fa-solid fa-download"></i> Unduh PDF
        </a>
      </div>

      <div className="relative w-full flex justify-center">
        <Document
          file="/media/Panduan_Website_HDAP.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="text-white font-black animate-pulse uppercase tracking-widest py-20">Menyiapkan Panduan...</div>}
        >
          {isPdfReady && (
            /* @ts-ignore */
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
              className="mx-auto"
            >
              {/* 1. HALAMAN COVER DARI PDF (HALAMAN 1) */}
              <PageItem number={1} density="hard">
                <Page 
                  pageNumber={1} 
                  width={pageWidth} 
                  renderAnnotationLayer={false} 
                  renderTextLayer={false}
                />
              </PageItem>

              {/* 2. SISA HALAMAN PDF */}
              {Array.from(new Array(numPages - 1), (el, index) => (
                <PageItem key={`pdf_${index + 2}`} number={index + 2}>
                  <Page 
                    pageNumber={index + 2} 
                    width={pageWidth} 
                    renderAnnotationLayer={false} 
                    renderTextLayer={false}
                  />
                </PageItem>
              ))}

              {/* 3. HALAMAN PENUTUP KUSTOM (UKURAN HARUS SAMA PERSIS) */}
              <PageItem number={numPages + 1} density="hard">
                <div 
                  className="relative flex flex-col items-center justify-center text-center bg-slate-900 overflow-hidden shadow-inner"
                  style={{ width: pageWidth, height: pageHeight }}
                >
                  <Image src="/unj_bg.png" alt="Background" fill className="object-cover opacity-30" />
                  <div className="relative z-10 p-6 border-2 border-white/20 rounded-2xl backdrop-blur-sm m-4">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-2">SIAP MULAI?</h3>
                    <div className="w-8 h-1 bg-blue-500 mx-auto mb-4"></div>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
                      Jelajahi Potensi Literasi Digital Sekarang.
                    </p>
                    <button 
                      onClick={() => router.push("/login")}
                      className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-500 transition-all active:scale-95"
                    >
                      Masuk Ke Portal
                    </button>
                  </div>
                </div>
              </PageItem>
            </HTMLFlipBook>
          )}
        </Document>
      </div>

      {/* PDF Controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button 
          onClick={() => bookRef.current?.pageFlip().flipPrev()}
          className="w-10 h-10 rounded-xl bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-blue-600 active:scale-90 transition-all border border-slate-100"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-xl border border-slate-100 shadow-md">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            {isPdfReady ? `Halaman 1 - ${numPages + 1}` : "..."}
          </p>
        </div>
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
