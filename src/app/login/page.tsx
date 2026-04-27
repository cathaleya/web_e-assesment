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

  const armyGreen = "#4B5320";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (loginType === "student") {
        if (!name || !gender || !campus) {
           setError("Mohon lengkapi semua data identitas!");
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
           localStorage.setItem("userId", data.userId);
           localStorage.setItem("userName", name);
           localStorage.setItem("userGender", gender);
           localStorage.setItem("userCampus", campus);
           router.push("/dashboard");
        } else {
          const errData = await res.json().catch(() => ({}));
          setError(errData.error || "Gagal terhubung ke server.");
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
          setError(data.error || "Akses ditolak.");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan jaringan.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
         style={{ 
           backgroundImage: "url('/unj_bg.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      
      <div className="w-full max-w-md px-4 sm:px-6 relative z-10 py-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border-4 border-[#4B5320]/10">
            <i className="fa-solid fa-graduation-cap text-[#4B5320] text-3xl sm:text-4xl"></i>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#4B5320] tracking-tighter uppercase italic leading-none drop-shadow-[0_2px_10px_rgba(255,255,255,1)]">HDAP Portal</h1>
          <p className="text-[#4B5320]/70 text-[9px] font-black uppercase tracking-[0.4em] mt-2 drop-shadow-[0_2px_5px_rgba(255,255,255,1)]">S3 UNJ Dissertation Research</p>
        </div>

        <div className="bg-white/95 backdrop-blur-2xl rounded-[40px] p-6 sm:p-10 shadow-2xl border-4 border-white">
          <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-8 border border-slate-100">
            <button onClick={() => setLoginType("student")} 
                    className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${loginType === "student" ? "bg-[#4B5320] text-white shadow-lg" : "text-[#4B5320]/40"}`}>
              RESPONDEN
            </button>
            <button onClick={() => setLoginType("admin")} 
                    className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${loginType === "admin" ? "bg-[#4B5320] text-white shadow-lg" : "text-[#4B5320]/40"}`}>
              ADMIN
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {loginType === "student" ? (
              <div className="space-y-4">
                <div className="relative">
                  <i className="fa-solid fa-user absolute left-5 top-4 text-[#4B5320]/30 text-sm"></i>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Lengkap" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-[#4B5320] font-bold focus:border-[#4B5320] outline-none transition-all" />
                </div>
                <div className="relative">
                  <i className="fa-solid fa-university absolute left-5 top-4 text-[#4B5320]/30 text-sm"></i>
                  <input type="text" required value={campus} onChange={e => setCampus(e.target.value)} placeholder="Kampus / Instansi" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-[#4B5320] font-bold focus:border-[#4B5320] outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setGender("male")} className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 text-[10px] font-black transition-all ${gender === "male" ? "bg-[#4B5320] border-[#4B5320] text-white shadow-md" : "bg-white border-slate-100 text-[#4B5320]/40"}`}>
                    <i className="fa-solid fa-mars"></i> LAKI-LAKI
                  </button>
                  <button type="button" onClick={() => setGender("female")} className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 text-[10px] font-black transition-all ${gender === "female" ? "bg-[#4B5320] border-[#4B5320] text-white shadow-md" : "bg-white border-slate-100 text-[#4B5320]/40"}`}>
                    <i className="fa-solid fa-venus"></i> PEREMPUAN
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <i className="fa-solid fa-shield-halved absolute left-5 top-4 text-[#4B5320]/30 text-sm"></i>
                  <input type="text" required value={adminUsername} onChange={e => setAdminUsername(e.target.value)} placeholder="Username" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-[#4B5320] font-bold focus:border-[#4B5320] outline-none transition-all" />
                </div>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-5 top-4 text-[#4B5320]/30 text-sm"></i>
                  <input type="password" required value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Password" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-[#4B5320] font-bold focus:border-[#4B5320] outline-none transition-all" />
                </div>
              </div>
            )}

            {error && <div className="p-3 bg-red-50 text-red-500 text-[10px] font-bold rounded-xl border border-red-100 text-center">{error}</div>}

            <button type="submit" disabled={isLoading} className="w-full font-black py-5 rounded-2xl bg-[#4B5320] hover:bg-[#354B37] text-white shadow-xl transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-3">
              <span>{isLoading ? "MEMPROSES..." : "MASUK KE DASHBOARD"}</span>
              <i className="fa-solid fa-arrow-right-to-bracket text-xs"></i>
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-[#4B5320] text-[8px] font-black uppercase tracking-[0.4em] drop-shadow-[0_2px_5px_rgba(255,255,255,1)]">&copy; 2026 Riset Disertasi BIMA UNJ</p>
        </div>
      </div>
    </div>
  );
}
