"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const router = useRouter();

  const handleStart = () => {
    setShowDisclaimer(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[120px] -mr-96 -mt-96 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[100px] -ml-64 -mb-64 opacity-50"></div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">E-Assessment Portal V2.0</p>
            </div>

            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900">
              HDAP <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">LITERACY.</span>
            </h1>

            <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
              Platform evaluasi literasi digital mutakhir berbasis <span className="font-bold text-slate-900">Situational Judgment Test (SJT)</span>. Temukan profil kompetensi digital Anda dengan akurasi tinggi.
            </p>

            <div className="flex items-center gap-6 pt-4">
              <button 
                onClick={handleStart}
                className="group relative px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-900/20"
              >
                <span className="relative z-10 flex items-center gap-3">
                  MULAI EVALUASI SEKARANG
                  <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-2"></i>
                </span>
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative z-10 aspect-square rounded-[40px] bg-slate-100 border border-slate-200 overflow-hidden shadow-3xl">
              <Image 
                src="/unj_bg_v2.png" 
                alt="UNJ Digital Literacy" 
                fill
                className="object-cover opacity-80"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
            </div>
            {/* Stats Card Decor */}
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 z-20 animate-bounce-slow">
              <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Total Peserta</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">1,240+</p>
            </div>
          </motion.div>
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
              className="relative w-full max-w-xl bg-white rounded-[40px] p-10 shadow-3xl border border-slate-100"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                <i className="fa-solid fa-file-contract text-2xl"></i>
              </div>

              <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Persetujuan Partisipasi</h2>
              <div className="prose prose-slate max-h-[300px] overflow-y-auto pr-4 mb-8">
                <p className="text-slate-600 font-medium leading-relaxed">
                  Dengan menekan tombol setuju, Anda menyatakan kesediaan untuk berpartisipasi dalam penelitian evaluasi literasi digital ini secara sukarela. 
                </p>
                <p className="text-slate-600 font-medium leading-relaxed mt-4">
                  Data yang Anda berikan akan dijaga kerahasiaannya dan hanya digunakan untuk kepentingan akademis & pengembangan instrumen MADEL5C.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowDisclaimer(false)}
                  className="py-4 rounded-2xl bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all"
                >
                  BATAL
                </button>
                <button 
                  onClick={() => router.push("/login")}
                  className="py-4 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                >
                  SAYA SETUJU
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 UNJ DIGITAL LITERACY PROJECT. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all">Metodologi</a>
          <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all">Kontak</a>
          <a href="/admin" className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-b-2 border-blue-500">Panel Admin</a>
        </div>
      </footer>
    </div>
  );
}
