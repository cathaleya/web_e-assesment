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

  const armyGreen = "#2D3410";

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
    <div className="min-h-screen relative bg-slate-50"
         style={{ 
           backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('/unj_bg_v2.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {showInstructions ? (
            <motion.div 
              key="instructions"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border-2 border-slate-100 p-6 sm:p-8 rounded-[30px] shadow-2xl mx-auto"
            >
              <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-6">
                <div className="w-10 h-10 bg-[#2D3410] rounded-xl flex items-center justify-center text-white shadow-md">
                  <i className="fa-solid fa-star-half-stroke text-lg"></i>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#2D3410] tracking-tighter uppercase italic leading-none">Evaluasi Usabilitas</h1>
                  <p className="text-[#2D3410]/60 font-bold uppercase tracking-[0.2em] text-[8px] mt-1">System Usability Scale (SUS)</p>
                </div>
              </div>
              
              <div className="space-y-6 mb-8">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 italic font-bold text-xs sm:text-sm text-[#2D3410] leading-relaxed">
                  "Mohon berikan penilaian objektif Bapak/Ibu mengenai pengalaman penggunaan platform ini."
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                    <div className="w-6 h-6 bg-[#2D3410] rounded-lg flex items-center justify-center text-white text-[10px]"><i className="fa-solid fa-check"></i></div>
                    <span className="font-bold text-[#2D3410] uppercase tracking-wider text-[8px]">10 Item</span>
                  </div>
                  <div className="flex-1 flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                    <div className="w-6 h-6 bg-[#2D3410] rounded-lg flex items-center justify-center text-white text-[10px]"><i className="fa-solid fa-list-ol"></i></div>
                    <span className="font-bold text-[#2D3410] uppercase tracking-wider text-[8px]">Skala 1-5</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowInstructions(false)}
                className="w-full py-4 bg-[#2D3410] hover:bg-black text-white font-black rounded-xl shadow-xl uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3"
              >
                MULAI SURVEY <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="survey"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
               <div className="text-center mb-6">
                  <h2 className="text-lg sm:text-2xl font-black text-[#2D3410] tracking-tighter uppercase italic leading-none drop-shadow-sm">Kuesioner</h2>
                  <div className="w-12 h-1 bg-[#2D3410] mx-auto mt-2 rounded-full"></div>
               </div>

               <div className="space-y-3">
                  {susQuestions.map((q, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="bg-white border border-slate-100 p-4 rounded-2xl shadow-md"
                    >
                      <div className="mb-4 p-3 bg-slate-50 border-l-[4px] border-[#2D3410] rounded-lg shadow-inner">
                        <p className="text-[11px] sm:text-[13px] text-[#2D3410] font-bold leading-relaxed">
                          <span className="text-[#2D3410]/30 font-black mr-2 italic">#{i + 1}</span> {q}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-[7px] font-black uppercase text-[#2D3410]/40 tracking-widest">STS</span>
                        <div className="flex justify-between gap-1.5 flex-1 max-w-[240px]">
                           {[1, 2, 3, 4, 5].map((val) => (
                             <button
                               key={val}
                               onClick={() => handleAnswer(i, val)}
                               className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg font-black text-[10px] sm:text-xs transition-all flex items-center justify-center border-2 ${
                                 answers[i] === val
                                   ? "bg-[#2D3410] border-[#2D3410] text-white shadow-md scale-105"
                                   : "bg-white border-slate-100 text-[#2D3410]/20 hover:border-[#2D3410]/10"
                               }`}
                             >
                               {val}
                             </button>
                           ))}
                        </div>
                        <span className="text-[7px] font-black uppercase text-[#2D3410]/40 tracking-widest">SS</span>
                      </div>
                    </motion.div>
                  ))}
               </div>

               <div className="flex justify-center pt-8">
                  <button
                    disabled={!isComplete}
                    onClick={submitSurvey}
                    className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.4em] text-[10px] transition-all flex items-center justify-center gap-4 ${
                      isComplete
                        ? "bg-[#2D3410] hover:bg-black text-white shadow-xl"
                        : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-inner"
                    }`}
                  >
                    Kirim Hasil <i className="fa-solid fa-paper-plane text-[10px]"></i>
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
