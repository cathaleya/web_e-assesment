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

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions?type=madel5c');
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
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Menyiapkan Skenario...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFEFF] text-slate-800 font-sans pb-10">
      <div className="fixed inset-0 bg-[radial-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-indigo-50 via-transparent to-transparent pointer-events-none"></div>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12 lg:py-16">
        <AnimatePresence mode="wait">
          {showInstructions ? (
            <motion.div 
              key="instructions"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white border border-slate-100 p-6 sm:p-10 lg:p-16 rounded-[40px] sm:rounded-[60px] shadow-2xl shadow-indigo-900/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] hidden md:block">
                <i className="fa-solid fa-brain text-[250px] text-indigo-900"></i>
              </div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-[25px] sm:rounded-[35px] flex items-center justify-center mb-8 sm:mb-10 shadow-2xl shadow-indigo-600/30">
                  <i className="fa-solid fa-shield-halved text-3xl sm:text-4xl text-white"></i>
                </div>
                
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2">Panduan MADEL5C</h1>
                <p className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-8 sm:mb-12">Situational Judgment Test (SJT)</p>

                <div className="space-y-6 sm:space-y-8 text-slate-600 text-base sm:text-lg leading-relaxed mb-10 sm:mb-14">
                   <p className="font-bold text-slate-900">Asesmen utama ini berisi skenario dunia nyata untuk mengukur tingkat kompetensi literasi digital Bapak/Ibu.</p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                      <div className="p-6 sm:p-8 bg-indigo-50/50 rounded-[30px] sm:rounded-[40px] border border-indigo-100/50">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg"><i className="fa-solid fa-layer-group text-sm"></i></div>
                          <p className="font-black text-indigo-950 uppercase tracking-widest text-[10px]">Struktur</p>
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed">Terdapat <b>30 skenario kasus</b> dengan pilihan tindakan yang harus Bapak/Ibu nilai.</p>
                      </div>

                      <div className="p-6 sm:p-8 bg-indigo-50/50 rounded-[30px] sm:rounded-[40px] border border-indigo-100/50">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg"><i className="fa-solid fa-star text-sm"></i></div>
                          <p className="font-black text-indigo-950 uppercase tracking-widest text-[10px]">Penilaian</p>
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed">Setiap pilihan memiliki bobot <b>1 sampai 5 poin</b> berdasarkan keefektifan tindakan.</p>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => setShowInstructions(false)}
                  className="w-full sm:w-fit px-12 sm:px-16 py-5 sm:py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl sm:rounded-3xl transition-all shadow-2xl shadow-indigo-600/30 uppercase tracking-widest text-xs sm:text-sm"
                >
                  Lanjutkan <i className="fa-solid fa-play ml-3 text-[10px]"></i>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="assessment"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 sm:p-8 rounded-[30px] sm:rounded-[40px] border border-slate-100 shadow-xl gap-4">
                 <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-600 rounded-xl sm:rounded-[24px] flex items-center justify-center text-xl sm:text-2xl font-black text-white shadow-2xl italic">{currentStep + 1}</div>
                    <div>
                       <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">Skenario Kasus</h3>
                       <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.3em] mt-1">{questions[currentStep]?.dim || "Asesmen Digital"}</p>
                    </div>
                 </div>
                 <div className="w-full sm:w-fit flex items-center gap-6 sm:gap-8 bg-slate-50 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl sm:rounded-3xl border border-slate-100">
                    <div className="text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</p>
                       <p className="text-base sm:text-xl font-black text-indigo-600">{Math.round(((currentStep + 1) / questions.length) * 100)}%</p>
                    </div>
                    <div className="flex-1 sm:w-32 h-2 sm:h-2.5 bg-slate-200 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}></div>
                    </div>
                 </div>
              </div>

              <div className="bg-white border border-slate-100 p-6 sm:p-10 lg:p-16 rounded-[35px] sm:rounded-[60px] shadow-2xl shadow-slate-200/50">
                 <div className="mb-8 sm:mb-14 p-6 sm:p-10 bg-slate-50 border-l-8 border-indigo-600 rounded-[25px] sm:rounded-[35px]">
                    <p className="text-lg sm:text-2xl lg:text-3xl text-slate-800 font-bold leading-snug italic">
                      "{questions[currentStep]?.scenario}"
                    </p>
                 </div>

                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 sm:mb-8 text-center">Pilihlah Tindakan Terbaik</p>

                 <div className="grid grid-cols-1 gap-4 sm:gap-5">
                    {questions[currentStep]?.options.map((opt: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={`group flex items-start gap-4 sm:gap-8 p-5 sm:p-8 rounded-[25px] sm:rounded-[40px] border-2 transition-all text-left ${
                          answers[currentStep] === idx + 1
                            ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-xl scale-[1.01]"
                            : "bg-white border-slate-100 text-slate-500 hover:border-indigo-200"
                        }`}
                      >
                        <span className={`mt-1 w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-[22px] flex items-center justify-center font-black text-sm sm:text-lg transition-all shrink-0 ${
                          answers[currentStep] === idx + 1 ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white"
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <div className="flex-1 pt-1 sm:pt-2">
                          <span className="font-bold text-base sm:text-xl leading-relaxed">{opt.text}</span>
                        </div>
                      </button>
                    ))}
                 </div>

                 <div className="mt-10 sm:mt-16 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <button 
                       onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
                       disabled={currentStep === 0}
                       className={`w-full sm:w-fit px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${currentStep === 0 ? 'hidden' : 'text-slate-400 hover:text-indigo-600'}`}
                    >
                       <i className="fa-solid fa-arrow-left mr-3"></i> Kembali
                    </button>
                    
                    <button
                      disabled={!answers[currentStep]}
                      onClick={nextQuestion}
                      className={`w-full sm:w-fit px-12 sm:px-16 py-5 sm:py-6 rounded-2xl sm:rounded-3xl font-black uppercase tracking-widest text-xs sm:text-sm transition-all flex items-center justify-center gap-4 ${
                        answers[currentStep]
                          ? "bg-slate-900 hover:bg-black text-white shadow-2xl shadow-black/20"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {currentStep === questions.length - 1 ? "Kirim Hasil" : "Lanjutkan"}
                      <i className="fa-solid fa-chevron-right text-xs"></i>
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
