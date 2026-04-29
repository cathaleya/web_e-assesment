"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from 'react-pdf';
import { useRouter } from "next/navigation";

// Konfigurasi Worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PageItem = React.forwardRef((props: any, ref: any) => {
  return (
    <div className="bg-white shadow-2xl" ref={ref} data-density={props.density || "soft"}>
      <div className="h-full w-full">
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

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsPdfReady(true);
  }

  return (
    <div className="bg-white/30 backdrop-blur-2xl rounded-[40px] p-8 border border-white/40 shadow-2xl w-full flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-6 px-4">
        <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Interactive Flipbook Guide</h4>
        <a 
          href="/media/Panduan_Website_HDAP.pdf" 
          download 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg"
        >
          <i className="fa-solid fa-download"></i> Unduh PDF
        </a>
      </div>

      <div className="relative group">
        <Document
          file="/media/Panduan_Website_HDAP.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="text-white font-black animate-pulse uppercase tracking-widest">Menyiapkan Panduan...</div>}
        >
          {isPdfReady && (
            /* @ts-ignore */
            <HTMLFlipBook 
              width={550} 
              height={733} 
              size="stretch"
              minWidth={315}
              maxWidth={1000}
              minHeight={400}
              maxHeight={1533}
              drawShadow={true}
              flippingTime={1000}
              usePortrait={false}
              startPage={0}
              showCover={true}
              mobileScrollSupport={true}
              ref={bookRef}
              className="shadow-2xl rounded-xl"
            >
              {Array.from(new Array(numPages), (el, index) => (
                <PageItem key={`pdf_${index}`} number={index + 1} density={index === 0 ? "hard" : "soft"}>
                  <Page 
                    pageNumber={index + 1} 
                    width={550} 
                    renderAnnotationLayer={false} 
                    renderTextLayer={false}
                  />
                </PageItem>
              ))}

              <PageItem number={numPages + 1} density="hard">
                <div className="h-full flex flex-col items-center justify-center text-center relative overflow-hidden bg-slate-900">
                  <Image src="/unj_bg.png" alt="Background" fill className="object-cover opacity-40" />
                  <div className="relative z-10 p-10 border-4 border-white/30 rounded-3xl backdrop-blur-sm m-6">
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic mb-4">SIAP MULAI?</h3>
                    <div className="w-12 h-1 bg-blue-500 mx-auto mb-6"></div>
                    <p className="text-sm font-bold text-slate-200 uppercase tracking-widest leading-relaxed">
                      Jelajahi Potensi Literasi Digital Anda Sekarang.
                    </p>
                    <button 
                      onClick={() => router.push("/login")}
                      className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest shadow-2xl hover:bg-blue-500 transition-all active:scale-95"
                    >
                      Masuk Ke Portal
                    </button>
                  </div>
                </div>
              </PageItem>
            </HTMLFlipBook>
          )}
        </Document>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button 
            onClick={() => bookRef.current?.pageFlip().flipPrev()}
            className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-blue-600 active:scale-90 transition-all border border-slate-100"
          >
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>
          <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-2xl border border-slate-100 shadow-md">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {isPdfReady ? `Total ${numPages + 1} Halaman` : "Menyiapkan Halaman..."}
            </p>
          </div>
          <button 
            onClick={() => bookRef.current?.pageFlip().flipNext()}
            className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-blue-600 active:scale-90 transition-all border border-slate-100"
          >
            <i className="fa-solid fa-chevron-right text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
