"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PreliminaryAssessment() {
  const [step, setStep] = useState(1);
  const [finished, setFinished] = useState(false);
  const router = useRouter();

  const handleFinish = () => {
    setFinished(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6"
         style={{ backgroundImage: "url('/assessment_v2.png')", backgroundSize: 'cover' }}>
      
      {!finished ? (
        <div className="max-w-3xl w-full glass-panel bg-white/90 rounded-[40px] p-12 shadow-2xl border-white animate-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-10">
            <span className="px-4 py-1 bg-teal-100 text-teal-800 text-[10px] font-black rounded-full uppercase tracking-widest">Question {step} of 10</span>
            <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-teal-500 h-full transition-all duration-500" style={{ width: `${(step/10)*100}%` }}></div>
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-8 leading-tight italic uppercase">
            {step === 1 ? "Seberapa sering Anda menggunakan perangkat digital untuk mencari sumber belajar mandiri?" : "Pertanyaan selanjutnya mengenai etika digital..."}
          </h2>

          <div className="space-y-4 mb-12">
            {['Sangat Sering', 'Sering', 'Kadang-kadang', 'Jarang', 'Tidak Pernah'].map((opt, i) => (
              <button key={i} onClick={() => step < 10 ? setStep(step + 1) : handleFinish()}
                      className="w-full text-left p-6 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition-all font-bold text-slate-700 flex justify-between items-center group">
                {opt}
                <i className="fa-solid fa-chevron-right opacity-0 group-hover:opacity-100 transition-all text-teal-500"></i>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-xl w-full glass-panel bg-white/95 rounded-[50px] p-16 shadow-2xl border-white text-center animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-lg">
            <i className="fa-solid fa-check-double"></i>
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4 italic uppercase">Asesmen Selesai!</h2>
          <p className="text-slate-500 mb-10 font-medium">Terima kasih telah menyelesaikan PDI-DL. Langkah terakhir adalah mengisi survei kepuasan pengguna.</p>
          
          {/* TOMBOL SURVEI SESUAI PERMINTAAN BAPAK */}
          <button onClick={() => router.push('/survey')}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-5 rounded-3xl shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 text-lg">
            ISI SURVEI PENGGUNA <i className="fa-solid fa-square-poll-vertical"></i>
          </button>
        </div>
      )}
    </div>
  );
}
