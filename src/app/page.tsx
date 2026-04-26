"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="antialiased overflow-x-hidden flex flex-col min-h-screen relative"
         style={{ 
           backgroundImage: "url('/campus_bg.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      
      {/* Top Navigation */}
      <nav className="w-full h-24 flex items-center justify-between px-8 lg:px-16 z-50 bg-white/60 backdrop-blur-md border-b border-white/50 shadow-sm fixed top-0 left-0 right-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <i className="fa-solid fa-graduation-cap text-white text-2xl"></i>
          </div>
          <span className="text-2xl font-bold tracking-widest text-slate-900">HDAP</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-700">
          <Link href="#" className="hover:text-teal-600 transition">Tentang Platform</Link>
          <Link href="#" className="hover:text-teal-600 transition">Panduan Asesmen</Link>
          <Link href="#" className="hover:text-teal-600 transition">Cek Sertifikat</Link>
        </div>
        
        <Link href="/login" className="bg-white/60 hover:bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 px-6 py-2.5 rounded-full font-bold transition-all shadow-sm">
          Masuk Portal
        </Link>
      </nav>

      {/* Main Hero Section */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-6 lg:px-16 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full max-w-7xl items-center">
          
          {/* Left Text Content */}
          <div className="text-center lg:text-left space-y-8">
            <h1 className="font-extrabold text-white leading-tight" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>
              <span className="block text-4xl lg:text-5xl font-extrabold text-white mb-4 lg:whitespace-nowrap" style={{ textShadow: "0 4px 15px rgba(0,0,0,0.9)" }}>
                Hybrid-Diagnostic Assessment Platform (HDAP)
              </span>
              <span className="text-4xl lg:text-5xl block lg:whitespace-nowrap">
                Website E-ASSESSMENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400" style={{ filter: "drop-shadow(0 0 10px rgba(20,184,166,0.6))" }}>LITERASI DIGITAL</span>.
              </span>
            </h1>
            
            <p className="text-lg text-white max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium bg-black/30 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/10" style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
              Menggabungkan ketepatan <strong>Item Response Theory</strong> dengan kecerdasan <strong>Generative AI</strong> untuk memetakan kompetensi <strong>Literasi Digital</strong> secara objektif.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link href="/login" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-[0_4px_15px_rgba(20,184,166,0.3)] hover:shadow-[0_6px_25px_rgba(20,184,166,0.4)] flex items-center justify-center group">
                Mulai Ujian
                <i className="fa-solid fa-arrow-right ml-2 transition-transform group-hover:translate-x-2"></i>
              </Link>
              <Link href="/login" className="glass-panel hover:bg-white text-slate-800 font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center border border-slate-200">
                <i className="fa-solid fa-shield-halved mr-2 text-slate-500"></i>
                Login LPTK / Admin
              </Link>
            </div>
            
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-6 text-slate-100 text-sm font-semibold">
              <div className="flex items-center drop-shadow-md"><i className="fa-solid fa-check text-teal-400 mr-2"></i> Anti-Bias (DIF)</div>
              <div className="flex items-center drop-shadow-md"><i className="fa-solid fa-check text-teal-400 mr-2"></i> Standard ISO 25010</div>
            </div>
          </div>

          {/* Right Side - Visual Space */}
          <div className="hidden lg:block relative">
            {/* Visual element or intentionally empty to show bg */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-slate-600 text-sm font-medium relative z-10 border-t border-slate-300 mt-auto bg-white/40 backdrop-blur-md">
        <p>&copy; 2026 Riset BIMA - Pengembangan Model E-Assessment. All rights reserved.</p>
      </footer>
    </div>
  );
}
