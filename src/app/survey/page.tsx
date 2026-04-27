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
    <div className="min-h-screen bg-[#F9FAFB] text-slate-800 font-sans pb-24">
      <div className="fixed inset-0 bg-[radial-gradient(at_top_right,_var(--tw-gradient-stops))] from-emerald-50 via-transparent to-transparent pointer-events-none"></div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 lg:py-16">
        <AnimatePresence mode="wait">
          {showInstructions ? (
            <motion.div 
              key="instructions"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-slate-100 p-8 lg:p-14 rounded-[50px] shadow-2xl shadow-emerald-900/5"
            >
              <div className="w-20 h-20 bg-emerald-600 rounded-[30px] flex items-center justify-center mb-10 shadow-2xl shadow-emerald-600/30">
                <i className="fa-solid fa-star-half-stroke text-3xl text-white"></i>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Panduan Survey</h1>
              <p className="text-emerald-600 font-black uppercase tracking-[0.3em] text-xs mb-10">System Usability Scale (SUS)</p>
              
              <div className="space-y-8 text-slate-600 leading-relaxed text-lg mb-12">
                <div className="p-8 bg-emerald-50 rounded-[35px] border border-emerald-100/50">
                  <p className="font-semibold text-emerald-900 leading-relaxed">Tahap ini adalah evaluasi terhadap platform HDAP yang baru saja Anda gunakan. Penilaian Anda sangat berharga bagi kami.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-5 items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><i className="fa-solid fa-1"></i></div>
                    <p className="font-bold text-slate-800">10 Pernyataan singkat mengenai pengalaman sistem.</p>
                  </div>
                  <div className="flex gap-5 items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><i className="fa-solid fa-2"></i></div>
                    <p className="font-bold text-slate-800">Skala 1 (Sangat Tidak Setuju) s/d 5 (Sangat Setuju).</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowInstructions(false)}
                className="w-full lg:w-fit px-16 py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-600/20 uppercase tracking-widest text-sm"
              >
                Lanjutkan <i className="fa-solid fa-circle-arrow-right ml-2"></i>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="survey"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
               <div className="text-center mb-16">
                  <span className="px-6 py-2 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase tracking-[0.3em]">User Feedback</span>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight mt-6">Evaluasi Pengguna</h2>
                  <div className="w-20 h-1.5 bg-emerald-600 mx-auto mt-4 rounded-full"></div>
               </div>

               <div className="space-y-8">
                  {susQuestions.map((q, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white border border-slate-100 p-8 lg:p-12 rounded-[45px] shadow-xl shadow-slate-200/50"
                    >
                      <p className="text-xl lg:text-2xl text-slate-800 font-bold leading-relaxed mb-10">
                        <span className="text-emerald-500 font-black mr-4 italic">#{i + 1}</span> {q}
                      </p>
                      
                      <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest order-last md:order-first w-full md:w-auto text-center md:text-left">Sangat Tidak Setuju</span>
                        <div className="flex justify-between gap-4 flex-1 max-w-md mx-auto">
                           {[1, 2, 3, 4, 5].map((val) => (
                             <button
                               key={val}
                               onClick={() => handleAnswer(i, val)}
                               className={`w-12 h-12 lg:w-16 lg:h-16 rounded-[22px] font-black text-xl transition-all flex items-center justify-center border-2 ${
                                 answers[i] === val
                                   ? "bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-600/30 scale-110"
                                   : "bg-slate-50 border-slate-100 text-slate-400 hover:border-emerald-200 hover:bg-emerald-50/50"
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
                    className={`px-24 py-7 rounded-[35px] font-black uppercase tracking-widest text-sm transition-all flex items-center gap-4 ${
                      isComplete
                        ? "bg-slate-900 hover:bg-black text-white shadow-2xl shadow-black/20 scale-105"
                        : "bg-slate-100 text-slate-300 cursor-not-allowed"
                    }`}
                  >
                    Kirim Respon Saya
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
