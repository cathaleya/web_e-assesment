"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PreliminaryAssessment() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const router = useRouter();

  const defaultOptions = [
    { text: "Sangat Tidak Mampu", score: 1, color: "bg-rose-50 border-rose-100 text-rose-900" },
    { text: "Tidak Mampu", score: 2, color: "bg-orange-50 border-orange-100 text-orange-900" },
    { text: "Cukup Mampu", score: 3, color: "bg-amber-50 border-amber-100 text-amber-900" },
    { text: "Mampu", score: 4, color: "bg-emerald-50 border-emerald-100 text-emerald-900" },
    { text: "Sangat Mampu", score: 5, color: "bg-blue-50 border-blue-100 text-blue-900" }
  ];

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions?type=preliminary');
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleAnswer = (idx: number) => { setAnswers({ ...answers, [currentStep]: idx + 1 }); };

  const submitAssessment = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return router.push("/login");
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    try {
      await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, type: "PDI-DL", totalScore, answersJson: answers }),
      });
      // DIRECT REDIRECT TO SURVEY AS PER FLOW REQUIREMENT
      router.push("/survey");
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-xs">MEMUAT...</div>;

  return (
    <div className="min-h-screen relative"
         style={{ backgroundImage: "url('/unj_bg_v2.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>

      <main className="relative z-10 max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {showInstructions ? (
            <motion.div key="instructions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-white p-6 rounded-2xl shadow-2xl border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-4 border-b pb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <i className="fa-solid fa-circle-info text-xl"></i>
                </div>
                <h1 className="text-xl font-black text-slate-900 uppercase">Panduan PDI-DL</h1>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <h3 className="text-[10px] font-black text-blue-900 uppercase mb-1">Cara Pengisian:</h3>
                  <p className="text-[9px] font-bold text-blue-800 leading-relaxed">
                    Pilihlah tingkat kemampuan diri Anda pada setiap pernyataan yang muncul. Tidak ada jawaban benar atau salah, mohon isi secara jujur.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="text-[10px] font-black text-slate-900 uppercase mb-1">Kriteria Penskoran:</h3>
                  <div className="grid grid-cols-5 gap-1 text-center">
                    {[
                      { s: 1, l: "STS" }, { s: 2, l: "TS" }, { s: 3, l: "CM" }, { s: 4, l: "M" }, { s: 5, l: "SM" }
                    ].map(k => (
                      <div key={k.s} className="bg-white p-1 rounded border border-slate-100 shadow-sm">
                        <p className="text-[9px] font-black text-slate-900">{k.s}</p>
                        <p className="text-[7px] font-bold text-slate-400 uppercase">{k.l}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[7px] text-slate-400 mt-2 italic">*STS: Sangat Tidak Mampu | SM: Sangat Mampu</p>
                </div>
              </div>

              <button onClick={() => setShowInstructions(false)} className="w-full py-4 bg-blue-600 text-white font-black rounded-lg text-[10px] uppercase tracking-widest shadow-lg">MENGERTI & MULAI</button>
            </motion.div>
          ) : (
            <motion.div key="assessment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-lg flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-900">ITEM #{currentStep + 1}</span>
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-600" style={{ width: `${((currentStep+1)/questions.length)*100}%` }}></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-200">
                <div className="mb-5 p-4 bg-slate-50 border-l-4 border-slate-900 rounded-lg">
                  <p className="text-[13px] text-black font-black leading-relaxed">{questions[currentStep]?.text || questions[currentStep]?.question}</p>
                </div>
                <div className="space-y-2">
                  {defaultOptions.map((opt: any, idx: number) => (
                    <button key={idx} onClick={() => handleAnswer(idx)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                        answers[currentStep] === idx + 1 ? "bg-black border-black text-white shadow-xl scale-[1.02]" : `${opt.color} opacity-80`
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${answers[currentStep] === idx + 1 ? "bg-white text-black" : "bg-white/50 border border-current opacity-60"}`}>{idx + 1}</span>
                      <span className="text-[11px] font-black">{opt.text}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6">
                  <button disabled={!answers[currentStep]} onClick={() => { if(currentStep < questions.length - 1) setCurrentStep(currentStep+1); else submitAssessment(); }}
                    className={`w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest ${answers[currentStep] ? "bg-black text-white shadow-2xl" : "bg-slate-200 text-slate-400"}`}
                  >
                    {currentStep === questions.length - 1 ? "Selesaikan & Lanjut ke Survey" : "Pertanyaan Berikutnya"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
