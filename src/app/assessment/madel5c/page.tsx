"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Madel5cAssessment() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const router = useRouter();

  const optionColors = [
    "bg-blue-50 border-blue-100 text-blue-900",
    "bg-emerald-50 border-emerald-100 text-emerald-900",
    "bg-amber-50 border-amber-100 text-amber-900",
    "bg-rose-50 border-rose-100 text-rose-900",
    "bg-purple-50 border-purple-100 text-purple-900"
  ];

  useEffect(() => { fetchQuestions(); }, []);

  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions?type=madel5c');
      const data = await res.json();
      if (Array.isArray(data)) {
        // Shuffle options for EVERY question once at the start
        const shuffledQuestions = data.map(q => ({
          ...q,
          options: shuffleArray(q.options)
        }));
        setQuestions(shuffledQuestions);
      }
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleAnswer = (idx: number) => {
    const selectedOption = questions[currentStep].options[idx];
    setAnswers({ ...answers, [currentStep]: selectedOption.score });
    setTimeout(() => {
      if (currentStep < questions.length - 1) { setCurrentStep(currentStep + 1); window.scrollTo(0,0); }
      else { submitAssessment(); }
    }, 300);
  };

  const submitAssessment = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return router.push("/login");
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    try {
      await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, type: "MADEL5C", totalScore, answersJson: answers }),
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
              <h1 className="text-xl font-black text-slate-900 uppercase mb-4 border-b pb-4">MADEL5C Instrumen</h1>
              <p className="p-3 bg-emerald-50 rounded-lg text-[10px] font-bold text-emerald-900 italic mb-6">"Tahap Akhir: Asesmen berbasis skenario situasi nyata. Pilihan jawaban telah diacak untuk menjaga objektivitas penilaian."</p>
              <button onClick={() => setShowInstructions(false)} className="w-full py-4 bg-[#4B5320] text-white font-black rounded-lg text-[10px] uppercase tracking-widest shadow-lg">MULAI ASESMEN AKHIR</button>
            </motion.div>
          ) : (
            <motion.div key="assessment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-lg flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Skenario #{currentStep + 1}</span>
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-[#4B5320]" style={{ width: `${((currentStep+1)/questions.length)*100}%` }}></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-200">
                <div className="mb-5 p-4 bg-slate-50 border-l-4 border-slate-900 rounded-lg shadow-inner">
                  <p className="text-[13px] text-black font-black leading-relaxed italic">"{questions[currentStep]?.scenario}"</p>
                </div>
                <div className="space-y-2">
                  {questions[currentStep]?.options?.map((opt: any, idx: number) => (
                    <button key={idx} onClick={() => handleAnswer(idx)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                        answers[currentStep] === opt.score ? "bg-black border-black text-white shadow-xl scale-[1.02]" : `${optionColors[idx % optionColors.length]} opacity-90`
                      }`}
                    >
                      <span className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 ${answers[currentStep] === opt.score ? "bg-white text-black" : "bg-white/50 border border-current opacity-60"}`}>{String.fromCharCode(65 + idx)}</span>
                      <span className="text-[11px] font-black leading-tight">{opt.text}</span>
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
