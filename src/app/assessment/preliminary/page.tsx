"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import PapuanSideOrnaments from "@/app/components/PapuanSideOrnaments";
import PsychometricIconStrip from "@/app/components/PsychometricIconStrip";

// Menghindari timeout saat build di VPS
export const dynamic = "force-dynamic";

const pdiQuestions = [
  "Saya mampu mengidentifikasi kebutuhan informasi digital untuk mendukung penyusunan karya ilmiah.",
  "Saya mampu menyeleksi sumber informasi digital yang valid dan kredibel untuk tugas perkuliahan.",
  "Saya mampu mengorganisasi file-file digital materi kuliah secara sistematis agar mudah dicari.",
  "Saya mampu berkomunikasi secara sopan dan profesional melalui media digital kepada dosen/rekan.",
  "Saya mampu berkolaborasi menggunakan platform berbagi dokumen (seperti Google Docs) secara efektif.",
  "Saya mampu merancang media presentasi atau konten digital untuk mendukung tugas pembelajaran.",
  "Saya mampu menjaga keamanan data pribadi dan akun akademik saya dari ancaman digital.",
  "Saya mampu menggunakan teknologi digital untuk menyelesaikan kendala teknis dalam tugas kuliah.",
];

const labels = [
  "Sangat Mampu",
  "Mampu",
  "Cukup Mampu",
  "Kurang Mampu",
  "Sangat Tidak Mampu"
];

export default function PreliminaryPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showInstructions, setShowInstructions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleAnswer = (qIndex: number, value: number) => {
    setAnswers({ ...answers, [qIndex]: value });
  };

  const isComplete = Object.keys(answers).length === pdiQuestions.length;

  const submitPreliminary = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return router.push("/login");

    setIsSubmitting(true);
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

    try {
      await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, type: "PDI-DL", totalScore, answersJson: answers }),
      });
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden"
      style={{
        backgroundImage: "url('/unj_bg_v2.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>

      {/* PANEL ORNAMEN TIMBUL SISIPAN KIRI & KANAN (PAPUA THEME) */}
      <PapuanSideOrnaments />

      <main className="relative z-10 max-w-xl mx-auto px-4 py-6 space-y-4">
        {/* STRIP 8 IKON PSIKOMETRI 3D TIMBUL MELAYANG */}
        <PsychometricIconStrip label="Indeks Self-Assessment PDI-DL:" />
        <AnimatePresence mode="wait">
          {showInstructions ? (
            <motion.div
              key="instructions"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="card-timbul p-8 rounded-[40px]"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center text-white shadow-lg border-b-2 border-emerald-900">
                  <i className="fa-solid fa-clipboard-check text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">PDI-DL Index</h1>
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Self-Assessment Tahap Awal</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 shadow-sm">
                  <h3 className="text-[11px] font-black text-emerald-900 uppercase mb-1 tracking-widest flex items-center gap-1.5">
                    <i className="fa-solid fa-circle-info text-emerald-600"></i> PANDUAN:
                  </h3>
                  <p className="text-[11px] font-bold text-emerald-800 leading-relaxed italic">
                    Pilihlah jawaban yang paling menggambarkan kemampuan diri Anda saat ini. Tidak Ada jawaban yang &quot;absolut benar&quot;. Yang terpenting adalah bagaimana Anda mengaplikasikan pemikiran dan pertimbangan profesional dalam mengatasi situasi yang diberikan.
                  </p>
                </div>
              </div>

              <button onClick={() => setShowInstructions(false)} className="w-full py-5 bg-gradient-to-r from-[#3b421a] to-[#4B5320] hover:from-[#2f3513] hover:to-[#3e451b] text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl border-b-4 border-[#252910] active:scale-95 transition-all">SAYA MENGERTI & MULAI</button>
            </motion.div>
          ) : (
            <motion.div key="preliminary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-black text-white uppercase drop-shadow-2xl italic tracking-tighter">PDI-DL ASSESSMENT</h2>
                <div className="w-12 h-1.5 bg-emerald-400 mx-auto mt-2 rounded-full shadow-lg"></div>
              </div>

              {pdiQuestions.map((q, i) => (
                <motion.div key={i} className="card-timbul p-6 rounded-[30px]">
                  <div className="mb-4 p-4 scenario-timbul rounded-2xl">
                    <p className="text-[13px] text-slate-900 font-bold leading-tight italic">
                      <span className="text-emerald-700 font-black mr-1">#{i + 1}</span> {q}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {labels.map((label, idx) => {
                      const val = 5 - idx;
                      const isSelected = answers[i] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleAnswer(i, val)}
                          className={`w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between ${isSelected
                              ? "option-card-timbul-selected"
                              : "option-card-timbul text-slate-700"
                            }`}
                        >
                          <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-white bg-white/20' : 'border-slate-300'}`}>
                            {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}

              <button
                disabled={!isComplete || isSubmitting}
                onClick={submitPreliminary}
                className={`w-full py-5 mt-10 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-2xl ${isComplete && !isSubmitting ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-b-4 border-emerald-900 text-white active:scale-95" : "bg-slate-300 text-slate-500 cursor-not-allowed border-b-4 border-slate-400"
                  }`}
              >
                {isSubmitting ? "MENGIRIM DATA..." : "SIMPAN & LANJUT KE DASHBOARD"}
                {!isSubmitting && <i className="fa-solid fa-arrow-right ml-2"></i>}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
