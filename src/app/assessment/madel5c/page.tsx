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

export default function Madel5cAssessment() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [showConsent, setShowConsent] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showStageBreak, setShowStageBreak] = useState(false);
  const [breakStage, setBreakStage] = useState(1);
  const router = useRouter();

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
            /* ─── KARTU INFORMED CONSENT TIMBUL ─── */
            <motion.div key="consent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="card-timbul p-6 md:p-8 rounded-[28px] md:rounded-[36px]"
            >
              <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center text-white shadow-lg border-b-2 border-emerald-900 shrink-0">
                  <i className="fa-solid fa-file-signature text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight">Informed Consent</h1>
                  <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Lembar Persetujuan Partisipasi Riset</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 shadow-sm">
                  <h3 className="text-[11px] font-black text-emerald-900 uppercase mb-1 flex items-center gap-1.5">
                    <i className="fa-solid fa-graduation-cap text-emerald-700"></i> Informasi Penelitian:
                  </h3>
                  <p className="text-[11px] font-bold text-emerald-800 leading-relaxed">
                    Penelitian ini berjudul <strong className="font-black text-emerald-950">&quot;PENGEMBANGAN INSTRUMEN e-ASSESSMENT LITERASI DIGITAL MADEL5C BAGI MAHASISWA CALON GURU BERBASIS WEBSITE&quot;</strong> oleh <strong className="font-black text-emerald-950">Ruslina Irianty (Program Doktor PEP - Universitas Negeri Jakarta)</strong>.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner space-y-2">
                  <h3 className="text-[11px] font-black text-slate-900 uppercase flex items-center gap-1.5">
                    <i className="fa-solid fa-user-shield text-slate-700"></i> Kerahasiaan Data Responden:
                  </h3>
                  <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">
                    &quot;Seluruh jawaban dan data pribadi yang Anda berikan bersifat konfidensial/rahasia dan hanya digunakan khusus untuk kepentingan analisis statistik riset ilmiah akademis.&quot;
                  </p>
                </div>

                <div 
                  onClick={() => setConsentAgreed(!consentAgreed)}
                  className={`p-4 rounded-2xl flex items-start gap-3 cursor-pointer transition-all border ${
                    consentAgreed ? "bg-emerald-100/90 border-emerald-300 shadow-md" : "bg-emerald-50/80 border-emerald-200 hover:bg-emerald-100/50"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 mt-0.5 transition-all border-2 ${
                    consentAgreed ? "bg-emerald-600 border-emerald-700 text-white shadow-sm" : "bg-white border-emerald-400 text-transparent"
                  }`}>
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <p className="text-[11px] font-black text-emerald-950 leading-snug select-none">
                    Dengan mengeklik kotak centang di samping ini, Anda menyatakan telah membaca, memahami, dan menyetujui secara sukarela untuk menjadi responden dalam pengisian instrumen ini.
                  </p>
                </div>
              </div>

              <button 
                disabled={!consentAgreed}
                onClick={() => setShowConsent(false)} 
                className={`w-full py-4 md:py-5 font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl border-b-4 transition-all ${
                  consentAgreed 
                    ? "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white border-emerald-900 active:scale-95 cursor-pointer"
                    : "bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed opacity-60"
                }`}
              >
                SAYA SETUJU & LANJUT KE PANDUAN <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
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
              <div className="scenario-timbul p-3.5 md:p-4.5 rounded-2xl md:rounded-3xl shadow-lg border border-emerald-200">
                <span className="text-[8px] md:text-[9px] font-black text-emerald-800 uppercase tracking-widest block mb-1">DESKRIPSI SITUASI SKENARIO:</span>
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
