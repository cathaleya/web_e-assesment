"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 relative">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <i className="fa-solid fa-graduation-cap text-xl"></i>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-blue-900 leading-none uppercase">MADEL5C</h1>
            <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">E-Assessment Platform</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-blue-600 transition-all">Tentang Platform</a>
          <a href="#guide" className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-blue-600 transition-all">Buku Panduan</a>
          <a href="#research" className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-blue-600 transition-all">Website Payung Riset</a>
          <button 
            onClick={() => router.push("/login")}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95"
          >
            Masuk Portal
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative h-screen flex items-center pt-16">
        {/* Fullscreen Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/unj_bg_v2.png" 
            alt="UNJ Building" 
            fill 
            className="object-cover" 
            priority
          />
          <div className="absolute inset-0 bg-white/10"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-xl md:text-2xl font-black text-[#1E293B] italic tracking-tight uppercase">
              HYBRID-DIAGNOSTIC ASSESSMENT PLATFORM (HDAP)
            </h3>
            
            <h1 className="text-5xl md:text-8xl font-black text-blue-600 leading-[0.9] tracking-tighter uppercase drop-shadow-sm">
              E-ASSESSMEN <br/>
              LITERASI DIGITAL.
            </h1>

            {/* Glass Card */}
            <div className="mt-8 max-w-md bg-white/40 backdrop-blur-xl p-6 md:p-8 rounded-[40px] border border-white/40 shadow-2xl">
               <p className="text-sm md:text-base text-slate-800 font-bold leading-relaxed italic">
                 &quot;Menggabungkan Analisis Item Response Theory dengan kecerdasan Generative AI untuk memetakan kompetensi Literasi Digital secara objektif.&quot;
               </p>
            </div>
          </motion.div>
        </div>

        {/* UNJ Logo Watermark (Right Top-ish like in image) */}
        <div className="absolute top-32 right-12 md:right-24 opacity-20 pointer-events-none hidden md:block">
           <Image src="/unj_bg_v2.png" alt="UNJ" width={300} height={300} className="grayscale brightness-0 invert" />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="absolute bottom-6 left-8 z-10 flex gap-6">
         <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">© 2026 UNJ DIGITAL LITERACY PROJECT</p>
      </footer>
    </div>
  );
}
