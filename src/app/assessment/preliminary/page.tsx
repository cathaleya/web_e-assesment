"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  text: string;
  score: number;
}

interface Question {
  question: string;
  dim: string;
  options: Option[];
}

export default function PreliminaryAssessment() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const router = useRouter();

  const optionColors = [
    "bg-rose-50 border-rose-100 text-rose-900",
    "bg-amber-50 border-amber-100 text-amber-900",
    "bg-emerald-50 border-emerald-100 text-emerald-900",
    "bg-blue-50 border-blue-100 text-blue-900",
    "bg-purple-50 border-purple-100 text-purple-900"
  ];

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch('/api/questions?type=preliminary');
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
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
        body: JSON.stringify({ userId, type: "PDI-DL", totalScore, answersJson: finalAnswers }),
      });
      // Redirect to survey after PDI-DL
      router.push("/survey");
    } catch (err) { console.error(err); }
  }, [router]);

  const handleAnswer = (idx: number) => {
    const selectedOption = questions[currentStep].options[idx];
    const newAnswers = { ...answers, [currentStep]: selectedOption.score };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (currentStep < questions.length - 1) { 
        setCurrentStep(currentStep + 1); 
        window.scrollTo(0,0); 
      }
      else { 
        submitAssessment(newAnswers); 
      }
    }, 300);
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
                  <i className="fa-solid fa-info-circle text-xl"></i>
                </div>
                <h1 className="text-xl font-black text-slate-900 uppercase">Panduan PDI-DL</h1>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <h3 className="text-[10px] font-black text-blue-900 uppercase mb-1">Cara Pengisian:</h3>
                  <p className="text-[9px] font-bold text-blue-800 leading-relaxed">
                    Pilih satu jawaban yang paling mencerminkan tingkat kemampuan Anda saat ini, dari &quot;Sangat Tidak Mampu&quot; hingga &quot;Sangat Mampu&quot;.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="text-[10px] font-black text-slate-900 uppercase mb-1">Metode Penskoran:</h3>
                  <p className="text-[9px] font-bold text-slate-600 leading-relaxed">
                    Setiap pilihan memiliki skor 1 sampai 5. Tidak ada jawaban benar atau salah, namun pilihlah secara jujur untuk hasil diagnosis yang akurat.
                  </p>
                </div>
              </div>

              <button onClick={() => setShowInstructions(false)} className="w-full py-4 bg-blue-600 text-white font-black rounded-lg text-[10px] uppercase tracking-widest shadow-lg">SAYA MENGERTI & MULAI</button>
            </motion.div>
          ) : (
            <motion.div key="assessment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-lg flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Pertanyaan {currentStep + 1}</span>
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-600" style={{ width: `${((currentStep+1)/questions.length)*100}%` }}></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-200">
                <div className="mb-5 p-3 bg-blue-50 rounded-lg">
                   <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1">Dimensi: {questions[currentStep]?.dim}</p>
                   <p className="text-[12px] text-slate-900 font-bold leading-relaxed italic">&quot;{questions[currentStep]?.question}&quot;</p>
                </div>
                <div className="space-y-2">
                  {questions[currentStep]?.options?.map((opt, idx: number) => (
                    <button key={idx} onClick={() => handleAnswer(idx)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                        answers[currentStep] === opt.score ? "bg-black border-black text-white shadow-xl scale-[1.02]" : `${optionColors[idx % optionColors.length]} opacity-90`
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 ${answers[currentStep] === opt.score ? "bg-white text-black" : "bg-white/50 border border-current opacity-60"}`}>{opt.score}</span>
                      <span className="text-[10px] font-black uppercase tracking-tight">{opt.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
