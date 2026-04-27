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

  const defaultOptions = [
    { text: "Sangat Tidak Mampu", score: 1 },
    { text: "Tidak Mampu", score: 2 },
    { text: "Cukup Mampu", score: 3 },
    { text: "Mampu", score: 4 },
    { text: "Sangat Mampu", score: 5 }
  ];

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
      <div className="flex flex-col items-center gap-2 text-[#4B5320]">
        <div className="w-8 h-8 border-4 border-[#4B5320] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[8px] font-black uppercase tracking-widest">Memuat...</p>
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

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-6 sm:py-10">
        <AnimatePresence mode="wait">
          {showInstructions ? (
            <motion.div 
              key="instructions"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/95 backdrop-blur-xl border-4 border-white p-6 sm:p-10 rounded-[35px] shadow-2xl max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-5 mb-6 border-b border-slate-100 pb-5">
                <div className="w-12 h-12 bg-[#4B5320] rounded-xl flex items-center justify-center shadow-lg shrink-0">
                  <i className="fa-solid fa-file-invoice text-xl text-white"></i>
                </div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-black text-[#4B5320] tracking-tighter uppercase italic leading-none">Panduan PDI-DL</h1>
                  <p className="text-[#4B5320]/60 font-bold uppercase tracking-widest text-[9px] mt-1">Preliminary Assessment</p>
                </div>
              </div>
              
              <div className="space-y-6 mb-10">
                <div className="p-5 bg-[#FAF9F6] rounded-2xl border border-[#4B5320]/10 font-medium text-sm sm:text-base text-[#4B5320] leading-relaxed shadow-sm italic">
                  "Pemetaan profil awal literasi digital untuk mengukur kesiapan Bapak/Ibu sebelum tahap utama MADEL5C."
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-[#4B5320] text-white flex items-center justify-center font-black text-xs">20</div>
                    <p className="font-bold text-[#4B5320] uppercase tracking-wider text-[9px]">Pernyataan</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-[#4B5320] text-white flex items-center justify-center font-black text-xs">5</div>
                    <p className="font-bold text-[#4B5320] uppercase tracking-wider text-[9px]">Skala Skor</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowInstructions(false)}
                className="w-full py-4 bg-[#4B5320] hover:bg-[#354B37] text-white font-black rounded-xl transition-all shadow-xl uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4"
              >
                MULAI SEKARANG <i className="fa-solid fa-chevron-right text-[9px]"></i>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="assessment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 max-w-2xl mx-auto"
            >
              <div className="bg-white/95 backdrop-blur-xl flex justify-between items-center p-4 sm:p-6 rounded-[25px] border-2 border-white shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#4B5320] rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg italic">{currentStep + 1}</div>
                  <div>
                    <h3 className="font-black text-[#4B5320] uppercase text-[10px] tracking-widest leading-none">Pernyataan #{currentStep + 1}</h3>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Progress: {currentStep + 1} / {questions.length}</p>
                  </div>
                </div>
                <div className="w-24 sm:w-32 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                   <div className="h-full bg-[#4B5320] transition-all duration-700" style={{ width: `${((currentStep + 1) / (questions.length || 1)) * 100}%` }}></div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-xl border-4 border-white p-5 sm:p-8 rounded-[35px] shadow-2xl">
                <div className="mb-6 p-4 sm:p-6 bg-[#FAF9F6] border-l-[6px] border-[#4B5320] rounded-2xl shadow-inner">
                  <p className="text-sm sm:text-base text-[#4B5320] font-bold leading-relaxed">
                    {questions[currentStep]?.text || questions[currentStep]?.question}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {(questions[currentStep]?.options || defaultOptions).map((opt: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`group flex items-center gap-4 p-3 sm:p-4 rounded-2xl border-2 transition-all text-left ${
                        answers[currentStep] === idx + 1
                          ? "bg-[#4B5320] border-[#4B5320] text-white shadow-lg scale-[1.02]"
                          : "bg-white border-slate-100 text-[#4B5320] hover:border-[#4B5320]/20 shadow-sm"
                      }`}
                    >
                      <span className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-black text-xs transition-all shrink-0 ${
                        answers[currentStep] === idx + 1 ? "bg-white text-[#4B5320]" : "bg-slate-50 text-slate-400"
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="flex-1 font-bold text-xs sm:text-sm">{opt?.text || ""}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    disabled={!answers[currentStep]}
                    onClick={nextQuestion}
                    className={`w-full sm:w-auto px-10 py-4 rounded-xl font-black uppercase tracking-[0.4em] text-[10px] transition-all flex items-center justify-center gap-4 ${
                      answers[currentStep]
                        ? "bg-[#4B5320] hover:bg-[#354B37] text-white shadow-lg"
                        : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-inner"
                    }`}
                  >
                    {currentStep === questions.length - 1 ? "Simpan Hasil" : "Lanjutkan"}
                    <i className="fa-solid fa-chevron-right text-[8px]"></i>
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
