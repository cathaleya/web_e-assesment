"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const stats = [
    { value: "30", label: "Butir Soal MADEL5C", icon: "fa-list-check", color: "text-blue-600" },
    { value: "20", label: "Butir Soal PDI-DL", icon: "fa-chart-bar", color: "text-violet-600" },
    { value: "5", label: "Dimensi Literasi Digital", icon: "fa-layer-group", color: "text-emerald-600" },
    { value: "AI", label: "Diagnostik Generative AI", icon: "fa-robot", color: "text-amber-600" },
  ];

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

        {/* Mobile */}
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
        {/* Background TANPA FILTER */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/unj_bg.png"
            alt="Universitas Negeri Jakarta"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Text */}
        <div className="relative z-10 w-full px-6 md:px-14 lg:px-20">
          {/* Baris 1 */}
          <p className="text-sm md:text-2xl lg:text-[28px] font-black italic text-[#4338CA] uppercase tracking-tight whitespace-nowrap leading-none mb-2">
            HYBRID-DIAGNOSTIC ASSESSMENT PLATFORM (HDAP)
          </p>

          {/* Baris 2 — judul utama, satu baris, italic, biru */}
          <h1 className="text-3xl md:text-5xl lg:text-[75px] xl:text-[90px] font-black italic text-[#2563EB] uppercase tracking-tighter leading-none whitespace-nowrap">
            E-ASSESSMEN LITERASI DIGITAL.
          </h1>

          {/* Description card */}
          <div className="mt-10 md:mt-16 max-w-xs md:max-w-md bg-white/70 backdrop-blur-lg p-5 md:p-8 rounded-3xl border border-white/50 shadow-xl">
            <p className="text-sm md:text-base text-slate-800 font-bold leading-relaxed">
              Tehnik Analisis Item Response Theory dengan kecerdasan Generative AI untuk memetakan kompetensi Literasi Digital secara objektif.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HALAMAN 2 — TENTANG PLATFORM & STATISTIK
      ════════════════════════════════════════ */}
      <section id="about" className="relative min-h-screen py-24 px-6 md:px-14 lg:px-20 flex flex-col justify-center">
        {/* Background TANPA FILTER */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/unj_bg.png"
            alt="Universitas Negeri Jakarta"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full">

          {/* Judul section */}
          <h2 className="text-2xl md:text-4xl font-black italic text-white uppercase tracking-tight mb-10 drop-shadow-md">
            TENTANG PLATFORM
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── KARTU 1: Tentang Platform ── */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl p-7 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                  <i className="fa-solid fa-info-circle text-2xl"></i>
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Tentang Platform</h3>
              </div>
              <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                <strong>HDAP (Hybrid-Diagnostic Assessment Platform)</strong> adalah platform e-assessment yang mengintegrasikan psikometrik modern berbasis IRT dengan kecerdasan buatan Generative AI.
              </p>
              <p className="text-[11px] md:text-sm text-slate-600 font-semibold leading-relaxed text-justify mb-4">
                Hybrid-Diagnostic Assessment Platform (HDAP) merupakan sistem penilaian cerdas yang dirancang khusus untuk memetakan profil literasi digital mahasiswa calon guru secara objektif dan mendalam. Menggunakan integrasi Model Rasch (IRT) dan Generative AI.
              </p>
              <div className="mt-auto space-y-3">
                <button
                  onClick={() => router.push("/buku-panduan")}
                  className="w-full py-3.5 bg-white border-2 border-blue-600 text-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-book-open"></i> BACA BUKU PANDUAN
                </button>
                <div className="flex items-center gap-2 px-2">
                  <i className="fa-solid fa-envelope text-blue-600 text-xs"></i>
                  <a href="mailto:ruslina.irianty@mhs.unj.ac.id" className="text-[10px] font-bold text-slate-500 hover:text-blue-600 transition-colors">
                    ruslina.irianty@mhs.unj.ac.id
                  </a>
                </div>
              </div>
            </div>

            {/* ── KARTU 2: Statistik Pengunjung ── */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl p-7 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                  <i className="fa-solid fa-chart-pie text-2xl"></i>
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Statistik pengunjung Platform</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 flex-1">
                {stats.map((s, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow text-center">
                    <i className={`fa-solid ${s.icon} ${s.color} text-2xl mb-2`}></i>
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">{s.value}</span>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 leading-tight">{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-4 border-t border-slate-200">
                <button
                  onClick={() => router.push("/login")}
                  className="w-full py-3 bg-[#2563EB] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
                >
                  Mulai Asesmen
                </button>
              </div>
            </div>

            {/* ── KARTU 3: Preview Panel Admin ── */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl p-7 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                  <i className="fa-solid fa-chart-line text-2xl"></i>
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Preview Panel Admin</h3>
              </div>
              {/* Admin panel screenshot preview */}
              <div className="relative flex-1 min-h-[200px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900">
                <Image
                  src="/admin-preview.png"
                  alt="Preview Panel Admin HDAP"
                  fill
                  className="object-cover object-top"
                  onError={(e) => {
                    // fallback jika gambar belum ada
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Overlay label */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-4">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dashboard</p>
                    <p className="text-sm font-black text-white">MADEL5C Psychometric Analysis</p>
                  </div>
                </div>
                {/* Fallback jika gambar belum tersedia */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-3 p-4">
                  <i className="fa-solid fa-chart-area text-4xl text-slate-500"></i>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                    MADEL5C Psychometric Analysis<br />Wright Map · CFA · IRT · Cluster
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                Panel admin menampilkan analisis psikometrik lengkap: Wright Map, CFA, DIF, distribusi cluster literasi digital, dan unduhan laporan.
              </p>
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

    </div>
  );
}
