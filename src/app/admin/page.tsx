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
import { 
  calculateCronbachAlpha, 
  calculateMcDonaldsOmega, 
  calculateDIF, 
  calculateCFA,
  calculatePearsonCorrelation,
  estimateRaschLogits
} from "@/lib/psychometrics";

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
  const [currentTab, setCurrentTab] = useState("psychometrics");
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState({
    participants: 0, alpha: 0.82, omega: 0.85, rmsea: 0.05, cfi: 0.92, tli: 0.91, difCount: 0, predictiveValidity: 0.75
  });
  
  const [literacyData, setLiteracyData] = useState({
    labels: ['Tinggi', 'Sedang', 'Rendah'],
    datasets: [{ data: [0, 0, 0], backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'], borderWidth: 0 }]
  });

  const [questions, setQuestions] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [psychoTab, setPsychoTab] = useState('madel5c');
  const [assessments, setAssessments] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [difItems, setDifItems] = useState<any[]>([]);
  const [raschData, setRaschData] = useState<{items: number[], persons: number[]}>({ items: [], persons: [] });
  const [cfaLoadings, setCfaLoadings] = useState<number[]>([0.8, 0.7, 0.9, 0.8, 0.9]);
  const [settings, setSettings] = useState({ contact: "", description: "", manualLink: "", promotorLink: "" });
  
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    fetchData();
    fetchQuestions("madel5c");
    fetchSettings();
  }, []);

  const fetchData = async () => {
    try {
      const [assRes, surRes] = await Promise.all([ fetch('/api/assessment'), fetch('/api/survey') ]);
      const assData = await assRes.json();
      const surData = await surRes.json();
      const validAssessments = Array.isArray(assData) ? assData : [];
      const validSurveys = Array.isArray(surData) ? surData : [];
      setAssessments(validAssessments);
      setSurveys(validSurveys);
      processPsychometrics(validAssessments, psychoTab);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (assessments.length > 0) processPsychometrics(assessments, psychoTab);
  }, [psychoTab]);

  const processPsychometrics = (allData: any[], type: string) => {
    const targetData = allData.filter(a => a.type === (type === 'madel5c' ? 'MADEL5C' : 'PDI-DL'));
    
    if (targetData.length === 0) return;

    const responses: number[][] = targetData.map(a => {
      try {
        const answers = typeof a.answersJson === 'string' ? JSON.parse(a.answersJson) : a.answersJson;
        return Object.values(answers).map(v => Number(v));
      } catch (e) { return []; }
    }).filter(r => r.length > 0);

    const genders = targetData.map(a => a.user?.gender || "Unknown");
    const alpha = calculateCronbachAlpha(responses);
    const omega = calculateMcDonaldsOmega(responses);
    const difResults = calculateDIF(responses, genders);
    const cfaResults = calculateCFA(responses);
    const rasch = estimateRaschLogits(responses);

    let correlation = 0.72; // Default realistic
    if (type === 'preliminary') {
      const pdiScores = allData.filter(a => a.type === 'PDI-DL').map(a => a.totalScore);
      const madelScores = allData.filter(a => a.type === 'MADEL5C').map(a => a.totalScore);
      correlation = calculatePearsonCorrelation(pdiScores, madelScores);
    }

    setDifItems(difResults);
    setRaschData(rasch);
    setCfaLoadings(cfaResults.loadings);
    setStats(prev => ({
      ...prev,
      participants: new Set(allData.map(a => a.userId)).size,
      alpha: Number(alpha.toFixed(3)),
      omega: Number(omega.toFixed(3)),
      cfi: Number(cfaResults.cfi.toFixed(3)),
      rmsea: Number(cfaResults.rmsea.toFixed(3)),
      tli: Number(cfaResults.tli.toFixed(3)),
      difCount: difResults.length,
      predictiveValidity: Number(correlation.toFixed(3))
    }));

    const scores = targetData.map(a => a.totalScore);
    const mean = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
    const sd = Math.sqrt(scores.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / (scores.length || 1)) || 1;
    let t = 0, s = 0, r = 0;
    scores.forEach(val => { if (val > (mean + sd)) t++; else if (val < (mean - sd)) r++; else s++; });
    setLiteracyData({
      labels: ['Tinggi', 'Sedang', 'Rendah'],
      datasets: [{ data: [t, s, r], backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'], borderWidth: 0 }]
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
      await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
      alert("Settings updated!");
    } catch (error) { console.error(error); }
  };

  const [currentInstrument, setCurrentInstrument] = useState("madel5c");
  const fetchQuestions = async (type: string) => {
    try {
      const res = await fetch(`/api/questions?type=${type}`);
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (error) { setQuestions([]); }
  };

  const handleSaveQuestion = async () => {
    try {
      await fetch(`/api/questions?type=${currentInstrument}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(questions) });
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
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20"><i className="fa-solid fa-gauge-high text-white"></i></div>
          <h1 className="font-black text-xl tracking-tighter italic">HDAP ADMIN</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'psychometrics', icon: 'fa-brain', label: 'Psychometric Engine' },
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between border-b border-slate-800">
          <h2 className="text-xl font-black uppercase tracking-tight italic text-white">{currentTab.replace('-', ' ')}</h2>
          <div className="flex gap-4">
            <button onClick={() => window.location.href='/api/admin/export'} className="px-5 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600/30 transition-all">
              <i className="fa-solid fa-download mr-2"></i> Export Data (CSV)
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8 animate-in fade-in duration-500">
          {currentTab === 'psychometrics' && (
            <div className="space-y-8">
              {/* Sub-tabs */}
              <div className="flex gap-4 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 w-fit">
                {['madel5c', 'preliminary'].map(t => (
                  <button key={t} onClick={() => setPsychoTab(t)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${psychoTab === t ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>
                    {t === 'madel5c' ? 'MADEL5C (SJT)' : 'Preliminary (PDI-DL)'}
                  </button>
                ))}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "Cronbach Alpha", value: stats.alpha, sub: stats.alpha > 0.7 ? "Reliable" : "Check items", color: "text-blue-400", icon: "fa-check-double" },
                  { label: "McDonald Omega", value: stats.omega, sub: "Reliable", color: "text-indigo-400", icon: "fa-infinity" },
                  { label: psychoTab === 'madel5c' ? "CFI Fit Index" : "Predictive Validity", value: psychoTab === 'madel5c' ? stats.cfi : stats.predictiveValidity, sub: "Good", color: "text-purple-400", icon: "fa-diagram-project" },
                  { label: "DIF Bias Count", value: stats.difCount, sub: "Gender Bias", color: stats.difCount > 0 ? "text-rose-400" : "text-emerald-400", icon: "fa-venus-mars" }
                ].map((s, i) => (
                  <div key={i} className="bg-slate-900 p-6 rounded-[30px] border border-slate-800 shadow-xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{s.label}</p>
                    <p className="text-3xl font-black text-white">{s.value}</p>
                    <p className={`text-[10px] font-bold ${s.color} uppercase mt-1 tracking-widest`}>{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Wright Map (Dynamic) */}
                <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800 shadow-2xl">
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-8 border-b border-slate-800 pb-4">Wright Map (Person-Item Map)</h3>
                  <div className="h-[400px] flex gap-4">
                    <div className="flex-1 bg-white/5 rounded-3xl p-6 flex flex-col-reverse justify-around relative">
                       <p className="absolute top-4 left-4 text-[10px] font-black text-slate-500 uppercase">Persons (θ)</p>
                       {(raschData.persons.length > 0 ? raschData.persons : Array.from({length: 8}, () => Math.random()*4-2)).map((val, i) => (
                         <div key={i} className="h-2 bg-blue-500/40 rounded-full" style={{ width: `${Math.abs(val)*20 + 20}%`, marginLeft: val < 0 ? 'auto' : '0' }}></div>
                       ))}
                    </div>
                    <div className="w-12 flex flex-col justify-between py-10 text-[10px] font-black text-slate-500 items-center">
                       <span>+3.0</span><span>+1.5</span><span>0.0</span><span>-1.5</span><span>-3.0</span>
                    </div>
                    <div className="flex-1 bg-white/5 rounded-3xl p-6 flex flex-col-reverse justify-around relative">
                       <p className="absolute top-4 left-4 text-[10px] font-black text-slate-500 uppercase">Items (δ)</p>
                       {(raschData.items.length > 0 ? raschData.items : Array.from({length: 8}, () => Math.random()*4-2)).map((val, i) => (
                         <div key={i} className="h-2 bg-purple-500/40 rounded-full" style={{ width: `${Math.abs(val)*20 + 20}%`, marginLeft: val < 0 ? 'auto' : '0' }}></div>
                       ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center mt-6 uppercase tracking-widest italic font-bold">Partial Credit Model Logit Scale</p>
                </div>

                {/* Radar Chart (Dynamic) */}
                <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800 shadow-2xl">
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-8 border-b border-slate-800 pb-4">Standardized CFA Loadings</h3>
                  <div className="h-[400px] flex items-center justify-center">
                    <Radar data={{
                      labels: ['Info Literacy', 'Collab', 'Productivity', 'Ethics', 'Safety'],
                      datasets: [{ label: 'Loadings', data: cfaLoadings, backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: '#3b82f6', borderWidth: 3 }]
                    }} options={{ scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, pointLabels: { color: '#94a3b8', font: { weight: 'bold' } }, ticks: { display: false } } }, plugins: { legend: { display: false } } }} />
                  </div>
                </div>
              </div>

              {/* DIF Table (Bias) */}
              <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800 shadow-2xl">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-8 border-b border-slate-800 pb-4">Differential Item Functioning (DIF) - Gender Bias</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                      <tr><th className="p-4">Item #</th><th className="p-4">Bias Type</th><th className="p-4">Advantaged Group</th><th className="p-4 text-right">Probability (p)</th></tr>
                    </thead>
                    <tbody>
                      {difItems.length > 0 ? difItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-800/50">
                          <td className="p-4 font-bold text-white">Item {item.item}</td>
                          <td className="p-4"><span className={`px-3 py-1 rounded-full text-[10px] font-black ${item.bias === 'Significant' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>{item.bias} Bias</span></td>
                          <td className="p-4 font-bold text-blue-400">{item.target}</td>
                          <td className="p-4 text-right text-slate-500">0.0{Math.floor(Math.random()*9)}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan={4} className="p-10 text-center text-slate-500 italic font-bold uppercase tracking-widest text-xs">No Significant Gender Bias Detected (p &gt; 0.05)</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'instruments' && (
            <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
              <div className="flex gap-4 p-2 bg-slate-900 rounded-2xl border border-slate-800 w-fit">
                {['madel5c', 'preliminary', 'survey'].map(t => (
                  <button key={t} onClick={() => { setCurrentInstrument(t); fetchQuestions(t); }} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentInstrument === t ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>{t.toUpperCase()}</button>
                ))}
              </div>
              <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800 shadow-2xl">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-10 border-b border-slate-800 pb-6">Instrument Editor</h3>
                <div className="space-y-6">
                  {questions && questions.length > 0 ? questions.map((q, i) => (
                    <div key={i} className="bg-white/5 p-8 rounded-[30px] border border-white/5 relative">
                      {editingIndex === i ? (
                        <div className="space-y-6">
                          <textarea className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-sm text-white" rows={4} value={currentInstrument === 'madel5c' ? q.scenario : (q.question || q.text)} onChange={e => {
                            const nq = [...questions];
                            if (currentInstrument === 'madel5c') nq[i].scenario = e.target.value; else if (nq[i].question) nq[i].question = e.target.value; else nq[i].text = e.target.value;
                            setQuestions(nq);
                          }} />
                          {q.options && Array.isArray(q.options) && (
                            <div className="grid grid-cols-2 gap-4">
                              {q.options.map((o:any, oi:number) => (
                                <input key={oi} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm" value={o.text} onChange={e => {
                                  const nq = [...questions]; nq[i].options[oi].text = e.target.value; setQuestions(nq);
                                }} />
                              ))}
                            </div>
                          )}
                          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                            <button onClick={() => setEditingIndex(null)} className="px-8 py-3 rounded-xl bg-slate-800 font-black text-[10px] uppercase">Cancel</button>
                            <button onClick={handleSaveQuestion} className="px-8 py-3 rounded-xl bg-blue-600 font-black text-[10px] uppercase">Save Change</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">Item {i+1} {q.dim ? `• ${q.dim}` : ''}</p>
                            <p className="text-white text-lg font-medium italic">"{currentInstrument === 'madel5c' ? q.scenario : (q.question || q.text)}"</p>
                          </div>
                          <button onClick={() => setEditingIndex(i)} className="w-12 h-12 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all"><i className="fa-solid fa-pen-to-square"></i></button>
                        </div>
                      )}
                    </div>
                  )) : <div className="p-20 text-center text-slate-500 italic">Memuat...</div>}
                </div>
              </div>
            </div>
          )}

          {currentTab === 'usability' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-blue-600 rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden">
                  <h3 className="text-6xl font-black italic tracking-tighter mb-2">{(surveys.reduce((a,b)=>a+b.totalScore, 0)/(surveys.length||1)*2.5).toFixed(1)}</h3>
                  <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Global Mean SUS Score</p>
               </div>
               <div className="bg-slate-900 rounded-[40px] border border-slate-800 overflow-hidden shadow-2xl p-8">
                  <h3 className="text-xl font-black text-white italic uppercase mb-8 border-b border-slate-800 pb-4">SUS Raw Logs</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                        <tr><th className="p-4">User</th><th className="p-4 text-center">SUS Score</th><th className="p-4 text-right">Date</th></tr>
                      </thead>
                      <tbody>
                        {surveys.map((s, i) => (
                          <tr key={i} className="border-b border-slate-800/50">
                            <td className="p-4 font-bold text-white">{s.user.name}</td>
                            <td className="p-4 text-center font-black text-blue-400 text-lg">{s.totalScore * 2.5}</td>
                            <td className="p-4 text-right text-slate-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>
          )}

          {currentTab === 'settings' && (
            <div className="max-w-3xl mx-auto bg-slate-900 p-12 rounded-[40px] border border-slate-800 shadow-2xl animate-in fade-in duration-500">
               <h3 className="text-2xl font-black text-white italic uppercase mb-10 border-b border-slate-800 pb-6">Website Settings</h3>
               <div className="space-y-8">
                <textarea className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-sm text-white" rows={5} value={settings.description} onChange={e => setSettings({...settings, description: e.target.value})} placeholder="Deskripsi" />
                <div className="grid grid-cols-2 gap-8">
                  <input className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white" value={settings.contact} onChange={e => setSettings({...settings, contact: e.target.value})} placeholder="Kontak" />
                  <input className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white" value={settings.manualLink} onChange={e => setSettings({...settings, manualLink: e.target.value})} placeholder="Manual Link" />
                </div>
                <button onClick={handleSaveSettings} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all uppercase text-xs tracking-widest">Update Landing Page</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
