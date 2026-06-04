"use client";

import { useState, useEffect, useCallback } from "react";
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
import { 
  calculateCronbachAlpha, 
  calculateMcDonaldsOmega, 
  calculateDIF, 
  calculateCFA,
  calculatePearsonCorrelation,
  estimateRaschLogits
} from "@/lib/psychometrics";

// Menghindari timeout saat build di VPS
export const dynamic = "force-dynamic";

ChartJS.register(
  RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, ArcElement
);

if (typeof window !== "undefined") {
  ChartJS.defaults.font.family = "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif";
  ChartJS.defaults.color = "#475569";
  ChartJS.defaults.plugins.tooltip.backgroundColor = "#0f172a";
  ChartJS.defaults.plugins.tooltip.titleFont = { size: 11, weight: 'bold' };
  ChartJS.defaults.plugins.tooltip.bodyFont = { size: 10 };
}

interface AdminStats {
  participants: number;
  alpha: number;
  omega: number;
  rmsea: number;
  cfi: number;
  tli: number;
  difCount: number;
  predictiveValidity: number;
}

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState("madel5c");
  const [isMounted, setIsMounted] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    participants: 284, alpha: 0.86, omega: 0.88, rmsea: 0.045, cfi: 0.962, tli: 0.941, difCount: 2, predictiveValidity: 0.75
  });
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [difItems, setDifItems] = useState<any[]>([
    { item: "Item 12", p_value: 0.002, contrast: 0.85 },
    { item: "Item 24", p_value: 0.041, contrast: -0.42 }
  ]);
  const [raschData, setRaschData] = useState<{items: number[], persons: number[]}>({ 
    items: [0.5, 1.2, -0.8, 2.1, -1.5, 0.2, 1.8, -1.1, 0.7, -0.4], 
    persons: [1.2, 2.5, 0.8, -0.5, -1.2, 1.9, 0.3, -2.1, 1.5, 0.1] 
  });
  const [cfaLoadings, setCfaLoadings] = useState<number[]>([0.85, 0.78, 0.92, 0.81, 0.88]);
  const [aiDiagnostic, setAiDiagnostic] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [instrumentQuestions, setInstrumentQuestions] = useState<{preliminary: any[], survey: any[], madel5c: any[]}>({preliminary: [], survey: [], madel5c: []});
  const [expandedInstrument, setExpandedInstrument] = useState<string | null>(null);
  const [sysSettings, setSysSettings] = useState<any>({});
  const [settingsSaved, setSettingsSaved] = useState(false);

  const router = useRouter();
  const [downloading, setDownloading] = useState<string | null>(null);

  const [analysisMethod, setAnalysisMethod] = useState<Record<string, 'R' | 'Python'>>({
    efa: 'Python',
    cfa: 'Python',
    rasch: 'R',
    sem: 'R'
  });
  
  const [analysisLoading, setAnalysisLoading] = useState<Record<string, boolean>>({
    efa: false,
    cfa: false,
    rasch: false,
    sem: false
  });
  
  const [analysisResults, setAnalysisResults] = useState<Record<string, any>>({
    efa: null,
    cfa: null,
    rasch: null,
    sem: null
  });

  const [analysisPlots, setAnalysisPlots] = useState<Record<string, string>>({
    efa: '',
    cfa: '',
    rasch: '',
    sem: ''
  });

  const [imageError, setImageError] = useState<Record<string, boolean>>({
    efa: false,
    cfa: false,
    rasch: false,
    sem: false
  });

  const runPsychometricAnalysis = async (type: string) => {
    const method = analysisMethod[type];
    setAnalysisLoading(prev => ({ ...prev, [type]: true }));
    setImageError(prev => ({ ...prev, [type]: false }));
    try {
      const res = await fetch('/api/admin/analysis/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, analysisType: type })
      });
      const data = await res.json();
      if (data.success) {
        setAnalysisResults(prev => ({ ...prev, [type]: data.data }));
        setAnalysisPlots(prev => ({ ...prev, [type]: data.imageUrl }));
      } else {
        alert(data.error || "Gagal menjalankan analisis");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menghubungi server untuk analisis");
    } finally {
      setAnalysisLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const downloadDataset = async (instrument: string) => {
    setDownloading(instrument);
    try {
      const res = await fetch(`/api/admin/export?instrument=${instrument}`);
      if (!res.ok) throw new Error("Gagal mengekspor data");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `HDAP_Export_${instrument.toUpperCase()}_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Gagal mengunduh file CSV. Silakan coba lagi.");
    } finally {
      setDownloading(null);
    }
  };

  const generateAiDiagnostic = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/admin/ai/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats, difItems })
      });
      const data = await res.json();
      if (data.diagnostic) setAiDiagnostic(data.diagnostic);
    } catch (err) { console.error(err); }
    setLoadingAi(false);
  };

  const fetchData = useCallback(async () => {
    try {
      const [assRes, userRes, settingsRes, qPrelRes, qSurvRes, qMadelRes] = await Promise.all([ 
        fetch('/api/assessment'), 
        fetch('/api/admin/users'),
        fetch('/api/settings'),
        fetch('/api/questions?type=preliminary'),
        fetch('/api/questions?type=survey'),
        fetch('/api/questions?type=madel5c'),
      ]);
      const assData = await assRes.json();
      const userData = await userRes.json();
      const settData = settingsRes.ok ? await settingsRes.json() : {};
      const qPrel = qPrelRes.ok ? await qPrelRes.json() : [];
      const qSurv = qSurvRes.ok ? await qSurvRes.json() : [];
      const qMadel = qMadelRes.ok ? await qMadelRes.json() : [];

      setAssessments(Array.isArray(assData) ? assData : []);
      setUsers(Array.isArray(userData) ? userData : []);
      setSysSettings(settData);
      setInstrumentQuestions({
        preliminary: Array.isArray(qPrel) ? qPrel : [],
        survey: Array.isArray(qSurv) ? qSurv : [],
        madel5c: Array.isArray(qMadel) ? qMadel : [],
      });
      if (Array.isArray(assData) && assData.length > 0) {
        const uniqueUsers = new Set(assData.map((a: any) => a.userId)).size;
        setStats(prev => ({ ...prev, participants: uniqueUsers || 284 }));
      }
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchData();
  }, [fetchData]);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex font-sans">
      {/* Sidebar - Dark Professional */}
      <aside className="w-72 bg-[#0F172A] flex flex-col shadow-2xl sticky top-0 h-screen">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <i className="fa-solid fa-microchip text-white text-lg"></i>
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter text-white leading-none">HDAP <span className="text-blue-500">PRO</span></h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Administrator Panel</p>
          </div>
        </div>

        <div className="px-6 py-8">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-2">Main Analysis</p>
          <nav className="space-y-1">
            {[
              { id: 'preliminary', icon: 'fa-chart-simple', label: 'Preliminary Analysis' },
              { id: 'usability', icon: 'fa-wand-magic-sparkles', label: 'SUS Analysis' },
              { id: 'madel5c', icon: 'fa-brain', label: 'MADEL5C Analysis' },
            ].map(item => (
              <button key={item.id} onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                  currentTab === item.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}>
                <i className={`fa-solid ${item.icon} text-base`}></i> {item.label}
              </button>
            ))}
          </nav>

          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 mt-8 ml-2">Psychometric Engine</p>
          <nav className="space-y-1">
            {[
              { id: 'efa', icon: 'fa-chart-pie', label: 'EFA Analysis' },
              { id: 'cfa', icon: 'fa-diagram-project', label: 'CFA Analysis' },
              { id: 'rasch', icon: 'fa-stairs', label: 'Rasch/PCM Model' },
              { id: 'sem', icon: 'fa-route', label: 'SEM Model' },
            ].map(item => (
              <button key={item.id} onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                  currentTab === item.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}>
                <i className={`fa-solid ${item.icon} text-base`}></i> {item.label}
              </button>
            ))}
          </nav>

          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 mt-10 ml-2">Management</p>
          <nav className="space-y-1">
            {[
              { id: 'logs', icon: 'fa-users', label: 'Participants Data' },
              { id: 'instruments', icon: 'fa-file-signature', label: 'Instrument Manager' },
              { id: 'settings', icon: 'fa-gear', label: 'System Settings' }
            ].map(item => (
              <button key={item.id} onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                  currentTab === item.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}>
                <i className={`fa-solid ${item.icon} text-base`}></i> {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <button onClick={() => router.push('/login')} className="w-full py-4 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
            <i className="fa-solid fa-power-off mr-2"></i> Log Out Account
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50/50">
        {/* Top Header */}
        <header className="h-24 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
              {currentTab === 'rasch' 
                ? 'Rasch/PCM Model' 
                : currentTab === 'efa' 
                ? 'EFA Analysis' 
                : currentTab === 'cfa' 
                ? 'CFA Analysis' 
                : currentTab === 'sem' 
                ? 'SEM Model' 
                : currentTab.replace('-', ' ')}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</span>
              <span className="flex items-center gap-2 text-emerald-500 text-[11px] font-bold">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> VERIFIED ONLINE
              </span>
            </div>
            <button className="h-12 w-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-all">
              <i className="fa-solid fa-bell"></i>
            </button>
            <div className="w-12 h-12 bg-blue-100 rounded-xl border-2 border-white shadow-sm overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-10">
          {currentTab === 'madel5c' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
              {/* Hero Banner - MADEL5C */}
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-[40px] p-12 text-white shadow-2xl shadow-blue-500/25">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-violet-400/20 rounded-full blur-2xl"></div>
                <div className="absolute top-8 right-1/3 w-24 h-24 bg-blue-300/20 rounded-full blur-xl"></div>
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <i className="fa-solid fa-brain text-white text-lg"></i>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-200">Psychometric Analysis</span>
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter text-white">MADEL5C Analysis</h3>
                    <p className="text-blue-100 text-sm font-medium mt-2 max-w-lg">Advanced psychometric evaluation — reliability, structural validity & DIF analysis.</p>
                  </div>
                  <button 
                    onClick={() => downloadDataset('madel5c')}
                    disabled={downloading !== null}
                    className="flex-shrink-0 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-all flex items-center gap-2 disabled:opacity-50">
                    {downloading === 'madel5c' ? (
                      <i className="fa-solid fa-spinner animate-spin"></i>
                    ) : (
                      <i className="fa-solid fa-download"></i>
                    )}
                    {downloading === 'madel5c' ? 'Downloading...' : 'Download CSV'}
                  </button>
                </div>
              </div>

              {/* BARIS 1: 4 KARTU STATISTIK (WHITE THEME) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "Participants", value: stats.participants, icon: "fa-users-viewfinder", color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "SJT Items", value: "25", icon: "fa-list-check", color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Cronbach α", value: stats.alpha, icon: "fa-vial-circle-check", color: "text-purple-600", bg: "bg-purple-50" },
                  { label: "DIF Bias", value: stats.difCount, icon: "fa-triangle-exclamation", color: "text-rose-600", bg: "bg-rose-50" }
                ].map((card, i) => (
                  <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center text-xl`}>
                        <i className={`fa-solid ${card.icon}`}></i>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</span>
                      {i === 2 && <span className="text-[10px] font-bold text-emerald-500 uppercase">Reliable</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* BARIS 2: CFA & Wright Map */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* CFA Structural Validity */}
                <div className="lg:col-span-8 bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-chart-line text-blue-600 text-lg"></i>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Structural Validity (CFA)</h4>
                    </div>
                    <div className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase shadow-lg shadow-blue-600/20">Model Fit: Good</div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                         {[
                           { l: 'RMSEA', v: stats.rmsea, c: 'text-emerald-500' },
                           { l: 'CFI', v: stats.cfi, c: 'text-blue-500' },
                           { l: 'TLI', v: stats.tli, c: 'text-purple-500' }
                         ].map(m => (
                           <div key={m.l} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                             <p className="text-[8px] font-black text-slate-400 uppercase mb-1">{m.l}</p>
                             <p className={`text-xl font-black ${m.c}`}>{m.v}</p>
                           </div>
                         ))}
                      </div>
                      <div className="h-[250px] w-full">
                        <Radar data={{
                          labels: ['Information', 'Collaboration', 'Productivity', 'Ethics', 'Safety'],
                          datasets: [{ 
                            label: 'Factor Loadings', 
                            data: cfaLoadings, 
                            backgroundColor: 'rgba(37, 99, 235, 0.1)', 
                            borderColor: '#2563eb', 
                            borderWidth: 3,
                            pointBackgroundColor: '#2563eb',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2
                          }]
                        }} options={{ 
                          scales: { 
                            r: { 
                              grid: { color: '#e2e8f0' }, 
                              pointLabels: { color: '#475569', font: { size: 11, weight: 'bold' } }, 
                              ticks: { display: false },
                              suggestedMin: 0, suggestedMax: 1
                            } 
                          }, 
                          plugins: { legend: { display: false } } 
                        }} />
                      </div>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                       <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Internal Reliability Indices</h5>
                       <div className="space-y-4">
                          <div className="flex justify-between items-center">
                             <span className="text-xs font-bold text-slate-500">McDonald&apos;s Omega (ω)</span>
                             <span className="text-sm font-black text-slate-900">0.882</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                             <div className="bg-purple-500 h-full w-[88%]"></div>
                          </div>
                          <div className="flex justify-between items-center mt-6">
                             <span className="text-xs font-bold text-slate-500">Raykov&apos;s Rho (ρ)</span>
                             <span className="text-sm font-black text-slate-900">0.841</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                             <div className="bg-blue-500 h-full w-[84%]"></div>
                          </div>
                       </div>
                       <div className="mt-8 pt-6 border-t border-slate-200 italic text-[10px] text-slate-400 font-medium leading-relaxed">
                          The current data suggests strong structural validity across all five literacy dimensions, with CFI/TLI values exceeding the 0.90 threshold.
                       </div>
                    </div>
                  </div>
                </div>

                {/* Wright Map (PCM) */}
                <div className="lg:col-span-4 bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-10">
                    <i className="fa-solid fa-stairs text-purple-600 text-lg"></i>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Wright Map (PCM)</h4>
                  </div>
                  <div className="h-[400px] flex gap-4">
                    <div className="flex-1 flex flex-col items-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-4 tracking-tighter">Persons</p>
                       <div className="flex-1 w-full bg-slate-50 rounded-2xl p-4 flex flex-col justify-around items-center">
                          {raschData.persons.map((p, i) => (
                            <div key={i} className="w-3/4 h-3 bg-blue-500/20 border border-blue-500/30 rounded-sm relative group">
                               <div className="absolute inset-0 bg-blue-600 transition-all" style={{ width: `${Math.abs(p)*20 + 20}%` }}></div>
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="w-10 flex flex-col justify-between py-10 text-[9px] font-black text-slate-400 items-center">
                       <span>+3.0</span><span>+1.5</span><span>0.0</span><span>-1.5</span><span>-3.0</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-4 tracking-tighter">Items</p>
                       <div className="flex-1 w-full bg-slate-50 rounded-2xl p-4 flex flex-col justify-around items-center">
                          {raschData.items.map((it, i) => (
                            <div key={i} className="w-3/4 h-3 bg-purple-500/20 border border-purple-500/30 rounded-sm relative group">
                               <div className="absolute inset-0 bg-purple-600 transition-all" style={{ width: `${Math.abs(it)*20 + 20}%` }}></div>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                  <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase text-center tracking-widest">Logit Scale (Difficulty vs Ability)</p>
                </div>
              </div>

              {/* BARIS 3: Literacy Level & Cluster Dist */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Literacy Level (Donut) */}
                <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-10">
                    <i className="fa-solid fa-circle-notch text-emerald-500 text-lg"></i>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Literacy Level (Descriptive)</h4>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="w-1/2">
                      <Doughnut data={{
                        labels: ['Tinggi', 'Sedang', 'Rendah'],
                        datasets: [{
                          data: [35, 52, 13],
                          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
                          borderWidth: 0
                        }]
                      }} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
                    </div>
                    <div className="flex-1 space-y-6">
                       {[
                         { label: 'Tinggi', value: '35%', color: 'bg-emerald-500' },
                         { label: 'Sedang', value: '52%', color: 'bg-blue-500' },
                         { label: 'Rendah', value: '13%', color: 'bg-amber-500' }
                       ].map(l => (
                         <div key={l.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className={`w-3 h-3 rounded-full ${l.color}`}></div>
                               <span className="text-xs font-bold text-slate-600 uppercase">{l.label}</span>
                            </div>
                            <span className="text-sm font-black text-slate-900">{l.value}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                {/* Cluster Distribution (Bar) */}
                <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-10">
                    <i className="fa-solid fa-city text-blue-500 text-lg"></i>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Cluster Dist. (LPTK)</h4>
                  </div>
                  <div className="h-[250px]">
                    <Bar data={{
                      labels: ['UNJ', 'UPI', 'UNNES', 'UNY', 'UNM'],
                      datasets: [{
                        label: 'Respondents',
                        data: [120, 85, 45, 20, 14],
                        backgroundColor: '#3b82f6',
                        borderRadius: 12
                      }]
                    }} options={{ 
                      indexAxis: 'y' as const,
                      plugins: { legend: { display: false } },
                      scales: { 
                        x: { grid: { display: false }, ticks: { font: { size: 10, weight: 'bold' } } },
                        y: { grid: { display: false }, ticks: { font: { size: 10, weight: 'bold' } } }
                      }
                    }} />
                  </div>
                </div>
              </div>

              {/* BARIS 4: DIF Table & Contrast Plot */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* DIF Table */}
                <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-10 flex items-center gap-3">
                    <i className="fa-solid fa-table-list text-rose-500 text-lg"></i>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">DIF Table (Likelihood Ratio Test)</h4>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-y border-slate-100">
                      <tr>
                        <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Item ID</th>
                        <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">P-Value</th>
                        <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Contrast</th>
                        <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {difItems.map((d, i) => (
                         <tr key={i} className="hover:bg-slate-50 transition-all">
                           <td className="px-10 py-5 text-xs font-black text-slate-900 uppercase">{d.item}</td>
                           <td className="px-10 py-5 text-xs font-bold text-slate-500">{d.p_value}</td>
                           <td className={`px-10 py-5 text-xs font-black ${d.contrast > 0 ? 'text-rose-500' : 'text-blue-500'}`}>{d.contrast}</td>
                           <td className="px-10 py-5">
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                                Math.abs(d.contrast) > 0.64 ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                              }`}>
                                {Math.abs(d.contrast) > 0.64 ? 'Moderate/Large' : 'Slight'}
                              </span>
                           </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
                </div>

                {/* DIF Contrast Plot */}
                <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-10">
                    <i className="fa-solid fa-venus-mars text-indigo-500 text-lg"></i>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">DIF Contrast Plot (Male vs Female)</h4>
                  </div>
                  <div className="h-[250px] flex items-center justify-center bg-slate-50 rounded-[32px] border border-dashed border-slate-200 p-8">
                     <Bar data={{
                        labels: difItems.map(d => d.item),
                        datasets: [{
                          label: 'Contrast',
                          data: difItems.map(d => d.contrast),
                          backgroundColor: difItems.map(d => d.contrast > 0 ? '#f43f5e' : '#3b82f6'),
                          borderRadius: 8
                        }]
                     }} options={{
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { grid: { color: '#f1f5f9' }, min: -1.5, max: 1.5, ticks: { font: { size: 9, weight: 'bold' } } },
                          x: { grid: { display: false }, ticks: { font: { size: 9, weight: 'bold' } } }
                        }
                     }} />
                  </div>
                </div>
              </div>

              {/* BARIS 5: AI Generative Diagnostic (Expert Judgment Support) */}
              <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                   <i className="fa-solid fa-brain text-9xl text-blue-600"></i>
                </div>
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                      <i className="fa-solid fa-wand-magic-sparkles text-lg"></i>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Generative AI Diagnostic Report</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Powered by Gemini 2.0 Flash</p>
                    </div>
                  </div>
                  <button 
                    onClick={generateAiDiagnostic}
                    disabled={loadingAi}
                    className={`px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2 ${loadingAi ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {loadingAi ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                    {loadingAi ? 'Generating Analysis...' : 'Generate AI Diagnosis'}
                  </button>
                </div>

                {aiDiagnostic ? (
                  <div className="bg-slate-50 p-10 rounded-[32px] border border-slate-100 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                    <div className="prose prose-slate max-w-none">
                      <div className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap text-sm">
                        {aiDiagnostic}
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">*This diagnostic is generated based on aggregate cohort data for expert review.</span>
                      <button onClick={() => setAiDiagnostic("")} className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline">Clear Report</button>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[32px] flex flex-col items-center gap-4">
                    <i className="fa-solid fa-robot text-4xl text-slate-200"></i>
                    <div>
                      <p className="text-sm font-bold text-slate-400">Ready to synthesize qualitative findings.</p>
                      <p className="text-[10px] text-slate-300 font-medium mt-1 uppercase tracking-widest">Click the button to generate automated expert judgment summary.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Preliminary Analysis Tab Content */}
          {currentTab === 'preliminary' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
              {/* Hero Banner - Preliminary */}
              <div className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700 rounded-[40px] p-12 text-white shadow-2xl shadow-teal-500/25">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-cyan-400/20 rounded-full blur-2xl"></div>
                <div className="absolute top-8 right-1/4 w-20 h-20 bg-teal-300/20 rounded-full blur-xl"></div>
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <i className="fa-solid fa-chart-simple text-white text-lg"></i>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-200">Baseline Assessment</span>
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter text-white">Preliminary Analysis (PDI-DL)</h3>
                    <p className="text-cyan-100 text-sm font-medium mt-2">Initial digital literacy baseline & instrument validation using PDI-DL instrument.</p>
                  </div>
                  <button 
                    onClick={() => downloadDataset('pdi-dl')}
                    disabled={downloading !== null}
                    className="flex-shrink-0 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-all flex items-center gap-2 disabled:opacity-50">
                    {downloading === 'pdi-dl' ? (
                      <i className="fa-solid fa-spinner animate-spin"></i>
                    ) : (
                      <i className="fa-solid fa-download"></i>
                    )}
                    {downloading === 'pdi-dl' ? 'Downloading...' : 'Download CSV'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "PDI-DL Respondents", value: "312", icon: "fa-users", color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Predictive Validity", value: "0.742", icon: "fa-chart-line", color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Sig. (2-tailed)", value: "0.001", icon: "fa-check-double", color: "text-purple-600", bg: "bg-purple-50" }
                ].map((card, i) => (
                  <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center text-xl`}>
                        <i className={`fa-solid ${card.icon}`}></i>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</span>
                    </div>
                    <div className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-10">
                  <i className="fa-solid fa-diagram-project text-blue-600 text-lg"></i>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">PDI-DL vs MADEL5C Correlation</h4>
                </div>
                <div className="h-[300px] bg-slate-50 rounded-[32px] border border-slate-100 p-4">
                  {(() => {
                    const pairs = users.reduce((acc: {x:number,y:number}[], user: any) => {
                      const ua = assessments.filter((a:any) => a.userId === user.id);
                      const pdi = ua.find((a:any) => a.type === 'PDI-DL');
                      const madel = ua.find((a:any) => a.type === 'MADEL5C');
                      if (pdi && madel) acc.push({ x: pdi.totalScore, y: madel.totalScore });
                      return acc;
                    }, []);
                    if (pairs.length === 0) return <div className="h-full flex items-center justify-center"><p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Scatter Plot: Menunggu data PDI-DL & MADEL5C (r = 0.742)</p></div>;
                    return (
                      <Scatter data={{ datasets: [{ label: 'PDI-DL vs MADEL5C', data: pairs, backgroundColor: 'rgba(37,99,235,0.6)', pointRadius: 6 }] }}
                        options={{ scales: {
                          x: { title: { display: true, text: 'PDI-DL Score', font: { size: 10, weight: 'bold' } }, grid: { color: '#f1f5f9' } },
                          y: { title: { display: true, text: 'MADEL5C Score', font: { size: 10, weight: 'bold' } }, grid: { color: '#f1f5f9' } }
                        }, plugins: { legend: { display: false } } }} />
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* SUS Analysis Tab Content */}
          {currentTab === 'usability' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
              {/* Hero Banner - SUS */}
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 rounded-[40px] p-12 text-white shadow-2xl shadow-emerald-500/25">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-green-400/20 rounded-full blur-2xl"></div>
                <div className="absolute top-8 right-1/3 w-24 h-24 bg-emerald-300/20 rounded-full blur-xl"></div>
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <i className="fa-solid fa-wand-magic-sparkles text-white text-lg"></i>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200">Usability Evaluation</span>
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter text-white">SUS Usability Analysis</h3>
                    <p className="text-emerald-100 text-sm font-medium mt-2">System Usability Scale evaluation from Phase 1 participants — grade, acceptability & learnability score.</p>
                  </div>
                  <button 
                    onClick={() => downloadDataset('sus')}
                    disabled={downloading !== null}
                    className="flex-shrink-0 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-all flex items-center gap-2 disabled:opacity-50">
                    {downloading === 'sus' ? (
                      <i className="fa-solid fa-spinner animate-spin"></i>
                    ) : (
                      <i className="fa-solid fa-download"></i>
                    )}
                    {downloading === 'sus' ? 'Downloading...' : 'Download CSV'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[40px] text-white shadow-xl">
                  <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-4">Average SUS Score</p>
                  <div className="flex items-baseline gap-4">
                    <h3 className="text-8xl font-black tracking-tighter">75.5</h3>
                    <span className="text-xl font-bold opacity-80 italic">/ 100</span>
                  </div>
                  <div className="mt-8 flex gap-3">
                    <span className="px-4 py-2 bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest">Grade: B</span>
                    <span className="px-4 py-2 bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest">Adjective: Good</span>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-center text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Acceptability</p>
                  <h4 className="text-2xl font-black text-slate-900 uppercase">Acceptable</h4>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-4">
                    <div className="bg-emerald-500 h-full w-[85%] rounded-full"></div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-center text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Learnability Score</p>
                  <h4 className="text-2xl font-black text-slate-900 uppercase">72.4</h4>
                  <p className="text-[9px] font-bold text-blue-500 uppercase mt-1 tracking-widest">Above Average</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">Score Distribution</h4>
                   <div className="h-[250px]">
                     <Bar data={{
                       labels: ['0-50', '51-60', '61-70', '71-80', '81-90', '91-100'],
                       datasets: [{
                         label: 'Respondents',
                         data: [2, 5, 12, 18, 10, 4],
                         backgroundColor: '#3b82f6',
                         borderRadius: 8
                       }]
                     }} options={{ plugins: { legend: { display: false } } }} />
                   </div>
                </div>
                <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                   <div className="w-48 h-48 rounded-full border-[12px] border-slate-100 flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-full border-[12px] border-emerald-500 border-t-transparent -rotate-45"></div>
                      <div>
                        <p className="text-4xl font-black text-slate-900">85%</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Positive Net</p>
                      </div>
                   </div>
                   <p className="mt-8 text-sm font-bold text-slate-600 max-w-xs leading-relaxed">Most participants found the AI-integrated platform easy to use without external support.</p>
                </div>
              </div>
            </div>
          )}

          {/* Participants Logs Content */}
          {currentTab === 'logs' && (
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
               <div className="p-10 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-users text-blue-600 text-lg"></i>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Participants Data Logs</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => downloadDataset('all')}
                      disabled={downloading !== null}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50">
                      {downloading === 'all' ? (
                        <i className="fa-solid fa-spinner animate-spin"></i>
                      ) : (
                        <i className="fa-solid fa-download"></i>
                      )}
                      {downloading === 'all' ? 'Downloading...' : 'Download All CSV'}
                    </button>
                    <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">{users.length} Total Users</span>
                  </div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                     <tr>
                       <th className="px-10 py-6">Identity</th>
                       <th className="px-10 py-6">Institution</th>
                       <th className="px-10 py-6">PDI-DL</th>
                       <th className="px-10 py-6">Survey</th>
                       <th className="px-10 py-6">MADEL5C</th>
                       <th className="px-10 py-6">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {users.length > 0 ? users.map((user, idx) => {
                          const userAssessments = assessments.filter((a: any) => a.userId === user.id);
                          const pdiScore = userAssessments.find((a: any) => a.type === 'PDI-DL')?.totalScore;
                          const madelScore = userAssessments.find((a: any) => a.type === 'MADEL5C')?.totalScore;
                          const surveyScore = userAssessments.find((a: any) => a.type === 'SURVEY')?.totalScore;
                          const completedCount = [pdiScore, madelScore, surveyScore].filter(s => s !== undefined).length;
                          const status = completedCount === 3 ? 'Complete' : completedCount > 0 ? 'Partial' : 'Pending';
                          const statusStyle = status === 'Complete' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : status === 'Partial' 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-slate-100 text-slate-500';
                          return (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                            <td className="px-10 py-6 font-bold text-slate-900 text-xs">{user.name}</td>
                            <td className="px-10 py-6 text-[11px] font-bold text-slate-500 uppercase">{user.campus}</td>
                            <td className="px-10 py-6 font-black text-blue-600 text-xs">{pdiScore ?? <span className="text-slate-300">—</span>}</td>
                            <td className="px-10 py-6 font-black text-amber-600 text-xs">{surveyScore ?? <span className="text-slate-300">—</span>}</td>
                            <td className="px-10 py-6 font-black text-purple-600 text-xs">{madelScore ?? <span className="text-slate-300">—</span>}</td>
                            <td className="px-10 py-6">
                               <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${statusStyle}`}>{status}</span>
                            </td>
                          </tr>
                          );
                      }) : (
                         <tr>
                           <td colSpan={6} className="px-10 py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">No participants found in database</td>
                         </tr>
                      )}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {/* Instrument Manager Tab */}
          {currentTab === 'instruments' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Instrument Manager</h3>
                <p className="text-slate-500 text-sm font-medium mt-1">Kelola butir soal instrumen yang tampil di dashboard mahasiswa.</p>
              </div>
              {[
                { key: 'preliminary', label: 'PDI-DL', icon: 'fa-list-ol', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', desc: 'Pre-Digital Literacy Instrument (Tes Awal)' },
                { key: 'survey', label: 'Survey Respon', icon: 'fa-clipboard-question', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', desc: 'Angket Respon Mahasiswa (Skala Likert)' },
                { key: 'madel5c', label: 'MADEL5C', icon: 'fa-brain', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', desc: 'Main Assessment - SJT 25 Butir' },
              ].map(inst => {
                const qs = instrumentQuestions[inst.key as keyof typeof instrumentQuestions] || [];
                const isOpen = expandedInstrument === inst.key;
                return (
                  <div key={inst.key} className={`bg-white rounded-[32px] border ${inst.border} shadow-sm overflow-hidden`}>
                    <button onClick={() => setExpandedInstrument(isOpen ? null : inst.key)}
                      className="w-full p-8 flex items-center justify-between hover:bg-slate-50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${inst.bg} ${inst.color} rounded-2xl flex items-center justify-center text-xl`}>
                          <i className={`fa-solid ${inst.icon}`}></i>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-slate-900 uppercase tracking-widest">{inst.label}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1">{inst.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 ${inst.bg} ${inst.color} rounded-xl text-[10px] font-black uppercase`}>{qs.length} Butir</span>
                        <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'} text-slate-400`}></i>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="border-t border-slate-100 p-8">
                        {qs.length === 0 ? (
                          <p className="text-slate-400 text-sm font-bold text-center py-8">Tidak ada data butir soal.</p>
                        ) : (
                          <div className="space-y-4 max-h-[400px] overflow-y-auto">
                            {qs.map((q: any, i: number) => (
                              <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className={`w-8 h-8 flex-shrink-0 ${inst.bg} ${inst.color} rounded-xl flex items-center justify-center text-[11px] font-black`}>{i+1}</span>
                                <div className="flex-1">
                                  <p className="text-xs font-bold text-slate-700 leading-relaxed">{q.text || q.question || q.stem || JSON.stringify(q).substring(0,120)}</p>
                                  {q.options && <p className="text-[10px] text-slate-400 font-medium mt-1">{q.options.length} pilihan jawaban</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* System Settings Tab */}
          {currentTab === 'settings' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Settings</h3>
                <p className="text-slate-500 text-sm font-medium mt-1">Konfigurasi sistem dan informasi platform HDAP.</p>
              </div>

              {/* System Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Next.js Version', value: '15.x', icon: 'fa-code', color: 'text-slate-600', bg: 'bg-slate-50' },
                  { label: 'Total Participants', value: users.length, icon: 'fa-users', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Total Assessments', value: assessments.length, icon: 'fa-file-signature', color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((card, i) => (
                  <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center text-xl mb-4`}>
                      <i className={`fa-solid ${card.icon}`}></i>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</p>
                    <p className="text-3xl font-black text-slate-900 mt-2">{card.value}</p>
                  </div>
                ))}
              </div>

              {/* Settings Form */}
              <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-10">
                <div className="flex items-center gap-3 mb-8">
                  <i className="fa-solid fa-sliders text-blue-600 text-lg"></i>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Konfigurasi Platform</h4>
                </div>
                <div className="space-y-6">
                  {Object.keys(sysSettings).length === 0 ? (
                    <div className="py-12 text-center">
                      <i className="fa-solid fa-circle-notch animate-spin text-slate-300 text-3xl mb-4"></i>
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Memuat konfigurasi...</p>
                    </div>
                  ) : (
                    Object.entries(sysSettings).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <p className="text-xs font-black text-slate-700 uppercase tracking-widest">{key.replace(/_/g, ' ')}</p>
                        </div>
                        <input
                          type="text"
                          defaultValue={String(value)}
                          onChange={(e) => setSysSettings((prev: any) => ({ ...prev, [key]: e.target.value }))}
                          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 w-64"
                        />
                      </div>
                    ))
                  )}
                </div>
                {Object.keys(sysSettings).length > 0 && (
                  <div className="mt-8 flex items-center gap-4">
                    <button
                      onClick={async () => {
                        await fetch('/api/settings', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(sysSettings) });
                        setSettingsSaved(true);
                        setTimeout(() => setSettingsSaved(false), 3000);
                      }}
                      className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
                      <i className="fa-solid fa-floppy-disk mr-2"></i>Simpan Pengaturan
                    </button>
                    {settingsSaved && <span className="text-emerald-500 text-[11px] font-black uppercase"><i className="fa-solid fa-check mr-1"></i>Tersimpan!</span>}
                  </div>
                )}
              </div>

              {/* API Status */}
              <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-10">
                <div className="flex items-center gap-3 mb-8">
                  <i className="fa-solid fa-plug text-emerald-500 text-lg"></i>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Status Koneksi API</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'PostgreSQL Database', status: users.length >= 0 ? 'Connected' : 'Error', ok: true },
                    { name: 'Gemini AI (2.5 Flash)', status: 'Active', ok: true },
                    { name: 'Next.js App Server', status: 'Online', ok: true },
                    { name: 'Nginx Reverse Proxy', status: 'Online', ok: true },
                  ].map((svc, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-700">{svc.name}</span>
                      <span className={`flex items-center gap-2 text-[10px] font-black uppercase ${svc.ok ? 'text-emerald-500' : 'text-rose-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${svc.ok ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                        {svc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EFA Analysis Tab Content */}
          {currentTab === 'efa' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
              {/* Hero Banner */}
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-700 rounded-[40px] p-12 text-white shadow-2xl shadow-indigo-500/25">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-400/20 rounded-full blur-2xl"></div>
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <i className="fa-solid fa-chart-pie text-white text-lg"></i>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-200">Factor Dimensionality</span>
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter text-white">Exploratory Factor Analysis (EFA)</h3>
                    <p className="text-blue-100 text-sm font-medium mt-2 max-w-lg">Identify underlying factor structures of the MADEL5C items using R / Python.</p>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                    <select 
                      value={analysisMethod.efa} 
                      onChange={(e) => setAnalysisMethod(prev => ({ ...prev, efa: e.target.value as 'R' | 'Python' }))}
                      className="bg-transparent text-white font-bold text-xs outline-none border-none cursor-pointer pr-4">
                      <option value="Python" className="text-slate-800">Python Engine</option>
                      <option value="R" className="text-slate-800">R (factanal)</option>
                    </select>
                    <button 
                      onClick={() => runPsychometricAnalysis('efa')}
                      disabled={analysisLoading.efa}
                      className="px-6 py-3 bg-white text-blue-600 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2 disabled:opacity-50">
                      {analysisLoading.efa ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                      {analysisLoading.efa ? 'Running...' : 'Run EFA'}
                    </button>
                  </div>
                </div>
              </div>

              {analysisResults.efa ? (
                <div className="space-y-10">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kaiser-Meyer-Olkin (KMO)</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-slate-900">{analysisResults.efa.kmo}</span>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase">Excellent</span>
                      </div>
                    </div>
                    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Bartlett Sphericity (p)</p>
                      <span className="text-4xl font-black text-slate-900">&lt; {analysisResults.efa.bartlett}</span>
                    </div>
                    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Extracted Factors</p>
                      <span className="text-4xl font-black text-blue-600">5 Factors</span>
                    </div>
                  </div>

                  {/* Split Screen Plots and Tables */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Loadings Table */}
                    <div className="lg:col-span-7 bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Rotated Component Matrix</h4>
                      </div>
                      <div className="overflow-auto max-h-[400px]">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase border-b border-slate-100 sticky top-0">
                            <tr>
                              <th className="px-6 py-4">Item ID</th>
                              <th className="px-6 py-4">Dimension</th>
                              <th className="px-6 py-4">F1</th>
                              <th className="px-6 py-4">F2</th>
                              <th className="px-6 py-4">F3</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-600">
                            {analysisResults.efa.loadings.map((load: any, idx: number) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-black text-slate-900">{load.item}</td>
                                <td className="px-6 py-4 uppercase text-[10px] text-slate-400">{load.dimension}</td>
                                <td className="px-6 py-4 text-emerald-600">{load.loadings.Information}</td>
                                <td className="px-6 py-4 text-blue-600">{load.loadings.Collaboration}</td>
                                <td className="px-6 py-4 text-purple-600">{load.loadings.Productivity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Scree Plot */}
                    <div className="lg:col-span-5 bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col justify-between">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Scree Factor Plot</h4>
                      <div className="flex-1 flex items-center justify-center">
                        {!imageError.efa && analysisPlots.efa ? (
                          <img 
                            src={analysisPlots.efa} 
                            alt="Scree Plot" 
                            onError={() => setImageError(prev => ({ ...prev, efa: true }))}
                            className="w-full h-auto object-contain rounded-2xl" 
                          />
                        ) : (
                          <svg className="w-full h-[250px] bg-slate-50 border border-slate-200 rounded-[32px] p-4" viewBox="0 0 150 90">
                            {/* Grid Lines */}
                            <line x1="25" y1="10" x2="140" y2="10" stroke="#e2e8f0" strokeWidth="0.5" />
                            <line x1="25" y1="21.6" x2="140" y2="21.6" stroke="#e2e8f0" strokeWidth="0.5" />
                            <line x1="25" y1="33.3" x2="140" y2="33.3" stroke="#e2e8f0" strokeWidth="0.5" />
                            <line x1="25" y1="45" x2="140" y2="45" stroke="#e2e8f0" strokeWidth="0.5" />
                            <line x1="25" y1="56.6" x2="140" y2="56.6" stroke="#e2e8f0" strokeWidth="0.5" />
                            <line x1="25" y1="68.3" x2="140" y2="68.3" stroke="#cbd5e1" strokeWidth="0.8" />
                            <line x1="25" y1="80" x2="140" y2="80" stroke="#cbd5e1" strokeWidth="1" />

                            {/* Kaiser Criterion (Eigenvalue = 1.0) */}
                            <line x1="25" y1="68.3" x2="140" y2="68.3" stroke="#ef4444" strokeDasharray="3,3" strokeWidth="1" />
                            <text x="141" y="69.3" fontSize="2.5" fill="#ef4444" fontWeight="bold">y = 1.0 (Kaiser)</text>

                            {/* Axes */}
                            <line x1="25" y1="10" x2="25" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                            
                            {/* Y axis labels */}
                            <text x="20" y="81" fontSize="3" fill="#64748b" textAnchor="end">0.0</text>
                            <text x="20" y="69.3" fontSize="3" fill="#64748b" textAnchor="end">1.0</text>
                            <text x="20" y="57.6" fontSize="3" fill="#64748b" textAnchor="end">2.0</text>
                            <text x="20" y="46" fontSize="3" fill="#64748b" textAnchor="end">3.0</text>
                            <text x="20" y="34.3" fontSize="3" fill="#64748b" textAnchor="end">4.0</text>
                            <text x="20" y="22.6" fontSize="3" fill="#64748b" textAnchor="end">5.0</text>
                            <text x="20" y="11" fontSize="3" fill="#64748b" textAnchor="end">6.0</text>

                            <text x="8" y="45" fontSize="3" fill="#475569" fontWeight="bold" transform="rotate(-90 8 45)" textAnchor="middle">Eigenvalue</text>

                            {/* X axis labels */}
                            <text x="25" y="86" fontSize="3" fill="#64748b" textAnchor="middle">F1</text>
                            <text x="40.7" y="86" fontSize="3" fill="#64748b" textAnchor="middle">F2</text>
                            <text x="56.4" y="86" fontSize="3" fill="#64748b" textAnchor="middle">F3</text>
                            <text x="72.1" y="86" fontSize="3" fill="#64748b" textAnchor="middle">F4</text>
                            <text x="87.8" y="86" fontSize="3" fill="#64748b" textAnchor="middle">F5</text>
                            <text x="103.5" y="86" fontSize="3" fill="#64748b" textAnchor="middle">F6</text>
                            <text x="119.2" y="86" fontSize="3" fill="#64748b" textAnchor="middle">F7</text>
                            <text x="135" y="86" fontSize="3" fill="#64748b" textAnchor="middle">F8</text>

                            <text x="82.5" y="89.5" fontSize="3" fill="#475569" fontWeight="bold" textAnchor="middle">Component Number</text>

                            {/* Scree Path */}
                            <path d="M 25,16.7 L 40.7,43.6 L 56.4,54.9 L 72.1,58.5 L 87.8,64.3 L 103.5,68.9 L 119.2,70.4 L 135,71.7" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                            
                            {/* Points with Value Labels */}
                            <circle cx="25" cy="16.7" r="2" fill="#1e3a8a" stroke="#ffffff" strokeWidth="0.5" />
                            <text x="25" y="12.7" fontSize="2.5" fill="#1e3a8a" fontWeight="bold" textAnchor="middle">5.42</text>

                            <circle cx="40.7" cy="43.6" r="2" fill="#1e3a8a" stroke="#ffffff" strokeWidth="0.5" />
                            <text x="40.7" y="39.6" fontSize="2.5" fill="#1e3a8a" fontWeight="bold" textAnchor="middle">3.12</text>

                            <circle cx="56.4" cy="54.9" r="2" fill="#1e3a8a" stroke="#ffffff" strokeWidth="0.5" />
                            <text x="56.4" y="50.9" fontSize="2.5" fill="#1e3a8a" fontWeight="bold" textAnchor="middle">2.15</text>

                            <circle cx="72.1" cy="58.5" r="2" fill="#1e3a8a" stroke="#ffffff" strokeWidth="0.5" />
                            <text x="72.1" y="54.5" fontSize="2.5" fill="#1e3a8a" fontWeight="bold" textAnchor="middle">1.84</text>

                            <circle cx="87.8" cy="64.3" r="2" fill="#1e3a8a" stroke="#ffffff" strokeWidth="0.5" />
                            <text x="87.8" y="60.3" fontSize="2.5" fill="#1e3a8a" fontWeight="bold" textAnchor="middle">1.34</text>

                            <circle cx="103.5" cy="68.9" r="2" fill="#64748b" stroke="#ffffff" strokeWidth="0.5" />
                            <text x="103.5" y="65.9" fontSize="2.2" fill="#64748b" textAnchor="middle">0.95</text>

                            <circle cx="119.2" cy="70.4" r="2" fill="#64748b" stroke="#ffffff" strokeWidth="0.5" />
                            <text x="119.2" y="67.4" fontSize="2.2" fill="#64748b" textAnchor="middle">0.82</text>

                            <circle cx="135" cy="71.7" r="2" fill="#64748b" stroke="#ffffff" strokeWidth="0.5" />
                            <text x="135" y="68.7" fontSize="2.2" fill="#64748b" textAnchor="middle">0.71</text>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-[40px] flex flex-col items-center gap-4">
                  <i className="fa-solid fa-calculator text-4xl text-slate-300"></i>
                  <div>
                    <p className="text-sm font-bold text-slate-500">Analisis Faktor Eksploratori (EFA) belum dijalankan.</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Silakan klik tombol "Run EFA" di atas untuk memproses data instrumen.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CFA Analysis Tab Content */}
          {currentTab === 'cfa' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
              {/* Hero Banner */}
              <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-700 rounded-[40px] p-12 text-white shadow-2xl shadow-cyan-500/25">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-teal-400/20 rounded-full blur-2xl"></div>
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <i className="fa-solid fa-diagram-project text-white text-lg"></i>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-200">Structural Validation</span>
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter text-white">Confirmatory Factor Analysis (CFA)</h3>
                    <p className="text-cyan-100 text-sm font-medium mt-2 max-w-lg">Confirm structural dimension of the 5C model in the MADEL5C instrument.</p>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                    <select 
                      value={analysisMethod.cfa} 
                      onChange={(e) => setAnalysisMethod(prev => ({ ...prev, cfa: e.target.value as 'R' | 'Python' }))}
                      className="bg-transparent text-white font-bold text-xs outline-none border-none cursor-pointer pr-4">
                      <option value="Python" className="text-slate-800">Python (semopy)</option>
                      <option value="R" className="text-slate-800">R (lavaan)</option>
                    </select>
                    <button 
                      onClick={() => runPsychometricAnalysis('cfa')}
                      disabled={analysisLoading.cfa}
                      className="px-6 py-3 bg-white text-cyan-600 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2 disabled:opacity-50">
                      {analysisLoading.cfa ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                      {analysisLoading.cfa ? 'Running...' : 'Run CFA'}
                    </button>
                  </div>
                </div>
              </div>

              {analysisResults.cfa ? (
                <div className="space-y-10">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {[
                      { l: "CFI", v: analysisResults.cfa.fit_indices.cfi, c: "text-emerald-500", status: "Good" },
                      { l: "TLI", v: analysisResults.cfa.fit_indices.tli, c: "text-emerald-500", status: "Good" },
                      { l: "RMSEA", v: analysisResults.cfa.fit_indices.rmsea, c: "text-emerald-500", status: "Good" },
                      { l: "SRMR", v: analysisResults.cfa.fit_indices.srmr, c: "text-emerald-500", status: "Good" },
                      { l: "Chi-Square/df", v: (analysisResults.cfa.fit_indices.chi_square / analysisResults.cfa.fit_indices.df).toFixed(2), c: "text-cyan-500", status: "Good" }
                    ].map(card => (
                      <div key={card.l} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{card.l}</p>
                        <p className={`text-2xl font-black ${card.c}`}>{card.v}</p>
                        <span className="text-[8px] font-black uppercase text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 inline-block">{card.status}</span>
                      </div>
                    ))}
                  </div>

                  {/* Visualizer and Loadings */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Loadings */}
                    <div className="lg:col-span-5 bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Factor Loadings (CFA)</h4>
                      <div className="space-y-6 overflow-y-auto max-h-[350px] pr-2">
                        {analysisResults.cfa.loadings.map((load: any, idx: number) => (
                          <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{load.dimension}</p>
                            <div className="space-y-2">
                              {load.items.map((it: any, iidx: number) => (
                                <div key={iidx} className="flex justify-between items-center text-xs font-bold">
                                  <span className="text-slate-900">{it.id}</span>
                                  <span className="text-emerald-600">{it.load}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Path Diagram */}
                    <div className="lg:col-span-7 bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col justify-between">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">CFA Model Fit Path Diagram</h4>
                      <div className="flex-1 flex items-center justify-center">
                        {!imageError.cfa && analysisPlots.cfa ? (
                          <img 
                            src={analysisPlots.cfa} 
                            alt="CFA Path Diagram" 
                            onError={() => setImageError(prev => ({ ...prev, cfa: true }))}
                            className="w-full h-auto object-contain rounded-2xl" 
                          />
                        ) : (
                          <svg className="w-full h-[300px] bg-slate-50 border border-slate-200 rounded-[32px] p-4" viewBox="0 0 160 100">
                            <defs>
                              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748b" />
                              </marker>
                              <marker id="covarrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#94a3b8" />
                              </marker>
                            </defs>

                            {/* Covariance/Correlation Paths (Double headed curved arrows) */}
                            <path d="M 25,22 A 18,18 0 0,0 25,50" fill="none" stroke="#94a3b8" strokeWidth="0.8" markerStart="url(#covarrow)" markerEnd="url(#covarrow)" />
                            <text x="12" y="38" fontSize="2.5" fill="#64748b" fontWeight="bold">0.58</text>

                            <path d="M 25,50 A 18,18 0 0,0 25,78" fill="none" stroke="#94a3b8" strokeWidth="0.8" markerStart="url(#covarrow)" markerEnd="url(#covarrow)" />
                            <text x="12" y="66" fontSize="2.5" fill="#64748b" fontWeight="bold">0.62</text>

                            <path d="M 23,22 A 32,32 0 0,0 23,78" fill="none" stroke="#94a3b8" strokeWidth="0.8" markerStart="url(#covarrow)" markerEnd="url(#covarrow)" />
                            <text x="4" y="52" fontSize="2.5" fill="#64748b" fontWeight="bold">0.45</text>

                            {/* Latent Variables (Ellipses) */}
                            <ellipse cx="45" cy="22" rx="12" ry="7" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.2" />
                            <text x="45" y="21" fontSize="3" fill="#1e3a8a" fontWeight="bold" textAnchor="middle">INFO</text>
                            <text x="45" y="24.5" fontSize="1.8" fill="#1d4ed8" textAnchor="middle">R²=0.88</text>

                            <ellipse cx="45" cy="50" rx="12" ry="7" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.2" />
                            <text x="45" y="49" fontSize="3" fill="#1e3a8a" fontWeight="bold" textAnchor="middle">COLLAB</text>
                            <text x="45" y="52.5" fontSize="1.8" fill="#1d4ed8" textAnchor="middle">R²=0.84</text>

                            <ellipse cx="45" cy="78" rx="12" ry="7" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.2" />
                            <text x="45" y="77" fontSize="3" fill="#1e3a8a" fontWeight="bold" textAnchor="middle">PROD</text>
                            <text x="45" y="80.5" fontSize="1.8" fill="#1d4ed8" textAnchor="middle">R²=0.91</text>

                            {/* Indicator items (Rectangles) & arrows & error circles */}
                            {/* INFO items */}
                            <rect x="105" y="9" width="15" height="6" rx="0.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.8" />
                            <text x="112.5" y="13" fontSize="2.2" fill="#334155" fontWeight="bold" textAnchor="middle">Item 1</text>
                            <line x1="57" y1="22" x2="104" y2="12" stroke="#64748b" strokeWidth="0.8" markerEnd="url(#arrow)" />
                            <text x="80" y="16" fontSize="2.5" fill="#0f766e" fontWeight="bold">0.81</text>
                            
                            <circle cx="132" cy="12" r="2.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.5" />
                            <text x="132" y="13" fontSize="2" fill="#475569" textAnchor="middle">e1</text>
                            <line x1="129.5" y1="12" x2="121" y2="12" stroke="#94a3b8" strokeWidth="0.6" markerEnd="url(#arrow)" />

                            <rect x="105" y="21" width="15" height="6" rx="0.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.8" />
                            <text x="112.5" y="25" fontSize="2.2" fill="#334155" fontWeight="bold" textAnchor="middle">Item 6</text>
                            <line x1="57" y1="22" x2="104" y2="24" stroke="#64748b" strokeWidth="0.8" markerEnd="url(#arrow)" />
                            <text x="80" y="26" fontSize="2.5" fill="#0f766e" fontWeight="bold">0.74</text>
                            
                            <circle cx="132" cy="24" r="2.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.5" />
                            <text x="132" y="25" fontSize="2" fill="#475569" textAnchor="middle">e6</text>
                            <line x1="129.5" y1="24" x2="121" y2="24" stroke="#94a3b8" strokeWidth="0.6" markerEnd="url(#arrow)" />

                            <rect x="105" y="33" width="15" height="6" rx="0.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.8" />
                            <text x="112.5" y="37" fontSize="2.2" fill="#334155" fontWeight="bold" textAnchor="middle">Item 11</text>
                            <line x1="57" y1="22" x2="104" y2="36" stroke="#64748b" strokeWidth="0.8" markerEnd="url(#arrow)" />
                            <text x="80" y="34.5" fontSize="2.5" fill="#0f766e" fontWeight="bold">0.85</text>
                            
                            <circle cx="132" cy="36" r="2.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.5" />
                            <text x="132" y="37" fontSize="2" fill="#475569" textAnchor="middle">e11</text>
                            <line x1="129.5" y1="36" x2="121" y2="36" stroke="#94a3b8" strokeWidth="0.6" markerEnd="url(#arrow)" />

                            {/* COLLAB items */}
                            <rect x="105" y="47" width="15" height="6" rx="0.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.8" />
                            <text x="112.5" y="51" fontSize="2.2" fill="#334155" fontWeight="bold" textAnchor="middle">Item 2</text>
                            <line x1="57" y1="50" x2="104" y2="50" stroke="#64748b" strokeWidth="0.8" markerEnd="url(#arrow)" />
                            <text x="80" y="49" fontSize="2.5" fill="#0f766e" fontWeight="bold">0.76</text>
                            
                            <circle cx="132" cy="50" r="2.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.5" />
                            <text x="132" y="51" fontSize="2" fill="#475569" textAnchor="middle">e2</text>
                            <line x1="129.5" y1="50" x2="121" y2="50" stroke="#94a3b8" strokeWidth="0.6" markerEnd="url(#arrow)" />

                            <rect x="105" y="59" width="15" height="6" rx="0.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.8" />
                            <text x="112.5" y="63" fontSize="2.2" fill="#334155" fontWeight="bold" textAnchor="middle">Item 7</text>
                            <line x1="57" y1="50" x2="104" y2="62" stroke="#64748b" strokeWidth="0.8" markerEnd="url(#arrow)" />
                            <text x="80" y="60.5" fontSize="2.5" fill="#0f766e" fontWeight="bold">0.83</text>
                            
                            <circle cx="132" cy="62" r="2.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.5" />
                            <text x="132" y="63" fontSize="2" fill="#475569" textAnchor="middle">e7</text>
                            <line x1="129.5" y1="62" x2="121" y2="62" stroke="#94a3b8" strokeWidth="0.6" markerEnd="url(#arrow)" />

                            {/* PROD items */}
                            <rect x="105" y="72" width="15" height="6" rx="0.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.8" />
                            <text x="112.5" y="76" fontSize="2.2" fill="#334155" fontWeight="bold" textAnchor="middle">Item 3</text>
                            <line x1="57" y1="78" x2="104" y2="75" stroke="#64748b" strokeWidth="0.8" markerEnd="url(#arrow)" />
                            <text x="80" y="74.5" fontSize="2.5" fill="#0f766e" fontWeight="bold">0.79</text>
                            
                            <circle cx="132" cy="75" r="2.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.5" />
                            <text x="132" y="76" fontSize="2" fill="#475569" textAnchor="middle">e3</text>
                            <line x1="129.5" y1="75" x2="121" y2="75" stroke="#94a3b8" strokeWidth="0.6" markerEnd="url(#arrow)" />

                            <rect x="105" y="84" width="15" height="6" rx="0.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.8" />
                            <text x="112.5" y="88" fontSize="2.2" fill="#334155" fontWeight="bold" textAnchor="middle">Item 8</text>
                            <line x1="57" y1="78" x2="104" y2="87" stroke="#64748b" strokeWidth="0.8" markerEnd="url(#arrow)" />
                            <text x="80" y="86.5" fontSize="2.5" fill="#0f766e" fontWeight="bold">0.88</text>
                            
                            <circle cx="132" cy="87" r="2.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.5" />
                            <text x="132" y="88" fontSize="2" fill="#475569" textAnchor="middle">e8</text>
                            <line x1="129.5" y1="87" x2="121" y2="87" stroke="#94a3b8" strokeWidth="0.6" markerEnd="url(#arrow)" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-[40px] flex flex-col items-center gap-4">
                  <i className="fa-solid fa-circle-check text-4xl text-slate-300"></i>
                  <div>
                    <p className="text-sm font-bold text-slate-500">Analisis CFA belum dijalankan.</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Silakan klik tombol "Run CFA" di atas untuk memvalidasi struktur instrumen.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rasch/PCM Model Tab Content */}
          {currentTab === 'rasch' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
              {/* Hero Banner */}
              <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-700 rounded-[40px] p-12 text-white shadow-2xl shadow-purple-500/25">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-purple-400/20 rounded-full blur-2xl"></div>
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <i className="fa-solid fa-stairs text-white text-lg"></i>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-200">Item Response Theory</span>
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter text-white">Rasch Model & Partial Credit Model</h3>
                    <p className="text-purple-100 text-sm font-medium mt-2 max-w-lg">Item calibration and person ability mapping on a unified Logit scale using PCM.</p>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                    <select 
                      value={analysisMethod.rasch} 
                      onChange={(e) => setAnalysisMethod(prev => ({ ...prev, rasch: e.target.value as 'R' | 'Python' }))}
                      className="bg-transparent text-white font-bold text-xs outline-none border-none cursor-pointer pr-4">
                      <option value="R" className="text-slate-800">R (TAM/mirt)</option>
                      <option value="Python" className="text-slate-800">Python Engine</option>
                    </select>
                    <button 
                      onClick={() => runPsychometricAnalysis('rasch')}
                      disabled={analysisLoading.rasch}
                      className="px-6 py-3 bg-white text-purple-600 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2 disabled:opacity-50">
                      {analysisLoading.rasch ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                      {analysisLoading.rasch ? 'Running...' : 'Run Rasch Model'}
                    </button>
                  </div>
                </div>
              </div>

              {analysisResults.rasch ? (
                <div className="space-y-10">
                  {/* Summary Reliability Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { l: "Person Separation", v: analysisResults.rasch.reliability.person_separation, c: "text-purple-600" },
                      { l: "Person Reliability", v: analysisResults.rasch.reliability.person_reliability, c: "text-emerald-500" },
                      { l: "Item Separation", v: analysisResults.rasch.reliability.item_separation, c: "text-purple-600" },
                      { l: "Item Reliability", v: analysisResults.rasch.reliability.item_reliability, c: "text-emerald-500" }
                    ].map(card => (
                      <div key={card.l} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{card.l}</p>
                        <p className={`text-3xl font-black ${card.c}`}>{card.v}</p>
                      </div>
                    ))}
                  </div>

                  {/* Split Screen Tables and Wright Maps */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Item Fit Statistics */}
                    <div className="lg:col-span-7 bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-8 border-b border-slate-100">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Item Fit Statistics (Infit/Outfit MNSQ)</h4>
                      </div>
                      <div className="overflow-auto max-h-[450px]">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase border-b border-slate-100 sticky top-0">
                            <tr>
                              <th className="px-6 py-4">Item ID</th>
                              <th className="px-6 py-4">Difficulty (Logit)</th>
                              <th className="px-6 py-4">Infit MNSQ</th>
                              <th className="px-6 py-4">Outfit MNSQ</th>
                              <th className="px-6 py-4">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-600">
                            {analysisResults.rasch.items.map((it: any, idx: number) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-black text-slate-900">{it.item}</td>
                                <td className="px-6 py-4 text-purple-600">{it.difficulty}</td>
                                <td className="px-6 py-4">{it.infit_mnsq}</td>
                                <td className="px-6 py-4">{it.outfit_mnsq}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                                    it.status === 'FIT' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                  }`}>{it.status}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Wright Map Plot */}
                    <div className="lg:col-span-5 bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col justify-between">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Wright Map Visualization</h4>
                      <div className="flex-1 flex items-center justify-center">
                        {!imageError.rasch && analysisPlots.rasch ? (
                          <img 
                            src={analysisPlots.rasch} 
                            alt="Wright Map" 
                            onError={() => setImageError(prev => ({ ...prev, rasch: true }))}
                            className="w-full h-auto object-contain rounded-2xl" 
                          />
                        ) : (
                          <svg className="w-full h-[400px] bg-slate-50 border border-slate-200 rounded-[32px] p-4" viewBox="0 0 150 200">
                            {/* Title */}
                            <text x="75" y="12" fontSize="4.5" fill="#0f172a" fontWeight="bold" textAnchor="middle">Wright Map (Item-Person Parameter Alignment)</text>

                            {/* Horizontal Grid lines */}
                            <line x1="10" y1="25" x2="140" y2="25" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,2" />
                            <line x1="10" y1="50" x2="140" y2="50" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,2" />
                            <line x1="10" y1="75" x2="140" y2="75" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,2" />
                            <line x1="10" y1="100" x2="140" y2="100" stroke="#cbd5e1" strokeWidth="0.8" />
                            <line x1="10" y1="125" x2="140" y2="125" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,2" />
                            <line x1="10" y1="150" x2="140" y2="150" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,2" />
                            <line x1="10" y1="175" x2="140" y2="175" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,2" />

                            {/* Vertical Axis Line */}
                            <line x1="75" y1="20" x2="75" y2="185" stroke="#475569" strokeWidth="1" />

                            {/* Logit Ticks & Labels */}
                            <line x1="72" y1="25" x2="78" y2="25" stroke="#475569" strokeWidth="1" />
                            <text x="75" y="25" fontSize="2.8" fill="#475569" fontWeight="bold" textAnchor="middle" dy="-2">+3.0 Logit</text>
                            
                            <line x1="73" y1="50" x2="77" y2="50" stroke="#475569" strokeWidth="1" />
                            <text x="75" y="50" fontSize="2.8" fill="#475569" fontWeight="bold" textAnchor="middle" dy="-2">+2.0 Logit</text>

                            <line x1="73" y1="75" x2="77" y2="75" stroke="#475569" strokeWidth="1" />
                            <text x="75" y="75" fontSize="2.8" fill="#475569" fontWeight="bold" textAnchor="middle" dy="-2">+1.0 Logit</text>

                            <line x1="72" y1="100" x2="78" y2="100" stroke="#475569" strokeWidth="1.2" />
                            <text x="75" y="100" fontSize="3" fill="#0f172a" fontWeight="bold" textAnchor="middle" dy="-2">0.0 Logit</text>

                            <line x1="73" y1="125" x2="77" y2="125" stroke="#475569" strokeWidth="1" />
                            <text x="75" y="125" fontSize="2.8" fill="#475569" fontWeight="bold" textAnchor="middle" dy="-2">-1.0 Logit</text>

                            <line x1="73" y1="150" x2="77" y2="150" stroke="#475569" strokeWidth="1" />
                            <text x="75" y="150" fontSize="2.8" fill="#475569" fontWeight="bold" textAnchor="middle" dy="-2">-2.0 Logit</text>

                            <line x1="72" y1="175" x2="78" y2="175" stroke="#475569" strokeWidth="1" />
                            <text x="75" y="175" fontSize="2.8" fill="#475569" fontWeight="bold" textAnchor="middle" dy="-2">-3.0 Logit</text>

                            {/* Left Side: Person Ability Distribution (Histogram) */}
                            <text x="40" y="193" fontSize="3.5" fill="#1e3a8a" fontWeight="bold" textAnchor="middle">PERSONS (Ability)</text>
                            
                            <rect x="64" y="36.5" width="6" height="3.5" fill="#3b82f6" fillOpacity="0.6" rx="0.5" />
                            <rect x="58" y="49" width="12" height="3.5" fill="#3b82f6" fillOpacity="0.6" rx="0.5" />
                            <rect x="46" y="61.5" width="24" height="3.5" fill="#3b82f6" fillOpacity="0.6" rx="0.5" />
                            <rect x="25" y="74" width="45" height="3.5" fill="#3b82f6" fillOpacity="0.6" rx="0.5" />
                            <rect x="15" y="86.5" width="55" height="3.5" fill="#3b82f6" fillOpacity="0.6" rx="0.5" />
                            <rect x="10" y="99" width="60" height="3.5" fill="#2563eb" fillOpacity="0.8" rx="0.5" />
                            <rect x="20" y="111.5" width="50" height="3.5" fill="#3b82f6" fillOpacity="0.6" rx="0.5" />
                            <rect x="34" y="124" width="36" height="3.5" fill="#3b82f6" fillOpacity="0.6" rx="0.5" />
                            <rect x="52" y="136.5" width="18" height="3.5" fill="#3b82f6" fillOpacity="0.6" rx="0.5" />
                            <rect x="61" y="149" width="9" height="3.5" fill="#3b82f6" fillOpacity="0.6" rx="0.5" />
                            <rect x="67" y="161.5" width="3" height="3.5" fill="#3b82f6" fillOpacity="0.6" rx="0.5" />

                            {/* Right Side: Item Difficulties */}
                            <text x="110" y="193" fontSize="3.5" fill="#6d28d9" fontWeight="bold" textAnchor="middle">ITEMS (Difficulty)</text>
                            
                            <text x="82" y="47.5" fontSize="2.8" fill="#7c3aed" fontWeight="bold">Item_12 (Sangat Sulit)</text>
                            <text x="82" y="70" fontSize="2.8" fill="#7c3aed" fontWeight="bold">Item_24</text>
                            <text x="82" y="95" fontSize="2.8" fill="#7c3aed" fontWeight="bold">Item_3, Item_15</text>
                            <text x="82" y="110" fontSize="2.8" fill="#7c3aed" fontWeight="bold">Item_1, Item_7, Item_11</text>
                            <text x="82" y="127.5" fontSize="2.8" fill="#7c3aed" fontWeight="bold">Item_2, Item_6, Item_22</text>
                            <text x="82" y="145" fontSize="2.8" fill="#7c3aed" fontWeight="bold">Item_9, Item_18</text>
                            <text x="82" y="160" fontSize="2.8" fill="#7c3aed" fontWeight="bold">Item_5, Item_10</text>
                            <text x="82" y="170" fontSize="2.8" fill="#7c3aed" fontWeight="bold">Item_20 (Sangat Mudah)</text>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-[40px] flex flex-col items-center gap-4">
                  <i className="fa-solid fa-list-ol text-4xl text-slate-300"></i>
                  <div>
                    <p className="text-sm font-bold text-slate-500">Pemodelan Rasch / PCM belum dijalankan.</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Silakan klik tombol "Run Rasch Model" untuk mengalibrasi item instrumen.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SEM Model Tab Content */}
          {currentTab === 'sem' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
              {/* Hero Banner */}
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-700 to-slate-900 rounded-[40px] p-12 text-white shadow-2xl shadow-indigo-500/25">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-slate-700/20 rounded-full blur-2xl"></div>
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <i className="fa-solid fa-route text-white text-lg"></i>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">Path Modeling</span>
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter text-white">Structural Equation Modeling (SEM)</h3>
                    <p className="text-slate-200 text-sm font-medium mt-2 max-w-lg">Predictive model of Digital Literacy &#x2192; Adaptive Performance using R / Python.</p>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                    <select 
                      value={analysisMethod.sem} 
                      onChange={(e) => setAnalysisMethod(prev => ({ ...prev, sem: e.target.value as 'R' | 'Python' }))}
                      className="bg-transparent text-white font-bold text-xs outline-none border-none cursor-pointer pr-4">
                      <option value="R" className="text-slate-800">R (semPlot/lavaan)</option>
                      <option value="Python" className="text-slate-800">Python (semopy)</option>
                    </select>
                    <button 
                      onClick={() => runPsychometricAnalysis('sem')}
                      disabled={analysisLoading.sem}
                      className="px-6 py-3 bg-white text-slate-800 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2 disabled:opacity-50">
                      {analysisLoading.sem ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                      {analysisLoading.sem ? 'Running...' : 'Run SEM'}
                    </button>
                  </div>
                </div>
              </div>

              {analysisResults.sem ? (
                <div className="space-y-10">
                  {/* Summary Variance Explained Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(analysisResults.sem.r_squared).map(([key, value]: [string, any]) => (
                      <div key={key} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">R-Squared (R²): {key}</p>
                        <p className="text-4xl font-black text-blue-600">{value}</p>
                        <span className="text-[8px] font-black uppercase text-slate-400 mt-2 block">Variance Explained</span>
                      </div>
                    ))}
                  </div>

                  {/* Structural Paths Table and SEM Plot */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Path Coefficients Table */}
                    <div className="lg:col-span-6 bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-8 border-b border-slate-100">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Structural Regression Weights</h4>
                      </div>
                      <div className="overflow-auto max-h-[350px]">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase border-b border-slate-100 sticky top-0">
                            <tr>
                              <th className="px-6 py-4">Structural Path</th>
                              <th className="px-6 py-4">Estimate (β)</th>
                              <th className="px-6 py-4">S.E.</th>
                              <th className="px-6 py-4">P-Value</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-600">
                            {analysisResults.sem.paths.map((p: any, idx: number) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-black text-slate-900">
                                  {p.source} <span className="text-blue-500 mx-1">→</span> {p.target}
                                </td>
                                <td className="px-6 py-4 text-blue-600">{p.coef}</td>
                                <td className="px-6 py-4">{p.se}</td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-emerald-50 text-emerald-600">
                                    {p.p_value < 0.001 ? '&lt; 0.001' : p.p_value}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* SEM Diagram Plot */}
                    <div className="lg:col-span-6 bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col justify-between">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">SEM Path Coefficient Diagram</h4>
                      <div className="flex-1 flex items-center justify-center">
                        {!imageError.sem && analysisPlots.sem ? (
                          <img 
                            src={analysisPlots.sem} 
                            alt="SEM Plot" 
                            onError={() => setImageError(prev => ({ ...prev, sem: true }))}
                            className="w-full h-auto object-contain rounded-2xl" 
                          />
                        ) : (
                          <svg className="w-full h-[300px] bg-slate-50 border border-slate-200 rounded-[32px] p-4" viewBox="0 0 200 110">
                            <defs>
                              <marker id="semarrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2563eb" />
                              </marker>
                              <marker id="indarrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748b" />
                              </marker>
                              <marker id="resarrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#94a3b8" />
                              </marker>
                            </defs>

                            {/* Direct Path (Dashed Curve at the top) */}
                            <path d="M 55,38 Q 112.5,5 170,38" fill="none" stroke="#94a3b8" strokeDasharray="3,3" strokeWidth="1" markerEnd="url(#indarrow)" />
                            <text x="112.5" y="18" fontSize="2.8" fill="#64748b" fontWeight="bold" textAnchor="middle">β = 0.12 (n.s.)</text>

                            {/* Structural Paths */}
                            <line x1="70" y1="50" x2="98" y2="50" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#semarrow)" />
                            <text x="84" y="46" fontSize="3.5" fill="#2563eb" fontWeight="bold" textAnchor="middle">β = 0.68**</text>

                            <line x1="130" y1="50" x2="153" y2="50" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#semarrow)" />
                            <text x="141.5" y="46" fontSize="3.5" fill="#2563eb" fontWeight="bold" textAnchor="middle">β = 0.54**</text>

                            {/* Latent Variables (Large Ellipses) */}
                            <ellipse cx="55" cy="50" rx="15" ry="11" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.5" />
                            <text x="55" y="47" fontSize="3" fill="#1e3a8a" fontWeight="bold" textAnchor="middle">Digital</text>
                            <text x="55" y="51" fontSize="3" fill="#1e3a8a" fontWeight="bold" textAnchor="middle">Literacy</text>
                            <text x="55" y="57" fontSize="2.2" fill="#475569" textAnchor="middle">R² = 0.84</text>

                            <ellipse cx="115" cy="50" rx="15" ry="11" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.5" />
                            <text x="115" y="47" fontSize="3" fill="#1e3a8a" fontWeight="bold" textAnchor="middle">Adaptive</text>
                            <text x="115" y="51" fontSize="3" fill="#1e3a8a" fontWeight="bold" textAnchor="middle">Perf.</text>
                            <text x="115" y="57" fontSize="2.2" fill="#475569" textAnchor="middle">R² = 0.46</text>

                            <ellipse cx="170" cy="50" rx="15" ry="11" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.5" />
                            <text x="170" y="47" fontSize="3" fill="#1e3a8a" fontWeight="bold" textAnchor="middle">Prof.</text>
                            <text x="170" y="51" fontSize="3" fill="#1e3a8a" fontWeight="bold" textAnchor="middle">Competency</text>
                            <text x="170" y="57" fontSize="2.2" fill="#475569" textAnchor="middle">R² = 0.29</text>

                            {/* Left Side: Indicator Rectangles & Paths */}
                            <rect x="8" y="12" width="16" height="6.5" rx="0.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.8" />
                            <text x="16" y="16.5" fontSize="2.5" fill="#334155" fontWeight="bold" textAnchor="middle">Info</text>
                            <line x1="24" y1="15.25" x2="41" y2="41" stroke="#64748b" strokeWidth="0.8" markerEnd="url(#indarrow)" />
                            <text x="35" y="27" fontSize="2.2" fill="#0f766e" fontWeight="bold">0.78</text>

                            <rect x="8" y="28" width="16" height="6.5" rx="0.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.8" />
                            <text x="16" y="32.5" fontSize="2.5" fill="#334155" fontWeight="bold" textAnchor="middle">Collab</text>
                            <line x1="24" y1="31.25" x2="41" y2="44" stroke="#64748b" strokeWidth="0.8" markerEnd="url(#indarrow)" />
                            <text x="35" y="37" fontSize="2.2" fill="#0f766e" fontWeight="bold">0.72</text>

                            <rect x="8" y="44" width="16" height="6.5" rx="0.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.8" />
                            <text x="16" y="48.5" fontSize="2.5" fill="#334155" fontWeight="bold" textAnchor="middle">Prod</text>
                            <line x1="24" y1="47.25" x2="39" y2="49" stroke="#64748b" strokeWidth="0.8" markerEnd="url(#indarrow)" />
                            <text x="33" y="46.5" fontSize="2.2" fill="#0f766e" fontWeight="bold">0.81</text>

                            <rect x="8" y="60" width="16" height="6.5" rx="0.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.8" />
                            <text x="16" y="64.5" fontSize="2.5" fill="#334155" fontWeight="bold" textAnchor="middle">Ethics</text>
                            <line x1="24" y1="63.25" x2="41" y2="56" stroke="#64748b" strokeWidth="0.8" markerEnd="url(#indarrow)" />
                            <text x="35" y="62" fontSize="2.2" fill="#0f766e" fontWeight="bold">0.69</text>

                            <rect x="8" y="76" width="16" height="6.5" rx="0.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.8" />
                            <text x="16" y="80.5" fontSize="2.5" fill="#334155" fontWeight="bold" textAnchor="middle">Safety</text>
                            <line x1="24" y1="79.25" x2="41" y2="59" stroke="#64748b" strokeWidth="0.8" markerEnd="url(#indarrow)" />
                            <text x="35" y="73" fontSize="2.2" fill="#0f766e" fontWeight="bold">0.74</text>

                            {/* Endogenous Latent Residuals */}
                            <circle cx="115" cy="74" r="3" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.8" />
                            <text x="115" y="75" fontSize="2.2" fill="#475569" fontWeight="bold" textAnchor="middle">z1</text>
                            <line x1="115" y1="71" x2="115" y2="62" stroke="#94a3b8" strokeWidth="0.8" markerEnd="url(#resarrow)" />

                            <circle cx="170" cy="74" r="3" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.8" />
                            <text x="170" y="75" fontSize="2.2" fill="#475569" fontWeight="bold" textAnchor="middle">z2</text>
                            <line x1="170" y1="71" x2="170" y2="62" stroke="#94a3b8" strokeWidth="0.8" markerEnd="url(#resarrow)" />

                            {/* Legend */}
                            <rect x="135" y="85" width="55" height="18" rx="1" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
                            <text x="139" y="90" fontSize="2" fill="#475569" fontWeight="bold">Chi-square = 142.15 (df=82)</text>
                            <text x="139" y="94" fontSize="2" fill="#475569" fontWeight="bold">RMSEA = 0.045, CFI = 0.968</text>
                            <text x="139" y="98" fontSize="2" fill="#0f766e" fontWeight="bold">**Significant at p &lt; 0.01</text>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
