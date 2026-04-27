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

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions?type=preliminary');
      const data = await res.json();
      setQuestions(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [currentStep]: optionIndex + 1 });
  };

  const nextQuestion = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitAssessment();
    }
  };

  const submitAssessment = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return router.push("/login");

    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

    try {
      await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          type: "PDI-DL",
          totalScore,
          answersJson: answers,
        }),
      });
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Memuat Instrumen...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-teal-100 pb-10">
      <div className="fixed inset-0 bg-[radial-gradient(at_top_left,_var(--tw-gradient-stops))] from-teal-50 via-transparent to-transparent pointer-events-none"></div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-16">
        <AnimatePresence mode="wait">
          {showInstructions ? (
            <motion.div 
              key="instructions"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-slate-200 p-6 sm:p-10 lg:p-14 rounded-[30px] sm:rounded-[40px] shadow-2xl shadow-teal-900/5"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-8 sm:mb-10 shadow-xl shadow-teal-600/30">
                <i className="fa-solid fa-file-invoice text-2xl sm:text-3xl text-white"></i>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">Panduan PDI-DL</h1>
              <p className="text-teal-600 font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-8 sm:mb-10">Preliminary Digital Literacy</p>
              
              <div className="space-y-6 text-slate-600 leading-relaxed text-base sm:text-lg mb-10">
                <div className="p-6 bg-teal-50 rounded-2xl sm:rounded-3xl border border-teal-100/50">
                  <p className="font-medium text-teal-900">Pemetaan profil awal literasi digital untuk mengukur kesiapan sebelum masuk ke instrumen MADEL5C.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-8">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0 font-black">10</div>
                    <p className="font-bold text-slate-900 text-sm sm:text-base">Butir Pertanyaan Pilihan Ganda</p>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0 font-black">5</div>
                    <p className="font-bold text-slate-900 text-sm sm:text-base">Poin untuk Setiap Jawaban Benar</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowInstructions(false)}
                className="w-full px-10 py-5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-teal-600/20 uppercase tracking-widest text-sm"
              >
                Lanjutkan <i className="fa-solid fa-circle-play ml-2"></i>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="assessment"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-[25px] sm:rounded-[30px] border border-slate-200 shadow-lg gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-white shadow-lg">{currentStep + 1}</div>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase text-xs sm:text-sm tracking-widest">Pertanyaan {currentStep + 1} / {questions.length}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status: Pengerjaan</p>
                  </div>
                </div>
                <div className="w-full sm:w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-teal-500 transition-all duration-500" style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}></div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6 sm:p-10 lg:p-14 rounded-[30px] sm:rounded-[40px] shadow-2xl shadow-slate-200/50">
                <p className="text-xl sm:text-2xl text-slate-900 font-bold leading-tight mb-10 sm:mb-12">
                  {questions[currentStep]?.question}
                </p>

                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {questions[currentStep]?.options.map((opt: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`group flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-[20px] sm:rounded-[28px] border-2 transition-all text-left ${
                        answers[currentStep] === idx + 1
                          ? "bg-teal-50 border-teal-500 text-teal-900 shadow-md scale-[1.02]"
                          : "bg-white border-slate-100 text-slate-500 hover:border-teal-200"
                      }`}
                    >
                      <span className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm transition-all shrink-0 ${
                        answers[currentStep] === idx + 1 ? "bg-teal-600 text-white shadow-lg" : "bg-slate-100 text-slate-400"
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 font-bold text-base sm:text-lg leading-snug">{opt.text}</span>
                      {answers[currentStep] === idx + 1 && <i className="fa-solid fa-circle-check text-teal-600 text-xl sm:text-2xl"></i>}
                    </button>
                  ))}
                </div>

                <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row justify-end gap-4">
                  <button
                    disabled={!answers[currentStep]}
                    onClick={nextQuestion}
                    className={`w-full sm:w-fit px-10 sm:px-14 py-5 rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm transition-all flex items-center justify-center gap-3 ${
                      answers[currentStep]
                        ? "bg-slate-900 hover:bg-black text-white shadow-2xl shadow-black/20"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {currentStep === questions.length - 1 ? "Simpan Hasil" : "Lanjutkan"}
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
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
