import { useState, useEffect } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [settings, setSettings] = useState({
    contact: "",
    description: "",
    manualLink: "#",
    promotorLink: "#"
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error("Failed to fetch settings:", err));
  }, []);

  return (
    <div className="antialiased overflow-x-hidden flex flex-col min-h-screen relative bg-slate-50">
      
      {/* Hero Section with Fixed Background */}
      <div className="min-h-screen relative flex flex-col"
           style={{ 
             backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.6)), url('/campus_bg.png')",
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             backgroundAttachment: 'fixed'
           }}>
        
        {/* Top Navigation */}
        <nav className="w-full h-24 flex items-center justify-between px-8 lg:px-16 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 fixed top-0 left-0 right-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-graduation-cap text-white text-2xl"></i>
            </div>
            <span className="text-2xl font-black tracking-widest text-white italic uppercase">HDAP</span>
          </div>
          
          <div className="hidden md:flex gap-8 text-[10px] font-black text-white uppercase tracking-widest">
            <Link href="#info" className="hover:text-teal-400 transition">Tentang Platform</Link>
            <Link href={settings.manualLink} target="_blank" className="hover:text-teal-400 transition">Panduan Asesmen</Link>
            <Link href={settings.promotorLink} target="_blank" className="hover:text-teal-400 transition">Profil Promotor</Link>
          </div>
          
          <Link href="/login" className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black transition-all shadow-xl text-xs uppercase tracking-widest hover:bg-teal-500 hover:text-white">
            Masuk Portal
          </Link>
        </nav>

        {/* Main Hero Section */}
        <main className="flex-1 flex items-center justify-center relative z-10 px-6 lg:px-16 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full max-w-7xl items-center">
            <div className="text-center lg:text-left space-y-8 animate-in slide-in-from-left duration-700">
              <h1 className="font-black text-white leading-tight">
                <span className="block text-4xl lg:text-5xl mb-4 italic uppercase tracking-tighter" style={{ textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                  Hybrid-Diagnostic Assessment Platform
                </span>
                <span className="text-5xl lg:text-7xl block font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300" style={{ filter: "drop-shadow(0 0 20px rgba(94,234,212,0.5))" }}>
                  E-ASSESSMENT <br/>LITERASI DIGITAL
                </span>
              </h1>
              
              <p className="text-lg text-white max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium bg-black/40 backdrop-blur-md px-8 py-6 rounded-[30px] border border-white/10 shadow-2xl">
                {settings.description || "Memetakan kompetensi Literasi Digital secara objektif menggunakan kecerdasan buatan."}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4">
                <Link href="/login" className="bg-teal-500 hover:bg-teal-400 text-white font-black px-12 py-5 rounded-2xl transition-all shadow-2xl shadow-teal-500/40 flex items-center justify-center group uppercase tracking-widest text-sm">
                  Mulai Ujian <i className="fa-solid fa-play ml-3 text-xs group-hover:translate-x-1 transition-transform"></i>
                </Link>
                <Link href="/login" className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-black px-10 py-5 rounded-2xl transition-all flex items-center justify-center border border-white/20 uppercase tracking-widest text-sm">
                  Login Admin
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Second Section: Informasi Website */}
      <section id="info" className="py-32 px-6 lg:px-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <span className="px-5 py-2 bg-teal-500/10 text-teal-600 text-xs font-black rounded-full uppercase tracking-[0.3em] inline-block mb-4">Informasi Platform</span>
              <h2 className="text-4xl lg:text-6xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">
                Membangun <span className="text-teal-500">Masa Depan</span> Pendidikan Digital.
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed font-medium italic">
                {settings.description}
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100">
                  <i className="fa-solid fa-book-open-reader text-3xl text-teal-500 mb-4 block"></i>
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2">Buku Panduan</h4>
                  <a href={settings.manualLink} target="_blank" className="text-xs font-bold text-teal-600 hover:underline">Unduh PDF &rarr;</a>
                </div>
                <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100">
                  <i className="fa-solid fa-address-card text-3xl text-blue-500 mb-4 block"></i>
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2">Hubungi Kami</h4>
                  <p className="text-xs font-bold text-blue-600">{settings.contact}</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-[60px] animate-pulse absolute -inset-4"></div>
              <img src="/mockup_v1.png" alt="Platform Preview" className="relative z-10 rounded-[50px] shadow-2xl border-8 border-white object-cover w-full h-[600px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-20 bg-slate-950 text-white px-8 lg:px-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center lg:items-start">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center"><i className="fa-solid fa-graduation-cap text-white"></i></div>
              <span className="text-xl font-black tracking-widest italic uppercase">HDAP PLATFORM</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm text-center lg:text-left italic">
              Platform dikembangkan sebagai bagian dari hibah riset disertasi BIMA.
            </p>
          </div>
          
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link href={settings.promotorLink} target="_blank" className="hover:text-white transition underline decoration-teal-500 decoration-2 underline-offset-8">Website Promotor</Link>
            <Link href="/login" className="hover:text-white transition underline decoration-blue-500 decoration-2 underline-offset-8">Portal Admin</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center">
           <p className="text-[10px] text-slate-600 font-bold tracking-widest uppercase">&copy; 2026 Riset BIMA. All rights reserved. Directed by Prof. Dr. Dinny Devi Triana & Prof. Dr. Ari Saptono.</p>
        </div>
      </footer>
    </div>
  );
}

