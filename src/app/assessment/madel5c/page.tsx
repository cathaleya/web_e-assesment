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
      <div className="flex flex-col items-center gap-4 text-[#4B5320]">
        <div className="w-12 h-12 border-4 border-[#4B5320] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest italic">Menyiapkan Skenario Psikometri...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden"
         style={{ 
           backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.45)), url('/unj_bg_v2.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-16">
        <AnimatePresence mode="wait">
          {showInstructions ? (
            <motion.div 
              key="instructions"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`${creamBg}/95 backdrop-blur-2xl border-4 border-white p-10 lg:p-16 rounded-[60px] shadow-2xl relative overflow-hidden`}
            >
              <div className="relative z-10">
                <div className="w-24 h-24 bg-[#4B5320] rounded-[35px] flex items-center justify-center mb-10 shadow-2xl shadow-[#4B5320]/30">
                  <i className="fa-solid fa-shield-halved text-4xl text-white"></i>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-black text-[#4B5320] tracking-tighter uppercase italic mb-2 leading-none">Panduan MADEL5C</h1>
                <p className="text-[#4B5320]/60 font-black uppercase tracking-[0.4em] text-xs mb-14 italic">Situational Judgment Test (SJT)</p>

                <div className="space-y-10 text-[#4B5320] text-xl leading-relaxed mb-16">
                   <div className="p-10 bg-white/60 rounded-[40px] border border-white shadow-inner font-bold italic text-2xl lg:text-3xl">
                      "Asesmen utama ini menggunakan skenario kasus nyata untuk memetakan tingkat kompetensi aksi digital strategis Bapak/Ibu."
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 bg-white/80 rounded-[40px] border border-white shadow-sm">
                        <div className="flex items-center gap-5 mb-6">
                          <div className="w-12 h-12 bg-[#4B5320] rounded-2xl flex items-center justify-center text-white shadow-lg"><i className="fa-solid fa-layer-group text-lg"></i></div>
                          <p className="font-black text-[#4B5320] uppercase tracking-widest text-xs">Struktur Instrumen</p>
                        </div>
                        <p className="text-base font-bold opacity-80 italic">Terdapat <b>30 skenario kasus</b> yang diadaptasi dari situasi riil di dunia pendidikan digital.</p>
                      </div>

                      <div className="p-8 bg-white/80 rounded-[40px] border border-white shadow-sm">
                        <div className="flex items-center gap-5 mb-6">
                          <div className="w-12 h-12 bg-[#4B5320] rounded-2xl flex items-center justify-center text-white shadow-lg"><i className="fa-solid fa-star text-lg"></i></div>
                          <p className="font-black text-[#4B5320] uppercase tracking-widest text-xs">Metode Penilaian</p>
                        </div>
                        <p className="text-base font-bold opacity-80 italic">Setiap pilihan memiliki bobot <b>1-5 poin</b> berdasarkan standar efektivitas aksi digital.</p>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => setShowInstructions(false)}
                  className="w-full lg:w-fit px-16 py-6 bg-[#4B5320] hover:bg-[#354B37] text-white font-black rounded-[30px] transition-all shadow-2xl shadow-[#4B5320]/40 uppercase tracking-[0.4em] text-xs"
                >
                  Mulai Asesmen Utama <i className="fa-solid fa-play ml-4 text-[10px]"></i>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="assessment"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div className={`${creamBg}/90 backdrop-blur-xl flex flex-col sm:flex-row justify-between items-center p-8 rounded-[40px] border-4 border-white shadow-2xl gap-8`}>
                 <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-[#4B5320] rounded-[30px] flex items-center justify-center text-4xl font-black text-white shadow-2xl italic">{currentStep + 1}</div>
                    <div>
                       <h3 className="text-3xl font-black text-[#4B5320] tracking-tighter uppercase italic leading-none">Skenario Utama</h3>
                       <p className="text-[11px] font-black text-[#4B5320]/60 uppercase tracking-[0.4em] mt-3">{questions[currentStep]?.dim || "Asesmen Kompetensi Digital"}</p>
                    </div>
                 </div>
                 <div className="w-full sm:w-fit flex items-center gap-10 bg-white/60 px-8 py-5 rounded-[30px] border border-white shadow-inner">
                    <div className="text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">PROGRES</p>
                       <p className="text-2xl font-black text-[#4B5320]">{Math.round(((currentStep + 1) / (questions.length || 1)) * 100)}%</p>
                    </div>
                    <div className="flex-1 sm:w-40 h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-[#4B5320]/10">
                       <div className="h-full bg-[#4B5320] rounded-full transition-all duration-700 shadow-md" style={{ width: `${((currentStep + 1) / (questions.length || 1)) * 100}%` }}></div>
                    </div>
                 </div>
              </div>

              <div className={`${creamBg}/95 backdrop-blur-2xl border-4 border-white p-10 lg:p-16 rounded-[60px] shadow-2xl`}>
                 <div className="mb-14 p-12 bg-white/60 border-l-[15px] border-[#4B5320] rounded-[40px] shadow-inner drop-shadow-[0_5px_15px_rgba(255,255,255,0.8)]">
                    <p className="text-2xl lg:text-4xl text-[#4B5320] font-black leading-snug italic">
                      "{questions[currentStep]?.scenario}"
                    </p>
                 </div>

                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-10 text-center drop-shadow-[0_2px_4px_rgba(255,255,255,1)]">Pilihlah Tindakan Yang Paling Tepat</p>

                 <div className="grid grid-cols-1 gap-6">
                    {questions[currentStep]?.options?.map((opt: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={`group flex items-start gap-8 p-8 lg:p-10 rounded-[45px] border-4 transition-all text-left ${
                          answers[currentStep] === idx + 1
                            ? "bg-[#4B5320] border-[#4B5320] text-white shadow-2xl scale-[1.01]"
                            : "bg-white/70 border-white text-[#4B5320] hover:border-[#4B5320]/30 shadow-md"
                        }`}
                      >
                        <span className={`mt-1 w-14 h-14 lg:w-20 lg:h-20 rounded-[25px] flex items-center justify-center font-black text-xl lg:text-3xl transition-all shrink-0 ${
                          answers[currentStep] === idx + 1 ? "bg-white text-[#4B5320] shadow-xl" : "bg-slate-50 text-slate-400"
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <div className="flex-1 pt-2 lg:pt-4">
                          <span className="font-bold text-lg lg:text-2xl leading-relaxed">{opt?.text || ""}</span>
                        </div>
                      </button>
                    ))}
                 </div>

                 <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-8">
                    <button 
                       onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
                       disabled={currentStep === 0}
                       className={`w-full sm:w-fit px-12 py-6 rounded-[30px] font-black uppercase tracking-widest text-[11px] transition-all ${currentStep === 0 ? 'invisible' : 'text-[#4B5320]/40 hover:text-[#4B5320]'}`}
                    >
                       <i className="fa-solid fa-arrow-left mr-4"></i> Sebelumnya
                    </button>
                    
                    <button
                      disabled={!answers[currentStep]}
                      onClick={nextQuestion}
                      className={`w-full sm:w-fit px-16 py-7 rounded-[35px] font-black uppercase tracking-[0.4em] text-xs transition-all flex items-center justify-center gap-5 ${
                        answers[currentStep]
                          ? "bg-[#4B5320] hover:bg-[#354B37] text-white shadow-2xl shadow-[#4B5320]/40"
                          : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-inner"
                      }`}
                    >
                      {currentStep === questions.length - 1 ? "Simpan Jawaban" : "Lanjutkan"}
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
