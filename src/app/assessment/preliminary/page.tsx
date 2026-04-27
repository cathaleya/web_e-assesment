"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PreliminaryAssessment() {
  const [step, setStep] = useState(1);
  const [finished, setFinished] = useState(false);
  const router = useRouter();

  // Simulasi 20 Pertanyaan
  const totalItems = 20;

  const handleFinish = () => {
    setFinished(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950"
         style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url('/assessment_v2.png')", backgroundSize: 'cover' }}>
      
      {!finished ? (
        <div className="max-w-4xl w-full bg-slate-900/80 backdrop-blur-2xl rounded-[40px] p-12 shadow-2xl border border-white/10 animate-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
            <div>
               <h3 className="text-teal-400 font-black uppercase tracking-widest text-xs mb-1">Preliminary Diagnostic</h3>
               <p className="text-white font-bold">PDI-DL Instrument</p>
            </div>
            <div className="text-right">
               <span className="px-4 py-1 bg-teal-500/20 text-teal-400 text-[10px] font-black rounded-full border border-teal-500/30 uppercase">Item {step} of {totalItems}</span>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-black text-white mb-4 leading-tight italic uppercase tracking-tight">
              {step}. Bagaimana strategi Anda dalam mengevaluasi kredibilitas sumber informasi digital yang baru Anda temukan?
            </h2>
            <p className="text-slate-400 text-sm italic font-medium">Pilih satu jawaban yang paling mencerminkan kebiasaan Anda.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-12">
            {[
              'Memeriksa otoritas penulis dan tanggal publikasi secara mendalam',
              'Membandingkan dengan minimal 3 sumber terpercaya lainnya',
              'Hanya mempercayai situs dengan domain .gov atau .edu',
              'Membaca sekilas tanpa melakukan verifikasi lebih lanjut',
              'Tidak pernah melakukan pengecekan sumber'
            ].map((opt, i) => (
              <button key={i} onClick={() => step < totalItems ? setStep(step + 1) : handleFinish()}
                      className="w-full text-left p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-teal-600 hover:border-teal-400 transition-all font-bold text-slate-200 flex justify-between items-center group shadow-lg">
                <span className="flex items-center gap-4">
                   <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs group-hover:bg-white/20 transition-colors">{String.fromCharCode(65 + i)}</span>
                   {opt}
                </span>
                <i className="fa-solid fa-circle-check opacity-0 group-hover:opacity-100 transition-all text-white"></i>
              </button>
            ))}
          </div>

          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
             <div className="bg-teal-500 h-full transition-all duration-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]" style={{ width: `${(step/totalItems)*100}%` }}></div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl w-full bg-slate-900/90 backdrop-blur-3xl rounded-[50px] p-16 shadow-2xl border border-white/10 text-center animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 border border-green-500/30">
            <i className="fa-solid fa-check-double"></i>
          </div>
          <h2 className="text-4xl font-black text-white mb-4 italic uppercase tracking-tighter">Asesmen 20 Butir Selesai!</h2>
          <p className="text-slate-400 mb-12 font-medium leading-relaxed">Data pengerjaan Anda telah tersimpan. Silakan lanjutkan ke Survei Pengguna (SUS) untuk mengaktifkan statistik di dashboard Anda.</p>
          
          <button onClick={() => router.push('/survey')}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-black py-6 rounded-3xl shadow-2xl shadow-teal-500/20 transition-all flex items-center justify-center gap-4 text-xl uppercase italic tracking-widest">
            LANJUT KE SURVEI <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}
