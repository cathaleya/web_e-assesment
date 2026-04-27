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
      if (qNum % 2 !== 0) { totalScore += (val - 1); } 
      else { totalScore += (5 - val); }
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
    <div className="min-h-screen relative bg-slate-100"
         style={{ 
           backgroundImage: "url('/unj_bg_v2.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>

      <main className="relative z-10 max-w-xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {showInstructions ? (
            <motion.div 
              key="instructions"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-white p-6 rounded-2xl shadow-2xl border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-4 border-b pb-4">
                <i className="fa-solid fa-star-half-stroke text-[#4B5320] text-xl"></i>
                <h1 className="text-lg font-black text-slate-900 uppercase">Evaluasi Usabilitas</h1>
              </div>
              
              <div className="space-y-4 mb-6">
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-bold text-xs text-slate-700 leading-relaxed italic">
                  "Mohon berikan penilaian objektif Bapak/Ibu mengenai pengalaman penggunaan platform ini."
                </p>
                <div className="grid grid-cols-2 gap-2 text-[8px] font-black uppercase text-slate-500">
                  <div className="p-2 bg-white border rounded-lg flex items-center gap-2">
                    <i className="fa-solid fa-check text-emerald-500"></i> 10 Pertanyaan
                  </div>
                  <div className="p-2 bg-white border rounded-lg flex items-center gap-2">
                    <i className="fa-solid fa-list text-blue-500"></i> Skala 1-5
                  </div>
                </div>
              </div>

              <button onClick={() => setShowInstructions(false)} className="w-full py-3 bg-[#4B5320] text-white font-black rounded-lg text-[10px] uppercase tracking-widest shadow-lg">
                MULAI SURVEY
              </button>
            </motion.div>
          ) : (
            <motion.div key="survey" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
               <div className="text-center mb-4">
                  <h2 className="text-lg font-black text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Kuesioner SUS</h2>
                  <div className="w-10 h-1 bg-white mx-auto mt-1 rounded-full shadow-lg"></div>
               </div>

               {susQuestions.map((q, i) => (
                 <motion.div key={i} className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg">
                   <div className="mb-3 p-3 bg-slate-50 border-l-4 border-[#4B5320] rounded-lg">
                     <p className="text-[11px] text-slate-900 font-bold leading-tight">
                       <span className="text-slate-300 mr-1 italic">#{i + 1}</span> {q}
                     </p>
                   </div>
                   
                   <div className="flex justify-between items-center gap-2">
                     <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">STS</span>
                     <div className="flex justify-between gap-1 flex-1 max-w-[200px]">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            onClick={() => handleAnswer(i, val)}
                            className={`w-8 h-8 rounded-lg font-black text-[10px] transition-all flex items-center justify-center border-2 ${
                              answers[i] === val ? "bg-[#4B5320] border-[#4B5320] text-white" : "bg-white border-slate-100 text-slate-200"
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                     </div>
                     <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">SS</span>
                   </div>
                 </motion.div>
               ))}

               <button disabled={!isComplete} onClick={submitSurvey} className={`w-full py-4 mt-6 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
                 isComplete ? "bg-[#4B5320] text-white shadow-xl" : "bg-slate-300 text-slate-100"
               }`}>
                 Kirim Hasil Survey
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
