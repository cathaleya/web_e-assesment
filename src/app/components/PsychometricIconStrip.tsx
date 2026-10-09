"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PsychometricIconStrip({ label = "Dimensi Psikometri:" }: { label?: string }) {
  const items = [
    { title: "Kognitif", desc: "Analisis Berpikir", icon: "fa-brain", color: "from-purple-600 to-indigo-700 border-purple-400 text-purple-200", shadow: "shadow-purple-900/50", dur: 3 },
    { title: "Penalaran", desc: "Situasional SJT", icon: "fa-lightbulb", color: "from-amber-500 to-yellow-600 border-amber-300 text-amber-100", shadow: "shadow-amber-900/50", dur: 3.5 },
    { title: "Presisi", desc: "Akurasi Tindakan", icon: "fa-bullseye", color: "from-rose-600 to-pink-700 border-rose-400 text-rose-100", shadow: "shadow-rose-900/50", dur: 4 },
    { title: "Etika", desc: "Netiket & Judgement", icon: "fa-scale-balanced", color: "from-emerald-600 to-teal-700 border-emerald-400 text-emerald-100", shadow: "shadow-emerald-900/50", dur: 3.2 },
    { title: "Solusi", desc: "Problem Solving", icon: "fa-puzzle-piece", color: "from-sky-600 to-blue-700 border-sky-400 text-sky-100", shadow: "shadow-sky-900/50", dur: 3.8 },
    { title: "Latency", desc: "Respons & Timing", icon: "fa-stopwatch", color: "from-orange-600 to-amber-700 border-orange-400 text-orange-100", shadow: "shadow-orange-900/50", dur: 3.4 },
    { title: "Metrik", desc: "Skor Likert 5C", icon: "fa-chart-column", color: "from-cyan-600 to-blue-700 border-cyan-400 text-cyan-100", shadow: "shadow-cyan-900/50", dur: 3.6 },
    { title: "Integritas", desc: "Data Terverifikasi", icon: "fa-shield-halved", color: "from-teal-600 to-emerald-700 border-teal-400 text-teal-100", shadow: "shadow-teal-900/50", dur: 3.1 },
  ];

  return (
    <div className="w-full bg-slate-900/95 backdrop-blur-xl p-2.5 rounded-2xl border-2 border-slate-700/80 shadow-2xl overflow-x-auto custom-scrollbar my-4">
      <div className="flex items-center justify-between gap-3 min-w-[720px]">
        <div className="text-[10px] font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5 shrink-0 border-r border-slate-800 pr-3">
          <i className="fa-solid fa-atom text-rose-400 text-sm animate-spin"></i>
          <span>{label}</span>
        </div>

        <div className="flex items-center gap-2.5 flex-1 justify-around">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: item.dur, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 shrink-0 hover:border-slate-600 transition"
            >
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center border shadow-md ${item.shadow} text-xs font-black shrink-0`}>
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <div className="text-left pr-1">
                <div className="text-[10px] font-black text-white leading-tight uppercase tracking-tight">{item.title}</div>
                <div className="text-[9px] font-semibold text-slate-400 leading-tight">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
