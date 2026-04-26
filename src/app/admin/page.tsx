"use client";

import { useState } from "react";
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
  const [currentTab, setCurrentTab] = useState("settings");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Chart Data Configurations
  const cfaData = {
    labels: ['Information', 'Creation', 'Pedagogy', 'Ethics'],
    datasets: [{
      label: 'Standard Score',
      data: [4.2, 3.8, 4.5, 4.0],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
    }]
  };

  const susDistData = {
    labels: ['0-50', '51-60', '61-70', '71-80', '81-90', '91-100'],
    datasets: [{
      label: 'Users',
      data: [2, 5, 12, 28, 65, 30],
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      borderColor: '#3b82f6',
      borderWidth: 1
    }]
  };

  const susPieData = {
    labels: ['Excellent', 'Good', 'Fair', 'Poor'],
    datasets: [{
      data: [70, 20, 8, 2],
      backgroundColor: [
        'rgba(34, 197, 94, 0.7)',
        'rgba(59, 130, 246, 0.7)',
        'rgba(234, 179, 8, 0.7)',
        'rgba(239, 68, 68, 0.7)'
      ],
      borderWidth: 0
    }]
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100" 
         style={{ backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('/admin_bg_v1.png')", backgroundSize: 'cover' }}>
      
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 glass-panel border-r border-slate-700/50 flex flex-col z-20 bg-slate-900/60 backdrop-blur-2xl">
        <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
          <i className="fa-solid fa-microchip text-blue-400 text-2xl mr-3"></i>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">HDAP Admin</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {[
            { id: 'preliminary', icon: 'fa-stethoscope', label: 'Preliminary Analysis' },
            { id: 'madel5c', icon: 'fa-vial-circle-check', label: 'MADEL5C Analysis' },
            { id: 'instruments', icon: 'fa-file-code', label: 'Instrument Manager' },
            { id: 'participants', icon: 'fa-users', label: 'Participants Data' },
            { id: 'usability', icon: 'fa-face-smile', label: 'User Experience (SUS)' },
            { id: 'settings', icon: 'fa-cog', label: 'System Settings' }
          ].map((tab) => (
            <button key={tab.id}
                    onClick={() => setCurrentTab(tab.id)} 
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${currentTab === tab.id ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-400' : 'text-slate-400 hover:bg-slate-800/50'}`}>
              <i className={`fa-solid ${tab.icon} w-6`}></i>
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold">A</div>
            <div>
              <p className="text-xs font-bold">Admin Pusat</p>
              <p className="text-[10px] text-slate-500 uppercase">Infrastructure</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-8 glass-panel border-b border-slate-700/50 z-10 bg-slate-900/40">
          <h2 className="text-xl font-bold uppercase tracking-tight">{currentTab.replace('_', ' ')}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-300">SERVER ONLINE</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            {currentTab === 'settings' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-panel rounded-3xl p-8 bg-indigo-500/5 border-indigo-500/20">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-4">
                    <i className="fa-solid fa-brain text-indigo-400"></i> AI Engine Config
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">API Secret Key</label>
                      <input type="password" value="sk-xxxxxxxxxxxxxxxx" readOnly className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm outline-none" />
                    </div>
                    <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20">Save Configuration</button>
                  </div>
                </div>
                {/* VPS Stats */}
                <div className="glass-panel rounded-3xl p-8 border-blue-500/20 bg-blue-500/5">
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-4"><i className="fa-solid fa-server text-blue-400"></i> VPS Monitoring</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">RAM Usage (4GB Total)</p>
                      <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden"><div className="bg-blue-500 h-full w-[30%]"></div></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'usability' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="glass-panel rounded-3xl p-8 text-center bg-blue-600/10">
                    <p className="text-sm font-bold text-blue-400 uppercase mb-4">Avg SUS Score</p>
                    <p className="text-6xl font-black">88.5</p>
                  </div>
                  {/* ... more stats ... */}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass-panel rounded-3xl p-8">
                    <h3 className="text-lg font-bold mb-6">SUS Score Distribution</h3>
                    <div className="h-64"><Bar data={susDistData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
                  </div>
                  <div className="glass-panel rounded-3xl p-8">
                    <h3 className="text-lg font-bold mb-6">Adjective Rating</h3>
                    <div className="h-64"><Doughnut data={susPieData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'madel5c' && (
              <div className="space-y-8">
                <div className="glass-panel rounded-3xl p-8 bg-indigo-600/5 border-indigo-500/20">
                  <h3 className="text-xl font-bold mb-6">Structural Validity (CFA)</h3>
                  <div className="h-80"><Radar data={cfaData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
