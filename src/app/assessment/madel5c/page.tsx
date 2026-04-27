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

  // High contrast colors
  const armyGreen = "#2D3410"; 
  const solidCream = "bg-[#FAF9F6]";

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
      <div className="flex flex-col items-center gap-2 text-[#2D3410]">
        <div className="w-10 h-10 border-4 border-[#2D3410] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest">MEMUAT...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden"
         style={{ 
           backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url('/unj_bg_v2.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {showInstructions ? (
            <motion.div 
              key="instructions"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border-[6px] border-white p-8 sm:p-12 rounded-[40px] shadow-2xl max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-6 mb-8 border-b-2 border-slate-100 pb-8">
                <div className="w-16 h-16 bg-[#2D3410] rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                  <i className="fa-solid fa-brain text-3xl text-white"></i>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black text-[#2D3410] tracking-tighter uppercase italic leading-none">Instrumen MADEL5C</h1>
                  <p className="text-[#2D3410]/60 font-bold uppercase tracking-widest text-[10px] mt-2">Situational Judgment Test</p>
                </div>
              </div>
              
              <div className="space-y-8 mb-12">
                <div className="p-6 bg-[#FAF9F6] rounded-3xl border-2 border-[#2D3410]/5 font-bold text-lg sm:text-xl text-[#2D3410] leading-relaxed shadow-inner italic">
                  "Tahap utama asesmen menggunakan skenario situasi nyata untuk mengukur kompetensi literasi digital Bapak/Ibu secara mendalam."
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#2D3410] text-white flex items-center justify-center font-black text-sm">30</div>
                    <p className="font-black text-[#2D3410] uppercase tracking-wider text-[10px]">Skenario Situasi</p>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#2D3410] text-white flex items-center justify-center font-black text-sm">5</div>
                    <p className="font-black text-[#2D3410] uppercase tracking-wider text-[10px]">Opsi Tindakan</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowInstructions(false)}
                className="w-full py-6 bg-[#2D3410] hover:bg-black text-white font-black rounded-2xl transition-all shadow-xl uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-4"
              >
                MULAI ASESMEN <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="assessment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-3xl mx-auto"
            >
               <div className="bg-white flex justify-between items-center p-6 rounded-[30px] border-4 border-white shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#2D3410] rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-lg italic">{currentStep + 1}</div>
                    <div>
                      <h3 className="font-black text-[#2D3410] uppercase text-xs tracking-widest leading-none">Skenario Ke-{currentStep + 1}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Kemajuan: {currentStep + 1} / {questions.length}</p>
                    </div>
                  </div>
                  <div className="flex-1 max-w-[150px] h-2.5 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200 ml-4">
                     <div className="h-full bg-[#2D3410] transition-all duration-700" style={{ width: `${((currentStep + 1) / (questions.length || 1)) * 100}%` }}></div>
                  </div>
               </div>

               <div className="bg-white border-[6px] border-white p-6 sm:p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                 <div className="mb-8 p-6 sm:p-10 bg-[#FAF9F6] border-l-[12px] border-[#2D3410] rounded-3xl shadow-inner relative z-10">
                    <p className="text-sm sm:text-lg text-[#2D3410] font-black leading-relaxed italic">
                      "{questions[currentStep]?.scenario}"
                    </p>
                 </div>

                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 text-center">Pilihlah Tindakan Yang Paling Tepat</p>

                 <div className="grid grid-cols-1 gap-4">
                    {questions[currentStep]?.options?.map((opt: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={`group flex items-start gap-5 p-5 rounded-2xl border-2 transition-all text-left ${
                          answers[currentStep] === opt.score
                            ? "bg-[#2D3410] border-[#2D3410] text-white shadow-xl scale-[1.01]"
                            : "bg-white border-slate-200 text-[#2D3410] hover:border-[#2D3410]/20 shadow-sm"
                        }`}
                      >
                        <span className={`mt-0.5 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-sm sm:text-base transition-all shrink-0 ${
                          answers[currentStep] === opt.score ? "bg-white text-[#2D3410]" : "bg-slate-50 text-slate-300"
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <div className="flex-1 pt-1">
                          <span className="font-black text-sm sm:text-base leading-relaxed">{opt?.text || ""}</span>
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
