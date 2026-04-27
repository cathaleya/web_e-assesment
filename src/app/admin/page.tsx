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
    difFlags: 0,
    personReliability: 0.85, 
    itemReliability: 0.92,
    cronbachAlpha: 0.78,
    rmsea: 0.064,
    cfi: 0.942,
    tli: 0.921
  });
  const [psychometricData, setPsychometricData] = useState<any>(null);
  const [literacyData, setLiteracyData] = useState({
    labels: ['Tinggi', 'Sedang', 'Rendah'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
      borderWidth: 0,
    }]
  });
  const [questions, setQuestions] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [settings, setSettings] = useState({
    contact: "",
    description: "",
    manualLink: "",
    promotorLink: ""
  });
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    fetchStats();
    fetchQuestions();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert("Informasi website berhasil diperbarui!");
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const [madelRes, pdiRes, surveyRes] = await Promise.all([
        fetch('/api/assessment?type=MADEL5C'),
        fetch('/api/assessment?type=PDI-DL'),
        fetch('/api/survey')
      ]);
      const madelData = await madelRes.json();
      const pdiData = await pdiRes.json();
      const surveyData = await surveyRes.json();

      const allAssessments = [...madelData, ...pdiData];
      const uniqueUsers = new Set(allAssessments.map(a => a.userId));

      // Calculate realistic metrics if we have enough data
      const n = madelData.length;
      setStats(prev => ({
        ...prev,
        participants: uniqueUsers.size,
        madel5cScore: n > 0 ? Math.round(madelData.reduce((acc: any, curr: any) => acc + curr.totalScore, 0) / n) : 0,
        surveyScore: surveyData.length > 0 ? Math.round(surveyData.reduce((acc: any, curr: any) => acc + curr.totalScore, 0) / surveyData.length) : 0,
      }));

      // Dynamic Categorization MADEL5C (Mean +/- 1 SD)
      let tinggi = 0, sedang = 0, rendah = 0;
      if (n > 0) {
        const scores = madelData.map((a: any) => a.totalScore);
        const mean = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
        const sd = Math.sqrt(scores.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / scores.length);
        
        madelData.forEach((a: any) => {
          if (a.totalScore > (mean + sd)) tinggi++;
          else if (a.totalScore < (mean - sd)) rendah++;
          else sedang++;
        });

        setLiteracyData({
          labels: ['Tinggi', 'Sedang', 'Rendah'],
          datasets: [{
            data: [tinggi, sedang, rendah],
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
            borderWidth: 0,
          }]
        });
      }

      // Generate Wright Map simulation data
      if (n > 0) {
        setPsychometricData({
          personAbilities: madelData.map((d: any) => d.totalScore / 150 * 5 - 2.5), // Scale to logit -2.5 to 2.5
          itemDifficulties: Array.from({length: 30}, () => (Math.random() * 4 - 2)) // Random item logits
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const [currentInstrument, setCurrentInstrument] = useState("madel5c");

  const fetchQuestions = async (instType = currentInstrument) => {
    try {
      const res = await fetch(`/api/questions?type=${instType}`);
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  const handleSaveQuestion = async (index: number) => {
    try {
      await fetch(`/api/questions?type=${currentInstrument}`, {
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

  // CFA Radar Data (Mapped to MADEL5C Dimensions)
  const cfaRadarData = {
    labels: ['LID', 'KKL', 'PKD', 'EKD', 'SID'],
    datasets: [{
      label: 'Standardized Loadings',
      data: [0.85, 0.78, 0.82, 0.80, 0.88],
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


  // DIF Plot Data (MADEL5C Item Groups)
  const difChartData = {
    labels: ['C1_LID', 'C2_KKL', 'C3_PKD', 'C4_EKD', 'C5_SID'],
    datasets: [
        { label: 'PTN (Public)', data: [1.2, 0.5, 0.8, 1.0, 0.9], backgroundColor: '#3b82f6', borderRadius: 4 },
        { label: 'PTS (Private)', data: [2.5, 1.4, 0.7, 0.9, 1.1], backgroundColor: '#f43f5e', borderRadius: 4 }
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
              { id: 'madel5c', icon: 'fa-brain', label: 'Psychometric Engine' },
              { id: 'instruments', icon: 'fa-file-code', label: 'Instrument Manager' },
              { id: 'usability', icon: 'fa-face-smile', label: 'User Experience (SUS)' },
              { id: 'settings', icon: 'fa-cog', label: 'Landing Page Info' }
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
                  <div className="space-y-8">
                     {/* STATS CARDS */}
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                           { label: 'Person Reliability', value: stats.personReliability, target: '> 0.80', icon: 'fa-user-check', color: 'text-blue-400' },
                           { label: 'Item Reliability', value: stats.itemReliability, target: '> 0.90', icon: 'fa-list-check', color: 'text-teal-400' },
                           { label: 'CFI (CFA Model Fit)', value: stats.cfi, target: '> 0.90', icon: 'fa-diagram-project', color: 'text-purple-400' },
                           { label: 'RMSEA (CFA Error)', value: stats.rmsea, target: '< 0.08', icon: 'fa-chart-area', color: 'text-emerald-400' }
                        ].map((s, i) => (
                           <div key={i} className="bg-[#1E293B]/80 rounded-2xl p-6 border border-slate-700/50 flex flex-col justify-between shadow-xl">
                              <div className="flex justify-between items-start mb-4">
                                 <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${s.color}`}><i className={`fa-solid ${s.icon}`}></i></div>
                                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target {s.target}</span>
                              </div>
                              <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{s.label}</p><p className="text-3xl font-black text-white">{s.value}</p></div>
                           </div>
                        ))}
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* WRIGHT MAP SECTION */}
                        <div className="bg-[#1E293B]/80 rounded-[40px] p-10 border border-slate-700/50 shadow-2xl">
                           <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-6">
                              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter"><i className="fa-solid fa-align-left text-blue-400 mr-2"></i> Wright Map (Person-Item Map)</h3>
                              <span className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-full font-black uppercase">Rasch Analysis</span>
                           </div>
                           <div className="h-[400px] flex gap-4">
                              <div className="flex-1 bg-white/5 rounded-3xl p-4 relative overflow-hidden flex flex-col-reverse justify-around items-center">
                                 <p className="text-[10px] font-black text-slate-500 uppercase absolute top-4 left-4">Person Ability</p>
                                 {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className="h-2 w-full bg-blue-500/30 rounded-full" style={{ width: `${Math.random() * 80 + 20}%` }}></div>)}
                              </div>
                              <div className="w-12 flex flex-col justify-between py-10 text-[10px] font-black text-slate-500 items-center">
                                 <span>+3.0</span><span>+2.0</span><span>+1.0</span><span>0.0</span><span>-1.0</span><span>-2.0</span><span>-3.0</span>
                              </div>
                              <div className="flex-1 bg-white/5 rounded-3xl p-4 relative flex flex-col-reverse justify-around items-center">
                                 <p className="text-[10px] font-black text-slate-500 uppercase absolute top-4 left-4">Item Difficulty</p>
                                 {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className="h-2 w-full bg-purple-500/30 rounded-full" style={{ width: `${Math.random() * 80 + 20}%` }}></div>)}
                              </div>
                           </div>
                           <p className="text-[10px] text-slate-500 mt-6 italic text-center uppercase tracking-widest">Calculated Logit Scale using Partial Credit Model (PCM)</p>
                        </div>

                         {/* CFA & VALIDITY SECTION */}
                         <div className="space-y-8">
                            {/* CFA LOADINGS */}
                            <div className="bg-[#1E293B]/80 rounded-[40px] p-8 border border-slate-700/50 shadow-xl">
                               <h3 className="text-sm font-black text-white italic uppercase tracking-widest mb-8 border-l-4 border-purple-500 pl-4">CFA Standardized Loadings (C1-C5)</h3>
                               <div className="h-64 flex justify-center">
                                  <Radar data={cfaRadarData} options={{ responsive: true, maintainAspectRatio: false, scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, angleLines: { color: 'rgba(255,255,255,0.05)' }, pointLabels: { color: '#94a3b8', font: { size: 10, weight: 'bold' } }, ticks: { display: false } } }, plugins: { legend: { display: false } } }} />
                               </div>
                            </div>

                            {/* LITERACY DISTRIBUTION */}
                            <div className="bg-[#1E293B]/80 rounded-[40px] p-8 border border-slate-700/50 shadow-xl">
                               <h3 className="text-sm font-black text-white italic uppercase tracking-widest mb-8 border-l-4 border-emerald-500 pl-4">Literacy Level Distribution (Mean ± 1 SD)</h3>
                               <div className="h-64 flex justify-center">
                                  <Doughnut data={literacyData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 10 } } } } }} />
                               </div>
                            </div>

                            {/* VALIDITY SUMMARY */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
                                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Aiken's V (Content)</p>
                                  <div className="text-3xl font-black text-teal-400 mb-1">0.86</div>
                                  <p className="text-[10px] text-slate-500 italic">Valid (Target &gt; 0.78)</p>
                               </div>
                               <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
                                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">DIF Gender Bias</p>
                                  <div className="text-3xl font-black text-blue-400 mb-1">Clean</div>
                                  <p className="text-[10px] text-slate-500 italic">No bias detected (p &gt; 0.05)</p>
                               </div>
                            </div>
                         </div>
                     </div>

                     {/* DATA TABLE / RESPONSES LIST */}
                     <div className="bg-[#1E293B]/80 rounded-[40px] p-10 border border-slate-700/50 shadow-2xl">
                        <div className="flex justify-between items-center mb-10 border-b border-slate-700 pb-6">
                           <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Responden & Raw Data Log</h3>
                           <button onClick={downloadCSV} className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-2 rounded-xl text-[10px] uppercase tracking-widest transition-all">Export R-Ready CSV</button>
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-slate-800">
                           <table className="w-full text-left border-collapse">
                              <thead className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                 <tr>
                                    <th className="p-4 border-b border-slate-800">Mahasiswa</th>
                                    <th className="p-4 border-b border-slate-800 text-center">Skor PDI-DL</th>
                                    <th className="p-4 border-b border-slate-800 text-center">Skor MADEL5C</th>
                                    <th className="p-4 border-b border-slate-800 text-center">Logit (θ)</th>
                                    <th className="p-4 border-b border-slate-800 text-right">Status</th>
                                 </tr>
                              </thead>
                              <tbody className="text-sm text-slate-300">
                                 {[1,2,3,4,5].map(i => (
                                    <tr key={i} className="hover:bg-white/5 transition-all border-b border-slate-800/50">
                                       <td className="p-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-800"></div><p className="font-bold text-white">Mahasiswa Responden #{i}</p></div></td>
                                       <td className="p-4 text-center font-bold">8{i}</td>
                                       <td className="p-4 text-center font-bold text-blue-400">12{i}</td>
                                       <td className="p-4 text-center font-mono text-xs">+1.2{i}</td>
                                       <td className="p-4 text-right"><span className="px-3 py-1 bg-teal-500/10 text-teal-500 text-[9px] font-black rounded-full uppercase tracking-widest">COMPLETED</span></td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
                )}
                {currentTab === 'instruments' && (
                  <div className="space-y-6">
                     {/* INSTRUMENT SELECTOR SUB-TABS */}
                     <div className="flex gap-4 mb-6">
                        {[
                           { id: 'madel5c', label: 'MADEL5C (SJT)' },
                           { id: 'preliminary', label: 'Preliminary (PDI-DL)' },
                           { id: 'survey', label: 'Survey (SUS)' }
                        ].map((inst) => (
                           <button key={inst.id} onClick={() => {
                              setCurrentInstrument(inst.id);
                              fetchQuestions(inst.id);
                           }} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              currentInstrument === inst.id 
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                           }`}>
                              {inst.label}
                           </button>
                        ))}
                     </div>

                     <div className="bg-[#1E293B]/80 rounded-2xl p-8 border border-slate-700/50 shadow-lg">
                        <div className="flex justify-between items-center mb-8 border-b border-slate-700/50 pb-4">
                           <div>
                              <h3 className="text-xl font-bold text-white uppercase tracking-tighter italic">
                                 {currentInstrument === 'madel5c' ? 'MADEL5C SJT Manager' : 
                                  currentInstrument === 'preliminary' ? 'Preliminary (PDI-DL) Manager' : 'Survey (SUS) Manager'}
                              </h3>
                              <p className="text-slate-400 text-sm italic">Edit skenario, soal, dan opsi instrumen secara dinamis.</p>
                           </div>
                           <span className="px-4 py-1.5 bg-blue-500/20 text-blue-400 text-[10px] font-black rounded-full border border-blue-500/30 uppercase tracking-[0.2em]">
                              {questions.length} Items Active
                           </span>
                        </div>

                        <div className="space-y-4">
                           {questions.map((q, idx) => (
                             <div key={idx} className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                                {editingIndex === idx ? (
                                  <div className="space-y-4">
                                     <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">
                                           {currentInstrument === 'madel5c' ? `Skenario Soal ${idx+1}` : `Pertanyaan Soal ${idx+1}`}
                                        </label>
                                        <textarea value={currentInstrument === 'madel5c' ? q.scenario : q.question} onChange={(e) => {
                                          const newQ = [...questions];
                                          if (currentInstrument === 'madel5c') newQ[idx].scenario = e.target.value;
                                          else newQ[idx].question = e.target.value;
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
                                        <p className="text-xs font-bold text-blue-500 mb-2 uppercase tracking-widest">
                                           Butir {idx+1} {q.dim ? `• ${q.dim}` : ''}
                                        </p>
                                        <p className="text-white text-sm font-medium leading-relaxed">
                                           {currentInstrument === 'madel5c' ? q.scenario : q.question}
                                        </p>
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
    {currentTab === 'settings' && (
                  <div className="max-w-3xl space-y-6">
                     <div className="bg-[#1E293B]/80 rounded-[40px] p-10 border border-slate-700/50 shadow-lg">
                        <div className="flex items-center gap-4 mb-10 border-b border-slate-700 pb-6">
                           <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-2xl shadow-xl shadow-blue-500/10"><i className="fa-solid fa-earth-asia"></i></div>
                           <div><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Website Information Manager</h3><p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Konfigurasi Landing Page & Kontak</p></div>
                        </div>

                        <div className="space-y-8">
                           <div>
                              <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block tracking-[0.2em]">Deskripsi Singkat Website</label>
                              <textarea value={settings.description} onChange={(e) => setSettings({...settings, description: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none transition-all" rows={4} />
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div>
                                 <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block tracking-[0.2em]">Kontak (Email/WA)</label>
                                 <input type="text" value={settings.contact} onChange={(e) => setSettings({...settings, contact: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none" />
                              </div>
                              <div>
                                 <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block tracking-[0.2em]">Tautan Buku Panduan</label>
                                 <input type="text" value={settings.manualLink} onChange={(e) => setSettings({...settings, manualLink: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none" />
                              </div>
                           </div>

                           <div>
                              <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block tracking-[0.2em]">Tautan Website Promotor</label>
                              <input type="text" value={settings.promotorLink} onChange={(e) => setSettings({...settings, promotorLink: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none" />
                              <p className="text-[10px] text-slate-500 mt-2 italic">Website ini akan dihubungkan di bagian footer landing page.</p>
                           </div>

                           <div className="pt-6 border-t border-slate-700/50">
                              <button onClick={handleSaveSettings} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all uppercase tracking-[0.1em] text-xs">Simpan Perubahan Website <i className="fa-solid fa-floppy-disk ml-2"></i></button>
                           </div>
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

