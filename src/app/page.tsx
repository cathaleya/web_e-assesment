"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [settings, setSettings] = useState({
    contact: "ruslina.irianty@mhs.unj.ac.id",
    description: "",
    manualLink: "#",
    promotorLink: "https://e-assessment.id/"
  });
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(prev => ({
        ...data,
        contact: data.contact || "ruslina.irianty@mhs.unj.ac.id"
      })))
      .catch(err => console.error("Failed to fetch settings:", err));
    
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to fetch stats:", err));
  }, []);

  return (
    <div className="antialiased overflow-x-hidden flex flex-col min-h-screen relative bg-white">
      
      {/* Hero Section with Bright Background */}
      <div className="min-h-screen relative flex flex-col"
           style={{ 
             backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('/unj_bg.png')",
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             backgroundAttachment: 'fixed'
           }}>
        
        {/* Top Navigation */}
        <nav className="w-full h-24 flex items-center justify-between px-8 lg:px-16 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 left-0 right-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-graduation-cap text-white text-2xl"></i>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-slate-900 uppercase leading-none">MADEL5C</span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">E-Assessment Platform</span>
            </div>
          </div>
          
          <div className="hidden md:flex gap-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <Link href="#info" className="hover:text-blue-600 transition">Tentang Platform</Link>
            <Link href={settings.manualLink} target="_blank" className="hover:text-blue-600 transition">Buku Panduan</Link>
            <a href="https://e-assessment.id/" target="_blank" className="hover:text-blue-600 transition">Website Payung Riset</a>
          </div>
          
          <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-xl shadow-blue-500/20 text-xs uppercase tracking-widest hover:bg-blue-700">
            Masuk Portal
          </Link>
        </nav>

        {/* Main Hero Section */}
        <main className="flex-1 flex items-center justify-center relative z-10 px-6 lg:px-16 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full max-w-7xl items-center">
            <div className="text-center lg:text-left space-y-8 animate-in slide-in-from-left duration-700">
              <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
                h1 { font-family: 'Plus Jakarta Sans', sans-serif; }
              `}</style>
              <h1 className="font-extrabold leading-tight">
                <span className="block text-2xl lg:text-3xl mb-6 italic uppercase tracking-widest text-indigo-900 whitespace-nowrap" 
                      style={{ textShadow: "0 0 20px rgba(255,255,255,1), 0 0 10px rgba(255,255,255,1)" }}>
                  Hybrid-Diagnostic Assessment Platform (HDAP)
                </span>
                <span className="text-3xl md:text-5xl lg:text-7xl block font-black uppercase tracking-tighter text-blue-600 leading-[1.1] md:leading-[1.2]" 
                      style={{ textShadow: "0 0 20px rgba(255,255,255,1), 0 0 10px rgba(255,255,255,1)" }}>
                  <span className="block md:whitespace-nowrap"><span className="italic tracking-wider">E-ASSESSMEN</span> LITERASI DIGITAL.</span>
                </span>
              </h1>
              
              <p className="text-lg text-slate-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium bg-white/60 backdrop-blur-md px-8 py-6 rounded-[30px] border border-slate-200 shadow-xl">
                Menggabungkan Analisis Item Response Theory dengan kecerdasan Generative AI untuk memetakan kompetensi Literasi Digital secara objektif.
              </p>
              
              {/* Button removed as per user request */}
            </div>
          </div>
        </main>
      </div>

      <section id="info" className="py-32 px-6 lg:px-16 relative overflow-hidden"
               style={{ 
                 backgroundImage: "url('/tech_bg.png')",
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 bg-white/80 backdrop-blur-xl p-12 rounded-[50px] border border-slate-200 shadow-2xl">
              <span className="px-5 py-2 bg-blue-600/10 text-blue-600 text-xs font-black rounded-full uppercase tracking-[0.3em] inline-block mb-4">Informasi Platform</span>
              <h2 className="text-4xl lg:text-6xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">
                Membangun <span className="text-blue-600">Kecakapan</span> Digital Masa Depan.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium italic">
                Menggabungkan Analisis Item Response Theory dengan kecerdasan Generative AI untuk memetakan kompetensi Literasi Digital secara objektif.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
                <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm">
                  <i className="fa-solid fa-book-open-reader text-3xl text-blue-500 mb-4 block"></i>
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2">Buku Panduan</h4>
                  <a href={settings.manualLink} target="_blank" className="text-xs font-bold text-blue-600 hover:underline">Unduh PDF &rarr;</a>
                </div>
                <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm">
                  <i className="fa-solid fa-envelope text-3xl text-emerald-500 mb-4 block"></i>
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2">Hubungi Kami</h4>
                  <p className="text-xs font-bold text-emerald-600 truncate">ruslina.irianty@mhs.unj.ac.id</p>
                </div>
              </div>

              {/* LIVE STATS WIDGET */}
              <div className="bg-slate-900 rounded-[40px] p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">Statistik Platform Real-time</h4>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-black text-blue-400">{stats?.totalUsers ?? '—'}</div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Total Pengguna</p>
                  </div>
                  <div className="text-center border-x border-white/10">
                    <div className="text-3xl font-black text-teal-400">{stats?.totalAssessments ?? '—'}</div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Asesmen Selesai</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-purple-400">{stats?.totalSurveys ?? '—'}</div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Survey Diisi</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Pendaftar 7 Hari Terakhir</p>
                  <div className="flex items-end gap-1.5 h-16">
                    {(stats?.daily ?? Array(7).fill({ date: '', count: 0 })).map((d: any, i: number) => {
                      const max = Math.max(...(stats?.daily ?? []).map((x: any) => x.count), 1);
                      const pct = (d.count / max) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
                          <div className="w-full bg-blue-500 rounded-t-md transition-all" style={{ height: `${Math.max(pct, 4)}%` }}></div>
                          <span className="text-[7px] text-slate-500 font-bold">{d.date ? d.date.slice(5) : '—'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="aspect-square bg-indigo-600/10 rounded-[60px] absolute -inset-4 blur-2xl group-hover:bg-indigo-600/20 transition-all"></div>
              <img src="/admin_preview.png" alt="Admin Psychometric Analysis Preview" className="relative z-10 rounded-[50px] shadow-2xl border-4 border-slate-800 object-cover w-full h-[600px] transform group-hover:scale-[1.02] transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-20 bg-slate-900 text-white px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center lg:items-start">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg"><i className="fa-solid fa-graduation-cap text-white"></i></div>
              <span className="text-xl font-black tracking-widest italic uppercase">MADEL5C PLATFORM</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm text-center lg:text-left italic">
              Platform dikembangkan sebagai bagian dari hibah riset disertasi BIMA. Mendukung transformasi digital pendidikan di Indonesia.
            </p>
          </div>
          
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="https://e-assessment.id/" target="_blank" className="hover:text-white transition underline decoration-blue-500 decoration-2 underline-offset-8">Website Payung Riset</a>
            <Link href="/login" className="hover:text-white transition underline decoration-teal-500 decoration-2 underline-offset-8">Portal Admin</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center">
           <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">&copy; 2026 Riset BIMA. All rights reserved. Directed by Prof. Dr. Dinny Devi Triana & Prof. Dr. Ari Saptono.</p>
        </div>
      </footer>
    </div>
  );
}

