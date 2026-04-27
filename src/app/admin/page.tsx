"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Radar, Bar, Doughnut, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement
);

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState("madel5c");
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState({
    participants: 0,
    madel5cScore: 0,
    surveyScore: 0,
    difFlags: 0
  });
  const [questions, setQuestions] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    fetchStats();
    fetchQuestions();
  }, []);

  const fetchStats = async () => {
    try {
      const [madelRes, surveyRes] = await Promise.all([
        fetch('/api/assessment?type=MADEL5C'),
        fetch('/api/survey')
      ]);
      const madelData = await madelRes.json();
      const surveyData = await surveyRes.json();

      setStats({
        participants: madelData.length,
        madel5cScore: madelData.length > 0 ? Math.round(madelData.reduce((acc: any, curr: any) => acc + curr.totalScore, 0) / madelData.length) : 0,
        surveyScore: surveyData.length > 0 ? Math.round(surveyData.reduce((acc: any, curr: any) => acc + curr.totalScore, 0) / surveyData.length) : 0,
        difFlags: 2 // Simulated for now
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions');
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  const handleSaveQuestion = async (index: number) => {
    try {
      await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questions)
      });
      setEditingIndex(null);
      alert("Perubahan instrumen berhasil disimpan!");
    } catch (error) {
      console.error("Failed to save questions:", error);
    }
  };

  const downloadCSV = () => {
    window.location.href = '/api/admin/export';
  };

  const handleLogout = () => {
    localStorage.removeItem("userName");
    router.push("/login");
  };

  // CFA Radar Data
  const cfaRadarData = {
    labels: ['Information', 'Creation', 'Pedagogy', 'Ethics', 'Social'],
    datasets: [{
      label: 'Standardized Loadings',
      data: [0.82, 0.75, 0.88, 0.79, 0.85],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
    }]
  };

  // Wright Map Data (Simplified as Bar)
  const wrightMapData = {
    labels: ['Persons', 'Items'],
    datasets: [
      { label: 'Distribution', data: [2.5, 1.8], backgroundColor: ['#3b82f6', '#8b5cf6'], borderRadius: 4 }
    ]
  };

  // Literacy Level (Doughnut)
  const literacyData = {
    labels: ['Tinggi', 'Sedang', 'Rendah'],
    datasets: [{
      data: [45, 120, 119],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
      borderWidth: 0,
    }]
  };

  // DIF Plot Data
  const difChartData = {
    labels: ['PED_02', 'ETH_05', 'INFO_01', 'CREATE_04'],
    datasets: [
        { label: 'Male', data: [1.2, 0.5, 0.8, 1.0], backgroundColor: '#3b82f6', borderRadius: 4 },
        { label: 'Female', data: [2.5, 1.4, 0.7, 0.9], backgroundColor: '#f43f5e', borderRadius: 4 }
    ]
  };

  if (!isMounted) return null;

  return (
    <div className="antialiased flex h-screen overflow-hidden bg-[#0B1120] text-[#f8fafc]"
         style={{ 
           backgroundImage: "linear-gradient(rgba(11, 17, 32, 0.9), rgba(11, 17, 32, 0.95)), url('/admin_bg_v1.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#0F172A]/80 backdrop-blur-2xl border-r border-slate-800 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <i className="fa-solid fa-microchip text-blue-500 text-xl mr-3"></i>
            <h1 className="text-lg font-bold text-white tracking-wide">HDAP Admin</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {[
              { id: 'madel5c', icon: 'fa-vial-circle-check', label: 'MADEL5C Analysis' },
              { id: 'instruments', icon: 'fa-file-code', label: 'Instrument Manager' },
              { id: 'usability', icon: 'fa-face-smile', label: 'User Experience (SUS)' },
              { id: 'settings', icon: 'fa-cog', label: 'System Settings' }
            ].map((item) => (
              <button key={item.id} onClick={() => setCurrentTab(item.id)} 
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all text-sm ${
                        currentTab === item.id 
                        ? 'bg-blue-600/20 text-blue-400 font-bold border-l-2 border-blue-500' 
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}>
                <i className={`fa-solid ${item.icon} w-5`}></i>
                <span className="ml-2">{item.label}</span>
              </button>
            ))}
            <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all text-sm mt-10">
                <i className="fa-solid fa-right-from-bracket w-5"></i>
                <span className="ml-2">Logout Admin</span>
            </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-8 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 z-10">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight italic">
                {currentTab === 'madel5c' ? 'Psychometric Engine (MADEL5C)' : 
                 currentTab === 'instruments' ? 'Instrument Manager' : 
                 currentTab === 'usability' ? 'User Experience (SUS)' : 'System Configuration'}
            </h2>
            <div className="flex items-center gap-4">
                <button onClick={downloadCSV} className="px-4 py-1.5 bg-emerald-600/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30 flex items-center gap-2 hover:bg-emerald-600/30 transition-all">
                   <i className="fa-solid fa-download"></i> DOWNLOAD RAW DATA (CSV)
                </button>
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                   <span className="text-[10px] font-bold text-slate-300 uppercase">Engine Live</span>
                </div>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 relative">
            <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">
                
                {currentTab === 'madel5c' && (
                  <>
                     {/* STATS CARDS */}
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                          { label: 'RESPONDENTS', value: stats.participants, icon: 'fa-users', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                          { label: 'AVG MADEL5C', value: stats.madel5cScore, icon: 'fa-gauge-high', color: 'text-green-400', bg: 'bg-green-500/10' },
                          { label: 'AVG SUS SCORE', value: stats.surveyScore, icon: 'fa-face-smile', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                          { label: 'DIF FLAGS', value: stats.difFlags, icon: 'fa-triangle-exclamation', color: 'text-orange-400', bg: 'bg-orange-500/10' }
                        ].map((stat, i) => (
                          <div key={i} className="bg-[#1E293B]/80 rounded-2xl p-5 border border-slate-700/50 flex items-center gap-4 shadow-lg">
                             <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}><i className={`fa-solid ${stat.icon}`}></i></div>
                             <div><p className="text-[10px] text-slate-400 font-bold tracking-wider">{stat.label}</p><p className="text-2xl font-black text-white">{stat.value}</p></div>
                          </div>
                        ))}
                     </div>

                     {/* TOP CHARTS ROW */}
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-[#1E293B]/80 rounded-2xl p-6 border border-slate-700/50 shadow-lg">
                           <div className="flex justify-between items-center mb-6">
                              <h3 className="text-sm font-bold text-white flex items-center gap-2"><i className="fa-solid fa-chart-network text-blue-400"></i> Structural Validity (CFA)</h3>
                              <span className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-full font-bold uppercase">Dynamic Agregation</span>
                           </div>
                           <div className="flex gap-6 mb-6">
                              <div className="border-l-2 border-green-500 pl-3"><p className="text-[10px] text-slate-400">RMSEA</p><p className="text-lg font-bold text-white">0.045</p></div>
                              <div className="border-l-2 border-green-500 pl-3"><p className="text-[10px] text-slate-400">CFI</p><p className="text-lg font-bold text-white">0.962</p></div>
                              <div className="border-l-2 border-blue-500 pl-3"><p className="text-[10px] text-slate-400">TLI</p><p className="text-lg font-bold text-white">0.941</p></div>
                           </div>
                           <div className="h-64 flex justify-center">
                              <Radar data={cfaRadarData} options={{ responsive: true, maintainAspectRatio: false, scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, angleLines: { color: 'rgba(255,255,255,0.05)' }, pointLabels: { color: '#94a3b8' }, ticks: { display: false } } }, plugins: { legend: { display: false } } }} />
                           </div>
                        </div>
                        <div className="bg-[#1E293B]/80 rounded-2xl p-6 border border-slate-700/50 shadow-lg flex flex-col">
                           <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2"><i className="fa-solid fa-align-left text-purple-400"></i> Wright Map (PCM)</h3>
                           <div className="flex-1 h-64">
                              <Bar data={wrightMapData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#94a3b8' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } } } }} />
                           </div>
                           <p className="text-[9px] text-slate-500 mt-4 text-center italic">Calculated Logit Scale (Person vs Item)</p>
                        </div>
                     </div>
                  </>
                )}

                {currentTab === 'instruments' && (
                  <div className="space-y-6">
                     <div className="bg-[#1E293B]/80 rounded-2xl p-8 border border-slate-700/50 shadow-lg">
                        <div className="flex justify-between items-center mb-8 border-b border-slate-700/50 pb-4">
                           <div>
                              <h3 className="text-xl font-bold text-white">MADEL5C SJT Item Manager</h3>
                              <p className="text-slate-400 text-sm italic">Edit skenario dan skor pakar langsung dari panel ini.</p>
                           </div>
                           <span className="px-4 py-1.5 bg-blue-500/20 text-blue-400 text-[10px] font-black rounded-full border border-blue-500/30 uppercase tracking-[0.2em]">30 Items Active</span>
                        </div>

                        <div className="space-y-4">
                           {questions.map((q, idx) => (
                             <div key={idx} className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                                {editingIndex === idx ? (
                                  <div className="space-y-4">
                                     <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Skenario Soal {idx+1}</label>
                                        <textarea value={q.scenario} onChange={(e) => {
                                          const newQ = [...questions];
                                          newQ[idx].scenario = e.target.value;
                                          setQuestions(newQ);
                                        }} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-white focus:border-blue-500 outline-none" rows={3} />
                                     </div>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.options.map((opt: any, optIdx: number) => (
                                          <div key={optIdx}>
                                             <label className="text-[10px] font-black text-slate-500 uppercase mb-1 block">Opsi {String.fromCharCode(65+optIdx)}</label>
                                             <input type="text" value={opt.text} onChange={(e) => {
                                               const newQ = [...questions];
                                               newQ[idx].options[optIdx].text = e.target.value;
                                               setQuestions(newQ);
                                             }} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white" />
                                          </div>
                                        ))}
                                     </div>
                                     <div className="flex justify-end gap-3 pt-4">
                                        <button onClick={() => setEditingIndex(null)} className="px-6 py-2 rounded-xl bg-slate-700 text-white text-xs font-bold hover:bg-slate-600 transition-all">BATAL</button>
                                        <button onClick={() => handleSaveQuestion(idx)} className="px-6 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">SIMPAN PERUBAHAN</button>
                                     </div>
                                  </div>
                                ) : (
                                  <div className="flex justify-between items-start gap-6">
                                     <div className="flex-1">
                                        <p className="text-xs font-bold text-blue-500 mb-2 uppercase tracking-widest">Butir {idx+1} • {q.dim}</p>
                                        <p className="text-white text-sm font-medium leading-relaxed">{q.scenario}</p>
                                     </div>
                                     <button onClick={() => setEditingIndex(idx)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-all">
                                        <i className="fa-solid fa-pen-to-square"></i>
                                     </button>
                                  </div>
                                )}
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                )}

              </div>
        </div>
      </main>
    </div>
  );
}

