"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Menghindari timeout saat build di VPS
export const dynamic = "force-dynamic";

interface Option {
  text: string;
  score: number;
}

interface Question {
  id?: number;
  scenario: string;
  options: Option[];
}

// TRANSPARENT IMAGE CUTOUT COMPONENT (REMOVES WHITE BACKGROUND PIXELS AUTOMATICALLY)
function TransparentImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [cleanSrc, setCleanSrc] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setCleanSrc(src);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > 215 && g > 215 && b > 215) {
          data[i + 3] = 0;
        } else if (r > 185 && g > 185 && b > 185) {
          const avg = (r + g + b) / 3;
          const factor = (215 - avg) / 30;
          data[i + 3] = Math.max(0, Math.min(255, Math.floor(255 * factor)));
        }
      }
      ctx.putImageData(imgData, 0, 0);
      setCleanSrc(canvas.toDataURL("image/png"));
    };
    img.onerror = () => setCleanSrc(src);
  }, [src]);

  return (
    <img
      src={cleanSrc || src}
      alt={alt}
      className={className}
    />
  );
}

export default function Madel5cAssessment() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [consentChecks, setConsentChecks] = useState<boolean[]>([false, false, false, false, false, false]);
  const [showConsent, setShowConsent] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showStageBreak, setShowStageBreak] = useState(false);
  const [breakStage, setBreakStage] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const router = useRouter();

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speakText = (textToSpeak: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Maaf, peramban (browser) Anda belum mendukung fitur pembaca suara Text-to-Speech.");
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    const cleanText = textToSpeak.replace(/<[^>]*>?/gm, "").replace(/\n/g, ". ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "id-ID";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang.includes("id") || v.lang.includes("ID"));
    if (idVoice) utterance.voice = idVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    stopSpeaking();
  }, [currentStep, stopSpeaking]);

  const consentStatements = [
    "Saya telah membaca dan memahami penjelasan penelitian di atas.",
    "Saya mendapat kesempatan bertanya, dan pertanyaan saya telah dijawab dengan memuaskan.",
    "Saya memahami bahwa keikutsertaan saya bersifat sukarela dan saya dapat mengundurkan diri kapan saja tanpa konsekuensi.",
    "Saya memahami bahwa data saya dirahasiakan dan hanya dilaporkan dalam bentuk gabungan (agregat).",
    "Saya berusia 18 tahun atau lebih.",
    "Saya bersedia ikut serta dalam penelitian pengembangan instrumen e-asesmen MADEL5C ini."
  ];

  const allConsentChecked = consentChecks.every(Boolean);

  const toggleConsentCheck = (index: number) => {
    const updated = [...consentChecks];
    updated[index] = !updated[index];
    setConsentChecks(updated);
  };

  const toggleAllConsent = () => {
    if (allConsentChecked) {
      setConsentChecks([false, false, false, false, false, false]);
    } else {
      setConsentChecks([true, true, true, true, true, true]);
    }
  };

  const optionColors = [
    "bg-white border-slate-100 text-slate-900",
    "bg-white border-slate-100 text-slate-900",
    "bg-white border-slate-100 text-slate-900",
    "bg-white border-slate-100 text-slate-900",
    "bg-white border-slate-100 text-slate-900"
  ];

  const shuffleArray = (array: Option[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/questions?type=madel5c', { cache: 'no-store' });
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const shuffledQuestions = data.map((q: Question) => ({
          ...q,
          options: shuffleArray(q.options)
        }));
        setQuestions(shuffledQuestions);
      } else {
        console.error("Data soal kosong atau bukan array");
      }
    } catch (err) {
      console.error("Gagal mengambil soal:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const submitAssessment = useCallback(async (finalAnswers: Record<number, number>) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return router.push("/login");
    const totalScore = Object.values(finalAnswers).reduce((a, b) => a + b, 0);
    try {
      await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, type: "MADEL5C", totalScore, answersJson: finalAnswers }),
      });
      // Tampilkan kartu terima kasih
      setIsSubmitted(true);
    } catch (err) { console.error(err); }
  }, [router]);

  const handleAnswer = (idx: number) => {
    if (!questions[currentStep]) return;
    const selectedOption = questions[currentStep].options[idx];
    const newAnswers = { ...answers, [currentStep]: selectedOption.score };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (currentStep === 9) {
        setBreakStage(1);
        setShowStageBreak(true);
      } else if (currentStep === 19) {
        setBreakStage(2);
        setShowStageBreak(true);
      } else if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
      else {
        submitAssessment(newAnswers);
      }
    }, 300);
  };

  const handleNextStage = () => {
    setShowStageBreak(false);
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black text-xs uppercase tracking-widest text-slate-400">Menghubungkan ke Database Soal...</p>
    </div>
  );

  if (questions.length === 0) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <i className="fa-solid fa-triangle-exclamation text-rose-500 text-4xl mb-4"></i>
      <p className="font-black text-sm uppercase tracking-widest text-slate-900 mb-4">Soal gagal dimuat.</p>
      <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Coba Lagi</button>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col justify-center"
      style={{ backgroundImage: "url('/unj_bg_v2.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>

      {/* PANEL ORNAMEN TIMBUL SISIPAN KIRI: CENDERAWASIH (ZIG-ZAG), MAHASISWA PAPUA, & TIFA PAPUA (ZIG-ZAG) */}
      <div className="hidden xl:flex flex-col items-center justify-between fixed left-2 top-8 bottom-8 z-0 pointer-events-none w-56 text-center">
        {/* ANIMASI BURUNG CENDERAWASIH ZIG-ZAG (ATAS KIRI) */}
        <motion.div
          animate={{
            y: [0, -22, 14, -18, 0],
            x: [0, 16, -14, 18, 0],
            rotate: [-4, 6, -5, 4, -4],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="w-36 lg:w-44 h-auto drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)]"
        >
          <TransparentImage
            src="/cenderawasih.png"
            alt="Burung Cenderawasih Papua Asli"
            className="w-full h-auto object-contain"
          />
        </motion.div>

        {/* MAHASISWA CALON GURU PAPUA (TENGAH KIRI) */}
        <div className="my-auto">
          <TransparentImage
            src="/papua_student_male.png"
            alt="Mahasiswa Calon Guru Papua"
            className="w-48 lg:w-56 h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.22)]"
          />
        </div>

        {/* ANIMASI TIFA PAPUA ZIG-ZAG (BAWAH KIRI) */}
        <motion.div
          animate={{
            y: [0, 16, -12, 15, 0],
            x: [0, -14, 16, -12, 0],
            rotate: [0, 6, -6, 4, 0],
          }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-28 lg:w-36 h-auto drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)]"
        >
          <TransparentImage
            src="/tifa_papua.png"
            alt="Alat Musik Tifa Papua"
            className="w-full h-auto object-contain"
          />
        </motion.div>
      </div>

      {/* PANEL ORNAMEN TIMBUL SISIPAN KANAN: CENDERAWASIH (ZIG-ZAG), PENDIDIK PAPUA, & TIFA PAPUA (ZIG-ZAG) */}
      <div className="hidden xl:flex flex-col items-center justify-between fixed right-2 top-8 bottom-8 z-0 pointer-events-none w-56 text-center">
        {/* ANIMASI BURUNG CENDERAWASIH ZIG-ZAG (ATAS KANAN - CERMIN SELARAS) */}
        <motion.div
          animate={{
            y: [0, 18, -20, 14, 0],
            x: [0, -18, 15, -16, 0],
            rotate: [4, -6, 5, -4, 4],
          }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-36 lg:w-44 h-auto drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)]"
        >
          <TransparentImage
            src="/cenderawasih.png"
            alt="Burung Cenderawasih Papua Asli"
            className="w-full h-auto object-contain -scale-x-100"
          />
        </motion.div>

        {/* PENDIDIK MASA DEPAN PAPUA (TENGAH KANAN) */}
        <div className="my-auto">
          <TransparentImage
            src="/papua_student_female.png"
            alt="Pendidik Masa Depan Papua"
            className="w-48 lg:w-56 h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.22)]"
          />
        </div>

        {/* ANIMASI TIFA PAPUA ZIG-ZAG (BAWAH KANAN - SELARAS) */}
        <motion.div
          animate={{
            y: [0, -14, 18, -12, 0],
            x: [0, 15, -16, 14, 0],
            rotate: [0, -5, 5, -3, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-28 lg:w-36 h-auto drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)]"
        >
          <TransparentImage
            src="/tifa_papua.png"
            alt="Alat Musik Tifa Papua"
            className="w-full h-auto object-contain"
          />
        </motion.div>
      </div>

      <main className="relative z-10 w-full max-w-3xl md:max-w-4xl mx-auto px-3 md:px-6 py-3 md:py-6">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="card-timbul p-6 md:p-10 rounded-[32px] md:rounded-[40px] text-center"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner border-2 border-blue-200">
                <i className="fa-solid fa-circle-check text-4xl md:text-5xl"></i>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-4 italic">TERIMA KASIH BANYAK!</h2>
              <div className="w-12 h-1.5 bg-blue-600 mx-auto rounded-full mb-6 shadow-sm"></div>
              <p className="text-xs md:text-sm font-bold text-slate-600 leading-relaxed mb-8">
                Anda telah berhasil menyelesaikan instrumen asesmen MADEL5C. Silakan melanjutkan untuk mengisi survey evaluasi sistem.
              </p>
              <button
                onClick={() => router.push("/survey")}
                className="w-full py-4 md:py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl border-b-4 border-blue-900 transition-all active:scale-95"
              >
                LANJUT KE SURVEY KEPUASAN <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            </motion.div>
          ) : showConsent ? (
            /* ─── KARTU INFORMED CONSENT TIMBUL RESMI ─── */
            <motion.div key="consent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="card-timbul p-5 md:p-8 rounded-[28px] md:rounded-[36px] max-h-[85vh] overflow-y-auto space-y-5"
            >
              {/* Header Informasi Riset */}
              <div className="flex items-start gap-4 border-b border-slate-200/80 pb-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl flex items-center justify-center text-white shadow-lg border-b-2 border-emerald-950 shrink-0">
                  <i className="fa-solid fa-file-signature text-2xl md:text-3xl"></i>
                </div>
                <div>
                  <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest block mb-0.5">LEMBAR PENJELASAN & PERSETUJUAN PENELITIAN</span>
                  <h1 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tighter leading-snug">
                    INFORMED CONSENT RESPONDEN MADEL-5C
                  </h1>
                  <p className="text-[10px] md:text-[11px] font-bold text-slate-500 italic mt-0.5">
                    &quot;Pengembangan Instrumen E-Asesmen Literasi Digital MADEL5C bagi Mahasiswa Calon Guru Berbasis Website&quot;
                  </p>
                </div>
              </div>

              {/* Grid Metadata Peneliti & Doktoral UNJ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 text-[10px] md:text-[11px]">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-user-graduate text-emerald-700 text-sm w-4"></i>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[8px] block">Peneliti:</span>
                    <strong className="font-black text-emerald-950">Ruslina Irianty (NIM 9913924001)</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-building-columns text-emerald-700 text-sm w-4"></i>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[8px] block">Program Studi:</span>
                    <strong className="font-black text-emerald-950">Doktor PEP Pascasarjana UNJ</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2 border-t border-emerald-200/60 pt-2 mt-0.5">
                  <i className="fa-solid fa-chalkboard-user text-emerald-700 text-sm w-4"></i>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[8px] block">Tim Promotor:</span>
                    <strong className="font-black text-emerald-950">Prof. Dr. Dinny Devi Triana, M.Pd. & Prof. Dr. Ari Saptono, SE., M.Pd.</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2 border-t border-emerald-200/60 pt-2">
                  <i className="fa-solid fa-envelope text-emerald-700 text-sm w-4"></i>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[8px] block">Kontak Resmi Peneliti:</span>
                    <strong className="font-black text-emerald-950">ruslinairianty7@gmail.com</strong>
                  </div>
                </div>
              </div>

              {/* 1. Lembar Penjelasan Penelitian */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-1.5">
                  <i className="fa-solid fa-circle-info text-emerald-600"></i> 1. Lembar Penjelasan Penelitian
                </h3>
                <div className="grid grid-cols-1 gap-2.5 text-[11px] font-bold text-slate-700 leading-relaxed">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-emerald-800 font-black uppercase block text-[10px] mb-0.5">a. Tujuan Penelitian</span>
                    <p className="text-[10px] md:text-[11px]">
                      Penelitian ini bertujuan mengembangkan dan menguji kualitas instrumen asesmen literasi digital bagi mahasiswa calon guru berbentuk <em>Situational Judgment Test (SJT)</em>. Penelitian ini menilai kualitas instrumen, bukan menilai kemampuan Anda secara pribadi.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-emerald-800 font-black uppercase block text-[10px] mb-0.5">b. Prosedur Pengisian</span>
                    <p className="text-[10px] md:text-[11px]">
                      Anda akan mengisi 30 situasi SJT secara daring melalui website e-asesmen MADEL5C (tersedia 5 pilihan tindakan pada tiap situasi). Pengisian memerlukan waktu sekitar 45–60 menit dari perangkat Anda sendiri.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-emerald-800 font-black uppercase block text-[10px] mb-0.5">c. Risiko, Kerahasiaan & Partisipasi Sukarela</span>
                    <p className="text-[10px] md:text-[11px]">
                      Penelitian ini tidak menimbulkan risiko fisik. Identitas Anda dirahasiakan sepenuhnya dan jawaban hanya dilaporkan dalam bentuk agregat. Keikutsertaan Anda bersifat <strong>sukarela</strong> dan Anda berhak berhenti kapan saja tanpa sanksi atau konsekuensi akademik apapun.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Pernyataan Persetujuan (Bagian A.2 / Bagian C Checkboxes) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <i className="fa-solid fa-square-check text-emerald-600"></i> 2. Pernyataan Persetujuan Responden
                  </h3>
                  <button
                    type="button"
                    onClick={toggleAllConsent}
                    className="text-[9px] font-black text-emerald-700 hover:text-emerald-900 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-300 transition-all active:scale-95"
                  >
                    {allConsentChecked ? "Batal Centang Semua" : "Centang Semua Point"}
                  </button>
                </div>

                <div className="space-y-2">
                  {consentStatements.map((statement, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleConsentCheck(idx)}
                      className={`p-3 rounded-xl flex items-start gap-3 cursor-pointer transition-all border ${
                        consentChecks[idx]
                          ? "bg-emerald-100/90 border-emerald-300 shadow-sm"
                          : "bg-slate-50 border-slate-200 hover:bg-emerald-50/50"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] shrink-0 mt-0.5 transition-all border-2 ${
                        consentChecks[idx]
                          ? "bg-emerald-600 border-emerald-700 text-white shadow-xs"
                          : "bg-white border-slate-300 text-transparent"
                      }`}>
                        <i className="fa-solid fa-check"></i>
                      </div>
                      <p className="text-[10px] md:text-[11px] font-bold text-slate-800 leading-snug select-none">
                        {statement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons Action Grid */}
              <div className="pt-2 space-y-2">
                <button 
                  disabled={!allConsentChecked}
                  onClick={() => setShowConsent(false)} 
                  className={`w-full py-4 font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl border-b-4 transition-all ${
                    allConsentChecked 
                      ? "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white border-emerald-950 active:scale-95 cursor-pointer"
                      : "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-70"
                  }`}
                >
                  {allConsentChecked ? (
                    <>SAYA SETUJU & LANJUT KE PANDUAN <i className="fa-solid fa-arrow-right ml-2"></i></>
                  ) : (
                    <>HARAP CENTANG SELURUH POINT PERSETUJUAN DI ATAS</>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="w-full py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all border border-slate-200 hover:border-rose-200"
                >
                  <i className="fa-solid fa-xmark mr-1.5"></i> SAYA TIDAK SETUJU (BATALKAN PENGISIAN)
                </button>
              </div>
            </motion.div>
          ) : showInstructions ? (
            /* ─── KARTU PANDUAN LANGKAH-LANGKAH TIMBUL ─── */
            <motion.div key="instructions" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="card-timbul p-6 md:p-8 rounded-[28px] md:rounded-[36px]"
            >
              <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg border-b-2 border-blue-900 shrink-0">
                  <i className="fa-solid fa-list-check text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight">Panduan Langkah-Langkah</h1>
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Petunjuk Pengisian MADEL-5C (30 Butir SJT)</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="p-3.5 option-card-timbul rounded-2xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                    1
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-slate-900 uppercase">Cermati Skenario Situasi Nyata</h4>
                    <p className="text-[10px] font-bold text-slate-600 leading-relaxed">
                      Baca skenario situasi nyata yang disajikan dalam <strong className="font-black text-emerald-800">Kartu Pertanyaan Berwarna Hijau Soft</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 option-card-timbul rounded-2xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                    2
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-slate-900 uppercase">Pilih 1 Tindakan Paling Efektif</h4>
                    <p className="text-[10px] font-bold text-slate-600 leading-relaxed">
                      Pilihlah 1 dari 5 pilihan tindakan (A, B, C, D, E) yang menurut Anda paling tepat. Pilihan terpilih akan berubah warna menjadi <strong className="font-black text-[#4B5320]">Army Green</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 option-card-timbul rounded-2xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                    3
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-slate-900 uppercase">Pengisian Bertahap (3 Tahap)</h4>
                    <p className="text-[10px] font-bold text-slate-600 leading-relaxed">
                      Instrumen terdiri dari <strong className="font-black text-slate-900">30 butir</strong> yang dibagi menjadi <strong className="font-black text-slate-900">3 Tahap</strong> (masing-masing 10 butir). Anda dapat meregangkan mata saat jeda perpindahan tahap.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 option-card-timbul rounded-2xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                    4
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-slate-900 uppercase">Lihat Hasil & Lanjut Evaluasi</h4>
                    <p className="text-[10px] font-bold text-slate-600 leading-relaxed">
                      Setelah menyelesaikan seluruh 30 butir, Anda dapat melihat profil kompetensi digital dan melanjutkan ke survei kepuasan sistem.
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowInstructions(false)} 
                className="w-full py-4 md:py-5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl border-b-4 border-indigo-950 active:scale-95 transition-all"
              >
                MULAI ASESMEN SEKARANG <i className="fa-solid fa-play ml-2"></i>
              </button>
            </motion.div>
          ) : showStageBreak ? (
            <motion.div key="break" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="card-timbul p-8 rounded-[32px] md:rounded-[40px] text-center"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner border-2 border-amber-200">
                <i className="fa-solid fa-mug-hot text-3xl md:text-4xl animate-bounce"></i>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-2">
                Tahap {breakStage} Selesai!
              </h2>
              <div className="w-12 h-1 bg-amber-500 mx-auto rounded-full mb-4 shadow-sm"></div>
              <p className="text-xs font-bold text-slate-600 leading-relaxed mb-6">
                Hebat! Anda telah menyelesaikan 10 butir pada Tahap {breakStage}.
                Istirahatlah sejenak untuk mengistirahatkan mata dan meregangkan tubuh Anda sebelum melanjutkan ke Tahap {breakStage + 1}.
              </p>
              <button
                onClick={handleNextStage}
                className="w-full py-4 md:py-5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl border-b-4 border-indigo-950 active:scale-95 transition-all"
              >
                LANJUT KE TAHAP {breakStage + 1} <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            </motion.div>
          ) : (
            <motion.div key="assessment" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 md:space-y-3">
              {/* Header Card Timbul Progress */}
              <div className="card-timbul p-3 md:p-3.5 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Tahap {Math.floor(currentStep / 10) + 1} dari 3</p>
                  <span className="text-base md:text-lg font-black text-slate-900 italic">Skenario #{(currentStep % 10) + 1} dari 10</span>
                </div>
                <div className="w-24 md:w-36 h-2 md:h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                   <div className="h-full bg-gradient-to-r from-emerald-600 to-[#4B5320] transition-all duration-500 rounded-full" style={{ width: `${(((currentStep % 10) + 1) / 10) * 100}%` }}></div>
                </div>
              </div>

              {/* 1. Kartu Pertanyaan Skenario Terpisah (Hijau Soft) */}
              <div className="scenario-timbul p-3.5 md:p-4.5 rounded-2xl md:rounded-3xl shadow-lg border border-emerald-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/60 pb-1.5">
                  <span className="text-[8px] md:text-[9px] font-black text-emerald-800 uppercase tracking-widest block">DESKRIPSI SITUASI SKENARIO:</span>
                  <button
                    type="button"
                    onClick={() =>
                      speakText(
                        `Deskripsi situasi skenario. ${questions[currentStep]?.scenario}. Pilihan tindakan. ${questions[currentStep]?.options
                          ?.map((o, idx) => `Opsi ${String.fromCharCode(65 + idx)}: ${o.text}`)
                          .join(". ")}`
                      )
                    }
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 flex items-center gap-1 border shadow-sm ${
                      isSpeaking
                        ? "bg-amber-500 text-slate-950 border-amber-300 animate-pulse"
                        : "bg-emerald-800 hover:bg-emerald-900 text-white border-emerald-700"
                    }`}
                  >
                    <i className={`fa-solid ${isSpeaking ? "fa-volume-xmark" : "fa-volume-high"}`}></i>
                    <span>{isSpeaking ? "Hentikan Suara" : "🔊 Dengarkan Suara Soal"}</span>
                  </button>
                </div>
                <p className="text-[11px] md:text-[13px] text-slate-900 font-bold leading-snug md:leading-relaxed italic">&quot;{questions[currentStep]?.scenario}&quot;</p>
              </div>

              {/* 2. Daftar Kartu Pilihan Jawaban Terpisah Mandiri */}
              <div className="space-y-1.5 md:space-y-2">
                {questions[currentStep]?.options?.map((opt, idx: number) => {
                  const isSelected = answers[currentStep] === opt.score;
                  const letter = String.fromCharCode(65 + idx); // A, B, C, D, E
                  return (
                    <button key={idx} onClick={() => handleAnswer(idx)}
                      className={`w-full p-2.5 md:p-3 rounded-xl md:rounded-2xl text-left transition-all ${isSelected
                          ? "option-card-timbul-selected"
                          : "option-card-timbul"
                        }`}
                    >
                      <div className="flex items-start gap-2.5 md:gap-3">
                        <span className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-[11px] font-black shrink-0 ${isSelected ? 'bg-white text-[#4B5320] shadow-sm' : 'bg-slate-100 text-slate-600 border border-slate-300'}`}>
                          {letter}
                        </span>
                        <span className="text-[11px] md:text-[12px] font-bold leading-snug block pt-0.5">{opt.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
