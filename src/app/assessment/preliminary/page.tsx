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
    setLoading(true);
    try {
      const res = await fetch('/api/questions?type=preliminary', { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setQuestions(data);
      } else {
        console.error("Data soal preliminary kosong");
      }
    } catch (err) { 
      console.error("Gagal ambil soal preliminary:", err); 
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
        body: JSON.stringify({ userId, type: "PDI-DL", totalScore, answersJson: finalAnswers }),
      });
      router.push("/survey");
    } catch (err) { console.error(err); }
  }, [router]);

  const handleAnswer = (idx: number) => {
    if (!questions[currentStep]) return;
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

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black text-xs uppercase tracking-widest text-slate-400">Memuat Instrumen PDI-DL...</p>
    </div>
  );

  if (questions.length === 0) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <i className="fa-solid fa-triangle-exclamation text-rose-500 text-4xl mb-4"></i>
      <p className="font-black text-sm uppercase tracking-widest text-slate-900 mb-4">Gagal memuat butir pertanyaan.</p>
      <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Coba Lagi</button>
    </div>
  );

  return (
    <div className="min-h-screen relative"
         style={{ backgroundImage: "url('/unj_bg_v2.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-0"></div>

      <main className="relative z-10 max-w-lg mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {showInstructions ? (
            <motion.div key="instructions" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-8 rounded-[40px] shadow-3xl border border-slate-200"
            >
              <div className="flex items-center gap-4 mb-6 border-b pb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <i className="fa-solid fa-info-circle text-2xl"></i>
                </div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Panduan PDI-DL</h1>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <h3 className="text-[11px] font-black text-blue-900 uppercase mb-1">Cara Pengisian:</h3>
                  <p className="text-[10px] font-bold text-blue-800 leading-relaxed italic">
                    &quot;Pilih satu jawaban yang paling mencerminkan tingkat kemampuan Anda saat ini, dari Sangat Tidak Mampu hingga Sangat Mampu.&quot;
                  </p>
                </div>
              </div>

              <button onClick={() => setShowInstructions(false)} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all">SAYA MENGERTI & MULAI</button>
            </motion.div>
          ) : (
            <motion.div key="assessment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xl flex justify-between items-center">
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Tahap Awal</p>
                   <span className="text-lg font-black text-slate-900 italic">Pertanyaan #{currentStep + 1}</span>
                </div>
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                   <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${((currentStep+1)/questions.length)*100}%` }}></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[40px] shadow-3xl border border-slate-200">
                <div className="mb-6 p-5 bg-blue-50 border-l-[6px] border-blue-600 rounded-2xl shadow-inner">
                   <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Dimensi: {questions[currentStep]?.dim}</p>
                   <p className="text-[14px] text-slate-900 font-bold leading-relaxed italic">&quot;{questions[currentStep]?.text}&quot;</p>
                </div>
                <div className="space-y-3">
                  {(questions[currentStep]?.options || [
                    { text: "Sangat Tidak Mampu", score: 1 },
                    { text: "Tidak Mampu", score: 2 },
                    { text: "Cukup Mampu", score: 3 },
                    { text: "Mampu", score: 4 },
                    { text: "Sangat Mampu", score: 5 }
                  ]).map((opt, idx: number) => (
                    <button key={idx} onClick={() => handleAnswer(idx)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                        answers[currentStep] === opt.score ? "bg-blue-600 border-blue-600 text-white shadow-xl scale-[1.02]" : `${optionColors[idx % optionColors.length]} hover:scale-[1.01]`
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-[11px] shrink-0 ${answers[currentStep] === opt.score ? "bg-white text-blue-600" : "bg-white/60 border border-current opacity-80"}`}>{opt.score}</span>
                      <span className="text-[11px] font-black uppercase tracking-tight">{opt.text}</span>
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
