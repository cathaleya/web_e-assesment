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
    <div className="min-h-screen relative overflow-hidden pb-12 sm:pb-24"
         style={{ 
           backgroundImage: "url('/unj_bg_v2.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
        <AnimatePresence mode="wait">
          {showInstructions ? (
            <motion.div 
              key="instructions"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/95 backdrop-blur-3xl border-4 border-white p-6 sm:p-14 rounded-[40px] sm:rounded-[60px] shadow-2xl"
            >
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#4B5320] rounded-2xl sm:rounded-[35px] flex items-center justify-center mb-6 sm:mb-12 shadow-2xl">
                <i className="fa-solid fa-star-half-stroke text-2xl sm:text-4xl text-white"></i>
              </div>
              
              <h1 className="text-3xl sm:text-6xl font-black text-[#4B5320] tracking-tighter uppercase italic mb-2 leading-none drop-shadow-[0_2px_5px_rgba(255,255,255,1)]">
                Evaluasi Usabilitas
              </h1>
              <p className="text-[#4B5320]/70 font-black uppercase tracking-[0.3em] text-[10px] sm:text-[12px] mb-8 sm:mb-14 italic">
                System Usability Scale (SUS)
              </p>
              
              <div className="space-y-6 sm:space-y-10 mb-10 sm:mb-16">
                <div className="p-6 sm:p-10 bg-[#FAF9F6] rounded-[30px] border-2 border-[#4B5320]/5 shadow-inner italic font-bold text-lg sm:text-3xl text-[#4B5320] leading-relaxed">
                  "Mohon berikan penilaian objektif Bapak/Ibu mengenai pengalaman penggunaan platform ini."
                </div>
                <div className="space-y-4 px-2">
                  <div className="flex items-center gap-4 sm:gap-8">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#4B5320] rounded-xl flex items-center justify-center text-white shadow-lg shrink-0"><i className="fa-solid fa-check text-sm sm:text-xl"></i></div>
                    <span className="font-black text-[#4B5320] uppercase tracking-widest text-[10px] sm:text-lg">10 Pernyataan Kualitas Sistem</span>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-8">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#4B5320] rounded-xl flex items-center justify-center text-white shadow-lg shrink-0"><i className="fa-solid fa-list-ol text-sm sm:text-xl"></i></div>
                    <span className="font-black text-[#4B5320] uppercase tracking-widest text-[10px] sm:text-lg">Skala Likert 1 Sampai 5</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowInstructions(false)}
                className="w-full lg:w-auto px-12 py-5 sm:px-20 sm:py-8 bg-[#4B5320] hover:bg-[#354B37] text-white font-black rounded-2xl sm:rounded-[35px] transition-all shadow-2xl uppercase tracking-[0.4em] text-[10px] sm:text-xs flex items-center justify-center gap-4 sm:gap-6"
              >
                MULAI SURVEY <i className="fa-solid fa-arrow-right-long text-sm sm:text-lg"></i>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="survey"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 sm:space-y-12"
            >
               <div className="text-center mb-10 sm:mb-16">
                  <h2 className="text-3xl sm:text-6xl font-black text-[#4B5320] tracking-tighter uppercase italic leading-none">Kuesioner</h2>
                  <div className="w-16 h-1.5 sm:w-32 sm:h-2.5 bg-[#4B5320] mx-auto mt-4 sm:mt-8 rounded-full shadow-lg"></div>
               </div>

               <div className="space-y-6 sm:space-y-10">
                  {susQuestions.map((q, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white/95 backdrop-blur-2xl border-4 border-white p-5 sm:p-10 rounded-[35px] sm:rounded-[60px] shadow-2xl"
                    >
                      <div className="mb-6 sm:mb-10 p-5 sm:p-10 bg-[#FAF9F6] border-l-[8px] border-[#4B5320] rounded-[25px] sm:rounded-[40px] shadow-inner">
                        <p className="text-sm sm:text-xl text-[#4B5320] font-black leading-snug">
                          <span className="text-[#4B5320]/30 font-black mr-2 italic">#{i + 1}</span> {q}
                        </p>
                      </div>
                      
                      <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-14">
                        <span className="text-[9px] font-black uppercase text-[#4B5320]/40 tracking-[0.2em] order-last md:order-first w-full md:w-auto text-center md:text-left">Tidak Setuju</span>
                        <div className="flex justify-between gap-1.5 sm:gap-6 flex-1 w-full max-w-lg mx-auto">
                           {[1, 2, 3, 4, 5].map((val) => (
                             <button
                               key={val}
                               onClick={() => handleAnswer(i, val)}
                               className={`w-10 h-10 sm:w-20 sm:h-20 rounded-xl sm:rounded-[28px] font-black text-sm sm:text-3xl transition-all flex items-center justify-center border-2 sm:border-[5px] ${
                                 answers[i] === val
                                   ? "bg-[#4B5320] border-[#4B5320] text-white shadow-xl scale-110"
                                   : "bg-white border-slate-100 text-[#4B5320]/20 hover:border-[#4B5320]/20"
                               }`}
                             >
                               {val}
                             </button>
                           ))}
                        </div>
                        <span className="text-[9px] font-black uppercase text-[#4B5320]/40 tracking-[0.2em] w-full md:w-auto text-center md:text-right">Sangat Setuju</span>
                      </div>
                    </motion.div>
                  ))}
               </div>

               <div className="flex justify-center pt-10 sm:pt-20">
                  <button
                    disabled={!isComplete}
                    onClick={submitSurvey}
                    className={`w-full sm:w-auto px-16 py-7 sm:px-24 sm:py-10 rounded-[30px] sm:rounded-[45px] font-black uppercase tracking-[0.5em] text-xs sm:text-sm transition-all flex items-center justify-center gap-6 ${
                      isComplete
                        ? "bg-[#4B5320] hover:bg-[#354B37] text-white shadow-2xl"
                        : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-inner"
                    }`}
                  >
                    Kirim Survey
                    <i className="fa-solid fa-paper-plane text-sm sm:text-xl"></i>
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
