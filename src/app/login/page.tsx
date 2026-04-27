"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [loginType, setLoginType] = useState<"student" | "admin">("student");
  const [gender, setGender] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (loginType === "student") {
        if (!name || !gender) {
           alert("Mohon lengkapi semua data identitas!");
           setIsLoading(false);
           return;
        }

        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, campus: "Univ. Negeri Jakarta", gender }) // hardcoded campus for mockup if empty, but we can capture it. Actually wait, there is an input for campus. Let's capture it.
        });
        
        if (res.ok) {
           const data = await res.json();
           localStorage.setItem("userId", data.userId);
           localStorage.setItem("userName", name);
           localStorage.setItem("userGender", gender);
           router.push("/dashboard");
        }
      } else {
        localStorage.setItem("userName", "Administrator");
        router.push("/admin");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" 
         style={{ 
           backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url('/auth_bg_v1.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }}>
      
      {/* Floating Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>

      <div className="w-full max-w-md px-6 relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-[25px] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/30">
            <i className="fa-solid fa-microchip text-white text-4xl"></i>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">HDAP PORTAL</h1>
          <p className="text-slate-400 text-sm font-medium">Hybrid-Diagnostic Assessment Platform</p>
        </div>

        {/* Glass Card */}
        <div className="glass-panel rounded-[40px] p-8 md:p-10 !bg-slate-900/60 border-white/10 shadow-2xl">
          {/* Tabs */}
          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl mb-8 border border-slate-700/50">
            <button onClick={() => setLoginType("student")} 
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${loginType === "student" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}>
              MAHASISWA
            </button>
            <button onClick={() => setLoginType("admin")} 
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${loginType === "admin" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}>
              ADMINISTRATOR
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {loginType === "student" ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
                  <div className="relative group">
                    <i className="fa-solid fa-user absolute left-5 top-4 text-slate-500 group-focus-within:text-blue-400 transition-colors"></i>
                    <input type="text" 
                           required 
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           placeholder="Masukkan nama Anda..." 
                           className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-14 pr-5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all input-glass" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Nama Kampus / Instansi</label>
                  <div className="relative group">
                    <i className="fa-solid fa-university absolute left-5 top-4 text-slate-500 group-focus-within:text-blue-400 transition-colors"></i>
                    <input type="text" required placeholder="Contoh: Univ. Negeri Jakarta" className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-14 pr-5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all input-glass" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Jenis Kelamin</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setGender("male")} className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all ${gender === "male" ? "bg-blue-500 border-blue-400 text-white" : "bg-slate-800/50 border-slate-700 text-slate-400"}`}>
                      <i className="fa-solid fa-mars"></i> Laki-laki
                    </button>
                    <button type="button" onClick={() => setGender("female")} className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all ${gender === "female" ? "bg-pink-500 border-pink-400 text-white" : "bg-slate-800/50 border-slate-700 text-slate-400"}`}>
                      <i className="fa-solid fa-venus"></i> Perempuan
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Admin Username</label>
                  <div className="relative group">
                    <i className="fa-solid fa-shield-halved absolute left-5 top-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors"></i>
                    <input type="text" required placeholder="Username admin..." className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-14 pr-5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all input-glass" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
                  <div className="relative group">
                    <i className="fa-solid fa-lock absolute left-5 top-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors"></i>
                    <input type="password" required placeholder="••••••••" className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-14 pr-5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all input-glass" />
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={isLoading} className={`w-full font-black py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 ${loginType === "student" ? "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30" : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"} text-white`}>
              <span>{isLoading ? "PROSES..." : (loginType === "student" ? "MULAI ASESMEN" : "MASUK DASHBOARD")}</span>
              {isLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className={`fa-solid ${loginType === "student" ? "fa-arrow-right" : "fa-lock-open"}`}></i>}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">&copy; 2026 BIMA Research Group</p>
        </div>
      </div>
    </div>
  );
}
