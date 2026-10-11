"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TransparentImage } from "../../components/PapuanSideOrnaments";

export const dynamic = "force-dynamic";

export default function ThinkAloudS3LoginPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [respondentLevel, setRespondentLevel] = useState<"S3" | "S2">("S3");
  const [studyProgram, setStudyProgram] = useState("Pendidikan Dasar");
  const [campus, setCampus] = useState("");
  const [nim, setNim] = useState("");
  const [gender, setGender] = useState<string>("Laki-Laki");
  const [origin, setOrigin] = useState<string>("Jawa");
  const [teachingExp, setTeachingExp] = useState<string>("3-5 Tahun");
  const [lang, setLang] = useState<"id" | "en">("id");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleS3Login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError(lang === "en" ? "Please enter your full name." : "Mohon masukkan nama lengkap Anda.");
      return;
    }
    if (!campus.trim()) {
      setError(lang === "en" ? "Please enter your university/institution." : "Mohon masukkan nama universitas/institusi Anda.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Simpan responden ke database PostgreSQL melalui /api/auth
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${name.trim()} (${respondentLevel})`,
          campus: campus.trim(),
          gender: gender || "Laki-Laki",
          origin: origin || "Jawa",
          specialNeeds: "tidak",
        }),
      });

      let userId = `s3_${Date.now()}`;
      if (res.ok) {
        const data = await res.json();
        if (data.userId) userId = data.userId;
      }

      // 2. Simpan identitas lengkap ke localStorage khusus S2/S3
      if (typeof window !== "undefined") {
        localStorage.setItem("s3_userId", userId);
        localStorage.setItem("s3_userName", name.trim());
        localStorage.setItem("s3_respondentLevel", respondentLevel);
        localStorage.setItem("s3_studyProgram", studyProgram);
        localStorage.setItem("s3_userCampus", campus.trim());
        localStorage.setItem("s3_userNim", nim.trim() || `NIM_${Date.now().toString().slice(-4)}`);
        localStorage.setItem("s3_userGender", gender);
        localStorage.setItem("s3_userOrigin", origin);
        localStorage.setItem("s3_teachingExp", teachingExp);
        localStorage.setItem("s3_lang", lang);
      }

      // 3. Masuk ke halaman asesmen Think-Aloud S2/S3
      router.push("/assessment/think-aloud-s3");
    } catch (err) {
      console.error(err);
      // Fallback tetap bisa masuk jika ada kendala koneksi
      if (typeof window !== "undefined") {
        const fallbackId = `s3_offline_${Date.now()}`;
        localStorage.setItem("s3_userId", fallbackId);
        localStorage.setItem("s3_userName", name.trim());
        localStorage.setItem("s3_respondentLevel", respondentLevel);
        localStorage.setItem("s3_studyProgram", studyProgram);
        localStorage.setItem("s3_userCampus", campus.trim());
        localStorage.setItem("s3_userNim", nim.trim() || "S3_NIM");
        localStorage.setItem("s3_lang", lang);
      }
      router.push("/assessment/think-aloud-s3");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative py-10 px-4 overflow-x-hidden font-sans"
      style={{
        backgroundImage: "url('/unj_bg_v2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* SEPASANG CENDERAWASIH BESAR KIRI */}
      <div className="hidden lg:flex fixed left-4 xl:left-10 top-1/2 -translate-y-1/2 z-10 pointer-events-none flex-col items-center">
        <motion.div
          animate={{
            y: [0, -16, 12, -14, 0],
            x: [0, 12, -10, 14, 0],
            rotate: [-3, 5, -4, 3, -3],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="w-60 xl:w-72 h-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)]"
        >
          <TransparentImage
            src="/cenderawasih_jantan.png"
            alt="Burung Cenderawasih Jantan Papua Kiri"
            className="w-full h-auto object-contain"
          />
        </motion.div>
      </div>

      {/* SEPASANG CENDERAWASIH BESAR KANAN */}
      <div className="hidden lg:flex fixed right-4 xl:right-10 top-1/2 -translate-y-1/2 z-10 pointer-events-none flex-col items-center">
        <motion.div
          animate={{
            y: [0, 14, -16, 10, 0],
            x: [0, -12, 10, -12, 0],
            rotate: [3, -5, 4, -3, 3],
          }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-60 xl:w-72 h-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)]"
        >
          <TransparentImage
            src="/cenderawasih_jantan.png"
            alt="Burung Cenderawasih Jantan Papua Kanan"
            className="w-full h-auto object-contain -scale-x-100"
          />
        </motion.div>
      </div>

      {/* CARD FORM LOGIN UTAMA S2/S3 */}
      <div className="w-full max-w-lg relative z-20 space-y-4">
        {/* HEADER BRAND TIMBUL */}
        <div className="text-center mb-5">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900 rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-2xl border-b-4 border-purple-950">
            <i className="fa-solid fa-graduation-cap text-amber-300 text-3xl md:text-4xl"></i>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-purple-900/80 border border-purple-400 text-amber-300 text-[10px] md:text-xs font-black uppercase tracking-widest shadow-md inline-block mb-1.5">
            PASCASARJANA (S2 & S3)
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] uppercase tracking-tight italic">
            THINK-ALOUD PROTOCOL
          </h1>
          <p className="text-[11px] md:text-xs font-black text-purple-200 uppercase tracking-widest drop-shadow">
            Portal Masuk Wawancara Kognitif 15 Butir Strategis
          </p>
        </div>

        {/* KARTU FORM TIMBUL 3D */}
        <div className="card-timbul p-6 md:p-8 rounded-[36px] bg-white/95 backdrop-blur-md shadow-2xl border-t-4 border-t-purple-600 border-x-2 border-b-8 border-b-purple-950">
          
          {/* BILINGUAL LANGUAGE SELECTOR TIMBUL */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200">
            <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider">
              <i className="fa-solid fa-language text-purple-700 text-sm"></i>
              <span>{lang === "en" ? "Language / Bahasa:" : "Bahasa Pengantar:"}</span>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
              <button
                type="button"
                onClick={() => setLang("id")}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                  lang === "id"
                    ? "bg-purple-700 text-white shadow-sm border-b-2 border-purple-950"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>🇮🇩</span> <span>ID</span>
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                  lang === "en"
                    ? "bg-purple-700 text-white shadow-sm border-b-2 border-purple-950"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>🇬🇧</span> <span>EN</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 mb-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5">
              <i className="fa-solid fa-circle-exclamation text-rose-600"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleS3Login} className="space-y-4">
            
            {/* JENJANG PASCASARJANA TIMBUL (S3 / S2) */}
            <div>
              <label className="text-[10px] md:text-xs font-black text-slate-800 uppercase tracking-wider block mb-1.5 ml-1">
                {lang === "en" ? "Postgraduate Level" : "Jenjang Pascasarjana"}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRespondentLevel("S3")}
                  className={`py-3 px-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border-b-4 flex items-center justify-center gap-2 ${
                    respondentLevel === "S3"
                      ? "bg-gradient-to-r from-purple-700 to-indigo-800 text-white border-purple-950 shadow-md scale-[1.02]"
                      : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <i className="fa-solid fa-award text-amber-300"></i>
                  <span>Program Doktor (S3)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRespondentLevel("S2")}
                  className={`py-3 px-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border-b-4 flex items-center justify-center gap-2 ${
                    respondentLevel === "S2"
                      ? "bg-gradient-to-r from-purple-700 to-indigo-800 text-white border-purple-950 shadow-md scale-[1.02]"
                      : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <i className="fa-solid fa-user-graduate text-amber-300"></i>
                  <span>Program Magister (S2)</span>
                </button>
              </div>
            </div>

            {/* NAMA LENGKAP & GELAR */}
            <div>
              <label className="text-[10px] md:text-xs font-black text-slate-800 uppercase tracking-wider block mb-1 ml-1">
                {lang === "en" ? "Full Name & Academic Title" : "Nama Lengkap & Gelar Akademik"}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === "en" ? "e.g. Dr. (Cand.) / John Doe, M.Pd" : "Contoh: Dr. (Cand.) Budi Santoso, M.Pd"}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 text-xs md:text-sm text-slate-900 font-bold focus:border-purple-600 focus:bg-white outline-none transition-all shadow-inner"
              />
            </div>

            {/* PROGRAM STUDI */}
            <div>
              <label className="text-[10px] md:text-xs font-black text-slate-800 uppercase tracking-wider block mb-1 ml-1">
                {lang === "en" ? "Study Program / Concentration" : "Program Studi / Konsentrasi"}
              </label>
              <input
                type="text"
                required
                value={studyProgram}
                onChange={(e) => setStudyProgram(e.target.value)}
                placeholder={lang === "en" ? "e.g. Primary Education / Educational Evaluation" : "Contoh: Pendidikan Dasar / PEP / Teknologi Pendidikan"}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 text-xs md:text-sm text-slate-900 font-bold focus:border-purple-600 focus:bg-white outline-none transition-all shadow-inner"
              />
            </div>

            {/* KAMPUS / LPTK & NIM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] md:text-xs font-black text-slate-800 uppercase tracking-wider block mb-1 ml-1">
                  {lang === "en" ? "University / LPTK" : "Perguruan Tinggi / LPTK"}
                </label>
                <input
                  type="text"
                  required
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  placeholder="Contoh: UNJ / UPI / UNY"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 text-xs md:text-sm text-slate-900 font-bold focus:border-purple-600 focus:bg-white outline-none transition-all shadow-inner"
                />
              </div>
              <div>
                <label className="text-[10px] md:text-xs font-black text-slate-800 uppercase tracking-wider block mb-1 ml-1">
                  {lang === "en" ? "Student ID (NIM / NPM)" : "NIM / NPM (Opsional)"}
                </label>
                <input
                  type="text"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  placeholder="Contoh: 1201824001"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 text-xs md:text-sm text-slate-900 font-bold focus:border-purple-600 focus:bg-white outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            {/* DEMOGRAFI: GENDER & PENGALAMAN MENGAJAR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] md:text-xs font-black text-slate-800 uppercase tracking-wider block mb-1 ml-1">
                  {lang === "en" ? "Gender" : "Jenis Kelamin"}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 text-xs md:text-sm text-slate-900 font-bold focus:border-purple-600 focus:bg-white outline-none transition-all shadow-inner cursor-pointer"
                >
                  <option value="Laki-Laki">{lang === "en" ? "Male (Laki-Laki)" : "Laki-Laki"}</option>
                  <option value="Perempuan">{lang === "en" ? "Female (Perempuan)" : "Perempuan"}</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] md:text-xs font-black text-slate-800 uppercase tracking-wider block mb-1 ml-1">
                  {lang === "en" ? "Teaching / Academic Exp." : "Pengalaman Mengajar / Dosen"}
                </label>
                <select
                  value={teachingExp}
                  onChange={(e) => setTeachingExp(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 text-xs md:text-sm text-slate-900 font-bold focus:border-purple-600 focus:bg-white outline-none transition-all shadow-inner cursor-pointer"
                >
                  <option value="1-3 Tahun">{lang === "en" ? "1-3 Years" : "1 - 3 Tahun"}</option>
                  <option value="4-7 Tahun">{lang === "en" ? "4-7 Years" : "4 - 7 Tahun"}</option>
                  <option value="> 7 Tahun">{lang === "en" ? "> 7 Years" : "Lebih dari 7 Tahun"}</option>
                </select>
              </div>
            </div>

            {/* SUBMIT BUTTON TIMBUL */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-4 px-6 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 hover:from-purple-800 hover:to-indigo-800 text-white font-black text-xs md:text-sm uppercase tracking-widest rounded-2xl shadow-xl border-b-4 border-purple-950 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  <span>{lang === "en" ? "Connecting..." : "Menghubungkan..."}</span>
                </>
              ) : (
                <>
                  <span>{lang === "en" ? "START THINK-ALOUD PROTOCOL (15 ITEMS)" : "MASUK KE SESI THINK-ALOUD (15 BUTIR)"}</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </>
              )}
            </button>
          </form>

          {/* LINK KEMBALI KE LANDING PAGE */}
          <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-slate-500 hover:text-purple-700 transition-colors flex items-center gap-1.5"
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>{lang === "en" ? "Back to Landing Page" : "Kembali ke Halaman Utama"}</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {lang === "en" ? "S1 Teacher Candidate Login →" : "Login Calon Guru S1 →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
