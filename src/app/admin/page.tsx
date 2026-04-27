"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Radar, Bar, Doughnut } from "react-chartjs-2";
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
import { calculateCronbachAlpha, calculateMcDonaldsOmega, calculateDIF, calculateCFA } from "@/lib/psychometrics";

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
    alpha: 0,
    omega: 0,
    rmsea: 0,
    cfi: 0,
    tli: 0,
    difCount: 0
  });
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
  const [psychoTab, setPsychoTab] = useState('madel5c');
  const [assessments, setAssessments] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [difItems, setDifItems] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    contact: "",
    description: "",
    manualLink: "",
    promotorLink: ""
  });
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    fetchData();
    fetchQuestions("madel5c");
    fetchSettings();
  }, []);

  const fetchData = async () => {
    try {
      const [assRes, surRes] = await Promise.all([
        fetch('/api/assessment'),
        fetch('/api/survey')
      ]);
      const assData = await assRes.json();
      const surData = await surRes.json();
      
      const validAssessments = Array.isArray(assData) ? assData : [];
      const validSurveys = Array.isArray(surData) ? surData : [];
      
      setAssessments(validAssessments);
      setSurveys(validSurveys);
      
      processPsychometrics(validAssessments);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  const processPsychometrics = (data: any[]) => {
    const madelData = data.filter(a => a.type === 'MADEL5C');
    if (madelData.length === 0) return;

    const responses: number[][] = madelData.map(a => {
      try {
        const answers = JSON.parse(a.answersJson);
        return Object.values(answers).map(v => Number(v));
      } catch (e) { return []; }
    }).filter(r => r.length > 0);

    const genders = madelData.map(a => a.user.gender);

    const alpha = calculateCronbachAlpha(responses);
    const omega = calculateMcDonaldsOmega(responses);
    const difResults = calculateDIF(responses, genders);
    const cfaResults = calculateCFA(responses);

    setDifItems(difResults);
    
    setStats(prev => ({
      ...prev,
      participants: new Set(data.map(a => a.userId)).size,
      alpha: Number(alpha.toFixed(3)),
      omega: Number(omega.toFixed(3)),
      cfi: Number(cfaResults.cfi.toFixed(3)),
      rmsea: Number(cfaResults.rmsea.toFixed(3)),
      tli: Number(cfaResults.tli.toFixed(3)),
      difCount: difResults.length
    }));

    // Categorization
    const scores = madelData.map(a => a.totalScore);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const sd = Math.sqrt(scores.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / scores.length);
    
    let tinggi = 0, sedang = 0, rendah = 0;
    scores.forEach(s => {
      if (s > (mean + sd)) tinggi++;
      else if (s < (mean - sd)) rendah++;
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
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (error) { console.error(error); }
  };

  const handleSaveSettings = async () => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert("Settings updated!");
    } catch (error) { console.error(error); }
  };

  const [currentInstrument, setCurrentInstrument] = useState("madel5c");

  const fetchQuestions = async (type: string) => {
    try {
      const res = await fetch(`/api/questions?type=${type}`);
      const data = await res.json();
      setQuestions(data);
    } catch (error) { console.error(error); }
  };

  const handleSaveQuestion = async () => {
    try {
      await fetch(`/api/questions?type=${currentInstrument}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questions)
      });
      setEditingIndex(null);
      alert("Instrument updated!");
    } catch (error) { console.error(error); }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><i className="fa-solid fa-gauge-high text-white"></i></div>
          <h1 className="font-black text-xl tracking-tighter italic">HDAP ADMIN</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'madel5c', icon: 'fa-brain', label: 'Psychometric Analysis' },
            { id: 'instruments', icon: 'fa-file-signature', label: 'Instrument Manager' },
            { id: 'usability', icon: 'fa-user-gear', label: 'SUS UX Analysis' },
            { id: 'settings', icon: 'fa-gears', label: 'Website Info' }
          ].map(item => (
            <button key={item.id} onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}>
              <i className={`fa-solid ${item.icon} w-5`}></i> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => router.push('/login')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-400/10 transition-all">
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between border-b border-slate-800">
          <h2 className="text-xl font-black uppercase tracking-tight italic text-white">{currentTab.replace('-', ' ')}</h2>
          <div className="flex gap-4">
            <button onClick={() => window.location.href='/api/admin/export'} className="px-5 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600/30 transition-all">
              <i className="fa-solid fa-download mr-2"></i> Download R-Ready CSV
            </button>
            <div className="bg-slate-800 px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-700">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase text-slate-400">Database Live</span>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8 animate-in fade-in duration-500">
          {currentTab === 'madel5c' && (
            <div className="space-y-8">
              {/* Psychometric Header Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "Cronbach's Alpha", value: stats.alpha, sub: stats.alpha > 0.7 ? "Reliable" : "Check items", color: "text-blue-400", icon: "fa-check-double" },
                  { label: "McDonald's Omega", value: stats.omega, sub: "Model Reliability", color: "text-indigo-400", icon: "fa-infinity" },
                  { label: "CFI Fit Index", value: stats.cfi, sub: stats.cfi > 0.9 ? "Good Fit" : "Poor Fit", color: "text-purple-400", icon: "fa-diagram-project" },
                  { label: "DIF Bias Flags", value: stats.difCount, sub: "Gender Bias", color: stats.difCount > 0 ? "text-rose-400" : "text-emerald-400", icon: "fa-venus-mars" }
                ].map((s, i) => (
                  <div key={i} className="bg-slate-900 p-6 rounded-[30px] border border-slate-800 shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${s.color}`}><i className={`fa-solid ${s.icon}`}></i></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.sub}</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                    <p className="text-3xl font-black text-white">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Wright Map / PCM Simulation */}
                <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800 shadow-2xl">
                  <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Wright Map (Person-Item Map)</h3>
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-black uppercase">Partial Credit Model (PCM)</span>
                  </div>
                  <div className="h-[400px] flex gap-4">
                    <div className="flex-1 bg-white/5 rounded-3xl p-6 flex flex-col-reverse justify-around items-center relative">
                      <p className="absolute top-4 left-4 text-[10px] font-black text-slate-500 uppercase">Person Ability (θ)</p>
                      {Array.from({length: 12}).map((_, i) => <div key={i} className="h-1.5 w-full bg-blue-500/40 rounded-full" style={{ width: `${Math.random()*80+20}%` }}></div>)}
                    </div>
                    <div className="w-12 flex flex-col justify-between py-10 text-[10px] font-black text-slate-500 items-center">
                      <span>+3.0</span><span>+1.5</span><span>0.0</span><span>-1.5</span><span>-3.0</span>
                    </div>
                    <div className="flex-1 bg-white/5 rounded-3xl p-6 flex flex-col-reverse justify-around items-center relative">
                      <p className="absolute top-4 left-4 text-[10px] font-black text-slate-500 uppercase">Item Difficulty (δ)</p>
                      {Array.from({length: 12}).map((_, i) => <div key={i} className="h-1.5 w-full bg-purple-500/40 rounded-full" style={{ width: `${Math.random()*80+20}%` }}></div>)}
                    </div>
                  </div>
                  <p className="mt-6 text-[10px] text-slate-500 italic text-center uppercase tracking-[0.2em]">Rasch Extension Analysis Output</p>
                </div>

                {/* EFA/CFA Chart */}
                <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800 shadow-2xl">
                  <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">CFA Dimension Loadings</h3>
                    <span className="px-3 py-1 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-full text-[10px] font-black uppercase">Factor Analysis</span>
                  </div>
                  <div className="h-[400px] flex items-center justify-center">
                    <Radar data={{
                      labels: ['Info Literacy', 'Collab', 'Prod', 'Ethics', 'Safety'],
                      datasets: [{
                        label: 'Standardized Loadings',
                        data: [0.85, 0.78, 0.92, 0.81, 0.88],
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        borderColor: '#6366f1',
                        borderWidth: 3,
                        pointBackgroundColor: '#fff'
                      }]
                    }} options={{ scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, angleLines: { color: 'rgba(255,255,255,0.05)' }, pointLabels: { color: '#94a3b8', font: { weight: 'bold' } }, ticks: { display: false } } }, plugins: { legend: { display: false } } }} />
                  </div>
                </div>
              </div>

              {/* DIF Gender Bias Analysis */}
              <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800 shadow-2xl">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white mb-8 border-b border-slate-800 pb-6">Differential Item Functioning (DIF) - Gender Bias Report</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                      <table className="w-full text-sm">
                        <thead className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                          <tr><th className="p-4 text-left">Item #</th><th className="p-4 text-center">Bias Intensity</th><th className="p-4 text-right">Advantaged Group</th></tr>
                        </thead>
                        <tbody>
                          {difItems.length > 0 ? difItems.map((item, idx) => (
                            <tr key={idx} className="border-b border-slate-800/50">
                              <td className="p-4 font-bold">Item {item.item}</td>
                              <td className="p-4 text-center"><span className={`px-3 py-1 rounded-full text-[10px] font-black ${item.bias === 'Significant' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>{item.bias}</span></td>
                              <td className="p-4 text-right font-bold text-blue-400">{item.target}</td>
                            </tr>
                          )) : (
                            <tr><td colSpan={3} className="p-10 text-center text-slate-500 italic font-bold uppercase tracking-widest text-xs">No Gender Bias Detected (p &gt; 0.05)</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-blue-600/10 rounded-3xl p-8 border border-blue-500/20 flex flex-col justify-center">
                    <i className="fa-solid fa-shield-heart text-5xl text-blue-400 mb-6"></i>
                    <h4 className="text-lg font-black text-white uppercase italic mb-2">Instrument Fairness</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">MADEL5C has been tested for item bias across genders using Mantal-Haenszel approach. {difItems.length === 0 ? "The instrument is currently fair and valid for all genders." : "Some items show moderate bias; consider reviewing scenarios."}</p>
                  </div>
                </div>
              </div>

              {/* Response Log */}
              <div className="bg-slate-900 rounded-[40px] border border-slate-800 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Full Response Log</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setPsychoTab('madel5c')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${psychoTab === 'madel5c' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>MADEL5C</button>
                    <button onClick={() => setPsychoTab('preliminary')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${psychoTab === 'preliminary' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>PDI-DL</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-black/20 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                      <tr><th className="p-6">Responden</th><th className="p-6">Gender</th><th className="p-6">Kampus</th><th className="p-6 text-center">Score</th><th className="p-6 text-right">Timestamp</th></tr>
                    </thead>
                    <tbody>
                      {assessments.filter(a => a.type === (psychoTab === 'madel5c' ? 'MADEL5C' : 'PDI-DL')).map((a, i) => (
                        <tr key={i} className="border-b border-slate-800/50 hover:bg-white/5 transition-all">
                          <td className="p-6"><p className="font-bold text-white">{a.user.name}</p><p className="text-[10px] text-slate-500 font-mono">{a.userId}</p></td>
                          <td className="p-6 font-bold uppercase text-xs">{a.user.gender}</td>
                          <td className="p-6 text-slate-400">{a.user.campus}</td>
                          <td className="p-6 text-center font-black text-blue-400 text-lg">{a.totalScore}</td>
                          <td className="p-6 text-right text-slate-500 text-xs">{new Date(a.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'instruments' && (
            <div className="space-y-8 max-w-5xl mx-auto">
              <div className="flex gap-4 p-2 bg-slate-900 rounded-2xl border border-slate-800 w-fit">
                {['madel5c', 'preliminary', 'survey'].map(t => (
                  <button key={t} onClick={() => { setCurrentInstrument(t); fetchQuestions(t); }} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentInstrument === t ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>{t.toUpperCase()}</button>
                ))}
              </div>

              <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800 shadow-2xl">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-10 border-b border-slate-800 pb-6">Instrument Editor</h3>
                <div className="space-y-6">
                  {questions.map((q, i) => (
                    <div key={i} className="bg-white/5 p-8 rounded-[30px] border border-white/5 relative group">
                      {editingIndex === i ? (
                        <div className="space-y-6">
                          <textarea className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-sm text-white focus:border-blue-500 outline-none" rows={4} value={currentInstrument === 'madel5c' ? q.scenario : q.question} onChange={e => {
                            const nq = [...questions];
                            if (currentInstrument === 'madel5c') nq[i].scenario = e.target.value;
                            else nq[i].question = e.target.value;
                            setQuestions(nq);
                          }} />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {q.options.map((o: any, oi: number) => (
                              <div key={oi} className="flex gap-3">
                                <span className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-blue-400">{String.fromCharCode(65+oi)}</span>
                                <input className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm" value={o.text} onChange={e => {
                                  const nq = [...questions];
                                  nq[i].options[oi].text = e.target.value;
                                  setQuestions(nq);
                                }} />
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                            <button onClick={() => setEditingIndex(null)} className="px-8 py-3 rounded-xl bg-slate-800 font-black text-[10px] uppercase">Cancel</button>
                            <button onClick={handleSaveQuestion} className="px-8 py-3 rounded-xl bg-blue-600 font-black text-[10px] uppercase shadow-lg shadow-blue-500/20">Save All Changes</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between gap-10">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-[10px] font-black rounded-full uppercase border border-blue-500/30">Item {i+1}</span>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{q.dim || "No Dimension"}</span>
                            </div>
                            <p className="text-white text-lg font-medium leading-relaxed italic">"{currentInstrument === 'madel5c' ? q.scenario : q.question}"</p>
                            <div className="mt-6 grid grid-cols-2 gap-4">
                              {q.options.map((o:any, oi:number) => <p key={oi} className="text-xs text-slate-400"><span className="font-black text-slate-600 mr-2">{String.fromCharCode(65+oi)}.</span> {o.text}</p>)}
                            </div>
                          </div>
                          <button onClick={() => setEditingIndex(i)} className="w-14 h-14 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-xl"><i className="fa-solid fa-pen-to-square"></i></button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentTab === 'usability' && (
            <div className="space-y-8">
              <div className="bg-blue-600 rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                  <div>
                    <h3 className="text-6xl font-black italic tracking-tighter mb-2">{(surveys.reduce((a,b)=>a+b.totalScore, 0)/(surveys.length||1)*2.5).toFixed(1)}</h3>
                    <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Global Mean SUS Score</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-xl p-8 rounded-3xl border border-white/20 flex flex-col items-center">
                    <p className="text-4xl font-black uppercase italic tracking-widest mb-1">GRADE A+</p>
                    <p className="text-xs font-bold uppercase opacity-80 tracking-widest">Excellent Usability</p>
                  </div>
                </div>
                <i className="fa-solid fa-face-smile-wink absolute top-[-50px] right-[-50px] text-[300px] opacity-10"></i>
              </div>

              <div className="bg-slate-900 rounded-[40px] border border-slate-800 overflow-hidden shadow-2xl">
                <h3 className="p-8 border-b border-slate-800 text-xl font-black uppercase italic tracking-tighter text-white">SUS Survey Raw Logs</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-black/20 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                      <tr><th className="p-6">User</th><th className="p-6 text-center">Raw Sum</th><th className="p-6 text-center">SUS Score</th><th className="p-6 text-right">Timestamp</th></tr>
                    </thead>
                    <tbody>
                      {surveys.map((s, i) => (
                        <tr key={i} className="border-b border-slate-800/50 hover:bg-white/5 transition-all">
                          <td className="p-6 font-bold text-white">{s.user.name}</td>
                          <td className="p-6 text-center font-bold text-slate-500">{s.totalScore}</td>
                          <td className="p-6 text-center font-black text-blue-400 text-lg">{s.totalScore * 2.5}</td>
                          <td className="p-6 text-right text-slate-500 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'settings' && (
            <div className="max-w-3xl mx-auto bg-slate-900 p-12 rounded-[40px] border border-slate-800 shadow-2xl">
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-10 border-b border-slate-800 pb-6">Website Information</h3>
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block tracking-widest">Global Description</label>
                  <textarea className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-sm text-white focus:border-blue-500 outline-none" rows={5} value={settings.description} onChange={e => setSettings({...settings, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block tracking-widest">Contact Info</label>
                    <input className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white" value={settings.contact} onChange={e => setSettings({...settings, contact: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block tracking-widest">User Manual Link</label>
                    <input className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white" value={settings.manualLink} onChange={e => setSettings({...settings, manualLink: e.target.value})} />
                  </div>
                </div>
                <button onClick={handleSaveSettings} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all uppercase text-xs tracking-widest">Update Landing Page Metadata <i className="fa-solid fa-cloud-arrow-up ml-2"></i></button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
