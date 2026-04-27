"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import questionsData from "./questions.json";

export default function SurveyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [actualSusScore, setActualSusScore] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qCount = questionsData.length;
    if (Object.keys(answers).length < qCount) return;

    setIsSubmitting(true);
    const userId = localStorage.getItem("userId");
    const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
    // SUS formula: (sum of scores - 10) * 2.5
    const susScore = Math.round((totalScore - 10) * 2.5);
    setActualSusScore(susScore);

    if (userId) {
      try {
        await fetch("/api/survey", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, totalScore, answersJson: answers }),
        });
      } catch (error) {
        console.error("Failed to submit survey:", error);
      }
    }

    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleSelect = (qIndex: number, val: number) => {
    setAnswers({ ...answers, [qIndex]: val });
  };

  const isFormValid = Object.keys(answers).length === questionsData.length;

  const getSusGrade = (score: number) => {
    if (score >= 90) return { grade: "A+", label: "Excellent", color: "text-emerald-400" };
    if (score >= 80) return { grade: "A", label: "Good", color: "text-teal-400" };
    if (score >= 70) return { grade: "B", label: "Acceptable", color: "text-blue-400" };
    if (score >= 60) return { grade: "C", label: "Marginal", color: "text-yellow-400" };
    return { grade: "D", label: "Poor", color: "text-red-400" };
  };

  const susInfo = getSusGrade(actualSusScore);

  return (
    <div className="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center p-6"
         style={{ backgroundImage: "linear-gradient(rgba(11,17,32,0.8), rgba(11,17,32,0.9)), url('/survey_v2.png')", backgroundSize: "cover" }}>

      {!submitted ? (
        <div className="max-w-4xl w-full bg-[#1E293B]/80 backdrop-blur-2xl rounded-[30px] p-10 border border-slate-700/50 shadow-2xl animate-in zoom-in duration-300">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-500 flex items-center justify-center text-xl border border-blue-500/30">
              <i className="fa-solid fa-square-poll-vertical"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide">System Usability Scale (SUS)</h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Evaluasi Pengalaman Pengguna (10 Butir)</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {questionsData.map((q: any, i: number) => (
              <div key={i} className={`bg-slate-900/50 p-6 rounded-2xl border transition-colors ${answers[i] ? "border-blue-500/50" : "border-slate-700/50 hover:border-slate-500/50"}`}>
                <p className="text-slate-200 font-medium mb-4">{i + 1}. {q.text}</p>
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button type="button" key={val} onClick={() => handleSelect(i, val)}
                      className={`flex-1 py-3 rounded-lg border transition-all font-bold text-sm ${answers[i] === val ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]" : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700"}`}>
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2">
                  <span>Sangat Tidak Setuju (1)</span>
                  <span>Sangat Setuju (5)</span>
                </div>
              </div>
            ))}

            <div className="pt-6">
              <button type="submit" disabled={!isFormValid || isSubmitting}
                className={`w-full font-bold py-5 rounded-2xl transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3 ${isFormValid && !isSubmitting ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]" : "bg-slate-700 text-slate-500 cursor-not-allowed"}`}>
                {isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>} KIRIM SURVEI & LIHAT HASIL
              </button>
              {!isFormValid && <p className="text-center text-xs text-rose-400 mt-3 font-bold uppercase tracking-widest">Lengkapi semua {questionsData.length} pertanyaan</p>}
            </div>
          </form>
        </div>
      ) : (
        <div className="max-w-2xl w-full bg-[#1E293B]/90 backdrop-blur-3xl rounded-[30px] p-12 shadow-2xl border border-slate-700/50 text-center animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 border border-emerald-500/30">
            <i className="fa-solid fa-check-double"></i>
          </div>
          <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Terima Kasih!</h2>
          <p className="text-slate-400 mb-8 font-medium text-sm">Data Survei Usability Anda telah berhasil direkam ke dalam sistem.</p>

          <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700/50 mb-8 text-left space-y-4">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest border-b border-slate-700 pb-2">
              <i className="fa-solid fa-chart-bar mr-2"></i> Hasil Survei SUS Anda
            </h3>
            <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Skor SUS Anda</p>
                <p className={`text-4xl font-black ${susInfo.color}`}>{actualSusScore}<span className="text-sm text-slate-500">/100</span></p>
              </div>
              <div className="text-right">
                <p className={`text-5xl font-black ${susInfo.color}`}>{susInfo.grade}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">{susInfo.label}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 italic text-center">
              {actualSusScore >= 80
                ? "Platform ini sangat mudah digunakan. Terima kasih atas penilaian positif Anda!"
                : actualSusScore >= 70
                ? "Platform ini cukup mudah digunakan. Masukan Anda sangat berarti untuk perbaikan."
                : "Terima kasih atas masukan Anda. Kami akan terus meningkatkan pengalaman pengguna."}
            </p>
          </div>

          <button onClick={() => router.push("/dashboard?survey=done")}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest">
            KEMBALI KE DASHBOARD <i className="fa-solid fa-house"></i>
          </button>
        </div>
      )}
    </div>
  );
}
