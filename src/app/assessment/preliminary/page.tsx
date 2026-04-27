"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PreliminaryAssessment() {
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
      const res = await fetch('/api/questions?type=preliminary');
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
          type: "PDI-DL",
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-teal-100">
      {/* Soft Gradient Background */}
      <div className="fixed inset-0 bg-[radial-gradient(at_top_left,_var(--tw-gradient-stops))] from-teal-50 via-transparent to-transparent pointer-events-none"></div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 lg:py-16">
        <AnimatePresence mode="wait">
          {showInstructions ? (
            <motion.div 
              key="instructions"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-slate-200 p-8 lg:p-14 rounded-[40px] shadow-2xl shadow-teal-900/5"
            >
              <div className="w-20 h-20 bg-teal-600 rounded-3xl flex items-center justify-center mb-10 shadow-xl shadow-teal-600/30">
                <i className="fa-solid fa-file-invoice text-3xl text-white"></i>
              </div>
              
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Panduan PDI-DL</h1>
              <p className="text-teal-600 font-black uppercase tracking-[0.3em] text-xs mb-10">Preliminary Digital Literacy Assessment</p>
              
              <div className="space-y-6 text-slate-600 leading-relaxed text-lg mb-12">
                <div className="p-6 bg-teal-50 rounded-3xl border border-teal-100/50">
                  <p className="font-medium text-teal-900">Instrumen ini bertujuan untuk memetakan pemahaman dasar Anda mengenai literasi digital sebelum melanjutkan ke tahap SJT.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0"><i className="fa-solid fa-list-ol"></i></div>
                    <div>
                      <p className="font-bold text-slate-900">10 Pertanyaan</p>
                      <p className="text-sm">Pilihan ganda dengan 4 opsi jawaban.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0"><i className="fa-solid fa-award"></i></div>
                    <div>
                      <p className="font-bold text-slate-900">Skor 0 - 50</p>
                      <p className="text-sm">Setiap jawaban benar bernilai 5 poin.</p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowInstructions(false)}
                className="w-full lg:w-fit px-14 py-5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-teal-600/20 uppercase tracking-widest text-sm"
              >
                Lanjutkan <i className="fa-solid fa-circle-play ml-2"></i>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="assessment"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center bg-white p-6 rounded-[30px] border border-slate-200 shadow-lg shadow-slate-200/50">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-teal-600/20">{currentStep + 1}</div>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest">Pertanyaan ke-{currentStep + 1}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress: {Math.round(((currentStep + 1) / questions.length) * 100)}%</p>
                  </div>
                </div>
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-teal-500 transition-all duration-500" style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}></div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-8 lg:p-14 rounded-[40px] shadow-2xl shadow-slate-200/50">
                <p className="text-2xl text-slate-900 font-bold leading-tight mb-12">
                  {questions[currentStep]?.question}
                </p>

                <div className="grid grid-cols-1 gap-4">
                  {questions[currentStep]?.options.map((opt: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`group flex items-center gap-6 p-6 rounded-[28px] border-2 transition-all text-left ${
                        answers[currentStep] === idx + 1
                          ? "bg-teal-50 border-teal-500 text-teal-900 shadow-md"
                          : "bg-white border-slate-100 text-slate-500 hover:border-teal-200 hover:bg-teal-50/30"
                      }`}
                    >
                      <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all ${
                        answers[currentStep] === idx + 1 ? "bg-teal-600 text-white shadow-lg" : "bg-slate-100 text-slate-400 group-hover:bg-teal-100 group-hover:text-teal-600"
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 font-bold text-lg leading-snug">{opt.text}</span>
                      {answers[currentStep] === idx + 1 && <i className="fa-solid fa-circle-check text-teal-600 text-2xl"></i>}
                    </button>
                  ))}
                </div>

                <div className="mt-14 flex justify-end">
                  <button
                    disabled={!answers[currentStep]}
                    onClick={nextQuestion}
                    className={`px-14 py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center gap-3 ${
                      answers[currentStep]
                        ? "bg-slate-900 hover:bg-black text-white shadow-2xl shadow-black/20"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {currentStep === questions.length - 1 ? "Simpan Hasil" : "Lanjutkan"}
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
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
