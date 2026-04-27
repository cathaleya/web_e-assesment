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
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className={`${creamBg}/95 backdrop-blur-2xl border-4 border-white p-10 lg:p-16 rounded-[60px] shadow-2xl`}
            >
              <div className="w-20 h-20 bg-[#4B5320] rounded-[30px] flex items-center justify-center mb-10 shadow-2xl shadow-[#4B5320]/30">
                <i className="fa-solid fa-star-half-stroke text-3xl text-white"></i>
              </div>
              <h1 className="text-4xl font-black text-[#4B5320] tracking-tighter uppercase italic mb-3 leading-none">Evaluasi Usabilitas</h1>
              <p className="text-[#4B5320]/60 font-black uppercase tracking-[0.4em] text-[11px] mb-12 italic">System Usability Scale (SUS)</p>
              
              <div className="space-y-10 text-[#4B5320] leading-relaxed text-lg mb-14">
                <div className="p-10 bg-white/60 rounded-[40px] border border-white shadow-inner italic font-bold text-2xl leading-snug">
                  "Dimohon untuk memberikan penilaian jujur mengenai pengalaman Bapak/Ibu dalam menggunakan platform ini."
                </div>
                <ul className="space-y-6">
                  <li className="flex gap-6"><i className="fa-solid fa-check-circle text-[#4B5320] text-2xl mt-1"></i> <span className="font-bold italic">Terdapat 10 pernyataan mengenai kualitas sistem.</span></li>
                  <li className="flex gap-6"><i className="fa-solid fa-check-circle text-[#4B5320] text-2xl mt-1"></i> <span className="font-bold italic">Skala 1 (Sangat Tidak Setuju) hingga 5 (Sangat Setuju).</span></li>
                </ul>
              </div>

              <button 
                onClick={() => setShowInstructions(false)}
                className="w-full lg:w-fit px-16 py-6 bg-[#4B5320] hover:bg-[#354B37] text-white font-black rounded-[30px] transition-all shadow-2xl shadow-[#4B5320]/40 uppercase tracking-[0.4em] text-xs"
              >
                Lanjutkan Survey &rarr;
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="survey"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-10 sm:space-y-16"
            >
               <div className="text-center mb-16 drop-shadow-[0_2px_10px_rgba(255,255,255,1)]">
                  <h2 className="text-4xl sm:text-5xl font-black text-[#4B5320] tracking-tighter uppercase italic">Kuesioner Usabilitas</h2>
                  <div className="w-24 h-2 bg-[#4B5320] mx-auto mt-6 rounded-full"></div>
               </div>

               <div className="space-y-8 lg:space-y-12">
                  {susQuestions.map((q, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`${creamBg}/95 backdrop-blur-2xl border-4 border-white p-8 lg:p-14 rounded-[50px] shadow-2xl`}
                    >
                      <p className="text-xl sm:text-3xl text-[#4B5320] font-black leading-snug mb-12 drop-shadow-[0_2px_4px_rgba(255,255,255,1)]">
                        <span className="text-[#4B5320]/40 font-black mr-4 italic">#{i + 1}</span> {q}
                      </p>
                      
                      <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest order-last md:order-first w-full md:w-auto text-center md:text-left">Sangat Tidak Setuju</span>
                        <div className="flex justify-between gap-3 sm:gap-6 flex-1 w-full max-w-lg mx-auto">
                           {[1, 2, 3, 4, 5].map((val) => (
                             <button
                               key={val}
                               onClick={() => handleAnswer(i, val)}
                               className={`w-14 h-14 sm:w-20 sm:h-20 rounded-[25px] font-black text-xl sm:text-2xl transition-all flex items-center justify-center border-4 ${
                                 answers[i] === val
                                   ? "bg-[#4B5320] border-[#4B5320] text-white shadow-2xl scale-110"
                                   : "bg-white/70 border-white text-slate-300 hover:border-[#4B5320]/20"
                               }`}
                             >
                               {val}
                             </button>
                           ))}
                        </div>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest w-full md:w-auto text-center md:text-right">Sangat Setuju</span>
                      </div>
                    </motion.div>
                  ))}
               </div>

               <div className="flex justify-center pt-10">
                  <button
                    disabled={!isComplete}
                    onClick={submitSurvey}
                    className={`w-full sm:w-fit px-20 py-7 rounded-[40px] font-black uppercase tracking-[0.5em] text-xs transition-all flex items-center justify-center gap-6 ${
                      isComplete
                        ? "bg-[#4B5320] hover:bg-[#354B37] text-white shadow-2xl shadow-[#4B5320]/40"
                        : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-inner"
                    }`}
                  >
                    Submit Hasil Survey
                    <i className="fa-solid fa-paper-plane text-xs"></i>
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
