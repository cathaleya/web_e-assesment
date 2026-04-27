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
    <div className="min-h-screen relative overflow-hidden pb-24"
         style={{ 
           backgroundImage: "url('/unj_bg_v2.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <AnimatePresence mode="wait">
          {showInstructions ? (
            <motion.div 
              key="instructions"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/95 backdrop-blur-3xl border-[6px] border-white p-10 lg:p-16 rounded-[60px] shadow-[0_50px_100px_rgba(0,0,0,0.2)]"
            >
              <div className="w-24 h-24 bg-[#4B5320] rounded-[35px] flex items-center justify-center mb-12 shadow-2xl shadow-[#4B5320]/40">
                <i className="fa-solid fa-star-half-stroke text-4xl text-white"></i>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-black text-[#4B5320] tracking-tighter uppercase italic mb-3 leading-none drop-shadow-[0_2px_10px_rgba(255,255,255,1)]">
                Evaluasi Usabilitas
              </h1>
              <p className="text-[#4B5320]/70 font-black uppercase tracking-[0.5em] text-[12px] mb-14 italic drop-shadow-[0_2px_5px_rgba(255,255,255,1)]">
                System Usability Scale (SUS)
              </p>
              
              <div className="space-y-10 mb-16">
                <div className="p-10 bg-[#FAF9F6] rounded-[40px] border-2 border-[#4B5320]/10 shadow-inner italic font-bold text-2xl lg:text-3xl text-[#4B5320] leading-relaxed">
                  "Mohon berikan penilaian objektif Bapak/Ibu mengenai pengalaman penggunaan platform HDAP ini."
                </div>
                <div className="space-y-6 px-4">
                  <div className="flex items-center gap-8 group">
                    <div className="w-12 h-12 bg-[#4B5320] rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><i className="fa-solid fa-check text-xl"></i></div>
                    <span className="font-black text-[#4B5320] uppercase tracking-widest text-sm lg:text-lg">Terdapat 10 Pernyataan Kualitas Sistem</span>
                  </div>
                  <div className="flex items-center gap-8 group">
                    <div className="w-12 h-12 bg-[#4B5320] rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><i className="fa-solid fa-list-ol text-xl"></i></div>
                    <span className="font-black text-[#4B5320] uppercase tracking-widest text-sm lg:text-lg">Skala 1 (Sangat Tidak Setuju) - 5 (Sangat Setuju)</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowInstructions(false)}
                className="w-full lg:w-auto px-20 py-8 bg-[#4B5320] hover:bg-[#354B37] text-white font-black rounded-[35px] transition-all shadow-[0_20px_50px_rgba(75,83,32,0.4)] hover:shadow-[0_10px_30px_rgba(75,83,32,0.6)] uppercase tracking-[0.5em] text-xs flex items-center justify-center gap-6"
              >
                LANJUTKAN SURVEY <i className="fa-solid fa-arrow-right-long text-lg"></i>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="survey"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-10 sm:space-y-16"
            >
               <div className="text-center mb-16 drop-shadow-[0_2px_20px_rgba(255,255,255,1)]">
                  <h2 className="text-4xl sm:text-6xl font-black text-[#4B5320] tracking-tighter uppercase italic leading-none">Kuesioner Usabilitas</h2>
                  <div className="w-32 h-2.5 bg-[#4B5320] mx-auto mt-8 rounded-full shadow-lg"></div>
               </div>

               <div className="space-y-10">
                  {susQuestions.map((q, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white/95 backdrop-blur-2xl border-[5px] border-white p-8 lg:p-14 rounded-[50px] lg:rounded-[70px] shadow-2xl"
                    >
                      <div className="mb-10 p-8 sm:p-12 bg-[#FAF9F6] border-l-[12px] border-[#4B5320] rounded-[30px] sm:rounded-[45px] shadow-inner">
                        <p className="text-xl sm:text-2xl text-[#4B5320] font-black leading-relaxed drop-shadow-[0_1px_2px_rgba(255,255,255,1)]">
                          <span className="text-[#4B5320]/30 font-black mr-4 italic">#{i + 1}</span> {q}
                        </p>
                      </div>
                      
                      <div className="flex flex-col md:flex-row justify-between items-center gap-8 sm:gap-14">
                        <span className="text-[11px] font-black uppercase text-[#4B5320]/50 tracking-[0.3em] order-last md:order-first w-full md:w-auto text-center md:text-left drop-shadow-[0_2px_5px_rgba(255,255,255,1)]">Sangat Tidak Setuju</span>
                        <div className="flex justify-between gap-2 sm:gap-6 flex-1 w-full max-w-lg mx-auto">
                           {[1, 2, 3, 4, 5].map((val) => (
                             <button
                               key={val}
                               onClick={() => handleAnswer(i, val)}
                               className={`w-14 h-14 sm:w-20 sm:h-20 rounded-[28px] font-black text-xl sm:text-3xl transition-all flex items-center justify-center border-[5px] ${
                                 answers[i] === val
                                   ? "bg-[#4B5320] border-[#4B5320] text-white shadow-2xl scale-110"
                                   : "bg-white border-slate-100 text-[#4B5320]/30 hover:border-[#4B5320]/20"
                               }`}
                             >
                               {val}
                             </button>
                           ))}
                        </div>
                        <span className="text-[11px] font-black uppercase text-[#4B5320]/50 tracking-[0.3em] w-full md:w-auto text-center md:text-right drop-shadow-[0_2px_5px_rgba(255,255,255,1)]">Sangat Setuju</span>
                      </div>
                    </motion.div>
                  ))}
               </div>

               <div className="flex justify-center pt-20">
                  <button
                    disabled={!isComplete}
                    onClick={submitSurvey}
                    className={`w-full sm:w-auto px-24 py-10 rounded-[45px] font-black uppercase tracking-[0.6em] text-sm transition-all flex items-center justify-center gap-8 ${
                      isComplete
                        ? "bg-[#4B5320] hover:bg-[#354B37] text-white shadow-[0_30px_60px_rgba(75,83,32,0.4)]"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-inner"
                    }`}
                  >
                    Kirim Hasil Survey
                    <i className="fa-solid fa-paper-plane text-xl"></i>
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
