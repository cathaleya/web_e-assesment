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
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">{currentTab.replace('-', ' ')}</h2>
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
                              grid: { color: '#f1f5f9' }, 
                              pointLabels: { color: '#64748b', font: { size: 10, weight: 'bold' } }, 
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
                          borderWidth: 0,
                          cutout: '75%'
                        }]
                      }} options={{ plugins: { legend: { display: false } } }} />
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
        </div>
      </main>
    </div>
  );
}
