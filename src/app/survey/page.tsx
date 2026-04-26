"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SurveyPage() {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6"
         style={{ backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('/survey_v2.png')", backgroundSize: 'cover' }}>
      
      {!submitted ? (
        <div className="max-w-3xl w-full glass-panel bg-white/10 backdrop-blur-xl rounded-[40px] p-12 border border-white/20 shadow-2xl animate-in zoom-in duration-300">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30">
              <i className="fa-solid fa-square-poll-vertical"></i>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Survei Pengguna (SUS)</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Platform Usability Evaluation</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
             {[
               "Saya merasa sistem HDAP sangat mudah digunakan.",
               "Saya merasa fitur analisis AI sangat membantu pemahaman saya.",
               "Saya merasa alur dari login hingga dashboard sangat lancar."
             ].map((q, i) => (
               <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <p className="text-white font-medium mb-4">{i+1}. {q}</p>
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button type="button" key={val} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-blue-600 hover:border-blue-400 transition-all font-black">
                        {val}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Sangat Tidak Setuju</span>
                    <span>Sangat Setuju</span>
                  </div>
               </div>
             ))}

             <button type="submit" 
                     className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-black py-5 rounded-3xl shadow-xl shadow-teal-500/30 transition-all text-lg uppercase italic tracking-widest">
               KIRIM SURVEI SEKARANG
             </button>
          </form>
        </div>
      ) : (
        <div className="max-w-xl w-full glass-panel bg-white/95 rounded-[50px] p-16 shadow-2xl border-white text-center animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-lg">
            <i className="fa-solid fa-paper-plane"></i>
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4 italic uppercase tracking-tighter">Survei Terkirim!</h2>
          <p className="text-slate-500 mb-10 font-medium leading-relaxed">Data Anda telah masuk ke sistem analisis kami. Terima kasih telah membantu pengembangan HDAP.</p>
          
          {/* TOMBOL KEMBALI KE DASHBOARD SESUAI PERMINTAAN BAPAK */}
          <button onClick={() => router.push('/dashboard?survey=done')}
                  className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-3xl shadow-xl transition-all flex items-center justify-center gap-3 text-lg uppercase italic">
            KEMBALI KE DASHBOARD <i className="fa-solid fa-house-user"></i>
          </button>
        </div>
      )}
    </div>
  );
}
