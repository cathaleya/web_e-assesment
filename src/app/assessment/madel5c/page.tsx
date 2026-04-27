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

  const armyGreen = "#4B5320";
  const creamBg = "bg-[#FAF9F6]";

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions?type=madel5c');
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    const selectedOption = questions[currentStep].options[optionIndex];
    setAnswers({ ...answers, [currentStep]: selectedOption.score });
    
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        submitAssessment();
      }
    }, 400);
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
          type: "MADEL5C",
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
                  <i className="fa-solid fa-brain text-xl text-white"></i>
                </div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-black text-[#4B5320] tracking-tighter uppercase italic leading-none">Instrumen MADEL5C</h1>
                  <p className="text-[#4B5320]/60 font-bold uppercase tracking-widest text-[9px] mt-1">Situational Judgment Test</p>
                </div>
              </div>
              
              <div className="space-y-6 mb-10">
                <div className="p-5 bg-[#FAF9F6] rounded-2xl border border-[#4B5320]/10 font-medium text-sm sm:text-base text-[#4B5320] leading-relaxed shadow-sm italic">
                  "Tahap utama asesmen menggunakan skenario situasi nyata untuk mengukur kompetensi literasi digital Bapak/Ibu secara mendalam."
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-[#4B5320] text-white flex items-center justify-center font-black text-xs">30</div>
                    <p className="font-bold text-[#4B5320] uppercase tracking-wider text-[9px]">Skenario Situasi</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-[#4B5320] text-white flex items-center justify-center font-black text-xs">5</div>
                    <p className="font-bold text-[#4B5320] uppercase tracking-wider text-[9px]">Opsi Tindakan</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowInstructions(false)}
                className="w-full py-4 bg-[#4B5320] hover:bg-[#354B37] text-white font-black rounded-xl transition-all shadow-xl uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4"
              >
                MULAI ASESMEN <i className="fa-solid fa-chevron-right text-[9px]"></i>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="assessment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 max-w-3xl mx-auto"
            >
               <div className="bg-white/95 backdrop-blur-xl flex justify-between items-center p-4 sm:p-6 rounded-[25px] border-2 border-white shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#4B5320] rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg italic">{currentStep + 1}</div>
                    <div>
                      <h3 className="font-black text-[#4B5320] uppercase text-[9px] tracking-widest leading-none">Skenario Ke-{currentStep + 1}</h3>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Kemajuan: {currentStep + 1} / {questions.length}</p>
                    </div>
                  </div>
                  <div className="flex-1 max-w-[150px] h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 ml-4">
                     <div className="h-full bg-[#4B5320] transition-all duration-700" style={{ width: `${((currentStep + 1) / (questions.length || 1)) * 100}%` }}></div>
                  </div>
               </div>

               <div className="bg-white/95 backdrop-blur-xl border-4 border-white p-5 sm:p-8 rounded-[35px] shadow-2xl relative overflow-hidden">
                 <div className="mb-6 p-5 sm:p-8 bg-[#FAF9F6] border-l-[8px] border-[#4B5320] rounded-2xl shadow-inner relative z-10">
                    <p className="text-xs sm:text-lg text-[#4B5320] font-bold leading-relaxed italic">
                      "{questions[currentStep]?.scenario}"
                    </p>
                 </div>

                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 text-center">Pilihlah Tindakan Yang Paling Tepat</p>

                 <div className="grid grid-cols-1 gap-3">
                    {questions[currentStep]?.options?.map((opt: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={`group flex items-start gap-4 p-4 sm:p-5 rounded-2xl border-2 transition-all text-left ${
                          answers[currentStep] === opt.score
                            ? "bg-[#4B5320] border-[#4B5320] text-white shadow-lg scale-[1.01]"
                            : "bg-white border-slate-100 text-[#4B5320] hover:border-[#4B5320]/20 shadow-sm"
                        }`}
                      >
                        <span className={`mt-0.5 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-black text-xs sm:text-sm transition-all shrink-0 ${
                          answers[currentStep] === opt.score ? "bg-white text-[#4B5320]" : "bg-slate-50 text-slate-300"
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <div className="flex-1 pt-1">
                          <span className="font-bold text-xs sm:text-sm leading-relaxed">{opt?.text || ""}</span>
                        </div>
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
