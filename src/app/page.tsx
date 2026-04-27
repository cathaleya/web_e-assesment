"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <Image src="/unj_bg_v2.png" alt="BG" fill className="object-cover opacity-[0.03] grayscale" />
      </div>

      <main className="relative z-10 w-full max-w-md space-y-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30 mb-4">
             <i className="fa-solid fa-graduation-cap text-white text-2xl"></i>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">
            HDAP <span className="text-blue-600 italic">PORTAL</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">E-Assessment Platform V2.0</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-[32px] border border-slate-200 shadow-2xl space-y-4"
        >
          <div className="space-y-2">
            <h2 className="text-sm font-black text-slate-900 uppercase">Literasi Digital <br/>& Psikometrika</h2>
            <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
              Instrumen MADEL5C berbasis Situational Judgment Test (SJT) untuk pemetaan kompetensi digital masa depan.
            </p>
          </div>

          <button 
            onClick={() => setShowDisclaimer(true)}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
          >
            MULAI EVALUASI
          </button>
        </motion.div>

        <div className="flex justify-center gap-8 pt-4">
           <div className="text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase">Akurasi</p>
              <p className="text-xs font-black text-slate-900">98.5%</p>
           </div>
           <div className="w-px h-8 bg-slate-200"></div>
           <div className="text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase">Reliabel</p>
              <p className="text-xs font-black text-slate-900">0.82</p>
           </div>
        </div>
      </main>

      {/* Disclaimer Modal */}
      <AnimatePresence>
        {showDisclaimer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDisclaimer(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[40px] p-8 shadow-3xl border border-slate-100"
            >
              <h2 className="text-xl font-black text-slate-900 mb-4 tracking-tight uppercase">Persetujuan</h2>
              <p className="text-[11px] text-slate-600 font-bold leading-relaxed mb-8 italic">
                &quot;Saya menyatakan kesediaan untuk berpartisipasi dalam penelitian ini secara sukarela. Data saya akan dijaga kerahasiaannya.&quot;
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowDisclaimer(false)}
                  className="py-4 rounded-2xl bg-slate-50 text-slate-400 font-black text-[9px] uppercase tracking-widest"
                >
                  BATAL
                </button>
                <button 
                  onClick={() => router.push("/login")}
                  className="py-4 rounded-2xl bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest shadow-lg shadow-blue-600/20"
                >
                  SAYA SETUJU
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="absolute bottom-6 w-full text-center">
         <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">© 2026 UNJ DIGITAL LITERACY PROJECT</p>
      </footer>
    </div>
  );
}
