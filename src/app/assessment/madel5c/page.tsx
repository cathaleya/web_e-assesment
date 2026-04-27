"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Madel5cAssessment() {
  const [questionsData, setQuestionsData] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/questions?type=madel5c')
      .then(res => res.json())
      .then(data => {
        setQuestionsData(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load questions:", err);
        setIsLoading(false);
      });
  }, []);

  const totalItems = questionsData.length;
  const currentQuestion = questionsData[step];

  const handleOptionClick = async (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (step < totalItems - 1) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      setFinished(true);
      
      const totalScore = newAnswers.reduce((acc, curr) => acc + curr, 0);
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          await fetch('/api/assessment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              type: 'MADEL5C',
              totalScore,
              answersJson: JSON.stringify(newAnswers)
            })
          });
        } catch (error) {
          console.error("Failed to submit result:", error);
        }
      }
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
        <div className="text-center">
          <i className="fa-solid fa-circle-notch fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Menyiapkan Instrumen...</p>
        </div>
      </div>
    );
  }

  const totalScore = answers.reduce((acc, curr) => acc + curr, 0);
  const percentage = Math.round((totalScore / (totalItems * 5)) * 100);

  const getAIFeedback = () => {
    if (percentage >= 80) return "Luar biasa! Kompetensi literasi digital MADEL5C Anda berada pada level Pakar. Anda memiliki kemampuan kritis dalam mengevaluasi informasi dan memecahkan masalah kompleks secara kreatif.";
    if (percentage >= 60) return "Sangat baik. Anda memiliki pemahaman yang solid tentang literasi digital. Fokuslah pada peningkatan kolaborasi dan etika digital yang lebih mendalam.";
    return "Kemampuan Anda sudah cukup baik, namun perlu peningkatan pada aspek literasi data dan keamanan informasi. Pelajari lebih lanjut tentang evaluasi sumber digital yang kredibel.";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0B1120]"
         style={{ backgroundImage: "linear-gradient(rgba(11,17,32,0.8), rgba(11,17,32,0.9)), url('/assessment_v2.png')", backgroundSize: 'cover' }}>
      
      {!finished ? (
        <div className="max-w-4xl w-full bg-[#1E293B]/80 backdrop-blur-2xl rounded-[30px] p-10 border border-slate-700/50 shadow-2xl animate-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-700/50">
            <div>
               <h3 className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-1">MADEL5C SJT Instrument</h3>
               <p className="text-slate-300 text-sm">Situational Judgment Test ({totalItems} Items)</p>
            </div>
            <div className="text-right">
               <span className="px-4 py-1.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full border border-blue-500/30 uppercase tracking-widest">
                 Item {step + 1} of {totalItems}
               </span>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4 leading-relaxed">
              <span className="text-blue-500 mr-2">{step + 1}.</span> 
              {currentQuestion?.scenario}
            </h2>
            <p className="text-slate-400 text-sm italic border-l-4 border-blue-500/50 pl-3">
              Pilih satu keputusan profesional yang paling tepat untuk situasi di atas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-10">
            {currentQuestion?.options.map((opt: any, i: number) => (
              <button key={i} onClick={() => handleOptionClick(opt.score)}
                      className="w-full text-left p-5 rounded-2xl border border-slate-700/50 bg-slate-800/50 hover:bg-blue-600 hover:border-blue-500 transition-all font-medium text-slate-200 flex items-start gap-4 group shadow-lg">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-700/50 group-hover:bg-white/20 flex items-center justify-center text-xs font-bold transition-colors">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="mt-1 leading-relaxed">{opt.text}</span>
              </button>
            ))}
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
             <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${((step+1)/totalItems)*100}%` }}></div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl w-full bg-[#1E293B]/90 backdrop-blur-3xl rounded-[40px] p-12 shadow-2xl border border-slate-700/50 text-center animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 border border-blue-500/30">
            {isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-flag-checkered"></i>}
          </div>
          <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">Asesmen MADEL5C Selesai!</h2>
          
          <div className="bg-slate-900/60 rounded-3xl p-8 border border-slate-700/50 mb-10 text-left">
             <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Skor Kompetensi</span>
                <span className="text-4xl font-black text-blue-400">{totalScore} <span className="text-sm font-bold text-slate-500">/ {totalItems * 5}</span></span>
             </div>
             <div>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2 block">AI Diagnostic Feedback</span>
                <p className="text-slate-300 italic leading-relaxed font-medium">"{getAIFeedback()}"</p>
             </div>
          </div>
          
          <button onClick={() => router.push('/dashboard?madel5c=done')}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest">
            KEMBALI KE DASHBOARD <i className="fa-solid fa-house"></i>
          </button>
        </div>
      )}
    </div>
  );
}
