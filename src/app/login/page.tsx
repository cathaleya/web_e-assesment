"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [campus, setCampus] = useState("");
  const [loginType, setLoginType] = useState<"student" | "admin">("student");
  const [gender, setGender] = useState<string>("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (loginType === "student") {
        if (!name || !gender || !campus) {
           setError("Mohon lengkapi semua data identitas (Nama, Kampus, dan Jenis Kelamin)!");
           setIsLoading(false);
           return;
        }

        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, campus, gender })
        });
        
        if (res.ok) {
           const data = await res.json();
           if (!data.userId) {
             setError("Gagal mendaftarkan sesi. Coba lagi.");
             setIsLoading(false);
             return;
           }
           localStorage.setItem("userId", data.userId);
           localStorage.setItem("userName", name);
           localStorage.setItem("userGender", gender);
           localStorage.setItem("userCampus", campus);
           router.push("/dashboard");
        } else {
          const errData = await res.json().catch(() => ({}));
          setError(errData.error || "Gagal terhubung ke server. Periksa koneksi.");
          setIsLoading(false);
        }
      } else {
        if (!adminUsername || !adminPassword) {
          setError("Masukkan username dan password admin.");
          setIsLoading(false);
          return;
        }
        const res = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: adminUsername, password: adminPassword })
        });
        if (res.ok) {
          localStorage.setItem("userName", "Administrator");
          localStorage.setItem("isAdmin", "true");
          router.push("/admin");
        } else {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Akses ditolak. Periksa username dan password.");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan jaringan. Pastikan server berjalan.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50"
         style={{ 
           backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url('/unj_bg.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>

      <div className="w-full max-w-lg px-6 relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-white rounded-[35px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-900/5 border border-slate-100">
            <i className="fa-solid fa-microchip text-blue-600 text-5xl"></i>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">HDAP Portal</h1>
          <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] mt-2">Hybrid-Diagnostic Assessment Platform</p>
        </div>

        {/* Form Card (Bright Theme) */}
        <div className="bg-white rounded-[60px] p-10 lg:p-14 shadow-2xl shadow-slate-900/10 border border-slate-100">
          {/* Tabs */}
          <div className="flex bg-slate-100 p-2 rounded-3xl mb-10 border border-slate-200/50">
            <button onClick={() => setLoginType("student")} 
                    className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-500 ${loginType === "student" ? "bg-white text-blue-600 shadow-xl" : "text-slate-400 hover:text-slate-600"}`}>
              MAHASISWA
            </button>
            <button onClick={() => setLoginType("admin")} 
                    className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-500 ${loginType === "admin" ? "bg-white text-indigo-600 shadow-xl" : "text-slate-400 hover:text-slate-600"}`}>
              ADMINISTRATOR
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {loginType === "student" ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Identitas Lengkap</label>
                  <div className="space-y-4">
                    <div className="relative group">
                      <i className="fa-solid fa-user absolute left-6 top-5 text-slate-300 group-focus-within:text-blue-500 transition-colors"></i>
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Lengkap Anda..." className="w-full bg-slate-50 border border-slate-200 rounded-3xl py-5 pl-16 pr-6 text-sm text-slate-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" />
                    </div>
                    <div className="relative group">
                      <i className="fa-solid fa-university absolute left-6 top-5 text-slate-300 group-focus-within:text-blue-500 transition-colors"></i>
                      <input type="text" required value={campus} onChange={e => setCampus(e.target.value)} placeholder="Nama Kampus / Instansi..." className="w-full bg-slate-50 border border-slate-200 rounded-3xl py-5 pl-16 pr-6 text-sm text-slate-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Jenis Kelamin</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setGender("male")} className={`flex items-center justify-center gap-3 py-4 rounded-2xl border-2 text-xs font-black transition-all ${gender === "male" ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20" : "bg-white border-slate-100 text-slate-400 hover:border-blue-200"}`}>
                      <i className="fa-solid fa-mars"></i> LAKI-LAKI
                    </button>
                    <button type="button" onClick={() => setGender("female")} className={`flex items-center justify-center gap-3 py-4 rounded-2xl border-2 text-xs font-black transition-all ${gender === "female" ? "bg-pink-500 border-pink-500 text-white shadow-xl shadow-pink-500/20" : "bg-white border-slate-100 text-slate-400 hover:border-pink-200"}`}>
                      <i className="fa-solid fa-venus"></i> PEREMPUAN
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-4">
                  <div className="relative group">
                    <i className="fa-solid fa-shield-halved absolute left-6 top-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors"></i>
                    <input type="text" required value={adminUsername} onChange={e => setAdminUsername(e.target.value)} placeholder="Admin Username" className="w-full bg-slate-50 border border-slate-200 rounded-3xl py-5 pl-16 pr-6 text-sm text-slate-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" />
                  </div>
                  <div className="relative group">
                    <i className="fa-solid fa-lock absolute left-6 top-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors"></i>
                    <input type="password" required value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-3xl py-5 pl-16 pr-6 text-sm text-slate-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" />
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={isLoading} className={`w-full font-black py-6 rounded-[30px] transition-all shadow-2xl flex items-center justify-center gap-4 ${loginType === "student" ? "bg-slate-900 hover:bg-black shadow-slate-900/20" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"} text-white uppercase tracking-widest text-xs`}>
              <span>{isLoading ? "MEMPROSES DATA..." : (loginType === "student" ? "MULAI PENGERJAAN" : "LOGIN ADMINISTRATOR")}</span>
              {isLoading ? <i className="fa-solid fa-circle-notch fa-spin text-lg"></i> : <i className={`fa-solid ${loginType === "student" ? "fa-arrow-right" : "fa-lock-open"} text-lg`}></i>}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-5 text-xs text-red-600 font-bold text-center animate-bounce">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>{error}
              </div>
            )}
          </form>
        </div>

        {/* Bottom Credits */}
        <div className="text-center mt-12">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.5em]">&copy; 2026 Riset Disertasi BIMA S3 UNJ</p>
        </div>
      </div>
    </div>
  );
}
