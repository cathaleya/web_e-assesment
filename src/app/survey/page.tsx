"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const susQuestions = [
  "Saya rasa saya akan sering menggunakan sistem ini.",
  "Saya rasa sistem ini terlalu rumit padahal bisa dibuat lebih sederhana.",
  "Saya rasa sistem ini mudah digunakan.",
  "Saya rasa saya membutuhkan bantuan orang teknis untuk dapat menggunakan sistem ini.",
  "Saya rasa berbagai fungsi dalam sistem ini terintegrasi dengan baik.",
  "Saya rasa terlalu banyak hal yang tidak konsisten pada sistem ini.",
  "Saya rasa orang lain akan belajar menggunakan sistem ini dengan cepat.",
  "Saya rasa sistem ini sangat membingungkan ketika digunakan.",
  "Saya rasa saya tidak menemui hambatan saat menggunakan sistem ini.",
  "Saya rasa saya perlu membiasakan diri terlebih dahulu sebelum menggunakan sistem ini."
];

export default function SurveyPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showInstructions, setShowInstructions] = useState(true);
  const router = useRouter();

  const armyGreen = "#4B5320";
  const creamBg = "bg-[#FAF9F6]";

  const handleAnswer = (qIndex: number, value: number) => {
    setAnswers({ ...answers, [qIndex]: value });
  };

  const isComplete = Object.keys(answers).length === susQuestions.length;

  const submitSurvey = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return router.push("/login");

    let totalScore = 0;
    Object.entries(answers).forEach(([idx, val]) => {
      const qNum = parseInt(idx) + 1;
      if (qNum % 2 !== 0) {
        totalScore += (val - 1);
      } else {
        totalScore += (5 - val);
      }
    });

    try {
      await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, totalScore, answersJson: answers }),
      });
      router.push("/dashboard");
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen relative overflow-hidden"
         style={{ 
           backgroundImage: "url('/unj_bg_v2.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          {showInstructions ? (
            <motion.div 
              key="instructions"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/95 backdrop-blur-xl border-4 border-white p-6 sm:p-10 rounded-[40px] shadow-2xl max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-6 mb-8 border-b border-slate-100 pb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#4B5320] rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                  <i className="fa-solid fa-star-half-stroke text-xl sm:text-2xl text-white"></i>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black text-[#4B5320] tracking-tighter uppercase italic leading-none">Evaluasi Usabilitas</h1>
                  <p className="text-[#4B5320]/60 font-bold uppercase tracking-[0.3em] text-[9px] sm:text-[10px] mt-1">System Usability Scale (SUS)</p>
                </div>
              </div>
              
              <div className="space-y-6 mb-10">
                <div className="p-5 sm:p-7 bg-[#FAF9F6] rounded-2xl border border-[#4B5320]/10 italic font-medium text-sm sm:text-lg text-[#4B5320] leading-relaxed shadow-sm">
                  "Mohon berikan penilaian objektif Bapak/Ibu mengenai pengalaman penggunaan platform ini."
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl">
                    <div className="w-8 h-8 bg-[#4B5320] rounded-lg flex items-center justify-center text-white text-xs shadow-md"><i className="fa-solid fa-check"></i></div>
                    <span className="font-bold text-[#4B5320] uppercase tracking-wider text-[10px] sm:text-xs">10 Pernyataan</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl">
                    <div className="w-8 h-8 bg-[#4B5320] rounded-lg flex items-center justify-center text-white text-xs shadow-md"><i className="fa-solid fa-list-ol"></i></div>
                    <span className="font-bold text-[#4B5320] uppercase tracking-wider text-[10px] sm:text-xs">Skala Likert 1-5</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowInstructions(false)}
                className="w-full py-4 sm:py-5 bg-[#4B5320] hover:bg-[#354B37] text-white font-black rounded-xl sm:rounded-2xl transition-all shadow-xl uppercase tracking-[0.4em] text-[10px] sm:text-xs flex items-center justify-center gap-4"
              >
                MULAI SURVEY <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="survey"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
               <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-4xl font-black text-[#4B5320] tracking-tighter uppercase italic leading-none drop-shadow-[0_2px_10px_rgba(255,255,255,1)]">Kuesioner Usabilitas</h2>
                  <div className="w-16 h-1 bg-[#4B5320] mx-auto mt-4 rounded-full"></div>
               </div>

               <div className="space-y-4">
                  {susQuestions.map((q, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white/95 backdrop-blur-xl border-2 border-white p-4 sm:p-8 rounded-[30px] shadow-xl"
                    >
                      <div className="mb-6 p-4 sm:p-6 bg-[#FAF9F6] border-l-[6px] border-[#4B5320] rounded-2xl shadow-inner">
                        <p className="text-xs sm:text-base text-[#4B5320] font-bold leading-relaxed">
                          <span className="text-[#4B5320]/30 font-black mr-2">#{i + 1}</span> {q}
                        </p>
                      </div>
                      
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-8">
                        <span className="text-[8px] font-black uppercase text-[#4B5320]/40 tracking-widest order-last md:order-first">Tidak Setuju</span>
                        <div className="flex justify-between gap-1 sm:gap-4 flex-1 w-full max-w-md mx-auto">
                           {[1, 2, 3, 4, 5].map((val) => (
                             <button
                               key={val}
                               onClick={() => handleAnswer(i, val)}
                               className={`w-9 h-9 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl font-black text-xs sm:text-xl transition-all flex items-center justify-center border-2 ${
                                 answers[i] === val
                                   ? "bg-[#4B5320] border-[#4B5320] text-white shadow-lg scale-105"
                                   : "bg-white border-slate-100 text-[#4B5320]/20 hover:border-[#4B5320]/20"
                               }`}
                             >
                               {val}
                             </button>
                           ))}
                        </div>
                        <span className="text-[8px] font-black uppercase text-[#4B5320]/40 tracking-widest">Sangat Setuju</span>
                      </div>
                    </motion.div>
                  ))}
               </div>

               <div className="flex justify-center pt-10">
                  <button
                    disabled={!isComplete}
                    onClick={submitSurvey}
                    className={`w-full sm:w-auto px-16 py-6 rounded-2xl font-black uppercase tracking-[0.5em] text-xs transition-all flex items-center justify-center gap-6 ${
                      isComplete
                        ? "bg-[#4B5320] hover:bg-[#354B37] text-white shadow-xl"
                        : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-inner"
                    }`}
                  >
                    Kirim Survey <i className="fa-solid fa-paper-plane text-xs"></i>
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
