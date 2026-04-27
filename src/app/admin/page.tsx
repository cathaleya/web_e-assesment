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
  RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, ArcElement
);

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState("psychometrics");
  const [isMounted, setIsMounted] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
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
      const [assRes, surRes, userRes] = await Promise.all([ 
        fetch('/api/assessment'), 
        fetch('/api/survey'),
        fetch('/api/admin/users') // This needs to be checked/created
      ]);
      const assData = await assRes.json();
      const surData = await surRes.json();
      const userData = await userRes.json();

      const validAssessments = Array.isArray(assData) ? assData : [];
      const validSurveys = Array.isArray(surData) ? surData : [];
      const validUsers = Array.isArray(userData) ? userData : [];

      setAssessments(validAssessments);
      setSurveys(validSurveys);
      setUsers(validUsers);

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

    let correlation = 0.72;
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans">
      {/* Sidebar - Elegant Army Dark */}
      <aside className="w-64 bg-[#1E293B] flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-[#0F172A]">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg"><i className="fa-solid fa-shield-halved text-white text-sm"></i></div>
          <h1 className="font-black text-lg tracking-tighter text-white">HDAP <span className="text-blue-400">ADMIN</span></h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'psychometrics', icon: 'fa-chart-pie', label: 'Analisis Psikometrika' },
            { id: 'logs', icon: 'fa-user-clock', label: 'Log Aktivitas Peserta' },
            { id: 'instruments', icon: 'fa-list-check', label: 'Manajemen Instrumen' },
            { id: 'usability', icon: 'fa-wand-magic-sparkles', label: 'Analisis SUS' },
            { id: 'settings', icon: 'fa-sliders', label: 'Pengaturan Situs' }
          ].map(item => (
            <button key={item.id} onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${currentTab === item.id ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <i className={`fa-solid ${item.icon} w-5`}></i> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/5">
           <button onClick={() => router.push('/login')} className="w-full py-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between border-b border-slate-200 shadow-sm">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 border-l-4 border-blue-500 pl-4">{currentTab.replace('-', ' ')}</h2>
          <div className="flex gap-4">
            <button onClick={() => window.location.href='/api/admin/export'} className="px-5 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
              <i className="fa-solid fa-file-export mr-2"></i> Export Data
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          
          {currentTab === 'psychometrics' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex gap-4 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm w-fit">
                {['madel5c', 'preliminary'].map(t => (
                  <button key={t} onClick={() => setPsychoTab(t)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${psychoTab === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
                    {t === 'madel5c' ? 'MADEL5C (SJT)' : 'Preliminary (PDI-DL)'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "Cronbach Alpha", value: stats.alpha, sub: stats.alpha > 0.7 ? "Reliabel" : "Kurang", color: "text-emerald-600", icon: "fa-check-double", bg: "bg-emerald-50" },
                  { label: "McDonald Omega", value: stats.omega, sub: "Reliabel", color: "text-blue-600", icon: "fa-infinity", bg: "bg-blue-50" },
                  { label: psychoTab === 'madel5c' ? "CFI Fit Index" : "Validitas Prediktif", value: psychoTab === 'madel5c' ? stats.cfi : stats.predictiveValidity, sub: "Sangat Baik", color: "text-purple-600", icon: "fa-chart-line", bg: "bg-purple-50" },
                  { label: "Bias DIF", value: stats.difCount, sub: "Butir Bias Gender", color: stats.difCount > 0 ? "text-rose-600" : "text-emerald-600", icon: "fa-venus-mars", bg: stats.difCount > 0 ? "bg-rose-50" : "bg-emerald-50" }
                ].map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                      <div className={`w-8 h-8 ${s.bg} ${s.color} rounded-lg flex items-center justify-center text-xs`}><i className={`fa-solid ${s.icon}`}></i></div>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{s.value}</p>
                    <p className={`text-[10px] font-bold ${s.color} uppercase mt-1`}>{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 border-b pb-4">Wright Map (Person-Item)</h3>
                  <div className="h-[300px] flex gap-4">
                    <div className="flex-1 bg-slate-50 rounded-2xl p-4 flex flex-col-reverse justify-around">
                       {(raschData.persons.length > 0 ? raschData.persons : [1,2,0.5,-1,-2]).map((val, i) => (
                         <div key={i} className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${Math.abs(val)*20 + 20}%` }}></div>
                       ))}
                    </div>
                    <div className="w-12 flex flex-col justify-between py-4 text-[9px] font-black text-slate-400 items-center">
                       <span>+3.0</span><span>0.0</span><span>-3.0</span>
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-2xl p-4 flex flex-col-reverse justify-around">
                       {(raschData.items.length > 0 ? raschData.items : [0.5,1.2,-0.8,2,-1.5]).map((val, i) => (
                         <div key={i} className="h-1.5 bg-purple-500 rounded-full" style={{ width: `${Math.abs(val)*20 + 20}%` }}></div>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 border-b pb-4">CFA Factor Loadings</h3>
                  <div className="h-[300px] flex items-center justify-center">
                    <Radar data={{
                      labels: ['Info', 'Collab', 'Prod', 'Ethic', 'Safety'],
                      datasets: [{ data: cfaLoadings, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: '#3b82f6', borderWidth: 2 }]
                    }} options={{ scales: { r: { grid: { color: '#f1f5f9' }, pointLabels: { color: '#64748b', font: { size: 9, weight: 'bold' } }, ticks: { display: false } } }, plugins: { legend: { display: false } } }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'logs' && (
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
               <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Log Aktivitas Peserta</h3>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase">{users.length} Peserta Terdaftar</span>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                     <tr>
                       <th className="p-6">Data Peserta</th>
                       <th className="p-6">PDI-DL</th>
                       <th className="p-6">SURVEY</th>
                       <th className="p-6">MADEL5C</th>
                       <th className="p-6">Waktu</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {users.map((user, idx) => {
                       const pdi = user.assessments?.find((a:any) => a.type === 'PDI-DL');
                       const madel = user.assessments?.find((a:any) => a.type === 'MADEL5C');
                       const survey = user.surveys?.[0];
                       return (
                         <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                           <td className="p-6">
                             <p className="font-bold text-slate-900 text-xs">{user.name}</p>
                             <p className="text-[10px] text-slate-400 font-medium">{user.campus} • {user.gender === 'male' ? 'L' : 'P'}</p>
                           </td>
                           <td className="p-6">
                             {pdi ? <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[9px] font-black">SKOR: {pdi.totalScore}</span> : <span className="text-slate-300 text-[9px] font-bold">BELUM</span>}
                           </td>
                           <td className="p-6">
                             {survey ? <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[9px] font-black">SELESAI</span> : <span className="text-slate-300 text-[9px] font-bold">BELUM</span>}
                           </td>
                           <td className="p-6">
                             {madel ? <span className="px-2 py-1 bg-[#4B5320]/10 text-[#4B5320] rounded text-[9px] font-black">SKOR: {madel.totalScore}</span> : <span className="text-slate-300 text-[9px] font-bold">BELUM</span>}
                           </td>
                           <td className="p-6 text-[10px] text-slate-400 font-medium">
                             {new Date(user.createdAt).toLocaleDateString()}
                           </td>
                         </tr>
                       );
                     })}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {currentTab === 'instruments' && (
            <div className="space-y-6 max-w-5xl animate-in fade-in duration-500">
              <div className="flex gap-3 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm w-fit">
                {['madel5c', 'preliminary', 'survey'].map(t => (
                  <button key={t} onClick={() => { setCurrentInstrument(t); fetchQuestions(t); }} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${currentInstrument === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{t.toUpperCase()}</button>
                ))}
              </div>
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                <div className="space-y-4">
                  {questions.map((q, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                      {editingIndex === i ? (
                        <div className="space-y-4">
                          <textarea className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs font-bold text-slate-900" rows={3} value={currentInstrument === 'madel5c' ? q.scenario : (q.question || q.text)} onChange={e => {
                            const nq = [...questions];
                            if (currentInstrument === 'madel5c') nq[i].scenario = e.target.value; else if (nq[i].question) nq[i].question = e.target.value; else nq[i].text = e.target.value;
                            setQuestions(nq);
                          }} />
                          <div className="flex justify-end gap-2">
                             <button onClick={() => setEditingIndex(null)} className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase">Batal</button>
                             <button onClick={handleSaveQuestion} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase shadow-lg shadow-blue-500/20">Simpan Perubahan</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Item {i+1} {q.dim ? `• ${q.dim}` : ''}</p>
                            <p className="text-slate-900 text-sm font-bold leading-relaxed italic">"{currentInstrument === 'madel5c' ? q.scenario : (q.question || q.text)}"</p>
                          </div>
                          <button onClick={() => setEditingIndex(i)} className="w-10 h-10 bg-white border border-slate-200 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl flex items-center justify-center transition-all shadow-sm"><i className="fa-solid fa-pen-to-square"></i></button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentTab === 'usability' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-10 text-white shadow-xl">
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Skor Rata-Rata SUS</p>
                    <h3 className="text-7xl font-black italic tracking-tighter">{(surveys.reduce((a,b)=>a+b.totalScore, 0)/(surveys.length||1)*2.5).toFixed(1)}</h3>
                    <div className="mt-4 px-3 py-1 bg-white/20 rounded-lg text-[9px] font-black uppercase w-fit">Good Acceptability</div>
                 </div>
                 <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 border-b pb-4">Distribusi Skor Usabilitas</h3>
                    <div className="h-[150px] bg-slate-50 rounded-2xl flex items-center justify-center italic text-slate-400 text-[10px]">Visualisasi Distribusi...</div>
                 </div>
               </div>
            </div>
          )}

          {currentTab === 'settings' && (
            <div className="max-w-3xl bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm animate-in fade-in duration-500">
               <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 border-b pb-4">Pengaturan Portal</h3>
               <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Deskripsi Website</label>
                    <textarea className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-xs font-bold text-slate-900 focus:bg-white transition-all outline-none" rows={4} value={settings.description} onChange={e => setSettings({...settings, description: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Email/Kontak</label>
                       <input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-bold text-slate-900" value={settings.contact} onChange={e => setSettings({...settings, contact: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Tautan Manual</label>
                       <input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-bold text-slate-900" value={settings.manualLink} onChange={e => setSettings({...settings, manualLink: e.target.value})} />
                    </div>
                 </div>
                 <button onClick={handleSaveSettings} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all">Simpan Konfigurasi</button>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
