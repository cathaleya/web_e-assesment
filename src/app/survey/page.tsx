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
      // Redirect to dashboard where MADEL5C is now unlocked
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
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 uppercase">Panduan Survey</h1>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <h3 className="text-[10px] font-black text-amber-900 uppercase mb-1">Cara Pengisian:</h3>
                  <p className="text-[9px] font-bold text-amber-800 leading-relaxed">
                    Berikan penilaian subjektif Anda mengenai kemudahan penggunaan sistem ini. Pilih angka 1 (Sangat Tidak Setuju) sampai 5 (Sangat Setuju).
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="text-[10px] font-black text-slate-900 uppercase mb-1">Metode Penskoran (SUS):</h3>
                  <p className="text-[9px] font-bold text-slate-600 leading-relaxed">
                    Setiap jawaban akan dikonversi menggunakan algoritma SUS (System Usability Scale) untuk menghasilkan indeks kenyamanan 0-100.
                  </p>
                </div>
              </div>

              <button onClick={() => setShowInstructions(false)} className="w-full py-4 bg-[#4B5320] text-white font-black rounded-lg text-[10px] uppercase tracking-widest shadow-lg">LANJUTKAN KE SURVEY</button>
            </motion.div>
          ) : (
            <motion.div key="survey" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
               <div className="text-center mb-4">
                  <h2 className="text-lg font-black text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Evaluasi Sistem (SUS)</h2>
                  <div className="w-10 h-1 bg-white mx-auto mt-1 rounded-full shadow-lg"></div>
               </div>

               {susQuestions.map((q, i) => (
                 <motion.div key={i} className="bg-white border-2 border-slate-200 p-4 rounded-xl shadow-lg">
                   <div className="mb-4 p-3 bg-slate-50 border-l-4 border-slate-800 rounded-lg">
                     <p className="text-[12px] text-black font-black leading-tight">
                       <span className="text-slate-400 mr-1 italic">#{i + 1}</span> {q}
                     </p>
                   </div>
                   
                   <div className="flex justify-between items-center gap-2">
                     <span className="text-[8px] font-black text-slate-900 uppercase tracking-tighter w-12 leading-none">Tidak Setuju</span>
                     <div className="flex justify-between gap-1.5 flex-1 max-w-[220px]">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            onClick={() => handleAnswer(i, val)}
                            className={`w-9 h-9 rounded-lg font-black text-sm transition-all flex items-center justify-center border-2 ${
                              answers[i] === val 
                                ? "bg-black border-black text-white shadow-xl scale-110" 
                                : "bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300"
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                     </div>
                     <span className="text-[8px] font-black text-slate-900 uppercase tracking-tighter w-12 text-right leading-none">Sangat Setuju</span>
                   </div>
                 </motion.div>
               ))}

               <button disabled={!isComplete} onClick={submitSurvey} className={`w-full py-4 mt-6 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${
                 isComplete ? "bg-black text-white shadow-2xl" : "bg-slate-300 text-slate-100"
               }`}>
                 KIRIM HASIL SURVEY <i className="fa-solid fa-paper-plane ml-2"></i>
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
