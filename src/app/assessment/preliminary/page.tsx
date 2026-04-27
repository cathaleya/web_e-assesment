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
    { text: "Sangat Tidak Mampu", score: 1 },
    { text: "Tidak Mampu", score: 2 },
    { text: "Cukup Mampu", score: 3 },
    { text: "Mampu", score: 4 },
    { text: "Sangat Mampu", score: 5 }
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
      router.push("/dashboard");
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
              <h1 className="text-xl font-black text-slate-900 uppercase mb-4 border-b pb-4">PDI-DL Panduan</h1>
              <p className="p-3 bg-slate-50 rounded-lg text-xs font-bold text-slate-700 italic mb-6">"Pemetaan profil awal literasi digital Bapak/Ibu."</p>
              <button onClick={() => setShowInstructions(false)} className="w-full py-3 bg-[#4B5320] text-white font-black rounded-lg text-[10px] uppercase">MULAI SEKARANG</button>
            </motion.div>
          ) : (
            <motion.div key="assessment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-lg flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-900">ITEM #{currentStep + 1}</span>
                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-[#4B5320]" style={{ width: `${((currentStep+1)/questions.length)*100}%` }}></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-200">
                <div className="mb-4 p-4 bg-slate-50 border-l-4 border-[#4B5320] rounded-lg">
                  <p className="text-xs sm:text-sm text-slate-900 font-bold leading-relaxed">{questions[currentStep]?.text || questions[currentStep]?.question}</p>
                </div>
                <div className="space-y-2">
                  {(questions[currentStep]?.options || defaultOptions).map((opt: any, idx: number) => (
                    <button key={idx} onClick={() => handleAnswer(idx)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                        answers[currentStep] === idx + 1 ? "bg-[#4B5320] border-[#4B5320] text-white" : "bg-white border-slate-100 text-slate-900"
                      }`}
                    >
                      <span className={`w-7 h-7 rounded flex items-center justify-center font-black text-[10px] ${answers[currentStep] === idx + 1 ? "bg-white text-[#4B5320]" : "bg-slate-50 text-slate-400"}`}>{idx + 1}</span>
                      <span className="text-[11px] font-bold">{opt.text}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button disabled={!answers[currentStep]} onClick={() => { if(currentStep < questions.length - 1) setCurrentStep(currentStep+1); else submitAssessment(); }}
                    className={`w-full py-3 rounded-lg font-black uppercase text-[10px] ${answers[currentStep] ? "bg-[#4B5320] text-white shadow-lg" : "bg-slate-200 text-slate-400"}`}
                  >
                    {currentStep === questions.length - 1 ? "Simpan Hasil" : "Lanjutkan"}
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
