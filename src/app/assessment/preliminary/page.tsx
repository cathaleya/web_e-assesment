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

  const armyGreen = "#4B5320";
  const creamBg = "bg-[#FAF9F6]";

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions?type=preliminary');
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
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
    if (questions.length > 0 && currentStep < questions.length - 1) {
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
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4 text-[#4B5320]">
        <div className="w-12 h-12 border-4 border-[#4B5320] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest">Memuat Instrumen...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden"
         style={{ 
           backgroundImage: "url('/unj_bg_v2.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
        <AnimatePresence mode="wait">
          {showInstructions ? (
            <motion.div 
              key="instructions"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className={`${creamBg}/95 backdrop-blur-2xl border-4 border-white p-8 lg:p-14 rounded-[50px] shadow-2xl`}
            >
              <div className="w-20 h-20 bg-[#4B5320] rounded-[30px] flex items-center justify-center mb-10 shadow-2xl shadow-[#4B5320]/30">
                <i className="fa-solid fa-file-invoice text-3xl text-white"></i>
              </div>
              
              <h1 className="text-4xl font-black text-[#4B5320] tracking-tighter uppercase italic mb-2 leading-none">Panduan PDI-DL</h1>
              <p className="text-[#4B5320]/60 font-black uppercase tracking-[0.3em] text-xs mb-12 italic">Preliminary Digital Literacy</p>
              
              <div className="space-y-8 text-[#4B5320] leading-relaxed text-lg mb-12">
                <div className="p-8 bg-white/60 rounded-[35px] border border-white shadow-inner font-bold italic text-2xl leading-snug">
                  "Pemetaan profil awal literasi digital untuk mengukur kesiapan Bapak/Ibu sebelum tahap utama MADEL5C."
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                  <div className="flex items-center gap-6 p-6 bg-white/80 rounded-3xl border border-white shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-[#4B5320] text-white flex items-center justify-center shrink-0 font-black text-xl shadow-lg">10</div>
                    <p className="font-black text-[#4B5320] uppercase tracking-widest text-xs">Butir Pertanyaan Pilihan Ganda</p>
                  </div>
                  <div className="flex items-center gap-6 p-6 bg-white/80 rounded-3xl border border-white shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-[#4B5320] text-white flex items-center justify-center shrink-0 font-black text-xl shadow-lg">5</div>
                    <p className="font-black text-[#4B5320] uppercase tracking-widest text-xs">Poin Tiap Jawaban Benar</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowInstructions(false)}
                className="w-full lg:w-fit px-16 py-6 bg-[#4B5320] hover:bg-[#354B37] text-white font-black rounded-3xl transition-all shadow-2xl shadow-[#4B5320]/40 uppercase tracking-[0.4em] text-xs"
              >
                Lanjutkan <i className="fa-solid fa-circle-play ml-4"></i>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="assessment"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className={`${creamBg}/90 backdrop-blur-xl flex flex-col sm:flex-row justify-between items-center p-8 rounded-[40px] border-2 border-white shadow-2xl gap-6`}>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-[#4B5320] rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-xl italic">{currentStep + 1}</div>
                  <div>
                    <h3 className="font-black text-[#4B5320] uppercase text-sm tracking-widest leading-none">Pertanyaan Ke-{currentStep + 1}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Daftar Pertanyaan: {currentStep + 1} / {questions.length}</p>
                  </div>
                </div>
                <div className="flex-1 w-full max-w-[200px] h-3 bg-white rounded-full overflow-hidden p-0.5 border border-[#4B5320]/10 shadow-inner">
                   <div className="h-full bg-[#4B5320] rounded-full transition-all duration-700 shadow-md" style={{ width: `${((currentStep + 1) / (questions.length || 1)) * 100}%` }}></div>
                </div>
              </div>

              <div className={`${creamBg}/95 backdrop-blur-2xl border-4 border-white p-8 lg:p-14 rounded-[50px] shadow-2xl`}>
                <div className="mb-14 p-10 bg-white/60 border-l-[12px] border-[#4B5320] rounded-[35px] shadow-inner">
                  <p className="text-2xl lg:text-3xl text-[#4B5320] font-black leading-tight drop-shadow-[0_2px_4px_rgba(255,255,255,1)]">
                    {questions[currentStep]?.question}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {questions[currentStep]?.options?.map((opt: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`group flex items-center gap-6 p-6 lg:p-8 rounded-[35px] border-4 transition-all text-left ${
                        answers[currentStep] === idx + 1
                          ? "bg-[#4B5320] border-[#4B5320] text-white shadow-2xl scale-[1.02]"
                          : "bg-white/70 border-white text-[#4B5320] hover:border-[#4B5320]/30 shadow-md"
                      }`}
                    >
                      <span className={`w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center font-black text-lg transition-all shrink-0 ${
                        answers[currentStep] === idx + 1 ? "bg-white text-[#4B5320] shadow-xl" : "bg-slate-50 text-slate-400"
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 font-bold text-lg lg:text-xl leading-snug">{opt?.text || ""}</span>
                      {answers[currentStep] === idx + 1 && <i className="fa-solid fa-circle-check text-white text-2xl"></i>}
                    </button>
                  ))}
                </div>

                <div className="mt-16 flex flex-col sm:flex-row justify-end gap-6">
                  <button
                    disabled={!answers[currentStep]}
                    onClick={nextQuestion}
                    className={`w-full sm:w-fit px-16 py-6 rounded-[30px] font-black uppercase tracking-[0.4em] text-xs transition-all flex items-center justify-center gap-4 ${
                      answers[currentStep]
                        ? "bg-[#4B5320] hover:bg-[#354B37] text-white shadow-2xl"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-inner"
                    }`}
                  >
                    {currentStep === questions.length - 1 ? "Simpan Hasil" : "Lanjutkan"}
                    <i className="fa-solid fa-chevron-right text-[10px]"></i>
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
